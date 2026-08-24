(()=>{
  const nav=document.getElementById('nav');
  const app=document.getElementById('app');
  if(!nav||!app)return;

  const primary=[/home/i,/unit review/i,/practice.*mastery|mastery.*practice/i,/key terms|vocabulary/i,/frq coach/i];

  function polishNav(){
    const buttons=[...nav.querySelectorAll('button')];
    buttons.forEach((b,i)=>{
      const t=b.textContent.trim();
      b.classList.remove('nav-core','nav-more');
      if(i===0||primary.some(r=>r.test(t))) b.classList.add('nav-core');
      else b.classList.add('nav-more');
      b.setAttribute('aria-label',t);
      if(i===0)b.classList.add('nav-first');
    });
    if(buttons.some(b=>b.classList.contains('nav-more'))) nav.classList.add('nav-has-more');
  }

  function clickNav(re){
    const b=[...nav.querySelectorAll('button')].find(x=>re.test(x.textContent));
    if(b){b.click();window.scrollTo({top:0,behavior:'smooth'});}
  }

  function resultIsVisible(){
    const text=(app.textContent||'').replace(/\s+/g,' ');
    return !!app.querySelector('.score-circle,.quiz-results,.practice-results,.unit-review-results,.ai-result') ||
      /(practice|review|quiz|session) complete|you finished|your score/i.test(text);
  }

  function addPayoff(){
    if(!resultIsVisible()||app.querySelector('.freshman-progress-payoff'))return;
    const result=app.querySelector('.score-circle,.quiz-results,.practice-results,.unit-review-results,.ai-result');
    if(!result)return;
    const host=result.closest('.card')||result.parentElement;
    if(!host)return;
    const box=document.createElement('section');
    box.className='freshman-progress-payoff';
    box.setAttribute('aria-label','Study session progress');
    box.innerHTML=`<div class="payoff-check">✓</div><div class="payoff-copy"><b>Nice work — that practice counted.</b><span>You just gave Study Buddy better evidence about what you know. Keep the momentum going with one small next step.</span><div class="payoff-actions"><button type="button" data-next="weak">Practice a weak spot</button><button type="button" data-next="unit">Review my unit</button><button type="button" data-next="home">I'm done for now</button></div></div>`;
    host.appendChild(box);
    box.querySelector('[data-next="weak"]').addEventListener('click',()=>clickNav(/practice.*mastery|mastery.*practice/i));
    box.querySelector('[data-next="unit"]').addEventListener('click',()=>clickNav(/unit review/i));
    box.querySelector('[data-next="home"]').addEventListener('click',()=>clickNav(/home|start/i));
  }

  // ---- Maps & Visual Practice: final load-order repair ----
  let visualSectionName='maps';
  function visualSvg(kind){
    if(kind==='patterns')return `<svg viewBox="0 0 460 170" class="lesson-svg" role="img" aria-label="Clustered dispersed and linear patterns"><text x="40" y="24">Clustered</text><text x="185" y="24">Dispersed</text><text x="340" y="24">Linear</text>${[[55,65],[70,72],[60,90],[82,95],[48,100],[88,60]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="5"/>`).join('')}${[[190,55],[245,68],[210,110],[270,125],[185,140],[285,95]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="5"/>`).join('')}<path d="M345 48L420 140" stroke="currentColor"/><circle cx="350" cy="55" r="5"/><circle cx="365" cy="73" r="5"/><circle cx="380" cy="92" r="5"/><circle cx="395" cy="110" r="5"/><circle cx="410" cy="130" r="5"/></svg>`;
    if(kind==='pyramid')return `<svg viewBox="0 0 460 190" class="lesson-svg" role="img" aria-label="Population pyramid comparison"><line x1="230" y1="20" x2="230" y2="165" stroke="currentColor"/>${[72,62,51,39,28].map((w,i)=>{const y=135-i*25;return `<rect x="${230-w}" y="${y}" width="${w-3}" height="17"/><rect x="233" y="${y}" width="${w-3}" height="17"/>`;}).join('')}<text x="165" y="182">Rapid-growth shape</text></svg>`;
    if(kind==='dtm')return `<svg viewBox="0 0 460 190" class="lesson-svg" role="img" aria-label="Demographic Transition Model"><line x1="45" y1="155" x2="430" y2="155" stroke="currentColor"/><line x1="45" y1="155" x2="45" y2="25" stroke="currentColor"/><path d="M55 45 L130 48 L205 65 L280 105 L355 132 L425 136" fill="none" stroke="currentColor" stroke-width="4"/><path d="M55 52 L125 102 L200 132 L280 138 L355 138 L425 142" fill="none" stroke="currentColor" stroke-width="2"/><text x="300" y="65">Birth rate</text><text x="300" y="128">Death rate</text></svg>`;
    return `<svg viewBox="0 0 460 170" class="lesson-svg" role="img" aria-label="Map type schematic"><rect x="35" y="30" width="390" height="105" rx="12" fill="none" stroke="currentColor"/><path d="M165 30v105M295 30v105" stroke="currentColor"/><circle cx="95" cy="80" r="9"/><circle cx="230" cy="70" r="18"/><circle cx="360" cy="95" r="28"/><text x="85" y="155">Symbols and areas encode geographic data</text></svg>`;
  }
  function renderVisualPractice(){
    if(typeof active!=='undefined') active='visualLab';
    if(typeof renderNav==='function') renderNav();
    const maps=`<h3>Unit 1: Maps</h3><div class="visual-grid"><figure class="visual-card"><figcaption><b>Reference map</b><br>Use it to locate places and boundaries.</figcaption>${visualSvg('map')}</figure><figure class="visual-card"><figcaption><b>Choropleth map</b><br>Areas are shaded according to a variable.</figcaption>${visualSvg('map')}</figure><figure class="visual-card"><figcaption><b>Proportional-symbol map</b><br>Larger symbols represent larger values.</figcaption>${visualSvg('map')}</figure><div class="visual-card"><b>Also know</b><p>Dot-density, isoline, and cartogram maps. For each one, identify what changes visually, describe the spatial pattern, and explain one limitation.</p></div></div>`;
    const spatial=`<h3>Unit 1: Spatial Concepts</h3><div class="visual-grid"><figure class="visual-card"><figcaption><b>Clustered, dispersed, and linear patterns</b></figcaption>${visualSvg('patterns')}</figure><div class="visual-card"><b>Scale of analysis</b><p>A national pattern can hide regional or local variation.</p></div><div class="visual-card"><b>GIS layers</b><p>Geographers combine location-based layers to investigate relationships.</p></div><div class="visual-card"><b>Distance decay</b><p>Interaction often decreases as distance increases.</p></div></div>`;
    const population=`<h3>Unit 2: Population & Migration</h3><div class="visual-grid"><figure class="visual-card"><figcaption><b>Population pyramids</b><br>Read age structure before explaining consequences.</figcaption>${visualSvg('pyramid')}</figure><figure class="visual-card"><figcaption><b>Demographic Transition Model</b><br>Compare changes in birth and death rates.</figcaption>${visualSvg('dtm')}</figure><div class="visual-card"><b>Migration flows</b><p>Identify origin, destination, push/pull factors, and consequences.</p></div></div>`;
    app.innerHTML=`<main class="wrap"><section class="card"><h2>🗺️ Maps & Visual Practice</h2><p>Practice interpreting maps, graphs, models, and spatial patterns—the visual evidence AP Human Geography expects you to use.</p><div class="box-info"><b>Ready for AP-style visual questions?</b><p>Use a map, graph, model, or spatial diagram as evidence. Start with Units 1–2 if you are new; use Units 3–7 when you are preparing across the course.</p><div class="button-row"><button class="btn-primary" data-open-visual="12">Practice Units 1–2 visuals</button><button class="btn-secondary" data-open-visual="37">Practice Units 3–7 visuals</button></div></div><div class="button-row"><button class="${visualSectionName==='maps'?'btn-primary':'btn-secondary'}" data-visual="maps">Unit 1 Maps</button><button class="${visualSectionName==='spatial'?'btn-primary':'btn-secondary'}" data-visual="spatial">Spatial Concepts</button><button class="${visualSectionName==='population'?'btn-primary':'btn-secondary'}" data-visual="population">Unit 2 Population</button></div></section><section class="card">${visualSectionName==='maps'?maps:visualSectionName==='spatial'?spatial:population}</section></main>`;
    app.querySelectorAll('[data-visual]').forEach(b=>b.addEventListener('click',()=>{visualSectionName=b.dataset.visual;renderVisualPractice();}));
    app.querySelectorAll('[data-open-visual]').forEach(b=>b.addEventListener('click',()=>{
      if(b.dataset.openVisual==='12'){active='visualPractice';if(typeof vpMode==='function')vpMode('mcq');else render();}
      else{active='visualPractice37';if(typeof v37Mode==='function')v37Mode('mcq');else render();}
      window.scrollTo({top:0,behavior:'smooth'});
    }));
  }
  try{
    if(typeof tabs!=='undefined'){
      let visualTab=tabs.find(t=>t[0]==='visualLab');
      if(!visualTab){
        const insertAt=Math.max(1,tabs.findIndex(t=>/frq/i.test(String(t[1]||''))));
        tabs.splice(insertAt>0?insertAt:Math.max(1,tabs.length-1),0,['visualLab','🗺️ Maps & Visual Practice']);
        visualTab=tabs.find(t=>t[0]==='visualLab');
      }
      visualTab[1]='🗺️ Maps & Visual Practice';
      if(typeof renderNav==='function') renderNav();
    }
  }catch(e){}
  nav.addEventListener('click',e=>{
    const b=e.target.closest('button');
    if(!b||!/Visual Lab|Maps & Visual Practice/i.test(b.textContent||''))return;
    e.preventDefault();
    e.stopImmediatePropagation();
    renderVisualPractice();
    window.scrollTo({top:0,behavior:'smooth'});
  },true);

  // ---- Adaptive retry guard: same concept, different wording/question ----
  let missed=null;
  const sig=q=>String(q&&q[1]||'').toLowerCase().replace(/\s+/g,' ').trim();
  function unitOf(q){return Number(String(q&&q[0]||'').match(/\d+/)?.[0]||0);}
  function conceptKey(q){
    if(q&&q.topic)return String(q.topic);
    const u=unitOf(q),t=sig(q),answer=String(q&&q[3]||'').toLowerCase().replace(/\s+/g,' ').trim();
    if(answer&&answer.length>2&&!/^\d+$/.test(answer))return `${u}:answer:${answer}`;
    const patterns=[
      [/site|situation/,'site-situation'],[/scale of analysis|scale/,'scale'],[/gis|remote sensing/,'geodata'],[/choropleth|cartogram|map projection|map type/,'maps'],
      [/population pyramid|age structure|dependency ratio/,'age-structure'],[/demographic transition|dtm|stage [1-5]/,'dtm'],[/push factor|pull factor|migration|refugee/,'migration'],
      [/relocation diffusion|contagious diffusion|hierarchical diffusion|stimulus diffusion|diffusion process/,'diffusion'],[/language|religion|lingua franca/,'culture-spread'],
      [/gerrymander|packing|cracking/,'gerrymandering'],[/centripetal|centrifugal/,'political-forces'],[/devolution/,'devolution'],[/sovereignty|nation-state|nation|state/,'state-nation'],
      [/von th[uü]nen/,'von-thunen'],[/green revolution/,'green-revolution'],[/subsistence|commercial agriculture/,'ag-systems'],
      [/gentrification|displacement/,'gentrification'],[/concentric|sector model|multiple nuclei/,'urban-models'],[/sprawl|smart growth/,'urban-growth'],
      [/rostow|wallerstein|world-systems/,'development-theory'],[/hdi|gdp|gni/,'development-measures'],[/outsourc|offshor|deindustrial/,'global-industry']
    ];
    for(const [re,key] of patterns)if(re.test(t))return `${u}:${key}`;
    const words=t.replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w.length>5&&!/which|would|following|explain|describe|identify|scenario|because|student|geographer/.test(w)).slice(0,3).sort();
    return `${u}:${words.join('-')||'general'}`;
  }

  if(typeof chooseAnswer==='function'){
    const baseChoose=chooseAnswer;
    chooseAnswer=function(choice){
      try{
        if(typeof selectedChoice!=='undefined'&&!selectedChoice&&typeof getQuizSet==='function'){
          const qs=getQuizSet();
          const q=qs[qIndex%qs.length];
          const correct=choice===q[3];
          if(!correct){missed={sig:sig(q),key:conceptKey(q),unit:unitOf(q),remaining:3};}
          else if(missed&&sig(q)!==missed.sig){missed.remaining--;if(missed.remaining<=0)missed=null;}
        }
      }catch(e){}
      return baseChoose(choice);
    };
  }

  if(typeof adaptiveDeck==='function'){
    const baseAdaptiveDeck=adaptiveDeck;
    adaptiveDeck=function(){
      const deck=baseAdaptiveDeck();
      if(!missed||!Array.isArray(deck)||deck.length<2)return deck;
      const filtered=deck.filter(q=>sig(q)!==missed.sig);
      if(!filtered.length)return deck;
      const alts=filtered.filter(q=>conceptKey(q)===missed.key);
      if(alts.length){
        const preferred=alts[Math.abs((typeof qIndex==='number'?qIndex:0))%alts.length];
        const i=filtered.indexOf(preferred);
        if(i>=0)filtered.splice(i,1);
        const target=Math.min(filtered.length,Math.max(0,(typeof qIndex==='number'?qIndex+1:0)%Math.max(1,filtered.length+1)));
        filtered.splice(target,0,preferred);
      }
      return filtered;
    };
  }
  window.__aphgRetryVariantGuard={signature:sig,conceptKey,getMissed:()=>missed};

  const observer=new MutationObserver(()=>{polishNav();addPayoff();});
  observer.observe(document.body,{childList:true,subtree:true});
  polishNav();
  setTimeout(addPayoff,250);
})();
