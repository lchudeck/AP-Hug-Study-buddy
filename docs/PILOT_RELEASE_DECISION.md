# Units 1–3 release decision — November 7, 2026 (Pacific)

**NOT READY — BLOCKING ISSUES REMAIN** for the requested independent workflow with trustworthy verified FRQ feedback. There is useful review material and working revision/persistence, but the independent scoring gate fails. No new changes were merged or deployed during this review. A narrowly supervised usability session can use the prepared protocol with teacher review of all FRQ claims; it cannot establish automatic scoring readiness.

## Current state

| Component | Verified state | Decision |
|---|---|---|
| Main / released application | `ab81a8d1db13c86b00d38fdd34a1b5d69554596e`; PR #73 merged | Preserve guided original/revision, separate rubric review and non-credit self-checks. |
| PR #74 | Draft, head `3fac83e3ecc805cef381ba7b8df691e48ad4c7b4` | Hold. Exact prior scale reproduction is fixed; broader false credit remains. |
| PR #72 | Draft, head `4f1f3a1339ea3c4e85b6c5bb20309ec333420617` | Revise narrowly before merge; meaningful new learning value, but refresh resets work. |
| This follow-up | Based on #74, unmerged | Narrow uncertainty gates, first-entry Coach refresh, new regression/holdout tests, release gate and pilot materials. Not a shippable scoring solution. |

Production verification fetched the deployed `app.js`, `frq-part-scoring.js` and `frq-guided-learning.js`; all matched main byte for byte. Production HTML has hosting transformations and is not identical to the repository HTML. Therefore this establishes the released application source fingerprint, not an independently queried hosting deployment commit. The live browser showed the #73 guided results, original response and revision after grading/re-entry. PR #74's vocabulary and revised caveat are not live.

## What is complete, needs attention, and can wait

Complete: #73 release; #74 exact scale fix, written-stage recognition and expandable vocabulary candidate; working retained first response and revision; existing real Chromium desktop/mobile flows; bounded startup performance; pilot assessment/forms/teacher key.

Needs attention: false verified points on fresh contradictions and causal inversions; Coach initially rendering the legacy interface; Unit 3 Lab lost progress on refresh; independent human teacher validation of rubric labels and response coverage.

Can wait: additional content volume, cosmetic changes and broad audits. No changes to Units 4–7, branding, marketing, AI or external grading APIs were made.

## Scoring evidence and corrections

New synthetic examples were labeled from the stated point criteria before running the scorer. They are analyst rubric labels, **not independent human teacher scores**. The first 30 cases cover all ten requested response categories in each unit. After those cases informed corrections, they became a regression bank. A separate 12-response holdout was then run without tuning around its results. Full texts, expected decisions and observed outcomes are in PILOT_SCORING_RESULTS.json; run `node tests/frq-pilot-independent.cjs` for a strict release gate. `--diagnostic` prints findings without asserting success; `--save` records results.

| Bank | #74 before follow-up | Follow-up candidate | Interpretation |
|---|---:|---:|---|
| Existing supported-correct benchmark | 63/63 verified | 63/63 verified | Preserved known supported phrasing; development fixtures, not unseen proof. |
| Existing 126 invalid/partial benchmark | 0 false credit | 0 false credit | Finite bank missed the new cases. |
| New initial 12 correct / 18 negative cases | 9 correct verified; 9 false verified | 9 correct verified; 3 correct review; 0 false verified | Useful corrections; no longer independent validation after tuning. |
| Fresh 6 correct / 6 negative holdout | Not used to develop corrections | 4 correct verified; 2 correct review; **6 false verified** | Release acceptance fails. Do not change expected labels to make CI green. |

The follow-up routes the initial reversed scale comparison, obstructed-access plan, high-rate DTM contradiction, vocabulary-only cultural effect, reverse globalization cause, and unsupported causal clauses to rubric review. It does not call those responses definitively wrong or fabricate points. The existing three-outcome presentation, original response, revision, model timing and self-check protections remain.

