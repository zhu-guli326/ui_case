(() => {
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
    else fn();
  }

  ready(() => {
    if (!document.body.classList.contains("launcher-workspace")) return;

    const style = document.createElement("style");
    style.textContent = `
      .platform-section{display:none!important}
      .format-platform-detail{display:none;margin-top:12px;padding:12px;border:1px solid #dfe5e0;border-radius:10px;background:#f7faf8}
      .format-platform-detail.is-visible{display:block}
      .format-platform-title{margin-bottom:9px;color:#4f5952;font-size:9px;font-weight:850}
      .format-platform-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
      .format-platform-option{display:flex;align-items:center;gap:9px;min-height:58px;padding:9px 11px;border:1px solid #d9dfda;border-radius:9px;background:#fff;color:#454e47;cursor:pointer;text-align:left}
      .format-platform-option:hover{border-color:#aeb8b0}
      .format-platform-option.is-active{border-color:#16804b;background:#edf7f1;color:#126b3e;box-shadow:0 0 0 1px #16804b inset}
      .format-platform-option svg{width:24px;height:24px;flex:0 0 24px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
      .format-platform-option strong{display:block;font-size:10px}.format-platform-option small{display:block;margin-top:2px;color:#7c857e;font-size:8px}
      @media(max-width:620px){.format-platform-options{grid-template-columns:1fr}}
    `;
    document.head.append(style);

    const platformSection = document.querySelector(".platform-section");
    if (platformSection) platformSection.hidden = true;

    const designStep = document.querySelector(".color-theme-section .flow-label span");
    if (designStep) designStep.textContent = "4";

    function platformIcon(key) {
      const icons = {
        ios: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="9" y="3" width="14" height="26" rx="4"></rect><path d="M13 6h6M14 26h4"></path></svg>',
        android: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M9 12h14v10H9zM11 12a5 5 0 0 1 10 0M12 7 10 4M20 7l2-3M7 13v7M25 13v7M12 22v5M20 22v5"></path></svg>',
        windows: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 6l11-1.5V15H4zM17 4.2 28 2.7V15H17zM4 17h11v10.5L4 26zM17 17h11v12.3L17 27.8z"></path></svg>',
        macos: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="5" width="22" height="16" rx="2"></rect><path d="M2.5 25h27M12 25h8"></path></svg>'
      };
      return icons[key] || "";
    }

    function platformData(format) {
      if (format === "mobile") return [
        ["ios", "iOS", "iPhone · Apple HIG"],
        ["android", "Android", "Phone · Material 3"]
      ];
      if (format === "desktop") return [
        ["windows", "Windows", "Desktop · Fluent 2"],
        ["macos", "macOS", "Mac · Apple HIG"]
      ];
      return [];
    }

    function selectPlatform(key) {
      const original = document.querySelector('.platform-card[data-platform="' + key + '"]');
      if (original) original.click();
      try { localStorage.setItem("image2-ui-target-platform", key); } catch {}
    }

    function enhance() {
      const select = document.querySelector('#intentForm select[name="format"]');
      const picker = document.querySelector("#intentForm .format-icon-picker");
      if (!select || !picker) return;

      let detail = document.querySelector("#intentForm .format-platform-detail");
      if (!detail) {
        detail = document.createElement("div");
        detail.className = "format-platform-detail";
        picker.insertAdjacentElement("afterend", detail);
      }

      const render = () => {
        const options = platformData(select.value);
        if (!options.length) {
          detail.classList.remove("is-visible");
          detail.innerHTML = "";
          return;
        }

        const saved = localStorage.getItem("image2-ui-target-platform");
        const validKeys = options.map((x) => x[0]);
        const active = validKeys.includes(saved) ? saved : options[0][0];
        if (!validKeys.includes(saved)) selectPlatform(active);

        detail.innerHTML = '<div class="format-platform-title">' + (select.value === "mobile" ? "选择移动平台" : "选择桌面系统") + '</div><div class="format-platform-options"></div>';
        const wrap = detail.querySelector(".format-platform-options");
        options.forEach(([key, label, hint]) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "format-platform-option" + (key === active ? " is-active" : "");
          button.dataset.platform = key;
          button.innerHTML = platformIcon(key) + '<span><strong>' + label + '</strong><small>' + hint + '</small></span>';
          button.addEventListener("click", () => {
            selectPlatform(key);
            wrap.querySelectorAll(".format-platform-option").forEach((item) => item.classList.toggle("is-active", item === button));
          });
          wrap.append(button);
        });
        detail.classList.add("is-visible");
      };

      if (detail.dataset.bound !== "true") {
        detail.dataset.bound = "true";
        select.addEventListener("change", render);
      }
      render();
    }

    const intentForm = document.querySelector("#intentForm");
    if (intentForm) {
      let timer = 0;
      new MutationObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(enhance, 50);
      }).observe(intentForm, { childList: true, subtree: true });
    }

    const previewLabObserver = new MutationObserver(() => {
      const label = document.querySelector("#previewLabSection .flow-label span");
      if (label) label.textContent = "5";
    });
    previewLabObserver.observe(document.body, { childList: true, subtree: true });

    enhance();
  });
})();
