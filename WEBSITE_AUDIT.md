# Ram Realty website audit ? 15 October 2026

## Status
Latest local update: [LOCALITY_AND_PRICE_UPDATE.md](LOCALITY_AND_PRICE_UPDATE.md). All four project side images are verified distinct illustrations. Editable site copy now uses Madhuravada; MVV starts at ₹5,300/sq ft of total saleable area. Current checks: 557 site + 171 SEO/hero + 48 locality/rate checks, zero errors; homepage and four project pages score 100 for automated SEO/accessibility/best practices locally. Public Google locality query did not establish indexing. Nothing has been pushed or deployed.

Latest local SEO/hero follow-up: [SEO_REVIEW_2026-10-15.md](SEO_REVIEW_2026-10-15.md). It refines metadata/topics, adds homepage WebSite data and contextual links, and promotes four distinct existing concept illustrations into project heroes. All changes remain uncommitted and undeployed. Final batch checks: 558 site checks plus 171 SEO/hero checks; four local mobile Lighthouse SEO/accessibility scores of 100. Backlinks remain unverified; no external posts or links were created.

New public-only re-audit: [PUBLIC_WEBSITE_AUDIT_2026-10-15.md](PUBLIC_WEBSITE_AUDIT_2026-10-15.md). Its source fixes are local, uncommitted and undeployed; the historical deployed checks below remain separate. Release and recurring checks: [WEBSITE_MAINTENANCE.md](WEBSITE_MAINTENANCE.md). No push or deployment is authorized until the owner explicitly requests it.

The audited code fixes and mobile/banner enhancements are deployed through commit e65a943 on 15 October 2026. See the final release section for production verification; earlier sections document historical checks and limitations. This is a source and HTTP audit; it is not a completed visual, accessibility-conformance, security-penetration or legal-compliance audit.

## Completed fixes
1. Shared keyboard skip links and visible focus outlines across all 11 HTML pages, including the new 404 page. Added reduced-motion handling and mobile form font sizing.
2. Restored homepage navigation links on mobile using a wrapping header. Added minimum touch heights for navigation and project call buttons.
3. Removed restrictive personal-name regex while preserving required and length constraints. Restricted layout choices to 3 BHK on Maple Woods and Utkarsha pages, matching those listings.
4. Enquiry POST now uses the root endpoint, preserving Netlify form identity and no-JavaScript thank-you redirect. Added explicit browser validity checking and a clearer success button label. Delivery is still subject to Netlify Forms configuration.
5. Replaced inline campaign scripts with a shared, storage-error-tolerant script. Campaign field values are bounded to 250 characters. No new trackers were added.
6. Created smaller display versions of the hero, card/poster artwork and logo. Original sharing/download artwork remains available. Homepage hero: 2,228,552 to 303,090 bytes (86% smaller). Maple Woods card: 2,452,174 to 198,323 bytes (92% smaller). Logo: 989,998 to 21,491 bytes (98% smaller).
7. Added Netlify response headers: nosniff, same-origin framing, strict-origin referrers and disabled unused camera/microphone/geolocation permissions. Added a one-day revalidated asset cache policy. Headers become active upon deployment.
8. Added branded 404 recovery links. Corrected question-mark separators in the Utkarsha facts. Replaced unsupported ?Verified project information? wording with ?Project information? on three posters.

## Verification
- Run `python tools/audit_site.py`: 320 checks, zero errors. Covers local URLs/assets/fragments, unique IDs, one main/H1, image alt presence, form metadata, JSON-LD syntax, sitemap XML and Netlify TOML.
- `node --check` passed for property-enquiry.js, campaign-fields.js and video-player.js.
- `git diff --check` passed.
- Live homepage, robots.txt and sitemap.xml returned HTTP 200. HTTP and www variants resolved to https://ramrealty.in/. A nonexistent URL returned HTTP 404.
- No real enquiries were submitted and no production account settings were changed.

