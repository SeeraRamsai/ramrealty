const calendarStatus = document.querySelector("[data-calendar-status]");
if (calendarStatus) {
  const syncStatus = new URLSearchParams(location.search).get("calendar");
  if (syncStatus === "pending") {
    calendarStatus.textContent = "Your request is saved in our booking database, but its calendar event needs attention. Our team will follow up to confirm the visit.";
  } else if (syncStatus !== "created") {
    calendarStatus.textContent = "For a new booking, a tentative calendar event is created for the requested slot. Our team will confirm the appointment with you.";
  }
}
