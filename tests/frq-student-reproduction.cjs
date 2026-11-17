// Expected decisions set from the rubric before running these live-discovered cases.
const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm'),cp=require('child_process');
const baseline=process.argv.includes('--baseline'),ctx={window:{}};vm.createContext(ctx);
const read=p=>baseline?cp.execFileSync('git',['show','origin/main:'+p],{encoding:'utf8'}):fs.readFileSync(p,'utf8');
vm.runInContext(read('frq-part-scoring.js'),ctx);vm.runInContext(read('frq-guided-learning.js').split('// Units 1–3 only.')[0],ctx);
const scale=['E','Explain','Explain how changing the scale of analysis from regional to local could change what a geographer sees.','A regional map shows broad links; local analysis reveals neighborhood differences in services.'];
const dtm=['F','Identify','Identify the Demographic Transition Model stage most likely associated with low birth rates and low death rates.','Stage 4.'];
const cases=[
 [scale,'Local maps show fewer details than regional ones.',false],
 [scale,'The regional map shows big transport links but the local map reveals differences in services between neighborhoods.',true],
 [dtm,'Stage four.',true],
 [dtm,'Stage four has high birth and high death rates.',false],
 [dtm,'Stage four or stage two.',false]
];
const failures=cases.filter(([p,t,want])=>ctx.window.__gradeFrqPart(p,t).earned!==want).map(([,text,want])=>({text,want}));console.log(JSON.stringify({baseline,cases:cases.length,failures}));if(!baseline)assert.deepEqual(failures,[]);
