const assert=require('node:assert/strict');
const fs=require('node:fs');
const tracker=fs.readFileSync('session-rating.js','utf8');
const home=fs.readFileSync('student-proof-v1.js','utf8');

assert.match(tracker,/aphgReadinessEvidenceV1/,'readiness evidence store missing');
assert.match(tracker,/Practice across all 7 units/,'all-unit readiness evidence missing');
assert.match(tracker,/s\.days\.length>=2/,'multi-day evidence requirement missing');
assert.match(tracker,/s\.mixed>=20/,'mixed-question evidence requirement missing');
assert.match(tracker,/s\.stimulus>=10/,'stimulus evidence requirement missing');
assert.match(tracker,/s\.frq>=1/,'FRQ evidence requirement missing');
assert.match(tracker,/Strong readiness evidence/,'strong-evidence label missing');
assert.doesNotMatch(tracker,/readiness[^\n]{0,80}%/i,'readiness should not be represented as a percentage');

assert.match(home,/Building evidence/,'low-evidence accuracy guard missing');
assert.match(home,/snap\.attempted>=10/,'accuracy should require a minimum evidence count');
assert.match(home,/does not turn limited practice into a precise “ready” percentage/,'student-facing readiness caution missing');
assert.match(home,/This is a quick snapshot, not a grade/,'progress caution missing');

console.log('Readiness evidence regression passed: coverage, spacing, mixed/stimulus practice, FRQ evidence, and low-evidence guards are present.');
