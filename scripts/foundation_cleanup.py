from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
text = INDEX.read_text(encoding="utf-8")

# 1) Remove the older duplicate homePage implementation. The newer Start Here
# implementation later in the file is the one browsers actually use.
old_home_start = text.find("// HOME PAGE\n// ═══════════════════════════════════════════\nfunction homePage(){")
old_home_end = text.find("// Stable answer shuffling so the correct answer is not always first.", old_home_start)
if old_home_start != -1 and old_home_end != -1:
    text = text[:old_home_start] + "// HOME PAGE (single implementation; legacy duplicate removed)\n\n" + text[old_home_end:]

# 2) Make the site accurate for the 2026-27 school year without inventing a
# 2027 College Board exam date that has not yet been published.
text = text.replace('<small>AP Exam</small>\n      <span class="date">May 5, 2026</span>',
                    '<small>2026–27 School Year</small>\n      <span class="date">2027 Exam</span>')

countdown_pattern = re.compile(r'function updateCountdown\(\)\{.*?\n\}\n', re.S)
countdown_replacement = '''function updateCountdown(){
  const el=document.getElementById("countdown");
  if(el){
    el.innerHTML=`<b style="color:#fde68a">Date TBA</b><br><span style="font-size:12px">College Board has not published the 2027 APHG exam date yet.</span>`;
  }
}
'''
text, countdown_count = countdown_pattern.subn(countdown_replacement, text, count=1)
if countdown_count != 1:
    raise RuntimeError("Could not update the exam countdown function")

# Replace the obsolete May-2026 emergency cram plan with a reusable year-long plan.
plan_start = text.find("function planPage(){")
plan_end = text.find("// ═══════════════════════════════════════════\n// QUIZ LOGIC", plan_start)
if plan_start == -1 or plan_end == -1:
    raise RuntimeError("Could not locate planPage")
plan_replacement = '''function planPage(){
  const plan=[
    {label:"Start of a unit",focus:"Build the foundation",tasks:"Read the assigned course text, then use Key Terms for the unit. Mark flashcards honestly: Got it only when you can explain the term without looking."},
    {label:"During the unit",focus:"Practice retrieval",tasks:"Complete 8–12 unit MCQs. Read every explanation. For a missed question, say why your choice was wrong and use the correct concept in a because sentence."},
    {label:"After core content",focus:"Apply the geography",tasks:"Use Models & Maps. Identify the model or scale, describe the visible pattern, then explain a geographic relationship using specific evidence."},
    {label:"Before the unit assessment",focus:"FRQ point practice",tasks:"Complete one scaffolded FRQ and one shorter drill. Label every part and match the task verb. Rewrite any response that does not earn the local rubric check."},
    {label:"Every 2–3 weeks",focus:"Spiral old content",tasks:"Take an adaptive mixed quiz. Revisit the two lowest-mastery units and practice their Need Practice flashcards."},
    {label:"After winter break",focus:"Mixed AP practice",tasks:"Begin combining current content with earlier units. Add stimulus questions, population/model/map drills, and one mixed FRQ each week."},
    {label:"6–8 weeks before the AP exam",focus:"Timed sections",tasks:"Use the AP Simulator under realistic timing. Build an error log by unit and skill, then target the patterns you miss most often."},
    {label:"Final week",focus:"Polish, don't cram",tasks:"Review Need Practice vocabulary, models, scale-of-analysis moves, and FRQ task verbs. Do short mixed sets and prioritize sleep and exam-day readiness."}
  ];
  return `<main>
    ${personalizedCoachHtml()}
    <section class="card" style="margin-bottom:18px">
      <h2>📅 2026–27 Study Plan</h2>
      <p>This is a year-long AP Human Geography routine. Use it alongside your class so review stays cumulative instead of turning into a last-minute cram.</p>
      <div class="box-info" style="margin:12px 0"><b>2027 AP exam date:</b> College Board has not published the official AP Human Geography date yet. The site will be updated when it is announced.</div>
    </section>
    <section class="card">
      ${plan.map(d=>`<div class="plan-day"><b>${d.label}</b><div class="focus">Focus: ${d.focus}</div><p>${d.tasks}</p></div>`).join("")}
    </section>
  </main>`;
}

'''
text = text[:plan_start] + plan_replacement + text[plan_end:]

# 3) Describe the browser-only rubric checker accurately. It is useful, but it
# does not call an AI model or external service.
replacements = {
    "Grade my answer with AI": "Check my answer",
    "Grade this FRQ": "Check this FRQ",
    "AI feedback": "rubric feedback",
    "Check with AI.": "Use the rubric check.",
    "for detailed, point-by-point feedback from AI.": "for point-by-point feedback from the built-in rubric checker.",
    "✦ Grading your answer…": "Checking your answer…",
    "This takes about 5–10 seconds.": "This check runs on your device.",
}
for old, new in replacements.items():
    text = text.replace(old, new)

# Add a clear disclosure to the FRQ feedback area.
text = text.replace(
    '<b>Two ways to get feedback:</b>',
    '<b>Two ways to get feedback:</b><p style="margin-top:8px;font-size:14px"><strong>About this checker:</strong> It uses built-in rubric rules and keyword/cause-effect checks in your browser. It is not an AI model and is not an official College Board score.</p>'
)

# 4) Track actual unit-by-unit quiz evidence instead of inferring unit accuracy
# from the student's overall score.
state_anchor = 'let adaptiveLevel=1; // 1=support, 2=developing, 3=AP challenge\n'
unit_state = '''let unitStats={};
try{unitStats=JSON.parse(localStorage.getItem("aphgUnitStats")||"{}");}catch(e){unitStats={};}
'''
if unit_state not in text:
    text = text.replace(state_anchor, state_anchor + unit_state)

