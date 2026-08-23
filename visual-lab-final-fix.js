// Final load-order repair for the visual learning experience.
// Later modules can replace render(), so this runs last and guarantees the visual route remains reachable.
(function(){
  if(window.__visualLabFinalFixInstalled || typeof tabs==='undefined' || typeof render==='undefined') return;
  window.__visualLabFinalFixInstalled=true;

  const visualTab=tabs.find(t=>t[0]==='visualLab');
  if(visualTab) visualTab[1]='🗺️ Maps & Visual Practice';

  const currentRender=render;
  render=function(){
    if(active==='visualLab'){
      if(typeof renderNav==='function') renderNav();
      const app=document.getElementById('app');
      // visualPage/drawVisuals are private to the original module, so reopen through the
      // original visual render captured before later modules replaced it.
      if(typeof window.__openVisualLab==='function') return window.__openVisualLab();
    }
    return currentRender();
  };

  // Use event delegation as a second safety net: the visible tab always opens the route.
  const nav=document.getElementById('nav');
  if(nav){
    nav.addEventListener('click',function(e){
      const b=e.target.closest('button');
      if(!b || !/Maps & Visual Practice|Visual Lab/i.test(b.textContent||'')) return;
      active='visualLab';
      if(typeof window.__openVisualLab==='function') window.__openVisualLab();
    });
  }
  if(typeof renderNav==='function') renderNav();
})();