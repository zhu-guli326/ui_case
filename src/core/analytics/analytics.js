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

  if (/\/learn\.html$/.test(location.pathname) || /\/$/.test(location.pathname)) {
    /* Load the single canonical mapping for App discovery artwork.
     * The DOM stays in its original four-slot form; only the artwork sources
     * are overridden, so home.js motion and sizing continue to work normally. */
    const homeDiscoveryAssets = document.createElement("link");
    homeDiscoveryAssets.rel = "stylesheet";
    homeDiscoveryAssets.href = "./src/features/home/discovery-asset-paths.css";
    document.head.append(homeDiscoveryAssets);

    const homeFooterCrop = document.createElement("link");
    homeFooterCrop.rel = "stylesheet";
    homeFooterCrop.href = "./src/features/home/home-footer-crop.css";
    document.head.append(homeFooterCrop);

    const homeSectionSpacing = document.createElement("link");
    homeSectionSpacing.rel = "stylesheet";
    homeSectionSpacing.href = "./src/features/home/home-section-spacing.css";
    document.head.append(homeSectionSpacing);

    const homeCtaMotion = document.createElement("script");
    homeCtaMotion.src = "./src/features/home/home-cta-motion.js";
    homeCtaMotion.defer = true;
    document.head.append(homeCtaMotion);

    const homeSystemLiveMotion = document.createElement("script");
    homeSystemLiveMotion.src = "./src/features/home/home-system-live-motion.js";
    homeSystemLiveMotion.defer = true;
    document.head.append(homeSystemLiveMotion);

    const homeHeroMotion = document.createElement("script");
    homeHeroMotion.src = "./src/features/home/home-hero-motion.js";
    homeHeroMotion.defer = true;
    document.head.append(homeHeroMotion);

    const homeGlobalMotion = document.createElement("script");
    homeGlobalMotion.src = "./src/features/home/home-global-motion.js";
    homeGlobalMotion.defer = true;
    document.head.append(homeGlobalMotion);

    const homeWorkflowFourUp = document.createElement("script");
    homeWorkflowFourUp.src = "./src/features/home/home-workflow-four-up.js";
    homeWorkflowFourUp.defer = true;
    document.head.append(homeWorkflowFourUp);
  }
})();
