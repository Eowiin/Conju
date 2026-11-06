#!/usr/bin/env python3
"""Build the verified conjugation table for Conju.

A cell (verb, tense, person) enters the table only when two independent
sources give the same form:

  V  verbecc (pip package, rule-based conjugator)
  J  Fred Jehle's Spanish verb database (CSV, downloaded to tools/cache/)
  A  analogy with a model verb taken from Jehle (for verbs Jehle lacks or
     verbecc mishandles), transposed on the last vowel of the stem
  R  the regular participle rule (participle only)

When no pair of sources agrees, the build stops and lists the cells. Hand
decisions live in tools/overrides.json, each with a mandatory reason.

Compound tenses and the periphrastic future are not read from any source:
they are built from the verified participle and the verified forms of
haber and ir.

For every verb and tense, the script also works out which rule explains the
forms, with the verb's real forms as parameters. js/rules.js words them.

Outputs: data/conjugations.json and js/conjugations.js (const CONJ = ...).

Usage: tools/.venv/bin/python tools/build_table.py
"""

import csv
import json
import logging
import os
import re
import sys
import unicodedata
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS = os.path.join(ROOT, "tools")
CACHE = os.path.join(TOOLS, "cache")
JEHLE_URL = ("https://raw.githubusercontent.com/ghidinelli/"
             "fred-jehle-spanish-verbs/master/jehle_verb_database.csv")
JEHLE_CSV = os.path.join(CACHE, "jehle_verb_database.csv")

PERSONS = ["yo", "tú", "él", "nosotros", "vosotros", "ellos"]
SIMPLE = ["presente", "indefinido", "imperfecto", "futuro", "condicional",
          "subjuntivo", "subjuntivo_imperfecto", "imperativo"]
SINGLE = ["gerundio", "participio"]
COMPOUND = ["perfecto", "pluscuamperfecto", "futuro_perifrastico"]

VERBECC_MAP = {
    "presente": ("indicativo", "presente"),
    "indefinido": ("indicativo", "pretérito-perfecto-simple"),
    "imperfecto": ("indicativo", "pretérito-imperfecto"),
    "futuro": ("indicativo", "futuro"),
    "condicional": ("condicional", "presente"),
    "subjuntivo": ("subjuntivo", "presente"),
    "subjuntivo_imperfecto": ("subjuntivo", "pretérito-imperfecto-1"),
    "imperativo": ("imperativo", "afirmativo"),
    "gerundio": ("gerundio", "gerundio"),
    "participio": ("participo", "participo"),  # sic: verbecc's spelling
}
JEHLE_MAP = {
    "presente": ("Indicativo", "Presente"),
    "indefinido": ("Indicativo", "Pretérito"),
    "imperfecto": ("Indicativo", "Imperfecto"),
    "futuro": ("Indicativo", "Futuro"),
    "condicional": ("Indicativo", "Condicional"),
    "subjuntivo": ("Subjuntivo", "Presente"),
    "subjuntivo_imperfecto": ("Subjuntivo", "Imperfecto"),
    "imperativo": ("Imperativo Afirmativo", "Presente"),
}
JEHLE_COLS = ["form_1s", "form_2s", "form_3s", "form_1p", "form_2p", "form_3p"]

# Model verb (present in Jehle) for verbs Jehle lacks or verbecc mishandles.
ANALOGY = {
    "cantar": "hablar", "pasar": "hablar",
    "discutir": "vivir", "existir": "vivir", "dividir": "vivir",
    "poseer": "leer",
    "concluir": "construir",
    "gobernar": "pensar", "despertar": "pensar", "confesar": "pensar",
    "comprender": "comer",
    "doler": "mover", "llover": "mover",
}

VOWELS = "aeiouáéíóúü"
ACCENT = {"a": "á", "e": "é", "i": "í", "o": "ó", "u": "ú"}
UNACCENT = {v: k for k, v in ACCENT.items()}


# ─── small helpers ─────────────────────────────────────────────────────────

def strip_accents(s):
    return "".join(UNACCENT.get(c, c) for c in s)


def variants(cell):
    """'a|b' -> ['a', 'b']; None -> []."""
    return cell.split("|") if cell else []


def first(cell):
    return cell.split("|")[0] if cell else None


def vtype(inf):
    return strip_accents(inf[-2:])


