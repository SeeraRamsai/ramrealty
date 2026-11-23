import { createHash, timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";

const STORE_NAME = "site-visit-bookings";
const KEY_PREFIX = "booking-";
const TIME_SLOTS = {
  "09:00-11:00": ["09:00", "11:00"],
  "11:00-13:00": ["11:00", "13:00"],
  "13:00-15:00": ["13:00", "15:00"],
  "15:00-17:00": ["15:00", "17:00"],
  "17:00-19:00": ["17:00", "19:00"],
};
const PROPERTIES = new Set([
  "A Square Maple Woods",
  "MVV-GV Grand",
  "Utkarsha Capital Towers",
  "Vaisakhi West Winds",
]);
const TIME_ZONE = "Asia/Kolkata";

function response(status, body, headers = {}) {
  return new Response(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

function jsonResponse(status, body) {
  return response(status, JSON.stringify(body), {
    "Content-Type": "application/json; charset=utf-8",
  });
}

function redirect(location) {
  return response(303, null, { Location: location });
}

function cleanText(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(new Date());
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value &&
    value >= today;
}

function validateBooking(fields) {
  const booking = {
    id: cleanText(fields.booking_id, 36),
    name: cleanText(fields.name, 100),
    phone: cleanText(fields.phone, 10),
    property: cleanText(fields.property, 80),
    visitDate: cleanText(fields.visit_date, 10),
    visitTime: cleanText(fields.visit_time, 11),
    notes: cleanText(fields.notes, 500),
    whatsappUpdatesConsent: fields.whatsapp_updates_consent === "yes",
    utm: Object.fromEntries(
      ["source", "medium", "campaign", "content", "term"].map((key) => [
        key,
        cleanText(fields[`utm_${key}`], 250),
      ]),
    ),
  };
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(booking.id)) {
    throw new Error("Please refresh the page and submit your booking again.");
  }
  if (booking.name.length < 2) throw new Error("Enter your name.");
  if (!/^[6-9]\d{9}$/.test(booking.phone)) throw new Error("Enter a valid 10-digit Indian mobile number.");
  if (!PROPERTIES.has(booking.property)) throw new Error("Choose one of the listed properties.");
  if (!validDate(booking.visitDate)) throw new Error("Choose today or a future visit date.");
  if (!Object.hasOwn(TIME_SLOTS, booking.visitTime)) throw new Error("Choose an available visit time.");
  if (!booking.whatsappUpdatesConsent) throw new Error("Consent to booking updates is required.");
  return booking;
}

function eventId(bookingId) {
  return `b${createHash("sha256").update(bookingId).digest("hex")}`;
}

function eventDateTime(date, time) {
  return `${date}T${time}:00+05:30`;
}

async function googleAccessToken(env, fetchImpl) {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) return null;

  const body = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    refresh_token: GOOGLE_REFRESH_TOKEN,
    grant_type: "refresh_token",
  });
  const tokenResponse = await fetchImpl("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!tokenResponse.ok) {
    throw new Error(`Google authorization failed with HTTP ${tokenResponse.status}.`);
  }
  const token = await tokenResponse.json();
  if (!token.access_token) throw new Error("Google authorization returned no access token.");
  return token.access_token;
}

async function syncCalendarEvent(booking, env, fetchImpl) {
  const accessToken = await googleAccessToken(env, fetchImpl);
  if (!accessToken) return { state: "not_configured", eventId: "" };

  const [startTime, endTime] = TIME_SLOTS[booking.visitTime];
  const calendarId = env.GOOGLE_CALENDAR_ID || "primary";
  const endpoint = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
  );
  endpoint.searchParams.set("sendUpdates", "none");
  const event = {
    id: eventId(booking.id),
    summary: `${booking.status === "tentative" ? "Tentative site visit" : "Site visit"} — ${booking.property}`,
    description: `Tentative visit request. Review the booking record in the secured Ram Realty site-visit manager. Reference: ${booking.id}.`,
    start: {
      dateTime: eventDateTime(booking.visitDate, startTime),
      timeZone: TIME_ZONE,
    },
    end: {
      dateTime: eventDateTime(booking.visitDate, endTime),
      timeZone: TIME_ZONE,
    },
    status: booking.status === "tentative" ? "tentative" : "confirmed",
    transparency: "opaque",
    visibility: "private",
    extendedProperties: { private: { ramRealtyBookingId: booking.id } },
    reminders: { useDefault: true },
  };
  const calendarResponse = await fetchImpl(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });
  if (calendarResponse.status === 409) {
    return { state: "synced", eventId: event.id };
  }
  if (!calendarResponse.ok) {
    throw new Error(`Google Calendar event creation failed with HTTP ${calendarResponse.status}.`);
  }
  return { state: "synced", eventId: event.id };
}

