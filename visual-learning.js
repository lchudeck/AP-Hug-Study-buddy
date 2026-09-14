// Register the Maps & Visuals destination. The authoritative renderer lives in
// final-freshman-polish.js; keeping this file as a small route bridge avoids a
// second map UI and prevents runtime CDN/Census API failures.
(function(){
  if(window.__visualLearningInstalled||typeof tabs==='undefined'||typeof render==='undefined')return;
  window.__visualLearningInstalled=true;

  if(!tabs.some(tab=>tab&&tab[0]==='visualLab')){
    const foundationIndex=tabs.findIndex(tab=>tab&&tab[0]==='foundations');
    tabs.splice(foundationIndex>=0?foundationIndex+1:Math.max(1,tabs.length-1),0,['visualLab','🗺️ Maps & Visuals']);
  }

  const baseRender=render;
  render=function(){
    if(active==='visualLab'&&typeof window.openMapsVisuals==='function'){
      window.openMapsVisuals();
      return;
    }
    return baseRender();
  };
})();
