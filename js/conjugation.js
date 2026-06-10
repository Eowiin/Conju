// Moteur de conjugaison
const PRONOUNS = ["yo","tú","él","nosotros","vosotros","ellos"];

// Terminaisons régulières par temps
const ENDINGS = {
  presente:    { ar:{yo:"o",tú:"as",él:"a",nosotros:"amos",vosotros:"áis",ellos:"an"}, er:{yo:"o",tú:"es",él:"e",nosotros:"emos",vosotros:"éis",ellos:"en"}, ir:{yo:"o",tú:"es",él:"e",nosotros:"imos",vosotros:"ís",ellos:"en"} },
  indefinido:  { ar:{yo:"é",tú:"aste",él:"ó",nosotros:"amos",vosotros:"asteis",ellos:"aron"}, er:{yo:"í",tú:"iste",él:"ió",nosotros:"imos",vosotros:"isteis",ellos:"ieron"}, ir:{yo:"í",tú:"iste",él:"ió",nosotros:"imos",vosotros:"isteis",ellos:"ieron"} },
  imperfecto:  { ar:{yo:"aba",tú:"abas",él:"aba",nosotros:"ábamos",vosotros:"abais",ellos:"aban"}, er:{yo:"ía",tú:"ías",él:"ía",nosotros:"íamos",vosotros:"íais",ellos:"ían"}, ir:{yo:"ía",tú:"ías",él:"ía",nosotros:"íamos",vosotros:"íais",ellos:"ían"} },
  subjuntivo:  { ar:{yo:"e",tú:"es",él:"e",nosotros:"emos",vosotros:"éis",ellos:"en"}, er:{yo:"a",tú:"as",él:"a",nosotros:"amos",vosotros:"áis",ellos:"an"}, ir:{yo:"a",tú:"as",él:"a",nosotros:"amos",vosotros:"áis",ellos:"an"} },
  subjuntivo_imperfecto: { ar:{yo:"ara",tú:"aras",él:"ara",nosotros:"áramos",vosotros:"arais",ellos:"aran"}, er:{yo:"iera",tú:"ieras",él:"iera",nosotros:"iéramos",vosotros:"ierais",ellos:"ieran"}, ir:{yo:"iera",tú:"ieras",él:"iera",nosotros:"iéramos",vosotros:"ierais",ellos:"ieran"} },
  imperativo:  { ar:{tú:"a",nosotros:"emos",vosotros:"ad",ellos:"en"}, er:{tú:"e",nosotros:"amos",vosotros:"ed",ellos:"an"}, ir:{tú:"e",nosotros:"amos",vosotros:"id",ellos:"an"} },
};

// Suffixes futur/conditionnel (s'ajoutent à l'infinitif complet)
const FUT_ENDS = {yo:"é",tú:"ás",él:"á",nosotros:"emos",vosotros:"éis",ellos:"án"};
const COND_ENDS = {yo:"ía",tú:"ías",él:"ía",nosotros:"íamos",vosotros:"íais",ellos:"ían"};

// Participes passés réguliers
function regularParticiple(verb) {
  const t = V[verb].type;
  const stem = verb.slice(0,-2);
  return stem + (t==="ar" ? "ado" : "ido");
}
function getParticiple(verb) {
  return V[verb].participle || regularParticiple(verb);
}

// Auxiliaire haber conjugué au présent (pour parfait) et à l'imperfecto (pour plus-que-parfait)
const HABER_PRES = {yo:"he",tú:"has",él:"ha",nosotros:"hemos",vosotros:"habéis",ellos:"han"};
const HABER_IMP  = {yo:"había",tú:"habías",él:"había",nosotros:"habíamos",vosotros:"habíais",ellos:"habían"};
const HABER_FUT  = {yo:"habré",tú:"habrás",él:"habrá",nosotros:"habremos",vosotros:"habréis",ellos:"habrán"};
const HABER_COND = {yo:"habría",tú:"habrías",él:"habría",nosotros:"habríamos",vosotros:"habríais",ellos:"habrían"};

