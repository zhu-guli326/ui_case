window.IMAGE2_ANALYTICS = {
  enabled: true,
  endpoint: "/api/analytics/events",
  site: "image2-ui-library"
};

// Skills Web mode includes a curated Design Systems group sourced from the
// Awesome / Awesome Design Systems ecosystem, kept separate from Skill repos.
if (/\/skills\.html$/i.test(window.location.pathname)) {
  const source = document.currentScript?.src || window.location.href;
  const skillsDesignSystemsUrl = new URL("../../features/skills/skills-design-systems.js", source);
  import(skillsDesignSystemsUrl.href).catch(() => {});
}
