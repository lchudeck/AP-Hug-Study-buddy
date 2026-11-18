// Bounded Unit 1 and 3 rules reused from PR #71; no other PR changes included.
(function(){const all=(...g)=>({test:s=>g.every(r=>r.test(s))}),any=(...g)=>({test:s=>g.some(r=>r.test(s))});
window.__frqGuidedRules=[
    [/physical characteristics of the city's location/, /(?:^|\s)site(?:\s|$)/, /situation|absolute|relative/, 'Name the concept for a place’s physical characteristics: site.'],
    [/^describe one way the city's site/, any(/\b(?:rivers?|water|confluence|fertile|soil|floodplain|harbou?r|port)\b.{0,90}\b(?:drink|irrigat|farm|crops?|food|fish|transport|trade|ship|boat|barge|travel|settl|grow|power|mill|defen)\w*/, /\b(?:settl|farm|grow|trade|travel|ship)\w*.{0,60}\b(?:rivers?|water|fertile|soil|harbou?r)\b/), /\b(?:interstate|highway|railroad|rail line)\b|\b(?:kept|keep|keeps|prevent|stopp?ed|discourag|hard|harder|difficult)\w*.{0,30}\b(?:settl|farm|grow|trade)/, 'Describe a physical feature of the site (such as the rivers) and how it supported settlement, farming, water supply, or trade.'],
    [/^explain how the city's situation helped it grow/, any(/\b(?:interstate|highway|rail|railroad|train|transport|connect|hub|access|link)\w*.{0,100}\b(?:trade|markets?|business|compan|jobs?|workers?|goods|ship|customers?|investment|industr|factor|warehouse)\w*/, /\b(?:business|compan|industr|factor|warehouse)\w*.{0,60}\b(?:locat|mov|came|attract|chose|built|open)\w*.{0,60}\b(?:interstate|highway|rail|transport|hub|connect)\w*/), /\b(?:harder|less|reduc|decreas|fewer|isolat|cut off|block)\w*.{0,30}\b(?:trade|markets?|access|business)/, 'Connect the highway and rail links (situation) to trade, market access, businesses, or jobs.'],
    [/scale of analysis from regional to local/, all(/\b(?:regional|region|broad|large|larger|bigger|whole|national|overall)\b/, /\b(?:local|neighbou?rhoods?|smaller|small|street|block)\b/, /\b(?:differen|inequal|unequal|variation|detail|hidden|hide|mask|reveal|miss|specific|services|access|fewer)\w*/), /\b(?:local|neighbou?rhood)\w* (?:scale |level |map )?(?:hides|hide|masks?|obscures?)/, 'Contrast what the regional scale shows (broad connections) with what the local scale reveals (neighborhood differences).'],
    [/(?:gis.*(?:inequality|layer)|layer.*inequality)/, all(/\b(?:gis|layers?|overlay|map)\w*/, /\b(?:income|transit|bus|grocer|food|school|hospital|health|clinic|park|poverty|rent|service|internet|broadband|pollution|tree)\w*/, /\b(?:compar|reveal|identif|which|where|lack|fewer|less|differen|unequal)\w*/), /\b(?:prove|proves)\b.{0,40}\bequal\b/, 'Name a specific data layer (income, transit, grocery stores, schools) and explain how comparing it across neighborhoods shows inequality.'],
    [/planning decision that could improve access/, all(/\b(?:expand|add|build|open|extend|increas|improv|creat|invest|fund|locat|bring|provid)\w*/, /\b(?:bus|transit|routes?|clinic|grocer|stores?|supermarket|schools?|librar|parks?|sidewalk|bike|services?|hospital|zoning|mixed-use|train|rail|subway|health)\w*/, /\b(?:access|reach|connect|closer|travel|commut|jobs?|food|care|walk)\w*/), /\b(?:cut|cutting|remov|reduc|eliminat|clos)\w*.{0,20}\b(?:bus|transit|routes?|services?|clinic|stores?|schools?)/, 'Name a specific planning change and explain how it helps residents reach jobs, food, schools, or health care.', /without (?:long|far|having to|needing)\w*/],
    [/place where a cultural trait begins/, /\bhearths?\b/, /\b(?:diffusion|relocation|expansion)\b/, 'Name the term for a cultural trait’s place of origin: hearth.'],
    [/^describe one example of stimulus diffusion/, all(/\b(?:adapt|modif|chang|adjust|alter|fit|tailor|veggie|vegetarian|halal|kosher|local version|instead)\w*/, /\b(?:local|culture|cultural|religio|customs?|tastes?|preferences?|traditions?|hindu|muslim|india|country)\w*/, /\b(?:menu|food|mcdonald|restaurant|burger|pizza|toppings?|chain|franchise|brand|dish|drink|coffee|product|idea|holiday|sport|music|game|version|recipe|design|technology|alphabet|writing|fashion|clothing|style)\w*/), /\b(?:missionar|migrat|relocat|people move|unchanged|exactly the same|identical)\w*/, 'Give an example where the underlying idea spreads but is changed to fit the local culture.', /without beef|no beef|not (?:eat|serve) beef/],
    [/^explain how migration can spread culture/, any(/\b(?:migrants?|immigrants?|people|families|they|newcomers|refugees)\b.{0,70}\b(?:bring|brought|carry|carried|take|took|introduc|share|spread)\w*.{0,60}\b(?:language|religio|food|customs?|traditions?|music|holiday|cuisine|cloth|culture|cultural|beliefs?|practices?)\w*/, /\b(?:language|religio|food|customs?|traditions?|culture)\w*.{0,60}\b(?:spread|move|travel|diffuse)\w*.{0,40}\b(?:migra|people move|with them|immigra)\w*/), /\b(?:leave|abandon|stop|lose)\w*.{0,30}\b(?:culture|traditions?|language)|stops? culture/, 'Explain that migrants carry cultural traits (language, religion, food, customs) to new places where they can spread.'],
    [/globalization can speed up cultural diffusion/, all(/\b(?:internet|social media|media|tv|television|phones?|communicat|technolog|trade|travel|airplane|air travel|flights?|shipping|stream|corporation|tourism|online)\w*/, /\b(?:fast|quick|instant|rapid|speed|immediately|seconds|worldwide|around the world|long distances?|across)\w*/), /\b(?:slow|slower|delay|harder)\w*.{0,30}\b(?:diffusion|spread)|trade less/, 'Name a globalization mechanism (internet, media, trade, travel) and explain how it spreads traits faster or farther.'],
    [/lingua franca/, all(/\b(?:common|shared|same|second|bridge|english|one language)\b/, /\b(?:communicat|understand|talk|trade|business|negotiat|interact|exchange|cooperat)\w*/), /\b(?:prevent|block|stop|hinder|limit)\w*.{0,25}\b(?:communicat|interact|understand)\w*/, 'Explain how a shared language lets people with different first languages communicate, trade, or exchange ideas.'],
    [/effect of cultural diffusion on local cultures/, all(/\b(?:local|traditional|traditions?|indigenous|native|minority)\b/, /\b(?:lose|loss|lost|disappear|replac|weaken|declin|homogen|westerniz|americaniz|assimilat|diverse|diversity|blend|syncret|hybrid|fusion|mix|combine|revival|revive|alike|similar)\w*/, /\b(?:global|popular culture|pop culture|outside|foreign|new|western|american|chains?|media|brands?|tourist|immigra|migra|spread)\w*/), /\b(?:stay|remain)\w* exactly the same|\bunchanged\b/, 'Explain a specific effect on local culture, such as traditions being replaced or blended, and what causes it.'],

];})();
// Units 1–3 only. Browser-local practice; no network grading or answer analytics.
(function(){
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const checkpoints=[
 ['Name the concept for physical characteristics at a location.','Define location in relation to other places and connections.','Name a physical feature and describe how it supported early growth.','Connect transport links to an economic growth mechanism.','Contrast what regional and neighborhood analysis reveal.','Choose a specific GIS data layer and explain how comparisons reveal unequal access.','Name a planning action and explain how it improves access for underserved residents.'],
 ['Name an aging indicator and state its direction of change.','Compare the dependent population with the working-age population, in that order.','Describe one specific economic challenge associated with aging.','Explain what arriving working-age migrants do to available labor supply or vacancies.','Explain how a specific concern can create social or political tension.','Identify the model stage matching both low birth and low death rates.','Name a government policy and explain the mechanism by which it addresses aging; consider time delays.'],
 ['Name the geographic term for a cultural trait’s place of origin.','Define how movement of people carries a cultural trait to a new place.','Give a specific example of a spreading idea being adapted to local culture.','Explain how migrating people carry cultural traits to new places.','Name a connection mechanism and explain why it speeds or extends cultural spread.','Explain how a shared language supports interaction between different language groups.','Explain a specific change to local culture and connect it to incoming cultural influences.']
 ];
  const key='aphg-frq-guided-v1';
  let sessions={},storageAvailable=true;try{const saved=JSON.parse(sessionStorage.getItem(key)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))sessions=saved;}catch(e){storageAvailable=false;}
  if(Number.isInteger(sessions.lastPrompt)&&sessions.lastPrompt>=0&&sessions.lastPrompt<prompts.length)selectedPrompt=sessions.lastPrompt;
  const scoped=()=>prompts[selectedPrompt]?.unit<=3;
  const state=()=>{sessions.lastPrompt=selectedPrompt;return sessions[selectedPrompt]||(sessions[selectedPrompt]={draft:'',checks:{}});};
  const save=()=>{try{sessionStorage.setItem(key,JSON.stringify(sessions));}catch(e){storageAvailable=false;}};
  const baseGrade=window.__gradeFrqPart;
  window.__gradeFrqPart=function(part,text){
    const r=baseGrade(part,text);
    // Only Coach criteria in these three prompts receive the new presentation.
    if(!prompts.slice(0,3).some(p=>p.parts.some(x=>x[2]===part[2])))return r;
    r.outcome=r.earned?'verified':r.contradiction||r.status==='incorrect'||r.selfCheckLevel==='too-brief'?'not-yet':'review';
    const unit=prompts.slice(0,3).findIndex(p=>p.parts.some(x=>x[2]===part[2]));
    r.criterion=checkpoints[unit][part[0].charCodeAt(0)-65];
    r.feedback=r.earned?`Your response supplies the required concept or relationship for this practice criterion: ${r.criterion}`:
      r.contradiction?`Your explanation reverses or contradicts the geographic relationship. Check the direction of the effect. ${r.criterion}`:
      r.outcome==='not-yet'?`This response does not yet demonstrate the required idea. ${r.criterion}`:
      `This checker cannot confidently judge your wording. Compare your response with these requirements: ${r.criterion}`;
    return r;
  };
  const oldPage=window.frqPage,oldHtml=window.aiResultHtml,oldCheck=window.gradeWithAI;
  window.saveClassicFrqDraft=function(){
    if(scoped())return;
    const s=state();
    s.draft=answer;
    s.scaffold={...scaffoldAnswers};
    s.classicResult=aiResult;
    save();
  };
  window.frqGuidedDraft=function(value){state().draft=value;save();};
  window.frqGuidedCheck=function(letter,checked){state().checks[letter]=checked;save();};
  window.frqGuidedModels=function(){state().models=true;save();render();};
  window.frqGuidedSkip=function(){state().skipped=true;state().models=true;save();render();};
  window.frqGuidedNew=function(){delete sessions[selectedPrompt];save();render();};
  window.gradeWithAI=async function(){
    if(!scoped()){
      const s=state();
      const text=document.getElementById('mainAnswer')?.value||'';
      if(!text.trim())return oldCheck();
      s.draft=text;
      s.classicResult=localGradeFRQ(text,prompts[selectedPrompt]);
      save();
      render();
      return;
    }
    const s=state();if(s.revised||s.skipped)return;
    const text=document.getElementById('mainAnswer')?.value||s.draft;
    if(!text.trim()){alert('Write a labeled answer first.');return;}
    const result=localGradeFRQ(text,prompts[selectedPrompt]);
    if(!s.first){s.first={text,result};}else{s.revised={text,result};}
    s.draft=text;save();render();
  };
  let renderedPrompt;
  window.frqPage=function(){
    if(renderedPrompt!==selectedPrompt){
      showKey=false;
      visibleRewrite={};
      renderedPrompt=selectedPrompt;
    }
    if(!scoped()){
      const s=state();
      answer=s.draft;
      scaffoldAnswers=s.scaffold||{};
      aiResult=s.classicResult||null;
      save();
      return oldPage();
    }
    const p=prompts[selectedPrompt],s=state(),result=s.revised?.result||s.first?.result;
    aiResult=result||null;
    save();
    return `<main><section class="card"><h2>FRQ Coach · Unit ${p.unit}</h2>
      <p>Original Study Buddy practice rubric, aligned to AP content. This limited checker verifies evidence it recognizes; rubric review is separate from confirmed points.</p>
      <label for="guidedPrompt">Choose a prompt</label><select id="guidedPrompt" class="frq-select" onchange="selectedPrompt=Number(this.value);render()">${prompts.map((x,i)=>`<option value="${i}" ${i===selectedPrompt?'selected':''}>Unit ${x.unit}: ${esc(x.title)}</option>`).join('')}</select>
      <div class="scenario-box">${esc(p.scenario)}</div>
      <p>Label A–G. Identify: name it. Define: give its meaning. Describe: add a specific detail. Explain: connect a cause to its effect; no special connector word is required. Grammar is not scored.</p>
      ${p.parts.map((x,i)=>`<div class="frq-task-card"><p><b>${esc(x[0])}.</b> ${esc(x[2])}</p><div><b>Rubric — earn this point:</b> ${esc(checkpoints[p.unit-1][i])}</div></div>`).join('')}
      <label for="mainAnswer"><b>${s.first?'Revise your answer once using the feedback below':'Your first answer'}</b></label>
      <textarea id="mainAnswer" class="answer-textarea" oninput="frqGuidedDraft(this.value)" ${s.revised||s.skipped?'readonly':''}>${esc(s.draft)}</textarea>
      ${!s.revised&&!s.skipped?`<button class="btn-ai" onclick="gradeWithAI()">${s.first?'Check revision':'Check my answer'}</button>`:''}
      ${s.first&&!s.revised&&!s.skipped?'<button class="btn-secondary" onclick="frqGuidedSkip()">Skip revision and compare models</button>':''}
      <p>${storageAvailable?'Your work is kept in this browser tab for refresh and navigation. Closing the tab clears it.':'This browser could not save your session. Copy your work before refreshing or leaving.'} Do not include names or personal details.</p>
      </section><section class="card" id="feedbackArea">${result?window.aiResultHtml(result):'<p>Submit your first answer to get feedback before seeing models.</p>'}</section><section class="card"><details><summary>Single-point practice drills</summary>${drillHtml()}</details></section></main>`;
  };
  window.aiResultHtml=function(result){
    if(!scoped())return oldHtml(result);
    const s=state(),done=!!(s.revised||s.skipped),first=s.first;
    return `<div class="ai-result"><div class="score-circle">${result.score}<small>/${result.total}</small></div><h3>Locally verified: ${result.score}/${result.total}</h3>
      <p>Verified points are a lower bound, not necessarily your final rubric score. Student self-checks never award verified credit.</p>
      ${first?`<p>First attempt: ${first.result.score}/${result.total} verified points</p><details><summary>Read original submission</summary><pre style="white-space:pre-wrap;overflow-wrap:anywhere">${esc(first.text)}</pre></details>`:''}
      ${s.revised?`<p>After revision: ${result.score}/${result.total} verified points · Change: ${result.score-first.result.score>=0?'+':''}${result.score-first.result.score} verified points</p><p>A higher practice score alone does not demonstrate independent learning.</p>`:''}
      <p>Needs rubric review: ${result.parts.filter(p=>p.outcome==='review').map(p=>p.letter).join(', ')||'None'}.</p>
      ${result.parts.map(p=>`<div class="part-result"><b>Part ${esc(p.letter)}: ${p.outcome==='verified'?'1/1 — Verified point':p.outcome==='not-yet'?'Not yet demonstrated':'Needs rubric review'}</b><p>${esc(p.feedback)}</p>
      ${p.outcome==='review'?`<label><input type="checkbox" ${s.checks[p.letter]?'checked':''} onchange="frqGuidedCheck('${p.letter}',this.checked)"> Self-check only: I compared my claim and required details or causal relationship with this criterion.</label>`:''}
      ${s.models?`<details class="part-fix"><summary>Compare a model for ${p.letter}</summary><b>Strong rewrite/model:</b><p>${esc(p.fix)}</p></details>`:''}</div>`).join('')}
      ${done&&!s.models?'<button class="btn-secondary" onclick="frqGuidedModels()">Compare model answers</button>':''}
      ${done?'<button class="btn-secondary" onclick="frqGuidedNew()">Start a new practice attempt</button>':''}</div>`;
  };
})();

// Original, one-point lessons. The student decides the score on this device.
(function(){
  const lessons={
    devolution:{
      unit:4,title:'Regional identity and devolution',
      question:prompts[3].parts[3][2],
      scenario:prompts[3].scenario,
      hint:'What might people in the region want to decide for themselves?',
      criteria:['Point to a specific feature of regional identity, such as a shared language.',
        'Show how that feature motivates people to demand power over a decision from the central government.'],
      diagnostic:'Where does your answer show what people want to control and why their regional identity motivates that demand?',
      examples:[
        ['Families want schools to teach in their regional language. They press the central government to give the region control over education.',1,'“Teach in their regional language” gives the motive. “Give the region control over education” explains the demand for power.'],
        ['The region has its own language.',0,'This identifies a cultural difference. Add why it makes people demand control over a decision.'],
        ['The regional language creates devolution because it makes the country more united under the central government.',0,'Greater unity under the central government does not explain a demand for regional authority. Show how identity motivates local control.']
      ],
      transfer:{
        scenario:'A mountain province has a distinct cultural identity and a tradition of managing its communal forests. A national agency takes over forest decisions, and a regional party begins campaigning.',
        question:'Explain how the province’s regional identity could lead to a demand for devolution.',
        model:'Residents see local forest management as part of their identity, so they support a party that wants forest decisions returned to the provincial government.',
        criteria:['Name the province’s tradition of managing its forests or another relevant detail from the scenario.',
          'Explain why people want forest decisions moved from the national agency to a regional government.']
      }
    },
    pyramid:{
      unit:2,title:'Population pyramid and demographic consequences',
      chart:true,
      question:'Using the population pyramid, explain one consequence of the age structure for public services or the labor force.',
      hint:'Compare the bars near the youngest ages with bars near the top. Who might need more services or enter the workforce later?',
      criteria:['Cite a visible age pattern, such as ages 60–79 having wider bars than ages 0–19.',
        'Explain how that pattern could change service demand or the labor force, such as growing demand for elder care.'],
      diagnostic:'Which age bars support your claim, and how would their size change demand for a service or the number of future workers?',
      examples:[
        ['The bars for people in their 60s and 70s are wider than the bars for the youngest age groups. More older residents could mean more demand for elder care.',1,'Names the visible age groups and connects the larger older cohorts to demand for elder care.'],
        ['The bars for ages 60–79 are wider than the bars for ages 0–19.',0,'This describes the source. Add a consequence and explain why the pattern could produce it.'],
        ['The wide bars near the top mean there are more children, so the country needs more primary schools.',0,'The labels show older people near the top. Check which ages the bars represent before linking them to a service.']
      ],
      transfer:{
        chart:true,
        question:'Using the new population pyramid, explain one consequence of the age structure for public services or the labor force.',
        model:'The youngest age groups have wider bars than the older age groups. More children will enter school, increasing demand for classrooms and teachers.',
        criteria:['Cite the wide younger bars, such as ages 0–19 compared with ages 60–79.',
          'Explain a plausible consequence, such as larger young cohorts increasing demand for schools or later increasing the number of people entering the labor force.']
      }
    }
  };

  const key='aphg-frq-self-score-v1';
  const escape=value=>htmlEscape(String(value??''));
  let saved={}, canSave=true, lessonId=null;
  try{saved=JSON.parse(sessionStorage.getItem(key)||'{}')||{};}catch(e){canSave=false;}
  const save=()=>{try{sessionStorage.setItem(key,JSON.stringify(saved));}catch(e){canSave=false;}};
  const getState=()=>saved[lessonId]??={step:0,examples:{},draft:'',revision:'',transfer:'',evidence:{},scores:{}};
  const labels=['Write','Score examples','Score my answer','Revise','Try a new question'];
  const scores={'1':'1 point','0':'0 points',unsure:'I’m unsure'};
  const button=(action,label,value='')=>`<button type="button" class="btn-secondary" data-frq-pilot-action="${action}" data-value="${value}">${label}</button>`;
  const field=(id,label,value)=>`<label for="pilot-${id}"><b>${label}</b></label><textarea id="pilot-${id}" class="answer-textarea" data-frq-pilot-field="${id}">${escape(value)}</textarea>`;
  const quote=text=>`<p style="white-space:pre-wrap;overflow-wrap:anywhere">${escape(text||'(Blank)')}</p>`;
  function task(item, transfer){
    const chart=item.chart?APHGPopulationPyramid(!transfer).replace(/Illustrative (?:aging|youthful) age-sex pyramid/, 'Illustrative age-sex pyramid'):'';
    return `${chart}${item.scenario?`<p>${escape(item.scenario)}</p>`:''}<p><b>${escape(item.question)}</b></p>`;
  }

  function selfScore(s, lesson, response, attempt){
    const item=attempt==='transfer'?lesson.transfer:lesson;
    const value=s.scores[attempt];
    const writing=attempt==='draft'?(s.original??s.draft):s[attempt];
    const example=attempt==='transfer'?lesson.transfer.model:lesson.examples[0][0];
    const diagnostic=attempt==='transfer'?'Which detail from this new source supports your claim, and where do you explain what it causes?':lesson.diagnostic;
    return `<p><b>What earns the point</b></p><ul>${item.criteria.map(c=>`<li>${escape(c)}</li>`).join('')}</ul>
      ${field(response,'Copy the words that satisfy the checklist, or name the part that is missing.',s.evidence[attempt])}
      <div class="button-row">${Object.entries(scores).map(([score,label])=>button('score',label,`${attempt}:${score}`)).join('')}</div>
      ${value!==undefined?`<p role="status"><b>Self-scored practice · ${scores[value]}</b></p>`:''}
      ${value==='unsure'?`<div class="box-info"><p>${escape(diagnostic)}</p>
        <p><b>Compare a 1-point example</b></p>${quote(example)}</div>`:''}
      ${!writing.trim()?'<p>A blank response earns 0 points.</p>':''}`;
  }

  function showLesson(){
    const lesson=lessons[lessonId],s=getState();
    const title=`<div class="button-row">${button('exit','Back to FRQ Coach')}</div>
      <h2 tabindex="-1" id="pilot-title">Unit ${lesson.unit} · ${lesson.title}</h2>
      <p>Step ${s.step+1} of 5 · <b>${labels[s.step]}</b></p>`;
    let content;
    if(s.step===0){
      content=`${task(lesson,false)}<p><b>Explain</b> means show how one thing leads to another.</p>
        ${field('draft','Your first answer',s.draft)}${s.hint?`<p class="box-info">${escape(lesson.hint)}</p>`:button('hint','I’m stuck')}
        ${button('advance','Score examples')}`;
    }else if(s.step===1){
      const index=s.exampleIndex??0;
      const [example,score,why]=lesson.examples[index];
      const chosen=s.examples[index];
      content=`${task(lesson,false)}<h3>Example ${index+1} of 3</h3>${quote(example)}
        ${chosen===undefined?`<div class="button-row">${button('example','Earns the point','1')}${button('example','Doesn’t earn the point','0')}</div>`:
        `<div class="box-info" role="status"><b>${score} / 1 point</b><p>${escape(why)}</p></div>${button(index<2?'next-example':'advance',index<2?'Next example':'Score my answer')}`}`;
    }else if(s.step===2){
      content=`${task(lesson,false)}<h3>Your first answer</h3>${quote(s.original)}
        ${selfScore(s,lesson,'draft-evidence','draft')}${s.scores.draft!==undefined?button('advance','Revise my answer'):''}`;
    }else if(s.step===3){
      content=`${task(lesson,false)}<details><summary>Read your first answer</summary>${quote(s.original)}</details>
        ${field('revision','Your revised answer',s.revision)}
        ${selfScore(s,lesson,'revision-evidence','revision')}${s.scores.revision!==undefined?button('advance','Try a new question'):''}`;
    }else{
      content=`${task(lesson.transfer,true)}
        ${s.transferSubmitted?`<h3>Your new answer</h3>${quote(s.transfer)}${selfScore(s,lesson,'transfer-evidence','transfer')}`:
        `${field('transfer','Your answer to the new question',s.transfer)}${button('submit-transfer','Check against the rubric')}`}
        ${s.scores.transfer!==undefined?`<p><b>First answer:</b> ${scores[s.scores.draft]}. <b>Revision:</b> ${scores[s.scores.revision]}. <b>New question:</b> ${scores[s.scores.transfer]}.</p>
        <p>${s.hint?'You used a hint on the first question.':'You opened no hints on the first question.'} You wrote the new answer before opening its rubric.</p>`:''}`;
    }
    return `<main><section class="card" id="frq-pilot">${title}${content}
      <p>${canSave?'This tab keeps your practice during refresh.':'This tab could not save your practice for refresh.'} Leave names and personal details out of your answer.</p></section></main>`;
  }

  function pilotLinks(){
    return `<section class="card" aria-label="FRQ self-scoring lessons"><h3>Learn to score one FRQ point</h3>
      <div class="button-row">${button('open','Unit 2 · Population pyramid','pyramid')}${button('open','Unit 4 · Devolution','devolution')}</div></section>`;
  }
  const coachPage=window.frqPage;
  window.frqPage=()=>lessonId?showLesson():coachPage().replace(/(<main[^>]*>)/,'$1'+pilotLinks());
  window.openFrqSelfScore=id=>{
    if(!Object.hasOwn(lessons,id))return;
    lessonId=id;
    saved.lastLesson=id;
    save();
    go('frq');
    document.getElementById('pilot-title')?.focus();
  };
  if(Object.hasOwn(lessons,saved.lastLesson))lessonId=saved.lastLesson;

  document.addEventListener('input',event=>{
    const field=event.target.dataset.frqPilotField;
    if(!lessonId||!field)return;
    const s=getState();
    if(field.endsWith('-evidence'))s.evidence[field.replace('-evidence','')]=event.target.value;
    else{
      s[field]=event.target.value;
      if(field==='revision'&&s.scores.revision!==undefined){
        delete s.scores.revision;
        const next=document.querySelector('#frq-pilot [data-frq-pilot-action="advance"]');
        next?.remove();
        document.querySelector('#frq-pilot [role="status"]')?.remove();
      }
    }
    save();
  });

  document.addEventListener('click',event=>{
    const control=event.target.closest('button[data-frq-pilot-action]');
    if(!control)return;
    const {frqPilotAction:action,value}=control.dataset;
    if(action==='open'){window.openFrqSelfScore(value);return;}
    if(!lessonId)return;
    const s=getState();
    switch(action){
      case 'exit': lessonId=null;delete saved.lastLesson;break;
      case 'hint': s.hint=true;break;
      case 'example': s.examples[s.exampleIndex??0]=value;break;
      case 'next-example': s.exampleIndex=(s.exampleIndex??0)+1;break;
      case 'advance':
        if(s.step===0)s.original=s.draft;
        if(s.step===2)s.revision=s.original;
        s.step++;
        break;
      case 'score': {
        const [attempt,score]=value.split(':');
        const writing=attempt==='draft'?s.original:s[attempt];
        s.scores[attempt]=score==='1'&&!writing.trim()?'0':score;
        break;
      }
      case 'submit-transfer': s.transferSubmitted=true;break;
    }
    save();
    render();
    document.getElementById('pilot-title')?.focus();
  });
})();
