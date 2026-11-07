const assert=require('node:assert/strict'),{chromium}=require('playwright');
const {M}=require('../tests/frq-guided-bank.cjs');
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}: {})});
try{for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
 const page=await browser.newPage({viewport}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.FRQ_URL||'http://127.0.0.1:8765/',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>typeof window.frqGuidedDraft==='function');
 for(let unit=1;unit<=3;unit++){
  await page.evaluate(u=>{active='frq';selectedPrompt=u-1;render();},unit);
  const original=unit===2?'A. age\nD. Immigration reduces the workforce.':'A. idk\nB. My wording needs careful rubric comparison.';
  await page.locator('#mainAnswer').fill(original);await page.getByRole('button',{name:/^(?:✦\s*)?Check my answer$/}).click();
  await page.getByText('First attempt: 0/7 verified points',{exact:true}).waitFor();
  assert.equal(await page.locator('.part-result details').count(),0,'Models hidden before revision');
  const checks=page.locator('.part-result input[type=checkbox]');if(await checks.count())await checks.first().check();
  assert.match(await page.locator('.ai-result').innerText(),/Locally verified: 0\/7/);
  await page.reload({waitUntil:'networkidle'});await page.waitForFunction(()=>typeof window.frqGuidedDraft==='function');
  await page.evaluate(u=>{active='frq';selectedPrompt=u-1;render();},unit);
  assert.equal(await page.locator('#mainAnswer').inputValue(),original);
  await page.evaluate(()=>{go('home');go('frq');});
  assert.equal(await page.locator('#mainAnswer').inputValue(),original);
  await page.locator('#mainAnswer').fill(Object.entries(M[unit]).map(([l,v])=>l+'. '+v[0]).join('\n'));
  await page.getByRole('button',{name:/^(?:✦\s*)?Check revision$/}).click();
  await page.getByText('After revision: 7/7 verified points',{exact:false}).waitFor();
  await page.getByText('Read original submission',{exact:true}).click();
  assert.equal(await page.locator('.ai-result pre').innerText(),original);
  await page.getByRole('button',{name:'Compare model answers',exact:true}).click();
  assert.equal(await page.locator('.part-result details').count(),7);
  await page.locator('.part-result details summary').first().click();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal overflow');
  console.log(JSON.stringify({viewport,unit,first:0,revised:7,refresh:true,navigation:true,selfCheckNoCredit:true,modelsAfterRevision:true}));
 }
 assert.deepEqual(errors,[]);await page.close();
}}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
