(function () {
  const config = window.IMAGE2_ANALYTICS || {};
  const endpoint = config.endpoint;
  const sessionKey = "image2-ui-library-session";

  function getSessionId() {
    try {
      const existing = window.sessionStorage.getItem(sessionKey);
      if (existing) return existing;
      const value = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      window.sessionStorage.setItem(sessionKey, value);
      return value;
    } catch {
      return "anonymous";
    }
  }

  function send(event) {
    if (!config.enabled || !endpoint || location.protocol === "file:") return;
    const body = JSON.stringify(event);
    if (navigator.sendBeacon) {
      const accepted = navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
      if (accepted) return;
    }
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }

  window.image2Analytics = {
    track(name, properties = {}) {
      send({
        name,
        properties,
        site: config.site || "image2-ui-library",
        path: location.pathname,
        sessionId: getSessionId(),
        occurredAt: new Date().toISOString(),
      });
    },
  };

  /* Page-specific support runtimes live here only when they are not part of a
   * page's own bundle. Homepage UI is intentionally excluded: learn.html now
   * declares its own CSS and scripts explicitly, so analytics can never mutate
   * homepage DOM, artwork, layout, or motion again. */
  if (/\/library\.html$/.test(location.pathname) || location.pathname.endsWith("/")) {
    const previewRuntime = document.createElement("script");
    previewRuntime.type = "module";
    previewRuntime.src = "./src/components/device-preview/device-preview.js";
    document.head.append(previewRuntime);
  }

  if (/\/launcher\.html$/.test(location.pathname)) {
    const launcherPreviewLab = document.createElement("script");
    launcherPreviewLab.src = "./src/features/launcher/launcher-preview-lab.js";
    launcherPreviewLab.defer = true;
    document.head.append(launcherPreviewLab);

    const launcherStability = document.createElement("script");
    launcherStability.src = "./src/features/launcher/launcher-stability.js";
    launcherStability.defer = true;
    document.head.append(launcherStability);
  }
})();
