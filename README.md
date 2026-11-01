# AP Human Geography Study Buddy

A browser-based AP Human Geography study tool with unit review, multiple-choice practice, FRQ coaching, adaptive flashcards, model and map practice, mastery tracking, and AP-style simulation.

## Project structure

- `index.html` — page shell and app mount point
- `styles.css` — site styling and responsive layout
- `app.js` — APHG content, state, study logic, quizzes, FRQs, models/maps, and rendering

## Student data

The site does not require a login. Flashcard and quiz progress used by the adaptive features is stored locally in the student's browser/device.

## Validation

The GitHub Actions workflow runs JavaScript syntax checks and foundation integrity checks when the core app files change.

### Startup delivery assets

Edit the readable root JavaScript sources, then regenerate the committed compact
`assets/` copies and content-versioned HTML references:

```sh
npm install --prefix /tmp/aphg-assets --no-save --no-package-lock terser@5.51.2
NODE_PATH=/tmp/aphg-assets/node_modules node scripts/build-startup-assets.cjs
```

`scripts/startup-assets.json` preserves execution order and the deferred accessibility
script. Only the adjacent reflection and mini-FRQ IIFEs share a request. No content
is removed or deferred; global names are preserved. CI checks generated/source
synchronization and the unchanged 48-script / 1,000,000-byte budget.
