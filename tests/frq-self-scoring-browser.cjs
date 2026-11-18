const assert = require('node:assert/strict');
const {chromium} = require('playwright');

const url = process.env.FRQ_URL || 'http://127.0.0.1:8765/';
const fixtures = [
  {
    lesson: 'Unit 4 · Devolution',
    first: 'Devolution.',
    evidence: 'Devolution, but I left out why people want local control.',
    revision: 'They want schools teaching in their own language so they push the government to let the region run schools.',
    revisedEvidence: 'own language → let the region run schools',
    transfer: 'People see managing the forest as part of who they are, so they want the provincial government to get forest decisions back.',
    transferEvidence: 'part of who they are → get forest decisions back',
    unsure: /what people want to control/,
    exampleFeedback: [/gives the motive/, /identifies a cultural difference/, /Greater unity under the central government/]
  },
  {
    lesson: 'Unit 2 · Population pyramid',
    first: 'I don’t know.',
    evidence: 'I did not cite an age group or a consequence.',
    revision: 'The 60–79 bars are wider then the kids bars. More older ppl means more demand for elder care.',
    revisedEvidence: '60–79 bars are wider then the kids bars → more demand for elder care',
    transfer: 'The big groups under 20 will need more classrooms as kids reach school age.',
    transferEvidence: 'big groups under 20 → more classrooms',
    unsure: /Which age bars support your claim/,
    exampleFeedback: [/larger older cohorts/, /This describes the source/, /labels show older people near the top/]
  }
];

async function run(browser, viewport) {
  const page = await browser.newPage({viewport});
  const errors = [], outbound = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => outbound.push([request.url(), request.postData() || ''].join(' ')));
  const pilot = page.locator('#frq-pilot');
  const click = name => pilot.getByRole('button', {name, exact:true}).click();
  const nav = name => page.getByRole('navigation').getByRole('button', {name}).click();
  const coachReady = () => page.waitForFunction(() => typeof window.openFrqSelfScore === 'function');
  await page.goto(url, {waitUntil:'load'});
  await coachReady();

  await nav(/FRQ Coach/);
  await page.locator('#guidedPrompt').selectOption('0');
  await page.locator('#mainAnswer').fill('A. Synthetic Unit One draft.');
  await page.locator('#guidedPrompt').selectOption('3');
  assert.equal(await page.locator('#mainAnswer').inputValue(), '');
  const classic = 'B. Sovereignty is when a state can govern itself.\nF. Centrifugal forces unite the state.';
  await page.locator('#mainAnswer').fill(classic);
  await page.getByRole('button', {name:/Check my answer/}).click();
  await page.locator('#feedbackArea').getByText(/Part B: 1\/1 locally verified/).waitFor();
  assert.match(await page.locator('#feedbackArea').innerText(), /A centrifugal force can pull a state apart/);
  await nav(/Start Here/);
  await page.locator('[data-student-route="frq"]').click();
  assert.equal(await page.locator('#mainAnswer').inputValue(), 'A. Synthetic Unit One draft.');
  await page.locator('#guidedPrompt').selectOption('3');
  assert.equal(await page.locator('#mainAnswer').inputValue(), classic);
  await page.reload({waitUntil:'load'});
  await coachReady();
  await nav(/FRQ Coach/);
  assert.equal(await page.locator('#mainAnswer').inputValue(), classic);
  console.log(JSON.stringify({viewport, classic, unitIsolation:true, refresh:true, differentiatedFeedback:true}));

  for(const fixture of fixtures){
    await page.getByRole('button',{name:fixture.lesson,exact:true}).click();
    const initialChart = await pilot.locator('svg').count() ? await pilot.locator('svg').innerHTML() : '';
    assert.equal(await pilot.getByText(/Compare a 1-point example/).count(),0);
    await click('I’m stuck');
    const hint = await pilot.locator('.box-info').innerText();
    const first = viewport.width<500&&initialChart ? '' : fixture.first;
    await pilot.getByLabel('Your first answer').fill(first);
    await click('Score examples');
    // Judge each independently before the site exposes its reasoning.
    const feedback=[];
    for(let index=0;index<3;index++){
      assert.equal(await pilot.getByRole('status').count(),0);
      await click(index===0?'Earns the point':'Doesn’t earn the point');
      const text = await pilot.getByRole('status').innerText();
      assert.match(text,fixture.exampleFeedback[index]);
      feedback.push(text);
      await click(index<2?'Next example':'Score my answer');
    }
    await pilot.locator('#pilot-draft-evidence').fill(fixture.evidence);
    await click('I’m unsure');
    const diagnosis=await pilot.locator('.box-info').innerText();
    assert.match(diagnosis,fixture.unsure);
    await click('0 points');
    await pilot.getByText('Self-scored practice · 0 points',{exact:true}).waitFor();
    await click('Revise my answer');
    assert.equal(await pilot.getByLabel('Your revised answer').inputValue(),first);
    await pilot.getByLabel('Your revised answer').fill(fixture.revision);
    await pilot.locator('#pilot-revision-evidence').fill(fixture.revisedEvidence);
    await click('1 point');
    await page.reload({waitUntil:'load'});
    await coachReady();
    await nav(/FRQ Coach/);
    assert.equal(await pilot.getByLabel('Your revised answer').inputValue(),fixture.revision);
    await pilot.getByText('Self-scored practice · 1 point',{exact:true}).waitFor();
    await click('Try a new question');
    assert.equal(await pilot.getByText('What earns the point',{exact:true}).count(),0);
    assert.equal(await pilot.getByText(/Compare a 1-point example/).count(),0);
    if(initialChart)assert.notEqual(await pilot.locator('svg').innerHTML(),initialChart);
    else await pilot.getByText(/communal forests/).waitFor();
    await pilot.getByLabel('Your answer to the new question').fill(fixture.transfer);
    await click('Check against the rubric');
    await pilot.locator('#pilot-transfer-evidence').fill(fixture.transferEvidence);
    await click('1 point');
    await pilot.getByText('Self-scored practice · 1 point',{exact:true}).waitFor();
    await pilot.getByText(/used a hint on the first question/).waitFor();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal overflow');
    console.log(JSON.stringify({viewport,lesson:fixture.lesson,first,hint,feedback,diagnosis,revision:fixture.revision,transfer:fixture.transfer}));
    await click('Back to FRQ Coach');
  }
  assert.deepEqual(errors,[]);
  for(const text of [...fixtures.flatMap(x=>[x.first,x.revision,x.transfer]),classic,'Synthetic Unit One draft']){
    assert.ok(outbound.every(request=>!request.includes(text)&&!request.includes(encodeURIComponent(text))), 'Draft text appeared in an outbound request');
  }
  console.log(JSON.stringify({viewport,noDraftInObservedRequests:true}));
  await page.close();
}

(async()=>{
  const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
  try {
    for(const viewport of [{width:1280,height:900},{width:390,height:844}])await run(browser,viewport);
  } finally {
    await browser.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
