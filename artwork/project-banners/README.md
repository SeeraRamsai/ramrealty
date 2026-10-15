# Project banner artwork

Created with the built-in imagegen tool on 15 October 2026. PNG masters are stored locally in artwork/project-banners/; optimized 640 px and 1280 px WebP variants are published under dist/assets/responsive/.

All banners are concept illustrations. They do not depict the actual project design, views or amenities. Factual project descriptions are rendered as accessible HTML beside the artwork and can be updated independently.

The subsequent local SEO/hero revision reuses these four distinct illustrations in the main project heroes, replacing the video-preview/legacy hero images and removing the duplicated lower banner. Project titles and locality labels remain HTML, rather than text baked into the image. No new image generation or creative image editing was performed for that revision. Shared layout: `dist/assets/project-hero-v1.css`; JPEG fallback/social export: `tools/export-project-hero-fallbacks.cjs`; manifest: `tools/project-hero-manifest.json`. All revisions remain local until an explicitly authorized push/release.

## Prompt set

Common direction: wide 1536 x 1024 editorial architectural illustration; precise ink contours, soft painterly planes, paper texture; matte charcoal #11100e and antique gold #d8b66a; buildings on the right, calm dark negative space on the left for HTML typography. No text, numbers, logos, people, pools or invented amenities. Do not present the image as a photograph or an official project rendering.

- MVV-GV Grand: 3 BHK owner-share project, Madhurawada, Visakhapatnam; conceptual tall apartment silhouettes, warm windows, slate-blue dusk and distant coastal hills; no claim of completed construction.
- Vaisakhi West Winds: 3 BHK owner-share homes, Sai Priya Layout, Madhurawada; layered apartment forms, abstract breeze lines, restrained palms and warm sunrise haze with sage accents.
- A Square Maple Woods: 3 BHK owner-share homes, Sai Priya Layout, Madhurawada; abstract mid-rise form and stylized leaves, sage shadows and antique-gold light; no completion claim.
- Utkarsha Capital Towers: 3 BHK owner-share homes, Bakkannapalem, Madhurawada; sculptural apartment silhouettes, abstract coastal-hill contours and navy blue-hour shadows; no specific floor, orientation, availability or size depicted.

## Recreate web derivatives

Install Sharp locally: npm install --prefix .asset-tools --no-save --package-lock=false sharp
Run: node tools/optimize-images.cjs

The script creates compressed derivatives without overwriting the PNG masters or existing legacy image fallbacks. No image-generation API key is required for the built-in generation workflow used here.
