const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const {M,H}=require('./frq-guided-bank.cjs');
const context={window:{}};vm.createContext(context);
const baseline=process.argv.includes('--baseline');
let source=baseline?require('child_process').execFileSync('git',['show','origin/main:app.js'],{encoding:'utf8'}):fs.readFileSync('app.js','utf8');const start=source.indexOf('const prompts=');const end=source.indexOf('\nconst ',start+10); // prompts are followed by another const
vm.runInContext(source.slice(start,end)+'\nwindow.prompts=prompts;',context);
const prompts=context.window.prompts;
vm.runInContext(baseline?require('child_process').execFileSync('git',['show','origin/main:frq-part-scoring.js'],{encoding:'utf8'}):fs.readFileSync('frq-part-scoring.js','utf8'),context);
if(!baseline)vm.runInContext(fs.readFileSync('frq-guided-learning.js','utf8').split('// Units 1–3 only.')[0],context);
let correct=0,wrong=0,fp=[],miss=[],n=0;
for(const u of [1,2,3])for(const p of prompts[u-1].parts){
 const values=[M[u][p[0]][0],H[u][p[0]][0],p[3]];
 for(const text of values){n++;const r=context.window.__gradeFrqPart(p,text);if(r.earned)correct++;else miss.push({u,part:p[0],text});}
 for(const text of [...M[u][p[0]].slice(1),H[u][p[0]][1],'Pizza unicorns dance on the moon.']){wrong++;if(context.window.__gradeFrqPart(p,text).earned)fp.push({u,part:p[0],text});}
}
console.log(JSON.stringify({baseline,correct,totalCorrect:n,correctPct:100*correct/n,incorrectCases:wrong,falseCredit:fp,miss},null,2));
if(!baseline){assert.deepEqual(fp,[]);assert.ok(correct/n>=.95,'95% supported correct recognition');}
