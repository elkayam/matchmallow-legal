// Converts the Markdown legal docs (English + Hebrew) into clean, standalone,
// styled HTML pages for hosting (e.g. GitHub Pages). Hebrew pages render RTL.
// Run: `node build.mjs` from the legal/ folder.
import { Marked } from 'marked';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

// GitHub-style heading slug (handles Latin + Hebrew) so the Table-of-Contents
// anchor links resolve in the generated HTML.
const slug = (s) => s.toLowerCase().trim()
  .replace(/[^\w֐-׿\s-]/g, '')
  .replace(/\s+/g, '-');

// Rewrite inter-document .md links to the built .html, staying within the same
// language (so the Hebrew Terms links to the Hebrew Privacy, etc.).
const fixLinks = (md, lang) => {
  const ext = lang === 'he' ? '.he.html' : '.html';
  return md
    .replace(/\.?\/?TERMS_OF_SERVICE(?:\.he)?\.md/g, `terms${ext}`)
    .replace(/\.?\/?PRIVACY_POLICY(?:\.he)?\.md/g, `privacy${ext}`);
};

const render = (md, lang) => {
  const m = new Marked({ gfm: true });
  m.use({ renderer: { heading(text, level, raw) { return `<h${level} id="${slug(raw)}">${text}</h${level}>\n`; } } });
  return m.parse(fixLinks(md, lang));
};

const css = `
  :root { --rose:#C4687A; --ink:#2D2420; --muted:#7a6a62; --bg:#FAF6F1; --line:#ece3db; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--ink);
    font:16px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; }
  .wrap { max-width: 820px; margin: 0 auto; padding: 28px 22px 80px; }
  .langbar { max-width:820px; margin:0 auto; padding:14px 22px 0; font-size:14px; }
  .langbar a { color:var(--rose); text-decoration:none; font-weight:600; }
  h1 { font-size: 30px; line-height:1.2; margin:.2em 0 .4em; }
  h2 { font-size: 21px; margin-top: 2em; padding-top:.4em; border-top:1px solid var(--line); }
  h3 { font-size: 17px; margin-top: 1.4em; }
  a { color: var(--rose); }
  blockquote { background:#fff5f6; border-left:4px solid var(--rose); margin:1.2em 0;
    padding:.8em 1em; border-radius:8px; color:#7a3b48; }
  table { width:100%; border-collapse:collapse; margin:1.2em 0; font-size:14px; }
  th,td { border:1px solid var(--line); padding:8px 10px; text-align:left; vertical-align:top; }
  th { background:#fff; }
  code { background:#fff; border:1px solid var(--line); border-radius:5px; padding:1px 5px; font-size:.9em; }
  hr { border:0; border-top:1px solid var(--line); margin:2em 0; }
  ul,ol { padding-left:1.3em; }
  .foot { margin-top:60px; padding-top:20px; border-top:1px solid var(--line); color:var(--muted); font-size:13px; text-align:center; }
  /* RTL overrides */
  body[dir="rtl"] blockquote { border-left:0; border-right:4px solid var(--rose); }
  body[dir="rtl"] ul, body[dir="rtl"] ol { padding-left:0; padding-right:1.3em; }
  body[dir="rtl"] th, body[dir="rtl"] td { text-align:right; }
`;

// langLinks: array of { href, label, current }
const page = (title, bodyHtml, lang, langLinks) => {
  const dir = lang === 'he' ? 'rtl' : 'ltr';
  const bar = langLinks.map(l =>
    l.current ? `<strong>${l.label}</strong>` : `<a href="${l.href}">${l.label}</a>`
  ).join(' · ');
  return `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="index">
<title>${title} · Matchmallow</title>
<style>${css}</style>
</head>
<body dir="${dir}">
<nav class="langbar">${bar}</nav>
<main class="wrap">
${bodyHtml}
</main>
</body>
</html>
`;
};


// Each doc: english + hebrew, cross-linked. Skips a language whose source is missing.
const docs = [
  { en: 'TERMS_OF_SERVICE.md', he: 'TERMS_OF_SERVICE.he.md', base: 'terms', titleEn: 'Terms of Service', titleHe: 'תנאי שימוש' },
  { en: 'PRIVACY_POLICY.md', he: 'PRIVACY_POLICY.he.md', base: 'privacy', titleEn: 'Privacy Policy', titleHe: 'מדיניות פרטיות' },
];

for (const d of docs) {
  const enHref = `${d.base}.html`, heHref = `${d.base}.he.html`;
  const hasHe = existsSync(d.he);
  const links = (current) => [
    { href: enHref, label: 'English', current: current === 'en' },
    ...(hasHe ? [{ href: heHref, label: 'עברית', current: current === 'he' }] : []),
  ];

  writeFileSync(`${enHref}`, page(d.titleEn, render(readFileSync(d.en, 'utf8'), 'en'), 'en', links('en')));
  console.log(`wrote ${enHref}`);
  if (hasHe) {
    writeFileSync(`${heHref}`, page(d.titleHe, render(readFileSync(d.he, 'utf8'), 'he'), 'he', links('he')));
    console.log(`wrote ${heHref}`);
  } else {
    console.log(`(skipped ${heHref} — ${d.he} not found yet)`);
  }
}

const heExists = existsSync('TERMS_OF_SERVICE.he.md');
writeFileSync('index.html', page('Legal', `
<h1>Matchmallow — Legal</h1>
<p>Intentional dating, done right.</p>
<h2>English</h2>
<ul><li><a href="terms.html">Terms of Service</a></li><li><a href="privacy.html">Privacy Policy</a></li></ul>
${heExists ? `<h2>עברית</h2>
<ul><li><a href="terms.he.html">תנאי שימוש</a></li><li><a href="privacy.he.html">מדיניות פרטיות</a></li></ul>` : ''}
`, 'en', [{ href: '#', label: 'Matchmallow', current: true }]));
console.log('wrote index.html');
