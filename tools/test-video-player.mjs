import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
class Element {
 constructor(tag='div'){this.tag=tag;this.children=[];this.handlers={};this.attrs={};this.dataset={};this.hidden=false;this.value='';this.currentTime=0;this.duration=90;this.loadCalls=0;this.playCalls=0;this.pauseCalls=0;}
 append(...nodes){for(const node of nodes){this.children.push(node);node.parent=this;if(this.tag==='select'&&this.children.length===1)this.value=node.value;}}
 setAttribute(k,v){this.attrs[k]=v;}
 removeAttribute(k){delete this.attrs[k];if(k==='src')this.src='';}
 addEventListener(type,fn){(this.handlers[type]??=[]).push(fn);}
 emit(type){for(const fn of this.handlers[type]||[])fn({target:this});}
 insertAdjacentElement(position,node){this.tools=node;}
 replaceChildren(...nodes){this.children=[];this.append(...nodes);}
 remove(){this.parent.children=this.parent.children.filter(x=>x!==this);}
 play(){this.playCalls++;return Promise.resolve();}
 pause(){this.pauseCalls++;}
 load(){this.loadCalls++;}
 focus(){this.focused=true;}
 closest(){return this.playerRoot||this.parent?.closest();}
}
const players=Array.from({length:3},(_,i)=>{
 const p=new Element();p.dataset={title:`Walkthrough ${i}`,src:`/mobile-${i}.mp4`,originalSrc:`/original-${i}.mp4`,videoBytes:'1048576',originalBytes:'4194304'};
 p.button=new Element('button');p.poster=new Element('img');p.poster.src='/poster.jpg';p.status=new Element('p');
 p.append(p.button,p.poster,p.status);
 p.playerRoot=p;
 p.querySelector=s=>s==='.video-load-button'?p.button:s==='img'?p.poster:p.status;
 return p;
});
const docHandlers={};const windowHandlers={};const observers=[];
const document={querySelectorAll:()=>players,createElement:t=>new Element(t),createTextNode:t=>({textContent:t}),hidden:false,addEventListener:(type,fn)=>{docHandlers[type]=fn}};
class Observer{constructor(fn,options){this.fn=fn;this.options=options;observers.push(this)}observe(){}unobserve(){}}
vm.runInNewContext(readFileSync('dist/assets/video-player.js','utf8'),{document,window:{addEventListener:(type,fn)=>{windowHandlers[type]=fn}},IntersectionObserver:Observer});
const video=p=>p.children.find(x=>x.tag==='video');
assert.equal(players.filter(video).length,0,'no video or source before interaction');
assert.equal(players.filter(p=>p.tools).length,0,'offscreen controls do not mutate the initial layout');
const setup=observers.find(o=>o.options.rootMargin==='600px');
setup.fn([{target:players[0],isIntersecting:true}]);assert.ok(players[0].tools);assert.equal(players[1].tools,undefined,'only nearby player initializes');
const click=p=>{docHandlers.click({target:p.button});p.button.emit('click')};
click(players[0]);const old=video(players[0]);assert.equal(old.src,'/mobile-0.mp4');assert.equal(old.playCalls,1);old.currentTime=12;
click(players[1]);assert.equal(players.filter(video).length,1);assert.equal(old.src,'');assert.equal(old.pauseCalls,1);assert.equal(old.loadCalls,1);assert.equal(players[0].poster.hidden,false);
const quality=players[1].tools.children[0].children[0];quality.value='original';quality.emit('change');assert.equal(video(players[1]),undefined);click(players[1]);assert.equal(video(players[1]).src,'/original-1.mp4');
document.hidden=true;docHandlers.visibilitychange();assert.equal(players.filter(video).length,0);document.hidden=false;
click(players[0]);const resumed=video(players[0]);resumed.emit('loadedmetadata');assert.equal(resumed.currentTime,12);old.emit('error');assert.equal(players[0].status.hidden,true,'stale media error ignored');
observers.find(o=>o.options.rootMargin==='200px').fn([{target:players[0],isIntersecting:false}]);assert.equal(players.filter(video).length,0);
docHandlers.focusin({target:players[2].button});assert.ok(players[2].tools,'keyboard focus prepares controls');
click(players[2]);players[2].tools.children[1].emit('click');assert.equal(players.filter(video).length,0);assert.equal(players[2].button.focused,true);
const tools=players[2].tools;click(players[2]);assert.equal(players[2].tools,tools,'interaction does not initialize twice');windowHandlers.pagehide();assert.equal(players.filter(video).length,0);
console.log('Video lifecycle tests passed: lazy controls, immediate-click and keyboard initialization, deferred source, one active player, request abort, quality/resume, stale-event guards and cleanup.');
