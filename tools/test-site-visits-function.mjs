import assert from "node:assert/strict";
import { createHandler } from "../netlify/functions/site-visits.mjs";

class MemoryStore {
  records = new Map();

  async setJSON(key, value, options = {}) {
    if (options.onlyIfNew && this.records.has(key)) return { modified: false };
    this.records.set(key, structuredClone(value));
    return { modified: true };
  }

  async get(key) {
    return structuredClone(this.records.get(key) ?? null);
  }

  async list({ prefix = "" } = {}) {
    return {
      blobs: [...this.records.keys()]
        .filter((key) => key.startsWith(prefix))
        .map((key) => ({ key, etag: "test" })),
    };
  }

  async delete(key) {
    this.records.delete(key);
  }
}

const adminToken = "test-only-admin-token";
const env = {
  GOOGLE_CLIENT_ID: "test-client",
  GOOGLE_CLIENT_SECRET: "test-secret",
  GOOGLE_REFRESH_TOKEN: "test-refresh-token",
  GOOGLE_CALENDAR_ID: "primary",
  SITE_VISIT_ADMIN_TOKEN: adminToken,
  URL: "https://ramrealty.test",
};
const store = new MemoryStore();
const calendarCalls = [];
const notificationCalls = [];
const loggedErrors = [];
let failCalendar = false;
let failNotification = false;
const fetchImpl = async (input, options = {}) => {
  const url = new URL(input);
  if (url.pathname === "/site-visit.html") {
    notificationCalls.push({ url, options });
    if (failNotification) return new Response("<!doctype html>", { status: 200 });
    const receipt = new Response(null, { status: 200 });
    Object.defineProperties(receipt, {
      url: { value: `${url.origin}/site-visit.html?notification=received` },
      redirected: { value: true },
    });
    return receipt;
  }
  if (url.hostname === "oauth2.googleapis.com") {
    return Response.json({ access_token: "mock-access-token" });
  }
  calendarCalls.push({ url, options });
  if (failCalendar) return new Response("calendar unavailable", { status: 503 });
  if (options.method === "DELETE") return new Response(null, { status: 204 });
  if (options.method === "PATCH") return Response.json({ id: "mock-event" });
  return Response.json({ id: "mock-event" });
};
const handler = createHandler({
  getStoreImpl: () => store,
  fetchImpl,
  env,
  now: () => new Date("2026-11-22T10:00:00.000Z"),
  logger: { error: (...args) => loggedErrors.push(args) },
});
const baseUrl = "https://ramrealty.test/.netlify/functions/site-visits";

function formRequest(fields) {
  return new Request(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(fields),
  });
}

function healthRequest(handlerToCall = handler) {
  return handlerToCall(new Request(`${baseUrl}?health=1`));
}

function bookingFields(id, overrides = {}) {
  return {
    "form-name": "site-visit-booking",
    booking_id: id,
    "bot-field": "",
    name: "DEMO ONLY - Sample Visitor",
    phone: "9999999999",
    property: "A Square Maple Woods",
    visit_date: "2026-11-25",
    visit_time: "15:00-17:00",
    notes: "DEMO ONLY",
    whatsapp_updates_consent: "yes",
    ...overrides,
  };
}

async function adminRequest(method, payload, token = adminToken) {
  return handler(new Request(baseUrl, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(payload ? { "Content-Type": "application/json" } : {}),
    },
    body: payload ? JSON.stringify(payload) : undefined,
  }));
}

const validId = "9a7b1234-1111-4111-8111-111111111111";
assert.equal((await healthRequest()).status, 200);
const saved = await handler(formRequest(bookingFields(validId)));
assert.equal(saved.status, 303);
assert.match(saved.headers.get("location"), /calendar=created/);
const record = await store.get(`booking-${validId}`, { type: "json" });
assert.equal(record.status, "tentative");
assert.equal(record.calendarSync, "synced");
assert.equal(record.notificationStatus, "sent");
assert.equal(record.phone, "9999999999");
assert.equal(calendarCalls.length, 1);
assert.equal(notificationCalls.length, 1);
const notificationFields = new URLSearchParams(notificationCalls[0].options.body);
assert.equal(notificationFields.get("form-name"), "site-visit-notification");
assert.equal(notificationFields.get("booking_reference"), validId);
assert.equal(notificationFields.get("property"), "A Square Maple Woods");
assert.equal(notificationFields.get("visit_date"), "2026-11-25");
assert.equal(notificationFields.get("visit_time"), "15:00-17:00");
assert.equal(notificationFields.has("phone"), false);
assert.equal(notificationFields.has("name"), false);
assert.equal(notificationFields.has("notes"), false);
const createdEvent = JSON.parse(calendarCalls[0].options.body);
assert.equal(calendarCalls[0].options.method, "POST");
assert.equal(createdEvent.status, "tentative");
assert.equal(createdEvent.transparency, "opaque");
assert.equal(createdEvent.start.timeZone, "Asia/Kolkata");
assert.equal(createdEvent.start.dateTime, "2026-11-25T15:00:00+05:30");
assert.equal(createdEvent.end.dateTime, "2026-11-25T17:00:00+05:30");
assert.doesNotMatch(JSON.stringify(createdEvent), /9999999999|DEMO ONLY/);

