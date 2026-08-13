// PR #6 final navigation cleanup. Runs after all feature modules so development-only duplicate tabs cannot reappear.
(function(){
  if(typeof tabs==='undefined'||typeof render==='undefined')return;
  const masteryKeys=new Set(['foundations','mastery37','unitMasteryAll']);
  let insertAt=tabs.findIndex(t=>masteryKeys.has(t[0]));
  if(insertAt<0)insertAt=Math.max(1,tabs.findIndex(t=>t[0]==='ced'));
  for(let i=tabs.length-1;i>=0;i--)if(masteryKeys.has(tabs[i][0]))tabs.splice(i,1);
  tabs.splice(insertAt,0,['unitMasteryAll','📚 Unit Mastery']);
  const seen=new Set();
  for(let i=tabs.length-1;i>=0;i--){
    const key=tabs[i][0],label=tabs[i][1],sig=key+'|'+label;
    if(seen.has(sig)||(label.includes('Unit Mastery')&&key!=='unitMasteryAll'))tabs.splice(i,1);else seen.add(sig);
  }
  if(typeof go==='function'){
    const baseGo=go;
    go=function(page){
      if(page==='unitReview'&&typeof window.urHome==='function'){
        active='unitReview';
        window.urHome();
        return;
      }
      baseGo(page);
    };
  }
  window.__pr6NavFinalized=true;
  render();
})();