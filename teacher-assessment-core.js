(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.APHGTeacherAssessment=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const signature=q=>String(q.prompt||'').trim().toLowerCase().replace(/\s+/g,' ');
  const hash=text=>{let h=2166136261;for(const c of String(text)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
  const random=seed=>{let x=hash(seed)||1;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/4294967296}};
  const shuffle=(items,seed)=>{const out=[...items],rand=random(seed);for(let i=out.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out};
  function normalize(item,index=0){
    const array=Array.isArray(item);
    const unit=Number(array?String(item[0]).replace(/\D/g,''):item.unit);
    const prompt=array?item[1]:item.prompt||item.q;
    const choices=array?item[2]:item.choices;
    const answer=array?item[3]:item.answer;
    const explanation=array?item[4]:item.explanation||item.explain||item.why;
    const visual=array?item.visual||item.stimulus:item.visual||item.stimulus;
    return {id:item.id||`q-${unit}-${hash(prompt||index)}`,unit,topic:item.topic||`${unit}.?`,prompt,choices:Array.isArray(choices)?[...choices]:[],answer,explanation,skill:item.skill||'concept',difficulty:Number(item.difficulty)||2,visual:visual||'',stimulusTitle:item.stimulusTitle||'',source:item.source||''};
  }
  function valid(q){return q.unit>=1&&q.unit<=7&&q.prompt&&q.explanation&&q.choices.length===4&&new Set(q.choices).size===4&&q.choices.includes(q.answer)}
  function buildBank(items){const seen=new Set();return items.map(normalize).filter(valid).filter(q=>{const key=signature(q);if(seen.has(key))return false;seen.add(key);return true})}
  function answerBalanced(items,seed){
    const targets=shuffle([0,1,2,3],`${seed}-answers`);return items.map((q,i)=>{const target=targets[i%4],choices=[...q.choices],from=choices.indexOf(q.answer);[choices[from],choices[target]]=[choices[target],choices[from]];return {...q,choices}});
  }
  function select(bank,options={}){
    const count=Math.min(40,Math.max(1,Number(options.count)||20));
    const units=(options.units||[1]).map(Number);
    const difficulty=options.difficulty||'mixed';
    const seed=options.seed||'assessment-a';
    const visualRate=options.visualRate==='high'?.5:options.visualRate==='low'?.2:.35;
    let eligible=buildBank(bank).filter(q=>units.includes(q.unit));
    if(difficulty!=='mixed')eligible=eligible.filter(q=>q.difficulty===Number(difficulty));
    if(eligible.length<count)throw new Error(`Only ${eligible.length} vetted questions match these settings. Choose fewer questions or a broader difficulty mix.`);
    const desired=Math.min(Math.round(count*visualRate),eligible.filter(q=>q.visual).length);
    const visuals=shuffle(eligible.filter(q=>q.visual),`${seed}-visual`).slice(0,desired);
    const used=new Set(visuals.map(q=>signature(q)));
    const nonVisual=shuffle(eligible.filter(q=>!q.visual&&!used.has(signature(q))),`${seed}-rest`);
    const visualOverflow=shuffle(eligible.filter(q=>q.visual&&!used.has(signature(q))),`${seed}-overflow`);
    const rest=[...nonVisual,...visualOverflow].slice(0,count-visuals.length);
    return answerBalanced(shuffle([...visuals,...rest],`${seed}-order`),seed);
  }
  return {normalize,buildBank,select,signature,shuffle};
});
