// New synthetic rubric labels were assigned before scorer execution; human teacher sign-off is pending.
const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');const c={window:{}};vm.createContext(c);const s=fs.readFileSync('app.js','utf8'),a=s.indexOf('const prompts='),b=s.indexOf('\nconst ',a+10);vm.runInContext(s.slice(a,b)+';window.ps=prompts',c);vm.runInContext(fs.readFileSync('frq-part-scoring.js','utf8'),c);vm.runInContext(fs.readFileSync('frq-guided-learning.js','utf8').split('// Units 1–3 only.')[0],c);
const cases=[
[1,'A','correct','Site'],[1,'B','paraphrase','Its position relative to nearby towns and transport routes.'],[1,'C','short','River water irrigated crops, feeding the first settlers.'],[1,'D','partial','There are railroads.'],[1,'E','reversed','Regional maps show more neighborhood detail than local maps.'],[1,'E','contradiction','Local maps show neighborhood service differences, but regional maps show more detail than local maps.'],[1,'F','vocabulary','GIS income inequality overlay'],[1,'G','wrong','Add bus routes to prevent poor residents from reaching jobs.'],[1,'B','spelling','Its locaton relative to other places and roads.'],[1,'D','nonsense','Railroads make factories grow because purple bananas command them.'],
[2,'A','correct','The median age is rising.'],[2,'B','paraphrase','Children plus seniors per 100 working-age adults.'],[2,'C','short','Rising pension costs.'],[2,'D','partial','Immigration brings people.'],[2,'D','reversed','Vacant jobs cause immigrants to disappear, increasing the workforce.'],[2,'F','contradiction','Stage four, but births and deaths are both very high.'],[2,'G','vocabulary','Retirement age workforce policy'],[2,'D','wrong','Immigrants fill vacant jobs but do not increase the workforce.'],[2,'C','spelling','More money is spent on pensons and health care.'],[2,'D','nonsense','Immigrants fill vacant jobs because flying pencils turn into workers.'],
[3,'A','correct','Cultural hearth'],[3,'B','paraphrase','People moving to another place take their customs with them.'],[3,'C','short','Pizza chains adapt toppings to local religious food preferences.'],[3,'D','partial','People move.'],[3,'E','reversed','Faster cultural diffusion causes the invention of the internet.'],[3,'F','contradiction','A shared language lets people communicate, but no one can understand each other.'],[3,'G','vocabulary','Local global syncretism diffusion'],[3,'E','wrong','The internet does not spread culture faster across countries.'],[3,'D','spelling','Immigrants bring their traditons and food to their new country.'],[3,'F','nonsense','A common language allows communication because invisible potatoes control minds.']];

// Fresh holdout after the first corrections: do not tune the scorer around these.
const holdout=[
[1,'B','paraphrase','A place compared to the roads, markets and other towns around it.'],
[1,'G','short','Extend transit into underserved areas so people can reach clinics.'],
[1,'E','reversed','Local maps conceal service gaps that regional maps reveal.'],
[1,'D','wrong','Highways cause businesses to close and eliminate jobs.'],
[2,'C','short','More government spending on pensions.'],
[2,'F','correct','The fourth stage.'],
[2,'F','contradiction','Stage 4 has very high fertility.'],
[2,'D','wrong','Immigrants fill vacant jobs, which means the supply of workers falls.'],
[3,'F','paraphrase','A bridge language allows different language groups to exchange ideas.'],
[3,'D','short','Migrants carry religious beliefs to their new homes.'],
[3,'F','contradiction','A shared language allows communication, but it makes trade impossible.'],
[3,'E','nonsense','Social media spreads trends fast because magic internet goblins deliver them.']];
const positive=new Set(['correct','paraphrase','short','spelling']);
function run(bank){return bank.map(([u,l,kind,text])=>{const r=c.window.__gradeFrqPart(c.window.ps[u-1].parts.find(p=>p[0]===l),text);return {u,l,kind,text,expected:positive.has(kind)?'credit-or-review':'no-verified-credit',earned:r.earned,status:r.status};});}
const initial=run(cases),unseen=run(holdout),all=[...initial,...unseen];
const summary=rows=>({total:rows.length,correct:rows.filter(x=>positive.has(x.kind)).length,verifiedCorrect:rows.filter(x=>positive.has(x.kind)&&x.earned).length,correctForReview:rows.filter(x=>positive.has(x.kind)&&!x.earned&&x.status==='unverified').length,negative:rows.filter(x=>!positive.has(x.kind)).length,falseVerified:rows.filter(x=>!positive.has(x.kind)&&x.earned)});
const result={initial:summary(initial),holdout:summary(unseen),responses:all};console.log(JSON.stringify(result,null,2));
if(process.argv.includes('--save'))fs.writeFileSync('docs/PILOT_SCORING_RESULTS.json',JSON.stringify(result,null,2)+'\n');
if(!process.argv.includes('--diagnostic')){
 assert.deepEqual([...result.initial.falseVerified,...result.holdout.falseVerified],[],'Zero false verified points required for release');
 assert.ok(all.filter(x=>positive.has(x.kind)).every(x=>x.earned||x.status==='unverified'),'Correct responses must earn credit or remain reviewable');
}
