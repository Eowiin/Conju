// Conjugation lookup and answer grading, on top of the generated table
// (js/conjugations.js, built by tools/build_table.py).

const PRONOUNS = CONJ.persons;

// All accepted forms for a cell, the authoritative one first. [] if none.
function acceptedForms(verb, pronoun, tense) {
  const entry = CONJ.verbs[verb];
  if (!entry) return [];
  const cell = entry.t[tense];
  if (cell === undefined || cell === null) return [];
  const value = Array.isArray(cell) ? cell[PRONOUNS.indexOf(pronoun)] : cell;
  return value ? value.split("|") : [];
}

// The authoritative form, or null.
function conjugate(verb, pronoun, tense) {
  return acceptedForms(verb, pronoun, tense)[0] || null;
}

function getFullConjugation(verb, tense) {
  const persons = tense === "imperativo" ? PRONOUNS.slice(1) : PRONOUNS;
  return persons.map(p => ({ pronoun: p, form: conjugate(verb, p, tense) || "—" }));
}

// Case and extra spaces do not count; accents and ñ do.
function normalizeAnswer(s) {
  return String(s || "").normalize("NFC").toLowerCase().trim().replace(/\s+/g, " ");
}

// Same answer with every diacritic removed (á → a, ñ → n, ü → u).
function stripDiacritics(s) {
  return normalizeAnswer(s).normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// "correct", "accents" (right except for accents / ñ) or "wrong".
function grade(answer, forms) {
  const a = normalizeAnswer(answer);
  if (!a) return "wrong";
  if (forms.some(f => normalizeAnswer(f) === a)) return "correct";
  const bare = stripDiacritics(a);
  if (forms.some(f => stripDiacritics(f) === bare)) return "accents";
  return "wrong";
}
