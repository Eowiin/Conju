# Conju

A Spanish conjugation trainer for French, English, and Portuguese speakers. Runs entirely in the browser — no backend, no dependencies.

## Features

- ~160 verbs (regular and irregular)
- 11 tenses: present, preterite, imperfect, perfect, pluperfect, future, periphrastic future, conditional, present/imperfect subjunctive, imperative
- Grammar rule explanations after each answer
- Full conjugation table shown on correction
- Anti-repetition system
- Score and streak tracking
- Interface in French, English, and Portuguese

## Project structure

```
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── i18n.js        # UI translations (FR / EN / PT)
    ├── verbs.js       # Verb database
    ├── conjugation.js # Conjugation engine + grammar rules
    ├── templates.js   # Exercise sentence templates
    └── app.js         # App logic
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for VPS setup and automatic deployment via GitHub Actions.
