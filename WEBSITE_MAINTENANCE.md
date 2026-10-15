# Ram Realty maintenance and release procedure

Prepared 15 October 2026. Owners below are roles, not newly created accounts or automations.

## Release rule

Keep changes local until Ramsai explicitly requests a Git push. No push, Netlify preview, production deployment, DNS change, migration, purchase, notification or enquiry submission is authorized by this document. A push to `main` may trigger Netlify production deployment and credit use. The approximately 75% usage figure is owner-reported; the current balance and reset date are not publicly verifiable.

Batch a coherent group of fixes into one reviewed release. Test static changes with `python -m http.server 8000 --bind 127.0.0.1 --directory dist`. This server does not implement Netlify routing, headers or Forms. It cannot prove hosted redirects or actual enquiry delivery.

Before an authorized release:

1. Review `git status --short` and the intended diff. Preserve unrelated local work. Exclude `audit-results/`, virtual environments, image masters and operational enquiry evidence.
2. Record the current revision and take a backup of any uncommitted files you will change. Current audit recovery reference: `e65a943273604e6dee4ae87ac9147034b3656eda`; originals are in `audit-results/public-2026-10-15/recovery/`.
3. Run `python tools/audit_site.py`, `node tools/test-enquiry.mjs`, `node tools/test-video-player.mjs` and `git diff --check`. The enquiry regression test sends only to its temporary localhost receiver. Do not substitute production submissions.
4. Review affected pages at 320 px and desktop width, keyboard focus, empty-form validation, contact destinations, loaded images and deferred videos. Review pricing, availability, status, fees, exact unit and area basis together on project pages and the homepage comparison.
5. For a media/layout change, run one relevant mobile/desktop Lighthouse check. Stop when checks pass; repeat only for a new change, failure or unresolved concern. Keep local and production results separate.
6. Obtain the owner's explicit push instruction, then prepare the requested commit and push once. Do not treat this checklist as that instruction. Netlify routing changes still require hosted verification after an authorized release.
7. After release, check the live canonical pages, three alias redirects, genuine 404, robots/sitemap, headers and changed assets. Confirm a `video-player.css?v=3` response and responsive WebP previews when this batch is released. Form success/notification delivery requires a separately authorized labelled test; leave it unverified otherwise.

## Rollback

Before release, copy back only the affected files from the recovery folder after reviewing newer edits; remove only newly added files specifically listed in the reviewed diff. Do not run broad `git reset --hard` or `git clean` commands. The original MP4, JPEG and PNG assets are retained.

After a future release, prefer reverting the specific release commit in a new commit, then pushing only with explicit authorization. An owner-authorized Netlify rollback to a known successful deploy is another option. This audit has not performed either action. Recheck the core journeys after rollback; hosted redirects, caches and Forms need production evidence.

## Recurring checks

| Frequency | Action | Owner | Verification method |
|---|---|---|---|
| Every release | Important pages, navigation, contact destinations and 404 | Developer / QA | Public HTTP statuses plus browser journey homepage → project → enquiry option |
| Every release | Redirects, canonicals, robots, sitemap and noindex exceptions | Developer / SEO reviewer | Public GET/HEAD, HTML and sitemap comparison; thank-you/404 stay excluded |
| Every release affecting forms | Labels, required fields, consent, success/error/retry behavior | Developer / QA | Local regressions and browser validation; real delivery only with explicit test permission |
| Every release affecting media | Image fallback, responsive choice, deferred playback, one active player, close/focus restoration | Developer / QA | Local browser at 320 px and desktop; no video downloaded before Play |
| Weekly | Availability, current unit, price, charges, possession and area basis | Ramsai / property contact | Current seller/project documents; update all relevant pages together and accurately date the review |
| Weekly | Availability and broken customer journeys | Ramsai / QA | Open public homepage and each main project; verify call/WhatsApp destination without sending |
| Weekly | Obvious branded search/Maps visibility changes | SEO reviewer | Record exact query, engine, date, displayed location and result URL; no universal ranking or index-count claims |
| Monthly | Representative performance and media transfer | Developer / QA | One Lighthouse mobile/desktop run when warranted; PSI/CrUX field data if publicly available; record missing data separately |
| Monthly | Broken links, schema/content agreement and accessibility regressions | Developer / SEO / QA | Cached public audit, static checks, keyboard/narrow-screen review; inspect media captions and alternatives |
| Monthly | Public business-listing consistency | Ramsai / SEO reviewer | Compare verified name, phone, hours, service area and eligible listing details; never fabricate reviews or map pins |
| Monthly | Data retention and privacy notice accuracy | Ramsai | Review enquiry handling policy and implementation; account-only deletion/retention evidence is not public |
| Quarterly | Structure, overlapping pages and useful content gaps | Ramsai / SEO reviewer | Review visitor questions, exact-unit documents, contact clarity; expand useful pages rather than thin locality clones |
| Quarterly | Source dependencies, recovery and hosting suitability | Developer / owner | Inventory local tooling and site runtime; test recovery on an isolated copy; compare hosting only if current needs justify it |
| When new footage is published | Speech captions, essential sound cues and visual description | Content owner / accessibility reviewer | Review the actual footage, produce and check accurate captions/description; do not invent dialogue |

## Media and credit efficiency

Keep data saver as the default and preserve the original-quality option. Use `tools/optimize-previews.cjs` and the existing Sharp installation to regenerate preview images. Use `VIDEO_OPTIMIZATION.md` for video encoding and full decode validation. No installed asset tool is shipped to visitors.

Current site runtime is static HTML/CSS/JavaScript with Netlify Forms; no framework build, paid CDN, analytics SDK or hosting migration is needed for these fixes. HTML revalidates, assets have a one-day cache policy, and changed shared styles use versioned URLs. Keep public-audit evidence cached and use HEAD/range checks instead of repeatedly downloading full media. Do not use `robots.txt` to hide private information; keep private files outside `dist` and use proper access controls where needed.

Account-only reports, credit details, server logs and actual notification delivery remain outside a public audit. No scheduled jobs or notifications were created.
