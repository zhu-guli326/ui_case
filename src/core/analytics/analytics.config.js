window.IMAGE2_ANALYTICS = {
  enabled: true,
  endpoint: "/api/analytics/events",
  site: "image2-ui-library"
};

if (/(?:^|\/)launcher\.html$/i.test(window.location.pathname)) {
  import("../../features/launcher/launcher-hardening.js?v=20260817-a11y-v1").catch((error) => {
    console.warn("[launcher-hardening] failed to load", error);
  });
}
