// First-time student usability fixes discovered during student-style testing.
(function(){
  if(window.__studentUxInstalled) return;
  window.__studentUxInstalled=true;

  // Make the best study path obvious to a student landing on the site for the first time.
  if(typeof homePage==='function'){
    const baseHome=homePage;
    homePage=function(){
      const html=baseHome();
      const guide=`<section class="card" style="margin-top:18px">
        <h2>👋 New here? Use this path</h2>
        <p>If you are studying for the AP exam and are not sure where to begin, do these in order. You do not need to finish everything in one sitting.</p>
        <div class="path-grid">
          <button class="path-card path-green" onclick="go('ced')"><b>1. Find your gaps</b><p>Open the CED Guide and mark what you can actually explain.</p></button>
          <button class="path-card path-yellow" onclick="go('quiz')"><b>2. Practice a unit</b><p>Use questions and explanations to fix weak content.</p></button>
          <button class="path-card path-yellow" onclick="go('examLab')"><b>3. Apply it</b><p>Work with stimuli and mini-FRQs instead of only recalling terms.</p></button>
          <button class="path-card path-red" onclick="go('apSim')"><b>4. Test yourself</b><p>Use the AP Simulator after you have reviewed several units.</p></button>
        </div>
        <div class="box-info"><b>Best rule:</b> Do not just read the correct answer. Try the question first, then explain why the correct answer is correct and why one distractor is wrong.</div>
      </section>`;
      return html.replace('</main>',guide+'</main>');
    };
  }

  // Post-render student-facing clarifications.
  const baseRender=render;
  render=function(){
    baseRender();
    if(active==='apSim') polishSimulator();
  };

  function polishSimulator(){
    const app=document.getElementById('app');
    if(!app) return;
    const h3=[...app.querySelectorAll('h3')].find(x=>x.textContent.includes('Mixed-Unit Challenge'));
    if(h3){
      h3.textContent='🔀 Mixed-Unit Answer Review';
      const p=h3.nextElementSibling;
      if(p) p.innerHTML='<b>Use this section after attempting a mixed question on your own.</b> The answer appears when you open a prompt, so this is an explanation/review tool rather than a scored quiz.';
    }
    updateTimerText();
  }

  let timerStartedAt=0;
  let timerId=null;
  const SIM_SECONDS=19*60; // 19 current simulator questions, ~1 minute each.

  document.addEventListener('click',function(e){
    const el=e.target.closest('button');
    if(!el) return;
    const oc=el.getAttribute('onclick')||'';
    if(oc.includes('apStartSim')){
      timerStartedAt=Date.now();
      startTimer();
    }
    if(oc.includes('apSubmitSim')) stopTimer();
  },true);

  function startTimer(){
    stopTimer(false);
    timerId=setInterval(function(){
      if(active!=='apSim') return;
      const remaining=Math.max(0,SIM_SECONDS-Math.floor((Date.now()-timerStartedAt)/1000));
      updateTimerText(remaining);
      if(remaining<=0){
        stopTimer();
        if(typeof window.apSubmitSim==='function') window.apSubmitSim();
      }
    },1000);
  }

  function stopTimer(reset=true){
    if(timerId){clearInterval(timerId);timerId=null;}
    if(reset) timerStartedAt=0;
  }

  function updateTimerText(forcedRemaining){
    if(!timerStartedAt) return;
    const app=document.getElementById('app');
    if(!app) return;
    const status=[...app.querySelectorAll('.mastery-mini-nav b')].find(x=>x.textContent.includes('Simulation in progress'));
    if(!status) return;
    const remaining=forcedRemaining===undefined?Math.max(0,SIM_SECONDS-Math.floor((Date.now()-timerStartedAt)/1000)):forcedRemaining;
    const m=String(Math.floor(remaining/60)).padStart(2,'0');
    const s=String(remaining%60).padStart(2,'0');
    status.textContent=`Simulation in progress · ${m}:${s} remaining`;
  }
})();
