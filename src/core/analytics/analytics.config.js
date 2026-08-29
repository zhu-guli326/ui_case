window.IMAGE2_ANALYTICS = {
  enabled: true,
  endpoint: "/api/analytics/events",
  site: "image2-ui-library"
};

// Launcher live-preview copy follows the global language switch.
// Typography stays simple: choose a font family only. The extended library
// adds concrete system and Google Fonts choices without exposing low-level
// weight / tracking / slant controls.
if (/\/launcher\.html$/i.test(window.location.pathname)) {
  const source = document.currentScript?.src || window.location.href;
  const launcherI18nUrl = new URL("../../features/launcher/launcher-preview-i18n.js?v=20260829-global-lang-v1", source);
  const launcherFontLibraryUrl = new URL("../../features/launcher/launcher-font-library.js?v=20260829-google-fonts-v1", source);
  import(launcherI18nUrl.href).catch(() => {});
  import(launcherFontLibraryUrl.href).catch(() => {});
}

// Skills Web mode includes a curated Design Systems group sourced from the
// Awesome / Awesome Design Systems ecosystem, kept separate from Skill repos.
if (/\/skills\.html$/i.test(window.location.pathname)) {
  const source = document.currentScript?.src || window.location.href;
  const skillsDesignSystemsUrl = new URL("../../features/skills/skills-design-systems.js?v=20260829-awesome-design-systems-v1", source);
  import(skillsDesignSystemsUrl.href).catch(() => {});
}
