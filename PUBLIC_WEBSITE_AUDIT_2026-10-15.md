# Ram Realty public website audit and local improvement report

Checked **15 October 2026**. Website: https://ramrealty.in/. Baseline revision: `e65a943273604e6dee4ae87ac9147034b3656eda`. All changes in this report remain **local, uncommitted and undeployed**. No Git push, hosting deployment, enquiry, message, DNS change, purchase or account login was performed for this audit.

Subsequent local SEO/hero refinement is recorded in [SEO_REVIEW_2026-10-15.md](SEO_REVIEW_2026-10-15.md). That follow-up supersedes the local metadata/hero appearance and source-check counts below; the production baseline and historical lab evidence in this report remain unchanged.

## Executive findings

The public site is accessible and its core discovery journey works. The nine sitemap pages return HTTP 200; a made-up URL returns a genuine 404; all 64 discovered same-origin asset URLs and ten linked external project/reference URLs responded successfully to HEAD requests. Telephone and WhatsApp links consistently target the published business number, +91 77992 51808. No P0 outage or confirmed P1 journey/indexing blocker was found in the checks performed. This does not prove enquiry delivery, regulatory compliance or complete accessibility/security.

The most useful verified fixes were a West Winds enquiry mismatch (2 BHK offered on a 3 BHK listing), unsupported structured-data property relationships, duplicate information-page aliases, oversized preview images and inaccurate privacy wording about referrer collection. These have local fixes, with routing behavior still pending a future authorized hosted release.

Search visibility is weak in the observations collected: Google `site:ramrealty.in` showed no matching documents in the connected browser, and a Maps business search showed other businesses. These are session-specific observations, not definitive indexing diagnostics. The public PSI API returned HTTP 429, so field Core Web Vitals could not be assessed. Production Lighthouse tests found mobile MVV LCP slightly above the 2.5-second goal and variable lab blocking time. Property availability and exact-unit documentation still need the owner's current evidence.

Evidence is stored locally under `audit-results/public-2026-10-15/`. Automated data, manual observations and assumptions are identified below. Historical account checks in `WEBSITE_AUDIT.md` are not presented as newly verified public evidence.

## 1. Baseline inventory

All inventory observations below were checked on 2026-10-15 using direct HTTP GET; titles are from returned HTML. URLs are absolute public pages, not inferred account routes.

| URL | Title | Purpose / primary action | Status | Result |
|---|---|---|---|---|
| https://ramrealty.in/ | Ram Realty \| Homes and Apartments in Visakhapatnam | Discover four projects, compare, call or WhatsApp | 200 | PASS |
| https://ramrealty.in/mvv-gv-grand/ | MVV-GV Grand 3 BHK Homes in Madhurawada \| Ram Realty | MVV details, plans, footage and enquiry | 200 | PASS |
| https://ramrealty.in/vaisakhi-west-winds/ | Vaisakhi West Winds 3 BHK Apartments \| Ram Realty | Specific reported West Winds unit and enquiry | 200 | PASS |
| https://ramrealty.in/a-square-maple-woods/ | A Square Maple Woods 3 BHK Apartments \| Ram Realty | Maple Woods details, area/status qualifications and enquiry | 200 | PASS |
| https://ramrealty.in/utkarsha-capital-towers/ | Utkarsha Capital Towers 3 BHK \| Madhurawada \| Ram Realty | Reported unit, plans and enquiry | 200 | PASS |
| https://ramrealty.in/videos/ | Visakhapatnam Property Walkthrough Videos \| Ram Realty | Twelve clips, four linked project destinations | 200 | PASS |
| https://ramrealty.in/about.html | About Ram Realty \| Visakhapatnam Property Consultant | Business identity, approach and contact | 200 | PASS |
| https://ramrealty.in/faq.html | Property Buyer FAQs \| Ram Realty Visakhapatnam | Buyer questions and contact guidance | 200 | PASS |
| https://ramrealty.in/privacy.html | Privacy Notice \| Ram Realty | Enquiry data explanation and contact choices | 200 | PASS; wording issue below |
| https://ramrealty.in/thank-you.html | Enquiry received \| Ram Realty | No-JavaScript form confirmation destination | 200 | PASS for availability only; no submission tested |
| https://ramrealty.in/404.html | Page not found \| Ram Realty | Direct error-document resource; noindex | 200 | NOT APPLICABLE as an actual missing URL |
| https://ramrealty.in/audit-missing-page-20261015/ | Page not found \| Ram Realty | Actual missing-route test | 404 | PASS |

