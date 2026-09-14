(()=>{
  const nav=document.getElementById('nav');
  const app=document.getElementById('app');
  if(!nav||!app)return;

  const EXAM_DATE=new Date('2027-05-03T08:00:00-07:00');
  const findTab=re=>typeof tabs!=='undefined'?tabs.find(t=>re.test(String(t&&t[1]||''))):null;
  const hiddenTopLevel=[/AP Mastery/i,/Map Lab/i,/Use the Vocab/i,/Visual Practice/i];
  const primary=[/home/i,/unit review/i,/practice/i,/key terms|vocabulary/i,/maps?\s*&?\s*visual/i,/frq coach/i,/ap exam prep/i];

  function syncExamBadge(){
    const label=document.querySelector('.exam-badge .date');
    const countdown=document.getElementById('countdown');
    if(label)label.textContent='May 3, 2027 Exam';
    if(countdown){
      const days=Math.max(0,Math.ceil((EXAM_DATE-Date.now())/86400000));
      countdown.textContent=days===0?'Exam day':`${days} days`;
    }
  }

  function consolidateTabs(){
    if(typeof tabs==='undefined')return;
    const mastery=findTab(/^\s*(?:[^A-Za-z0-9]*)?Mastery\s*$/i);
    const visuals=tabs.find(t=>String(t&&t[0])==='visualLab')||findTab(/Maps & Visual Practice|Visual Lab/i);
    const finalAP=findTab(/Final AP Mode|AP Exam Prep/i);
    if(mastery)mastery[1]='🎯 Practice';
    if(visuals)visuals[1]='🗺️ Maps & Visuals';
    if(finalAP)finalAP[1]='🎓 AP Exam Prep';
  }

  function polishNav(){
    consolidateTabs();
    if(typeof renderNav==='function'&&!nav.dataset.consolidating){
      nav.dataset.consolidating='1';
      try{renderNav();}catch(e){}
      delete nav.dataset.consolidating;
    }
    const buttons=[...nav.querySelectorAll('button')];
    buttons.forEach((b,i)=>{
      const text=b.textContent.trim();
      const hide=hiddenTopLevel.some(re=>re.test(text));
      b.hidden=hide;
      b.classList.toggle('nav-consolidated-hidden',hide);
      b.classList.remove('nav-core','nav-more');
      if(!hide){
        b.classList.add(i===0||primary.some(re=>re.test(text))?'nav-core':'nav-more');
        b.setAttribute('aria-label',text);
      }
      if(i===0)b.classList.add('nav-first');
    });
    nav.classList.toggle('nav-has-more',buttons.some(b=>!b.hidden&&b.classList.contains('nav-more')));
  }

  function clickNav(re){
    const b=[...nav.querySelectorAll('button')].find(x=>!x.hidden&&re.test(x.textContent));
    if(b){b.click();window.scrollTo({top:0,behavior:'smooth'});}
  }

  function resultIsVisible(){
    const text=(app.textContent||'').replace(/\s+/g,' ');
    return !!app.querySelector('.score-circle,.quiz-results,.practice-results,.unit-review-results,.ai-result') || /(practice|review|quiz|session) complete|you finished|your score/i.test(text);
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
    box.querySelector('[data-next="weak"]').addEventListener('click',()=>clickNav(/Practice/i));
    box.querySelector('[data-next="unit"]').addEventListener('click',()=>clickNav(/unit review/i));
    box.querySelector('[data-next="home"]').addEventListener('click',()=>clickNav(/home|start/i));
  }

  let visualSectionName='maps';
  let mapActivityIndex=0,mapActivityChoice=null,mapActivityScore=0;
  const mapInfo={
    reference:{title:'Reference map',notice:'Locations, boundaries, roads, rivers, and place names are the focus.',use:'Finding where something is and understanding its location relative to other features.',limit:'It usually does not show a statistical variable or explain why a pattern exists.',ap:'Use reference maps for location evidence: “The city is near the river and interstate.”'},
    choropleth:{title:'Choropleth map',notice:'Defined areas change shade or color according to a value.',use:'Comparing rates, percentages, or standardized values among states, counties, or countries.',limit:'Large areas can look more important than they are; raw totals can mislead when populations differ.',ap:'Check the legend and ask whether the map uses a rate/percentage or a raw total.'},
    symbol:{title:'Proportional-symbol map',notice:'Symbols stay at locations but change size to represent magnitude.',use:'Comparing totals such as city population, trade volume, or number of events.',limit:'Large symbols can overlap and hide exact locations or smaller values.',ap:'Describe both magnitude and spatial pattern: “The largest symbols cluster in…”'},
    dots:{title:'Dot-density map',notice:'Repeated dots represent a fixed amount of a phenomenon.',use:'Showing concentration, dispersion, and distribution within larger areas.',limit:'Dots usually do not mark exact individual locations, and dense areas can visually merge.',ap:'Use words such as clustered, dispersed, concentrated, or sparse.'},
    isoline:{title:'Isoline map',notice:'Lines connect places with equal values.',use:'Continuous data such as elevation, temperature, pressure, or precipitation.',limit:'Values between lines are estimated; close lines can be hard to read.',ap:'Closer lines usually mean a faster change across space.'},
    cartogram:{title:'Cartogram',notice:'Geographic areas are intentionally resized according to a variable.',use:'Making magnitude visually obvious, such as population or GDP.',limit:'Distortion makes exact location, shape, and distance harder to interpret.',ap:'Do not mistake resized area for actual land area.'}
  };

  function mapSvg(kind){
    const open='<svg viewBox="0 0 460 190" class="lesson-svg map-learning-svg" role="img"';
    if(kind==='reference')return `${open} aria-label="Reference map schematic"><rect x="35" y="25" width="390" height="125" rx="10" fill="#f8fafc" stroke="#64748b"/><path d="M165 25v125M295 25v125" stroke="#94a3b8"/><path d="M55 118 C130 80 185 135 255 95 S355 90 410 55" fill="none" stroke="#2563eb" stroke-width="5"/><path d="M70 45 L375 140" stroke="#111827" stroke-width="7"/><text x="78" y="42" font-size="14">Highway</text><text x="330" y="55" font-size="14">River</text><text x="176" y="90" font-size="14">Boundary</text><text x="35" y="177" font-size="14">Locations and features—not one statistical variable</text></svg>`;
    if(kind==='choropleth')return `${open} aria-label="Choropleth map schematic"><rect x="35" y="35" width="120" height="100" fill="#dbeafe" stroke="#64748b"/><rect x="160" y="35" width="130" height="100" fill="#93c5fd" stroke="#64748b"/><rect x="295" y="35" width="130" height="100" fill="#1d4ed8" stroke="#64748b"/><text x="45" y="170" font-size="14">Lighter</text><text x="350" y="170" font-size="14">Darker = higher value</text></svg>`;
    if(kind==='symbol')return `${open} aria-label="Proportional symbol map schematic"><rect x="35" y="25" width="390" height="125" rx="10" fill="#f8fafc" stroke="#94a3b8"/><circle cx="105" cy="88" r="12" fill="#2563eb"/><circle cx="230" cy="70" r="26" fill="#2563eb"/><circle cx="355" cy="98" r="43" fill="#2563eb"/><text x="70" y="174" font-size="14">Larger symbol = larger value</text></svg>`;
    if(kind==='dots')return `${open} aria-label="Dot density map schematic"><rect x="35" y="25" width="390" height="125" rx="10" fill="#ecfccb" stroke="#64748b"/>${[[80,65],[95,78],[110,58],[125,86],[148,72],[270,105],[292,94],[315,112],[345,75],[365,92]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="#334155"/>`).join('')}<text x="55" y="174" font-size="14">Each dot = a fixed amount; density reveals concentration</text></svg>`;
    if(kind==='isoline')return `${open} aria-label="Isoline map schematic"><rect x="35" y="25" width="390" height="125" rx="10" fill="#f8fafc" stroke="#94a3b8"/><path d="M55 125 C120 45 200 48 250 105 S355 145 410 55" fill="none" stroke="#334155" stroke-width="3"/><path d="M55 145 C125 75 205 73 260 125 S360 160 420 85" fill="none" stroke="#64748b" stroke-width="3"/><path d="M65 98 C135 25 205 30 240 78 S340 115 395 35" fill="none" stroke="#94a3b8" stroke-width="3"/><text x="120" y="45" font-size="13">30</text><text x="190" y="88" font-size="13">20</text><text x="280" y="138" font-size="13">10</text></svg>`;
    return `${open} aria-label="Cartogram schematic"><rect x="55" y="70" width="70" height="65" fill="#bfdbfe" stroke="#1e3a8a"/><rect x="140" y="35" width="155" height="125" fill="#60a5fa" stroke="#1e3a8a"/><rect x="310" y="80" width="75" height="55" fill="#dbeafe" stroke="#1e3a8a"/><text x="72" y="105" font-size="16">A</text><text x="205" y="100" font-size="18">B</text><text x="338" y="110" font-size="16">C</text><text x="50" y="180" font-size="14">Area is intentionally resized by the data</text></svg>`;
  }

  function patternSvg(){return `<svg viewBox="0 0 460 170" class="lesson-svg" role="img" aria-label="Clustered dispersed and linear patterns"><text x="40" y="24">Clustered</text><text x="185" y="24">Dispersed</text><text x="340" y="24">Linear</text>${[[55,65],[70,72],[60,90],[82,95],[48,100],[88,60]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="5"/>`).join('')}${[[190,55],[245,68],[210,110],[270,125],[185,140],[285,95]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="5"/>`).join('')}<path d="M345 48L420 140" stroke="currentColor"/><circle cx="350" cy="55" r="5"/><circle cx="365" cy="73" r="5"/><circle cx="380" cy="92" r="5"/><circle cx="395" cy="110" r="5"/><circle cx="410" cy="130" r="5"/></svg>`;}
  function pyramidSvg(){return `<svg viewBox="0 0 460 190" class="lesson-svg" role="img" aria-label="Population pyramid comparison"><line x1="230" y1="20" x2="230" y2="165" stroke="currentColor"/>${[72,62,51,39,28].map((w,i)=>{const y=135-i*25;return `<rect x="${230-w}" y="${y}" width="${w-3}" height="17"/><rect x="233" y="${y}" width="${w-3}" height="17"/>`;}).join('')}<text x="165" y="182">Rapid-growth shape</text></svg>`;}
  function dtmSvg(){return `<svg viewBox="0 0 460 190" class="lesson-svg" role="img" aria-label="Demographic Transition Model"><line x1="45" y1="155" x2="430" y2="155" stroke="currentColor"/><line x1="45" y1="155" x2="45" y2="25" stroke="currentColor"/><path d="M55 45 L130 48 L205 65 L280 105 L355 132 L425 136" fill="none" stroke="currentColor" stroke-width="4"/><path d="M55 52 L125 102 L200 132 L280 138 L355 138 L425 142" fill="none" stroke="currentColor" stroke-width="2"/><text x="300" y="65">Birth rate</text><text x="300" y="128">Death rate</text></svg>`;}

  const mapActivities=[
    {kind:'choropleth',q:'What map type is shown?',choices:['Choropleth map','Reference map','Dot-density map','Cartogram'],answer:0,why:'Defined areas are shaded according to a value.'},
    {kind:'dots',q:'What spatial pattern does this map best help you describe?',choices:['Concentration and dispersion','Exact road locations','Elevation contours only','Political boundaries only'],answer:0,why:'Dot-density maps are designed to show where a phenomenon is concentrated or sparse.'},
    {kind:'symbol',q:'Which statement is the strongest AP-style interpretation?',choices:['The largest mapped value is in the eastern location','The map proves the eastern place has the largest land area','Every circle marks the same value','The western location has the highest density'],answer:0,why:'On proportional-symbol maps, symbol size represents magnitude—not land area or density unless the legend says so.'},
    {kind:'isoline',q:'If two isolines are very close together, what does that usually mean?',choices:['The mapped value changes quickly over a short distance','The map is a cartogram','Population is evenly distributed','The lines show political borders'],answer:0,why:'Closely spaced isolines indicate a steep or rapid spatial change.'},
    {kind:'reference',q:'A world map hides neighborhood differences that appear on a city map. Which concept is most important?',choices:['Scale of analysis','Relocation diffusion','Centripetal force','Agricultural density'],answer:0,why:'Patterns can look different when the scale of analysis changes.'}
  ];

  function mapCard(key){const m=mapInfo[key];return `<button type="button" class="visual-card visual-card-button" data-map-detail="${key}" aria-expanded="false"><span class="visual-card-title">${m.title}</span><span class="visual-card-sub">${m.notice}</span>${mapSvg(key)}<span class="visual-card-cta">Click to learn how to read it →</span></button>`;}
  function mapDetail(key){const m=mapInfo[key];return `<div class="map-detail-panel" data-map-panel="${key}"><div><span class="pill">Map skill</span><h4>${m.title}</h4></div><div class="map-detail-grid"><div><b>Best for</b><p>${m.use}</p></div><div><b>Limitation</b><p>${m.limit}</p></div><div><b>AP move</b><p>${m.ap}</p></div></div><button type="button" class="btn-secondary" data-close-map>Close</button></div>`;}

  function mapActivityHtml(){
    if(mapActivityIndex>=mapActivities.length)return `<section class="map-activity"><span class="pill">Map Detective complete</span><h4>${mapActivityScore} of ${mapActivities.length} correct</h4><p>${mapActivityScore>=4?'Strong map-reading start.':'Review the map cards above, then try once more.'}</p><button class="btn-primary" type="button" data-map-restart>Try again</button></section>`;
    const a=mapActivities[mapActivityIndex];
    const answered=mapActivityChoice!==null;
    return `<section class="map-activity"><div class="map-activity-head"><div><span class="pill">Mapping activity</span><h4>Map Detective · ${mapActivityIndex+1} of ${mapActivities.length}</h4></div><b>${mapActivityScore} correct</b></div>${mapSvg(a.kind)}<p><b>${a.q}</b></p><div class="quiz-options">${a.choices.map((c,i)=>`<button type="button" class="quiz-option ${answered&&i===a.answer?'correct':answered&&i===mapActivityChoice&&i!==a.answer?'wrong':''}" data-map-answer="${i}" ${answered?'disabled':''}>${String.fromCharCode(65+i)}. ${c}</button>`).join('')}</div>${answered?`<div class="${mapActivityChoice===a.answer?'box-good':'box-warn'}"><b>${mapActivityChoice===a.answer?'Correct':'Not yet.'}</b><p>${a.why}</p></div><button type="button" class="btn-primary" data-map-next>${mapActivityIndex===mapActivities.length-1?'See results':'Next challenge →'}</button>`:''}</section>`;
  }

  function renderVisualPractice(){
    if(typeof active!=='undefined')active='visualLab';
    if(typeof renderNav==='function')renderNav();
    const maps=`<h3>Unit 1: Maps</h3><p class="muted">Click any map type to learn what to notice, when to use it, and the limitation AP questions often test.</p><div class="visual-grid map-learning-grid">${['reference','choropleth','symbol','dots','isoline','cartogram'].map(mapCard).join('')}</div><div id="mapDetailHost" aria-live="polite"></div><div id="mapActivityHost">${mapActivityHtml()}</div>`;
    const spatial=`<h3>Unit 1: Spatial Concepts</h3><div class="visual-grid"><figure class="visual-card"><figcaption><b>Clustered, dispersed, and linear patterns</b></figcaption>${patternSvg()}</figure><div class="visual-card"><b>Scale of analysis</b><p>A national pattern can hide regional or local variation.</p></div><div class="visual-card"><b>GIS layers</b><p>Geographers combine location-based layers to investigate relationships.</p></div><div class="visual-card"><b>Distance decay</b><p>Interaction often decreases as distance increases.</p></div></div>`;
    const population=`<h3>Unit 2: Population & Migration</h3><div class="visual-grid"><figure class="visual-card"><figcaption><b>Population pyramids</b><br>Read age structure before explaining consequences.</figcaption>${pyramidSvg()}</figure><figure class="visual-card"><figcaption><b>Demographic Transition Model</b><br>Compare changes in birth and death rates.</figcaption>${dtmSvg()}</figure><div class="visual-card"><b>Migration flows</b><p>Identify origin, destination, push/pull factors, and consequences.</p></div></div>`;
    app.innerHTML=`<main class="wrap"><section class="card"><h2>🗺️ Maps & Visuals</h2><p>Learn the visual first, then practice interpreting it the way AP Human Geography expects.</p><div class="box-info"><b>Learn → Try → Practice</b><p>Open a map card, complete the Map Detective activity, then move into AP-style visual questions when you're ready.</p><div class="button-row"><button class="btn-primary" data-open-visual="12">More Units 1–2 visual practice</button><button class="btn-secondary" data-open-visual="37">Units 3–7 visual practice</button></div></div><div class="button-row"><button class="${visualSectionName==='maps'?'btn-primary':'btn-secondary'}" data-visual="maps">Unit 1 Maps</button><button class="${visualSectionName==='spatial'?'btn-primary':'btn-secondary'}" data-visual="spatial">Spatial Concepts</button><button class="${visualSectionName==='population'?'btn-primary':'btn-secondary'}" data-visual="population">Unit 2 Population</button></div></section><section class="card">${visualSectionName==='maps'?maps:visualSectionName==='spatial'?spatial:population}</section></main>`;

    app.querySelectorAll('[data-visual]').forEach(b=>b.addEventListener('click',()=>{visualSectionName=b.dataset.visual;renderVisualPractice();}));
    app.querySelectorAll('[data-open-visual]').forEach(b=>b.addEventListener('click',()=>{
      if(b.dataset.openVisual==='12'){active='visualPractice';if(typeof vpMode==='function')vpMode('mcq');else render();}
      else{active='visualPractice37';if(typeof v37Mode==='function')v37Mode('mcq');else render();}
      window.scrollTo({top:0,behavior:'smooth'});
    }));
    app.querySelectorAll('[data-map-detail]').forEach(b=>b.addEventListener('click',()=>{
      const host=document.getElementById('mapDetailHost');
      if(!host)return;
      app.querySelectorAll('[data-map-detail]').forEach(x=>x.setAttribute('aria-expanded','false'));
      b.setAttribute('aria-expanded','true');
      host.innerHTML=mapDetail(b.dataset.mapDetail);
      host.querySelector('[data-close-map]').addEventListener('click',()=>{host.innerHTML='';b.setAttribute('aria-expanded','false');b.focus();});
      host.scrollIntoView({behavior:'smooth',block:'nearest'});
    }));
    app.querySelectorAll('[data-map-answer]').forEach(b=>b.addEventListener('click',()=>{
      if(mapActivityChoice!==null)return;
      mapActivityChoice=Number(b.dataset.mapAnswer);
      if(mapActivityChoice===mapActivities[mapActivityIndex].answer)mapActivityScore++;
      renderVisualPractice();
      document.getElementById('mapActivityHost')?.scrollIntoView({behavior:'smooth',block:'center'});
    }));
    app.querySelector('[data-map-next]')?.addEventListener('click',()=>{mapActivityIndex++;mapActivityChoice=null;renderVisualPractice();document.getElementById('mapActivityHost')?.scrollIntoView({behavior:'smooth',block:'center'});});
    app.querySelector('[data-map-restart]')?.addEventListener('click',()=>{mapActivityIndex=0;mapActivityChoice=null;mapActivityScore=0;renderVisualPractice();});
  }

  try{consolidateTabs();if(typeof renderNav==='function')renderNav();}catch(e){}
  nav.addEventListener('click',e=>{
    const b=e.target.closest('button');
    if(!b||!/Maps & Visuals|Maps & Visual Practice|Visual Lab/i.test(b.textContent||''))return;
    e.preventDefault();e.stopImmediatePropagation();renderVisualPractice();window.scrollTo({top:0,behavior:'smooth'});
  },true);

  // Keep adaptive retries useful without repeating the exact missed question.
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
          const qs=getQuizSet(),q=qs[qIndex%qs.length],correct=choice===q[3];
          if(!correct)missed={sig:sig(q),key:conceptKey(q),unit:unitOf(q),remaining:3};
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
      const filtered=deck.filter(q=>sig(q)!==missed.sig);if(!filtered.length)return deck;
      const alts=filtered.filter(q=>conceptKey(q)===missed.key);
      if(alts.length){const preferred=alts[Math.abs((typeof qIndex==='number'?qIndex:0))%alts.length],i=filtered.indexOf(preferred);if(i>=0)filtered.splice(i,1);const target=Math.min(filtered.length,Math.max(0,(typeof qIndex==='number'?qIndex+1:0)%Math.max(1,filtered.length+1)));filtered.splice(target,0,preferred);}
      return filtered;
    };
  }
  window.__aphgRetryVariantGuard={signature:sig,conceptKey,getMissed:()=>missed};

  const observer=new MutationObserver(()=>{if(!nav.dataset.consolidating)polishNav();addPayoff();syncExamBadge();});
  observer.observe(document.body,{childList:true,subtree:true});
  polishNav();syncExamBadge();setInterval(syncExamBadge,30000);setTimeout(addPayoff,250);
})();
