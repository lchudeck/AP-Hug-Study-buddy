# AP Study Buddy — focused student-beta decision

Test date: October 1, 2026. Repository: lchudeck/AP-Hug-Study-buddy.

**Verdict: production is not ready yet. The patched branch is suitable for a small, free Unit 2 beta with the limitations below, after deployment and a final production smoke check. This is not approval to charge.**

## Version and environments

- Base main: `fab0bacb812fb9439815f4e9d1054e907988ed04`; prior DTM/FRQ/evidence-table fixes were present. No overlapping open PRs were found at triage.
- Candidate: branch `fix/student-beta-visual-readiness`. The PR identifies the exact candidate commit. This report and its executable checks are included in that commit.
- Production: https://www.apstudybuddy.com/ . The tested app, visual-practice scripts, real-data script, reliability patch, and bundled U.S./world geometry matched base-main bytes. This establishes parity of those assets, not a deployed release SHA. Production has not received this branch.
- Production UI: remote Chrome, desktop. Unit 2 homepage → Unit Review → flashcards → maps/visual practice → FRQ Coach; correct and incorrect answers, concept retry, refresh, and returning home. The requested roughly 20-minute study itinerary was completed with testing interruptions; this was not a timed usability study with a student.
- Local candidate: real headless Chromium 153, 1366×768 laptop and 390×844 phone viewport with touch emulation. A real Chromebook and physical phone were unavailable. Phone production qualification was not completed; phone results below are local, not production results.
- Preview: https://deploy-preview-62--aphugstudybuddy.netlify.app/ . Remote Chrome verified actual U.S./world boundaries and completed all three DTM questions through the new finish panel. Preview is not production. Tested code commit: `d6af38dca47a5a1130c77de7f4a4d1ebf9b5c5ec`; later report-only changes do not alter that code.

## Reproduced issues and targeted fixes

| Issue | Production/base finding | Candidate validation |
|---|---|---|
| Units 1–2 silently switched sets; Units 3–7 cycled without a finish | Reproduced | Explicit completion, deliberate review/restart; all 12 + 5 questions completed on laptop/phone |
| Upper-unit visual FRQ draft erased when showing model points | Reproduced | Draft retained for all 5 prompts; lower-unit 4 prompts also checked |
| Small visuals had no enlargement; map detail lacked the actual map | Reproduced | Enlarged modal, return button, Escape, keyboard focus, legend and arrowhead retention |
| DTM Stage 5 graphic placed births above deaths | Source/render verified | Corrected negative-growth relationship in practice and legacy model diagram |
| Von Thünen label/choropleth legend clipped; sector wedges distorted | Render verified | Targeted geometry/label fixes; SVG text-bound checks and visual inspection |
| Migration diagram omitted arrowheads; step-migration wording implied different generations | Verified | Direction shown; same migrants settle and later move onward |
| Agricultural intensity inferred from plot size alone | Verified | Inputs per hectare explicitly labeled |
| Development comparison lacked complete labeled evidence | Verified | Fictional, normalized three-dimension table; question requires comparing the evidence |
| District shape alone treated as evidence of gerrymandering | Verified | Questions specify partisan intent; explanation says shape alone cannot prove it |
| Simulator GIS FRQ rendered Weber diagram through fallback | Verified locally | Correct renderer chosen; schematic map data/regions identified as illustrative |
| Completed Unit Review did not count toward readiness evidence | Production: 18 attempts persisted, readiness still 0 units/days | Same existing recorder now receives Unit Review answers; saved unit evidence survives refresh |
| Unit 2 FRQ awarded points for Stage 1, birth-rate definition, falling median age, and reversed workforce effect | Production incorrect response received 4/7 | Narrow demographic relationship checks: incorrect set 0/7; sound paraphrase 6/7, with valid housing paraphrase sent to rubric self-check; vague set 0/7 |
| Explain directions demanded particular connector words | Production scaffolds contradicted reminder | Core Coach directions require a causal relationship, not a specific word |

Previously fixed Unit 2 DTM freeze, hidden Coach tasks/scaffolds, and Unit 2 evidence-table questions were verified; they were not assumed broken. DTM completed three repeated full passes in regression. The Unit 2 table question requires the shown country comparison. Map Detective completes seven questions and restarts; Scale of Analysis completes seven. Adaptive Unit Review explicitly returns missed concepts; this intentional repetition produced 18 attempts in the production journey rather than an unexplained loop.

## Coverage and limitations