function getGerund(verbName) {
  const verb = V[verbName];
  if (!verb) return null;
  if (verb.gerundio) return verb.gerundio;
  const stem = verbName.slice(0, -2);
  if (verb.type === "ar") return stem + "ando";
  const vowels = "aeiouáéíóú";
  if (vowels.includes(stem.slice(-1))) return stem + "yendo";
  return stem + "iendo";
}

function conjugate(verbName, pronoun, tense) {
  const verb = V[verbName];
  if (!verb) return null;

  // Gérondif (forme invariable)
  if (tense === "gerundio") return getGerund(verbName);

  // Temps composés
  if (tense === "perfecto") {
    return HABER_PRES[pronoun] + " " + getParticiple(verbName);
  }
  if (tense === "pluscuamperfecto") {
    return HABER_IMP[pronoun] + " " + getParticiple(verbName);
  }
  // Futur périphrastique : voy/vas/va/vamos/vais/van + a + infinitif
  if (tense === "futuro_perifrastico") {
    const ir_pres = {yo:"voy",tú:"vas",él:"va",nosotros:"vamos",vosotros:"vais",ellos:"van"};
    return ir_pres[pronoun] + " a " + verbName;
  }
  // Futur antérieur et conditionnel passé
  if (tense === "futuro_perfecto")     return HABER_FUT[pronoun]  + " " + getParticiple(verbName);
  if (tense === "condicional_compuesto") return HABER_COND[pronoun] + " " + getParticiple(verbName);

  // Cherche la forme irrégulière déclarée
  if (verb[tense] && verb[tense][pronoun] !== undefined) return verb[tense][pronoun];

  const stem = verbName.slice(0,-2);
  const t = verb.type;

  // Futur : infinitif entier + terminaison
  if (tense === "futuro") return verbName + FUT_ENDS[pronoun];
  // Conditionnel : infinitif entier + terminaison
  if (tense === "condicional") return verbName + COND_ENDS[pronoun];
  // Impératif : yo et tú négatif non gérés ici — on exclut "yo" de l'impératif
  if (tense === "imperativo") {
    if (pronoun === "yo") return null;
    const e = ENDINGS.imperativo[t];
    return e ? stem + e[pronoun] : null;
  }
  // Subjonctif imparfait
  if (tense === "subjuntivo_imperfecto") {
    const e = ENDINGS.subjuntivo_imperfecto[t];
    return e ? stem + e[pronoun] : null;
  }

  const e = ENDINGS[tense] && ENDINGS[tense][t];
  return e ? stem + e[pronoun] : null;
}

function getFullConjugation(verbName, tense) {
  const target = tense === "imperativo" ? ["tú","nosotros","vosotros","ellos"] : PRONOUNS;
  return target.map(p => ({pronoun:p, form: conjugate(verbName,p,tense)||"—"}));
}

