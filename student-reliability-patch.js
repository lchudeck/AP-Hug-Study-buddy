// Focused reliability patch from the September 2026 independent audit.
// Loaded last so it can correct legacy student-facing data without redesigning existing screens.
(function(){
  if(window.__studentReliabilityPatchInstalled) return;
  window.__studentReliabilityPatchInstalled=true;

  const MODEL_TOPICS={
    'Demographic Transition Model':'2.5','Demographic Transition Model (DTM)':'2.5','Von Thünen Model':'5.8','Von Thünen Agricultural Model':'5.8','Concentric Zone Model':'6.5','Sector Model':'6.5','Multiple Nuclei Model':'6.5','Latin American City Model':'6.5',"Rostow's Stages of Growth":'7.5','Rostow’s Stages of Growth':'7.5','Weber Least-Cost Theory':'7.2','Weber Least Cost Theory':'7.2'
  };
  try{
    if(window.APHG_UNIT_FRQS){window.APHG_UNIT_FRQS[7]={unit:7,title:'Global Production: Outsourcing and Offshoring',scenario:'A U.S.-based electronics company closes one domestic component line. It contracts with an independently owned firm in Vietnam to manufacture those components. The U.S. company does not own the Vietnamese factory.',parts:[['A','Identify','Identify the TWO geographic processes shown by the company’s decision.','The company is outsourcing because it hires an outside firm, and it is offshoring because the work moves to another country.'],['B','Explain','Explain one cost-related factor that could encourage this decision.','Lower labor, land, tax, or production costs abroad can reduce total production costs and increase competitiveness.'],['C','Explain','Explain one possible geographic effect of this decision on the U.S. location or the Vietnamese location.','The U.S. location may lose manufacturing employment through deindustrialization, while the Vietnamese location may gain jobs, investment, and links to global production networks.']],scoringGuide:['A: 1 point for outsourcing (outside company) and 1 point for offshoring (work moved to another country).','B: 1 point for a valid cost factor with a clear causal relationship.','C: 1 point for a valid spatial/economic effect with a clear causal relationship.']};}
  }catch(e){}

  function fixVisibleContent(root=document){
    try{
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),replacements=[['Moving production to lower-cost locations, often abroad.','Hiring or contracting with an outside company. Outsourcing can happen domestically or abroad; moving work to another country is offshoring.'],['When a company moves work to another company or country, usually to cut costs.','When a company hires or contracts with an outside company to perform work. Outsourcing can be domestic or international.'],['A US company moves its call center to the Philippines because labor is cheaper. US workers lose jobs; Filipino workers gain them.','A U.S. company hires an independently owned customer-service firm to handle its call center. If that firm is abroad, the decision is both outsourcing and offshoring.'],['A company moves manufacturing to a lower-wage country.','A company hires an outside manufacturer to produce components. If that manufacturer is in another country, the work is both outsourced and offshored.']],nodes=[];let n;
      while((n=walker.nextNode()))nodes.push(n);
      nodes.forEach(node=>replacements.forEach(([from,to])=>{if(node.nodeValue&&node.nodeValue.includes(from))node.nodeValue=node.nodeValue.split(from).join(to);}));
      document.querySelectorAll('.model-list button').forEach(btn=>{const name=Object.keys(MODEL_TOPICS).find(k=>btn.textContent.includes(k));if(!name)return;const small=btn.querySelector('small');if(small)small.textContent='CED Topic '+MODEL_TOPICS[name];});
      const modelHeading=[...document.querySelectorAll('.model-card h3, main h3')].find(h=>MODEL_TOPICS[h.textContent.trim()]);
      if(modelHeading){const topic=MODEL_TOPICS[modelHeading.textContent.trim()],card=modelHeading.closest('.model-card')||modelHeading.parentElement,pill=card?.querySelector('.pill');if(pill)pill.textContent='CED '+topic;}
    }catch(e){}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>fixVisibleContent());else fixVisibleContent();
  try{new MutationObserver(m=>{if(m.some(x=>x.addedNodes&&x.addedNodes.length))fixVisibleContent(document.getElementById('app')||document);}).observe(document.getElementById('app')||document.body,{childList:true,subtree:true});}catch(e){}

  try{
    if(typeof gradeOneFrq==='function'&&typeof window.__gradeFrqPart==='function'){
      gradeOneFrq=function(prompt,answer){const full=String(answer||''),hasLabels=prompt.parts.some(p=>new RegExp('(?:^|\\n)\\s*'+p[0]+'\\s*[\\).:-]','i').test(full));const parts=prompt.parts.map(part=>{if(!full.trim()){const r=window.__gradeFrqPart(part,'');return {part:part[0],earned:false,status:r.status,fix:part[3],note:r.feedback};}if(!hasLabels)return {part:part[0],earned:false,status:'unverified',coachingOnly:true,fix:part[3],note:`Part ${part[0]}: Not automatically verified—compare with the rubric. Label each response part so Study Buddy can match your evidence to the correct rubric point.`};const text=window.__extractFrqPart(part[0],full),r=window.__gradeFrqPart(part,text);return {part:part[0],earned:r.status==='verified',status:r.status,coachingOnly:r.status==='unverified',fix:part[3],note:r.feedback};});return {score:parts.filter(p=>p.status==='verified').length,total:parts.length,uncertain:parts.filter(p=>p.status==='unverified').length,parts};};
    }
  }catch(e){}

  try{
    if(typeof buildPracticeExam==='function'){
      const baseBuild=buildPracticeExam;let cache=null;
      const stop=new Set('which what best most following according based would could does this that these those from with about into when where why how one two three example illustrates described statement pattern process likely directly'.split(' ')),clean=s=>String(s||'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim(),terms=s=>clean(s).split(' ').filter(w=>w.length>3&&!stop.has(w)),exactKey=q=>clean(q.q)+'|'+clean(q.answer),conceptKey=q=>[...new Set([...terms(q.q),...terms(q.answer)])].sort().join(' '),similarity=(a,b)=>{const A=new Set(terms(a.q)),B=new Set(terms(b.q));if(!A.size||!B.size)return 0;let hit=0;A.forEach(x=>{if(B.has(x))hit++;});return hit/Math.min(A.size,B.size);},conceptualDuplicate=(a,b)=>exactKey(a)===exactKey(b)||similarity(a,b)>=.72||(clean(a.answer)===clean(b.answer)&&similarity(a,b)>=.45);
      function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
      function shuffledChoices(q,seed){const choices=[...q.choices];choices.sort((a,b)=>hash(seed+'|'+a)-hash(seed+'|'+b));return {...q,choices};}
      function rebalanceStimulus(chosen,candidates){let count=chosen.filter(q=>q.stimulus).length,guard=0;while((count<18||count>24)&&guard++<120){const need=count<18;let swapped=false;for(let i=0;i<chosen.length;i++){if(Boolean(chosen[i].stimulus)===need)continue;const unit=Number(chosen[i].unit),replacement=candidates.find(q=>Number(q.unit)===unit&&Boolean(q.stimulus)===need&&!chosen.some((x,j)=>j!==i&&exactKey(x)===exactKey(q))&&!chosen.some((x,j)=>j!==i&&conceptualDuplicate(x,q)));if(replacement){chosen[i]=replacement;count+=need?1:-1;swapped=true;break;}}if(!swapped)break;}return count>=18&&count<=24;}
      function buildCache(){
        const originals=[1,2,3].map(n=>baseBuild(n)),raw=[...originals.flatMap(e=>e.mcq)];
        try{if(typeof quiz!=='undefined'&&typeof normalizeExamItem==='function')raw.push(...quiz.map(normalizeExamItem));}catch(e){}
        try{if(typeof AP_SIMULATOR_EXTENSION!=='undefined'&&typeof normalizeExamItem==='function')raw.push(...AP_SIMULATOR_EXTENSION.map(normalizeExamItem));}catch(e){}
        try{if(typeof validatedStimulusBank==='function')raw.push(...validatedStimulusBank());}catch(e){}
        const byExact=new Map();raw.filter(q=>q&&q.q&&Array.isArray(q.choices)&&q.choices.length===4&&q.choices.includes(q.answer)&&Number(q.unit)>=1&&Number(q.unit)<=7).forEach(q=>{if(!byExact.has(exactKey(q)))byExact.set(exactKey(q),q);});
        const pool=[...byExact.values()],usage=new Map(),selected=[],targets={1:8,2:9,3:8,4:8,5:9,6:9,7:9};
        for(let examNum=1;examNum<=3;examNum++){
          const chosen=[],candidates=[...pool].sort((a,b)=>{const ua=usage.get(exactKey(a))||0,ub=usage.get(exactKey(b))||0;return ua-ub||hash('exam'+examNum+'|'+conceptKey(a))-hash('exam'+examNum+'|'+conceptKey(b));});
          for(let unit=1;unit<=7;unit++)for(const q of candidates){if(chosen.filter(x=>Number(x.unit)===unit).length>=targets[unit])break;if(Number(q.unit)!==unit||chosen.some(x=>exactKey(x)===exactKey(q))||chosen.some(x=>conceptualDuplicate(x,q)))continue;chosen.push(q);}
          for(const q of candidates){if(chosen.length>=60)break;if(chosen.some(x=>exactKey(x)===exactKey(q))||chosen.some(x=>conceptualDuplicate(x,q)))continue;chosen.push(q);}
          for(const q of candidates){if(chosen.length>=60)break;if(chosen.some(x=>exactKey(x)===exactKey(q)))continue;chosen.push(q);}
          if(chosen.length!==60)throw new Error('Study Buddy could not assemble 60 validated questions without exact duplicates.');
          if(!rebalanceStimulus(chosen,candidates))throw new Error('Study Buddy could not preserve the validated 30–40% stimulus range for this exam.');
          chosen.forEach(q=>usage.set(exactKey(q),(usage.get(exactKey(q))||0)+1));selected.push({...originals[examNum-1],mcq:chosen.map((q,i)=>shuffledChoices(q,'practice-'+examNum+'-'+i))});
        }
        const overlaps=[];for(let a=0;a<3;a++)for(let b=a+1;b<3;b++){const A=new Set(selected[a].mcq.map(exactKey)),overlap=selected[b].mcq.filter(q=>A.has(exactKey(q))).length;overlaps.push({exams:`${a+1}-${b+1}`,overlap,rate:overlap/60});}
        window.__examQualityReport={poolSize:pool.length,overlaps,conceptualDuplicate};return selected;
      }
      buildPracticeExam=function(examNum){if(!cache)cache=buildCache();return cache[Math.max(1,Math.min(3,Number(examNum)||1))-1];};
    }
    if(typeof practiceExamsPage==='function'){
      const basePage=practiceExamsPage;practiceExamsPage=function(){try{let html=basePage(),idx=0;html=html.replace(/<b>Estimated FRQ score: (\d+)\/(\d+)<\/b>/g,(m,s,t)=>{const f=(typeof examFrqFeedback!=='undefined'&&examFrqFeedback)?examFrqFeedback[idx++]:null;return f&&f.uncertain?`<b>Automatically verified: ${s}/${t} possible points · ${f.uncertain} need${f.uncertain===1?'s':''} rubric check</b>`:`<b>Automatically verified: ${s}/${t} possible points</b>`;});return html;}catch(e){console.error('Practice exam assembly failed',e);return `<main><section class="card"><h2>🧪 Practice Exam</h2><div class="box-warn"><b>We couldn’t assemble a trustworthy 60-question exam right now.</b><p>Your progress is safe. Please choose Unit Review, Practice & Mastery, or try this exam again after reloading. Study Buddy will not fill the exam with low-quality duplicate questions just to reach 60.</p></div></section></main>`;}};
    }
  }catch(e){console.error('Student reliability exam patch failed',e);}

  window.__studentReliabilityRegression=function(){const p=['A','Explain','Explain how improved transportation can affect market access.','Improved transportation increases market access because lower travel time connects producers with more consumers.'],cases=[['correct','Better roads led to lower travel time, connecting farmers to more buyers.','verified'],['alternate-valid','Faster rail resulted in producers reaching a larger customer base.','verified'],['partial','Transportation can help farmers.','unverified'],['vague','It makes things better for people.','unverified'],['nonsense','asdf qwrty zzzzz','incorrect']];return cases.map(([name,text,expected])=>{const r=window.__gradeFrqPart(p,text);return {name,expected,actual:r.status,pass:r.status===expected};});};
})();