// Once-per-session, privacy-safe Study Buddy rating via Netlify Forms.
(function(){
  if(window.__studyBuddySessionRatingInstalled) return;
  window.__studyBuddySessionRatingInstalled=true;

  const PROMPT_DELAY_MS=8*60*1000;
  const SEEN_KEY='studyBuddySessionRatingSeen';
  let timer;

  function context(){
    const section=(typeof active!=='undefined'&&active)?active:'unknown';
    const title=document.querySelector('main h2, main h1')?.textContent?.trim()||document.title;
    return {section,title,url:location.href};
  }
  function eligible(){
    try{return !sessionStorage.getItem(SEEN_KEY);}catch(e){return true;}
  }
  function markSeen(){try{sessionStorage.setItem(SEEN_KEY,'1');}catch(e){}}
  function schedule(){
    if(!eligible()) return;
    clearTimeout(timer);
    timer=setTimeout(open,PROMPT_DELAY_MS);
  }
  function open(){
    if(!eligible()||document.getElementById('session-rating-modal')) return;
    markSeen();
    const c=context(),wrap=document.createElement('div');
    wrap.id='session-rating-modal';
    wrap.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:10000;display:flex;align-items:center;justify-content:center;padding:18px';
    wrap.innerHTML=`<div role="dialog" aria-modal="true" aria-labelledby="session-rating-title" style="background:white;color:#111;max-width:460px;width:100%;border-radius:16px;padding:20px;max-height:90vh;overflow:auto"><div style="display:flex;justify-content:space-between;gap:12px;align-items:start"><div><h2 id="session-rating-title" style="margin:0 0 6px">How was Study Buddy today?</h2><p style="margin-top:0">One quick rating helps us make it better for students.</p></div><button type="button" id="session-rating-close" aria-label="Not now" style="font-size:22px;border:0;background:transparent;cursor:pointer;min-width:44px;min-height:44px">×</button></div><fieldset style="border:0;padding:0;margin:0 0 14px"><legend><b>Rate this study session</b></legend><div id="session-stars" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">${[1,2,3,4,5].map(n=>`<button type="button" data-rating="${n}" aria-label="${n} out of 5 stars" style="font-size:28px;border:1px solid #d1d5db;background:#fff;border-radius:10px;min-width:48px;min-height:48px;cursor:pointer">☆</button>`).join('')}</div></fieldset><fieldset style="border:0;padding:0;margin:0 0 14px"><legend><b>What best describes your session?</b></legend><label style="display:block;margin:8px 0"><input type="radio" name="session-result" value="Helped me understand"> Helped me understand</label><label style="display:block;margin:8px 0"><input type="radio" name="session-result" value="Easy to use"> Easy to use</label><label style="display:block;margin:8px 0"><input type="radio" name="session-result" value="Still stuck"> I’m still stuck</label><label style="display:block;margin:8px 0"><input type="radio" name="session-result" value="Confusing to use"> It was confusing to use</label></fieldset><div id="session-rating-status" aria-live="polite"></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" id="session-rating-send" disabled style="padding:10px 14px;font-weight:700;min-height:44px;cursor:pointer">Send rating</button><button type="button" id="session-rating-later" style="padding:10px 14px;min-height:44px;cursor:pointer">Not now</button></div><p style="font-size:12px;margin-bottom:0">No name, email, answers, or written work are collected.</p></div>`;
    document.body.appendChild(wrap);
    let rating=0;
    const stars=[...wrap.querySelectorAll('[data-rating]')],send=wrap.querySelector('#session-rating-send');
    stars.forEach(btn=>btn.addEventListener('click',()=>{rating=Number(btn.dataset.rating);stars.forEach((s,i)=>{s.textContent=i<rating?'★':'☆';s.setAttribute('aria-pressed',i<rating?'true':'false');});send.disabled=false;}));
    const close=()=>wrap.remove();
    wrap.querySelector('#session-rating-close').onclick=close;
    wrap.querySelector('#session-rating-later').onclick=close;
    wrap.addEventListener('click',e=>{if(e.target===wrap)close();});
    send.onclick=async()=>{
      const result=wrap.querySelector('input[name="session-result"]:checked')?.value||'No selection';
      const status=wrap.querySelector('#session-rating-status');
      const data=new URLSearchParams({'form-name':'study-buddy-session-rating','rating':String(rating),'session-result':result,'page-title':c.title,'section':c.section,'page-url':c.url});
      send.disabled=true;send.textContent='Sending…';
      try{
        const res=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:data.toString()});
        if(!res.ok) throw new Error('Submission failed');
        status.innerHTML='<div style="background:#dcfce7;padding:10px;border-radius:10px;margin-bottom:12px"><b>✓ Thanks for helping us improve Study Buddy.</b></div>';
        send.textContent='Sent';setTimeout(close,1100);
      }catch(e){send.disabled=false;send.textContent='Send rating';status.innerHTML='<p style="color:#b91c1c"><b>That rating did not send. You can try again.</b></p>';}
    };
    wrap.querySelector('[data-rating]')?.focus();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
})();
