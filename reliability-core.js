// Shared reliability foundation: fail-soft browser storage and privacy-safe error recovery.
(function(){
  'use strict';
  if(window.APHGSafeStorage) return;
  const memory=new Map(),diagnostics=[];
  let storageAvailable=true,noticeShown=false;
  function nativeStorage(){try{const storage=window.localStorage,probe='__aphg_storage_probe__';storage.setItem(probe,'1');storage.removeItem(probe);return storage}catch(error){storageAvailable=false;return null}}
  const storage=nativeStorage();
  function technicalFile(value){const clean=String(value||'').split(/[?#]/)[0];return clean.split('/').pop().slice(0,100)}
  function remember(kind,details){diagnostics.push({kind:String(kind||'unknown').slice(0,40),file:technicalFile(details?.file),line:Number(details?.line)||0,column:Number(details?.column)||0,time:new Date().toISOString()});if(diagnostics.length>10)diagnostics.shift()}
  function showNotice(type){
    if(noticeShown||!document.body)return;noticeShown=true;
    const storageCopy=type==='storage',box=document.createElement('aside');
    box.id='aphg-reliability-notice';box.setAttribute('role',storageCopy?'status':'alert');box.setAttribute('aria-live',storageCopy?'polite':'assertive');
    box.innerHTML=`<div><b>${storageCopy?'Your practice still works.':'Something did not load correctly.'}</b><span>${storageCopy?'This browser is not allowing saved progress. You can keep studying, but today’s progress may disappear when you close or reload this page.':'Your answers were not sent anywhere. Reload the page to restore the study tools.'}</span></div><div class="aphg-reliability-actions">${storageCopy?'':'<button type="button" data-reliability-reload>Reload</button>'}<button type="button" data-reliability-dismiss aria-label="Dismiss notice">Dismiss</button></div>`;
    document.body.appendChild(box);box.querySelector('[data-reliability-reload]')?.addEventListener('click',()=>location.reload());box.querySelector('[data-reliability-dismiss]')?.addEventListener('click',()=>box.remove());
  }
  function storageFailure(operation){storageAvailable=false;remember('storage-'+operation,{});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>showNotice('storage'),{once:true});else showNotice('storage')}
  window.APHGSafeStorage={
    getItem(key){const name=String(key);if(memory.has(name))return memory.get(name);if(!storage)return null;try{return storage.getItem(name)}catch(error){storageFailure('read');return memory.get(name)??null}},
    setItem(key,value){const name=String(key),text=String(value);memory.set(name,text);if(!storage){storageFailure('write');return false}try{storage.setItem(name,text);return true}catch(error){storageFailure('write');return false}},
    removeItem(key){const name=String(key);memory.delete(name);if(!storage){storageFailure('remove');return false}try{storage.removeItem(name);return true}catch(error){storageFailure('remove');return false}},
    isPersistent(){return storageAvailable},diagnostics(){return diagnostics.map(item=>({...item}))}
  };
  window.APStudyReliability={storage:window.APHGSafeStorage};
  function aphgHash(value){let h=2166136261;for(const char of String(value)){h^=char.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0;}
  // Prompt-seeded Fisher-Yates: repeatable for every render and independent of the current answer index.
  window.APHGShuffleChoices=function(choices,seed){const out=[...choices];let state=aphgHash(seed);for(let i=out.length-1;i>0;i--){state^=state<<13;state^=state>>>17;state^=state<<5;const j=(state>>>0)%(i+1);[out[i],out[j]]=[out[j],out[i]];}return out;};
  window.APHGSessionShuffle=function(items){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;};
  window.APHGStudentQuestionPool=function(){
    const raw=[];if(typeof quiz!=='undefined'&&Array.isArray(quiz))raw.push(...quiz);
    Object.keys(window).filter(k=>/^APHG_.*_(?:QUESTIONS|BANK)$/.test(k)&&Array.isArray(window[k])).forEach(k=>raw.push(...window[k]));
    const seen=new Set();return raw.map(item=>{
      if(!item)return null;
      const array=Array.isArray(item),prompt=array?item[1]:item.prompt||item.q||item.question;
      const choices=array?item[2]:item.choices||item.options;
      const answer=array?item[3]:item.answer??item.correctAnswer??item.correct;
      const unit=Number(array?String(item[0]||'').match(/\d+/)?.[0]:item.unit);
      const topic=String(item.topic||''),explain=array?item[4]:item.explain||item.why||item.explanation;
      const stimulus=array?item.stimulus||item.visual:item.stimulus||item.visual;
      if(!Number.isInteger(unit)||unit<1||unit>7||typeof prompt!=='string'||!prompt.trim()||!Array.isArray(choices)||choices.length!==4||new Set(choices.map(x=>String(x).trim().toLowerCase())).size!==4||!choices.includes(answer))return null;
      return {unit,topic,prompt,choices:[...choices],answer,explain:explain||'Review the evidence and the geographic concept.',stimulus:stimulus||'',stimulusTitle:item.stimulusTitle||''};
    }).filter(q=>{if(!q)return false;const key=q.prompt.trim().toLowerCase().replace(/\s+/g,' ');if(seen.has(key))return false;seen.add(key);return true;});
  };

  function requiredAsset(target){
    if(!target?.matches?.('script[src],link[rel="stylesheet"][href]'))return false;
    const value=target.src||target.href;
    try{return new URL(value,location.href).origin===location.origin}catch(error){return false}
  }
  window.addEventListener('error',event=>{
    const target=event.target;
    if(target&&target!==window){remember('asset-error',{file:target.src||target.href});if(!requiredAsset(target))return}
    else remember('script-error',{file:event.filename,line:event.lineno,column:event.colno});
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>showNotice('error'),{once:true});else showNotice('error');
  },true);
  window.addEventListener('unhandledrejection',()=>{remember('promise-rejection',{});showNotice('error')});
})();
