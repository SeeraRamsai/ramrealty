# Locality, MVV rate and all-project illustration verification

Checked **15 October 2026**. All changes remain local, uncommitted and undeployed. No Git push, deployment, production enquiry, listing edit or indexing request was performed.

## Completed local changes

- **All four project side images verified:** MVV–GV Grand, Vaisakhi West Winds, A Square Maple Woods and Utkarsha Capital Towers each use a distinct architectural concept, with matching title/locality, individual colour accent and a visible illustrative disclosure. No project hero uses a walkthrough still. The original video previews remain in the walkthrough sections.
- **Preferred locality spelling:** changed editable website copy from Madhurawada to **Madhuravada**, including headings/body copy, metadata, hero labels, structured property addresses, form options, WhatsApp prefilled messages, FAQ content and editable SVG posters. Utkarsha retains its more specific Bakkannapalem title, with Madhuravada in its description, visible location and structured address.
- **MVV starting rate:** **from ₹5,300 per sq ft of total saleable area**, supplied by the owner in this instruction. Updated the homepage card, comparison, MVV highlights/facts/area-price explanation and matching description/OG/Twitter descriptions. Existing separate amenities and lifetime-maintenance charges remain qualified and visible.
- **Current MVV poster:** created `dist/assets/projects/posters/mvv-gv-grand.svg`, with the preferred spelling, starting rate, area-basis qualification and concept-image disclosure. The MVV page now links this editable poster.
- **Homepage imagery:** replaced displayed raster posters that had the old spelling baked into them with the four text-free concepts. Prices, localities and qualifications remain editable HTML. Sharing-image references that used the old general raster poster now use a concept-image JPEG. Existing supplied originals are retained, rather than rewriting the original evidence/media.

One external developer reference URL still contains `madhurawada` in its path: `https://vaisakhi.in/ongoing-projects/3-bhk-flats-for-sale-in-madhurawada/`. Its address is preserved to avoid breaking the reference. Original third-party PDFs/media and historical audit records are not represented as newly edited documents. Current page text and metadata use the requested spelling.

## Locality SEO and public indexing evidence

Both spellings occur in public sources. The [Google Maps result](https://www.google.com/maps/search/MADHURAWADA) uses **Madhurawada**; a [VMRDA master-plan map](https://vmrda.gov.in/masterplan-2041/Visakhapatnam%20Dist/Bheemunipatnam.pdf) uses **Madhuravada**. The requested spelling is a presentation preference applied consistently; it is not established as a uniquely better Google keyword.

Public Google check on 15 October 2026: exact query `site:ramrealty.in Madhuravada`, personalised browser session, Google displayed Visakhapatnam, Andhra Pradesh. The result said no matching documents and suggested `site:ramrealty.in Madhurawada`. This is **PENDING visibility evidence**, not proof that all pages are unindexed. No search volume, ranking improvement or indexing success is claimed. Evidence: `audit-results/locality-update/google-locality-query.json`.

The new content is local. Google cannot crawl this localhost revision. The existing canonical URLs and sitemap were preserved. Final publication and post-release checks require an explicit push/deployment instruction; account-only indexing diagnostics remain outside this public/local work. Google explains that [technical eligibility does not guarantee indexing](https://developers.google.com/search/docs/essentials/technical).

## Checks and results

All checks below are dated 15 October 2026.

| Check | Result | Scope / evidence |
|---|---|---|
| General site checks | PASS — 557 checks, zero errors | Links, canonical/sitemap agreement, headings, schema and shared form fields |
| Dedicated SEO/hero checks | PASS — 171 checks, zero errors | Nine sitemap pages; unique titles/descriptions and four distinct concept-image hashes |
| Locality/rate consistency | PASS — 48 checks, zero errors | Managed copy including encoded WhatsApp text; preferred locality in descriptions/hero labels/schema; current MVV price, homepage comparison and SVG references |
| Enquiry handling | PASS local regression | Four projects, success/error/retry/duplicate handling using localhost receiver only; production delivery not tested |
| Video behavior | PASS local regression | Deferred loading, one active player, quality/resume/cleanup checks |
| Desktop visual review | PASS scoped review | All four project heroes at 1366 × 900; correct project-specific artwork, updated locality, no broken loaded images/overflow |
| Narrow-screen browser review | PASS scoped review | Homepage, four projects, About, FAQ and videos at 320 × 800; no old spelling in visible text and no page overflow/broken loaded images |
| On-page lab audit | PASS automated subset | Homepage and all four project pages SEO/accessibility/best-practices scores 100 |
| Google-selected indexing/canonical and future visibility | PENDING / not publicly established | No account-only tools requested; new content not deployed |
| Publication | PENDING explicit instruction | No push/deployment performed |

The consistency check deliberately excludes exact external source URL paths. It does not claim to OCR or rewrite embedded text inside original supplied videos, raster artwork or third-party PDFs. Those originals are not used as the new displayed hero/homepage imagery. Automated accessibility scores do not establish full WCAG compliance; earlier media-alternative and broader manual-review limitations remain.

### Fresh local Lighthouse results

Installed Lighthouse 13.5.0 / Headless Chrome; mobile emulation. One full homepage run and one SEO/accessibility/best-practices-only run per project. No repeats to seek better scores. Results are localhost lab measurements, not production field Core Web Vitals or a controlled before/after test.

| Page | Performance | Accessibility | Best practices | SEO | Warnings |
|---|---:|---:|---:|---:|---|
| Homepage | 99 | 100 | 100 | 100 | None |
| MVV–GV Grand | Not measured in this category-limited run | 100 | 100 | 100 | None |
| Vaisakhi West Winds | Not measured in this category-limited run | 100 | 100 | 100 | None |
| A Square Maple Woods | Not measured in this category-limited run | 100 | 100 | 100 | None |
| Utkarsha Capital Towers | Not measured in this category-limited run | 100 | 100 | 100 | None |

Homepage lab LCP: **1.89 seconds**. INP and 75th-percentile field performance were not measured. Full JSON/HTML reports, screenshots, recovery copies and layout evidence are under `audit-results/locality-update/`.

## All four local project previews

### Vaisakhi West Winds

![West Winds illustrated hero](audit-results/locality-update/vaisakhi-west-winds-desktop.png)

### A Square Maple Woods

![Maple Woods illustrated hero](audit-results/locality-update/a-square-maple-woods-desktop.png)

### Utkarsha Capital Towers

![Utkarsha illustrated hero](audit-results/locality-update/utkarsha-capital-towers-desktop.png)

### MVV–GV Grand

![MVV illustrated hero and starting rate](audit-results/locality-update/mvv-gv-grand-desktop.png)

## Before any future authorized release

Run `python tools/audit_site.py`, `python tools/check-project-seo.py`, `python tools/check-listing-consistency.py`, the form/player regressions when affected, and `git diff --check`. Review only intended source changes and retain the existing recovery evidence. After an authorized release, check the live pages, starting rate, canonical URLs/redirects, sitemap and changed poster references. A hosted runtime or actual enquiry delivery test must not be claimed from localhost evidence. No deployment or outreach authorization is implied by this document.
