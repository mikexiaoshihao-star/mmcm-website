"""Build map project data and resized images from src/_data/site.json.

Coordinates come only from site.json. Images are cached in src/map/generated/img.
"""
import json, os, re
from PIL import Image
from concurrent.futures import ProcessPoolExecutor

Image.MAX_IMAGE_PIXELS = None
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
SRC = os.path.join(ROOT, 'src')
OUT = os.path.join(ROOT, 'src', 'map', 'generated')
site = json.load(open(os.path.join(SRC, '_data', 'site.json')))
cat_zh = {c['key']: c['name'] for c in site['categories']}

def parse(c):
    m = re.match(r'([\d.]+)°N / ([\d.]+)°E', c or '')
    if not m:
        raise SystemExit('bad coords: ' + str(c))
    return float(m[1]), float(m[2])

def save(src, dst, maxside, q):
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
        im = Image.open(dst)
        return im.size
    im = Image.open(src)
    im.load()
    im = im.convert('RGB')
    im.thumbnail((maxside, maxside), Image.LANCZOS)
    im.save(dst, 'WEBP', quality=q, method=6)
    return im.size

for d in ('cover', 'thumb', 'view'):
    os.makedirs(os.path.join(OUT, 'img', d), exist_ok=True)

res = []
jobs = []
missing = []
for p in site['projects']:
    lat, lon = parse(p['coords'])
    cover = f"cover/{p['slug']}.webp"
    cover_src = os.path.join(SRC, p['url'].lstrip('/'))
    if not os.path.exists(cover_src):
        missing.append(p['url'])
        continue
    w, h = save(cover_src, os.path.join(OUT, 'img', cover), 1500, 78)
    c0 = f"thumb/{p['slug']}-00.webp"
    jobs.append((cover_src, os.path.join(OUT, 'img', c0), 260, 70))
    imgs = [dict(v=cover, t=c0)]
    thumbs = [c0]
    for i, im in enumerate(p.get('images') or []):
        src = os.path.join(SRC, im['url'].lstrip('/'))
        if not os.path.exists(src):
            missing.append(im['url'])
            continue
        v = f"view/{p['slug']}-{i+1:02d}.webp"
        t = f"thumb/{p['slug']}-{i+1:02d}.webp"
        jobs.append((src, os.path.join(OUT, 'img', v), 1600, 76))
        jobs.append((src, os.path.join(OUT, 'img', t), 260, 70))
        imgs.append(dict(v=v, t=t))
        thumbs.append(t)
    res.append(dict(
        slug=p['slug'], title=p['title'], zh=p.get('title_zh') or '',
        cat=p['category'], catZh=cat_zh.get(p['category'], p['category']),
        disc=p['discipline'], type=p.get('type') or '',
        architect=p.get('architect') or '', year=str(p.get('year') or ''),
        loc=p.get('location') or '', lat=lat, lon=lon,
        cover=cover, w=w, h=h, thumbs=thumbs[:9], n=len(imgs), imgs=imgs,
    ))

def _job(j):
    save(*j)

if jobs:
    with ProcessPoolExecutor(max(1, min(8, os.cpu_count() or 2))) as ex:
        list(ex.map(_job, jobs))

def country_of(lat, lon):
    # Mainland, Hainan, Taiwan and the near seas. No outline is stored or drawn.
    if 73 <= lon <= 135 and 3 <= lat <= 54:
        return 'CN'
    return 'XX'

for item in res:
    item['cc'] = country_of(item['lat'], item['lon'])

names = {'CN': ['CHINA', '中国'], 'XX': ['OTHER', '其他']}
places = {}
for code in sorted(set(item['cc'] for item in res)):
    group = [item for item in res if item['cc'] == code]
    lons = [item['lon'] for item in group]
    lats = [item['lat'] for item in group]
    pad_lon = max(1.5, (max(lons) - min(lons)) * 0.45)
    pad_lat = max(1.2, (max(lats) - min(lats)) * 0.45)
    places[code] = {
        'name': names.get(code, [code, code]),
        'bbox': [[min(lons) - pad_lon, min(lats) - pad_lat], [max(lons) + pad_lon, max(lats) + pad_lat]],
        'center': [sum(lons) / len(lons), sum(lats) / len(lats)],
    }

os.makedirs(os.path.join(OUT, 'data'), exist_ok=True)
js = 'window.MMCM=' + json.dumps(dict(projects=res, categories=site['categories']), ensure_ascii=False, separators=(',', ':')) + ';'
open(os.path.join(OUT, 'data', 'projects.js'), 'w').write(js)
open(os.path.join(OUT, 'data', 'places.js'), 'w').write('window.MMCM_PLACES=' + json.dumps(places, ensure_ascii=False, separators=(',', ':')) + ';')
print('projects', len(res), 'places', list(places), 'bytes', len(js))
if missing:
    print('MISSING')
    for m in missing:
        print(m)
    raise SystemExit(1)
