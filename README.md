# Matchmallow — Legal

Terms of Service and Privacy Policy for the Matchmallow app, in **English** and **Hebrew**, served as static pages via **GitHub Pages**.

Live: https://legal.matchmallow.com/ (also https://elkayam.github.io/matchmallow-legal/)

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

## Status
- Placeholders filled (company = Matchmallow, contact = matchmallowapp@gmail.com, governing law = State of Israel, effective date = June 9 2026, email-only contact).
- Draft/template notice removed — these are the publish version.

## Still recommended
- Have a qualified attorney review both languages before relying on them.
- When the business is incorporated, replace "Matchmallow" with the registered legal entity name.

## Custom domain
Live at `legal.matchmallow.com` (GoDaddy DNS **CNAME** `legal` → `elkayam.github.io`,
custom domain set in repo Settings → Pages).
