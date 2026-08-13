// PR #6: simple ninth-grade-first home screen.
(function(){
  if(window.__homeClarityInstalled || typeof homePage!=='function') return;
  window.__homeClarityInstalled=true;

  homePage=function(){
    let snap={accuracy:null,attempted:0,weak:null};
    try{ if(typeof getMasterySnapshot==='function') snap=getMasterySnapshot()||snap; }catch(e){}
    const accuracy=Number.isFinite(snap.accuracy)?`${Math.round(snap.accuracy)}%`:'Not enough practice yet';
    const weak=snap.weak?`Unit ${snap.weak.unit}: ${snap.weak.name}`:'Complete a quick practice set and we’ll find it.';
    return `<main class="wrap">
      <section class="card home-choice-card">
        <h2>What do you want to do today?</h2>
        <p class="lead">Choose the one that matches what you are studying for. You can always switch later.</p>
        <div class="path-grid home-choice-grid">
          <button class="path-card path-green" onclick="go('unitReview')">
            <b>📚 Study for my next unit test</b>
            <p>Review one unit, vocabulary, models, and take a 35-question practice test.</p>
          </button>
          <button class="path-card path-yellow" onclick="go('practiceMastery')">
            <b>🎯 Practice what I’m struggling with</b>
            <p>Do short practice, review mistakes, and strengthen weak CED topics.</p>
          </button>
          <button class="path-card path-red" onclick="go('apSim')">
            <b>🏆 Prepare for the AP Exam</b>
            <p>Use mixed-unit AP-style practice after you have learned several units.</p>
          </button>
        </div>
        <div class="box-info" style="margin-top:16px"><b>Not sure?</b> If you have a class test coming up, choose <b>Study for my next unit test</b>.</div>
      </section>

      <section class="card">
        <h2>My Progress</h2>
        <p>This is a quick snapshot, not a grade. Practice updates it on this device.</p>
        <div class="readiness-grid">
          <div class="readiness-tile"><b>${accuracy}</b><span>recent practice accuracy</span></div>
          <div class="readiness-tile"><b>${snap.attempted||0}</b><span>questions practiced</span></div>
          <div class="readiness-tile"><b>${weak}</b><span>recommended review</span></div>
        </div>
        <div class="button-row" style="margin-top:14px"><button class="btn-primary" onclick="go('practiceMastery')">Show me what to practice next</button></div>
      </section>

      <section class="card">
        <h3>Need vocabulary or FRQ help?</h3>
        <div class="button-row">
          <button class="btn-secondary" onclick="go('terms')">📖 Vocabulary & Flashcards</button>
          <button class="btn-secondary" onclick="go('frq')">✍️ FRQ Coach</button>
          <button class="btn-secondary" onclick="go('visual')">🗺️ Visual Lab</button>
        </div>
      </section>
    </main>`;
  };
})();