# Afe marketing site

The static landing page for Afe: a calm, evidence-backed personal assistant that
connects a knowledge worker's tools and asks the smallest useful question when
their judgment is the missing piece.

## Run Locally

Open `index.html` in a browser, or serve the folder with any static server:

```bash
python3 -m http.server 8080
```

On `localhost` the form targets
`http://127.0.0.1:8000/v1/public/early-access` and uses Cloudflare's public testing
site key. Run the Afe intake API with its local flags before testing a submission.

For production, set the two configuration meta tags in `index.html`:

- `afe-intake-endpoint` is the deployed HTTPS endpoint;
- `afe-turnstile-site-key` is the public production widget key.

The secret Turnstile key belongs only in the API runtime. The website never stores
form submissions in the browser and never contains the secret.

Browser behavior is split by responsibility under `assets/js/`: theme, motion, and
waitlist submission can be changed independently without disturbing the other two.

## Typography

The site self-hosts the official, unmodified Geist Sans variable font. Geist is
licensed under the SIL Open Font License 1.1; its copyright and complete license
notice are retained in `assets/fonts/LICENSE-Geist.txt` beside the font binary.

## Visual direction

The page mirrors the Afe product design brief: a creamy off-white light theme,
true-black dark theme, neutral controls, subtle semantic colors, generous spacing,
restrained motion, and a selective liquid-glass layer for shell and context. The
hero uses a CSS-rendered Afe product preview so that the marketing surface stays
aligned with the actual question-first app experience.

The older images in `assets/` are retained as historical draft explorations and are
not used by the final landing page.