def vstem(inf):
    return inf[:-2]


def is_vowel(c):
    return c in VOWELS


def syllables(word):
    """Rough syllable count, enough to spot monosyllables (dio, vi, rio)."""
    w = word.lower()
    if w.endswith("y"):
        w = w[:-1] + "i"
    count, i = 0, 0
    while i < len(w):
        if w[i] in VOWELS:
            j = i
            while j < len(w) and w[j] in VOWELS:
                j += 1
            group = w[i:j]
            # q/g + u is silent
            if i > 0 and w[i - 1] in "qg" and group[0] == "u" and len(group) > 1:
                group = group[1:]
            strong = sum(1 for c in group if c in "aeoáéóíú")
            count += max(strong, 1)
            i = j
        else:
            i += 1
    return count


def mono(word):
    """RAE 2010: monosyllables take no written accent (dio, vio, rio, hui)."""
    if syllables(word) == 1:
        return strip_accents(word)
    return word


def attach(stem, end, y=True):
    """stem + ending with the regular spelling adjustments.

    - a stressed i after a, e, o takes an accent: leí, leímos, oímos, leído
    - an unstressed i between vowels becomes y (leyó, construyó) when y=True
    - stem ending in i absorbs the ending's i (ri + ió -> rió)
    - monosyllables lose their accent
    """
    if end and stem:
        last = stem[-1]
        if stem[-2:] in ("gu", "qu"):
            last = "g"                 # silent u: siguió, not *siguyó
        if end[0] == "i" and last == "i":
            end = end[1:]
        elif end[0] == "i" and len(end) > 1 and end[1] in VOWELS and last in "aeouü":
            if y:
                end = "y" + end[1:]
        elif end[0] == "i" and last in "aeo":
            end = "í" + end[1:]
    if not stem and end.startswith("ie"):
        end = "y" + end[1:]          # ir -> yendo
    return mono(stem + end)


def last_vowel_index(stem):
    """Index of the last real vowel of a stem (the u of gu/qu is silent)."""
    for i in range(len(stem) - 1, -1, -1):
        c = stem[i]
        if c in VOWELS:
            if c in "uü" and i > 0 and stem[i - 1] in "gq" and i == len(stem) - 1:
                continue
            if c == "u" and i > 0 and stem[i - 1] in "gq" and i + 1 < len(stem) and stem[i + 1] in "eiéí":
                continue
            return i
    return -1


def change_segment(a, b):
    """Segment that changes from stem a to stem b, e.g. pens -> piens: e -> ie.

    The minimal diff can be empty on one side (pens/piens -> '' / 'i'); it is
    widened towards the original vowel: to the right for e -> ie, to the left
    for jug/jueg (u -> ue) or constru/construy (u -> uy).
    """
    p = 0
    while p < min(len(a), len(b)) and a[p] == b[p]:
        p += 1
    s = 0
    while s < min(len(a), len(b)) - p and a[len(a) - 1 - s] == b[len(b) - 1 - s]:
        s += 1
    sa, sb = a[p:len(a) - s], b[p:len(b) - s]
    if not sa:
        if p < len(a) and is_vowel(a[p]):
            sa, sb = a[p], b[p:p + len(sb) + 1]
        elif p > 0 and is_vowel(a[p - 1]):
            sa, sb = a[p - 1], b[p - 1:p + len(sb)]
    return sa, sb


# ─── source V: verbecc ─────────────────────────────────────────────────────

class Verbecc:
    def __init__(self):
        logging.disable(logging.CRITICAL)
        from verbecc import CompleteConjugator
        self.c = CompleteConjugator(lang="es")
        self.errors = []

    def get(self, verb, tense):
        mood, t = VERBECC_MAP[tense]
        try:
            res = json.loads(str(self.c.conjugate_mood_tense(verb, mood, t)))
        except Exception as e:  # pasar, gobernar... crash on some tenses
            self.errors.append(f"{verb}/{tense}: {type(e).__name__}: {e}")
            return None
        if tense in SINGLE:
            return [set(res[0]["c"])] if res else None
        cells = [None] * 6
        for entry in res:
            pr = entry.get("pr")
            if pr not in PERSONS:
                continue
            forms = set()
            for f in entry["c"]:
                if tense != "imperativo" and f.startswith(pr + " "):
                    f = f[len(pr) + 1:]
                forms.add(f)
            cells[PERSONS.index(pr)] = forms
        return cells