Every distinct rendered stimulus in the exposed banks and visual-practice sets was inspected, alongside bundled map-card and scale visuals. Generated exam variants were inventoried to avoid missing a stimulus exposed only by the tests/simulator. Legacy model/map assets were additionally rendered; legacy navigation is hidden by the current six-section interface. This extra asset check does not claim a completed hidden legacy UI session.

Automated checks cover references/answer keys in six exposed banks (136 attached MCQs), rendering of 37 distinct bank stimuli, completion of every dedicated visual-practice question, all 9 dedicated visual FRQs, actual map boundaries, missing-image checks, overflow, and text clipping. Review covered the attached visual questions/explanations and a focused nonvisual sample of two questions per unit (14 total). Exam assembly/quality checks passed; all 180 exam items were not manually answered in this pass.

| Map/lesson set | Location | Result on candidate | Limitation |
|---|---|---|---|
| Political reference, U.S. | Maps & Visuals → Map Types | Actual state/DC boundaries render; detail/enlarge/return pass | Simplified classroom projection |
| World reference | Same | Actual country boundaries render | Small countries need enlargement; not a border-dispute reference |
| Choropleth | Same | U.S. map, shades and legend visible | Raw totals deliberately used to teach standardization limitation |
| Proportional symbols | Same | U.S. geometry and graduated symbols visible | Illustrative classroom sizing |
| Dot density | Same | Dots and interpretation note visible | Rectangular classroom schematic; dots do not locate individual people |
| Isolines | Same | Contours and values visible | Classroom schematic, not observed weather/topographic data |
| Cartogram | Same | Resized regions and labels visible | Classroom schematic |
| Global, national, state, county scale visuals | Scale of Analysis | All seven questions complete; boundaries and highlighted areas visible | Scale lesson rather than a current demographic dataset |
| Clustered/dispersed/linear | Spatial Concepts | Visible on laptop/phone; enlarges | Schematic |
| Youthful pyramid and DTM overview | Unit 2 Population | Both render, enlarge and return | Overview shapes; not measured country data; enlargement needed for fine labels |
| Gray Census urban-area snapshot | Excluded real-data set `real-census-urban` | **Excluded, not working content**; no reachable bank question references it | Urban-area-map interpretation coverage absent. No practice silently removed in this pass |

The following inventory deduplicates identical SVG/table/image content. “Pass” means rendered content was inspected and reference/label checks passed locally; it does not imply that every ordinary MCQ was manually clicked in production. Dedicated visual sets additionally had complete desktop/phone navigation and feedback checks. Legacy entries are explicitly labeled.

