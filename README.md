# Luxio product website

Static homepage for https://luxio.lighting, extracted from `luxio-web/routes/www`.

`index.html` contains the page and its styles; `img/` contains all local assets.
No build step or Node.js server is required.

To preview locally, run `python3 -m http.server 8000` from this directory and open
http://localhost:8000.

Pushes to `main` deploy the homepage to GitHub Pages through
`.github/workflows/deploy.yml`. The workflow publishes only `index.html`,
`privacy.html`, `img/`, `CNAME`, and `.nojekyll`. GitHub Pages must use GitHub Actions as its source, with
`luxio.lighting` configured as its custom domain and DNS pointing to GitHub Pages.
