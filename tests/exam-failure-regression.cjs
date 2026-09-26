const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const html=fs.readFileSync('index.html','utf8');
const scripts=[...html.matchAll(/<script src="([^"?]+\.js)(?:\?[^\"]*)?"/g)].map(m=>m[1]).filter(f=>fs.existsSync(f)&&/^(?:reliability-core|app|ced-practice|unit1-question-bank-v3|units2-7-question-bank-v3|image-mcq-bank|stimulus-sets|stimulus-sets-extra|real-data-stimulus|authentic-stimulus-v3|adaptive-stimulus-v2|stimulus-clusters-frq-v4|student-reliability-patch)\.js$/.test(f));
const sandbox={
  window:{addEventListener:()=>{}},
  localStorage:{getItem:()=>null,setItem:()=>{},removeItem:()=>{}},
  document:{
    readyState:'complete',
    getElementById:()=>({innerHTML:'',querySelectorAll:()=>[],querySelector:()=>null,addEventListener:()=>{}}),
    querySelectorAll:()=>[],querySelector:()=>null,
    createTreeWalker:()=>({nextNode:()=>null}),
    body:{textContent:'',appendChild:()=>{}},
    head:{appendChild:()=>{}},
    createElement:()=>({style:{},dataset:{},addEventListener:()=>{},setAttribute:()=>{},appendChild:()=>{},querySelector:()=>null}),
    addEventListener:()=>{}
  },
  NodeFilter:{SHOW_TEXT:4},
  console,addEventListener:()=>{},
  setInterval:()=>0,clearInterval:()=>{},setTimeout:()=>0,
  MutationObserver:function(){this.observe=()=>{}},
  location:{}
};
sandbox.window=sandbox;
vm.createContext(sandbox);
for(const f of scripts)vm.runInContext(fs.readFileSync(f,'utf8'),sandbox,{filename:f});


sandbox.console={error:()=>{},log:()=>{}};
vm.runInContext(`buildPracticeExam=function(){throw new Error('forced build failure')}; active='practiceExams'; examSubmitted=false; simSubmitted=false;`,sandbox);
assert.match(vm.runInContext('practiceExamsPage()',sandbox),/box-warn/);
assert.doesNotThrow(()=>vm.runInContext('submitExam()',sandbox));
assert.equal(vm.runInContext('examSubmitted',sandbox),false);
for(const name of ['simMcqPage','simFrqPage','simResultsPage'])assert.match(vm.runInContext(`${name}()`,sandbox),/box-warn/,`${name} should return helpful HTML`);
assert.doesNotThrow(()=>vm.runInContext('simSubmit()',sandbox));
assert.equal(vm.runInContext('simSubmitted',sandbox),false);
console.log('Exam failure regression passed.');
