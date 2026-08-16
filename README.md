# AP Human Geography Study Buddy

A browser-based AP Human Geography study tool with unit review, multiple-choice practice, FRQ coaching, adaptive flashcards, model and map practice, mastery tracking, and AP-style simulation.

## Project structure

- `index.html` — page shell and app mount point
- `styles.css` — site styling and responsive layout
- `app.js` — APHG content, state, study logic, quizzes, FRQs, models/maps, and rendering

## Student data

The site does not require a login or collect student identity. Flashcard, quiz, and unit-mastery progress used by the adaptive features is stored locally in the student's browser/device. See `privacy.html` for the student- and family-facing classroom notice.

## Netlify

The repository root is a static Netlify site. `netlify.toml` publishes the root directory and sets classroom-appropriate response headers. Git-connected pull requests should receive deploy previews automatically when Deploy Previews are enabled for the site.

## Validation

The GitHub Actions workflow runs JavaScript syntax checks and foundation integrity checks when the core app files change.
