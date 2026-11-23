# Site-visit bookings

The public booking page is `/site-visit.html`. It submits to the `site-visits` Netlify Function. The function stores the request in the persistent `site-visit-bookings` Netlify Blobs store and creates a tentative Google Calendar event. The confirmation page makes clear that the requested slot is not confirmed until staff checks availability and confirms it.

Production status checked 23 November 2026: the booking page loads, but the function returns HTTP 502 because the deployed runtime is missing the Netlify Blobs site ID/token context. The project environment-variable page is empty, so the staff admin token and Google Calendar credentials are also not configured. No booking was submitted. The local handler now returns an explicit service-unavailable response for storage failures and exposes a read-only health probe; restore the Netlify-provided Blobs context, privately configure required admin/Calendar values, deploy, and verify that the health probe returns 200 before relying on bookings.

After a booking is stored, the function submits a separate `site-visit-notification` Netlify Form containing only the booking reference, property and requested date/time. The existing email notification rule can then alert on the new form without duplicating visitor contact details. The protected manager shows alert status and allows staff to retry a failed alert. Netlify Form acceptance and inbox delivery must be verified after deployment.

## Enable database and calendar integration

1. Enable the Google Calendar API in the Google Cloud project that owns the calendar.
2. Create a Google OAuth client and authorize the Google account that owns or can edit the destination calendar for the `https://www.googleapis.com/auth/calendar.events` scope. The OAuth 2.0 Playground can exchange the authorization code for a refresh token; choose **Use your own OAuth credentials** and authorize the Playground redirect URI in your OAuth client. The refresh token must belong to the calendar account the function will write to.
3. In Netlify **Project configuration → Environment variables**, set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID`, and `SITE_VISIT_ADMIN_TOKEN` for the production deploy context. Use `primary` as the calendar ID for the authorized account's primary calendar, or set the destination calendar ID. Never put these credentials in HTML, JavaScript, or Git.
4. Generate the staff admin token locally with `node -e "process.stdout.write(require('node:crypto').randomBytes(32).toString('base64url'))"` and add its output as the Netlify `SITE_VISIT_ADMIN_TOKEN` value. Give the token only to authorized staff and rotate it in Netlify if exposed.
5. Redeploy after setting environment variables. Netlify Functions provision access to Blobs automatically; no Form detection or Netlify Forms notification setup is needed for this function-based booking path.
6. Submit a fake booking to a non-production deploy, confirm that it appears in the Netlify Blobs database through `/site-visits-admin.html` and that the event appears as tentative in Google Calendar. Do not use a real customer's contact details for testing.

The form collects the visitor's name, WhatsApp number, requested property/date/time, optional visit notes, and explicit consent for booking-related WhatsApp messages. Campaign tags are included when available. It uses a honeypot and does not request payment or identity documents.

## Where requests and confirmed appointments are kept

The function writes one JSON record per request to the site-wide Netlify Blobs store named `site-visit-bookings`, under keys beginning `booking-`. This is a persistent key-value store, not a relational database, and it survives deploys. Staff can view the records in the protected site-visit manager; they are not listed in the regular Netlify Forms dashboard.

Each request is saved in Blobs before Google Calendar sync. The event uses the `Asia/Kolkata` timezone, is marked tentative and opaque (busy), and contains a booking reference; visitor contact details and free-text notes remain in the protected Blobs record rather than the calendar event. The visitor is not added as a Calendar attendee and does not receive a Google Calendar invitation. If calendar configuration or sync fails, the request remains saved with a visible sync error and can be retried by staff. The calendar event ID is deterministic, so resubmitting the same browser request does not create a duplicate event.

For an external Google OAuth consent screen left in **Testing**, Google issues refresh tokens that expire after seven days for Calendar scopes. Set up and publish/verify the production OAuth consent configuration as required by Google, and monitor for revoked or expired credentials. A failed token refresh is recorded as a calendar sync error; the booking itself remains in Blobs.

Open `/site-visits-admin.html`, enter the admin token, and load saved bookings. Staff can retry failed calendar sync, confirm a tentative event, cancel a request, mark a confirmed visit complete, or delete a booking and its calendar event when retention no longer requires it. Confirm/cancel actions update the Google Calendar event and stored booking status. Marking complete updates the stored booking record. Deletion requires confirmation and is permanent.

## WhatsApp update workflow

WhatsApp updates are still sent manually by the Ram Realty team; the calendar integration does not send WhatsApp messages or reminders. For each accepted request:

1. Check the requested property's availability and message the visitor to confirm the appointment or agree on another time. Do not treat the requested time as confirmed until the visitor receives the team's confirmation.
2. Send any schedule, meeting-point, or other visit arrangements, then a reminder before the appointment.
3. Coordinate on the visit day if timing or location changes.
4. After the visit, message the visitor to confirm completion and close out the request.

The visitor's required consent is limited to messages about that booking and does not authorize unrelated marketing. Keep Netlify notifications routed to a monitored inbox so new requests are not missed, and apply the retention practices in the privacy policy.

## Local checks

Run `node tools/test-site-visit.mjs` and `node tools/test-site-visits-function.mjs` to verify the booking page and backend behavior with mocked Netlify Blobs and Google Calendar responses. They do not connect to production Netlify or Google accounts.
