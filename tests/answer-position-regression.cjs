const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('reliability-core.js','utf8');
const context={addEventListener:()=>{},window:{},document:{readyState:'loading',body:{}},location:{},URL,Map};
context.window=context;vm.createContext(context);vm.runInContext(source,context);
const shuffle=context.APHGShuffleChoices;
const samples=Array.from({length:120},(_,i)=>({prompt:`Question ${i}: which map concept applies?`,choices:['Correct','Rate','Projection','Density'],answer:'Correct'}));
const modes=['Map Lab','Map Detective','Scale Challenge','Vocab Apply','Visual Practice 1–2','Visual Practice 3–7','Exam Lab','AP Simulator','Student Success','Personal Coach','Final AP'];
for(const mode of modes){
  const positions=samples.map(q=>shuffle(q.choices,q.prompt).indexOf(q.answer));
  assert.ok(positions.filter(i=>i===0).length/samples.length<=.4,`${mode} has more than 40% correct A answers`);
  for(const q of samples)assert.deepEqual(shuffle(q.choices,q.prompt),shuffle(q.choices,q.prompt),`${mode} choices changed during rerender`);
}
for(const file of ['student-readiness-upgrades.js','student-success-path.js','visual-practice.js','visual-practice-3-7.js','exam-lab.js','ap-simulator.js','personalized-unit1-coach.js','personalized-units2-7-coach.js','final-freshman-polish.js']){
  assert.match(fs.readFileSync(file,'utf8'),/APHGShuffleChoices/,`${file} must use seeded choices`);
}
console.log('Answer position regression passed.');
