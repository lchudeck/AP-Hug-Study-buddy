const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const html=fs.readFileSync('index.html','utf8');
const masterySource=fs.readFileSync('practice-mastery.js','utf8');
assert.match(masterySource,/Review Unit \$\{state\.unit\} Mistakes/,'the primary remediation action must follow the selected unit');
assert.match(masterySource,/Review All Mistakes/,'cross-unit mistake review must remain available as a separate action');
const scripts=[...html.matchAll(/<script src="([^"?]+\.js)(?:\?[^\"]*)?"/g)].map(m=>m[1]).filter(f=>fs.existsSync(f));
const sandbox={window:{},localStorage:{getItem:()=>null,setItem:()=>{},removeItem:()=>{}},document:{readyState:'complete',getElementById:()=>({innerHTML:'',querySelectorAll:()=>[]}),querySelectorAll:()=>[],createTreeWalker:()=>({nextNode:()=>null}),body:{textContent:''}},NodeFilter:{SHOW_TEXT:4},console,setInterval:()=>0,clearInterval:()=>{},setTimeout:()=>0,MutationObserver:function(){this.observe=()=>{}},location:{}};
sandbox.window=sandbox;vm.createContext(sandbox);
for(const file of scripts){try{vm.runInContext(fs.readFileSync(file,'utf8'),sandbox,{filename:file});}catch(e){}}

const curated=Array.from(sandbox.APHG_UNIFIED_AP_BANK||[]);
assert.equal(curated.length,21,'unified bank must provide three original application questions for each unit');
const expectedTopics={
  'uq4-1':'4.10','uq5-2':'5.6','uq6-1':'6.10','uq7-1':'7.3','uq7-2':'7.6'
};
for(const [id,topic] of Object.entries(expectedTopics))assert.equal(curated.find(q=>q.id===id)?.topic,topic,`${id} must retain its CED topic mapping`);
for(let unit=1;unit<=7;unit++){
  const items=curated.filter(q=>q.unit===unit);
  assert.equal(items.length,3,`Unit ${unit} must have three curated application questions`);
  assert.ok(items.every(q=>q.difficulty===3&&q.quality==='unified-v1'),`Unit ${unit} items must be tagged as AP-level curated questions`);
}
for(const q of curated){
  assert.equal(q.choices.length,4,`${q.id} must have four choices`);
  assert.equal(new Set(q.choices).size,4,`${q.id} choices must be unique`);
  assert.ok(q.choices.includes(q.answer),`${q.id} must contain its keyed answer`);
  assert.ok(q.explain.length>=90,`${q.id} needs a substantive explanation`);
  assert.doesNotMatch(q.prompt,/which term best matches this definition|is called\.\.\.$/i,`${q.id} must require application rather than definition matching`);
  assert.doesNotMatch(q.choices.filter(x=>x!==q.answer).join(' '),/all of the above|none of the above/i,`${q.id} must use concept-based distractors`);
}

const served=[];
for(let version=1;version<=3;version++){
  const exam=vm.runInContext(`buildPracticeExam(${version})`,sandbox);
  for(let unit=1;unit<=7;unit++){
    const unitItems=exam.mcq.filter(q=>q.unit===unit);
    assert.ok(unitItems.length>=6,`Exam ${version}, Unit ${unit} needs meaningful coverage`);
    assert.ok(unitItems.filter(q=>q.quality==='unified-v1').length>=1,`Exam ${version}, Unit ${unit} needs a curated application question`);
  }
  served.push(...exam.mcq.filter(q=>q.quality==='unified-v1'));
  assert.doesNotMatch(exam.mcq.map(q=>q.q).join('\n'),/Which term best matches this definition/i,`Exam ${version} must not serve definition-matching stems`);
}
for(let unit=1;unit<=7;unit++){
  const unique=new Set(served.filter(q=>q.unit===unit).map(q=>q.q));
  assert.equal(unique.size,3,`The three exam versions must rotate all three Unit ${unit} application questions`);
}

console.log('Unified question quality passed: 21 original application items rotate across three balanced exams, with no definition-matching stems.');
