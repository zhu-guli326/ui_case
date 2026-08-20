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
    fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
  }

  window.image2Analytics = {
    track(name, properties = {}) {
      send({
        name,
        properties,
        site: config.site || "image2-ui-library",
        path: location.pathname,
        sessionId: getSessionId(),
        occurredAt: new Date().toISOString()
      });
    }
  };

  if (/\/learn\.html$/.test(location.pathname)) {
    // Learn page compatibility: learn.js mounts the interactive CSS lab into
    // `.breakdown-board`. The authored markup also keeps `.decomposition` for
    // the base layout, so expose both names before learn.js executes.
    document.querySelector("#breakdown .decomposition")?.classList.add("breakdown-board");

    // Stronger boxed overlays for Pattern / Hierarchy / Action inspection.
    // Loaded separately so these teaching annotations can evolve without
    // disturbing the main page stylesheet.
    if (!document.querySelector('link[data-learn-lens-overrides]')) {
      const lensStyles = document.createElement("link");
      lensStyles.rel = "stylesheet";
      lensStyles.href = "./learn-lens-overrides.css?v=20260820-boxed-v1";
      lensStyles.dataset.learnLensOverrides = "true";
      document.head.append(lensStyles);
    }
  }

  if (/\/library\.html$/.test(location.pathname) || location.pathname.endsWith("/")) {
    const previewRuntime = document.createElement("script");
    previewRuntime.type = "module";
    previewRuntime.src = "./src/components/device-preview/device-preview.js?v=20260816-arch-v1";
    document.head.append(previewRuntime);
  }
})();
