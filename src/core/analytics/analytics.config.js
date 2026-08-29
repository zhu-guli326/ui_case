window.IMAGE2_ANALYTICS = {
  enabled: true,
  endpoint: "/api/analytics/events",
  site: "image2-ui-library"
};

// Launcher has additional live-preview copy that follows the global language switch.
if (/\/launcher\.html$/i.test(window.location.pathname)) {
  const source = document.currentScript?.src || window.location.href;
  const launcherI18nUrl = new URL("../../features/launcher/launcher-preview-i18n.js?v=20260829-global-lang-v1", source);
  import(launcherI18nUrl.href).catch(() => {});
}
