// Freshman UX guard: fix first-use trust issue and a malformed Unit 1 source table.
(function(){
 if(window.__freshmanUxGuardV1)return; window.__freshmanUxGuardV1=true;

 const fixedScaleStimulus=`<div class="real-data-stimulus"><h4>Geographic units used for population analysis</h4><table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left">Geographic unit</th><th style="text-align:right">Scale of analysis</th></tr></thead><tbody><tr><td>United States</td><td style="text-align:right">National</td></tr><tr><td>Washington State</td><td style="text-align:right">State</td></tr><tr><td>King County</td><td style="text-align:right">County</td></tr><tr><td>Seattle</td><td style="text-align:right">City / local</td></tr></tbody></table><p class="source-note"><b>Source:</b> U.S. Census Bureau geographic units used for Decennial Census / ACS analysis. This stimulus is for scale-analysis practice and does not imply identical population shares across the nested geographies.</p></div>`;

 // Repair the Unit 1 authentic-source set before students see the malformed string-indexed values.
 try{
   const sets=window.APHG_AUTHENTIC_STIMULUS_SETS||[];
   const s=sets.find(x=>x.id==='u1-census-scale');
   if(s)s.stimulus=fixedScaleStimulus;
   (window.APHG_AUTHENTIC_STIMULUS_QUESTIONS||[]).forEach(q=>{if(q.setId==='u1-census-scale')q.stimulus=fixedScaleStimulus;});
   (window.APHG_AUTHENTIC_CLUSTER_QUESTIONS||[]).forEach(q=>{if(q.setId==='u1-census-scale')q.stimulus=fixedScaleStimulus;});
   if(typeof quiz!=='undefined')quiz.forEach(q=>{if(q&&q.stimulusTitle==='Population at Different Scales')q.stimulus=fixedScaleStimulus;});
 }catch(e){}

 function hasEvidence(){
   try{
     const a=JSON.parse(localStorage.getItem('aphgTopicSkillMasteryV1')||'{"topics":{}}');
     if(Object.values(a.topics||{}).some(x=>x&&x.attempts>0))return true;
   }catch(e){}
   try{
     const a=JSON.parse(localStorage.getItem('aphgAdaptiveCoachV2')||'{"topics":{}}');
     if(Object.values(a.topics||{}).some(x=>x&&x.attempts>0))return true;
   }catch(e){}
   try{
     const a=JSON.parse(localStorage.getItem('aphgPracticeMasteryV4')||'{}');
     if(Object.values(a||{}).some(x=>x&&x.total>0))return true;
   }catch(e){}
   return false;
 }

 // A brand-new student should never be told an arbitrary topic is weak before the app has evidence.
 if(typeof apMasteryPage==='function'){
   const oldMastery=apMasteryPage;
   apMasteryPage=function(){
     let html=oldMastery();
     if(typeof masteryView!=='undefined'&&masteryView==='dashboard'&&!hasEvidence()){
       const card=`<section class="card" style="margin-top:16px"><h2>🧭 Start here</h2><p>Study Buddy does not know your weak spots yet—and it will not guess.</p><div class="box-info"><b>First mission: build a baseline.</b><p>Answer a short mix of AP Human Geography questions. It is okay to miss them. Your answers give Study Buddy enough evidence to choose the right CED topics and skills for your next session.</p></div><div class="mastery-actions"><button class="btn-primary" onclick="startAdaptiveQuiz()">Start baseline practice</button><button class="btn-secondary" onclick="openStimulusFrqLab()">Try a stimulus FRQ instead</button></div></section>`;
       html=html.replace(/<section class="card" style="margin-top:16px"><h2>🧭 Do this next<\/h2>[\s\S]*?<\/section>/,card);
     }
     return html;
   };
 }

 if(typeof personalizedPlanItems==='function'){
   const oldPlan=personalizedPlanItems;
   personalizedPlanItems=function(){
     if(!hasEvidence())return [
       {tag:'1. Build a baseline',text:'Answer a short mix of questions. Missing some is useful—it helps Study Buddy diagnose what to teach next.'},
       {tag:'2. Read the why',text:'After each answer, read the explanation instead of rushing to the next question.'},
       {tag:'3. Come back',text:'Once Study Buddy has evidence, this plan will switch from general practice to your exact CED topics and AP skills.'}
     ];
     return oldPlan();
   };
 }
})();