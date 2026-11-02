# Website operations and measurement

Status assessed on 2 November 2026. Production: https://ramrealty.in/.

| Area | Current setup | Assessment / action |
| --- | --- | --- |
| Hosting | GitHub main publishes static dist to Netlify | Check Published status and commit after releases; retain previous deploy for rollback. No paid upgrade was purchased. |
| Traffic | Netlify Web Analytics enabled in dashboard | Current plan has one-day history. Pageviews and IP-based visitor estimates include automated/QA activity; do not interpret as buyers. |
| Field performance | Netlify Real User Monitoring enabled | Newly enabled, initially no data. Updates hourly without backfill. Assess mobile p75 LCP <=2.5s, INP <=200ms, CLS <=0.1 once representative visits exist; a blank chart is pending, not a pass. |
| Enquiries | Four static Netlify forms; local submission-state tests | Review accepted submissions in Forms. HTTP success does not prove storage. Independently verify notification arrival with an owner-approved test and inbox check; this release does not send real leads. |
| Campaign attribution | Five UTM fields retained from landing pages to all four forms | Values are session-scoped and capped at 250 characters. No contact details in campaign URLs. Untagged traffic remains unknown. |
| Search | 13 sitemap URLs, canonical links, four distinct locality guides | Search Console indexing can lag. Review excluded URLs and search clicks weekly; sitemap inclusion does not guarantee indexing. Existing Nov 2 submission remains sufficient for the same URL set. |
| Repository quality | GitHub Actions on main pushes and pull requests | Static/SEO/crawl and local enquiry/campaign/video regressions. These do not block Netlify unless deployment/branch protection is configured separately. |
| Availability | Daily GitHub Actions read-only health check at 08:00 IST; manual dispatch | Checks all sitemap pages, redirects, true 404, headers and form markup. Reports retained 14 days. Schedule execution may be delayed by GitHub; this is not continuous uptime monitoring. |
| Privacy/security | Updated privacy page, targeted CSP and existing security headers | No GA4, advertising pixels, session recording or contact-click event destination configured. No names, phone numbers or typed form values are sent to a custom analytics service by website code. |

Use [traffic analytics](https://app.netlify.com/projects/ramrealty/analytics-and-metrics/analytics), [real-user monitoring](https://app.netlify.com/projects/ramrealty/analytics-and-metrics/rum), and [accepted enquiries](https://app.netlify.com/projects/ramrealty/forms). Check GitHub Actions failures after each release and review dashboard errors, missing resources and accepted enquiries daily. Local health command: `python tools/check-live-health.py`.

Before release, run the documented static and behavior checks plus relevant Lighthouse and keyboard/mobile QA. After deployment, confirm the exact published commit, run the live health check, and review browser console errors. If a material regression appears, restore the previous published deploy and correct the repository before another release.

## Additional setup requiring business/account information

1. Longer-term traffic and contact-click reporting: supply an existing GA4 measurement ID or create an owner-controlled Analytics account and approve its terms. The currently signed-in profile has no Analytics account. Configure appropriate consent choices and privacy text before enabling new tags. Native Netlify reporting works now; GA4 is optional.
2. Verify that the intended enquiry notification recipient actually receives a stored test submission. An inbox verification is still required; form markup and local tests alone cannot establish delivery. Export accepted submissions privately for `tools/summarize-enquiries.py` when assessing campaign outcomes.
3. Review indexing and locality queries in Search Console weekly. Maintain accurate prices, availability, approvals and charges. Use a verified Google Business Profile only with an eligible real business address/service area; locality map-search links do not establish an office or project presence.
4. Review supplied videos for accurate captions/transcripts. Automated accessibility scores cannot verify the accuracy of media alternatives or establish full WCAG conformance.
5. Review Netlify usage/credits before their next reset and after traffic growth. Account usage can lag. Set owner-selected budget notifications in the account if required; no new paid service or notification recipient was configured here.

Keep raw enquiry exports and detailed local audits under ignored `audit-results/`. Never publish leads or expose a public reporting endpoint. Compare accepted enquiries by project/campaign with actual follow-up outcomes, rather than treating pageviews or completed browser requests as conversions.
