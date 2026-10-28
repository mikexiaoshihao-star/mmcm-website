const fs = require("fs");
const crypto = require("crypto");

module.exports = function(eleventyConfig) {
  const assetVersion = crypto
    .createHash("sha256")
    .update(fs.readFileSync("src/assets/style.css"))
    .digest("hex")
    .slice(0, 10);
  eleventyConfig.addGlobalData("assetVersion", assetVersion);

  eleventyConfig.addPassthroughCopy("src/assets");
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
