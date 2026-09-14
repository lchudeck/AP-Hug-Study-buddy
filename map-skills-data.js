// Week 1 groundwork for the consolidated Maps & Visuals experience.
// Keep geography/data separate from rendering so map visuals can be upgraded
// without duplicating instructional copy or question logic.
(function(){
  if(window.APHG_MAP_SKILLS_DATA)return;

  const US_CITIES=[
    {name:'Seattle',state:'WA',lat:47.6062,lon:-122.3321},
    {name:'Los Angeles',state:'CA',lat:34.0522,lon:-118.2437},
    {name:'Denver',state:'CO',lat:39.7392,lon:-104.9903},
    {name:'Chicago',state:'IL',lat:41.8781,lon:-87.6298},
    {name:'Atlanta',state:'GA',lat:33.7490,lon:-84.3880},
    {name:'New York',state:'NY',lat:40.7128,lon:-74.0060}
  ];

  window.APHG_MAP_SKILLS_DATA={
    version:1,
    labels:{
      section:'Map Skills Practice',
      learn:'Learn Map Types',
      spatial:'Spatial Patterns',
      population:'Population Visuals'
    },
    examples:{
      reference:{
        title:'Reference map',
        geography:'United States',
        task:'Use locations, boundaries, and physical or human features to describe relative location.',
        places:US_CITIES
      },
      choropleth:{
        title:'Choropleth map',
        geography:'United States',
        task:'Read the legend first, then compare standardized values among areas.',
        // Instructional sample values are intentionally unitless until the final
        // source-backed dataset is wired into the renderer.
        values:{WA:3,CA:4,CO:2,IL:4,GA:3,NY:5,ID:1,MT:1,ND:1,TX:3,FL:4}
      },
      proportionalSymbol:{
        title:'Proportional-symbol map',
        geography:'United States',
        task:'Compare magnitude by symbol size, then describe the spatial pattern.',
        points:US_CITIES.map((d,i)=>({...d,value:[2,5,2,4,3,6][i]}))
      },
      dotDensity:{
        title:'Dot-density map',
        geography:'United States',
        task:'Describe concentration and dispersion; dots represent amounts, not exact individual locations.'
      },
      isoline:{
        title:'Isoline map',
        geography:'Pacific Northwest',
        task:'Use spacing between equal-value lines to describe how quickly a continuous variable changes.'
      },
      cartogram:{
        title:'Cartogram',
        geography:'World',
        task:'Interpret resized areas as data magnitude rather than actual land area.'
      }
    },
    practiceBlueprint:[
      {skill:'identify-map-type',prompt:'Identify the map type from its visual encoding.'},
      {skill:'read-legend',prompt:'Use the legend to determine what the symbols, shades, dots, or lines represent.'},
      {skill:'describe-pattern',prompt:'Describe the spatial pattern using geographic language.'},
      {skill:'scale-of-analysis',prompt:'Explain how the pattern could change at a different scale of analysis.'},
      {skill:'evaluate-limitation',prompt:'Identify one limitation of the map for answering the question.'},
      {skill:'support-conclusion',prompt:'Choose the conclusion best supported by the mapped evidence.'}
    ]
  };
})();
