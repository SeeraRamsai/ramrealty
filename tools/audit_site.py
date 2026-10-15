from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,re,xml.etree.ElementTree as ET,tomllib
root=Path('dist'); errors=[];checks=0
class Page(HTMLParser):
 def __init__(self,s):super().__init__();self.tags=[];self.feed(s)
 def handle_starttag(self,t,a):self.tags.append((t,dict(a)))
for p in root.rglob('*.html'):
 s=p.read_text(encoding='utf-8');page=Page(s); ids=[a['id'] for t,a in page.tags if 'id' in a]
 def check(ok,msg):
  global checks
  checks+=1
  if not ok:errors.append(f'{p}: {msg}')
 check(sum(t=='h1' for t,a in page.tags)==1,'one H1')
 check(sum(t=='main' for t,a in page.tags)==1,'one main')
 check('main-content' in ids,'skip target')
 check(len(ids)==len(set(ids)),'unique IDs')
 for t,a in page.tags:
  if t=='img':check('alt' in a,'image alt')
  for responsive_attr in ('srcset','imagesrcset'):
   if responsive_attr not in a:continue
   descriptors=[]
   for candidate in a.get(responsive_attr,'').split(','):
    parts=candidate.strip().split()
    if not parts:continue
    v=urlsplit(parts[0]);f=root/unquote(v.path.lstrip('/')) if v.path.startswith('/') else p.parent/unquote(v.path)
    check(f.exists(),f'missing responsive asset {parts[0]}')
    if len(parts)>1:descriptors.append(parts[1])
   check(len(descriptors)==len(set(descriptors)),f'duplicate {responsive_attr} descriptors')
  for key in ('href','src','data-src','data-original-src'):
   u=a.get(key,'');v=urlsplit(u)
   if v.scheme or v.netloc or not u:continue
   if v.path:
    f=root/unquote(v.path.lstrip('/')) if v.path.startswith('/') else p.parent/unquote(v.path)
    if f.is_dir():f=f/'index.html'
    check(f.exists(),f'missing asset {u}')
   if v.fragment:
    target_ids=ids
    if v.path and f.exists() and f.suffix=='.html':
     target_ids=[a['id'] for t,a in Page(f.read_text(encoding='utf-8')).tags if 'id' in a]
    if not v.path or (f.exists() and f.suffix=='.html'):
     check(unquote(v.fragment) in target_ids,f'missing fragment {u}')
 for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>',s,re.S):
  schema=json.loads(raw);checks+=1
  if isinstance(schema,dict) and schema.get('@type')=='RealEstateListing':
   check('address' not in schema and 'broker' not in schema,'listing uses supported WebPage properties')
   check(schema.get('about',{}).get('@type')=='ApartmentComplex','listing describes the apartment project')
   check(schema.get('publisher',{}).get('telephone')=='+91-77992-51808','listing publisher contact')
   check(schema.get('breadcrumb',{}).get('@type')=='BreadcrumbList','listing breadcrumb data')
 if any(t=='form' for t,a in page.tags):
  check('name="form-name" value="property-enquiry"' in s,'Netlify form name')
  check('name="contact_consent"' in s,'consent field')
  check('name="bot-field"' in s,'honeypot')
# Shared Netlify form names must register the same union of fields on every page.
field_sets=[]
for page_path in root.rglob('*.html'):
 parsed=Page(page_path.read_text(encoding='utf-8'))
 if any(t=='form' and a.get('name')=='property-enquiry' for t,a in parsed.tags):
  field_sets.append((page_path,{a['name'] for t,a in parsed.tags if t in ('input','select','textarea') and a.get('name')}))
expected_fields=set().union(*(names for _,names in field_sets))
for page_path,names in field_sets:
 checks+=1
 if names!=expected_fields:errors.append(f'{page_path}: shared Netlify schema missing {sorted(expected_fields-names)}')
sitemap=ET.parse(root/'sitemap.xml');config=tomllib.loads(Path('netlify.toml').read_text());checks+=2
# Canonical destinations must exist, be indexable and agree with the sitemap.
titles=[]
for loc in sitemap.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc'):
 u=loc.text;target=root/urlsplit(u).path.lstrip('/')
 if target.is_dir():target=target/'index.html'
 check(target.exists(),f'sitemap target missing {u}')
 if not target.exists():continue
 parsed=Page(target.read_text(encoding='utf-8'))
 check(any(t=='link' and a.get('rel')=='canonical' and a.get('href')==u for t,a in parsed.tags),f'sitemap/canonical mismatch {u}')
 check(not any(t=='meta' and a.get('name','').lower()=='robots' and 'noindex' in a.get('content','').lower() for t,a in parsed.tags),f'sitemap target noindex {u}')
 title=re.search(r'<title>(.*?)</title>',target.read_text(encoding='utf-8'),re.S)
 check(bool(title and title.group(1).strip()),f'missing title {u}')
 if title:titles.append(title.group(1))
check(len(titles)==len(set(titles)),'duplicate sitemap page titles')
redirects={r['from']:r['to'] for r in config.get('redirects',[])}
for start,target in redirects.items():
 seen=set();current=start
 while current in redirects and current not in seen:seen.add(current);current=redirects[current]
 check(current not in seen,f'redirect loop {start}')
 if not urlsplit(target).scheme:
  f=root/target.lstrip('/')
  if f.is_dir():f=f/'index.html'
  check(f.exists(),f'redirect target missing {target}')
print(json.dumps({'checks':checks,'errors':errors},indent=2))
raise SystemExit(bool(errors))
