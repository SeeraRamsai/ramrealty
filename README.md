# Ram Realty property website

A static property website for Ram Realty, featuring a Visakhapatnam property collection and project detail pages. The site is served directly from `dist`; it does not require a build step or package installation.

## Project structure

```text
.
├── netlify.toml
└── dist/
    ├── index.html
    ├── thank-you.html
    ├── privacy.html
    ├── about.html
    ├── faq.html
    ├── robots.txt
    ├── sitemap.xml
    ├── assets/
    │   ├── Ram-realty-logo.png
    │   ├── luxury-apartment-artwork.png
    │   ├── documents/
    │   ├── projects/
    │   │   └── posters/
    │   ├── videos/
    │   └── video-thumbnails/
    ├── mvv-gv-grand/
    ├── vaisakhi-west-winds/
    ├── a-square-maple-woods/
    └── utkarsha-capital-towers/
```

`netlify.toml` configures Netlify to publish the `dist` directory.

## Preview locally

With Python installed, run this from the project root:

```powershell
python -m http.server 8000 --directory dist
```

Then open <http://localhost:8000>. A local static server can display the pages, but it does not process Netlify Forms submissions.

## Deploy to Netlify

Keep edits and QA local until the owner explicitly requests a Git push. Pushing the production branch can trigger a Netlify deployment that consumes hosting credits. Group approved changes into one release; do not create previews or redeploy for routine document edits. See `WEBSITE_MAINTENANCE.md` for release and rollback checks.

1. Deploy this project to Netlify, either by connecting its Git repository or by uploading the `dist` folder as a manual deploy.
2. In the Netlify site settings, enable **Form detection** if it is not already enabled.
3. Deploy or redeploy the site so Netlify can scan the HTML form.
4. After deploying to a non-production preview, submit a test enquiry from `/mvv-gv-grand/` and one other project page.
5. In the Netlify dashboard, open **Forms** and confirm the `property-enquiry` form and test submission appear.

The site is static, so no build command is needed. The publish directory is set to `dist` in `netlify.toml`.

## Search and sharing

Public pages have page-specific titles, descriptions, canonical URLs, and Open Graph/Twitter preview metadata. The homepage and property pages use descriptive content about the actual listings and areas served; the About and FAQ pages provide additional visitor information and are included in `sitemap.xml`. Structured data describes the real estate agent, About page, and visible FAQs. `robots.txt` points crawlers to the sitemap. The enquiry confirmation page remains `noindex`.

Search engines do not use the legacy `meta keywords` tag for ranking, so search phrases are incorporated naturally into titles, descriptions, headings, page copy, and internal links rather than added as keyword lists. Metadata and sitemaps can help crawlers understand the site, but rankings depend on many factors and cannot be guaranteed. Keep project, pricing, availability, business profile, and contact information accurate and current; verify the live deployment and submit the sitemap through Google Search Console and Bing Webmaster Tools.

## Enquiry submissions

All four project enquiry forms use Netlify Forms with the shared name `property-enquiry` and include the property name so submissions can be identified. The MVV–GV Grand form collects name, phone, budget, preferred area and buying timeline. The other project forms collect name and phone, require a preferred layout and offer an optional buying timeline. The three non-MVV forms also attach available UTM campaign values. They do not attach the referring page URL. All forms require contact consent and include a honeypot. With JavaScript enabled, submissions show an in-page confirmation or retry/contact message; without JavaScript, the Netlify form action redirects to `/thank-you.html`.

All four property landing pages include a static HTML Netlify form named `property-enquiry`, with the property name, a honeypot, and a redirect to `/thank-you.html`. To receive submissions, sign in to the Netlify dashboard for the `ramrealty` site, open **Forms**, select **Enable form detection**, and deploy the site again. Netlify scans the deployed HTML for forms; the dashboard setting cannot be enabled from this repository. Email notifications are configured separately in the Netlify dashboard.

Submissions are stored by Netlify, not written directly into Google Sheets. To use them in Sheets, export the form submissions as a CSV from the Netlify dashboard and import that CSV into Google Sheets.


