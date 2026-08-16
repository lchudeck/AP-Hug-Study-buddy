// Classroom-launch guidance and student-controlled local progress.
(function(){
  if(window.__schoolReadyInstalled || typeof homePage!=='function') return;
  window.__schoolReadyInstalled=true;
  const previousHome=homePage;

  window.clearStudyBuddyProgress=function(){
    if(!confirm('Clear all Study Buddy progress saved in this browser? This cannot be undone.')) return;
    const keys=[];
    for(let i=0;i<localStorage.length;i++) keys.push(localStorage.key(i));
    keys.filter(k=>k&&/^aphg/i.test(k)).forEach(k=>localStorage.removeItem(k));
    alert('Study Buddy progress has been cleared from this browser.');
    location.reload();
  };

  homePage=function(){
    const html=previousHome();
    const guide=`
      <section class="card school-ready-card" aria-labelledby="student-start-title">
        <span class="pill">New student</span>
        <h2 id="student-start-title">Your first 5 minutes</h2>
        <ol class="student-start-steps">
          <li>Choose <b>Study for my next unit test</b>.</li>
          <li>Select the unit your class is learning.</li>
          <li>Try the <b>10-question quick diagnostic</b>.</li>
          <li>Read every explanation, including the wrong-answer explanations.</li>
          <li>Use your results to practice the topics below 70%.</li>
        </ol>
        <div class="privacy-promise">
          <div><b>Private by default</b><span>No account or real identity is requested. Progress stays in this browser's local storage and is not a class grade.</span></div>
          <div><b>Use the same device</b><span>Your progress will not follow you to another laptop. Clearing browser data also clears your progress.</span></div>
        </div>
        <div class="button-row school-ready-actions">
          <button class="btn-primary" onclick="go('unitReview')">Start a 10-question diagnostic</button>
          <a class="btn btn-secondary" href="privacy.html">Read privacy &amp; classroom use</a>
          <button class="btn-secondary" onclick="clearStudyBuddyProgress()">Clear my saved progress</button>
        </div>
      </section>`;
    return html.replace('</main>',guide+'</main>');
  };
})();
