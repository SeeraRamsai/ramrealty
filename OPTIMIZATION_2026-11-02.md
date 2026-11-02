# Mobile optimization and analytics release — 2 November 2026

Starting revision: `864111ed9b9211fed87f0ef89bfe342dbbc0292e`. Changes are grouped for one authorized GitHub/Netlify release. Recovery copy: ignored `audit-results/optimization-2026-11-02/recovery/`.

## Implemented

- Enabled included Netlify Web Analytics and Real User Monitoring in the authenticated account; confirmed active dashboards. No paid upgrade, GA account, advertising pixel or new tracking endpoint was created.
- WebP logo/favicons and responsive gallery previews reuse existing optimized assets with image fallbacks. The small logo is 2,632 bytes versus the 21,491-byte PNG. MP4s still load only after Play.
- Deferred offscreen project rendering and video-control initialization. Native MVV disclosures organize the complete technical breakdown and two secondary walkthroughs. Main price, area basis, listed additional charges and primary walkthrough remain visible. Original details stay in HTML.
- Created enquiry status markup on submission rather than startup; preserved error/retry, duplicate protection and honest unconfirmed receipt behavior.
- Fixed campaign attribution from landing pages through all four project forms, including MVV. Added blocked-storage and navigation regressions.
- Added targeted Content Security Policy, corrected the requested favicon alias, and updated privacy text and meaningful sitemap modification dates without changing the 13-URL inventory.
- Added pinned GitHub Actions quality checks and a daily read-only live health monitor. Monitoring covers availability, canonicals, robots, sitemap, redirects, utility noindex, headers and deployed form markup; it does not send leads or prove email delivery.

## Evidence and limits

Static checks: 1,207 site checks, 223 SEO checks and 52 listing consistency checks passed. All 13 sitemap pages are reachable from homepage HTML without JavaScript. Local enquiry, video lifecycle and campaign attribution regressions passed. The live-health tool passed against a local HTTP fixture and correctly failed all 13 pages when the expected policy was deliberately omitted.

Browser review at 320px: homepage and all four project pages had no horizontal overflow and no initial media sources. MVV keyboard disclosures, navigation menu, enquiry anchor and empty-form focus/validation passed. Responsive WebP selection was observed. No real enquiry was submitted.

Final local Lighthouse performance batch (simulated throttling, sequential, original media preserved):

| Page | Mobile performance | Desktop performance | Mobile LCP | Mobile TBT | CLS |
| --- | --- | --- | --- | --- | --- |
| Homepage | 74 | 97 | 2.2s | 1,200ms | 0 |
| MVV | 78 | 99 | 2.2s | 930ms | 0 |

The representative MVV mobile report transferred 185,585 bytes versus 249,861 bytes in the original paired baseline: about 26% less. Both made zero media requests before interaction. These figures describe that tested initial viewport, not every scroll or full-quality video session.

These are lab results, not field results. Earlier individual candidate trials ranged up to 87 on MVV, but a controlled alternating original/candidate comparison returned original 75/73 and candidate 72/74. It does not establish a reliable score improvement. The final gallery-image correction reduces transfer, but mobile CPU blocking remains an unresolved performance concern. Lighthouse also reported a slower-than-expected host CPU during a subsequent accessibility audit. Do not select the highest trial as the release result or claim all devices pass Core Web Vitals.

The fresh full-site Lighthouse review scored accessibility and best practices 100 on all 15 HTML pages, and SEO 100 on all 13 indexable pages. Hosted deployment verification is recorded separately in local release evidence. Automated scores do not establish complete WCAG conformance; supplied video alternatives still require content review.

Native analytics baseline when enabled: rolling one-day dashboard showed 80 pageviews and 42 IP-based visitor estimates, including QA/automated activity. This is not a count of buyers or qualified enquiries. RUM initially showed no collected data and updates hourly. Assess representative mobile field data before declaring performance targets met. The plan currently exposes one day of reporting history.

See `OPERATIONS.md` for dashboard links, assessment thresholds, review routine, notification-delivery verification, optional GA4 setup and Search Console follow-up. Local raw reports and private account evidence remain ignored, outside the published site.