The discoverable aliases `/about`, `/faq` and `/privacy` also return 200 with duplicate content; `/thank-you` is a noindex confirmation alias. The sitemap has nine URLs and excludes confirmation/error pages. There is no standalone contact page, search, filter, pagination, login, carousel or interactive map in the inspected public interface. Simple four-project discovery is reasonable; absence of those features is not itself a failure.

Main navigation links to the home collection, walkthroughs, About and WhatsApp. Project cards and the comparison table lead to all four project pages; project footers return to the collection and information pages. Calls, WhatsApp and project forms are the primary conversion paths. Public identity: Ram Realty, consultant Ramsai Seera, PM Palem office locality, Visakhapatnam, contact hours 8 AM–11 PM daily. Coverage stated by the site: Madhurawada, Sai Priya Layout, PM Palem, Yendada, Kommadi and nearby Visakhapatnam areas. Physical office attendance, full street address and listing eligibility were not independently established.

The web-search fetcher initially returned an internal error, and a sandboxed HTTP run initially had a socket restriction. A normal Chrome visit and an authorized direct HTTP retry succeeded. These were tool limitations, not website outages. Failed-tool evidence is retained in `crawl-sandbox-blocked.json`; successful public evidence is `crawl.json`.

## 2. Goals, search intent and content plan

Audience and goals are inferred from visible content: people comparing owner-share apartments, primarily 3 BHK homes around Madhurawada, who need enough reliable detail to request a callback or visit. This is an interpretation of the pages, not an analytics finding. No search volumes, traffic or ranking estimates are asserted.

| Page | Visitor intent | Main topic | Related terms supported by the site | Desired action |
|---|---|---|---|---|
| Homepage | Compare local home options | Owner-share homes in Visakhapatnam | Madhurawada, 3 BHK, Sai Priya Layout, PM Palem, listing comparison | Open a relevant property |
| MVV | Research named project and costs | MVV–GV Grand owner-share 3 BHK | 1,390–2,004 sq ft published range, total-saleable price basis, expected Dec 2028, amenities/maintenance | Request unit availability and cost sheet |
| West Winds | Check the offered apartment | Vaisakhi West Winds 3 BHK | Flat 103, Block 4, 1,640 sq ft total saleable, west-corner-facing, stated ready-to-move status | Confirm exact unit and visit |
| Maple Woods | Understand uncertain area/status | A Square Maple Woods 3 BHK | Sai Priya Layout, reported ~1,750 sq ft, area breakdown, handover evidence | Obtain exact-flat documents |
| Utkarsha | Check reported remaining unit | Utkarsha Capital Towers 3 BHK | Bakkannapalem, 1,874 sq ft saleable, 5th floor, east-facing, amenities | Confirm availability and complete price |
| Walkthroughs | See supplied footage | Visakhapatnam property videos | Data saver, project details, owner-provided footage | View matching project or contact |
| About | Assess who handles the enquiry | Ram Realty / Ramsai Seera | Visakhapatnam property consultancy, service areas | Browse or call |
| FAQs | Resolve buying questions | Enquiry, area basis and charges | Cost sheet, carpet versus saleable area, site visit, written terms | Compare and ask informed questions |
| Privacy | Understand data handling | Property enquiry privacy | Contact consent, Netlify Forms, optional UTM fields | Make an informed contact choice |

Actual search evidence included a developer result for `MVV GV Grand Madhurawada 3 BHK` and portals listing `3 BHK owner share flats Madhurawada`. These support the relevance of named-project and locality/configuration topics, not any search-volume claim. Example observed destinations: https://www.mvvbuilders.com/ and https://housing.com/in/buy/visakhapatnam/madhurawada-gid/3bhk-flats-fid/. Details or prices from other listings were not copied into this site.

Use the existing homepage as the collection/locality overview and each project page for its distinct inventory. Do not create near-identical pages for every neighbourhood. Useful future additions, **PENDING**, are a genuine contact/visit section once meeting arrangements are verified, current exact-unit plans and dated footage with permission, and accurate captions/descriptions. Additional video-only properties should get detail pages only when useful current listing facts exist; do not manufacture thin pages. FAQs were expanded locally with two concise answers about comparing area bases and reading the full cost sheet, linked to the existing comparison and Maple Woods qualification.

## 3. Prioritized defects and local changes

All rows checked 2026-10-15. `FAIL → PASS locally` means the defect remains in production until an authorized release. No recommendation is counted as a deployed change.

