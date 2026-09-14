// First-time student usability fixes discovered during student-style testing.
(function(){
  if(window.__studentUxInstalled) return;
  window.__studentUxInstalled=true;

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
