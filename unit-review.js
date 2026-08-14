// PR #6: Unit Review is for the class unit test, separate from cumulative AP Exam Prep.
(function(){
  if(window.__unitReviewInstalled||typeof tabs==='undefined'||typeof render==='undefined'||typeof quiz==='undefined')return;
  window.__unitReviewInstalled=true;
  const at=Math.max(1,tabs.findIndex(t=>t[0]==='unitMasteryAll'))+1;
  tabs.splice(at,0,['unitReview','📝 Unit Review']);
  const TOPICS={1:['1.1','1.2','1.3','1.4','1.5','1.6','1.7'],2:['2.1','2.2','2.3','2.4','2.5','2.6','2.7','2.8','2.9','2.10','2.11','2.12'],3:['3.1','3.2','3.3','3.4','3.5','3.6','3.7','3.8'],4:['4.1','4.2','4.3','4.4','4.5','4.6','4.7','4.8','4.9','4.10'],5:['5.1','5.2','5.3','5.4','5.5','5.6','5.7','5.8','5.9','5.10','5.11','5.12'],6:['6.1','6.2','6.3','6.4','6.5','6.6','6.7','6.8','6.9','6.10','6.11'],7:['7.1','7.2','7.3','7.4','7.5','7.6','7.7','7.8']};
  const NAMES=['Thinking Geographically','Population & Migration','Cultural Patterns','Political Patterns','Agriculture','Cities','Development & Industry'];
  const FRAMES=[
    p=>p,
    p=>`Which choice best applies AP Human Geography to this situation? ${p}`,
    p=>`A student analyzing this geographic pattern is asked: ${p}`,
    p=>`Based on the evidence in the scenario, ${p.charAt(0).toLowerCase()+p.slice(1)}`,
    p=>`Which answer is most defensible using APHG concepts? ${p}`,
    p=>`A geographer would use the evidence to answer: ${p}`,
    p=>`Apply the most relevant geographic concept: ${p}`,
    p=>`Which concept best explains the pattern described here? ${p}`,
    p=>`On an AP-style unit assessment, which answer best fits this evidence? ${p}`,
    p=>`Use the geographic evidence, not memorized wording: ${p}`
  ];
  const seenKey='aphgUnitReviewRecentV2';
  let s={view:'home',unit:1,mode:'standard',count:35,deck:[],i:0,selected:null,answers:[],results:null};
  function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;}
  function seen(){try{return JSON.parse(localStorage.getItem(seenKey)||'{}')}catch(e){return {}}} function saveSeen(v){localStorage.setItem(seenKey,JSON.stringify(v));}
  function vocabQuestions(unit){
    const cards=(typeof flashcards!=='undefined'?flashcards:[]).filter(c=>c.unit===unit&&c.topic&&c.term&&c.ex);
    const unitTerms=[...new Set(cards.map(c=>c.term))];
    return cards.map((c,i)=>{
      const wrong=shuffle(unitTerms.filter(t=>t!==c.term)).slice(0,3);
      if(wrong.length<3)return null;
      return {id:`ur-vocab-${unit}-${i+1}`,unit,topic:c.topic,prompt:`Which AP Human Geography concept is best illustrated by this example: “${c.ex}”?`,choices:[c.term,...wrong],answer:c.term,explain:`${c.term}: ${c.def}`};
    }).filter(Boolean);
  }
  function baseFor(unit){
    const rows=quiz.filter(q=>Number(String(q[0]).replace(/\D/g,''))===unit),topics=TOPICS[unit];
    const base=rows.map((q,i)=>({id:`ur-base-${unit}-${i+1}`,unit,topic:topics[i%topics.length],prompt:q[1],choices:q[2],answer:q[3],explain:q[4]}));
    const extras=[...(window.APHG_IMAGE_MCQ_BANK||[]),...(window.APHG_STIMULUS_SET_QUESTIONS||[]),...(window.APHG_STIMULUS_SET_QUESTIONS_EXTRA||[]),...(window.APHG_REAL_DATA_QUESTIONS||[])].filter(q=>q.unit===unit).map((q,i)=>({id:q.id||`ur-extra-${unit}-${i}`,unit,topic:q.topic||topics[i%topics.length],prompt:q.prompt||q.q,choices:q.choices,answer:q.answer,explain:q.explain,stimulus:q.stimulus||q.visual,setId:q.setId}));
    return base.concat(vocabQuestions(unit),extras);
  }
  function variants(unit){return baseFor(unit).flatMap(q=>FRAMES.map((f,fi)=>({...q,id:`${q.id}-f${fi+1}`,prompt:f(q.prompt),variant:fi+1,choices:[...q.choices]})));}
  function build(unit,count,mode){
    const pool=variants(unit),memory=seen(),key=`u${unit}-${mode}`,recent=new Set(memory[key]||[]);
    let fresh=pool.filter(q=>!recent.has(q.id));if(fresh.length<count)fresh=pool;
    const byTopic={};fresh.forEach(q=>(byTopic[q.topic]??=[]).push(q));
    const topicList=TOPICS[unit],picked=[];let rounds=0;
    while(picked.length<count&&rounds<50){for(const t of topicList){const options=(byTopic[t]||[]).filter(q=>!picked.some(p=>p.id===q.id));if(options.length&&picked.length<count)picked.push(shuffle(options)[0]);}rounds++;}
    if(picked.length<count){for(const q of shuffle(fresh)){if(!picked.some(p=>p.id===q.id)){picked.push(q);if(picked.length===count)break;}}}
    let deck=picked.map(q=>({...q,choices:shuffle(q.choices)}));
    if(mode==='challenge')deck=deck.sort((a,b)=>(b.stimulus?1:0)-(a.stimulus?1:0));else deck=shuffle(deck);
    memory[key]=deck.map(q=>q.id).slice(-100);saveSeen(memory);return deck;
  }
  window.__unitReviewBuild=build;window.__unitReviewVariants=variants;window.__unitReviewTopics=TOPICS;
  function safeCount(value){const n=Math.round(Number(value));return Number.isFinite(n)?Math.min(60,Math.max(1,n)):20;}
  function start(mode,count){count=safeCount(count);s.mode=mode;s.count=count;s.deck=build(s.unit,count,mode);s.i=0;s.selected=null;s.answers=[];s.results=null;s.view='test';render();}
  window.urUnit=u=>{s.unit=Number(u);s.view='home';render();};window.urStart=(m,c)=>start(m,c);
  window.urStartCustom=()=>{const input=document.getElementById('ur-custom-count'),count=safeCount(input?.value);if(input)input.value=count;start('custom',count);};
  window.urChoose=i=>{if(s.selected!==null)return;s.selected=Number(i);const q=s.deck[s.i];s.answers.push({q,correct:q.choices[s.selected]===q.answer});render();};
  window.urNext=()=>{s.i++;s.selected=null;if(s.i>=s.deck.length){s.results=calc();s.view='results';}render();};window.urHome=()=>{s.view='home';render();};window.urWeak=()=>{const weak=new Set((s.results?.weak||[]));const pool=variants(s.unit).filter(q=>weak.has(q.topic));s.deck=shuffle(pool).slice(0,Math.min(15,pool.length)).map(q=>({...q,choices:shuffle(q.choices)}));s.i=0;s.selected=null;s.answers=[];s.view='test';render();};
  function calc(){const right=s.answers.filter(x=>x.correct).length,total=s.answers.length,by={};s.answers.forEach(x=>{by[x.q.topic]??={r:0,t:0};by[x.q.topic].t++;if(x.correct)by[x.q.topic].r++;});const weak=Object.entries(by).filter(([,v])=>v.r/v.t<.7).map(([t])=>t);return {right,total,pct:total?Math.round(right/total*100):0,by,weak};}
  const old=render;render=function(){if(active==='unitReview'){renderNav();document.getElementById('app').innerHTML=page();return;}old();};
  function page(){return `<main class="wrap">${s.view==='home'?home():s.view==='test'?test():results()}</main>`;}
  function home(){return `<section class="card"><h2>📝 Unit Review</h2><p><b>This is for your class unit test.</b> It is separate from cumulative AP Exam Prep. Choose a unit, review your weak topics, and retake with different wording/scenarios.</p><div class="filter-row">${[1,2,3,4,5,6,7].map(u=>`<button class="filter-btn ${u===s.unit?'active':''}" onclick="urUnit(${u})">Unit ${u}</button>`).join('')}</div><h3>Unit ${s.unit}: ${NAMES[s.unit-1]}</h3><div class="readiness-grid"><button class="readiness-tile" onclick="urStart('quick',10)"><b>10</b><span>Quick diagnostic</span></button><button class="readiness-tile" onclick="urStart('standard',35)"><b>35</b><span>Standard practice test</span></button><button class="readiness-tile" onclick="urStart('challenge',35)"><b>35</b><span>Challenge / more stimuli</span></button></div><div class="box-info" style="margin-top:14px"><b>Different each attempt:</b> recent variants are avoided, answer choices reshuffle, and the test cycles across all CED topics that have review questions.</div><h3>Custom practice</h3><div class="button-row">${[10,20,35,50].map(n=>`<button class="btn-secondary" onclick="urStart('custom',${n})">${n} questions</button>`).join('')}</div><div class="box-info" style="margin-top:12px"><label for="ur-custom-count"><b>Choose any number from 1–60:</b></label><div class="button-row" style="margin-top:8px"><input id="ur-custom-count" type="number" min="1" max="60" step="1" value="20" inputmode="numeric" aria-label="Number of Unit Review questions, maximum 60"><button class="btn-primary" onclick="urStartCustom()">Start my custom set</button></div><small>A maximum of 60 questions can be included in one practice set.</small></div></section>`;}
  function test(){const q=s.deck[s.i],sel=s.selected;if(!q)return `<section class="card"><h2>No questions available</h2><button onclick="urHome()">Back</button></section>`;const ok=sel!==null&&q.choices[sel]===q.answer;return `<section class="card"><div class="mastery-mini-nav"><span class="pill">Unit ${q.unit} · Topic ${q.topic}</span><span>${s.i+1}/${s.deck.length}</span></div>${q.stimulus?`<div class="box-info">${q.stimulus}</div>`:''}<h2>${q.prompt}</h2><div class="quiz-options">${q.choices.map((c,i)=>`<button class="quiz-option ${sel!==null&&c===q.answer?'correct':sel===i&&!ok?'wrong':''}" onclick="urChoose(${i})" ${sel!==null?'disabled':''}>${String.fromCharCode(65+i)}. ${c}</button>`).join('')}</div>${sel!==null?`<div class="${ok?'box-good':'box-warn'}"><b>${ok?'Correct':'0/1 on this question'}</b><p>${q.explain}</p></div><button class="btn-primary" onclick="urNext()">${s.i+1===s.deck.length?'See results':'Next question →'}</button>`:''}</section>`;}
  function results(){const r=s.results;return `<section class="card"><h2>Unit ${s.unit} Review Results</h2><div class="readiness-grid"><div class="readiness-tile"><b>${r.right}/${r.total}</b><span>correct</span></div><div class="readiness-tile"><b>${r.pct}%</b><span>score</span></div><div class="readiness-tile"><b>${r.weak.length}</b><span>topics below 70%</span></div></div><h3>CED topic breakdown</h3>${Object.entries(r.by).map(([t,v])=>`<div class="mini-progress-row"><span>Topic ${t}</span><b>${v.r}/${v.t} · ${Math.round(v.r/v.t*100)}%</b></div>`).join('')}${r.weak.length?`<div class="box-warn"><b>Review next:</b> ${r.weak.join(', ')}</div>`:`<div class="box-good"><b>Strong coverage across the unit.</b></div>`}<div class="button-row"><button class="btn-primary" onclick="urStart('standard',35)">Take a different 35-question test</button><button class="btn-secondary" onclick="urWeak()" ${r.weak.length?'':'disabled'}>Practice my weak areas</button><button class="btn-secondary" onclick="urHome()">Unit Review home</button></div></section>`;}
})();