| ID / priority | Affected page / reproduction and evidence | Expected / observed | Local change and verification | State |
|---|---|---|---|---|
| F1 / P2 | West Winds → enquiry → Preferred layout | Only described listing configuration; live form also offered 2 BHK | Removed 2 BHK; browser shows only placeholder + 3 BHK at 320 px and desktop | FAIL live → PASS locally |
| F2 / P2 | Four project JSON-LD blocks | Valid property relationships; `address` and `broker` were attached directly to `RealEstateListing`, a WebPage subtype | Address moved under `about: ApartmentComplex`; Ram Realty uses `publisher`; added matching breadcrumbs. JSON parses and targeted domain/structure checks pass | FAIL live → PASS locally; independent validator coverage limited |
| F3 / P2 | GET `/about`, `/faq`, `/privacy` and their `.html` pages | Consistent canonical signals; both variants served 200 and live links were rewritten to aliases | Preserved existing `.html` canonicals/sitemap; disabled Pretty URLs processing; three forced 301 alias rules. Config parses, targets exist, redirect graph has no loops | FAIL live → PENDING hosted runtime verification; config PASS locally |
| F4 / P2 | Walkthrough gallery / project posters / brand image; Lighthouse image diagnostics | Appropriate image delivery; large JPEGs and PNG logo downloaded for small displays | Added 640/1200 WebP previews with JPEG fallback and a WebP logo with PNG fallback. Images decode and browser selects WebP; video hide/show still works | FAIL optimization check live → PASS locally |
| F5 / P2 | Privacy notice and source campaign script | Explain actual collection; notice claimed referrer URL collection absent from implementation | Removed that claim from privacy and README; retained truthful UTM/session-storage explanation. Script/form fields manually compared | FAIL live → PASS locally |
| F6 / P2 | Footer links at 320 px; previous heights ~17 px | Comfortable discrete touch links | Footer/information-nav links have 44 px height; homepage call link enlarged; footer paragraphs constrained to content width | PASS local improvement; no blanket claim all inline links failed WCAG |
| F7 / P2 | Project pages / homepage Utkarsha card | Distinguish current reported unit from broad project range | Added visible breadcrumbs and truthful website-review dates, without claiming new seller verification; card now says reported 1,874 sq ft unit | PASS locally; publication PENDING |
| F8 / P2 | Homepage image preload / MVV description | Explicit preload priority and consistent area caveat | Added high priority to existing hero preload; MVV description now distinguishes published range from chargeable total-saleable area | PASS locally |
| F9 / P2 | Three non-MVV form helper messages | Explain visitor outcome | Replaced hosting implementation wording with “Your details will be used to respond to this property enquiry.” | PASS locally |
| F10 / P2 | Property availability, cost/possession claims | Current unit-specific documents | Qualification preserved; exact inventory, charges and handover evidence cannot be established from page copy alone | PENDING owner evidence; not silently changed |
| F11 / P2 | Prerecorded footage on gallery/project pages | Accurate alternatives for speech/essential visual information where required | No captions/transcripts invented; existing absence acknowledged. Speech, sound and visual-description needs require footage review | PENDING media accessibility review/remediation |

The current public AP RERA link for Maple Woods was retrieved successfully. It identifies MAPLE WOOD / P03280035014, proposed completion `09/07/2027`, and includes the area values referenced by the site's qualification. This confirms that the public record supports retaining a distinction between proposed completion and actual handover. It does **not** prove that the offered flat is complete, available, or exactly matches a project-wide area range. Evidence: `maple-public-record.json` and its cached response. Do not remove the qualification without current unit-specific supporting documents.

Proposed business-confirmed replacements, still **PENDING**:

- Availability: “Availability confirmed with [identified relevant party] on [actual date]: [specific flat/floor/facing].” Use only after verification; do not publish brackets.
- Area: “Flat [number]: carpet [verified amount], other area components [verified breakdown], chargeable area [verified amount], per [identified document/date].” Do not label ~1,750 sq ft as carpet area without evidence.
- Handover: describe the actual supporting completion/occupancy/handover evidence and date, or retain the current unconfirmed wording.

## 4. Functional and accessibility coverage

Manual browser: connected Chrome on Windows. Public homepage and all four projects, gallery, About, FAQ and privacy reviewed at **320 × 800**; local equivalents checked at **320 × 800**. Local desktop checks used **1366 × 900**, with project/form/gallery visual review and multi-page DOM/layout checks. Headless Chrome 155 was used separately by Lighthouse. Other browsers/devices, real touch hardware, screen-reader testing and actual browser zoom levels were not tested; 320 px reflow is not a claim of complete zoom coverage.