## Required next checks
1. Deploy the reviewed dist directory and netlify.toml to the existing Netlify site. Recheck the new response headers and branded 404 after deployment.
2. Verify Netlify form detection, the union of fields across all four property-enquiry forms, notification recipients and delivery. Submit clearly identified tests from each form on a preview deployment; verify received fields in the dashboard. Validate success, retry and no-JavaScript flows. This requires hosting account access.
3. Use an available browser to inspect desktop and 320/375/768-pixel layouts, keyboard traversal, sticky CTA overlap, poster readability, video loading/error behavior and phone/WhatsApp links. Browser tooling was unavailable in this session; no visual or interactive pass is claimed.
4. Run mobile/desktop Lighthouse and field Core Web Vitals after deployment. Image savings are measured file-size improvements, not measured speed scores.
5. Search Console/Bing: verify ownership, indexing exclusions and sitemap processing. A public search returned no results in this session; this does not prove the site is unindexed.
6. Reconfirm inventory, prices, possession, RERA references, representative imagery and approvals against current owner/developer records. This audit does not validate those business facts. Review broad ?confirmed? claims against retained evidence.
7. Review privacy retention wording with actual business practice and verify enquiry access permissions. Do not add analytics or ad pixels without updating disclosures and reviewing consent requirements.
8. Consider video compression and captions/transcripts after reviewing source quality and spoken content. Videos already load only on explicit request; no arbitrary recompression was performed.

## Reproduce
No build or dependency installation is required. Publish directory: dist. Local static preview: `python -m http.server 8000 --directory dist`. Local HTTP previews do not process Netlify Forms.


## Follow-up re-audit - 15 October 2026

### Resolved locally
- Maple Woods: removed unqualified ready-to-move claims from page copy and search/share metadata. Current completion and handover are awaiting documentary confirmation. The referenced proposed completion date of 9 July 2027 is retained as a reported record detail, not newly verified evidence of readiness.
- Maple Woods: approximately 1,750 sq ft is now a reported figure with unconfirmed area basis. The page requests the unit-specific carpet/built-up/common/parking breakdown and chargeable area. Updated the homepage card to flag this too. The supplied building plan is not treated as proof of the offered flat's area.
- Corrected the stale Maple Woods thumbnail disclaimer to match the current supplied-footage preview.
- Owner confirmed PM Palem is the office location and confirmed 8 AM-11 PM daily contact hours. Homepage footer labels now explicitly say Office location and Contact hours.

### Fresh verification
- Live robots.txt: HTTP 200, text/plain, allows crawling and advertises https://ramrealty.in/sitemap.xml.
- Live sitemap.xml: HTTP 200, application/xml, parses successfully with nine URLs.
- Fresh PageSpeed API requests for both mobile and desktop: HTTP 429 Too Many Requests. No performance score or Core Web Vitals pass is claimed.
- Local validation after edits: 320 checks passed. These are structural/source checks, not rendered browser tests.

### Still open
- Deploy and verify these local corrections on the live site.
- Search Console URL inspection, Google-selected canonical and sitemap processing require authenticated property access; public file accessibility does not prove indexing.
- Netlify Forms detection, submission receipt and notification delivery require dashboard/preview access. No live enquiry was submitted.
- Independent verification of current Maple Woods RERA record, completion/occupancy/handover evidence and exact flat area remains outstanding. The wording now makes those uncertainties visible.
- Fresh rendered mobile/desktop performance measurements and interactive/visual testing remain outstanding.


## Five requested checks - latest execution, 15 October 2026

### 1. Maple Woods record check
Official AP RERA registration P03280035014 was reviewed. Source and numeric area/status evidence are saved in `audit-results/maple-rera-evidence.json`. The local listing now explains the difference between the registered carpet and total areas. The project ranges do not establish the specific offered flat's chargeable area. Current completion/handover remains unverified; the local page does not claim ready-to-move status. The live URL still serves the older wording, so deployment is outstanding.

### 2. Search visibility
All five requested live URLs returned HTTP 200, self-referencing declared canonicals, and no page-level noindex meta or X-Robots-Tag. Live robots.txt and sitemap.xml are accessible. Evidence: `audit-results/live-url-checks.json`. Google-selected canonical, actual indexing and sitemap submission/processing remain unverified without Search Console URL Inspection. Public HTTP checks cannot establish those results. A Search Console reporting integration was found but is not connected; no Netlify integration was found. Browser inventory is empty. Owner has requested setup instructions and was provided the official desktop browser-extension setup.

### 3. Fresh Lighthouse 13.5 measurements

| Target | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Live homepage mobile | 41 | 100 | 96 | 100 | 17.2 s | 3,370 ms | 0.004 |
| Live homepage desktop | 79 | 100 | 96 | 100 | 3.19 s | 124 ms | 0.0009 |
| Corrected local homepage mobile | 75 | 100 | 100 | 100 | 4.55 s | 325 ms | 0 |

