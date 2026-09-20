// Student-proof start paths and evidence-based readiness.
(function(){
  if(window.__studentProofV1Installed)return;
  window.__studentProofV1Installed=1;

  const G=r=>{if(typeof go==='function')go(r)};
  const currentUnit=()=>{
    try{return Number(JSON.parse(window.APHGSafeStorage.getItem('aphgStudentSuccessV1')||'{}').unit)||1;}catch(e){return 1;}
  };
  window.studentProofRoute=p=>{
    if(p==='test')G('unitReview');
    else if(p==='learn')typeof sspGo==='function'?sspGo('teach'):G('studentSuccess');
    else if(p==='vocab'){selectedUnit=currentUnit();G('terms');}
    else if(p==='maps')typeof window.openMapsVisuals==='function'?window.openMapsVisuals():G('visualLab');
    else if(p==='misses')G('practiceMastery');
    else if(p==='frq'){
      if(typeof prompts!=='undefined'){
        const idx=prompts.findIndex(item=>Number(item&&item.unit)===currentUnit());
        if(idx>=0)selectedPrompt=idx;
      }
      G('frq');
    }
    else if(p==='ap')G('apSim');
    else if(p==='unsure')typeof sspGo==='function'?sspGo('plan'):G('studentSuccess');
    else G('home');
  };

  // Use one delegated listener rather than relying only on inline handlers.
  // This is more reliable on iOS Safari when the home screen is re-rendered.
  document.addEventListener('click',e=>{
    const target=e.target.closest('[data-student-route]');
    if(!target)return;
    const route=target.getAttribute('data-student-route');
    if(!route)return;
    e.preventDefault();
    window.studentProofRoute(route);
  });

  const N={unitReview:['After your unit review, do a short practice set and correct only the ideas you missed.','misses','Practice what I missed'],practiceMastery:['When a topic starts making sense, switch to mixed AP-style questions.','ap','Check AP readiness'],terms:['Use the term in a geographic example, then apply it.','misses','Practice weak topics'],visualLab:['Name the strongest pattern and explain what could cause it.','misses','Practice weak topics'],frq:['If a full FRQ feels too big, practice one sentence first.','frq','Practice one FRQ sentence'],apSim:['Use your misses as a study list before another long mixed set.','misses','Practice my weak topics'],studentSuccess:['Learn, practice, then correct a miss before moving on.','home','Back to my choices']};

  function A(){
    const app=document.getElementById('app');
    if(!app||app.querySelector('.student-proof-next'))return;
    let k='';
    try{k=String(active||'')}catch(e){}
    const n=N[k],m=app.querySelector('main');
    if(!n||!m)return;
    const x=document.createElement('section');
    x.className='card student-proof-next';
    x.setAttribute('aria-label','What should I do next?');
    x.innerHTML=`<h3>What should I do next?</h3><p>${n[0]}</p><div class="button-row"><button type="button" class="btn-secondary" data-student-route="${n[1]}">${n[2]}</button><button type="button" class="btn-secondary" data-student-route="unsure">I’m still not sure</button></div>`;
    m.appendChild(x);
  }

  let q=0;
  const app=document.getElementById('app');
  const o=new MutationObserver(()=>{if(q)return;q=1;requestAnimationFrame(()=>{q=0;A()})});
  if(app)o.observe(app,{childList:true,subtree:true});
  setTimeout(()=>{try{if(active==='home'&&typeof render==='function')render()}catch(e){}A()},0);
})();
