"""Check sitemap discovery through ordinary HTML links, without executing JS."""
from collections import deque
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit
import json
import xml.etree.ElementTree as ET

root = Path('dist')
base = 'https://ramrealty.in/'

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.links = []
        self.lang = None
        self.noindex = False
        self.feed(source)

    def handle_starttag(self, tag, attributes):
        a = dict(attributes)
        if tag == 'a' and a.get('href'):
            self.links.append(a['href'])
        if tag == 'html':
            self.lang = a.get('lang')
        if tag == 'meta' and a.get('name', '').lower() in ('robots', 'googlebot'):
            self.noindex |= 'noindex' in a.get('content', '').lower()

def file_for(path):
    p = root / path.lstrip('/')
    return p / 'index.html' if p.is_dir() else p

urls = [n.text for n in ET.parse(root/'sitemap.xml').findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
queue = deque(['/'])
seen = {}
errors = []
while queue:
    path = queue.popleft()
    if path in seen:
        continue
    file = file_for(path)
    if not file.is_file() or file.suffix != '.html':
        continue
    page = Page(file.read_text(encoding='utf8'))
    seen[path] = page
    if not page.lang:
        errors.append(f'{path}: missing document language')
    for href in page.links:
        target = urlsplit(urljoin(base + path.lstrip('/'), href))
        if target.scheme == 'https' and target.netloc == 'ramrealty.in':
            queue.append(target.path or '/')
for url in urls:
    path = urlsplit(url).path
    if path not in seen:
        errors.append(f'{path}: sitemap page not reachable from homepage HTML links')
    elif seen[path].noindex:
        errors.append(f'{path}: linked sitemap page is noindex')
for path in ['/404.html', '/thank-you.html']:
    if not Page(file_for(path).read_text(encoding='utf8')).noindex:
        errors.append(f'{path}: utility page should remain noindex')
result = {'sitemapPages': len(urls), 'pagesReachedWithoutJavaScript': len(seen),
          'indexableSitemapPagesReached': sum(urlsplit(url).path in seen for url in urls),
          'errors': errors}
print(json.dumps(result, indent=2))
raise SystemExit(bool(errors))
