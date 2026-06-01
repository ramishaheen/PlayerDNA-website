# PlayerDNA Labs — Website

Marketing and product website for **PlayerDNA Labs**, an AI football position &
athlete intelligence concept. The site turns the idea — "feed in one training or
match video, get a complete athlete profile and the positions a player is built
for" — into a polished, fully animated **single-page** experience.

This repository contains **the website only**. The analysis system it describes
(computer-vision tracking, pose estimation, scoring engines) is presented as
product content and is intended to be wired in later behind the same UI.

## The page

Everything lives in `index.html` as one scrolling experience. Anchor-based
navigation and a scroll-spy nav move between sections:

| Section          | What it covers |
|------------------|----------------|
| Hero             | Live "scan card", headline value proposition, animated metrics. |
| Capabilities     | The six core engines — video movement, pose, athlete profile, position engine, dashboard, report. |
| How it works     | Upload → track & pose → score → recommend, in four steps. |
| Position intelligence | Why recommendations weigh sixteen dimensions, with an animated radar chart. |
| Modules          | Nineteen advanced modules across three pillars, browsable in tabs (profile, physical, movement/injury, intelligence/output). |
| Dashboard        | A full sample athlete dashboard — score cards, performance radar, movement heatmap, best-fit positions, injury-risk map, physical tests, biomechanics and a development plan. Includes a working **Download report** (print / save-as-PDF). |
| Technology       | The production-grade vision, modeling, services and reporting stack. |
| Safety           | The sport-performance-vs-medical-diagnosis disclaimer. |
| Auth modal       | **Sign in / Create account** overlay with validation. Front-end only — connect your auth backend to go live. |

## Tech

- **Static site**: HTML5 + CSS3 + vanilla JavaScript. No build step, no dependencies.
- **Design system**: CSS custom properties in `assets/css/styles.css` (dark sports-tech theme, brand gradient, reusable components, print styles).
- **Interactions**: `assets/js/main.js` — sticky nav, mobile menu, scroll-reveal, scroll-spy nav, animated counters, progress bars, SVG radar charts, card spotlight, magnetic buttons, tabs, auth modal, password toggle, form validation, print, lazy photo loading with graceful fallback.
- **Imagery**: royalty-free sport photography hot-linked from [Unsplash](https://unsplash.com) (no attribution required), with a transparent-SVG fallback if a photo fails to load.
- **Fonts**: Space Grotesk (display) + Inter (body) via Google Fonts.
- **Accessibility**: semantic markup, ARIA labels, and full `prefers-reduced-motion` support.

## Run it

No tooling required — open `index.html` directly, or serve the folder:

```bash
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then visit `http://localhost:8000`.

## Project structure

```
.
├── index.html
└── assets/
    ├── css/styles.css
    ├── js/main.js
    └── img/logo.svg
```

## Connecting a backend later

The UI is built to be wired up without restructuring:

- **Auth** — the `#authForm` in the auth modal (bottom of `index.html`) validates
  input and calls a placeholder handler in `main.js`. Replace that handler with a
  call to your auth API or OAuth provider.
- **Dashboard** — the dashboard section renders from inline sample values. Swap
  them for data from your analysis service; the radar reads `data-labels` /
  `data-values`, bars read `data-bar`, and counters read `data-count`.

## Disclaimer

PlayerDNA Labs provides sport-performance analysis, position-suitability
estimation and training guidance. It does **not** replace medical diagnosis,
physiotherapy assessment or professional coaching judgment.

## License

[MIT](LICENSE) — all branding and copy in this repository are original. Photography
is provided by Unsplash under the [Unsplash License](https://unsplash.com/license).
