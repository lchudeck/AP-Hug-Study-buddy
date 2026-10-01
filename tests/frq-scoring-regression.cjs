const assert=require('node:assert/strict');
global.window=global;
require('../frq-part-scoring.js');
require('../pr6-frq-polish.js');

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

const demographicCases=[
 [['A','Identify','Identify one demographic indicator that shows an aging population.','A rising median age or increasing share of elderly people.'],'A rising median age.','A falling median age shows aging.'],
 [['B','Define','Define dependency ratio.','Dependency ratio compares children and elderly people with the working-age population.'],'Dependency ratio compares people under 15 and over 64 with the working-age population.','Dependency ratio means the birth rate.'],
 [['D','Explain','Explain how immigration could help address a shrinking workforce.','Working-age migrants fill labor shortages and expand the workforce.'],'Working-age immigrants expand the available labor force and fill vacant jobs.','Immigration shrinks the workforce because no newcomers can work.'],
 [['F','Identify','Identify the Demographic Transition Model stage most likely associated with low birth rates and low death rates.','Stage 4, or sometimes Stage 5.'],'Stage 4.','Stage 1.']
];
for(const [part,valid,invalid] of demographicCases){
 assert.equal(global.__gradeFrqPart(part,valid).status,'verified',part[0]+' valid paraphrase');
 assert.equal(global.__gradeFrqPart(part,invalid).earned,false,part[0]+' inaccurate demographic relationship');
}

const unit1=['B','Explain','Explain why national and neighborhood maps can show different patterns.','Aggregated national statistics obscure small-area variation that disaggregated neighborhood evidence reveals.'];
const developed=global.__gradeFrqPart(unit1,'When figures are combined across an entire country, distinct conditions within individual communities can disappear because a single summary smooths over their differences.');
assert.equal(developed.status,'unverified');
assert.equal(developed.selfCheckLevel,'could-earn');
assert.match(developed.feedback,/Could earn the point — compare your wording with the model answer/);
const vague=global.__gradeFrqPart(unit1,'scale changes things');
assert.equal(vague.status,'unverified');
assert.equal(vague.selfCheckLevel,'too-brief');
assert.match(vague.feedback,/Too brief to earn the point yet/);
for(const text of ['use GIS maps','build more stuff']){
  const result=global.__gradeFrqPart(unit1,text);
  assert.equal(result.selfCheckLevel,'too-brief');
}
assert.match(global.aiResultHtml({parts:[developed,vague],score:0,total:2}),/Could earn the point[\s\S]*Too brief/);
console.log(`FRQ regression passed: ${cases.length} response types, causal-language coverage, and distinct self-check guidance.`);
