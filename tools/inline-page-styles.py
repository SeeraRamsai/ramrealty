"""Inline small local stylesheets without changing cascade order or requiring runtime JS.

CSS files remain the authoring source. Run after editing them; --check detects stale
HTML for the pre-release checks. Netlify continues to publish static dist directly.
"""
import argparse
import html
import json
from pathlib import Path
import re
from urllib.parse import urljoin, urlsplit

ROOT = Path('dist').resolve()
BLOCK = re.compile(
    r'<link\b(?=[^>]*\brel="stylesheet")[^>]*>'
    r'|<style data-inline-stylesheet="[^"]+">.*?</style>', re.S)


def render(page, match):
    tag = match.group(0)
    attr = 'data-inline-stylesheet' if tag.startswith('<style') else 'href'
    source = re.search(r'\b' + attr + r'="([^"]+)"', tag)
    if not source:
        raise ValueError(f'{page}: stylesheet has no source')
    url = urlsplit(urljoin('https://ramrealty.in/' + page.relative_to(ROOT).as_posix(),
                           html.unescape(source.group(1))))
    if url.netloc != 'ramrealty.in':
        raise ValueError(f'{page}: remote stylesheet must be reviewed separately')
    css_path = (ROOT / url.path.lstrip('/')).resolve()
    if not css_path.is_relative_to(ROOT) or not css_path.is_file():
        raise ValueError(f'{page}: missing/unsafe stylesheet {url.path}')
    css = css_path.read_text(encoding='utf-8-sig').strip()
    # Relative CSS URLs would resolve against the HTML after inlining. Do not
    # silently change asset destinations or reintroduce a render-blocking import.
    if re.search(r'@import\b|url\s*\(', css, re.I) or '</style' in css.lower():
        raise ValueError(f'{css_path}: resolve CSS asset references before inlining')
    return f'<style data-inline-stylesheet="{html.escape(url.path, quote=True)}">\n{css}\n</style>'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    changed = []
    blocks = 0
    for page in sorted(ROOT.rglob('*.html')):
        text = page.read_text(encoding='utf-8-sig')
        blocks += len(BLOCK.findall(text))
        updated = BLOCK.sub(lambda match: render(page, match), text)
        if updated == text:
            continue
        changed.append(page.relative_to(ROOT).as_posix())
        if not args.check:
            page.write_text(updated, encoding='utf-8')
    print(json.dumps({'mode': 'check' if args.check else 'write',
                      'stylesheetBlocks': blocks, 'changedPages': changed}, indent=2))
    return bool(changed) if args.check else False


if __name__ == '__main__':
    raise SystemExit(main())
