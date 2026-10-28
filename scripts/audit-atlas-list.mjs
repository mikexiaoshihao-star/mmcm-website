// For every project in site.json: one atlas record, and exactly one row in the
// mobile and desktop atlas lists when the discipline matches and the type
// filter is All or that project's type. Names must not be ellipsized.
import { createRequire } from 'module';
const require = createRequire(process.env.PLAYWRIGHT_PKG || import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright-core');
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(root, 'src/_data/site.json'), 'utf8'));
const base = process.env.BASE || 'http://localhost:8084';
const widths = (process.env.WIDTHS || '390,1440').split(',').map(Number);

function plain(title) {
  return String(title || '').replace(/_/g, ' ');
}

const projects = site.projects.map((p) => ({
  slug: p.slug,
  title: p.title,
  zh: p.title_zh || '',
  disc: p.discipline,
  type: p.type || '',
  loc: p.location || '',
  en: plain(p.title),
}));

const browser = await chromium.launch({
  executablePath: process.env.CHROME || '/usr/local/bin/google-chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage();
const gaps = [];
const seen = new Map();

async function rows() {
  return page.evaluate(() => [...document.querySelectorAll('.a-row')].map((el) => {
    const t = el.querySelector('.t');
    const cs = t ? getComputedStyle(t) : null;
    const clipped = !!(t && cs && (
      (cs.textOverflow === 'ellipsis' && t.scrollWidth > t.clientWidth + 1)
      || t.scrollHeight > t.clientHeight + 2
    ));
    return { slug: el.dataset.s, text: t ? t.textContent.trim() : '', clipped };
  }));
}

await page.goto(base + '/?view=map', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('.a-row', { timeout: 20000 });

for (const width of widths) {
  await page.setViewportSize({ width, height: 844 });
  await page.waitForTimeout(200);
  const discs = [...new Set(projects.map((p) => p.disc))];
  for (const disc of discs) {
    const types = ['all', ...new Set(projects.filter((p) => p.disc === disc && p.type).map((p) => p.type))];
    for (const type of types) {
      await page.evaluate(({ disc, type }) => {
        const app = document.querySelector('[x-data]')._x_dataStack[0];
        app.setWorksEntry(disc);
        app.setWorksType(type);
        app.setWorksView('map');
      }, { disc, type });
      await page.waitForTimeout(180);
      const list = await rows();
      const expect = projects.filter((p) => p.disc === disc && (type === 'all' || p.type === type));
      const counts = {};
      list.forEach((r) => { counts[r.slug] = (counts[r.slug] || 0) + 1; });
      for (const p of expect) {
        const n = counts[p.slug] || 0;
        const key = `${width}|${disc}|${type}|${p.slug}`;
        seen.set(key, n);
        if (n !== 1) gaps.push({ width, disc, type, slug: p.slug, n, why: n ? 'duplicate' : 'missing' });
        const row = list.find((r) => r.slug === p.slug);
        if (row && row.clipped) gaps.push({ width, disc, type, slug: p.slug, n, why: 'truncated ' + row.text });
      }
      for (const slug of Object.keys(counts)) {
        if (!expect.some((p) => p.slug === slug)) gaps.push({ width, disc, type, slug, n: counts[slug], why: 'unexpected' });
      }
    }
  }
}

const byCity = {};
for (const p of projects) {
  const k = p.disc + '|' + p.loc;
  byCity[k] = (byCity[k] || 0) + 1;
}
console.log('site.json', projects.length, 'cities', Object.keys(byCity).length);
console.log('city groups (discipline|location = count)');
Object.keys(byCity).sort().forEach((k) => console.log(' ', k, byCity[k]));
console.log('gaps', gaps.length);
gaps.forEach((g) => console.log(` ${g.why} ${g.width} ${g.disc}/${g.type} ${g.slug} x${g.n}`));
await browser.close();
if (gaps.length) process.exit(1);
