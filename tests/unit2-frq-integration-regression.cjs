const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM,ResourceLoader,VirtualConsole}=require('jsdom');
const {cases}=require('./unit2-frq-accuracy-regression.cjs');
const root=path.resolve(__dirname,'..');
class LocalResources extends ResourceLoader{
  fetch(url){
    const parsed=new URL(url);
    if(parsed.hostname!=='study-buddy.test')return Promise.resolve(Buffer.from(''));
    const file=path.resolve(root,'.'+parsed.pathname);
    return Promise.resolve(fs.readFileSync(file));
  }
}
(async()=>{
  const errors=[];
  const virtualConsole=new VirtualConsole();
  virtualConsole.on('jsdomError',error=>errors.push(error.message));
  const dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{
    url:'https://study-buddy.test/',resources:new LocalResources(),runScripts:'dangerously',pretendToBeVisual:true,
    virtualConsole,
    beforeParse(w){Object.defineProperty(w,'innerWidth',{value:Number(process.env.APHG_BETA_WIDTH)||1280,configurable:true});w.alert=()=>{};w.confirm=()=>false;w.scrollTo=()=>{};w.matchMedia=()=>({matches:false,addListener(){},removeListener(){}});w.fetch=async()=>({ok:true,json:async()=>({}),text:async()=>''});}
  });
  try{
    await new Promise(resolve=>dom.window.addEventListener('load',resolve,{once:true}));
    const w=dom.window,app=w.document.getElementById('app');

    const coach=w.eval('prompts.find(p=>p.unit===2)');
    const simulator=w.buildSimulatorExam(1).frq.find(p=>p.unit===2);
    const covered=[...coach.parts,...simulator.parts];
    for(const p of covered){
      assert.ok(cases.find(c=>c[2]===p[2]),'Real prompt must have five-level fixture coverage: '+p[2]);
      const r=w.__gradeFrqPart(p,p[3]);
      assert.equal(r.earned,true,'Model must earn its point: '+p[2]+' / '+p[3]);
    }
    for(const p of covered){
      const c=cases.find(c=>c[2]===p[2]);
      for(let i=3;i<8;i++)assert.equal(w.__gradeFrqPart(p,c[i]).earned,i===3,p[2]+': '+c[i]);
    }
    const full=(prompt,offset)=>prompt.parts.map(p=>p[0]+'. '+cases.find(c=>c[2]===p[2])[offset]).join('\n');
    assert.equal(w.localGradeFRQ(full(coach,3),coach).score,7);
    // The production checker awarded 7/7 to this observed synthetic response.
    const misleading='A. Low fertility does not show aging.\nB. Dependency ratio is working-age people divided by children and elderly dependents.\nC. Pension costs decrease because more retirees receive benefits.\nD. Immigration does not increase the workforce because migrants cannot fill jobs.\nE. Immigration creates political tension because immigrants are different.\nF. Stage 4.\nG. Pronatalist policies increase the workforce immediately because newborn babies fill vacant jobs.';
    assert.equal(w.localGradeFRQ(misleading,coach).score,1,'Only the DTM stage identification is creditworthy');
    assert.equal(w.localGradeFRQ(full(coach,7),coach).score,0);
    assert.equal(w.gradeOneFrq(simulator,full(simulator,3)).score,7);
    assert.equal(w.gradeOneFrq(simulator,full(simulator,7)).score,0);
    assert.equal(w.gradeOneFrq(simulator,'All these parts are correct.').score,0,'Unlabeled text cannot earn all parts');
    // UI submission, rendering and rewrite preserve the student's draft.
    w.eval('active="frq"; selectedPrompt=1');
    w.render();
    const answer=full(coach,7);
    const field=app.querySelector('#mainAnswer');field.value=answer;field.dispatchEvent(new w.Event('input',{bubbles:true}));
    await w.gradeWithAI();
    assert.match(app.textContent,/Not verified — rubric review/);
    assert.doesNotMatch(app.querySelector('.ai-result').textContent,/Could earn the point/);
    assert.match(app.textContent,/Name a policy and explain its mechanism/);
    assert.equal(app.querySelector('#mainAnswer').value,answer);
    [...app.querySelectorAll('button')].find(b=>b.textContent==='Rewrite and try again').click();
    assert.equal(app.querySelector('#mainAnswer').value,answer);
    assert.equal(w.__gradeStrictDrill(0,'Unemployment').earned,false);
    assert.equal(w.__gradeStrictDrill(0,'Higher wages.').earned,true);
    assert.equal(w.__gradeStrictDrill(6,'More retirees increase pension costs, leaving fewer workers supporting benefits.').earned,true);
    assert.equal(w.__gradeStrictDrill(6,'More dependents lower pension costs because more people retire.').earned,false);
    w.eval('drillIndex=0; drillAnswer="Unemployment"');w.strictGradeDrill();
    assert.match(app.textContent,/Not verified — rubric review/);
    // Snapshot of earned/status pairs on main d6692c6: six other units,
    // seven parts each, with model/vague/blank/nonsense answers (168 checks).
    const snapshot=[];
    for(const prompt of w.eval('prompts.filter(p=>p.unit!==2)'))for(const p of prompt.parts){
      for(const response of [p[3],'It makes things better.','', 'asdf qwrty zzzzz']){
        const r=w.__gradeFrqPart(p,response);snapshot.push([r.earned,r.status]);
      }
    }
    assert.equal(require('node:crypto').createHash('sha256').update(JSON.stringify(snapshot)).digest('hex'),
      'fe6aed36c7e51a01ac4882fb0ff2314e65c220a0078c49b6dd38c9b9c45867d8','Other-unit scoring/status snapshot changed');
    console.log(snapshot.length+' other-unit scoring/status comparisons unchanged.');
    assert.deepEqual(errors,[]);
    console.log('Unit 2 integration passed: real Coach/simulator models and five-level fixtures, score totals, labeled parts, review feedback, rewrite draft and drills.');
  }finally{dom.window.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
