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
        [/\b(rising|increasing|higher|high) median age\b|median age (is )?(rising|increasing)/, /\b(high|higher|increasing|larger|growing) (share|proportion|percentage|number) of (elderly|older|people (over|aged) 65)/, /\b(high|higher|rising) (elderly|old-age) dependency ratio|top-heavy (population )?pyramid|\blow (fertility|birth) rate/],
        'Name an indicator with its direction: rising median age, a larger elderly share, or high elderly dependency.', /\b(falling|decreasing|lower) median age|wide base.*aging|median age.{0,40}(younger|more children)/],
      [/^define dependency ratio/,
        [/\b(dependents?|children and (the )?(elderly|older people)|people under 15 and over 64).{0,65}\b(to|with|by|per|relative to|compared to|divided by)\b.{0,20}(the )?(working[- ]age|15[- ]64)/],
        'Compare dependents (children and older people) with the working-age population. For a calculation, divide dependents by working-age people, often multiplying by 100.', /working[- ]age.{0,35}(divided by|over|per).{0,25}(dependents|children|elderly)/],
      [/economic challenge caused by an aging population/,
        [/\b(higher|increase|increased|increasing|rising|more) (pension|health[- ]?care|medical) (costs?|spending|expenses?|demand)/, /(pension|health[- ]?care|medical) (costs?|spending|expenses?).{0,20}(rise|increase|grow)/, /\b(labo[u]?r|worker) shortages?\b|\b(smaller|shrinking) workforce\b/],
        'Describe a specific economic effect, such as rising pension spending or labor shortages. Describe needs a clear effect; it does not require a because sentence.', /(pension|health[- ]?care) (costs?|spending).{0,20}(decrease|fall|decline|shrink)|\b(lower|falling|decreasing) (pension|health[- ]?care) (costs?|spending)/],
      [/immigration.*shrinking workforce/,
        [/\b(working[- ]age (im)?migrants?|new arrivals|immigrants?|migrants?).{0,70}(fill|take).{0,25}(vacan|job|labo[u]?r shortage)/, /\b(working[- ]age (im)?migrants?|immigrants?|migrants?).{0,60}(expand|increase|add to|boost|enlarge|grow).{0,25}(workforce|labo[u]?r (force|pool)|supply of workers)/],
        'Connect arriving workers to filling vacant jobs or expanding labor supply. Merely naming immigration or tax revenue does not explain how the workforce grows.', /immigration.{0,25}(shrinks|reduces|decreases) (the )?workforce/],
      [/social or political challenge connected to increased immigration/,
        [/\b(housing|rental|rent).{0,55}(demand|competition|shortage|supply).{0,70}(rent|cost|price|tension|oppos|resent)/, /\b(demand|competition|pressure).{0,30}(housing|public services|schools|health care).{0,65}(cost|strain|tension|oppos|capacity|overcrowd)/, /\b(residents?|voters?|some people).{0,30}(fear|worry|resent|oppose).{0,40}(cultural change|language|religio|housing|public service)/, /\b(language|cultural|religious) differences.{0,55}(misunderstanding|discrimination|conflict|tension)/],
        'Explain a specific mechanism: for example, housing demand outpaces construction, raising rents and opposition, or residents fear cultural change. Saying people are different does not explain the challenge.', /(lower|falling|decreas|reduc)[a-z]*.{0,15}(rent|housing cost)/],
      [/demographic transition.*low birth rates and low death rates/,
        [/\bstage (4|5|iv|v)\b/],
        'Identify Stage 4 (or Stage 5 in a five-stage version). Low birth and death rates do not describe Stage 1, where both are high.', /\bstage (1|2|3|i|ii|iii)\b|\bhigh (birth|death) rates?|\b(birth|death) rates?.{0,15}(high|rising)/],
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
  function gradePart(part,text){
    const [letter,verb,prompt,model]=part;
    const clean=norm(text),wc=clean.split(' ').filter(Boolean).length;
    if(!clean) return {letter,verb,earned:false,status:'incorrect',feedback:`Part ${letter}: 0/1. This part is blank.`,fix:model};
    if(looksNonsense(text)) return {letter,verb,earned:false,status:'incorrect',feedback:`Part ${letter}: 0/1. The response does not contain a recognizable AP Human Geography idea that answers this part.`,fix:model};

    const unit2=unit2Rubric(part,text);
    if(unit2)return unit2;

    const ev=evidence(text,model);
    const requiredHits=verb==='Identify'?1:(ev.needed.length>=4?2:1);
    const contentOK=ev.hits.length>=requiredHits;
    let structureOK=true;
    if(verb==='Define'||verb==='Describe') structureOK=wc>=4;
    if(verb==='Explain') structureOK=wc>=6&&hasCausalRelationship(text);
    if(verb==='Apply'||verb==='Evaluate'||verb==='Compare') structureOK=wc>=6;

    if(contentOK&&structureOK){
      return {letter,verb,earned:true,status:'verified',feedback:`Part ${letter}: 1/1. Study Buddy found enough APHG content and task completion to verify this point. This is a coaching check—not an official AP score.`,fix:model};
    }

    const tooBrief=verb==='Explain'?(wc<12||!hasCausalRelationship(text)):wc<6;
    const selfCheckLevel=tooBrief?'too-brief':'could-earn';
    const reasons=[];
    if(verb==='Explain'&&!hasCausalRelationship(text))reasons.push('make the cause-and-effect relationship explicit');
    if(wc<4)reasons.push('add enough detail to complete the task verb');
    if(!contentOK)reasons.push('compare the geographic idea/example with the rubric');
    return {
      letter,verb,earned:false,status:'unverified',coachingOnly:true,selfCheckLevel,
      feedback:tooBrief?'Too brief to earn the point yet — add a specific example and explain the cause/effect.':'Could earn the point — compare your wording with the model answer.',
      fix:model
    };
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
