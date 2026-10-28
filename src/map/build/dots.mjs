// Land dots for the globe only: a coarse world field plus dense dots around projects.
// This does not draw a country outline or the nine-dash line.
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { feature } from 'topojson-client';
import { geoContains, geoBounds } from 'd3-geo';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const topo = JSON.parse(fs.readFileSync(require.resolve('world-atlas/land-50m.json'), 'utf8'));
const land = feature(topo, topo.objects.land);
const geom = land.features ? land.features[0] : land;
const polys = (geom.geometry.type === 'MultiPolygon' ? geom.geometry.coordinates : [geom.geometry.coordinates]).map((c) => {
  const g = { type: 'Polygon', coordinates: c };
  return { g, b: geoBounds(g) };
});
function onLand(lon, lat) {
  for (const p of polys) {
    const [[x0, y0], [x1, y1]] = p.b;
    if (lat < y0 || lat > y1) continue;
    if (x0 <= x1 && (lon < x0 || lon > x1)) continue;
    if (geoContains(p.g, [lon, lat])) return true;
  }
  return false;
}
const data = fs.readFileSync(path.join(here, '../generated/data/projects.js'), 'utf8');
const P = JSON.parse(data.slice(data.indexOf('=') + 1, data.lastIndexOf(';'))).projects;
const out = { l0: [], l2: [], l3: [] };
const s0 = 1.7;
for (let lat = -58; lat <= 84; lat += s0) {
  const k = Math.max(0.12, Math.cos(lat * Math.PI / 180));
  const step = s0 / k;
  for (let lon = -180; lon < 180; lon += step) if (onLand(lon, lat)) out.l0.push(Math.round(lon * 100), Math.round(lat * 100));
}
const s2 = 0.13, R = 1.7;
for (let lat = 15; lat <= 54; lat = +(lat + s2).toFixed(4)) {
  for (let lon = 73; lon <= 136; lon = +(lon + s2 / Math.cos(lat * Math.PI / 180) * 0.78).toFixed(4)) {
    if (!P.some((p) => Math.abs(p.lat - lat) < R && Math.abs(p.lon - lon) < R * 1.2)) continue;
    if (onLand(lon, lat)) out.l2.push(Math.round(lon * 100), Math.round(lat * 100));
  }
}
const s3 = 0.025, R3 = 0.32;
for (let lat = 15; lat <= 54; lat = +(lat + s3).toFixed(4)) {
  const rows = P.filter((p) => Math.abs(p.lat - lat) < R3);
  if (!rows.length) continue;
  const ls = s3 / Math.cos(lat * Math.PI / 180) * 0.78;
  for (let lon = 73; lon <= 136; lon = +(lon + ls).toFixed(4)) {
    if (!rows.some((p) => Math.abs(p.lon - lon) < R3 * 1.15)) continue;
    if (onLand(lon, lat)) out.l3.push(Math.round(lon * 1000), Math.round(lat * 1000));
  }
}
const dest = path.join(here, '../generated/data/globe.js');
fs.writeFileSync(dest, 'window.MMCM_GLOBE=' + JSON.stringify(out) + ';');
console.log('globe dots', out.l0.length / 2, out.l2.length / 2, out.l3.length / 2);
