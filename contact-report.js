// PR #6: student issue/contact reporting.
// Uses a mailto handoff so no personal email is printed in the page UI and no backend is required.
(function(){
  if(window.__aphgContactInstalled) return;
  window.__aphgContactInstalled=true;
  const REPORT_TO='laurachudecke@gmail.com';
  function context(){
    const activeTab=(typeof active!=='undefined'&&active)?active:'unknown';
    const title=document.querySelector('main h2, main h1')?.textContent?.trim()||document.title;
    return {activeTab,title,url:location.href};
  }
  function ensure(){
    if(document.getElementById('aphg-report-btn')) return;
    const b=document.createElement('button');b.id='aphg-report-btn';b.type='button';b.textContent='⚠️ Report a problem';b.setAttribute('aria-label','Report a problem with Study Buddy');
    b.style.cssText='position:fixed;right:14px;bottom:14px;z-index:9998;border:0;border-radius:999px;padding:11px 15px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.18)';
    b.onclick=open;document.body.appendChild(b);
  }
  function open(){
    document.getElementById('aphg-report-modal')?.remove();
    const c=context(),wrap=document.createElement('div');wrap.id='aphg-report-modal';wrap.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9999;display:flex;align-items:center;justify-content:center;padding:18px';
    wrap.innerHTML=`<div role="dialog" aria-modal="true" aria-labelledby="report-title" style="background:white;color:#111;max-width:560px;width:100%;border-radius:16px;padding:20px;max-height:90vh;overflow:auto"><div style="display:flex;justify-content:space-between;gap:12px;align-items:start"><div><h2 id="report-title" style="margin:0 0 6px">Report a problem</h2><p style="margin-top:0">Found something broken, confusing, or incorrect? Send a quick report.</p></div><button type="button" id="report-close" aria-label="Close" style="font-size:22px;border:0;background:transparent;cursor:pointer">×</button></div><label><b>What kind of issue?</b><select id="report-type" style="display:block;width:100%;margin:6px 0 14px;padding:9px"><option>Broken button or feature</option><option>Wrong answer or explanation</option><option>Confusing question</option><option>Missing vocabulary/content</option><option>Image/map problem</option><option>Other</option></select></label><label><b>What happened?</b><textarea id="report-details" required maxlength="2000" placeholder="Tell me what you clicked, what you expected, and what happened instead." style="display:block;width:100%;min-height:120px;margin:6px 0 14px;padding:9px;box-sizing:border-box"></textarea></label><label><b>Your email (optional)</b><input id="report-reply" type="email" autocomplete="email" placeholder="Only if you'd like a reply" style="display:block;width:100%;margin:6px 0 14px;padding:9px;box-sizing:border-box"></label><div style="font-size:13px;background:#f3f4f6;padding:10px;border-radius:10px;margin-bottom:14px"><b>Page:</b> ${escapeHtml(c.title)}<br><b>Section:</b> ${escapeHtml(c.activeTab)}</div><div id="report-status" aria-live="polite"></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" id="report-send" style="padding:10px 14px;font-weight:700;cursor:pointer">Create email report</button><button type="button" id="report-cancel" style="padding:10px 14px;cursor:pointer">Cancel</button></div><p style="font-size:12px;margin-bottom:0">This opens your email app with the report filled in. You choose whether to send it.</p></div>`;
    document.body.appendChild(wrap);document.getElementById('report-close').onclick=close;document.getElementById('report-cancel').onclick=close;wrap.addEventListener('click',e=>{if(e.target===wrap)close();});document.getElementById('report-send').onclick=send;document.getElementById('report-details').focus();
  }
  function close(){document.getElementById('aphg-report-modal')?.remove();}
  function send(){
    const type=document.getElementById('report-type').value,details=document.getElementById('report-details').value.trim(),reply=document.getElementById('report-reply').value.trim(),status=document.getElementById('report-status');
    if(!details){status.innerHTML='<p style="color:#b91c1c"><b>Please describe the problem first.</b></p>';document.getElementById('report-details').focus();return;}
    const c=context();const subject=`APHG Study Buddy issue: ${type}`;const body=[`Issue type: ${type}`,`Page: ${c.title}`,`Section: ${c.activeTab}`,`Page URL: ${c.url}`,reply?`Student reply email: ${reply}`:'Student reply email: not provided','', 'What happened:',details,'','Sent from the APHG Study Buddy Report a Problem feature.'].join('\n');
    location.href=`mailto:${REPORT_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;status.innerHTML='<p><b>Your email app should open with the report ready to send.</b></p>';
  }
  function escapeHtml(v){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure);else ensure();
})();