async function sendBookingNotification(booking, requestUrl, env, fetchImpl) {
  const siteUrl = env.URL || new URL(requestUrl).origin;
  const endpoint = new URL("/site-visit.html", siteUrl);
  const notification = await fetchImpl(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      "form-name": "site-visit-notification",
      booking_reference: booking.id,
      property: booking.property,
      visit_date: booking.visitDate,
      visit_time: booking.visitTime,
    }),
  });
  let receiptUrl;
  try {
    receiptUrl = new URL(notification.url);
  } catch {
    throw new Error("Netlify did not confirm the site-visit alert submission.");
  }
  if (!notification.ok || !notification.redirected ||
      receiptUrl.origin !== endpoint.origin ||
      receiptUrl.pathname !== endpoint.pathname ||
      receiptUrl.searchParams.get("notification") !== "received") {
    throw new Error(`Netlify did not confirm the site-visit alert submission (HTTP ${notification.status}).`);
  }
}

function authorized(request, env) {
  const expected = env.SITE_VISIT_ADMIN_TOKEN;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (!expected || !supplied) return false;
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  return expectedBuffer.length === suppliedBuffer.length &&
    timingSafeEqual(expectedBuffer, suppliedBuffer);
}

async function listBookings(store) {
  const { blobs } = await store.list({ prefix: KEY_PREFIX });
  const bookings = [];
  for (const blob of blobs) {
    const booking = await store.get(blob.key, { type: "json" });
    if (booking) bookings.push(booking);
  }
  bookings.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  return bookings;
}

async function updateCalendarStatus(booking, status, env, fetchImpl) {
  if (!booking.calendarEventId || booking.calendarSync !== "synced") {
    throw new Error("This booking has no synchronized calendar event.");
  }
  const accessToken = await googleAccessToken(env, fetchImpl);
  if (!accessToken) throw new Error("Google Calendar is not configured.");
  const calendarId = env.GOOGLE_CALENDAR_ID || "primary";
  const endpoint = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(booking.calendarEventId)}`,
  );
  const googleStatus = status === "cancelled" ? "cancelled" : "confirmed";
  const calendarResponse = await fetchImpl(endpoint, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: googleStatus,
      summary: status === "cancelled"
        ? `Cancelled site visit — ${booking.property}`
        : `Site visit — ${booking.property}`,
    }),
  });
  if (!calendarResponse.ok) {
    throw new Error(`Google Calendar update failed with HTTP ${calendarResponse.status}.`);
  }
}

async function deleteCalendarEvent(booking, env, fetchImpl) {
  if (!booking.calendarEventId) return;
  const accessToken = await googleAccessToken(env, fetchImpl);
  if (!accessToken) throw new Error("Google Calendar is not configured; the booking was not deleted.");
  const calendarId = env.GOOGLE_CALENDAR_ID || "primary";
  const endpoint = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(booking.calendarEventId)}`,
  );
  const calendarResponse = await fetchImpl(endpoint, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!calendarResponse.ok && calendarResponse.status !== 404 && calendarResponse.status !== 410) {
    throw new Error(`Google Calendar event deletion failed with HTTP ${calendarResponse.status}.`);
  }
}

