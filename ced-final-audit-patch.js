// Final runtime corrections from the full AP Human Geography CED content audit.
// Loaded after legacy modules so student-facing mastery and FRQ coaching match the current CED.
(function(){
  if(window.__cedFinalAuditPatchInstalled)return;
  window.__cedFinalAuditPatchInstalled=true;

  // Current CED Unit 7 sequence: 7.1 Industrial Revolution; 7.2 Economic Sectors and Patterns;
  // 7.3 Measures of Development; 7.4 Women and Economic Development; 7.5 Theories of Development;
  // 7.6 Trade and the World Economy; 7.7 Changes as a Result of the World Economy; 7.8 Sustainable Development.
  try{
    const D=window.__upperMasteryData;
    if(D&&D[7]){
      D[7].topics=[
        ['7.1','The Industrial Revolution','Industrialization transformed production, transportation, urbanization, labor, and global economic relationships.',[['Industrial Revolution','Shift to mechanized factory production beginning in the 18th century.','Textile factories.'],['Industrialization','Growth of manufacturing and factory production.','Economy shifts from agriculture to manufacturing.'],['Agglomeration','Clustering of related economic activities for shared advantages.','Factories and suppliers cluster near one another.']], 'Industrial Revolution is a historical period; industrialization is the broader process.','Explain one spatial consequence of industrialization.'],
        ['7.2','Economic Sectors and Patterns','Primary, secondary, tertiary, quaternary, and quinary activities vary with development, labor costs, resources, infrastructure, markets, and industrial location factors.',[['Primary sector','Extraction of raw materials.','Mining or farming.'],['Secondary sector','Manufacturing and processing.','Factory production.'],['Tertiary sector','Services.','Retail and health care.'],['Quaternary sector','Knowledge and information services.','Research and data analysis.'],['Quinary sector','High-level decision-making and specialized leadership.','Senior executives or government leaders.'],['Weber least-cost theory','Industrial location theory emphasizing transportation, labor, and agglomeration costs.','A manufacturer compares transport and labor costs among sites.']], 'Economic sectors describe types of work; industrial location theories explain why activities locate where they do.','Explain how one location factor influences the spatial pattern of an economic activity.'],
        ['7.3','Measures of Development','Development is measured with economic, social, demographic, and gender indicators; national averages can hide regional and social inequalities.',[['GDP','Value of goods and services produced within a country.','Economic output.'],['GNI','Income earned by a country’s people and firms, including income from abroad.','National income.'],['GDP per capita','GDP divided by population.','Average output per person.'],['HDI','Composite measure using income, education, and life expectancy.','Broader development measure.'],['Gender Inequality Index','Measure of gender disparities in reproductive health, empowerment, and labor participation.','Gender-based development gap.']], 'GDP per capita alone does not measure distribution, education, health, or gender equality.','Compare two development measures and explain what each reveals or misses.'],
        ['7.4','Women and Economic Development','Economic development can change women’s education, labor-force participation, health, political representation, fertility, and access to capital, but gender inequalities can persist.',[['Gender parity','Relative equality of women and men in opportunities and outcomes.','Comparable access to schooling or employment.'],['Labor-force participation','Share of a population working or actively seeking work.','More women enter paid employment as opportunities expand.'],['Microfinance','Small-scale financial services for people with limited access to traditional banks.','A microloan helps a woman start a local business.'],['Gender Inequality Index','Index measuring reproductive health, empowerment, and labor-market inequality.','Higher inequality lowers development outcomes.']], 'More women in the workforce does not automatically mean equal pay, opportunity, or political power.','Explain how economic development can affect gender parity, using one specific mechanism.'],
        ['7.5','Theories of Development','Rostow, dependency theory, and world-systems theory offer different explanations of development and uneven economic relationships.',[['Rostow model','Stage-based model of economic growth from traditional society toward high mass consumption.','A country industrializes and expands investment over time.'],['Dependency theory','Theory emphasizing how unequal economic relationships can keep less-developed states dependent on more-developed states.','Commodity dependence limits bargaining power.'],['World-systems theory','Theory describing a global economy structured through core, semi-periphery, and periphery relationships.','Higher-value activities concentrate disproportionately in core economies.'],['Core','Economies with greater capital, high-skill activity, and influence over global production.','High-value command and research functions.'],['Semi-periphery','Economies with characteristics of both core and periphery.','Manufacturing growth alongside lower-wage production.'],['Periphery','Economies often specializing in lower-value raw materials or labor-intensive production.','Commodity exports.']], 'World-systems theory describes structural unequal relationships; it does not require deliberate intent by wealthy countries to keep poorer countries poor.','Explain one strength or limitation of a development theory in a specified context.'],
        ['7.6','Trade and the World Economy','Trade, foreign direct investment, multinational corporations, outsourcing, offshoring, comparative advantage, and global commodity chains connect economies across scales.',[['Comparative advantage','Ability to produce a good at lower opportunity cost relative to another producer.','Specialization encourages trade.'],['Tariff','Tax on imported goods.','Raises the price of an import.'],['Foreign direct investment','Investment by a firm in operations located in another country.','A company builds or buys a factory abroad.'],['Outsourcing','Contracting work or a business function to an outside company.','A firm hires another company to handle customer support.'],['Offshoring','Moving a business activity to another country, whether kept in-house or outsourced.','A manufacturer moves assembly to a foreign plant it owns.'],['Commodity chain','Linked stages of production, processing, distribution, and consumption.','Coffee moves from growers to processors to exporters and retailers.']], 'Outsourcing and offshoring can occur together, but they are not synonyms.','Explain one way trade or global production links places at different geographic scales.'],
        ['7.7','Changes as a Result of the World Economy','Global production can create deindustrialization, economic restructuring, special economic zones, export-oriented manufacturing, new international divisions of labor, and uneven gains and losses.',[['Deindustrialization','Decline in manufacturing employment or activity in a region.','Factory closures in an older industrial area.'],['Economic restructuring','Shift in the mix of economic activities and employment.','A manufacturing region grows service and technology jobs.'],['Special economic zone','Area with special regulations or incentives intended to attract investment.','Tax-favored export manufacturing zone.'],['Maquiladora','Export-oriented factory in Mexico that often uses imported inputs for assembly.','Manufacturing near the U.S.–Mexico border.'],['New international division of labor','Global separation of production tasks according to labor costs, skills, infrastructure, and firm strategy.','Design in one country and assembly in another.']], 'A change can benefit one place, sector, or group while creating costs for another; analyze outcomes at more than one scale.','Explain one geographic consequence of a change in the world economy.'],
        ['7.8','Sustainable Development','Sustainable development seeks economic opportunity and improved quality of life while protecting resources and environmental systems for the future.',[['Sustainable development','Development that meets present needs without undermining the ability of future generations to meet theirs.','Renewable energy paired with education and health investment.'],['Human capital','Skills, education, and health that increase workers’ capabilities.','Schooling and public health improve productivity.'],['Fair trade','Approach intended to improve producer compensation and labor conditions in trade networks.','Fair-trade coffee certification.'],['Renewable energy','Energy from sources replenished naturally on human time scales.','Wind and solar power.']], 'Economic growth alone is not the same as sustainable development; environmental and social outcomes matter too.','Explain the degree to which one development strategy could improve economic, social, and environmental outcomes.']
      ];
    }

    // Mastery coaching should use the APHG FRQ task-verb family when presented as AP-style practice.
    if(D){
      Object.values(D).forEach(unit=>{
        (unit.topics||[]).forEach(t=>{
          const p=String(t[5]||'');
          if(/^Evaluate one way globalization changes state sovereignty\.?$/i.test(p))t[5]='Explain one way globalization changes state sovereignty.';
          else if(/^Evaluate one limitation of the Von Thünen model\.?$/i.test(p))t[5]='Explain one limitation of the Von Thünen model.';
          else if(/^Evaluate one urban sustainability strategy\.?$/i.test(p))t[5]='Explain one benefit and one limitation of an urban sustainability strategy.';
          else if(/^Evaluate a policy using both benefits and tradeoffs\.?$/i.test(p))t[5]='Explain one benefit and one tradeoff of an urban policy.';
          else if(/^Evaluate one strategy for improving development sustainably\.?$/i.test(p))t[5]='Explain the degree to which one strategy could improve development sustainably.';
        });
      });
    }
  }catch(e){}

  // Preserve strict nonsense rejection while making clear that local keyword matching is a coaching aid,
  // not an official College Board score. Multiple valid APHG examples can earn a point.
  try{
    const base=window.__gradeFrqPart;
    if(typeof base==='function'){
      window.__gradeFrqPart=function(part,text){
        const r=base(part,text);
        if(r.earned){
          r.feedback=r.feedback+' Study Buddy is using a local coaching check, not an official AP score.';
          return r;
        }
        if(!text||/missing|does not contain a recognizable/i.test(r.feedback||''))return r;
        r.feedback=(r.feedback||'Part '+r.letter+': not verified automatically.')+' A different, accurate AP Human Geography example or explanation may still earn the point. Compare your response with the model/rubric and revise if the geographic relationship is not clear.';
        r.coachingOnly=true;
        return r;
      };
      const extract=window.__extractFrqPart;
      window.localGradeFRQ=function(fullAnswer,prompt){
        const parts=prompt.parts.map(part=>window.__gradeFrqPart(part,extract(part[0],fullAnswer)));
        const score=parts.filter(p=>p.earned).length,total=parts.length;
        const uncertain=parts.filter(p=>!p.earned&&p.coachingOnly).map(p=>p.letter);
        const missed=parts.filter(p=>!p.earned&&!p.coachingOnly).map(p=>p.letter);
        let overall=`Study Buddy verified ${score}/${total} point${score===1?'':'s'} with its local coaching check.`;
        if(uncertain.length)overall+=` Part${uncertain.length>1?'s':''} ${uncertain.join(', ')} need rubric/self-check because valid alternate wording may not match the model answer.`;
        if(missed.length)overall+=` Rework part${missed.length>1?'s':''} ${missed.join(', ')}.`;
        overall+=' This is practice feedback, not an official College Board score.';
        return {parts,score,total,warnings:uncertain.length?[`Auto-grading could not verify valid-alternative responses for: ${uncertain.join(', ')}`]:[],overall};
      };
    }
  }catch(e){}
})();