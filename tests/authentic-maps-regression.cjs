const assert=require('node:assert/strict');
const fs=require('node:fs');

const data=JSON.parse(fs.readFileSync('data/us-state-map-2020.json','utf8'));
const route=fs.readFileSync('visual-learning.js','utf8');
const maps=fs.readFileSync('final-freshman-polish.js','utf8');

assert.equal(data.states.length,51,'map must include 50 states plus District of Columbia');
assert.equal(data.states.reduce((sum,state)=>sum+state.population,0),331449281,'population snapshot must match the official 2020 U.S. resident total');
assert.ok(data.states.every(state=>state.id&&state.name&&state.population>0&&state.path.startsWith('M')&&Number.isFinite(state.cx)&&Number.isFinite(state.cy)),'every area needs a real path, centroid, name, and population');
assert.equal(new Set(data.states.map(state=>state.id)).size,51,'state identifiers must be unique');

assert.doesNotMatch(route,/cdn\.jsdelivr|api\.census\.gov|fetch\(/,'route bridge must not fetch or render a competing map screen');
assert.match(route,/window\.openMapsVisuals/,'legacy route must delegate to the authoritative map renderer');
assert.match(maps,/fetch\('data\/us-state-map-2020\.json/,'authoritative renderer must load only the bundled map snapshot');
assert.doesNotMatch(maps,/cdn\.jsdelivr|api\.census\.gov/,'authoritative maps must not depend on a public runtime service');
assert.match(maps,/No live public API or AI-generated map is used/,'students must be told where the real map comes from');
assert.match(maps,/This example uses raw totals/,'choropleth limitation must be explicit');

console.log('Authentic maps regression passed: one renderer, 51 real boundaries, verified Census total, no live dependency.');
