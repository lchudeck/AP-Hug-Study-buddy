// Real production UI only; original answers, no source-bank or hidden answer lookup.
const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const b=await chromium.launch({headless:true});try{
 const context=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('https://www.apstudybuddy.com/',{waitUntil:'networkidle'});
 await p.getByRole('button',{name:'📚 Key Terms',exact:true}).click();
 await p.getByRole('button',{name:'U2 Population & Migration',exact:true}).click();
 await p.getByRole('button',{name:'🃏 Adaptive Flashcards',exact:true}).click();
 await p.getByRole('button',{name:'Unit 2',exact:true}).click();
 await p.getByRole('button',{name:'All Cards',exact:true}).click();
 const vocab=[];
 for(let i=0;i<3;i++){
  const card=p.getByRole('button',{name:'Flashcard. Press Enter or Space to flip.',exact:true});
  const term=await card.innerText();await p.getByRole('button',{name:'Flip card',exact:true}).click();
  const definition=await card.innerText();assert.ok(definition.length>40);vocab.push({term,definition});await p.getByRole('button',{name:'Next →',exact:true}).click();
 }
 await p.getByRole('button',{name:'📖 Study List',exact:true}).click();await p.getByRole('button',{name:'Quiz Unit 2',exact:true}).click();
 await p.getByRole('button',{name:'Low birth rates and low death rates',exact:true}).click();
 assert.match(await p.locator('#app').innerText(),/birth rates stay high/);
 await p.getByRole('button',{name:'✍️ FRQ Coach',exact:true}).click();
 const close=p.getByRole('button',{name:'Close',exact:true});if(await close.count()){await close.click();await p.getByRole('button',{name:'✍️ FRQ Coach',exact:true}).click();}
 await p.getByRole('combobox',{name:'Choose a prompt',exact:true}).selectOption({label:'Unit 2: Population and Migration'});
 const first='A. Rising median age.\nB. Workers divided by kids and retired people.\nC. Higher pension costs.\nD. Immigration reduces the workforce because immigrants take peoples jobs.\nE. People get mad because immigrants are different.\nF. Stage four.\nG. Raise the retirement age.';
 await p.getByRole('textbox',{name:'Your first answer',exact:true}).fill(first);await p.getByRole('button',{name:/^(?:✦\s*)?Check my answer$/}).click();
 await p.getByRole('heading',{name:'Locally verified: 2/7',exact:true}).waitFor();assert.equal(await p.locator('.part-result details').count(),0);
 await p.getByRole('checkbox').first().check();assert.equal(await p.getByRole('heading',{name:'Locally verified: 2/7',exact:true}).count(),1);
 const revised='A. Rising median age.\nB. Dependents compared with working-age people.\nC. Higher pension costs.\nD. immigrants fill vacant jobs so theres more workers.\nE. Housing demand outpaces construction, raising rents and opposition to immigration.\nF. Stage four.\nG. Raise the retirement age to keep adults employed longer.';
 await p.getByRole('textbox',{name:'Revise your answer once using the feedback below',exact:true}).fill(revised);await p.getByRole('button',{name:/^(?:✦\s*)?Check revision$/}).click();
 await p.getByRole('heading',{name:'Locally verified: 6/7',exact:true}).waitFor();
 await p.getByText('Read original submission',{exact:true}).click();assert.equal(await p.locator('.ai-result pre').innerText(),first);
 await p.getByRole('button',{name:'Compare model answers',exact:true}).click();assert.equal(await p.locator('.part-result details').count(),7);
 await p.getByRole('button',{name:'📚 Key Terms',exact:true}).click();await p.getByRole('button',{name:'✍️ FRQ Coach',exact:true}).click();assert.equal(await p.getByRole('heading',{name:'Locally verified: 6/7',exact:true}).count(),1);
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);
 console.log(JSON.stringify({production:true,viewport:{width:390,height:844},vocab,application:'DTM wrong-answer explanation',first:2,revised:6,uncertain:'F: Stage four remains review in current production',selfCheckNoCredit:true,originalPreserved:true,modelsAfterRevision:true,navigation:true,overflow:false,pageErrors:errors}));
 await context.close();
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
