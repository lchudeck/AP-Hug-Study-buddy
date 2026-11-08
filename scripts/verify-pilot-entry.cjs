const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch();try{
 for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
  const page=await browser.newPage({viewport}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'✍️ FRQ Coach',exact:true}).click();
  await page.getByRole('heading',{name:'FRQ Coach · Unit 1',exact:true}).waitFor();
  assert.equal(await page.getByRole('button',{name:'Show sample answer',exact:true}).count(),0,'Legacy model button must not remain on first entry');
  await page.locator('#mainAnswer').fill('E. Regional maps show more neighborhood detail than local maps.\nG. Add bus routes to prevent poor residents from reaching jobs.');
  await page.getByRole('button',{name:/Check my answer$/}).click();
  await page.getByText('First attempt: 0/7 verified points',{exact:true}).waitFor();
  const review=page.locator('.part-result input[type=checkbox]');await review.first().check();
  assert.match(await page.locator('.ai-result').innerText(),/Locally verified: 0\/7/);
  await page.getByRole('button',{name:'📚 Key Terms',exact:true}).click();
  await page.getByRole('button',{name:'✍️ FRQ Coach',exact:true}).click();
  assert.equal(await page.locator('#mainAnswer').inputValue(),'E. Regional maps show more neighborhood detail than local maps.\nG. Add bus routes to prevent poor residents from reaching jobs.');
  assert.deepEqual(errors,[]);console.log(JSON.stringify({viewport,entry:true,legacyModelHidden:true,newNegativeVerified:0,selfCheckNoCredit:true,navigation:true}));await page.close();
 }
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
