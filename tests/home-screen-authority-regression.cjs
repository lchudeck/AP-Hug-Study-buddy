const assert=require('node:assert/strict');
const fs=require('node:fs');

const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const routeLayer=fs.readFileSync('student-proof-v1.js','utf8');
const css=fs.readFileSync('student-proof-v1.css','utf8');
const polish=fs.readFileSync('final-freshman-polish.js','utf8');
const loadedScripts=[...html.matchAll(/<script src="([^"?]+)(?:\?[^\"]*)?"/g)].map(match=>match[1]);

assert.equal((app.match(/function homePage\s*\(/g)||[]).length,1,'app.js must have exactly one homePage implementation');
assert.equal(loadedScripts.includes('home-clarity.js'),false,'the legacy home override must not be loaded');
assert.doesNotMatch(fs.readFileSync('student-ux.js','utf8'),/homePage\s*=|function homePage\s*\(/,'the older student UX layer must not replace homePage');
assert.doesNotMatch(routeLayer,/homePage\s*=|function homePage\s*\(/,'the route layer must not replace homePage');
assert.doesNotMatch(app,/Start my 20-minute session|pyramid drill → one mixed FRQ|I need vocab help/,'legacy start cards must not remain in the authoritative home screen');
for(const route of ['test','learn','misses','vocab','maps','frq','ap'])assert.match(app,new RegExp(`\\['${route}'`),`missing student start route: ${route}`);
assert.match(app,/data-student-route="unsure"/,'missing student start route: unsure');
assert.match(routeLayer,/closest\('\[data-student-route\]'\)/,'home cards must use one delegated route handler');
assert.doesNotMatch(css,/#app[^}]*min-height|pointer-events|z-index/,'mobile home CSS must not rely on stacking or forced-height patches');
assert.match(polish,/function polishNav\(refresh=true\)/,'navigation polish must distinguish rendering from DOM-only updates');
assert.match(polish,/MutationObserver\(\(\)=>\{polishNav\(false\)/,'the observer must not rebuild navigation and trigger itself');
assert.match(polish,/countdown\.textContent!==text/,'countdown updates must be idempotent inside the observer');

console.log('Home authority regression passed: one renderer, eight routes, no legacy mobile override or stacking patch.');
