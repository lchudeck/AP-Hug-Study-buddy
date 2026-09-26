const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const read=file=>fs.readFileSync(file,'utf8');
const html=read('index.html');
const privacy=read('privacy.html');
const analytics=read('analytics.js');
const formScripts=['contact-report.js','student-feedback.js','session-rating.js'];
assert.match(read('session-rating.js'),/s\.src=['\"]analytics\.js\?v=[^'\"]+['\"]/, 'analytics dynamic load must be versioned');
assert.doesNotMatch(read('session-rating.js'),/s\.src=['\"]student-reliability-patch\.js['\"]/, 'do not inject an unversioned reliability patch');

assert.doesNotMatch(html,/name=["']reply-email["']/i,'student-facing forms must not request an email address');
assert.doesNotMatch(read('contact-report.js'),/report-reply|reply-email|type=["']email["']/i,'problem reports must not collect email addresses');
assert.match(privacy,/forms do not request a student name or email address/i,'privacy page must accurately describe feedback collection');

for(const file of formScripts){
  const source=read(file);
  const escaped=file.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  assert.match(html,new RegExp(`<script src=["']${escaped}\\?v=[^"']+["']`),
    `${file} must use a versioned URL so privacy fixes are not held behind a stale browser cache`);
  assert.doesNotMatch(source,/url\s*:\s*location\.href/,
    `${file} must not transmit query strings or fragments`);
  assert.match(source,/url\s*:\s*location\.origin\+location\.pathname/,
    `${file} must limit submitted page context to origin and path`);
  assert.match(source,/['"]bot-field['"]/,
    `${file} must submit a honeypot field`);
}

for(const formName of ['study-buddy-problem','study-buddy-feedback','study-buddy-session-rating']){
  const start=html.indexOf(`<form name="${formName}"`);
  assert.notEqual(start,-1,`missing Netlify form: ${formName}`);
  const end=html.indexOf('</form>',start);
  const form=html.slice(start,end);
  assert.match(form,/netlify-honeypot=["']bot-field["']/,`${formName} must enable Netlify honeypot filtering`);
  assert.match(form,/name=["']bot-field["']/,`${formName} must include its honeypot field`);
  assert.doesNotMatch(form,/name=["'](?:student-name|email|birthday|school-id|location|answer|frq)["']/i,
    `${formName} must not collect identity or student-work fields`);
}

assert.match(analytics,/page_location\s*:\s*location\.origin\+location\.pathname/,
  'analytics must omit query strings and fragments');
for(const setting of ['ad_storage','ad_user_data','ad_personalization']){
  assert.match(analytics,new RegExp(`${setting}\\s*:\\s*['"]denied['"]`),`${setting} must remain denied`);
}
assert.match(analytics,/allow_google_signals\s*:\s*false/,'Google signals must remain disabled');
assert.match(analytics,/const allowed=\['study_path','unit','feature','session_result','rating'\]/,
  'analytics event properties must stay on the non-PII allowlist');

const workflowDir='.github/workflows';
for(const name of fs.readdirSync(workflowDir).filter(name=>name.endsWith('.yml'))){
  const workflow=read(path.join(workflowDir,name));
  assert.match(workflow,/^permissions:\s*\n\s+contents:\s*read\s*$/m,
    `${name} must explicitly use read-only repository permissions`);
  const checkoutCount=(workflow.match(/uses:\s*actions\/checkout@v4/g)||[]).length;
  const hardenedCount=(workflow.match(/persist-credentials:\s*false/g)||[]).length;
  assert.equal(hardenedCount,checkoutCount,`${name} must not persist the GitHub token after checkout`);
}

console.log('Security/privacy regression passed: anonymous forms, minimized URLs, analytics guardrails, and read-only CI.');
