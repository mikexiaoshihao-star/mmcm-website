# Type audit

Every measured string uses **MiSans** (Latin and Chinese_Simplify), loaded from `https://cdn-font.hyperos.mi.com` on every page. There is no `fonts.googleapis.com` or `fonts.gstatic.com` request.

Body and list text is weight 300. Emphasis (`.font-medium`, `.font-semibold`, `.font-bold`, `strong`) is 400. Selected items are weight 600 with a 1px underline. Numbers use `font-variant-numeric: tabular-nums`.

The fallback stack is `"MiSans", "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif`. The logo lockup is unchanged. Sizes below are the computed values at 1440×900 on 2026-10-28, not a new scale.

## home (en)

| Selector | Sample | font-family | size | weight | letter-spacing | line-height |
|---|---|---|---|---|---|---|
| `span` | 毫 | MiSans, "Noto Sans SC", sans-serif | 9.96667px | 300 | normal | 9.96667px |
| `a.nav-tag` | WORKS | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 14.4px |
| `button.nav-tag.border-0` | 中 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `span.text-[#666666].leading-none` | / | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 12px |
| `button.nav-tag.border-0.is-on` | EN | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 16px |
| `div.text-gray-500.h-5.overflow-visible.whitespace-nowrap` | Tanghua_Architects_&_Associates | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `div.text-[#111111].font-bold.text-sm.md:text-xl` | Xichang_Jianchuan_Museum_Documentary_Hall | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 20px | 700 | normal | 28px |
| `span` | 27.882°N / 102.173°E | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 700 | normal | 16px |

## works (en)

| Selector | Sample | font-family | size | weight | letter-spacing | line-height |
|---|---|---|---|---|---|---|
| `span` | 毫 | MiSans, "Noto Sans SC", sans-serif | 9.96667px | 300 | normal | 9.96667px |
| `a.nav-tag.is-on` | WORKS | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 14.4px |
| `a.nav-tag` | FILM | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 14.4px |
| `button.nav-tag.border-0` | 中 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `span.text-[#666666].leading-none` | / | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 12px |
| `button.nav-tag.border-0.is-on` | EN | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 16px |
| `button.nav-tag.is-on` | Architecture | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 16px |
| `button.nav-tag` | Interior | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `span.text-[#666666]` | / | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `span` | All 18 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 16px |
| `div.text-[#111111].font-bold.group-hover:text-[#111111].transition-colors.leading-tight.break-` | Renovation_of_Langjiu_Longma_Winery_Office | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 700 | normal | 12.5px |
| `div.text-[#666666]` | Tektonn_Architects | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 300 | normal | 15px |
| `div.text-gray-600.scale-90.flex-shrink-0.ml-2` | [ 2025 ] | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 300 | normal | 15px |
| `span.bg-black/[0.06].px-1.5.py-0.5.rounded.text-[9px].text-[#444444]` | OFFICE | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 9px | 300 | normal | 13.5px |
| `span.text-[#111111].text-[9px]` | 28.989°N / 105.467°E | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 9px | 300 | normal | 13.5px |
| `div.text-gray-500.text-[9px].flex-shrink-0.ml-2` | Luzhou_Sichuan | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 9px | 300 | normal | 13.5px |

## atlas (en)

| Selector | Sample | font-family | size | weight | letter-spacing | line-height |
|---|---|---|---|---|---|---|
| `span` | 毫 | MiSans, "Noto Sans SC", sans-serif | 9.96667px | 300 | normal | 9.96667px |
| `a.nav-tag.is-on` | WORKS | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 14.4px |
| `a.nav-tag` | FILM | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 14.4px |
| `button.nav-tag.border-0` | 中 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `span.text-[#666666].leading-none` | / | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 12px |
| `button.nav-tag.border-0.is-on` | EN | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 16px |
| `button.nav-tag.is-on` | Architecture | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 16px |
| `button.nav-tag` | Interior | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `span.text-[#666666]` | / | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `span` | All 18 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 16px |
| `span.a-count` | 18 PROJECTS | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 300 | 0.2px | 15px |
| `span.a-hint` | 01 COUNTRY · 11 CITIES | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 300 | 0.2px | 15px |
| `span` | CHINA | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 11px | 600 | 0.22px | 16.5px |
| `span` | 18 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 11px | 400 | 0.22px | 16.5px |
| `span` | Chengdu_Sichuan | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 300 | 0.2px | 15px |
| `span.n` | 01 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10.5px | 400 | normal | 14.175px |
| `span.t` | Renovation_of_Business_Premises_of_Agricul | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10.5px | 400 | normal | 14.175px |
| `span.y` | 2025 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10.5px | 400 | normal | 14.175px |
| `button` | EARTH | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 300 | 0.2px | 15px |
| `i` | / | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 300 | 0.2px | 15px |
| `button.on` | CHINA | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 600 | 0.2px | 15px |
| `span.b-read-k` | CHINA · VIEW CENTRE | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 11px | 300 | 0.22px | 16.5px |
| `span.b-read-v` | 28.380°N / 111.904°E | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 52px | 300 | normal | 52px |
| `span.b-read-a` | ALT 2,513 KM | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 300 | 0.2px | 15px |
| `button` | + | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 14px | 300 | normal | 21px |
| `b` | 18 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 500 | normal | 15px |
| `em` | CHINA | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 300 | 0.2px | 15px |
| `u` | Renovation_of_Langjiu_Longma_Winery_Office | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 300 | 0.4px | 15px |
| `b` | 7 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 11px | 500 | normal | 16.5px |

