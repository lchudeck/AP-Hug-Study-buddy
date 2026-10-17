const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {JSDOM,ResourceLoader,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'..');
class LocalResources extends ResourceLoader{
  fetch(url){const u=new URL(url);return Promise.resolve(u.hostname==='unit2.test'?fs.readFileSync(path.join(root,u.pathname)):Buffer.from(''));}
}
(async()=>{
  const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
  const saved={responses:{'2.4':'My earlier reasoning'},completed:{'2.1':true}};
  const dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{url:'https://unit2.test/',resources:new LocalResources(),runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.alert=()=>{};w.confirm=()=>false;w.matchMedia=()=>({matches:false,addListener(){},removeListener(){}});w.fetch=async()=>({ok:true,json:async()=>({}),text:async()=>''});w.localStorage.setItem('aphgFoundationProgressV1',JSON.stringify(saved));}});
  try{
    await new Promise(r=>dom.window.addEventListener('load',r,{once:true}));
    const w=dom.window,app=w.document.getElementById('app'),quiz=w.eval('quiz');
    const changed=quiz.filter(q=>q.quality==='unit2-sprint1');
    assert.equal(changed.length,12,'replace six topics’ two generated items rather than inflate the bank');
    for(const q of changed){
      assert.equal(q[0],'Unit 2');assert.equal(q[2].length,4);assert.equal(new Set(q[2]).size,4);
      assert.equal(q[2].filter(c=>c===q[3]).length,1);assert.ok(q[4].length>180);
      for(let n=0;n<20;n++){const choices=w.APHGShuffleChoices(q[2],q[1]+n);assert.equal(choices.filter(c=>c===q[3]).length,1);}
    }
    const natural=changed.find(q=>q.misconception==='nir-migration');
    assert.match(natural[3],/2.0% natural increase; 1.5% total growth/);
    assert.equal((28-8)/10,2);assert.equal((28-8-5)/10,1.5);
    const dependency=changed.find(q=>q.misconception==='dependency-denominator');
    assert.match(dependency[3],/67/);assert.equal(Math.round((30+10)/60*100),67);
    assert.match(changed.find(q=>q.misconception==='dtm-vs-epidemiological')[4],/does not isolate a cause/);
    const epi=w.eval('flashcards').find(c=>c.term==='Epidemiological Transition Model');
    assert.equal(epi.topic,'2.5');assert.match(epi.def,/distinct from the DTM/);
    w.eval('active="foundations"');w.foundationUnit(2);
    for(const t of ['2.1','2.4','2.5','2.7','2.8','2.9']){
      w.foundationTopic(t);assert.ok(app.querySelector('ol li'),'worked steps render for '+t);
      w.foundationMode('apply');assert.ok(app.querySelector('details summary'));
    }
    w.foundationTopic('2.4');w.foundationMode('apply');
    assert.equal(app.querySelector('textarea').value,saved.responses['2.4']);
    w.foundationApplyInput('2.4','Revised calculation: 1.5%');w.foundationMode('learn');w.foundationMode('apply');
    assert.equal(app.querySelector('textarea').value,'Revised calculation: 1.5%');
    assert.equal(JSON.parse(w.localStorage.getItem('aphgFoundationProgressV1')).completed['2.1'],true);
    w.foundationUnit(1);assert.equal(app.querySelector('ol'),null,'worked additions do not alter Unit 1');
    // Exercise the real Unit Review renderer and scoring after all production patches load.
    const original=quiz.slice(),extras=['APHG_IMAGE_MCQ_BANK','APHG_STIMULUS_SET_QUESTIONS','APHG_STIMULUS_SET_QUESTIONS_EXTRA','APHG_REAL_DATA_QUESTIONS'];
    const prior=extras.map(k=>w[k]);extras.forEach(k=>w[k]=[]);
    for(const q of changed){
      quiz.splice(0,quiz.length,q);w.eval('active="unitReview"');w.urUnit(2);w.urStart('quick',10);
      if(q.stimulus)assert.ok(app.querySelector('table'),'changed item retains table in student review');
      let buttons=[...app.querySelectorAll('.quiz-option')];buttons.find(b=>b.textContent.slice(3)===q[3]).click();
      assert.match(app.textContent,/Correct/);assert.match(app.textContent,new RegExp(q[4].slice(0,20).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
      w.urNext();assert.match(app.textContent,/100%/);
      w.urStart('quick',10);buttons=[...app.querySelectorAll('.quiz-option')];buttons.find(b=>b.textContent.slice(3)!==q[3]).click();assert.match(app.textContent,/Not yet/);
    }
    quiz.splice(0,quiz.length,...original);extras.forEach((k,i)=>w[k]=prior[i]);
    const route=w.APHG_STIMULUS_SET_QUESTIONS_EXTRA.filter(q=>q.setId==='migration-flow');
    assert.equal(route.length,4);assert.ok(route.every(q=>q.stimulus.includes('600 remain here')));
    assert.match(route.find(q=>/two arrows/.test(q.prompt)).answer,/Forty percent/);
    const displacement=w.APHG_AUTHENTIC_STIMULUS_QUESTIONS.filter(q=>q.setId==='u4-refugees');
    assert.ok(displacement.every(q=>q.unit===2));assert.ok(displacement.every(q=>q.stimulus.includes('global-trends-report-2024.pdf')));
    assert.match(displacement[0].answer,/60%/);assert.equal(Math.round(73.5/123.2*100),60);
    for(const set of w.__visualPractice12.sets.filter(s=>s.unit===2)){
      if(set.title==='Population Pyramid'){assert.match(set.stimulus,/0–9/);assert.match(set.stimulus,/Percent of total population/);}
    }
    for(let pass=0;pass<8;pass++){
      const deck=w.__unitReviewBuild(2,10,'quick');
      assert.equal(new Set(deck.map(q=>q.prompt)).size,deck.length,'short Unit 2 sessions avoid exact duplicate prompts');
    }
    assert.deepEqual(errors,[]);console.log('Unit 2 Sprint 1 passed: 12 replacement items, keyed shuffles, right/wrong scoring, worked lessons, source interpretation, flashcard topic and preserved progress.');
  }finally{dom.window.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
