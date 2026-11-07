// Focused Unit 3 checks; run: node scripts/test-unit3-learning-lab.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync('unit-3-learning-lab.html','utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(script,'Learning lab needs inline teaching logic');
new Function(script[1]); // Syntax check without invoking browser APIs.
const source=script[1].replace(/show\(\);\s*\}\)\(\);\s*$/,'return {Q,V,FRQS,skills,frqCriteria};})();');
assert.notEqual(source,script[1],'Test fixture must export lesson data');
const data=new Function('document','return '+source.trim())({getElementById:()=>({})});
assert.equal(data.Q.length,17);
assert.equal(data.V.length,8);
assert.equal(data.FRQS.length,2);
assert.deepEqual([...new Set(data.Q.map(q=>q[0]))].sort(),['3.1','3.2','3.3','3.4','3.5','3.6','3.7','3.8']);
assert.equal(data.Q.filter(q=>q[10]!==undefined).length,8);
for(const [i,q] of data.Q.entries()){
  assert.ok(q[3].length>=2, 'Question '+i+' options');
  assert.ok(Number.isInteger(q[4])&&q[4]>=0&&q[4]<q[3].length,'Question '+i+' correct answer');
  assert.ok(q[5]&&q[6]&&q[7], 'Question '+i+' has explanation, comparison, and recovery');
  assert.ok(Array.isArray(q[8])&&q[8].length>=2, 'Question '+i+' alternate practice');
  assert.ok(Number.isInteger(q[9])&&q[9]>=0&&q[9]<q[8].length,'Question '+i+' recovery key');
  if(q[10]!==undefined) assert.ok(data.V[q[10]],'Question '+i+' references an existing stimulus');
}
for(const f of data.FRQS){assert.equal(f.parts.length,3);assert.ok(data.V[f.visual]);for(const p of f.parts)assert.ok(p[2]);}
assert.equal(data.skills.length,data.Q.length);
assert.deepEqual(data.frqCriteria.map(criteria=>criteria.length),[3,3]);
for(const topic of new Set(data.Q.map(q=>q[0]))){
  assert.ok(data.Q.filter(q=>q[0]===topic).length>=2,'Coverage for '+topic);
}
const answerCounts=[0,0,0,0];
for(const q of data.Q) answerCounts[q[4]]++;
assert.ok(answerCounts.every(count=>count>=3&&count<=6),'Balanced answer positions');
assert.ok(html.includes('First-try accuracy'));
assert.ok(html.includes('Grammar is not scored here'));
console.log('Unit 3 content integrity: 17 questions, 8 visual stimuli, 2 three-part FRQs, all eight CED topics.');

async function mobileReview() {
  const {chromium,devices}=require('playwright');
  const browser=await chromium.launch();
  try {
    const page=await browser.newPage({...devices['iPhone 13']});
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('http://lab.test/**',async route=>{
      const path=new URL(route.request().url()).pathname.slice(1);
      if(path==='ap-human-geography-unit-3.html'||path==='unit-3-learning-lab.html'||path==='seo.css'){
        await route.fulfill({path});
      }else{
        await route.abort();
      }
    });
    await page.goto('http://lab.test/ap-human-geography-unit-3.html');
    await page.getByRole('link',{name:/Start.*Learning Lab/}).click();
    assert.equal(await page.evaluate(()=>innerWidth),390);
    const missed=new Set([0,2,8,14,16]);
    const visuals=new Set();
    for(const [index,q] of data.Q.entries()){
      if(q[1]==='final'&&data.Q[index-1][1]!=='final'){
        await page.locator('#frq-reveal').click();
        assert.match(await page.locator('#frq-check').innerText(),/Write a response for each part/);
        await page.getByLabel('Part A',{exact:true}).fill('Multilingual signs appear in 2020.');
        await page.getByLabel('Part B',{exact:true}).fill('A church and rail depot remain from earlier years.');
        await page.getByLabel('Part C',{exact:true}).fill('Migrants move there.');
        await page.locator('#frq-reveal').click();
        for(const [part,rating] of ['met','met','review'].entries()){
          await page.locator(`input[name="part-${part}"][value="${rating}"]`).check();
        }
        await page.locator('#frq-next').click();
      }
      if(q[10]!==undefined){
        const diagram=page.locator('.diagram');
        assert.ok(await diagram.isVisible());
        assert.equal(await diagram.locator('strong').innerText(),data.V[q[10]].title);
        const layout=await diagram.evaluate(element=>({
          fits:element.scrollWidth<=element.clientWidth+1,
          pageFits:document.documentElement.scrollWidth<=innerWidth,
          labelsFit:[...element.querySelectorAll('svg text')].every(text=>{
            const label=text.getBoundingClientRect();
            const svg=text.ownerSVGElement.getBoundingClientRect();
            return label.left>=svg.left&&label.right<=svg.right+1;
          })
        }));
        assert.deepEqual(layout,{fits:true,pageFits:true,labelsFit:true},data.V[q[10]].title);
        visuals.add(q[10]);
      }
      const miss=missed.has(index);
      await page.locator('.choice').nth(miss?(q[4]+1)%q[3].length:q[4]).click();
      if(miss){
        assert.equal(await page.locator('#next').count(),0);
        await page.locator('.retry').nth((q[9]+1)%q[8].length).click();
        assert.equal(await page.locator('#next').count(),0);
        await page.locator('.retry').nth(q[9]).click();
      }
      await page.locator('#next').click();
    }
    assert.equal(visuals.size,8);
    const summary=await page.locator('.card').innerText();
    assert.match(summary,/12\/17/);
    assert.match(summary,/Connect language ancestry and migration/);
    assert.match(summary,/Link a plausible action by migrants/);
    assert.deepEqual(errors,[]);
    console.log('390px touch Chromium: all eight visuals fit, recovery required, FRQ self-check and summary completed.');
  } finally {
    await browser.close();
  }
}

if(process.argv.includes('--browser')){
  mobileReview().catch(error=>{console.error(error);process.exitCode=1;});
}