These are single-run lab scores, not field Core Web Vitals. Both mobile runs warned that the host CPU was slower than expected. Localhost and production differ in network/hosting behavior and injected scripts, so the comparison does not isolate image optimization. Raw JSON and standalone HTML reports are in `audit-results/`. Lighthouse recorded roughly 8.4 MB live versus 0.94 MB locally. The live homepage injects a Netlify HUD script, which is absent from the local preview; its contribution was not isolated.

Additional local fixes from the report: MVV display artwork reduced from 2,476,220 to 169,279 bytes while retaining the original artwork file. Added an explicit PNG favicon on all HTML pages to address the live favicon 404 console error. Updated code and images are not yet deployed. A local score of 75 and LCP of 4.55 seconds still leave performance work to do; no performance pass is claimed.

### 4. Safe enquiry test
`node tools/test-enquiry.mjs` passed for all four project handlers against a local-only HTTP receiver: eight requests covering server error, successful retry, duplicate prevention and preservation of basic property/contact/consent fields. Result: `audit-results/form-local-tests.json`. DOM stubs were used; this is not browser form validation, a test of every optional field, Netlify persistence or notification delivery. The live pages contain form-name fields, which alone do not prove backend receipt. No real lead was submitted. Netlify dashboard access is still needed for end-to-end receipt and notification checks.

### 5. Footer
Owner confirmed PM Palem is the office location and 8 AM-11 PM daily are customer-contact hours. Local footer labels explicitly reflect that. Live footer has not yet received this clarification.

### Validation
331 local structural checks pass after adding favicons; JavaScript syntax and whitespace checks pass. Browser account checks and deployment remain open.

### Walkthrough-page Lighthouse check
Fresh live mobile performance score: 95/100. LCP: 1.82 s. MP4 requests observed during the audit: 0. No video player was deliberately activated; this confirms deferred fetching for this run, not successful full playback. Raw report: `audit-results/videos-mobile.report.html`.


## Authenticated dashboard checks - 15 October 2026
Browser connection succeeded. Read-only inspection completed using separate tabs because the original tabs were claimed by another browser session.

- Netlify ramrealty: form detection is enabled; property-enquiry is active. Its verified submissions list contains one Vaisakhi West Winds submission dated 14 October. This establishes historical receipt for that submission, not current end-to-end delivery for all four forms.
- Netlify Submission notifications tab displays No webhooks set up yet. No notification destination was confirmed or configured. Inbox receipt was not tested.
- Netlify production remains at commit b5ba6a8. Local audit fixes remain undeployed.
- Search Console signed-in account shows the welcome screen and Add property rather than an existing property. The Select property type dialog offers Domain (DNS verification) or URL prefix (multiple verification methods). No property was created and no ownership verification was performed. URL Inspection and sitemap-submission checks cannot proceed until an existing verified property is accessible or setup is completed.
- No live enquiry was submitted; no account settings, permissions, DNS or production deployment were changed. Both audit tabs were kept open for follow-up.
- Machine-readable evidence: audit-results/dashboard-checks.json.


## Search Console setup completed - 15 October 2026

Owner approved publishing the Google verification TXT and verifying the signed-in account. Added one TXT record at ramrealty.in in Netlify DNS, keeping the two existing NETLIFY records. Google confirmed ownership via Domain name provider. Domain property: sc-domain:ramrealty.in, owner account ramsairams123@gmail.com. Retain the TXT record to keep ownership verification.

Submitted https://ramrealty.in/sitemap.xml. Search Console reports Success, last read 15 October 2026, nine discovered pages and zero discovered videos. Discovered pages are not necessarily indexed pages. New property performance/indexing overview reports are processing.

| Inspected URL | Google's current status |
| --- | --- |
| https://ramrealty.in/ | Discovered - currently not indexed |
| https://ramrealty.in/mvv-gv-grand/ | Discovered - currently not indexed |
| https://ramrealty.in/vaisakhi-west-winds/ | URL is unknown to Google |
| https://ramrealty.in/a-square-maple-woods/ | Discovered - currently not indexed |
| https://ramrealty.in/utkarsha-capital-towers/ | URL is unknown to Google |

All five inspections show last crawl, user-declared canonical and Google-selected canonical as N/A. Public page source already declares matching canonicals, but Google has no crawl/canonical values to report yet. The newly read sitemap includes the project URLs; URL Inspection reporting may not yet reflect that discovery.

Attempted a manual homepage indexing request. Google reported a submission error and inability to connect to reCAPTCHA. No successful manual request is claimed. The accepted sitemap remains the verified discovery route. No CAPTCHA was solved or bypassed.

