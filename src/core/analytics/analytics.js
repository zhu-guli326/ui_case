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
    /* App discovery has two competing render paths:
     * - learn.html starts with one image + three visual placeholder nodes.
     * - home.js rewrites the first image from DISCOVERY_PREVIEWS every render.
     *
     * Mount the approved four assets as real <img> elements before home.js runs,
     * then keep those exact sources stable if home.js tries to overwrite them.
     * This keeps the four-card motion intact because home.js binds to these same
     * image nodes instead of a later replacement. */
    const appCard = document.querySelector("#templates .template-grid .template-card:first-child");
    const appArtwork = [
      ["./assets/home/discovery/app-1.png", "App design preview 1"],
      ["./assets/home/discovery/app-2.png", "App design preview 2"],
      ["./assets/home/discovery/app-3.png", "App design preview 3"],
      ["./assets/home/discovery/app-4.png", "App design preview 4"],
    ];

    const ensureAppArtwork = () => {
      if (!appCard) return;
      let images = [...appCard.children].filter((child) => child.tagName === "IMG");

      if (images.length !== appArtwork.length) {
        images = appArtwork.map(([src, alt]) => {
          const image = document.createElement("img");
          image.src = src;
          image.alt = alt;
          image.loading = "lazy";
          image.decoding = "async";
          return image;
        });
        appCard.replaceChildren(...images);
      }

      images.forEach((image, index) => {
        const [src, alt] = appArtwork[index];
        const expectedSrc = new URL(src, location.href).href;
        if (image.src !== expectedSrc) image.src = src;
        if (image.alt !== alt) image.alt = alt;
        image.loading = "lazy";
        image.decoding = "async";
      });
    };

    ensureAppArtwork();

    if (appCard && "MutationObserver" in window) {
      const appArtworkObserver = new MutationObserver(() => ensureAppArtwork());
      appArtworkObserver.observe(appCard, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["src"],
      });
    }

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
