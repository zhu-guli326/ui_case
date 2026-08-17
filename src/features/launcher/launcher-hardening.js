const isLauncher = /(?:^|\/)launcher\.html$/i.test(window.location.pathname);

if (isLauncher) {
  const whenReady = (fn) => {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
    else fn();
  };
  const currentLanguage = () => {
    const fromQuery = new URL(window.location.href).searchParams.get("lang");
    if (fromQuery === "en" || fromQuery === "zh") return fromQuery;
    return window.image2I18n?.language === "en" ? "en" : "zh";
  };
  const tr = (zh, en) => currentLanguage() === "en" ? en : zh;

  function installStyles() {
    if (document.getElementById("launcher-hardening-styles")) return;
    const style = document.createElement("style");
    style.id = "launcher-hardening-styles";
    style.textContent = `
      .launcher-workspace :is(button,a,input,textarea,select,[tabindex]):focus-visible{outline:3px solid #0b6b3a!important;outline-offset:3px!important}
      .launcher-workspace .mode-tabs>button:focus-visible,.launcher-workspace .ds-tab:focus-visible,.launcher-workspace .platform-card:focus-visible{box-shadow:0 0 0 4px #fff,0 0 0 7px #0b6b3a!important}
      .launcher-workspace .field-validation-error{margin:6px 0 0;color:#8f2d20;font-size:11px;font-weight:700;line-height:1.45}
      .launcher-workspace [aria-invalid="true"]{border-color:#a33d2e!important;box-shadow:0 0 0 2px rgba(163,61,46,.12)!important}
      .launcher-workspace .generate-button[disabled]{opacity:.58;cursor:not-allowed}
      .launcher-workspace .prompt-actions .primary-action-wrap{position:relative}
      .launcher-workspace .prompt-actions .primary-action-wrap[data-readiness="blocked"]::after{position:absolute;inset:0;content:"";cursor:help}
      .launcher-workspace .ds-tab[aria-selected="true"]{border-color:#12683c;background:#e4f2e8;color:#0c5630}
      .launcher-workspace .platform-card[role="radio"][aria-checked="true"]{border-color:#12683c;background:#e8f4ec;box-shadow:0 0 0 1px #12683c inset}
      .launcher-workspace .platform-copy small,.launcher-workspace .platform-hint,.launcher-workspace .ds-toolbar span,.launcher-workspace .preview-meta p,.launcher-workspace .preview-meta ul,.launcher-workspace .ds-info-card p,.launcher-workspace .ds-type-sample small,.launcher-workspace .ds-metric span{color:#505a52!important}
      .launcher-workspace .sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
      @media(prefers-contrast:more){.launcher-workspace{--muted:#424b44;--quiet:#515a52;--line:#a6aea7;--line-strong:#727c74}.launcher-workspace :is(.mode-picker,.style-direction,.platform-section,.color-theme-section,.launcher-grid){border-color:#9ca59e!important}}
      @media(prefers-reduced-motion:reduce){.launcher-workspace *,.launcher-workspace *::before,.launcher-workspace *::after{scroll-behavior:auto!important;transition-duration:.01ms!important;animation-duration:.01ms!important;animation-iteration-count:1!important}}
    `;
    document.head.appendChild(style);
  }

  function syncDocumentLanguage() {
    document.documentElement.lang = currentLanguage() === "en" ? "en" : "zh-CN";
  }

  function installLandmarks() {
    const main = document.querySelector("main.launcher-shell");
    if (main && !main.hasAttribute("aria-labelledby")) main.setAttribute("aria-labelledby", "pageTitle");
    const side = document.querySelector(".workspace-side");
    if (side) {
      side.setAttribute("role", "complementary");
      side.setAttribute("aria-label", tr("任务摘要与指令", "Task summary and prompt"));
    }
  }

  function syncPrimaryTabs() {
    const tabs = Array.from(document.querySelectorAll("#modeTabs [role='tab']"));
    if (!tabs.length) return;
    const activeIntent = new URL(window.location.href).searchParams.get("intent");
    tabs.forEach((tab) => {
      const selected = tab.dataset.intent === activeIntent || tab.classList.contains("is-active") || tab.getAttribute("aria-selected") === "true";
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    const active = tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0];
    const panel = document.getElementById("intentForm");
    if (panel && active?.id) panel.setAttribute("aria-labelledby", active.id);
  }

  function installPrimaryTabKeys() {
    const tablist = document.getElementById("modeTabs");
    if (!tablist || tablist.dataset.keyboardReady === "1") return;
    tablist.dataset.keyboardReady = "1";
    tablist.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      const tabs = Array.from(tablist.querySelectorAll("[role='tab']"));
      const current = Math.max(0, tabs.indexOf(document.activeElement));
      let next = current;
      if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
      if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      event.preventDefault();
      tabs[next]?.focus();
      tabs[next]?.click();
    });
  }

  function syncDesignSystemTabs() {
    const tabs = Array.from(document.querySelectorAll(".ds-tabs .ds-tab"));
    const panels = Array.from(document.querySelectorAll(".design-system-workbench .ds-panel"));
    if (!tabs.length || !panels.length) return;
    tabs.forEach((tab, index) => {
      const key = tab.dataset.dsTab || `panel-${index + 1}`;
      const panel = panels.find((item) => item.dataset.dsPanel === key) || panels[index];
      const selected = tab.classList.contains("is-active");
      const tabId = `ds-tab-${key}`;
      const panelId = `ds-panel-${key}`;
      tab.id = tabId;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", panelId);
      if (tab.getAttribute("aria-selected") !== String(selected)) tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (panel) {
        panel.id = panelId;
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-labelledby", tabId);
        panel.tabIndex = 0;
        if (panel.hidden === selected) panel.hidden = !selected;
      }
    });
  }

  function installDesignSystemTabKeys() {
    const tablist = document.querySelector(".ds-tabs[role='tablist']");
    if (!tablist || tablist.dataset.keyboardReady === "1") return;
    tablist.dataset.keyboardReady = "1";
    tablist.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      const tabs = Array.from(tablist.querySelectorAll("[role='tab']"));
      const current = Math.max(0, tabs.indexOf(document.activeElement));
      let next = current;
      if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
      if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      event.preventDefault();
      tabs[next]?.focus();
      tabs[next]?.click();
      requestAnimationFrame(syncDesignSystemTabs);
    });
  }

  function syncPlatformRadios() {
    const grid = document.getElementById("platformGrid");
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll(".platform-card"));
    cards.forEach((card) => {
      const active = card.classList.contains("is-active");
      card.setAttribute("role", "radio");
      if (card.getAttribute("aria-checked") !== String(active)) card.setAttribute("aria-checked", String(active));
      if (card.hasAttribute("aria-pressed")) card.removeAttribute("aria-pressed");
      card.tabIndex = active ? 0 : -1;
    });
  }

  function installPlatformKeys() {
    const grid = document.getElementById("platformGrid");
    if (!grid || grid.dataset.keyboardReady === "1") return;
    grid.dataset.keyboardReady = "1";
    grid.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
      const cards = Array.from(grid.querySelectorAll(".platform-card"));
      const current = Math.max(0, cards.indexOf(document.activeElement));
      let next = current;
      if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (current - 1 + cards.length) % cards.length;
      if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (current + 1) % cards.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = cards.length - 1;
      event.preventDefault();
      cards[next]?.focus();
      cards[next]?.click();
      requestAnimationFrame(syncPlatformRadios);
    });
  }

  function syncPreviewControls() {
    document.querySelectorAll(".preview-control").forEach((button) => {
      const value = String(button.classList.contains("is-active"));
      if (button.getAttribute("aria-pressed") !== value) button.setAttribute("aria-pressed", value);
    });
  }

  function hardenDialog() {
    const dialog = document.getElementById("casePicker");
    if (!dialog) return;
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-describedby", "casePickerHelp");
    if (!document.getElementById("casePickerHelp")) {
      const help = document.createElement("p");
      help.id = "casePickerHelp";
      help.className = "sr-only";
      help.textContent = tr("搜索、筛选并选择一个参考案例。按 Escape 可关闭。", "Search, filter, and choose a reference case. Press Escape to close.");
      dialog.querySelector(".case-picker-header")?.insertAdjacentElement("afterend", help);
    }
    const observer = new MutationObserver(() => {
      if (!dialog.open) return;
      requestAnimationFrame(() => {
        const search = document.getElementById("caseSearch");
        if (search && !dialog.contains(document.activeElement)) search.focus();
      });
    });
    observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });
  }

  function firstLikelyIncompleteField() {
    const fields = Array.from(document.querySelectorAll("#intentForm input,#intentForm textarea,#intentForm select"))
      .filter((field) => !field.disabled && field.type !== "hidden" && field.offsetParent !== null);
    return fields.find((field) => {
      if (field.type === "radio" || field.type === "checkbox") {
        const group = fields.filter((item) => item.name && item.name === field.name);
        return !group.some((item) => item.checked);
      }
      return !String(field.value || "").trim();
    }) || null;
  }

  function clearValidationMessages() {
    document.querySelectorAll(".field-validation-error").forEach((node) => node.remove());
    document.querySelectorAll("#intentForm [aria-invalid='true']").forEach((field) => field.removeAttribute("aria-invalid"));
  }

  function showBlockedFeedback() {
    clearValidationMessages();
    const field = firstLikelyIncompleteField();
    const missing = document.getElementById("missingState");
    if (!field) {
      missing?.setAttribute("tabindex", "-1");
      missing?.focus?.();
      return;
    }
    field.setAttribute("aria-invalid", "true");
    const message = document.createElement("p");
    message.className = "field-validation-error";
    message.id = `field-error-${Date.now()}`;
    message.setAttribute("role", "alert");
    message.textContent = tr("请先补充这个字段，再生成指令。", "Complete this field before generating the prompt.");
    field.setAttribute("aria-describedby", [field.getAttribute("aria-describedby"), message.id].filter(Boolean).join(" "));
    (field.closest("label") || field.parentElement)?.appendChild(message);
    field.focus();
    field.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  function syncGenerateReadiness() {
    const button = document.getElementById("generatePrompt");
    const wrap = document.getElementById("generatePromptWrap");
    if (!button || !wrap) return;
    const blocked = button.disabled || button.getAttribute("aria-disabled") === "true";
    wrap.dataset.readiness = blocked ? "blocked" : "ready";
    wrap.setAttribute("aria-label", blocked ? tr("生成指令暂不可用：请先完成缺失信息", "Generate prompt unavailable: complete the missing information first") : tr("生成指令已可用", "Generate prompt is ready"));
    if (!blocked) clearValidationMessages();
  }

  function installGenerateFeedback() {
    const wrap = document.getElementById("generatePromptWrap");
    if (!wrap || wrap.dataset.feedbackReady === "1") return;
    wrap.dataset.feedbackReady = "1";
    wrap.tabIndex = 0;
    wrap.addEventListener("click", () => {
      if (document.getElementById("generatePrompt")?.disabled) showBlockedFeedback();
    });
    wrap.addEventListener("keydown", (event) => {
      if (!["Enter", " "].includes(event.key) || !document.getElementById("generatePrompt")?.disabled) return;
      event.preventDefault();
      showBlockedFeedback();
    });
  }

  function syncAssistant() {
    const toggle = document.getElementById("assistantToggle");
    const panel = document.getElementById("assistantPanel");
    if (!toggle || !panel) return;
    const expanded = String(!panel.hidden);
    if (toggle.getAttribute("aria-expanded") !== expanded) toggle.setAttribute("aria-expanded", expanded);
    panel.setAttribute("role", "complementary");
    panel.setAttribute("aria-label", tr("任务助手", "Task assistant"));
  }

  function syncAll() {
    syncDocumentLanguage();
    syncPrimaryTabs();
    syncDesignSystemTabs();
    syncPlatformRadios();
    syncPreviewControls();
    syncGenerateReadiness();
    syncAssistant();
  }

  whenReady(() => {
    installStyles();
    installLandmarks();
    installPrimaryTabKeys();
    installDesignSystemTabKeys();
    installPlatformKeys();
    installGenerateFeedback();
    hardenDialog();
    syncAll();

    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        syncAll();
      });
    });
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "disabled", "open"] });

    document.addEventListener("click", (event) => {
      if (event.target.closest("#assistantToggle,#assistantClose,.ds-tab,.preview-control,.platform-card,#modeTabs [role='tab']")) requestAnimationFrame(syncAll);
    });
    window.addEventListener("popstate", () => requestAnimationFrame(syncAll));
    window.addEventListener("languagechange", () => requestAnimationFrame(syncAll));
  });
}
