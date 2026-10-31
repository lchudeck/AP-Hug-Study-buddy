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
assert.equal(global.__frqHasCausalRelationship('Working-age immigrants can fill vacant jobs, increasing the available labor force.'),true,'participial causal explanation not recognized');
assert.equal(global.__frqHasCausalRelationship('If construction does not keep up with demand, rents rise and residents may oppose immigration.'),true,'rising-cost causal explanation not recognized');

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
assert.equal(developed.reviewLabel,'Not verified — rubric review');
assert.match(developed.feedback,/valid alternative may earn credit/);
const vague=global.__gradeFrqPart(unit1,'scale changes things');
assert.equal(vague.status,'unverified');
assert.equal(vague.earned,false);
assert.match(vague.feedback,/required geographic reasoning/);
for(const text of ['use GIS maps','build more stuff']){
  const result=global.__gradeFrqPart(unit1,text);
  assert.equal(result.earned,false);
}
assert.match(global.aiResultHtml({parts:[developed,vague],score:0,total:2}),/Not verified — rubric review/);

// Short off-task replies get a clear "Too brief" status instead of "may earn credit";
// concise correct answers (including a leading article) still verify.
const siteA=['A','Identify',"Identify the geographic concept that describes the physical characteristics of the city's location.",'Site.'];
for(const text of ['site','The site.'])assert.equal(global.__gradeFrqPart(siteA,text).status,'verified',text+' should verify');
for(const text of ['qwrty','random','because because']){
  const r=global.__gradeFrqPart(siteA,text);
  assert.equal(r.earned,false,text);assert.equal(r.reviewLabel,'Too brief',text);
  assert.doesNotMatch(r.feedback,/may earn credit/,text);
}
assert.match(global.aiResultHtml({parts:[global.__gradeFrqPart(siteA,'random')],score:0,total:1}),/Too brief/);
console.log(`FRQ regression passed: ${cases.length} response types, causal-language coverage, and distinct self-check guidance.`);
