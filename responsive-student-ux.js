// PR #6: responsive safeguards for phone and Chromebook use.
(function(){
  if(window.__responsiveStudentUxInstalled)return;window.__responsiveStudentUxInstalled=true;
  const style=document.createElement('style');
  style.textContent=`
  #nav{overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:thin;display:flex;flex-wrap:nowrap;gap:6px;padding-bottom:6px}
  #nav button{flex:0 0 auto;min-height:44px}
  button,.quiz-option,.choice-btn,.filter-btn{min-height:42px}
  textarea,input,select{max-width:100%;box-sizing:border-box}
  .answer-textarea{width:100%;font-size:16px}
  @media(max-width:760px){
    .hero{align-items:flex-start!important;gap:12px}.exam-badge{min-width:0!important}
    .grid2,.grid3col,.model-card-grid,.home-cta-grid{grid-template-columns:1fr!important}
    aside>div[style*="sticky"]{position:static!important}
    .readiness-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
    .button-row,.filter-row{gap:7px}.button-row button,.filter-row button{flex:1 1 140px}
    .card{padding:14px!important}.wrap{padding-left:10px!important;padding-right:10px!important}
    h1{font-size:clamp(28px,9vw,42px)!important}h2{overflow-wrap:anywhere}
  }
  @media(max-width:420px){.readiness-grid{grid-template-columns:1fr!important}.button-row button,.filter-row button{width:100%;flex-basis:100%}}
  `;
  document.head.appendChild(style);
})();