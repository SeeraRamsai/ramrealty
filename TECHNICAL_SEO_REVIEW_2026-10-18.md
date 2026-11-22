# Ram Realty technical SEO and Search Console review

Checked: 18 October 2026, Asia/Kolkata. Baseline source revision: `482ffcd`. This is a local operational report, not website content. No Git push, production deployment, DNS/ownership changes, new analytics tags, purchases or live enquiries were performed. Search Console indexing requests are recorded separately below; they do not publish local source changes.

## Findings

The public site is reachable, its nine sitemap URLs return HTTP 200, robots and sitemap are accessible, the tested missing URL returns HTTP 404, and the sampled assets respond successfully. Google confirms the homepage is indexed. The four project URLs are not yet indexed in the inspected Google records. This is an early discovery/crawling situation, not evidence of a penalty: the verified domain property was added on 15 October, and both Manual Actions and Security Issues report no issues.

The main verified technical defect is duplicate public information-page routes: `/about`, `/faq` and `/privacy` return HTML with HTTP 200 alongside their existing `.html` canonicals. A local fix adds forced 301 rules to the publish directory, retaining all existing canonical URLs. The effect on Netlify must be verified after a separately approved release.

## Search Console baseline — authorized browser observations

| Check | Status | Evidence checked 18 October 2026 |
|---|---|---|
| Property | PASS | `sc-domain:ramrealty.in`; Settings says verified owner. The property selector shows this domain property and Add property; no separate URL-prefix property is listed in this account. No new property is necessary for this audit. |
| Permissions | PASS | Users and permissions shows one user, the signed-in verified Owner; unused ownership tokens: 0. No memberships, permissions or verification tokens were changed. |
| Three-month performance | PASS | Web search: 1 click, 3 impressions, 33.3% CTR, average position 20. Chart contains data only for 14–16 October. |
| Six-month performance | PASS | Same totals and observed data window. This does not constitute six months of historical activity. |
| Queries | PENDING | Only disclosed query: `ram properties`, 0 clicks / 1 impression. Query rows do not account for all headline totals. There is insufficient data for a reliable high-intent positions-5–20 or poor-CTR opportunity list. |
| Landing pages | PASS | Homepage: 1 click / 3 impressions. No property-page impressions shown in this table. |
| Countries / devices | PASS | India: 1 click / 3 impressions. Mobile: 1 click / 2 impressions; desktop: 0 clicks / 1 impression. Small sample, not a durable audience trend. |
| Page Indexing report | PENDING | Processing data; asks to check again in a day or so. No exclusion totals can be asserted from the report yet. Individual URL Inspection observations below are available. |
| Sitemap | PASS | `https://ramrealty.in/sitemap.xml`: Success; submitted 15 October, last read 17 October; 9 discovered pages, 0 videos. No unnecessary resubmission of this successful sitemap. |
| Crawl Stats | PASS | Last updated 16 October: 31 requests, 101K downloaded bytes displayed, 64ms average response; root and www hosts show No problems. Responses: 81% HTTP 200, 19% HTTP 301. |
| Robots report summary | PASS | Settings: All files are valid. Public robots.txt allows intended pages/assets and declares the sitemap. |
| HTTPS report | PASS | Last updated 16 October: 1 HTTPS URL, 0 non-HTTPS URLs, no issues detected. This reflects Google's currently reported coverage, not a count of all public pages. |
| Core Web Vitals field data | BLOCKED | Both device types: not enough usage data in the last 90 days. No field LCP/INP/CLS percentile result can be claimed. |
| Manual Actions / Security Issues | PASS | Both say No issues detected. This is not a backend security guarantee. |
| Links report | PENDING | External links Total 0; internal links Total 0; linking sites and anchor text No data. Reporting is too limited for domain-authority or link-quality conclusions. Public HTML clearly has internal links. |

### Priority URL Inspection

| URL | Google index baseline | Canonical / crawl evidence | Action |
|---|---|---|---|
| `/` | PASS — URL is on Google; Page is indexed | Last crawl displayed 16 October, 9:46:51 PM, smartphone; fetch successful; crawl/indexing allowed; declared canonical root, Google-selected canonical Inspected URL | No redundant request needed |
| `/mvv-gv-grand/` | PENDING — unknown to Google | No index-record crawl or selected canonical yet. Live test on 18 October: available to Google, page can be indexed, 1 valid Breadcrumbs item | Indexing requested and accepted on 18 October |
| `/vaisakhi-west-winds/` | PENDING — discovered, currently not indexed | Sitemap detected; last crawl and selected canonical N/A | Google's request flow checked live eligibility; indexing request accepted on 18 October |
| `/a-square-maple-woods/` | PENDING — discovered, currently not indexed | Sitemap detected; last crawl and selected canonical N/A | Google's request flow checked live eligibility; indexing request accepted on 18 October |
| `/utkarsha-capital-towers/` | PENDING — unknown to Google | Index-record crawl and selected canonical N/A | Google's request flow checked live eligibility; indexing request accepted on 18 October |

