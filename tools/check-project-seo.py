"""Verify indexable-page metadata and distinct concept heroes without network requests."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import hashlib,json,re,xml.etree.ElementTree as ET

root=Path('dist');errors=[];checks=0
class Page(HTMLParser):
 def __init__(self,s):super().__init__();self.tags=[];self.feed(s)
 def handle_starttag(self,t,a):self.tags.append((t,dict(a)))
def check(ok,message):
 global checks
 checks+=1
 if not ok:errors.append(message)
titles=[];descriptions=[];projects=[];hero_hashes=[];social_images=[]
for loc in ET.parse(root/'sitemap.xml').findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc'):
 url=loc.text;p=root/urlsplit(url).path.lstrip('/')
 if p.is_dir():p=p/'index.html'
 s=p.read_text(encoding='utf8');page=Page(s)
 meta={a.get('name',a.get('property')):a.get('content','') for t,a in page.tags if t=='meta'}
 title=re.search(r'<title>(.*?)</title>',s,re.S);title=title.group(1).strip() if title else ''
 check(bool(title),f'{url}: missing title');titles.append(title)
 description=meta.get('description','').strip();check(bool(description),f'{url}: missing description');descriptions.append(description)
 for k in ('og:title','og:description','og:url','og:image','twitter:card','twitter:title','twitter:description','twitter:image'):
  check(bool(meta.get(k)),f'{url}: missing {k}')
 check(meta.get('og:url')==url,f'{url}: sharing URL differs from canonical')
 image_url=meta.get('og:image','');image_path=root/urlsplit(image_url).path.lstrip('/')
 check(image_url.startswith('https://ramrealty.in/') and image_path.is_file(),f'{url}: missing/invalid sharing image')
 check(sum(t=='h1' for t,a in page.tags)==1,f'{url}: main title count')
 if 'project-concept' not in s:continue
 slug=p.parent.name;projects.append(slug)
 check('3 BHK' in title and ('Madhuravada' in title or 'Bakkannapalem' in title),f'{slug}: title lacks supported configuration/locality')
 check(meta.get('og:title')==title==meta.get('twitter:title'),f'{slug}: inconsistent title metadata')
 check(meta.get('og:description')==description==meta.get('twitter:description'),f'{slug}: inconsistent descriptions')
 check('AI concept illustration' in meta.get('og:image:alt',''),f'{slug}: social image must disclose concept')
 hero=re.search(r'<figure class="project-concept .*?</figure>',s,re.S)
 check(bool(hero),f'{slug}: missing hero')
 if not hero:continue
 h=Page(hero.group(0));images=[a for t,a in h.tags if t=='img']
 check(len(images)==1,f'{slug}: hero image count')
 if images:
  img=images[0];check(img.get('fetchpriority')=='high' and img.get('loading')!='lazy',f'{slug}: hero loading priority')
  check(bool(img.get('alt')) and 'concept' in img['alt'].lower(),f'{slug}: meaningful concept alternative')
  target=root/img['src'].lstrip('/');check(target.is_file(),f'{slug}: missing fallback')
  if target.is_file():hero_hashes.append(hashlib.sha256(target.read_bytes()).hexdigest())
 check('does not depict the actual project, views or amenities' in hero.group(0),f'{slug}: missing visible disclosure')
 check('class="project-banner"' not in s,f'{slug}: duplicate old banner')
 check('class="project-context"' in s,f'{slug}: missing contextual buyer-guide links')
 social_images.append(image_url)
check(len(titles)==len(set(titles)),'Duplicate sitemap titles')
check(len(descriptions)==len(set(descriptions)),'Duplicate sitemap descriptions')
check(len(projects)==4,'Expected four project heroes')
check(len(set(hero_hashes))==4,'Hero artwork is not distinct across four projects')
check(len(set(social_images))==4,'Project sharing images must be distinct')
homepage=(root/'index.html').read_text(encoding='utf8')
schemas=[json.loads(raw) for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>',homepage,re.S)]
websites=[d for d in schemas if isinstance(d,dict) and d.get('@type')=='WebSite']
check(len(websites)==1 and websites[0].get('name')=='Ram Realty' and websites[0].get('url')=='https://ramrealty.in/','Homepage WebSite name/URL data')
print(json.dumps({'checks':checks,'errors':errors,'indexablePages':len(titles),'distinctHeroes':len(set(hero_hashes))},indent=2))
raise SystemExit(bool(errors))