| Check | Method / evidence | Checked | Result |
|---|---|---|---|
| Homepage → project discovery → MVV details → enquiry option | Actual link navigation in Chrome; MVV form visible | 2026-10-15 | PASS |
| Main navigation, footer and comparison expansion | Chrome; comparison table scrolls in its own region without page overflow | 2026-10-15 | PASS |
| Telephone / WhatsApp destinations | Public HTML links consistently point to business number; no calls/messages initiated | 2026-10-15 | PASS destination checks; communication delivery NOT APPLICABLE |
| Asset / download references | 64 unique same-origin assets HEAD 200; ten linked external project/reference URLs HEAD 200 | 2026-10-15 | PASS availability; document accuracy/ownership not established by HTTP |
| Empty form behavior | Public MVV empty Submit blocked; focus moved to required name; no enquiry sent | 2026-10-15 | PASS scoped validation |
| Success, error/retry and duplicate protection | Existing local enquiry regression: eight requests only to localhost, all four projects passed | 2026-10-15 | PASS local behavior; real delivery BLOCKED in this scope |
| Initial video state | Public gallery twelve players, zero video elements; local gallery same | 2026-10-15 | PASS |
| Playback / switching / closing with new posters | Local clip reached readyState 4 with advancing time; switching kept one video; closing left zero videos and restored Play focus | 2026-10-15 | PASS representative local playback; full frame/audio review PENDING |
| Narrow-screen layout | All nine public/local page types inspected; no page-level overflow or broken loaded images | 2026-10-15 | PASS scoped reflow |
| Keyboard / visible focus | Homepage keyboard traversal showed focus-visible; skip links/main targets present; video close returns focus | 2026-10-15 | PASS sampled controls; exhaustive keyboard/screen reader review PENDING |
| Headings / landmarks / image alternatives | Automated crawl one H1 and main per HTML page, zero missing `alt` attributes; representative browser inspection | 2026-10-15 | PASS structure; quality of every alt not fully assessed |
| Labels / required fields / consent | Browser reads labels and native validity; all four forms have required consent and honeypot | 2026-10-15 | PASS observable markup; server enforcement not publicly verified |
| Contrast / accessible names / common automated rules | Lighthouse accessibility 100 on six production and four local runs; visible focus manually sampled | 2026-10-15 | PASS automated subset; no WCAG conformance claim |
| Discrete footer touch targets | Local DOM measurements show 44 px height across public page types | 2026-10-15 | PASS locally |
| Reduced motion | Shared stylesheet removes smooth motion/transitions under `prefers-reduced-motion` | 2026-10-15 | PASS source inspection; actual OS preference not manually tested |
| Captions, essential sounds and visual descriptions | No caption tracks/transcript provided; actual media needs not exhaustively reviewed | 2026-10-15 | PENDING; material limitation for accessibility acceptance |
| Search/filter/pagination/dialog/carousel/map interaction | Not present in inspected interface | 2026-10-15 | NOT APPLICABLE |

Evidence: `browser-layouts.json`, `local-west-winds-form.png`, Lighthouse reports, `summary.json`; existing tests `tools/test-enquiry.mjs` and `tools/test-video-player.mjs`. No live form was populated with test contact data or submitted in this audit.

## 5. Performance and hosting efficiency

Tool: installed Lighthouse **13.5.0**, Headless Chrome **155**, Windows. One run per listed URL/device; no score-chasing repeats. Mobile: 412 × 823, DPR 1.75, simulated 150 ms RTT / 1,638.4 Kbps / 4× CPU slowdown. Desktop: 1350 × 940, DPR 1, simulated 40 ms RTT / 10,240 Kbps / 1× CPU. Exact settings/timestamps are in each JSON report and `summary.json`.

### Production lab results, 2026-10-15

| URL | Device | Performance | LCP | TBT | CLS | Transfer | Result / issue |
|---|---|---:|---:|---:|---:|---:|---|
| `/` | Mobile | 87 | 1.99 s | 359.5 ms | 0.00087 | 259,585 B | PENDING optimization: lab blocking time; LCP/CLS meet goals in this run |
| `/` | Desktop | 98 | 0.85 s | 37.5 ms | 0.00090 | 259,472 B | PASS measured lab LCP/CLS; no field conclusion |
| `/mvv-gv-grand/` | Mobile | 80 | 2.61 s | 498 ms | 0.00087 | 211,712 B | FAIL 2.5 s lab LCP target; slow-host-CPU warning limits interpretation |
| `/mvv-gv-grand/` | Desktop | 98 | 0.86 s | 77 ms | 0.00015 | 280,259 B | PASS measured lab LCP/CLS |
| `/videos/` | Mobile | 100 | 1.52 s | 58 ms | 0 | 511,113 B | PASS measured lab LCP/CLS; oversized previews remain a real byte-saving opportunity |
| `/videos/` | Desktop | 84 | 1.45 s | 0 ms | 0.00501 | 784,749 B | PENDING image optimization; score is not a field failure |

