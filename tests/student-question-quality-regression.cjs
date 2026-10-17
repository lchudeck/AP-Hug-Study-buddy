const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const context={window:{},quiz:[],addEventListener:()=>{},document:{readyState:'loading',body:{}},location:{}};context.window=context;vm.createContext(context);
vm.runInContext(fs.readFileSync('reliability-core.js','utf8'),context);
vm.runInContext(fs.readFileSync('units2-7-question-bank-v3.js','utf8'),context);
const specs=context.units27DepthV3;
assert.ok(specs.length>60,'expected the full Unit 2–7 spec set');
for(const [topic,concept,,scenario] of specs){
  const applications=context.quiz.filter(q=>q.topic===topic&&q.quality==='unit2-sprint1');
  if(applications.length){
    assert.ok(topic.startsWith('2.'),'Sprint 1 replacements must stay within Unit 2');
    assert.equal(applications.length,2,`${topic}: retain two reviewed applications in place of generated forms`);
    assert.ok(applications.every(q=>q.difficulty===3&&q[2].length===4&&q[2].includes(q[3])&&q[4].length>180),`${topic}: incomplete application or explanation`);
    assert.ok(applications.every(q=>!/^Which term best matches/.test(q[1])),`${topic}: replacement regressed to recall`);
  }else{
    assert.ok(context.quiz.some(q=>q.topic===topic&&q.skill==='concept'&&q[2].includes(concept)),`${topic}: definition missing`);
    assert.ok(context.quiz.some(q=>q.topic===topic&&q[1].startsWith(scenario)&&q.difficulty===2),`${topic}: scenario missing`);
  }
}
const choices=context.APHGStudentQuestionPool().flatMap(q=>q.choices);
assert.doesNotMatch(choices.join('\n'),/a related feature is mistaken for the defining mechanism|the outcome is mistaken for evidence of the process|similar scale is mistaken for the same relationship/i);
assert.ok(context.quiz.filter(q=>q.skill==='reasoning').length<specs.length/2,'unvetted reasoning distractors were generated');
console.log('Student question quality regression passed: all specs retain coverage; reviewed Unit 2 applications replace generated recall without placeholder reasoning.');
