// Freshman usability fixes found during the PR #9 student walkthrough.
(function(){
  if(window.__freshmanFixesV2Installed)return;
  window.__freshmanFixesV2Installed=true;

  // Keep the seven destinations a student needs most. Specialized labs remain
  // reachable from the home and mastery pages.
  if(typeof tabs!=='undefined'){
    const wanted=['home','unitReview','unitMasteryAll','practiceMastery','mastery','terms','frq'];
    const available=new Map(tabs.map(t=>[t[0],t]));
    const simplified=wanted.map(k=>available.get(k)).filter(Boolean);
    tabs.splice(0,tabs.length,...simplified);
  }

  // Make the AP Mastery snapshot recognize work completed in Unit Review and
  // Practice & Mastery, not only the original quiz screen.
  if(typeof getMasterySnapshot==='function'){
    const oldSnapshot=getMasterySnapshot;
    getMasterySnapshot=function(){
      const snap=oldSnapshot()||{attempted:0,accuracy:0,weak:null,flashNeed:0};
      try{
        const shared=JSON.parse(localStorage.getItem('aphgTopicSkillMasteryV1')||'{"topics":{}}');
        const rows=Object.values(shared.topics||{}).filter(x=>x&&x.attempts);
        const attempted=rows.reduce((n,x)=>n+(x.attempts||0),0);
        const correct=rows.reduce((n,x)=>n+(x.correct||0),0);
        if(attempted>=(snap.attempted||0)){
          snap.attempted=attempted;
          snap.accuracy=attempted?Math.round(correct/attempted*100):0;
        }
        const weak=window.APHGTopicSkillMastery?.weakTopics(1)?.[0];
        if(weak)snap.weak={unit:weak.unit,name:`Topic ${weak.topic}: ${weak.label}`,topic:weak.topic,topicName:weak.label,mastery:weak.mastery};
      }catch(e){}
      return snap;
    };
  }

  function polish(){
    // Always state the correct answer after a miss.
    document.querySelectorAll('.box-warn b').forEach(label=>{
      if(!/^Not yet/.test(label.textContent)||/correct answer/i.test(label.textContent))return;
      const card=label.closest('.card'),correct=card&&card.querySelector('.quiz-option.correct');
      if(correct)label.textContent='Not yet — the correct answer is '+correct.textContent.replace(/^[A-D]\.\s*/,'')+'.';
    });

    // Show only the currently selected unit's topic list.
    document.querySelectorAll('.card').forEach(card=>{
      const heading=card.querySelector('h3');
      if(!heading||heading.textContent.trim()!=='Progress by Topic')return;
      const unit=Number(document.querySelector('select')?.value||1);
      heading.textContent=`Unit ${unit} Progress by Topic`;
      card.querySelectorAll('.readiness-tile').forEach(tile=>{
        const m=tile.textContent.match(/Topic\s+(\d+)\./);
        if(m)tile.style.display=Number(m[1])===unit?'':'none';
      });
    });
    document.querySelectorAll('.card').forEach(card=>{
      const h=card.querySelector('h2');
      if(!h||h.textContent.trim()!=='Your Progress')return;
      const unit=Number(document.querySelector('select')?.value||1);
      h.textContent=`Your Unit ${unit} Progress`;
      const p=card.querySelector('p');
      if(p)p.textContent='“Ready” means at least five attempts, 80% correct, two correct in a row, and successful practice on two different days.';
    });

    // Give a manageable next vocabulary set instead of a discouraging total.
    document.querySelectorAll('.mastery-tile').forEach(tile=>{
      const span=tile.querySelector('span');
      if(!span||span.textContent.trim()!=='Vocab cards not mastered')return;
      const b=tile.querySelector('b'),p=tile.querySelector('p');
      if(b)b.textContent='10';
      span.textContent='vocab cards in your next set';
      if(p)p.textContent='Study a small set, then come back for another.';
    });

    // Explain the goal without implying that specific connector words are required.
    document.querySelectorAll('.box-yellow').forEach(box=>{
      if(!/Point recipe/.test(box.textContent))return;
      const p=box.querySelector('p');
      if(p)p.innerHTML='Answer the task directly. Clearly connect a cause to its effect. Words such as <b>because</b> or <b>therefore</b> can help, but they are not required. Include a specific APHG concept or consequence.';
    });
  }

  if(typeof render==='function'){
    const oldRender=render;
    render=function(){const value=oldRender();polish();return value;};
  }
  polish();
  if(typeof render==='function')render();
})();
