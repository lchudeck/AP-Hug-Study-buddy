// Fix for quiz reflection buttons: provide visible feedback and save the selected reason.
(function(){
  window.logReason=function(reason){
    try{
      localStorage.setItem('aphgLastWrongReason', reason);
      const reflection=document.querySelector('.reflection');
      if(!reflection) return;
      let feedback=reflection.querySelector('.reflection-feedback');
      if(!feedback){
        feedback=document.createElement('div');
        feedback.className='box-good reflection-feedback';
        feedback.style.marginTop='10px';
        reflection.appendChild(feedback);
      }
      feedback.innerHTML=`<b>Got it — ${reason}.</b><br>Use the explanation above, then rewrite the correct idea in your own words below.`;
      reflection.querySelectorAll('.why-btn').forEach(btn=>{
        btn.classList.toggle('active', btn.textContent.trim().toLowerCase().includes(reason.toLowerCase().replace('did not know the vocabulary','didn\'t know the vocab').replace('confused two concepts','confused two concepts').replace('misread the question','misread the question').replace('guessed','guessed')));
      });
    }catch(e){
      console.warn('Could not save reflection reason',e);
    }
  };
})();