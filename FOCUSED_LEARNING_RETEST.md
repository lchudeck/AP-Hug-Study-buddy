# Focused learning fixes and retest — October 31, 2026

## Scope and versions

Base: main `d6692c677d5520222a6f0428ad998c659f7e2136`. This branch incorporates the existing, unmerged work from PR #67 (`a8584e8`) and PR #68 (`a1f38d6`) through Git ancestry, then adds the cross-course corrections below. Those PRs were not merged on GitHub. PR #66 is untouched. No production deployment was requested.

Production's downloaded FRQ scorer exactly matches main (SHA-256 `142ab1254752db2809946d4041a5f51bc81b45579e66a57f6c7a47504279ebe6`). This establishes the scorer version, not the deployment commit for every asset.

Reference: official College Board AP Human Geography CED, https://apcentral.collegeboard.org/media/pdf/ap-human-geography-course-and-exam-description.pdf, and June 2026 clarifications, https://apcentral.collegeboard.org/media/pdf/ap-human-geography-course-and-exam-description-clarifications.pdf. Clarifications concern front matter, resource locations and Progress Check wording; the affected topic mappings remain 6.10 (urban change), 7.3 (development measures), and 7.6 (trade/world economy).

## Reproduction and corrections

| Failure | Main before | Working branch after |
|---|---|---|
| Seven exact reversed/incorrect FRQ cases in request | All seven awarded verified credit | All seven receive no verified point, with task-specific reasoning guidance |
| Additional unfamiliar wrong/reversed answers | New regression cases | Six additional cases receive no verified point; tested through shared simulator scorer too |
| Aging pyramid / elderly dependency alternatives | Both unverified | Both verified; no length or “because” requirement |
| Full Coach models | U1 and U3: 6/7; others 7/7 | All seven units: 7/7 through Coach submission |
| Topic 2.1 retry | Mixed-topic deck reproduced (randomized composition differs from prior audit) | Exact topic only; at most five unique questions; honest shorter/empty state |
| Planner visual shortcut | Numeric positions address shuffled list | Unit lookup; 70 selections with reordered lists pass |
| Served CED tags | Gentrification 6.11; GDP comparison 7.1; HDI 7.2; production-chain source 7.4 | Sources and assembled practice now use 6.10, 7.3 and 7.6 respectively; topic evidence/retry checked |
| Introductory pyramids | Missing labels in multiple served copies | Age groups, sex labels, percent axes and explicit hypothetical-data note |
| District / Von Thünen intros | Conditional definition / question usable without rings | Read boundary plus missing voter evidence; select labeled ring and explain distance cost |
| Housing-policy distractors | Unrelated border / DTM choices | Plausible redevelopment choices; explanation distinguishes affordability protection from demand increases |

No reported target was already fixed on main. Unit 2 improvements existed in open PRs and were reused. No claim is made that every item in each unit was reviewed.

## Validation

Local, full-script-order JSDOM checks (simulation, **not real-browser visual validation**):

- Seven Coach submission/model/rewrite flows; wrong responses through both Coach UI and shared simulator grading. Thirteen incorrect/reversed cases, eleven valid alternatives, partial/vague/blank/nonsense samples.
- Existing Unit 2 matrix: 80 five-level responses, 18 alternatives and four contradictions; actual Coach, simulator and shared drills.
- Units 1–7: entry to teaching, topic retry to results, 25-question practice sessions with feedback/recovery and stimuli, bounded Unit Review retries and completion. Planner introductory visuals checked for every unit across ten reorderings.
- Relevant existing checks passed: FRQ scoring, Unit 2 integration/instructional work, beta blockers, exam failure, practice-exam quality, readiness evidence, stimulus integration/depth, student/unified question quality, reliability DOM routes and authentic-map assets. Changed-JS syntax and whitespace checks passed. The old Student Success Path CI assertion required the broken numeric route; it was updated to require unit lookup, while the DOM regression exercises actual shuffled routing.
- Map asset checks verify 51 real US boundaries and the Census population total, and reject flat-color image assets. These do not establish browser readability or enlargement behavior.

The interactive browser failed before navigation: `bwrap: Can't create file at /home/agent/.codex/sessions: Read-only file system`. The installed Playwright package also has no Chromium executable. No screenshots, rendered visual inspection, mobile visual validation or preview-browser pass is claimed.

## Remaining issues

1. **High — release validation:** real-browser final validation remains outstanding, including displayed labels/legends, image loading, enlargement and representative student progression on a preview.
2. **Medium — FRQ scope:** conservative local rules are not a semantic AP reader. Unsupported alternate wording receives rubric review, and complex contradictions can exceed their coverage. Beyond supported tasks, only the curated model text is automatically verified; other answers receive honest review guidance. This prevents generic word-overlap credit but increases self-check burden. Separate keyword-based tools that do not use the shared scorer were not certified.
3. **Medium — existing release gate:** main already exceeds the 48-script / 1,000,000-byte startup budget. The combined branch retains 49 scripts and approximately 1.06 MB of initial JavaScript. The gate was not weakened or addressed through an unrelated startup refactor.
4. **Medium — existing simulator limitation:** PR #66's simulator stimulus-preservation correction remains separate and unmerged. The full production simulator should not be described as visually validated by this work.

