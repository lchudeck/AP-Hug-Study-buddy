// PR #6: AP-style multi-question visual stimulus sets for all seven units.
(function(){
  const sets=[
    {
      id:'map-scale-patterns',unit:1,topic:'1.1',title:'Map Type and Scale Stimulus Set',
      stimulus:`<svg viewBox="0 0 520 300" class="vp-svg" role="img" aria-label="Instructional choropleth-style map with differently shaded regions and a scale inset"><rect x="35" y="45" width="300" height="190" class="vp-land"/><path d="M135 45 V235 M235 45 V235 M35 135 H335" class="vp-line"/><rect x="35" y="45" width="100" height="90" class="vp-a"/><rect x="135" y="45" width="100" height="90" class="vp-b"/><rect x="235" y="45" width="100" height="90" class="vp-c"/><rect x="35" y="135" width="100" height="100" class="vp-d"/><rect x="135" y="135" width="100" height="100" class="vp-b"/><rect x="235" y="135" width="100" height="100" class="vp-a"/><text x="370" y="80">Darker = higher %</text><rect x="370" y="120" width="95" height="70" class="vp-land"/><circle cx="400" cy="150" r="8" class="vp-symbol"/><circle cx="435" cy="165" r="8" class="vp-symbol"/><text x="365" y="220">Local inset</text></svg>`,
      questions:[
        ['Which map type is most closely represented by the large map?',['Choropleth map','Dot-density map','Reference map','Isoline map'],'Choropleth map','Defined areas are shaded according to a rate or percentage.','1.1'],
        ['What is the main advantage of the local inset?',['It reveals finer-scale variation hidden by the larger map','It eliminates all map distortion','It converts the map into a cartogram','It guarantees causal explanation'],'It reveals finer-scale variation hidden by the larger map','Changing scale can expose patterns that are hidden by broader aggregation.','1.6'],
        ['Which statement best describes scale of analysis?',['The level at which data are grouped and interpreted','The physical size of the paper only','The color scheme of the map','The latitude of the mapped area'],'The level at which data are grouped and interpreted','Scale of analysis changes how spatial patterns appear and are interpreted.','1.6'],
        ['Which limitation is most relevant to the choropleth map?',['Large internal differences can be hidden inside each shaded area','It cannot display any percentages','It cannot compare places','It always shows exact individual locations'],'Large internal differences can be hidden inside each shaded area','Aggregation can mask within-area variation.','1.1']
      ]
    },
    {
      id:'pop-pyramid-youthful',unit:2,topic:'2.3',title:'Population Pyramid Stimulus Set',
      stimulus:`<svg viewBox="0 0 520 300" class="vp-svg" role="img" aria-label="Youthful population pyramid with a wide base and narrow top"><line x1="260" y1="35" x2="260" y2="265" class="vp-line"/><g class="vp-bars"><rect x="165" y="220" width="95" height="24"/><rect x="260" y="220" width="95" height="24"/><rect x="180" y="185" width="80" height="24"/><rect x="260" y="185" width="80" height="24"/><rect x="195" y="150" width="65" height="24"/><rect x="260" y="150" width="65" height="24"/><rect x="210" y="115" width="50" height="24"/><rect x="260" y="115" width="50" height="24"/><rect x="225" y="80" width="35" height="24"/><rect x="260" y="80" width="35" height="24"/></g><text x="170" y="285">Male</text><text x="315" y="285">Female</text></svg>`,
      questions:[
        ['Which demographic characteristic is most strongly supported by the stimulus?',['High fertility and a youthful population','Low fertility and rapid aging','Negative natural increase','A large elderly dependency burden'],'High fertility and a youthful population','A wide base indicates large younger cohorts and relatively high fertility.','2.3'],
        ['Which DTM stage is most likely associated with this population structure?',['Stage 2','Stage 4','Stage 5','Stage 1 in all modern countries'],'Stage 2','Stage 2 commonly has high birth rates, falling death rates, and rapid natural increase.','2.5'],
        ['Which policy challenge is most likely to emerge first?',['Expanding schools and youth services','Closing elementary schools','A shrinking labor force from aging','Rising pension costs from elderly dependency'],'Expanding schools and youth services','Large young cohorts increase demand for education, pediatric health care, and eventually jobs.','2.9'],
        ['If fertility falls substantially over the next several decades, which change would most likely occur?',['The pyramid base would narrow','The pyramid top would immediately disappear','Arithmetic density would fall to zero','All migration would stop'],'The pyramid base would narrow','Lower fertility produces smaller younger cohorts, narrowing the base over time.','2.4']
      ]
    },
    {
      id:'diffusion-network',unit:3,topic:'3.2',title:'Cultural Diffusion Network',
      stimulus:`<svg viewBox="0 0 520 280" class="vp-svg" role="img" aria-label="Network showing a cultural trait spreading from one major node to other major nodes and then to smaller places"><circle cx="90" cy="140" r="32" class="vp-symbol"/><circle cx="260" cy="75" r="26" class="vp-symbol"/><circle cx="420" cy="120" r="22" class="vp-symbol"/><circle cx="300" cy="220" r="15" class="vp-symbol"/><path d="M120 130 L235 85 M285 85 L395 115 M275 100 L295 205" class="vp-line"/><text x="55" y="35">Major nodes → major nodes → smaller place</text></svg>`,
      questions:[
        ['Which diffusion process is most directly represented?',['Hierarchical diffusion','Contagious diffusion','Relocation diffusion','Reverse hierarchical diffusion'],'Hierarchical diffusion','The trait moves among influential or high-order places before reaching smaller places.','3.2'],
        ['Which real-world example best matches the pattern?',['A fashion trend spreading from celebrities to major cities and then smaller cities','A disease spreading only to adjacent households','Migrants carrying a religion to a new country','A food custom remaining isolated in one village'],'A fashion trend spreading from celebrities to major cities and then smaller cities','Hierarchical diffusion follows social or urban rank rather than simple proximity.','3.2'],
        ['Which development would most likely accelerate this pattern today?',['Social media and global communication networks','Higher friction of distance','Greater geographic isolation','Reduced transportation access'],'Social media and global communication networks','Communication technologies speed connections between influential nodes.','3.2'],
        ['If the trait changes to fit local cultural preferences as it spreads, which process is occurring?',['Stimulus diffusion','Assimilation','Sequent occupance','Ethnocentrism'],'Stimulus diffusion','The underlying idea spreads while its form changes to fit local conditions.','3.3']
      ]
    },
    {
      id:'gerrymander-district',unit:4,topic:'4.6',title:'Electoral Geography Stimulus Set',
      stimulus:`<svg viewBox="0 0 520 300" class="vp-svg" role="img" aria-label="Instructional district map with an irregular district boundary and clustered voters"><rect x="45" y="45" width="420" height="180" class="vp-land"/><path d="M55 70 C165 40 175 195 285 175 S385 70 455 90" class="vp-line"/><circle cx="95" cy="90" r="7"/><circle cx="130" cy="110" r="7"/><circle cx="175" cy="135" r="7"/><circle cx="220" cy="155" r="7"/><circle cx="335" cy="120" r="7"/><circle cx="395" cy="105" r="7"/><text x="55" y="255">Irregular electoral district boundary</text></svg>`,
      questions:[
        ['Which political process is most directly suggested by the stimulus?',['Gerrymandering','Devolution','Supranationalism','Irredentism'],'Gerrymandering','The irregular boundary suggests manipulation of electoral district lines.','4.6'],
        ['Which strategy concentrates opposition voters into as few districts as possible?',['Packing','Cracking','Reapportionment','Annexation'],'Packing','Packing concentrates a group into a small number of districts.','4.6'],
        ['Why can redistricting occur after a census?',['Population changes may require districts to be redrawn','States lose sovereignty after every census','All boundaries become relic boundaries','The census directly elects representatives'],'Population changes may require districts to be redrawn','Districts are adjusted as populations shift to preserve representation.','4.6'],
        ['Which concept is most closely related to the authority of a state to govern its territory?',['Sovereignty','Centrifugal force','Territorial sea','Nation'],'Sovereignty','Sovereignty refers to a state’s supreme authority over its territory.','4.1']
      ]
    },
    {
      id:'von-thunen-rings',unit:5,topic:'5.6',title:'Agricultural Land-Use Stimulus Set',
      stimulus:`<svg viewBox="0 0 520 300" class="vp-svg" role="img" aria-label="Von Thunen model with concentric agricultural land-use rings around a market"><circle cx="260" cy="150" r="120" class="vp-a"/><circle cx="260" cy="150" r="92" class="vp-b"/><circle cx="260" cy="150" r="64" class="vp-c"/><circle cx="260" cy="150" r="30" class="vp-d"/><text x="235" y="155">Market</text><text x="380" y="45">Distance increases →</text></svg>`,
      questions:[
        ['Which model is represented?',['Von Thünen model','Rostow model','Sector model','Central place theory'],'Von Thünen model','The model organizes agricultural land uses in rings around a market.','5.6'],
        ['Why are dairy and market gardening generally closest to the market?',['They are perishable and costly to transport','They require the cheapest land','They are always extensive farming','They do not require labor'],'They are perishable and costly to transport','Perishability and transport costs make proximity to market more valuable.','5.6'],
        ['Which factor would most weaken the ring pattern?',['Major highways and refrigeration','Higher transportation costs','A single central market','Uniform physical terrain'],'Major highways and refrigeration','Modern transport and preservation reduce the importance of simple distance from market.','5.6'],
        ['Which term best describes large-scale business involvement in food production and distribution?',['Agribusiness','Pastoral nomadism','Subsistence agriculture','Shifting cultivation'],'Agribusiness','Agribusiness integrates commercial farming with processing, distribution, and sales.','5.8']
      ]
    },
    {
      id:'urban-sector',unit:6,topic:'6.5',title:'Urban Spatial Structure',
      stimulus:`<svg viewBox="0 0 520 300" class="vp-svg" role="img" aria-label="Sector model with a central business district and wedge-shaped land use sectors"><circle cx="260" cy="150" r="120" class="vp-land"/><circle cx="260" cy="150" r="30" class="vp-d"/><path d="M260 150 L460 85 A120 120 0 0 1 445 210 Z" class="vp-b"/><path d="M260 150 L110 55 A120 120 0 0 1 78 135 Z" class="vp-c"/><text x="235" y="155">CBD</text></svg>`,
      questions:[
        ['Which urban model is represented?',['Sector model','Concentric zone model','Multiple nuclei model','Latin American city model'],'Sector model','The model shows wedge-shaped sectors extending outward from the CBD.','6.5'],
        ['Which factor most likely explains the elongated sectors?',['Transportation corridors','Uniform land value in all directions','Absence of a CBD','No commuting patterns'],'Transportation corridors','Land uses often extend along rail lines, roads, or other transport routes.','6.5'],
        ['Which pattern would be least consistent with the model?',['Several independent business centers far from the CBD','Industrial land extending outward along a rail corridor','Residential sectors expanding outward','A strong central business district'],'Several independent business centers far from the CBD','Multiple independent centers are more characteristic of the multiple nuclei model.','6.5'],
        ['Which contemporary process could make the model less accurate for a metropolitan area?',['Growth of edge cities','Increased reliance on one CBD only','Removal of suburban employment centers','Elimination of highways'],'Growth of edge cities','Suburban employment and retail centers create additional nodes outside the traditional CBD.','6.2']
      ]
    },
    {
      id:'development-chain',unit:7,topic:'7.4',title:'Global Production and Development Stimulus Set',
      stimulus:`<svg viewBox="0 0 520 290" class="vp-svg" role="img" aria-label="Global production chain showing inputs, factory, shipping, and retail"><rect x="35" y="105" width="95" height="55" class="vp-layer"/><rect x="160" y="105" width="95" height="55" class="vp-layer"/><rect x="285" y="105" width="95" height="55" class="vp-layer"/><rect x="410" y="105" width="75" height="55" class="vp-layer"/><path d="M130 132 L160 132 M255 132 L285 132 M380 132 L410 132" class="vp-line"/><text x="48" y="138">Inputs</text><text x="173" y="138">Factory</text><text x="298" y="138">Shipping</text><text x="422" y="138">Sale</text></svg>`,
      questions:[
        ['Which concept best describes the sequence shown?',['Commodity chain','Rank-size rule','Distance decay','Dependency ratio'],'Commodity chain','A commodity chain links production, processing, distribution, and sale.','7.4'],
        ['Why might the factory stage be located in a lower-wage country?',['Firms may reduce labor costs through offshoring','High wages always attract manufacturing','Factories must be located near the final consumer','Transportation costs never matter'],'Firms may reduce labor costs through offshoring','Offshoring shifts production to another country, often to reduce costs.','7.4'],
        ['Which theory emphasizes unequal relationships between core and peripheral regions?',['World-systems theory','Rostow model','Central place theory','Von Thünen model'],'World-systems theory','World-systems theory focuses on unequal economic relationships across the global system.','7.3'],
        ['Which indicator would best complement GDP when comparing human well-being?',['HDI','Arithmetic density','CBR only','EEZ size'],'HDI','HDI combines income, education, and life expectancy to measure development more broadly.','7.2']
      ]
    }
  ];
  const questions=[];
  sets.forEach(set=>set.questions.forEach((q,i)=>questions.push({id:`set-${set.id}-${i+1}`,unit:set.unit,topic:q[4],prompt:q[0],choices:q[1],answer:q[2],explain:q[3],stimulus:set.stimulus,stimulusTitle:set.title,setId:set.id,setIndex:i,setSize:set.questions.length})));
  window.APHG_STIMULUS_SETS=sets;
  window.APHG_STIMULUS_SET_QUESTIONS=questions;
})();