# Confined Space Training — Landing Page

Standalone marketing landing page for the 4 confined space courses on
[HAZWOPER-OSHA.com](https://hazwoper-osha.com/): Awareness, Permit-Required Entry, Supervisor, and
Competent Person training.

Pure HTML/CSS/JS, no build step, no dependencies. Meant to be tested/previewed on GitHub (e.g. GitHub Pages) before any backend work is wired up.

## Structure

```
index.html                          — main landing page (hero, courses, curriculum, pricing, FAQ teaser)
frequently-asked-questions/index.html — standalone FAQ resource page
css/styles.css                      — all styling
js/main.js                          — mobile nav toggle, FAQ accordion, pricing toggle, enroll form UX
images/cst-logo.svg                 — site logo (navy/amber, transparent background)
```

## Current state

- Static, self-contained landing page only.
- The enroll forms are **front-end only** — they don't submit anywhere or charge anyone. Submitting just swaps in a confirmation message (see `js/main.js`).
- No Stripe, no course-platform API, no auth, no database.
- Course details (titles, prices, durations) were sourced from the live listings on hazwoper-osha.com as of 2026-07-20; confirm against the source pages before launch in case pricing changes.

## Planned next steps (not yet implemented)

1. Connect the enroll forms to the HAZWOPER-OSHA course/enrollment API.
2. Add Stripe Checkout (or Stripe Elements) for real payment.
3. Point a real domain at this page (canonical/schema URLs currently use the placeholder `confined-space.com`) once one is chosen.

## Local preview

Just open `index.html` in a browser, or serve the folder with any static server, e.g.:

```
npx serve .
```
