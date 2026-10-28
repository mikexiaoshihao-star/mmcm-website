// Selected/active/current text is font-weight 600 and an underline.
// It must never be a #111 (or black) block with white text.
import { readFileSync } from "fs";

const files = ["src/assets/style.css", "src/map/atlas.css"];
const stateRe = /(?:\.is-on|\.act\b|(?:^|[^-\w])on\b|\[aria-selected(?:\]|=)|\baria-current\b|\baria-pressed\b)/;
const darkRe = /background(?:-color)?\s*:\s*(?:#(?:111(?:111)?|000(?:000)?)|black|var\(\s*--ink\s*\))/i;
const lightRe = /(?:^|[^-\w])color\s*:\s*(?:#fff(?:fff)?|white)\b/i;

function rules(css) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const found = [];
  for (const part of clean.split("}")) {
    const at = part.lastIndexOf("{");
    if (at < 0) continue;
    found.push({ selector: part.slice(0, at).trim(), body: part.slice(at + 1) });
  }
  return found;
}

const failures = [];
for (const file of files) {
  const css = readFileSync(file, "utf8");
  for (const rule of rules(css)) {
    if (!stateRe.test(rule.selector)) continue;
    if (darkRe.test(rule.body) && lightRe.test(rule.body)) {
      failures.push(`${file}: ${rule.selector.replace(/\s+/g, " ")}`);
    }
  }
}

if (failures.length) {
  console.error("Selected styles must be weight 600 and underline, not a dark block with white text:");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log("selected styles ok");
