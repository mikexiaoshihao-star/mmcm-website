// Option C — hybrid: B's rotating dot globe + A's list, with a middle COUNTRY layer.
// Layers: globe → country (sphere un-projects into a flat azimuthal dot map) → project (fly, card, leader, crosshair) → project page.
import { interpolateZoom } from 'd3-interpolate';
import { state, P, $, $$, h, t, pname, catName, architectName, fmtCoord, scramble, mountTip, filtered, cityOf, cityName, cover, pad2, emptyHTML, byYear, reduceMotion } from './common.js';
import { createMarkers } from './markers.js';
import { openPage, pageOpen, closePage } from './c-page.js';

const PLACES = window.MMCM_PLACES || {}, G = window.MMCM_GLOBE, D2R = Math.PI / 180;
const mobile = () => innerWidth < 768;
const cname = (cc) => { const n = (PLACES[cc] && PLACES[cc].name) || [cc, cc]; return t(n[0], n[1]); };
P.forEach((p) => { p._cc = p.cc || 'CN'; });

/* ---------- chrome: mounted into the works page, not a second site nav ---------- */
const main = h('<div class="C atlas-root"></div>');
const view = h(`<section class="c-view">
  <aside class="a-list c-list"><div class="a-list-h"><span class="a-count"></span><span class="a-hint"></span></div><div class="c-groups"></div></aside>
  <section class="b-stage c-stage L-globe"><canvas class="b-cv"></canvas><svg class="b-lead"><line/></svg>
    <div class="b-hud"><div class="c-crumb"></div><div class="b-read"><span class="b-read-k"></span><span class="b-read-v"></span><span class="b-read-a"></span></div></div>
    <div class="b-ctl"><button data-z="in" aria-label="zoom in">+</button><button data-z="out" aria-label="zoom out">−</button><button data-z="up" aria-label="up one layer">↑</button><button data-z="home" aria-label="globe"><svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M1.5 6.4 6 2.6l4.5 3.8M3.2 5.8V9.4h5.6V5.8" fill="none" stroke="currentColor" stroke-width="1"/></svg></button></div>
    <div class="c-cts"></div><div class="b-card"></div><div class="b-empty"></div></section></section>`);
main.append(view);
const stage = $('.c-stage', view);
const cv = $('.b-cv', stage), ctx = cv.getContext('2d'), lead = $('.b-lead', stage), line = $('line', lead);
const card = $('.b-card', stage), ctsEl = $('.c-cts', stage), crumb = $('.c-crumb', stage);
const readK = $('.b-read-k', stage), readV = $('.b-read-v', stage), readA = $('.b-read-a', stage);
const tip = mountTip(stage);

function prep(arr, div, buf) {
  const n = arr.length / 2, sl = new Float32Array(n), cl = new Float32Array(n), lo = new Float32Array(n), wt = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const lon = arr[2 * i] / div, lat = arr[2 * i + 1] / div, F = lat * D2R;
    lo[i] = lon * D2R; sl[i] = Math.sin(F); cl[i] = Math.cos(F);
    if (!buf) { wt[i] = 1; continue; }
    let d = 1e9;
    for (const p of P) d = Math.min(d, Math.hypot((p.lon - lon) * Math.cos(F), p.lat - lat));
    const u = Math.max(0, Math.min(1, (d - buf * 0.25) / (buf * 0.7)));
    wt[i] = 1 - u * u * (3 - 2 * u);
  }
  return { n, sl, cl, lo, wt };
}
const WORLD = G && G.l0 ? { ...prep(G.l0, 100, 0), sp: 1.7 * D2R, kind: 'world', szf: 0.16 } : null;
const FINE = G ? [[G.l2, 100, 0.13, 1.7], [G.l3, 1000, 0.025, 0.32]].filter((row) => row[0] && row[0].length).map(([a, d, sp, b]) => ({ ...prep(a, d, b), sp: sp * D2R, kind: 'fine', szf: 0.16 })) : [];

