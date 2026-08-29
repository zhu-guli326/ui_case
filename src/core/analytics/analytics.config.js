window.IMAGE2_ANALYTICS = {
  enabled: true,
  endpoint: "/api/analytics/events",
  site: "image2-ui-library"
};

// Launcher has additional live-preview copy and concrete typography controls that follow the global language switch.
if (/\/launcher\.html$/i.test(window.location.pathname)) {
  const source = document.currentScript?.src || window.location.href;
  const launcherI18nUrl = new URL("../../features/launcher/launcher-preview-i18n.js?v=20260829-global-lang-v1", source);
  const launcherFontControlsUrl = new URL("../../features/launcher/launcher-font-controls.js?v=20260829-font-controls-v2", source);
  import(launcherI18nUrl.href).catch(() => {});
  import(launcherFontControlsUrl.href).catch(() => {});
}