| Visual/set ID | Location | Result | Remaining limitation |
|---|---|---|---|
| im1 | Unit 2; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| im2 | Unit 3; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| im3 | Unit 4; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| im4 | Unit 5; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| im5 | Unit 6; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| im6 | Unit 7; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| map-scale-patterns | Unit 1; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| pop-pyramid-youthful | Unit 2; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| diffusion-network | Unit 3; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| gerrymander-district | Unit 4; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| von-thunen-rings | Unit 5; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| urban-sector | Unit 6; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| development-chain | Unit 7; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| spatial-pattern-points | Unit 1; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| migration-flow | Unit 2; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| language-tree | Unit 3; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| boundary-types | Unit 4; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| agri-intensity | Unit 5; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| urban-hierarchy | Unit 6; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| development-indicators | Unit 7; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| v2-u1-scale | Unit 1; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| v2-u2-pyramid | Unit 2; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| v2-u3-diffusion | Unit 3; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| v2-u4-boundaries | Unit 4; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| v2-u5-market | Unit 5; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| v2-u6-urban | Unit 6; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| v2-u7-development | Unit 7; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |
| real-acs-mobility | Unit 2; practice/exam stimulus banks | Pass | Dates/units and source note visible; rounded/illustrative profiles where stated |
| real-worldbank-development | Unit 7; practice/exam stimulus banks | Pass | Dates/units and source note visible; rounded/illustrative profiles where stated |
| u1-census-scale | Unit 1; practice/exam stimulus banks | Pass | Dates/units and source note visible; rounded/illustrative profiles where stated |
| u2-world-pop | Unit 2; practice/exam stimulus banks | Pass | Dates/units and source note visible; rounded/illustrative profiles where stated |
| u3-language | Unit 3; practice/exam stimulus banks | Pass | Dates/units and source note visible; rounded/illustrative profiles where stated |
| u4-refugees | Unit 2; practice/exam stimulus banks | Pass | Dates/units and source note visible; rounded/illustrative profiles where stated |
| u4-districting | Unit 4; practice/exam stimulus banks | Pass | Dates/units and source note visible; rounded/illustrative profiles where stated |
| u5-agriculture | Unit 5; practice/exam stimulus banks | Pass | Dates/units and source note visible; rounded/illustrative profiles where stated |
| u6-urban | Unit 6; practice/exam stimulus banks | Pass | Dates/units and source note visible; rounded/illustrative profiles where stated |
| u7-hdi | Unit 7; practice/exam stimulus banks | Pass | Dates/units and source note visible; rounded/illustrative profiles where stated |
| __visualPractice12-Map Type Interpretation | Maps & Visuals → Units 1–2; MCQ/FRQ | Pass | Complete set checked; explicit review after finish |
| __visualPractice12-Spatial Pattern | Maps & Visuals → Units 1–2; MCQ/FRQ | Pass | Complete set checked; explicit review after finish |
| __visualPractice12-Population Pyramid | Maps & Visuals → Units 1–2; MCQ/FRQ | Pass | Complete set checked; explicit review after finish |
| __visualPractice12-Demographic Transition Model | Maps & Visuals → Units 1–2; MCQ/FRQ | Pass | Complete set checked; explicit review after finish |
| __visualPractice12-Visual Map Analysis | Maps & Visuals → Units 1–2; MCQ/FRQ | Pass | Complete set checked; explicit review after finish |
| __visualPractice12-Scale and GIS | Maps & Visuals → Units 1–2; MCQ/FRQ | Pass | Complete set checked; explicit review after finish |
| __visualPractice12-Population Pyramid Analysis | Maps & Visuals → Units 1–2; MCQ/FRQ | Pass | Complete set checked; explicit review after finish |
| __visualPractice12-DTM Interpretation | Maps & Visuals → Units 1–2; MCQ/FRQ | Pass | Complete set checked; explicit review after finish |
| __visualPractice37-Global Production Network | Maps & Visuals → Units 3–7; MCQ/FRQ | Pass | Complete five-question sequence and all FRQ prompts checked |
| __visualPractice37-Urban Models | Maps & Visuals → Units 3–7; MCQ/FRQ | Pass | Complete five-question sequence and all FRQ prompts checked |
| __visualPractice37-Electoral Geography | Maps & Visuals → Units 3–7; MCQ/FRQ | Pass | Complete five-question sequence and all FRQ prompts checked |
| __visualPractice37-Cultural Diffusion | Maps & Visuals → Units 3–7; MCQ/FRQ | Pass | Complete five-question sequence and all FRQ prompts checked |
| __visualPractice37-Von Thünen Land Use | Maps & Visuals → Units 3–7; MCQ/FRQ | Pass | Complete five-question sequence and all FRQ prompts checked |
| model-dtm | Legacy model bank (hidden navigation) | Pass | Asset rendered; legacy UI not qualified |
| model-pyramid | Legacy model bank (hidden navigation) | Pass | Asset rendered; legacy UI not qualified |
| model-vonthunen | Legacy model bank (hidden navigation) | Pass | Asset rendered; legacy UI not qualified |
| model-concentric | Legacy model bank (hidden navigation) | Pass | Asset rendered; legacy UI not qualified |
| model-sector | Legacy model bank (hidden navigation) | Pass | Asset rendered; legacy UI not qualified |
| model-nuclei | Legacy model bank (hidden navigation) | Pass | Asset rendered; legacy UI not qualified |
| model-latin | Legacy model bank (hidden navigation) | Pass | Asset rendered; legacy UI not qualified |
| model-rostow | Legacy model bank (hidden navigation) | Pass | Asset rendered; legacy UI not qualified |
| model-core | Legacy model bank (hidden navigation) | Pass | Asset rendered; legacy UI not qualified |
| model-weber | Legacy model bank (hidden navigation) | Pass | Asset rendered; legacy UI not qualified |
| legacy-map-blackMarble | Legacy real-map bank (hidden navigation) | Pass | NASA/Census attribution retained; legacy UI not qualified; fine labels require enlargement |
| legacy-map-censusPopulation | Legacy real-map bank (hidden navigation) | Pass | NASA/Census attribution retained; legacy UI not qualified; fine labels require enlargement |
| legacy-map-undefined | Legacy real-map bank (hidden navigation) | Pass | NASA/Census attribution retained; legacy UI not qualified; fine labels require enlargement |
| pyramid-drill-rapid | Unit 2/legacy pyramid drill | Pass | Idealized age structure, not observed country data |
| pyramid-drill-stable | Unit 2/legacy pyramid drill | Pass | Idealized age structure, not observed country data |
| pyramid-drill-aging | Unit 2/legacy pyramid drill | Pass | Idealized age structure, not observed country data |
| pyramid-drill-decline | Unit 2/legacy pyramid drill | Pass | Idealized age structure, not observed country data |
| pyramid-drill-irregular | Unit 2/legacy pyramid drill | Pass | Idealized age structure, not observed country data |
| exam-frq-globalChoro | Exam simulator FRQ | Pass | Illustrative GIS regions/data |
| exam-frq-localFood | Exam simulator FRQ | Pass | Illustrative GIS regions/data |
| v2-v2-u3-diffusion-4 | Unit 3; practice/exam stimulus banks | Pass | Classroom schematic/illustrative stimulus where labeled |