/* ---------- view: V.m morphs orthographic (0) → azimuthal equidistant (1) around the same centre ---------- */
let W = 0, H = 0, dpr = 1;
const HOME = { lon: 104, lat: 30 };
const V = { lon: HOME.lon, lat: HOME.lat, R: 300, cx: 0, cy: 0, m: 0 };
const homeR = () => (mobile() ? Math.min(W * 0.4, H * 0.36) : Math.min(W, H) * 0.38);
const homeC = () => [W * 0.5, mobile() ? H * 0.56 : H * 0.5];
const cardC = () => mobile() ? [W * 0.5, H * 0.36] : [W * 0.36, H * 0.5];
let lastCC = null, layer = 'globe', cc = null, idle = true, sel = null, flying = false, current = [];
function proj(lon, lat) {
  const l0 = V.lon * D2R, f0 = V.lat * D2R, L = lon * D2R, F = lat * D2R, cf = Math.cos(F), dl = L - l0;
  const cosc = Math.sin(f0) * Math.sin(F) + Math.cos(f0) * cf * Math.cos(dl);
  let x = cf * Math.sin(dl), y = Math.cos(f0) * Math.sin(F) - Math.sin(f0) * cf * Math.cos(dl);
  const m = V.m; let vis = cosc;
  if (m > 0) { const sc = Math.hypot(x, y); if (sc > 1e-9) { const c = Math.atan2(sc, cosc), k = ((1 - m) * sc + m * c) / sc; x *= k; y *= k; vis = (1 - m) * cosc + m * (c < 1.4 ? 1 : -1); } }
  return [V.cx + V.R * x, V.cy - V.R * y, vis];
}
function invert(x, y) {
  if (V.m > 0.02 && V.m < 0.98) return null;
  const px = (x - V.cx) / V.R, py = (V.cy - y) / V.R, rho = Math.hypot(px, py);
  const c = V.m >= 0.98 ? rho : (rho > 1 ? NaN : Math.asin(rho)); if (!(c >= 0) || c > 3) return null;
  const sc = Math.sin(c), cc2 = Math.cos(c), f0 = V.lat * D2R;
  const lat = Math.asin(cc2 * Math.sin(f0) + (rho ? py * sc * Math.cos(f0) / rho : 0));
  const lon = V.lon * D2R + Math.atan2(px * sc, rho * Math.cos(f0) * cc2 - py * Math.sin(f0) * sc);
  return [((lon / D2R + 540) % 360) - 180, lat / D2R];
}

