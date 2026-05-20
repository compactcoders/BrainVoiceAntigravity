# brainvoice-website

BrainVoice is an AI visibility and brand intelligence platform that helps businesses understand how their brand appears across AI-generated answers and modern search discovery.

## Local development

```bash
node serve-static.js
```

Open [http://localhost:5500](http://localhost:5500) — the landing page is served from `index.html`.

## Secondary pages

Additional marketing pages live in `BRAINVOICE - OTHER PAGES/` (about, blogs, careers, contact, success stories, etc.). They are separate from the main landing at `/` and link back via `../index.html`.

Example local URLs:

- [http://localhost:5500/BRAINVOICE%20-%20OTHER%20PAGES/about.html](http://localhost:5500/BRAINVOICE%20-%20OTHER%20PAGES/about.html)
- [http://localhost:5500/BRAINVOICE%20-%20OTHER%20PAGES/contactus.html](http://localhost:5500/BRAINVOICE%20-%20OTHER%20PAGES/contactus.html)

## Deploy

Static site on [Vercel](https://vercel.com). Connect this repo; no build step required.
