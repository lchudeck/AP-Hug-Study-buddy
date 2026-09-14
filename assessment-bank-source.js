(function(){
  'use strict';
  const visualBank=()=>[
    ...(window.APHG_UNIT1_VISUAL_ASSESSMENT_BANK||[]),
    ...(window.APHG_IMAGE_MCQ_BANK||[]),
    ...(window.APHG_STIMULUS_SET_QUESTIONS||[]),
    ...(window.APHG_STIMULUS_SET_QUESTIONS_EXTRA||[]),
    ...(window.APHG_REAL_DATA_QUESTIONS||[])
  ];
  window.APHGAssessmentBank={
    all(){return window.APHGTeacherAssessment.buildBank([...(typeof quiz!=='undefined'?quiz:[]),...visualBank()])}
  };
})();
