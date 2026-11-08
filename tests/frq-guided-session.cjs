const assert=require('node:assert/strict'),boot=require('./loaded-page.cjs');
(async()=>{const {w,errors}=await boot(process.cwd());await new Promise(r=>setTimeout(r,100));
for(let u=0;u<3;u++){
w.eval(`active='frq';selectedPrompt=${u};render()`);w.frqWritingMove(1);w.frqWritingMove(1);w.frqWritingMove(1);assert.equal(w.document.querySelector('#writing-draft')!==null,true);
for(const text of ['asdf qwrty zzzzz','Immigration reduces available workers.','New workers fill jobs.','Wrkers fill vacancys.']){
w.frqWritingInput('draft',text);w.frqWritingCheck(0,true);assert.doesNotMatch(w.document.body.textContent,/Locally verified|Point earned|Your answer is correct|\d\/7/);
}
w.frqWritingMove(1);w.frqWritingInput('revision','Workers can fill vacancies as older workers retire.');w.frqWritingInput('reflection','Added mechanism');w.frqWritingMove(1);assert.ok(w.document.body.textContent.includes('One valid example'));w.frqWritingMove(1);w.frqWritingInput('transfer','A different geographic explanation');w.frqWritingMove(1);
const s=JSON.parse(w.sessionStorage.getItem('aphg-frq-writing-v2')).lessons[u];assert.equal(s.original,'Wrkers fill vacancys.');assert.equal(s.step,6);
}
w.frqWritingSwitch(0);assert.ok(w.document.querySelector('#writing-original').value.includes('Wrkers'));
assert.deepEqual(errors,[]);console.log('Ungraded session workflow, response variants and lesson isolation PASS (DOM only)');process.exit(0);})().catch(e=>{console.error(e);process.exit(1)});
