(function(){
  if(window.__frqPartScoringInstalled) return;
  window.__frqPartScoringInstalled=true;

  const STOP=new Set(['the','and','or','to','of','in','a','an','is','are','was','were','it','this','that','with','from','for','one','as','by','on','be','can','could','would','may','more','less','into','their','its','has','have','had','such','because','therefore','which','they','them','than','also']);
  const STEM=w=>w.replace(/(ingly|edly|ing|ed|es|s)$/,'');
  const SYNONYM_GROUPS=[
    ['increase','rise','grow','expand','higher','larger','boost'],['decrease','decline','fall','reduce','lower','shrink'],
    ['job','employment','work','labor'],['money','income','wage','salary','earn'],['cost','expense','price'],
    ['outside','external','third-party','thirdparty','subcontract'],['company','firm','business','corporation'],
    ['foreign','abroad','overseas','international','another-country'],['relocate','shift','transfer'],
    ['city','urban'],['rural','countryside'],['country','state','nation'],['people','population','residents'],
    ['manufacture','manufacturing','production','factory','assembly'],['trade','exchange','commerce'],
    ['migration','migrate','move'],['transport','transportation','shipping','ship','rail','road','transit'],['agriculture','agricultural','farm','farming'],
    ['consumer','customer','buyer','market'],['producer','farmer','seller','supplier'],['connect','reach','access']
  ];
  const synonymIndex=new Map();
  SYNONYM_GROUPS.forEach((g,i)=>g.forEach(w=>synonymIndex.set(STEM(w),i)));

  function norm(s){return String(s||'').toLowerCase().replace(/another country/g,'another-country').replace(/third party/g,'third-party').replace(/[^a-z0-9\s'-]/g,' ').replace(/\s+/g,' ').trim();}
  function words(s){return norm(s).split(' ').filter(Boolean).map(STEM);}
  function contentWords(s){return words(s).filter(w=>w.length>3&&!STOP.has(w));}
  function extractPart(letter,full){
    const source=String(full||'');
    const re=new RegExp('(?:^|\\n)\\s*'+letter+'\\s*[\\).:-]\\s*([\\s\\S]*?)(?=(?:\\n\\s*[A-Z]\\s*[\\).:-])|$)','i');
    const m=source.match(re);
    return m?m[1].trim():'';
  }
  function looksNonsense(s){
    const t=norm(s), ws=t.split(' ').filter(Boolean); if(!ws.length)return true;
    if(/^(idk|i don'?t know|dont know|no idea|n\/a|na|asdf|lol|whatever)[.! ]*$/i.test(String(s).trim()))return true;
    const alpha=ws.join(''); const vowels=(alpha.match(/[aeiouy]/g)||[]).length;
    if(alpha.length>8 && vowels/Math.max(alpha.length,1)<.16)return true;
    if(ws.length>=3 && ws.every(w=>w.length>7) && !/(population|migration|region|location|culture|state|market|urban|agricultur|development|diffusion|density|site|situation|government|economic|social|politic|trade|industry|labor)/.test(t))return true;
    return false;
  }
  function concepts(s){
    const out=new Set();
    contentWords(s).forEach(w=>out.add(synonymIndex.has(w)?'syn:'+synonymIndex.get(w):w));
    return out;
  }
  function evidence(student,model){
    const sw=concepts(student), mw=[...concepts(model)];
    const hits=mw.filter(w=>sw.has(w));
    return {hits,needed:mw};
  }
  function hasCausalRelationship(text){
    const t=norm(text);
    if(/\b(increasing|decreasing|expanding|reducing|raising|rises?|rising|falls?|falling)\b/i.test(t))return true;
    return /(because|therefore|thus|hence|consequently|as a result|due to|leads? to|led to|results? in|resulted in|caus(?:e|es|ed|ing)|so that|which (?:raises?|reduces?|increases?|decreases?|creates?|allows?|prevents?)|\b(?:raises?|reduces?|increases?|decreases?|creates?|allows?|prevents?|encourages?|discourages?|limits?|expands?|shrinks?|pushes?|pulls?)\b)/i.test(t);
  }
  // Only the existing Unit 2 Coach, simulator and two Unit 2 drills use these
  // task-specific checks. Unknown phrasing needs review; it never falls through
  // to the generic model-word overlap scorer. These are conservative coaching
  // rules, not a semantic reader or an official AP scoring rubric.
  function unit2Rubric(part,text){
    const [letter,verb,prompt,model]=part, t=norm(String(text).replace(/[\u2010-\u2015]/g,'-'));
    const rules=[
      [/indicator.*aging population/,
        [/\b(rising|increasing|higher|high) median age\b|median age (is )?(rising|increasing)/, /\b(high|higher|increasing|larger|growing) (share|proportion|percentage|number) of (elderly|older|people (over|aged) 65)/, /\b(high|higher|rising) (elderly|old-age) dependency ratio|top-heavy (population )?pyramid|\blow (fertility|birth) rate/, /\b(share|proportion|percentage|number) of (elderly|older (people|adults)|people (over|aged|older than) 65|seniors|retirees).{0,20}(is |are )?(rising|increasing|growing|higher)/],
        'Name an indicator with its direction: rising median age, a larger elderly share, or high elderly dependency.', /\b(falling|decreasing|lower) median age|wide base.*aging|median age.{0,40}(younger|more children)/],
      [/^define dependency ratio/,
        [/\b(dependents?|children and (the )?(elderly|older people)|people under 15 and over 64).{0,65}\b(to|with|by|per|relative to|compared to|divided by)\b.{0,32}(the )?(working[- ]age|15[- ]64|(people )?aged 15 to 64|15 to 64)/],
        'Compare dependents (children and older people) with the working-age population. For a calculation, divide dependents by working-age people, often multiplying by 100.', /working[- ]age.{0,35}(divided by|over|per).{0,25}(dependents|children|elderly)/],
      [/economic challenge caused by an aging population/,
        [/\b(higher|increase|increased|increasing|rising|more) (pension|health[- ]?care|medical) (costs?|spending|expenses?|demand)/, /(pension|health[- ]?care|medical) (costs?|spending|expenses?).{0,20}(rise|increase|grow)/, /\b(labo[u]?r|worker) shortages?\b|\b(smaller|shrinking) workforce\b/, /\b(spend|pay)\w* (more|extra) (money )?(on|for) (pension|health|medical|social security)/],
        'Describe a specific economic effect, such as rising pension spending or labor shortages. Describe needs a clear effect; it does not require a because sentence.', /(pension|health[- ]?care) (costs?|spending).{0,20}(decrease|fall|decline|shrink)|\b(lower|falling|decreasing) (pension|health[- ]?care) (costs?|spending)/],
      [/immigration.*shrinking workforce/,
        [/\b(working[- ]age (im)?migrants?|new arrivals|immigrants?|migrants?).{0,70}(fill|take).{0,25}(vacan|job|labo[u]?r shortage)/, /\b(working[- ]age (im)?migrants?|immigrants?|migrants?).{0,60}(expand|increase|add to|boost|enlarge|grow).{0,25}(workforce|labo[u]?r (force|pool)|supply of workers)/],
        'Connect arriving workers to filling vacant jobs or expanding labor supply. Merely naming immigration or tax revenue does not explain how the workforce grows.', /immigration.{0,25}(shrinks|reduces|decreases) (the )?workforce/],
      [/social or political challenge connected to increased immigration/,
        [/\b(housing|rental|rent).{0,55}(demand|competition|shortage|supply).{0,70}(rent|cost|price|tension|oppos|resent)/, /\b(demand|competition|pressure).{0,30}(housing|public services|schools|health care).{0,65}(cost|strain|tension|oppos|capacity|overcrowd)/, /\b(residents?|voters?|some people).{0,30}(fear|worry|resent|oppose).{0,60}(cultural change|language|religio|housing|public service)/, /\b(language|cultural|religious) differences.{0,55}(misunderstanding|discrimination|conflict|tension)/],
        'Explain a specific mechanism: for example, housing demand outpaces construction, raising rents and opposition, or residents fear cultural change. Saying people are different does not explain the challenge.', /(lower|falling|decreas|reduc)[a-z]*.{0,15}(rent|housing cost)/],
      [/demographic transition.*low birth rates and low death rates/,
        [/\bstage (4|5|iv|v)\b|\b(fourth|fifth|4th|5th) stage\b/],
        'Identify Stage 4 (or Stage 5 in a five-stage version). Low birth and death rates do not describe Stage 1, where both are high.', /\bstage (1|2|3|i|ii|iii)\b|\b(first|second|third|1st|2nd|3rd) stage\b|\bhigh (birth|death) rates?|\b(birth|death) rates?.{0,15}(high|rising)/],
      [/(explain|evaluate) one policy.*aging population/,
        [/\b(raise|raising|increase|increasing).{0,12}(the )?retirement age.{0,75}(keep|remain|stay|longer|delay).{0,30}(work|employ|retir)|retirement age.{0,35}(keep|remain|stay).{0,30}(work|employ)/, /\b(childcare|child care|parental leave|child benefits|birth subsid|pronatalist).{0,90}(afford|cost|encourage|support|birth|fertility).{0,90}(future|eventual|long[- ]term|later|workforce|workers|births|fertility)/, /\b(encourage|allow|admit|attract|increase).{0,20}immigration.{0,65}(fill|expand|increase|add).{0,25}(job|workforce|labo[u]?r|worker)/, /\b(automation|robots|robotics).{0,70}(replace|substitut|productivity|produce more|fewer workers)/],
        'Name a policy and explain its mechanism: later retirement keeps adults employed longer; working-age immigration fills vacancies; childcare support reduces childrearing costs and may raise births; automation offsets labor shortages. More births help the workforce only after children grow up.', /\b(newborn|babies|infants).{0,35}(fill|take|work).{0,20}(jobs|vacancies)|\b(immediately|instantly).{0,35}(workforce|workers)|\b(antinatalist|restrict births).{0,55}(increase|expand|grow).{0,20}(workforce|births)/],
      [/demographic model that best explains/,
        [/\bdemographic transition( model)?\b|\bdtm\b/],
        'Name the Demographic Transition Model: falling deaths with births still high fit Stage 2.', /\b(epidemiological|malthus|stage (1|3|4|5))\b/],
      [/population pattern likely shown.*population pyramid/,
        [/\b(wide|broad) base\b|\b(many|large (share|proportion|number) of|more) (children|young people|youth)|\bhigh birth rates?\b/],
        'Describe a wide base or a large young population, consistent with the scenario’s high births and falling deaths.', /\b(narrow base|top-heavy|aging population|low birth rates?|low fertility)\b/],
      [/challenge.*rapid urban growth/,
        [/\b(migrants?|arrivals|urban growth|population growth).{0,85}(outpace|faster than|exceed|overwhelm).{0,60}(housing|services|infrastructure|construction|capacity)/, /\b(housing|infrastructure|services|schools|water|sewage).{0,60}(cannot keep up|can t keep up|not keep pace|cannot accommodate)/, /\b(migrants?|urban growth|population growth).{0,55}(increase|raise|strain).{0,35}(demand|pressure).{0,60}(housing|infrastructure|services|schools|water)/],
        'Connect rapid arrivals to a specific capacity problem, such as housing construction failing to keep pace with demand. Naming infrastructure alone is a description.'],
      [/reason rural residents may migrate to cities/,
        [/\b(cities|urban areas).{0,45}(offer|provide|have).{0,25}(more|better|higher).{0,20}(jobs|wages|schools|health care|services|employment)/, /\b(jobs|employment|higher wages|better schools|health care).{0,35}(in cities|in urban areas).{0,50}(attract|draw|pull|encourage)/, /\b(rural|farm).{0,40}(job losses|unemployment|drought|mechanization).{0,50}(push|force|drive|leave|seek|move)/],
        'Locate the reason: better urban jobs or services attract migrants, or a specific rural hardship pushes residents toward cities. Naming jobs without location or direction is incomplete.', /drought in cities|leave cities for rural/],
      [/effect of a high youth dependency ratio/,
        [/\b(higher|more|increases|increased|increasing|rising|greater).{0,25}(demand|spending|pressure|need).{0,30}(schools|education|child|working[- ]age|workers)/, /\b(schools|child health care|education).{0,20}(demand|spending|costs?).{0,15}(increase|rise|grow)/],
        'Describe increased demand for schools or child health care, or greater support pressure on working-age people. Youth dependency is not elderly dependency.', /\b(pension|retiree)\b/],
      [/educational opportunities for women.*fertility/,
        [/\b(education|school|educational opportunities).{0,80}(delay|postpone).{0,30}(marriage|childbirth|childbearing|birth).{0,65}(lower|reduce|fewer|decline).{0,20}(fertility|births|children)/, /\b(lower|reduce|declin|fewer).{0,20}(fertility|births|children).{0,70}(delay|postpone|employment|career|contracepti|family planning)|fertility.{0,15}(decline|fall|decrease).{0,70}(employment|career|contracepti|family planning)/, /\b(education|school).{0,65}(employment|career|contracepti|family planning).{0,65}(lower|reduce|fewer).{0,20}(fertility|births|children)/],
        'Connect education to a mechanism, such as later childbearing, more employment choices, or access to family planning, and then to potentially lower fertility. Education does not make all women’s decisions identical.', /\b(always|every woman|all women|infertile|sterile)\b/],
      [/rural-to-urban migration.*settlement pattern/,
        [/\b(migrants?|people|rural residents).{0,70}(concentrate|settle|move).{0,35}(cities|urban areas).{0,65}(grow|larger|urbanization|urbanisation|expand)/, /\b(cities|urban areas|urban share).{0,35}(grow|expand|increase).{0,65}(migrants?|arrivals|rural residents|people move)/, /urbanization.{0,60}(migrants?|people).{0,45}(concentrate|move|settle)/],
        'Explain how movement concentrates people in cities, increasing urban population or urban share. Listing urbanization alone does not explain the changing settlement pattern.', /\b(reduc|decreas|declin|shrink)[a-z]*.{0,20}(urbanization|urbanisation|city size|cities)/],
      [/^identify one pull factor for migration/,
        [/^(jobs|employment|safety|education|political freedom)$|\b(higher|better) (wages|pay|schools|education)|\b(job|employment) opportunities\b|\bfamily reunification\b|\b(political safety|religious freedom|access to education)\b/],
        'Identify an attraction at the destination, such as higher wages, job opportunities, safety, or family reunification. Unemployment at the origin is a push factor.', /\b(unemployment|war|persecution|drought|lower wages)\b/],
      [/^explain one consequence of a high dependency ratio/,
        [/\b(fewer|less) (working[- ]age people|workers).{0,35}(support|provide|pay).{0,25}(more )?(dependents|children|elderly|retirees)/, /\b(more|many|growing numbers of) (retirees|dependents|children|elderly).{0,45}(increase|raise|strain).{0,30}(pension|health|spending|tax|service|workers)/],
        'Connect many dependents relative to working-age people with greater support needs, pension or school costs, or tax pressure. A list of costs is not an explanation.', /(pension|health) costs.{0,20}(decrease|fall)|dependents.{0,25}(reduce|lower).{0,20}(costs|tax)/]
    ];
    const rule=rules.find(r=>r[0].test(norm(prompt)));
    if(!rule)return null;
    // A keyword match cannot establish the meaning of a negated, conditional or
    // self-contradictory claim. Retain these for student/teacher rubric review.
    const negationText=/challenge.*rapid urban growth/.test(norm(prompt))?t.replace(/cannot keep up|can'?t keep up|not keep pace|cannot accommodate/g,'capacity limit'):t;
    const ambiguous=/\b(not|never|cannot|can'?t|doesn'?t|don'?t|isn'?t|aren'?t|won'?t|no)\b/.test(negationText);
    const contradiction=rule[3]&&rule[3].test(t);
    const earned=!ambiguous&&!contradiction&&rule[1].some(re=>re.test(t));
    return {letter,verb,earned,status:earned?'verified':'unverified',coachingOnly:!earned,
      reviewLabel:earned?undefined:'Not verified — rubric review',
      feedback:earned?`Part ${letter}: 1/1 locally verified. Your response states the required geographic relationship. This is a coaching check, not an official AP score.`:
        `No point automatically verified. ${contradiction?'Check the direction or accuracy of your claim. ':ambiguous?'Your wording includes a negation that this limited checker cannot safely interpret. ':''}${rule[2]} A defensible alternative may earn credit; compare the reasoning with the model or ask your teacher.`,
      fix:model};
  }
  // A short reply sharing no idea with the task or model (e.g. "random",
  // "because because") must not be told it "may earn credit". It stays a
  // coaching status, never a point.
  function offTask(part,text){
    const t=norm(text);
    return t.split(' ').filter(Boolean).length<=4&&!evidence(text,part[2]+' '+part[3]).hits.length;
  }
  function tooBrief(part,guidance){
    const [letter,verb,,model]=part;
    return {letter,verb,earned:false,status:'unverified',coachingOnly:true,selfCheckLevel:'too-brief',reviewLabel:'Too brief',
      feedback:`Too brief to earn the point yet. Add the required geographic reasoning for this ${verb.toLowerCase()} task. ${guidance||'Use the specific term, example, or cause-and-effect the part asks for, then compare with the model below.'}`,fix:model};
  }
  // Content-specific checks are intentionally bounded. Unrecognized prose is
  // rubric review, not a point inferred from word overlap or response length.
  function courseRubric(part,text){
    const [letter,verb,prompt,model]=part,t=norm(text),p=norm(prompt);
    const all=(...g)=>({test:s=>g.every(r=>r.test(s))}),any=(...g)=>({test:s=>g.some(r=>r.test(s))});
    const rules=[
      [/^define situation/, /(?:relative (?:location|to)|in relation to (?:other|nearby|surrounding)|compared (?:with|to) (?:the )?(?:other |nearby |surrounding )?(?:places|cities|routes)|location.{0,45}(?:other places|connections)|(?:connections|relationship).{0,35}other places)/, /absolute|latitude|longitude/, 'Define relative location and connections to other places, not absolute coordinates.'],
      [/^define relocation diffusion/, /(?:people|families|individuals|migrants|migrating).{0,45}(?:move|moving|migrat|relocat).{0,35}(?:bring|carry|spread).{0,35}(?:trait|culture|cultural|custom|religio|language)|(?:trait|culture|cultural).{0,65}(?:people move|migration|migrants move)/, /stay home|(?:leave|abandon).{0,35}(?:trait|culture)|prevent.{0,25}(?:cultural|spread)|without.{0,20}(?:mov|migrat)/, 'Relocation diffusion requires people moving and carrying cultural traits to a new place.'],
      [/^define sovereignty/, any(/(?:authority|power|right).{0,45}(?:govern|rule|control).{0,35}(?:itself|territory|independent|own)/, /(?:authority|power|right|ability).{0,30}(?:make|pass|set|decide|run).{0,25}(?:its|their) own (?:laws|decisions|rules|territory|affairs)/), /(?:no|loses?|lacks?).{0,15}(?:authority|power|right)|controlled from outside|external control|controlled by (?:another|other|a foreign)/, 'State sovereignty means authority to govern its territory independently.', /without (?:any )?(?:outside|other countr\w*|foreign|external|another-country)\w*.{0,15}(?:interfer|control|involvement)\w*/],
      [/explain why dairy|explain why.*market gardening/, /(?:near|close).{0,30}market.{0,100}(?:spoil|perish|transport.{0,20}cost|cost.{0,20}transport)|(?:spoil|perish).{0,90}(?:near|close).{0,20}market|(?:go bad|goes bad|spoil|perish|rot)\w*.{0,90}(?:close|near)\w*.{0,30}(?:city|market|town)/, /(?:far|distant|away) from (?:the )?market|less costly.{0,25}distance/, 'Connect proximity to the market with reduced spoilage or transportation costs for perishable products.'],
      [/negative effect of gentrification/, /(?:rising|higher|increased|increase in).{0,25}(?:rent|cost|tax).{0,70}(?:unaffordable|displac|force.{0,15}(?:leave|move)|cannot afford|can t afford)|displac.{0,65}(?:rising|higher|increased).{0,20}(?:rent|cost|tax)|(?:rent|cost|tax|price)s? (?:go|goes|went|going|rise|rising|increase|climb)\w*.{0,70}(?:afford|pushed out|forced out|priced out|displac|move out)/, /more affordable|(?:reduce|prevent|stop|less).{0,20}displac|keep.{0,30}residents|lower.{0,15}(?:rent|cost)/, 'Explain how higher rents or taxes make housing unaffordable and can displace longtime residents.'],
      [/^define (?:hdi|human development index)/, /^(?=.*\b(?:income|gni|standard of living)\b)(?=.*\b(?:education|schooling)\b)(?=.*\blife expectancy\b)/, /military|total population/, 'HDI combines income, education, and life expectancy. All three dimensions are needed.'],
      [/explain how improved transportation can affect market access/, /(?:roads?|rail|transportation).{0,80}(?:reach|connect|access).{0,35}(?:buyers|consumers|customer|market)/, /fewer buyers|reduce.{0,20}access/, 'Connect better transportation to reaching more buyers or markets through lower travel time or cost.'],
      // FRQ Coach parts, Units 1 and 3-7. Each rule needs the task's geographic idea
      // (and, for Explain, its mechanism); r[2] catches reversed claims; r[4] lists
      // negations a correct answer can use without being treated as ambiguous.
      [/physical characteristics of the city's location/, /(?:^|\s)site(?:\s|$)/, /situation|absolute|relative/, 'Name the concept for a place’s physical characteristics: site.'],
      [/^describe one way the city's site/, any(/\b(?:rivers?|water|confluence|fertile|soil|floodplain|harbou?r|port)\b.{0,90}\b(?:drink|irrigat|farm|crops?|food|fish|transport|trade|ship|boat|barge|travel|settl|grow|power|mill|defen)\w*/, /\b(?:settl|farm|grow|trade|travel|ship)\w*.{0,60}\b(?:rivers?|water|fertile|soil|harbou?r)\b/), /\b(?:interstate|highway|railroad|rail line)\b|\b(?:kept|keep|keeps|prevent|stopp?ed|discourag|hard|harder|difficult)\w*.{0,30}\b(?:settl|farm|grow|trade)/, 'Describe a physical feature of the site (such as the rivers) and how it supported settlement, farming, water supply, or trade.'],
      [/^explain how the city's situation helped it grow/, any(/\b(?:interstate|highway|rail|railroad|train|transport|connect|hub|access|link)\w*.{0,100}\b(?:trade|markets?|business|compan|jobs?|workers?|goods|ship|customers?|investment|industr|factor|warehouse)\w*/, /\b(?:business|compan|industr|factor|warehouse)\w*.{0,60}\b(?:locat|mov|came|attract|chose|built|open)\w*.{0,60}\b(?:interstate|highway|rail|transport|hub|connect)\w*/), /\b(?:harder|less|reduc|decreas|fewer|isolat|cut off|block)\w*.{0,30}\b(?:trade|markets?|access|business)/, 'Connect the highway and rail links (situation) to trade, market access, businesses, or jobs.'],
      [/scale of analysis from regional to local/, all(/\b(?:regional|region|broad|large|larger|bigger|whole|national|overall)\b/, /\b(?:local|neighbou?rhoods?|smaller|small|street|block)\b/, /\b(?:differen|inequal|unequal|variation|detail|hidden|hide|mask|reveal|miss|specific|services|access|fewer)\w*/), /\b(?:local|neighbou?rhood)\w* (?:scale |level |map )?(?:hides|hide|masks?|obscures?)/, 'Contrast what the regional scale shows (broad connections) with what the local scale reveals (neighborhood differences).'],
      [/gis layer to study inequality/, all(/\b(?:gis|layers?|overlay|map)\w*/, /\b(?:income|transit|bus|grocer|food|school|hospital|health|clinic|park|poverty|rent|service|internet|broadband|pollution|tree)\w*/, /\b(?:compar|reveal|identif|which|where|lack|fewer|less|differen|unequal)\w*/), /\b(?:prove|proves)\b.{0,40}\bequal\b/, 'Name a specific data layer (income, transit, grocery stores, schools) and explain how comparing it across neighborhoods shows inequality.'],
      [/planning decision that could improve access/, all(/\b(?:expand|add|build|open|extend|increas|improv|creat|invest|fund|locat|bring|provid)\w*/, /\b(?:bus|transit|routes?|clinic|grocer|stores?|supermarket|schools?|librar|parks?|sidewalk|bike|services?|hospital|zoning|mixed-use|train|rail|subway|health)\w*/, /\b(?:access|reach|connect|closer|travel|commut|jobs?|food|care|walk)\w*/), /\b(?:cut|cutting|remov|reduc|eliminat|clos)\w*.{0,20}\b(?:bus|transit|routes?|services?|clinic|stores?|schools?)/, 'Name a specific planning change and explain how it helps residents reach jobs, food, schools, or health care.', /without (?:long|far|having to|needing)\w*/],
      [/place where a cultural trait begins/, /\bhearths?\b/, /\b(?:diffusion|relocation|expansion)\b/, 'Name the term for a cultural trait’s place of origin: hearth.'],
      [/^describe one example of stimulus diffusion/, all(/\b(?:adapt|modif|chang|adjust|alter|fit|tailor|veggie|vegetarian|halal|kosher|local version|instead)\w*/, /\b(?:local|culture|cultural|religio|customs?|tastes?|preferences?|traditions?|hindu|muslim|india|country)\w*/, /\b(?:menu|food|mcdonald|restaurant|burger|pizza|toppings?|chain|franchise|brand|dish|drink|coffee|product|idea|holiday|sport|music|game|version|recipe|design|technology|alphabet|writing|fashion|clothing|style)\w*/), /\b(?:missionar|migrat|relocat|people move|unchanged|exactly the same|identical)\w*/, 'Give an example where the underlying idea spreads but is changed to fit the local culture.', /without beef|no beef|not (?:eat|serve) beef/],
      [/^explain how migration can spread culture/, any(/\b(?:migrants?|immigrants?|people|families|they|newcomers|refugees)\b.{0,70}\b(?:bring|brought|carry|carried|take|took|introduc|share|spread)\w*.{0,60}\b(?:language|religio|food|customs?|traditions?|music|holiday|cuisine|cloth|culture|cultural|beliefs?|practices?)\w*/, /\b(?:language|religio|food|customs?|traditions?|culture)\w*.{0,60}\b(?:spread|move|travel|diffuse)\w*.{0,40}\b(?:migra|people move|with them|immigra)\w*/), /\b(?:leave|abandon|stop|lose)\w*.{0,30}\b(?:culture|traditions?|language)|stops? culture/, 'Explain that migrants carry cultural traits (language, religion, food, customs) to new places where they can spread.'],
      [/globalization can speed up cultural diffusion/, all(/\b(?:internet|social media|media|tv|television|phones?|communicat|technolog|trade|travel|airplane|air travel|flights?|shipping|stream|corporation|tourism|online)\w*/, /\b(?:fast|quick|instant|rapid|speed|immediately|seconds|worldwide|around the world|long distances?|across)\w*/), /\b(?:slow|slower|delay|harder)\w*.{0,30}\b(?:diffusion|spread)|trade less/, 'Name a globalization mechanism (internet, media, trade, travel) and explain how it spreads traits faster or farther.'],
      [/lingua franca can support/, all(/\b(?:common|shared|same|second|bridge|english|one language)\b/, /\b(?:communicat|understand|talk|trade|business|negotiat|interact|exchange|cooperat)\w*/), /\b(?:prevent|block|stop|hinder|limit)\w*.{0,25}\b(?:communicat|interact|understand)\w*/, 'Explain how a shared language lets people with different first languages communicate, trade, or exchange ideas.'],
      [/effect of cultural diffusion on local cultures/, all(/\b(?:local|traditional|traditions?|indigenous|native|minority)\b/, /\b(?:lose|loss|lost|disappear|replac|weaken|declin|homogen|westerniz|americaniz|assimilat|diverse|diversity|blend|syncret|hybrid|fusion|mix|combine|revival|revive|alike|similar)\w*/, /\b(?:global|popular culture|pop culture|outside|foreign|new|western|american|chains?|media|brands?|tourist|immigra|migra|spread)\w*/), /\b(?:stay|remain)\w* exactly the same|\bunchanged\b/, 'Explain a specific effect on local culture, such as traditions being replaced or blended, and what causes it.'],
      [/political process described in the scenario/, /\bdevol\w*/, /\b(?:centrali[sz]|centripetal|irredent|supranational)\w*/, 'Name the process of power moving from the central government to regions: devolution.'],
      [/cultural factor that could lead to devolution/, all(/\b(?:languages?|religio|ethnic|identity|traditions?|heritage|nationalis|dialects?|customs?)\w*/, /\b(?:distinct|different|separate|minority|own|unique|regional|differs?)\b/), /\b(?:shared|common|same) (?:national )?(?:language|religion|identity)/, 'Describe a cultural difference, such as a distinct language, religion, or ethnicity, that sets the region apart.'],
      [/regional identity can create devolutionary pressure/, all(/\b(?:identity|identify|loyal|belong|feel|pride|nationalis)\w*/, /\b(?:autonom|independen|self-govern|self-rule|local control|own government|separat|secession|secede|more power|break away|own country|referendum)\w*/), /loyal\w* to the (?:central|national)|stop asking for autonomy/, 'Connect stronger regional loyalty to demands for autonomy, self-government, or independence.'],
      [/federal system could reduce devolutionary pressure/, all(/\b(?:federal|federalism|share|shares|sharing|divid|give|gives|giving|grant|lets?|allow|delegat|distribut)\w*/, /\b(?:power|authority|control|autonomy|decisions?|self-govern|laws)\b/, /\b(?:regions?|states?|provinces?|local)\b/, /\b(?:needs?|satisf|stay|remain|keep|reduc|less|together|unit|address|voice|decid|own)\w*/), /\b(?:takes?|taking|remov|reduc)\w* (?:power|autonomy|control) (?:away )?from (?:the )?(?:regions?|states?|provinces?)/, 'Explain how giving regions some authority meets local needs and reduces the push for independence.', /without (?:full |complete )?(?:independence|breaking away|seceding|leaving)/],
      [/centrifugal force is shown/, all(/\b(?:pull|divid|split|apart|away|weaken|separat|fragment|tension|conflict|disunity|break)\w*/, /\b(?:identity|region|language|religio|ethnic|culture|group|autonom|independen)\w*/, /\b(?:unity|unified|state|country|nation|national|central|together|government)\b/), /\b(?:unites?|unifies|binds?|strengthen)\w*.{0,30}\b(?:country|state|nation|national unity|together)/, 'Explain how the regional identity divides people or weakens loyalty to the state.'],
      [/central government could use to help keep the state unified/, all(/\b(?:autonom|language rights|protect|revenue|federal|represent|invest|infrastructure|recogni|devolv|power|rights|fund|holiday|symbol|flag|anthem)\w*/, /\b(?:address|reduc|satisf|unit|together|loyal|grievan|complaint|stay|keep|belong|less|ease|included|voice|trust|appeal)\w*/), /\b(?:ban|outlaw|suppress|forbid|force|punish|arrest)\w*/, 'Name a policy (autonomy, language rights, revenue sharing) and explain how it reduces grievances and keeps the state together.'],
      [/agricultural land-use model described/, /\bvon th(?:u|ue)?nen\b|\bvon th nen\b|\bth(?:u|ue)nen\b/, /\b(?:burgess|concentric zone|sector|hoyt|rostow)\b/, 'Name the agricultural land-use model with rings around a market: the von Thünen model.'],
      [/^define commercial agriculture/, any(/\b(?:grow|farm|produc|rais|crops?|food|agricultur|animals|livestock)\w*.{0,60}\b(?:sell|sale|sold|markets?|profit|money|export|income)\w*/, /\b(?:sell|sale|sold|profit)\w*.{0,60}\b(?:crops?|food|farm|products?|livestock)\w*/), /^(?!.*(?:rather than|instead of)).*(?:feed (?:their|your|the|his|her) (?:own )?famil|subsistence|own consumption)/, 'Define commercial agriculture as producing crops or livestock mainly for sale or profit.'],
      [/pattern of agricultural land use in the von th/, all(/\b(?:rings?|zones?|circles?|concentric|bands?)\b/, /\b(?:market|city|town|center|centre)\b/, /\b(?:perishabl|dairy|vegetables?|garden|transport|distance|closer|close|near|farther|further|cost|bulky|heavy|forest|wood|grain|ranch|livestock|rent)\w*/), /\b(?:perishabl\w*|dairy|vegetables?|market gardening) (?:goods )?(?:is |are )?(?:on the outer|in the outer|at the edge|farthest|far from)|\b(?:ranch\w*|livestock|grazing) (?:is |are )?(?:closest|nearest|close to|near)/, 'Describe rings around a central market, with perishable or costly-to-transport goods closest.'],
      [/limitation of the von th/, all(/\b(?:roads?|highways?|rivers?|mountains?|terrain|hills?|soil|climate|weather|refriger|trucks?|technolog|transport|markets|government|subsid|polic|globali|trade|rail|railroad|airplanes?|shipping)\w*/, /\b(?:assum|isolated|flat|uniform|ignor|account|chang|differ|alter|distort|unrealistic|real|actual|break|disrupt|irregular|allow|shift|modern|today|travel|distances?|farther|anymore)\w*/), /\b(?:perfect|perfectly|exactly|always|accurately) (?:predicts?|matches|describes?|shows?)/, 'Name a real-world factor (roads, refrigeration, terrain, subsidies, multiple markets) and explain how it changes the ring pattern.', /\b(?:does ?n[o']?t|do ?n[o']?t|is ?n[o']?t|are ?n[o']?t|not) (?:account|consider|include|reflect|apply|work|flat|uniform|isolated|realistic|match)|(?:does ?n[o']?t|do ?n[o']?t|not) (?:have|need) to|no longer/],
      [/green revolution/, all(/\b(?:high-yield|high yield|hyv|seeds?|fertili[sz]|pesticid|herbicid|irrigat|machine|tractor|hybrid|chemical|technolog|gmo|genetically|mechani[sz])\w*/, /\b(?:increas|more|higher|boost|doubl|rais|improv|greater|larger|yield)\w*/), /\b(?:decreas|reduc|lower|less|fewer)\w*.{0,20}\b(?:yields?|production|output|food supply)/, 'Name a Green Revolution input (high-yield seeds, fertilizer, irrigation, machinery) and explain how it raised production.'],
      [/negative consequence of modern commercial agriculture/, all(/\b(?:monocultur|one crop|fertili[sz]|pesticid|chemical|irrigat|runoff|erosion|soil|water|aquifer|deforest|biodiversity|pollut|small farm|debt|corporat|dead zone|greenhouse|methane|antibiotic|cafo|feedlot|eutroph|salin|habitat)\w*/, /\b(?:harm|damag|deplet|pollut|degrad|erod|loss|lose|contamin|shortage|declin|kill|wear|out of business|algae|dead zone|unhealthy)\w*/), /\b(?:improves?|restores?|protects?) (?:the )?(?:soil|environment|biodiversity|water quality)/, 'Name a practice (monoculture, fertilizer, irrigation, feedlots) and the specific harm it causes.'],
      [/urban process described in the scenario/, /\bgentrif\w*/, /\b(?:suburbani[sz]|sprawl|urban renewal|redlin|blockbust)\w*/, 'Name the process of investment and higher-income residents moving into a lower-income neighborhood: gentrification.'],
      [/^define gentrification/, all(/\b(?:wealth|higher-income|higher income|middle-class|middle class|richer|rich|affluent|investment|investors?|renovat|professionals?|upper)\w*/, /\b(?:low-income|low income|lower-income|poor|poorer|working-class|working class|older|declin|run-down|rundown|cheap|inner-city|inner city|neglected|disinvest)\w*/, /\b(?:neighbou?rhoods?|areas?|community|district|city)\b/), /\b(?:poor|low-income|lower-income) (?:people|residents|families) (?:move|moving|buy)|property values? (?:drop|fall|decreas)/, 'Define gentrification: investment and higher-income residents move into a lower-income neighborhood, raising costs.'],
      [/positive effect of gentrification/, all(/\b(?:business|stores?|shops?|restaurants?|housing|homes?|renovat|tax|infrastructure|safety|safer|crime|property values?|investment|parks?|services?|jobs?|amenit|streets?|sidewalks?)\w*/, /\b(?:new|improv|more|better|increas|repair|less|lower|higher|rais|fix|safer|cleaner|upgrad|bring|brings|attract|open|collect)\w*/), /\b(?:lower|lowers|decreas|reduc|fall|drop)\w*.{0,15}\b(?:property values?|tax revenue|investment)/, 'Describe a specific benefit, such as new businesses, renovated housing, or more tax revenue.'],
      [/redlining or past housing discrimination/, all(/\b(?:redlin|discriminat|denied|deny|refus|segregat|loans?|mortgages?)\w*/, /\b(?:investment|loans?|mortgages?|credit|property values?|value|wealth|home ?ownership|services|schools?|poverty|infrastructure)\b/, /\b(?:today|present|still|now|over time|generations?|persist|continu|long-term|lasting|legacy|inherit|current)\w*/), /redlin\w*.{0,40}\b(?:increas|more|brought|attract|help)\w*.{0,20}\b(?:investment|loans?|wealth|value)/, 'Connect denied loans or investment in the past to lower property values, wealth, or services that persist today.', /\b(?:could ?n[o']?t|can ?n[o']?t|cannot|were ?n[o']?t|did ?n[o']?t|was ?n[o']?t|unable to) (?:get|obtain|receive|access|buy|borrow|qualify)|\bno (?:loans|investment|mortgages|credit)\b|\bnot (?:given|approved|allowed|able)/],
      [/interpretation of this urban issue/, all(/\b(?:city|citywide|city-wide|metro|regional|large|larger|broad|national|whole|overall|average)\w*/, /\b(?:local|neighbou?rhoods?|block|block-level|street|tract|smaller|small)\b/, /\b(?:reveal|show|hide|hidden|mask|miss|displac|differen|unequal|inequal|rent|detail|variation|specific|see)\w*/), /\b(?:local|neighbou?rhood|block)\w* (?:scale |level |data |map )?(?:hides|hide|masks?|conceals?|obscures?)/, 'Contrast what city-scale data show with what local or neighborhood data reveal, such as displacement.'],
      [/policy that could reduce displacement/, all(/\b(?:affordable|rent control|rent stabili|land trust|tenant|inclusionary|subsid|vouchers?|tax freeze|property tax|public housing|right to return|protections?|caps?)\w*/, /\b(?:stay|remain|can afford|afford to|afford their|keep (?:their|living)|displac|forced out|priced out|pushed out|move out|leave)\w*/), /\b(?:remov|end|ending|eliminat|repeal|cut|abolish)\w*.{0,15}\b(?:rent control|rent stabili|affordable|tenant protection|subsid|public housing)/, 'Name an anti-displacement policy and explain how it helps longtime residents afford to stay.', /\b(?:do ?n[o']?t|does ?n[o']?t|wo ?n[o']?t|are ?n[o']?t|not|never) (?:have to |get |be )?(?:forced|priced|pushed|displaced|move|leave|evicted)/],
      [/moves manufacturing operations/, /\boffshor\w*/, /\b(?:reshor|onshor|outsourc)\w*/, 'Name the process of a company moving its own production to another country: offshoring.'],
      [/benefit of the offshored manufacturing/, all(/\b(?:jobs?|employment|work|wages?|income|investment|fdi|industr|exports?|infrastructure|technolog|skills?|training|tax|revenue|growth)\b/, /\b(?:more|new|bring|brings|creat|increas|provid|gain|grow|boost|higher|attract)\w*/), /\b(?:lose|loss|takes?|took|remov|fewer|reduc|cut)\w*.{0,20}\b(?:jobs|employment|income)\b/, 'Describe a specific benefit to the lower-income country, such as jobs, investment, or export income.'],
      [/negative effect of offshoring on manufacturing workers/, all(/\b(?:lose|loss|lost|fewer|cut|clos|declin|unemploy|lower|reduc|laid off|layoffs?|out of work|deindustriali[sz]|rust belt)\w*/, /\b(?:abroad|overseas|another-country|other countr|moves?|moved|relocat|cheaper|lower-wage|low-wage|offshor|leave|left|shift)\w*/), /\b(?:more|increas|gain|creat)\w* (?:manufacturing )?(?:jobs|employment|wages)/, 'Explain how moving production abroad leads to job loss or deindustrialization for workers at home.'],
      [/world-systems theory would interpret/, all(/\bcore\b/, /\b(?:periph|semi-periph|semiperiph)\w*/, /\b(?:unequal|inequal|exploit|cheap|low-wage|lower-wage|labou?r|high-value|profit|benefit|depend|wealth|control|keep|keeps|wage)\w*/), /\bperiph\w* (?:countries |country )?(?:keeps?|controls?|gets?) (?:the )?(?:high-value|profit)|\bcore (?:countries |country )?(?:provides?|supplies) (?:cheap|low-wage|lower-wage)/, 'Use core and periphery (or semi-periphery) and explain the unequal division of high-value work and low-wage labor.'],
      [/rostow/, all(/\b(?:takeoff|take-off|take off|stages?|drive to maturity|preconditions?|mass consumption)\b/, /\b(?:industr|manufactur|invest|factor|production|jobs|infrastructure|technolog|savings|capital)\w*/, /\b(?:move|moving|reach|enter|push|progress|advanc|help|toward|towards|next|step|transition|grow|develop)\w*/), /\b(?:back|return|regress|backward)\w*.{0,30}\b(?:traditional|stage|earlier)/, 'Place industrialization in Rostow’s stages (such as moving toward takeoff) and explain why investment drives that change.'],
      [/strategy a lower-income country could use to increase development/, all(/\b(?:educat|schools?|infrastructure|roads?|electric|health|microfinanc|microcredit|loans?|women|gender|technolog|higher-value|diversif|manufactur|exports?|fair trade|tourism|invest|training|skills?|internet)\w*/, /\b(?:increas|reduc|improv|attract|grow|rais|productiv|wages?|incomes?|jobs?|depend|skills?)\w*/), /\b(?:cut|cutting|reduc|eliminat|remov)\w*.{0,15}\b(?:education|school|infrastructure|health)/, 'Name a development strategy and explain how it raises income, skills, or local economic benefits.']
    ];
    const rule=rules.find(r=>r[0].test(p));
    // Exact supplied model is curated content, not a semantic inference. This
    // also avoids imposing a connector word on the site's own explanations.
    const bare=s=>s.replace(/^(?:the|a|an) /,'');
    const modelMatch=bare(t)===bare(norm(model));
    const contradiction=rule&&rule[2].test(t);
    const negText=rule&&rule[4]?t.replace(new RegExp(rule[4].source,'g'),' '):t;
    const negated=/\b(not|never|no|cannot|can't|doesn't|without)\b/.test(negText.replace(/(?:cannot|can't|can t|can no longer|no longer|not) afford/g,''));
    const earned=modelMatch||!!(rule&&!contradiction&&!negated&&rule[1].test(t));
    if(!earned&&!contradiction&&offTask(part,text))return tooBrief(part,rule&&rule[3]);
    return {letter,verb,earned,status:earned?'verified':'unverified',coachingOnly:!earned,
      reviewLabel:earned?undefined:(contradiction?'Revise geographic reasoning':'Not verified — rubric review'),
      feedback:earned?`Part ${letter}: 1/1 locally verified against this task. This coaching check is not an official AP score.`:
      `${contradiction?'Your claim conflicts with the geographic relationship. ':''}No point automatically verified. ${rule?rule[3]:`For this ${verb.toLowerCase()} task, compare your claim and required geographic reasoning with the model below.`} ${negated?'This checker cannot reliably interpret every negated statement. ':''}A concise answer or valid alternative may earn credit; review meaning, not matching words or length.`,fix:model};
  }
  function gradePart(part,text){
    const [letter,verb,prompt,model]=part;
    const clean=norm(text),wc=clean.split(' ').filter(Boolean).length;
    if(!clean) return {letter,verb,earned:false,status:'incorrect',feedback:`Part ${letter}: 0/1. This part is blank.`,fix:model};
    if(looksNonsense(text)) return {letter,verb,earned:false,status:'incorrect',feedback:`Part ${letter}: 0/1. The response does not contain a recognizable AP Human Geography idea that answers this part.`,fix:model};

    const unit2=unit2Rubric(part,text);
    if(unit2)return !unit2.earned&&!/Check the direction/.test(unit2.feedback)&&offTask(part,text)?tooBrief(part):unit2;

    return courseRubric(part,text);
  }

  window.__frqHasCausalRelationship=hasCausalRelationship;
  window.__gradeFrqPart=gradePart;
  window.__extractFrqPart=extractPart;
  window.localGradeFRQ=function(fullAnswer,prompt){
    const parts=prompt.parts.map(part=>gradePart(part,extractPart(part[0],fullAnswer)));
    const score=parts.filter(p=>p.status==='verified').length;
    const total=parts.length;
    const uncertain=parts.filter(p=>p.status==='unverified').map(p=>p.letter);
    const incorrect=parts.filter(p=>p.status==='incorrect').map(p=>p.letter);
    let overall=`Study Buddy automatically verified ${score}/${total} possible points. This is a coaching check—not an official AP score.`;
    if(uncertain.length) overall+=` Part${uncertain.length>1?'s':''} ${uncertain.join(', ')} ${uncertain.length>1?'were':'was'} not automatically verified; compare with the rubric rather than treating ${uncertain.length>1?'them':'it'} as wrong.`;
    if(incorrect.length) overall+=` Rework part${incorrect.length>1?'s':''} ${incorrect.join(', ')}.`;
    return {parts,score,total,uncertain,incorrect,warnings:uncertain.length?[`Rubric/self-check needed for: ${uncertain.join(', ')}`]:[],overall};
  };
})();