## project (en)

| Selector | Sample | font-family | size | weight | letter-spacing | line-height |
|---|---|---|---|---|---|---|
| `span` | 毫 | MiSans, "Noto Sans SC", sans-serif | 9.96667px | 300 | normal | 9.96667px |
| `a.nav-tag.is-on` | WORKS | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 14.4px |
| `a.nav-tag` | FILM | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 14.4px |
| `button.nav-tag.border-0` | 中 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `span.text-[#666666].leading-none` | / | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 12px |
| `button.nav-tag.border-0.is-on` | EN | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 16px |
| `button.absolute.left-2.md:left-8.z-30.w-10.h-10.md:w-12.md:h-12.flex.items-center.justify-center.` | 〈 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 30px | 300 | normal | 36px |
| `button.absolute.right-2.md:right-8.z-30.w-10.h-10.md:w-12.md:h-12.flex.items-center.justify-cente` | 〉 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 30px | 300 | normal | 36px |
| `span` | 《 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `h2.text-sm.lg:text-base.text-[#111111].font-bold.leading-tight.break-words` | TAHITI | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 16px | 700 | normal | 24px |
| `span.text-[#111111]` | gad | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 300 | normal | 15px |
| `span` | Chengdu_Sichuan | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 300 | normal | 15px |
| `dt` | ARCHITECT | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 300 | 0.2px | 15px |
| `dd` | gad | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 11px | 300 | normal | 16.5px |

## film (en)

| Selector | Sample | font-family | size | weight | letter-spacing | line-height |
|---|---|---|---|---|---|---|
| `span` | 毫 | MiSans, "Noto Sans SC", sans-serif | 9.96667px | 300 | normal | 9.96667px |
| `a.nav-tag` | WORKS | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 14.4px |
| `a.nav-tag.is-on` | FILM | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 14.4px |
| `button.nav-tag.border-0` | 中 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `span.text-[#666666].leading-none` | / | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 12px |
| `button.nav-tag.border-0.is-on` | EN | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 16px |
| `span` | ALL_FILMS 8 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 16px |
| `div.text-[#111111].font-bold.group-hover:text-[#111111].transition-colors.leading-tight.break-` | Xichang_Jianchuan_Museum_Documentary_Hall | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 700 | normal | 12.5px |
| `div.text-[#666666]` | Tanghua_Architects_&_Associates | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 300 | normal | 15px |
| `div.text-gray-600.scale-90.flex-shrink-0.ml-2` | [ 2025 ] | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 300 | normal | 15px |
| `span.bg-black/[0.06].px-1.5.py-0.5.rounded.text-[9px].text-[#444444]` | CULTURAL | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 9px | 300 | normal | 13.5px |
| `span.text-[#111111].text-[9px]` | 27.882°N / 102.173°E | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 9px | 300 | normal | 13.5px |
| `div.text-gray-500.text-[9px].flex-shrink-0.ml-2` | Xichang_Sichuan | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 9px | 300 | normal | 13.5px |

## media (en)

