(() => {
  const q = (selector) => document.querySelector(selector);
  const qa = (selector) => [...document.querySelectorAll(selector)];
  const language = () => {
    const query = new URL(location.href).searchParams.get("lang");
    if (query === "en" || query === "zh") return query;
    return window.image2I18n?.language === "en" ? "en" : "zh";
  };
  const tr = (zh, en) => language() === "en" ? en : zh;

  const copy = [
    ['.launcher-step-link[data-launcher-step="task"] strong', "定义任务", "Define task"],
    ['.launcher-step-link[data-launcher-step="design"] strong', "设计约束", "Design rules"],
    ['.launcher-step-link[data-launcher-step="output"] strong', "预览与输出", "Preview & output"],
    ["#taskDefinitionTitle", "你要完成什么？", "What do you want to accomplish?"],
    ["#taskDefinition .stage-heading p:last-child", "先选任务类型，再只填写这个任务真正需要的信息。", "Choose the task type first, then provide only the information it actually needs."],
    ["#modeTitle", "任务类型", "Task type"],
    ["#modeIntro", "切换任务只改变下面的输入项，不改变后续流程。", "Changing the task only changes the inputs below, not the rest of the workflow."],
    ["#tab-create strong", "从零创建", "Create"],
    ["#tab-create small", "产品、用户和页面", "Product, users, pages"],
    ["#tab-rebuild strong", "参考图还原", "Rebuild"],
    ["#tab-rebuild small", "页面、状态和交互", "Pages, states, interactions"],
    ["#tab-improve strong", "优化现有页面", "Improve"],
    ["#tab-improve small", "诊断并直接优化", "Diagnose and improve"],
    ["#tab-explore strong", "探索现有项目", "Explore"],
    ["#tab-explore small", "结构、风险和缺口", "Structure, risks, gaps"],
    ["#tab-design-system strong", "比较设计系统", "Compare systems"],
    ["#tab-design-system small", "同一目标下比较", "Compare on one target"],
    ["#designDecisionsTitle", "页面应该怎么做？", "How should the page be built?"],
    ["#designDecisions .stage-heading p:last-child", "只保留三类设计决定：视觉方向、目标平台、Design System。", "Keep only three design decisions: visual direction, target platform, and design system."],
    ["#styleTitle", "视觉方向", "Visual direction"],
    ["#styleIntro", "选整体构图、密度和气质。", "Choose composition, density, and visual character."],
    ["#platformTitle", "目标平台", "Target platform"],
    [".platform-section .section-heading p", "平台会自动带入导航、字号、安全区和交互惯例。", "The platform automatically brings navigation, type scale, safe areas, and interaction conventions."],
    ["#colorThemeTitle", "Design System", "Design system"],
    ["#colorThemeIntro", "选择组件与 Token 来源；系统摘要直接显示，不再打开第二层 Tab。", "Choose the component and token source. The system summary stays visible without another tab layer."],
    ["#resultStageTitle", "看结果，然后输出", "Preview the result, then output"],
    ["#resultStage .stage-heading p:last-child", "先检查真实页面效果，再确认任务摘要和最终调用指令。", "Check the real page preview first, then review the task summary and final execution prompt."],
    ["#promptKicker", "任务检查", "Task review"],
    ["#promptTitle", "输出指令", "Output prompt"],
    ["#promptPreviewTitle", "完整调用指令", "Full execution prompt"],
    ["#copyPrompt", "复制指令", "Copy prompt"],
    ["#savePreset", "保存快照", "Save snapshot"],
    ["#assistantToggle span:last-child", "任务助手", "Task assistant"],
    ["#assistantTitle", "下一步建议", "Next suggestion"],
  ];

  function applyCopy() {
    document.documentElement.lang = language() === "en" ? "en" : "zh-CN";
    copy.forEach(([selector, zh, en]) => {
      const node = q(selector);
      if (node) node.textContent = tr(zh, en);
    });
    q("#modeTabs")?.setAttribute("aria-label", tr("任务模式", "Task mode"));
    q("#platformGrid")?.setAttribute("aria-label", tr("目标平台", "Target platform"));
    q("#styleDirectionGrid")?.setAttribute("aria-label", tr("风格方向", "Visual direction"));
    q("#colorThemeGrid")?.setAttribute("aria-label", tr("品牌与设计系统", "Brand and design system"));
    q(".launcher-step-nav")?.setAttribute("aria-label", tr("任务流程", "Task workflow"));
    q("#promptOutput")?.setAttribute("aria-label", tr("可编辑的完整调用指令", "Editable full execution prompt"));
  }

  function setCurrentStep(step) {
    qa(".launcher-step-link").forEach((link) => {
      if (link.dataset.launcherStep === step) link.setAttribute("aria-current", "step");
      else link.removeAttribute("aria-current");
    });
  }

  function installStepNavigation() {
    q(".launcher-step-nav")?.addEventListener("click", (event) => {
      const link = event.target.closest(".launcher-step-link[data-launcher-step]");
      if (link) setCurrentStep(link.dataset.launcherStep);
    });
    q("#taskDefinition")?.addEventListener("focusin", () => setCurrentStep("task"));
    q("#designDecisions")?.addEventListener("focusin", () => setCurrentStep("design"));
    q("#resultStage")?.addEventListener("focusin", () => setCurrentStep("output"));
    q("#generatePrompt")?.addEventListener("click", () => setCurrentStep("output"));
    q("#copyPrompt")?.addEventListener("click", () => setCurrentStep("output"));

    if ("IntersectionObserver" in window) {
      const regions = [q("#taskDefinition"), q("#designDecisions"), q("#resultStage")].filter(Boolean);
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        if (visible.target.id === "taskDefinition") setCurrentStep("task");
        if (visible.target.id === "designDecisions") setCurrentStep("design");
        if (visible.target.id === "resultStage") setCurrentStep("output");
      }, { rootMargin: "-18% 0px -52% 0px", threshold: [0.1, 0.35, 0.6] });
      regions.forEach((region) => observer.observe(region));
    }
  }

  function ensureSystemSummarySemantics() {
    qa('#designSystemWorkbench [data-ds-panel="foundation"], #designSystemWorkbench [data-ds-panel="components"]').forEach((panel) => {
      panel.hidden = false;
      panel.classList.add("is-active");
      panel.setAttribute("role", "region");
      panel.removeAttribute("aria-labelledby");
    });
  }

  function syncPrimaryTabs() {
    const tabs = qa("#modeTabs [role='tab']");
    if (!tabs.length) return;
    const urlIntent = new URL(location.href).searchParams.get("intent");
    tabs.forEach((tab) => {
      const selected = tab.dataset.intent === urlIntent || tab.classList.contains("is-active") || tab.getAttribute("aria-selected") === "true";
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    const active = tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0];
    if (active?.id) q("#intentForm")?.setAttribute("aria-labelledby", active.id);
  }

  function installPrimaryTabKeys() {
    const tablist = q("#modeTabs");
    if (!tablist || tablist.dataset.runtimeKeyboardReady === "1") return;
    tablist.dataset.runtimeKeyboardReady = "1";
    tablist.addEventListener("keydown", (event) => {
      if (!["Home", "End"].includes(event.key)) return;
      const tabs = qa("#modeTabs [role='tab']");
      if (!tabs.length) return;
      event.preventDefault();
      const next = event.key === "Home" ? tabs[0] : tabs[tabs.length - 1];
      next.focus();
      next.click();
    });
  }

  function hardenDialog() {
    const dialog = q("#casePicker");
    if (!dialog) return;
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-describedby", "casePickerHelp");
    if (!q("#casePickerHelp")) {
      const help = document.createElement("p");
      help.id = "casePickerHelp";
      help.className = "sr-only";
      help.textContent = tr("搜索、筛选并选择一个参考案例。按 Escape 可关闭。", "Search, filter, and choose a reference case. Press Escape to close.");
      dialog.querySelector(".case-picker-header")?.insertAdjacentElement("afterend", help);
    }
  }

  function firstLikelyIncompleteField() {
    const fields = qa("#intentForm input,#intentForm textarea,#intentForm select")
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
    qa(".field-validation-error").forEach((node) => node.remove());
    qa("#intentForm [aria-invalid='true']").forEach((field) => field.removeAttribute("aria-invalid"));
  }

  function showBlockedFeedback() {
    clearValidationMessages();
    const field = firstLikelyIncompleteField();
    const missing = q("#missingState");
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
    const button = q("#generatePrompt");
    const wrap = q("#generatePromptWrap");
    if (!button || !wrap) return;
    const blocked = button.disabled || button.getAttribute("aria-disabled") === "true";
    wrap.dataset.readiness = blocked ? "blocked" : "ready";
    wrap.setAttribute("aria-label", blocked
      ? tr("生成指令暂不可用：请先完成缺失信息", "Generate prompt unavailable: complete the missing information first")
      : tr("生成指令已可用", "Generate prompt is ready"));
    if (!blocked) clearValidationMessages();
  }

  function installGenerateFeedback() {
    const wrap = q("#generatePromptWrap");
    if (!wrap || wrap.dataset.feedbackReady === "1") return;
    wrap.dataset.feedbackReady = "1";
    wrap.tabIndex = 0;
    wrap.addEventListener("click", () => {
      if (q("#generatePrompt")?.disabled) showBlockedFeedback();
    });
    wrap.addEventListener("keydown", (event) => {
      if (!["Enter", " "].includes(event.key) || !q("#generatePrompt")?.disabled) return;
      event.preventDefault();
      showBlockedFeedback();
    });
  }

  function syncAssistant() {
    const toggle = q("#assistantToggle");
    const panel = q("#assistantPanel");
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", String(!panel.hidden));
    panel.setAttribute("role", "complementary");
    panel.setAttribute("aria-label", tr("任务助手", "Task assistant"));
  }

  function installLegacyIntentPreservationGuard() {
    const styleGrid = q("#styleDirectionGrid");
    const intentForm = q("#intentForm");
    if (!styleGrid || !intentForm || intentForm.dataset.preserveGuardReady === "1") return;
    intentForm.dataset.preserveGuardReady = "1";
    const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
    if (!descriptor?.get || !descriptor?.set) return;
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

  function installTargetedSync() {
    const generate = q("#generatePrompt");
    if (generate) new MutationObserver(syncGenerateReadiness).observe(generate, { attributes: true, attributeFilter: ["disabled", "aria-disabled"] });
    const assistant = q("#assistantPanel");
    if (assistant) new MutationObserver(syncAssistant).observe(assistant, { attributes: true, attributeFilter: ["hidden"] });
    q("#modeTabs")?.addEventListener("click", () => requestAnimationFrame(syncPrimaryTabs));
    window.addEventListener("popstate", () => requestAnimationFrame(() => { applyCopy(); syncPrimaryTabs(); }));
  }

  function init() {
    if (!document.body.classList.contains("launcher-simplified")) return;
    applyCopy();
    ensureSystemSummarySemantics();
    installStepNavigation();
    installPrimaryTabKeys();
    installGenerateFeedback();
    installLegacyIntentPreservationGuard();
    hardenDialog();
    syncPrimaryTabs();
    syncGenerateReadiness();
    syncAssistant();
    installTargetedSync();
    setCurrentStep("task");
    window.image2I18n?.registerPage?.(() => { applyCopy(); syncPrimaryTabs(); syncGenerateReadiness(); syncAssistant(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
