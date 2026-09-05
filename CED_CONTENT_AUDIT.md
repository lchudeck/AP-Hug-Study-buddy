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
- APHG task verbs include Compare, Define, Describe, Explain, and Identify.

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
- `unit-mastery-3-7.js` (review underway; Units 3–5 inspected)
- `final-freshman-polish.js`

## Corrections already implemented on this branch

`ced-content-audit-fixes.js` is loaded last and currently corrects:

1. World-systems/Wallerstein shorthand so the app describes structural unequal core–periphery relationships rather than intentional rich-country causation.
2. Outsourcing versus offshoring definitions and examples.
3. The main seven FRQs so student-facing task verbs use the official APHG task-verb family rather than `Apply`/`Evaluate`.
4. Unit 7 main FRQ so a company moving its own manufacturing abroad is correctly identified as offshoring rather than automatically outsourcing.
5. Exact CED topic metadata for legacy/untagged questions used by diagnostic and Unit Review systems.
6. Legacy Unit 7 topic-number drift (HDI/GII, world-systems theory, offshoring/commodity chains).
7. Gentrification diagnostic tagging from legacy Topic 6.11 to current Topic 6.10.
8. The forced-displacement source set formerly classified as Unit 4 / Topic 4.8; it now routes primarily to Unit 2 migration content.
9. Stimulus FRQ `Evaluate` tasks converted to `Explain`.
10. A population-pyramid visual MCQ now limits its conclusion to what the visual directly supports (high fertility/youthful structure), rather than claiming rapid natural increase from age structure alone.
11. The adaptive topic classifier now uses the corrected current-CED mapping.

## High-priority item still open

`practice-mastery.js` still creates cosmetic variants by prepending phrases such as “Choose the best answer” or “Use AP Human Geography reasoning” to the same underlying question. These are not genuine alternate questions and should be removed before this audit is called complete.

## Remaining audit work

- Finish review of remaining FRQ-feedback/grading scripts that can affect whether a correct student answer earns credit.
- Finish remaining Unit 3–7 mastery content inspection.
- Remove cosmetic Practice & Mastery variants while preserving enough unique questions per unit.
- Add regression checks for invalid APHG task verbs, outsourcing/offshoring conflation, known current-CED topic mappings, and duplicate/cosmetic stems.
- Run the branch through the repository validation workflows and inspect failures before opening/merging a PR.

Do not merge this branch until all items above are complete and automated checks pass.
