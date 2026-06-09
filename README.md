# Matchmallow — Legal

Terms of Service and Privacy Policy for the Matchmallow app, in **English** and **Hebrew**, served as static pages via **GitHub Pages**.

Live: https://elkayam.github.io/matchmallow-legal/

## Pages
- `terms.html` / `terms.he.html`
- `privacy.html` / `privacy.he.html`
- `index.html`

## Editing
1. Edit the source Markdown: `TERMS_OF_SERVICE.md`, `PRIVACY_POLICY.md`, and the Hebrew `*.he.md`.
2. Rebuild the HTML (regenerates the `*.html` at the repo root):
   ```
   npm install
   npm run build
   ```
3. Commit and push — GitHub Pages redeploys automatically.

## Before publishing as final
- Fill every `[BRACKETED PLACEHOLDER]` (company legal name, jurisdiction, contact email, effective date, address).
- Remove the "TEMPLATE / DRAFT" notice at the top of each document.
- Have a qualified attorney review both languages.

## Custom domain (optional)
Point `legal.matchmallow.com` at GitHub Pages with a GoDaddy DNS **CNAME** record
(`legal` → `elkayam.github.io`), then set the custom domain in repo Settings → Pages.
