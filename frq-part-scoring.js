// PR #6: strict FRQ scoring — exactly 1 point per labeled part.
(function(){
  if(window.__frqPartScoringInstalled) return;
  window.__frqPartScoringInstalled=true;

  const STOP=new Set(['the','and','or','to','of','in','a','an','is','are','was','were','it','this','that','with','from','for','one','as','by','on','be','can','could','would','may','more','less','into','their','its','has','have','had','such','because','therefore','which','they','them','than','also']);
  const STEM=w=>w.replace(/(ing|ed|es|s)$/,'');
  function norm(s){return String(s||'').toLowerCase().replace(/[^a-z0-9\s'-]/g,' ').replace(/\s+/g,' ').trim();}
  function contentWords(s){return norm(s).split(' ').filter(w=>w.length>3&&!STOP.has(w)).map(STEM);}
  function extractPart(letter,full){
    const source=String(full||'');
    const re=new RegExp('(?:^|\\n)\\s*'+letter+'\\s*[\\).:-]\\s*([\\s\\S]*?)(?=(?:\\n\\s*[A-Z]\\s*[\\).:-])|$)','i');
    const m=source.match(re);
    return m?m[1].trim():'';
  }
  function looksNonsense(s){
    const t=norm(s), ws=t.split(' ').filter(Boolean); if(!ws.length)return true;
    const alpha=ws.join(''); const vowels=(alpha.match(/[aeiouy]/g)||[]).length;
    if(alpha.length>8 && vowels/Math.max(alpha.length,1)<.16)return true;
    if(ws.length>=3 && ws.every(w=>w.length>7) && !/(population|migration|region|location|culture|state|market|urban|agricultur|development|diffusion|density|site|situation|government|economic|social|politic)/.test(t))return true;
    return false;
  }
  function evidence(student,model){
    const sw=new Set(contentWords(student));
    const mw=[...new Set(contentWords(model))];
    const hits=mw.filter(w=>sw.has(w));
    return {hits,needed:mw};
  }
  function gradePart(part,text){
    const [letter,verb,prompt,model]=part;
    const clean=norm(text),wc=clean.split(' ').filter(Boolean).length;
    if(!text) return {letter,verb,earned:false,feedback:`Part ${letter}: 0/1. This part is missing.`,fix:model};
    if(looksNonsense(text)) return {letter,verb,earned:false,feedback:`Part ${letter}: 0/1. The response does not contain a recognizable AP Human Geography idea that answers this part.`,fix:model};
    const ev=evidence(text,model);
    const cause=/(because|therefore|this leads to|as a result|due to|which causes|which leads|results in|so that|\bso\b|while|when|since|can |may |raises?|reduces?|increases?|decreases?|creates?|allows?|prevents?)/i.test(text);
    const requiredHits=verb==='Identify'?1:(ev.needed.length>=4?2:1);
    const contentOK=ev.hits.length>=requiredHits;
    let structureOK=true;
    if(verb==='Define') structureOK=wc>=4;
    if(verb==='Describe') structureOK=wc>=4;
    if(verb==='Explain') structureOK=wc>=6&&cause;
    if(verb==='Apply'||verb==='Evaluate'||verb==='Compare') structureOK=wc>=6;
    const earned=contentOK&&structureOK;
    const reasons=[];
    if(!contentOK) reasons.push('the geographic content does not match enough of a point-earning idea');
    if(verb==='Explain'&&!cause) reasons.push('it does not show cause and effect');
    if(!structureOK&&verb!=='Explain') reasons.push('it is too vague or incomplete for this task verb');
    if(verb==='Explain'&&wc<6) reasons.push('the explanation is too short to show the relationship clearly');
    return {letter,verb,earned,feedback:earned?`Part ${letter}: 1/1. Accurate APHG content completes the ${verb.toLowerCase()} task.`:`Part ${letter}: 0/1 because ${reasons.join(' and ')}.`,fix:model};
  }

  window.__gradeFrqPart=gradePart;
  window.__extractFrqPart=extractPart;
  window.localGradeFRQ=function(fullAnswer,prompt){
    const parts=prompt.parts.map(part=>gradePart(part,extractPart(part[0],fullAnswer)));
    const score=parts.filter(p=>p.earned).length;
    const total=parts.length;
    const missed=parts.filter(p=>!p.earned).map(p=>p.letter);
    return {parts,score,total,warnings:[],overall:score===total?`${score}/${total}. Every part earned its point.`:`${score}/${total}. Rework part${missed.length>1?'s':''} ${missed.join(', ')}. Each part is worth exactly 1 point.`};
  };
})();