# ─── source J: Jehle ───────────────────────────────────────────────────────

class Jehle:
    def __init__(self):
        if not os.path.exists(JEHLE_CSV):
            os.makedirs(CACHE, exist_ok=True)
            print(f"Downloading Jehle's database to {os.path.relpath(JEHLE_CSV, ROOT)}")
            urllib.request.urlretrieve(JEHLE_URL, JEHLE_CSV)
        self.rows = {}
        self.extra = {}
        with open(JEHLE_CSV, encoding="utf-8") as fh:
            for r in csv.DictReader(fh):
                key = (r["infinitive"], r["mood"], r["tense"])
                self.rows.setdefault(key, r)
                self.extra.setdefault(r["infinitive"], r)

    def has(self, verb):
        return verb in self.extra

    def get(self, verb, tense):
        if verb not in self.extra:
            return None
        if tense == "gerundio":
            g = self.extra[verb]["gerund"].strip()
            return [g or None]
        if tense == "participio":
            p = self.extra[verb]["pastparticiple"].strip()
            return [p or None]
        r = self.rows.get((verb,) + JEHLE_MAP[tense])
        if not r:
            return None
        return [r[c].strip() or None for c in JEHLE_COLS]


# ─── source A: analogy with a model verb ───────────────────────────────────

def transpose(model, target, form):
    """Carry a form of the model verb over to the target verb.

    Both stems are aligned on their last vowel (pens / gobern). The segment
    of the model's form at that place is: the vowel intact -> the target's
    vowel; the vowel accented -> the target's vowel accented; anything else
    (ie, ue) -> kept as is. pienso -> gobierno, leyó -> poseyó.
    """
    ms, ts = vstem(model), vstem(target)
    mi, ti = last_vowel_index(ms), last_vowel_index(ts)
    mpre, mvow, mpost = ms[:mi], ms[mi], ms[mi + 1:]
    tpre, tvow, tpost = ts[:ti], ts[ti], ts[ti + 1:]
    if not form.startswith(mpre):
        return None
    start = len(mpre)
    if mpost:
        j = form.find(mpost, start + 1)
        if j < 0:
            return None
    else:
        j = start + 1
    seg, rest = form[start:j], form[j + len(mpost):]
    if seg == mvow:
        seg = tvow
    elif seg == ACCENT.get(mvow):
        seg = ACCENT.get(tvow, tvow)
    return tpre + seg + tpost + rest


def analogy(jehle, verb, tense):
    model = ANALOGY.get(verb)
    if not model:
        return None
    cells = jehle.get(model, tense)
    if cells is None:
        return None
    return [transpose(model, verb, f) if f else None for f in cells]


def regular_participle(verb):
    stem = vstem(verb)
    return attach(stem, "ado" if vtype(verb) == "ar" else "ido")


# ─── resolution ────────────────────────────────────────────────────────────

def consensus(sources):
    """sources: {name: set of forms}. Returns (form or None, agreeing pairs)."""
    names = [n for n, s in sources.items() if s]
    agreed = {}
    for i, a in enumerate(names):
        for b in names[i + 1:]:
            for f in sources[a] & sources[b]:
                agreed.setdefault(f, set()).update((a, b))
    if len(agreed) == 1:
        return next(iter(agreed)), agreed
    return None, agreed


def load_overrides():
    path = os.path.join(TOOLS, "overrides.json")
    if not os.path.exists(path):
        return {}
    with open(path, encoding="utf-8") as fh:
        data = json.load(fh)
    bad = [k for k, v in data.items() if not k.startswith("_") and not str(v.get("reason", "")).strip()]
    if bad:
        sys.exit("overrides.json: missing reason for " + ", ".join(bad))
    return {k: v for k, v in data.items() if not k.startswith("_")}


def se_form(ra):
    """-ra subjunctive -> -se subjunctive (dijera -> dijese, dijéramos -> dijésemos)."""
    return re.sub(r"ra(s|mos|is|n)?$", lambda m: "se" + (m.group(1) or ""), ra)


