// Lightweight, no-login student feedback via Netlify Forms.
(function(){
  if(window.__aphgFeedbackInstalled) return;
  window.__aphgFeedbackInstalled=true;
  function context(){
    const activeTab=(typeof active!=='undefined'&&active)?active:'unknown';
    const title=document.querySelector('main h2, main h1')?.textContent?.trim()||document.title;
    return {activeTab,title,url:location.href};
  }
  function ensure(){
    if(document.getElementById('aphg-feedback-btn')) return;
    const b=document.createElement('button');
    b.id='aphg-feedback-btn'; b.type='button'; b.textContent='💬 Quick feedback';
    b.setAttribute('aria-label','Give quick feedback about Study Buddy');
    b.style.cssText='position:fixed;right:14px;bottom:62px;z-index:9997;border:0;border-radius:999px;padding:10px 14px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.15);background:#fff;color:#1f2937';
    b.onclick=open; document.body.appendChild(b);
  }
  function open(){
    document.getElementById('aphg-feedback-modal')?.remove();
    const c=context(),wrap=document.createElement('div');
    wrap.id='aphg-feedback-modal'; wrap.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9999;display:flex;align-items:center;justify-content:center;padding:18px';
    wrap.innerHTML=`<div role="dialog" aria-modal="true" aria-labelledby="feedback-title" style="background:white;color:#111;max-width:520px;width:100%;border-radius:16px;padding:20px;max-height:90vh;overflow:auto"><div style="display:flex;justify-content:space-between;gap:12px;align-items:start"><div><h2 id="feedback-title" style="margin:0 0 6px">30-second feedback</h2><p style="margin-top:0">Help make Study Buddy clearer for the next student.</p></div><button type="button" id="feedback-close" aria-label="Close" style="font-size:22px;border:0;background:transparent;cursor:pointer">×</button></div><fieldset style="border:0;padding:0;margin:0 0 14px"><legend><b>Was this part helpful?</b></legend><label style="display:block;margin:8px 0"><input type="radio" name="helpful" value="Yes" required> Yes</label><label style="display:block;margin:8px 0"><input type="radio" name="helpful" value="Somewhat"> Somewhat</label><label style="display:block;margin:8px 0"><input type="radio" name="helpful" value="No"> No</label></fieldset><label><b>What, if anything, was confusing?</b><textarea id="feedback-confusing" maxlength="1000" placeholder="Optional — a few words is enough." style="display:block;width:100%;min-height:90px;margin:6px 0 14px;padding:9px;box-sizing:border-box"></textarea></label><label><b>What should we improve next?</b><select id="feedback-improve" style="display:block;width:100%;margin:6px 0 14px;padding:9px"><option value="Nothing specific">Nothing specific</option><option>Directions</option><option>Question difficulty</option><option>Answer explanations</option><option>FRQ feedback</option><option>Navigation</option><option>Vocabulary</option><option>Maps/images/data</option><option>Other</option></select></label><input id="feedback-bot" name="bot-field" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true"><div style="font-size:13px;background:#f3f4f6;padding:10px;border-radius:10px;margin-bottom:14px"><b>Page:</b> ${escapeHtml(c.title)}<br><b>Section:</b> ${escapeHtml(c.activeTab)}</div><div id="feedback-status" aria-live="polite"></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" id="feedback-send" style="padding:10px 14px;font-weight:700;cursor:pointer">Send feedback</button><button type="button" id="feedback-cancel" style="padding:10px 14px;cursor:pointer">Cancel</button></div><p style="font-size:12px;margin-bottom:0">No name or email is requested.</p></div>`;
    document.body.appendChild(wrap);
    document.getElementById('feedback-close').onclick=close;
    document.getElementById('feedback-cancel').onclick=close;
    wrap.addEventListener('click',e=>{if(e.target===wrap)close();});
    document.getElementById('feedback-send').onclick=send;
  }
  function close(){document.getElementById('aphg-feedback-modal')?.remove();}
  async function send(){
    const helpful=document.querySelector('input[name="helpful"]:checked')?.value||'';
    const confusing=document.getElementById('feedback-confusing').value.trim();
    const improve=document.getElementById('feedback-improve').value;
    const bot=document.getElementById('feedback-bot').value;
    const status=document.getElementById('feedback-status'),button=document.getElementById('feedback-send');
    if(!helpful){status.innerHTML='<p style="color:#b91c1c"><b>Please choose Yes, Somewhat, or No.</b></p>';return;}
    const c=context();
    const data=new URLSearchParams({'form-name':'study-buddy-feedback','bot-field':bot,'helpful':helpful,'confusing':confusing,'improve-next':improve,'page-title':c.title,'section':c.activeTab,'page-url':c.url});
    button.disabled=true;button.textContent='Sending…';status.innerHTML='';
    try{
      const res=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:data.toString()});
      if(!res.ok)throw new Error('Submission failed');
      status.innerHTML='<div style="background:#dcfce7;padding:10px;border-radius:10px;margin-bottom:12px"><b>✓ Thanks — feedback sent.</b></div>';
      button.textContent='Sent';setTimeout(close,1200);
    }catch(e){
      button.disabled=false;button.textContent='Send feedback';status.innerHTML='<p style="color:#b91c1c"><b>That feedback did not send. Please try again.</b></p>';
    }
  }
  function escapeHtml(v){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure);else ensure();
})();