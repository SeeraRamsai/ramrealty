import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const booking = readFileSync("dist/site-visit.html", "utf8");
const confirmation = readFileSync("dist/site-visit-confirmation.html", "utf8");
const privacy = readFileSync("dist/privacy.html", "utf8");
const sitemap = readFileSync("dist/sitemap.xml", "utf8");
const operations = readFileSync("SITE_VISIT_BOOKINGS.md", "utf8");

assert.match(booking, /<form\b[^>]*name="site-visit-booking"[^>]*method="POST"[^>]*action="\/\.netlify\/functions\/site-visits"/);
assert.match(booking, /name="form-name" value="site-visit-booking"/);
assert.match(booking, /name="booking_id" data-booking-id/);
assert.match(booking, /name="bot-field"/);
for (const field of ["name", "phone", "property", "visit_date", "visit_time", "whatsapp_updates_consent"]) {
  assert.match(booking, new RegExp(`name="${field}"[^>]*required`), `${field} must be required`);
}
assert.match(booking, /name="phone"[^>]*pattern="\[6-9\]\[0-9\]\{9\}"/);
assert.match(booking, /name="whatsapp_updates_consent" type="checkbox" value="yes" required/);
assert.match(booking, /Your selected date and time are a request, not a confirmed appointment/);
assert.match(confirmation, /name="robots" content="noindex,follow"/);
assert.match(confirmation, /Your site-visit request is received/);
assert.match(confirmation, /not scheduled until you receive that WhatsApp confirmation/);
assert.match(confirmation, /reminders, visit-day coordination, schedule updates and a follow-up when the visit is complete/);
assert.match(confirmation, /data-calendar-status/);
assert.match(privacy, /site-wide Netlify Blobs store/);
assert.match(privacy, /private tentative event in the Ram Realty Google Calendar/);
assert.match(sitemap, /<loc>https:\/\/ramrealty\.in\/site-visit\.html<\/loc>/);
assert.match(operations, /WhatsApp updates are still sent manually/);
assert.match(operations, /SITE_VISIT_ADMIN_TOKEN/);
assert.match(operations, /Google Calendar/);
assert.match(readFileSync("dist/site-visits-admin.html", "utf8"), /noindex,nofollow/);
assert.match(readFileSync("dist/assets/site-visits-admin.js", "utf8"), /Authorization: `Bearer/);
assert.match(readFileSync("netlify/functions/site-visits.mjs", "utf8"), /STORE_NAME = "site-visit-bookings"/);

for (const file of [
  "dist/index.html",
  "dist/mvv-gv-grand/index.html",
  "dist/vaisakhi-west-winds/index.html",
  "dist/a-square-maple-woods/index.html",
  "dist/utkarsha-capital-towers/index.html",
]) {
  assert.match(readFileSync(file, "utf8"), /href="\/site-visit\.html"/, `${file} must link to booking`);
}

function listFiles(directory, extensions) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory()
      ? listFiles(path, extensions)
      : extensions.some((extension) => path.endsWith(extension))
        ? [path]
        : [];
  });
}

for (const file of listFiles("dist", [".html", ".js", ".css", ".svg", ".txt", ".xml"])) {
  assert.doesNotMatch(
    readFileSync(file, "utf8"),
    /7799251808|77992 51808|77992-51808/,
    `${file} has the old phone number`,
  );
}

console.log("Site-visit form, confirmation, updates, links, sitemap and contact number checks passed.");
