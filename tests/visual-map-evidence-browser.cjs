const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const cases = [
  {
    bank: /More Units 1–2 visual practice/,
    mcq: 'Unit 1: Map Type Interpretation',
    frq: 'Unit 1: Visual Map Analysis',
    map: /U\.S\. states shaded by resident population/,
    frqMap: /U\.S\. state population shown by circle area/,
    source: /2020 Decennial Census/,
    wrong: [/Montana and Oregon/, /more residents per square mile/, /scales every state/],
    feedback: [/Match the shading/, /divide each count by its land area/, /Compare Montana/],
    overclaim: 'California and Texas have larger circles because they are more densely populated.',
    criterion: /Density requires the resident count divided by land area/,
  },
  {
    bank: /Units 3–7 visual practice/,
    mcq: 'Unit 3: Cultural Diffusion',
    frq: 'Unit 3: Language Diffusion Map',
    map: /Canadian provinces and territories shaded/,
    source: /Statistics Canada, 2021/,
    wrong: [/Most bilingual people in Ontario moved/],
    feedback: [/Match QC, NB, and ON to the legend/],
    overclaim: 'Quebec and New Brunswick have higher rates, proving French spread from Quebec to Ontario.',
    criterion: /Historical settlement records or migration data/,
  },
  {
    bank: /Units 3–7 visual practice/,
    mcq: 'Unit 4: Electoral Geography',
    frq: 'Unit 4: District Boundary Analysis',
    map: /Washington congressional district boundaries/,
    source: /2024 Cartographic Boundary Files/,
    wrong: [/the map proves that voters were packed/i],
    feedback: [/Find the labels 4 and 7/],
    overclaim: 'District 4 covers more area than district 7, so the map proves voters were packed.',
    criterion: /Compare precinct-level voting results with district boundaries/,
  },
];

async function verifyMap(page, alt, source) {
  const image = page.getByRole('img', { name: alt });
  await image.waitFor();
  assert.ok(await image.evaluate(async el => { await el.decode(); return el.naturalWidth > 0; }));
  await page.getByRole('link', { name: source }).waitFor();
  await page.getByRole('button', { name: 'Enlarge visual', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('img', { name: alt }).waitFor();
  await dialog.getByRole('link', { name: source }).waitFor();
  await dialog.getByRole('button', { name: 'Close enlarged visual' }).click();
  assert.equal(await dialog.count(), 0);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
  });
  try {
    for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport });
      page.setDefaultTimeout(12000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto('http://127.0.0.1:8765/', { waitUntil: 'load' });
      for (const activity of cases) {
        await page.locator('#nav').getByRole('button', { name: /Maps & Visuals/ }).click();
        await page.getByRole('button', { name: activity.bank }).click();
        await page.locator('#app select').selectOption({ label: activity.mcq });
        // The Unit 1 question order is shuffled. Match each visible distractor to its feedback.
        const remaining = new Set(activity.wrong.keys());
        while (remaining.size) {
          const buttons = page.locator('.quiz-option');
          const choices = await buttons.allTextContents();
          const index = [...remaining].find(i => choices.some(choice => activity.wrong[i].test(choice)));
          assert.notEqual(index, undefined, 'Expected a known distractor');
          await verifyMap(page, activity.map, activity.source);
          await buttons.filter({ hasText: activity.wrong[index] }).click();
          await page.locator('.box-warn').getByText(activity.feedback[index]).waitFor();
          remaining.delete(index);
          if (remaining.size) await page.getByRole('button', { name: /Next visual question/ }).click();
        }
        await page.getByRole('button', { name: 'Visual FRQ', exact: true }).click();
        await page.locator('#app select').selectOption({ label: activity.frq });
        await verifyMap(page, activity.frqMap || activity.map, activity.source);
        await page.getByPlaceholder(/Write part B/).fill(activity.overclaim);
        await page.getByRole('button', { name: 'Show model points' }).click();
        await page.getByText(activity.criterion).waitFor();
        assert.equal(await page.getByPlaceholder(/Write part B/).inputValue(), activity.overclaim);
        console.log(JSON.stringify({ viewport, mcq: activity.mcq, frq: activity.frq, mapLoaded: true, enlargement: true, incorrectAnswersChecked: activity.wrong.length, overclaim: activity.overclaim, modelAddressesEvidence: true }));
      }
      assert.deepEqual(errors, []);
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