The holdout still wrongly verifies:

- Unit 1 E: “Local maps conceal service gaps that regional maps reveal.”
- Unit 1 D: “Highways cause businesses to close and eliminate jobs.”
- Unit 2 F: “Stage 4 has very high fertility.”
- Unit 2 D: “Immigrants fill vacant jobs, which means the supply of workers falls.”
- Unit 3 F: “A shared language allows communication, but it makes trade impossible.”
- Unit 3 E: “Social media spreads trends fast because magic internet goblins deliver them.”

This deliberately challenging set is not an estimate of the frequency of real student errors. It shows that keyword presence still substitutes for checking the whole relationship. The final nonsense example also shows why adding a few irrelevant-word exclusions cannot establish robust meaning. Correct responses left for review include dependency phrasing, relocation paraphrases and spelling variants; they need clear teacher review, not a zero presented as a definitive grade.

**Stop rule applied:** make the narrow reproducible corrections reviewable, but do not force a release or continue an open-ended blacklist of synonyms. A bounded scoring change must withhold verification whenever the complete relationship cannot be established. Keep deterministic architecture. Do not replace uncertainty with AI or with student self-certification. Independent human review of the new bank is still required.

## Browser evidence: production versus candidates

The local Chromium process cannot launch because the environment denies its socket/ptrace operations. Actual interactive Chrome was available separately and was used for production and both Netlify previews. No DOM-only test is described as real-browser success.

| Evidence | Result and limits |
|---|---|
| Live production desktop, new tests | Reversed map-scale and obstructed-access answers earned 2/7 verified points. Revision controls worked; original/revised work survived refresh after reopening Coach. Original error was retained. Initial entry showed legacy UI until a later render. |
| #74 deployed preview desktop, new tests | Same two wrong answers earned 2/7. Candidate caveat correctly avoids guaranteed “lower bound” wording. Initial legacy UI reproduced. |
| Existing #74 real Chromium run 42406304925, job 128504640830 | Logs inspected: six Unit 1–3 × 1280×900/390×844 original/revision workflows passed; current-production Unit 2 mobile vocabulary-to-FRQ path passed 2→6; candidate mobile path passed 3→7. No page errors or horizontal overflow in that coverage. Reused, not rerun unnecessarily. |
| New first-entry correction | The lazy-loader now rerenders an open Coach after installing guided UI, removing the stale legacy sample-answer control. New browser gate checks visible first entry, both reproduced negatives, self-checks and navigation at desktop/phone sizes; six existing revision flows remain required. Final CI outcome must be recorded separately. |
| #72 real Chromium run 42162613874, job 127711593398 | Logs inspected: 390px touch flow completed all eight visuals, required recovery, FRQ self-check and summary. Structural check rerun: 17 questions, eight visuals, two three-part FRQs, eight CED topic tags. PR description's “16 questions” and missing-browser warning are stale. |
| #72 new preview desktop | Deliberate culture/trait miss gave a useful distinction and a different same-concept retry. Continue reached question 2; refresh silently returned to question 1. Source has no session persistence or leave warning. |

Physical phones, Safari and Firefox were not tested. Browser errors attributable only to the cloud browser extension are not application console failures. No fresh claim covers all maps/pyramids at every size: reuse existing focused evidence, and retain that coverage limitation.

Performance after the narrow follow-up: **48 startup scripts / 997,139 bytes**, below existing limits of 48 / 1,000,000. Generated asset check passes. Remaining byte headroom is small (2,861 bytes). This is the repository's initial-JavaScript budget, not a Core Web Vitals or real-network speed measurement.

## Learning journeys and academic review

The previous release review already exercised vocabulary → application → deliberate mistake → explanation → FRQ → revision in each unit on live desktop; the #74 Chromium logs cover the candidate's three-unit revision workflows and full Unit 2 phone learning flow. Those successful paths were reused because this task did not alter instructional content. They demonstrate operability and plausible learning opportunities, not actual learning gains or validated 20–30 minute pacing. A full new uninterrupted learner journey per unit was not repeated or claimed.

