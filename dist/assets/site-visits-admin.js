const tokenField = document.querySelector("#admin-token");
const loadButton = document.querySelector("#load-bookings");
const signOutButton = document.querySelector("#sign-out");
const statusRegion = document.querySelector("#admin-status");
const list = document.querySelector("#booking-list");
let adminToken = "";

function makeElement(tag, text, className = "") {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) element.className = className;
  return element;
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${adminToken}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "The booking request failed.");
  return result;
}

function formatVisit(booking) {
  const [start, end] = booking.visitTime.split("-");
  const formatTime = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    return new Date(2000, 0, 1, hour, minute).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  };
  return `${booking.visitDate} · ${formatTime(start)}–${formatTime(end)} IST`;
}

function renderBookings(bookings) {
  list.replaceChildren();
  if (!bookings.length) {
    list.append(makeElement("p", "No site-visit requests have been saved yet."));
    return;
  }

  for (const booking of bookings) {
    const card = makeElement("article", "", "admin-booking-card");
    const heading = makeElement("h3", booking.property);
    const status = makeElement(
      "p",
      `Status: ${booking.status} · Calendar: ${booking.calendarSync}`,
      "admin-booking-status",
    );
    const details = makeElement("dl", "");
    for (const [label, value] of [
      ["Visitor", booking.name],
      ["WhatsApp", booking.phone],
      ["Requested time", formatVisit(booking)],
      ["Booking reference", booking.id],
      ["Updates consent", booking.whatsappUpdatesConsent ? "Booking updates accepted" : "Not accepted"],
      ["Notes", booking.notes || "None"],
    ]) {
      details.append(makeElement("dt", label), makeElement("dd", value));
    }
    card.append(heading, status, details);

    if (booking.calendarError) {
      card.append(makeElement("p", `Calendar sync issue: ${booking.calendarError}`, "admin-error"));
    }
    const actions = makeElement("div", "", "admin-actions");
    if (booking.calendarSync !== "synced") {
      actions.append(actionButton("Retry calendar sync", booking.id, "retry-calendar"));
    } else if (booking.status === "tentative") {
      actions.append(actionButton("Confirm visit", booking.id, "confirm"));
      actions.append(actionButton("Cancel visit", booking.id, "cancel"));
    } else if (booking.status === "confirmed") {
      actions.append(actionButton("Mark visit complete", booking.id, "complete"));
      actions.append(actionButton("Cancel visit", booking.id, "cancel"));
    }
    actions.append(actionButton("Delete record", booking.id, "delete"));
    if (actions.childElementCount) card.append(actions);
    list.append(card);
  }
}

function actionButton(label, bookingId, action) {
  const button = makeElement("button", label);
  button.type = "button";
  button.addEventListener("click", async () => {
    if (action === "delete" && !window.confirm("Delete this booking and its calendar event? This cannot be undone.")) {
      return;
    }
    button.disabled = true;
    statusRegion.textContent = `${label}…`;
    try {
      await request("/.netlify/functions/site-visits", {
        method: action === "delete" ? "DELETE" : "PATCH",
        body: JSON.stringify(action === "delete" ? { bookingId } : { bookingId, action }),
      });
      await loadBookings();
      statusRegion.textContent = "Booking updated.";
    } catch (error) {
      statusRegion.textContent = error.message;
      button.disabled = false;
    }
  });
  return button;
}

async function loadBookings() {
  const result = await request("/.netlify/functions/site-visits");
  renderBookings(result.bookings);
  signOutButton.hidden = false;
  statusRegion.textContent = `${result.bookings.length} saved booking${result.bookings.length === 1 ? "" : "s"}.`;
}

loadButton.addEventListener("click", async () => {
  adminToken = tokenField.value.trim();
  if (!adminToken) {
    statusRegion.textContent = "Enter the admin token.";
    return;
  }
  loadButton.disabled = true;
  statusRegion.textContent = "Loading saved requests…";
  try {
    await loadBookings();
  } catch (error) {
    adminToken = "";
    statusRegion.textContent = error.message;
  } finally {
    loadButton.disabled = false;
  }
});

signOutButton.addEventListener("click", () => {
  adminToken = "";
  tokenField.value = "";
  list.replaceChildren();
  signOutButton.hidden = true;
  statusRegion.textContent = "Admin token cleared.";
});