All six production runs scored 100 for accessibility, best practices and SEO. Those are automated audit categories, not guarantees. TBT is a lab diagnostic and **is not INP**.

### Local verification after changes, 2026-10-15

| Local URL on `127.0.0.1:55453` | Device | Performance | LCP | TBT | CLS | Transfer | Result |
|---|---|---:|---:|---:|---:|---:|---|
| `/` | Mobile | 91 | 2.32 s | 321 ms | 0 | 272,847 B | PASS affected automated checks; blocking work remains |
| `/mvv-gv-grand/` | Mobile | 94 | 2.15 s | 218 ms | 0 | 182,503 B | PASS affected automated checks; no production improvement claim |
| `/videos/` | Mobile | 89 | 1.60 s | 422.5 ms | 0 | 118,094 B | PASS affected structural/accessibility checks; slow-host-CPU warning, score not an improvement claim |
| `/videos/` | Desktop | 100 | 0.55 s | 33.6 ms | 0.00036 | 144,587 B | PASS affected automated checks; localhost conditions differ |

All four local runs scored 100 for accessibility, best practices and SEO. These local and production timings are **not controlled before/after measurements**: host/network/compression and host CPU differ. In particular, a worse local mobile gallery score despite far fewer bytes is recorded without rerunning to seek a preferred score. The final small footer-alignment/card wording changes were checked in the browser/static checks after these measurements; another full performance run was not justified.

**Field performance: BLOCKED by public-tool limits.** The unauthenticated PageSpeed API returned 429. No usable URL/origin 75th-percentile LCP, INP or CLS data was obtained. The goals remain LCP ≤2.5 s, INP ≤200 ms and CLS ≤0.1 at the 75th percentile, assessed separately on mobile/desktop when real-user data exists. Missing field evidence is neither PASS nor FAIL.

Measured asset changes: twelve original JPEG previews total **743,929 B**, versus **88,090 B** for all 640 px WebPs (~88% smaller) or **195,554 B** for all 1200 px WebPs (~74% smaller). The logo is **2,632 B** versus **21,491 B** (~88% smaller). These compare file sets, not a guaranteed per-visit saving. Originals remain, so published storage grows modestly; normal supported-browser transfers use compressed derivatives. Existing data-saver MP4 files and their original-quality option were preserved; no additional transcoding or full production-video downloads were repeated.

Public HTTPS homepage compression negotiated Brotli: 6,016 transferred body bytes versus the 23,739-byte uncompressed HTML response in the crawl. HTML revalidates; assets use a one-day cache. No remote font load or third-party script was found in inspected HTML. Images below the initial viewport are lazy-loaded; the first gallery preview is now eager/high priority locally, and the homepage preload priority is explicit. Versioned shared CSS prevents reliance on yesterday's cached stylesheet after a future release.

Credit efficiency: zero deployments for this batch; cached small GET/HEAD evidence, six production Lighthouse runs and four affected local checks. The owner-reported ~75% usage is not independently verified, and no balance, reset date or usage breakdown is asserted. Preserve the current static Netlify/Forms architecture; no paid streaming service, migration or analytics SDK was added. Batch the next release and retain the recovery point. Large full-resolution artwork/brochures are intentional click-to-download resources; add visible file-size labels later if useful rather than removing working downloads.

## 6. Public security and privacy

| Check | Evidence / scope | Checked | Result |
|---|---|---|---|
| HTTPS certificate / transport | TLS 1.3; hostname/trust verification succeeded; certificate expiry Jan 11, 2027 | 2026-10-15 | PASS at check time |
| HTTP and www behavior | HTTP bare → HTTPS bare 301; HTTPS www → HTTPS bare 301; HTTP www → HTTPS www → HTTPS bare | 2026-10-15 | PASS convergence; two-hop HTTP-www path is optional P3 refinement |
| Security headers | HSTS max-age 31536000, nosniff, SAMEORIGIN, strict-origin-when-cross-origin, restricted camera/mic/geolocation | 2026-10-15 | PASS observed headers, not complete security |
| Mixed content | No HTTP `src`/`href` resources in crawled site HTML; no browser security warning observed | 2026-10-15 | PASS inspected markup |
| Public debug/private-key exposure | Inspected returned pages and published source; pattern check found no standard private-key/API-key signatures | 2026-10-15 | PASS limited inspection; not a secret-scanning/security guarantee |
| Third-party tracking | No external script tags/analytics or ad pixels found; optional UTM session-storage script present | 2026-10-15 | PASS implementation inventory; backend processing not assessed |
| Privacy / consent | Public notice, required contact consent; referrer wording discrepancy fixed locally | 2026-10-15 | FAIL live wording → PASS locally; legal compliance NOT APPLICABLE to this technical conclusion |
| Form abuse protection | Honeypot and client-side validation observable | 2026-10-15 | PASS observable protections; server enforcement/rate limits BLOCKED from public evidence |
| Content Security Policy | No CSP header observed on Ram Realty | 2026-10-15 | PENDING optional P3 hardening; absence alone is not proof of exposure |
| Intrusive testing / private backend access | Not performed | 2026-10-15 | NOT APPLICABLE |

