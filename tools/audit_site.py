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
  for key in ('href','src','data-src'):
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
ET.parse(root/'sitemap.xml');tomllib.loads(Path('netlify.toml').read_text());checks+=2
print(json.dumps({'checks':checks,'errors':errors},indent=2))
raise SystemExit(bool(errors))
