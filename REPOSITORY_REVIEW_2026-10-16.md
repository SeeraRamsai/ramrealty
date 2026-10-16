# Ram Realty repository review — 16 October 2026

Scope: local revision based on fa3798c. No push, deployment, account changes or live form submissions. Static site; Netlify publishes dist directly, with no package installation or application build required. Existing visual styles, media sources, responsive images and click-to-play behavior are preserved.

## Checks and evidence

| Check | Status | Evidence / limitation (checked 16 October 2026) |
|---|---|---|
| Public homepage | PASS | Opened in connected Chrome; published illustration, Madhuravada wording and MVV ₹5,300 rate visible. Research-tool open and direct Node fetch failed; these are tool limitations. |
| Static site / links / SEO | PASS | audit_site.py 557, check-project-seo.py 171, check-listing-consistency.py 48 checks; zero errors. Nine sitemap pages, unique metadata/canonicals and four distinct project heroes checked. |
| Source Netlify form registration | PASS | All four forms have name=property-enquiry, method=POST, data-netlify=true, hidden form-name, shared field schema, consent/privacy link and honeypot. Account-side detection is not proven by source. |
| Form response handling | PASS | Local HTTP receiver: all four forms retain fields, HTTP 500 retry, duplicate prevention; unrelated HTTP 200 never claims delivery. Receipt remains unconfirmed because AJAX does not supply a durable submission ID. |
| Actual enquiry storage / notification | BLOCKED | Not publicly verifiable. No production submission made. Prior email confirmation does not establish delivery of this unshipped revision. |
| Narrow screens | PASS | Connected Chrome, Windows, 320×800: all four project pages; document width 305px, no broken loaded images, required empty fields invalid, no video sources attached. MVV page also reviewed at normal desktop width. Not a complete WCAG conformance assessment. |
| Video behavior | PASS | Lifecycle regression: deferred source, one active player, abort, quality/resume, stale events and close/offscreen/background cleanup. Media unchanged. |
| Locality wording | PASS | All managed HTML/JS/SVG public copy uses Madhuravada. One external developer URL contains its original madhurawada slug; intentionally preserved to avoid breaking it. Original PDFs/raster assets and historical evidence are not rewritten. No unsupported spelling changes made to other locality names. |
| Area guides | PENDING | Existing About/FAQ/MVV references cover Madhuravada, PM Palem, Kommadi and Yendada. No distinct guide added: verified transport, services, map boundaries and current housing information are insufficient. No thin location pages created. |
| Reviews | BLOCKED | No verified public business-profile/review URL or authorized testimonial text established. Nothing fabricated. |
| Analytics | NOT APPLICABLE | Prior Netlify-only reporting preference retained. No GA4/GTM/Meta implementation or relevant measurement environment IDs found. config/measurement.json is disabled, outside dist and not loaded by any page. No new data transmission. Account-side Netlify Analytics enablement is not publicly verifiable. |
| Search Console | BLOCKED | Ownership, URL inspection, sitemap processing and performance reports are not publicly verifiable; no login requested. |

## RERA references

Sources checked: AP RERA quarterly-updates report at https://rera.ap.gov.in/RERA/DOCUMENTS/Notice/QU%20Status%20Report.pdf and official MVV developer contact page https://mvvgvthegrand.in/contact-us/. Public search extracts corroborate all four registration-number/name pairs; a public report is not a live unit-availability or completion certificate.

- MVV: P03280073150 — MVV & GV THE GRAND. Added official report link and lookup instruction. The report lists validity 1 October 2028. Removed the unsupported assertion that December 2028 possession was confirmed from RERA; retained it as owner-supplied estimate. Need current registration/extension record, exact phase and written possession terms to reconcile dates.
- West Winds: P03290010366 — WEST WINDS. Added official report link and explicit search instruction; existing official brochure and portal retained. Need current direct registration/status record and exact-flat handover evidence.
- Maple Woods: P03280035014 — MAPLE WOOD. Existing direct official project link remains. Official record supports proposed completion 9 July 2027; qualified handover wording preserved. Need completion/occupancy or handover evidence and exact-flat area breakdown before ready-to-move claims.
- Utkarsha: P03280071337 — UTKARSHA CAPITAL TOWERS. Retained official report, clarified label and number lookup. Need current direct registration/status record and exact-unit availability/handover evidence. No guessed encrypted URLs.

## Local implementation

- dist/assets/property-enquiry.js: removed HTTP-200-only delivery claim. HTTP failures retain retry/contact fallback; completed requests show unconfirmed receipt and discourage duplicate submission. No automatic retries.
- dist/thank-you.html: direct visits no longer assert an enquiry was stored.
- Four project index.html files: bumped shared enquiry script to v3; MVV, West Winds and Utkarsha gained accurate RERA source/qualification text.
- tools/test-enquiry.mjs: regression for unrelated 200 responses on every project.
- config/measurement.json: disabled future configuration only; not deployed, no runtime loader or secrets.
- ENQUIRY_REPORTING.md / README.md: update verification guidance and receipt semantics.

## Owner verification, without sharing logins

After a separately authorized release/test, open Netlify → this site's Forms → property-enquiry. Confirm form detection is enabled and the form appears after Netlify scans the deploy. In an authorized preview with Forms enabled, submit one clearly labelled test yourself. Check stored project/name/phone/consent fields, timestamp, and spam folder; separately check notification delivery. A local static server cannot register Netlify forms or prove delivery. Do not use a live enquiry as an unapproved test.

Future third-party measurement, only if you change the Netlify-only preference: provide the selected GA4 G- ID, GTM GTM- container ID or numeric Meta Pixel ID (choose only services actually needed). Public measurement IDs are not API secrets. Agree event naming, consent/privacy behavior and data minimization first; never send names, phone numbers, enquiry text or form values in event parameters. Client request completion is not a confirmed stored lead. API secrets, service-account keys and access tokens must remain outside published files. No event collection is currently enabled.

For area guides, provide verified maps/source links, project coverage and useful distinct locality information; for testimonials provide authorized exact text and attribution, or a verified public review-profile URL. Confirm ongoing pricing, charges, exact unit, area basis and handover from current documents. Office PM Palem and 8 AM–11 PM contact hours retained from earlier owner confirmation; no new credentials or availability invented.

## Performance

Fresh local mobile/desktop Lighthouse attempts recorded separately below when complete. No field Core Web Vitals measurement is available from this review; prior scores must not be presented as today's measurements.

**BLOCKED (16 October 2026):** Both fresh local Lighthouse modes failed to connect to the launched Chrome debugging endpoint (fetch failed). The default executable lookup also failed; an explicit installed Chrome path resolved lookup but not the connection. No fresh mobile/desktop scores or field metrics are claimed. Details: ignored audit-results/review-2026-10-16/lighthouse-attempts.json. Manual Chrome checks and static regressions above remain valid.

Desktop manual check: Utkarsha 1536×695, document width 1521px, one illustrated hero, zero unnamed buttons and solid keyboard-focus outline on the next navigation link. This does not establish full keyboard/screen-reader compliance. Whitespace validation passed. Recovery copies are under ignored audit-results/review-2026-10-16/recovery/.
