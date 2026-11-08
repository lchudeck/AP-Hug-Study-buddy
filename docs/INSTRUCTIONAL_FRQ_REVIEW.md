# Units 1–3 instructional FRQ Coach

Candidate, unmerged; production remains unchanged. #73 is merged at ab81a8d. #74 and #75 are open drafts; no scoring fixes from those branches are imported. Unit 3 Learning Lab is outside this decision.

## Change
Reuses lazy loading, browser-tab storage, the unit selector, original writing preservation and revision comparison. Replaces seven-part graded submissions with three short targeted lessons. Adds worked examples, task-specific reflection, independent application, optional early example help and a different transfer scenario. Each lesson retains its own position and writing. No grading calls, numerical judgments, answer interpretation, accounts, external APIs or answer analytics in the instructional Coach. The legacy entry and scoped drill controls lead here. Other-unit Coach and simulator/quiz scoring are retained.

Old session writing is displayed as an ungraded archive without deletion or migration into an unrelated task. Originals become immutable on first submission; revision remains editable. Storage errors produce a visible copy-work warning. Session storage normally ends on tab closure, can be restored by browsers, and does not sync.

## Academic desk review (distinct from browser evidence)
Sources checked: current public College Board course page and CED, including task verbs (printed p.159), topics 1.4/1.6, 2.9/2.12, 3.4/3.6; public 2024 Set 1 scoring guidelines as an example of task-specific acceptable alternatives. Original fictional scenarios; no secure AP Classroom content copied.
- https://apcentral.collegeboard.org/courses/ap-human-geography
- https://apcentral.collegeboard.org/media/pdf/ap-human-geography-course-and-exam-description.pdf
- https://apcentral.collegeboard.org/media/pdf/ap24-sg-human-geography-set-1.pdf

| Lesson | Academic criteria and limits |
|---|---|
| 1 | Situation is relative location and connections, distinguished from site. Regional aggregation can hide local variation. Local clinic/bus/internet data expose unequal access without proving its cause. Scale of analysis is distinguished from map ratio. |
| 2 | Aging can create pension/service pressure and vacancies through retirement. Qualified migrants who may work can fill open jobs, adding available labor. Working age does not equal employment; immigration does not guarantee an end to aging or every shortage. |
| 3 | Stimulus diffusion requires adaptation of a spreading underlying idea. Movement carrying traits illustrates relocation; online learning/sharing can spread traits without movement. Adaptation and communication are distinguished explicitly. |

Each lesson contrasts incomplete reasoning with a stronger explanation and annotates accuracy, evidence, mechanism, direction and scenario connection. Short sufficient Describe responses are explicitly accepted as instructional examples. No required wording, connector, word count or grammar score. These lessons are targeted practice, not full unit coverage or official College Board scoring rubrics. Independent teacher review is still needed before classroom use; no student learning has been measured.

## Historical scoring evidence and gates
HISTORICAL_PILOT_SCORING_RESULTS.json and HISTORICAL_PILOT_RELEASE_DECISION.md are unchanged copies from #75 at ad437a9. Their negative labels and failures remain historical failures; the scorer was not repaired. Existing frq-guided-accuracy.cjs and its bank are retained. The former scored UI test is preserved as frq-guided-session-historical.cjs (historical only). That gate no longer applies to this ungraded UI; the active session/browser checks test absence of grading and preservation of writing instead. Retained core/simulator/drill-engine tests remain active. Unit 2 integration removes only assertions for the removed scored Coach interface and its prior Unit 1/3 guided rule layer.

## Validation
DOM workflow, response variants (nonsense, contradiction, short answer, misspelling), lesson isolation, core FRQ scoring and Unit 2 scorer/simulator checks pass locally. Generated delivery: 48 scripts / 995,617 startup JS bytes. Instructional file loads afterward.
Local Chromium launch is blocked by the environment's socket/ptrace restrictions. Real desktop/phone-sized Chromium evidence will be recorded from the focused PR workflow; this report must not be read as a browser pass until that run succeeds. No physical phone, Safari or learning-outcome claim.

Readiness pending browser execution and teacher review: CONDITIONAL.
