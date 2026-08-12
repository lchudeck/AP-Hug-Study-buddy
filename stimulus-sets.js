// PR #6: AP-style multi-question visual stimulus sets.
(function(){
  const sets=[
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
      id:'urban-sector',unit:6,topic:'6.5',title:'Urban Spatial Structure',
      stimulus:`<svg viewBox="0 0 520 300" class="vp-svg" role="img" aria-label="Sector model with a central business district and wedge-shaped land use sectors"><circle cx="260" cy="150" r="120" class="vp-land"/><circle cx="260" cy="150" r="30" class="vp-d"/><path d="M260 150 L460 85 A120 120 0 0 1 445 210 Z" class="vp-b"/><path d="M260 150 L110 55 A120 120 0 0 1 78 135 Z" class="vp-c"/><text x="235" y="155">CBD</text></svg>`,
      questions:[
        ['Which urban model is represented?',['Sector model','Concentric zone model','Multiple nuclei model','Latin American city model'],'Sector model','The model shows wedge-shaped sectors extending outward from the CBD.','6.5'],
        ['Which factor most likely explains the elongated sectors?',['Transportation corridors','Uniform land value in all directions','Absence of a CBD','No commuting patterns'],'Transportation corridors','Land uses often extend along rail lines, roads, or other transport routes.','6.5'],
        ['Which pattern would be least consistent with the model?',['Several independent business centers far from the CBD','Industrial land extending outward along a rail corridor','Residential sectors expanding outward','A strong central business district'],'Several independent business centers far from the CBD','Multiple independent centers are more characteristic of the multiple nuclei model.','6.5'],
        ['Which contemporary process could make the model less accurate for a metropolitan area?',['Growth of edge cities','Increased reliance on one CBD only','Removal of suburban employment centers','Elimination of highways'],'Growth of edge cities','Suburban employment and retail centers create additional nodes outside the traditional CBD.','6.2']
      ]
    }
  ];
  const questions=[];
  sets.forEach(set=>set.questions.forEach((q,i)=>questions.push({id:`set-${set.id}-${i+1}`,unit:set.unit,topic:q[4],prompt:q[0],choices:q[1],answer:q[2],explain:q[3],stimulus:set.stimulus,stimulusTitle:set.title,setId:set.id,setIndex:i,setSize:set.questions.length})));
  window.APHG_STIMULUS_SETS=sets;
  window.APHG_STIMULUS_SET_QUESTIONS=questions;
})();