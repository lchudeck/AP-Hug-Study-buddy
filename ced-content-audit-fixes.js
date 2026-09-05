// Full CED content audit corrections.
// Loaded last so it can repair legacy wording/tags without changing the original question-bank APIs.
(function(){
  if(window.__cedContentAuditFixesInstalled)return;
  window.__cedContentAuditFixesInstalled=true;

  // ---- Unit 7 terminology: world-systems theory and outsourcing/offshoring ----
  try{
    if(Array.isArray(units)&&units[6]){
      units[6].save='Rostow = stage-based development. World-systems theory = unequal core–periphery relationships in a global economy.';
    }
    if(unitReviews&&unitReviews[7]){
      unitReviews[7].know=(unitReviews[7].know||[]).map(x=>{
        if(/Wallerstein: core countries keep periphery poor/i.test(x))return 'World-systems theory: unequal core–periphery relationships can reproduce dependency and uneven development';
        if(/Outsourcing shifts jobs to lower-wage countries/i.test(x))return 'Outsourcing = contracting work to another company; offshoring = moving business activity to another country';
        return x;
      });
      unitReviews[7].mistakes=(unitReviews[7].mistakes||[]).map(x=>/Rostow.*Wallerstein/i.test(x)?'Mixing up Rostow (stage-based development) and world-systems theory (structural core–periphery relationships)':x);
    }
  }catch(e){}

  // ---- Make the seven main FRQs use official APHG task verbs only ----
  // Public APHG CED task verbs: Compare, Define, Describe, Explain, Identify.
  try{
    const rewrites={
      1:{F:['Explain','Explain how a geographer could use one GIS layer to study inequality in this city.'],G:['Explain','Explain one planning decision that could improve access for residents in underserved neighborhoods.']},
      2:{F:['Identify','Identify the Demographic Transition Model stage most likely associated with low birth rates and low death rates.'],G:['Explain','Explain one policy a government could use to respond to an aging population.']},
      3:{F:['Explain','Explain how a lingua franca can support global cultural interaction.'],G:['Explain','Explain one effect of cultural diffusion on local cultures.']},
      4:{F:['Explain','Explain how a centrifugal force is shown in this scenario.'],G:['Explain','Explain one policy a central government could use to help keep the state unified.']},
      5:{F:['Explain','Explain one change in agricultural production associated with the Green Revolution.'],G:['Explain','Explain one negative consequence of modern commercial agriculture.']},
      6:{F:['Explain','Explain how changing the scale of analysis could change the interpretation of this urban issue.'],G:['Explain','Explain one policy that could reduce displacement from gentrification.']},
      7:{F:['Explain','Explain how Rostow’s model could interpret industrialization in a lower-income country.'],G:['Explain','Explain one strategy a lower-income country could use to increase development.']}
    };
    (prompts||[]).forEach(p=>{
      const r=rewrites[p.unit]; if(!r)return;
      (p.parts||[]).forEach(part=>{if(r[part[0]]){part[1]=r[part[0]][0];part[2]=r[part[0]][1];}});
    });

    const u7=(prompts||[]).find(p=>p.unit===7);
    if(u7){
      const A=u7.parts.find(p=>p[0]==='A'),C=u7.parts.find(p=>p[0]==='C'),D=u7.parts.find(p=>p[0]==='D');
      if(A){A[2]='Identify the economic process in which the company moves manufacturing operations to another country.';A[3]='Offshoring.';}
      if(C){C[2]='Describe one benefit of the offshored manufacturing for the lower-income country.';C[3]='Offshored manufacturing can bring jobs, foreign investment, industrial growth, or export income.';}
      if(D){D[2]='Explain one negative effect of offshoring on manufacturing workers in the high-income country.';D[3]='Offshoring can reduce manufacturing employment in the high-income country when production is relocated abroad, contributing to job loss or deindustrialization.';}
    }
  }catch(e){}

  // ---- Correct the core flashcard distinction between outsourcing and offshoring ----
  try{
    if(Array.isArray(flashcards)){
      const outsourcing=flashcards.find(c=>String(c.term).toLowerCase()==='outsourcing');
      if(outsourcing){
        outsourcing.def='Contracting work or a business function to an outside company; the outside company may be domestic or foreign.';
        outsourcing.ex='A company hires an outside firm to run customer support. If the work is also moved to another country, it is both outsourced and offshored.';
      }
      if(!flashcards.some(c=>String(c.term).toLowerCase()==='offshoring'))flashcards.push({unit:7,term:'Offshoring',def:'Moving a business activity or production process to another country; the work may stay within the same company or be outsourced.',ex:'A company moves assembly from the United States to a factory it owns in another country.'});
    }
  }catch(e){}

  // ---- Exact CED tagging for older/untagged question inventory ----
  // This is deliberately conservative: explicit modern tags are preserved unless a known legacy mapping is identified.
  const byAnswer={
    'Choropleth map':'1.1','Dot-density map':'1.1','Cartogram':'1.1','Reference map':'1.1','Isoline':'1.1',
    'Remote sensing':'1.2','GIS':'1.3','Time-space compression':'1.4','Possibilism':'1.5','Functional region':'1.7','Formal region':'1.7','Perceptual region':'1.7','Distance decay':'1.4','Scale of analysis':'1.6',
    'Physiological density':'2.1','Population aging and possible decline':'2.9','Paid parental leave and child allowances':'2.7','Greater access to education and employment for women':'2.8','An intervening opportunity':'2.10','More household money for education or housing':'2.12','Population grows faster than food supply':'2.6',
    'Sequent occupance':'3.2','Colonialism and historical diffusion':'3.5','Hierarchical diffusion':'3.4','Syncretism':'3.8','Stimulus diffusion':'3.4','Create a shared national identity':'3.3',
    'Exclusive Economic Zone':'4.3','Superimposed':'4.4','Reapportionment':'4.6','Devolutionary pressure':'4.8','Gerrymandering':'4.6','A widely trusted national institution shared across regions':'4.10','Member states may accept limits on some independent actions':'4.9',
    'Long-lot':'5.2','Commercial cattle ranching':'5.6','Faster refrigerated transportation':'5.8','Agribusiness and vertical integration':'5.9','Agricultural runoff':'5.10','Increase productivity and household food security':'5.12',
    'World city':'6.3','A primate-city system':'6.4','Harris-Ullman multiple-nuclei model':'6.5','Infilling':'6.6','Infrastructure shapes spatial inequality':'6.7','They combine quantitative change with qualitative experience':'6.9','Urban growth boundary':'6.11',
    'Quaternary':'7.2','Human Development Index':'7.3','HDI':'7.3','Greater female education, health access, and political representation':'7.4','The new international division of labor':'7.6','New international division of labor':'7.6','Deindustrialization and economic restructuring':'7.7','Expand renewable energy while investing in education and public health':'7.8','World-systems theory':'7.5','Commodity chain':'7.6','Offshoring':'7.6','GII':'7.4'
  };

  function infer(q){
    const prompt=String(q.prompt||q.q||q[1]||''),answer=String(q.answer||q[3]||''),unit=Number(q.unit||String(q[0]||'').match(/\d+/)?.[0]||0);
    if(byAnswer[answer])return byAnswer[answer];
    const t=(prompt+' '+answer).toLowerCase();
    if(unit===1){if(/choropleth|dot-density|cartogram|projection|map type/.test(t))return'1.1';if(/survey|interview|remote sensing|census|qualitative|quantitative/.test(t))return'1.2';if(/gis|geospatial|privacy|spatial data/.test(t))return'1.3';if(/site|situation|distance decay|gravity model|time-space|tobler|spatial pattern/.test(t))return'1.4';if(/possibil|determin|sustainab|environment/.test(t))return'1.5';if(/scale of analysis|aggregation|national average|local scale|small scale|large scale/.test(t))return'1.6';if(/formal region|functional region|perceptual|vernacular|regional/.test(t))return'1.7';}
    if(unit===2){if(/density|distribution|arable/.test(t))return'2.1';if(/carrying capacity|resource pressure/.test(t))return'2.2';if(/pyramid|dependency|age structure|sex ratio|youth/.test(t))return'2.3';if(/tfr|cbr|cdr|natural increase|doubling|momentum/.test(t))return'2.4';if(/dtm|stage [1-5]|demographic transition/.test(t))return'2.5';if(/malthus|boserup/.test(t))return'2.6';if(/pronatalist|antinatalist|population policy/.test(t))return'2.7';if(/female education|women|fertility/.test(t))return'2.8';if(/aging|elderly|pension/.test(t))return'2.9';if(/push factor|pull factor|intervening|migration destination/.test(t))return'2.10';if(/refugee|internally displaced|forced migration|voluntary migration/.test(t))return'2.11';if(/remittance|brain drain|migration effect/.test(t))return'2.12';}
    if(unit===3){if(/sequent occupance|cultural landscape|toponym/.test(t))return'3.2';if(/language family|dialect|religion pattern|official language/.test(t))return'3.3';if(/diffusion|relocation|contagious|hierarchical|stimulus/.test(t))return'3.4';if(/colonial|imperial|historical/.test(t))return'3.5';if(/globalization|social media|contemporary/.test(t))return'3.6';if(/lingua franca|language|religion/.test(t))return'3.7';if(/syncret|assimilat|accultur|placeless|convergence|divergence/.test(t))return'3.8';return'3.1';}
    if(unit===4){if(/state|nation|sovereignty/.test(t))return'4.1';if(/nationalism|self-determination|colonial|decolon/.test(t))return'4.2';if(/territorial|eez|exclusive economic|choke point|maritime/.test(t))return'4.3';if(/antecedent|subsequent|consequent|superimposed|relic|geometric|physical boundary/.test(t))return'4.4';if(/boundary dispute|border function|movement across|trade across/.test(t))return'4.5';if(/gerrymander|packing|cracking|reapportion|redistrict/.test(t))return'4.6';if(/federal|unitary|governance/.test(t))return'4.7';if(/devolution|separat|regional autonomy/.test(t))return'4.8';if(/supranational|challenge.*sovereignty/.test(t))return'4.9';if(/centripetal|centrifugal|balkan/.test(t))return'4.10';}
    if(unit===5){if(/long-lot|township|metes|survey/.test(t))return'5.2';if(/first agricultural|domesticat|hearth|columbian/.test(t))return'5.3';if(/second agricultural|crop rotation|mechanization.*industrial/.test(t))return'5.4';if(/green revolution|high-yield/.test(t))return'5.5';if(/intensive|extensive|ranching|subsistence|commercial agriculture/.test(t))return'5.6';if(/commodity chain|spatial organization/.test(t))return'5.7';if(/von th|perishable|refrigerat/.test(t))return'5.8';if(/agribusiness|global.*agri|vertical integration/.test(t))return'5.9';if(/runoff|eutroph|saliniz|desertif|erosion/.test(t))return'5.10';if(/food desert|food insecurity|sustainable agriculture/.test(t))return'5.11';if(/women farmers|gender.*agri|land titles.*credit/.test(t))return'5.12';return'5.1';}
    if(unit===6){if(/world city|global city/.test(t))return'6.3';if(/rank-size|primate city|central place|threshold|range/.test(t))return'6.4';if(/multiple nuclei|sector model|concentric|cbd|urban model/.test(t))return'6.5';if(/infilling|density|land use/.test(t))return'6.6';if(/infrastructure|transit|water|broadband/.test(t))return'6.7';if(/smart growth|mixed-use|transit-oriented/.test(t))return'6.8';if(/census|interviews|urban data/.test(t))return'6.9';if(/gentrif|redlining|blockbust|displacement|affordab/.test(t))return'6.10';if(/sprawl|growth boundary|brownfield|sustainab/.test(t))return'6.11';if(/megacity|urbanization rate|cities across/.test(t))return'6.2';return'6.1';}
    if(unit===7){if(/industrial revolution|coal|iron/.test(t))return'7.1';if(/quaternary|primary sector|secondary sector|tertiary sector|economic sector|agglomeration|industrial location/.test(t))return'7.2';if(/hdi|gdp|gni|development measure|life expectancy/.test(t))return'7.3';if(/gender|women/.test(t))return'7.4';if(/rostow|world-systems|wallerstein|core-periphery/.test(t))return'7.5';if(/offshor|outsourc|international division|commodity chain|trade|multinational|fdi/.test(t))return'7.6';if(/deindustr|postindustrial|special economic|maquiladora|world economy/.test(t))return'7.7';if(/sustainable|renewable|microfinance|fair trade|human capital/.test(t))return'7.8';}
    return q.topic||null;
  }

  try{
    // Untagged legacy questions get exact topic metadata. Explicit modern tags remain unless corrected below.
    (quiz||[]).forEach(q=>{if(!q.topic){const t=infer(q);if(t)q.topic=t;}});

    const knownBanks=['APHG_IMAGE_MCQ_BANK','APHG_STIMULUS_SET_QUESTIONS','APHG_STIMULUS_SET_QUESTIONS_EXTRA','APHG_REAL_DATA_QUESTIONS','APHG_AUTHENTIC_STIMULUS_QUESTIONS','APHG_AUTHENTIC_CLUSTER_QUESTIONS','APHG_ADAPTIVE_V2_QUESTIONS'];
    knownBanks.forEach(name=>(window[name]||[]).forEach(q=>{
      const next=infer(q);
      // Correct known legacy topic numbering where the current public CED moved the concept.
      if(next && (!q.topic || (q.unit===7&&['7.2','7.3','7.4'].includes(String(q.topic))) || (q.unit===6&&String(q.topic)==='6.11'&&/gentrif|displacement/i.test(q.prompt||'')) || (q.unit===5&&String(q.topic)==='5.4'&&/intensive|extensive/i.test(q.prompt||'')) || (q.unit===3&&String(q.topic)==='3.2'&&/diffusion/i.test(q.prompt||'')))) q.topic=next;
    }));
  }catch(e){}

  // ---- Correct the forced-displacement stimulus classification ----
  try{
    const set=(window.APHG_AUTHENTIC_STIMULUS_SETS||[]).find(s=>s.id==='u4-refugees');
    if(set){set.unit=2;set.topic='2.11';set.title='Forced Displacement and Migration Status';}
    for(const name of ['APHG_AUTHENTIC_STIMULUS_QUESTIONS','APHG_AUTHENTIC_CLUSTER_QUESTIONS']){
      (window[name]||[]).filter(q=>q.setId==='u4-refugees').forEach(q=>{q.unit=2;q.topic=/push factor|conflict/i.test(q.prompt||'')?'2.10':'2.11';});
    }
    (quiz||[]).filter(q=>q.setId==='u4-refugees'||/Which category differs from refugees because people have not crossed|Conflict that pushes residents away from a state/.test(q[1]||'')).forEach(q=>{q[0]='Unit 2';q.topic=/push factor|conflict/i.test(q[1]||'')?'2.10':'2.11';});
    (window.APHG_STIMULUS_FRQ_SETS||[]).filter(f=>f.id==='frq-u4-culture').forEach(f=>{f.unit=2;f.title='Displacement, Culture & Political Geography';f.topics=['2.11','3.7','4.5'];});
  }catch(e){}

  // ---- Replace non-CED 'Evaluate' task verbs in stimulus FRQ coaching ----
  try{
    (window.APHG_STIMULUS_FRQ_SETS||[]).forEach(f=>(f.parts||[]).forEach(p=>{
      if(p[1]==='Evaluate'){
        p[1]='Explain';
        p[2]=String(p[2]).replace(/^one limitation/i,'one limitation');
      }
    }));
  }catch(e){}

  // ---- Make the visual pyramid claim only what the stimulus directly supports ----
  try{
    (window.APHG_IMAGE_MCQ_BANK||[]).filter(q=>q.id==='im1').forEach(q=>{
      const old='High fertility and rapid natural increase',next='High fertility and a youthful population';
      q.choices=q.choices.map(c=>c===old?next:c);q.answer=next;
      q.explain='A wide base directly indicates large young cohorts and relatively high fertility; natural increase also depends on mortality.';
    });
  }catch(e){}

  // ---- Give the adaptive engine the corrected current-CED classifier ----
  try{
    if(window.APHGTopicSkillMastery){window.APHGTopicSkillMastery.topicFromQuestion=infer;}
  }catch(e){}
})();
