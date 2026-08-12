// PR #5 visual-learning layer: authentic geography where practical; clearly labeled schematics for models.
(function(){
  if(window.__visualLearningInstalled || typeof tabs==='undefined' || typeof render==='undefined') return;
  window.__visualLearningInstalled=true;
  const foundationIndex=tabs.findIndex(t=>t[0]==='foundations');
  tabs.splice(foundationIndex>=0?foundationIndex+1:Math.max(1,tabs.length-1),0,['visualLab','🗺️ Visual Lab']);

  let section='maps', censusStatus='Loading real Census data…', stateData=null;
  const oldRender=render;
  render=function(){
    if(active==='visualLab'){
      renderNav();
      document.getElementById('app').innerHTML=visualPage();
      window.setTimeout(drawVisuals,0);
      return;
    }
    oldRender();
  };

  window.visualSection=v=>{section=v;render();};

  function visualPage(){
    return `<main class="wrap">
      <section class="card">
        <h2>🗺️ Visual Learning Lab</h2>
        <p>Learn to recognize the maps, graphs, models, and spatial patterns AP Human Geography expects you to interpret. Real geographic boundaries and public data are used where practical; model diagrams are labeled as instructional schematics.</p>
        <div class="button-row">
          <button class="${section==='maps'?'btn-primary':'btn-secondary'}" onclick="visualSection('maps')">Unit 1 Maps</button>
          <button class="${section==='spatial'?'btn-primary':'btn-secondary'}" onclick="visualSection('spatial')">Spatial Concepts</button>
          <button class="${section==='population'?'btn-primary':'btn-secondary'}" onclick="visualSection('population')">Unit 2 Population</button>
        </div>
      </section>
      ${section==='maps'?mapsPage():section==='spatial'?spatialPage():populationPage()}
    </main>`;
  }

  function mapsPage(){
    return `<section class="card">
      <h3>Unit 1: Recognize the map type</h3>
      <p class="muted">The first three maps use actual U.S. state boundaries. The thematic maps use 2020 U.S. Census state population data when the public API loads.</p>
      <div class="visual-grid">
        <figure class="visual-card"><figcaption><b>Reference map</b><br><span>Use it to locate places and boundaries.</span></figcaption><svg id="referenceMap" viewBox="0 0 975 610" role="img" aria-label="Reference map of U.S. states"></svg></figure>
        <figure class="visual-card"><figcaption><b>Choropleth map</b><br><span>Areas are shaded by a value.</span></figcaption><svg id="choroplethMap" viewBox="0 0 975 610" role="img" aria-label="Choropleth map of 2020 U.S. state population"></svg><small id="censusNote">${censusStatus}</small></figure>
        <figure class="visual-card"><figcaption><b>Proportional-symbol map</b><br><span>Larger symbols represent larger values.</span></figcaption><svg id="symbolMap" viewBox="0 0 975 610" role="img" aria-label="Proportional symbol map of 2020 U.S. state population"></svg></figure>
        <figure class="visual-card"><figcaption><b>Dot-density map — instructional schematic</b><br><span>Each dot represents a fixed amount or count.</span></figcaption>${dotDensitySvg()}</figure>
        <figure class="visual-card"><figcaption><b>Isoline map — instructional schematic</b><br><span>Lines connect places with equal values.</span></figcaption>${isolineSvg()}</figure>
        <figure class="visual-card"><figcaption><b>Cartogram — instructional schematic</b><br><span>Areas are resized to represent a variable.</span></figcaption>${cartogramSvg()}</figure>
      </div>
      <div class="box-info"><b>Student check:</b> For each map, say (1) what visual variable is changing, (2) what kind of question the map is good for, and (3) one limitation.</div>
    </section>`;
  }

  function spatialPage(){
    return `<section class="card">
      <h3>Unit 1: Spatial patterns, scale, and GIS</h3>
      <div class="visual-grid">
        <figure class="visual-card"><figcaption><b>Clustered vs. dispersed vs. linear</b></figcaption>${patternSvg()}</figure>
        <figure class="visual-card"><figcaption><b>GIS layers — instructional schematic</b></figcaption>${gisSvg()}</figure>
        <figure class="visual-card"><figcaption><b>Scale of analysis</b></figcaption>${scaleSvg()}</figure>
        <figure class="visual-card"><figcaption><b>Distance decay</b></figcaption>${distanceDecaySvg()}</figure>
      </div>
      <div class="box-yellow"><b>AP habit:</b> Do not just name the pattern. Describe the evidence first, then explain why the pattern might exist.</div>
    </section>`;
  }

  function populationPage(){
    return `<section class="card">
      <h3>Unit 2: Population and migration visuals</h3>
      <div class="visual-grid">
        <figure class="visual-card"><figcaption><b>Population pyramid — rapid-growth shape</b></figcaption>${pyramidSvg('rapid')}</figure>
        <figure class="visual-card"><figcaption><b>Population pyramid — aging shape</b></figcaption>${pyramidSvg('aging')}</figure>
        <figure class="visual-card"><figcaption><b>Demographic Transition Model — instructional schematic</b></figcaption>${dtmSvg()}</figure>
        <figure class="visual-card"><figcaption><b>Migration flow — instructional schematic</b></figcaption>${migrationSvg()}</figure>
      </div>
      <div class="box-info"><b>Student check:</b> For a population pyramid, identify the age structure first, then explain one likely consequence for schools, jobs, health care, pensions, or migration policy.</div>
    </section>`;
  }

  function svgWrap(inner,label){return `<svg viewBox="0 0 520 300" role="img" aria-label="${label}" class="lesson-svg">${inner}</svg>`;}
  function dotDensitySvg(){
    const dots=[]; for(let i=0;i<75;i++){const x=55+(i*47)%390,y=55+((i*83)%175); if((x<250&&i%3!==0)||(x>=250&&i%4===0)) dots.push(`<circle cx="${x}" cy="${y}" r="3"/>`);}
    return svgWrap(`<rect x="35" y="35" width="450" height="215" rx="18" class="map-land"/><path d="M255 35v215" class="map-line"/>${dots.join('')}<text x="70" y="275">More dots = more of the mapped phenomenon</text>`,'Instructional dot-density map');
  }
  function isolineSvg(){return svgWrap(`<rect x="35" y="35" width="450" height="215" rx="18" class="map-land"/><path d="M70 190 C130 80 210 80 265 165 S390 250 455 105" class="iso-line"/><path d="M65 220 C135 115 220 110 280 185 S395 260 465 145" class="iso-line"/><path d="M80 150 C145 55 215 60 250 135 S370 215 440 75" class="iso-line"/><text x="130" y="80">30</text><text x="200" y="125">20</text><text x="310" y="205">10</text>`,'Instructional isoline map');}
  function cartogramSvg(){return svgWrap(`<rect x="70" y="90" width="80" height="80" class="map-area"/><rect x="165" y="65" width="145" height="145" class="map-area"/><rect x="325" y="105" width="65" height="65" class="map-area"/><rect x="405" y="125" width="45" height="45" class="map-area"/><text x="110" y="135" text-anchor="middle">A</text><text x="237" y="145" text-anchor="middle">B</text><text x="357" y="142" text-anchor="middle">C</text><text x="427" y="152" text-anchor="middle">D</text><text x="80" y="260">Geographic size is intentionally distorted by the data.</text>`,'Instructional cartogram');}
  function patternSvg(){return svgWrap(`<text x="80" y="38">Clustered</text><text x="220" y="38">Dispersed</text><text x="385" y="38">Linear</text>${[[75,85],[95,95],[80,112],[108,120],[65,125],[115,80]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="6"/>`).join('')}${[[210,80],[275,75],[230,145],[290,160],[215,210],[300,225]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="6"/>`).join('')}${[[365,65],[380,95],[395,125],[410,155],[425,185],[440,215]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="6"/>`).join('')}<path d="M350 55 L455 230" class="map-line"/>`,'Clustered dispersed and linear spatial patterns');}
  function gisSvg(){return svgWrap(`<g transform="translate(60,35)"><rect x="70" y="20" width="300" height="55" class="gis-layer"/><text x="90" y="53">Flood-risk layer</text><rect x="50" y="85" width="300" height="55" class="gis-layer"/><text x="70" y="118">Road layer</text><rect x="30" y="150" width="300" height="55" class="gis-layer"/><text x="50" y="183">Population layer</text><path d="M400 48l45 65-45 65" class="arrow-line"/><text x="370" y="220">Combine layers → spatial analysis</text></g>`,'GIS data layers diagram');}
  function scaleSvg(){return svgWrap(`<rect x="35" y="55" width="125" height="125" class="scale-box"/><g transform="translate(195,55)">${Array.from({length:4},(_,r)=>Array.from({length:4},(_,c)=>`<rect x="${c*32}" y="${r*32}" width="28" height="28" class="scale-cell ${r===1&&c===2?'hot':''}"/>`).join('')).join('')}</g><g transform="translate(365,55)">${Array.from({length:8},(_,r)=>Array.from({length:8},(_,c)=>`<rect x="${c*14}" y="${r*14}" width="11" height="11" class="scale-cell ${r>=2&&r<=4&&c>=4&&c<=6?'hot':''}"/>`).join('')).join('')}</g><text x="55" y="215">National</text><text x="215" y="215">Regional</text><text x="385" y="215">Local</text><text x="55" y="250">Averages can hide local variation.</text>`,'Scale of analysis diagram');}
  function distanceDecaySvg(){return svgWrap(`<line x1="70" y1="240" x2="470" y2="240" class="axis"/><line x1="70" y1="240" x2="70" y2="40" class="axis"/><path d="M80 65 C160 95 220 145 300 185 S410 225 455 230" class="decay-line"/><text x="170" y="280">Distance increases →</text><text transform="translate(25 190) rotate(-90)">Interaction</text>`,'Distance decay curve');}
  function pyramidSvg(kind){
    const rapid=[95,85,72,60,45,30,18], aging=[38,46,58,72,82,78,65], arr=kind==='rapid'?rapid:aging;
    return svgWrap(`<line x1="260" y1="35" x2="260" y2="255" class="axis"/>${arr.map((w,i)=>{const y=225-i*28;return `<rect x="${260-w}" y="${y}" width="${w-4}" height="20" class="pyr-left"/><rect x="264" y="${y}" width="${w-4}" height="20" class="pyr-right"/>`;}).join('')}<text x="95" y="280">Male</text><text x="390" y="280">Female</text><text x="205" y="25">Older</text><text x="202" y="255">Younger</text>`,'Instructional population pyramid');}
  function dtmSvg(){return svgWrap(`<line x1="55" y1="245" x2="480" y2="245" class="axis"/><line x1="55" y1="245" x2="55" y2="40" class="axis"/><path d="M70 70 L150 75 L225 95 L310 165 L390 205 L465 210" class="birth-line"/><path d="M70 80 L145 155 L225 205 L310 215 L390 215 L465 220" class="death-line"/>${[110,190,270,350,430].map((x,i)=>`<text x="${x}" y="270">${i+1}</text>`).join('')}<text x="340" y="90">Birth rate</text><text x="340" y="205">Death rate</text>`,'Demographic Transition Model diagram');}
  function migrationSvg(){return svgWrap(`<circle cx="100" cy="150" r="55" class="origin-node"/><circle cx="410" cy="150" r="70" class="dest-node"/><path d="M165 135 C245 85 315 85 340 125" class="flow-arrow"/><path d="M340 175 C270 225 210 225 165 175" class="return-arrow"/><text x="100" y="155" text-anchor="middle">Origin</text><text x="410" y="155" text-anchor="middle">Destination</text><text x="215" y="75">Migration</text><text x="225" y="245">Remittances / return flows</text>`,'Migration flow diagram');}

  async function drawVisuals(){
    if(section!=='maps') return;
    const refs=['referenceMap','choroplethMap','symbolMap'];
    if(!refs.every(id=>document.getElementById(id))) return;
    try{
      await loadScript('https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js','d3');
      await loadScript('https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js','topojson');
      const [us,pop]=await Promise.all([
        fetch('https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/states-albers-10m.json').then(r=>r.json()),
        fetch('https://api.census.gov/data/2020/dec/pl?get=NAME,P1_001N&for=state:*').then(r=>r.json())
      ]);
      const states=topojson.feature(us,us.objects.states);
      const popMap=new Map(pop.slice(1).map(r=>[String(Number(r[2])),{name:r[0],pop:Number(r[1])}]));
      stateData={states,popMap}; censusStatus='Source: U.S. Census Bureau, 2020 Decennial Census PL 94-171 state population.';
      document.getElementById('censusNote').textContent=censusStatus;
      drawReference(states); drawChoropleth(states,popMap); drawSymbols(states,popMap);
    }catch(e){
      censusStatus='Live public-data map could not load on this connection. The other instructional visuals still work.';
      const note=document.getElementById('censusNote'); if(note) note.textContent=censusStatus;
      refs.forEach(id=>{const el=document.getElementById(id);if(el)el.innerHTML='<text x="40" y="80">Public-data map unavailable on this connection.</text>';});
    }
  }
  const loaded={};
  function loadScript(src,key){return new Promise((resolve,reject)=>{if(window[key])return resolve();if(loaded[src]){loaded[src].then(resolve,reject);return;}loaded[src]=new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s);});loaded[src].then(resolve,reject);});}
  function baseMap(svg,states){const path=d3.geoPath();d3.select(svg).selectAll('path').data(states.features).join('path').attr('d',path).attr('class','real-state');return path;}
  function drawReference(states){const svg=document.getElementById('referenceMap');baseMap(svg,states);}
  function drawChoropleth(states,popMap){const svg=document.getElementById('choroplethMap'),path=d3.geoPath();const vals=[...popMap.values()].map(d=>d.pop);const color=d3.scaleSequentialLog(d3.interpolateBlues).domain([Math.max(1,d3.min(vals)),d3.max(vals)]);d3.select(svg).selectAll('path').data(states.features).join('path').attr('d',path).attr('fill',d=>{const x=popMap.get(String(Number(d.id)));return x?color(x.pop):'#e5e7eb';}).attr('stroke','#fff').append('title').text(d=>{const x=popMap.get(String(Number(d.id)));return x?`${x.name}: ${x.pop.toLocaleString()}`:'No data';});}
  function drawSymbols(states,popMap){const svg=document.getElementById('symbolMap'),path=baseMap(svg,states);const vals=[...popMap.values()].map(d=>d.pop);const radius=d3.scaleSqrt().domain([0,d3.max(vals)]).range([0,38]);d3.select(svg).selectAll('circle').data(states.features.filter(d=>popMap.has(String(Number(d.id))))).join('circle').attr('cx',d=>path.centroid(d)[0]).attr('cy',d=>path.centroid(d)[1]).attr('r',d=>radius(popMap.get(String(Number(d.id))).pop)).attr('class','pop-symbol').append('title').text(d=>{const x=popMap.get(String(Number(d.id)));return `${x.name}: ${x.pop.toLocaleString()}`;});}

  const style=document.createElement('style');style.textContent=`
    .visual-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;margin-top:14px}.visual-card{border:1px solid #dde3ed;border-radius:16px;padding:12px;background:#fff}.visual-card figcaption{margin-bottom:8px}.visual-card figcaption span,.visual-card small{font-size:13px;color:#64748b}.visual-card svg,.lesson-svg{width:100%;height:auto;display:block;background:#f8fafc;border-radius:12px}.real-state{fill:#eef2ff;stroke:#64748b;stroke-width:.8}.pop-symbol{fill:rgba(37,99,235,.28);stroke:#1d4ed8;stroke-width:1}.map-land{fill:#eef2ff;stroke:#64748b}.map-line,.axis{fill:none;stroke:#475569;stroke-width:2}.map-area{fill:#c7d2fe;stroke:#4338ca;stroke-width:2}.iso-line{fill:none;stroke:#2563eb;stroke-width:3}.lesson-svg circle{fill:#2563eb}.gis-layer{fill:#dbeafe;stroke:#1d4ed8;stroke-width:2}.arrow-line,.flow-arrow{fill:none;stroke:#1d4ed8;stroke-width:4}.return-arrow{fill:none;stroke:#64748b;stroke-width:3;stroke-dasharray:8 5}.scale-box,.scale-cell{fill:#e2e8f0;stroke:#94a3b8}.scale-cell.hot{fill:#93c5fd}.decay-line{fill:none;stroke:#7c3aed;stroke-width:5}.pyr-left{fill:#bfdbfe}.pyr-right{fill:#ddd6fe}.birth-line{fill:none;stroke:#2563eb;stroke-width:4}.death-line{fill:none;stroke:#9333ea;stroke-width:4}.origin-node{fill:#dbeafe;stroke:#2563eb}.dest-node{fill:#dcfce7;stroke:#16a34a}.button-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
  `;document.head.appendChild(style);
})();