def build_cells(verbs, vc, jh, overrides):
    table, conflicts, log = {}, [], []
    used = set()
    moot = []

    def override_for(verb, tense, k=None):
        if k is None:
            key = f"{verb}/{tense}"
            if key in overrides:
                used.add(key)
                return key, overrides[key]["forms"]
            return None, None
        key1 = f"{verb}/{tense}/{PERSONS[k]}"
        if key1 in overrides:
            used.add(key1)
            return key1, overrides[key1]["forms"]
        key2 = f"{verb}/{tense}"
        if key2 in overrides:
            used.add(key2)
            return key2, overrides[key2]["forms"][k]
        return None, None

    for verb in verbs:
        t = {}
        for tense in SIMPLE + SINGLE:
            V = vc.get(verb, tense)
            J = jh.get(verb, tense)
            A = analogy(jh, verb, tense)
            n = 1 if tense in SINGLE else 6
            cells = []
            for k in range(n):
                if tense == "imperativo" and k == 0:
                    cells.append(None)
                    continue
                src = {
                    "verbecc": V[k] if V and V[k] else set(),
                    "jehle": {J[k]} if J and J[k] else set(),
                    "analogy": {A[k]} if A and A[k] else set(),
                }
                if tense == "participio":
                    src["regular"] = {regular_participle(verb)}
                form, agreed = consensus(src)
                key, ov = override_for(verb, tense, None if n == 1 else k)
                where = f"{verb}/{tense}" + ("" if n == 1 else f"/{PERSONS[k]}")
                if ov is not None:
                    if form is not None and form == ov:
                        moot.append(f"{key} ({where}: sources already agree on {form})")
                    cells.append(ov)
                    continue
                if form is None:
                    conflicts.append((where, {s: sorted(v) for s, v in src.items() if v}))
                    cells.append(None)
                else:
                    cells.append(form)
            t[tense] = cells[0] if n == 1 else cells
        table[verb] = t

    unused = [k for k in overrides if k not in used]
    return table, conflicts, moot, unused


def add_derived(table):
    haber, ir = table["haber"], table["ir"]
    for verb, t in table.items():
        t["subjuntivo_imperfecto"] = [
            "|".join(variants(c) + [se_form(v) for v in variants(c) if se_form(v) != v])
            for c in t["subjuntivo_imperfecto"]]
        part = t["participio"]
        t["perfecto"] = [f"{first(h)} {part}" for h in haber["presente"]]
        t["pluscuamperfecto"] = [f"{first(h)} {part}" for h in haber["imperfecto"]]
        t["futuro_perifrastico"] = [f"{first(f)} a {verb}" for f in ir["presente"]]


# ─── rules ─────────────────────────────────────────────────────────────────

ENDS = {
    "presente": {"ar": ["o", "as", "a", "amos", "áis", "an"],
                 "er": ["o", "es", "e", "emos", "éis", "en"],
                 "ir": ["o", "es", "e", "imos", "ís", "en"]},
    "indefinido": {"ar": ["é", "aste", "ó", "amos", "asteis", "aron"],
                   "er": ["í", "iste", "ió", "imos", "isteis", "ieron"],
                   "ir": ["í", "iste", "ió", "imos", "isteis", "ieron"]},
    "imperfecto": {"ar": ["aba", "abas", "aba", "ábamos", "abais", "aban"],
                   "er": ["ía", "ías", "ía", "íamos", "íais", "ían"],
                   "ir": ["ía", "ías", "ía", "íamos", "íais", "ían"]},
    "futuro": ["é", "ás", "á", "emos", "éis", "án"],
    "condicional": ["ía", "ías", "ía", "íamos", "íais", "ían"],
    "subjuntivo": {"ar": ["e", "es", "e", "emos", "éis", "en"],
                   "er": ["a", "as", "a", "amos", "áis", "an"],
                   "ir": ["a", "as", "a", "amos", "áis", "an"]},
}
STRONG = ["e", "iste", "o", "imos", "isteis", "ieron"]
TU_IRREGULAR = {"decir": "di", "hacer": "haz", "ir": "ve", "poner": "pon",
                "salir": "sal", "ser": "sé", "tener": "ten", "venir": "ven"}
WHO = {2: "usted", 3: "nosotros", 5: "ustedes"}
SUBJ_IRREGULAR = {"dar", "estar", "haber", "ir", "saber", "ser"}


