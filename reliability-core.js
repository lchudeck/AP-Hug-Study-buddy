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
