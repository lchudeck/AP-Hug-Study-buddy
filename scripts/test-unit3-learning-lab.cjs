// Focused Unit 3 checks; run: node scripts/test-unit3-learning-lab.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync('unit-3-learning-lab.html','utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(script,'Learning lab needs inline teaching logic');
new Function(script[1]); // Syntax check without invoking browser APIs.
const source=script[1].replace(/show\(\);\s*\}\)\(\);\s*$/,'return {Q,V,FRQS};})();');
assert.notEqual(source,script[1],'Test fixture must export lesson data');
const data=new Function('document','return '+source.trim())({getElementById:()=>({})});
assert.equal(data.Q.length,16);
assert.equal(data.V.length,8);
assert.equal(data.FRQS.length,2);
assert.deepEqual([...new Set(data.Q.map(q=>q[0]))].sort(),['3.1','3.2','3.3','3.4','3.5','3.6','3.7','3.8']);
assert.equal(data.Q.filter(q=>q[10]!==undefined).length,8);
for(const [i,q] of data.Q.entries()){
  assert.ok(q[3].length>=2, 'Question '+i+' options');
  assert.ok(Number.isInteger(q[4])&&q[4]>=0&&q[4]<q[3].length,'Question '+i+' correct answer');
  assert.ok(q[5]&&q[6]&&q[7], 'Question '+i+' has explanation, comparison, and recovery');
  assert.ok(Array.isArray(q[8])&&q[8].length===2, 'Question '+i+' alternate practice');
  assert.ok(Number.isInteger(q[9])&&q[9]>=0&&q[9]<q[8].length,'Question '+i+' recovery key');
  if(q[10]!==undefined) assert.ok(data.V[q[10]],'Question '+i+' references an existing stimulus');
}
for(const f of data.FRQS){assert.equal(f.parts.length,3);assert.ok(data.V[f.visual]);for(const p of f.parts)assert.ok(p[2]);}
assert.ok(html.includes('wrong-answer')||html.includes('Not yet — learn the distinction.'));
assert.ok(html.includes('First-try accuracy'));
assert.ok(html.includes('Grammar is not scored here'));
console.log('Unit 3 content integrity: 16 questions, 8 visual stimuli, 2 three-part FRQs, all eight CED topics.');
