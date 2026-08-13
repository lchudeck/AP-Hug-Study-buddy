// PR #6: make FRQ scoring transparent: 0/1 or 1/1 for every part, with a visible model rewrite.
(function(){
  if(window.__frqFeedbackPolishInstalled) return;
  window.__frqFeedbackPolishInstalled=true;
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  window.aiResultHtml=function(result){
    const parts=result.parts||[];
    const earned=parts.filter(p=>p.earned).length,total=parts.length,pct=total?Math.round(earned/total*100):0;
    const color=pct>=75?'#16a34a':pct>=50?'#d97706':'#dc2626';
    return `<div class="ai-result"><div class="score-circle" style="color:${color};border-color:${color}">${earned}<small>/${total}</small></div><p style="text-align:center;color:#475569;font-size:14px">Each letter is worth exactly 1 point.</p>${parts.map(p=>`<div class="part-result ${p.earned?'part-earned':'part-missing'}"><div class="verdict">${p.earned?'✅':'❌'} Part ${esc(p.letter)} (${esc(p.verb)}): <b>${p.earned?'1/1 — Point earned':'0/1 — Point not earned'}</b></div><p>${esc(p.feedback)}</p>${!p.earned?`<div class="part-fix"><b>Why / how to improve:</b><p>${esc(p.feedback)}</p><b>Strong rewrite/model:</b><p>${esc(p.fix||'No model answer is available yet. Report this problem so we can fix it.')}</p></div>`:`<details><summary>See a point-earning model</summary><p>${esc(p.fix||'Your response earned the point. Compare it with the sample answer for this prompt.')}</p></details>`}</div>`).join('')}<div class="box-${pct>=75?'good':pct>=50?'yellow':'warn'}"><b>Overall: ${earned}/${total}</b><p>${esc(result.overall||'Review any 0/1 parts and rewrite them before moving on.')}</p></div><button class="btn-secondary" style="margin-top:12px;width:100%" onclick="aiResult=null;render()">Rewrite and try again</button></div>`;
  };
})();