// Legacy compatibility entry.
// The experimental Create-only layout rewrite was retired because task modes
// must share one stable information architecture. Keep this path as a safe
// forwarder for stale callers without moving DOM nodes or overriding mode UI.
import("./launcher-live-preview.js?v=20260817-consistency-v1").catch((error) => {
  console.error("[launcher] live preview compatibility load failed", error);
});
