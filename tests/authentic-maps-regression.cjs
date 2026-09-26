const assert=require('node:assert/strict');
const fs=require('node:fs');
const zlib=require('node:zlib');
const vm=require('node:vm');

const data=JSON.parse(fs.readFileSync('data/us-state-map-2020.json','utf8'));
const route=fs.readFileSync('visual-learning.js','utf8');
const maps=fs.readFileSync('final-freshman-polish.js','utf8');
const stimulus=fs.readFileSync('real-data-stimulus.js','utf8');
// The failed TIGERweb export remains in source for restoration, but is not student-facing.
const context={window:{}};vm.createContext(context);vm.runInContext(stimulus,context);
assert.ok(!context.window.APHG_REAL_DATA_SETS.some(s=>s.id==='real-census-urban'));
assert.ok(!context.window.APHG_REAL_DATA_QUESTIONS.some(q=>q.setId==='real-census-urban'));
assert.match(stimulus,/id:'real-census-urban'/,'restore the Census source set when a real image is available');
function distinctPixels(file){
  const png=fs.readFileSync(file),signature=Buffer.from('89504e470d0a1a0a','hex');
  assert.ok(png.subarray(0,8).equals(signature),`${file} must be a PNG`);
  let offset=8,width=0,height=0,bpp=0,packed=[];
  while(offset<png.length){const len=png.readUInt32BE(offset),type=png.toString('ascii',offset+4,offset+8),chunk=png.subarray(offset+8,offset+8+len);offset+=12+len;
    if(type==='IHDR'){width=chunk.readUInt32BE(0);height=chunk.readUInt32BE(4);assert.equal(chunk[8],8,'expected 8-bit image');assert.equal(chunk[12],0,'interlaced image needs an explicit decoder');bpp={2:3,6:4}[chunk[9]];assert.ok(bpp,'expected RGB or RGBA image');}
    if(type==='IDAT')packed.push(chunk);
  }
  const bytes=zlib.inflateSync(Buffer.concat(packed)),stride=width*bpp,previous=Buffer.alloc(stride);let pos=0,first=null;
  for(let row=0;row<height;row++){
    const filter=bytes[pos++],current=Buffer.from(bytes.subarray(pos,pos+stride));pos+=stride;
    for(let i=0;i<stride;i++){const left=i>=bpp?current[i-bpp]:0,above=previous[i],corner=i>=bpp?previous[i-bpp]:0;
      const p=left+above-corner,pa=Math.abs(p-left),pb=Math.abs(p-above),pc=Math.abs(p-corner);
      const predictor=filter===0?0:filter===1?left:filter===2?above:filter===3?Math.floor((left+above)/2):filter===4?(pa<=pb&&pa<=pc?left:pb<=pc?above:corner):null;
      assert.notEqual(predictor,null,`${file} has unsupported PNG filter`);current[i]=(current[i]+predictor)&255;
    }
    for(let i=0;i<stride;i+=bpp){const pixel=current.subarray(i,i+bpp).toString('hex');if(first===null)first=pixel;else if(pixel!==first)return true;}
    current.copy(previous);
  }
  return false;
}
for(const set of context.window.APHG_REAL_DATA_SETS){
  for(const match of set.stimulus.matchAll(/<img[^>]*\bsrc=\"(data\/[^\"]+\.png)\"/g)){
    assert.ok(distinctPixels(match[1]),`${set.id} uses a solid-color image that cannot support map interpretation`);
  }
}

for(const file of ['real-data-stimulus.js','final-freshman-polish.js','visual-learning.js']){
  assert.doesNotMatch(fs.readFileSync(file,'utf8'),/<img\b[^>]*\bsrc=[\"']https?:\/\//i,`${file} must not render a remote image`);
}
assert.match(stimulus,/data\/census-urban-2020\.png/);

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
