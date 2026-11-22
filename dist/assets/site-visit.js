const visitDate = document.querySelector("[data-visit-date]");
if (visitDate) {
  const today = new Date();
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  visitDate.min = localToday;
}

const bookingId = document.querySelector("[data-booking-id]");
if (bookingId) {
  bookingId.value = crypto.randomUUID();
}

const bookingForm = document.querySelector('form[name="site-visit-booking"]');
if (bookingForm) {
  const submitButton = bookingForm.querySelector('[type="submit"]');
  let status = null;
  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;

    if (!status) {
      status = document.createElement("p");
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      submitButton.insertAdjacentElement("afterend", status);
    }

    submitButton.disabled = true;
    status.textContent = "Saving your request and adding the tentative calendar event…";
    try {
      const response = await fetch(bookingForm.action, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(bookingForm)),
      });
      if (!response.ok) {
        throw new Error(await response.text() || "We couldn't save your request.");
      }
      if (response.redirected) {
        location.assign(response.url);
        return;
      }
      throw new Error("We couldn't confirm the request was saved. Please try again or call +91 93918 49464.");
    } catch (error) {
      console.error("Site-visit booking submission failed.", error);
      status.textContent = `${error.message} Your request may not be saved; please retry or call +91 93918 49464.`;
      submitButton.disabled = false;
    }
  });
}
