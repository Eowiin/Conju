#!/usr/bin/env node
// Checks the conjugation table, the rule wording and the grading.
// Usage: node tests/check.js  (exit code 1 on failure)

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const ctx = vm.createContext({ console });
for (const file of ["i18n.js", "conjugations.js", "engine.js", "rules.js", "templates.js"]) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, "js", file), "utf8"), ctx, { filename: file });
}
const { T_TENSES, CONJ, acceptedForms, grade, getRule } = vm.runInContext(
  "({ T_TENSES, CONJ, acceptedForms, grade, getRule })", ctx);

let failures = 0;
function fail(msg) {
  failures++;
  if (failures <= 50) console.error("  ✗ " + msg);
}

// 1. Every exercise has valid forms and a clean rule in the three languages.
const SPANISH = /^[a-záéíóúüñ]+( [a-záéíóúüñ]+)*$/;
const LANGS = ["fr", "en", "pt"];
let exercises = 0;
for (const [tense, list] of Object.entries(T_TENSES)) {
  for (const ex of list) {
    exercises++;
    const where = `${ex.verb}/${tense}/${ex.pronoun}`;
    const forms = acceptedForms(ex.verb, ex.pronoun, tense);
    if (!forms.length) fail(`${where}: no form`);
    for (const f of forms) if (!SPANISH.test(f)) fail(`${where}: invalid form "${f}"`);
    for (const lang of LANGS) {
      const rule = getRule(ex.verb, tense, ex.pronoun, lang);
      if (!rule) fail(`${where} [${lang}]: no rule`);
      else if (/undefined|[{}]/.test(rule)) fail(`${where} [${lang}]: bad rule "${rule}"`);
    }
  }
}
console.log(`${exercises} exercises checked (forms + rules in ${LANGS.join("/")}).`);

// Every rule id used in the table has a text in every language.
const ids = new Set();
for (const v of Object.values(CONJ.verbs))
  for (const rules of Object.values(v.rules)) for (const r of rules) ids.add(r.id);
const RULE_TEXT = vm.runInContext("RULE_TEXT", ctx);
for (const id of ids) for (const lang of LANGS)
  if (!RULE_TEXT[lang][id]) fail(`rule "${id}" has no ${lang} text`);

// 2. Forms the old engine got wrong.
const FIXED = [
  ["buscar", "subjuntivo", "yo", "busque"],
  ["recordar", "subjuntivo", "yo", "recuerde"],
  ["empezar", "subjuntivo", "yo", "empiece"],
  ["llegar", "subjuntivo", "vosotros", "lleguéis"],
  ["querer", "subjuntivo_imperfecto", "yo", "quisiera"],
  ["decir", "subjuntivo_imperfecto", "yo", "dijera"],
  ["leer", "subjuntivo_imperfecto", "ellos", "leyeran"],
  ["pedir", "subjuntivo_imperfecto", "vosotros", "pidierais"],
  ["oír", "futuro", "yo", "oiré"],
  ["reír", "condicional", "ellos", "reirían"],
  ["cocinar", "imperativo", "él", "cocine"],
  ["jugar", "imperativo", "tú", "juega"],
  ["construir", "imperativo", "ellos", "construyan"],
  ["costar", "presente", "yo", "cuesto"],
  ["leer", "indefinido", "tú", "leíste"],
  ["volver", "perfecto", "yo", "he vuelto"],
  ["ir", "futuro_perifrastico", "nosotros", "vamos a ir"],
];
for (const [verb, tense, p, expected] of FIXED) {
  const got = acceptedForms(verb, p, tense);
  if (got[0] !== expected) fail(`${verb}/${tense}/${p}: expected ${expected}, got ${got.join("|") || "nothing"}`);
}
console.log(`${FIXED.length} previously wrong forms checked.`);

// 3. Grading.
const GRADES = [
  ["hablo", "hablar", "indefinido", "él", "accents"],
  ["habló", "hablar", "indefinido", "él", "correct"],
  ["  Habló ", "hablar", "indefinido", "él", "correct"],
  ["hablé", "hablar", "indefinido", "él", "wrong"],
  ["hablase", "hablar", "subjuntivo_imperfecto", "yo", "correct"],
  ["hablara", "hablar", "subjuntivo_imperfecto", "yo", "correct"],
  ["rio", "reír", "indefinido", "él", "correct"],
  ["rió", "reír", "indefinido", "él", "correct"],
  ["he  vuelto", "volver", "perfecto", "yo", "correct"],
  ["he vuelto", "volver", "perfecto", "yo", "correct"],
  ["", "hablar", "presente", "yo", "wrong"],
];
for (const [answer, verb, tense, p, expected] of GRADES) {
  const got = grade(answer, acceptedForms(verb, p, tense));
  if (got !== expected) fail(`grade("${answer}", ${verb}/${tense}/${p}) = ${got}, expected ${expected}`);
}
// ñ counts like an accent.
if (grade("ano", ["año"]) !== "accents") fail('grade("ano", ["año"]) should be "accents"');
console.log(`${GRADES.length + 1} grading cases checked.`);

if (failures) {
  console.error(`\n${failures} failure(s).`);
  process.exit(1);
}
console.log("\nAll checks passed.");
