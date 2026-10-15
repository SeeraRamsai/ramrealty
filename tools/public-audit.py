"""Small, cached public GET/HEAD audit. No forms, account access or deployments."""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urldefrag
from urllib.request import Request, build_opener, HTTPRedirectHandler
from urllib.error import HTTPError
import hashlib, json, ssl, socket, xml.etree.ElementTree as ET

BASE = 'https://ramrealty.in/'
OUT = Path('audit-results') / f'public-{datetime.now(timezone.utc).date()}'
OUT.mkdir(parents=True, exist_ok=True)
class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs): return None
opener = build_opener(NoRedirect)
def fetch(url, method='GET'):
    try:
        r = opener.open(Request(url, method=method, headers={'User-Agent':'RamRealty-public-audit/1.0'}), timeout=25)
    except HTTPError as e: r = e
    except Exception as e: return {'url':url,'error':str(e)}
    data = r.read() if method == 'GET' else b''
    result = {'url':url,'status':r.code,'headers':dict(r.headers.items()),'bytes':len(data)}
    if data:
        filename = hashlib.sha256(url.encode()).hexdigest()[:16]+'.txt'
        (OUT/filename).write_bytes(data)
        result.update(file=filename,body=data.decode('utf-8',errors='replace'))
    return result
class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True); self.tags=[];self.text=[];self.title=[];self.in_title=False;self.skip=0
        self.feed(text)
    def handle_starttag(self,t,a):
        self.tags.append((t,dict(a)))
        if t=='title':self.in_title=True
        if t in ('script','style'):self.skip+=1
    def handle_endtag(self,t):
        if t=='title':self.in_title=False
        if t in ('script','style'):self.skip=max(0,self.skip-1)
    def handle_data(self,d):
        if self.in_title:self.title.append(d)
        if not self.skip:self.text.append(d)

def main():
    existing = OUT/'crawl.json'
    if existing.exists():
        print('Cached audit exists; remove explicitly only if a new run is warranted.');return
    redirects = list(ThreadPoolExecutor(4).map(fetch,[BASE,'http://ramrealty.in/','https://www.ramrealty.in/','http://www.ramrealty.in/']))
    queue=[BASE, urljoin(BASE,'robots.txt'),urljoin(BASE,'sitemap.xml'),urljoin(BASE,'audit-missing-page-20261015/')]
    seen=set(); records=[]; assets=set()
    while queue and len(seen)<40:
        batch=[u for u in dict.fromkeys(queue) if u not in seen]; queue=[]
        seen.update(batch)
        for record in ThreadPoolExecutor(4).map(fetch,batch):
            body=record.pop('body',''); url=record['url'];headers={k.lower():v for k,v in record.get('headers',{}).items()}
            if record.get('status') in (301,302,303,307,308):
                queue.append(urljoin(url,headers.get('location','')))
            if 'text/html' in headers.get('content-type',''):
                p=Page(body);tags=p.tags
                record.update(title=''.join(p.title),text=' '.join(' '.join(p.text).split()),tags=tags)
                for t,a in tags:
                    for key in ('href','src','data-src','data-original-src','poster'):
                        v=a.get(key,'');target=urldefrag(urljoin(url,v))[0];parts=urlsplit(target)
                        if parts.netloc!='ramrealty.in' or not v or v.startswith('#'):continue
                        if (parts.path.endswith(('.html','/')) or '.' not in parts.path.rsplit('/',1)[-1]) and not parts.path.startswith('/assets/'):
                            if record.get('status')==200:queue.append(target)
                        else:assets.add(target)
            elif url.endswith('sitemap.xml') and record.get('status')==200:
                try:queue += [e.text for e in ET.fromstring(body).iter() if e.tag.endswith('}loc')]
                except ET.ParseError:pass
            records.append(record)
    checks=list(ThreadPoolExecutor(4).map(lambda u:fetch(u,'HEAD'),sorted(assets)))
    tls={}
    try:
        with socket.create_connection(('ramrealty.in',443),timeout=20) as sock:
            with ssl.create_default_context().wrap_socket(sock,server_hostname='ramrealty.in') as s:
                cert=s.getpeercert();tls={'version':s.version(),'notAfter':cert.get('notAfter'),'issuer':cert.get('issuer'),'validated':True}
    except Exception as e:tls={'error':str(e)}
    result={'checkedAt':datetime.now(timezone.utc).isoformat(),'redirects':redirects,'pages':records,'assets':checks,'tls':tls}
    # Keep response bodies once in separate evidence files.
    for r in redirects:r.pop('body',None)
    existing.write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps({'pages':[{k:r.get(k) for k in ('url','status','title','error')} for r in records],
                      'assets':len(checks),'assetErrors':[r for r in checks if r.get('status')!=200],
                      'redirects':[{k:r.get(k) for k in ('url','status','error')} for r in redirects],'tls':tls},indent=2))
if __name__=='__main__':main()
