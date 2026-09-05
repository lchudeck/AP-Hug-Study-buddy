# AP Study Buddy — Full CED Content Audit

Status: **Complete**

Audit branch: `full-ced-question-audit`
Base: main at `44656011116cf91cbea61170106b59cbc26deebd`
Pull request: #21

## Audit standard
Every identified student-facing MCQ bank, keyed answer, explanation, visual/data stimulus, FRQ task/model point, mastery lesson, and topic-level diagnostic route was reviewed for:

- factual correctness;
- best-answer uniqueness;
- current AP Human Geography Course and Exam Description alignment;
- correct CED unit/topic placement where the app uses topic-level diagnosis;
- authentic APHG task verbs;
- accurate distinctions between commonly confused concepts;
- no cosmetic repeat questions that reward memorizing a stem instead of applying a concept;
- appropriate limits on automatic FRQ scoring.

## Official College Board checks
Verified against the current College Board AP Human Geography course/exam materials:

- 60 MCQs / 60 minutes / 50% of exam;
- approximately 30–40% of MCQs reference stimulus material;
- 3 FRQs / 75 minutes / 50% of exam;
- FRQ stimulus pattern: 0, 1, and 2 sources;
- at least one FRQ assesses scale analysis;
- common APHG FRQ task verbs: Compare, Define, Describe, Explain, and Identify;
- 68-topic CED sequence across Units 1–7;
- current Unit 7 sequence:
  - 7.1 The Industrial Revolution
  - 7.2 Economic Sectors and Patterns
  - 7.3 Measures of Development
  - 7.4 Women and Economic Development
  - 7.5 Theories of Development
  - 7.6 Trade and the World Economy
  - 7.7 Changes as a Result of the World Economy
  - 7.8 Sustainable Development

## Reviewed student-facing content

- `app.js` core question bank and main FRQs
- `ced-practice.js`
- `unit1-question-bank-v3.js`
- `units2-7-question-bank-v3.js`
- `exam-lab.js`
- `ap-simulator.js`
- `student-readiness-upgrades.js` Map Lab, Use the Vocab, and Final AP Mode
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
- `unit-foundations.js`
- `unit-mastery-3-7.js`
- `final-freshman-polish.js`
- vocabulary/flashcard content used by the student practice routes

## Corrections implemented

1. **World-systems/Wallerstein wording** now describes structural unequal core–periphery relationships instead of implying deliberate intent by wealthy countries to keep poorer countries poor.
2. **Outsourcing and offshoring** are distinguished correctly. Outsourcing is contracting work to an outside firm; offshoring is moving a business activity to another country. They can overlap but are not synonyms.
3. **Main FRQ task verbs** were aligned to the common APHG FRQ verb family rather than serving `Apply`/`Evaluate` as labeled FRQ verbs.
4. **Unit 7 main FRQ** now identifies a company moving its own manufacturing abroad as offshoring rather than automatically outsourcing.
5. **Legacy question topic metadata** was repaired so diagnostics and Unit Review route questions to current CED topics.
6. **Legacy Unit 7 topic-number drift** was corrected for HDI/GII, world-systems theory, trade/global production, offshoring, and commodity-chain content.
7. **Gentrification routing** was corrected from legacy Topic 6.11 to current Topic 6.10 where appropriate.
8. **Forced-displacement stimulus content** formerly classified as Unit 4 was moved to Unit 2 migration content, with push-factor items routed to 2.10 and displacement-status items to 2.11.
9. **Stimulus FRQ `Evaluate` labels** were converted to APHG-aligned `Explain` tasks where the student-facing prompt represented AP-style FRQ practice.
10. **Population-pyramid interpretation** was narrowed to what the visual actually supports; age structure can support an inference about high fertility/youthfulness but cannot by itself prove rapid natural increase without mortality information.
11. **Adaptive topic classification** now uses corrected current-CED mappings.
12. **Practice & Mastery cosmetic variants** were removed. The app no longer creates fake new questions by prepending phrases such as “Choose the best answer” or “Use AP Human Geography reasoning” to an unchanged stem.
13. **Practice & Mastery CED tags** were corrected for hierarchical diffusion (3.4), Von Thünen practice (5.8), and world-systems theory (7.5).
14. **Unit 7 mastery lessons** were rebuilt to match the current eight-topic CED sequence, restoring 7.4 Women and Economic Development and placing theories, trade, world-economy changes, and sustainability under the correct topic numbers.
15. **Industrial-location concepts** were retained without replacing a required CED topic; they now live inside the appropriate Unit 7 economic-sector/world-economy framework.
16. **Remaining mastery prompts labeled `Evaluate` as AP-style tasks** were rewritten as `Explain` tasks that ask for limitations, tradeoffs, or degree of effectiveness.
17. **Local FRQ auto-scoring** still strictly rejects blank/nonsense responses, but it no longer presents single-model keyword matching as official College Board scoring. Plausible alternate wording is explicitly flagged for rubric/self-check instead of being treated as authoritative proof that the AP point was lost.
18. **Map scale vs. scale of analysis** remains explicitly distinguished, and the audited map questions correctly teach that changing the scale of analysis can reveal or conceal spatial patterns.

## Validation results

On PR #21, the audit branch passed all repository checks that ran against the code changes:

- CED alignment validation — passed
- Content Quality Audit — passed
- PR3 AP Exam Lab validation — passed
- PR4 student UX validation — passed
- PR5 Unit Foundations validation — passed
- PR6 Practice Mastery validation — passed
- PR6 Ninth Grade Fast Audit — passed
- Student Success Path validation — passed
- Final Freshman Polish validation — passed
- Teacher trust and student feedback validation — passed
- Netlify deploy preview — passed

## Final conclusion

The reviewed student-facing question inventory is now suitable as the content baseline for AP Study Buddy. The keyed MCQ answers and explanations reviewed in this audit are factually defensible and CED-aligned, known topic-routing errors have been corrected, stimulus/scale practice is aligned to APHG skills, and FRQ feedback is framed appropriately for a local practice tool.

A local rules-based FRQ grader cannot duplicate human College Board scoring across every possible valid response. For that reason, Study Buddy now treats uncertain alternate wording as a coaching/rubric-check case rather than claiming an official 0/1 judgment.

PR #21 should be reviewed and merged only with explicit approval; this audit does not merge itself into `main`.