## Three-perspective verdicts

- **CED alignment reviewer:** the sampled corrections are defensible and the affected topic labels now align. Limited sampling and conservative FRQ checks do not establish complete AP-exam readiness or College Board endorsement.
- **AP teacher:** stronger misconception feedback, exact-topic recovery and usable introductory evidence tasks. Suitable for a limited, teacher-supported beta after browser checks; open-response feedback still needs rubric judgment.
- **Ninth-grade student:** simulated paths finish with clear next steps. Rubric-review feedback is more honest but may still require teacher help. Readability, enlargement and physical-device behavior remain unverified.

Scores below are provisional judgments of the sampled working-branch content and simulated flows, not measured student outcomes. Scale: 1 weak, 3 usable with limitations, 5 strong. Usability scores exclude visual validation.

| Unit | Accuracy | AP rigor | Maps/stimuli | Feedback | FRQ readiness | Usability |
|---|---:|---:|---:|---:|---:|---:|
| 1 | 4 | 3 | 3 | 3 | 2 | 3 |
| 2 | 4 | 4 | 4 | 4 | 3 | 3 |
| 3 | 4 | 3 | 3 | 3 | 2 | 3 |
| 4 | 4 | 3 | 3 | 3 | 2 | 3 |
| 5 | 4 | 3 | 3 | 3 | 2 | 3 |
| 6 | 4 | 3 | 3 | 3 | 2 | 3 |
| 7 | 4 | 3 | 3 | 3 | 2 | 3 |

**Readiness: Limited beta, provisional. Recommendation: fix a few focused items first.** Keep this PR unmerged until the existing release gate is resolved and a real-browser preview check covers the changed paths. The smallest instructional validation step is that preview check; no broad audit is proposed.

## Continuation — October 31, 2026 (real-browser pass)

Branch `claude/gifted-keller-n3vb76`, stacked on `focused-learning-retest` (#69).

**Fixes**
- *FRQ Coach, off-task replies (regression from #69):* the new rubric-review fallback told students that gibberish or one-word off-task replies ("qwrty", "random") "may earn credit". This failed the PR6 ninth-grade audit in CI. Short replies (≤4 words) that share no idea with the task or model now get a clear **Too brief** status with task guidance, in both the course rubric and the Unit 2 rubric. No point is inferred; contradiction messages are unchanged.
- *FRQ Coach, exact model match:* "The site." now verifies like "Site." (a leading article is ignored).
- *Data tables on phones:* the global `overflow-wrap:anywhere` split table headings mid-word ("Earli/er"). Table cells now use `break-word`.
- Scorer and stylesheet cache versions were bumped.

**Real Chromium (Playwright, local static server; production not tested)**
- Units 1–7 Unit Check (25 questions each, 390 px): every session reached results. All 175 questions were distinct within their unit, each had exactly one keyed answer and showed an explanation for right and wrong choices. There were no page errors.
- Units 1–7 Unit Review "Start here": every session reached results with a CED topic breakdown. A struggling student's concept retries extend the 10-question set to 17–35 questions.
- 100 rendered data tables at 320/390/768 px had no horizontal overflow, and headings wrapped on whole words.
- Visual practice banks for Units 1–7: images and SVGs rendered, with no broken stimuli; each bank ran to completion.
- FRQ Coach, all seven prompts: model answers scored 7/7; vague answers 0/7; gibberish 0/7 ("Too brief"). Vocabulary-only answers scored 0–1/7, and each single point was an Identify part whose answer is that term.

**Not verified:** physical devices, Safari/Firefox, production after deploy, and enlargement/zoom behaviour. The performance-budget check fails on main as well (49 scripts against a limit of 48); it is not addressed here.

## Continuation — November 1, 2026

Branch `claude/gifted-keller-n3vb76` from main `c5d6b53`.

- **FRQ Coach paraphrases:** 36 of 49 Coach parts verified only an exact copy of the model answer. Each now has a bounded rule in `frq-course-rules.js`, and six older rules and five Unit 2 rules were widened. `tests/frq-paraphrase-regression.cjs` covers 49 parts × 7 responses: two correct wordings must verify, while partial, vague, reversed, vocabulary-only and keyword-trap answers must not. A second, independently written set scored 43/49 correct and 48/49 wrong rejected on first pass; the gaps it found were fixed and added to the test. The rules load after startup, which keeps the JavaScript budget.
- **Unit Review:** retries no longer chain. Before, a Chromium run turned a 10-question review into 45 questions; now it is at most 20, and retries are counted separately ("Retry 3 of 9").
- **Enlarge visual:** tables no longer use a 700px minimum width, which hid the Value column at 320px and at 200% zoom.
- **Browser coverage:** Chromium only, since WebKit and Firefox are not installed here. The check covered 320/390/768/1280px and an emulated 200% zoom for Units 1–7 (35 combinations: enlarge opens and closes, focus returns, no page overflow, no errors). At 320px three wide numeric tables need a sideways swipe; nothing does at 390px.
- **Not verified:** production, because this environment's network policy blocks `www.apstudybuddy.com`. Also not verified: Safari, Firefox and physical devices.
