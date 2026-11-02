# Mobile optimization and analytics release — 2 November 2026

Starting revision: `864111ed9b9211fed87f0ef89bfe342dbbc0292e`. The optimization release was pushed as 9a7c02c. The owner then supplied a GA4 ID, requiring a follow-up analytics release. Recovery copy: ignored `audit-results/optimization-2026-11-02/recovery/`.

## Implemented

- Enabled included Netlify Web Analytics and Real User Monitoring in the authenticated account; confirmed active dashboards. No paid upgrade, GA account, advertising pixel or new tracking endpoint was created. After the owner supplied G-7DBBCTFPDT, added consent-gated GA4 pageviews and sanitized contact-click/submission-attempt events, footer preference controls, cookie withdrawal and regression coverage. Property-side receipt remains unverified in the inaccessible owning account.
- WebP logo/favicons and responsive gallery previews reuse existing optimized assets with image fallbacks. The small logo is 2,632 bytes versus the 21,491-byte PNG. MP4s still load only after Play.
- Deferred offscreen project rendering and video-control initialization. Native MVV disclosures organize the complete technical breakdown and two secondary walkthroughs. Main price, area basis, listed additional charges and primary walkthrough remain visible. Original details stay in HTML.
- Created enquiry status markup on submission rather than startup; preserved error/retry, duplicate protection and honest unconfirmed receipt behavior.
- Fixed campaign attribution from landing pages through all four project forms, including MVV. Added blocked-storage and navigation regressions.
- Added targeted Content Security Policy, corrected the requested favicon alias, and updated privacy text and meaningful sitemap modification dates without changing the 13-URL inventory.
- Added pinned GitHub Actions quality checks and a daily read-only live health monitor. Monitoring covers availability, canonicals, robots, sitemap, redirects, utility noindex, headers and deployed form markup; it does not send leads or prove email delivery.

## Evidence and limits

Static checks after the GA4 addition: 1,237 site checks, 223 SEO checks and 53 listing consistency checks passed. All 13 sitemap pages are reachable from homepage HTML without JavaScript. Local enquiry, video lifecycle and campaign attribution regressions passed. The live-health tool passed against a local HTTP fixture and correctly failed all 13 pages when the expected policy was deliberately omitted.

Browser review at 320px: homepage and all four project pages had no horizontal overflow and no initial media sources. MVV keyboard disclosures, navigation menu, enquiry anchor and empty-form focus/validation passed. Responsive WebP selection was observed. No real enquiry was submitted.

Final local Lighthouse performance batch (simulated throttling, sequential, original media preserved):

| Page | Mobile performance | Desktop performance | Mobile LCP | Mobile TBT | CLS |
| --- | --- | --- | --- | --- | --- |
| Homepage | 74 | 97 | 2.2s | 1,200ms | 0 |
| MVV | 78 | 99 | 2.2s | 930ms | 0 |

The representative MVV mobile report transferred 185,585 bytes versus 249,861 bytes in the original paired baseline: about 26% less. Both made zero media requests before interaction. These figures describe that tested initial viewport, not every scroll or full-quality video session.

These are lab results, not field results. Earlier individual candidate trials ranged up to 87 on MVV, but a controlled alternating original/candidate comparison returned original 75/73 and candidate 72/74. It does not establish a reliable score improvement. The final gallery-image correction reduces transfer, but mobile CPU blocking remains an unresolved performance concern. Lighthouse also reported a slower-than-expected host CPU during a subsequent accessibility audit. Do not select the highest trial as the release result or claim all devices pass Core Web Vitals.

Before the GA4 addition, the fresh full-site Lighthouse review scored accessibility and best practices 100 on all 15 HTML pages, and SEO 100 on all 13 indexable pages. Hosted deployment verification is recorded separately in local release evidence. Automated scores do not establish complete WCAG conformance; supplied video alternatives still require content review.

Native analytics baseline when enabled: rolling one-day dashboard showed 80 pageviews and 42 IP-based visitor estimates, including QA/automated activity. This is not a count of buyers or qualified enquiries. RUM initially showed no collected data and updates hourly. Assess representative mobile field data before declaring performance targets met. The plan currently exposes one day of reporting history.

See `OPERATIONS.md` for dashboard links, assessment thresholds, review routine, notification-delivery verification, optional GA4 setup and Search Console follow-up. Local raw reports and private account evidence remain ignored, outside the published site.

GA4 implementation follows Google?s basic consent guidance: https://developers.google.com/tag-platform/security/guides/consent . Page configuration strips URL queries/fragments and full referrer paths; custom event payloads contain only the public project identifier. Consent preferences use local storage and ads remain denied. No Google tag loads in local preview. The owner must verify the supplied property and its Enhanced Measurement settings. Initial performance numbers above predate the consent controls and are not measurements of an opted-in Google tag.

The follow-up consent interface passed representative Lighthouse accessibility/best-practices checks at 100 on the homepage, MVV, privacy and 404 templates, with SEO 100 on the three indexable targets. Full-site static, campaign, enquiry, video and analytics regressions passed. The GitHub quality workflow for 9a7c02c passed, and the first deployed release passed 22 live HTTP checks without errors. The expanded monitor also verifies Googlebot permissions, consent controls and the deployed measurement helper; local fixtures confirmed valid-site acceptance and wrong-helper detection. Browser automation became unavailable during the follow-up, so live opt-in UI interaction and property-side GA4 receipt remain unverified.

After adding consent controls, the final local representative performance run scored homepage mobile 75 / desktop 100 and MVV mobile 78 / desktop 100. Mobile LCP was 2.2s on both, TBT 1,150ms / 920ms and CLS 0. Google tags are intentionally disabled on localhost, so this run does not measure the additional cost after production consent. No assertion of a reliable mobile score increase is made.

With the consent controls included, the MVV local mobile report transferred 191,793 bytes versus 249,861 bytes for the original: about 23% less. This supersedes the 26% pre-consent-controls saving above for the final local default state. Production compression, injected RUM and an accepted Google tag can change transfer totals.
