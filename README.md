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

All four project enquiry forms use Netlify Forms with the shared name `property-enquiry` and include the property name so submissions can be identified. The MVV–GV Grand form collects name, phone, budget, preferred area and buying timeline. The other project forms collect name and phone, require a preferred layout and offer an optional buying timeline. The three non-MVV forms also attach available UTM campaign values and the referring page URL. All forms require contact consent and include a honeypot. With JavaScript enabled, submissions show an in-page confirmation or retry/contact message; without JavaScript, the Netlify form action redirects to `/thank-you.html`.

All four property landing pages include a static HTML Netlify form named `property-enquiry`, with the property name, a honeypot, and a redirect to `/thank-you.html`. To receive submissions, sign in to the Netlify dashboard for the `ramrealty` site, open **Forms**, select **Enable form detection**, and deploy the site again. Netlify scans the deployed HTML for forms; the dashboard setting cannot be enabled from this repository. Email notifications are configured separately in the Netlify dashboard.

Submissions are stored by Netlify, not written directly into Google Sheets. To use them in Sheets, export the form submissions as a CSV from the Netlify dashboard and import that CSV into Google Sheets.


The project pages include Ram Realty owner-share details, downloadable posters and video walkthroughs. Supplied official brochures and floor/building plans are published under `dist/assets/documents/` and linked from the matching project page. The `/videos/` page contains 12 supplied property clips. Posters load lazily, and each MP4 source is added only after a visitor chooses to load its player; native controls then require an explicit play action. Pricing, area basis, possession/status, charges and RERA details should be reconfirmed against current project records.


## Validate before deployment

Run `python tools/audit_site.py`, `node tools/test-enquiry.mjs`, and `git diff --check` before pushing. The enquiry test uses a local HTTP receiver and DOM stubs; it does not submit real leads or verify Netlify notification delivery. Generated test reports are written to `audit-results/` and should remain local.

Shared accessibility styling is in `dist/assets/site-accessibility.css`. The displayed logo and selected homepage artwork use smaller derivatives; original artwork remains available. `netlify.toml` configures response headers and one-day revalidated caching for assets. The custom `404.html` is served by Netlify for missing pages.

After deploying, verify each enquiry form in Netlify and check the sitemap and production response headers. Search Console verification is configured in DNS, so no ownership token is embedded in this repository.
