# Floatcap

Working capital designed for inference economics. Non-dilutive credit lines for AI companies.

## Getting Started

```bash
npm install
npm run dev
```

## Waitlist Form (Formspree)

The waitlist form integrates with [Formspree](https://formspree.io). To enable:

1. Create a free account at formspree.io
2. Create a new form
3. Copy the form ID (e.g. `xyzabcde`)
4. Create a `.env` file:

```
VITE_FORMSPREE_ID=xyzabcde
```

Without this variable, the form runs in **demo mode** (shows success but doesn't submit anywhere).

## Build

```bash
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
```

## Deploy

This project is Vercel-ready. Push to a GitHub repo and import it into Vercel — zero configuration needed.

## Project Structure

```
├── index.html         # Landing page
├── privacy.html       # Privacy Policy
├── terms.html         # Terms of Service
├── vite.config.js     # Multi-page Vite config
├── public/
│   └── favicon.svg    # SVG favicon
└── src/
    ├── main.js        # Entry point
    ├── style.css      # All styles
    ├── mesh-bg.js     # Hero canvas background
    ├── terminal.js    # Credit assessment animation
    ├── scroll-reveal.js
    ├── nav.js         # Scroll shrink + mobile menu
    ├── waitlist.js    # Form handling + Formspree
    └── back-to-top.js
```
