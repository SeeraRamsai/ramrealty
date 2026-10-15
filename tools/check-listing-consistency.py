"""Check owner-confirmed locality spelling and MVV starting-rate consistency."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import re,json,xml.etree.ElementTree as ET
errors=[];checks=0
class Page(HTMLParser):
 def __init__(self,s):super().__init__();self.attrs=[];self.text=[];self.feed(s)
 def handle_starttag(self,t,a):self.attrs.append((t,dict(a)))
 def handle_data(self,d):self.text.append(d)
def check(ok,message):
 global checks
 checks+=1
 if not ok:errors.append(message)
for p in Path('dist').rglob('*'):
 if p.suffix not in ('.html','.svg','.js'):continue
 s=p.read_text(encoding='utf8')
 # Preserve exact external source URL paths rather than creating broken links.
 def strip_external(m):
  return '' if urlsplit(m.group(1)).netloc not in ('ramrealty.in','wa.me') else m.group(0)
 current=re.sub(r'(?:href|src)="(https?://[^"]+)"',strip_external,s)
 check(not re.search(r'madhurawada',current,re.I),f'{p}: old locality spelling in managed copy')
 if p.suffix=='.svg':
  tree=ET.fromstring(s);checks+=1
  for node in tree.iter():
   href=node.get('href') or node.get('{http://www.w3.org/1999/xlink}href')
   if href and not href.startswith('#') and not urlsplit(href).scheme:
    check((p.parent/unquote(urlsplit(href).path)).is_file(),f'{p}: missing embedded SVG image {href}')
for slug in ['mvv-gv-grand','vaisakhi-west-winds','a-square-maple-woods','utkarsha-capital-towers']:
 p=Path('dist')/slug/'index.html';s=p.read_text(encoding='utf8');page=Page(s)
 meta={a.get('name',a.get('property')):a.get('content','') for t,a in page.attrs if t=='meta'}
 check('Madhuravada' in meta.get('description',''),f'{slug}: description lacks preferred locality')
 check('Madhuravada' in s.split('class="concept-area">')[1].split('</p>')[0],f'{slug}: hero locality mismatch')
 schemas=[json.loads(x) for x in re.findall(r'<script type="application/ld\+json">(.*?)</script>',s,re.S)]
 listing=next(d for d in schemas if d.get('@type')=='RealEstateListing')
 check('Madhuravada' in listing.get('about',{}).get('address',{}).get('addressLocality',''),f'{slug}: structured locality mismatch')
mvv=Path('dist/mvv-gv-grand/index.html').read_text(encoding='utf8');home=Path('dist/index.html').read_text(encoding='utf8')
check('5,400' not in mvv+home,'Obsolete MVV starting rate')
check(mvv.count('5,300')>=7,'MVV price must agree in metadata, highlights and cost details')
check(home.count('5,300')==2,'Homepage MVV card/comparison rate must agree')
poster=Path('dist/assets/projects/posters/mvv-gv-grand.svg').read_text(encoding='utf8')
check('₹5,300' in poster and 'MADHURAVADA' in poster,'MVV downloadable poster rate/locality mismatch')
check('/assets/projects/posters/mvv-gv-grand.svg' in mvv,'MVV page must link current editable poster')
for old in ['utkarsha-home-hero','mvv-grand-display','maple-woods-home-card']:
 check(old not in home,f'Homepage still displays legacy raster poster {old}')
check('class="property-card"' in home and home.count('class="property-card"')==4,'Homepage property discovery must be preserved')
print(json.dumps({'checks':checks,'errors':errors,'locality':'Madhuravada','mvvStartingRate':5300},indent=2))
raise SystemExit(bool(errors))
