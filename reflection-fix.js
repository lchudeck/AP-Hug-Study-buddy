// PR #6: reliable wrong-answer reflection buttons.
(function(){
  const STORE='aphgLastWrongReason';
  const messages={
    'Did not know the vocabulary':'📖 Good diagnosis. Review the key term, then explain the correct answer in your own words below.',
    'Confused two concepts':'🔀 Compare the two concepts: write one difference between them before moving on.',
    'Misread the question':'👀 Re-read the task words and underline what the question is actually asking before you retry.',
    'Guessed':'🎯 Use the explanation above to identify the clue you should look for next time.'
  };
  function apply(reason,button){
    try{localStorage.setItem(STORE,reason);}catch(e){}
    const reflection=(button&&button.closest('.reflection'))||document.querySelector('.reflection');
    if(!reflection) return;
    reflection.querySelectorAll('.why-btn').forEach(btn=>{
      btn.classList.toggle('active',btn===button);
      btn.setAttribute('aria-pressed',btn===button?'true':'false');
      btn.style.fontWeight=btn===button?'800':'';
      btn.style.outline=btn===button?'3px solid rgba(37,99,235,.25)':'';
    });
    let feedback=reflection.querySelector('.reflection-feedback');
    if(!feedback){feedback=document.createElement('div');feedback.className='box-good reflection-feedback';feedback.style.marginTop='10px';reflection.appendChild(feedback);}
    feedback.innerHTML=`<b>Selected: ${reason}</b><br>${messages[reason]||'Use the explanation above, then rewrite the correct idea in your own words below.'}`;
    feedback.scrollIntoView({block:'nearest',behavior:'smooth'});
  }
  // Keep inline onclick calls working.
  window.logReason=function(reason){
    const buttons=[...document.querySelectorAll('.reflection .why-btn')];
    const button=buttons.find(b=>{
      const t=b.textContent.toLowerCase();
      if(reason==='Did not know the vocabulary')return t.includes("didn't know");
      if(reason==='Confused two concepts')return t.includes('confused');
      if(reason==='Misread the question')return t.includes('misread');
      if(reason==='Guessed')return t.includes('guessed');
      return false;
    });
    apply(reason,button);
  };
  // Also bind directly through event delegation, so this still works if inline handlers are blocked or re-rendered.
  document.addEventListener('click',function(e){
    const b=e.target.closest('.reflection .why-btn');
    if(!b)return;
    e.preventDefault();
    const t=b.textContent.toLowerCase();
    const reason=t.includes("didn't know")?'Did not know the vocabulary':t.includes('confused')?'Confused two concepts':t.includes('misread')?'Misread the question':'Guessed';
    apply(reason,b);
  },true);
})();