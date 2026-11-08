# Units 1–3 instructional FRQ Coach

Candidate, unmerged; production remains unchanged. #73 is merged at ab81a8d. #74 and #75 are open drafts; no scoring fixes from those branches are imported. Unit 3 Learning Lab is outside this decision.

## Change
Reuses lazy loading, browser-tab storage, the unit selector, original writing preservation and revision comparison. Replaces seven-part graded submissions with three short targeted lessons. Adds worked examples, task-specific reflection, independent application, optional early example help and a different transfer scenario. Each lesson retains its own position and writing. No grading calls, numerical judgments, answer interpretation, accounts, external APIs or answer analytics in the instructional Coach. The legacy entry and scoped drill controls lead here. Other-unit Coach and simulator/quiz scoring are retained.

Old session writing is displayed as an ungraded archive without deletion or migration into an unrelated task. Originals become immutable on first submission; revision remains editable. Storage errors produce a visible copy-work warning. Session storage normally ends on tab closure, can be restored by browsers, and does not sync.

## Academic desk review (distinct from browser evidence)
Sources checked: current public College Board course page and CED, including the June 2026 clarifications (front matter/resource references, no change to these lesson targets), task verbs (printed p.159), topics 1.4/1.6, 2.9/2.12, 3.4/3.6; public 2024 Set 1 scoring guidelines as an example of task-specific acceptable alternatives. Original fictional scenarios; no secure AP Classroom content copied.
- https://apcentral.collegeboard.org/courses/ap-human-geography
- https://apcentral.collegeboard.org/media/pdf/ap-human-geography-course-and-exam-description.pdf
- https://apcentral.collegeboard.org/media/pdf/ap-human-geography-course-and-exam-description-clarifications.pdf
- https://apcentral.collegeboard.org/media/pdf/ap24-sg-human-geography-set-1.pdf

| Lesson | Academic criteria and limits |
|---|---|
| 1 | Situation is relative location and connections, distinguished from site. Regional aggregation can hide local variation. Local clinic/bus/internet data expose unequal access without proving its cause. Scale of analysis is distinguished from map ratio. |
| 2 | Aging can create pension/service pressure and vacancies through retirement. Qualified migrants who may work can fill open jobs, adding available labor. Working age does not equal employment; immigration does not guarantee an end to aging or every shortage. |
| 3 | Stimulus diffusion requires adaptation of a spreading underlying idea. Movement carrying traits illustrates relocation; online learning/sharing can spread traits without movement. Adaptation and communication are distinguished explicitly. |

Each lesson contrasts incomplete reasoning with a stronger explanation and annotates accuracy, evidence, mechanism, direction and scenario connection. Short sufficient Describe responses are explicitly accepted as instructional examples. No required wording, connector, word count or grammar score. These lessons are targeted practice, not full unit coverage or official College Board scoring rubrics. Teacher review is built into the supervised pilot; no student learning has been measured.

## Historical scoring evidence and gates
HISTORICAL_PILOT_SCORING_RESULTS.json and HISTORICAL_PILOT_RELEASE_DECISION.md are unchanged copies from #75 at ad437a9. Their negative labels and failures remain historical failures; the scorer was not repaired. Existing frq-guided-accuracy.cjs and its bank are retained. The former scored UI test is preserved as frq-guided-session-historical.cjs (historical only). The scored-UI gate no longer applies to this ungraded interface; active session/browser checks test absence of grading and preservation of writing instead. The original accuracy bank remains an active CI check for the retained shared scorer; passing it does not erase the later holdout failures or establish general scoring accuracy. Retained core/simulator/drill-engine tests remain active. Unit 2 integration removes only assertions for the removed scored Coach interface and its prior Unit 1/3 guided rule layer.

## Validation
DOM workflow, response variants (nonsense, contradiction, short answer, misspelling), lesson isolation, core FRQ scoring and Unit 2 scorer/simulator checks pass locally. Generated delivery: 48 scripts / 995,617 startup JS bytes. Instructional file loads afterward.
Production startup script tags and the lazy Coach bytes were fetched and match main/#73. #74/#75 are not deployed. Index HTML itself differs beyond the script list; no complete-production equivalence claim is made.

