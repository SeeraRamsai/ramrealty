import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync('dist/assets/analytics.js','utf8');
function setup(initial='', blocked=false, hostname='ramrealty.in', mobile=false) {
  const handlers={}, scripts=[], cookies=[], saved=new Map(initial ? [['ramrealty-analytics-consent-v1',initial]] : []);
  const element=()=>({hidden:true, handlers:{},focused:false,addEventListener(type,fn){this.handlers[type]=fn},focus(){this.focused=true}});
  const accept=element(),reject=element(),manage=element(),main=element(),panel=element();
  panel.querySelector=s=>s.includes('accept')?accept:reject;
  const document={referrer:'https://example.com/private?q=secret',head:{append:s=>scripts.push(s)},querySelector:s=>s==='main'?main:panel,querySelectorAll:()=>[manage],createElement:()=>({}),addEventListener:(type,fn)=>handlers[type]=fn};
  Object.defineProperty(document,'cookie',{get:()=> '_ga=one; _ga_7DBBCTFPDT=two; essential=yes',set:value=>cookies.push(value)});
  const location={origin:'https://'+hostname,hostname,pathname:'/mvv-gv-grand/',href:'https://'+hostname+'/mvv-gv-grand/?phone=private#secret',reload(){this.reloads=(this.reloads||0)+1}};
  const window={matchMedia:()=>({matches:mobile})};
  vm.runInNewContext(source,{window,document,location,URL,Date,localStorage:{getItem:k=>{if(blocked)throw Error();return saved.get(k)},setItem:(k,v)=>{if(blocked)throw Error();saved.set(k,v)}}});
  const queue=()=>Array.from(window.dataLayer||[],args=>Array.from(args));
  const click=href=>handlers.click({target:{closest:()=>({href})}});
  const submit=invalid=>handlers.submit({target:{querySelector:s=>s===':invalid'?invalid:{}}});
  return {window,panel,accept,reject,manage,main,scripts,cookies,saved,location,queue,click,submit};
}
const fresh=setup();
assert.equal(fresh.panel.hidden,false);
assert.equal(fresh.scripts.length,0,'no Google request before consent');
fresh.click('tel:+919999999999');fresh.submit(null);
assert.equal(fresh.queue().length,0);
fresh.reject.handlers.click();
assert.equal(fresh.panel.hidden,true);assert.equal(fresh.scripts.length,0);
assert.equal(fresh.saved.get('ramrealty-analytics-consent-v1'),'denied');
assert.ok(fresh.cookies.every(c=>!c.startsWith('essential=')));
const mobile=setup('',false,'ramrealty.in',true);
assert.equal(mobile.panel.hidden,true,'first-visit prompt must not cover mobile page content');
assert.equal(mobile.scripts.length,0,'mobile analytics remain disabled until explicit consent');
mobile.manage.handlers.click();
assert.equal(mobile.panel.hidden,false,'mobile visitors can open analytics choices from the footer');
assert.equal(mobile.accept.focused,true);
mobile.reject.handlers.click();
assert.equal(mobile.panel.hidden,true);
assert.equal(mobile.saved.get('ramrealty-analytics-consent-v1'),'denied');
const denied=setup('denied');assert.equal(denied.scripts.length,0);assert.equal(denied.panel.hidden,true);
denied.manage.handlers.click();assert.equal(denied.panel.hidden,false);assert.equal(denied.accept.focused,true);
denied.accept.handlers.click();assert.equal(denied.manage.focused,true);
assert.equal(denied.scripts.length,1);assert.equal(denied.scripts[0].src,'https://www.googletagmanager.com/gtag/js?id=G-7DBBCTFPDT');
const commands=denied.queue();assert.equal(commands[0][0],'consent');assert.equal(commands[0][2].analytics_storage,'denied');assert.equal(commands[0][2].ad_storage,'denied');assert.equal(commands[1][2].analytics_storage,'granted');
const config=commands.find(x=>x[0]==='config');assert.equal(config[1],'G-7DBBCTFPDT');assert.equal(config[2].page_location,'https://ramrealty.in/mvv-gv-grand/');assert.equal(config[2].page_referrer,'https://example.com');assert.equal(config[2].allow_google_signals,false);
denied.click('tel:+919999999999');denied.click('https://wa.me/919999999999?text=private');denied.submit({});denied.submit(null);
const events=denied.queue().filter(x=>x[0]==='event');
assert.deepEqual(events.map(e=>e[1]),['phone_click','whatsapp_click','enquiry_submit_attempt']);
for(const event of events){assert.equal(event[2].project,'mvv-gv-grand');assert.deepEqual(Object.keys(event[2]).sort(),['project','send_to']);}
assert.doesNotMatch(JSON.stringify(denied.queue()),/private|9999999999|secret/);
denied.manage.handlers.click();denied.reject.handlers.click();assert.equal(denied.location.reloads,1);assert.equal(denied.window['ga-disable-G-7DBBCTFPDT'],true);
denied.click('tel:+919999999999');assert.equal(denied.queue().filter(x=>x[0]==='event').length,3,'revocation blocks events');
const remembered=setup('granted');assert.equal(remembered.scripts.length,1);assert.equal(remembered.panel.hidden,true);
const blocked=setup('',true);assert.equal(blocked.scripts.length,0);assert.doesNotThrow(()=>blocked.accept.handlers.click());assert.equal(blocked.scripts.length,1);assert.doesNotThrow(()=>blocked.reject.handlers.click());assert.equal(blocked.location.reloads,undefined);
const local=setup('granted',false,'localhost');assert.equal(local.scripts.length,0,'local preview does not pollute production analytics');
function htmlFiles(directory) {
 return readdirSync(directory,{withFileTypes:true}).flatMap(entry=>{
  const path=directory+'/'+entry.name;
  return entry.isDirectory()?htmlFiles(path):entry.isFile()&&entry.name.endsWith('.html')?[path]:[];
 });
}
for(const path of htmlFiles('dist')){
 const html=readFileSync(path,'utf8');
 if(!html.includes('data-analytics-choice'))continue;
 assert.match(html,/data-analytics-manage/);
 assert.match(html,/analytics\.js\?v=2/);
}
console.log('Analytics checks passed: consent gating, deny/revoke, stored and blocked choices, sanitized page data, contact/attempt events and no local tracking.');
