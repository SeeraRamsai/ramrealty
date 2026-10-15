import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import vm from 'node:vm';
import http from 'node:http';
const received=[];
let responseCode=200;
const server=http.createServer(async(req,res)=>{let body='';for await(const part of req)body+=part;received.push({path:req.url,method:req.method,fields:Object.fromEntries(new URLSearchParams(body))});res.writeHead(responseCode);res.end('test receiver');});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const source=readFileSync('dist/assets/property-enquiry.js','utf8');
const results=[];
function element(){return {hidden:true,textContent:'',children:[],setAttribute(){},insertAdjacentElement(where,node){this.status=node},replaceChildren(...nodes){this.children=nodes},append(node){this.children.push(node)}}}
try{
for(const slug of ['mvv-gv-grand','vaisakhi-west-winds','a-square-maple-woods','utkarsha-capital-towers']){
 const html=readFileSync(`dist/${slug}/index.html`,'utf8');
 const property=html.match(/name="property" value="([^"]+)"/)[1];
 const button=element();button.disabled=false;
 const data={'form-name':'property-enquiry',property,name:'AUDIT TEST - local only',phone:'9999999999',contact_consent:'yes'};
 const form={dataset:{},reportValidity:()=>true,querySelector:(selector)=>selector.includes("form-name") ? {value:"property-enquiry"} : button,addEventListener(type,fn){this.submit=fn}};
 const document={querySelectorAll:(selector)=>selector === "form" ? [form] : [],createElement:()=>element(),createTextNode:text=>({textContent:text})};
 class LocalFormData{constructor(){return Object.entries(data)}}
 vm.runInNewContext(source,{document,FormData:LocalFormData,URLSearchParams,fetch:(path,opts)=>fetch(base+path,opts),console:{error(){}}});
 const event={preventDefault(){}};
 responseCode=500;await form.submit(event);assert.equal(button.disabled,false);assert.equal(form.dataset.submitting,'false');assert.ok(button.status.children.some(x=>x.href==='tel:+917799251808'));
 responseCode=200;const pending=form.submit(event);await form.submit(event);await pending;
 assert.equal(button.disabled,true);assert.equal(button.textContent,'Enquiry sent');
 const messages=received.slice(-2);assert.equal(messages.length,2);for(const message of messages){assert.equal(message.path,'/');assert.equal(message.method,'POST');assert.deepEqual(message.fields,data)}
 results.push({project:slug,success:true,errorAndRetry:true,duplicatePrevented:true,payloadPreserved:true});
}
writeFileSync('audit-results/form-local-tests.json',JSON.stringify({scope:'Local HTTP receiver with DOM stubs; does not verify browser interaction or Netlify delivery',requests:received.length,results},null,2));
console.log(JSON.stringify({requests:received.length,results},null,2));
}finally{server.close()}