| Unit | Preserved learning value | Remaining meaningful limitation |
|---|---|---|
| 1 | Site/situation examples; local/regional comparison; GIS application; original/revision comparison | False verified directional reasoning can reinforce a misconception. First-entry legacy display can expose the older workflow. |
| 2 | DTM and dependency examples; wrong-stage explanation and new check; workforce reasoning practice | Contradictory fertility/workforce claims escape verification safeguards; valid dependency/spelling wording still needs review. |
| 3 | Clear relocation/stimulus examples, cultural-change vocabulary and guided revision | Weak automatic handling of complete causal claims; old retry/topic mismatch evidence is not resolved merely by adding a separate lab. |

Academic authority checked: current College Board AP Human Geography course page, linked CED and course skills. The focused concepts and original pilot questions align with scale, population/migration and cultural-process skills. This is not a certification of every item or complete CED mastery. The CED explicitly includes cultural relativism/ethnocentrism, gender/Indigenous use of space, named religion examples and multiculturalism; the proposed lab samples topics without fully covering each requirement. Source: https://apcentral.collegeboard.org/media/pdf/ap-human-geography-course-and-exam-description.pdf and https://apcentral.collegeboard.org/courses/ap-human-geography .

## PR #72: revise narrowly

It is an additional instructional path, not just another vocabulary page. Its eight evidence-dependent visuals/tables, mandatory different-example recovery and visual FRQ make a useful contribution beyond the current overview/core path. Landscape layers, hierarchy versus proximity, historical place names, language distribution and adaptation are substantive applications.

| Decision dimension | Assessment |
|---|---|
| Topics 3.1–3.8 | All eight tagged, at least two items each; topic tags do not establish full essential-knowledge coverage. |
| Landscapes/diffusion | Useful evidence-based scenarios and contrasts; retain. |
| Maps/visuals | Eight schematics/tables; mobile readability evidence exists. They are not a substitute for mapped real-world language/religion distributions. |
| Wrong-answer recovery | New example required, original miss retained in summary. Better than simply repeating the identical stem. |
| Independent review | Promising structure, but refresh silently loses progress, writing is self-check only, and time has not been established with struggling students. |

Before merge: preserve question/retry position and FRQ drafts during refresh/navigation or give an explicit loss warning; add a regression for that behavior. Connect existing accurate vocabulary to the remaining essential-content gaps rather than expanding question volume. Do not claim full remediation of the separate application's retry mismatch. Verify only those changes and one keyboard path; no redesign or broad content rewrite is needed. Keep its release separate from scoring corrections.

## Pilot materials and evidence still needed

CLASSROOM_PILOT.md contains a practical 28-minute schedule, three unit choices, five baseline and five parallel exit questions per unit, keys, two-part first/revised FRQ criteria, paper feedback instrument, observation fields and proposed thresholds. It uses anonymous paper codes, normal accommodations and no external collection of real student work. Students complete one unit per session.

Actual pilot participants: **0**. Actual completion rate, median improvement, false-credit rate and misconception correction: **not measured**. Thresholds are proposed, not achieved. Human teacher labels are pending. App score increases or evaluator-controlled correct answers do not prove learning.

## Ranked blockers and next three priorities

1. **Scoring reliability:** the fresh holdout fails in every unit. Keep #74 and this follow-up unmerged. Choose a conservative, bounded verification rule that evaluates the complete required relationship or routes it to review; validate with human-labeled answers before release. Do not append endless phrase-specific exceptions.
2. **Workflow resilience:** verify the first-entry correction in real desktop/phone Chromium; revise #72's refresh loss before assigning its independent lab. Keep production/candidate evidence distinct and check only affected paths after an approved release.
3. **Classroom evidence:** after blockers clear, run the small paper-based pilot. Review every claimed verified FRQ point, record assistance and novel-item transfer, and use actual pre/post findings to select the next targeted development task.

No merge approval is requested while the scoring gate is red. Additional cosmetic work and content expansion can wait.
