# Units 1–3 FRQ Coach candidate

## Recommendation: CONDITIONAL

No merge or deployment authorized. Main baseline: 90c9eca. PR #71 remains an open, conflicting draft; only its relevant Unit 1/3 rules, Unit 2 paraphrases and original test fixtures were reused. Its Unit Review/table changes and Unit 4–7 rules are excluded.

## Findings and changes

- Main already rejects the reported immigration/workforce reversal. Existing Unit 2 regression bank passes before changes. The main problem remains correct paraphrases receiving uncertain results and immediate model disclosure.
- Bounded criteria recognize more supported wording, retain unknown wording for review and block explicit reversals. No word-overlap credit or external API.
- Three student-facing outcomes: verified, not yet demonstrated, needs rubric review. A self-check records reflection only; it cannot change a score.
- One first attempt and one revision, original response retained, score change shown separately, models available after revision or an explicit skip. Original single-point drills remain available separately.
- Browser-tab session storage persists draft, original, revision and self-check across navigation/refresh. Closing the tab ends persistence. Storage failure is tolerated; persistence then cannot be guaranteed.
- Corrected the aging-policy model to explicitly connect later retirement to adults remaining employed; the earlier list of policies had an overly general mechanism.
- Removed the mandatory connector-word instruction from these Coach sessions. No grammar scoring.

## Accuracy evidence

Original synthetic rubric-labeled fixtures reused from PR #71, not actual student submissions and **not independently scored by a human teacher in this session**. Expectations precede rule execution. This is a development response bank, not evidence of AP-reader agreement.

| Bank | Main | Candidate |
|---|---:|---:|
| Supported correct/model/paraphrases, 63 responses | 32/63 (50.8%) | 63/63 (100%) |
| Partial/vague/reversed/vocabulary traps/irrelevant, 126 responses, false credit | 0/126 (0%) | 0/126 (0%) |

The 63 correct responses include 21 models and 42 independently worded variants. The policy model changed, so the model portion is not a completely identical pre/post bank; the two paraphrase sets are identical. Model recognition alone is not independent validation.

Existing Unit 2 bank: 80 five-level examples + 18 alternatives + 4 contradictions pass. Existing scorer regression and scoped Unit 2 integration pass. Served-page DOM test checks all 42 paraphrases with actual patched prompt wording, three original/revision sessions, no model before revision, and self-assessment cannot award credit.

## Academic reference

College Board AP Human Geography CED retrieved November 7, 2026:
https://apcentral.collegeboard.org/media/pdf/ap-human-geography-course-and-exam-description.pdf

These are original Study Buddy practice criteria, not official College Board scoring guidelines. Coverage is the existing three Coach prompts, not all possible FRQs in each unit. Content focus: Unit 1 topics 1.1–1.3 and 1.5–1.6; Unit 2 population composition, DTM, aging, population policies and migration (2.3–2.5, 2.7–2.8, 2.10–2.12); Unit 3 cultural diffusion, language and consequences (3.2–3.7). No claim of comprehensive unit coverage. Deterministic recognition cannot establish academic correctness for arbitrary prose.

## Browser verification

Local system Chromium and Playwright Chromium could not launch: environment socket/ptrace restrictions. **No successful local real-browser validation.** DOM testing is explicitly separate. Added a PR-only Chromium workflow that exercises Units 1, 2 and 3 at 1280×900 and 390×844, original mistakes, revision, self-check safety, model timing, refresh/navigation persistence, overflow and page errors. Physical phones, Safari and Firefox are not tested. Record remote results separately if available.

## Limitations and remaining gates

- Human teacher review of point-level bank and additional unseen responses remains necessary. Correctness rate is limited to this finite synthetic bank.
- Short or unfamiliar valid responses may remain unverified. Conditional, negated, multi-claim and adversarial vocabulary-rich prose are outside semantic guarantees. Do not keep expanding regexes indefinitely.
- Generic unrecognized text receives rubric review, not definitive zero; explicit captured contradictions and blank/nonsense receive not-yet feedback.
- No observed student learning gains. Score changes can reflect feedback use, and are labeled accordingly.
- Initial delivery remains within the existing 48-script/1,000,000-byte budget. Coach UI and Unit 1/3 rules load after startup. If that optional file fails, existing conservative Coach remains available.
- Real-browser check and independent teacher validation must pass before READY. No merging or deploying in this task.
