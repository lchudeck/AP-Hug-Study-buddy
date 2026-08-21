// Adaptive coach v2: misconception targeting, proof-over-time mastery, adaptive FRQ, and simpler next-step guidance.
(function(){
  if(window.__adaptiveCoachV2Installed) return;
  window.__adaptiveCoachV2Installed=true;

  const STORE='aphgAdaptiveCoachV2';
  const TOPIC_STORE='aphgTopicSkillMasteryV1';
  const DAY=86400000;
  const labels={
    '1.2':'Geographic Data','1.4':'Spatial Concepts','1.6':'Scales of Analysis','2.3':'Population Composition','2.5':'Demographic Transition Model','2.9':'Aging Populations','2.10':'Causes of Migration','3.4':'Types of Diffusion','3.6':'Contemporary Causes of Diffusion','4.1':'Political Geography','4.6':'Internal Boundaries','4.8':'Devolution','5.6':'Agricultural Production','5.8':'Von Thünen Model','6.9':'Urban Data','6.11':'Gentrification','7.3':'Measures of Development','7.5':'Theories of Development','7.6':'Trade & World Economy'
  };
  const misconceptionLabels={
    'site-situation':'site vs. situation','gis-vs-remote':'GIS vs. remote sensing','scale-aggregation':'scale vs. aggregation','dtm-shape':'DTM stage vs. pyramid shape','youth-aging':'youth dependency vs. aging dependency','relocation-hierarchical':'relocation vs. hierarchical diffusion','hierarchical-relocation':'hierarchical vs. relocation diffusion','stimulus-contagious':'stimulus vs. contagious diffusion','nation-state':'nation vs. state','packing-cracking':'packing vs. cracking','devolution-secession':'devolution vs. secession','von-thunen-reason':'Von Thünen rings vs. the reason for the rings','model-limitation':'model pattern vs. real-world limitation','gentrification-renewal':'gentrification vs. simple urban renewal','one-sided-gentrification':'one-sided evaluation of gentrification','gdp-hdi':'GDP per capita vs. broader development measures','rostow-wallerstein':'Rostow vs. world-systems theory','outsourcing-offshoring':'outsourcing/offshoring and global division of labor'
  };
  const rules=[
    [/site|situation/i,'1.4','site-situation'],[/gis|remote sensing/i,'1.2','gis-vs-remote'],[/scale|local|regional|national/i,'1.6','scale-aggregation'],
    [/population pyramid|dependency|age structure/i,'2.3','youth-aging'],[/dtm|stage 2|stage 3|stage 4|demographic transition/i,'2.5','dtm-shape'],
    [/relocation|hierarchical diffusion/i,'3.4','relocation-hierarchical'],[/stimulus diffusion|contagious diffusion/i,'3.4','stimulus-contagious'],
    [/nation|state|sovereignty/i,'4.1','nation-state'],[/packing|cracking|gerrymander/i,'4.6','packing-cracking'],[/devolution/i,'4.8','devolution-secession'],
    [/von th/i,'5.8','von-thunen-reason'],[/subsistence|commercial agriculture/i,'5.6','subsistence-commercial'],
    [/gentrification|displacement/i,'6.11','gentrification-renewal'],[/scale.*city|neighborhood|citywide/i,'6.9','urban-scale'],
    [/hdi|gdp|gni/i,'7.3','gdp-hdi'],[/rostow|wallerstein|world-systems/i,'7.5','rostow-wallerstein'],[/outsourc|offshor/i,'7.6','outsourcing-offshoring']
  ];

  function load(){try{return JSON.parse(localStorage.getItem(STORE)||'{"topics":{},"misconceptions":{},"frq":{}}')}catch(e){return {topics:{},misconceptions:{},frq:{}}}}
  function save(s){localStorage.setItem(STORE,JSON.stringify(s));}
  function dayKey(ts=Date.now()){const d=new Date(ts);return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;}
  function questionText(q){return q&&q.prompt?`${q.prompt} ${(q.choices||[]).join(' ')}`:`${q?.[1]||''} ${(q?.[2]||[]).join(' ')}`;}
  function infer(q){
    if(q&&q.topic)return {topic:String(q.topic),misconception:q.misconception||null};
    const text=questionText(q);
    for(const [rx,topic,mis] of rules) if(rx.test(text)) return {topic,misconception:mis};
    const unit=Number(String(q?.[0]||'').match(/\d+/)?.[0]||0);return {topic:unit?`${unit}.1`:null,misconception:null};
  }
  function record(q,correct,choice){
    const s=load(),meta=infer(q); if(!meta.topic)return;
    const t=s.topics[meta.topic]||{attempts:0,correct:0,days:[],last:0,next:0,streak:0};
    t.attempts++;if(correct)t.correct++;t.streak=correct?(t.streak||0)+1:0;t.last=Date.now();
    if(!t.days.includes(dayKey()))t.days.push(dayKey());t.days=t.days.slice(-12);
    t.next=Date.now()+(correct?(t.streak>=4?7*DAY:t.streak>=2?3*DAY:DAY):0);
    s.topics[meta.topic]=t;
    if(!correct&&meta.misconception){
      const m=s.misconceptions[meta.misconception]||{count:0,topic:meta.topic,last:0,wrongChoices:[]};m.count++;m.last=Date.now();
      if(choice&&!m.wrongChoices.includes(choice))m.wrongChoices.push(choice);m.wrongChoices=m.wrongChoices.slice(-3);s.misconceptions[meta.misconception]=m;
    }else if(correct&&meta.misconception&&s.misconceptions[meta.misconception]){
      s.misconceptions[meta.misconception].count=Math.max(0,s.misconceptions[meta.misconception].count-1);
    }
    save(s);
  }
  function topicProof(topic){
    const t=load().topics[topic];if(!t)return null;
    const pct=t.attempts?Math.round(t.correct/t.attempts*100):0;
    const acrossDays=(t.days||[]).length;
    const mastered=t.attempts>=5&&pct>=80&&acrossDays>=2&&t.streak>=2;
    return {...t,pct,acrossDays,mastered,due:!!t.next&&t.next<=Date.now()};
  }
  function topMisconceptions(limit=3){return Object.entries(load().misconceptions).map(([key,v])=>({key,...v,label:misconceptionLabels[key]||key})).filter(x=>x.count>0).sort((a,b)=>b.count-a.count||b.last-a.last).slice(0,limit);}

  if(typeof chooseAnswer==='function'){
    const old=chooseAnswer;
    chooseAnswer=function(choice){
      if(!selectedChoice){try{const qs=getQuizSet(),q=qs[qIndex%qs.length];record(q,choice===q[3],choice);}catch(e){}}
      return old(choice);
    };
  }

  if(typeof adaptiveDeck==='function'){
    const oldAdaptive=adaptiveDeck;
    adaptiveDeck=function(){
      const base=oldAdaptive();const s=load();
      const priority=new Set(topMisconceptions(4).map(x=>x.topic));
      Object.entries(s.topics).forEach(([topic,t])=>{if(t.next&&t.next<=Date.now())priority.add(topic);});
      if(!priority.size)return base;
      const first=base.filter(q=>priority.has(infer(q).topic));
      const rest=base.filter(q=>!priority.has(infer(q).topic));
      return [...first,...rest];
    };
  }

  if(typeof weakSpotsHtml==='function'){
    const oldWeak=weakSpotsHtml;
    weakSpotsHtml=function(){
      const base=oldWeak(),mis=topMisconceptions(2);
      const misHtml=mis.length?`<div class="box-yellow" style="margin-top:12px"><b>Likely confusion to fix</b>${mis.map(m=>`<p style="margin-top:6px"><b>${m.label}</b> · seen ${m.count} time${m.count===1?'':'s'}. Study Buddy will deliberately test this distinction again.</p>`).join('')}</div>`:'';
      const proof=Object.entries(load().topics).map(([topic])=>[topic,topicProof(topic)]).filter(x=>x[1]&&x[1].attempts>=3).sort((a,b)=>a[1].pct-b[1].pct).slice(0,3);
      const proofHtml=proof.length?`<div style="margin-top:12px"><b>Mastery proof</b>${proof.map(([topic,p])=>`<div class="mini-progress-row"><span>Topic ${topic} · ${labels[topic]||''}</span><b>${p.mastered?'Mastered ✓':`${p.pct}% · ${p.acrossDays}/2 days`}</b></div>`).join('')}</div>`:'';
      return base+misHtml+proofHtml;
    };
  }

  const frqBank=[
    {topic:'1.4',unit:1,verb:'Explain',prompt:'Explain how a city’s situation can contribute to economic growth.',idea:'transportation connections, nearby markets, or accessibility'},
    {topic:'1.6',unit:1,verb:'Explain',prompt:'Explain how changing from a national to a neighborhood scale of analysis could change a conclusion.',idea:'aggregation can hide local variation'},
    {topic:'2.5',unit:2,verb:'Explain',prompt:'Explain why population growth is often rapid during DTM Stage 2.',idea:'death rates fall before birth rates'},
    {topic:'2.9',unit:2,verb:'Explain',prompt:'Explain one economic challenge created by an aging population.',idea:'pensions, health care, labor shortages, or dependency'},
    {topic:'3.4',unit:3,verb:'Explain',prompt:'Explain the difference between relocation diffusion and hierarchical diffusion using one example.',idea:'people physically move versus spread through influential people/places'},
    {topic:'3.6',unit:3,verb:'Explain',prompt:'Explain how globalization can accelerate cultural diffusion.',idea:'media, travel, trade, and communication reduce time-distance barriers'},
    {topic:'4.6',unit:4,verb:'Explain',prompt:'Explain how packing can affect political representation.',idea:'concentrating voters can reduce influence across other districts'},
    {topic:'4.8',unit:4,verb:'Explain',prompt:'Explain how a federal system can reduce devolutionary pressure.',idea:'regional governments receive authority while the state remains unified'},
    {topic:'5.8',unit:5,verb:'Explain',prompt:'Explain why dairy production is located close to the market in the Von Thünen model.',idea:'perishability and transportation costs'},
    {topic:'5.8',unit:5,verb:'Evaluate',prompt:'Evaluate one limitation of the Von Thünen model for modern agriculture.',idea:'refrigeration, highways, policy, terrain, or multiple markets'},
    {topic:'6.11',unit:6,verb:'Explain',prompt:'Explain one way gentrification can cause displacement of longtime residents.',idea:'rents or property taxes rise'},
    {topic:'6.9',unit:6,verb:'Explain',prompt:'Explain why neighborhood-scale data may reveal urban inequality that a citywide average hides.',idea:'aggregation hides local variation'},
    {topic:'7.3',unit:7,verb:'Explain',prompt:'Explain why GDP per capita alone is an incomplete measure of development.',idea:'it omits health, education, inequality, or distribution'},
    {topic:'7.5',unit:7,verb:'Compare',prompt:'Compare Rostow’s model with world-systems theory as explanations of development.',idea:'stages of growth versus unequal core-periphery relationships'}
  ];
  let frqState={item:null,answer:'',feedback:null};
  function targetTopic(){
    const mis=topMisconceptions(1)[0];if(mis)return mis.topic;
    const s=load(),rows=Object.keys(s.topics).map(t=>[t,topicProof(t)]).filter(x=>x[1]).sort((a,b)=>(a[1].mastered?1:0)-(b[1].mastered?1:0)||a[1].pct-b[1].pct);if(rows[0])return rows[0][0];
    try{const ts=JSON.parse(localStorage.getItem(TOPIC_STORE)||'{}').topics||{};const k=Object.keys(ts)[0];if(k)return k;}catch(e){}
    return '2.5';
  }
  function chooseFrq(){const topic=targetTopic();return frqBank.find(x=>x.topic===topic)||frqBank.find(x=>x.unit===Number(topic.split('.')[0]))||frqBank[0];}
  function scoreFrq(item,text){
    const a=(text||'').trim().toLowerCase();const hasCause=item.verb==='Explain'?/(because|therefore|this leads to|as a result|due to)/.test(a):true;
    const words=a.split(/\s+/).filter(Boolean).length;const ideaHits=item.idea.toLowerCase().split(/[,/]| or /).map(x=>x.trim()).filter(x=>x.length>4).some(x=>a.includes(x.split(' ')[0]));
    const score=[words>=12,hasCause,ideaHits].filter(Boolean).length;
    return {score,hasCause,ideaHits,words,note:score===3?'Strong AP-style response. Now prove it again later.':score===2?'Close. Add the missing reasoning before moving on.':'Use the sentence frame and connect the concept to a specific effect.'};
  }
  window.adaptiveFrqCheck=function(){if(!frqState.item)frqState.item=chooseFrq();frqState.feedback=scoreFrq(frqState.item,frqState.answer);const s=load(),k=frqState.item.topic+':'+frqState.item.verb,x=s.frq[k]||{attempts:0,strong:0};x.attempts++;if(frqState.feedback.score===3)x.strong++;s.frq[k]=x;save(s);render();};
  window.adaptiveFrqInput=function(v){frqState.answer=v;};
  window.adaptiveFrqNext=function(){frqState={item:chooseFrq(),answer:'',feedback:null};render();};
  window.openAdaptiveFrq=function(){masteryView='adaptive-frq';frqState={item:chooseFrq(),answer:'',feedback:null};go('mastery');};
  function adaptiveFrqPage(){
    const x=frqState.item||chooseFrq();frqState.item=x;const f=frqState.feedback;
    return `<main><section class="card"><div class="mastery-mini-nav"><button class="btn-secondary btn-sm" onclick="masteryView='dashboard';render()">← Mastery Dashboard</button></div><h2>✍️ Adaptive FRQ</h2><p>Study Buddy picked this because of your current topic/skill evidence.</p><div class="box-info"><b>Topic ${x.topic}: ${labels[x.topic]||'Targeted CED practice'}</b><p><b>${x.verb}:</b> ${x.prompt}</p></div><div class="box-yellow"><b>Point recipe</b><p>Answer the task directly. ${x.verb==='Explain'?'Use <b>because</b> or <b>therefore</b> to show cause and effect.':''} Include a specific APHG concept or consequence.</p></div><textarea class="answer-textarea" style="min-height:150px" oninput="adaptiveFrqInput(this.value)" placeholder="Write 2–4 strong sentences...">${frqState.answer}</textarea><div class="mastery-actions"><button class="btn-primary" onclick="adaptiveFrqCheck()">Check my response</button><button class="btn-secondary" onclick="adaptiveFrqNext()">Give me another target</button></div>${f?`<div class="${f.score===3?'box-good':f.score===2?'box-yellow':'box-warn'}"><b>${f.score}/3 coaching checks</b><p>${f.note}</p><p>${f.hasCause?'✅':'⬜'} Cause/effect reasoning · ${f.ideaHits?'✅':'⬜'} Relevant APHG idea · ${f.words>=12?'✅':'⬜'} Enough development</p><p><b>What a strong answer should connect:</b> ${x.idea}.</p></div>`:''}</section></main>`;
  }

  if(typeof apMasteryPage==='function'){
    const oldMastery=apMasteryPage;
    apMasteryPage=function(){
      if(masteryView==='adaptive-frq')return adaptiveFrqPage();
      let html=oldMastery();
      if(masteryView==='dashboard'){
        const topic=targetTopic(),p=topicProof(topic),mis=topMisconceptions(1)[0];
        const reason=mis?`You are mixing up <b>${mis.label}</b>.`:(p?`Topic ${topic} is at <b>${p.pct}%</b> with evidence on ${p.acrossDays} day${p.acrossDays===1?'':'s'}.`:`Study Buddy needs a little more evidence.`);
        const action=`<section class="card" style="margin-top:16px"><h2>🧭 Do this next</h2><p>${reason}</p><div class="box-yellow"><b>8–12 minute plan:</b><p>1. Do 5 adaptive MCQs on the target. 2. Read every explanation. 3. Write one matching FRQ response. 4. Come back on a later day before the topic is marked mastered.</p></div><div class="mastery-actions"><button class="btn-primary" onclick="startAdaptivePractice()">Start targeted practice</button><button class="btn-secondary" onclick="openAdaptiveFrq()">Write the matching FRQ</button></div></section>`;
        html=html.replace('</main>',action+'</main>');
      }
      return html;
    };
  }

  if(typeof personalizedPlanItems==='function'){
    personalizedPlanItems=function(){
      const topic=targetTopic(),mis=topMisconceptions(1)[0],p=topicProof(topic);const name=labels[topic]||`Topic ${topic}`;
      return [
        {tag:'1. Fix one thing',text:mis?`Clear up ${mis.label} with 5 adaptive questions.`:`Practice ${name} with 5 adaptive questions.`},
        {tag:'2. Prove it',text:`Write one short adaptive FRQ for ${name}. Do not move on until the explanation shows cause/effect.`},
        {tag:'3. Remember it',text:p&&p.acrossDays>=2?'This topic has multi-day evidence; keep it in rotation.':'Come back on another day. Mastery requires success across more than one study session.'}
      ];
    };
  }
})();