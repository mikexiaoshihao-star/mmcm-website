// Resize hero sources only. No sharpening, no colour change. WebP quality 80.
import { createHash } from "crypto";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const site = JSON.parse(readFileSync(join(root, "src/_data/site.json"), "utf8"));
const outDir = join(root, "src/map/generated/hero");
const desktopWidths = [1280, 1920, 2560];
const mobileWidths = [828, 1170];

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const manifest = {};
const seen = new Set();

async function variantsFor(srcPath, widths) {
  const meta = await sharp(srcPath).metadata();
  const made = [];
  for (const width of widths) {
    if (!meta.width || width > meta.width) continue;
    const buf = await sharp(srcPath)
      .resize({ width, withoutEnlargement: true, fit: "inside", kernel: "lanczos3" })
      .webp({ quality: 80, effort: 6, smartSubsample: false })
      .withMetadata()
      .toBuffer();
    const hash = createHash("sha256").update(buf).digest("hex").slice(0, 12);
    const file = hash + "-" + width + ".webp";
    writeFileSync(join(outDir, file), buf);
    made.push({ w: width, url: "/images/hero/" + file, bytes: buf.length });
  }
  if (!made.length && meta.width) {
    const buf = readFileSync(srcPath);
    const hash = createHash("sha256").update(buf).digest("hex").slice(0, 12);
    const file = hash + "-" + meta.width + ".webp";
    writeFileSync(join(outDir, file), buf);
    made.push({ w: meta.width, url: "/images/hero/" + file, bytes: buf.length });
  }
  const preferred = made.find((item) => item.w === 1920) || made.find((item) => item.w === 828) || made[made.length - 1];
  return {
    src: preferred ? preferred.url : "",
    srcset: made.map((item) => item.url + " " + item.w + "w").join(", "),
    widths: made.map((item) => item.w),
    bytes: made.reduce((sum, item) => sum + item.bytes, 0),
    sourceBytes: (await sharp(srcPath).metadata(), readFileSync(srcPath).length)
  };
}

for (const group of [
  [site.homeProjects || [], desktopWidths],
  [site.homeProjectsMobile || [], mobileWidths]
]) {
  for (const project of group[0]) {
    const key = project.img;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const srcPath = join(root, "src", key.replace(/^\//, ""));
    manifest[key] = await variantsFor(srcPath, group[1]);
    const row = manifest[key];
    console.log(key, "source", row.sourceBytes, "derivatives", row.bytes, row.widths.join(","));
    delete row.sourceBytes;
    delete row.bytes;
  }
}

writeFileSync(join(root, "src/map/generated/hero-manifest.json"), JSON.stringify(manifest));
console.log("hero images", Object.keys(manifest).length);
