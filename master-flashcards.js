// PR #5: Expand adaptive flashcards from the same Master Vocabulary used by Unit Mastery.
(function(){
  if(window.__masterFlashcardsInstalled || typeof flashcards==='undefined') return;
  window.__masterFlashcardsInstalled=true;
  const add=(unit,topic,term,def,ex)=>{
    const norm=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
    if(!flashcards.some(c=>c.unit===unit&&norm(c.term)===norm(term))) flashcards.push({unit,topic,term,def,ex});
    else {const c=flashcards.find(c=>c.unit===unit&&norm(c.term)===norm(term)); if(c&&!c.topic)c.topic=topic;}
  };
  const core12=[
    [1,'1.1','Graduated/Proportional Symbol Map','Uses different-sized symbols to represent quantities.','Larger circles can represent larger city populations.'],
    [1,'1.1','Elevation','Height above sea level.','Contour lines can show elevation.'],
    [1,'1.2','Geographic Data','Information connected to location.','Population by census tract is geographic data.'],
    [1,'1.2','Quantitative Data','Numerical information.','Population and income are quantitative data.'],
    [1,'1.2','Qualitative Data','Descriptive, non-numerical information.','Interview responses are qualitative data.'],
    [1,'1.2','Census','A systematic count of a population.','A national census records population characteristics.'],
    [1,'1.2','Survey','Data collected from a sample using questions.','A commuter survey asks how people travel.'],
    [1,'1.2','Field Observation','Data gathered by directly observing a place.','Counting pedestrians downtown.'],
    [1,'1.2','GPS/GNSS','Satellite systems used to determine location.','Researchers record field coordinates.'],
    [1,'1.3','Geospatial Technology','Technology used to collect, map, or analyze location-based data.','GIS, GPS, and remote sensing.'],
    [1,'1.3','Spatial Analysis','Examining location, pattern, and relationships across space.','Compare transit access with job locations.'],
    [1,'1.3','GIS Layer','A set of related geographic data in GIS.','Roads and flood zones can be separate layers.'],
    [1,'1.3','Satellite Imagery','Images of Earth collected from satellites.','Compare urban growth over time.'],
    [1,'1.4','Flow','Movement between places.','People, goods, money, and information move between places.'],
    [1,'1.4','Tobler’s First Law of Geography','Near things are generally more related than distant things.','Nearby neighborhoods often share characteristics.'],
    [1,'1.4','Gravity Model','Interaction increases with population size and decreases with distance.','Large nearby cities tend to have strong flows.'],
    [1,'1.5','Human-Environment Interaction','The reciprocal relationship between people and the environment.','Irrigation modifies a dry environment.'],
    [1,'1.5','Natural Resource','A useful material or feature from the environment.','Water, timber, and minerals.'],
    [1,'1.5','Renewable Resource','A resource replenished naturally on a human time scale.','Solar energy.'],
    [1,'1.5','Nonrenewable Resource','A resource formed much more slowly than it is used.','Petroleum.'],
    [1,'1.5','Sustainability','Meeting present needs without undermining future needs.','Water conservation.'],
    [1,'1.6','Map Scale','Relationship between map distance and Earth distance.','1:24,000.'],
    [1,'1.6','Large-Scale Map','Shows a smaller area with more detail.','Neighborhood map.'],
    [1,'1.6','Small-Scale Map','Shows a larger area with less detail.','World map.'],
    [1,'1.6','Aggregation','Combining data into larger geographic units.','Neighborhood data combined into a city average.'],
    [1,'1.7','Region','An area defined by shared traits or relationships.','Pacific Northwest.'],
    [1,'1.7','Node','A central point in a functional region.','A downtown or airport.'],
    [2,'2.1','Demography','The study of human populations.','Analyze age, fertility, and migration.'],
    [2,'2.1','Population Distribution','Where people are located across space.','Dense settlement in South Asia.'],
    [2,'2.1','Ecumene','The permanently inhabited portion of Earth.','Settled lowlands and coasts.'],
    [2,'2.1','Arable Land','Land suitable for growing crops.','Fertile river valleys.'],
    [2,'2.2','Overpopulation','Population exceeding available resources and technology at an acceptable living standard.','Severe pressure on water and food.'],
    [2,'2.2','Infrastructure','Systems and facilities that support society.','Roads, hospitals, water systems.'],
    [2,'2.2','Population Pressure','Demand placed on resources or services by population.','Rapid growth creates housing shortages.'],
    [2,'2.3','Population Composition','Demographic characteristics of a population.','Age and sex structure.'],
    [2,'2.3','Sex Ratio','Number of males relative to females.','Labor migration may change sex ratio.'],
    [2,'2.3','Age Cohort','People in the same age range.','Ages 15–24.'],
    [2,'2.3','Youth Bulge','A disproportionately large young population.','High demand for schools and jobs.'],
    [2,'2.4','Total Fertility Rate (TFR)','Average number of children a woman is expected to have.','A TFR near 2.1 is around replacement in many populations.'],
    [2,'2.4','Replacement-Level Fertility','Fertility needed to replace a population without migration.','About 2.1 in many populations.'],
    [2,'2.4','Population Momentum','Continued growth after fertility falls because many people are entering reproductive ages.','A youthful population keeps growing.'],
    [2,'2.5','Stage 1','High birth and death rates with little long-term growth.','Historical preindustrial pattern.'],
    [2,'2.5','Stage 2','High birth rates and falling death rates with rapid growth.','Sanitation lowers mortality.'],
    [2,'2.5','Stage 3','Falling birth rates and low death rates with slowing growth.','Urbanization and education lower fertility.'],
    [2,'2.5','Stage 4','Low birth and death rates with stable or slow growth.','Many high-income countries.'],
    [2,'2.5','Stage 5','Very low fertility with aging and possible natural decrease.','Some countries face population decline.'],
    [2,'2.6','Thomas Malthus','Scholar who argued population could outpace food supply.','Population grows faster than food in his model.'],
    [2,'2.6','Positive Check','Factor that raises death rates.','Famine or disease.'],
    [2,'2.6','Preventive Check','Factor that lowers birth rates.','Delayed marriage in Malthus’s framework.'],
    [2,'2.6','Boserup','Scholar who argued population pressure can stimulate innovation.','Agricultural intensification.'],
    [2,'2.7','Population Policy','Government action intended to influence population size or growth.','Tax incentives for families.'],
    [2,'2.8','Women’s Empowerment','Expansion of women’s social, economic, and political opportunities.','Education and paid work can lower fertility.'],
    [2,'2.8','Contraception','Methods used to prevent pregnancy.','Access can reduce unintended fertility.'],
    [2,'2.8','Female Labor-Force Participation','Women’s involvement in paid employment.','Often linked with later family formation.'],
    [2,'2.9','Population Aging','Increase in the share of older people.','Growing 65+ population.'],
    [2,'2.9','Elderly Dependency','Support burden associated with older dependent populations.','More retirees per worker.'],
    [2,'2.9','Pension','Income support during retirement.','Aging can pressure pension systems.'],
    [2,'2.10','Push Factor','Condition encouraging people to leave a place.','War or unemployment.'],
    [2,'2.10','Pull Factor','Condition attracting people to a place.','Jobs or safety.'],
    [2,'2.10','Intervening Opportunity','A closer opportunity that changes a migrant’s destination.','A migrant finds work before reaching the original destination.'],
    [2,'2.10','Ravenstein’s Laws of Migration','Generalizations describing migration patterns.','Most migrants move relatively short distances.'],
    [2,'2.11','Refugee','Person outside their country with a well-founded fear of persecution or danger.','A person fleeing war across an international border.'],
    [2,'2.11','Asylum Seeker','Person requesting international protection whose claim is pending.','Applies for asylum after crossing a border.'],
    [2,'2.11','Internally Displaced Person (IDP)','Person forced to move but remaining within their country.','Family displaced by conflict to another region.'],
    [2,'2.11','Transhumance','Seasonal movement of livestock between pastures.','Herders move animals between summer and winter grazing areas.'],
    [2,'2.12','Brain Drain','Loss of skilled workers through emigration.','Doctors leave a lower-income country.'],
    [2,'2.12','Brain Gain','Increase in skilled workers through immigration or return migration.','Engineers move into a growing economy.'],
    [2,'2.12','Remittance','Money migrants send to people in their home community.','Workers send earnings to family abroad.']
  ];
  core12.forEach(x=>add(...x));
  if(window.__upperMasteryData){
    Object.entries(window.__upperMasteryData).forEach(([u,obj])=>obj.topics.forEach(t=>t[3].forEach(v=>add(Number(u),t[0],v[0],v[1],v[2]))));
  }
  // Add topic filtering to the existing adaptive flashcard deck without replacing its progress system.
  window.masterFlashTopic='All';
  try{if(!Object.keys(flashProgress||{}).length){flashUnit='1';flashMode='new';}}catch(e){}
  const oldCurrent=currentFlashDeck;
  currentFlashDeck=function(){
    let cards=oldCurrent();
    if(masterFlashTopic!=='All' && flashUnit!=='All'){
      const scoped=cards.filter(c=>c.topic===masterFlashTopic);
      if(scoped.length) cards=scoped;
    }
    if(String(flashUnit)==='1'&&flashMode==='new'&&masterFlashTopic==='All') cards=cards.slice(0,10);
    return cards;
  };
  const oldAdaptive=adaptiveFlashcardsHtml;
  adaptiveFlashcardsHtml=function(){
    const base=oldAdaptive();
    if(flashUnit==='All'||!['1','2','3','4','5','6','7'].includes(String(flashUnit))) return base;
    const topics=[...new Set(flashcards.filter(c=>c.unit===Number(flashUnit)&&c.topic).map(c=>c.topic))].sort((a,b)=>Number(a.split('.')[1])-Number(b.split('.')[1]));
    if(!topics.length) return base;
    const controls=`<div class="box-info" style="margin-bottom:12px"><b>Study by CED topic:</b><div class="filter-row" style="margin-top:8px"><button class="filter-btn ${masterFlashTopic==='All'?'active':''}" onclick="masterFlashTopic='All';flashIndex=0;flashFlipped=false;render()">Whole Unit</button>${topics.map(t=>`<button class="filter-btn ${masterFlashTopic===t?'active':''}" onclick="masterFlashTopic='${t}';flashIndex=0;flashFlipped=false;render()">${t}</button>`).join('')}</div></div>`;
    const starter=String(flashUnit)==='1'&&flashMode==='new'&&masterFlashTopic==='All'?'<div class="box-good" style="margin-bottom:12px"><b>Start small:</b> This first set has 10 Unit 1 cards. Finish it, then choose another topic or mode.</div>':'';
    return starter+controls+base;
  };
})();
