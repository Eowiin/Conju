const COMPOUND_TENSES = ["perfecto","pluscuamperfecto","futuro_perifrastico"];

const App = (()=>{
  let score=0, total=0, streak=0, answered=false, retried=false, current=null, history=[];
  let lang = "fr";

  function L() { return I18N[lang]; }

  function getLangTr(t) {
    if (lang === "en") return t.trEn || t.tr;
    if (lang === "pt") return t.trPt || t.tr;
    return t.tr;
  }

  function applyLang() {
    const l = L();
    document.getElementById("subtitle").textContent = l.subtitle;
    document.querySelector("label[for='sel-tense']").textContent = l.labelTense;
    document.getElementById("btn-reset").textContent = l.reset;
    document.getElementById("btn-next-label").textContent = l.newSentence;
    document.getElementById("btn-next").title = l.newSentenceTitle;
    document.getElementById("answer-input").placeholder = l.placeholder;
    document.getElementById("accent-bar").setAttribute("aria-label", l.accentBar);

    const selTense = document.getElementById("sel-tense");
    selTense.querySelectorAll("option").forEach(opt => {
      opt.textContent = l.tenses[opt.value] || opt.value;
    });

    if (current) render();
  }

  function pickExercise() {
    const tense = document.getElementById("sel-tense").value;
    const sourcePool = T_TENSES[tense] || T;
    let pool = sourcePool.filter(t => {
      if (tense==="imperativo" && t.pronoun==="yo") return false;
      return conjugate(t.verb, t.pronoun, tense) !== null;
    });
    if (!pool.length) pool = sourcePool;

    const recent = history.slice(-6);
    const fresh = pool.filter(t => !recent.includes(t.verb+"_"+t.pronoun));
    const candidates = fresh.length ? fresh : pool;
    const t = candidates[Math.floor(Math.random()*candidates.length)];
    const forms = acceptedForms(t.verb, t.pronoun, tense);
    history.push(t.verb+"_"+t.pronoun);
    current = { ...t, tense, forms, form: forms[0], conjugation:getFullConjugation(t.verb,tense) };
  }

  function render() {
    const c = current; if (!c) return;
    const l = L();
    const isCompound = COMPOUND_TENSES.includes(c.tense);
    document.getElementById("tense-badge").textContent = l.tenses[c.tense];
    document.getElementById("sentence-display").innerHTML =
      esc(c.pre) + " " + '<span class="blank">[___]</span>' + " " + esc(c.post);
    document.getElementById("hint-row").innerHTML =
      `<div class="pill">${l.verb} : <strong>${esc(c.verb)}</strong></div>` +
      `<div class="pill">${l.pronoun} : <strong>${esc(c.pronoun)}</strong></div>` +
      (isCompound ? `<div class="pill" style="color:var(--accent)">${l.fullForm}</div>` : "");
    document.getElementById("translation-display").textContent = "→ " + getLangTr(c);
    const inp = document.getElementById("answer-input");
    inp.value=""; inp.className=""; inp.disabled=false; inp.readOnly=false;
    inp.placeholder = l.placeholder;
    document.getElementById("btn-check").textContent = l.verify;
    document.getElementById("btn-check").disabled=false;
    document.getElementById("feedback").style.display="none";
    document.getElementById("feedback").className="";
    answered=false; retried=false;
    inp.focus();
  }

  function next() { pickExercise(); render(); }

  function check() {
    if (answered) { next(); return; }
    if (!current) return;
    const c = current;
    const l = L();
    const inp = document.getElementById("answer-input");
    const fb = document.getElementById("feedback");
    const userRaw = inp.value.trim();
    const result = grade(userRaw, c.forms);

    // Right except for accents: one more try, nothing counted yet.
    if (result === "accents" && !retried) {
      retried = true;
      inp.className = "almost";
      fb.className = "almost";
      fb.innerHTML = `<div class="fb-title">${esc(l.almost)}</div>`;
      fb.style.display = "block";
      inp.focus();
      return;
    }

    const ok = result === "correct";
    answered=true; total++;
    if (ok) { score++; streak++; } else { streak=0; }
    updateScore();
    inp.className = ok?"correct":"wrong"; inp.readOnly=true;
    inp.focus();

    const rule = getRule(c.verb, c.tense, c.pronoun, lang);
    let tableHtml = "";
    if (!COMPOUND_TENSES.includes(c.tense)) {
      tableHtml = '<div class="ct">' +
        c.conjugation.map(r=>{
          const isTarget = r.pronoun===c.pronoun;
          return `<span class="cp">${esc(r.pronoun)}</span><span class="cf${isTarget?" hl":""}">${esc(r.form)}</span>`;
        }).join("") + "</div>";
    }

    const shown = ok ? normalizeAnswer(userRaw) : c.form;
    const others = c.forms.filter(f => f !== shown);
    const alsoHtml = c.forms.length > 1
      ? `<div class="fb-also">${esc(l.alsoAccepted)} : <em>${others.map(esc).join(", ")}</em></div>`
      : "";
    const fullSentence = esc(c.pre)+" <em>"+esc(shown)+"</em> "+esc(c.post);
    fb.className = ok?"correct":"wrong";
    fb.innerHTML = ok
      ? `<div class="fb-title">${l.correct}</div><div class="fb-answer">${fullSentence}</div>${alsoHtml}<div class="fb-rule">${esc(rule)}${tableHtml}</div>`
      : `<div class="fb-title">${l.wrong} <em>${esc(c.form)}</em></div><div class="fb-answer">${l.yourAnswer} : <em>${esc(userRaw||l.empty)}</em></div>${alsoHtml}<div class="fb-rule">${esc(rule)}${tableHtml}</div>`;
    fb.style.display="block";
    document.getElementById("btn-check").textContent = l.next;
  }

  function updateScore() {
    const l = L();
    document.getElementById("score-display").textContent=score+" / "+total;
    const s=streak;
    document.getElementById("streak-display").textContent=s>=3?"🔥 "+l.streak+" : "+s:"";
  }

  function resetScore(){score=0;total=0;streak=0;updateScore();}

  function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}

  // Insert a letter at the cursor, replacing any selection.
  function insertChar(ch) {
    const inp = document.getElementById("answer-input");
    if (inp.readOnly || inp.disabled) return;
    const start = inp.selectionStart ?? inp.value.length;
    const end = inp.selectionEnd ?? start;
    inp.value = inp.value.slice(0, start) + ch + inp.value.slice(end);
    inp.setSelectionRange(start + ch.length, start + ch.length);
    inp.focus();
  }

  function bindEvents() {
    document.getElementById("btn-reset").addEventListener("click", resetScore);
    document.getElementById("btn-next").addEventListener("click", next);
    document.getElementById("btn-check").addEventListener("click", check);
    document.getElementById("sel-tense").addEventListener("change", next);
    document.querySelectorAll("#accent-bar button").forEach(btn => {
      // Keep the focus (and the cursor position) in the answer field.
      btn.addEventListener("mousedown", e => e.preventDefault());
      btn.addEventListener("click", () => insertChar(btn.dataset.char));
    });
    const dropdown = document.getElementById("lang-dropdown");
    document.getElementById("lang-current").addEventListener("click", e => {
      e.stopPropagation();
      dropdown.classList.toggle("open");
    });
    document.querySelectorAll(".lang-option").forEach(btn => {
      btn.addEventListener("click", () => {
        lang = btn.dataset.lang;
        document.querySelectorAll(".lang-option").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById("lang-current").textContent = btn.textContent;
        dropdown.classList.remove("open");
        applyLang();
      });
    });
    document.addEventListener("click", () => dropdown.classList.remove("open"));
    document.getElementById("answer-input").addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        check();
      }
    });
  }

  function init() {
    bindEvents();
    applyLang();
    next();
  }

  return {init};
})();

App.init();
