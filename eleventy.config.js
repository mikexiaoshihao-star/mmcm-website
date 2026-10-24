module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/images");

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
