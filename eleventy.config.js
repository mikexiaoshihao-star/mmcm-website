const fs = require("fs");
const crypto = require("crypto");
const { execFile } = require("child_process");

module.exports = function(eleventyConfig) {
  const assetVersion = crypto
    .createHash("sha256")
    .update(fs.readFileSync("src/assets/style.css"))
    .digest("hex")
    .slice(0, 10);
  eleventyConfig.addGlobalData("assetVersion", assetVersion);

  let mapAssetVersion = "";
  function hashMapAssets() {
    const hash = crypto.createHash("sha256");
    for (const file of [
      "src/map/generated/atlas.js",
      "src/map/atlas.css",
      "src/map/generated/data/projects.js",
      "src/map/generated/data/places.js",
      "src/map/generated/data/globe.js",
    ]) {
      hash.update(fs.readFileSync(file));
    }
    return hash.digest("hex").slice(0, 10);
  }

  eleventyConfig.on("eleventy.before", () => new Promise((resolve, reject) => {
    execFile(process.execPath, ["src/map/build/build.mjs"], { cwd: process.cwd() }, (err, stdout, stderr) => {
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
      if (err) reject(err);
      else {
        mapAssetVersion = hashMapAssets();
        resolve();
      }
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
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/favicon-32x32.png");
  eleventyConfig.addPassthroughCopy("src/favicon-16x16.png");
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
