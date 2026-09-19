const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const html=fs.readFileSync('index.html','utf8');
const scripts=[...html.matchAll(/<script src="([^"?]+\.js)(?:\?[^\"]*)?"/g)].map(m=>m[1]).filter(f=>fs.existsSync(f));
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
  const unitCounts=exam.mcq.reduce((counts,q)=>{counts[q.unit]=(counts[q.unit]||0)+1;return counts;},{});
  assert.equal(unitCounts[1],6,`Exam ${i+1} must keep Unit 1 at 10% of the section`);
  for(let unit=2;unit<=7;unit++)assert.equal(unitCounts[unit],9,`Exam ${i+1}, Unit ${unit} must comprise 15% of the section`);
  const stimulus=exam.mcq.filter(q=>q.stimulus).length;
  assert.ok(stimulus>=18&&stimulus<=24,`Exam ${i+1} stimulus count ${stimulus} is outside 18–24`);
  const exact=new Set(exam.mcq.map(q=>`${String(q.q).trim().toLowerCase()}|${String(q.answer).trim().toLowerCase()}`));
  assert.equal(exact.size,60,`Exam ${i+1} contains an exact duplicate`);
  for(let a=0;a<exam.mcq.length;a++)for(let b=a+1;b<exam.mcq.length;b++){
    assert.equal(report.conceptualDuplicate(exam.mcq[a],exam.mcq[b]),false,`Exam ${i+1} contains a conceptual duplicate: ${exam.mcq[a].q} / ${exam.mcq[b].q}`);
  }
  const answerPositions=new Set(exam.mcq.map(q=>q.choices.indexOf(q.answer)));
  assert.ok(answerPositions.size>=3,`Exam ${i+1} answer positions are not sufficiently mixed`);
  const choiceText=exam.mcq.flatMap(q=>q.choices).join('\n');
  assert.doesNotMatch(choiceText,/No geographic concept can be supported without a map|terms describe the same process|explained only by the scale of analysis|related feature is present even though its defining mechanism is not shown|outcome alone is enough to identify that process|concepts at the same scale describe the same relationship/i,`Exam ${i+1} contains a generic non-content distractor`);
  assert.doesNotMatch(choiceText,/(?:^|\n)(?:[A-Z][A-Za-z -]{2,28}\s+only|Only\s+[A-Z][A-Za-z -]{2,28})(?:\n|$)/i,`Exam ${i+1} contains a terse “only” distractor`);
  assert.doesNotMatch([choiceText,...exam.mcq.map(q=>q.why)].join('\n'),/\bhDI\b/,`Exam ${i+1} contains a lowercased acronym`);
}

for(const pair of report.overlaps){
  assert.ok(pair.rate<0.25,`Exams ${pair.exams} overlap ${(pair.rate*100).toFixed(1)}%, target is below 25%`);
}

console.log('Practice exam quality regression passed.',JSON.stringify(report.overlaps));
