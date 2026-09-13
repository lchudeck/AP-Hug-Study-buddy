// Shared FRQ coaching verifier — exactly 1 possible point per labeled part.
// This is intentionally conservative: uncertain wording is sent to rubric/self-check instead of being scored as wrong.
(function(){
  if(window.__frqPartScoringInstalled) return;
  window.__frqPartScoringInstalled=true;

  const STOP=new Set(['the','and','or','to','of','in','a','an','is','are','was','were','it','this','that','with','from','for','one','as','by','on','be','can','could','would','may','more','less','into','their','its','has','have','had','such','because','therefore','which','they','them','than','also']);
  const STEM=w=>w.replace(/(ingly|edly|ing|ed|es|s)$/,'');
  const SYNONYM_GROUPS=[
    ['increase','rise','grow','expand','higher','boost'],['decrease','decline','fall','reduce','lower','shrink'],
    ['job','employment','work','labor'],['money','income','wage','salary','earn'],['cost','expense','price'],
    ['outside','external','third-party','thirdparty','subcontract'],['company','firm','business','corporation'],
    ['foreign','abroad','overseas','international','another-country'],['move','relocate','shift','transfer'],
    ['city','urban'],['rural','countryside'],['country','state','nation'],['people','population','residents'],
    ['manufacture','manufacturing','production','factory','assembly'],['trade','exchange','commerce'],
    ['migration','migrate','move'],['transport','transportation','shipping','ship'],['agriculture','agricultural','farm','farming']
  ];
  const synonymIndex=new Map();
  SYNONYM_GROUPS.forEach((g,i)=>g.forEach(w=>synonymIndex.set(STEM(w),i)));

  function norm(s){return String(s||'').toLowerCase().replace(/another country/g,'another-country').replace(/third party/g,'third-party').replace(/[^a-z0-9\s'-]/g,' ').replace(/\s+/g,' ').trim();}
  function words(s){return norm(s).split(' ').filter(Boolean).map(STEM);}
  function contentWords(s){return words(s).filter(w=>w.length>3&&!STOP.has(w));}
  function extractPart(letter,full){
    const source=String(full||'');
    const re=new RegExp('(?:^|\\n)\\s*'+letter+'\\s*[\\).:-]\\s*([\\s\\S]*?)(?=(?:\\n\\s*[A-Z]\\s*[\\).:-])|$)','i');
    const m=source.match(re);
    return m?m[1].trim():'';
  }
  function looksNonsense(s){
    const t=norm(s), ws=t.split(' ').filter(Boolean); if(!ws.length)return true;
    if(/^(idk|i don'?t know|dont know|no idea|n\/a|na|asdf|lol|whatever)[.! ]*$/i.test(String(s).trim()))return true;
    const alpha=ws.join(''); const vowels=(alpha.match(/[aeiouy]/g)||[]).length;
    if(alpha.length>8 && vowels/Math.max(alpha.length,1)<.16)return true;
    if(ws.length>=3 && ws.every(w=>w.length>7) && !/(population|migration|region|location|culture|state|market|urban|agricultur|development|diffusion|density|site|situation|government|economic|social|politic|trade|industry|labor)/.test(t))return true;
    return false;
  }
  function concepts(s){
    const out=new Set();
    contentWords(s).forEach(w=>out.add(synonymIndex.has(w)?'syn:'+synonymIndex.get(w):w));
    return out;
  }
  function evidence(student,model){
    const sw=concepts(student), mw=[...concepts(model)];
    const hits=mw.filter(w=>sw.has(w));
    return {hits,needed:mw};
  }
  function hasCausalRelationship(text){
    const t=norm(text);
    return /(because|therefore|thus|hence|consequently|as a result|due to|leads? to|led to|results? in|resulted in|caus(?:e|es|ed|ing)|so that|which (?:raises?|reduces?|increases?|decreases?|creates?|allows?|prevents?)|\b(?:raises?|reduces?|increases?|decreases?|creates?|allows?|prevents?|encourages?|discourages?|limits?|expands?|shrinks?|pushes?|pulls?)\b)/i.test(t);
  }
  function gradePart(part,text){
    const [letter,verb,prompt,model]=part;
    const clean=norm(text),wc=clean.split(' ').filter(Boolean).length;
    if(!clean) return {letter,verb,earned:false,status:'incorrect',feedback:`Part ${letter}: 0/1. This part is blank.`,fix:model};
    if(looksNonsense(text)) return {letter,verb,earned:false,status:'incorrect',feedback:`Part ${letter}: 0/1. The response does not contain a recognizable AP Human Geography idea that answers this part.`,fix:model};

    const ev=evidence(text,model);
    const requiredHits=verb==='Identify'?1:(ev.needed.length>=4?2:1);
    const contentOK=ev.hits.length>=requiredHits;
    let structureOK=true;
    if(verb==='Define'||verb==='Describe') structureOK=wc>=4;
    if(verb==='Explain') structureOK=wc>=6&&hasCausalRelationship(text);
    if(verb==='Apply'||verb==='Evaluate'||verb==='Compare') structureOK=wc>=6;

    if(contentOK&&structureOK){
      return {letter,verb,earned:true,status:'verified',feedback:`Part ${letter}: 1/1. Study Buddy found enough APHG content and task completion to verify this point. This is a coaching check—not an official AP score.`,fix:model};
    }

    const reasons=[];
    if(verb==='Explain'&&!hasCausalRelationship(text))reasons.push('make the cause-and-effect relationship explicit');
    if(wc<4)reasons.push('add enough detail to complete the task verb');
    if(!contentOK)reasons.push('compare the geographic idea/example with the rubric');
    return {
      letter,verb,earned:false,status:'unverified',coachingOnly:true,
      feedback:`Part ${letter}: Not automatically verified—compare with the rubric.${reasons.length?' '+reasons.join('; ')+'.':''} A legitimate synonym, alternate example, or clearly explained relationship may still earn the point.`,
      fix:model
    };
  }

  window.__frqHasCausalRelationship=hasCausalRelationship;
  window.__gradeFrqPart=gradePart;
  window.__extractFrqPart=extractPart;
  window.localGradeFRQ=function(fullAnswer,prompt){
    const parts=prompt.parts.map(part=>gradePart(part,extractPart(part[0],fullAnswer)));
    const score=parts.filter(p=>p.status==='verified').length;
    const total=parts.length;
    const uncertain=parts.filter(p=>p.status==='unverified').map(p=>p.letter);
    const incorrect=parts.filter(p=>p.status==='incorrect').map(p=>p.letter);
    let overall=`Study Buddy automatically verified ${score}/${total} possible points. This is a coaching check—not an official AP score.`;
    if(uncertain.length) overall+=` Part${uncertain.length>1?'s':''} ${uncertain.join(', ')} ${uncertain.length>1?'were':'was'} not automatically verified; compare with the rubric rather than treating ${uncertain.length>1?'them':'it'} as wrong.`;
    if(incorrect.length) overall+=` Rework part${incorrect.length>1?'s':''} ${incorrect.join(', ')}.`;
    return {parts,score,total,uncertain,incorrect,warnings:uncertain.length?[`Rubric/self-check needed for: ${uncertain.join(', ')}`]:[],overall};
  };
})();
