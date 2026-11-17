const assert=require('node:assert/strict'),boot=require('./loaded-page.cjs'),{M,H}=require('./frq-guided-bank.cjs');
(async()=>{const {w,errors}=await boot(process.cwd());await new Promise(r=>setTimeout(r,100));
for(let unit=1;unit<=3;unit++){
 w.eval(`active='frq';selectedPrompt=${unit-1};render()`);
 const p=w.eval('prompts[selectedPrompt]');
 for(const part of p.parts){for(const text of [M[unit][part[0]][0],H[unit][part[0]][0]])assert.equal(w.__gradeFrqPart(part,text).earned,true,`served ${unit} ${part[0]}: ${text}`);}
 const original='A. idk\nB. My wording needs careful rubric comparison.';
 w.document.querySelector('#mainAnswer').value=original;w.frqGuidedDraft(original);await w.gradeWithAI();
 assert.ok(w.document.body.textContent.includes('First attempt: 0/7'));
 assert.ok(!w.document.body.textContent.includes('Compare a model for'));
 w.frqGuidedCheck('B',true);assert.equal(w.eval('aiResult.score'),0);
 const revision=p.parts.map(p=>p[0]+'. '+p[3]).join('\n');w.document.querySelector('#mainAnswer').value=revision;w.frqGuidedDraft(revision);await w.gradeWithAI();
 assert.ok(w.document.body.textContent.includes('After revision: 7/7'));
 assert.ok(w.document.body.textContent.includes(original));
 w.frqGuidedModels();assert.equal(w.document.querySelectorAll('.part-result details').length,7);
 const saved=JSON.parse(w.sessionStorage.getItem('aphg-frq-guided-v1'))[unit-1];assert.equal(saved.first.text,original);assert.equal(saved.revised.result.score,7);
}
assert.deepEqual(errors,[]);console.log('Served Units 1–3: 42 paraphrases; original/revision, hidden models and self-check safeguards passed. DOM test only.');process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
