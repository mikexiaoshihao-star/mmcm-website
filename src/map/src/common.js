export const DATA = window.MMCM;
export const P = DATA.projects.slice();
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

const i18n = () => window.MMCM_I18N || {};
export const state = {
  get lang() { return i18n().lang ? i18n().lang() : 'en'; },
  disc: 'architecture',
  type: '',
  view: 'map',
};
export const t = (en, zh) => (state.lang === 'zh' ? zh : en);
export const pname = (p) => (i18n().name ? i18n().name(p) : (state.lang === 'zh' && p.zh ? p.zh : p.title));
export const architectName = (p) => (i18n().architect ? i18n().architect(p) : p.architect);
export const locName = (p) => (i18n().place ? i18n().place(p.loc) : p.loc);
export const catName = (p) => (i18n().cat ? i18n().cat(p) : (state.lang === 'zh' ? p.catZh : p.cat));
export const discName = (d) => (i18n().disc ? i18n().disc(d) : d);
export const fmtLat = (v) => Math.abs(v).toFixed(3) + '°' + (v >= 0 ? 'N' : 'S');
export const fmtLon = (v) => Math.abs(v).toFixed(3) + '°' + (v >= 0 ? 'E' : 'W');
export const fmtCoord = (lat, lon) => `${fmtLat(lat)} / ${fmtLon(lon)}`;
export const cityOf = (p) => p.loc || '';
export const cityName = (c) => (i18n().place ? i18n().place(c) : c);
export const byYear = (a, b) => String(b.year).localeCompare(String(a.year)) || a.title.localeCompare(b.title);
export function filtered() {
  return P.filter((p) => p.disc === state.disc && (!state.type || state.type === 'all' || p.type === state.type));
}
export const pad2 = (n) => String(n).padStart(2, '0');
const IMG = '/map/img/';
export const cover = (p) => IMG + p.cover;
export const thumb = (f) => IMG + f;
export function scramble(el, text) { if (el) el.textContent = text; }
export function emptyHTML() {
  return `<div class="empty"><p>${t('Projects coming soon.', '作品上传中')}</p><button class="empty-link">${t('View architecture', '查看建筑')}</button></div>`;
}
export function mountTip(host) {
  const tip = h('<div class="tip" aria-hidden="true"></div>'); host.appendChild(tip);
  return {
    show(p, x, y, bounds) {
      const w = 220, ih = Math.min(260, Math.round(w * p.h / p.w));
      tip.innerHTML = `<img src="${cover(p)}" width="${w}" height="${ih}" alt=""><div class="tip-c"><b>${pname(p)}</b><span>${architectName(p)}</span><span>${p.year} · ${catName(p)}</span></div>`;
      const th = ih + 66, gap = 16;
      let lx = x + gap; if (lx + w > bounds.w - 8) lx = x - gap - w; if (lx < 8) lx = 8;
      let ly = y - th / 2; ly = Math.max(8, Math.min(bounds.h - th - 8, ly));
      tip.style.cssText = `left:${lx}px;top:${ly}px;width:${w}px`; tip.classList.add('on');
    },
    hide() { tip.classList.remove('on'); },
  };
}
export const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