Requests concern existing live pages. They do not prove indexing, ranking, a Google-selected canonical for uncrawled pages, or processing of unshipped local edits. Do not repeat accepted requests: Google explicitly says repeated submissions do not change queue position or priority.

All four requests reached Google's **Indexing requested** confirmation without a user-interactive CAPTCHA. Acceptance screenshots are saved for each project. The original user tab was returned to the Links report afterward.

Private browser snapshots and acceptance screenshots are in ignored `audit-results/seo-2026-10-18/`. Keep these out of Git and out of `dist`.

## Public HTTP and source checks

Evidence: `audit-results/public-2026-10-18-network/crawl.json` and cached response files. The initial restricted attempt failed with socket access permissions; it is retained separately as a tool limitation. The successful retry is used for website findings. The crawler uses bounded GET/HEAD requests and no form submissions.

| Check | Status | Evidence / limit |
|---|---|---|
| Important pages | PASS | All nine sitemap URLs return 200, with page-specific titles. Homepage, four projects, walkthroughs, About, FAQs and Privacy are discoverable. |
| HTTP and www normalization | PASS | HTTP root, HTTPS www and HTTP www each return 301 directly to `https://ramrealty.in/`. |
| Missing page | PASS | `/audit-missing-page-20261015/` returns a genuine 404 and custom not-found page. No SPA catch-all is configured. |
| Duplicate information routes | FAIL — live / PENDING — local fix | Extensionless and `.html` information URLs both return 200. `_redirects` now mirrors the existing root-config 301 rules in the publish folder. Hosted routing has not been changed in this turn. |
| Canonical and index directives | PASS | Nine sitemap canonicals match intended local pages; no accidental meta noindex on them. Utility thank-you and 404 pages stay excluded. No X-Robots-Tag index block observed on fetched indexable pages. |
| Sitemap | PASS | Nine canonical, indexable URLs. Added content dates verified from Git history: 15 October for information/home/video pages; 16 October for project pages. No invented fresh lastmod dates. No sitemap index needed for nine URLs. |
| Source links/assets | PASS | Local link/fragment/responsive-asset checks pass; 60 discovered public internal asset URLs return HTTP 200. This is not a complete independent review of every external brochure's contents. |
| Titles / descriptions / sharing | PASS | Unique sitemap titles and descriptions, one H1 per page, Open Graph/Twitter fields and existing four distinct project-sharing images. |
| Structured data | PASS — bounded coverage | JSON parses; source checks verify listing/about/publisher/breadcrumb relationships and visible facts. Google's live MVV test detects one valid Breadcrumbs item. Full independent Schema.org validation for every property/type is not claimed. |
| Video markup | PENDING | No guessed VideoObject upload dates or fabricated metadata added. Need verified first-publication dates and accurate video-specific descriptions/captions before adding complete video schema or dedicated watch pages. Click-to-play stays intact. |
| FAQ enhancements | NOT APPLICABLE | Useful visible FAQ content is retained; real estate FAQ schema does not establish eligibility for Google's restricted FAQ rich results. |
| Pagination / filters / hreflang | NOT APPLICABLE | No paginated/filtered search routes or genuine language alternatives requiring these features. |
| Security coverage | PASS — public scope | Certificate verified with TLS 1.3, expiry 11 January 2027; expected nosniff, referrer, framing and permissions headers visible. No full backend/dependency/security certification. |

## Page intent and content priorities

These are editorial topic mappings grounded in existing copy, not measured search volumes or keyword rankings. Madhuravada remains the preferred editable-copy spelling; official names, documents and the external developer URL retain their actual identifiers.

