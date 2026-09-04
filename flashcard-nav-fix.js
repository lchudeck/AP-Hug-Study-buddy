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

  // Load the student-readiness upgrade after the core navigation and flashcards exist.
  if(!document.querySelector('script[data-readiness-upgrade]')){
    const s=document.createElement('script');
    s.src='student-readiness-upgrades.js';
    s.dataset.readinessUpgrade='true';
    s.defer=true;
    document.body.appendChild(s);
  }
})();