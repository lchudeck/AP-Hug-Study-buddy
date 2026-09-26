const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const {JSDOM,ResourceLoader,VirtualConsole}=require('jsdom');

if(!process.env.APHG_BETA_TEST_CHILD){
  const child=spawnSync(process.execPath,[__filename],{env:{...process.env,APHG_BETA_TEST_CHILD:'1'},encoding:'utf8',timeout:15000});
  if(child.error)throw child.error;
  assert.equal(child.status,0,child.stderr||child.stdout);
  process.stdout.write(child.stdout);
}else{
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
    const console=new VirtualConsole();
    console.on('jsdomError',error=>errors.push(error.message));
    const dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{
      url:'https://study-buddy.test/',resources:new LocalResources(),runScripts:'dangerously',pretendToBeVisual:true,
      virtualConsole:console,
      beforeParse(w){Object.defineProperty(w,'innerWidth',{value:Number(process.env.APHG_BETA_WIDTH)||1280,configurable:true});w.alert=()=>{};w.confirm=()=>false;w.scrollTo=()=>{};w.matchMedia=()=>({matches:false,addListener(){},removeListener(){}});w.fetch=async()=>({ok:true,json:async()=>({}),text:async()=>''});}
    });
    try{
      await new Promise(resolve=>dom.window.addEventListener('load',resolve,{once:true}));
      const w=dom.window,app=w.document.getElementById('app');
      w.eval('active="visualPractice"');
      w.vpSet(3);
      assert.match(app.textContent,/Demographic Transition Model/);
      for(let i=0;i<10;i++){
        w.vpChoose(0);
        assert.match(app.textContent,/Next visual question/);
        w.vpNext();
        await new Promise(resolve=>setTimeout(resolve,0));
        assert.match(app.textContent,/Question 1 of 3|Question 2 of 3|Question 3 of 3/);
      }
      for(let i=0;i<3;i++){w.vpSet(i);assert.match(app.textContent,new RegExp(w.__visualPractice12.sets[i].title));}

      w.eval('active="home"');w.render();
      [...app.querySelectorAll('button')].find(b=>b.textContent.includes('I don’t know how to write an FRQ')).click();
      assert.match(app.textContent,/What you are answering/);
      assert.match(app.textContent,/Part A —/);
      assert.match(app.textContent,/Build your answer — one point at a time/);
      assert.ok(app.querySelector('.frq-task-card')&&app.querySelector('.scaffold-box'));

      const quiz=w.eval('quiz'),original=quiz.slice();
      const tableQuestion=original.find(q=>/supported by the table/i.test(q[1])&&q.stimulus?.includes('<table'));
      assert.ok(tableQuestion,'Unit 2 table question has an attached stimulus in the source');
      quiz.splice(0,quiz.length,tableQuestion);
      const extraNames=['APHG_IMAGE_MCQ_BANK','APHG_STIMULUS_SET_QUESTIONS','APHG_STIMULUS_SET_QUESTIONS_EXTRA','APHG_REAL_DATA_QUESTIONS'];
      const extras=extraNames.map(name=>w[name]);extraNames.forEach(name=>w[name]=[]);
      w.eval('active="unitReview"');w.urUnit(2);w.urStart('quick',10);
      assert.match(app.textContent,/supported by the table/i);
      assert.ok(app.querySelector('.box-info table'),'Unit 2 Check renders the evidence table with its question');
      quiz.splice(0,quiz.length,...original);
      extraNames.forEach((name,i)=>w[name]=extras[i]);
      assert.deepEqual(errors,[],'affected flows have no browser script errors');
      process.stdout.write('Beta blockers regression passed: DTM progression, FRQ task and scaffold, Unit 2 evidence.\n');
      process.exit(0);
    }catch(error){process.stderr.write(String(error.stack||error));process.exit(1);}
  })();
}