The project pages include Ram Realty owner-share details, downloadable posters and video walkthroughs. Supplied official brochures and floor/building plans are published under `dist/assets/documents/` and linked from the matching project page. The `/videos/` page contains 12 supplied property clips. Posters load lazily, and each MP4 source is attached only after a visitor presses Play walkthrough. Pricing, area basis, possession/status, charges and RERA details should be reconfirmed against current project records.


## Validate before deployment

Run `python tools/audit_site.py`, `node tools/test-enquiry.mjs`, and `git diff --check` before pushing. The enquiry test uses a local HTTP receiver and DOM stubs; it does not submit real leads or verify Netlify notification delivery. Generated test reports are written to `audit-results/` and should remain local.

Shared accessibility styling is in `dist/assets/site-accessibility.css`. The displayed logo and selected homepage artwork use smaller derivatives; original artwork remains available. `dist/_headers` configures response headers and one-day revalidated caching for assets; `netlify.toml` sets the publish directory. The custom `404.html` is served by Netlify for missing pages.

After deploying, verify each enquiry form in Netlify and check the sitemap and production response headers. Search Console verification is configured in DNS, so no ownership token is embedded in this repository.


## Responsive images and project banners

The homepage uses responsive WebP sources with legacy fallbacks. The project pages promote four distinct AI-generated concept illustrations into the main hero beside each project title and removes the repeated lower banner. Each has its own artwork, project/locality copy, colour accent and explicit illustrative disclosure; the artwork does not establish the actual building design, views or amenities. Masters and original generation prompts are documented in `artwork/project-banners/README.md`. `tools/optimize-images.cjs` recreates WebP derivatives when Sharp and the local masters are available; `node tools/export-project-hero-fallbacks.cjs` recreates JPEG fallbacks/social images. No new image generation was needed for the hero revision.

A server-rendered, collapsible homepage table compares the four listings by area basis, status, quoted rate and listed charges. Update it alongside project pages when confirmed inventory information changes. Netlify-only enquiry reporting is documented in `ENQUIRY_REPORTING.md`; no analytics SDK or click-tracking endpoint has been added.


## Low-data walkthrough playback

Walkthroughs default to separate data-saver MP4s, with original quality still selectable. The player attaches a media source only after an explicit Play action, keeps at most one player loaded, and releases the media source when closed, far offscreen, on page hide or when switching quality. Portrait footage uses a taller active player on phones. No autoplay occurs on initial page load.

See `VIDEO_OPTIMIZATION.md` for the encoding profile, regeneration commands and tradeoffs. Run `node tools/test-video-player.mjs` after changing player behavior. The original videos remain available and are not overwritten by optimization.

Walkthrough poster images now use responsive WebP derivatives with JPEG fallbacks. The brand image also has a small WebP source with its PNG fallback retained. Run `node tools/optimize-previews.cjs` with the existing local Sharp installation to regenerate these assets; `tools/preview-manifest.json` records the resulting dimensions and byte sizes. No image tool is required by the deployed site.

`tools/public-audit.py` performs a bounded, cached public GET/HEAD audit without submitting forms. It writes dated evidence to ignored `audit-results/`; it is not a substitute for browser QA or an accessibility conformance assessment. `PUBLIC_WEBSITE_AUDIT_2026-10-15.md` distinguishes the current public findings from verified local fixes awaiting an authorized release.

Run `python tools/check-project-seo.py` after changing metadata or project heroes. It checks the nine sitemap pages, sharing metadata, distinct project art, image priority/disclosure, contextual links and homepage WebSite name data. `SEO_REVIEW_2026-10-15.md` records the editorial SEO assessment, keyword/topic map, public backlink limitation and local verification results. Dated audit reports are local working evidence and are not included in the release.

Current editable copy uses the owner's preferred locality spelling, Madhuravada. Run `python tools/check-listing-consistency.py` after changing listing information; it checks locality/structured-address consistency, MVV's confirmed starting rate of ₹5,300/sq ft, homepage comparison and poster references. The current MVV download is `dist/assets/projects/posters/mvv-gv-grand.svg`; original supplied artwork/documents are preserved. `LOCALITY_AND_PRICE_UPDATE.md` records the scope, public indexing limitations and all four illustrated project previews. No spelling change alone guarantees indexing or rankings.