Proof: audit-results/search-console-verified.png and audit-results/search-console-sitemap-success.png. Detailed records: audit-results/search-console-setup.json and audit-results/search-console-url-inspections.json. Website code changes remain local; this setup changed only DNS verification and Search Console configuration. Google determines crawling, indexing and rankings; setup does not guarantee inclusion.


## Manual indexing request accepted - 15 October 2026
Rechecked Search Console after the owner's manual intervention. Google displays Indexing requested and confirms the URL was added to a priority crawl queue. The underlying inspection remains Discovered - currently not indexed; acceptance does not establish indexing. Do not repeatedly resubmit the same URL to change priority. Proof: audit-results/indexing-request-accepted.png. This updates the earlier failed-request result.


## Production release completed - 15 October 2026

### Deployment and verification
Pushed to SeeraRamsai/ramrealty main. Release commits: dc39fed (site fixes), e1b3678 (headers in publish directory), 209cad2 (Netlify-processed form selector), b2703e7 (complete shared form field schema). Production serves the optimized assets, corrected Maple Woods wording, footer, accessibility styling and branded 404. Response headers verified live: nosniff, SAMEORIGIN framing, strict-origin referrers, disabled unused permissions and one-day revalidated asset caching. Headers now live in dist/_headers because root TOML header rules were not appearing in production. No root-cause claim is made for that processing difference.

335 local structural/schema checks passed, enquiry-handler regression tests passed, JavaScript syntax and whitespace checks passed. Browser checks at 320 px covered all 11 HTML pages with no horizontal overflow or broken images observed; homepage navigation was also inspected at 375 px and desktop. These checks cannot guarantee an error-free site on every device.

### Production enquiry delivery
All four projects have labelled audit enquiries received in Netlify. Standard no-JavaScript-style redirect delivery worked on the first MVV test. Production testing revealed Netlify strips form detection attributes, so the handler now identifies the stable hidden form-name field and uses a versioned script URL. Inline success is verified on all four projects after that fix.

Production records also revealed that the shared form schema lacked MVV budget and preferred-area fields. Every form now declares the same field union using empty hidden fields where not applicable. Final approved MVV test confirmed Budget=Still exploring and Location=Madhurawada are persisted. Added a regression check for schema consistency. Five total labelled audit submissions were made; they were left in Netlify for traceability and were not deleted.

New-enquiry email notifications are configured for ramsai.seera72@gmail.com. The owner confirmed receiving the audit notifications. This updates all earlier unverified-delivery notes. Evidence is local in audit-results/deployment-verification.json and the notification/receipt screenshots.

### Measured production performance
| Profile | Before | After | Accessibility / Best practices / SEO after |
| --- | ---: | ---: | --- |
| Mobile performance | 41 | 62 | 100 / 100 / 100 |
| Desktop performance | 79 | 97 | 100 / 100 / 100 |

Mobile LCP improved from 17.2 s to 4.24 s; desktop LCP is 1.02 s. Mobile page transfer dropped from about 8.4 MB to 0.94 MB. The mobile run warned about a slow host CPU; these are single-run laboratory results, not field Core Web Vitals or a guarantee of user experience. Mobile LCP/TBT still need improvement. The reports were measured after the image/site deployment; subsequent header and enquiry-schema fixes did not change homepage layout or imagery.

### Remaining work
Google indexing is pending despite accepted homepage request and successful sitemap submission. Current handover evidence and exact offered Maple Woods flat area still require business documentation; the live copy now discloses that. Further mobile performance work and full-length video playback/caption verification remain opportunities, not completed guarantees.


## Mobile optimization, comparison and project banners - 15 October 2026

Published commit f73ec25 to main; live HTTP checks confirm the new content. Added responsive WebP sources with JPEG fallbacks for selected homepage/project imagery and responsive hero preload. Existing enquiry handling and schema were preserved. A new collapsible comparison table summarizes all four 3 BHK listings, retaining area-basis and possession qualifications and distinguishing additional charges from quoted rates. No new availability or completion verification is claimed.

Created four coordinated architectural concept banners with the built-in imagegen tool. Each project page now displays one labelled illustration with its project name and supplied description as accessible HTML. Captions explicitly state the images do not represent the actual project, views or amenities. Original project sources/downloads remain available. PNG masters: artwork/project-banners/ (local, not deployed). Prompt set: artwork/project-banners/README.md. WebP derivatives: dist/assets/responsive/, 640 and 1280 px per banner; small variants are about 20-26 KB. Banners are lazy-loaded below the existing hero.

