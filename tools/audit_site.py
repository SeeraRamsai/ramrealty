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
   if v.fragment and not v.path:check(unquote(v.fragment) in ids,f'missing fragment {u}')
 for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>',s,re.S):json.loads(raw);checks+=1
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
ET.parse(root/'sitemap.xml');tomllib.loads(Path('netlify.toml').read_text());checks+=2
print(json.dumps({'checks':checks,'errors':errors},indent=2))
raise SystemExit(bool(errors))
