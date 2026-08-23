// Visual learning layer: authentic geography where practical; clearly labeled schematics for models.
(function(){
  if(window.__visualLearningInstalled || typeof tabs==='undefined' || typeof render==='undefined') return;
  window.__visualLearningInstalled=true;
  const foundationIndex=tabs.findIndex(t=>t[0]==='foundations');
  tabs.splice(foundationIndex>=0?foundationIndex+1:Math.max(1,tabs.length-1),0,['visualLab','🗺️ Maps & Visual Practice']);

  let section='maps';
  const oldRender=render;
  function visualPage(){
    const content=section==='maps'?`<h3>Unit 1: Map Types</h3><div class="visual-grid"><div class="visual-card"><b>Reference maps</b><p>Locate places and boundaries.</p></div><div class="visual-card"><b>Choropleth maps</b><p>Areas are shaded by a value.</p></div><div class="visual-card"><b>Proportional-symbol maps</b><p>Larger symbols represent larger values.</p></div><div class="visual-card"><b>Dot-density maps</b><p>Each dot represents a fixed amount.</p></div><div class="visual-card"><b>Isoline maps</b><p>Lines connect places with equal values.</p></div><div class="visual-card"><b>Cartograms</b><p>Area size is distorted to represent data.</p></div></div><div class="box-info"><b>AP habit:</b> Identify what visual variable changes, describe the spatial pattern, then explain what it suggests.</div>`:section==='spatial'?`<h3>Unit 1: Spatial Concepts</h3><div class="visual-grid"><div class="visual-card"><b>Clustered, dispersed, linear</b><p>Describe the evidence before explaining the pattern.</p></div><div class="visual-card"><b>GIS layers</b><p>Combine location-based data to reveal relationships.</p></div><div class="visual-card"><b>Scale of analysis</b><p>National patterns can hide regional and local differences.</p></div><div class="visual-card"><b>Distance decay</b><p>Interaction often decreases as distance increases.</p></div></div>`:`<h3>Unit 2: Population & Migration</h3><div class="visual-grid"><div class="visual-card"><b>Rapid-growth population pyramid</b><p>Wide younger cohorts often signal high birth rates and future population momentum.</p></div><div class="visual-card"><b>Aging population pyramid</b><p>Larger older cohorts can increase pension and health-care pressures.</p></div><div class="visual-card"><b>Demographic Transition Model</b><p>Compare changes in birth and death rates as development changes.</p></div><div class="visual-card"><b>Migration flows</b><p>Use arrows, origins, destinations, push/pull factors, and consequences.</p></div></div>`;
    return `<main class="wrap"><section class="card"><h2>🗺️ Maps & Visual Practice</h2><p>Practice interpreting the maps, graphs, models, and spatial patterns AP Human Geography expects you to understand.</p><div class="button-row"><button class="${section==='maps'?'btn-primary':'btn-secondary'}" onclick="visualSection('maps')">Unit 1 Maps</button><button class="${section==='spatial'?'btn-primary':'btn-secondary'}" onclick="visualSection('spatial')">Spatial Concepts</button><button class="${section==='population'?'btn-primary':'btn-secondary'}" onclick="visualSection('population')">Unit 2 Population</button></div></section><section class="card">${content}</section></main>`;
  }
  function open(){
    active='visualLab';
    if(typeof renderNav==='function') renderNav();
    const app=document.getElementById('app');
    if(app) app.innerHTML=visualPage();
  }
  window.__openVisualLab=open;
  window.visualSection=v=>{section=v;open();};
  render=function(){if(active==='visualLab') return open(); return oldRender();};
})();