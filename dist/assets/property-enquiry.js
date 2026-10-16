document.querySelectorAll("form").forEach((form) => {
  if (!form.querySelector("input[name='form-name'][value='property-enquiry']")) return;
  const submitButton = form.querySelector("[type='submit']");
  const status = document.createElement("p");

  status.className = "form-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.hidden = true;
  if (submitButton) {
    submitButton.insertAdjacentElement("afterend", status);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (form.dataset.submitting === "true") {
      return;
    }

    if (!submitButton) {
      throw new Error("Enquiry form has no submit button.");
    }

    if (!form.reportValidity()) return;
    form.dataset.submitting = "true";
    submitButton.disabled = true;
    status.hidden = false;
    status.textContent = "Sending your enquiry…";

    try {
      const body = new URLSearchParams(new FormData(form));
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      if (!response.ok) {
        throw new Error(`Enquiry submission failed with HTTP ${response.status}.`);
      }

      // Netlify AJAX responses do not expose a durable submission receipt.
      // A 2xx response alone can also be an unrelated static page. Do not claim delivery.
      submitButton.textContent = "Receipt unconfirmed";
      status.replaceChildren(document.createTextNode(
        "Your request completed, but we could not confirm receipt. It may have arrived. Please call ",
      ));
      const phone = document.createElement("a");
      phone.href = "tel:+917799251808";
      phone.textContent = "+91 77992 51808";
      status.append(phone);
      status.append(document.createTextNode(" to check before submitting again."));
    } catch (error) {
      console.error("Enquiry submission failed.", error);
      status.replaceChildren(
        document.createTextNode(
          "We couldn't send your enquiry. Please try again or call ",
        ),
      );
      const phone = document.createElement("a");
      phone.href = "tel:+917799251808";
      phone.textContent = "+91 77992 51808";
      status.append(phone);
      status.append(document.createTextNode("."));
      form.dataset.submitting = "false";
      submitButton.disabled = false;
    }
  });
});
