# Afe marketing site

The static landing page for Afe: a calm, evidence-backed personal assistant that
connects a knowledge worker's tools and asks the smallest useful question when
their judgment is the missing piece.

## Run Locally

Open `index.html` in a browser, or serve the folder with any static server:

```bash
python3 -m http.server 8080
```

The waitlist form stores submissions in browser `localStorage` under `afeWaitlist`.
Replace the submit handler in `script.js` with a backend endpoint when you are ready
to collect real signups.

## Visual direction

The page mirrors the Afe product design brief: a creamy off-white light theme,
true-black dark theme, neutral controls, subtle semantic colors, generous spacing,
and restrained motion. The hero uses a CSS-rendered Afe product preview so that the
marketing surface stays aligned with the actual question-first app experience.

The older images in `assets/` are retained as historical draft explorations and are
not used by the final landing page.