No vulnerability scan, authentication bypass, backend dependency audit, server-log access or privacy-law certification was performed. A restrictive CSP should be tested against inline styles/scripts and Netlify Forms before adoption; it was not added speculatively. Retention duration, authorized enquiry access and deletion practice need an owner policy/evidence, not invented legal promises.

## 7. Technical SEO checklist

| Check | Evidence | Checked | Result |
|---|---|---|---|
| Important 200 pages / indexable text | All nine sitemap destinations return 200 and server-render useful content | 2026-10-15 | PASS |
| Redirect consistency / loops | Public HTTP/www chains converge; local alias graph acyclic with existing targets | 2026-10-15 | PASS existing; new alias runtime PENDING release |
| Genuine missing-page status | Random missing path returned custom page with HTTP 404 | 2026-10-15 | PASS |
| Accidental noindex | No noindex on intended sitemap pages; thank-you/error pages intentionally noindex | 2026-10-15 | PASS inspected directives |
| robots.txt | Public 200, `User-agent: *`, `Allow: /`, correct sitemap URL | 2026-10-15 | PASS; robots is not access control |
| Canonicals / duplicate aliases | Explicit canonical URLs; three public information aliases also return 200 | 2026-10-15 | FAIL consolidation opportunity; local configuration prepared |
| Titles / descriptions / headings | Unique descriptive sitemap titles; descriptions, one H1 and one main per inspected HTML page | 2026-10-15 | PASS scope; content quality reviewed separately |
| Crawlable links / orphan pages | All four main projects linked from homepage; information/gallery pages internally linked; nine sitemap pages discoverable | 2026-10-15 | PASS |
| XML sitemap | Public 200, parseable nine-URL sitemap matching intended canonicals | 2026-10-15 | PASS public file; processing inside engines not public |
| Sitemap modification dates | No lastmod values; no invented freshness dates added | 2026-10-15 | NOT APPLICABLE; optional accurate lastmod only after meaningful updates |
| Social metadata | OG title/description/URL/image and Twitter card present on intended public pages; referenced assets available | 2026-10-15 | PASS HTML/availability; actual social preview rendering PENDING |
| Images / alternatives | Descriptive names and alt attributes, decorative concept banners marked; responsive preview sources added locally | 2026-10-15 | PASS structural checks; image licensing not independently proven |
| Structured data | JSON-LD parseable; incorrect listing relationships identified and corrected locally using official property/type definitions | 2026-10-15 | FAIL live domain relationships → PASS targeted local checks; full validator/rich-result eligibility not certified |
| Breadcrumbs | Visible linked breadcrumb plus matching BreadcrumbList added on four local project pages | 2026-10-15 | PASS locally |
| Hreflang / pagination / meta keywords | Single-language site, no pagination requirement, no meta-keywords addition | 2026-10-15 | NOT APPLICABLE |

The site appears technically crawlable and eligible for consideration under the basic inspected requirements. This does not promise indexing, rankings or a particular rich result. `RealEstateListing` describes a listing page; it is not a guarantee of a Google property rich result. Current Google documentation also states FAQ rich results no longer appear from May 2026; FAQPage markup is retained as truthful semantics, not a promised Google enhancement.

## 8. Local trust and public search observations

| Check | Evidence | Checked | Result |
|---|---|---|---|
| Business identity / contact consistency | Ram Realty / Ramsai Seera and +91 77992 51808 consistent on inspected pages | 2026-10-15 | PASS website consistency |
| Location / contact hours | Homepage explicitly labels PM Palem office locality and 8 AM–11 PM daily | 2026-10-15 | PASS visible clarity; actual premises/hours independently PENDING |
| Public business listing match | Google Maps query returned other businesses; no matching Ram Realty listing established | 2026-10-15 | PENDING discoverability/matching; not proof none exists |
| Reviews / unsupported proof | No fabricated review/star-rating markup found; illustrative visuals labelled | 2026-10-15 | PASS inspected content; ownership permissions PENDING owner records |
| Regulatory / possession claims | References qualified; Maple record currently supports proposed date and area caution; handover not proven | 2026-10-15 | PENDING exact-unit/current documentation |

