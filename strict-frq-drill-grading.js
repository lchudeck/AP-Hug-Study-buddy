// PR #6 blocker fix: strict, content-first grading for 1-point FRQ drills.
(function(){
  if(window.__strictFrqDrillGradingInstalled) return;
  window.__strictFrqDrillGradingInstalled=true;

  const rubrics=[
    {accept:[['wage'],['job'],['employment'],['family','reun'],['safety'],['education'],['school'],['opportunit']],why:'A pull factor must attract a migrant to a destination, such as jobs, higher wages, safety, education, or family reunification.'},
    {accept:[['rent'],['displac'],['business'],['infrastructure'],['property','value'],['housing','cost'],['amenit']],why:'A valid effect of gentrification must describe an actual neighborhood change, such as rising rents, displacement, new businesses, infrastructure improvements, or higher property values.'},
    {accept:[['regional','independ'],['separat'],['national','unity'],['central','authority'],['regional','power'],['fragment']],cause:true,why:'The answer must explain how shifting power to regions can reduce central authority, weaken national unity, or increase separatist/independence pressure.'},
    {accept:[['perish'],['spoil'],['transport','cost'],['heavy','transport'],['distance','market']],cause:true,why:'The answer must connect market proximity to perishability and/or transportation cost. Simply saying dairy is near cities is not enough.'},
    {accept:[['contagious'],['hierarchical'],['stimulus']],why:'Expansion diffusion includes contagious, hierarchical, and stimulus diffusion. Relocation diffusion is not an expansion type.'},
    {accept:[['wealth'],['industrial'],['high-value'],['manufactur'],['finance'],['technolog'],['core','control'],['capital']],why:'A core-country characteristic should show wealth, industrialization, high-value production, finance/technology, or control within the world economy.'},
    {accept:[['worker','dependent'],['working-age','dependent'],['pension'],['health','cost'],['social','service'],['tax','burden'],['labor','short'],['dependency','burden']],cause:true,why:'The answer must explain a consequence of many dependents relative to workers, such as higher pension/health costs, tax pressure, labor shortages, or greater support burdens.'},
    {accept:[['important','place'],['major','city'],['large','city'],['celebr'],['leader'],['influenc'],['hierarch'],['high-order','low-order']],cause:true,why:'Hierarchical diffusion spreads through influential people or important/high-order places before reaching smaller or less influential places.'}
  ];
  function clean(s){return (s||'').toLowerCase().replace(/[^a-z0-9\s-]/g,' ').replace(/\s+/g,' ').trim();}
  function words(s){return clean(s).split(' ').filter(Boolean);}
  function looksLikeNonsense(s){const ws=words(s);if(!ws.length)return true;const alpha=ws.join('');const vowels=(alpha.match(/[aeiouy]/g)||[]).length;const longOdd=ws.filter(w=>w.length>9&&!/[aeiouy].*[aeiouy]/.test(w)).length;const recognized=/(because|therefore|this|that|the|a|an|is|are|can|may|people|country|city|market|farm|jobs|wages|rent|migration|diffusion|government|population|core|dairy|regional|workers|education|safety)/.test(clean(s));return(alpha.length>8&&vowels/Math.max(1,alpha.length)<0.18)||longOdd>0||(ws.length>=3&&!recognized&&ws.every(w=>w.length>4));}
  function groupHit(text,g){return g.every(k=>text.includes(k));}
  function gradeDrill(index,answer){
    const d=drills[index%drills.length],rule=rubrics[index%rubrics.length],text=clean(answer),wc=words(answer).length;
    if(!text)return{earned:false,why:'No point: the response is blank.',fix:rule.why,model:d[3]};
    if(looksLikeNonsense(answer))return{earned:false,why:'No point: the response does not contain a recognizable AP Human Geography idea related to the question.',fix:rule.why,model:d[3]};
    const content=rule.accept.some(g=>groupHit(text,g));const cause=/(because|therefore|this leads to|as a result|due to|which leads|which causes|so that)/.test(text);const verb=d[0];let earned=content;
    if(verb==='Explain')earned=content&&cause&&wc>=7;else if(verb==='Describe')earned=content&&wc>=3;else if(verb==='Identify')earned=content;
    let why='';if(!content)why='No point: the geographic content is incorrect, unrelated, or too vague for this prompt.';else if(verb==='Explain'&&!cause)why='No point yet: you identified a relevant idea, but an Explain task must show cause and effect using because/therefore/this leads to.';else if(verb==='Explain'&&wc<7)why='No point yet: the idea is relevant, but the explanation is too short to show the causal relationship clearly.';else if(verb==='Describe'&&wc<3)why='No point yet: add a clear characteristic, effect, or example rather than only naming a term.';else why='Point earned: the response contains accurate APHG content and completes the task verb.';
    return{earned,why,fix:rule.why,model:d[3]};
  }
  window.__gradeStrictDrill=gradeDrill;
  window.strictGradeDrill=function(){const result=gradeDrill(drillIndex,drillAnswer);window.__strictDrillResult=result;drillChecked=true;render();};
  window.strictNextDrill=function(){drillIndex++;drillAnswer='';drillChecked=false;window.__strictDrillResult=null;render();};
  drillHtml=function(){const d=drills[drillIndex%drills.length];const r=window.__strictDrillResult;return `<div style="background:#f8fafc;border:1px solid #dde3ed;border-radius:16px;padding:16px"><span class="pill" style="background:#e0e7ff;color:#3730a3">${d[1]} · ${d[0]}</span><div class="drill-prompt">${d[2]}</div><textarea class="answer-textarea" style="min-height:90px" oninput="drillAnswer=this.value;window.__strictDrillResult=null;drillChecked=false" placeholder="${d[0]==='Explain'?'Use accurate APHG content and show cause/effect.':'Answer with accurate APHG content.'}">${drillAnswer}</textarea><div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn-primary btn-sm" onclick="strictGradeDrill()">Check this point</button><button class="btn-secondary btn-sm" onclick="strictNextDrill()">Next drill</button></div>${r?`<div class="${r.earned?'box-good':'box-warn'}" style="margin-top:10px"><b>${r.earned?'✅ 1/1 — Point earned':'❌ 0/1 — Point not earned'}</b><p style="margin-top:6px">${r.why}</p>${!r.earned?`<p><b>Why / how to improve:</b> ${r.fix}</p>`:''}</div><div class="callout" style="margin-top:10px"><b>Point-earning model answer:</b><p>${r.model}</p></div>`:''}</div>`;};
})();