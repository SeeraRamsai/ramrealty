# Enquiry reporting with Netlify

Use Netlify > ramrealty > Forms > property-enquiry to review accepted submissions. Email delivery is configured separately in Submission notifications. The dashboard and inbox are the operational sources; a client-side success message alone is not counted as proof of a received enquiry.

For a local summary, export the form's CSV into the ignored audit-results directory, then run:

    python tools/summarize-enquiries.py audit-results/property-enquiry.csv

The report prints counts by project and campaign and excludes names beginning AUDIT TEST. It does not print phone numbers or contact names, send data to another service, or create visitor identifiers. Keep the raw CSV private and do not commit it. Counts describe the export, including any date range/status selected in Netlify, rather than all unique people or qualified sales leads.

Campaign fields are currently attached on West Winds, Maple Woods and Utkarsha pages. MVV currently does not attach campaign tags; its source appears as Not tagged. Shared hidden fields ensure the backend accepts every project's fields, but blank fields do not establish attribution.

Call and WhatsApp clicks are not tracked under the Netlify-only choice. Do not infer click totals from form counts or email notifications. Search Console reports discovery/search traffic; it does not verify lead quality.
