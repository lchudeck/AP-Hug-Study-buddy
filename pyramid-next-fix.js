// PR #6 UX fix: after answering a population-pyramid drill, put the next action beside the feedback.
(function(){
  if(window.__pyramidNextFixInstalled) return;
  window.__pyramidNextFixInstalled=true;
  function addNext(){
    const app=document.getElementById('app'); if(!app) return;
    const heading=[...app.querySelectorAll('h1,h2,h3')].find(x=>/Population Pyramid Drill/i.test(x.textContent));
    if(!heading) return;
    const correct=app.querySelector('.quiz-option.correct, .correct');
    if(!correct || document.getElementById('pyramid-inline-next')) return;
    const existing=[...app.querySelectorAll('button')].find(b=>/Next pyramid|Next question/i.test(b.textContent));
    if(!existing) return;
    const btn=document.createElement('button');
    btn.id='pyramid-inline-next';btn.type='button';btn.className='btn-primary';btn.textContent='Next question →';
    btn.style.cssText='display:block;width:100%;max-width:360px;margin:16px 0;font-size:17px';
    btn.onclick=()=>existing.click();
    const feedback=correct.closest('.card')||correct.parentElement;
    const anchor=[...app.querySelectorAll('.box-good,.explain-good,.callout')].find(x=>x.compareDocumentPosition(correct)&Node.DOCUMENT_POSITION_PRECEDING);
    (anchor||feedback||correct).insertAdjacentElement('afterend',btn);
  }
  const obs=new MutationObserver(()=>requestAnimationFrame(addNext));
  function start(){const app=document.getElementById('app');if(app)obs.observe(app,{childList:true,subtree:true,attributes:true,classFilter:['class']});addNext();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();