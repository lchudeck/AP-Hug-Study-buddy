const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM,VirtualConsole}=require('jsdom');

const root=path.resolve(__dirname,'..');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'};
const server=http.createServer((req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  const relative=pathname==='/'?'index.html':pathname.replace(/^\//,'');
  const file=path.resolve(root,relative);
  if(!file.startsWith(root)||!fs.existsSync(file)){res.writeHead(404);res.end('not found');return}
  res.setHeader('content-type',types[path.extname(file)]||'text/plain');
  res.end(fs.readFileSync(file));
});
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const port=server.address().port;
  const virtualConsole=new VirtualConsole();
  virtualConsole.on('jsdomError',error=>{if(!/googletagmanager/.test(String(error?.detail?.hostname||error?.message||'')))console.error(error.message)});
  const dom=await JSDOM.fromURL(`http://127.0.0.1:${port}/`,{
    resources:'usable',runScripts:'dangerously',pretendToBeVisual:true,
    virtualConsole,
    beforeParse(window){
      window.alert=()=>{};window.confirm=()=>false;window.scrollTo=()=>{};
      window.matchMedia=()=>({matches:false,addListener(){},removeListener(){}});
      window.requestAnimationFrame=callback=>window.setTimeout(callback,0);
      window.fetch=async()=>({ok:true,status:200,json:async()=>({}),text:async()=>''});
    }
  });
  await new Promise(resolve=>dom.window.addEventListener('load',resolve,{once:true}));
  await sleep(250);
  const {window}=dom,document=window.document;

  assert.ok(window.APHGSafeStorage,'safe storage loads before the application');
  assert.equal(document.querySelector('#aphg-reliability-notice'),null,'healthy browsers see no warning');

  const destinations=[/Unit Review/i,/FRQ Coach/i,/Maps & Visuals/i];
  for(const label of destinations){
    const button=[...document.querySelectorAll('#nav button')].find(item=>label.test(item.textContent));
    assert.ok(button,`navigation exposes ${label}`);
    button.click();await sleep(60);
    assert.ok((document.querySelector('#app')?.textContent||'').trim().length>30,`${label} opens nonblank content`);
  }

  // Exercise the complete script stack: rating must not race the authoritative analytics installation.
  assert.equal(document.querySelectorAll('script[src^="assets/analytics.js"]').length,1,'analytics loads exactly once');
  assert.equal(window.dataLayer.filter(x=>x[0]==='config').length,1,'GA4 is configured once');
  const eventCount=name=>window.dataLayer.filter(x=>x[0]==='event'&&x[1]===name).length;
  window.go('unitReview');
  const unit=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Unit 2');
  unit.click();assert.equal(eventCount('unit_selected'),1);
  window.urStart('quick',10);assert.equal(eventCount('practice_started'),1);
  window.go('terms');window.flashFlip();window.flashFlip();assert.equal(eventCount('flashcards_started'),1);
  window.go('frq');const response=document.getElementById('mainAnswer');
  response.value='PRIVATE ANALYTICS RESPONSE';
  response.dispatchEvent(new window.Event('input',{bubbles:true}));
  response.dispatchEvent(new window.Event('input',{bubbles:true}));
  assert.equal(eventCount('frq_practice_started'),1);
  window.go('exams');window.setExamAnswer(0,1);window.setExamAnswer(1,2);
  assert.equal(eventCount('practice_test_started'),1);
  window.go('apSim');window.simStart('mcq');assert.equal(eventCount('final_ap_started'),1);
  assert.ok(!JSON.stringify(window.dataLayer).includes('PRIVATE ANALYTICS RESPONSE'),'analytics excludes student work');

  const storagePrototype=Object.getPrototypeOf(window.localStorage);
  const originalSet=storagePrototype.setItem;
  storagePrototype.setItem=function(){throw new window.DOMException('blocked','QuotaExceededError')};
  assert.equal(window.APHGSafeStorage.setItem('reliability-test','kept-in-memory'),false,'failed persistence reports false');
  assert.equal(window.APHGSafeStorage.getItem('reliability-test'),'kept-in-memory','progress survives in memory');
  await sleep(20);
  assert.match(document.querySelector('#aphg-reliability-notice')?.textContent||'',/practice still works/i,'student sees a useful fallback notice');
  storagePrototype.setItem=originalSet;

  window.dispatchEvent(new window.ErrorEvent('error',{message:'PRIVATE STUDENT ANSWER',filename:'https://example.test/app.js?student=PRIVATE',lineno:12,colno:4}));
  const diagnostics=JSON.stringify(window.APHGSafeStorage.diagnostics());
  assert.ok(!diagnostics.includes('PRIVATE STUDENT ANSWER'),'diagnostics exclude error messages and student content');
  assert.ok(!diagnostics.includes('student=PRIVATE'),'diagnostics strip URL queries');
  assert.ok(diagnostics.includes('app.js'),'diagnostics retain useful technical filenames');

  virtualConsole.removeAllListeners('jsdomError');
  dom.window.close();server.close();
  console.log('Reliability browser regression passed: core routes, fail-soft storage, student notice, and privacy-safe diagnostics.');
})().catch(error=>{server.close();console.error(error);process.exit(1)});
