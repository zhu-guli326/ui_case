(() => {
  const PROJECT_KEY = "image2-ui-current-project";
  const THEME_ALIASES = {
    "minimal-tech": "ant-design",
    "editorial-commerce": "adobe-spectrum",
    "soft-lifestyle": "apple-hig",
    "future-tech": "google-material-3",
    "neo-brutal": "tdesign",
    "glass": "fluent-2",
    "retro": "github-primer",
  };

  function normalizeTheme(value) {
    return THEME_ALIASES[value] || value;
  }

  // Migrate old project state before brands.js reads it. The color-theme catalog
  // now uses design-system IDs while older sessions still store legacy visual IDs.
  try {
    const saved = JSON.parse(localStorage.getItem(PROJECT_KEY) || "null");
    if (saved && saved.theme) {
      const normalized = normalizeTheme(saved.theme);
      if (normalized !== saved.theme) {
        saved.theme = normalized;
        localStorage.setItem(PROJECT_KEY, JSON.stringify(saved));
      }
    }
  } catch {}

  try {
    const url = new URL(window.location.href);
    const requestedTheme = url.searchParams.get("theme");
    const normalizedTheme = normalizeTheme(requestedTheme);
    if (requestedTheme && normalizedTheme !== requestedTheme) {
      url.searchParams.set("theme", normalizedTheme);
      history.replaceState(history.state, "", url);
    }
  } catch {}

  // The preview renderer previously gave each iframe both srcdoc and src.
  // srcdoc wins over src, so the loading placeholder could remain forever.
  // Keep this repair at the shell boundary so existing sessions recover too.
  function repairFrame(frame) {
    if (!(frame instanceof HTMLIFrameElement) || !frame.hasAttribute("srcdoc")) return;
    const target = frame.dataset.previewSrc || frame.getAttribute("src");
    if (!target) return;
    frame.removeAttribute("srcdoc");
    frame.src = target;
  }

  function scan(root) {
    if (!root) return;
    if (root instanceof HTMLIFrameElement) repairFrame(root);
    root.querySelectorAll?.("iframe[srcdoc]").forEach(repairFrame);
  }

  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      record.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) scan(node);
      });
      if (record.type === "attributes") repairFrame(record.target);
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src"],
  });

  // Quick-theme buttons still use the old public labels. Normalize their IDs
  // before brands.js receives the click so the select never becomes blank.
  document.addEventListener("click", (event) => {
    const quick = event.target.closest?.("[data-theme-quick]");
    if (!quick) return;
    quick.dataset.themeQuick = normalizeTheme(quick.dataset.themeQuick);
  }, true);
})();
