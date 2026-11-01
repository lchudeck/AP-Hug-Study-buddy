const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const url=process.env.SMOKE_URL||'http://127.0.0.1:8765/';
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  const response=await page.goto(url,{waitUntil:'networkidle'});assert.equal(response.status(),200);
  assert.match(await page.locator('body').innerText(),/Study Buddy/);
  const manifest=require('../scripts/startup-assets.json');
  for(const entry of manifest){
   const tag=page.locator(`script[src^="assets/${entry.file}?"]`);assert.equal(await tag.count(),1);
   const src=await tag.getAttribute('src'),res=await page.request.get(new URL(src,url).href);assert.equal(res.status(),200);
   const actual=await res.body(),expected=fs.readFileSync('assets/'+entry.file);assert.ok(actual.equals(expected),'Deployed asset mismatch: '+entry.file);
   assert.equal(new URL(src,url).searchParams.get('v'),crypto.createHash('sha256').update(actual).digest('hex').slice(0,16));
  }
  console.log('All 48 served assets match this commit and their content versions.');
  await page.locator('#nav button').filter({hasText:/Unit Review/}).click();
  await page.locator('[onclick="urUnit(2)"]').click();
  const startsBefore=await page.evaluate(()=>dataLayer.filter(x=>x[0]==='event'&&x[1]==='practice_started').length);
  await page.getByRole('button',{name:/Start here/}).click();
  assert.equal(await page.evaluate(()=>dataLayer.filter(x=>x[0]==='event'&&x[1]==='practice_started').length),startsBefore+1,'One study start must emit one event');
  let count=0,missedTopic=null,retrySeen=false,stimulusSeen=false;
  while(await page.locator('.quiz-option').count()){
   assert.ok(count<61,'Unit Review must finish');
   const info=await page.evaluate(()=>{
    const prompt=document.querySelector('#app h2').textContent;
    const q=__unitReviewVariants(2).find(q=>q.prompt===prompt);if(!q)throw Error('Question missing from source pool');
    const choices=[...document.querySelectorAll('.quiz-option')].map(b=>b.textContent.slice(3));
    return {topic:q.topic,answer:choices.indexOf(q.answer),retry:document.querySelector('#app .pill').textContent.includes('concept retry'),stimulus:!!document.querySelector('#app table,#app svg,#app img')};
   });assert.ok(info.answer>=0);
   stimulusSeen ||= info.stimulus;
   if(info.retry){assert.equal(info.topic,missedTopic);retrySeen=true;}
   const choice=count===0?(info.answer+1)%4:info.answer;
   await page.locator('.quiz-option').nth(choice).click();
   if(count===0){missedTopic=info.topic;assert.match(await page.locator('#app .box-warn').innerText(),/Not yet/);assert.ok((await page.locator('#app .box-warn p').first().innerText()).length>20);}
   await page.getByRole('button',{name:/Next question|See results/}).click();count++;
  }
  assert.match(await page.locator('#app').innerText(),/Review Results/);assert.ok(count>=10);assert.ok(retrySeen,'A wrong answer must exercise an exact-topic retry');
  console.log('Completed Unit 2 review, incorrect-answer explanation and exact-topic retry: '+count+' questions.');
  // Directly inspect the corrected simulator path, then answer a rendered stimulus question.
  await page.evaluate(()=>startFullExam());
  await page.getByRole('button',{name:'Start Section I: MCQ',exact:true}).click();
  const target=await page.evaluate(()=>{const e=buildSimulatorExam(simExam);return e.mcq.findIndex(q=>q.stimulus?.html?.includes('<table'));});assert.ok(target>=0);
  const option=page.locator(`[onclick^="simSetMcq(${target},"]`).first();assert.equal(await option.count(),1);await option.click();
  assert.ok(await page.locator('#app table').count()>0);assert.equal(await page.evaluate(i=>simMcqAnswers[i]!==undefined,target),true);
  console.log('Simulator table retained and a stimulus answer recorded.');
  // Real textarea submissions through the Coach's rendered controls.
  for(const kind of ['correct','incorrect','nonsense','contradiction']){
   await page.evaluate(()=>{active='frq';selectedPrompt=1;aiResult=null;render();});
   const answer=kind==='correct'?await page.evaluate(()=>prompts[1].parts.map(p=>p[0]+'. '+p[3]).join('\n')):
    kind==='incorrect'?'B. Dependency ratio compares rainfall with crop yields.':
    kind==='contradiction'?'B. Dependency ratio is working-age population divided by the number of dependent children and elderly people.':
    'A. qwrty\nB. nonsense\nC. random\nD. blah\nE. zzz\nF. qqq\nG. nope';
   await page.locator('#mainAnswer').fill(answer);await page.getByRole('button',{name:/^(?:✦\s*)?Check my answer$/}).click();
   await page.waitForFunction(()=>document.querySelector('.ai-result')?.textContent.includes('Locally verified:'));
   assert.match(await page.locator('.ai-result').innerText(),new RegExp('Locally verified: '+(kind==='correct'?7:0)+'/7'));
  }
  console.log('FRQ Coach correct 7/7; incorrect, nonsense and contradictory responses 0/7.');
  await page.evaluate(()=>{sspSetPlan('unit',4);sspSetPlan('minutes',30);sspGo('plan');});
  const visual=page.locator('#app button[onclick*="maps"]');assert.ok(await visual.count()>0);await visual.first().click();
  assert.match(await page.locator('#app .pill').first().innerText(),/Unit 4/i);
  console.log('Visual-study shortcut opens Unit 4.');
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>sspStartTopic('2.1'));
  let mobileCount=0;
  while(!await page.evaluate(()=>APHGStudentSuccess.session().done)){
   const q=await page.evaluate(()=>{const s=APHGStudentSuccess.session();return s.deck[s.i];});assert.equal(q.topic,'2.1');
   const opts=page.locator('#app [onclick^="sspAnswer("]');assert.equal(await opts.count(),q.choices.length);
   await opts.nth(q.choices.indexOf(q.answer)).click();await page.locator('#app [onclick="sspNext()"]').click();assert.ok(++mobileCount<=5);
  }
  assert.ok(mobileCount>0);assert.match(await page.locator('#app').innerText(),/Retrieval complete/i);
  const before=await page.evaluate(()=>localStorage.getItem('aphgUnitReviewProgressV1'));assert.ok(JSON.parse(before).attempted>=10);
  await page.reload({waitUntil:'networkidle'});assert.equal(await page.evaluate(()=>localStorage.getItem('aphgUnitReviewProgressV1')),before);
  assert.equal(await page.evaluate(()=>dataLayer.filter(x=>x[0]==='config').length),1);
  const privacy=await page.evaluate(()=>{const events=dataLayer.filter(x=>x[0]==='event');return {keys:events.flatMap(x=>Object.keys(x[2]||{})),payload:JSON.stringify(events)};});
  assert.ok(privacy.keys.every(k=>['study_path','unit','feature','session_result','rating'].includes(k)),'Analytics parameters must use the anonymous allowlist');
  assert.ok(!/qwrty|rainfall with crop yields|working-age population divided/.test(privacy.payload),'Analytics must exclude submitted answer text');
  const dims=await page.evaluate(()=>[document.documentElement.scrollWidth,document.documentElement.clientWidth]);assert.ok(dims[0]<=dims[1]+5);
  assert.deepEqual(errors,[]);
  console.log('Mobile activity completed; real progress survives warm-cache reload; analytics configured once; no page errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
