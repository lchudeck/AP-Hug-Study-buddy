const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const html=fs.readFileSync('index.html','utf8');
const scripts=[...html.matchAll(/<script src="([^"]+\.js)"/g)].map(m=>m[1]).filter(f=>fs.existsSync(f));
const sandbox={
  window:{},
  localStorage:{getItem:()=>null,setItem:()=>{},removeItem:()=>{}},
  document:{
    readyState:'complete',
    getElementById:()=>({innerHTML:'',querySelectorAll:()=>[]}),
    querySelectorAll:()=>[],
    createTreeWalker:()=>({nextNode:()=>null}),
    body:{textContent:''}
  },
  NodeFilter:{SHOW_TEXT:4},
  console,
  setInterval:()=>0,clearInterval:()=>{},setTimeout:()=>0,
  MutationObserver:function(){this.observe=()=>{}},
  location:{}
};
sandbox.window=sandbox;
vm.createContext(sandbox);
for(const f of scripts){try{vm.runInContext(fs.readFileSync(f,'utf8'),sandbox,{filename:f});}catch(e){}}

assert.equal(vm.runInContext('typeof buildPracticeExam',sandbox),'function','buildPracticeExam did not load');
const exams=[1,2,3].map(n=>vm.runInContext(`buildPracticeExam(${n})`,sandbox));
const report=sandbox.__examQualityReport;
assert.ok(report,'exam quality report was not created');

for(const [i,exam] of exams.entries()){
  assert.equal(exam.mcq.length,60,`Exam ${i+1} must contain 60 MCQs`);
  const stimulus=exam.mcq.filter(q=>q.stimulus).length;
  assert.ok(stimulus>=18&&stimulus<=24,`Exam ${i+1} stimulus count ${stimulus} is outside 18–24`);
  const exact=new Set(exam.mcq.map(q=>`${String(q.q).trim().toLowerCase()}|${String(q.answer).trim().toLowerCase()}`));
  assert.equal(exact.size,60,`Exam ${i+1} contains an exact duplicate`);
  for(let a=0;a<exam.mcq.length;a++)for(let b=a+1;b<exam.mcq.length;b++){
    assert.equal(report.conceptualDuplicate(exam.mcq[a],exam.mcq[b]),false,`Exam ${i+1} contains a conceptual duplicate: ${exam.mcq[a].q} / ${exam.mcq[b].q}`);
  }
  const answerPositions=new Set(exam.mcq.map(q=>q.choices.indexOf(q.answer)));
  assert.ok(answerPositions.size>=3,`Exam ${i+1} answer positions are not sufficiently mixed`);
}

for(const pair of report.overlaps){
  assert.ok(pair.rate<0.25,`Exams ${pair.exams} overlap ${(pair.rate*100).toFixed(1)}%, target is below 25%`);
}

console.log('Practice exam quality regression passed.',JSON.stringify(report.overlaps));