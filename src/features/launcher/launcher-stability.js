(() => {
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
    else fn();
  }

  ready(() => {
    if (!document.body.classList.contains("launcher-workspace")) return;
    const styleGrid = document.querySelector("#styleDirectionGrid");
    const intentForm = document.querySelector("#intentForm");
    if (!styleGrid || !intentForm) return;

    const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
    if (descriptor?.get && descriptor?.set) {
      let suppressIntentReplace = false;
      Object.defineProperty(intentForm, "innerHTML", {
        configurable: true,
        get() { return descriptor.get.call(this); },
        set(value) {
          if (suppressIntentReplace) return;
          descriptor.set.call(this, value);
        },
      });

      styleGrid.addEventListener("change", (event) => {
        if (event.target?.name !== "styleDirection") return;
        suppressIntentReplace = true;
        queueMicrotask(() => { suppressIntentReplace = false; });
      }, true);
    }

    // Typography is one lightweight decision in the create flow, never a repeated catalogue.
    // Runtime modules may re-render sections, so keep exactly one font workbench visible.
    const typographyStyle = document.createElement("style");
    typographyStyle.id = "launcher-typography-dedupe-style";
    typographyStyle.textContent = `
      body.create-flow-refactored .font-workbench{padding:16px 0 0!important;margin-top:14px!important}
      body.create-flow-refactored .font-workbench-heading{margin-bottom:9px!important}
      body.create-flow-refactored .font-workbench-heading h2,
      body.create-flow-refactored .font-workbench-heading h3{font-size:15px!important;margin:0!important}
      body.create-flow-refactored .font-workbench-heading p{font-size:9px!important;margin:4px 0 0!important}
      body.create-flow-refactored .font-preset-grid{gap:8px!important}
      body.create-flow-refactored .font-preset-grid>*{min-height:92px!important;padding:10px!important}
      body.create-flow-refactored .font-workbench .token-foundation-block,
      body.create-flow-refactored .font-workbench .foundation-block,
      body.create-flow-refactored .font-workbench [class*="base-param"],
      body.create-flow-refactored .font-workbench [class*="foundation"]{display:none!important}
      body.create-flow-refactored .font-workbench.is-duplicate-font-workbench{display:none!important}
    `;
    document.head.append(typographyStyle);

    function dedupeTypography() {
      const benches = [...document.querySelectorAll(".font-workbench")];
      benches.forEach((bench, index) => bench.classList.toggle("is-duplicate-font-workbench", index > 0));

      // Defensive cleanup for duplicated typography sections created without .font-workbench.
      const candidates = [...document.querySelectorAll(".workspace-main section, .workspace-main .config-section, .workspace-main > div")]
        .filter(el => !el.closest(".font-workbench"))
        .filter(el => {
          const title = el.querySelector(":scope > .section-heading h2, :scope > .section-heading h3, :scope > h2, :scope > h3");
          return title && /字体方案|Typography/i.test(title.textContent.trim());
        });
      candidates.forEach((el, index) => {
        if (index > 0) el.style.setProperty("display", "none", "important");
      });
    }

    dedupeTypography();
    let queued = false;
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        dedupeTypography();
      });
    }).observe(document.querySelector(".workspace-main") || document.body, { childList: true, subtree: true });
  });
})();