def ends_str(ends):
    return ", ".join("-" + e for e in ends)


def forms_str(forms, idx=range(6)):
    return ", ".join(first(forms[k]) for k in idx if forms[k])


def R(id_, **p):
    return {"id": id_, "p": p}


def regular(stem, ends, y=False):
    return [attach(stem, e, y) for e in ends]


def strip_end(form, end):
    return form[:-len(end)] if form.endswith(end) else None


def stem_change_candidates(stem):
    """-ir 3rd person / gerund stems: last vowel e -> i, o -> u (pid-, durm-)."""
    i = last_vowel_index(stem)
    if i < 0:
        return []
    swap = {"e": "i", "o": "u"}.get(stem[i])
    return [stem[:i] + swap + stem[i + 1:]] if swap else []


def ar_ortho(base, before_e=True):
    """Spelling change before e: c -> qu, g -> gu, z -> c."""
    for a, b in (("c", "qu"), ("g", "gu"), ("z", "c")):
        if base.endswith(a):
            return base[:-1] + b, a, b
    return base, None, None


def rule_presente(verb, f):
    typ, stem = vtype(verb), vstem(verb)
    ends = ENDS["presente"][typ]
    reg = regular(stem, ends)
    if f == reg:
        return [R("pres_reg", stem=stem + "-", ends=ends_str(ends))], True
    boot = [strip_end(f[k], ends[k]) for k in (1, 2, 5)]
    others_reg = f[3] == reg[3] and f[4] == reg[4]
    if boot[0] and boot.count(boot[0]) == 3 and boot[0] != stem and others_reg:
        s2 = boot[0]
        frm, to = change_segment(stem, s2)
        ex = forms_str(f, (1, 2, 5))
        nv = forms_str(f, (3, 4))
        rules = []
        if to == frm + "y":                         # -uir, oír
            if f[0] == s2 + "o":
                return [R("pres_y", ex=forms_str(f, (0, 1, 2, 5)), nv=nv)], True
            if f[0].endswith("go"):
                return [R("pres_go_y", yo=f[0], ex=ex, nv=nv)], True
            return [R("irr", forms=forms_str(f))], False
        kind = "pres_diph" if to in ("ie", "ue") else "pres_stem"
        if f[0] == attach(s2, "o"):
            rules.append(R(kind, frm=frm, to=to, ex=forms_str(f, (0, 1, 2, 5)), nv=nv))
        elif f[0].endswith("go") and not (s2.endswith("gu") and f[0] == s2[:-1] + "o"):
            rules.append(R(kind + "_go", yo=f[0], frm=frm, to=to, ex=ex, nv=nv))
        elif s2.endswith("g") and f[0] == s2[:-1] + "jo":
            rules.append(R(kind, frm=frm, to=to, ex=forms_str(f, (0, 1, 2, 5)), nv=nv))
            rules.append(R("yo_j", yo=f[0]))
        elif s2.endswith("gu") and f[0] == s2[:-1] + "o":
            rules.append(R(kind, frm=frm, to=to, ex=forms_str(f, (0, 1, 2, 5)), nv=nv))
            rules.append(R("yo_gu", yo=f[0]))
        else:
            return [R("irr", forms=forms_str(f))], False
        return rules, True
    if f[1:] == reg[1:]:
        yo = f[0]
        if yo.endswith("zco") and stem.endswith("c"):
            return [R("pres_zco", yo=yo, inf=verb)], True
        if stem.endswith("g") and yo == stem[:-1] + "jo":
            return [R("pres_reg", stem=stem + "-", ends=ends_str(ends)), R("yo_j", yo=yo)], True
        if yo.endswith("go"):
            return [R("pres_go", yo=yo)], True
        return [R("pres_yo", yo=yo)], True
    return [R("irr", forms=forms_str(f))], False


