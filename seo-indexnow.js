// Submit canonical public pages to IndexNow after production deploys.
const urls=[
  '/', '/what-is-aphug-study-buddy.html','/ap-human-geography-study-guide.html','/aphg-frq-practice.html','/aphg-practice-test.html',
  '/compare-aphg-study-tools.html','/about.html','/privacy.html',
  ...Array.from({length:7},(_,i)=>`/ap-human-geography-unit-${i+1}.html`)
];
const host='aphugstudybuddy.netlify.app';
const key='4b9d2f8a6c3147e5b0a1d9f3e8c672ab';
fetch('https://api.indexnow.org/indexnow',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({host,key,keyLocation:`https://${host}/indexnow-key.txt`,urlList:urls.map(x=>`https://${host}${x}`)})}).then(r=>{if(!r.ok&&r.status!==202)throw new Error(`IndexNow ${r.status}`);console.log(`IndexNow accepted ${urls.length} URLs`);});
