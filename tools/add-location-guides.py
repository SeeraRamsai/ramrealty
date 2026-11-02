"""Generate the four local buyer guides using the site's existing page shell."""
from pathlib import Path
import html
import json
import re
from urllib.parse import quote

root = Path('dist')
areas = [
 ('madhuravada', 'Madhuravada', 'Madhurawada',
  'Start with the published Madhuravada collection',
  'The current collection includes MVV–GV Grand in Madhuravada, Vaisakhi West Winds and A Square Maple Woods in Sai Priya Layout, and Utkarsha Capital Towers in Bakkannapalem, Madhuravada. Compare the exact project address as well as the wider locality name.',
  'For a Madhuravada shortlist, compare standalone and gated-community options, then check the quoted area basis and additional charges for the specific unit. A locality search can include different layouts, so use the project pin when planning a visit.'),
 ('pm-palem', 'PM Palem', 'Pothimallayyapalem',
  'Build a shortlist from your PM Palem starting point',
  'Ram Realty lists its office locality as PM Palem, Visakhapatnam. If you are searching for a home in Pothimallayyapalem, share your preferred street or map pin and ask for current options in that boundary. The published project collection is labelled with its own Madhuravada, Sai Priya Layout and Bakkannapalem locations.',
  'Decide whether your search is limited to PM Palem or can include the wider Madhuravada area. Check the route from each project entrance to your regular destinations and confirm the meeting point before arranging a site visit.'),
 ('yendada', 'Yendada', '',
  'Keep your Yendada search tied to the exact address',
  'Looking for flats in Yendada? Tell Ram Realty whether you need an address within Yendada or are also considering other Visakhapatnam localities. The published collection currently identifies projects in Madhuravada, Sai Priya Layout and Bakkannapalem; it does not establish available inventory within Yendada.',
  'Use your workplace, school or family address as the starting point for comparing routes. For each proposed home, check the actual entrance, access road, parking arrangement and day-to-day travel before deciding whether the location suits you.'),
 ('kommadi', 'Kommadi', '',
  'Separate a Kommadi address from a wider area search',
  'For a Kommadi apartment search, specify whether you want a property within Kommadi or would consider the published Madhuravada-area collection. Utkarsha Capital Towers is listed in Bakkannapalem, Madhuravada; its address should not be assumed to be Kommadi.',
  'Ask for an exact project map pin and visit the approach road before shortlisting. Compare the building location, unit layout, possession details and complete written cost together, rather than choosing from a broad locality label alone.'),
]
links = ' · '.join(f'<a href="/locations/{slug}/">{name}</a>' for slug,name,*_ in areas)
projects = [('mvv-gv-grand','MVV–GV Grand','Madhuravada'),('vaisakhi-west-winds','Vaisakhi West Winds','Sai Priya Layout, Madhuravada'),('a-square-maple-woods','A Square Maple Woods','Sai Priya Layout, Madhuravada'),('utkarsha-capital-towers','Utkarsha Capital Towers','Bakkannapalem, Madhuravada')]
shell = (root/'about.html').read_text(encoding='utf8')
for slug, name, alias, heading, intro, advice in areas:
    url = f'https://ramrealty.in/locations/{slug}/'
    title = f'Flats in {name} | Area & Home Search Guide | Ram Realty'
    description = f'Search for flats in {name}' + (f' ({alias})' if alias else '') + ', Visakhapatnam. Explore the area map, compare published projects and ask Ram Realty for current options.'
    s = shell
    s = re.sub(r'<title>.*?</title>', '<title>'+title+'</title>', s)
    for key, value in [('description',description),('og:title',title),('og:description',description),('og:url',url),('twitter:title',title),('twitter:description',description)]:
        s = re.sub(r'(<meta (?:name|property)="'+key+r'" content=")[^"]*', lambda m:m[1]+html.escape(value,quote=True), s)
    s = re.sub(r'(<link rel="canonical" href=")[^"]*',lambda m:m[1]+url,s)
    schema = {'@context':'https://schema.org','@type':'CollectionPage','@id':url+'#page','url':url,'name':title,'description':description,'about':{'@type':'Place','name':name+', Visakhapatnam',**({'alternateName':alias} if alias else {})},'breadcrumb':{'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Home','item':'https://ramrealty.in/'},{'@type':'ListItem','position':2,'name':name,'item':url}]}}
    s = re.sub(r'<script type="application/ld\+json">.*?</script>','<script type="application/ld+json">'+json.dumps(schema,ensure_ascii=False)+'</script>',s,flags=re.S)
    s = s.replace(' aria-current="page"','')
    items = ''.join(f'<li><a href="/{p}/">{n}</a> — {a}</li>' for p,n,a in projects)
    map_url = 'https://www.google.com/maps/search/?api=1&amp;query='+quote((alias or name)+', Visakhapatnam')
    message = quote(f'Hi Ram Realty, I am looking for a home in {name}. Please confirm current options and exact project locations.')
    content = f'''<main id="main-content" tabindex="-1" class="wrap">
    <p><a href="/">Home</a> / {name}</p>
    <p class="kicker">Visakhapatnam locality guide</p>
    <h1>Flats and apartments in {name}</h1>
    <p>{name + ' is also searched as ' + alias + '. ' if alias else ''}Explore your home search by location, then compare the project and unit details that matter to you.</p>
    <section aria-labelledby="shortlist"><h2 id="shortlist">{heading}</h2><p>{intro}</p><p>{advice}</p></section>
    <section class="panel" aria-labelledby="area-map"><h2 id="area-map">Explore {name} on the map</h2><p>Open the area map to orient your search. This is a locality search, not a verified project or office pin. Ask for the exact property location before travelling.</p><a class="button" href="{map_url}" target="_blank" rel="noopener">Open {name} area map</a></section>
    <section aria-labelledby="collection"><h2 id="collection">Compare the published project collection</h2><p>These links show each project's stated locality. They are comparison options; current availability in {name} must be confirmed separately.</p><ul>{items}</ul></section>
    <section aria-labelledby="questions"><h2 id="questions">What to ask before a site visit</h2><ul><li>Is the unit within my preferred locality? Please share the full address and map pin.</li><li>Which units are available, and what area basis is used for the quoted rate?</li><li>What is the full written cost, including parking, amenities and other applicable charges?</li><li>Which project documents, approvals and possession details can I review?</li></ul></section>
    <h2>Search nearby areas</h2><p>{links}</p>
    <div class="actions"><a class="button" href="https://wa.me/917799251808?text={message}" target="_blank" rel="noopener">Ask about homes in {name}</a><a class="button" href="tel:+917799251808">Call +91 77992 51808</a></div>
    </main>'''
    s = re.sub(r'<main\b.*?</main>',lambda m:content,s,flags=re.S)
    target = root/'locations'/slug/'index.html'
    target.parent.mkdir(parents=True,exist_ok=True)
    target.write_text(s,encoding='utf8')

