# Local release review — 18 October 2026

## Release decision

Owner instruction: keep the release local until the 1 November credit reset. No automatic push or deployment is scheduled. A future release requires an explicit instruction and a fresh credit check.

- Tested local commit: `443b35c`.
- Current remote/production baseline: `482ffcda69b76db3269c0245a883a73654b0baf2`.
- No push or deployment was performed for this release.
- Netlify billing showed 5 of 300 credits remaining on 18 October, with reset on 1 November. Production deployments cost 15 credits. The release is held to avoid exhausting the allowance.

## Implemented locally

- Embedded shared CSS at its original cascade positions: 28 stylesheet blocks across 11 HTML pages. Editable CSS remains the source, maintained by `tools/inline-page-styles.py`. This removes render-blocking stylesheet requests without adding a hosting build step.
- Removed unused project banner CSS.
- Added publish-folder forced permanent redirects for `/about`, `/faq` and `/privacy`, matching the existing deployment configuration.
- Corrected sitemap modification dates using meaningful source history, and strengthened redirect/date checks.
- Updated local maintenance and release instructions.

## Verification

PASS: 577 site checks, 171 project SEO checks and 48 listing consistency checks (796 total). All 28 embedded stylesheet blocks are current. Four project enquiry regression journeys and video lifecycle tests passed locally. Whitespace checks passed.

PASS within tested coverage: homepage, four project pages and walkthroughs manually checked in Chrome at actual 320px and 1536px viewport widths. No horizontal overflow, broken loaded images or initially attached video sources were observed. Required form validation remained active. This is not a full accessibility conformance assessment.

### Local Lighthouse lab measurements

| Page | Device | Performance | Accessibility / Best practices / SEO | LCP | TBT | CLS |
| --- | --- | ---: | --- | ---: | ---: | ---: |
| Homepage | Mobile | 86 | 100 / 100 / 100 | 1.59 s | 530 ms | 0 |
| Homepage | Desktop | 100 | 100 / 100 / 100 | 0.38 s | 47 ms | 0 |
| MVV | Mobile | 79 | 100 / 100 / 100 | 2.12 s | 893 ms | 0 |
| MVV | Desktop | 100 | 100 / 100 / 100 | 0.42 s | 40 ms | 0 |

These are local simulated lab runs on 18 October, not live production or real-user Core Web Vitals results. Scores vary with test conditions. Mobile blocking time still needs improvement. Automated accessibility scores do not establish WCAG compliance. Evidence is retained privately under `audit-results/release-2026-10-18/`; the retained implementation corresponds to `mvv-mobile.json`, not the discarded experiment report `mvv-mobile-final.json`.

## Production and account checks

- PASS — One authorized, labelled MVV audit enquiry was submitted on 18 October. Netlify Forms displayed the matching verified record at 14:50, with the expected project and consent fields. No repeat submission is needed.
- PENDING — Email arrival at the configured notification recipient has not been confirmed by the owner. Backend capture alone does not establish email delivery.
- OBSERVATION — The live frontend conservatively reported that receipt could not be confirmed, rather than claiming successful delivery from HTTP 200 alone. The stored Netlify record confirmed capture separately.
- PENDING — Live verification of the new canonical redirects must wait until a future authorized deployment. The existing extensionless information-page aliases returned duplicate 200 responses at the baseline check.
- LAST CONFIRMED, 18 October — Search Console showed the homepage indexed with the expected canonical. Indexing requests for all four project URLs were accepted; acceptance does not mean indexing. The sitemap showed Success, last read 17 October, with nine pages discovered.
- BLOCKED — A later Search Console progress recheck could not attach to the existing browser tab because the browser automation focus command timed out. No newer indexing outcome is claimed.

## Future release and rollback

After an explicit instruction and credit availability check, publish the consolidated release once. Verify the three redirect status codes and destinations, important page HTTP responses, canonical/robots/sitemap behavior, contact links and walkthrough behavior. Do not repeat a live enquiry without separate authorization.

The preceding production source is commit `482ffcda69b76db3269c0245a883a73654b0baf2`. Preserve it as the recovery reference; use Netlify's previous deploy only if a rollback is required and authorized. Continue performance work locally and batch changes to conserve deployment credits.