### Real Chromium evidence (not an academic or learning assessment)
Application commit: 4306ed6c96f3fadf1a52e2113fa23eb020857cd1. Later changes are test/report/pilot files only.
- Focused six-workflow PASS: https://github.com/lchudeck/AP-Hug-Study-buddy/actions/runs/42430531557
- Release browser smoke PASS: https://github.com/lchudeck/AP-Hug-Study-buddy/actions/runs/42430531782
- Updated reliability, privacy, performance and affected navigation/Coach checks pass. The obsolete rubric-count logging error in the older fast test was corrected; its updated run passes: https://github.com/lchudeck/AP-Hug-Study-buddy/actions/runs/42430630217

Each unit completed worked-example comparison, a plausible flawed draft, checklist reflection, revision, annotated example comparison, different transfer and completion at 1280x900 and 390x844. Checks cover blank blocking, nonsense/contradictory/short/misspelled input without grading, original preservation, mid-draft and completed refresh recovery, home resume, navigation away/back, per-lesson isolation/position, early-example support labeling, keyboard activation/focus, old writing archive, unavailable session storage warnings, horizontal overflow, uncaught JavaScript exceptions, and absence of synthetic writing in outgoing request bodies. These tests do not establish general privacy certification.

Local Chromium launch is blocked by socket/ptrace restrictions; browser evidence is real GitHub-hosted Chromium. Phone-sized means a desktop Chromium viewport, not a physical phone. No Safari, Firefox, screen-reader, physical-phone, actual student or learning-outcome claim. Final focused run PASS, including console capture with no console-error entries or uncaught JavaScript exceptions: https://github.com/lchudeck/AP-Hug-Study-buddy/actions/runs/42430763448. The corresponding release smoke also passes: https://github.com/lchudeck/AP-Hug-Study-buddy/actions/runs/42430763421.

### Decision
READY FOR SUPERVISED PILOT after explicit merge/deployment approval. No known critical technical blocker in the exercised workflows. Pilot targets remain proposed and unmeasured. Teacher review should examine accuracy, improved reasoning and transfer using anonymous paper records. This decision covers only the three targeted lessons, not full Units 1–3 content or the separate Unit 3 Learning Lab release.

No merge or deployment performed. Historical scoring failures remain failures; other scored surfaces have not become validated graders because this Coach is now instructional.

## November 8 focused follow-up
#76 was open and unchanged at 60ddafe; main remains ab81a8d. Existing latest-head checks all passed. Production still visibly presents the older graded Coach. No merge or production deployment authorized.

Agent-operated desktop Chromium in the existing Netlify PR preview completed all three lessons with incomplete drafts, revisions, reflections, model comparison and new transfer responses. Unit 1 refresh restored completed writing; Unit 3 navigation away/back restored completion. No application grading judgment appeared. Console errors observed were browser-extension metadata errors. Immediate fill-and-click in one automation call sometimes required a repeated click; separating input and action worked. Cause is unconfirmed; observe real student clicks during the pilot.

Corrections: task-word support explicitly teaches Compare with a bus-wait comparison and distinguishes it from Describe and Explain. Reflection checkboxes now have question-specific accessible names; the generic accessibility layer previously labeled them with the section heading. Current public CED task-verb guidance was rechecked. No academic concept errors were found in the targeted lessons.

Ratings: academic accuracy 5/5 for these targeted lessons (accurate definitions and mechanisms); clarity/independence 4/5 (no actual student independence evidence); writing instruction 4/5 (useful annotations, Compare explained but not a full practice lesson); application/revision 5/5 (different tasks, preserved original, reflection and transfer exercised); technical reliability/privacy 4/5 (passing existing checks and local-only writing, but no physical-phone/Safari test and browser-click uncertainty). These are reviewer judgments, not measured learner outcomes.

CONDITIONAL GO for supervised pilot, superseding earlier unconditional wording. Ready for approval after correction checks pass. No confirmed critical app blocker; student independence, physical-mobile behavior and learning gains remain unproven. An adult walkthrough cannot establish a 20–30 minute independent student session. Existing printable protocol remains appropriate.