// Règles / explications par temps
const RULES = {
  fr: {
    perfecto:              "Passé composé : haber (présent) + participe passé. Participe : -ar → -ado, -er/-ir → -ido. Irréguliers courants : hecho, dicho, visto, vuelto, puesto, escrito, abierto, muerto.",
    pluscuamperfecto:      "Plus-que-parfait : haber (imparfait) + participe passé. Même formation que le passé composé mais avec había/habías/había…",
    futuro_perifrastico:   "Futur périphrastique : ir (présent) + a + infinitif. Équivalent de 'aller + infinitif' en français. Très courant à l'oral.",
    futuro_perfecto:       "Futur antérieur : haber (futur) + participe passé. Habré/habrás/habrá/habremos/habréis/habrán + participe. Exprime une action achevée avant un moment futur.",
    condicional_compuesto: "Conditionnel passé : haber (cond.) + participe passé. Habría/habrías/habría/habríamos/habríais/habrían + participe. Exprime une action irréelle ou hypothétique passée.",
    gerundio:              "Gérondif : -ar → radical + -ando ; -er/-ir → radical + -iendo. Si le radical finit par une voyelle : -yendo (leyendo, oyendo). Alternances : e→i (pidiendo, diciendo), o→u (durmiendo, pudiendo).",
    imperativo:            "Impératif affirmatif : tú → 3ᵉ pers. présent (-ar: habla, -er: come, -ir: vive). Nosotros/ellos = subjonctif présent. Vosotros : -ar/-er/-ir → -ad/-ed/-id. Irréguliers tú : di, haz, ve, pon, sal, sé, ten, ven.",
    fullyIrr:           "Verbe entièrement irrégulier — toutes les formes sont à mémoriser.",
    goYo:               "Irrégulier en -go uniquement à la 1ʳᵉ personne (yo). Les autres personnes suivent la conjugaison régulière.",
    zco:                "Verbes en -cer/-cir : yo → -zco. Toutes les autres personnes sont régulières.",
    diphIe:             "Diphtongaison e→ie aux personnes 1/2/3 sing. et 3ᵉ plur. (« el zapato »). Nosotros/vosotros restent réguliers.",
    diphUe:             "Diphtongaison o→ue aux personnes 1/2/3 sing. et 3ᵉ plur. (« el zapato »). Nosotros/vosotros restent réguliers.",
    eToI:               "Alternance e→i aux personnes 1/2/3 sing., 3ᵉ plur. Nosotros/vosotros gardent le -e- du radical.",
    ortho:              "Changement orthographique à la 1ʳᵉ personne seulement (-car→-qué, -gar→-gué, -zar→-cé). Les autres personnes sont régulières.",
    strongPret:         "Prétérit fort irrégulier : radical fort + terminaisons sans accent (-e/-iste/-o/-imos/-isteis/-ieron).",
    yPret:              "Changement -i- → -y- entre voyelles à la 3ᵉ personne (leyó, construyó…). 1ʳᵉ personne porte l'accent (leí).",
    regular: {
      presente:             {ar:"Présent -AR : radical + -o/-as/-a/-amos/-áis/-an",          er:"Présent -ER : radical + -o/-es/-e/-emos/-éis/-en",          ir:"Présent -IR : radical + -o/-es/-e/-imos/-ís/-en"},
      indefinido:           {ar:"Prétérit -AR : radical + -é/-aste/-ó/-amos/-asteis/-aron",  er:"Prétérit -ER/-IR : radical + -í/-iste/-ió/-imos/-isteis/-ieron", ir:"Prétérit -ER/-IR : radical + -í/-iste/-ió/-imos/-isteis/-ieron"},
      imperfecto:           {ar:"Imparfait -AR : radical + -aba/-abas/-aba/-ábamos/-abais/-aban", er:"Imparfait -ER/-IR : radical + -ía/-ías/-ía/-íamos/-íais/-ían", ir:"Imparfait -ER/-IR : radical + -ía/-ías/-ía/-íamos/-íais/-ían"},
      futuro:               {ar:"Futur : infinitif + -é/-ás/-á/-emos/-éis/-án",er:"Futur : infinitif + -é/-ás/-á/-emos/-éis/-án",ir:"Futur : infinitif + -é/-ás/-á/-emos/-éis/-án"},
      condicional:          {ar:"Conditionnel : infinitif + -ía/-ías/-ía/-íamos/-íais/-ían", er:"Conditionnel : infinitif + -ía/-ías/-ía/-íamos/-íais/-ían", ir:"Conditionnel : infinitif + -ía/-ías/-ía/-íamos/-íais/-ían"},
      subjuntivo:           {ar:"Subjonctif présent -AR : radical + -e/-es/-e/-emos/-éis/-en", er:"Subjonctif présent -ER/-IR : radical + -a/-as/-a/-amos/-áis/-an", ir:"Subjonctif présent -ER/-IR : radical + -a/-as/-a/-amos/-áis/-an"},
      subjuntivo_imperfecto:{ar:"Subjonctif imparfait -AR : radical + -ara/-aras/-ara/-áramos/-arais/-aran", er:"Subjonctif imparfait -ER/-IR : radical + -iera/-ieras/-iera/-iéramos/-ierais/-ieran", ir:"Subjonctif imparfait -ER/-IR : radical + -iera/-ieras/-iera/-iéramos/-ierais/-ieran"},
    },
  },
  en: {
    perfecto:              "Present perfect: haber (present) + past participle. Participle: -ar → -ado, -er/-ir → -ido. Common irregulars: hecho, dicho, visto, vuelto, puesto, escrito, abierto, muerto.",
    pluscuamperfecto:      "Past perfect: haber (imperfect) + past participle. Same as the present perfect but with había/habías/había…",
    futuro_perifrastico:   "Periphrastic future: ir (present) + a + infinitive. Equivalent to 'going to' in English. Very common in spoken Spanish.",
    futuro_perfecto:       "Future perfect: haber (future) + past participle. Habré/habrás/habrá/habremos/habréis/habrán + participle. Expresses an action completed before a future point.",
    condicional_compuesto: "Conditional perfect: haber (conditional) + past participle. Habría/habrías/habría/habríamos/habríais/habrían + participle. Expresses an unreal or hypothetical past action.",
    gerundio:              "Gerund: -ar → stem + -ando; -er/-ir → stem + -iendo. If stem ends in a vowel: -yendo (leyendo, oyendo). Stem changes: e→i (pidiendo, diciendo), o→u (durmiendo, pudiendo).",
    imperativo:            "Affirmative imperative: tú → 3rd person present (-ar: habla, -er: come, -ir: vive). Nosotros/ellos = present subjunctive. Vosotros: -ar/-er/-ir → -ad/-ed/-id. Irregular tú forms: di, haz, ve, pon, sal, sé, ten, ven.",
    fullyIrr:           "Fully irregular verb — all forms must be memorised.",
    goYo:               "Irregular -go form only in the 1st person (yo). All other persons follow the regular pattern.",
    zco:                "Verbs ending in -cer/-cir: yo → -zco. All other persons are regular.",
    diphIe:             "Stem-change e→ie in persons 1/2/3 sg. and 3rd pl. (the 'boot'). Nosotros/vosotros remain regular.",
    diphUe:             "Stem-change o→ue in persons 1/2/3 sg. and 3rd pl. (the 'boot'). Nosotros/vosotros remain regular.",
    eToI:               "Stem-change e→i in persons 1/2/3 sg. and 3rd pl. Nosotros/vosotros keep the -e- of the stem.",
    ortho:              "Spelling change in the 1st person only (-car→-qué, -gar→-gué, -zar→-cé). All other persons are regular.",
    strongPret:         "Strong preterite: irregular stem + unaccented endings (-e/-iste/-o/-imos/-isteis/-ieron).",
    yPret:              "Change -i- → -y- between vowels in the 3rd person (leyó, construyó…). 1st person takes an accent (leí).",
    regular: {
      presente:             {ar:"Present -AR: stem + -o/-as/-a/-amos/-áis/-an",          er:"Present -ER: stem + -o/-es/-e/-emos/-éis/-en",          ir:"Present -IR: stem + -o/-es/-e/-imos/-ís/-en"},
      indefinido:           {ar:"Preterite -AR: stem + -é/-aste/-ó/-amos/-asteis/-aron",  er:"Preterite -ER/-IR: stem + -í/-iste/-ió/-imos/-isteis/-ieron", ir:"Preterite -ER/-IR: stem + -í/-iste/-ió/-imos/-isteis/-ieron"},
      imperfecto:           {ar:"Imperfect -AR: stem + -aba/-abas/-aba/-ábamos/-abais/-aban", er:"Imperfect -ER/-IR: stem + -ía/-ías/-ía/-íamos/-íais/-ían", ir:"Imperfect -ER/-IR: stem + -ía/-ías/-ía/-íamos/-íais/-ían"},
      futuro:               {ar:"Future: infinitive + -é/-ás/-á/-emos/-éis/-án",er:"Future: infinitive + -é/-ás/-á/-emos/-éis/-án",ir:"Future: infinitive + -é/-ás/-á/-emos/-éis/-án"},
      condicional:          {ar:"Conditional: infinitive + -ía/-ías/-ía/-íamos/-íais/-ían", er:"Conditional: infinitive + -ía/-ías/-ía/-íamos/-íais/-ían", ir:"Conditional: infinitive + -ía/-ías/-ía/-íamos/-íais/-ían"},
      subjuntivo:           {ar:"Present subjunctive -AR: stem + -e/-es/-e/-emos/-éis/-en", er:"Present subjunctive -ER/-IR: stem + -a/-as/-a/-amos/-áis/-an", ir:"Present subjunctive -ER/-IR: stem + -a/-as/-a/-amos/-áis/-an"},
      subjuntivo_imperfecto:{ar:"Imperfect subjunctive -AR: stem + -ara/-aras/-ara/-áramos/-arais/-aran", er:"Imperfect subjunctive -ER/-IR: stem + -iera/-ieras/-iera/-iéramos/-ierais/-ieran", ir:"Imperfect subjunctive -ER/-IR: stem + -iera/-ieras/-iera/-iéramos/-ierais/-ieran"},
    },
  },
  pt: {
    perfecto:              "Pretérito perfeito composto: haber (presente) + particípio passado. Particípio: -ar → -ado, -er/-ir → -ido. Irregulares comuns: hecho, dicho, visto, vuelto, puesto, escrito, abierto, muerto.",
    pluscuamperfecto:      "Mais-que-perfeito: haber (imperfeito) + particípio passado. Mesma formação que o perfeito mas com había/habías/había…",
    futuro_perifrastico:   "Futuro perifrástico: ir (presente) + a + infinitivo. Equivalente a 'ir + infinitivo' em português. Muito comum na fala.",
    futuro_perfecto:       "Futuro perfeito: haber (futuro) + particípio passado. Habré/habrás/habrá/habremos/habréis/habrán + particípio. Exprime uma ação concluída antes de um momento futuro.",
    condicional_compuesto: "Condicional composto: haber (condicional) + particípio passado. Habría/habrías/habría/habríamos/habríais/habrían + particípio. Exprime uma ação irreal ou hipotética passada.",
    gerundio:              "Gerúndio: -ar → radical + -ando; -er/-ir → radical + -iendo. Se o radical terminar em vogal: -yendo (leyendo, oyendo). Alternâncias: e→i (pidiendo, diciendo), o→u (durmiendo, pudiendo).",
    imperativo:            "Imperativo afirmativo: tú → 3.ª pessoa do presente (-ar: habla, -er: come, -ir: vive). Nosotros/ellos = presente do conjuntivo. Vosotros: -ar/-er/-ir → -ad/-ed/-id. Formas irregulares de tú: di, haz, ve, pon, sal, sé, ten, ven.",
    fullyIrr:           "Verbo completamente irregular — todas as formas devem ser memorizadas.",
    goYo:               "Irregular em -go apenas na 1.ª pessoa (yo). As outras pessoas seguem o padrão regular.",
    zco:                "Verbos em -cer/-cir: yo → -zco. Todas as outras pessoas são regulares.",
    diphIe:             "Alternância e→ie nas pessoas 1/2/3 sg. e 3.ª pl. (o 'sapato'). Nosotros/vosotros permanecem regulares.",
    diphUe:             "Alternância o→ue nas pessoas 1/2/3 sg. e 3.ª pl. (o 'sapato'). Nosotros/vosotros permanecem regulares.",
    eToI:               "Alternância e→i nas pessoas 1/2/3 sg. e 3.ª pl. Nosotros/vosotros mantêm o -e- do radical.",
    ortho:              "Alteração ortográfica apenas na 1.ª pessoa (-car→-qué, -gar→-gué, -zar→-cé). As outras pessoas são regulares.",
    strongPret:         "Pretérito forte irregular: radical forte + terminações sem acento (-e/-iste/-o/-imos/-isteis/-ieron).",
    yPret:              "Mudança -i- → -y- entre vogais na 3.ª pessoa (leyó, construyó…). A 1.ª pessoa leva acento (leí).",
    regular: {
      presente:             {ar:"Presente -AR: radical + -o/-as/-a/-amos/-áis/-an",          er:"Presente -ER: radical + -o/-es/-e/-emos/-éis/-en",          ir:"Presente -IR: radical + -o/-es/-e/-imos/-ís/-en"},
      indefinido:           {ar:"Pretérito indefinido -AR: radical + -é/-aste/-ó/-amos/-asteis/-aron",  er:"Pretérito indefinido -ER/-IR: radical + -í/-iste/-ió/-imos/-isteis/-ieron", ir:"Pretérito indefinido -ER/-IR: radical + -í/-iste/-ió/-imos/-isteis/-ieron"},
      imperfecto:           {ar:"Pretérito imperfeito -AR: radical + -aba/-abas/-aba/-ábamos/-abais/-aban", er:"Pretérito imperfeito -ER/-IR: radical + -ía/-ías/-ía/-íamos/-íais/-ían", ir:"Pretérito imperfeito -ER/-IR: radical + -ía/-ías/-ía/-íamos/-íais/-ían"},
      futuro:               {ar:"Futuro simples: infinitivo + -é/-ás/-á/-emos/-éis/-án",er:"Futuro simples: infinitivo + -é/-ás/-á/-emos/-éis/-án",ir:"Futuro simples: infinitivo + -é/-ás/-á/-emos/-éis/-án"},
      condicional:          {ar:"Condicional: infinitivo + -ía/-ías/-ía/-íamos/-íais/-ían", er:"Condicional: infinitivo + -ía/-ías/-ía/-íamos/-íais/-ían", ir:"Condicional: infinitivo + -ía/-ías/-ía/-íamos/-íais/-ían"},
      subjuntivo:           {ar:"Presente do conjuntivo -AR: radical + -e/-es/-e/-emos/-éis/-en", er:"Presente do conjuntivo -ER/-IR: radical + -a/-as/-a/-amos/-áis/-an", ir:"Presente do conjuntivo -ER/-IR: radical + -a/-as/-a/-amos/-áis/-an"},
      subjuntivo_imperfecto:{ar:"Imperfeito do conjuntivo -AR: radical + -ara/-aras/-ara/-áramos/-arais/-aran", er:"Imperfeito do conjuntivo -ER/-IR: radical + -iera/-ieras/-iera/-iéramos/-ierais/-ieran", ir:"Imperfeito do conjuntivo -ER/-IR: radical + -iera/-ieras/-iera/-iéramos/-ierais/-ieran"},
    },
  },
};