def rule_indefinido(verb, f):
    typ, stem = vtype(verb), vstem(verb)
    ends = ENDS["indefinido"][typ]
    reg = regular(stem, ends)
    if f == reg:
        return [R("pret_reg", stem=stem + "-", ends=ends_str(ends))], True
    if f == regular(stem, ends, y=True):
        r = [R("pret_y", el=f[2], ellos=f[5])]
        if stem[-1] in "aeo":
            r.append(R("pret_i_accent", ex=forms_str(f, (1, 3, 4))))
        return r, True
    if typ == "ar" and f[1:] == reg[1:]:
        base, a, b = ar_ortho(stem)
        if a and f[0] == base + "é":
            return [R("pret_reg", stem=stem + "-", ends=ends_str(ends)),
                    R("pret_ortho", yo=f[0], frm="-" + a + "ar", to="-" + b + "é")], True
    if typ == "ar" and f == regular(stem, ENDS["indefinido"]["er"]):
        return [R("pret_dar", forms=forms_str(f))], True
    if typ == "ir":
        for s3 in stem_change_candidates(stem):
            if f == [reg[0], reg[1], attach(s3, "ió"), reg[3], reg[4], attach(s3, "ieron")]:
                frm, to = change_segment(stem, s3)
                return [R("pret_reg", stem=stem + "-", ends=ends_str(ends)),
                        R("pret_ir3", frm=frm, to=to, el=f[2], ellos=f[5])], True
    if f[0].endswith("e") and f[2].endswith("o"):
        s = f[0][:-1]
        s_o = s[:-1] + "z" if s.endswith("c") else s
        j = s.endswith("j")
        exp = [s + "e", s + "iste", s_o + "o", s + "imos", s + "isteis",
               s + ("eron" if j else "ieron")]
        if f == exp:
            r = [R("pret_strong", stem=s + "-", yo=f[0], el=f[2])]
            if j:
                r.append(R("pret_strong_j", ellos=f[5]))
            if s_o != s:
                r.append(R("pret_strong_z", el=f[2]))
            return r, True
    return [R("irr", forms=forms_str(f))], False


def rule_imperfecto(verb, f):
    typ, stem = vtype(verb), vstem(verb)
    ends = ENDS["imperfecto"][typ]
    if f == regular(stem, ends):
        return [R("impf_reg", stem=stem + "-", ends=ends_str(ends))], True
    if verb in ("ser", "ir", "ver"):
        return [R("impf_irr3", forms=forms_str(f))], True
    return [R("irr", forms=forms_str(f))], False


PREFIX = {"futuro": "fut", "condicional": "cond"}


def rule_fut_cond(verb, f, tense):
    ends = ENDS[tense]
    yo_end = ends[0]
    base_inf = strip_accents(verb)
    if f == [base_inf + e for e in ends]:
        r = [R(PREFIX[tense] + "_reg", inf=base_inf, ends=ends_str(ends))]
        if base_inf != verb:
            r.append(R("fut_accent", inf=verb, base=base_inf))
        return r, True
    base = strip_end(f[0], yo_end)
    if base and f == [base + e for e in ends]:
        stem = vstem(base_inf)
        if base == stem + "dr":
            kind = "fut_irr_d"
        elif base == stem + "r":
            kind = "fut_irr_drop"
        else:
            kind = "fut_irr_short"
        return [R(PREFIX[tense] + "_irr", base=base + "-", ends=ends_str(ends)),
                R(kind, inf=verb, base=base + "-")], True
    return [R("irr", forms=forms_str(f))], False


def rule_subjuntivo(verb, f, t):
    typ, stem = vtype(verb), vstem(verb)
    ends = ENDS["subjuntivo"][typ]
    yo = first(t["presente"][0])
    if verb in SUBJ_IRREGULAR or not yo.endswith("o"):
        return [R("subj_irr", inf=verb, yo=yo, forms=forms_str(f))], verb in SUBJ_IRREGULAR
    base = yo[:-1]
    obase, a, b = ar_ortho(base) if typ == "ar" else (base, None, None)
    main = [attach(obase, ends[k]) for k in range(6)]
    if [f[k] for k in (0, 1, 2, 5)] != [main[k] for k in (0, 1, 2, 5)]:
        return [R("irr", forms=forms_str(f))], False
    rules = [R("subj_yo", yo=yo, base=base + "-", ends=ends_str(ends),
               ex=forms_str(f, (0, 1, 2, 5)))]
    if a:
        rules.append(R("subj_ortho", frm=a, to=b, ex=f[0]))
    nv = [f[3], f[4]]
    if nv == [main[3], main[4]]:
        return rules, True
    istem = ar_ortho(stem)[0] if typ == "ar" else stem
    if nv == [attach(istem, ends[3]), attach(istem, ends[4])]:
        rules.append(R("subj_nv_inf", nos=f[3], vos=f[4], stem=stem + "-"))
        return rules, True
    for s3 in stem_change_candidates(stem):
        if nv == [attach(s3, ends[3]), attach(s3, ends[4])]:
            frm, to = change_segment(stem, s3)
            rules.append(R("subj_nv_ir", nos=f[3], vos=f[4], frm=frm, to=to))
            return rules, True
    return [R("irr", forms=forms_str(f))], False


