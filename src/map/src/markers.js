// Shared marker layer: screen-space clustering with split/merge animation (inner offset + opacity transitions).
import { $$, pname, cityName, cityOf, pad2 } from './common.js';
export function createMarkers(host, o) {
  const layer = document.createElement('div'); layer.className = 'mk'; host.appendChild(layer);
  let dots = new Map(), cls = new Map(), list = [], act = null, hl = new Set();
  function setProjects(ps) {
    layer.innerHTML = ''; dots = new Map(); cls = new Map(); list = ps;
    ps.forEach((p, i) => {
      const outer = document.createElement('button'); outer.className = 'dot'; outer.style.setProperty('--d', i * 45 + 'ms');
      outer.setAttribute('aria-label', p.title); outer.innerHTML = `<span class="dot-in"><i></i><u>${pname(p)}</u></span>`;
      outer.onmouseenter = () => o.onHover && o.onHover(p, outer);
      outer.onmouseleave = () => o.onLeave && o.onLeave(p);
      outer.onclick = (e) => { e.stopPropagation(); o.onClick(p, outer); };
      layer.appendChild(outer); dots.set(p.slug, { outer, inner: outer.firstChild, p });
    });
  }
  function update(items) {
    const R = o.radius || 24; const seen = new Set(); const done = new Set(); const groups = [];
    const vis = items.filter((it) => it.vis);
    items.forEach((it) => { if (!it.vis) { const d = dots.get(it.p.slug); d.outer.style.display = 'none'; done.add(it.p.slug); } });
    vis.forEach((a) => {
      if (done.has(a.p.slug)) return; const g = [a]; done.add(a.p.slug);
      if (a.solo) { groups.push({ g, cx: a.x, cy: a.y }); return; }
      vis.forEach((b) => { if (!done.has(b.p.slug) && !b.solo && Math.hypot(a.x - b.x, a.y - b.y) < R) { g.push(b); done.add(b.p.slug); } });
      const cx = g.reduce((s, m) => s + m.x, 0) / g.length, cy = g.reduce((s, m) => s + m.y, 0) / g.length;
      groups.push({ g, cx, cy });
    });
    groups.forEach(({ g, cx, cy }) => {
      if (g.length === 1) {
        const m = g[0], d = dots.get(m.p.slug); d.outer.style.display = '';
        d.outer.style.transform = `translate(${m.x}px,${m.y}px)`; d.inner.style.transform = ''; d.outer.classList.remove('hid');
      } else {
        g.forEach((m) => { const d = dots.get(m.p.slug); d.outer.style.display = ''; d.outer.style.transform = `translate(${m.x}px,${m.y}px)`; d.inner.style.transform = `translate(${cx - m.x}px,${cy - m.y}px)`; d.outer.classList.add('hid'); });
        const key = g.map((m) => m.p.slug).sort().join('|'); seen.add(key);
        let c = cls.get(key);
        if (!c) {
          const cities = {}; g.forEach((m) => { const k = cityOf(m.p); cities[k] = (cities[k] || 0) + 1; });
          const city = Object.entries(cities).sort((a, b) => b[1] - a[1])[0][0];
          const el = document.createElement('button'); el.className = 'cl'; el.dataset.city = city;
          el.innerHTML = `<b>${g.length}</b><em></em>`;
          el.onclick = (e) => { e.stopPropagation(); o.onCluster(c.members, el); };
          el.onmouseenter = () => o.onClusterHover && o.onClusterHover(c.members, el);
          el.onmouseleave = () => o.onLeave && o.onLeave();
          layer.appendChild(el); c = { el, members: g.map((m) => m.p), city }; cls.set(key, c);
          requestAnimationFrame(() => el.classList.add('on'));
        }
        c.members = g.map((m) => m.p);
        c.el.style.transform = `translate(${cx}px,${cy}px)`; c.cx = cx; c.cy = cy;
        c.el.lastChild.textContent = g.length >= 3 ? cityName(c.city) : ''; c.el.classList.remove('off');
      }
    });
    cls.forEach((c, key) => { if (!seen.has(key)) { c.el.classList.remove('on'); c.el.classList.add('off'); if (!c.rm) c.rm = setTimeout(() => { c.el.remove(); cls.delete(key); }, 320); } else if (c.rm) { clearTimeout(c.rm); c.rm = null; } });
    // keep highlight/active classes
    dots.forEach((d, s) => { d.outer.classList.toggle('act', s === act); d.outer.classList.toggle('hl', hl.has(s)); });
  }
  function setActive(s) { act = s; dots.forEach((d, k) => d.outer.classList.toggle('act', k === s)); }
  function setHighlight(slugs) { hl = new Set(slugs); dots.forEach((d, k) => d.outer.classList.toggle('hl', hl.has(k))); cls.forEach((c) => c.el.classList.toggle('hl', c.members.some((m) => hl.has(m.slug)))); }
  function rectOf(slug) { const d = dots.get(slug); return d.inner.querySelector('i').getBoundingClientRect(); }
  function setLabels(on) { layer.classList.toggle('lab', on); }
  function getDot(slug) { return dots.get(slug); }
  return { layer, setProjects, update, setActive, setHighlight, rectOf, getDot, setLabels };
}