PR: https://github.com/lchudeck/AP-Hug-Study-buddy/pull/62 — open, unmerged, not deployed to production. Netlify preview succeeded. GitHub performance-budget job failed as anticipated; other completed checks passed at the first status check and some checks were still running.

## Validation and release gates

- All 16 existing regression files passed after the initial targeted fixes. After the subsequent demographic/coaching changes, the affected FRQ and beta-blocker regressions passed again.
- The final laptop/phone browser run passed complete visual sets, answer retention, Unit Review evidence persistence, core Coach sound/incorrect/vague/empty-response cases, enlargement/closing/focus, legend/arrow references and browser-error checks.
- All changed JavaScript syntax checks and `git diff --check` passed. No package/build manifest is present; this is a static site.
- Existing performance-budget check is already exceeded on main: 49 local startup scripts versus limit 48; 1,005,095 bytes versus limit 1,000,000. Candidate remains 49 scripts and approximately 1.01 MB. This pass did not relax the ceiling, remove practice, or undertake startup consolidation. Treat a failing performance job as a release-check limitation, not a newly discovered student freeze.

**Remaining release blockers:** deploy the tested candidate; recheck the deployed version on desktop and phone before inviting students; resolve or explicitly accept the existing performance-budget failure through the repository's release process. Until then, production readiness is pending.

**Stated beta limitations:** FRQ scoring remains local, conservative coaching, not a semantic guarantee or official AP score. Students must compare uncertain responses against the rubric/model; sound alternate housing wording was not automatically verified. Browser-local saved evidence survives refresh on the same browser; unfinished drafts/quiz position and cross-device/cloud synchronization are not promised by this pass. Gray Census urban-map practice remains excluded. Real Chromebook, physical touch-device, and school-network checks are outstanding.

**Later improvements:** strengthen the easiest legacy distractors and stimulus-adjacent recall questions; some can still be answered from vocabulary rather than the visual. Keep these labeled as introductory practice and do not interpret their scores as exam readiness. A broad curriculum rewrite, account system, startup refactor, payment system, and full school-network compatibility certification were outside this focused pass.

## One-week free beta: 5–10 students, Unit 2

Start only after the deployment gates above. No names, emails, student IDs, class rosters, response transcripts, or identifiable screenshots are needed.

| Day | Activity |
|---|---|
| 1 | Open the homepage independently; 10-question Unit 2 check and 5 flashcards. Note where directions became unclear. |
| 2 | Population pyramid and DTM visual sets; make a mistake, read feedback, finish, and deliberately restart once. |
| 3 | One Unit 2 FRQ: use labeled part boxes, compare uncertain feedback with the model, revise one explanation. |
| 4 | Refresh/return on the same browser and confirm saved practice evidence; try the essential journey on a phone. |
| 5 | Repeat a 15–20 minute Unit 2 session independently; submit three anonymous answers below. |
| 6–7 | Review anonymous issue categories and learning-value ratings; fix only reproduced blockers; decide whether to expand the free beta. |

Pause invitations if students encounter a freeze, missing stimulus, lost promised progress, or feedback endorsing incorrect geography. Judge success by independently finishing useful sessions and explaining one corrected misconception, not just higher scores.

Anonymous feedback questions:
1. Where did you get confused or stuck, and what did you expect to happen? (Tool/question title only; no personal information.)
2. What concept did the feedback help you understand, and what still did not make sense?
3. Would you choose to use Study Buddy again this week? Why or why not?

A small free beta does not establish readiness to charge. Charging needs evidence of sustained value, dependable deployed behavior, and a separately reviewed paid experience.
