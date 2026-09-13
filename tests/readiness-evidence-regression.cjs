const assert=require('node:assert/strict'),fs=require('node:fs');
const tracker=fs.readFileSync('session-rating.js','utf8'),home=fs.readFileSync('student-proof-v1.js','utf8');
assert.match(tracker,/aphgReadinessEvidenceV1/);assert.match(tracker,/Practice across all 7 units/);assert.match(tracker,/x\.d\.length>=2/);assert.match(tracker,/x\.m>=20/);assert.match(tracker,/x\.s>=10/);assert.match(tracker,/x\.f>=1/);assert.match(tracker,/Strong readiness evidence/);assert.doesNotMatch(tracker,/readiness[^\n]{0,80}%/i);
assert.match(home,/Building evidence/);assert.match(home,/s\.attempted>=10/);assert.match(home,/does not turn limited practice into a precise “ready” percentage/);assert.match(home,/This is a quick snapshot, not a grade/);
console.log('Readiness evidence regression passed.');
