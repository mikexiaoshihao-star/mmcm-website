function label(value) {
  return String(value == null ? "" : value).replace(/_/g, " ");
}

module.exports = {
  eleventyComputed: {
    pageTitle(data) {
      const project = data.p;
      if (!project || !project.title) return undefined;
      return label(project.title) + " | MMCM STUDIO 毫厘建筑摄影";
    },
    pageDesc(data) {
      const project = data.p;
      if (!project) return undefined;
      return label(project.architect) + " · " + label(project.location) + " · " + project.year;
    },
    ogImagePath(data) {
      const project = data.p;
      return project && project.url ? project.url : undefined;
    },
    initialProject(data) {
      const project = data.p;
      return project && project.slug ? project.slug : null;
    }
  }
};
