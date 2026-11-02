"""Apply the shared consultancy shell and restructure the static homepage."""
from pathlib import Path
import re

root = Path('dist')
brand = '<a class="site-brand" href="/"><span class="brand-symbol" aria-hidden="true"><img src="/assets/ram-realty-logo-small.png" width="70" height="70" alt=""></span><span class="brand-words"><strong>RAM REALTY</strong><small>Homes. Local knowledge.</small></span></a>'
nav = '<a href="/#homes">Properties</a><a href="/#locations">Locations</a><a href="/videos/">Walkthroughs</a><a href="/about.html">About</a><a href="tel:+917799251808">Contact us</a>'
header = f'<header class="site-header"><div class="wrap header-inner">{brand}<nav class="desktop-nav" aria-label="Main navigation">{nav}</nav><details class="mobile-menu"><summary aria-label="Open navigation menu">Menu ☰</summary><nav aria-label="Mobile navigation">{nav}<a href="/faq.html">Buyer FAQs</a></nav></details></div></header>'
footer = f'''<footer class="site-footer"><div class="wrap"><div class="footer-grid"><div>{brand}<p>Owner-share homes and local property guidance in Visakhapatnam. Speak with property consultant Ramsai Seera to explore your next move.</p><p>PM Palem, Visakhapatnam<br>Contact hours: daily, 8 AM–11 PM</p></div><div class="footer-column"><h2>Explore Ram Realty</h2><a href="/#homes">Our property collection</a><a href="/videos/">Property walkthroughs</a><a href="/about.html">About Ram Realty</a><a href="/faq.html">Buyer FAQs</a><a href="tel:+917799251808">+91 77992 51808</a></div><div class="footer-column"><h2>Explore locations</h2><a href="/locations/madhuravada/">Madhuravada</a><a href="/locations/pm-palem/">PM Palem</a><a href="/locations/yendada/">Yendada</a><a href="/locations/kommadi/">Kommadi</a></div></div><div class="footer-bottom"><span>© 2026 Ram Realty · Visakhapatnam</span><a href="/privacy.html">Privacy notice</a></div><p>Confirm the exact unit, current availability, pricing, area basis, approvals, possession and all charges against current project documents. Concept illustrations are labelled and do not establish actual project designs, views or amenities.</p></div></footer>'''
mobile = '<div class="mobile-contact" aria-label="Quick contact"><a href="tel:+917799251808">Call Ram Realty</a><a href="https://wa.me/917799251808?text=Hi%20Ram%20Realty%2C%20please%20help%20me%20with%20my%20home%20search." target="_blank" rel="noopener">WhatsApp ↗</a></div>'

for p in root.rglob('*.html'):
    s = p.read_text(encoding='utf8')
    if 'class="site-header"' in s:
        continue
    project = 'class="project-concept ' in s
    home = p == root/'index.html'
    kind = 'home-page' if home else 'project-page' if project else 'videos-page' if p == root/'videos/index.html' else 'guide-page'
    s = s.replace('<body>',f'<body class="{kind}">',1)
    s = re.sub(r'<header\b.*?</header>',lambda m:header,s,count=1,flags=re.S)
    if 'class="site-header"' not in s:
        s=s.replace('<main',header+'<main',1)
    s = re.sub(r'<footer\b.*?</footer>',lambda m:footer,s,count=1,flags=re.S)
    if 'class="site-footer"' not in s:
        s=s.replace('</main>','</main>'+footer,1)
    s = re.sub(r'<div class="sticky">.*?</div>','',s,flags=re.S)
    s=s.replace('</body>',mobile+'</body>')
    s=re.sub(r'(<meta name="theme-color" content=")[^"]+',r'\g<1>#f7f8fa',s)
    s=s.replace('</head>','<link rel="stylesheet" href="/assets/modern-realty.css"></head>')
    if project:
        target = 'project-details-title' if 'id="project-details-title"' in s else 'overview'
        if target=='overview':
            s=s.replace('<section class="wrap section">','<section class="wrap section" id="overview">',1)
        jump=f'<nav class="wrap project-jump" aria-label="Project sections"><a href="#{target}">Overview &amp; pricing</a><a href="#walkthrough">Walkthrough</a><a href="#enquire">Availability &amp; enquiry</a><a href="/#locations">Area guides</a></nav>'
        s=s.replace('<section class="facts"',jump+'<section class="facts"',1)
        # Breadcrumb and section navigation already sit within the main wrap on these pages.
        if 'id="main-content" tabindex="-1" class="wrap"' in s:
            s=s.replace('class="property-breadcrumb"','class="property-breadcrumb nested-width"').replace('class="wrap project-jump"','class="project-jump"')
    p.write_text(s,encoding='utf8')

