(()=>{
  const nav=document.getElementById('nav');
  const app=document.getElementById('app');
  if(!nav||!app)return;

  const EXAM_DATE=new Date('2027-05-03T08:00:00-07:00');
  const findTab=re=>typeof tabs!=='undefined'?tabs.find(t=>re.test(String(t&&t[1]||''))):null;
  const hiddenTopLevel=[/AP Mastery/i,/AP Exam Prep/i,/Map Lab/i,/Use the Vocab/i,/Visual Practice/i];
  const primary=[/home/i,/unit review/i,/practice/i,/key terms|vocabulary/i,/maps?\s*&?\s*visual/i,/frq coach/i];

  function syncExamBadge(){
    const label=document.querySelector('.exam-badge .date');
    const countdown=document.getElementById('countdown');
    if(label&&label.textContent!=='May 3, 2027 Exam')label.textContent='May 3, 2027 Exam';
    if(countdown){
      const days=Math.max(0,Math.ceil((EXAM_DATE-Date.now())/86400000));
      const text=days===0?'Exam day':`${days} days`;
      if(countdown.textContent!==text)countdown.textContent=text;
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

  function polishNav(refresh=true){
    consolidateTabs();
    if(refresh&&typeof renderNav==='function'&&!nav.dataset.consolidating){
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
  let authenticMapData=null,authenticMapLoad=null,authenticMapUnavailable=false;
  let worldMapData=null,worldMapLoad=null,worldMapUnavailable=false;
  let mapActivityIndex=0,mapActivityChoice=null,mapActivityScore=0;
  let scaleActivityIndex=0,scaleActivityChoice=null,scaleActivityScore=0;
  const mapInfo={
    reference:{title:'Political reference map',notice:'Actual U.S. state and national boundaries from the Census Bureau.',use:'Locating countries, states, capitals, borders, and places relative to one another.',limit:'Boundaries show where political units are; they do not explain why a spatial pattern exists.',ap:'Political maps are reference maps. Use them for location and boundary evidence: “The state borders…”'},
    world:{title:'World political reference map',notice:'Actual country boundaries from Natural Earth at 1:110 million scale.',use:'Locating countries, international borders, and world regions.',limit:'A small-scale world map cannot show detailed local boundaries or internal variation.',ap:'Use the world view for global patterns, then change the scale of analysis to investigate regional or local differences.'},
    choropleth:{title:'Choropleth map',notice:'Actual states shaded by 2020 Census population (raw totals).',use:'Comparing rates, percentages, or standardized values among states, counties, or countries.',limit:'This example uses raw totals, so populous states look darkest regardless of their land area.',ap:'Check the legend and ask whether the map uses a rate/percentage or a raw total.'},
    symbol:{title:'Proportional-symbol map',notice:'Actual state locations sized by 2020 Census population.',use:'Comparing totals such as city population, trade volume, or number of events.',limit:'Large symbols can overlap and hide exact locations or smaller values.',ap:'Describe both magnitude and spatial pattern: “The largest symbols cluster in…”'},
    dots:{title:'Dot-density map',notice:'Practice visual: dots represent a fixed amount; focus on spatial concentration and distribution.',use:'Showing concentration, dispersion, and distribution within larger areas.',limit:'Dots usually do not mark exact individual locations, and dense areas can visually merge.',ap:'Use words such as clustered, dispersed, concentrated, or sparse.'},
    isoline:{title:'Isoline map',notice:'Practice visual: isolines connect places with equal values; focus on gradients and spatial change.',use:'Continuous data such as elevation, temperature, pressure, or precipitation.',limit:'Values between lines are estimated; close lines can be hard to read.',ap:'Closer lines usually mean a faster change across space.'},
    cartogram:{title:'Cartogram',notice:'Practice visual: areas are intentionally resized by a variable; focus on what distortion reveals and hides.',use:'Making magnitude visually obvious, such as population or GDP.',limit:'Distortion makes exact location, shape, and distance harder to interpret.',ap:'Do not mistake resized area for actual land area.'}
  };

  function populationColor(value){
    if(value>=20000000)return '#1e3a8a';
    if(value>=10000000)return '#1d4ed8';
    if(value>=6000000)return '#3b82f6';
    if(value>=3000000)return '#93c5fd';
    if(value>=1000000)return '#bfdbfe';
    return '#dbeafe';
  }

  function realMapSvg(kind){
    if(!authenticMapData)return '';
    const states=authenticMapData.states;
    const paths=states.map(s=>`<path d="${s.path}" fill="${kind==='choropleth'?populationColor(s.population):'#e2e8f0'}" stroke="${kind==='choropleth'?'#fff':'#64748b'}" stroke-width="${kind==='choropleth'?1.2:1.5}"><title>${s.name}${kind==='reference'?'':`: ${s.population.toLocaleString()} people`}</title></path>`).join('');
    const symbols=kind==='symbol'?states.map(s=>`<circle class="pop-symbol" cx="${s.cx}" cy="${s.cy}" r="${Math.max(4,Math.sqrt(s.population/39538223)*48).toFixed(1)}"><title>${s.name}: ${s.population.toLocaleString()} people</title></circle>`).join(''):'';
    const legend=kind==='choropleth'?`<g transform="translate(535 565)" aria-hidden="true">${['#dbeafe','#bfdbfe','#93c5fd','#3b82f6','#1d4ed8','#1e3a8a'].map((c,i)=>`<rect x="${i*48}" width="48" height="18" fill="${c}"/>`).join('')}<text x="0" y="38" font-size="20" fill="#334155">under 1M</text><text x="223" y="38" font-size="20" fill="#334155">20M+</text></g>`:kind==='symbol'?'<text x="525" y="592" font-size="20" fill="#334155">Larger circle = more people</text>':'';
    const label=kind==='reference'?'Reference map of actual U.S. state boundaries':kind==='choropleth'?'Choropleth map of 2020 Census state population totals':'Proportional symbol map of 2020 Census state population totals';
    return `<svg viewBox="0 0 975 610" class="lesson-svg map-learning-svg authentic-us-map" role="img" aria-label="${label}"><rect width="975" height="610" fill="#f8fafc"/>${paths}${symbols}${legend}</svg>`;
  }

  const WEST_STATES=['Alaska','Arizona','California','Colorado','Hawaii','Idaho','Montana','Nevada','New Mexico','Oregon','Utah','Washington','Wyoming'];
  const STATE_LABELS={Washington:'WA',Oregon:'OR',California:'CA',Idaho:'ID',Nevada:'NV',Arizona:'AZ',Utah:'UT',Montana:'MT',Wyoming:'WY',Colorado:'CO','New Mexico':'NM',Alaska:'AK',Hawaii:'HI'};

  function worldPoliticalMapSvg(){
    if(!worldMapData){
      const text=worldMapUnavailable?'The bundled world map could not load.':'Loading the bundled world political map…';
      return `<svg viewBox="0 0 1000 520" class="lesson-svg map-learning-svg" role="img" aria-label="${text}"><rect width="1000" height="520" fill="#f8fafc"/><text x="500" y="260" text-anchor="middle" font-size="24" fill="#475569">${text}</text></svg>`;
    }
    const paths=worldMapData.countries.map(country=>`<path d="${country.path}" fill="#dbeafe" stroke="#475569" stroke-width=".7" fill-rule="evenodd"><title>${country.name}</title></path>`).join('');
    return `<svg viewBox="0 0 1000 520" class="lesson-svg map-learning-svg authentic-world-map" role="img" aria-label="World political reference map using Natural Earth country boundaries"><rect width="1000" height="520" fill="#f8fafc"/>${paths}</svg>`;
  }

  function focusedRealMapSvg(names,label){
    if(!authenticMapData)return mapSvg('reference');
    const focus=new Set(names);
    const paths=authenticMapData.states.map(s=>`<path d="${s.path}" fill="${focus.has(s.name)?populationColor(s.population):'#e5e7eb'}" stroke="#fff" stroke-width="1.2" opacity="${focus.has(s.name)?1:.42}"><title>${s.name}: ${s.population.toLocaleString()} people</title></path>`).join('');
    const labels=authenticMapData.states.filter(s=>focus.has(s.name)&&STATE_LABELS[s.name]).map(s=>`<text x="${s.cx}" y="${s.cy+5}" text-anchor="middle" font-size="17" font-weight="800" fill="#0f172a">${STATE_LABELS[s.name]}</text>`).join('');
    return `<svg viewBox="0 0 975 610" class="lesson-svg map-learning-svg authentic-us-map" role="img" aria-label="${label}"><rect width="975" height="610" fill="#f8fafc"/>${paths}${labels}<text x="490" y="592" text-anchor="middle" font-size="20" fill="#334155">Highlighted areas are included in this scale of analysis</text></svg>`;
  }

  function scaleMapSvg(view){
    if(view==='global')return worldPoliticalMapSvg();
    if(view==='national')return authenticMapData?realMapSvg('choropleth'):mapSvg('choropleth');
    if(view==='west')return focusedRealMapSvg(WEST_STATES,'Regional-scale map highlighting the Census West region');
    return focusedRealMapSvg(['Washington'],'State-scale map highlighting Washington');
  }

  function loadWorldMap(){
    if(worldMapData||worldMapLoad||worldMapUnavailable)return worldMapLoad;
    worldMapLoad=fetch('data/world-political-map-110m.json?v=20260914-authentic',{cache:'force-cache'})
      .then(r=>{if(!r.ok)throw new Error(`World map data ${r.status}`);return r.json();})
      .then(data=>{if(!Array.isArray(data.countries)||data.countries.length<170)throw new Error('Incomplete world map data');worldMapData=data;return data;})
      .catch(()=>{worldMapUnavailable=true;return null;});
    return worldMapLoad;
  }

  function loadAuthenticMaps(){
    if(authenticMapData||authenticMapLoad||authenticMapUnavailable)return authenticMapLoad;
    authenticMapLoad=fetch('data/us-state-map-2020.json?v=20260914-authentic',{cache:'force-cache'})
      .then(r=>{if(!r.ok)throw new Error(`Map data ${r.status}`);return r.json();})
      .then(data=>{if(!Array.isArray(data.states)||data.states.length!==51)throw new Error('Incomplete map data');authenticMapData=data;return data;})
      .catch(()=>{authenticMapUnavailable=true;return null;});
    return authenticMapLoad;
  }

  function mapSvg(kind){
    if(kind==='world')return worldPoliticalMapSvg();
    if(['reference','choropleth','symbol'].includes(kind)&&authenticMapData)return realMapSvg(kind);
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
    {kind:'reference',q:'Which claim is directly supported by this political reference map?',choices:['California and Nevada share a boundary','California has a larger population than Nevada','Nevada has a higher population density than California','Migration between the states is increasing'],answer:0,why:'A political reference map directly supports claims about location and boundaries. Population, density, and migration require additional thematic data.'},
    {kind:'choropleth',q:'Texas and California are among the darkest states. What is the safest interpretation?',choices:['They have among the largest 2020 resident population totals','They have the highest population densities','Most residents live evenly across each state','Their populations grew fastest from 2010 to 2020'],answer:0,why:'The legend represents raw population totals. It does not show density, internal distribution, or change over time.'},
    {kind:'dots',q:'The dots form two dense clusters separated by a sparse area. Which description best states the spatial pattern?',choices:['The phenomenon is concentrated in two clusters rather than evenly dispersed','The two clusters must be political regions','The sparse area has no people','Distance caused the pattern'],answer:0,why:'First describe what the visual actually shows: clustered concentration with a sparse area between. A cause requires additional evidence.'},
    {kind:'symbol',q:'Several large symbols appear in the eastern half of the country. Which AP-style statement is best?',choices:['Larger population totals are concentrated in several eastern locations, although large western states also appear','The East has greater population density everywhere','Eastern states have more land area','The symbols prove why people migrated east'],answer:0,why:'Proportional symbols support statements about magnitude and spatial distribution. They do not by themselves establish density, land area, or causation.'},
    {kind:'isoline',q:'A geographer sees isolines packed closely together in one area and widely spaced elsewhere. What can the geographer infer?',choices:['The mapped variable changes more rapidly where the lines are close','Political boundaries are closer together there','Population is necessarily clustered there','The close lines represent a larger map scale'],answer:0,why:'Isoline spacing shows the rate of spatial change in the mapped variable. Close lines indicate a steeper gradient.'},
    {kind:'cartogram',q:'On a population cartogram, one country appears much larger than its true land area. What is the strongest conclusion?',choices:['Its mapped population value is relatively large','Its physical land area increased','It is geographically closer to neighboring countries','Its population is evenly distributed'],answer:0,why:'A cartogram deliberately resizes areas according to the mapped variable. The distortion represents magnitude, not actual land area, distance, or internal distribution.'},
    {kind:'reference',q:'A national map shows a broad pattern, but a county map reveals several local clusters. What geographic idea explains the difference?',choices:['Changing the scale of analysis can reveal patterns hidden by aggregation','Map projections always change population totals','Reference maps cannot show boundaries','Local data are always more accurate than national data'],answer:0,why:'Patterns can change or become visible when data are examined at different geographic levels. This is a scale-of-analysis issue.'}
  ];

  const scaleActivities=[
    {view:'global',q:'What is the scale of analysis in this actual political map?',choices:['Local','Regional','National','Global'],answer:3,why:'The map includes countries across the world, so the analysis is global.'},
    {view:'national',q:'What is the scale of analysis in this U.S. population map?',choices:['Regional','Local','National','Global'],answer:2,why:'The map examines population patterns across the entire United States, so the analysis is national.'},
    {view:'west',q:'What is the scale of analysis in the highlighted map?',choices:['National','Regional','Local','Global'],answer:1,why:'The highlighted states form the Census West region, so the evidence is grouped and examined regionally.'},
    {view:'washington',q:'Which conclusion is safest from this state-scale view?',choices:['It identifies Washington within the national pattern but cannot show county differences','It proves every part of Washington has the same population','It shows neighborhood-level variation','It compares every country in the world'],answer:0,why:'A state-level view can locate Washington and its statewide total, but it cannot reveal variation among counties or neighborhoods.'},
    {view:'national',q:'Why could a national map lead to a different conclusion than a county map?',choices:['Counties always have larger populations than states','Changing scale changes the Census totals','National maps cannot show political boundaries','National aggregation can hide local clusters and differences'],answer:3,why:'Changing the scale of analysis changes which variations are visible. Aggregated national or state data can conceal local patterns.'},
    {view:'west',q:'Which statement correctly distinguishes map scale from scale of analysis?',choices:['They are two names for the same idea','Map scale compares map distance with ground distance; scale of analysis is the geographic level being studied','Map scale means local, regional, national, or global','Scale of analysis only describes symbol size'],answer:1,why:'Map scale is a distance relationship. Scale of analysis describes whether evidence is examined locally, regionally, nationally, or globally.'},
    {view:'washington',q:'To investigate differences hidden inside Washington, what should a geographer do next?',choices:['Switch to a world map','Remove the legend','Use county- or neighborhood-level data','Replace population data with a political boundary only'],answer:2,why:'A finer local scale can reveal variation that a statewide total hides.'}
  ];

  function shuffledActivity(a){const correct=a.choices[a.answer],choices=window.APHGShuffleChoices(a.choices,a.q);return {...a,choices,answer:choices.indexOf(correct)};}
  mapActivities.splice(0,mapActivities.length,...window.APHGSessionShuffle(mapActivities.map(shuffledActivity)));
  scaleActivities.splice(0,scaleActivities.length,...window.APHGSessionShuffle(scaleActivities.map(shuffledActivity)));

  function mapCard(key){const m=mapInfo[key];return `<button type="button" class="visual-card visual-card-button" data-map-detail="${key}" aria-expanded="false"><span class="visual-card-title">${m.title}</span><span class="visual-card-sub">${m.notice}</span>${mapSvg(key)}<span class="visual-card-cta">Click to learn how to read it →</span></button>`;}
  function mapDetail(key){const m=mapInfo[key];return `<div class="map-detail-panel" data-map-panel="${key}"><div><span class="pill">Map skill</span><h4>${m.title}</h4></div><div class="map-detail-grid"><div><b>Best for</b><p>${m.use}</p></div><div><b>Limitation</b><p>${m.limit}</p></div><div><b>AP move</b><p>${m.ap}</p></div></div><button type="button" class="btn-secondary" data-close-map>Close</button></div>`;}

  function mapActivityHtml(){
    if(mapActivityIndex>=mapActivities.length)return `<section class="map-activity"><span class="pill">Map Detective complete</span><h4>${mapActivityScore} of ${mapActivities.length} correct</h4><p>${mapActivityScore>=4?'Strong map-reading start.':'Review the map cards above, then try once more.'}</p><button class="btn-primary" type="button" data-map-restart>Try again</button></section>`;
    const a=mapActivities[mapActivityIndex];
    const answered=mapActivityChoice!==null;
    return `<section class="map-activity"><div class="map-activity-head"><div><span class="pill">Mapping activity</span><h4>Map Detective · ${mapActivityIndex+1} of ${mapActivities.length}</h4></div><b>${mapActivityScore} correct</b></div>${mapSvg(a.kind)}<p><b>${a.q}</b></p><div class="quiz-options">${a.choices.map((c,i)=>`<button type="button" class="quiz-option ${answered&&i===a.answer?'correct':answered&&i===mapActivityChoice&&i!==a.answer?'wrong':''}" data-map-answer="${i}" ${answered?'disabled':''}>${String.fromCharCode(65+i)}. ${c}</button>`).join('')}</div>${answered?`<div class="${mapActivityChoice===a.answer?'box-good':'box-warn'}"><b>${mapActivityChoice===a.answer?'Correct':'Not yet.'}</b><p>${a.why}</p></div><button type="button" class="btn-primary" data-map-next>${mapActivityIndex===mapActivities.length-1?'See results':'Next challenge →'}</button>`:''}</section>`;
  }

  function scaleActivityHtml(){
    if(scaleActivityIndex>=scaleActivities.length)return `<section class="map-activity"><span class="pill">Scale challenge complete</span><h4>${scaleActivityScore} of ${scaleActivities.length} correct</h4><p>${scaleActivityScore>=5?'Strong scale-of-analysis thinking.':'Review how the geographic level changes what a map reveals, then try again.'}</p><button class="btn-primary" type="button" data-scale-restart>Try again</button></section>`;
    const a=scaleActivities[scaleActivityIndex],answered=scaleActivityChoice!==null;
    return `<section class="map-activity" id="scaleActivityHost"><div class="map-activity-head"><div><span class="pill">Scale of analysis</span><h4>Scale Challenge · ${scaleActivityIndex+1} of ${scaleActivities.length}</h4></div><b>${scaleActivityScore} correct</b></div>${scaleMapSvg(a.view)}<p><b>${a.q}</b></p><div class="quiz-options">${a.choices.map((c,i)=>`<button type="button" class="quiz-option ${answered&&i===a.answer?'correct':answered&&i===scaleActivityChoice&&i!==a.answer?'wrong':''}" data-scale-answer="${i}" ${answered?'disabled':''}>${String.fromCharCode(65+i)}. ${c}</button>`).join('')}</div>${answered?`<div class="${scaleActivityChoice===a.answer?'box-good':'box-warn'}"><b>${scaleActivityChoice===a.answer?'Correct':'Not yet.'}</b><p>${a.why}</p></div><button type="button" class="btn-primary" data-scale-next>${scaleActivityIndex===scaleActivities.length-1?'See results':'Next scale question →'}</button>`:''}</section>`;
  }

  function renderVisualPractice(){
    if(typeof active!=='undefined')active='visualLab';
    if(typeof renderNav==='function')renderNav();
    const sourceNote=authenticMapData?'<p class="map-data-note"><b>Real map data:</b> U.S. Census Bureau state boundaries and official 2020 resident population totals, plus Natural Earth country boundaries, bundled with Study Buddy. No live public API or AI-generated map is used.</p>':authenticMapUnavailable?'<p class="map-data-note"><b>Offline fallback:</b> The map lesson is using its built-in schematics because the local boundary file did not load.</p>':'<p class="map-data-note" aria-live="polite">Loading the bundled Census map…</p>';
    const maps=`<h3>Unit 1: Maps</h3><p class="muted">Click any map type to learn what to notice, when to use it, and the limitation AP questions often test.</p>${sourceNote}<div class="visual-grid map-learning-grid">${['reference','world','choropleth','symbol','dots','isoline','cartogram'].map(mapCard).join('')}</div><div id="mapDetailHost" aria-live="polite"></div><div id="mapActivityHost">${mapActivityHtml()}</div>`;
    const spatial=`<h3>Unit 1: Spatial Concepts</h3><div class="visual-grid"><figure class="visual-card"><figcaption><b>Clustered, dispersed, and linear patterns</b></figcaption>${patternSvg()}</figure><div class="visual-card"><b>Scale of analysis</b><p>A national pattern can hide regional or local variation.</p></div><div class="visual-card"><b>GIS layers</b><p>Geographers combine location-based layers to investigate relationships.</p></div><div class="visual-card"><b>Distance decay</b><p>Interaction often decreases as distance increases.</p></div></div>`;
    const scale=`<h3>Unit 1: Scale of Analysis</h3><p class="muted">Compare the same verified Census state boundaries at different geographic levels. Ask what each view reveals—and what it hides.</p>${sourceNote}<div class="visual-grid map-learning-grid"><figure class="visual-card"><figcaption><b>Global analysis</b><br>Countries are compared across the world.</figcaption>${scaleMapSvg('global')}</figure><figure class="visual-card"><figcaption><b>National analysis</b><br>All 50 states and Washington, D.C. are compared.</figcaption>${scaleMapSvg('national')}</figure><figure class="visual-card"><figcaption><b>Regional analysis</b><br>The Census West region is highlighted within the country.</figcaption>${scaleMapSvg('west')}</figure><figure class="visual-card"><figcaption><b>State analysis</b><br>Washington is isolated, but county and neighborhood variation remains hidden.</figcaption>${scaleMapSvg('washington')}</figure></div><div class="box-info"><b>Do not mix these up</b><p><b>Map scale</b> compares distance on a map with distance on Earth. <b>Scale of analysis</b> is the geographic level being studied: local, regional, national, or global.</p></div>${scaleActivityHtml()}`;
    const population=`<h3>Unit 2: Population & Migration</h3><div class="visual-grid"><figure class="visual-card"><figcaption><b>Population pyramids</b><br>Read age structure before explaining consequences.</figcaption>${pyramidSvg()}</figure><figure class="visual-card"><figcaption><b>Demographic Transition Model</b><br>Compare changes in birth and death rates.</figcaption>${dtmSvg()}</figure><div class="visual-card"><b>Migration flows</b><p>Identify origin, destination, push/pull factors, and consequences.</p></div></div>`;
    const sectionContent=visualSectionName==='maps'?maps:visualSectionName==='scale'?scale:visualSectionName==='spatial'?spatial:population;
    app.innerHTML=`<main class="wrap"><section class="card"><h2>🗺️ Maps & Visuals</h2><p>Learn the visual first, then practice interpreting it the way AP Human Geography expects.</p><div class="box-info"><b>Learn → Try → Practice</b><p>Open a map card, complete the Map Detective activity, then move into AP-style visual questions when you're ready.</p><div class="button-row"><button class="btn-primary" data-open-visual="12">More Units 1–2 visual practice</button><button class="btn-secondary" data-open-visual="37">Units 3–7 visual practice</button></div></div><div class="button-row"><button class="${visualSectionName==='maps'?'btn-primary':'btn-secondary'}" data-visual="maps">Map Types</button><button class="${visualSectionName==='scale'?'btn-primary':'btn-secondary'}" data-visual="scale">Scale of Analysis</button><button class="${visualSectionName==='spatial'?'btn-primary':'btn-secondary'}" data-visual="spatial">Spatial Concepts</button><button class="${visualSectionName==='population'?'btn-primary':'btn-secondary'}" data-visual="population">Unit 2 Population</button></div></section><section class="card">${sectionContent}</section></main>`;

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
    app.querySelectorAll('[data-scale-answer]').forEach(b=>b.addEventListener('click',()=>{
      if(scaleActivityChoice!==null)return;
      scaleActivityChoice=Number(b.dataset.scaleAnswer);
      if(scaleActivityChoice===scaleActivities[scaleActivityIndex].answer)scaleActivityScore++;
      renderVisualPractice();
      document.getElementById('scaleActivityHost')?.scrollIntoView({behavior:'smooth',block:'center'});
    }));
    app.querySelector('[data-scale-next]')?.addEventListener('click',()=>{scaleActivityIndex++;scaleActivityChoice=null;renderVisualPractice();document.getElementById('scaleActivityHost')?.scrollIntoView({behavior:'smooth',block:'center'});});
    app.querySelector('[data-scale-restart]')?.addEventListener('click',()=>{scaleActivityIndex=0;scaleActivityChoice=null;scaleActivityScore=0;renderVisualPractice();});
    if(['maps','scale'].includes(visualSectionName)&&!authenticMapData&&!authenticMapUnavailable){
      loadAuthenticMaps()?.then(data=>{if(data&&typeof active!=='undefined'&&active==='visualLab'&&['maps','scale'].includes(visualSectionName))renderVisualPractice();});
    }
    if(['maps','scale'].includes(visualSectionName)&&!worldMapData&&!worldMapUnavailable){
      loadWorldMap()?.then(data=>{if(data&&typeof active!=='undefined'&&active==='visualLab'&&['maps','scale'].includes(visualSectionName))renderVisualPractice();});
    }
  }

  // One public entry point keeps home cards and navigation on the same maps UI.
  window.openMapsVisuals=renderVisualPractice;

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

  // Rendering the navigation from this observer creates another child-list
  // mutation and can lock Safari in a self-triggering render loop. The app's
  // normal render path already rebuilds the navigation; observers only polish
  // the DOM that is present.
  const observer=new MutationObserver(()=>{polishNav(false);addPayoff();syncExamBadge();});
  observer.observe(document.body,{childList:true,subtree:true});
  polishNav();syncExamBadge();setInterval(syncExamBadge,30000);setTimeout(addPayoff,250);
})();
