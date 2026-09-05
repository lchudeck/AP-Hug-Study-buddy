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
      title:'Read what the map is actually showing',
      teach:'Start with the title, legend, units, and the pattern being mapped. Reference maps help locate places and features. Thematic maps show a particular variable or pattern. Also remember that every map is selective, and map projections can distort shape, area, distance, or direction.',
      example:'If counties are shaded from light to dark by median income, the map is thematic. If one projection makes high-latitude places look unusually large, that is projection distortion.',
      checks:[
        {q:'A map uses one dot to represent 1,000 people. What type of thematic map is being used?',choices:['Dot-density map','Reference map','Isoline map','Cartogram'],a:'Dot-density map',why:'Dot-density maps use dots to represent a specified quantity and help reveal spatial concentration.'},
        {q:'A map is designed mainly to show highways, rivers, cities, and political boundaries. What is its primary purpose?',choices:['Locate geographic features','Show one rate by area','Resize places according to a value','Connect places with equal measured values'],a:'Locate geographic features',why:'A reference map emphasizes the location of geographic features rather than one statistical variable.'},
        {q:'Why can two world map projections make the same country look different in size or shape?',choices:['All map projections distort some spatial relationships','Countries physically change size at different map scales','Thematic maps cannot show area accurately','Reference maps always preserve shape'],a:'All map projections distort some spatial relationships',why:'Flattening Earth onto a map requires distortion of shape, area, distance, direction, or some combination of them.'}
      ]
    },
    '1.2':{
      title:'Know how geographers collect geographic data',
      teach:'Geographers gather data in the field and through geospatial technologies. Methods include field observations, interviews, written accounts, landscape and photo interpretation, GIS, satellite navigation systems, remote sensing, and online mapping. Different methods provide different kinds of evidence and each has limitations.',
      example:'Satellite imagery of vegetation is remotely sensed data. An interview with a farmer is field-based qualitative evidence. A satellite navigation system can record the exact location where the interview or observation occurred.',
      checks:[
        {q:'Satellite images are used to measure how a city has expanded over 20 years. Which method produced these geographic data?',choices:['Remote sensing','Field observation','Personal interview','Satellite navigation system'],a:'Remote sensing',why:'Satellite imagery is collected from a distance, which makes it a form of remote sensing.'},
        {q:'Why might a geographer combine census data with resident interviews?',choices:['To compare numerical patterns with people’s lived experiences','To guarantee that both sources are unbiased','To eliminate the need to consider geographic scale','To make every source quantitative'],a:'To compare numerical patterns with people’s lived experiences',why:'Quantitative and qualitative evidence can complement one another and reveal different parts of a geographic question.'}
      ]
    },
    '1.3':{
      title:'Geographic data become powerful when people use them to make decisions',
      teach:'Topic 1.3 is about what happens when geographic information is used for decision-making. Individuals, businesses, organizations, and governments use data such as census information, satellite imagery, and mapped spatial patterns at local through global scales. A strong AP answer connects the information to a decision and then explains a geographic effect of that decision.',
      example:'A city maps flood risk and population density, then places emergency shelters near high-risk neighborhoods. The data guide a location decision that can change residents’ access to emergency services.',
      checks:[
        {q:'A grocery company maps population, income, transit access, and existing stores before choosing a new location. Which statement best explains the role of the geographic data?',choices:['The data help the company make a location decision that can affect access to stores','The data prove the new store will be profitable','The data eliminate differences between neighborhoods','The data are useful only for making a reference map'],a:'The data help the company make a location decision that can affect access to stores',why:'Topic 1.3 focuses on decisions made with geographic information and the geographic effects those decisions can create.'},
        {q:'A city uses maps of flood risk and population density to decide where to place evacuation centers. What is the best geographic explanation of this use of data?',choices:['Spatial data are guiding a government decision about where services should be located','Remote sensing alone determines which residents must evacuate','The decision changes the scale of analysis from local to global','The maps make field observations unnecessary'],a:'Spatial data are guiding a government decision about where services should be located',why:'Geographic information can guide governmental decisions about the location of resources and services.'}
      ]
    },
    '1.4':{
      title:'Think about how places are located, connected, and patterned',
      teach:'Spatial concepts describe relationships among places. Absolute location gives an exact position; relative location describes where a place is compared with other places. Flows show movement between places. Distance decay means interaction often decreases as distance increases. Time-space compression means faster transportation and communication can reduce the importance of distance. Geographers also analyze space, place, and spatial patterns.',
      example:'A distribution center located near several highways has strong relative-location advantages because goods can flow efficiently to multiple markets. Faster shipping can make those distant markets effectively closer in time.',
      checks:[
        {q:'A business chooses a warehouse because several highways connect the location to major markets. Which spatial concept is most directly being used?',choices:['Relative location','Absolute location','Environmental determinism','Formal region'],a:'Relative location',why:'Relative location describes where a place is in relation to other places and connections.'},
        {q:'People visit a nearby grocery store more frequently than a similar store 80 miles away. Which spatial concept best fits this pattern?',choices:['Distance decay','Time-space compression','Relative location','Scale of analysis'],a:'Distance decay',why:'Interaction often decreases as distance increases, although transportation and communication technologies can weaken that effect.'}
      ]
    },
    '1.5':{
      title:'People and environments affect one another',
      teach:'Human–environmental interaction includes how people use land and natural resources and how they try to use resources sustainably. Possibilism emphasizes that environments create opportunities and constraints while people use culture and technology to make choices. Environmental determinism is the older view that the physical environment determines human behavior and societal outcomes.',
      example:'Farmers using irrigation and drought-resistant crops in a dry region demonstrate possibilism because technology expands their choices within environmental limits. A conservation policy that limits water use can be an attempt to make resource use more sustainable.',
      checks:[
        {q:'A desert city imports water, uses air conditioning, and builds solar infrastructure. Which perspective best explains how people are responding to environmental constraints?',choices:['Possibilism','Environmental determinism','Distance decay','Formal region'],a:'Possibilism',why:'Possibilism emphasizes human choices and technology within environmental opportunities and constraints.'},
        {q:'Which action best illustrates the idea of sustainability?',choices:['Managing water use so current needs are met without reducing future availability','Using a resource as quickly as possible before another place can use it','Assuming climate alone determines how a society develops','Ignoring long-term environmental effects when choosing land uses'],a:'Managing water use so current needs are met without reducing future availability',why:'Sustainability focuses on meeting present needs while preserving the ability to meet future needs.'}
      ]
    },
    '1.6':{
      title:'Scale of analysis changes the pattern you can see',
      teach:'Do not confuse map scale with scale of analysis. Map scale is the relationship between distance on a map and distance on Earth. Scale of analysis is the geographic level at which data are studied: local, national, regional, or global. Patterns and processes can look different at different scales, and broad averages can hide local variation.',
      example:'A country may have a high national internet-access rate, while neighborhood-level data reveal clusters with very low access. Changing the scale of analysis changes which variations are visible.',
      checks:[
        {q:'National unemployment is low, but several neighborhoods in one city have very high unemployment. What best explains why the patterns appear different?',choices:['Scale of analysis','Map projection','Environmental determinism','Relocation diffusion'],a:'Scale of analysis',why:'National-level data can conceal local variation that becomes visible at the neighborhood scale.'},
        {q:'Which statement correctly distinguishes map scale from scale of analysis?',choices:['Map scale relates map distance to Earth distance; scale of analysis is the geographic level of the data','They are two names for exactly the same geographic concept','Map scale means local versus national data; scale of analysis means large-scale versus small-scale maps','Scale of analysis applies only to physical geography'],a:'Map scale relates map distance to Earth distance; scale of analysis is the geographic level of the data',why:'Map scale concerns representation on a map; scale of analysis concerns the level at which geographic patterns and data are examined.'}
      ]
    },
    '1.7':{
      title:'Regions are defined in different ways',
      teach:'A formal region has one or more shared measurable characteristics. A functional region is organized around a node and the flows connected to it. A perceptual, or vernacular, region is based on people’s shared ideas about a place. Regional boundaries can be transitional, overlapping, or contested, and geographers can apply regional analysis at local, national, and global scales.',
      example:'A commuter network centered on downtown forms a functional region. A state can be treated as a formal political region. “The South” can be a perceptual region because people may disagree about its exact boundaries.',
      checks:[
        {q:'A metropolitan commuter-rail network is centered on a downtown terminal and surrounding stations. Which type of region is it?',choices:['Functional region','Formal region','Perceptual region','Cultural hearth'],a:'Functional region',why:'A functional region is organized around a node and the flows or connections linked to it.'},
        {q:'People commonly refer to “the Midwest” as a region but disagree about exactly where it begins and ends. Which type of region is this?',choices:['Perceptual region','Functional region','Formal region','Political district'],a:'Perceptual region',why:'Perceptual, or vernacular, regions are based on shared ideas and often have imprecise or contested boundaries.'}
      ]
    }
  };

  const reasonGuidance={
    vocab:'Word help: identify the key geography term first. Say what it means in plain language before you look back at the choices.',
    concept:'Big-idea help: ask what relationship, pattern, process, or decision the question is really testing—not just which term looks familiar.',
    choices:'Choice help: predict an answer before rereading the options. Then eliminate choices that describe a different geographic concept, make an absolute claim, or do not answer the question asked.',
    'map-data':'Map/data help: read the title, legend or units, and scale first. State the strongest pattern you see before connecting it to an AP Human Geography concept.',
    idk:'Start here: read the short explanation once, then explain the big idea to yourself in one sentence before trying the new question.'
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
    if(/scale of analysis|local scale|regional scale|national scale|global scale|aggregation/i.test(t))return '1.6';
    if(/formal region|functional region|perceptual region|vernacular region/i.test(t))return '1.7';
    if(/possibil|determin|sustainab|natural resource|land use/i.test(t))return '1.5';
    if(/decision|choose.*location|where to (place|locate)|effect.*geographic|access to (services|stores)|allocate resources|planning decision/i.test(t))return '1.3';
    if(/absolute location|relative location|site|situation|distance decay|time-space compression|spatial interaction|\bflows?\b/i.test(t))return '1.4';
    if(/\bgis\b|geographic information system|remote sensing|satellite navigation|online mapping|survey|interview|census|qualitative|quantitative|satellite imagery|field observation|landscape analysis|photographic interpretation/i.test(t))return '1.2';
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
    const s=load(),t=s.topics[topic]||{misses:0,rescues:0,checks:0,correct:0,last:0};t.checks++;if(correct){t.correct++;t.rescues=Math.min(t.misses,t.rescues+1);}t.last=Date.now();s.topics[topic]=t;save(s);
    // Feed re-check evidence into the existing adaptive mastery store without claiming official AP scoring.
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
      root.innerHTML=shell(`<h2 style="margin:8px 0">What tripped you up?</h2><p>This is not a grade. Your answer changes the kind of help Study Buddy gives you.</p><div style="display:grid;gap:9px"><button class="btn-secondary" onclick="window.APHGPersonalCoach.reason('vocab')">I didn’t know a word or term</button><button class="btn-secondary" onclick="window.APHGPersonalCoach.reason('concept')">I knew the words, but not the idea</button><button class="btn-secondary" onclick="window.APHGPersonalCoach.reason('choices')">The answer choices confused me</button><button class="btn-secondary" onclick="window.APHGPersonalCoach.reason('map-data')">I had trouble reading the map or data</button><button class="btn-secondary" onclick="window.APHGPersonalCoach.reason('idk')">I’m not sure what I didn’t know</button></div>`);return;
    }
    if(state.stage==='teach'){
      const help=reasonGuidance[state.reason]||reasonGuidance.idk;
      root.innerHTML=shell(`<h2 style="margin:8px 0">Teach Me: ${esc(L.title)}</h2><div style="background:#f2f4f8;border-radius:12px;padding:12px;margin-bottom:10px"><b>Your strategy</b><p style="margin-bottom:0">${esc(help)}</p></div><div style="background:#eef7ff;border-radius:12px;padding:14px"><b>The idea</b><p style="margin-bottom:0">${esc(L.teach)}</p></div><div style="background:#fff8dc;border-radius:12px;padding:14px;margin-top:10px"><b>Quick example</b><p style="margin-bottom:0">${esc(L.example)}</p></div><button class="btn-primary" style="width:100%;margin-top:14px" onclick="window.APHGPersonalCoach.goCheck()">Try a new question</button>`);return;
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
