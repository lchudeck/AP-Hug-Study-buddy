// Focused CED placement corrections discovered during the post-build semantic audit.
(function(){
  const api=window.APHGPersonalCoach27;
  const lessons=api?._lessonsForValidation;
  if(!lessons)return;

  lessons['5.7']={
    title:'Spatial Organization of Agriculture',
    teach:'Topic 5.7 focuses on economic forces changing the spatial organization of agriculture. Large-scale commercial operations can replace smaller family farms, complex commodity chains connect production and consumption, and technology can create economies of scale and increase the carrying capacity of agricultural land.',
    example:'A large agribusiness may use specialized machinery and distribution networks to lower per-unit costs, while a crop can move through growers, processors, shippers, and retailers before reaching consumers.',
    checks:[
      {q:'Which change best illustrates an economy of scale in agriculture?',choices:['A large farm lowers per-unit costs by using specialized machinery across more output','A household grows only enough food for itself','A farmer moves closer to a market because milk is perishable','A government redraws rural voting districts'],a:'A large farm lowers per-unit costs by using specialized machinery across more output',why:'Economies of scale occur when larger operations can spread fixed costs or use specialized technology so the cost per unit falls.'},
      {q:'A supermarket sells fruit grown abroad, packed by a processing firm, shipped by a logistics company, and distributed through a regional warehouse. Which concept is most directly illustrated?',choices:['A complex agricultural commodity chain','An isolated subsistence system','A long-lot survey pattern','A Malthusian positive check'],a:'A complex agricultural commodity chain',why:'Commodity chains link the stages of production, processing, transportation, distribution, and consumption across different places.'}
    ]
  };

  lessons['6.2']={
    title:'Cities Across the World',
    teach:'Topic 6.2 examines spatial outcomes of urbanization around the world. Megacities and metacities have grown especially in countries of the periphery and semiperiphery, while suburbanization, sprawl, and decentralization create forms such as edge cities, exurbs, and boomburbs.',
    example:'Rapid metropolitan growth can expand far beyond an older urban core, producing new suburban employment centers and large peripheral settlements with different infrastructure challenges.',
    checks:[
      {q:'Which urban change most directly describes jobs, shopping, and offices moving from the traditional central city into major suburban centers?',choices:['Decentralization that can create edge cities','Reapportionment of legislative seats','Relocation diffusion of a language','Agricultural intensification'],a:'Decentralization that can create edge cities',why:'Decentralization shifts activities away from the traditional central business district and can produce suburban employment and commercial centers called edge cities.'},
      {q:'Why are megacities and metacities increasingly important to the study of urbanization in the periphery and semiperiphery?',choices:['Rapid urban growth has produced very large metropolitan concentrations in many of those countries','All cities in those regions have stopped suburbanizing','Their urban populations are always smaller than rural populations','They are defined by having a primate-city pattern'],a:'Rapid urban growth has produced very large metropolitan concentrations in many of those countries',why:'The CED identifies megacities and metacities as important spatial outcomes of urbanization increasingly found in countries of the periphery and semiperiphery.'}
    ]
  };
})();
