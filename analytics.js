// Privacy-conscious Google Analytics 4 setup for AP Study Buddy.
(function(){
  if(window.__studyBuddyAnalyticsInstalled) return;
  window.__studyBuddyAnalyticsInstalled=true;

  const MEASUREMENT_ID='G-2YRFGT5QNH';
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};

  // Keep advertising/personalization features disabled. Study Buddy uses analytics
  // only for aggregate site usage and engagement measurement.
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
})();
