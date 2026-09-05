// Unit 1 personalized rescue coach: miss -> diagnose -> Teach Me -> example -> new check -> mastery -> next step.
(function(){
  if(window.__personalizedUnit1CoachInstalled)return;
  window.__personalizedUnit1CoachInstalled=true;

  const STORE='aphgPersonalCoachV1';
  const ADAPTIVE='aphgAdaptiveCoachV2';
  const DAY=86400000;
  const topicNames={
    '1.1':'Introduction to Maps','1.2':'Geographic Data','1.3':'The Power of Geographic Data',
    '1.4':'Spatial Concepts','1.5':'Human–Environmental Interaction','1.6':'Scales of Analysis','1.7':'Regional Analysis'
  };
  const lessons={
    '1.1':{
      title:'Read the map before you answer it',
      teach:'Start with the title, legend, units, and what is actually being mapped. Reference maps help locate places. Thematic maps show a pattern or variable, such as income, population, or disease rates.',
      example:'If counties are shaded from light to dark by median income, the map is a choropleth map because areas are shaded according to a value.',
      checks:[
        {q:'A map uses one dot to represent 1,000 people. What kind of thematic map is it?',choices:['Dot-density map','Reference map','Isoline map','Cartogram'],a:'Dot-density map',why:'Dot-density maps use dots to represent a specified quantity and reveal spatial concentration.'},
        {q:'A map is designed mainly to show highways, rivers, cities, and boundaries. What is its primary purpose?',choices:['Locate features','Show a rate by area','Resize places by value','Connect equal values'],a:'Locate features',why:'A reference map emphasizes locations and geographic features rather than one statistical pattern.'}
      ]
    },
    '1.2':{
      title:'Know where geographic data come from',
      teach:'Geographers collect quantitative and qualitative data. Remote sensing gathers information from a distance, often by satellites or aircraft. Field observations, surveys, interviews, censuses, and imagery each reveal different evidence and each has limitations.',
      example:'Satellite imagery of vegetation is remotely sensed data. Interviews with farmers are qualitative data. Using both can reveal patterns and lived experience.',
      checks:[
        {q:'A geographer analyzes satellite images to measure urban growth over 20 years. Which data method is most directly being used?',choices:['Remote sensing','Participant observation only','Census enumeration only','Mental mapping'],a:'Remote sensing',why:'Satellite imagery is collected from a distance, which is remote sensing.'},
        {q:'Why might a geographer combine census data with resident interviews?',choices:['To compare numerical patterns with lived experience','To guarantee both sources are unbiased','To remove the need to consider scale','To make all evidence quantitative'],a:'To compare numerical patterns with lived experience',why:'Quantitative and qualitative evidence can complement one another and reveal different parts of a geographic question.'}
      ]
    },
    '1.3':{
      title:'GIS layers evidence to answer geographic questions',
      teach:'A Geographic Information System stores, layers, analyzes, and maps spatial data. GIS is not the same thing as remote sensing: remote sensing collects data from a distance; GIS can combine that imagery with roads, income, land use, hazards, or other layers.',
      example:'To study food access, a geographer could layer grocery locations, transit routes, population, and income in GIS to identify underserved neighborhoods.',
      checks:[
        {q:'Which tool is best for layering flood zones, roads, and population data to identify neighborhoods at greatest risk?',choices:['GIS','A single reference map only','A population pyramid','The Demographic Transition Model'],a:'GIS',why:'GIS is designed to combine and analyze multiple spatial data layers.'},
        {q:'Which statement correctly distinguishes GIS from remote sensing?',choices:['GIS analyzes layered spatial data; remote sensing collects data from a distance','GIS only collects satellite images; remote sensing only makes maps','They are identical tools','Remote sensing cannot produce geographic data'],a:'GIS analyzes layered spatial data; remote sensing collects data from a distance',why:'Remote sensing is a data-collection method; GIS is a system for storing, layering, and analyzing geographic data.'}
      ]
    },
    '1.4':{
      title:'Think in spatial relationships',
      teach:'Spatial concepts explain how places are arranged and connected. Site is the physical character of a place. Situation is its location relative to other places. Distance decay means interaction usually decreases as distance increases. Time-space compression means technology or transportation can reduce the effective friction of distance.',
      example:'A port city has a coastal site. Its situation may include access to shipping routes and nearby markets. Faster transportation can make distant markets effectively closer.',
      checks:[
        {q:'A city grows because it sits at the intersection of major rail and highway routes linking several markets. Which concept is most directly described?',choices:['Situation','Site','Possibilism','Formal region'],a:'Situation',why:'Situation describes a place relative to other places and the connections between them.'},
        {q:'People shop at a nearby grocery store more frequently than one 80 miles away. Which concept best fits?',choices:['Distance decay','Sequent occupance','Scale of analysis','Environmental determinism'],a:'Distance decay',why:'Interaction generally decreases with increasing distance, although technology can weaken the effect.'}
      ]
    },
    '1.5':{
      title:'Environment creates constraints, not a single destiny',
      teach:'Possibilism emphasizes that the environment creates opportunities and constraints, while people use culture and technology to make choices. Environmental determinism claims the physical environment determines human behavior; AP Human Geography treats that deterministic view as historically important but overly simplistic.',
      example:'Farmers using irrigation and drought-resistant crops in a dry region demonstrate possibilism because technology expands what people can do within environmental limits.',
      checks:[
        {q:'A desert city imports water, uses air conditioning, and builds solar infrastructure. Which perspective best explains this adaptation?',choices:['Possibilism','Environmental determinism','Distance decay','Central place theory'],a:'Possibilism',why:'People are adapting to environmental constraints through technology and choices.'},
        {q:'Which statement best reflects possibilism?',choices:['The environment limits choices, but people can adapt through culture and technology','Climate alone determines a society’s development','Human choices are unrelated to the environment','Every environment produces the same cultural response'],a:'The environment limits choices, but people can adapt through culture and technology',why:'Possibilism recognizes constraints while emphasizing human agency and adaptation.'}
      ]
    },
    '1.6':{
      title:'Scale of analysis changes the pattern you can see',
      teach:'Do not confuse map scale with scale of analysis. Map scale concerns the relationship between distance on a map and distance on Earth. Scale of analysis is the geographic level at which data are studied, such as local, regional, national, or global. Aggregating data at a broad scale can hide local differences.',
      example:'A country may have a high national internet-access rate, while neighborhood-scale data reveal clusters with very low access. Changing the scale of analysis changes what variation is visible.',
      checks:[
        {q:'National unemployment is low, but several neighborhoods in one city have very high unemployment. What best explains why the patterns differ?',choices:['Scale of analysis','Map projection','Environmental determinism','Relocation diffusion'],a:'Scale of analysis',why:'National aggregation can conceal local variation that appears at the neighborhood scale.'},
        {q:'Which statement correctly distinguishes map scale from scale of analysis?',choices:['Map scale relates map distance to Earth distance; scale of analysis is the geographic level of the data','They are two names for the same concept','Map scale means local versus national data; scale of analysis means large-scale versus small-scale maps','Scale of analysis applies only to physical geography'],a:'Map scale relates map distance to Earth distance; scale of analysis is the geographic level of the data',why:'The two ideas are related to scale but answer different questions: map representation versus level of analysis.'}
      ]
    },
    '1.7':{
      title:'Regions are defined in different ways',
      teach:'A formal region has a shared measurable trait. A functional region is organized around a node and the flows connected to it. A perceptual region exists through people’s shared ideas or sense of place and may have fuzzy boundaries.',
      example:'A transit system centered on downtown forms a functional region. A state is often treated as a formal political region. “The South” can be a perceptual region because its boundaries depend partly on people’s perceptions.',
      checks:[
        {q:'A metropolitan commuter-rail network is centered on a downtown terminal and surrounding stations. Which type of region is it?',choices:['Functional region','Formal region','Perceptual region','Culture hearth'],a:'Functional region',why:'A functional region is organized around a node and the flows connected to it.'},
        {q:'People disagree about exactly where “the Midwest” begins and ends, but commonly recognize it as a region. Which type is this?',choices:['Perceptual region','Functional region','Formal region','Isoline region'],a:'Perceptual region',why:'Perceptual regions are based on shared ideas and can have imprecise boundaries.'}
      ]
    }
  };

  function load(){try{return JSON.parse(localStorage.getItem(STORE)||'{"topics":{},"diagnoses":{},"history":[]}')}catch(e){return {topics:{},diagnoses:{},history:[]}}}
  function save(s){localStorage.setItem(STORE,JSON.stringify(s));}
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function currentQuestion(){try{const qs=getQuizSet();return qs[qIndex%qs.length]}catch(e){return null}}
  function unitOf(q){return Number(q?.unit||String(q?.[0]||'').match(/\d+/)?.[0]||0)}
  function textOf(q){return `${q?.prompt||q?.q||q?.[1]||''} ${(q?.choices||q?.[2]||[]).join(' ')} ${q?.answer||q?.[3]||''}`;}
  function topicOf(q){
    if(q?.topic&&/^1\.[1-7]$/.test(String(q.topic)))return String(q.topic);
    try{const t=window.APHGTopicSkillMastery?.topicFromQuestion?.(q);if(/^1\.[1-7]$/.test(String(t)))return String(t)}catch(e){}
    const t=textOf(q);
    if(/scale of analysis|local scale|regional scale|national scale|aggregation/i.test(t))return '1.6';
    if(/formal region|functional region|perceptual region/i.test(t))return '1.7';
    if(/possibil|determin/i.test(t))return '1.5';
    if(/site|situation|distance decay|time-space compression|spatial interaction/i.test(t))return '1.4';
    if(/\bgis\b|geographic information system|layer/i.test(t))return '1.3';
    if(/remote sensing|survey|interview|census|qualitative|quantitative|satellite imagery/i.test(t))return '1.2';
    return '1.1';
  }
  function choicesOf(q){return q?.choices||q?.[2]||[]}
  function answerOf(q){return q?.answer||q?.[3]}
  function keyFor(q){return (q?.id||q?.prompt||q?.q||q?.[1]||'unknown').toString().slice(0,180)}

  let state={open:false,stage:'diagnose',q:null,topic:'1.1',reason:null,checkIndex:0,selected:null,feedback:null,idk:false};
  function recordDiagnosis(topic,reason,q){
    const s=load();
    s.diagnoses[reason]=(s.diagnoses[reason]||0)+1;
    const t=s.topics[topic]||{misses:0,rescues:0,checks:0,correct:0,last:0};t.misses++;t.last=Date.now();s.topics[topic]=t;
    s.history.push({at:Date.now(),topic,reason,q:keyFor(q)});s.history=s.history.slice(-80);save(s);
  }
  function recordCheck(topic,correct){
    const s=load(),t=s.topics[topic]||{misses:0,rescues:0,checks:0,correct:0,last:0};t.checks++;if(correct){t.correct++;t.rescues++;}t.last=Date.now();s.topics[topic]=t;save(s);
    // Feed successful re-check evidence into the existing adaptive mastery store without claiming official AP scoring.
    try{
      const a=JSON.parse(localStorage.getItem(ADAPTIVE)||'{"topics":{},"misconceptions":{},"frq":{}}');
      const x=a.topics[topic]||{attempts:0,correct:0,days:[],last:0,next:0,streak:0};x.attempts++;if(correct)x.correct++;x.streak=correct?(x.streak||0)+1:0;x.last=Date.now();
      const d=new Date(),dk=`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;if(!x.days.includes(dk))x.days.push(dk);x.days=x.days.slice(-12);x.next=Date.now()+(correct?DAY:0);a.topics[topic]=x;localStorage.setItem(ADAPTIVE,JSON.stringify(a));
    }catch(e){}
  }
  function weakestTopic(){
    const s=load(),rows=Object.entries(s.topics).map(([topic,t])=>({topic,...t,rate:t.checks?t.correct/t.checks:0}));
    if(!rows.length)return null;
    rows.sort((a,b)=>(b.misses-b.rescues)-(a.misses-a.rescues)||a.rate-b.rate||b.last-a.last);return rows[0];
  }
  function nextStepText(){
    const w=weakestTopic();if(!w)return 'Complete a few Unit 1 questions. Study Buddy will use your misses to choose a target.';
    const lesson=lessons[w.topic];
    if(w.checks===0)return `Start with Topic ${w.topic}: ${topicNames[w.topic]}. Use Teach Me, then complete a new check question.`;
    if(w.rate<0.8)return `Keep working Topic ${w.topic}: ${topicNames[w.topic]}. Do one short lesson, two new checks, then return to mixed Unit 1 practice.`;
    return `Retest Topic ${w.topic}: ${topicNames[w.topic]} in mixed Unit 1 practice. If you get it right again later, move to your next weakest topic.`;
  }

  function modalRoot(){let r=document.getElementById('aphg-personal-coach');if(!r){r=document.createElement('div');r.id='aphg-personal-coach';document.body.appendChild(r)}return r}
  function close(){state.open=false;modalRoot().innerHTML='';}
  function openFor(q,idk){if(!q||unitOf(q)!==1)return;state={open:true,stage:'diagnose',q,topic:topicOf(q),reason:idk?'idk':null,checkIndex:0,selected:null,feedback:null,idk:!!idk};if(idk){recordDiagnosis(state.topic,'idk',q);state.stage='teach'}renderCoach();}
  function chooseReason(reason){state.reason=reason;recordDiagnosis(state.topic,reason,state.q);state.stage='teach';renderCoach();}
  function goCheck(){state.stage='check';state.selected=null;state.feedback=null;renderCoach();}
  function check(choice){
    const c=lessons[state.topic].checks[state.checkIndex%lessons[state.topic].checks.length];state.selected=choice;const ok=choice===c.a;state.feedback={ok,why:c.why};recordCheck(state.topic,ok);renderCoach();
  }
  function tryAnother(){state.checkIndex=(state.checkIndex+1)%lessons[state.topic].checks.length;state.selected=null;state.feedback=null;renderCoach();}

  function renderCoach(){
    if(!state.open)return;const root=modalRoot(),L=lessons[state.topic];
    const shell=(body)=>`<div style="position:fixed;inset:0;background:rgba(15,23,42,.58);z-index:99999;display:flex;align-items:flex-end;justify-content:center;padding:12px" role="dialog" aria-modal="true" aria-label="Study Buddy rescue coach"><div style="background:white;color:#172033;width:min(680px,100%);max-height:88vh;overflow:auto;border-radius:18px 18px 10px 10px;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,.3)"><button onclick="window.APHGPersonalCoach.close()" style="float:right;border:0;background:#eef2f7;border-radius:999px;width:36px;height:36px;font-size:20px" aria-label="Close">×</button><div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#596579">Topic ${esc(state.topic)} · ${esc(topicNames[state.topic])}</div>${body}</div></div>`;
    if(state.stage==='diagnose'){
      root.innerHTML=shell(`<h2 style="margin:8px 0">What tripped you up?</h2><p>This is not a grade. It helps Study Buddy teach the right thing.</p><div style="display:grid;gap:9px"><button class="btn-secondary" onclick="window.APHGPersonalCoach.reason('vocab')">I didn’t know a word or term</button><button class="btn-secondary" onclick="window.APHGPersonalCoach.reason('concept')">I knew the words, but not the idea</button><button class="btn-secondary" onclick="window.APHGPersonalCoach.reason('choices')">The answer choices confused me</button><button class="btn-secondary" onclick="window.APHGPersonalCoach.reason('map-data')">I had trouble reading the map or data</button><button class="btn-secondary" onclick="window.APHGPersonalCoach.reason('idk')">I’m not sure what I didn’t know</button></div>`);return;
    }
    if(state.stage==='teach'){
      root.innerHTML=shell(`<h2 style="margin:8px 0">Teach Me: ${esc(L.title)}</h2><div style="background:#eef7ff;border-radius:12px;padding:14px"><b>The idea</b><p style="margin-bottom:0">${esc(L.teach)}</p></div><div style="background:#fff8dc;border-radius:12px;padding:14px;margin-top:10px"><b>Quick example</b><p style="margin-bottom:0">${esc(L.example)}</p></div><button class="btn-primary" style="width:100%;margin-top:14px" onclick="window.APHGPersonalCoach.goCheck()">Try a new question</button>`);return;
    }
    const c=L.checks[state.checkIndex%L.checks.length];
    root.innerHTML=shell(`<h2 style="margin:8px 0">Prove it with a new question</h2><p><b>${esc(c.q)}</b></p><div style="display:grid;gap:8px">${c.choices.map(x=>`<button class="btn-secondary" ${state.feedback?'disabled':''} onclick="window.APHGPersonalCoach.check(${JSON.stringify(x).replace(/"/g,'&quot;')})">${esc(x)}</button>`).join('')}</div>${state.feedback?`<div style="margin-top:12px;padding:14px;border-radius:12px;background:${state.feedback.ok?'#edf9f0':'#fff4e5'}"><b>${state.feedback.ok?'Yes — that is the idea.':'Not yet — use the explanation, then try a different check.'}</b><p>${esc(state.feedback.why)}</p><p><b>What should I study next?</b> ${esc(nextStepText())}</p>${state.feedback.ok?`<button class="btn-primary" onclick="window.APHGPersonalCoach.close()">Return to practice</button>`:`<button class="btn-primary" onclick="window.APHGPersonalCoach.tryAnother()">Try another new question</button>`}</div>`:''}`);
  }

  window.APHGPersonalCoach={close,reason:chooseReason,goCheck,check,tryAnother,openFor,nextStep:nextStepText,weakestTopic};

  // On a wrong Unit 1 answer, ask why the miss happened after the normal explanation renders.
  if(typeof chooseAnswer==='function'){
    const previous=chooseAnswer;
    chooseAnswer=function(choice){
      const q=currentQuestion(),wasUnanswered=typeof selectedChoice==='undefined'||!selectedChoice;const correct=answerOf(q);
      const result=previous(choice);
      if(wasUnanswered&&q&&unitOf(q)===1&&choice!==correct){setTimeout(()=>openFor(q,false),0)}
      return result;
    };
  }

  // Add a true "I don't know yet" path to Unit 1 without faking a wrong answer choice.
  function addIdkButton(){
    if(document.getElementById('aphg-idk-button'))return;const q=currentQuestion();if(!q||unitOf(q)!==1)return;
    try{if(typeof selectedChoice!=='undefined'&&selectedChoice)return}catch(e){}
    const wanted=new Set(choicesOf(q).map(x=>String(x).trim()));const buttons=[...document.querySelectorAll('button')];const answerButtons=buttons.filter(b=>wanted.has((b.textContent||'').trim()));
    if(!answerButtons.length)return;const parent=answerButtons[0].parentElement;if(!parent)return;
    const b=document.createElement('button');b.id='aphg-idk-button';b.className='btn-secondary';b.textContent="I don't know yet";b.style.marginTop='8px';b.onclick=()=>openFor(q,true);parent.appendChild(b);
  }
  const mo=new MutationObserver(()=>addIdkButton());mo.observe(document.body,{childList:true,subtree:true});setTimeout(addIdkButton,0);

  // Add the single clearest recommendation to the existing weak-spots/mastery view when available.
  if(typeof weakSpotsHtml==='function'){
    const previousWeak=weakSpotsHtml;
    weakSpotsHtml=function(){
      const base=previousWeak();return base+`<div class="box-info" style="margin-top:12px"><b>What should I study next?</b><p>${esc(nextStepText())}</p></div>`;
    };
  }
})();