/* ---------- render ---------- */
const sm = (a, b, x) => { const u = Math.max(0, Math.min(1, (x - a) / (b - a))); return u * u * (3 - 2 * u); };
let cross = 0;
function layerAlpha(Ly, s) {
  const m = V.m;
  if (Ly.kind === 'world') return (V.R < 1 ? 1 : 1 - sm(22, 48, s)) * (1 - 0.8 * m);
  if (Ly.kind === 'fine') return sm(0.7, 1.8, s) * (1 - sm(22, 48, s));
  return 0;
}
function drawGraticule() {
  const step = V.R < 500 ? 30 : V.R < 2500 ? 10 : V.R < 12000 ? 2 : 0.5;
  ctx.save();
  ctx.strokeStyle = 'rgba(17,17,17,0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  const stroke = (pts) => {
    let on = false;
    for (let i = 0; i < pts.length; i++) {
      const [x, y, vis] = proj(pts[i][0], pts[i][1]);
      if (vis < 0.08 || x < -20 || y < -20 || x > W + 20 || y > H + 20) { on = false; continue; }
      if (!on) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      on = true;
    }
  };
  for (let lat = -60; lat <= 75; lat += step) {
    const pts = [];
    for (let lon = -180; lon <= 180; lon += Math.max(2, step)) pts.push([lon, lat]);
    stroke(pts);
  }
  for (let lon = -180; lon < 180; lon += step) {
    const pts = [];
    for (let lat = -60; lat <= 75; lat += Math.max(2, step / 2)) pts.push([lon, lat]);
    stroke(pts);
  }
  ctx.stroke();
  ctx.restore();
}
function draw() {
  if (state.view !== 'map') return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
  const R = V.R, m = V.m;
  const l0 = V.lon * D2R, f0 = V.lat * D2R, s0 = Math.sin(f0), c0 = Math.cos(f0);
  const oa = (1 - sm(Math.min(W, H) * 0.6, Math.min(W, H) * 1.2, R)) * (1 - m);
  if (oa > 0.01) { ctx.strokeStyle = `rgba(17,17,17,${0.18 * oa})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(V.cx, V.cy, R * (1 + m * 0.5708), 0, 7); ctx.stroke(); }
  if (layer === 'country' && m > 0.85 && !sel) { ctx.save(); ctx.globalAlpha = 0.28; drawGraticule(); ctx.restore(); }
  ctx.fillStyle = '#111';
  const layers = [...(WORLD ? [WORLD] : []), ...FINE];
  for (const Ly of layers) {
    const s = Ly.sp * R; const a = layerAlpha(Ly, s); if (a < 0.02) continue;
    const sz = Math.max(1, Math.min(2.4, s * Ly.szf));
    const { n, sl, cl, lo, wt } = Ly;
    for (let i = 0; i < n; i++) {
      if (wt[i] < 0.03) continue;
      const dl = lo[i] - l0, cdl = Math.cos(dl), cosc = s0 * sl[i] + c0 * cl[i] * cdl;
      if (m === 0 && cosc < 0.02) continue;
      let x = cl[i] * Math.sin(dl), y = c0 * sl[i] - s0 * cl[i] * cdl, f;
      if (m > 0) { const sc = Math.sqrt(x * x + y * y); const cang = Math.atan2(sc, cosc); if (cang > 1.45) continue; if (sc > 1e-9) { const k = ((1 - m) * sc + m * cang) / sc; x *= k; y *= k; } f = (1 - m) * Math.max(0, 0.25 + 0.75 * Math.min(1, cosc * 1.6)) + m; }
      else f = 0.25 + 0.75 * Math.min(1, cosc * 1.6);
      const X = V.cx + R * x; if (X < -4 || X > W + 4) continue;
      const Y = V.cy - R * y; if (Y < -4 || Y > H + 4) continue;
      ctx.globalAlpha = a * wt[i] * f; ctx.fillRect(X - sz / 2, Y - sz / 2, sz, sz);
    }
  }
  ctx.globalAlpha = 1;
  // on the globe, projects are small solid points under their country marker
  if (layer === 'globe' || flying) { const ga = 1 - sm(0.3, 0.9, m); if (ga > 0.02) { ctx.globalAlpha = ga; current.forEach((p) => { const [x, y, v] = proj(p.lon, p.lat); if (v > 0.05) ctx.fillRect(x - 1.5, y - 1.5, 3, 3); }); ctx.globalAlpha = 1; } }
  if (sel && cross > 0.01) { const [x, y] = proj(sel.lon, sel.lat);
    ctx.strokeStyle = `rgba(17,17,17,${0.35 * cross})`; ctx.lineWidth = 1; ctx.setLineDash([2, 4]);
    ctx.beginPath(); ctx.moveTo(0, Math.round(y) + 0.5); ctx.lineTo(W, Math.round(y) + 0.5); ctx.moveTo(Math.round(x) + 0.5, 0); ctx.lineTo(Math.round(x) + 0.5, H); ctx.stroke(); ctx.setLineDash([]); }
  // project markers only inside the active country layer
  const showMk = layer !== 'globe' && m > 0.6;
  mk.update(current.map((p) => { const [x, y, c] = proj(p.lon, p.lat); return { p, x, y, vis: showMk && p._cc === cc && c > 0.05 && x > -30 && y > -30 && x < W + 30 && y < H + 30, solo: sel && p.slug === sel.slug }; }));
  mk.setLabels(V.R > 15000 && !sel && !mobile());
  placeCountries();
  if (sel && card.classList.contains('on')) placeLead();
  if (!sel) setRead(null);
  readA.textContent = `${t('ALT', '高度')} ${Math.round(6371 * (Math.min(W, H) * 0.5 / R) * 1.4).toLocaleString('en')} KM`;
}
function paintDigits(el, text) {
  if (!el) return;
  el.classList.add('t-digits');
  const frag = document.createDocumentFragment();
  for (const ch of String(text)) {
    if (ch >= '0' && ch <= '9') { const i = document.createElement('i'); i.className = 'd'; i.textContent = ch; frag.appendChild(i); }
    else frag.appendChild(document.createTextNode(ch));
  }
  el.replaceChildren(frag);
}
function setRead(p, scr) {
  const v = p ? fmtCoord(p.lat, p.lon) : fmtCoord(V.lat, ((V.lon + 540) % 360) - 180);
  const k = p ? pname(p) : layer === 'globe' ? t('VIEW CENTRE', '视图中心') : `${cname(cc)} · ${t('VIEW CENTRE', '视图中心')}`;
  readK.textContent = k; if (!readV._lock || scr) paintDigits(readV, v);
}

/* ---------- country markers (globe layer) ---------- */
let ctMk = {};
function renderCountries() {
  ctsEl.innerHTML = ''; ctMk = {};
  Object.entries(PLACES).forEach(([code]) => {
    const ps = current.filter((p) => p._cc === code); if (!ps.length) return; // a country appears only once it has a (filtered) project
    const lon = ps.reduce((s, p) => s + p.lon, 0) / ps.length;
    const lat = ps.reduce((s, p) => s + p.lat, 0) / ps.length;
    const b = h(`<button class="c-ct" data-cc="${code}"><b>${pad2(ps.length)}</b><em>${cname(code)}</em></button>`);
    b.onclick = (e) => { e.stopPropagation(); enterCountry(code); };
    b.onmouseenter = () => { groupHL(code); }; b.onmouseleave = () => groupHL(null);
    ctsEl.appendChild(b); ctMk[code] = { b, lon, lat };
  });
}
function placeCountries() {
  const on = layer === 'globe' && V.m < 0.3;
  Object.values(ctMk).forEach((o) => { const [x, y, v] = proj(o.lon, o.lat); o.b.style.transform = `translate(${x}px,${y}px)`; o.b.classList.toggle('on', on && v > 0.15); });
}

/* ---------- markers (country layer) ---------- */
const mk = createMarkers(stage, {
  radius: 26,
  onHover: (p) => { if (mobile() || (sel && sel.slug === p.slug)) return; const [x, y] = proj(p.lon, p.lat); tip.show(p, x, y, { w: W, h: H }); rowHL([p.slug]); },
  onLeave: () => { tip.hide(); rowHL([]); },
  onClick: (p) => select(p),
  onCluster: (ms) => { const cnt = {}; ms.forEach((p) => { const c = cityOf(p); cnt[c] = (cnt[c] || 0) + 1; }); const top = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0][0]; return fitCity(top); },
  onClusterHover: (ms) => rowHL(ms.map((m) => m.slug)),
});

/* ---------- camera: van Wijk zoom along the great circle, with the projection morph riding the same clock ---------- */
const EZ = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
let flyTok = 0;
function flyTo(lon, lat, R1, c1, ms, m1 = V.m) {
  const tok = ++flyTok; idle = false; flying = true;
  const a = [V.lon * D2R, V.lat * D2R], b = [lon * D2R, lat * D2R];
  const dist = Math.acos(Math.max(-1, Math.min(1, Math.sin(a[1]) * Math.sin(b[1]) + Math.cos(a[1]) * Math.cos(b[1]) * Math.cos(b[0] - a[0]))));
  const gi = (f) => { if (dist < 1e-9) return [lon, lat];
    const A = Math.sin((1 - f) * dist) / Math.sin(dist), B = Math.sin(f * dist) / Math.sin(dist);
    const x = A * Math.cos(a[1]) * Math.cos(a[0]) + B * Math.cos(b[1]) * Math.cos(b[0]), y = A * Math.cos(a[1]) * Math.sin(a[0]) + B * Math.cos(b[1]) * Math.sin(b[0]), z = A * Math.sin(a[1]) + B * Math.sin(b[1]);
    return [Math.atan2(y, x) / D2R, Math.atan2(z, Math.hypot(x, y)) / D2R]; };
  const S = Math.min(W, H);
  const iz = interpolateZoom([0, 0, S / V.R], [dist, 0, S / R1]); iz.rho = 1.3;
  const dur = ms || Math.max(1300, Math.min(3000, iz.duration * 0.75));
  const cx0 = V.cx, cy0 = V.cy, m0 = V.m, t0 = performance.now();
  // flatten late on the way in (face the country first), round up early on the way out
  const mf = m1 > m0 ? (e) => sm(0.3, 1, e) : (e) => sm(0, 0.7, e);
  return new Promise((res) => {
    const step = (now) => {
      if (tok !== flyTok) return res(false);
      const u = Math.min(1, (now - t0) / dur), e = EZ(u), z = iz(e);
      const f = dist > 1e-9 ? z[0] / dist : 1; const [lo, la] = gi(Math.max(0, Math.min(1, f)));
      V.lon = lo; V.lat = la; V.R = u >= 1 ? R1 : S / z[2]; V.m = m0 + (m1 - m0) * mf(e);
      V.cx = cx0 + (c1[0] - cx0) * e; V.cy = cy0 + (c1[1] - cy0) * e;
      need = true;
      if (u < 1) requestAnimationFrame(step); else { flying = false; res(true); }
    };
    requestAnimationFrame(step);
  });
}
// generic per-country fit: project the country's coarse dots flat around its bbox centre and fit them in the stage
function countryFit(code) {
  const c = PLACES[code] || { bbox: [[100, 20], [110, 40]] };
  const [[x0, y0], [x1, y1]] = c.bbox;
  const lon = (x0 + x1) / 2, lat = (y0 + y1) / 2;
  const span = Math.max((x1 - x0) * Math.cos(lat * D2R), y1 - y0) * D2R;
  const R = Math.min(W, H) * (mobile() ? 0.58 : 0.7) / Math.max(span, 0.02);
  return { lon, lat, R, c: homeC() };
}
let busy = false;
async function enterCountry(code, ms) {
  tip.hide(); closeCard(); sel = null; mk.setActive(null); rowAct(null);
  layer = 'country'; cc = code; setLayerUI();
  const f = countryFit(code);
  const ok = await flyTo(f.lon, f.lat, f.R, f.c, ms || 2300, 1);
  return ok;
}
function goGlobe() {
  tip.hide(); closeCard(); sel = null; mk.setActive(null); rowAct(null);
  lastCC = cc || lastCC; layer = 'globe'; cc = null; setLayerUI();
  return flyTo(HOME.lon, HOME.lat, homeR(), homeC(), 2100, 0).then((ok) => { if (ok) idle = true; });
}
function fitCity(city) {
  const ms = current.filter((p) => cityOf(p) === city); if (!ms.length) return;
  const go = () => { closeCard(); sel = null; mk.setActive(null); rowAct(null); layer = 'country'; setLayerUI();
    const lon = ms.reduce((s, p) => s + p.lon, 0) / ms.length, lat = ms.reduce((s, p) => s + p.lat, 0) / ms.length;
    let md = 0, pair = Infinity;
    ms.forEach((p) => { md = Math.max(md, Math.hypot((p.lon - lon) * Math.cos(lat * D2R), p.lat - lat) * D2R); });
    for (let i = 0; i < ms.length; i++) for (let j = i + 1; j < ms.length; j++) {
      const d = Math.hypot((ms[i].lon - ms[j].lon) * Math.cos(lat * D2R), ms[i].lat - ms[j].lat) * D2R;
      if (d > 1e-6) pair = Math.min(pair, d);
    }
    const spread = 40;
    const separate = Number.isFinite(pair) ? spread / pair : 0;
    const fit = Math.min(W, H) * (mobile() ? 0.34 : 0.4) / Math.max(md, 0.00015);
    const R1 = Math.min(1500000, Math.max(fit, separate));
    rowHL(ms.map((m) => m.slug));
    return flyTo(lon, lat, R1, homeC(), undefined, 1); };
  if (cc !== ms[0]._cc || layer === 'globe') return enterCountry(ms[0]._cc, 1800).then((ok) => ok && go());
  return go();
}
const selR = () => Math.max(V.R, mobile() ? 26000 : 42000);
async function select(p) {
  if (sel && sel.slug === p.slug && card.classList.contains('on')) return expand(p);
  if (layer === 'globe' || cc !== p._cc) { const ok = await enterCountry(p._cc, 1900); if (!ok) return; }
  tip.hide(); closeCard(); sel = p; layer = 'project'; setLayerUI(); mk.setActive(p.slug); rowAct(p.slug); setRead(p, true);
  const ok = await flyTo(p.lon, p.lat, selR(), cardC(), undefined, 1);
  if (ok && sel === p) showCard(p);
}
function back() {
  if (pageOpen()) return;
  if (layer === 'project') { const code = cc; sel = null; closeCard(); mk.setActive(null); rowAct(null); layer = 'country'; setLayerUI(); const f = countryFit(code); return flyTo(f.lon, f.lat, f.R, f.c, 1700, 1); }
  if (layer === 'country') return goGlobe();
}

/* ---------- arrival card (B) ---------- */
const countryOrder = (code) => current.filter((p) => p._cc === code).sort(byYear);
const order = () => countryOrder(cc);
const rankOf = (p) => pad2(countryOrder(p._cc).indexOf(p) + 1);
function showCard(p) {
  card.innerHTML = `<button class="b-card-img"><img src="${cover(p)}" alt=""></button><div class="b-card-t"><span class="b-card-no">${pad2(order().indexOf(p) + 1)} / ${pad2(order().length)} · ${cname(p._cc)} · ${cityName(cityOf(p))}</span><b></b><span>${architectName(p)}</span><span>${p.year} · ${catName(p)}</span><span class="co"></span><button class="b-open">${t('OPEN', '查看')} →</button></div>`;
  const img = $('img', card);
  const mw = mobile() ? 120 : 300, mh = mobile() ? 120 : H * 0.46;
  let w = mw, ih = w * p.h / p.w; if (ih > mh) { ih = mh; w = ih * p.w / p.h; }
  img.style.width = w + 'px'; img.style.height = ih + 'px';
  $('b', card).textContent = pname(p); $('.co', card).textContent = fmtCoord(p.lat, p.lon);
  card.classList.add('on'); cross = 0;
  const [dx, dy] = proj(p.lon, p.lat);
  const cr = card.getBoundingClientRect(), sr = stage.getBoundingClientRect();
  const ox = dx - (cr.x - sr.x), oy = dy - (cr.y - sr.y), far = Math.hypot(Math.max(Math.abs(ox), Math.abs(cr.width - ox)), Math.max(Math.abs(oy), Math.abs(cr.height - oy))) * 1.05;
  if (!reduceMotion()) card.animate([{ clipPath: `circle(0px at ${ox}px ${oy}px)` }, { clipPath: `circle(${far}px at ${ox}px ${oy}px)` }], { duration: 900, easing: 'cubic-bezier(.65,0,.2,1)', fill: 'backwards' });
  $('b', card).textContent = pname(p); $('.co', card).textContent = fmtCoord(p.lat, p.lon);
  placeLead(); lead.classList.add('on');
  const len = Math.hypot(line.x2.baseVal.value - line.x1.baseVal.value, line.y2.baseVal.value - line.y1.baseVal.value);
  line.style.strokeDasharray = len; line.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 600, easing: 'ease-out', fill: 'both' });
  const t0 = performance.now(); const fade = (n) => { cross = Math.min(1, (n - t0) / 500); need = true; if (cross < 1) requestAnimationFrame(fade); }; requestAnimationFrame(fade);
  card.onclick = (e) => { e.preventDefault(); e.stopPropagation(); expand(p); };
}
function placeLead() {
  const [dx, dy] = proj(sel.lon, sel.lat); if (!Number.isFinite(dx) || !Number.isFinite(dy)) return; const cr = $('.b-card-img', card)?.getBoundingClientRect(); if (!cr) return; const sr = stage.getBoundingClientRect();
  let x2, y2; if (mobile()) { x2 = cr.x - sr.x + cr.width / 2; y2 = cr.y - sr.y; } else { x2 = cr.x - sr.x; y2 = cr.y - sr.y + cr.height / 2; }
  line.setAttribute('x1', dx); line.setAttribute('y1', dy); line.setAttribute('x2', x2); line.setAttribute('y2', y2);
}
function closeCard() { card.getAnimations().forEach((a) => a.cancel()); card.classList.remove('on'); card.innerHTML = ''; lead.classList.remove('on'); cross = 0; need = true; }
const idxOf = (p) => { const o = current.filter((x) => x._cc === p._cc).sort(byYear); return `${pad2(o.indexOf(p) + 1)} / ${pad2(o.length)} · ${cname(p._cc)} · ${cityName(cityOf(p))}`; };
function expand(p) {
  if (window.MMCM_HOST && window.MMCM_HOST.openFromAtlas) {
    const im = $('img', card);
    const r = im ? im.getBoundingClientRect() : null;
    if (im) im.style.visibility = 'hidden';
    window.MMCM_HOST.openFromAtlas(p.slug, r && r.width ? { x: r.x, y: r.y, w: r.width, h: r.height, src: im.currentSrc || im.src } : null);
    return;
  }
  const im = $('img', card); if (!im) return; const r = im.getBoundingClientRect(); im.style.visibility = 'hidden';
  openPage(p, { x: r.x, y: r.y, w: r.width }, { index: idxOf(p),
    getReturn: () => { const r2 = $('img', card)?.getBoundingClientRect(); return r2 ? { x: r2.x, y: r2.y, w: r2.width } : null; },
    onClosed: () => { const im2 = $('img', card); if (im2) im2.style.visibility = ''; need = true; },
  });
}

/* ---------- layer UI: breadcrumb, list state ---------- */
function setLayerUI() {
  stage.classList.toggle('L-globe', layer === 'globe'); stage.classList.toggle('L-country', layer !== 'globe');
  const parts = [`<button data-l="globe" class="${layer === 'globe' ? 'on' : ''}">${t('EARTH', '地球')}</button>`];
  if (cc) parts.push(`<button data-l="country" class="${layer === 'country' ? 'on' : ''}">${cname(cc)}</button>`);
  if (sel) parts.push(`<button class="on" data-l="project">${pname(sel)}</button>`);
  crumb.innerHTML = parts.join('<i>/</i>');
  $$('button', crumb).forEach((b) => b.onclick = () => { const l = b.dataset.l; if (l === 'globe' && layer !== 'globe') goGlobe(); if (l === 'country' && layer === 'project') back(); });
  $$('.c-cty', view).forEach((b) => b.classList.toggle('on', b.dataset.cc === cc));
  $$('.c-grp', view).forEach((g) => g.classList.toggle('dim', !!cc && g.dataset.cc !== cc));
  if (!sel) setRead(null);
  need = true;
}

/* ---------- list: country → city → project ---------- */
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
function renderList() {
  const byC = new Map(); current.forEach((p) => { if (!byC.has(p._cc)) byC.set(p._cc, new Map()); const m = byC.get(p._cc); const c = cityOf(p); if (!m.has(c)) m.set(c, []); m.get(c).push(p); });
  const cities = [...byC.values()].reduce((s, m) => s + m.size, 0), nC = [...byC.keys()].filter((k) => byC.get(k).size).length;
  $('.a-count', view).textContent = state.lang === 'zh' ? `${current.length} 个项目` : `${current.length} PROJECTS`;
  $('.a-hint', view).textContent = t(`${pad2(nC)} COUNTRY · ${pad2(cities)} CITIES`, `${nC} 个国家 · ${cities} 座城市`);
  $('.c-groups', view).innerHTML = [...byC.entries()].map(([code, cm]) => {
    const n = [...cm.values()].reduce((s, a) => s + a.length, 0);
    const gs = [...cm.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
    return `<div class="c-grp" data-cc="${esc(code)}"><button class="c-cty" data-cc="${esc(code)}"><span>${esc(cname(code))}</span><span>${pad2(n)}</span></button>` +
      gs.map(([c, ps]) => `<div class="a-grp" data-count="${ps.length}"><button class="a-gh" data-c="${esc(c)}"><span>${esc(cityName(c))}</span><span>${pad2(ps.length)}</span></button>${ps.sort((a, b) => b.year - a.year).map((p) => `<button class="a-row" data-s="${esc(p.slug)}"><span class="n">${rankOf(p)}</span><span class="t">${esc(pname(p))}</span><span class="y">${esc(p.year)}</span></button>`).join('')}</div>`).join('') + '</div>';
  }).join('');
  $$('.c-cty', view).forEach((b) => { b.onclick = () => { if (mobile()) stage.scrollIntoView({ behavior: 'smooth', block: 'start' }); if (cc === b.dataset.cc && layer !== 'globe') return; enterCountry(b.dataset.cc); }; b.onmouseenter = () => groupHL(b.dataset.cc); b.onmouseleave = () => groupHL(null); });
  $$('.a-gh', view).forEach((b) => { b.onclick = () => { if (mobile()) stage.scrollIntoView({ behavior: 'smooth', block: 'start' }); fitCity(b.dataset.c); }; b.onmouseenter = () => mk.setHighlight(current.filter((p) => cityOf(p) === b.dataset.c).map((p) => p.slug)); b.onmouseleave = () => mk.setHighlight([]); });
  $$('.a-row', view).forEach((b) => {
    const p = P.find((x) => x.slug === b.dataset.s);
    b.onmouseenter = () => { mk.setHighlight([p.slug]); const d = mk.getDot(p.slug); if (layer !== 'globe' && !flying && d && !d.outer.classList.contains('hid') && d.outer.style.display !== 'none' && !(sel && sel.slug === p.slug)) { const [x, y] = proj(p.lon, p.lat); tip.show(p, x, y, { w: W, h: H }); } };
    b.onmouseleave = () => { mk.setHighlight([]); tip.hide(); };
    b.onclick = () => { if (mobile()) stage.scrollIntoView({ behavior: 'smooth', block: 'start' }); select(p); };
  });
  setLayerUI(); if (sel) rowAct(sel.slug);
}
const rowHL = (sl) => $$('.a-row', view).forEach((r) => r.classList.toggle('hl', sl.includes(r.dataset.s)));
const rowAct = (s) => $$('.a-row', view).forEach((r) => r.classList.toggle('act', r.dataset.s === s));
function groupHL(code) { $$('.c-ct', ctsEl).forEach((b) => b.classList.toggle('hl', b.dataset.cc === code)); $$('.c-cty', view).forEach((b) => b.classList.toggle('hl', b.dataset.cc === code)); }

/* ---------- grid view (unchanged WORKS grid) ---------- */
function goArch() {
  state.disc = 'architecture'; state.type = '';
  if (window.MMCM_HOST && window.MMCM_HOST.setDisc) window.MMCM_HOST.setDisc('architecture');
  renderAll(true, 'disc');
}

/* ---------- keys, input ---------- */
function step(d) { const o = order(); if (!o.length || layer === 'globe') return; const i = sel ? o.findIndex((p) => p.slug === sel.slug) : -1; select(o[(i + d + o.length) % o.length]); }
addEventListener('keydown', (e) => { if (pageOpen() || state.view !== 'map') return; if (e.key === 'Escape' || e.key === 'Backspace') { e.preventDefault(); back(); } if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });
const ptrs = new Map(); let pinch0 = null, moved = 0;
const fromCard = (e) => !!(e.target && e.target.closest && e.target.closest('.b-card'));
const overChrome = (e) => fromCard(e) || (e.target.closest && e.target.closest('.b-ctl, .c-crumb, button, a'));
card.addEventListener('pointerdown', (e) => e.stopPropagation());
card.addEventListener('pointerup', (e) => e.stopPropagation());
stage.addEventListener('pointerdown', (e) => { if (overChrome(e)) return; stage.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]); moved = 0; idle = false; flyTok++; flying = false; });
stage.addEventListener('pointermove', (e) => {
  const sr = stage.getBoundingClientRect();
  if (!ptrs.size) { if (!sel && !flying && !overChrome(e)) { const ll = invert(e.clientX - sr.x, e.clientY - sr.y); if (ll) { readK.textContent = t('CURSOR', '光标'); paintDigits(readV, fmtCoord(ll[1], ll[0])); } } return; }
  const last = ptrs.get(e.pointerId); if (!last) return; ptrs.set(e.pointerId, [e.clientX, e.clientY]);
  if (ptrs.size === 2) {
    const [a, b] = [...ptrs.values()];
    const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
    if (pinch0) zoomAt(d / pinch0, (a[0] + b[0]) / 2 - sr.x, (a[1] + b[1]) / 2 - sr.y);
    pinch0 = d;
    return;
  }
  const dx = e.clientX - last[0], dy = e.clientY - last[1]; moved += Math.abs(dx) + Math.abs(dy);
  V.lon -= dx / V.R / D2R / Math.max(0.3, Math.cos(V.lat * D2R) * V.m + (1 - V.m)); V.lat = Math.max(-80, Math.min(80, V.lat + dy / V.R / D2R)); need = true;
});
const up = (e) => { if (fromCard(e)) return; ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch0 = null; if (!ptrs.size && moved < 4 && e.type === 'pointerup' && layer === 'project') back(); };
stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
const minR = () => (layer === 'globe' ? homeR() * 0.7 : countryFit(cc || 'CN').R * 0.55);
const maxR = 1500000;
function zoomAt(f, px, py) {
  const next = Math.max(minR(), Math.min(maxR, V.R * f));
  const k = next / Math.max(V.R, 1e-6);
  if (Number.isFinite(px) && Number.isFinite(py)) { V.cx = V.cx * k + px * (1 - k); V.cy = V.cy * k + py * (1 - k); }
  V.R = next; need = true;
}
stage.addEventListener('wheel', (e) => {
  if (pageOpen() || fromCard(e) || (e.target.closest && e.target.closest('.b-ctl, .c-crumb'))) return;
  e.preventDefault();
  flyTok++; flying = false; idle = false;
  let dy = e.deltaY;
  if (e.deltaMode === 1) dy *= 16;
  else if (e.deltaMode === 2) dy *= stage.clientHeight || 800;
  const sr = stage.getBoundingClientRect();
  zoomAt(Math.exp(-dy * (e.ctrlKey ? 0.01 : 0.0016)), e.clientX - sr.left, e.clientY - sr.top);
}, { passive: false });
$$('.b-ctl button[data-z]', stage).forEach((b) => b.onclick = () => {
  const z = b.dataset.z;
  if (z === 'home') return layer === 'globe' ? goGlobe() : goGlobe();
  if (z === 'up') return back();
  flyTo(V.lon, V.lat, Math.max(minR(), Math.min(maxR, V.R * (z === 'in' ? 2.4 : 1 / 2.4))), [V.cx, V.cy], 700);
});

/* ---------- loop, layout, render ---------- */
let need = true, lastT = performance.now();
function loop(now) { const dt = now - lastT; lastT = now; if (pageOpen()) { requestAnimationFrame(loop); return; } if (idle && layer === 'globe' && !flying && !ptrs.size) { V.lon += dt * 0.0012; need = true; } if (need) { need = false; draw(); } requestAnimationFrame(loop); }
function layout() {
  const r = stage.getBoundingClientRect(); if (!r.width) return; W = r.width; H = r.height; dpr = Math.min(2, devicePixelRatio || 1);
  cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px'; lead.setAttribute('viewBox', `0 0 ${W} ${H}`);
  if (layer === 'globe' && idle) { V.R = homeR(); [V.cx, V.cy] = homeC(); }
  else if (layer === 'country' && !flying) { const f = countryFit(cc); Object.assign(V, { lon: f.lon, lat: f.lat, R: f.R, cx: f.c[0], cy: f.c[1] }); }
  else if (sel) [V.cx, V.cy] = cardC();
  need = true;
}
function renderAll(changed, kind) {
  current = filtered();
  if (state.view !== 'map') return;
  if (!W) layout();
  mk.setProjects(current); renderCountries(); renderList();
  const em = $('.b-empty', stage); em.innerHTML = current.length ? '' : emptyHTML(); em.classList.toggle('on', !current.length);
  $$('.empty-link', em).forEach((b) => b.onclick = goArch);
  if (changed) {
    if (kind === 'view') { layout(); }
    if (sel && !current.includes(sel)) { sel = null; closeCard(); mk.setActive(null); if (layer === 'project') layer = 'country'; }
    if (kind === 'disc' || !current.length) { if (layer !== 'globe') goGlobe(); }
    setLayerUI();
  } else if (sel && card.classList.contains('on')) showCard(sel);
  need = true;
}
addEventListener('resize', layout);
let started = false;
function boot(root, opts) {
  if (!root || started) { if (opts) sync(opts); return; }
  started = true;
  root.appendChild(main);
  if (opts) { state.disc = opts.disc || 'architecture'; state.type = opts.type && opts.type !== 'all' ? opts.type : ''; }
  if (window.ResizeObserver) new ResizeObserver(() => layout()).observe(stage);
  layout(); renderAll(); requestAnimationFrame(loop);
  const motion = reduceMotion();
  V.R = homeR() * (motion ? 1 : 0.55);
  flyTo(HOME.lon, HOME.lat, homeR(), homeC(), motion ? 1 : 1600, 0).then(() => { idle = true; });
}
function sync(opts) {
  if (!opts) return;
  const disc = opts.disc || 'architecture';
  const type = !opts.type || opts.type === 'all' ? '' : opts.type;
  const changed = disc !== state.disc || type !== state.type;
  state.disc = disc; state.type = type;
  if (!started) return;
  renderAll(changed, changed ? 'disc' : '');
  if (sel && card.classList.contains('on')) showCard(sel);
}
function show() { state.view = 'map'; layout(); renderAll(true, 'view'); need = true; }
function hide() { state.view = 'grid'; }
function showCardImage() {
  const im = $('img', card);
  if (im) im.style.visibility = '';
}
function openSlug(slug) {
  const p = P.find((item) => item.slug === slug);
  if (!p) return;
  state.disc = p.disc; state.type = '';
  show();
  openPage(p, null, { instant: true, push: false, index: idxOf(p), onClosed: () => { need = true; } });
}
window.MMCM_ATLAS = { boot, sync, show, hide, closePage, pageOpen, openSlug, showCardImage };