| Selector | Sample | font-family | size | weight | letter-spacing | line-height |
|---|---|---|---|---|---|---|
| `span` | 毫 | MiSans, "Noto Sans SC", sans-serif | 9.96667px | 300 | normal | 9.96667px |
| `a.nav-tag` | WORKS | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 14.4px |
| `a.nav-tag.is-on` | MEDIA | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 14.4px |
| `button.nav-tag.border-0` | 中 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `span.text-[#666666].leading-none` | / | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 12px |
| `button.nav-tag.border-0.is-on` | EN | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 16px |
| `div.mb-10.font-mono.text-[10px].md:text-xs.tracking-normal.text-[#111111]` | MEDIA | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `div.font-mono.text-[10px].tracking-normal.text-[#666666]` | INTERVIEW | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 300 | normal | 15px |
| `h2.font-mono.text-base.md:text-2xl.text-[#111111].font-medium.leading-snug.mt-4.max-w-3xl` | Interview: Chinese Architectural Photograp | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 24px | 500 | normal | 32px |
| `p.font-mono.text-[11px].md:text-xs.zh-copy.text-[#111111].mt-4.max-w-3xl.leading-relaxed` | 中国建筑摄影师59｜肖世豪：关注普通人在建筑中的真实日常 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `span.text-[#111111]` | 有方 Archiposition | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 300 | normal | 15px |
| `span` | 2025 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 300 | normal | 15px |
| `span.bg-black/[0.06].px-1.5.py-0.5.text-[9px].text-[#444444]` | WEBSITE | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 9px | 300 | normal | 13.5px |
| `h2.font-mono.text-xs.md:text-sm.font-bold.text-[#111111].leading-snug` | Xichang Jianchuan Film Museum Complex – Do | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 14px | 700 | normal | 20px |
| `span.font-mono.text-[11px].md:text-xs.zh-copy.text-[#111111].min-w-0.leading-snug` | ArchDaily | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |

## studio (en)

| Selector | Sample | font-family | size | weight | letter-spacing | line-height |
|---|---|---|---|---|---|---|
| `span` | 毫 | MiSans, "Noto Sans SC", sans-serif | 9.96667px | 300 | normal | 9.96667px |
| `a.nav-tag` | WORKS | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 14.4px |
| `a.nav-tag.is-on` | STUDIO | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 14.4px |
| `button.nav-tag.border-0` | 中 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `span.text-[#666666].leading-none` | / | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 12px |
| `button.nav-tag.border-0.is-on` | EN | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 16px |
| `h2.text-xl.font-bold.text-[#111111].tracking-normal` | Xiao_Shihao | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 20px | 700 | normal | 28px |
| `div.text-[10px].text-gray-500.mt-2.tracking-normal` | LEAD PHOTOGRAPHER | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 300 | normal | 15px |
| `span` | 01 // PHOTOGRAPHER | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `p` | With a 5-year undergraduate degree in arch | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 14px | 300 | normal | 28px |
| `span` | His work focuses on capturing the essence  | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 14px | 300 | normal | 28px |
| `a.text-[#111111].hover:underline.underline-offset-2` | He is the 59th interviewee in Archipositio | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 14px | 300 | normal | 28px |
| `strong.text-[#111111].bg-black/[0.06].px-1` | MMCM STUDIO | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 14px | 400 | normal | 22.75px |
| `span` | based in Chengdu, Sichuan Province.We have | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 14px | 300 | normal | 22.75px |
| `span.text-gray-700.text-xs` | 01 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `span.text-[#666666].group-hover:text-[#111111].group-hover:translate-x-2.transition-all.duratio` | Aecom | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 14px | 700 | normal | 20px |
| `span.text-[10px].text-gray-500.group-hover:text-[#111111]` | US/CN | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 300 | normal | 20px |
| `span.text-[#111111].text-xs.opacity-0.group-hover:opacity-100.transition-opacity` | >> | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `span` | DATABASE_LAST_UPDATED: 2026.01.07 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 300 | normal | 15px |

## contact (en)

| Selector | Sample | font-family | size | weight | letter-spacing | line-height |
|---|---|---|---|---|---|---|
| `span` | 毫 | MiSans, "Noto Sans SC", sans-serif | 9.96667px | 300 | normal | 9.96667px |
| `a.nav-tag` | WORKS | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 14.4px |
| `a.nav-tag.is-on` | CONTACT | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 14.4px |
| `button.nav-tag.border-0` | 中 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `span.text-[#666666].leading-none` | / | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 12px |
| `button.nav-tag.border-0.is-on` | EN | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 16px |
| `span` | SIGNAL_STABLE | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 300 | normal | 15px |
| `div.text-[9px].text-gray-600.font-mono.mb-1.uppercase.tracking-normal` | Mobile / Wechat | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 9px | 300 | normal | 13.5px |
| `div.text-xl.md:text-3xl.text-[#111111].font-mono` | +86 189 8077 2131 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 30px | 300 | normal | 36px |
| `a.text-xl.md:text-3xl.text-[#111111].font-mono.hover:text-[#111111].transition-colors` | hello@mmcm-studio.com | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 30px | 300 | normal | 36px |
| `a.text-xl.md:text-3xl.text-[#111111].font-mono.hover:underline.decoration-[#111111].underlin` | www.mmcm-studio.com | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 30px | 300 | normal | 36px |
| `div.text-xs.text-gray-500.font-mono.border-b.border-black/10.pb-2.mb-4` | 02 // SOCIAL_MATRIX | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `div.text-[9px].text-gray-500.uppercase.mb-1.group-hover:text-[#111111].transition-colors` | XIAOHONGSHU | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 9px | 300 | normal | 13.5px |
| `div.text-xs.text-[#111111]` | MMCM毫厘建筑摄影 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `span.text-[9px].text-[#111111].opacity-0.group-hover:opacity-100.transition-opacity` | >> LINK | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 9px | 300 | normal | 13.5px |
| `div` | LOCATION_DATA: CHENGDU / SICHUAN | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 9px | 300 | normal | 13.5px |

