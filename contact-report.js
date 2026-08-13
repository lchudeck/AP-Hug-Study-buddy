// PR #6: direct student issue reporting through Netlify Forms.
(function(){
  if(window.__aphgContactInstalled) return;
  window.__aphgContactInstalled=true;
  function context(){
    const activeTab=(typeof active!=='undefined'&&active)?active:'unknown';
    const title=document.querySelector('main h2, main h1')?.textContent?.trim()||document.title;
    return {activeTab,title,url:location.href};
  }
  function ensure(){
    if(document.getElementById('aphg-report-btn')) return;
    const b=document.createElement('button'); b.id='aphg-report-btn'; b.type='button'; b.textContent='⚠️ Report a problem'; b.setAttribute('aria-label','Report a problem with Study Buddy');
    b.style.cssText='position:fixed;right:14px;bottom:14px;z-index:9998;border:0;border-radius:999px;padding:11px 15px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.18)';
    b.onclick=open; document.body.appendChild(b);
  }
  function open(){
    document.getElementById('aphg-report-modal')?.remove();
    const c=context(),wrap=document.createElement('div'); wrap.id='aphg-report-modal'; wrap.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9999;display:flex;align-items:center;justify-content:center;padding:18px';
    wrap.innerHTML=`<div role="dialog" aria-modal="true" aria-labelledby="report-title" style="background:white;color:#111;max-width:560px;width:100%;border-radius:16px;padding:20px;max-height:90vh;overflow:auto"><div style="display:flex;justify-content:space-between;gap:12px;align-items:start"><div><h2 id="report-title" style="margin:0 0 6px">Report a problem</h2><p style="margin-top:0">Found something broken, confusing, or incorrect? Tell us here.</p></div><button type="button" id="report-close" aria-label="Close" style="font-size:22px;border:0;background:transparent;cursor:pointer">×</button></div><label><b>What kind of issue?</b><select id="report-type" style="display:block;width:100%;margin:6px 0 14px;padding:9px"><option>Broken button or feature</option><option>Wrong answer or explanation</option><option>Confusing question</option><option>Missing vocabulary/content</option><option>Image/map problem</option><option>Other</option></select></label><label><b>What happened?</b><textarea id="report-details" required maxlength="2000" placeholder="Tell us what you clicked, what you expected, and what happened instead." style="display:block;width:100%;min-height:120px;margin:6px 0 14px;padding:9px;box-sizing:border-box"></textarea></label><label><b>Your email (optional)</b><input id="report-reply" type="email" autocomplete="email" placeholder="Add this only if you'd like a reply" style="display:block;width:100%;margin:6px 0 14px;padding:9px;box-sizing:border-box"></label><input id="report-bot" name="bot-field" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true"><div style="font-size:13px;background:#f3f4f6;padding:10px;border-radius:10px;margin-bottom:14px"><b>Page:</b> ${escapeHtml(c.title)}<br><b>Section:</b> ${escapeHtml(c.activeTab)}</div><div id="report-status" aria-live="polite"></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" id="report-send" style="padding:10px 14px;font-weight:700;cursor:pointer">Send report</button><button type="button" id="report-cancel" style="padding:10px 14px;cursor:pointer">Cancel</button></div><p style="font-size:12px;margin-bottom:0">No email is required. Add one only if you'd like a response.</p></div>`;
    document.body.appendChild(wrap); document.getElementById('report-close').onclick=close; document.getElementById('report-cancel').onclick=close; wrap.addEventListener('click',e=>{if(e.target===wrap)close();}); document.getElementById('report-send').onclick=send; document.getElementById('report-details').focus();
  }
  function close(){document.getElementById('aphg-report-modal')?.remove();}
  async function send(){
    const type=document.getElementById('report-type').value,details=document.getElementById('report-details').value.trim(),reply=document.getElementById('report-reply').value.trim(),bot=document.getElementById('report-bot').value,status=document.getElementById('report-status'),button=document.getElementById('report-send');
    if(!details){status.innerHTML='<p style="color:#b91c1c"><b>Please describe the problem first.</b></p>';document.getElementById('report-details').focus();return;}
    const c=context(); const data=new URLSearchParams({'form-name':'study-buddy-problem','bot-field':bot,'issue-type':type,'details':details,'reply-email':reply,'page-title':c.title,'section':c.activeTab,'page-url':c.url});
    button.disabled=true; button.textContent='Sending…'; status.innerHTML='';
    try{
      const res=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:data.toString()});
      if(!res.ok) throw new Error('Submission failed');
      status.innerHTML='<div style="background:#dcfce7;padding:10px;border-radius:10px;margin-bottom:12px"><b>✓ Report sent. Thank you!</b></div>';
      button.textContent='Sent'; setTimeout(close,1200);
    }catch(e){
      button.disabled=false; button.textContent='Send report'; status.innerHTML='<p style="color:#b91c1c"><b>That report did not send. Please try again.</b></p>';
    }
  }
  function escapeHtml(v){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure);else ensure();
})();