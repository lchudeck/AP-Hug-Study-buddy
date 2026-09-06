// PR #24: Accessibility & Inclusive Student Experience
(function(){
  if(window.__aphgAccessibilityInstalled)return;
  window.__aphgAccessibilityInstalled=true;

  const FOCUSABLE='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  let previousFocus=null;

  function ensureSkipLink(){
    if(document.querySelector('.skip-link'))return;
    const a=document.createElement('a');
    a.className='skip-link';a.href='#app';a.textContent='Skip to Study Buddy content';
    document.body.insertBefore(a,document.body.firstChild);
    const app=document.getElementById('app');if(app&&!app.hasAttribute('tabindex'))app.tabIndex=-1;
  }

  function ensureLiveRegion(){
    let r=document.getElementById('aphg-a11y-live');
    if(!r){r=document.createElement('div');r.id='aphg-a11y-live';r.className='a11y-live-region';r.setAttribute('role','status');r.setAttribute('aria-live','polite');r.setAttribute('aria-atomic','true');document.body.appendChild(r)}
    return r;
  }
  function announce(text){const r=ensureLiveRegion();r.textContent='';setTimeout(()=>{r.textContent=String(text||'')},20)}

  function statusText(el){
    const t=(el.textContent||'').trim();
    if(el.classList.contains('correct')||el.classList.contains('explain-good')||el.classList.contains('part-earned')||el.classList.contains('box-good'))return `Correct. ${t}`;
    if(el.classList.contains('wrong')||el.classList.contains('explain-bad')||el.classList.contains('part-missing')||el.classList.contains('box-warn'))return `Needs review. ${t}`;
    return t;
  }

  function addNonColorCue(el,label){
    if(el.dataset.a11yCue)return;el.dataset.a11yCue='true';
    if(!el.querySelector(':scope > .a11y-status-prefix')){
      const s=document.createElement('span');s.className='a11y-status-prefix';s.textContent=label+' ';
      el.insertBefore(s,el.firstChild);
    }
  }

  function enhanceStatuses(root=document){
    root.querySelectorAll?.('.choice-btn.correct').forEach(el=>{el.setAttribute('aria-label',`Correct answer: ${(el.textContent||'').trim()}`);addNonColorCue(el,'✓ Correct:')});
    root.querySelectorAll?.('.choice-btn.wrong').forEach(el=>{el.setAttribute('aria-label',`Incorrect answer: ${(el.textContent||'').trim()}`);addNonColorCue(el,'✕ Incorrect:')});
    root.querySelectorAll?.('.explain-good,.explain-bad,.part-result,.ai-result,.score-badge,.box-good,.box-warn').forEach(el=>{if(!el.hasAttribute('role'))el.setAttribute('role','status');if(!el.hasAttribute('aria-live'))el.setAttribute('aria-live','polite')});
  }

  function dialogPanel(dialog){return dialog.querySelector(':scope > div')||dialog.firstElementChild||dialog}
  function enhanceDialogs(root=document){
    root.querySelectorAll?.('[role="dialog"],[aria-modal="true"]').forEach(dialog=>{
      if(dialog.dataset.a11yDialog)return;dialog.dataset.a11yDialog='true';
      previousFocus=document.activeElement;
      dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');
      const panel=dialogPanel(dialog);panel.classList.add('a11y-dialog-panel');panel.tabIndex=-1;
      const heading=dialog.querySelector('h1,h2,h3');
      if(heading){if(!heading.id)heading.id='a11y-dialog-title-'+Math.random().toString(36).slice(2,9);dialog.setAttribute('aria-labelledby',heading.id);dialog.removeAttribute('aria-label')}
      const close=dialog.querySelector('button[aria-label*="Close"],button[aria-label*="close"]');
      requestAnimationFrame(()=>{(close||dialog.querySelector(FOCUSABLE)||panel).focus({preventScroll:true})});
      dialog.addEventListener('keydown',e=>{
        if(e.key==='Escape'&&close&&!close.disabled){e.preventDefault();close.click();return}
        if(e.key!=='Tab')return;
        const items=[...dialog.querySelectorAll(FOCUSABLE)].filter(x=>x.offsetParent!==null);
        if(!items.length){e.preventDefault();panel.focus();return}
        const first=items[0],last=items[items.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
      });
    });
  }

  function restoreFocusForRemovedDialogs(){
    if(document.querySelector('[role="dialog"],[aria-modal="true"]'))return;
    if(previousFocus&&document.contains(previousFocus)&&typeof previousFocus.focus==='function'){previousFocus.focus({preventScroll:true})}
    previousFocus=null;
  }

  function enhanceControls(root=document){
    root.querySelectorAll?.('button').forEach(b=>{
      if(!b.getAttribute('type'))b.setAttribute('type','button');
      const txt=(b.textContent||'').trim();
      if(!txt&&!b.getAttribute('aria-label'))b.setAttribute('aria-label','Study Buddy control');
    });
    root.querySelectorAll?.('textarea,input,select').forEach(el=>{
      if(el.getAttribute('aria-label')||el.getAttribute('aria-labelledby')||el.id&&document.querySelector(`label[for="${CSS.escape(el.id)}"]`))return;
      const near=el.closest('.scaffold-box,.card,.quiz-question')?.querySelector('label,h2,h3,b');
      if(near)el.setAttribute('aria-label',(near.textContent||'Response').trim().slice(0,120));
    });
  }

  function enhanceFlashcards(root=document){
    root.querySelectorAll?.('.flashcard').forEach(card=>{
      if(card.tagName==='BUTTON')return;
      if(!card.hasAttribute('tabindex'))card.tabIndex=0;
      card.setAttribute('role','button');
      if(!card.getAttribute('aria-label'))card.setAttribute('aria-label','Flashcard. Press Enter or Space to flip.');
      if(card.dataset.a11yKey)return;card.dataset.a11yKey='true';
      card.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&typeof window.flashFlip==='function'){e.preventDefault();window.flashFlip();announce('Flashcard flipped')}});
    });
  }

  function addLandmarks(){
    const nav=document.getElementById('nav');if(nav&&!nav.getAttribute('aria-label'))nav.setAttribute('aria-label','Study Buddy sections');
    const app=document.getElementById('app');if(app&&!app.getAttribute('role'))app.setAttribute('role','main');
  }

  function enhance(root=document){ensureSkipLink();ensureLiveRegion();addLandmarks();enhanceControls(root);enhanceFlashcards(root);enhanceStatuses(root);enhanceDialogs(root)}

  let lastFeedback='';
  const observer=new MutationObserver(muts=>{
    muts.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)enhance(n)}));
    enhance(document);
    const candidate=document.querySelector('.explain-good:last-of-type,.explain-bad:last-of-type,.part-result:last-of-type,.ai-result:last-of-type,[role="dialog"] [role="status"]:last-of-type');
    if(candidate){const text=statusText(candidate);if(text&&text!==lastFeedback){lastFeedback=text;announce(text.slice(0,500))}}
    restoreFocusForRemovedDialogs();
  });

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{enhance(document);observer.observe(document.body,{childList:true,subtree:true,class:true})},{once:true});
  else{enhance(document);observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','disabled','aria-hidden']})}

  window.APHGAccessibility={announce,enhance};
})();
