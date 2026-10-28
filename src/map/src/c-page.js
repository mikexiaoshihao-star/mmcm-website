// Option C project page: the live /projects/<slug>/ detail view (carousel + thumbnail strip + info block),
// with the info block moved beside the photos on desktop and kept below them on mobile.
// The card image flies into slide 0 (same file as the card → no decode wait), then the chrome fades in.
import { state, $, $$, h, t, pname, catName, architectName, locName, discName, fmtCoord, scramble, pad2, thumb, reduceMotion } from './common.js';

const EASE = 'cubic-bezier(.76,0,.18,1)';
const altName = (p) => (state.lang === 'zh' ? (p.zh ? p.title : '') : p.zh || '');
let openEl = null;
export const pageOpen = () => !!openEl;

export function openPage(p, from, { getReturn, onClosed, index = '', instant = false, push = true } = {}) {
  if (openEl) openEl._close(true);
  const imgs = p.imgs && p.imgs.length ? p.imgs : [{ v: p.cover, t: p.thumbs[0], d: 'MAIN_VIEW', m: 'RAW // 24MP' }];
  const N = imgs.length;
  const el = h(`<div class="cp" role="dialog" aria-modal="true" aria-label="${pname(p)}">
    <div class="cp-bar"><button class="cp-x" aria-label="${t('Return to map', '返回地图')}">《</button><span>${t('PROJECT DETAIL', '项目详情')}</span></div>
    <div class="cp-stage"><div class="cp-track">${imgs.map((m, i) => `<div class="cp-slide"><img ${i ? 'data-src' : 'src'}="${thumb(m.v)}" alt="${pname(p)}" draggable="false"></div>`).join('')}</div>
      <button class="cp-nav prev" aria-label="previous">〈</button><button class="cp-nav next" aria-label="next">〉</button>
      <span class="cp-cnt"></span></div>
    <div class="cp-thumbs">${imgs.map((m, i) => `<button class="cp-th" data-i="${i}"><span class="im"><img src="${thumb(m.t)}" alt="" loading="lazy"></span></button>`).join('')}</div>
    <aside class="cp-info">
      <button class="cp-ret"><span>《</span> ${t('RETURN TO MAP', '返回地图')}</button>
      <div class="cp-idx">${index}</div>
      <h2 class="cp-title"></h2>${altName(p) ? `<p class="cp-alt">${altName(p)}</p>` : ''}
      <div class="cp-meta"><span class="cp-arch">${architectName(p)}</span><span class="cp-ly"><span>${locName(p)}</span><span>[ ${p.year} ]</span></span></div>
      <dl class="cp-dl">
        <div><dt>${t('ARCHITECT', '建筑设计')}</dt><dd>${architectName(p)}</dd></div>
        <div><dt>${t('LOCATION', '地点')}</dt><dd>${locName(p)}</dd></div>
        <div><dt>${t('YEAR', '年份')}</dt><dd>${p.year}</dd></div>
        <div><dt>${t('TYPE', '类型')}</dt><dd>${catName(p)}</dd></div>
        <div><dt>${t('DISCIPLINE', '门类')}</dt><dd>${discName(p.disc)}</dd></div>
        <div><dt>${t('COORDINATES', '坐标')}</dt><dd class="cp-co"></dd></div>
        <div><dt>${t('IMAGES', '图片')}</dt><dd>${pad2(N)}</dd></div>
      </dl>
      <div class="cp-cur"></div>
    </aside></div>`);
  document.body.appendChild(el); document.body.classList.add('cp-open'); openEl = el;
  const track = $('.cp-track', el), slides = $$('.cp-slide', el), ths = $$('.cp-th', el), stage = $('.cp-stage', el);
  const title = $('.cp-title', el), co = $('.cp-co', el), cur = $('.cp-cur', el), cnt = $('.cp-cnt', el);
  let i = 0, dx = 0;
  const load = (k) => { const im = slides[k] && $('img', slides[k]); if (im && im.dataset.src) { im.src = im.dataset.src; delete im.dataset.src; } };
  const go = (k, anim = true) => {
    i = Math.max(0, Math.min(N - 1, k)); [i, i + 1, i - 1].forEach(load);
    track.style.transition = anim ? 'transform .3s ease-out' : 'none'; track.style.transform = `translateX(${-i * 100}%)`;
    ths.forEach((b, j) => b.classList.toggle('on', j === i)); const a = ths[i]; if (a) { const tr = a.parentElement, l = a.offsetLeft - tr.offsetLeft; if (l < tr.scrollLeft || l + a.offsetWidth > tr.scrollLeft + tr.clientWidth) tr.scrollTo({ left: l - 16, behavior: anim ? 'smooth' : 'auto' }); }
    cnt.textContent = `${pad2(i + 1)} / ${pad2(N)}`; cur.textContent = '';
    $('.prev', el).disabled = i === 0; $('.next', el).disabled = i === N - 1;
  };
  go(0, false);
  $('.prev', el).onclick = () => go(i - 1); $('.next', el).onclick = () => go(i + 1);
  ths.forEach((b) => b.onclick = () => go(+b.dataset.i));
  // swipe / drag, same thresholds as the live handleSwipe*
  let x0 = null;
  stage.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; x0 = e.clientX; dx = 0; track.style.transition = 'none'; stage.setPointerCapture(e.pointerId); });
  stage.addEventListener('pointermove', (e) => { if (x0 == null) return; dx = e.clientX - x0; track.style.transform = `translateX(calc(${-i * 100}% + ${dx}px))`; });
  const end = () => { if (x0 == null) return; x0 = null; const th = stage.clientWidth * 0.15; go(dx < -th ? i + 1 : dx > th ? i - 1 : i); };
  stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);
  const parts = [$('.cp-bar', el), $('.cp-thumbs', el), $('.cp-info', el), ...$$('.cp-nav,.cp-cnt', el)];
  const hero = $('img', slides[0]);
  const land = () => { title.textContent = ''; scramble(title, pname(p)); scramble(co, fmtCoord(p.lat, p.lon)); };
  (async () => {
    await hero.decode().catch(() => {});
    if (instant || !from || reduceMotion()) { el.classList.add('in'); land(); return; }
    const r = hero.getBoundingClientRect(); const s = from.w / r.width;
    hero.style.transformOrigin = '0 0';
    hero.animate([{ transform: `translate(${from.x - r.x}px,${from.y - r.y}px) scale(${s})` }, { transform: 'none' }], { duration: 950, easing: EASE, fill: 'both' });
    el.animate([{ backgroundColor: 'rgba(255,255,255,0)' }, { backgroundColor: 'rgba(255,255,255,1)' }], { duration: 600, delay: 250, easing: 'ease-out', fill: 'both' });
    stage.animate([{ backgroundColor: 'rgba(244,244,244,0)' }, { backgroundColor: 'rgba(244,244,244,1)' }], { duration: 600, delay: 350, easing: 'ease-out', fill: 'both' });
    parts.forEach((x, k) => x.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: 720 + k * 60, easing: 'ease-out', fill: 'both' }));
    el.classList.add('in'); title.textContent = ''; setTimeout(land, 780);
  })();
  if (push) history.pushState({ atlasProject: p.slug }, '', '/projects/' + p.slug + '/');

  let closed = false;
  const close = async (fromPop = false) => {
    if (closed) return; closed = true; openEl = null;
    removeEventListener('keydown', key); removeEventListener('popstate', pop);
    if (!fromPop && location.pathname.indexOf('/projects/') === 0) history.back();
    const ret = !reduceMotion() && i === 0 && getReturn && getReturn();
    parts.forEach((x) => x.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'both' }));
    stage.animate([{ backgroundColor: 'rgba(244,244,244,1)' }, { backgroundColor: 'rgba(244,244,244,0)' }], { duration: 400, delay: 100, fill: 'both' });
    if (ret) {
      const r = hero.getBoundingClientRect(); hero.getAnimations().forEach((a) => a.cancel());
      hero.animate([{ transform: 'none' }, { transform: `translate(${ret.x - r.x}px,${ret.y - r.y}px) scale(${ret.w / r.width})` }], { duration: 800, delay: 120, easing: EASE, fill: 'both' });
      el.animate([{ backgroundColor: 'rgba(255,255,255,1)' }, { backgroundColor: 'rgba(255,255,255,0)' }], { duration: 500, delay: 160, fill: 'both' });
      await new Promise((r2) => setTimeout(r2, 940));
    } else { el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 320, fill: 'both' }); await new Promise((r2) => setTimeout(r2, 330)); }
    el.remove(); document.body.classList.remove('cp-open'); onClosed && onClosed();
  };
  el._close = (quiet) => { if (quiet) { closed = true; openEl = null; removeEventListener('keydown', key); removeEventListener('popstate', pop); el.remove(); document.body.classList.remove('cp-open'); onClosed && onClosed(); } else close(); };
  // Esc / RETURN / 《 go back through history so the browser Back button and the UI stay in sync
  const back = () => (history.state && history.state.atlasProject === p.slug ? history.back() : close());
  const key = (e) => { if (e.key === 'Escape') back(); if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1); };
  const pop = () => close(true);
  addEventListener('keydown', key); addEventListener('popstate', pop);
  $('.cp-ret', el).onclick = back; $('.cp-x', el).onclick = back;
  return { close: back, go };
}
export function closePage() { if (openEl && openEl._close) openEl._close(true); }
