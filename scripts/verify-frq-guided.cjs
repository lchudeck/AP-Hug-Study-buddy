const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});try{
for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
const page=await browser.newPage({viewport}),errors=[],leaks=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if((r.postData()||'').includes('SYNTHETIC'))leaks.push(r.url())});
await page.goto(process.env.FRQ_URL||'http://127.0.0.1:8765/',{waitUntil:'networkidle'});await page.waitForFunction(()=>typeof frqWritingMove==='function');
await page.locator('[data-student-route="frq"]').first().click();
for(let unit=1;unit<=3;unit++){
await page.locator('#guidedPrompt').selectOption(String(unit-1));
await page.getByRole('button',{name:'Continue',exact:true}).click();
await page.getByText('Underdeveloped response',{exact:true}).waitFor();
await page.getByRole('button',{name:'Continue',exact:true}).click();
await page.getByRole('button',{name:'Save original and review',exact:true}).click();assert.match(await page.locator('#writingCoach').innerText(),/Write a response before continuing/);
assert.equal(await page.getByText('One valid example',{exact:true}).count(),0);
const first=['SYNTHETIC: Local maps always show less detail.','SYNTHETIC: Immigration makes workers fewer.','SYNTHETIC: Phones spread dance because everyone moves.'][unit-1];await page.locator('#writing-draft').fill(first);
await page.getByRole('button',{name:'Save original and review',exact:true}).click();
for(const box of await page.locator('#writingCoach input[type=checkbox]').all())await box.check();
await page.locator('#writing-revision').fill(['SYNTHETIC: The county average combines areas, hiding South’s 25-minute wait compared with North’s 5.','SYNTHETIC: Qualified arriving nurses fill shifts left open by retirees, reducing the staffing shortage.','SYNTHETIC: Online viewers abroad learn and share the dance, extending its reach.'][unit-1]);
await page.locator('#writing-reflection').fill('SYNTHETIC: I changed the direction of the effect.');
await page.getByRole('button',{name:'Save revision and compare',exact:true}).click();assert.equal(await page.locator('#writing-original').inputValue(),first);
await page.getByText('One valid example',{exact:true}).waitFor();await page.getByRole('button',{name:'Continue',exact:true}).click();
await page.locator('#writing-transfer').fill(['SYNTHETIC: Regional internet access hides Hill’s lower access revealed at a local scale.','SYNTHETIC: Arriving qualified electricians fill jobs left open by retirees.','SYNTHETIC: Migrants teach music at gatherings, exposing new neighbors to the tradition.'][unit-1]);
await page.getByRole('button',{name:'Save transfer and finish',exact:true}).click();
const before=await page.locator('#writingCoach').innerText();assert.doesNotMatch(before,/Locally verified|Point earned|\d\/7|Your answer is correct|You mastered/);
await page.reload({waitUntil:'networkidle'});await page.waitForFunction(()=>typeof frqWritingMove==='function');await page.locator('[data-student-route="frq"]').first().click();
// Normal home entry may choose a unit; select the saved lesson explicitly.
await page.locator('#guidedPrompt').selectOption(String(unit-1));assert.equal(await page.locator('#writing-original').inputValue(),first);assert.match(await page.locator('#writingStep').innerText(),/Finish/);
assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'mobile overflow');
console.log(JSON.stringify({viewport,unit,workflow:true,refresh:true,original:true,ungraded:true}));
}
// Lesson switching preserves the draft and position; explicit help is marked as supported.
await page.evaluate(()=>{go('home');go('frq')});await page.locator('#guidedPrompt').selectOption('0');
for(let i=0;i<4;i++)await page.getByRole('button',{name:'Back',exact:true}).click();
await page.getByRole('button',{name:'Show an example for help',exact:true}).click();await page.getByText('Supported practice: you opened help before finishing your revision.',{exact:true}).waitFor();
await page.locator('#guidedPrompt').selectOption('1');await page.locator('#guidedPrompt').selectOption('0');assert.match(await page.locator('#writingStep').innerText(),/Apply independently/);
await page.locator('#guidedPrompt').focus();await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>document.activeElement!==document.body));
assert.deepEqual(errors,[]);assert.deepEqual(leaks,[]);await page.close();
} }finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
