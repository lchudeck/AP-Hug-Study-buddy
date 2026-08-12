// PR #6: make the quiz "Turn this into FRQ practice" box fully interactive.
(function(){
  if(window.__miniFrqFeedbackInstalled) return;
  window.__miniFrqFeedbackInstalled=true;

  function enhance(){
    document.querySelectorAll('.box-yellow').forEach(box=>{
      if(box.dataset.miniFrqEnhanced) return;
      const text=(box.textContent||'').toLowerCase();
      if(!text.includes('turn this into frq practice')) return;
      const ta=box.querySelector('textarea');
      if(!ta) return;
      box.dataset.miniFrqEnhanced='1';
      const controls=document.createElement('div');
      controls.className='mini-frq-controls';
      controls.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin-top:10px';
      controls.innerHTML='<button type="button" class="btn-primary mini-frq-check">Check my FRQ answer</button><button type="button" class="btn-secondary mini-frq-clear">Clear</button>';
      const feedback=document.createElement('div');
      feedback.className='mini-frq-feedback';
      feedback.setAttribute('aria-live','polite');
      feedback.style.marginTop='10px';
      box.appendChild(controls);box.appendChild(feedback);
      controls.querySelector('.mini-frq-check').addEventListener('click',()=>grade(box,ta,feedback));
      controls.querySelector('.mini-frq-clear').addEventListener('click',()=>{ta.value='';feedback.innerHTML='';ta.focus();});
    });
  }

  function correctConcept(box){
    let node=box.previousElementSibling;
    for(let i=0;i<4&&node;i++,node=node.previousElementSibling){
      const t=node.textContent||'';
      const m=t.match(/correct answer (?:was|is):\s*([^\n.]+)/i);
      if(m) return m[1].trim();
    }
    const app=document.getElementById('app');
    const match=(app?.innerText||'').match(/correct answer (?:was|is):\s*([^\n.]+)/i);
    return match?match[1].trim():'';
  }

  function grade(box,ta,feedback){
    const raw=ta.value.trim();
    if(!raw){feedback.innerHTML='<div class="box-warn"><b>Write an answer first.</b> Try 1–2 sentences using <b>because</b> and an APHG term.</div>';ta.focus();return;}
    const lower=raw.toLowerCase();
    const words=raw.split(/\s+/).filter(Boolean);
    const concept=correctConcept(box);
    const conceptWords=concept.toLowerCase().split(/\s+/).filter(w=>w.length>3);
    const usesConcept=!conceptWords.length||conceptWords.some(w=>lower.includes(w));
    const cause=/(because|therefore|this leads to|as a result|due to|which causes|which leads)/i.test(raw);
    const enough=words.length>=8;
    const specific=/(for example|such as|means|refers to|location|region|population|migration|diffusion|density|scale|urban|agricultur|culture|politic|economic|market|distance|state|nation|development|gis|map)/i.test(raw)||usesConcept;
    const checks=[usesConcept,cause,enough,specific];
    const score=checks.filter(Boolean).length;
    const likely=score>=3&&cause&&enough;
    const missing=[];
    if(!usesConcept&&concept) missing.push(`name or clearly use <b>${esc(concept)}</b>`);
    if(!cause) missing.push('show cause and effect with <b>because</b>, <b>therefore</b>, or <b>this leads to</b>');
    if(!enough) missing.push('add enough detail for the reader to see your reasoning');
    if(!specific) missing.push('include a specific APHG term or geographic detail');
    const model=concept?`${concept} is the best answer because ${concept.toLowerCase()} explains the geographic pattern or relationship described in the question.`:'The correct concept applies because it explains the geographic pattern or relationship described in the question.';
    feedback.innerHTML=`<div class="${likely?'box-good':'box-warn'}"><b>${likely?'✅ Likely earns the practice point':'✏️ Not quite yet'}</b><p>${likely?'You used enough detail and showed cause-and-effect. Now make the geography as specific as possible.':'To improve this answer, '+missing.join('; ')+'.'}</p><div style="margin-top:8px"><b>Quick check:</b><br>${usesConcept?'✅':'⬜'} Uses the correct concept${concept?' ('+esc(concept)+')':''}<br>${cause?'✅':'⬜'} Explains <i>why</i> with cause/effect<br>${enough?'✅':'⬜'} Gives enough detail<br>${specific?'✅':'⬜'} Uses APHG-specific language</div><div style="margin-top:10px"><b>Strong rewrite example:</b><br>${esc(model)}</div><p style="font-size:13px;margin-bottom:0"><b>Practice estimate only:</b> this is a built-in writing check, not an official College Board score.</p></div>`;
  }
  function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

  const observer=new MutationObserver(enhance);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{enhance();observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});});
  else {enhance();observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});}
})();