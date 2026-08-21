// PR #9 v4: deepen authentic-source clusters and add AP-style stimulus FRQ practice.
(function(){
 if(window.__stimulusClustersFrqV4)return; window.__stimulusClustersFrqV4=true;
 const sets=window.APHG_AUTHENTIC_STIMULUS_SETS||[];
 const byId=id=>sets.find(s=>s.id===id);
 const extra={
  'u1-census-scale':[
   ['Which conclusion would be most defensible when a pattern changes from the state scale to the city scale?',['The relationship is scale-dependent and should be tested at multiple geographic levels','The city data must be wrong','The state pattern automatically causes the city pattern','Scale never affects geographic conclusions'],'The relationship is scale-dependent and should be tested at multiple geographic levels','A pattern that changes with geographic scale should be interpreted with explicit attention to aggregation and scale.','reasoning','scale-aggregation'],
   ['Which additional dataset would best help explain a local population pattern visible in Seattle?',['Neighborhood housing, transit, and demographic data','A world political map only','A list of national capitals','Only Washington State total population'],'Neighborhood housing, transit, and demographic data','Local explanatory variables should be measured at a scale that can reveal neighborhood-level relationships.','data','scale-choice']
  ],
  'u2-world-pop':[
   ['Which population is more likely to experience population momentum if fertility recently declines?',['The high-growth population with many young people','The aging population only because it has more elderly people','Neither population can experience momentum','Only a population with zero births'],'The high-growth population with many young people','A large cohort entering reproductive ages can sustain growth even after fertility falls.','data','pyramid-dtm'],
   ['Which comparison best uses the source rather than outside knowledge?',['The high-growth profile has a larger youth share, while the aging profile has a larger elderly share','The high-growth population must be located in Africa','The aging population must be a wealthy island state','Both populations have identical fertility rates'],'The high-growth profile has a larger youth share, while the aging profile has a larger elderly share','Strong source analysis begins with what the stimulus directly shows before making broader inferences.','source','source-vs-assumption']
  ],
  'u3-language':[
   ['Which geographic process is most likely to create both language convergence and persistence at the same time?',['Global communication spreading a lingua franca while local communities maintain regional languages','Complete isolation of all regions','No migration or media contact','A decline in transportation technology'],'Global communication spreading a lingua franca while local communities maintain regional languages','Globalization can increase shared language use while local identities and languages persist.','source','globalization-uniformity'],
   ['Which evidence would best test whether a minority language is becoming less spatially widespread?',['Language-use data mapped by region across multiple years','One photograph of a city','A national GDP value','A climate classification map'],'Language-use data mapped by region across multiple years','Repeated spatial language data can show geographic contraction or persistence over time.','data','language-evidence']
  ],
  'u4-refugees':[
   ['Which scale-of-analysis issue is most important when interpreting a global displacement total?',['A global total can hide major regional and country differences','Global totals automatically reveal neighborhood causes','Global data eliminate political context','Scale matters only for physical geography'],'A global total can hide major regional and country differences','Aggregated displacement totals can conceal where displacement is concentrated and why.','scale','scale-aggregation'],
   ['Which political-geography factor could help explain forced displacement without being a migration pull factor?',['Armed conflict and contested state authority','Higher destination wages','A university scholarship abroad','Lower airfare'],'Armed conflict and contested state authority','Conflict, state weakness, and territorial disputes can push populations from their homes.','reasoning','push-pull']
  ],
  'u5-agriculture':[
   ['Which additional variable would best help compare the environmental effects of Systems A and B?',['Water, fertilizer, and energy use per unit of output','Country flag colors','Distance from the equator only','Number of national holidays'],'Water, fertilizer, and energy use per unit of output','Environmental comparison requires resource-input and output data, not only labels such as intensive or extensive.','data','intensive-sustainable'],
   ['A student claims intensive agriculture is always less sustainable. What is the strongest correction?',['Sustainability depends on the type and efficiency of inputs, environmental effects, and output—not intensity alone','Intensive agriculture never uses water','Extensive agriculture always has zero environmental impact','Sustainability is unrelated to agriculture'],'Sustainability depends on the type and efficiency of inputs, environmental effects, and output—not intensity alone','Intensity describes input per land area; sustainability requires evaluating consequences and resource use.','reasoning','intensive-sustainable']
  ],
  'u6-urban':[
   ['Which inference is supported by the long-term urbanization trend but not guaranteed for every place?',['Demand for urban housing and infrastructure is likely to grow globally','Every country will be 68% urban in 2050','Rural settlements will disappear','All cities will grow at the same rate'],'Demand for urban housing and infrastructure is likely to grow globally','A rising global urban share supports broad planning implications, but national and local outcomes vary.','reasoning','global-local'],
   ['Which dataset would best help distinguish urbanization from suburban sprawl?',['Built-up land change, population density, and metropolitan boundary data','A single national birth rate','Only city names','A language-family map'],'Built-up land change, population density, and metropolitan boundary data','Sprawl concerns low-density outward land development, which requires spatial land-use and density evidence.','data','urbanization-sprawl']
  ],
  'u7-hdi':[
   ['Which limitation remains even when HDI is used instead of GDP per capita?',['National averages can hide regional, gender, or class inequality','HDI contains no social measures','HDI directly measures every environmental condition','HDI cannot compare countries'],'National averages can hide regional, gender, or class inequality','A multidimensional national index is useful but can still conceal internal disparities.','scale','average-inequality'],
   ['Which additional indicator would most directly help evaluate gender differences in development?',['A gender inequality or gender development measure','Agricultural density only','Map projection type','Crude death rate alone'],'A gender inequality or gender development measure','Gender-specific indicators reveal disparities hidden by national averages.','data','gdp-hdi']
  ]
 };
 const added=[];
 sets.forEach(s=>{
   const more=extra[s.id]||[];
   more.forEach((q,i)=>{
    const item={id:`authv4-${s.id}-${i+1}`,unit:s.unit,topic:s.topic,prompt:q[0],choices:q[1],answer:q[2],explain:q[3],skill:q[4],misconception:q[5],difficulty:3,stimulus:s.stimulus,stimulusTitle:s.title,setId:s.id,setIndex:(s.qs||[]).length+i,setSize:(s.qs||[]).length+more.length,authentic:true,sourceBased:true,cluster:true};
    added.push(item);
   });
 });
 window.APHG_AUTHENTIC_CLUSTER_QUESTIONS=added;
 if(typeof quiz!=='undefined'){
   const seen=new Set(quiz.map(q=>q[1]));
   added.forEach(x=>{if(seen.has(x.prompt))return; const q=Object.assign(['Unit '+x.unit,x.prompt,x.choices,x.answer,x.explain],{topic:x.topic,skill:x.skill,difficulty:x.difficulty,misconception:x.misconception,stimulus:x.stimulus,stimulusTitle:x.stimulusTitle,authentic:true,sourceBased:true,cluster:true,setId:x.setId});quiz.push(q);seen.add(x.prompt);});
 }

 const frqs=[
  {id:'frq-u2-pop',title:'Population Structure & Policy',unit:2,topics:['2.3','2.5','2.9'],sources:[byId('u2-world-pop')],parts:[
   ['A','Identify','which profile shows the greater youth dependency burden.','high-growth population'],
   ['B','Describe','one visible difference in age structure between the two profiles.','youth share or elderly share'],
   ['C','Explain','how the high-growth age structure can create population momentum.','large young cohort entering reproductive ages'],
   ['D','Explain','one economic challenge associated with the aging profile.','pensions health care labor shortage dependency'],
   ['E','Explain','one policy a government might use to respond to population aging.','pronatalist immigration retirement age childcare'],
   ['F','Explain','why age structure alone cannot determine a country’s exact DTM stage.','DTM uses birth and death rates and development pattern'],
   ['G','Evaluate','one limitation of using a national age profile to plan local services.','national average hides local or regional variation'] ]},
  {id:'frq-u6-urban',title:'Urbanization, Scale & Planning',unit:6,topics:['6.1','6.8','6.9','1.6'],sources:[byId('u6-urban'),byId('u1-census-scale')],parts:[
   ['A','Identify','the long-term global trend shown in Source 1.','increasing urban share'],
   ['B','Describe','one way Source 2 illustrates scale of analysis.','nested national state county city scales'],
   ['C','Explain','why global urbanization can increase demand for infrastructure.','more urban residents require housing transit water services'],
   ['D','Explain','why a national or global average can hide neighborhood inequality.','aggregation conceals local variation'],
   ['E','Explain','one way a city could use GIS to respond to rapid urban growth.','overlay population transit housing services hazards'],
   ['F','Explain','one policy that could reduce low-density outward sprawl.','urban growth boundary infill transit-oriented development'],
   ['G','Evaluate','one limitation of using only global urbanization data to make a local planning decision.','local conditions differ from global aggregate'] ]},
  {id:'frq-u7-dev',title:'Development Indicators & Inequality',unit:7,topics:['7.2','7.3','7.4'],sources:[byId('u7-hdi')],parts:[
   ['A','Identify','one social dimension of development represented in the source.','health education gender inequality'],
   ['B','Describe','how HDI differs from GDP per capita.','combines income health education'],
   ['C','Explain','why two countries with similar GDP per capita can have different development outcomes.','health education inequality distribution differ'],
   ['D','Explain','one way women’s education can affect development.','fertility labor participation income health empowerment'],
   ['E','Explain','why a national development average can hide spatial inequality.','regional differences are aggregated'],
   ['F','Explain','one reason a government might use several indicators instead of GDP alone.','multidimensional development'],
   ['G','Evaluate','one limitation of a composite index such as HDI.','weights averages data quality internal inequality omitted dimensions'] ]},
  {id:'frq-u4-culture',title:'Displacement, Culture & Political Geography',unit:4,topics:['4.8','3.7','3.6'],sources:[byId('u4-refugees'),byId('u3-language')],parts:[
   ['A','Identify','the displacement category that remains within a country’s borders.','internally displaced people'],
   ['B','Describe','one difference between refugees and internally displaced people.','international border crossing'],
   ['C','Explain','how conflict can create a migration push factor.','violence insecurity state failure'],
   ['D','Explain','one way forced migration can contribute to cultural diffusion.','migrants carry language religion customs'],
   ['E','Explain','one way globalization can affect language diversity.','lingua franca spread or minority language decline'],
   ['F','Explain','how political boundaries can shape the legal status of displaced populations.','crossing state border changes refugee or asylum status'],
   ['G','Evaluate','one limitation of a global displacement total for explaining a specific conflict.','aggregate hides place-specific causes scale context'] ]}
 ].filter(f=>f.sources.every(Boolean));
 window.APHG_STIMULUS_FRQ_SETS=frqs;
 let state={index:0,answers:{},feedback:null};
 const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function current(){return frqs[state.index%frqs.length];}
 function sourceHtml(f){return f.sources.map((s,i)=>`<div class="box-info" style="margin:12px 0"><b>Source ${i+1}: ${esc(s.title)}</b>${s.stimulus}</div>`).join('');}
 function evaluatePart(part,text){const verb=part[1],t=(text||'').trim().toLowerCase(),words=t.split(/\s+/).filter(Boolean).length,keys=part[3].toLowerCase().split(/\s+/).filter(x=>x.length>3),hit=keys.some(k=>t.includes(k)),reason=verb==='Explain'||verb==='Evaluate'?/(because|therefore|as a result|leads to|due to|which causes|so that)/.test(t):true;const min=verb==='Identify'?2:verb==='Describe'?8:14;return {ok:words>=min&&hit&&reason,words,hit,reason};}
 window.stimFrqInput=(letter,v)=>{state.answers[letter]=v;};
 window.stimFrqCheck=()=>{const f=current();state.feedback={};f.parts.forEach(p=>state.feedback[p[0]]=evaluatePart(p,state.answers[p[0]]));render();};
 window.stimFrqNext=()=>{state={index:(state.index+1)%frqs.length,answers:{},feedback:null};render();};
 window.openStimulusFrqLab=()=>{if(typeof masteryView!=='undefined'){masteryView='stimulus-frq-lab';state={index:0,answers:{},feedback:null};go('mastery');}};
 function page(){const f=current();return `<main><section class="card"><div class="mastery-mini-nav"><button class="btn-secondary btn-sm" onclick="masteryView='dashboard';render()">← Mastery Dashboard</button></div><h2>📊 Stimulus FRQ Lab</h2><p>Practice using source evidence first, then AP Human Geography concepts. These are coaching checks, not official College Board scores.</p><div class="box-yellow"><b>${esc(f.title)}</b><p>Topics: ${f.topics.join(', ')} · ${f.sources.length} source${f.sources.length===1?'':'s'} · 7 parts</p></div>${sourceHtml(f)}${f.parts.map(p=>{const fb=state.feedback&&state.feedback[p[0]];return `<div style="margin:16px 0"><b>${p[0]}. ${p[1]}:</b> ${esc(p[2])}<textarea class="answer-textarea" style="min-height:95px" oninput="stimFrqInput('${p[0]}',this.value)" placeholder="Write a focused AP-style response...">${esc(state.answers[p[0]]||'')}</textarea>${fb?`<div class="${fb.ok?'box-good':'box-yellow'}" style="margin-top:8px"><b>${fb.ok?'Coaching check passed ✓':'Revise this part'}</b><p>${fb.hit?'✅':'⬜'} Relevant concept/evidence · ${fb.reason?'✅':'⬜'} ${p[1]==='Explain'||p[1]==='Evaluate'?'Reasoning link':'Task completed'} · ${fb.words} words</p></div>`:''}</div>`}).join('')}<div class="mastery-actions"><button class="btn-primary" onclick="stimFrqCheck()">Check all 7 parts</button><button class="btn-secondary" onclick="stimFrqNext()">Next stimulus FRQ</button></div></section></main>`;}
 if(typeof apMasteryPage==='function'){
   const old=apMasteryPage;
   apMasteryPage=function(){if(typeof masteryView!=='undefined'&&masteryView==='stimulus-frq-lab')return page();let html=old();if(typeof masteryView!=='undefined'&&masteryView==='dashboard'){const card=`<section class="card" style="margin-top:16px"><h2>📊 AP Stimulus FRQ Lab</h2><p>Practice 7-part FRQs with one or two authentic-source stimuli. Use evidence, then explain the geographic process.</p><button class="btn-secondary" onclick="openStimulusFrqLab()">Open Stimulus FRQ Lab</button></section>`;html=html.replace('</main>',card+'</main>');}return html;};
 }
})();