home = root/'index.html'
s = home.read_text(encoding='utf8')
section = f'''<section class="wrap section" id="locations" aria-labelledby="locations-title"><div class="section-head"><div><div class="eyebrow">Search by location</div><h2 id="locations-title">Find homes around your preferred area.</h2></div></div><p>Explore Madhuravada (also searched as Madhurawada), PM Palem (Pothimallayyapalem), Yendada and Kommadi. Each guide includes an area map, buyer questions and links to projects with their stated locations.</p><p>{links}</p></section>'''
if 'id="locations"' not in s:
    s = s.replace('  </main>',section+'\n  </main>')
    s = s.replace('<a href="#homes">Explore homes</a>','<a href="#homes">Explore homes</a>\n      <a href="#locations">Locations</a>')
home.write_text(s,encoding='utf8')
for p in [root/'about.html',*[root/slug/'index.html' for slug,_,_ in projects]]:
    s=p.read_text(encoding='utf8')
    if 'aria-label="Locality guides"' not in s:
        s=s.replace('</main>',f'<nav aria-label="Locality guides"><p>Explore area guides: {links}</p></nav>\n</main>')
    p.write_text(s,encoding='utf8')
sitemap=root/'sitemap.xml'
s=sitemap.read_text(encoding='utf8')
for slug,*_ in areas:
    url=f'https://ramrealty.in/locations/{slug}/'
    if url not in s:
        s=s.replace('</urlset>',f'  <url><loc>{url}</loc><lastmod>2026-10-31</lastmod></url>\n</urlset>')
for url in ['https://ramrealty.in/','https://ramrealty.in/about.html',*[f'https://ramrealty.in/{slug}/' for slug,_,_ in projects]]:
    s=re.sub(r'(<loc>'+re.escape(url)+r'</loc><lastmod>)[^<]+',lambda m:m[1]+'2026-10-31',s)
sitemap.write_text(s,encoding='utf8')
