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
    if (!descriptor?.get || !descriptor?.set) return;

    let suppressIntentReplace = false;
    Object.defineProperty(intentForm, "innerHTML", {
      configurable: true,
      get() {
        return descriptor.get.call(this);
      },
      set(value) {
        if (suppressIntentReplace) return;
        descriptor.set.call(this, value);
      },
    });

    styleGrid.addEventListener("change", (event) => {
      if (event.target?.name !== "styleDirection") return;
      suppressIntentReplace = true;
      queueMicrotask(() => {
        suppressIntentReplace = false;
      });
    }, true);
  });
})();
