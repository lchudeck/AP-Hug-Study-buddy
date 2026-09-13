// PR #25: student-proof start paths without changing APHG content or rigor.
(function(){
  if(window.__studentProofV1Installed) return;
  window.__studentProofV1Installed = true;

  function safeGo(route){
    if(typeof go === 'function') go(route);
  }

  window.studentProofRoute = function(path){
    switch(path){
      case 'test': safeGo('unitReview'); break;
      case 'learn': if(typeof sspGo === 'function') sspGo('teach'); else safeGo('studentSuccess'); break;
      case 'vocab': safeGo('terms'); break;
      case 'maps': safeGo('visual'); break;
      case 'misses': safeGo('practiceMastery'); break;
      case 'frq': if(typeof sspGo === 'function') sspGo('verbs'); else safeGo('frq'); break;
      case 'ap': safeGo('apSim'); break;
      case 'unsure': if(typeof sspGo === 'function') sspGo('plan'); else safeGo('studentSuccess'); break;
      default: safeGo('home');
    }
  };

  function readiness(){
    try{return typeof window.__aphgReadinessEvidence==='function'?window.__aphgReadinessEvidence():null;}catch(e){return null;}
  }
  function readinessHtml(r){
    if(!r)return '<div class="box-info"><b>Readiness evidence is still being set up.</b><p>Complete a few practice questions, then return here.</p></div>';
    return `<div class="box-${r.enough?'good':r.done>=3?'yellow':'info'}" style="margin-top:14px"><b>${r.label}</b><p style="margin-bottom:8px">Study Buddy does not turn limited practice into a precise “ready” percentage. It looks for several kinds of evidence instead.</p><div style="display:grid;gap:6px">${r.checks.map(c=>`<div><b>${c.done?'✓':'○'} ${c.label}</b> <span style="color:#64748b">(${c.detail})</span></div>`).join('')}</div><p style="margin-bottom:0"><b>${r.enough?'You have broad evidence across the course. Keep reviewing weak topics and take full practice exams under realistic conditions.':'Keep building the unchecked evidence before treating a practice score as a readiness signal.'}</b></p></div>`;
  }

  if(typeof homePage === 'function'){
    homePage = function(){
      let snap={accuracy:null,attempted:0,weak:null};
      try{ if(typeof getMasterySnapshot==='function') snap=getMasterySnapshot()||snap; }catch(e){}
      const accuracy=snap.attempted>=10&&Number.isFinite(snap.accuracy)?`${Math.round(snap.accuracy)}%`:'Building evidence';
      const weak=snap.weak?`Unit ${snap.weak.unit}: ${snap.weak.name}`:'Complete a short practice set and Study Buddy will find it.';
      const r=readiness();
      return `<main class="wrap student-proof-home">
        <section class="card student-proof-hero">
          <div class="student-proof-kicker">Start with your problem, not a feature name</div>
          <h2>What do you need help with?</h2>
          <p class="lead">Pick the sentence that sounds most like you. Study Buddy will take you to the right tool.</p>
          <div class="student-proof-grid">
            <button class="student-proof-card" onclick="studentProofRoute('test')"><b>📚 My test is coming up</b><span>Review one unit, its vocabulary and models, then check yourself with AP-style questions.</span></button>
            <button class="student-proof-card" onclick="studentProofRoute('learn')"><b>🧠 I don’t understand this yet</b><span>Get a short CED-aligned explanation, common mix-ups, and a worked example before doing more questions.</span></button>
            <button class="student-proof-card" onclick="studentProofRoute('misses')"><b>🎯 I keep missing questions</b><span>Practice weak topics, review why an answer missed, and retry the same skill with a different question.</span></button>
            <button class="student-proof-card" onclick="studentProofRoute('vocab')"><b>📖 I know the vocab, but I can’t use it</b><span>Practice terms as geographic concepts—not just definitions or flashcard memorization.</span></button>
            <button class="student-proof-card" onclick="studentProofRoute('maps')"><b>🗺️ Maps & data confuse me</b><span>Practice reading maps, models, scale, legends, patterns, and visual evidence.</span></button>
            <button class="student-proof-card" onclick="studentProofRoute('frq')"><b>✍️ I don’t know how to write an FRQ</b><span>Start with one command word and one AP-style sentence before building toward a full FRQ.</span></button>
            <button class="student-proof-card" onclick="studentProofRoute('ap')"><b>🏆 Am I ready for the AP exam?</b><span>Use mixed-unit AP-style practice after you have learned several units and see what still needs work.</span></button>
          </div>
          <div class="student-proof-unsure">
            <div><b>Not sure what to choose?</b><span>Tell Study Buddy what unit you’re in and how much time you have. It will build your next small study plan.</span></div>
            <button class="btn-primary" onclick="studentProofRoute('unsure')">Tell me what to do next</button>
          </div>
        </section>

        <section class="card">
          <h2>My Progress</h2>
          <p>This is a quick snapshot, not a grade. Practice updates it on this device.</p>
          <div class="readiness-grid">
            <div class="readiness-tile"><b>${accuracy}</b><span>recent practice accuracy${snap.attempted<10?' (shown after 10 questions)':''}</span></div>
            <div class="readiness-tile"><b>${snap.attempted||0}</b><span>questions practiced</span></div>
            <div class="readiness-tile"><b>${weak}</b><span>recommended review</span></div>
          </div>
          ${readinessHtml(r)}
          <div class="button-row" style="margin-top:14px"><button class="btn-primary" onclick="studentProofRoute('misses')">Show me what to practice next</button><button class="btn-secondary" onclick="studentProofRoute('ap')">Open AP practice</button></div>
        </section>
      </main>`;
    };
  }

  const nextByActive={
    unitReview:{title:'What should I do next?',text:'After your unit review, do a short practice set and correct only the ideas you missed.',buttons:[['Practice what I missed','misses']]},
    practiceMastery:{title:'What should I do next?',text:'When the same topic starts making sense, switch from correction practice to mixed AP-style questions.',buttons:[['Check AP readiness','ap']]},
    terms:{title:'What should I do next?',text:'Don’t stop at the definition. Use the term in a geographic example, then answer a question where you must apply it.',buttons:[['Practice weak topics','misses']]},
    visual:{title:'What should I do next?',text:'After reading the map or model, say the strongest pattern out loud and explain what geographic process could cause it.',buttons:[['Practice weak topics','misses']]},
    frq:{title:'What should I do next?',text:'If a full FRQ feels too big, practice one command word and one sentence first.',buttons:[['Practice one FRQ sentence','frq']]},
    apSim:{title:'What should I do next?',text:'Use your misses as a study list. Go back to weak topics before taking another long mixed set.',buttons:[['Practice my weak topics','misses']]},
    studentSuccess:{title:'What should I do next?',text:'Follow the next small step in your plan. Learn first, then practice, then correct a miss before moving on.',buttons:[['Back to my choices','home']]}
  };

  function getActive(){
    try{return typeof active!=='undefined'?String(active):'';}catch(e){return '';}
  }

  function addNextStep(){
    const app=document.getElementById('app');
    if(!app || app.querySelector('.student-proof-next')) return;
    const route=getActive();
    const info=nextByActive[route];
    if(!info) return;
    const main=app.querySelector('main');
    if(!main) return;
    const section=document.createElement('section');
    section.className='card student-proof-next';
    section.setAttribute('aria-label','What should I do next?');
    section.innerHTML=`<h3>${info.title}</h3><p>${info.text}</p><div class="button-row">${info.buttons.map(b=>`<button class="btn-secondary" onclick="studentProofRoute('${b[1]}')">${b[0]}</button>`).join('')}<button class="btn-secondary" onclick="studentProofRoute('unsure')">I’m still not sure</button></div>`;
    main.appendChild(section);
  }

  let queued=false;
  const observer=new MutationObserver(function(){
    if(queued) return;
    queued=true;
    requestAnimationFrame(function(){queued=false;addNextStep();});
  });
  const app=document.getElementById('app');
  if(app) observer.observe(app,{childList:true,subtree:true});

  setTimeout(function(){
    if(getActive()==='home' && typeof render==='function') render();
    addNextStep();
  },0);
})();