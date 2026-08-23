(()=>{
  const nav=document.getElementById('nav');
  const app=document.getElementById('app');
  if(!nav||!app)return;

  const primary=[/home/i,/unit review/i,/practice.*mastery|mastery.*practice/i,/key terms|vocabulary/i,/frq coach/i];
  const secondary=[/ap exam|exam lab|simulator/i,/models|visual/i,/progress|dashboard/i];

  function polishNav(){
    const buttons=[...nav.querySelectorAll('button')];
    buttons.forEach((b,i)=>{
      const t=b.textContent.trim();
      b.classList.remove('nav-core','nav-more');
      if(primary.some(r=>r.test(t))) b.classList.add('nav-core');
      else b.classList.add('nav-more');
      b.setAttribute('aria-label',t);
      if(i===0)b.classList.add('nav-first');
    });
    if(buttons.some(b=>b.classList.contains('nav-more'))) nav.classList.add('nav-has-more');
  }

  function clickNav(re){
    const b=[...nav.querySelectorAll('button')].find(x=>re.test(x.textContent));
    if(b){b.click();window.scrollTo({top:0,behavior:'smooth'});}
  }

  function resultIsVisible(){
    const text=(app.textContent||'').replace(/\s+/g,' ');
    return !!app.querySelector('.score-circle,.quiz-results,.practice-results,.unit-review-results,.ai-result') ||
      /(practice|review|quiz|session) complete|you finished|your score/i.test(text);
  }

  function addPayoff(){
    if(!resultIsVisible())return;
    if(app.querySelector('.freshman-progress-payoff'))return;
    const result=app.querySelector('.score-circle,.quiz-results,.practice-results,.unit-review-results,.ai-result');
    if(!result)return;
    const host=result.closest('.card')||result.parentElement;
    if(!host)return;
    const box=document.createElement('section');
    box.className='freshman-progress-payoff';
    box.setAttribute('aria-label','Study session progress');
    box.innerHTML=`<div class="payoff-check">✓</div><div class="payoff-copy"><b>Nice work — that practice counted.</b><span>You just gave Study Buddy better evidence about what you know. Keep the momentum going with one small next step.</span><div class="payoff-actions"><button type="button" data-next="weak">Practice a weak spot</button><button type="button" data-next="unit">Review my unit</button><button type="button" data-next="home">I'm done for now</button></div></div>`;
    host.appendChild(box);
    box.querySelector('[data-next="weak"]').addEventListener('click',()=>clickNav(/practice.*mastery|mastery.*practice/i));
    box.querySelector('[data-next="unit"]').addEventListener('click',()=>clickNav(/unit review/i));
    box.querySelector('[data-next="home"]').addEventListener('click',()=>clickNav(/home/i));
  }

  const observer=new MutationObserver(()=>{
    polishNav();
    addPayoff();
  });
  observer.observe(document.body,{childList:true,subtree:true});
  polishNav();
  setTimeout(addPayoff,250);
})();
