# Enquiry reporting with Netlify

Use Netlify > ramrealty > Forms > property-enquiry to review accepted submissions. Email delivery is configured separately in Submission notifications. The dashboard and inbox are the operational sources; a client-side success message alone is not counted as proof of a received enquiry.

For a local summary, export the form's CSV into the ignored audit-results directory, then run:

    python tools/summarize-enquiries.py audit-results/property-enquiry.csv

The report prints counts by project and campaign and excludes names beginning AUDIT TEST. It does not print phone numbers or contact names, send data to another service, or create visitor identifiers. Keep the raw CSV private and do not commit it. Counts describe the export, including any date range/status selected in Netlify, rather than all unique people or qualified sales leads.

Campaign fields are attached on all four project forms. The shared helper also runs on the homepage and indexable information/location pages, retaining the five supported UTM values in session storage for onward visits. Values are limited to 250 characters; blocked storage falls back to current-page parameters. Blank fields do not establish attribution. Never place personal information in UTM parameters.

Call and WhatsApp clicks are not tracked by the current native Netlify analytics setup. GA4 or another configured event destination would be an additional setup. Do not infer click totals from form counts or email notifications. Search Console reports discovery/search traffic; it does not verify lead quality.

## Receipt handling and local verification (16 October 2026)

The AJAX handler does not treat HTTP 200 as proof of a stored enquiry: unrelated HTML can return that status. A completed request therefore shows “Receipt unconfirmed” with a phone contact and blocks duplicate sends. HTTP failures offer retry/contact. The thank-you page also avoids claiming storage. Run `node tools/test-enquiry.mjs` against its local receiver to check these states without sending leads. Account-side storage and email delivery require separate authorized verification in Netlify Forms.

## Active analytics (2 November 2026)

Netlify Web Analytics and Real User Monitoring are enabled in the account. The current plan exposes one day of history. Web Analytics uses server logs; RUM injects an asynchronous browser performance script and updates hourly without historical backfill. These features do not use analytics cookies. Visitor estimates are IP-based; automated checks and QA can contribute traffic, so pageviews are not buyer or lead counts.

- [Traffic dashboard](https://app.netlify.com/projects/ramrealty/analytics-and-metrics/analytics)
- [Real-user performance](https://app.netlify.com/projects/ramrealty/analytics-and-metrics/rum)
- [Accepted enquiries](https://app.netlify.com/projects/ramrealty/forms)

`config/measurement.json` documents verified account configuration outside the publish directory. It does not activate analytics itself. No GA4 account is available in the signed-in profile and no measurement ID has been supplied. No advertising pixels, session recording or custom contact-click events were enabled. See `OPERATIONS.md` for assessment and additional owner setup.
