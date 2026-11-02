"""Read-only production checks. Never submits forms or downloads video files."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from html.parser import HTMLParser
import json
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urljoin, urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener
from urllib.robotparser import RobotFileParser
import xml.etree.ElementTree as ET

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='https://ramrealty.in')
parser.add_argument('--output', type=Path, default=Path('audit-results/live-health.json'))
args = parser.parse_args()
base = args.base_url.rstrip('/')
errors = []

class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.tags = []
        self.feed(source)

    def handle_starttag(self, tag, attributes):
        self.tags.append((tag, dict(attributes)))

def fetch(path):
    try:
        # A separate opener per worker avoids shared connection state.
        opener = build_opener(NoRedirect)
        try:
            response = opener.open(Request(base + path, headers={'User-Agent': 'RamRealty-HealthCheck/1.0'}), timeout=20)
        except HTTPError as exc:
            response = exc
        with response:
            return {'path': path, 'status': response.code,
                    'headers': {k.lower(): v for k, v in response.headers.items()},
                    'body': response.read().decode('utf8', errors='replace')}
    except Exception as exc:
        return {'path': path, 'error': str(exc)}

expected = [node.text for node in ET.parse('dist/sitemap.xml').findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
paths = [urlsplit(url).path for url in expected]
aliases = {'/about': '/about.html', '/faq': '/faq.html', '/privacy': '/privacy.html',
           '/favicon.ico': '/assets/ram-realty-logo-small.png'}
extra = ['/robots.txt', '/sitemap.xml', '/health-check-missing-page/', '/thank-you.html', '/404.html', '/assets/analytics.js?v=1']
with ThreadPoolExecutor(max_workers=3) as pool:
    rows = list(pool.map(fetch, paths + extra + list(aliases)))
by_path = {row['path']: row for row in rows}
for url in expected:
    path = urlsplit(url).path
    row = by_path[path]
    if row.get('status') != 200:
        errors.append(f'{path}: expected 200, got {row.get("status", row.get("error"))}')
        continue
    page = Page(row['body'])
    if not any(tag == 'link' and a.get('rel') == 'canonical' and a.get('href') == url for tag, a in page.tags):
        errors.append(path + ': canonical differs from sitemap')
    if any(tag == 'meta' and a.get('name') == 'robots' and 'noindex' in a.get('content', '') for tag, a in page.tags):
        errors.append(path + ': unexpected noindex')
    if 'noindex' in row['headers'].get('x-robots-tag', ''):
        errors.append(path + ': unexpected noindex header')
    if not any(tag == 'h1' for tag, a in page.tags):
        errors.append(path + ': missing main heading')
    if not any(tag == 'script' and a.get('src') == '/assets/analytics.js?v=1' for tag, a in page.tags):
        errors.append(path + ': analytics consent helper missing')
    if not any('data-analytics-choice' in a for tag, a in page.tags) or not any('data-analytics-manage' in a for tag, a in page.tags):
        errors.append(path + ': analytics choice controls missing')
    if row['headers'].get('x-content-type-options') != 'nosniff':
        errors.append(path + ': nosniff header missing')
    policy = row['headers'].get('content-security-policy', '')
    if "object-src 'none'" not in policy or "form-action 'self'" not in policy:
        errors.append(path + ': expected embedding/form policy missing')
    if any(tag == 'form' for tag, a in page.tags):
        if 'name="form-name" value="property-enquiry"' not in row['body'] or 'contact_consent' not in row['body']:
            errors.append(path + ': deployed form registration/consent missing')
for path, destination in aliases.items():
    row = by_path[path]
    if row.get('status') != 301 or urljoin(base, row.get('headers', {}).get('location', '')) != base + destination:
        errors.append(path + ': expected canonical 301 to ' + destination)
for path in ['/thank-you.html', '/404.html']:
    if by_path[path].get('status') != 200:
        errors.append(path + ': utility document unavailable')
    page = Page(by_path[path].get('body', ''))
    if not any(tag == 'meta' and a.get('name') == 'robots' and 'noindex' in a.get('content', '') for tag, a in page.tags):
        errors.append(path + ': utility page noindex missing')
if by_path['/health-check-missing-page/'].get('status') != 404:
    errors.append('Missing path must return 404')
robots = by_path['/robots.txt']
if robots.get('status') != 200 or 'Sitemap: https://ramrealty.in/sitemap.xml' not in robots.get('body', ''):
    errors.append('Robots file/sitemap declaration missing')
rules = RobotFileParser()
rules.parse(robots.get('body', '').splitlines())
for url in expected:
    if not rules.can_fetch('Googlebot', url):
        errors.append(urlsplit(url).path + ': blocked for Googlebot in robots.txt')
try:
    if by_path['/sitemap.xml'].get('status') != 200:
        errors.append('Sitemap must return 200')
    live = ET.fromstring(by_path['/sitemap.xml']['body'])
    actual = [node.text for node in live.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
    if set(actual) != set(expected):
        errors.append('Live sitemap URLs differ from checked-out release')
except (KeyError, ET.ParseError):
    errors.append('Live sitemap unavailable or invalid')
analytics = by_path['/assets/analytics.js?v=1']
measurement = json.loads(Path('config/measurement.json').read_text(encoding='utf8'))['ga4MeasurementId']
if analytics.get('status') != 200 or measurement not in analytics.get('body', ''):
    errors.append('Deployed analytics helper or configured measurement ID missing')
result = {'checkedAt': datetime.now(timezone.utc).isoformat(), 'base': base,
          'sitemapPages': len(expected), 'responses': [{k: v for k, v in row.items() if k != 'body'} for row in rows],
          'errors': errors, 'scope': 'HTTP, canonical, robots, sitemap and form markup only; no lead submission or notification test'}
args.output.parent.mkdir(parents=True, exist_ok=True)
args.output.write_text(json.dumps(result, indent=2), encoding='utf8')
print(json.dumps({'sitemapPages': len(expected), 'requests': len(rows), 'errors': errors}, indent=2))
raise SystemExit(bool(errors))
