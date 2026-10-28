import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import sharp from 'sharp';
import * as esbuild from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const srcDir = path.join(root, 'src');
const outDir = path.join(srcDir, 'map', 'generated');
const site = JSON.parse(fs.readFileSync(path.join(srcDir, '_data', 'site.json'), 'utf8'));
const catZh = Object.fromEntries(site.categories.map((c) => [c.key, c.name]));

function parseCoords(value) {
  const match = /^([\d.]+)°N \/ ([\d.]+)°E$/.exec(value || '');
  if (!match) throw new Error('Unrecognised coordinates: ' + value);
  return [Number(match[1]), Number(match[2])];
}

function countryOf(lat, lon) {
  if (lon >= 73 && lon <= 135 && lat >= 3 && lat <= 54) return 'CN';
  return 'XX';
}

async function coverSize(srcPath, dest) {
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  const srcTime = fs.statSync(srcPath).mtimeMs;
  if (fs.existsSync(dest) && fs.statSync(dest).mtimeMs >= srcTime) {
    const meta = await sharp(dest).metadata();
    return [meta.width, meta.height];
  }
  const { data, info } = await sharp(srcPath, { limitInputPixels: false })
    .rotate()
    .resize(1500, 1500, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 78 })
    .toBuffer({ resolveWithObject: true });
  await fs.promises.writeFile(dest, data);
  return [info.width, info.height];
}

const missing = [];
const projects = [];
for (const project of site.projects) {
  const [lat, lon] = parseCoords(project.coords);
  const source = path.join(srcDir, String(project.url || '').replace(/^\//, ''));
  if (!fs.existsSync(source)) {
    missing.push(project.url);
    continue;
  }
  const rel = `cover/${project.slug}.webp`;
  const [w, h] = await coverSize(source, path.join(outDir, 'img', rel));
  const count = (project.images || []).length;
  projects.push({
    slug: project.slug,
    title: project.title,
    zh: project.title_zh || '',
    cat: project.category,
    catZh: catZh[project.category] || project.category,
    disc: project.discipline,
    type: project.type || '',
    architect: project.architect || '',
    year: String(project.year || ''),
    loc: project.location || '',
    lat, lon, cc: countryOf(lat, lon),
    cover: rel, w, h,
    thumbs: [rel],
    n: count + 1,
    imgs: [{ v: rel, t: rel }]
  });
}
if (missing.length) {
  console.error('Missing project images:\n' + missing.join('\n'));
  process.exit(1);
}

const names = { CN: ['CHINA', '中国'], XX: ['OTHER', '其他'] };
const places = {};
for (const code of [...new Set(projects.map((p) => p.cc))].sort()) {
  const group = projects.filter((p) => p.cc === code);
  const lons = group.map((p) => p.lon);
  const lats = group.map((p) => p.lat);
  const padLon = Math.max(1.2, (Math.max(...lons) - Math.min(...lons)) * 0.16);
  const padLat = Math.max(1.0, (Math.max(...lats) - Math.min(...lats)) * 0.2);
  places[code] = {
    name: names[code] || [code, code],
    bbox: [[Math.min(...lons) - padLon, Math.min(...lats) - padLat], [Math.max(...lons) + padLon, Math.max(...lats) + padLat]],
    center: [lons.reduce((s, n) => s + n, 0) / lons.length, lats.reduce((s, n) => s + n, 0) / lats.length]
  };
}

const dataDir = path.join(outDir, 'data');
await fs.promises.mkdir(dataDir, { recursive: true });
await fs.promises.writeFile(path.join(dataDir, 'projects.js'), 'window.MMCM=' + JSON.stringify({ projects, categories: site.categories }) + ';');
await fs.promises.writeFile(path.join(dataDir, 'places.js'), 'window.MMCM_PLACES=' + JSON.stringify(places) + ';');
const globePath = path.join(dataDir, 'globe.js');
const stampPath = path.join(dataDir, 'globe-stamp');
const stamp = crypto.createHash('sha256').update(JSON.stringify(projects.map((p) => [p.slug, p.lat, p.lon]))).digest('hex').slice(0, 16);
if (!(fs.existsSync(stampPath) && fs.readFileSync(stampPath, 'utf8') === stamp && fs.existsSync(globePath))) {
  const run = spawnSync(process.execPath, [path.join(path.dirname(fileURLToPath(import.meta.url)), 'dots.mjs')], { stdio: 'inherit' });
  if (run.status) process.exit(run.status || 1);
  fs.writeFileSync(stampPath, stamp);
}
const china = JSON.parse(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'china-100000.json'), 'utf8'));
const rings = [];
let bx0 = 180, by0 = 90, bx1 = -180, by1 = -90;
for (const poly of china.features[0].geometry.coordinates) {
  const ring = [];
  let px = null, py = null;
  for (const [x, y] of poly[0]) {
    const rx = Math.round(x * 1000) / 1000;
    const ry = Math.round(y * 1000) / 1000;
    if (rx === px && ry === py) continue;
    ring.push([rx, ry]);
    px = rx; py = ry;
    bx0 = Math.min(bx0, rx); by0 = Math.min(by0, ry); bx1 = Math.max(bx1, rx); by1 = Math.max(by1, ry);
  }
  if (ring.length > 2) rings.push(ring);
}
await fs.promises.writeFile(path.join(dataDir, 'outline.js'), 'window.MMCM_OUTLINE=' + JSON.stringify({ rings, bbox: [[bx0, by0], [bx1, by1]] }) + ';');
console.log('china outline rings', rings.length, 'bbox', bx0, by0, bx1, by1);
await esbuild.build({
  entryPoints: [path.join(srcDir, 'map', 'src', 'c.js')],
  bundle: true,
  format: 'iife',
  minify: true,
  outfile: path.join(outDir, 'atlas.js'),
  logLevel: 'warning'
});
console.log('map build ok', projects.length, 'projects', Object.keys(places).join(','));
