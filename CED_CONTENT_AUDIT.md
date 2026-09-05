# AP Study Buddy — Full CED Content Audit

Status: **In progress**

Audit branch: `full-ced-question-audit`
Base: main at `44656011116cf91cbea61170106b59cbc26deebd`

## Audit standard
Every student-facing MCQ, keyed answer, explanation, visual/data stimulus, FRQ task, and scoring/model point is being checked for:

- factual correctness;
- best-answer uniqueness;
- AP Human Geography Course and Exam Description alignment;
- exact CED topic placement where the app uses topic-level diagnosis;
- authentic APHG task verbs;
- clear distinction between commonly confused concepts;
- no cosmetic repeat questions that reward memorizing the stem rather than applying the concept.

## Official format/task-verb checks
Verified against current College Board AP Human Geography materials:

- 60 MCQs / 60 minutes / 50% of exam;
- 3 FRQs / 75 minutes / 50% of exam;
- FRQ stimulus pattern: 0, 1, and 2 sources;
- at least one FRQ assesses scale analysis;
- APHG FRQ task verbs are Compare, Define, Describe, Explain, and Identify.

The current College Board Course at a Glance also confirms the active 68-topic sequence, including Unit 7 as:

- 7.1 The Industrial Revolution
- 7.2 Economic Sectors and Patterns
- 7.3 Measures of Development
- 7.4 Women and Economic Development
- 7.5 Theories of Development
- 7.6 Trade and the World Economy
- 7.7 Changes as a Result of the World Economy
- 7.8 Sustainable Development

## Reviewed question/content files

- `app.js` core 35-question bank and seven main FRQs
- `ced-practice.js`
- `unit1-question-bank-v3.js`
- `units2-7-question-bank-v3.js`
- `exam-lab.js`
- `ap-simulator.js` major student-facing stimulus/mixed practice
- `student-readiness-upgrades.js` Map Lab, Use the Vocab, Final AP Mode content
- `image-mcq-bank.js`
- `stimulus-sets.js`
- `stimulus-sets-extra.js`
- `real-data-stimulus.js`
- `authentic-stimulus-v3.js`
- `adaptive-stimulus-v2.js`
- `visual-practice.js`
- `visual-practice-3-7.js`
- `stimulus-clusters-frq-v4.js`
- `unit-review.js`
- `practice-mastery.js`
- `frq-part-scoring.js`
- `topic-skill-adaptive.js`
- `ced-guide.js`
- `unit-foundations.js` (Units 1–2 instructional content)
- `unit-mastery-3-7.js` (Units 3–7 now inspected for topic sequence/content)
- `final-freshman-polish.js`

## Corrections already implemented on this branch

`ced-content-audit-fixes.js` is loaded last and currently corrects:

1. World-systems/Wallerstein shorthand so the app describes structural unequal core–periphery relationships rather than intentional rich-country causation.
2. Outsourcing versus offshoring definitions and examples.
3. The main seven FRQs so student-facing task verbs use the official APHG task-verb family rather than `Apply`/`Evaluate`.
4. Unit 7 main FRQ so a company moving its own manufacturing abroad is correctly identified as offshoring rather than automatically outsourcing.
5. Exact CED topic metadata for legacy/untagged questions used by diagnostic and Unit Review systems.
6. Legacy Unit 7 topic-number drift (HDI/GII, world-systems theory, offshoring/commodity chains) in question routing.
7. Gentrification diagnostic tagging from legacy Topic 6.11 to current Topic 6.10.
8. The forced-displacement source set formerly classified as Unit 4 / Topic 4.8; it now routes primarily to Unit 2 migration content.
9. Stimulus FRQ `Evaluate` tasks converted to `Explain`.
10. A population-pyramid visual MCQ now limits its conclusion to what the visual directly supports (high fertility/youthful structure), rather than claiming rapid natural increase from age structure alone.
11. The adaptive topic classifier now uses the corrected current-CED mapping.

## Newly confirmed high-priority findings

### 1. `unit-mastery-3-7.js` Unit 7 sequence is not current-CED aligned
The Unit 7 mastery lesson currently omits **7.4 Women and Economic Development**, then shifts later material one topic early and inserts a standalone **Industrial Location** lesson at 7.6. That conflicts with the current College Board sequence above.

This is more than a label problem: a student using topic-level remediation could be sent to the wrong Unit 7 lesson. The content itself is useful, but it must be reorganized so:

- women/economic development is restored at 7.4;
- development theories are 7.5;
- trade/world economy is 7.6;
- industrial-location/global-production concepts are placed under the appropriate current 7.2/7.6/7.7 framework rather than replacing a CED topic;
- changes resulting from the world economy are 7.7;
- sustainable development remains 7.8.

### 2. `practice-mastery.js` still creates cosmetic duplicate questions
It prepends phrases such as “Choose the best answer” and “Use AP Human Geography reasoning” to the same underlying stem. Those are not genuine alternate questions and can reward stem memorization. This must be removed before the audit is complete.

### 3. `frq-part-scoring.js` can falsely reject valid APHG answers
The local grader currently requires word overlap with a single model answer. College Board scoring permits multiple valid examples and explanations when they satisfy the task. A correct student response using different but valid geographic evidence can therefore receive an incorrect 0/1 from Study Buddy.

The nonsense guard and command-word structure checks are useful, but the grader should not present single-model lexical matching as authoritative AP scoring. Before completion, this needs either broader accepted-answer logic or student-facing language that clearly treats the result as a conservative coaching check and surfaces valid alternative examples.

### 4. Non-CED verbs remain in some mastery coaching text
`unit-mastery-3-7.js` still uses “Evaluate” in several skill prompts (for example urban sustainability and Von Thünen limitations). These are reasonable classroom thinking moves, but when presented as AP-style response practice they should be rewritten with the official FRQ task-verb family, usually as an `Explain` prompt that asks for a limitation, benefit/tradeoff, or degree of effectiveness.

## Remaining audit work

- Repair the Unit 7 mastery sequence/content mapping.
- Finish FRQ-feedback/grading changes so valid alternate responses are not falsely marked wrong.
- Remove cosmetic Practice & Mastery variants while preserving a truthful practice-count UI.
- Replace remaining AP-style `Evaluate` prompts with current APHG task verbs where appropriate.
- Add regression checks for invalid APHG task verbs, outsourcing/offshoring conflation, Unit 7 current-CED topic mapping, known topic-routing corrections, and duplicate/cosmetic stems.
- Run the branch through repository validation workflows and inspect failures before opening/merging a PR.

Do not merge this branch until all items above are complete and automated checks pass.
