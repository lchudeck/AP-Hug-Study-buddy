# Units 1–3 release and struggling-student test

## Release
PR #73 merged with authorization; main release ab81a8d1db13c86b00d38fdd34a1b5d69554596e. Before merge, fixed an old browser test's exact button-name/unlimited-attempt assumptions. All checks then passed, including the previously failing maps/answer-retention check. PR #71 was not merged.

Production: https://www.apstudybuddy.com/
All 48 approved startup asset URLs appeared in production HTML; served frq-guided-learning.js bytes matched the approved file exactly. Live Coach displayed the new three-outcome, first-attempt/revision experience.

## Student method and browser evidence
Live desktop Chrome, 1363×936. Used rendered controls, visible definitions, and original short answers; did not read source/hidden answer banks to choose student responses. Began from homepage. Vocabulary review preceded application quizzes and a full FRQ attempt/revision in each unit. Deliberate errors included site/situation, DTM stages, stimulus/relocation diffusion, reversed causes, and immigration reducing the workforce.

| Workflow | Live verified first → revised | Observed result |
|---|---:|---|
| Unit 1 | 5/7 → 7/7 | One first-attempt point was false credit: “Local maps show fewer details than regional ones.” True first-attempt evidence supported 4/7, not 5/7. Follow-up fixes this. |
| Unit 2 | 2/7 → 6/7 | Immigration/workforce error rejected. Informal “immigrants fill vacant jobs so theres more workers” verified after revision. “Stage four” correctly means Stage 4 but remained rubric review; follow-up recognizes it. |
| Unit 3 | 3/7 → 7/7 | Rejected contradictory stimulus example and claim that migrants stop cultural spread. Revised examples and mechanisms verified. |

First submissions remained available after revision. Unit 1 draft survived refresh; Unit 2 original/revised results and selected prompt survived refresh once the Coach was reopened. Checking a self-assessment box did not increase the verified score. Models remained unavailable in the main Coach until revision/explicit skip. Desktop page had no horizontal overflow.

Automation sometimes required a second click after editing a revision. Immediately navigating during refresh twice returned to homepage; reopening Coach restored work. These are observations, not a diagnosed code cause. Do not claim these interactions are fully resolved.

Phone coverage: dedicated follow-up PR check exercises current production at 390×844 with touch/mobile emulation: vocabulary cards → DTM misconception/application → original/revision FRQ → self-check safeguards, model timing, retained original, navigation and overflow/page-error checks. PASS in GitHub Actions run 42406095956: current-production Unit 2 phone flow scored 2→6, preserving the written-stage review honestly; candidate scored 3→7 with the written-stage fix and directly expanded four vocabulary definitions. Candidate desktop/phone revision checks also passed all six unit/viewport workflows. This is emulated Chromium, not a physical phone or Safari test.

## Vocabulary findings
Definitions/examples were inspected in visible flashcards; 59 Unit 1, 72 Unit 2 and 39 Unit 3 card fronts were traversed to locate requested terms. This exposes a findability cost: the Study List's term chips were inert and there was no term search. This was a targeted term review, not an audit of every definition.

- Unit 1: site/situation, absolute/relative location, GIS, GPS/GNSS, remote sensing and scale of analysis were accurate in inspected cards. Map Scale's example was only “1:24,000,” with no interpretation. Follow-up spells out 1 cm → 240 m and distinguishes analysis level. Large-/small-scale cards correctly distinguish area/detail.
- Unit 2: push/pull examples, CBR per 1,000 per year, TFR per woman, and natural increase excluding migration were accurate. DTM Stage 2 and pyramid examples were useful. Dependency Ratio used “dependents” and “working-age people” without defining their demographic ranges; the study summary also loosely called the denominator “workers.” Explicit Immigration, Emigration and Working-Age Population cards were absent from the inspected Study List. Follow-up adds paired migration examples and clarifies ages/actual employment.
- Unit 3: acculturation/assimilation cards clearly contrast retaining some home traits versus losing many traits; syncretism gives a blending example. Hearth, lingua franca, contagious/hierarchical/stimulus diffusion and convergence/divergence were accurate in the inspected cards. Expansion diffusion was briefly mentioned in the review tip but lacked its own card and explicit umbrella relationship to the other diffusion types. Follow-up adds it.
- Clicking a wrong Stage 2 answer produced an accurate explanation, a short Teach Me lesson and a new causal check. Clicking the right answer after that lesson worked. This is observed remediation behavior, not evidence of real student learning.
- After Unit 2 remediation, another recommendation displayed “Retest Topic 2.5: undefined in mixed Unit 1 practice.” Follow-up restricts the Unit 1 recommendation to its own topic names.

Academic reference: current College Board AP Human Geography CED, https://apcentral.collegeboard.org/media/pdf/ap-human-geography-course-and-exam-description.pdf . These original practice criteria are not official College Board scoring guidelines. No AP Classroom secure materials were copied.

## Focused follow-up changes and checks
Five independent rubric-labeled live reproductions: released scorer fails two cases (false scale credit and unrecognized written stage); follow-up passes all five. Existing 63 correct + 126 invalid/partial synthetic-response bank remains 63/63 verified and 0/126 false credits. Existing Unit 2 accuracy/integration tests pass. Six expandable vocabulary entries and scoped recommendation regression pass. The follow-up also replaces the unsupported “lower bound” score promise with a limited-practice-score explanation; the live false-credit example shows why a guaranteed lower-bound claim is too strong. Startup remains within budget: 48 scripts, 996,952 bytes.

Changes are proposed in a follow-up PR, not merged/deployed. They do not establish reliable scoring for arbitrary prose. The old finite bank did not expose the live scale error; additional unseen responses remain valuable.

## Verdicts
- Supervised pilot: conditional; teacher must review scores, particularly Unit 1 scale reasoning. A limited instructional pilot can observe usability, but should not treat automatic totals as dependable grades.
- Independent practice for struggling students: not yet recommended without support; false scale credit, definition findability and residual navigation/click observations need attention.
- Graded assessment: not trustworthy enough. Deterministic verified totals are practice evidence, with unverified alternatives and demonstrated finite-bank blind spots.

## Three next actions
1. Review the focused follow-up PR and its browser evidence, especially the false-credit regression; approve separately before merging.
2. In the supervised pilot, collect anonymous new answers and note whether students can find definitions and revise without teacher rescue.
3. Teacher-score the unseen answers before comparing Coach results. Keep practice scores out of the gradebook.
