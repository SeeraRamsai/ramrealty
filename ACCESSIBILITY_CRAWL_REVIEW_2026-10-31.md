# Accessibility and crawlability recheck

Checked 31 October 2026 against the local redesign and the existing public website. Fixes are local; nothing was pushed or deployed. No real enquiries, indexing requests or account changes were made.

## Result

All 15 local pages score **100 for Lighthouse accessibility and best practices**. All 13 indexable sitemap pages score **100 for Lighthouse SEO**. The 404 and enquiry-follow-up pages retain `noindex` and were intentionally excluded from SEO scoring. The final reports contain no failed audits, including the accessible-name diagnostic.

This is an automated audit with scoped keyboard and visual checks, not a certification of full WCAG compliance. Caption/transcript coverage remains incomplete.

## Issues found and fixed

- Darkened the shared teal from `#087f83` to `#076d70`. Small badge and accent text previously had approximately 4.35:1 contrast on the pale teal surface; it now has approximately 5.54:1.
- Overrode legacy pale FAQ introduction and answer colours left over from the dark design. The corrected body colour is approximately 5.76:1 against the page background.
- Corrected video-quality labels and enquiry privacy text that retained low-contrast colours.
- Removed the redundant brand-link `aria-label`, allowing the accessible name to contain the full visible brand and tagline. This fixes the visible-label/name mismatch while keeping the existing logo decorative inside the named link.
- Added a reusable crawl-discovery check and documented the local Lighthouse audit command.

The original Lighthouse homepage accessibility score was 95, FAQ 95 and MVV 96. Final scores are 100 after the corrections. Before-fix evidence is retained under `audit-results/accessibility-2026-10-31/before-fixes/`.

## Verification

| Check | Result |
|---|---|
| Lighthouse accessibility | 100 on all 15 pages |
| Lighthouse best practices | 100 on all 15 pages |
| Lighthouse SEO | 100 on all 13 indexable pages |
| HTML link discovery without JavaScript | All 13 sitemap pages reachable from the homepage |
| General site audit | 1,114 checks; no errors |
| Metadata, social previews and project hero checks | 223 checks; no errors |
| Listing consistency | 52 checks; no errors |
| Enquiry and video regressions | Passed using local tests; no production submission |
| Shared stylesheet freshness and whitespace | Passed |
| Keyboard skip link | Enter focuses `main-content` |
| Mobile menu | Opens using the keyboard; native summary retains focus |
| Sample mobile form | Visible labels on all six non-honeypot controls; required empty fields invalid; no overflow at 320px |
| Video initial loading | No attached video sources before an explicit Play action |
| Corrected FAQ mobile view | Readable dark text; no horizontal overflow at 320px |

Lighthouse 13.5.0 used the default mobile configuration. Some runs reported a slower-than-expected test CPU. This limits performance interpretations and does not change the recorded accessibility/SEO results. Screen-reader use, every active-video state and every possible device/browser combination were not exhaustively tested.

## Homepage performance sample

One fresh mobile performance run, after the other audit processes finished:

| Metric | Local result |
|---|---|
| Performance score | 78/100 |
| First Contentful Paint | 1.0 s |
| Largest Contentful Paint | 2.0 s |
| Speed Index | 1.5 s |
| Cumulative Layout Shift | 0 |
| Total Blocking Time | 920 ms |

Performance is not an all-clear: the blocking-time result needs further investigation. The measured main-thread work is mostly style/layout (about 1,693 ms), while script evaluation is about 54 ms. The recorded network requests contain no application JavaScript download, so a JavaScript-bundle explanation is not established. This performance run had no Lighthouse warnings, but it is still a single localhost lab sample, not production field Core Web Vitals. Do not equate TBT with INP. The report is `audit-results/accessibility-2026-10-31/home-performance.json`.

## Public website findings

The public site currently serves the earlier version, not the local redesign:

- Homepage, robots and sitemap return HTTP 200.
- The robots file allows crawling and declares the canonical sitemap.
- The live sitemap contains nine URLs; the local sitemap contains 13, including the four new area guides.
- A sampled new guide, `/locations/madhuravada/`, currently returns HTTP 404 publicly. It works locally and is reachable in the local HTML link graph.
- `/about`, `/faq` and `/privacy` still return HTTP 200 alongside their `.html` versions. The matching forced 301 rules already exist locally in both `netlify.toml` and `dist/_redirects`; their hosted behaviour needs verification after publication.
- HTTP and www entry points redirect with 301. The sampled genuinely missing page returns 404.
- Sixty sampled public assets had no HTTP errors. TLS validation passed.

Publication is needed before search engines can discover the new guides or see these accessibility corrections. Google indexing status and search rankings were not re-established by these HTTP checks.

## Remaining work

1. Provide verified captions for speech and appropriate media alternatives for meaningful visual information in the supplied walkthroughs. Current preview descriptions are not a substitute for full media alternatives.
2. After an explicitly requested publication, verify the new guide URLs, the 13-URL sitemap, canonical redirects and production forms. Confirm Google indexing separately in Search Console.
3. Investigate the homepage's elevated lab blocking time and validate performance in a stable production test environment. No performance improvement is claimed from the accessibility corrections.

## Evidence

- Final Lighthouse reports and scores: `audit-results/accessibility-2026-10-31/summary.json` and adjacent per-page JSON files.
- Public HTTP crawl and TLS results: `audit-results/public-2026-10-31/crawl.json`.
- Live guide response: `audit-results/accessibility-2026-10-31/live-location-headers.txt`.
- Corrected screenshots: `audit-results/accessibility-2026-10-31/faq-mobile-after.jpg` and `home-desktop-after.jpg`.
- Repeatable checks: `tools/check-crawlability.py` and `tools/run-accessibility-review.py`.
