# Luxio product website

Static homepage for https://luxio.lighting. Preview from this directory with:

```sh
python3 -m http.server 8018 --bind 127.0.0.1
```

Open http://127.0.0.1:8018. No build is needed to serve the checked-in page.
`index.html` contains the page and styles; `assets/` contains the gallery and
animation code. The phone overlaps the browser’s bottom-right corner. A shared five-page pager
advances both screens every six seconds, with a countdown ring around its active
dot. All five iOS screenshots are shown; five web screenshots cycle alongside them. Manual and automatic paging crossfade over 400ms
(or switch instantly with reduced motion). Hover, keyboard focus, offscreen content, and hidden
tabs suspend the timer. Reduced-motion preferences disable automatic playback
for both slideshows and the LED preview.

## Screenshots

`img/screenshots/` contains original 1320 × 2868 iOS marketing-v2 PNGs and
3200 × 1800 lossless web PNGs captured in Google Chrome at a 1600 × 900 viewport
with a 2× device pixel ratio, with the mobile app banner dismissed. Copies and
capture details are saved in the web app repository under `docs/screenshots/`. The Lua section shows a selectable, syntax-highlighted script example. No physical devices were
controlled. Source checkouts at capture time:

- `luxio-ios/release/marketing-v2/raw/`: home, gradient, animation, settings, Matter.
- `app.luxio.lighting/.sdk/readme-app.html`: gradient, color, animation, setup dialog and Lua editor.

## Animation preview

The ten Lua presets in `assets/presets.json` are copied from the web app's
`src/presets.json`. The preview runs their real Lua source on 60 simulated RGB
LEDs using the app's renderer, snapshotted in `preview-source/`. Its color type is
kept locally so the marketing page needs no device protocol or sibling checkout.
The Lua runtime loads only when the preview approaches the viewport, and playback
pauses offscreen and in background tabs. Fengari's license is in `assets/`;
bundled dependencies retain their license notices in `lua-runtime.js`.

To rebuild the checked-in runtime after changing its source:

```sh
npm ci
npm run build:preview
```

The gallery and preview controls are plain JavaScript and need no compilation.

## Deployment

Pushes to `main` deploy through `.github/workflows/deploy.yml`, publishing only
`index.html`, `privacy.html`, `img/`, `assets/`, `CNAME`, and `.nojekyll`.
GitHub Pages must use GitHub Actions as its source, with `luxio.lighting` as its
custom domain and DNS pointing to GitHub Pages.

## Brand assets

- Homey: original colored icon from https://homey.app/img/favicon/favicon.svg (embedded PNG extracted unchanged).
- Home Assistant: colored logomark from https://github.com/home-assistant/assets/tree/master/logo.
- Matter: Connectivity Standards Alliance symbol from https://commons.wikimedia.org/wiki/File:Logo_of_Matter_connectivity_standard.svg, rendered white.
- Google Chrome: official logo from https://www.google.com/chrome/static/images/chrome-logo.svg.
