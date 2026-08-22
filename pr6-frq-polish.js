// PR #6 final FRQ polish: each lettered part is independently worth exactly one point.
(function(){
  if(window.__pr6FrqPolishInstalled) return;
  window.__pr6FrqPolishInstalled=true;

  const stop=new Set('the and or to of in a an is are it this that with from for one as by on be can could would may more less into their its has have had such because therefore leads lead which your you'.split(' '));
  function norm(s){return String(s||'').toLowerCase().replace(/[^a-z0-9\s-]/g,' ').replace(/\s+/g,' ').trim();}
  function tokens(s){return norm(s).split(' ').filter(w=>w.length>3&&!stop.has(w));}
  function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function responseFor(letter,full){
    const source=String(full||'');
    const re=new RegExp('(?:^|\\n)\\s*'+letter+'\\s*[\\).:-]\\s*([\\s\\S]*?)(?=(?:\\n\\s*[A-G]\\s*[\\).:-])|$)','i');
    const m=source.match(re);
    return m?m[1].trim():'';
  }
  function meaningfulOverlap(student,model){
    const s=new Set(tokens(student));
    const m=[...new Set(tokens(model))];
    const hits=m.filter(w=>s.has(w));
    return {hits,model:m};
  }
  function nonsense(s){
    const t=norm(s), ws=t.split(' ').filter(Boolean);
    if(!ws.length)return true;
    if(/^(asdf|qwer|blah|idk|dont know|i dont know|no idea|test|testing|random)(\s|$)/.test(t))return true;
    if(ws.length>=2 && ws.every(w=>/^[a-z]{5,}$/.test(w)) && !/(population|migration|region|market|state|nation|diffusion|density|urban|agricultur|development|site|situation|government|culture|economic|politic|environment|location|distance|birth|death|fertility|language|religion)/.test(t)){
      const vowelRatio=((t.match(/[aeiouy]/g)||[]).length)/Math.max(1,t.replace(/\s/g,'').length);
      if(vowelRatio<.2)return true;
    }
    return false;
  }
  function gradePart(part,text){
    const [letter,verb,prompt,model]=part;
    const wc=norm(text).split(' ').filter(Boolean).length;
    const overlap=meaningfulOverlap(text,model);
    const cause=/(because|therefore|as a result|due to|this leads to|which leads to|which causes|results in|so that|\bso\b|while|when|since|can |may |raises?|reduces?|increases?|decreases?|creates?|allows?|prevents?)/i.test(text);
    const bad=nonsense(text);
    const contentHits=overlap.hits.length;
    let contentOK=contentHits>=1;
    // Identify answers are often only one exact term/phrase; accept meaningful model keyword overlap.
    if(verb==='Identify') contentOK=contentHits>=1 && wc<=18;
    if(verb==='Define') contentOK=contentHits>=2 || (contentHits>=1&&wc>=6);
    if(['Describe','Apply','Evaluate','Compare'].includes(verb)) contentOK=contentHits>=1&&wc>=5;
    if(verb==='Explain') contentOK=contentHits>=1&&wc>=7&&cause;
    const earned=!bad && contentOK;
    const reasons=[];
    if(!text.trim())reasons.push('Part '+letter+' is blank.');
    else if(bad)reasons.push('The response does not contain a recognizable AP Human Geography answer.');
    else {
      if(contentHits<1)reasons.push('The response does not include the geographic idea needed for this part.');
      if(verb==='Define'&&wc<6)reasons.push('A definition needs enough meaning to show what the term actually means.');
      if(['Describe','Apply','Evaluate','Compare'].includes(verb)&&wc<5)reasons.push('The response is too short or vague to demonstrate the requested skill.');
      if(verb==='Explain'&&!cause)reasons.push('The explanation needs a clear cause-and-effect connection.');
      if(verb==='Explain'&&wc<7)reasons.push('The explanation needs enough detail to show the causal relationship.');
    }
    return {letter,verb,prompt,model,text,earned,reasons};
  }

  window.partText=function(letter,full){return responseFor(letter,full);};
  window.localGradeFRQ=function(fullAnswer,prompt){
    const parts=prompt.parts.map(part=>gradePart(part,responseFor(part[0],fullAnswer)));
    const earnedCount=parts.filter(p=>p.earned).length;
    const missing=parts.filter(p=>!p.earned).map(p=>p.letter);
    return {
      parts:parts.map(p=>({letter:p.letter,verb:p.verb,earned:p.earned,feedback:p.earned?'1/1 — Point earned. The response completes the task with relevant APHG content.':'0/1 — Point not earned. '+p.reasons.join(' '),fix:p.model,model:p.model})),
      score:earnedCount,
      total:parts.length,
      warnings:[],
      overall:earnedCount===parts.length?`Full credit: ${earnedCount}/${parts.length}.`:`Score: ${earnedCount}/${parts.length}. Rewrite part${missing.length===1?'':'s'} ${missing.join(', ')} and check again.`
    };
  };

  window.aiResultHtml=function(result){
    const total=Number(result.total||result.parts.length||0), earned=Number(result.score??result.parts.filter(p=>p.earned).length), pct=total?Math.round(earned/total*100):0;
    return `<div class="ai-result"><div class="score-circle">${earned}<small>/${total}</small></div><p style="text-align:center;color:#475569"><b>Each lettered part is worth 1 point.</b></p>${result.parts.map(p=>`<div class="part-result ${p.earned?'part-earned':'part-missing'}"><div class="verdict">${p.earned?'✅':'❌'} Part ${p.letter} (${p.verb}): <b>${p.earned?'1/1':'0/1'}</b></div><p>${esc(p.feedback)}</p>${!p.earned?`<div class="part-fix"><b>Why this missed:</b> ${esc(p.feedback.replace(/^0\/1 — Point not earned\.\s*/,''))}<br><br><b>Strong rewrite/model:</b><br>${esc(p.model||p.fix||'Use a specific, accurate APHG response that directly answers this part.')}</div>`:''}</div>`).join('')}<div class="box-${pct>=75?'good':pct>=50?'yellow':'warn'}"><b>Overall: ${earned}/${total}</b><p>${esc(result.overall||'')}</p></div><button class="btn-secondary" style="margin-top:12px;width:100%" onclick="aiResult=null;render()">Rewrite and try again</button></div>`;
  };

  // Attack-testable API for validation.
  window.__pr6GradePart=gradePart;
})();
