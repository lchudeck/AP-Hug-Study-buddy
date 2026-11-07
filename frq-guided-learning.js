// Bounded Unit 1 and 3 rules reused from PR #71; no other PR changes included.
(function(){const all=(...g)=>({test:s=>g.every(r=>r.test(s))}),any=(...g)=>({test:s=>g.some(r=>r.test(s))});
window.__frqGuidedRules=[
    [/physical characteristics of the city's location/, /(?:^|\s)site(?:\s|$)/, /situation|absolute|relative/, 'Name the concept for a place’s physical characteristics: site.'],
    [/^describe one way the city's site/, any(/\b(?:rivers?|water|confluence|fertile|soil|floodplain|harbou?r|port)\b.{0,90}\b(?:drink|irrigat|farm|crops?|food|fish|transport|trade|ship|boat|barge|travel|settl|grow|power|mill|defen)\w*/, /\b(?:settl|farm|grow|trade|travel|ship)\w*.{0,60}\b(?:rivers?|water|fertile|soil|harbou?r)\b/), /\b(?:interstate|highway|railroad|rail line)\b|\b(?:kept|keep|keeps|prevent|stopp?ed|discourag|hard|harder|difficult)\w*.{0,30}\b(?:settl|farm|grow|trade)/, 'Describe a physical feature of the site (such as the rivers) and how it supported settlement, farming, water supply, or trade.'],
    [/^explain how the city's situation helped it grow/, any(/\b(?:interstate|highway|rail|railroad|train|transport|connect|hub|access|link)\w*.{0,100}\b(?:trade|markets?|business|compan|jobs?|workers?|goods|ship|customers?|investment|industr|factor|warehouse)\w*/, /\b(?:business|compan|industr|factor|warehouse)\w*.{0,60}\b(?:locat|mov|came|attract|chose|built|open)\w*.{0,60}\b(?:interstate|highway|rail|transport|hub|connect)\w*/), /\b(?:harder|less|reduc|decreas|fewer|isolat|cut off|block)\w*.{0,30}\b(?:trade|markets?|access|business)/, 'Connect the highway and rail links (situation) to trade, market access, businesses, or jobs.'],
    [/scale of analysis from regional to local/, all(/\b(?:regional|region|broad|large|larger|bigger|whole|national|overall)\b/, /\b(?:local|neighbou?rhoods?|smaller|small|street|block)\b/, /\b(?:differen|inequal|unequal|variation|detail|hidden|hide|mask|reveal|miss|specific|services|access|fewer)\w*/), /\b(?:local|neighbou?rhood)\w* (?:scale |level |map )?(?:hides|hide|masks?|obscures?)|\blocal (?:maps?|scale|analysis).{0,30}(?:fewer|less) (?:details?|information)\b/, 'Contrast what the regional scale shows (broad connections) with what the local scale reveals (neighborhood differences).'],
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
  if(Number.isInteger(sessions.lastPrompt)&&sessions.lastPrompt>=0&&sessions.lastPrompt<3)selectedPrompt=sessions.lastPrompt;
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
  window.frqGuidedDraft=function(value){state().draft=value;answer=value;save();};
  window.frqGuidedCheck=function(letter,checked){state().checks[letter]=checked;save();};
  window.frqGuidedModels=function(){state().models=true;save();render();};
  window.frqGuidedSkip=function(){state().skipped=true;state().models=true;save();render();};
  window.frqGuidedNew=function(){delete sessions[selectedPrompt];answer='';aiResult=null;save();render();};
  window.gradeWithAI=async function(){
    if(!scoped())return oldCheck();
    const s=state();if(s.revised||s.skipped)return;
    const text=document.getElementById('mainAnswer')?.value||s.draft;
    if(!text.trim()){alert('Write a labeled answer first.');return;}
    const result=localGradeFRQ(text,prompts[selectedPrompt]);
    if(!s.first){s.first={text,result};}else{s.revised={text,result};}
    s.draft=text;answer=text;aiResult=result;save();render();
  };
  window.frqPage=function(){
    if(!scoped())return oldPage();
    const p=prompts[selectedPrompt],s=state(),result=s.revised?.result||s.first?.result;
    answer=s.draft;aiResult=result||null;
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
