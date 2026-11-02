"""Run the already-installed Lighthouse against the local static preview."""
from pathlib import Path
import argparse
from datetime import date
import json
import os
import subprocess
import sys
import xml.etree.ElementTree as ET
from urllib.parse import urlsplit

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output-dir', type=Path, default=Path('audit-results') / ('accessibility-' + date.today().isoformat()))
parser.add_argument('--base-url', default='http://localhost:8000')
parser.add_argument('--paths', nargs='+', help='Only audit these URL paths, when verifying a targeted fix.')
args = parser.parse_args()
out = args.output_dir
out.mkdir(parents=True, exist_ok=True)
cache = Path(os.environ.get('LOCALAPPDATA', str(Path.home()/'AppData/Local'))) / 'npm-cache/_npx'
installed = sorted(cache.glob('*/node_modules/lighthouse/cli/index.js'))
cli = Path(os.environ['LIGHTHOUSE_CLI']) if os.environ.get('LIGHTHOUSE_CLI') else next(iter(installed), None)
if cli is None or not cli.is_file():
    raise SystemExit('Set LIGHTHOUSE_CLI to an already-installed Lighthouse CLI entry point.')
paths = [urlsplit(n.text).path for n in ET.parse('dist/sitemap.xml').findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
paths += ['/404.html', '/thank-you.html']
if args.paths:
    paths = args.paths
summary = []
for path in paths:
    slug = path.strip('/').replace('/', '-') or 'home'
    target = out / (slug + '.json')
    categories = 'accessibility,best-practices' if path in ['/404.html', '/thank-you.html'] else 'accessibility,best-practices,seo'
    command = ['node', str(cli), args.base_url.rstrip('/') + path,
               '--only-categories=' + categories, '--output=json', '--output-path=' + str(target),
               '--chrome-flags=--headless=new', '--quiet']
    result = subprocess.run(command, capture_output=True, text=True, encoding='utf8', errors='replace', timeout=150)
    if result.returncode or not target.exists():
        row = {'path': path, 'error': result.stderr[-1200:]}
    else:
        report = json.loads(target.read_text(encoding='utf8'))
        row = {'path': path, 'scores': {k: v['score'] for k, v in report['categories'].items()},
               'failures': [{'id': k, 'title': v['title'], 'details': v.get('details', {})}
                            for k, v in report['audits'].items() if v.get('score') is not None and v['score'] < 1],
               'warnings': report.get('runWarnings', [])}
    summary.append(row)
    (out/'summary.json').write_text(json.dumps(summary, indent=2), encoding='utf8')
    print(json.dumps({k:v for k,v in row.items() if k != 'failures'}), flush=True)
    if row.get('failures'):
        print('FAILED AUDITS: ' + ', '.join(v['id'] for v in row['failures']), flush=True)
sys.exit(any(row.get('error') or row.get('failures') for row in summary))