| Page | Visitor intent / main topic | Supported related themes | Desired action |
|---|---|---|---|
| Homepage | Compare owner-share 3 BHK homes in Visakhapatnam | Madhuravada, area basis, standalone/gated options, indicative costs | Open relevant property, compare or contact |
| MVV | Investigate MVV–GV Grand owner-share homes | Madhuravada, 3 BHK, owner-supplied starting rate, under-construction documents | Check availability / request written cost sheet |
| West Winds | Investigate the reported West Winds unit | Sai Priya Layout, Madhuravada, reported 1,640 sq ft, separate charges | Confirm exact flat and current handover details |
| Maple Woods | Verify Maple Woods listing and area basis | Sai Priya Layout, proposed RERA completion, carpet versus total area | Request unit schedule and completion evidence |
| Utkarsha | Investigate reported Capital Towers listing | Bakkannapalem, Madhuravada, reported unit/area, project documents | Confirm current availability and full costs |
| Walkthroughs | See supplied property footage | Data saver, original quality, project links | Play selected clip and open matching project |
| About | Establish business identity/contact | Ramsai Seera, Visakhapatnam, owner-confirmed office area/hours | Contact property consultant |
| FAQs | Understand comparison and buying checks | Area bases, fees, approvals, enquiry versus booking | Compare correctly and request documents |
| Privacy | Understand enquiry data handling | Netlify processing, consent, optional campaign fields | Make an informed contact choice |

Do not target “ready to move in Yendada” or “gated community in Kommadi” with invented inventory. Current local references do not establish distinct guide content for all target areas, especially Marikavalasa. Useful guides need verified maps, relevant actual inventory, distinct services/connectivity information and current sources; avoid thin locality clones.

RERA and pricing qualifications from the 16 October review remain in source. A registration number is not completion evidence. Owner-supplied inventory, possession, charge and area statements still require current unit-specific documents; no fresh availability checks were fabricated.

## Performance and accessibility

Fresh local Lighthouse baselines on 18 October, sequential runs using installed Chrome headless and Lighthouse defaults (desktop preset for desktop). URL base: `http://127.0.0.1:55457`. Exact tool version, settings, timestamps and warnings are in `performance-summary.json` and original reports. These are local lab measurements, not Netlify-production measurements. Routing/sitemap edits do not alter measured HTML/CSS/media; an icon experiment was rejected and original media retained.

| Local page / conditions | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| Homepage mobile | 77 | 100 | 100 | 100 | 2.315s | 606ms | 0 |
| Homepage desktop | 72 | 100 | 100 | 100 | 0.696s | 726ms | 0 |
| MVV mobile | 72 | 100 | 100 | 100 | 3.103s | 704ms | 0 |

Both mobile runs warn that the test CPU is slower than expected. Desktop also has substantial lab blocking time; some recorded tasks belong to Lighthouse evaluation/unattributed work. The homepage has no executable application script or third-party analytics request in the recorded network waterfall. It would be misleading to promise a JavaScript-bundle fix for that score. Recheck with a stable production test environment before attributing the blocking time entirely to site code. Local-server missing-cache/compression hints do not establish that Netlify lacks those headers. INP is not measured by these runs and is not interchangeable with TBT. MVV's measured mobile LCP exceeds the 2.5s goal; it remains a performance investigation item, not a declared pass.

Manual Chrome Windows checks: homepage, four project pages and walkthroughs at 320×800; no horizontal overflow (305px document width), no broken loaded images, no attached video sources before Play, required fields remain invalid when empty. Viewport override reset afterward. Existing desktop layout/hero also reviewed. These checks plus Lighthouse do not certify full WCAG 2.2 AA compliance. Accurate speech captions/transcripts remain an accessibility content need.

## Enquiries, analytics and local trust

- PASS: all four Netlify form registrations, shared hidden field union, consent, privacy links, validation and honeypots are present. Local regressions cover invalid forms, HTTP errors/retry, unrelated-200 handling, duplicate prevention and payload preservation. Video lifecycle regression passes. No production lead was submitted.
- BLOCKED: actual Netlify storage, spam categorization and notification delivery for a new release need an explicitly authorized end-to-end test. Check Forms → property-enquiry in the dashboard and the actual stored fields; confirm email independently. A client HTTP 200 is not a durable lead receipt.
- NOT APPLICABLE: no GA4/GTM/Meta implementation added. Existing Netlify-only preference and disabled `config/measurement.json` remain. No analytics accounts, integrations or consent choices were changed. Request clicks, confirmed stored enquiries and confirmed bookings must stay distinct.
- PENDING: no verified Ram Realty Business Profile URL established from public searches. Need the actual profile URL and confirmation of eligible real customer-facing operations before profile-specific edits. Office/contact details already confirmed by the owner are retained; a contact-hours statement alone does not prove staffed public-office hours.
- PENDING: no authorized testimonials or verified review-profile URL supplied. No testimonials, review schema, invented credentials or fake reviews added.

## Backlinks and public search observations

Search-tool observations on 18 October: exact-domain, branded business/location, site:domain/locality and property/locality queries were checked. The tool does not establish a Google engine/location for these searches; they are not labelled universal Google rankings. Public results include a Reddit discussion mentioning ramrealty.in: https://www.reddit.com/r/Visakhapatnam/comments/1x7p8oi/check_it_out/. It is an observed mention, not a link acquired during this work, a verified review, or proof of ranking value. Do not repost its text as a testimonial without authorization. Other returned property/locality results establish market-topic context only, not Ram Realty inventory or demand volumes. A site: search is not a complete index count; authenticated URL Inspection provides the stronger page-specific findings above.

