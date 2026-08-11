# Foundation Cleanup Notes

This cleanup intentionally preserves the existing visual design while making the project safer to maintain for the 2026–27 school year.

## Changes in this foundation pass

- Split the original single-file app into `index.html`, `styles.css`, and `app.js`.
- Removed the older duplicate `homePage()` implementation so there is one source of truth.
- Replaced the obsolete May 2026 emergency study plan with a year-long 2026–27 routine.
- Changed the 2027 exam date display to `Date TBA` until College Board publishes the official date.
- Renamed student-facing "AI" grading language because the current checker is a local browser-based rubric/keyword checker, not an AI model.
- Added transparent language explaining what the built-in FRQ checker does and does not do.
- Added per-unit quiz attempt/correct tracking in browser local storage.
- Changed unit mastery so it does not display a precise percentage until the student has enough unit-specific evidence.
- Added automated JavaScript syntax and foundation checks with GitHub Actions.

## Deliberately not included yet

- Visual redesign
- Major APHG content expansion
- Real external AI grading
- Accounts or cloud student data storage
- Monetization changes

Those belong in later, separately reviewable pull requests.
