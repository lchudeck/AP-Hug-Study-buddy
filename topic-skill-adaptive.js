// Topic + skill adaptive mastery engine.
// Adds a shared CED-level evidence layer to the main quiz without collecting identity data.
(function(){
  if(window.__topicSkillAdaptiveInstalled) return;
  window.__topicSkillAdaptiveInstalled=true;

  const STORE='aphgTopicSkillMasteryV1';
  const LEGACY_TOPIC_STORE='aphgPracticeMasteryV4';
  const DAY=24*60*60*1000;

  const TOPIC_LABELS={
    '1.1':'Introduction to Maps','1.2':'Geographic Data','1.3':'The Power of Geographic Data','1.4':'Spatial Concepts','1.5':'Human–Environmental Interaction','1.6':'Scales of Analysis','1.7':'Regional Analysis',
    '2.1':'Population Distribution','2.2':'Consequences of Population Distribution','2.3':'Population Composition','2.4':'Population Dynamics','2.5':'Demographic Transition Model','2.6':'Malthusian Theory','2.7':'Population Policies','2.8':'Women and Demographic Change','2.9':'Aging Populations','2.10':'Causes of Migration','2.11':'Forced and Voluntary Migration','2.12':'Effects of Migration',
    '3.1':'Introduction to Culture','3.2':'Cultural Landscapes','3.3':'Cultural Patterns','3.4':'Types of Diffusion','3.5':'Historical Causes of Diffusion','3.6':'Contemporary Causes of Diffusion','3.7':'Diffusion of Religion and Language','3.8':'Effects of Diffusion',
    '4.1':'Introduction to Political Geography','4.2':'Political Processes','4.3':'Political Power and Territoriality','4.4':'Defining Political Boundaries','4.5':'The Function of Political Boundaries','4.6':'Internal Boundaries','4.7':'Forms of Governance','4.8':'Defining Devolutionary Factors','4.9':'Challenges to Sovereignty','4.10':'Consequences of Centrifugal and Centripetal Forces',
    '5.1':'Introduction to Agriculture','5.2':'Settlement Patterns and Survey Methods','5.3':'Agricultural Origins and Diffusions','5.4':'The Second Agricultural Revolution','5.5':'The Green Revolution','5.6':'Agricultural Production Regions','5.7':'Spatial Organization of Agriculture','5.8':'Von Thünen Model','5.9':'Global Agricultural Systems','5.10':'Consequences of Agricultural Practices','5.11':'Challenges of Contemporary Agriculture','5.12':'Women in Agriculture',
    '6.1':'The Origin and Influences of Urbanization','6.2':'Cities Across the World','6.3':'Cities and Globalization','6.4':'The Size and Distribution of Cities','6.5':'The Internal Structure of Cities','6.6':'Density and Land Use','6.7':'Infrastructure','6.8':'Urban Sustainability','6.9':'Urban Data','6.10':'Challenges of Urban Change','6.11':'Urban Renewal and Gentrification',
    '7.1':'Industrialization and Economic Development','7.2':'Economic Sectors and Patterns','7.3':'Measures of Development','7.4':'Women and Economic Development','7.5':'Theories of Development','7.6':'Trade and the World Economy','7.7':'Changes as a Result of the World Economy','7.8':'Sustainable Development'
  };

  const SKILLS={
    concept:'Concepts & Processes',
    spatial:'Spatial Relationships',
    data:'Data Analysis',
    source:'Source Analysis',
    scale:'Scale Analysis'
  };

  function load(){
    try{return JSON.parse(localStorage.getItem(STORE)||'{"topics":{},"skills":{}}');}
    catch(e){return {topics:{},skills:{}};}
  }
  function save(s){localStorage.setItem(STORE,JSON.stringify(s));}
  function emptyStat(){return {attempts:0,correct:0,recent:[],lastSeen:0,streak:0,nextReview:0};}
  function normStat(x){return Object.assign(emptyStat(),x||{});}

  function topicFromQuestion(q){
    if(!q) return null;
    if(q.topic) return String(q.topic);
    const unit=Number(String(q[0]||'').match(/\d+/)?.[0]||0);
    const text=String(q[1]||'').toLowerCase();
    const rules={
      1:[['gis|remote sensing','1.2'],['scale','1.6'],['formal region|functional region|perceptual|vernacular','1.7'],['site|situation|distance|direction|density|pattern','1.4'],['map|choropleth|cartogram|projection','1.1']],
      2:[['population pyramid|age|dependency ratio','2.3'],['stage 2|stage 3|stage 4|dtm|demographic transition','2.5'],['push factor|pull factor|migration','2.10'],['refugee|forced|voluntary','2.11'],['aging|elderly','2.9'],['density|distribution','2.1']],
      3:[['relocation|hierarchical|contagious|stimulus diffusion','3.4'],['hearth','3.3'],['lingua franca|language|religion','3.7'],['culture|cultural','3.1']],
      4:[['gerrymander|packing|cracking|district','4.6'],['federal|unitary|governance','4.7'],['devolution','4.8'],['centripetal|centrifugal','4.10'],['sovereignty|state|nation','4.1'],['boundary|border','4.4']],
      5:[['von thünen|von thunen','5.8'],['green revolution','5.5'],['subsistence|commercial agriculture','5.6'],['food desert|agriculture challenge','5.11'],['agribusiness|commodity|global','5.9']],
      6:[['gentrification|displacement','6.11'],['concentric|sector model|multiple nuclei|city model','6.5'],['sprawl|smart growth|sustainab','6.8'],['cbd|edge city|land use','6.5'],['urbanization|suburbanization','6.1']],
      7:[['hdi|gdp|gni|development measure','7.3'],['rostow|wallerstein|world-systems|weber','7.5'],['outsourc|offshor|trade','7.6'],['deindustrial','world economy','7.7'],['sustainable','7.8']]
    };
    const list=rules[unit]||[];
    for(const [pattern,topic] of list){if(new RegExp(pattern).test(text)) return topic;}
    return unit?`${unit}.1`:null;
  }

  function skillFromQuestion(q){
    const text=String((q&&q[1])||'').toLowerCase();
    if(/scale of analysis|scale|local|regional|national|global/.test(text)) return 'scale';
    if(/map|graph|table|data|population pyramid|gis|remote sensing|density/.test(text)) return 'data';
    if(/source|image|photograph|stimulus|evidence/.test(text)) return 'source';
    if(/pattern|distribution|diffusion|distance|location|spatial|site|situation/.test(text)) return 'spatial';
    return 'concept';
  }

  function recordStat(stat,correct){
    stat=normStat(stat); const now=Date.now();
    stat.attempts++; if(correct) stat.correct++;
    stat.recent=(stat.recent||[]).concat(correct?1:0).slice(-10);
    stat.streak=correct?(stat.streak||0)+1:0;
    stat.lastSeen=now;
    // spaced retrieval: missed = soon, then 1d, 3d, 7d as successful streak grows
    const delay=!correct?0:stat.streak>=5?7*DAY:stat.streak>=3?3*DAY:DAY;
    stat.nextReview=now+delay;
    return stat;
  }

  function recordEvidence(q,correct){
    const topic=topicFromQuestion(q),skill=skillFromQuestion(q),s=load();
    s.topics=s.topics||{}; s.skills=s.skills||{};
    if(topic) s.topics[topic]=recordStat(s.topics[topic],correct);
    if(skill) s.skills[skill]=recordStat(s.skills[skill],correct);
    save(s);
  }

  function legacyTopicStat(topic){
    try{
      const legacy=JSON.parse(localStorage.getItem(LEGACY_TOPIC_STORE)||'{}')[topic];
      if(!legacy||!legacy.total) return null;
      return {attempts:legacy.total,correct:legacy.right||0,recent:(legacy.recent||[]).slice(-10),lastSeen:0,nextReview:0,streak:0};
    }catch(e){return null;}
  }

  function combinedTopicStat(topic){
    const current=(load().topics||{})[topic],legacy=legacyTopicStat(topic);
    if(!current) return legacy;
    if(!legacy) return current;
    // Practice & Mastery and main quiz are separate experiences; combine their evidence.
    return {
      attempts:(current.attempts||0)+(legacy.attempts||0),
      correct:(current.correct||0)+(legacy.correct||0),
      recent:[...(legacy.recent||[]),...(current.recent||[])].slice(-10),
      lastSeen:current.lastSeen||0,nextReview:current.nextReview||0,streak:current.streak||0
    };
  }

  function mastery(stat){
    if(!stat||stat.attempts<3) return null;
    const recent=stat.recent&&stat.recent.length?stat.recent.reduce((a,b)=>a+b,0)/stat.recent.length:stat.correct/stat.attempts;
    const all=stat.correct/stat.attempts;
    const confidence=Math.min(1,stat.attempts/8);
    let score=(recent*.7+all*.3)*100;
    // low evidence should not look falsely precise/high
    score=50+(score-50)*confidence;
    // small recency penalty after 14 days so mastered material comes back into rotation
    if(stat.lastSeen&&Date.now()-stat.lastSeen>14*DAY) score-=8;
    return Math.max(0,Math.min(100,Math.round(score)));
  }

  function topicEvidence(){
    const topics=new Set(Object.keys(TOPIC_LABELS));
    try{Object.keys(JSON.parse(localStorage.getItem(LEGACY_TOPIC_STORE)||'{}')).forEach(t=>topics.add(t));}catch(e){}
    Object.keys(load().topics||{}).forEach(t=>topics.add(t));
    return [...topics].map(topic=>{
      const stat=combinedTopicStat(topic),m=mastery(stat),unit=Number(topic.split('.')[0]);
      return {topic,unit,label:TOPIC_LABELS[topic]||`Topic ${topic}`,stat,mastery:m,due:!!(stat&&stat.nextReview&&stat.nextReview<=Date.now())};
    });
  }

  function practicedTopics(){return topicEvidence().filter(x=>x.stat&&x.stat.attempts>0);}
  function weakTopics(limit=5){
    return practicedTopics().sort((a,b)=>
      (b.due?1:0)-(a.due?1:0) ||
      (a.mastery??101)-(b.mastery??101) ||
      (a.stat.lastSeen||0)-(b.stat.lastSeen||0)
    ).slice(0,limit);
  }

  // Wrap the existing main-quiz answer handler once it is available.
  if(typeof chooseAnswer==='function'){
    const oldChooseAnswer=chooseAnswer;
    chooseAnswer=function(choice){
      if(!selectedChoice){
        try{
          const qs=getQuizSet(); const q=qs[qIndex%qs.length];
          recordEvidence(q,choice===q[3]);
        }catch(e){}
      }
      return oldChooseAnswer(choice);
    };
  }

  // Make legacy unit targeting derive from CED topic evidence first.
  const oldGetWeakestUnit=typeof getWeakestUnit==='function'?getWeakestUnit:null;
  getWeakestUnit=function(){
    const weak=weakTopics(1)[0];
    if(weak){
      const u=units.find(x=>x.id===weak.unit);
      return {unit:weak.unit,name:u?u.name:`Unit ${weak.unit}`,missed:Math.max(1,(weak.stat.attempts||0)-(weak.stat.correct||0)),color:u?u.color:'#6366f1',topic:weak.topic,topicName:weak.label,mastery:weak.mastery};
    }
    return oldGetWeakestUnit?oldGetWeakestUnit():null;
  };

  // Adaptive quiz now targets exact weak/due topics when its question bank supports them.
  adaptiveDeck=function(){
    const weak=weakTopics(5);
    if(!weak.length) return quiz.slice();
    const priorityTopics=new Set(weak.map(x=>x.topic));
    const priorityUnits=new Set(weak.slice(0,3).map(x=>x.unit));
    const exact=quiz.filter(q=>priorityTopics.has(topicFromQuestion(q)));
    const support=quiz.filter(q=>priorityUnits.has(Number(String(q[0]||'').match(/\d+/)?.[0]||0)) && !exact.includes(q));
    const rest=quiz.filter(q=>!exact.includes(q)&&!support.includes(q));
    let deck=[...exact,...support,...rest];
    if(adaptiveLevel===1) deck=deck.filter((q,i)=>i%4!==3 || priorityTopics.has(topicFromQuestion(q)));
    if(adaptiveLevel===3) deck=[...deck,...exact];
    return deck.length?deck:quiz;
  };

  // Difficulty is now based on demonstrated topic mastery rather than broad unit averages.
  const oldRecommendedDifficulty=typeof recommendedDifficulty==='function'?recommendedDifficulty:null;
  recommendedDifficulty=function(){
    const done=practicedTopics().map(x=>x.mastery).filter(x=>x!==null);
    if(done.length<2) return {level:1,label:'Getting Started',desc:'Answer a few questions so Study Buddy can identify your exact CED topics and skills.'};
    const avg=Math.round(done.reduce((a,b)=>a+b,0)/done.length);
    if(avg>=82)return {level:3,label:'AP Challenge',desc:'Your practiced topics are strong. Expect more transfer, stimulus, and less support.'};
    if(avg>=60)return {level:2,label:'Developing',desc:'Study Buddy is mixing new questions with retrieval of your weaker CED topics.'};
    return {level:1,label:'Support Mode',desc:'Study Buddy is prioritizing weak CED topics, explanations, and quick retrieval practice.'};
  };

  // Replace the unit-only weak-spots panel with specific CED topics + skill evidence.
  weakSpotsHtml=function(){
    const weak=weakTopics(5),s=load(),skillRows=Object.entries(SKILLS).map(([key,label])=>{
      const st=(s.skills||{})[key],m=mastery(st);
      return st&&st.attempts?{key,label,stat:st,mastery:m}:null;
    }).filter(Boolean).sort((a,b)=>(a.mastery??101)-(b.mastery??101));
    if(!weak.length&&!skillRows.length) return `<div class="box-info">Answer some quiz questions and Study Buddy will diagnose your exact CED topics and AP skills here.</div>`;
    const topicHtml=weak.length?`<div style="display:grid;gap:8px">${weak.map(w=>`<div style="background:#f8fafc;border:1px solid #dde3ed;border-radius:14px;padding:12px"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><span><b>Topic ${w.topic}: ${w.label}</b><br><span style="font-size:13px;color:#64748b">${w.stat.attempts} attempts · ${w.mastery===null?'building evidence':w.mastery+'% mastery'}${w.due?' · review due':''}</span></span><button class="btn-sm btn-secondary" onclick="qFilter='Adaptive';qIndex=0;selectedChoice='';render()">Practice it</button></div></div>`).join('')}</div>`:'';
    const skillHtml=skillRows.length?`<div style="margin-top:14px"><b>AP skill evidence</b>${skillRows.slice(0,3).map(x=>`<div class="mini-progress-row"><span>${x.label}</span><b>${x.mastery===null?'Need data':x.mastery+'%'}</b></div>`).join('')}</div>`:'';
    return topicHtml+skillHtml;
  };

  // Add topic specificity to the AP Mastery snapshot/recommendation while preserving the existing page.
  if(typeof getMasterySnapshot==='function'){
    const oldSnapshot=getMasterySnapshot;
    getMasterySnapshot=function(){
      const snap=oldSnapshot(),weak=weakTopics(1)[0];
      if(weak) snap.weak={unit:weak.unit,name:`Topic ${weak.topic}: ${weak.label}`,topic:weak.topic,topicName:weak.label,mastery:weak.mastery};
      snap.weakTopic=weak||null;
      return snap;
    };
  }

  window.APHGTopicSkillMastery={topicFromQuestion,skillFromQuestion,recordEvidence,topicEvidence,weakTopics,mastery,storeKey:STORE};
})();