function getRule(verbName, tense, lang) {
  const verb = V[verbName];
  if (!verb) return "";
  const R = RULES[lang] || RULES.fr;
  const isFullyIrr = ["ser","estar","ir","haber","dar","caber"].includes(verbName);

  if (tense==="perfecto")               return R.perfecto;
  if (tense==="pluscuamperfecto")       return R.pluscuamperfecto;
  if (tense==="futuro_perifrastico")    return R.futuro_perifrastico;
  if (tense==="futuro_perfecto")        return R.futuro_perfecto;
  if (tense==="condicional_compuesto")  return R.condicional_compuesto;
  if (tense==="gerundio")               return R.gerundio;
  if (tense==="imperativo")             return R.imperativo;

  if (!verb.irregular) return (R.regular[tense]||{})[verb.type] || "";

  if (isFullyIrr) return R.fullyIrr;

  const pr = verb.presente || {};
  if (tense==="presente") {
    const yoForm = pr.yo || "";
    if (yoForm.endsWith("go") && !pr.tú) return R.goYo;
    if (yoForm.endsWith("zco")) return R.zco;
    if (Object.values(pr).some(f=>f.includes("ie"))) return R.diphIe;
    if (Object.values(pr).some(f=>f.includes("ue"))) return R.diphUe;
    if (verb.type==="ir" && pr.yo && !pr.yo.includes("ie") && !pr.yo.includes("ue")) return R.eToI;
  }
  if (tense==="indefinido") {
    const ind = verb.indefinido || {};
    const yoInd = ind.yo || "";
    if (["busqué","toqué","saqué","llegué","pagué","empecé"].some(f=>f===yoInd)) return R.ortho;
    if (yoInd && !yoInd.endsWith("é") && !yoInd.endsWith("í")) return R.strongPret;
    if (ind.él && ind.él.endsWith("yó")) return R.yPret;
  }
  return "";
}


