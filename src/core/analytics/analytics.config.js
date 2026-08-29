window.IMAGE2_ANALYTICS = {
  enabled: true,
  endpoint: "/api/analytics/events",
  site: "image2-ui-library"
};

// Launcher live-preview copy follows the global language switch.
// Keep typography selection simple: users choose a font family only; detailed
// weight / tracking / slant controls stay hidden from the launcher UI.
if (/\/launcher\.html$/i.test(window.location.pathname)) {
  const source = document.currentScript?.src || window.location.href;
  const launcherI18nUrl = new URL("../../features/launcher/launcher-preview-i18n.js?v=20260829-global-lang-v1", source);
  import(launcherI18nUrl.href).catch(() => {});
}
