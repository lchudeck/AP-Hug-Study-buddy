const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
// Original synthetic responses, not College Board exam responses. Each row tests
// a defensible answer, partial answer, vague answer, error, and flawed reasoning.
const cases=[
 ['aging indicator','Identify','Identify one demographic indicator that shows an aging population.',
  'Rising median age.','Median age.','Demographics are changing.','A falling median age.','A low elderly dependency ratio means more elderly people per worker.'],
 ['dependency definition','Define','Define dependency ratio.',
  'Dependents compared with the working-age population.','The number of dependents.','It compares people.','It means the birth rate.','Working-age people divided by children and elderly dependents.'],
 ['aging economy','Describe','Describe one economic challenge caused by an aging population.',
  'Higher pension spending.','Pensions.','The economy changes.','Pension costs decrease because more retirees receive benefits.','An aging population reduces pension costs by increasing the number of retirees.'],
 ['immigration workforce','Explain','Explain how immigration could help address a shrinking workforce.',
  'Working-age immigrants fill vacant jobs, expanding the labor pool.','Immigration helps the workforce.','People make things better.','Immigration shrinks the workforce because no newcomers can work.','Immigration does not increase the workforce because migrants cannot fill jobs.'],
 ['immigration challenge','Explain','Explain one possible social or political challenge connected to increased immigration.',
  'Housing demand outpaces construction, raising rents and opposition to immigration.','Immigration creates political tension.','Immigrants change things.','Immigration never affects housing or services.','Immigration creates political tension because immigrants are different.'],
 ['DTM stage','Identify','Identify the Demographic Transition Model stage most likely associated with low birth rates and low death rates.',
  'Stage 4.','A later stage.','Development.','Stage 1.','Stage 4 has high birth rates and high death rates.'],
 ['aging policy','Explain','Explain one policy a government could use to respond to an aging population.',
  'Raise the retirement age to keep adults employed longer.','Raise the retirement age.','Adopt a population policy.','Ban all immigration to fill labor shortages.','Pronatalist policies increase the workforce immediately because newborn babies fill vacant jobs.'],
 ['DTM model','Identify','Identify the demographic model that best explains the country’s population change.',
  'DTM.','A transition.','A population model.','Malthusian theory.','The Demographic Transition Model shows Stage 4 because births remain high and deaths fall.'],
 ['pyramid','Describe','Describe one population pattern likely shown by this country’s population pyramid.',
  'A wide base with many children.','A population pyramid.','The ages look different.','A narrow base and aging population.','A wide base shows low birth rates.'],
 ['urban capacity','Explain','Explain one challenge this country may face because of rapid urban growth.',
  'Migrants arrive faster than governments can provide housing and infrastructure.','Infrastructure is strained.','Growth changes things.','Urban growth eliminates all housing shortages.','Rapid urban growth reduces housing demand because more migrants arrive.'],
 ['migration cause','Explain','Explain one reason rural residents may migrate to cities.',
  'Cities offer more jobs and better schools than rural areas.','Jobs.','They want change.','People leave cities for rural areas because urban jobs attract them.','Drought in cities is a rural push factor because it offers more jobs.'],
 ['youth dependency','Describe','Describe one likely effect of a high youth dependency ratio.',
  'Higher demand for schools and child health care.','Children.','The country changes.','Less demand for schools.','Higher demand for pensions because most young dependents are retirees.'],
 ['women and fertility','Explain','Explain how increased educational opportunities for women may affect fertility rates.',
  'Education can delay childbirth, leading to fewer births per woman.','Fertility can fall.','Education changes population.','Schooling makes women infertile.','Education always lowers fertility because all women stop having children.'],
 ['settlement','Explain','Explain one way rapid rural-to-urban migration may change the country’s settlement pattern.',
  'Migrants concentrate in cities, increasing urbanization and the size of cities.','Urbanization increases.','People change places.','Cities shrink because migrants move into them.','Migrants concentrate in cities, reducing urbanization and city size.'],
 ['pull drill','Identify','Identify one pull factor for migration.',
  'Higher wages.','Migration factors.','A better place.','Unemployment.','War at the origin attracts migrants to that origin.'],
 ['dependency drill','Explain','Explain one consequence of a high dependency ratio.',
  'More retirees increase pension costs, leaving fewer workers supporting benefits.','Pension costs.','The economy changes.','Dependents lower pension costs because more people retire.','More dependents reduce the tax burden because fewer workers support them.']
];
function scorer(file){const context={window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync(file,'utf8'),context);return context.window.__gradeFrqPart;}
function run(grade){
 let failures=[];
 for(const [name,verb,prompt,...answers] of cases){
  const part=['A',verb,prompt,answers[0]];
  answers.forEach((answer,i)=>{
   const result=grade(part,answer),expected=i===0;
   if(result.earned!==expected)failures.push({name,type:['correct','partial','vague','incorrect','flawed reasoning'][i],answer,expected,actual:result.earned});
   if(!result.earned&&result.reviewLabel)assert.match(result.feedback,/model|teacher/);
  });
 }
 return failures;
}
if(require.main===module){
 const grade=scorer(process.env.FRQ_SCORER||require.resolve('../frq-part-scoring.js'));
 const failures=run(grade);
 if(process.env.FRQ_BASELINE){console.log(JSON.stringify({responses:cases.length*5,failures},null,2));process.exit(0);}
 assert.deepEqual(failures,[]);
 const alternate=[
  [0,'A growing share of people aged 65 and older.'],
  [1,'Dependency ratio is dependents divided by working-age people times 100.'],
  [2,'Labor shortages.'],
  [3,'Working-age migrants expand the available labor force and fill vacant jobs.'],
  [4,'Some residents worry about cultural change and oppose immigration.'],
  [5,'Stage 5 in the five-stage model.'],
  [6,'Encourage immigration so newcomers fill vacant jobs.'],
  [6,'Childcare support reduces the cost of raising children and may encourage more births.'],
  [6,'Invest in automation to produce more with fewer workers.'],
  [9,'Urban growth increases demand for housing and public services.'],
  [10,'Rural drought pushes farmers to seek work in cities.'],
  [12,'Fertility may decline because education expands employment choices.'],
  [13,'Cities grow because migrants arrive from rural regions.'],
  [14,'Family reunification.'],
  [14,'Jobs.'],
  [14,'Employment opportunities.'],
  [14,'Safety.'],
  [15,'Fewer workers must support more dependents, increasing the tax burden.']
 ];
 for(const [i,text]of alternate){const [,verb,prompt,model]=cases[i];assert.equal(grade(['A',verb,prompt,model],text).earned,true,text);}
 // Neither negation nor a correct phrase followed by a conflicting claim earns a point.
 for(const [i,text]of [[0,'Low fertility does not show aging.'],[2,'Higher pension costs. Pension costs decrease with aging.'],[5,'Stage 4 is wrong; Stage 1.'],[3,'Migrants fill jobs but do not increase the workforce.']]){
  const [,verb,prompt,model]=cases[i];assert.equal(grade(['A',verb,prompt,model],text).earned,false,text);
 }
 console.log(`Unit 2 FRQ accuracy passed: ${cases.length*5} five-level responses, ${alternate.length} valid alternatives and 4 contradiction checks.`);
}
module.exports={cases,run,scorer};
