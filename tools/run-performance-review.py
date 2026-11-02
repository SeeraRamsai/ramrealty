"""Measure representative local pages sequentially with installed Lighthouse."""
from pathlib import Path
import argparse
from datetime import date
import json
import os
import subprocess

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output-dir', type=Path, default=Path('audit-results') / ('performance-' + date.today().isoformat()))
parser.add_argument('--base-url', default='http://localhost:8000')
args = parser.parse_args()
args.output_dir.mkdir(parents=True, exist_ok=True)
cache = Path(os.environ.get('LOCALAPPDATA', str(Path.home()/'AppData/Local'))) / 'npm-cache/_npx'
installed = sorted(cache.glob('*/node_modules/lighthouse/cli/index.js'))
cli = Path(os.environ['LIGHTHOUSE_CLI']) if os.environ.get('LIGHTHOUSE_CLI') else next(iter(installed), None)
if cli is None or not cli.is_file():
    raise SystemExit('Set LIGHTHOUSE_CLI to an already-installed Lighthouse CLI entry point.')

summary = []
for name, path, desktop in [('home-mobile', '/', False), ('home-desktop', '/', True),
                             ('mvv-mobile', '/mvv-gv-grand/', False), ('mvv-desktop', '/mvv-gv-grand/', True)]:
    report_path = args.output_dir / (name + '.json')
    command = ['node', str(cli), args.base_url.rstrip('/') + path, '--only-categories=performance',
               '--output=json', '--output-path=' + str(report_path), '--chrome-flags=--headless=new', '--quiet']
    if desktop:
        command.append('--preset=desktop')
    result = subprocess.run(command, capture_output=True, text=True, encoding='utf8', errors='replace', timeout=180)
    if result.returncode or not report_path.exists():
        raise SystemExit(name + ': ' + result.stderr[-1200:])
    report = json.loads(report_path.read_text(encoding='utf8'))
    row = {'name': name, 'performance': report['categories']['performance']['score'],
           'metrics': {key: report['audits'][key].get('displayValue') for key in
                       ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time',
                        'cumulative-layout-shift', 'speed-index']}, 'warnings': report.get('runWarnings', [])}
    summary.append(row)
    (args.output_dir/'summary.json').write_text(json.dumps(summary, indent=2), encoding='utf8')
    print(json.dumps(row), flush=True)