Public search evidence is session-specific. The tool-backed search engine is not identified and is labelled accordingly. Precise search location is unknown unless stated. No universal positions or total indexed-page count are reported.

| Engine / source | Exact query | Date / location | Observed result and example URL | Interpretation |
|---|---|---|---|---|
| Google, connected browser | `site:ramrealty.in` | 2026-10-15; en-IN interface; signed-in session; precise location unknown | “did not match any documents”; no matching result URL | Visibility warning, not definitive indexing failure |
| Search tool, engine not disclosed | `site:ramrealty.in` | 2026-10-15; location unknown | Empty returned results | Supplementary observation only |
| Search tool, engine not disclosed | `"ramrealty.in"` | 2026-10-15; location unknown | Empty returned results | Exact-domain visibility not established |
| Search tool, engine not disclosed | `"Ram Realty" Visakhapatnam` | 2026-10-15; location unknown | Similarly named Pune/Maharashtra entities; e.g. https://www.zaubacorp.com/company/RAM-REALTY-LLP/AAL-5376 | Not evidence those entities are this business |
| Search tool, engine not disclosed | `"Ram Realty" "7799251808"` | 2026-10-15; location unknown | Empty returned results | No matching business citation established |
| Search tool, engine not disclosed | `"MVV GV Grand" Madhurawada 3 BHK` | 2026-10-15; location unknown | Developer/portal results, e.g. https://www.mvvbuilders.com/ | Relevant project intent exists; no Ram Realty rank asserted |
| Search tool, engine not disclosed | `3 BHK owner share flats Madhurawada` | 2026-10-15; location unknown | Portals and locality/property discussions; e.g. https://housing.com/in/buy/visakhapatnam/madhurawada-gid/3bhk-flats-fid/ | Supports locality/configuration relevance, not volumes |
| Bing, connected browser | `"ramrealty.in"` | 2026-10-15; Bing displayed Visakhapatnam, Andhra Pradesh; location permission not granted | Other property results and suggestions for a similarly spelled domain; no exact-domain result established; example destination https://housing.com/ | Weak exact-domain visibility in this session |
| Google Maps, connected browser | `Ram Realty Visakhapatnam` | 2026-10-15; locality in query; precise device location unknown | Sai Ram Rental Services, Shriram Properties and other businesses; no exact business match established | Cannot compare this business's public listing NAP without a verified match |

Browser observations are saved in `browser-search.json`; individual tool observations in `search-tool-0.json` through `search-tool-3.json`. Do not use another business's reviews, registration or address. Before creating/editing a future Google Business Profile, check real-world in-person service and storefront/service-area eligibility; no listing was created or changed here. No login or business-profile access is needed to finish this public report.

## 9. Account-only and tool-limited checks

Each item below was recorded on 2026-10-15; no login was requested. “Not publicly verifiable” is a scope boundary, not a website failure.

| Check | Result | Limitation / next action |
|---|---|---|
| Search Console ownership, coverage, URL Inspection and selected canonical | BLOCKED — Not publicly verifiable | Historical private audit evidence is separate; no current account conclusion |
| Sitemap processing inside Search Console | BLOCKED — Not publicly verifiable | Public sitemap availability passes; processing status is different |
| Manual actions and account security reports | BLOCKED — Not publicly verifiable | No inferred absence of actions |
| Search impressions, clicks and average positions | BLOCKED — Not publicly verifiable | Public searches do not provide these metrics |
| Analytics conversion reports | BLOCKED — Not publicly verifiable | Existing preference remains Netlify-only reporting; no tracker added |
| Netlify balance, reset date and usage breakdown | BLOCKED — Not publicly verifiable | ~75% used is owner-provided context only |
| Logs, environment secrets and private backend settings | BLOCKED — Not publicly verifiable | Published files inspected only; no intrusive scan |
| Actual enquiry delivery / notification receipt | BLOCKED — Not publicly verifiable in this audit | No end-to-end production submission authorized here; earlier receipt evidence not a new test |
| Public PSI/CrUX field measurements | BLOCKED — public API HTTP 429 | No 75th-percentile LCP/INP/CLS conclusion; no repeated requests |
| New Netlify redirects after local config change | PENDING future authorized hosted release | Local static server cannot prove Netlify routing; config validation passed |
| Cross-browser, screen reader, complete media alternatives | PENDING additional coverage | Current review is Chrome plus limited source/automated checks |

