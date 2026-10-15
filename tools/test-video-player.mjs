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
}
const players=Array.from({length:3},(_,i)=>{
 const p=new Element();p.dataset={title:`Walkthrough ${i}`,src:`/mobile-${i}.mp4`,originalSrc:`/original-${i}.mp4`,videoBytes:'1048576',originalBytes:'4194304'};
 p.button=new Element('button');p.poster=new Element('img');p.poster.src='/poster.jpg';p.status=new Element('p');
 p.append(p.button,p.poster,p.status);
 p.querySelector=s=>s==='.video-load-button'?p.button:s==='img'?p.poster:p.status;
 return p;
});
const docHandlers={};const windowHandlers={};let observerCallback;
const document={querySelectorAll:()=>players,createElement:t=>new Element(t),createTextNode:t=>({textContent:t}),hidden:false,addEventListener:(type,fn)=>{docHandlers[type]=fn}};
class Observer{constructor(fn){observerCallback=fn}observe(){}}
vm.runInNewContext(readFileSync('dist/assets/video-player.js','utf8'),{document,window:{addEventListener:(type,fn)=>{windowHandlers[type]=fn}},IntersectionObserver:Observer});
const video=p=>p.children.find(x=>x.tag==='video');
assert.equal(players.filter(video).length,0,'no video or source before interaction');
players[0].button.emit('click');const old=video(players[0]);assert.equal(old.src,'/mobile-0.mp4');assert.equal(old.playCalls,1);old.currentTime=12;
players[1].button.emit('click');assert.equal(players.filter(video).length,1);assert.equal(old.src,'');assert.equal(old.pauseCalls,1);assert.equal(old.loadCalls,1);assert.equal(players[0].poster.hidden,false);
const quality=players[1].tools.children[0].children[0];quality.value='original';quality.emit('change');assert.equal(video(players[1]),undefined);players[1].button.emit('click');assert.equal(video(players[1]).src,'/original-1.mp4');
document.hidden=true;docHandlers.visibilitychange();assert.equal(players.filter(video).length,0);document.hidden=false;
players[0].button.emit('click');const resumed=video(players[0]);resumed.emit('loadedmetadata');assert.equal(resumed.currentTime,12);old.emit('error');assert.equal(players[0].status.hidden,true,'stale media error ignored');
observerCallback([{target:players[0],isIntersecting:false}]);assert.equal(players.filter(video).length,0);
players[2].button.emit('click');players[2].tools.children[1].emit('click');assert.equal(players.filter(video).length,0);assert.equal(players[2].button.focused,true);
players[2].button.emit('click');windowHandlers.pagehide();assert.equal(players.filter(video).length,0);
console.log('Video lifecycle tests passed: deferred source, one active player, request abort, original-quality choice, resume, stale-event guard, offscreen/background/pagehide/close cleanup.');
