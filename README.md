# Ram Realty property website

A static property website for Ram Realty, featuring a Visakhapatnam property listing and an MVV–GV Grand detail page. The site is served directly from `dist`; it does not require a build step or package installation.

## Project structure

```text
.
├── netlify.toml
└── dist/
    ├── index.html
    ├── thank-you.html
    ├── assets/
    └── mvv-gv-grand/
        ├── index.html
        ├── artwork.png
        └── videos/
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
4. Submit a test enquiry from the deployed `/mvv-gv-grand/` page.
5. In the Netlify dashboard, open **Forms** and confirm the `property-enquiry` form and test submission appear.

The site is static, so no build command is needed. The publish directory is set to `dist` in `netlify.toml`.

## Enquiry submissions

The MVV–GV Grand enquiry form is configured for Netlify Forms with the name `property-enquiry`. It collects the visitor's name, phone number, budget, preferred area, and buying timeline. Successful submissions go to `thank-you.html`; a honeypot field helps reduce spam.

Submissions are stored by Netlify, not written directly into Google Sheets. To use them in Sheets, export the form submissions as a CSV from the Netlify dashboard and import that CSV into Google Sheets.
