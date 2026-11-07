const assert=require('node:assert/strict'),boot=require('./loaded-page.cjs');
(async()=>{const {w,errors}=await boot(process.cwd());await new Promise(r=>setTimeout(r,100));
for(const [unit,term,match] of [[1,'Map Scale',/240 m/],[2,'Dependency Ratio',/0–14/],[2,'Immigration',/into/],[2,'Emigration',/out of/],[2,'Working-Age Population',/not necessarily/],[3,'Expansion Diffusion',/remaining present/]]){
 w.eval(`selectedUnit=${unit};termView='list';active='terms';render()`);
 const summaries=[...w.document.querySelectorAll('#app details.chip summary')];const target=summaries.find(s=>s.textContent===term);assert.ok(target,term+' must be directly findable');target.click();assert.equal(target.parentElement.open,true);assert.match(target.parentElement.textContent,match);
}
w.localStorage.setItem('aphgPersonalCoachV1',JSON.stringify({topics:{'2.5':{misses:3,rescues:0,checks:1,correct:1,last:1}},diagnoses:{},history:[]}));assert.doesNotMatch(w.APHGPersonalCoach.nextStep(),/undefined|Topic 2.5/);
assert.deepEqual(errors,[]);console.log('Vocabulary: six directly expandable definitions/examples; cross-unit recommendation stays scoped.');process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