export function createHandler({
  getStoreImpl = (name) => getStore(name, { consistency: "strong" }),
  fetchImpl = fetch,
  env = process.env,
  now = () => new Date(),
  logger = console,
} = {}) {
  return async (request) => {
    const url = new URL(request.url);

    if (request.method === "GET") {
      if (url.searchParams.get("health") === "1") {
        try {
          const store = getStoreImpl(STORE_NAME);
          await store.list({ prefix: "__healthcheck__" });
          return jsonResponse(200, { status: "ok" });
        } catch (error) {
          logger.error("Site-visit storage health check failed.", error);
          return jsonResponse(503, { error: "Booking storage is unavailable." });
        }
      }
      if (!authorized(request, env)) return jsonResponse(401, { error: "Admin authorization required." });
      try {
        const store = getStoreImpl(STORE_NAME);
        return jsonResponse(200, { bookings: await listBookings(store) });
      } catch (error) {
        logger.error("Site-visit bookings could not be loaded from Netlify Blobs.", error);
        return jsonResponse(503, { error: "Booking storage is unavailable." });
      }
    }

    if (request.method === "PATCH" || request.method === "DELETE") {
      if (!authorized(request, env)) return jsonResponse(401, { error: "Admin authorization required." });
      let payload;
      try {
        payload = await request.json();
      } catch {
        return jsonResponse(400, { error: "Expected a JSON booking update." });
      }
      const bookingId = cleanText(payload.bookingId, 36);
      let store;
      let booking;
      try {
        store = getStoreImpl(STORE_NAME);
        booking = await store.get(`${KEY_PREFIX}${bookingId}`, { type: "json" });
      } catch (error) {
        logger.error("Site-visit booking could not be loaded from Netlify Blobs.", error);
        return jsonResponse(503, { error: "Booking storage is unavailable." });
      }
      if (!booking) return jsonResponse(404, { error: "Booking not found." });

      try {
        if (request.method === "DELETE") {
          await deleteCalendarEvent(booking, env, fetchImpl);
          await store.delete(`${KEY_PREFIX}${booking.id}`);
          return jsonResponse(200, { deleted: true });
        }
        if (payload.action === "retry-notification" && booking.notificationStatus !== "sent") {
          await sendBookingNotification(booking, request.url, env, fetchImpl);
          booking.notificationStatus = "sent";
          booking.notificationError = "";
        } else if (payload.action === "retry-calendar") {
          const calendar = await syncCalendarEvent(booking, env, fetchImpl);
          if (calendar.state !== "synced") throw new Error("Google Calendar is not configured.");
          booking.calendarSync = calendar.state;
          booking.calendarEventId = calendar.eventId;
          booking.calendarError = "";
        } else if (payload.action === "confirm" && booking.status === "tentative") {
          await updateCalendarStatus(booking, "confirmed", env, fetchImpl);
          booking.status = "confirmed";
        } else if (payload.action === "cancel" && ["tentative", "confirmed"].includes(booking.status)) {
          await updateCalendarStatus(booking, "cancelled", env, fetchImpl);
          booking.status = "cancelled";
        } else if (payload.action === "complete" && booking.status === "confirmed") {
          booking.status = "completed";
        } else {
          return jsonResponse(409, { error: "That booking action is not allowed." });
        }
        booking.updatedAt = now().toISOString();
        await store.setJSON(`${KEY_PREFIX}${booking.id}`, booking);
        return jsonResponse(200, { booking });
      } catch (error) {
        logger.error("Site-visit booking update failed.", error);
        return jsonResponse(502, { error: error.message });
      }
    }

    if (request.method !== "POST") {
      return response(405, "Method not allowed.", { Allow: "GET, POST, PATCH, DELETE" });
    }

    let fields;
    try {
      const contentType = request.headers.get("content-type") || "";
      if (!contentType.includes("application/x-www-form-urlencoded")) {
        return response(415, "Unsupported booking form content type.");
      }
      const body = await request.text();
      if (body.length > 12_000) return response(413, "The booking request is too large.");
      fields = Object.fromEntries(new URLSearchParams(body));
    } catch (error) {
      logger.error("Site-visit request could not be read.", error);
      return response(400, "The booking request could not be read. Please try again.");
    }

    if (cleanText(fields["bot-field"], 200)) return redirect("/site-visit-confirmation.html");

    let booking;
    try {
      booking = validateBooking(fields);
    } catch (error) {
      return response(400, error.message);
    }

    const key = `${KEY_PREFIX}${booking.id}`;
    const createdAt = now().toISOString();
    let store;
    const record = {
      ...booking,
      status: "tentative",
      calendarSync: "pending",
      calendarEventId: "",
      calendarError: "",
      notificationStatus: "pending",
      notificationError: "",
      createdAt,
      updatedAt: createdAt,
    };

    try {
      store = getStoreImpl(STORE_NAME);
      const { modified } = await store.setJSON(key, record, { onlyIfNew: true });
      if (!modified) {
        const existing = await store.get(key, { type: "json" });
        if (!existing) throw new Error("The existing booking could not be read.");
        if (existing.calendarSync === "synced" && existing.notificationStatus === "sent") {
          return redirect("/site-visit-confirmation.html");
        }
        booking = existing;
      } else {
        booking = record;
      }
    } catch (error) {
      logger.error("Site-visit booking could not be saved to Netlify Blobs.", error);
      return response(503, "We could not save your request. Please try again or call +91 93918 49464.");
    }

    if (booking.notificationStatus !== "sent") {
      try {
        await sendBookingNotification(booking, request.url, env, fetchImpl);
        booking.notificationStatus = "sent";
        booking.notificationError = "";
      } catch (error) {
        logger.error("Site-visit booking was saved, but its email alert failed.", error);
        booking.notificationStatus = "failed";
        booking.notificationError = error.message;
      }
      booking.updatedAt = now().toISOString();
      try {
        await store.setJSON(key, booking);
      } catch (error) {
        logger.error("Site-visit email alert status could not be saved.", error);
        return response(503, "Your request was saved, but its alert status could not be recorded. Please call +91 93918 49464.");
      }
    }

    try {
      const calendar = await syncCalendarEvent(booking, env, fetchImpl);
      booking.calendarSync = calendar.state;
      booking.calendarEventId = calendar.eventId;
      booking.calendarError = calendar.state === "not_configured"
        ? "Google Calendar credentials are not configured."
        : "";
    } catch (error) {
      logger.error("Site-visit booking was saved, but Google Calendar sync failed.", error);
      booking.calendarSync = "failed";
      booking.calendarError = error.message;
    }

    booking.updatedAt = now().toISOString();
    try {
      await store.setJSON(key, booking);
    } catch (error) {
      logger.error("Site-visit calendar sync result could not be saved.", error);
      return response(503, "Your request was saved, but its calendar status could not be updated. Please call +91 93918 49464.");
    }

    const confirmation = booking.calendarSync === "synced"
      ? "/site-visit-confirmation.html?calendar=created"
      : "/site-visit-confirmation.html?calendar=pending";
    return redirect(confirmation);
  };
}

export const handler = createHandler();
export default handler;
