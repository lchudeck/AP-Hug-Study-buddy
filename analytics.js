// Privacy-conscious Google Analytics 4 setup for AP Study Buddy.
(function(){
  if(window.__studyBuddyAnalyticsInstalled) return;
  window.__studyBuddyAnalyticsInstalled=true;

  const MEASUREMENT_ID='G-2YRFGT5QNH';
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};

  // Aggregate usage only: no advertising profile, no typed student work.
  window.gtag('consent','default',{
    ad_storage:'denied',
    ad_user_data:'denied',
    ad_personalization:'denied',
    analytics_storage:'granted'
  });
  window.gtag('js',new Date());
  window.gtag('config',MEASUREMENT_ID,{
    allow_google_signals:false,
    allow_ad_personalization_signals:false,
    page_location:location.origin+location.pathname,
    page_title:document.title
  });

  const script=document.createElement('script');
  script.async=true;
  script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(MEASUREMENT_ID);
  document.head.appendChild(script);

  // Only allow a small, structured set of non-PII parameters.
  window.studyBuddyTrack=function(eventName,params){
    const safe={};
    const allowed=['study_path','unit','feature','session_result','rating'];
    Object.entries(params||{}).forEach(([k,v])=>{
      if(allowed.includes(k) && (typeof v==='string'||typeof v==='number')) safe[k]=v;
    });
    window.gtag('event',eventName,safe);
  };

  const pathLabels={
    test:'test_prep',learn:'need_explanation',misses:'repeated_misses',
    vocab:'vocab_application',maps:'maps_data',frq:'frq_help',
    ap:'ap_readiness',unsure:'next_step'
  };

  // Record the student-language doorway selected on the home screen.
  if(typeof window.studentProofRoute==='function'&&!window.studentProofRoute.__analyticsWrapped){
    const original=window.studentProofRoute;
    const wrapped=function(path){
      if(pathLabels[path]) window.studyBuddyTrack('study_path_selected',{study_path:pathLabels[path]});
      return original.apply(this,arguments);
    };
    wrapped.__analyticsWrapped=true;
    window.studentProofRoute=wrapped;
  }

  // Record Teach Me usage when the freshman success path opens its teaching view.
  if(typeof window.sspGo==='function'&&!window.sspGo.__analyticsWrapped){
    const original=window.sspGo;
    const wrapped=function(view){
      if(view==='teach') window.studyBuddyTrack('teach_me_used',{feature:'teach_me'});
      return original.apply(this,arguments);
    };
    wrapped.__analyticsWrapped=true;
    window.sspGo=wrapped;
  }

  // Record important destination opens through the app's central router.
  if(typeof window.go==='function'&&!window.go.__analyticsWrapped){
    const original=window.go;
    const wrapped=function(route){
      if(route==='mapLab'||route==='visual'||route==='visualPractice'||route==='visualPractice37')
        window.studyBuddyTrack('map_lab_opened',{feature:'maps_data'});
      if(route==='frq') window.studyBuddyTrack('frq_coach_opened',{feature:'frq_coach'});
      if(route==='apSim') window.studyBuddyTrack('final_ap_opened',{feature:'final_ap'});
      return original.apply(this,arguments);
    };
    wrapped.__analyticsWrapped=true;
    window.go=wrapped;
  }

  // Unit-only tracking from selectors/buttons; do not send topic names or question text.
  document.addEventListener('change',function(e){
    const el=e.target;
    if(!el||!el.matches('select')) return;
    const label=((el.closest('label')?.textContent||'')+' '+(el.getAttribute('aria-label')||'')).toLowerCase();
    if(!label.includes('unit')) return;
    const raw=String(el.value||'');
    const m=raw.match(/(?:^|\D)([1-7])(?:\D|$)/);
    if(m) window.studyBuddyTrack('unit_selected',{unit:Number(m[1])});
  },true);

  document.addEventListener('click',function(e){
    const btn=e.target.closest('button,a');
    if(!btn) return;
    const text=(btn.textContent||'').trim().toLowerCase();
    const unit=text.match(/\bunit\s*([1-7])\b/);
    if(unit) window.studyBuddyTrack('unit_selected',{unit:Number(unit[1])});

    // Final AP Mode uses changing button labels across versions, so match only explicit start/finish language.
    if(/start.*final ap|begin.*final ap|start.*exam|start.*simulation/.test(text))
      window.studyBuddyTrack('final_ap_started',{feature:'final_ap'});
    if(/submit.*final|finish.*final|complete.*final|submit.*exam|finish.*exam|complete.*simulation|finish.*simulation/.test(text))
      window.studyBuddyTrack('final_ap_completed',{feature:'final_ap'});
  },true);
})();
