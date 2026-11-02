import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source = readFileSync('dist/assets/campaign-fields.js', 'utf8');
const saved = new Map();
const storage = {setItem:(key,value)=>saved.set(key,value),getItem:key=>saved.get(key)||null};
function visit(search, fields={}, sessionStorage=storage) {
  vm.runInNewContext(source, {
    location:{search},URLSearchParams,sessionStorage,
    document:{querySelector:selector=>fields[selector.match(/name="([^"]+)"/)[1]]||null},
  });
}
// Homepage acquisition must survive navigation to a different project URL.
visit('?utm_source=google&utm_medium=organic&utm_campaign=local-homes');
const fields = Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].map(key=>[key,{value:''}]));
visit('',fields);
assert.equal(fields.utm_source.value,'google');
assert.equal(fields.utm_campaign.value,'local-homes');
visit('?utm_source=instagram&utm_campaign=november',fields);
assert.equal(fields.utm_source.value,'instagram');
assert.equal(fields.utm_campaign.value,'november');
visit('?utm_content='+'x'.repeat(500),fields);
assert.equal(fields.utm_content.value.length,250);
visit('?utm_source=direct',fields,{setItem(){throw Error('storage blocked')},getItem(){throw Error('storage blocked')}});
assert.equal(fields.utm_source.value,'direct','current URL still works when storage is blocked');
assert.doesNotThrow(()=>visit('',fields,{setItem(){throw Error('blocked')},getItem(){throw Error('blocked')}}));
for (const slug of ['mvv-gv-grand','vaisakhi-west-winds','a-square-maple-woods','utkarsha-capital-towers']) {
  assert.match(readFileSync(`dist/${slug}/index.html`,'utf8'),/campaign-fields\.js\?v=2/);
}
assert.match(readFileSync('dist/index.html','utf8'),/campaign-fields\.js\?v=2/);
console.log('Campaign attribution passed: homepage-to-project navigation, new campaign values, field limits and blocked-storage fallback.');
