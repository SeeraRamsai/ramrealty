"""Apply the validated video manifest to the static players (safe to rerun)."""
from pathlib import Path
import re,json,html
manifest=json.loads(Path('tools/video-manifest.json').read_text())
lookup={Path(item['original']).name:item for item in manifest}
for p in Path('dist').rglob('*.html'):
 s=p.read_text(encoding='utf-8')
 if 'data-video-player' not in s:continue
 def replace(m):
  attrs,body=m.group(1),m.group(2)
  src=re.search(r'data-original-src="([^"]+)"',attrs) or re.search(r'data-src="([^"]+)"',attrs)
  original=src.group(1);item=lookup[Path(original).name]
  mobile='/'+item['mobile'].removeprefix('dist/')
  for key in ['data-original-src','data-video-bytes','data-original-bytes']:
   attrs=re.sub(r' '+key+r'="[^"]*"','',attrs)
  attrs=re.sub(r'data-src="[^"]*"','data-src="'+mobile+'"',attrs)
  attrs+=f' data-original-src="{original}" data-video-bytes="{item["mobileBytes"]}" data-original-bytes="{item["originalBytes"]}"'
  body=body.replace('Load video player','Play walkthrough')
  body=re.sub(r'<noscript>.*?</noscript>',f'<noscript><a href="{mobile}">Open data-saver video</a> &middot; <a href="{original}">Original quality</a></noscript>',body,flags=re.S)
  return '<div class="video-player"'+attrs+'>'+body+'</div>'
 s=re.sub(r'<div class="video-player"([^>]*)>(.*?)</div>',replace,s,flags=re.S)
 s=re.sub(r'assets/video-player\.js(?:\?v=\d+)?"','assets/video-player.js?v=2"',s)
 s=re.sub(r'assets/video-player\.css(?:\?v=\d+)?"','assets/video-player.css?v=3"',s)
 if p.parent.name=='videos':
  s=s.replace('Load video player','Play walkthrough')
  s=s.replace('</h1>','</h1><p class="section-copy">Data saver is selected by default. Choose original quality for finer detail. Only one player stays loaded; videos release their resources when closed, far offscreen or the page is hidden.</p>',1) if 'Data saver is selected by default.' not in s else s
 p.write_text(s,encoding='utf-8')
print('Updated static players from validated video manifest')