## 10. Release acceptance and next actions

**PASS locally:** 560 structural/link/canonical/schema checks in the final source check; player lifecycle regressions; local success/error/retry/duplicate enquiry tests; nine-page 320 px reflow; representative desktop review; WebP selection and playback with restored posters. Final check output is retained with this batch. No production changes were made, so all implementation items await publication.

**Prioritized next actions:**

1. **P2, owner:** obtain current exact-unit availability, chargeable area, full cost sheet and handover evidence, especially Maple Woods. Preserve current qualifications until then.
2. **P2, developer/owner:** review this consolidated local batch. Push/deploy only when explicitly requested. After release, verify the three 301 aliases and canonical targets, preview images, noindex exceptions and enquiry journey without a submission unless separately authorized.
3. **P2, content/accessibility:** review actual footage for accurate captions, essential audio cues and visual alternatives. Add only verified descriptions/transcripts, then test keyboard/native controls and a screen reader.
4. **P2, SEO/owner:** establish an accurate eligible public business listing/citation strategy using the real business details. No fake reviews, thin locality pages or indexing promises. Recheck public visibility on the maintenance schedule, not repeatedly during this audit.
5. **P2, QA:** assess field Core Web Vitals when public data becomes available; keep lab blocking/CPU limitations visible. Further homepage image compression is optional if visual quality remains acceptable.
6. **P3, developer:** consider tested CSP hardening, visible file-size labels for large downloads and a simpler HTTP-www redirect only if hosting configuration and evidence justify them. None is an emergency proven vulnerability or journey failure.

Separate conclusions:

| Area | Acceptance conclusion |
|---|---|
| Public website functionality | PASS scoped availability/discovery/contact-option checks; actual enquiry delivery remains BLOCKED in this public audit |
| Accessibility coverage | PASS automated/sample manual subset; complete WCAG 2.2 AA acceptance PENDING media, screen reader, zoom and broader browser coverage |
| Performance | Production lab results recorded; mobile MVV lab LCP target failed once with CPU warning; field assessment BLOCKED; local previews materially smaller by file size |
| Technical SEO eligibility | Basic public crawlability checks PASS; alias/schema fixes verified locally with hosted verification PENDING; indexing not guaranteed |
| Public search visibility | PENDING improvement; brand/domain and Maps visibility weak in observed sessions; no definitive index/ranking diagnosis |
| Security coverage | PASS limited transport/header/markup checks; private/backend assurance BLOCKED; no complete-security claim |
| Business conversion readiness | Discovery/contact options usable; local form mismatch corrected; current exact-unit evidence and fresh delivery verification still PENDING/BLOCKED |

Recovery and release/rollback instructions, frequency/owner assignments and weekly/monthly/quarterly checks are in [WEBSITE_MAINTENANCE.md](WEBSITE_MAINTENANCE.md). No automation or notification was created.

## Official references consulted on 15 October 2026

- [Google Search technical requirements](https://developers.google.com/search/docs/essentials/technical): crawlability, successful responses and indexable content do not guarantee indexing.
- [Google canonical consolidation](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls): align redirects, canonicals and internal links.
- [Google robots introduction](https://developers.google.com/search/docs/crawling-indexing/robots/intro): crawling controls are not private-information protection.
- [Google structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies): data must match relevant visible content; rich results are not guaranteed.
- [Schema.org RealEstateListing](https://schema.org/RealEstateListing), [address](https://schema.org/address), [broker](https://schema.org/broker): reviewed type/property applicability for the listing fix.
- [Netlify file-based configuration](https://docs.netlify.com/build/configure-builds/file-based-configuration/), [redirect options](https://docs.netlify.com/manage/routing/redirects/redirect-options/): Pretty URLs and explicit permanent redirects.
- [Web Vitals](https://web.dev/articles/vitals): LCP/INP/CLS thresholds and 75th-percentile field assessment.
- [Lighthouse overview](https://developer.chrome.com/docs/lighthouse/overview/): automated audit coverage.
- [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/), [prerecorded captions](https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html): accessibility review scope and media requirements.
- [Business Profile guidelines](https://support.google.com/business/answer/3038177), [service-area guidance](https://support.google.com/business/answer/9157481): eligibility depends on actual operations, not a website claim.
- [Google Search documentation updates](https://developers.google.com/search/updates): FAQ rich-result deprecation in May 2026; do not promise that feature.