const duplicate = await handler(formRequest(bookingFields(validId)));
assert.equal(duplicate.status, 303);
assert.equal(calendarCalls.length, 1, "same booking ID must not create another calendar event");
assert.equal(notificationCalls.length, 1, "same booking ID must not send another alert");

assert.equal((await adminRequest("GET", undefined, "wrong-token")).status, 401);
const adminList = await adminRequest("GET");
assert.equal(adminList.status, 200);
assert.equal((await adminList.json()).bookings.length, 1);
const confirmed = await adminRequest("PATCH", { bookingId: validId, action: "confirm" });
assert.equal(confirmed.status, 200);
assert.equal((await store.get(`booking-${validId}`)).status, "confirmed");
assert.equal(calendarCalls.at(-1).options.method, "PATCH");
assert.equal(JSON.parse(calendarCalls.at(-1).options.body).status, "confirmed");
assert.equal(JSON.parse(calendarCalls.at(-1).options.body).summary, "Site visit — A Square Maple Woods");
const completed = await adminRequest("PATCH", { bookingId: validId, action: "complete" });
assert.equal(completed.status, 200);
assert.equal((await store.get(`booking-${validId}`)).status, "completed");
assert.equal((await adminRequest("PATCH", { bookingId: validId, action: "confirm" })).status, 409);
const deleted = await adminRequest("DELETE", { bookingId: validId });
assert.equal(deleted.status, 200);
assert.equal((await deleted.json()).deleted, true);
assert.equal(await store.get(`booking-${validId}`), null);
assert.equal(calendarCalls.at(-1).options.method, "DELETE");

const cancelledId = "9a7b1234-4444-4444-8444-444444444444";
await handler(formRequest(bookingFields(cancelledId)));
const cancelled = await adminRequest("PATCH", { bookingId: cancelledId, action: "cancel" });
assert.equal(cancelled.status, 200);
assert.equal((await store.get(`booking-${cancelledId}`)).status, "cancelled");
assert.equal(JSON.parse(calendarCalls.at(-1).options.body).status, "cancelled");

const failedId = "9a7b1234-2222-4222-8222-222222222222";
failCalendar = true;
const calendarFailure = await handler(formRequest(bookingFields(failedId)));
assert.equal(calendarFailure.status, 303, "saved request should confirm even if calendar sync needs attention");
assert.match(calendarFailure.headers.get("location"), /calendar=pending/);
const failedRecord = await store.get(`booking-${failedId}`);
assert.equal(failedRecord.calendarSync, "failed");
assert.equal(failedRecord.status, "tentative");
assert.equal(loggedErrors.length, 1);
assert.match(loggedErrors[0][0], /Google Calendar sync failed/);
failCalendar = false;
const retry = await adminRequest("PATCH", { bookingId: failedId, action: "retry-calendar" });
assert.equal(retry.status, 200);
assert.equal((await store.get(`booking-${failedId}`)).calendarSync, "synced");

const notificationFailedId = "9a7b1234-6666-4666-8666-666666666666";
failNotification = true;
const notificationFailure = await handler(formRequest(bookingFields(notificationFailedId)));
assert.equal(notificationFailure.status, 303, "saved booking remains accepted if its alert needs retry");
const notificationFailedRecord = await store.get(`booking-${notificationFailedId}`);
assert.equal(notificationFailedRecord.notificationStatus, "failed");
assert.match(notificationFailedRecord.notificationError, /did not confirm/);
const notificationsBeforeRetry = notificationCalls.length;
failNotification = false;
const notificationRetry = await adminRequest("PATCH", {
  bookingId: notificationFailedId,
  action: "retry-notification",
});
assert.equal(notificationRetry.status, 200);
assert.equal((await store.get(`booking-${notificationFailedId}`)).notificationStatus, "sent");
assert.equal(notificationCalls.length, notificationsBeforeRetry + 1);

const invalidId = "9a7b1234-3333-4333-8333-333333333333";
const invalid = await handler(formRequest(bookingFields(invalidId, { phone: "123" })));
assert.equal(invalid.status, 400);
assert.equal(await store.get(`booking-${invalidId}`), null);
const honeypot = await handler(formRequest(bookingFields(invalidId, { "bot-field": "spam" })));
assert.equal(honeypot.status, 303);
assert.equal(await store.get(`booking-${invalidId}`), null);

const unavailableHandler = createHandler({
  getStoreImpl: () => { throw new Error("storage not configured"); },
  logger: { error: (...args) => loggedErrors.push(args) },
});
assert.equal((await healthRequest(unavailableHandler)).status, 503);
assert.equal((await unavailableHandler(new Request(baseUrl, { method: "GET" }))).status, 401);
const unavailableBooking = await unavailableHandler(formRequest(bookingFields("9a7b1234-5555-4555-8555-555555555555")));
assert.equal(unavailableBooking.status, 503);
assert.match(await unavailableBooking.text(), /could not save your request/i);

console.log("Site-visit function passed: storage and email alert health, minimal notification data, alert retry, graceful storage failures, Blobs persistence, calendar sync, authorization, status transitions, idempotency, validation and honeypot.");
