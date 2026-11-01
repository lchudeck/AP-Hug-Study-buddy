const assert=require('node:assert/strict');
const root=require('node:path').resolve(__dirname,'..');
const boot=require('./loaded-page.cjs');
const bad=[
 [1,'B','Situation means absolute latitude and longitude, never relative location or connections.'],
 [2,'B','Dependency ratio is working-age population divided by the number of dependent children and elderly people.'],
 [3,'B','Relocation diffusion happens when people stay home and cultural traits spread without people moving.'],
 [4,'B','Sovereignty means a state has no authority to govern its territory and is always controlled from outside.'],
 [5,'D','Dairy products stay far from the market because they spoil quickly and transportation is expensive.'],
 [6,'D','Rising rents keep longtime residents in the neighborhood because higher costs make housing more affordable.'],
 [7,'B','HDI measures development using military spending, income and total population, not education or life expectancy.'],
 [1,'B','The relative location is irrelevant; situation is the absolute position of a place.'],
 [3,'B','People move but leave every cultural trait behind; migration prevents cultural spread.'],
 [4,'B','A government loses all authority to govern its territory when it gains sovereignty.'],
 [5,'D','Milk spoils faster on long trips so farms choose the most distant locations.'],
 [6,'D','Higher housing costs reduce displacement by making residents richer.'],
 [7,'B','Income and military power determine HDI; education is irrelevant.']
];
const good=[
 [1,'B','Location relative to other places.'],
 [2,'A','A top-heavy population pyramid.'],[2,'A','A high elderly dependency ratio.'],
 [3,'B','People move to another country and bring their cultural traits.'],
 [4,'B','The authority to govern its own territory independently.'],
 [5,'D','Dairy is close to the market: milk spoils quickly on long trips.'],
 [6,'D','Higher rents displace longtime residents who cannot afford housing.'],
 [7,'B','Income, education and life expectancy.'],
 [1,'B','Its connections with other places.'],[4,'B','Soverignty is the right to govern its own territory independently.'],
 [3,'B','Families move overseas and carry their language and customs.']
];
(async()=>{
 const {dom,w,errors}=await boot(root);
 try{
 const app=w.document.getElementById('app'),prompts=w.eval('prompts');
 const part=(u,l)=>prompts.find(p=>p.unit===u).parts.find(p=>p[0]===l);
 for(const [u,l,t] of bad){assert.equal(w.__gradeFrqPart(part(u,l),t).earned,false,t);assert.equal(w.gradeOneFrq(prompts.find(p=>p.unit===u),l+'. '+t).score,0,'Shared simulator scorer: '+t);}
 for(const [u,l,t] of good)assert.equal(w.__gradeFrqPart(part(u,l),t).earned,true,t);
 for(const p of prompts){
   const full=p.parts.map(x=>x[0]+'. '+x[3]).join('\n');
   assert.equal(w.localGradeFRQ(full,p).score,7,'Unit '+p.unit+' model');
   // Exercise the actual student-facing Coach submit and rewrite.
   w.eval(`active='frq'; selectedPrompt=${prompts.indexOf(p)}; aiResult=null`);w.render();
   app.querySelector('#mainAnswer').value=full;
   app.querySelector('#mainAnswer').dispatchEvent(new w.Event('input',{bubbles:true}));
   await w.gradeWithAI();
   assert.match(app.querySelector('.ai-result').textContent,/Locally verified: 7\/7/);
   [...app.querySelectorAll('button')].find(b=>b.textContent==='Rewrite and try again').click();
   const broken=bad.find(x=>x[0]===p.unit);
   app.querySelector('#mainAnswer').value=broken[1]+'. '+broken[2];
   app.querySelector('#mainAnswer').dispatchEvent(new w.Event('input',{bubbles:true}));await w.gradeWithAI();
   assert.match(app.querySelector('.ai-result').textContent,/Locally verified: 0\/7/);
   for(const response of ['It helps things.','Income.','', 'asdf qwrty zzzzz']){
     assert.equal(w.__gradeFrqPart(p.parts[1],response).earned,false);
   }
   w.sspStartTopic(p.unit+'.1');
   const session=w.APHGStudentSuccess.session();
   assert.ok(session.deck.length>0&&session.deck.length<=5);
   assert.ok(session.deck.every(q=>q.topic===p.unit+'.1'));
   while(!session.done){const q=session.deck[session.i];w.sspAnswer(q.choices.findIndex(c=>c!==q.answer));assert.ok(app.querySelector('.box-warn'));w.sspNext();}
   assert.match(app.textContent,/Retrieval complete/);
   w.sspSetTopic(p.unit+'.1');w.sspGo('teach');assert.match(app.textContent,/Teach Me This/);
   [...app.querySelectorAll('button')].find(b=>/Try up to 5/.test(b.textContent)).click();
   assert.ok(w.APHGStudentSuccess.session().deck.every(q=>q.topic===p.unit+'.1'));
 }
 // Regular practice, deliberate errors, recovery, stimulus and results in each unit.
 let sawRetryLabel=false;
 for(let u=1;u<=7;u++){
   w.sspSetPlan('unit',u);w.studentProofRoute('learn');assert.match(app.textContent,/Teach Me This/);
   w.eval("active='practiceMastery'");w.pmStart('unit',u);
   let stimulusSeen=false;
   for(let n=0;n<25;n++){
     stimulusSeen ||= !!app.querySelector('svg, table, img');
     const buttons=[...app.querySelectorAll('.quiz-option')];assert.equal(buttons.length,4);
     w.pmChoose(0);if(app.querySelector('[onclick="pmHelp()"]')){w.pmHelp();assert.match(app.textContent,/plain language/);}
     assert.ok(app.querySelector('.box-good,.box-warn'));w.pmNext();
   }
   assert.match(app.textContent,/You finished/);assert.ok(stimulusSeen,'Unit '+u+' stimulus');
   w.eval("active='unitReview'");w.urUnit(u);w.urStart('quick',3);
   let steps=0;
   const mainTotals=new Set();
   while(app.querySelector('.quiz-option')&&steps++<65){
    // Main questions keep a fixed denominator; appended retries are counted separately.
    const label=app.querySelector('.mastery-mini-nav span:last-child').textContent.trim();
    const m=label.match(/^(\d+)\/(\d+)$/),r=label.match(/^Retry (\d+) of (\d+)$/);
    assert.ok(m||r,'Unit '+u+' review counter: '+label);
    if(m)mainTotals.add(m[2]);else{sawRetryLabel=true;assert.ok(+r[1]<=+r[2],'retry count '+label);}
    w.urChoose(0);w.urNext();
   }
   assert.equal(mainTotals.size,1,'Unit '+u+' main question total must not grow during retries');
   assert.ok(steps>0&&steps<=61,'Unit review finishes with bounded retries');
   assert.ok(!app.querySelector('.quiz-option'),'Unit '+u+' results');
 }
 assert.ok(sawRetryLabel,'expected at least one Unit Review retry label');
 // Repeated shuffles must not change the planner's selected unit.
 for(let repeat=0;repeat<10;repeat++)for(let u=1;u<=7;u++){
   w.__visualPractice37.sets.reverse();w.__visualPractice12.sets.reverse();
   w.sspSetPlan('unit',u);w.sspSetPlan('minutes',30);w.sspGo('plan');
   const button=[...app.querySelectorAll('button')].find(b=>/maps/.test(b.getAttribute('onclick')||''));
   assert.ok(button,'planner map action');button.click();
   assert.match(app.querySelector('.pill').textContent,new RegExp('Unit '+u));
 }
 const pool=w.APHGStudentQuestionPool();
 const checks=[[/highest GDP per capita/,'7.3'],[/Why does HDI improve/,'7.3'],[/Which concept best describes the sequence shown/,'7.6'],[/Rents and property taxes rise rapidly/,'6.10'],[/Which process is most consistent with the full pattern/,'6.10']];
 for(const [re,topic]of checks){const q=pool.find(q=>re.test(q.prompt));assert.ok(q);assert.equal(q.topic,topic);w.APHGTopicSkillMastery.recordEvidence(q,false);assert.ok(w.APHGTopicSkillMastery.topicEvidence().some(e=>e.topic===topic&&e.stat.attempts));w.sspStartTopic(topic);assert.ok(w.APHGStudentSuccess.session().deck.every(q=>q.topic===topic));}
 const district=w.__visualPractice37.sets.find(s=>s.unit===4),farm=w.__visualPractice37.sets.find(s=>s.unit===5);
 assert.match(district.q[2],/voter and election data/);assert.match(farm.stimulus,/>A<.*>B<.*>C</);assert.match(farm.q[2],/Ring A/);
 assert.deepEqual(errors,[]);
 console.log('Focused learning: 13 incorrect/reversed cases; 11 alternatives; all seven Coach submit/rewrite/model flows; 70 shuffled planner routes; topic retry, evidence recording, seven practice/mastery sessions and visual tasks passed.');
 }finally{dom.window.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
