# theAFE Landing Page

A dependency-free static landing page for theAFE, a proactive privacy-first AI assistant concept.

## Run Locally

Open `index.html` in a browser, or serve the folder with any static server:

```bash
python3 -m http.server 8080
```

The waitlist form stores submissions in browser `localStorage` under `theafeWaitlist`. Replace the submit handler in `script.js` with a backend endpoint when you are ready to collect real signups.

## Generated Asset

The current dark hero image was generated with the built-in image generation tool and saved into:

```text
assets/theafe-hero-dark.png
```
