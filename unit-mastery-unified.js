// PR #6: one Unit Mastery entry for all seven units.
(function(){
  if(window.__unitMasteryUnifiedInstalled||typeof tabs==='undefined'||typeof render==='undefined')return;
  window.__unitMasteryUnifiedInstalled=true;
  for(let i=tabs.length-1;i>=0;i--){if(['foundations','mastery37','unitMasteryAll'].includes(tabs[i][0]))tabs.splice(i,1);}
  const at=Math.max(1,tabs.findIndex(t=>t[0]==='ced'));
  tabs.splice(at,0,['unitMasteryAll','📚 Unit Mastery']);
  const baseRender=render;
  render=function(){
    if(active==='unitMasteryAll'){renderNav();document.getElementById('app').innerHTML=hub();return;}
    baseRender();
  };
  const baseNav=renderNav;
  renderNav=function(){
    baseNav();
    if(active==='foundations'||active==='mastery37'){
      const buttons=[...document.querySelectorAll('#nav button')];
      buttons.forEach(b=>b.classList.toggle('active',(b.textContent||'').includes('Unit Mastery')));
    }
  };
  window.umOpen=function(u){
    u=Number(u);
    if(u<=2){active='foundations';window.foundationUnit(u);}
    else{active='mastery37';window.m37Unit(u);}
  };
  function hub(){return `<main class="wrap"><section class="card"><h2>📚 Unit Mastery</h2><p>Choose the unit you are learning. Every unit follows the same goal: learn the CED content, master vocabulary, practice, apply it, and check mastery.</p><div class="readiness-grid">${[1,2,3,4,5,6,7].map(u=>`<button class="readiness-tile" style="cursor:pointer;text-align:left" onclick="umOpen(${u})"><b>Unit ${u}</b><span>${['Thinking Geographically','Population & Migration','Cultural Patterns','Political Patterns','Agriculture','Cities','Development & Industry'][u-1]}</span></button>`).join('')}</div><div class="box-info" style="margin-top:14px"><b>Studying for a unit test?</b> Use <b>Unit Review</b> for a 35-question practice test. Use Unit Mastery when you need to learn or relearn a topic.</div></section></main>`;}
})();