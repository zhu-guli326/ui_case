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

    // Preserve the user's active requirement inputs while a visual-direction
    // radio change updates the decision model. The legacy controller currently
    // re-renders the intent panel as part of that path, so guard the single
    // microtask in which that replacement would be redundant.
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

    if (!document.getElementById("launcher-stability-styles")) {
      const style = document.createElement("style");
      style.id = "launcher-stability-styles";
      style.textContent = `
        body.create-flow-refactored .font-workbench,
        body.create-flow-refactored .font-preview-shell,
        body.create-flow-refactored [data-font-workbench],
        body.create-flow-refactored [data-section="typography"],
        body.create-flow-refactored [data-section="font"]{display:none!important}
      `;
      document.head.append(style);
    }

    function removeStandaloneTypography() {
      if (!document.body.classList.contains("create-flow-refactored")) return;
      document.querySelectorAll(
        ".font-workbench,.font-preview-shell,[data-font-workbench],[data-section='typography'],[data-section='font']"
      ).forEach((element) => element.remove());

      const headings = [...document.querySelectorAll(".workspace-main h1,.workspace-main h2,.workspace-main h3,.workspace-main strong")]
        .filter((element) => /^字体方案$|^Typography$/i.test(element.textContent.trim()));

      headings.forEach((heading) => {
        let block = heading;
        for (let index = 0; index < 6 && block?.parentElement; index += 1) {
          const parent = block.parentElement;
          const text = parent.textContent || "";
          const hasFontChoices = /系统无衬线|人文无衬线|编辑型衬线|System UI font stack|Source Sans 3|Source Serif 4/i.test(text);
          if (hasFontChoices && (parent.querySelectorAll("input,button,label").length >= 2 || /基础参数|间距基数/.test(text))) {
            parent.remove();
            break;
          }
          block = parent;
        }
      });
    }

    removeStandaloneTypography();

    let queued = false;
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        removeStandaloneTypography();
      });
    }).observe(document.querySelector(".workspace-main") || document.body, { childList: true, subtree: true });
  });
})();
