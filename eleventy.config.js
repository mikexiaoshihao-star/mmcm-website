const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFile } = require("child_process");

function collectProjectImageVersions() {
  const versions = Object.create(null);
  const root = path.join("src", "images", "projects");
  if (!fs.existsSync(root)) return versions;
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    for (const name of fs.readdirSync(dir)) {
      const abs = path.join(dir, name);
      if (fs.statSync(abs).isDirectory()) {
        stack.push(abs);
        continue;
      }
      if (!/\.(webp|jpe?g|png)$/i.test(name)) continue;
      const rel = "/" + path.relative("src", abs).split(path.sep).join("/");
      versions[rel] = crypto.createHash("sha256").update(fs.readFileSync(abs)).digest("hex").slice(0, 10);
    }
  }
  return versions;
}

function versionedImageUrl(url, versions) {
  if (typeof url !== "string" || url.includes("?")) return url;
  const hash = versions[url];
  return hash ? url + "?v=" + hash : url;
}

module.exports = function(eleventyConfig) {
  const imageVersions = collectProjectImageVersions();
  const assetVersion = crypto
    .createHash("sha256")
    .update(fs.readFileSync("src/assets/style.css"))
    .digest("hex")
    .slice(0, 10);
  const heroJsVersion = crypto
    .createHash("sha256")
    .update(fs.readFileSync("src/assets/hero.js"))
    .digest("hex")
    .slice(0, 10);
  eleventyConfig.addGlobalData("assetVersion", assetVersion);
  eleventyConfig.addGlobalData("heroJsVersion", heroJsVersion);
  eleventyConfig.addGlobalData("heroManifest", () => {
    try { return JSON.parse(fs.readFileSync("src/map/generated/hero-manifest.json", "utf8")); }
    catch (err) { return {}; }
  });

  let mapAssetVersion = "";
  function hashMapAssets() {
    const hash = crypto.createHash("sha256");
    for (const file of [
      "src/map/generated/atlas.js",
      "src/map/atlas.css",
      "src/map/generated/data/projects.js",
      "src/map/generated/data/places.js",
      "src/map/generated/data/globe.js",
    ]) hash.update(fs.readFileSync(file));
    return hash.digest("hex").slice(0, 10);
  }

  eleventyConfig.on("eleventy.before", () => new Promise((resolve, reject) => {
    execFile(process.execPath, ["scripts/check-selected-styles.mjs"], { cwd: process.cwd() }, (err, stdout, stderr) => {
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
      if (err) { reject(err); return; }
      execFile(process.execPath, ["scripts/build-hero-images.mjs"], { cwd: process.cwd() }, (heroErr, heroOut, heroErrText) => {
        if (heroOut) console.log(heroOut);
        if (heroErrText) console.error(heroErrText);
        if (heroErr) { reject(heroErr); return; }
        execFile(process.execPath, ["src/map/build/build.mjs"], { cwd: process.cwd() }, (buildErr, buildOut, buildErrText) => {
          if (buildOut) console.log(buildOut);
          if (buildErrText) console.error(buildErrText);
          if (buildErr) reject(buildErr);
          else {
            mapAssetVersion = hashMapAssets();
            resolve();
          }
        });
      });
    });
  }));
  eleventyConfig.addGlobalData("mapAssetVersion", () => mapAssetVersion);

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({ "src/map/generated/img": "map/img" });
  eleventyConfig.addPassthroughCopy({ "src/map/generated/data": "map/data" });
  eleventyConfig.addPassthroughCopy({ "src/map/generated/atlas.js": "map/atlas.js" });
  eleventyConfig.addPassthroughCopy("src/map/atlas.css");
  eleventyConfig.addPassthroughCopy("src/_headers");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy({ "src/map/generated/hero": "images/hero" });
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/favicon-32x32.png");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon.png");

  // Cover paths include "&" and parentheses. encodeURIComponent leaves ( ) ' ! * unescaped.
  eleventyConfig.addFilter("urlencodePath", (value) => {
    return String(value || "")
      .split("/")
      .map((segment) =>
        encodeURIComponent(segment).replace(/[!'()*]/g, (ch) =>
          "%" + ch.charCodeAt(0).toString(16).toUpperCase()
        )
      )
      .join("/");
  });

  // Same-name replacements must not keep the 31-day cached bytes.
  // The query is a content hash; paths that already carry a query are left alone.
  eleventyConfig.addFilter("imgQuery", (value) => {
    const url = String(value || "").split("?")[0];
    const hash = imageVersions[url];
    return hash ? "?v=" + hash : "";
  });
  eleventyConfig.addFilter("versionProjectImages", (projects) => {
    return (projects || []).map((project) => ({
      ...project,
      url: versionedImageUrl(project.url, imageVersions),
      images: (project.images || []).map((img) => {
        if (typeof img === "string") return versionedImageUrl(img, imageVersions);
        return { ...img, url: versionedImageUrl(img.url, imageVersions) };
      })
    }));
  });

  eleventyConfig.addFilter("js", (value) => {
    if (typeof value === "undefined") return "null";
    return JSON.stringify(value);
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
