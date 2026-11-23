# Website operations and measurement

Status assessed on 23 November 2026. Production: https://ramrealty.in/.

| Area | Current setup | Assessment / action |
| --- | --- | --- |
| Hosting | GitHub main publishes static dist to Netlify | Check Published status and commit after releases; retain previous deploy for rollback. No paid upgrade was purchased. |
| Traffic | Netlify Web Analytics enabled in dashboard | Current plan has one-day history. Pageviews and IP-based visitor estimates include automated/QA activity; do not interpret as buyers. |
| Field performance | Netlify Real User Monitoring enabled | Newly enabled, initially no data. Updates hourly without backfill. Assess mobile p75 LCP <=2.5s, INP <=200ms, CLS <=0.1 once representative visits exist; a blank chart is pending, not a pass. |
| Enquiries and bookings | Four static Netlify enquiry forms; site visits are saved in Netlify Blobs | Netlify's global new-submission email alert is configured for any form, including `site-visit-notification`, which contains only a booking reference and requested slot. Inbox delivery still needs an authorized test. Review submissions in Forms and booking records in the protected manager. |
| Campaign attribution | Five UTM fields retained from landing pages to all four forms | Values are session-scoped and capped at 250 characters. No contact details in campaign URLs. Untagged traffic remains unknown. |
| Search | 14 sitemap URLs, canonical links, four distinct locality guides | Search Console indexing can lag. Review excluded URLs and search clicks weekly; sitemap inclusion does not guarantee indexing. Existing submission remains sufficient for the current URL set. |
| Repository quality | GitHub Actions on main pushes and pull requests | Static/SEO/crawl and local enquiry/campaign/video regressions. These do not block Netlify unless deployment/branch protection is configured separately. |
| Availability | GitHub Actions read-only health check every 30 minutes; manual dispatch | Checks sitemap pages, redirects, true 404, headers, form registration and site-visit Blobs availability. Reports retained 14 days. Schedule execution may be delayed by GitHub; this is not continuous uptime monitoring. |
| Privacy/security | Updated privacy page, targeted CSP and existing security headers | Consent-gated GA4 G-7DBBCTFPDT measures visits, contact clicks and submission attempts. Google tags stay blocked until acceptance; advertising consent stays denied. No advertising pixels or session recording. No names, phone numbers or typed form values are sent to a custom analytics service by website code. |

Use [traffic analytics](https://app.netlify.com/projects/ramrealty/analytics-and-metrics/analytics), [real-user monitoring](https://app.netlify.com/projects/ramrealty/analytics-and-metrics/rum), and [accepted enquiries](https://app.netlify.com/projects/ramrealty/forms). Check GitHub Actions failures after each release and review dashboard errors, missing resources and accepted enquiries daily. Local health command: `python tools/check-live-health.py`.

Before release, run the documented static and behavior checks plus relevant Lighthouse and keyboard/mobile QA. After deployment, confirm the exact published commit, run the live health check, and review browser console errors. If a material regression appears, restore the previous published deploy and correct the repository before another release.

## Additional setup requiring business/account information

1. GA4: owner supplied G-7DBBCTFPDT and the consent-gated integration is configured. In its owning account, confirm the web stream domain is ramrealty.in and inspect Realtime/DebugView after an opted-in visit. Review Enhanced Measurement and disable unneeded form interactions/outbound-click capture if present; the stream settings are not accessible in the current signed-in profile. Verify that no personal data reaches reports. Set owner-selected retention, internal-traffic filters and reporting access; do not mark submission attempts as confirmed leads. Google tags add work for opted-in visitors, so compare field performance by consent state when data becomes available.
2. The global new-submission email notification is configured for any form. Verify inbox delivery with a clearly labelled test on a non-production deploy; form markup and local tests alone cannot establish delivery. Export accepted submissions privately for `tools/summarize-enquiries.py` when assessing campaign outcomes.
3. Review indexing and locality queries in Search Console weekly. Maintain accurate prices, availability, approvals and charges. Use a verified Google Business Profile only with an eligible real business address/service area; locality map-search links do not establish an office or project presence.
4. Review supplied videos for accurate captions/transcripts. Automated accessibility scores cannot verify the accuracy of media alternatives or establish full WCAG conformance.
5. Review Netlify usage/credits before their next reset and after traffic growth. Account usage can lag. Set owner-selected budget notifications in the account if required.

Keep raw enquiry exports and detailed local audits under ignored `audit-results/`. Never publish leads or expose a public reporting endpoint. Compare accepted enquiries by project/campaign with actual follow-up outcomes, rather than treating pageviews or completed browser requests as conversions.