def rule_subj_imperfecto(verb, f, t):
    ellos = first(t["indefinido"][5])
    base = strip_end(ellos, "ron")
    if base:
        ra = [base + "ra", base + "ras", base + "ra", None, base + "rais", base + "ran"]
        i = len(base) - 1
        while i >= 0 and base[i] not in "aeiou":
            i -= 1
        ra[3] = base[:i] + ACCENT[base[i]] + base[i + 1:] + "ramos" if i >= 0 else None
        if [first(c) for c in f] == ra:
            return [R("subji", ellos=ellos, base=base + "-", ex=forms_str(f),
                      se=variants(f[0])[1])], True
    return [R("irr", forms=forms_str(f))], False


def rule_imperativo(verb, f, t):
    rules, ok = [], True
    pres, subj = t["presente"], t["subjuntivo"]
    for k in range(1, 6):
        form = first(f[k])
        if k == 1:
            if verb in TU_IRREGULAR and form == TU_IRREGULAR[verb]:
                r = R("imp_tu_irr", form=form, inf=verb)
            elif form == first(pres[2]):
                r = R("imp_tu", form=form, el=first(pres[2]))
            else:
                base = next((b for b, v in TU_IRREGULAR.items()
                             if verb != b and verb.endswith(b)
                             and form == verb[:-len(b)] + ACCENT_LAST(v)), None)
                if base:
                    r = R("imp_tu_compound", form=form, inf=verb, base=base,
                          baseform=TU_IRREGULAR[base])
                else:
                    r, ok = R("irr", forms=form), False
        elif k == 4:
            expect = verb[:-1] + "d"
            if form == expect:
                r = R("imp_vos", form=form, inf=verb)
            else:
                r, ok = R("irr", forms=form), False
        else:
            if form == first(subj[k]):
                r = R("imp_subj", form=form, who=WHO[k])
            else:
                r, ok = R("irr", forms=form), False
        r["pers"] = k
        rules.append(r)
    return rules, ok


def ACCENT_LAST(word):
    """ten -> tén, pon -> pón: accent the last vowel (compound tú imperatives)."""
    i = len(word) - 1
    while i >= 0 and word[i] not in "aeiou":
        i -= 1
    return word[:i] + ACCENT[word[i]] + word[i + 1:] if i >= 0 else word


def rule_gerundio(verb, g):
    typ, stem = vtype(verb), vstem(verb)
    end = "ando" if typ == "ar" else "iendo"
    if not stem:                                   # ir -> yendo
        return [R("ger_y", form=g)], g == "yendo"
    if g == attach(stem, end, y=False):
        return [R("ger_reg", form=g, end="-" + end)], True
    if g == attach(stem, end, y=True):
        return [R("ger_y", form=g)], True
    for s3 in stem_change_candidates(stem):
        if g == attach(s3, end):
            frm, to = change_segment(stem, s3)
            return [R("ger_stem", form=g, frm=frm, to=to)], True
    return [R("irr", forms=g)], False


def rule_participio(verb, p):
    reg = regular_participle(verb)
    if p == reg:
        if "í" in reg[-4:]:
            return [R("part_accent", form=p)], True
        return [R("part_reg", form=p)], True
    return [R("part_irr", form=p, reg=reg)], True


def rule_compound(verb, tense, t, haber, ir):
    if tense == "futuro_perifrastico":
        return [R("perif", inf=verb, ir=forms_str(ir["presente"]))], True
    aux = forms_str(haber["presente" if tense == "perfecto" else "imperfecto"])
    part = t["participio"]
    rules = [R("perf" if tense == "perfecto" else "plusc", aux=aux, part=part)]
    reg = regular_participle(verb)
    if part != reg:
        rules.append(R("part_irr", form=part, reg=reg))
    return rules, True


