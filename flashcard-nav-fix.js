// PR #6: fix adaptive vocabulary flashcard controls that referenced a render-local `cards` variable.
(function(){
  if(window.__flashcardNavFixInstalled || typeof adaptiveFlashcardsHtml!=='function') return;
  window.__flashcardNavFixInstalled=true;

  function resetCardWork(){
    flashFlipped=false;
    if(typeof flashFrqAnswer!=='undefined') flashFrqAnswer='';
    if(typeof flashFrqFeedback!=='undefined') flashFrqFeedback=null;
  }
  window.flashPrev=function(){
    const deck=currentFlashDeck();
    if(!deck.length) return;
    flashIndex=(flashIndex-1+deck.length)%deck.length;
    resetCardWork();
    render();
  };
  window.flashNext=function(){
    const deck=currentFlashDeck();
    if(!deck.length) return;
    flashIndex=(flashIndex+1)%deck.length;
    resetCardWork();
    render();
  };
  window.flashFlip=function(){
    flashFlipped=!flashFlipped;
    render();
  };

  const old=adaptiveFlashcardsHtml;
  adaptiveFlashcardsHtml=function(){
    let html=old();
    html=html.replace(/onclick="flashIndex=\(flashIndex-1\+cards\.length\)%cards\.length;flashFlipped=false;flashFrqAnswer='';flashFrqFeedback=null;render\(\)"/g,'onclick="flashPrev()"');
    html=html.replace(/onclick="flashIndex=\(flashIndex\+1\)%cards\.length;flashFlipped=false;flashFrqAnswer='';flashFrqFeedback=null;render\(\)"/g,'onclick="flashNext()"');
    html=html.replace(/onclick="flashFlipped=!flashFlipped;render\(\)"/g,'onclick="flashFlip()"');
    return html;
  };

  function loadUnits27Coach(){
    if(document.querySelector('script[data-personal-coach-27]')) return;
    const u=document.createElement('script');
    u.src='personalized-units2-7-coach.js';
    u.dataset.personalCoach27='true';
    u.defer=true;
    document.body.appendChild(u);
  }

  function loadPersonalCoach(){
    const existing=document.querySelector('script[data-personal-coach]');
    if(existing){
      if(window.__personalizedUnit1CoachInstalled) loadUnits27Coach();
      else existing.addEventListener('load',loadUnits27Coach,{once:true});
      return;
    }
    const p=document.createElement('script');
    p.src='personalized-unit1-coach.js';
    p.dataset.personalCoach='true';
    p.defer=true;
    p.addEventListener('load',loadUnits27Coach,{once:true});
    document.body.appendChild(p);
  }

  // Load the student-readiness upgrade after the core navigation and flashcards exist,
  // then layer the personalized coaches on top of the audited/adaptive systems.
  const existingReadiness=document.querySelector('script[data-readiness-upgrade]');
  if(!existingReadiness){
    const s=document.createElement('script');
    s.src='student-readiness-upgrades.js';
    s.dataset.readinessUpgrade='true';
    s.defer=true;
    s.addEventListener('load',loadPersonalCoach,{once:true});
    document.body.appendChild(s);
  }else if(existingReadiness.dataset.loaded==='true'){
    loadPersonalCoach();
  }else{
    existingReadiness.addEventListener('load',()=>{existingReadiness.dataset.loaded='true';loadPersonalCoach();},{once:true});
    // Dynamic scripts may already be complete before this listener is attached.
    setTimeout(loadPersonalCoach,0);
  }
})();