## home (zh)

| Selector | Sample | font-family | size | weight | letter-spacing | line-height |
|---|---|---|---|---|---|---|
| `span` | 毫 | MiSans, "Noto Sans SC", sans-serif | 9.96667px | 300 | normal | 9.96667px |
| `a.nav-tag` | 作品 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 14.4px |
| `button.nav-tag.border-0.is-on` | 中 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 16px |
| `span.text-[#666666].leading-none` | / | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 12px |
| `button.nav-tag.border-0` | EN | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `div.text-gray-500.h-5.overflow-visible.whitespace-nowrap` | 汤桦建筑 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `div.text-[#111111].font-bold.text-sm.md:text-xl` | 西昌建川电影博物馆聚落·纪录片陈列馆 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 20px | 700 | normal | 28px |
| `span` | 27.882°N / 102.173°E | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 700 | normal | 16px |

## atlas (zh)

| Selector | Sample | font-family | size | weight | letter-spacing | line-height |
|---|---|---|---|---|---|---|
| `span` | 毫 | MiSans, "Noto Sans SC", sans-serif | 9.96667px | 300 | normal | 9.96667px |
| `a.nav-tag.is-on` | 作品 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 14.4px |
| `a.nav-tag` | 影片 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 14.4px |
| `button.nav-tag.border-0.is-on` | 中 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 16px |
| `span.text-[#666666].leading-none` | / | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 12px |
| `button.nav-tag.border-0` | EN | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `button.nav-tag.is-on` | 建筑 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 16px |
| `button.nav-tag` | 室内 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `span.text-[#666666]` | / | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | normal | 16px |
| `span` | 全部 18 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | normal | 16px |
| `span.a-count` | 18 个项目 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | 0.72px | 18px |
| `span.a-hint` | 1 个国家 · 11 座城市 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | 0.72px | 18px |
| `span` | 中国 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 11px | 600 | 0.22px | 16.5px |
| `span` | 18 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 11px | 400 | 0.22px | 16.5px |
| `span` | 四川成都 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | 0.72px | 18px |
| `span.n` | 01 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10.5px | 400 | normal | 14.175px |
| `span.t` | 农行成都分行营业用房改造 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12.5px | 300 | normal | 16.875px |
| `span.y` | 2025 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10.5px | 400 | normal | 14.175px |
| `button` | 地球 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | 0.72px | 18px |
| `i` | / | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | 0.72px | 18px |
| `button.on` | 中国 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 600 | 0.72px | 18px |
| `span.b-read-k` | 中国 · 视图中心 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 13px | 300 | 0.78px | 19.5px |
| `span.b-read-v` | 28.380°N / 111.904°E | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 52px | 300 | normal | 52px |
| `span.b-read-a` | 高度 2,513 KM | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 300 | 0.2px | 15px |
| `button` | + | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 14px | 300 | normal | 21px |
| `b` | 18 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 10px | 500 | normal | 15px |
| `em` | 中国 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | 0.72px | 18px |
| `u` | 郎酒龙马酒庄102办公楼改造 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 11px | 300 | 0.44px | 16.5px |
| `b` | 7 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 11px | 500 | normal | 16.5px |
| `em` | 四川成都 | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | 0.24px | 18px |

## 404

`/404.html` uses the same MiSans stack, weight 300, with no Google font link.

| Selector | Sample | font-family | size | weight | letter-spacing | line-height |
|---|---|---|---|---|---|---|
| `a` | MMCM | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 12px | 300 | 0.02em | normal |
| `h1` | Page not found | MiSans, "PingFang SC", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif | 20px | 500 | 0 | 1.3 |