p=root/'index.html'
s=p.read_text(encoding='utf8')
if 'class="location-grid"' not in s:
    s=s.replace('Find your place in <em>Vizag.</em>','Find your next home<br>in <em>Visakhapatnam.</em>')
    s=s.replace('Curated owner-share homes · Visakhapatnam','Local expertise. A place to call home.')
    s=s.replace('Explore the collection <span aria-hidden="true">→</span>','Explore properties <span aria-hidden="true">→</span>')
    s=s.replace('<a class="text-link" href="tel:+917799251808">Call +91 77992 51808</a>','<a class="button secondary" href="https://wa.me/917799251808?text=Hi%20Ram%20Realty%2C%20I%20would%20like%20to%20arrange%20a%20site%20visit." target="_blank" rel="noopener">Arrange a visit ↗</a>')
    s=s.replace('</div>\n      </div>\n      <div class="hero-visual">','</div><div class="hero-proof"><span><strong>4 projects</strong>Owner-share collection</span><span><strong>3 BHK homes</strong>Space for your next chapter</span><span><strong>Local guidance</strong>Visakhapatnam</span></div>\n      </div>\n      <div class="hero-visual">',1)
    s=s.replace('<strong>Two kinds of community.</strong>Owner-share options in standalone and gated communities.','<strong>A clearer view of your next move.</strong>Explore the details. Discover the right fit.')
    s=s.replace('A closer look at home.','Homes worth a closer look.')
    s=re.sub(r'    <section class="area-band".*?</section>','',s,flags=re.S)
    match=re.search(r'<section class="wrap section" id="locations".*?</section>',s,re.S)
    locations=match[0]
    s=s.replace(locations,'')
    cards=''
    for number,slug,name,alias in [('01','madhuravada','Madhuravada','Also searched as Madhurawada'),('02','pm-palem','PM Palem','Pothimallayyapalem'),('03','yendada','Yendada','Explore your preferred locality'),('04','kommadi','Kommadi','Plan your area shortlist')]:
        cards+=f'<a class="locality-card" href="/locations/{slug}/"><span class="locality-number">{number} / VIZAG</span><strong>{name}</strong><small>{alias}</small><span class="locality-link">Explore area guide ↗</span></a>'
    locations=re.sub(r'<p><a href="/locations/.*?</p>',lambda m:'<div class="location-grid">'+cards+'</div>',locations,flags=re.S)
    locations=locations.replace('Find homes around your preferred area.','Your neighbourhood. Your next chapter.')
    # Preserve the explicitly approved alternate spelling in the descriptive copy.
    locations=locations.replace('Explore Madhuravada (also searched as Madhurawada), PM Palem (Pothimallayyapalem), Yendada and Kommadi. Each guide includes an area map, buyer questions and links to projects with their stated locations.','Explore Madhuravada (also searched as Madhurawada), PM Palem (Pothimallayyapalem), Yendada and Kommadi. Start with a location guide, explore the map and build your shortlist.')
    s=s.replace('<section class="wrap section" id="homes"',locations+'<section class="wrap section" id="homes"',1)
    s=s.replace('sizes="(max-width:390px) calc(100vw - 36px), (max-width:900px) 45vw, 290px"','sizes="(max-width:520px) calc(100vw - 36px), (max-width:760px) 46vw, 586px"')
    tours='<section class="wrap home-walkthroughs" aria-labelledby="home-tours-title"><div class="section-head"><div><div class="eyebrow">Step inside</div><h2 id="home-tours-title">A closer look, before you visit.</h2></div><a class="text-link" href="/videos/">View all walkthroughs ↗</a></div><div class="tour-grid">'
    for slug,title,image in [('mvv-gv-grand','MVV–GV Grand','mvv-demo-home-tour'),('vaisakhi-west-winds','Vaisakhi West Winds','vaisakhi-west-winds'),('utkarsha-capital-towers','Utkarsha Capital Towers','utkarsha-capital-towers')]:
        # Some project clips use numbered poster names; resolve the supplied assets.
        source=root/f'assets/video-thumbnails/{image}.jpg'
        if not source.is_file():
            source=next((root/'assets/video-thumbnails').glob(slug+'*.jpg'))
        tours+=f'<a class="tour-card" href="/{slug}/#walkthrough"><img src="/{source.relative_to(root).as_posix()}" width="1200" height="675" alt="Supplied walkthrough preview for {title}" loading="lazy" decoding="async"><div><strong>{title}</strong><span>Watch property walkthrough ↗</span></div></a>'
    tours+='</div><p class="note">Supplied property footage. Confirm the exact unit and current stage when arranging a visit.</p></section>'
    s=s.replace('<section class="wrap approach"',tours+'<section class="wrap approach"',1)
    s=s.replace('<div class="approach-copy">','<div class="approach-copy"><p class="consultant-line">Your local property contact: Ramsai Seera</p>',1)
    p.write_text(s,encoding='utf8')