No referring-domain authority score, toxic-link finding, broken inbound destination or acquired backlink is substantiated by the empty Links report. Do not disavow anything from this evidence. No outreach or directory submission was performed.

Prospective actions, requiring actual business fit/permission: request a correct business-reference link from developers already represented in verified documents; review genuine local business-association directories where the business qualifies; publish original, sourced buyer guidance worth citing; ask legitimate partners to correct any specifically demonstrated broken inbound URL. Never buy bulk links, fabricate citations or redirect guessed historical URLs.

## Local changes and release checks

- `dist/_redirects`: forced canonical alias rules that travel with the publish folder; no catch-all rewrite.
- `dist/sitemap.xml`: nine evidence-based content modification dates.
- `tools/audit_site.py`: validates deploy-folder/root redirect agreement, forced permanent status, duplicate/loop/target safety and non-future ISO sitemap dates.
- This report and the audit log: dated evidence and unresolved items. Recovery copies are in ignored `audit-results/seo-2026-10-18/recovery/`; Git HEAD also retains the prior source. No new images or re-encoded videos retained.

PASS: 577 source audit checks, 171 project SEO checks, 48 listing-consistency checks (796 total); four local form regressions; video lifecycle regression; whitespace checks. Static hosting has no package/application build step. Existing source/asset tools are development-only. No runtime dependency installation or paid service required.

After approval for one batched release, verify `/about`, `/faq`, `/privacy` return one 301 to their `.html` targets, the targets remain 200 without a reverse redirect, missing paths remain 404, and live sitemap/canonicals agree. If Netlify still rewrites routes, inspect the effective deployment/post-processing configuration; do not infer settings from source alone. Rollback means restore only the reviewed files from HEAD/recovery and remove only the newly introduced `_redirects`; publishing rollback also needs authorization. Do not use broad reset/clean commands.

## Prioritized remaining work and ownership

| Priority / frequency | Action | Owner | Verification |
|---|---|---|---|
| P1 / after approved release | Confirm live alias redirects and canonical/404 behavior | Developer | Public HTTP chain and final URL checks |
| P1 / authorized test | Confirm a clearly labelled enquiry in Netlify and notification inbox | Owner / QA | Stored submission and independent notification evidence |
| P2 / once Google has processed requests | Review four project index statuses and Page Indexing reasons | SEO reviewer | URL Inspection and Google-selected canonical; do not repeatedly request indexing |
| P2 / next stable performance session | Investigate lab blocking and MVV LCP in production | Developer / QA | Mobile/desktop PSI or Lighthouse with conditions recorded; field p75 when available |
| P2 / before claims change, then weekly | Reconfirm exact unit, availability, area basis, fees, possession and RERA/phase evidence | Owner / property contact | Current written documents, not logos or old brochures alone |
| P2 / when supplied | Verify Business Profile URL, eligible operation, accurate address/service areas and reviews | Owner / SEO reviewer | Real profile and business evidence; no invented map pin |
| P2 / monthly | Reassess queries and CTR when a meaningful sample exists | SEO reviewer | GSC pages/queries/devices/countries; no conclusions from three impressions |
| P2 / when new content is verified | Add distinct area guidance and accurate captions/video metadata | Content owner | Primary sources and reviewed footage/publication dates |
| P3 / quarterly | Review legitimate citation opportunities, recovery, dependencies and hosting suitability | Owner / developer | Evidence-backed opportunities and isolated recovery check |

No automation or notifications created. Keep production releases batched and explicitly authorized to conserve Netlify credits; current balance is not inferred from past owner estimates.

## Official guidance consulted

- Sitemap canonical URLs and accurate lastmod: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Video metadata requirements: https://developers.google.com/search/docs/appearance/structured-data/video
- Favicon format/stability requirements: https://developers.google.com/search/docs/appearance/favicon-in-search
- FAQ rich-result limits: https://developers.google.com/search/blog/2023/08/howto-faq-changes
- Business Profile eligibility: https://support.google.com/business/answer/13763036
- Business representation: https://support.google.com/business/answer/3038177

Conclusions are separate: public core navigation/source checks pass within tested coverage; full accessibility and backend security compliance are unproven; field performance is unavailable and lab issues remain; technical SEO prerequisites largely pass but live duplicate redirects remain until deployment; homepage indexing is confirmed and project indexing is pending; conversion delivery still needs authorized backend evidence.
