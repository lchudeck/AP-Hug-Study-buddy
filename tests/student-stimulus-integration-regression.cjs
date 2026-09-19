const assert=require('node:assert/strict');
const fs=require('node:fs');

const app=fs.readFileSync('app.js','utf8');
const path=fs.readFileSync('student-success-path.js','utf8');
const home=fs.readFileSync('index.html','utf8');

assert.match(app,/q\.stimulus\?`<div class="box-info quiz-stimulus"/,'the standard practice quiz must render attached map, chart, and data stimuli');
assert.match(path,/Array\.isArray\(q\)[\s\S]*stimulus:q\.stimulus\|\|q\.visual\|\|''/,'the personalized practice normalizer must preserve stimuli attached to array-format quiz questions');
assert.doesNotMatch(home,/9th graders|ninth graders|ninth-grade|Grade 9/i,'the public student homepage must not position Study Buddy for one grade only');
assert.doesNotMatch(home,/teacher-builder\.html/,'the unfinished teacher-builder prototype must not appear in the student footer');

console.log('Student stimulus integration passed: core quiz and personalized practice preserve visuals; public homepage is grade-neutral.');