Owner selected existing Netlify reporting only. No third-party analytics SDK, click-tracking requests or visitor identifiers were added. ENQUIRY_REPORTING.md documents dashboard/CSV reporting. tools/summarize-enquiries.py summarizes local CSV counts by project/source/campaign, excludes AUDIT TEST entries and does not print contact names or phone numbers. Its fixture check passed. Phone and WhatsApp clicks remain untracked, as documented; form counts are not unique visitors or qualified sales leads.

Validation: 384 structural, responsive-image and shared-schema checks passed; all four local enquiry-handler tests passed; syntax and whitespace checks passed. Browser review found no horizontal overflow or broken images on the five main pages at 320 px, and enquiry handlers attach on every project page. The comparison table opens without page-level overflow. Desktop and mobile banner layouts were visually reviewed. Live verification: all five main pages HTTP 200, one banner per project, 18 referenced WebP URLs HTTP 200 with image/webp content type, security headers preserved. No new live enquiries were submitted in this release.

Fresh production mobile Lighthouse: performance 92, accessibility 100, best practices 100, SEO 100; LCP 2.51 seconds, TBT 135.5 ms, CLS 0, transferred bytes 259,653 (about 260 KB). No run warnings and no console errors were reported. The previous production run scored 62 and transferred 937,328 bytes: approximately 72% fewer bytes in this comparison. Original pre-audit baseline was 41. These are single-run lab results, not field Core Web Vitals or a universal error-free guarantee. LCP is still close to the 2.5-second boundary.

Evidence: audit-results/webp-production-mobile.report.html, audit-results/banner-release-checks.json and the production banner screenshots. Full-resolution masters and test reports are excluded from Git; only web assets, code, prompts and reporting utilities were pushed.

Production desktop Lighthouse after this release: performance 98, accessibility 100, best-practices 100, seo 100. LCP 0.92 seconds. Run warnings: []. Raw report: audit-results/webp-production-desktop.report.html.


## Walkthrough loading, data and resource optimization - 15 October 2026

Release commit e65a943. Added separate low-data variants for all 12 active walkthroughs. The originals are unchanged and selectable. Total active-file footprint: 122.1 MiB original versus 47.2 MiB low-data, a 61.3% reduction; individual savings range from 55% to 68%. This compares full-file sizes, not bytes every visitor necessarily downloads.

Data-saver encoding: H.264 Main/yuv420p, maximum 640-pixel long edge, 24 fps, CRF 28, 450 kbps video cap, 48 kbps mono AAC, two-second keyframe target and faststart metadata. The existing originals already had faststart; the main file improvement is reduced transfer/decoder workload rather than a metadata relocation claim. All 12 outputs preserve duration within 0.2 seconds and audio presence and were decoded fully with FFmpeg error checking. This does not imply identical image quality or stereo audio: original quality remains available for fine detail.

Player behavior: no video element or source is attached until the visitor presses Play. The user-initiated click starts playback directly. Only one media element remains loaded. Opening another video, closing it, changing quality, hiding the page or moving the player far offscreen pauses/removes the source, invokes load() to abort the old media resource and removes the element. Playback position is remembered in page memory for reopening. No new analytics or external streaming service was added. Portrait footage uses a taller active player on phones. Versioned script/CSS URLs and new video filenames avoid the previous cached assets.

Validation: 420 structural/link/schema checks pass, video lifecycle regression tests pass and enquiry-handler tests remain green. Real local-browser playback verified data-saver and original quality, advancing currentTime with readyState 4, one active element after switching, zero attached media elements after closing, and no console errors. The actual gallery initializes all 12 players with Data saver selected and zero attached video elements. A 375 px playback check found no horizontal overflow. No exact RAM reduction, startup-time guarantee or full visual review of every frame is claimed; codec decode checks and representative playback are the available evidence.

Tooling and profile: VIDEO_OPTIMIZATION.md; tools/optimize-videos.py; tools/configure-video-pages.py; tools/test-video-player.mjs; tools/video-manifest.json. Production verification: commit e65a943 is pushed to main and the deployed gallery serves the versioned player and new mobile sources. All 12 optimized production video URLs returned HTTP 206 for a 1,024-byte range request with total lengths matching the manifest. The live gallery initialized 12 Data saver selectors with zero video elements and no horizontal overflow. The MVV data-saver clip played with readyState 4 and advancing playback time at 362 x 640 resolution. A second live player was opened, but the browser disconnected before its resulting state could be inspected; switching/unloading was verified locally. Evidence: audit-results/video-production-range-checks.json and audit-results/optimized-video-live.png.