choose_old = '''  stats.total++;
  if(c===q[3]) stats.correct++;
  else{missedUnits[q[0]]=(missedUnits[q[0]]||0)+1;lastMissed=q;}
  render();'''
choose_new = '''  stats.total++;
  const unitLabel=q[0];
  if(!unitStats[unitLabel]) unitStats[unitLabel]={attempted:0,correct:0};
  unitStats[unitLabel].attempted++;
  if(c===q[3]){ stats.correct++; unitStats[unitLabel].correct++; }
  else{missedUnits[unitLabel]=(missedUnits[unitLabel]||0)+1;lastMissed=q;}
  localStorage.setItem("aphgUnitStats",JSON.stringify(unitStats));
  render();'''
if choose_old not in text:
    raise RuntimeError("Could not locate chooseAnswer stats block")
text = text.replace(choose_old, choose_new, 1)

accuracy_pattern = re.compile(r'''function unitAccuracy\(unitId\)\{.*?\n\}''', re.S)
accuracy_replacement = '''function unitAccuracy(unitId){
  const label='Unit '+unitId;
  const s=unitStats[label]||{attempted:0,correct:0};
  if(!s.attempted) return null;
  return s.correct/s.attempted;
}'''
text, accuracy_count = accuracy_pattern.subn(accuracy_replacement, text, count=1)
if accuracy_count != 1:
    raise RuntimeError("Could not replace unitAccuracy")

mastery_pattern = re.compile(r'''function unitMastery\(unitId\)\{.*?\n\}''', re.S)
mastery_replacement = '''function unitMastery(unitId){
  const acc=unitAccuracy(unitId);
  const vocab=flashUnitMastery(unitId);
  const s=unitStats['Unit '+unitId]||{attempted:0};
  const vocabCards=flashcards.filter(c=>c.unit===unitId);
  const vocabRated=vocabCards.filter(c=>getFlashStatus(c)!=='new').length;
  // Do not manufacture a precise mastery percentage before the student has evidence.
  if(s.attempted<3 && vocabRated<3) return null;
  let weight=0, total=0;
  if(acc!==null){ total+=acc*.65; weight+=.65; }
  if(vocabRated){ total+=vocab*.35; weight+=.35; }
  return Math.max(0,Math.min(100,Math.round((total/weight)*100)));
}'''
text, mastery_count = mastery_pattern.subn(mastery_replacement, text, count=1)
if mastery_count != 1:
    raise RuntimeError("Could not replace unitMastery")

overall_pattern = re.compile(r'''function overallMastery\(\)\{.*?\n\}''', re.S)
overall_replacement = '''function overallMastery(){
  const scores=units.map(u=>unitMastery(u.id)).filter(v=>v!==null);
  return scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):null;
}'''
text, overall_count = overall_pattern.subn(overall_replacement, text, count=1)
if overall_count != 1:
    raise RuntimeError("Could not replace overallMastery")

text = text.replace("  const m=overallMastery();\n  if(m>=78)", "  const m=overallMastery();\n  if(m===null)return {level:1,label:'Getting Started',desc:'Complete a few unit questions and flashcards so the app has real evidence to use.'};\n  if(m>=78)", 1)

# Weak-unit ordering must handle units with insufficient evidence.
weak_old = ".sort((a,b)=>a.mastery-b.mastery || b.missed-a.missed);"
weak_new = ".sort((a,b)=>(a.mastery??101)-(b.mastery??101) || b.missed-a.missed);"
text = text.replace(weak_old, weak_new, 1)

# Avoid displaying 'null%' and make the dashboard explicit about insufficient evidence.
text = text.replace('const overall=overallMastery();', 'const overall=overallMastery();\n  const overallDisplay=overall===null?"Not enough evidence":overall+"%";', 1)
text = text.replace('style="width:${overall}%"', 'style="width:${overall===null?0:overall}%"', 1)
text = text.replace('${overall}% overall readiness · ${rec.label}', '${overallDisplay} · ${rec.label}', 1)
text = text.replace('const m=unitMastery(u.id);return `<div class="mastery-row"><b>Unit ${u.id}</b><div class="mastery-bar"><div class="mastery-fill" style="width:${m}%"></div></div><span>${m}%</span></div>`;',
                    'const m=unitMastery(u.id);const shown=m===null?"Need data":m+"%";return `<div class="mastery-row"><b>Unit ${u.id}</b><div class="mastery-bar"><div class="mastery-fill" style="width:${m===null?0:m}%"></div></div><span>${shown}</span></div>`;', 1)

# 5) Split the monolith into maintainable files without changing the design.
style_match = re.search(r'<style>\n?(.*?)\n?</style>', text, re.S)
script_matches = list(re.finditer(r'<script>\n?(.*?)\n?</script>', text, re.S))
if not style_match or len(script_matches) != 1:
    raise RuntimeError(f"Expected one style block and one script block; found style={bool(style_match)} scripts={len(script_matches)}")

css = style_match.group(1).strip() + "\n"
js = script_matches[0].group(1).strip() + "\n"
text = text[:style_match.start()] + '<link rel="stylesheet" href="styles.css">' + text[style_match.end():]
# Re-find script after the style replacement changed offsets.
script_match = re.search(r'<script>\n?(.*?)\n?</script>', text, re.S)
text = text[:script_match.start()] + '<script src="app.js"></script>' + text[script_match.end():]

INDEX.write_text(text, encoding="utf-8")
(ROOT / "styles.css").write_text(css, encoding="utf-8")
(ROOT / "app.js").write_text(js, encoding="utf-8")

print("Foundation cleanup complete")
print(f"index.html: {len(text):,} chars")
print(f"styles.css: {len(css):,} chars")
print(f"app.js: {len(js):,} chars")