def build_rules(table):
    unknown = []
    out = {}
    for verb, t in table.items():
        rules = {}

        def add(tense, res):
            r, ok = res
            rules[tense] = r
            if not ok:
                unknown.append(f"{verb}/{tense}")

        firsts = {k: [first(c) for c in v] if isinstance(v, list) else v for k, v in t.items()}
        add("presente", rule_presente(verb, firsts["presente"]))
        add("indefinido", rule_indefinido(verb, firsts["indefinido"]))
        add("imperfecto", rule_imperfecto(verb, firsts["imperfecto"]))
        add("futuro", rule_fut_cond(verb, firsts["futuro"], "futuro"))
        add("condicional", rule_fut_cond(verb, firsts["condicional"], "condicional"))
        add("subjuntivo", rule_subjuntivo(verb, firsts["subjuntivo"], t))
        add("subjuntivo_imperfecto", rule_subj_imperfecto(verb, t["subjuntivo_imperfecto"], t))
        add("imperativo", rule_imperativo(verb, t["imperativo"], t))
        add("gerundio", rule_gerundio(verb, t["gerundio"]))
        add("participio", rule_participio(verb, t["participio"]))
        for c in COMPOUND:
            add(c, rule_compound(verb, c, t, table["haber"], table["ir"]))
        out[verb] = rules
    return out, unknown


# ─── main ──────────────────────────────────────────────────────────────────

def main():
    with open(os.path.join(TOOLS, "verbs.txt"), encoding="utf-8") as fh:
        verbs = [l.strip() for l in fh if l.strip() and not l.startswith("#")]
    overrides = load_overrides()
    jh = Jehle()
    vc = Verbecc()

    table, conflicts, moot, unused = build_cells(verbs, vc, jh, overrides)

    if vc.errors:
        print(f"verbecc failed on {len(vc.errors)} verb/tense pairs (other sources used):")
        for e in vc.errors:
            print("  " + e)
    if moot:
        print("Overrides now moot (sources agree with them):")
        for m in moot:
            print("  " + m)
    if unused:
        print("Overrides matching no cell:")
        for u in unused:
            print("  " + u)
    if conflicts:
        print(f"\n{len(conflicts)} cells without two agreeing sources. "
              "Decide them in tools/overrides.json (with a reason):")
        for where, src in conflicts:
            print(f"  {where}: " + "; ".join(f"{s}={'|'.join(v)}" for s, v in src.items()))
        sys.exit(1)

    add_derived(table)
    rules, unknown = build_rules(table)

    data = {"persons": PERSONS, "verbs": {}}
    cells = 0
    for verb in verbs:
        t = table[verb]
        out_t = {}
        for tense in SIMPLE + COMPOUND:
            out_t[tense] = t[tense]
            cells += sum(1 for c in t[tense] if c)
        for tense in SINGLE:
            out_t[tense] = t[tense]
            cells += 1
        data["verbs"][verb] = {"type": vtype(verb), "t": out_t, "rules": rules[verb]}

    body = "{\n" + f'"persons":{json.dumps(PERSONS, ensure_ascii=False)},\n"verbs":{{\n'
    body += ",\n".join(f"{json.dumps(v, ensure_ascii=False)}:"
                       f"{json.dumps(d, ensure_ascii=False, separators=(',', ':'))}"
                       for v, d in data["verbs"].items())
    body += "\n}}\n"
    os.makedirs(os.path.join(ROOT, "data"), exist_ok=True)
    with open(os.path.join(ROOT, "data", "conjugations.json"), "w", encoding="utf-8") as fh:
        fh.write(body)
    with open(os.path.join(ROOT, "js", "conjugations.js"), "w", encoding="utf-8") as fh:
        fh.write("// Generated by tools/build_table.py — do not edit by hand.\n")
        fh.write("const CONJ = " + body.rstrip("\n") + ";\n")

    print(f"\n{len(verbs)} verbs, {cells} cells written "
          f"(data/conjugations.json, js/conjugations.js).")
    print(f"{len(overrides)} overrides applied.")
    if unknown:
        print(f"{len(unknown)} verb/tense pairs without a recognised rule (shown as 'irregular'):")
        print("  " + ", ".join(unknown))


if __name__ == "__main__":
    main()
