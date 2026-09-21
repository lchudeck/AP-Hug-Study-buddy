const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const reliability=index.indexOf('reliability-core.js');
const app=index.indexOf('app.js');
assert.ok(reliability>=0&&reliability<app,'reliability core must load before app.js');
const files=fs.readdirSync(root).filter(file=>file.endsWith('.js')&&file!=='reliability-core.js');
for(const file of files){
  const source=fs.readFileSync(path.join(root,file),'utf8');
  assert.ok(!/\blocalStorage\s*\.(?:getItem|setItem|removeItem)/.test(source),`${file} bypasses safe storage`);
}
const core=fs.readFileSync(path.join(root,'reliability-core.js'),'utf8');
assert.match(core,/memory\.set\(name,text\)/,'failed persistence retains session progress');
assert.ok(!/event\.message|error\.message|event\.reason/.test(core),'diagnostics must not retain messages or rejection reasons');
console.log(`Reliability source regression passed across ${files.length} application scripts.`);
