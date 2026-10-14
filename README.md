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
4. Submit a test enquiry from the deployed `/mvv-gv-grand/` page and one of the new project pages.
5. In the Netlify dashboard, open **Forms** and confirm the `property-enquiry` form and test submission appear.

The site is static, so no build command is needed. The publish directory is set to `dist` in `netlify.toml`.

## Search and sharing

Public pages have page-specific titles, descriptions, canonical URLs, and Open Graph/Twitter preview metadata. The homepage and property pages use descriptive content about the actual listings and areas served; the About and FAQ pages provide additional visitor information and are included in `sitemap.xml`. Structured data describes the real estate agent, About page, and visible FAQs. `robots.txt` points crawlers to the sitemap. The enquiry confirmation page remains `noindex`.

Search engines do not use the legacy `meta keywords` tag for ranking, so search phrases are incorporated naturally into titles, descriptions, headings, page copy, and internal links rather than added as keyword lists. Metadata and sitemaps can help crawlers understand the site, but rankings depend on many factors and cannot be guaranteed. Keep project, pricing, availability, business profile, and contact information accurate and current; verify the live deployment and submit the sitemap through Google Search Console and Bing Webmaster Tools.

## Enquiry submissions

The MVV–GV Grand and new project enquiry forms use Netlify Forms with the shared name `property-enquiry`; each includes the property name so submissions can be identified. The MVV page collects the visitor's name, phone number, budget, preferred area, and buying timeline. The new project pages collect name and phone, with optional layout and buying timeline preferences. Successful submissions redirect to `/thank-you.html`; forms include a honeypot to help reduce spam. The MVV page also has custom JavaScript for duplicate-submit prevention and retry messaging.

All four property landing pages include a static HTML Netlify form named `property-enquiry`, with the property name, a honeypot, and a redirect to `/thank-you.html`. To receive submissions, sign in to the Netlify dashboard for the `ramrealty` site, open **Forms**, select **Enable form detection**, and deploy the site again. Netlify scans the deployed HTML for forms; the dashboard setting cannot be enabled from this repository. Email notifications are configured separately in the Netlify dashboard.

Submissions are stored by Netlify, not written directly into Google Sheets. To use them in Sheets, export the form submissions as a CSV from the Netlify dashboard and import that CSV into Google Sheets.


The project pages include Ram Realty owner-share details, downloadable posters and video walkthroughs. Supplied official brochures and floor/building plans are published under `dist/assets/documents/` and linked from the matching project page. The `/videos/` page contains the 11 supplied property clips with branded thumbnails and optimized MP4 versions. Pricing and availability should be reconfirmed against a current written cost sheet.
