const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const html=fs.readFileSync('index.html','utf8');
const scripts=[...html.matchAll(/<script src="([^"?]+\.js)(?:\?[^\"]*)?"/g)].map(m=>m[1]).filter(fs.existsSync);
const sandbox={window:{},localStorage:{getItem:()=>null,setItem:()=>{},removeItem:()=>{}},document:{readyState:'complete',getElementById:()=>({innerHTML:'',querySelectorAll:()=>[]}),querySelectorAll:()=>[],createTreeWalker:()=>({nextNode:()=>null}),body:{textContent:''}},NodeFilter:{SHOW_TEXT:4},console,setInterval:()=>0,clearInterval:()=>{},setTimeout:()=>0,MutationObserver:function(){this.observe=()=>{}},location:{}};
sandbox.window=sandbox;vm.createContext(sandbox);
for(const file of scripts){try{vm.runInContext(fs.readFileSync(file,'utf8'),sandbox,{filename:file});}catch{}}

const sourceSets=Array.from(sandbox.APHG_AUTHENTIC_STIMULUS_SETS||[]);
const sourceQuestions=Array.from(sandbox.APHG_AUTHENTIC_STIMULUS_QUESTIONS||[]);
assert.ok(sourceSets.length>=8,'the bank must retain migration displacement data plus a source-based set for every APHG unit');
for(let unit=1;unit<=7;unit++){
  const set=sourceSets.find(s=>s.unit===unit);
  assert.ok(set,`Unit ${unit} needs a source-based set`);
  assert.ok(set.qs.length>=3,`Unit ${unit} source set needs at least three linked questions`);
  const questions=sourceQuestions.filter(q=>q.unit===unit);
  assert.ok(questions.length>=3,`Unit ${unit} needs at least three flattened source questions`);
  assert.ok(questions.every(q=>q.setSize===set.qs.length),`Unit ${unit} must preserve its linked set size`);
}
for(const q of sourceQuestions){
  assert.equal(q.choices.length,4,`${q.id} needs four choices`);
  assert.equal(new Set(q.choices).size,4,`${q.id} choices must be unique`);
  assert.ok(q.choices.includes(q.answer),`${q.id} must contain its keyed answer`);
  assert.ok(q.explain.length>=105,`${q.id} needs a developed evidence-to-concept explanation`);
}

const quiz=vm.runInContext('quiz',sandbox);
const reasoning=quiz.filter(q=>q.difficulty===3&&/^This illustrates /.test(q[3]||''));
assert.ok(reasoning.length>=4&&reasoning.length<20,'only vetted topic-specific reasoning items should remain');
assert.ok(reasoning.every(q=>!/A student says|Which correction is strongest/i.test(q[1])),'repetitive correction stems must be removed');
assert.ok(new Set(reasoning.map(q=>q[1].split('?').at(-2)?.split('. ').at(-1))).size>=2,'remaining reasoning prompts must use varied AP-style frames');
assert.ok(reasoning.every(q=>String(q[4]).length>=120),'remaining reasoning items need concept, evidence, and distractor feedback');
assert.doesNotMatch(quiz.flatMap(q=>q[2]||[]).join('\n'),/a related feature is mistaken for the defining mechanism|the outcome is mistaken for evidence of the process|similar scale is mistaken for the same relationship/i);

for(const bankName of ['APHG_IMAGE_MCQ_BANK','APHG_STIMULUS_SET_QUESTIONS','APHG_STIMULUS_SET_QUESTIONS_EXTRA','APHG_REAL_DATA_QUESTIONS']){
  const bank=Array.from(sandbox[bankName]||[]);
  assert.ok(bank.length>=6,`${bankName} must retain its visual question inventory`);
  assert.ok(bank.every(q=>q.explain.length>=105),`${bankName} explanations must connect source evidence to the answer`);
}
const clusterQuestions=Array.from(sandbox.APHG_AUTHENTIC_CLUSTER_QUESTIONS||[]);
assert.ok(clusterQuestions.length>=14,'the deeper source clusters must remain available');
assert.ok(clusterQuestions.every(q=>q.explain.length>=105),'source-cluster explanations must connect evidence to the correct geographic interpretation');

console.log('Stimulus depth passed: Units 1–7 have three-question source sets, varied reasoning stems, and developed explanations.');
