const assert=require('node:assert/strict');
global.window=global;
require('../frq-part-scoring.js');

const explain=['A','Explain','Explain how improved transportation can affect market access.','Improved transportation increases market access because lower travel time connects producers with more consumers.'];
const cases=[
  ['correct','Better roads increase market access because farmers can reach more buyers.','verified'],
  ['alternate-valid','Faster rail resulted in producers reaching a larger customer base.','verified'],
  ['partial','Transportation can help farmers.','unverified'],
  ['vague','It makes things better for people.','unverified'],
  ['nonsense','asdf qwrty zzzzz','incorrect']
];

for(const [name,text,expected] of cases){
  const result=global.__gradeFrqPart(explain,text);
  assert.equal(result.status,expected,`${name}: expected ${expected}, got ${result.status}: ${result.feedback}`);
}

for(const phrase of ['led to','resulted in','consequently','causing']){
  assert.equal(global.__frqHasCausalRelationship(`Improved roads ${phrase} greater market access.`),true,`causal phrase not recognized: ${phrase}`);
}
assert.equal(global.__frqHasCausalRelationship('Better roads reduce travel time and increase access to buyers.'),true,'direct causal relationship not recognized');

const blank=global.__gradeFrqPart(explain,'');
assert.equal(blank.status,'incorrect');
assert.match(blank.feedback,/0\/1/);

console.log(`FRQ regression passed: ${cases.length} response types + causal-language coverage.`);
