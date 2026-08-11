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
