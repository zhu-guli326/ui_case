const COPY = {
  "steps.task.eyebrow": ["01 · 定义", "01 · Define"],
  "steps.task.title": ["定义任务", "Define task"],
  "steps.task.detail": ["模式与需求", "Mode & requirements"],
  "steps.design.eyebrow": ["02 · 约束", "02 · Shape"],
  "steps.design.title": ["设计约束", "Design constraints"],
  "steps.design.detail": ["风格、平台、系统", "Style, platform, system"],
  "steps.output.eyebrow": ["03 · 输出", "03 · Output"],
  "steps.output.title": ["检查并输出", "Review & output"],
  "steps.output.detail": ["摘要与指令", "Summary & prompt"],
  "stage.task.title": ["定义任务", "Define the task"],
  "stage.task.intro": ["先确定你要完成的工作，再补齐真实需求。这里决定“做什么”，后面的设计选择只负责“怎么做”。", "Choose the job first, then make the real requirements explicit. This stage defines what to build; later choices define how."],
  "stage.design.title": ["设置设计约束", "Set design constraints"],
  "stage.design.intro": ["在需求明确后，再决定视觉方向、目标平台和组件系统，避免设计语言反过来绑架产品需求。", "After the requirements are clear, choose visual direction, target platform, and component system without letting style override the product need."],
  "mode.title": ["选择任务模式", "Choose a task mode"],
  "mode.intro": ["不同模式只改变需要填写的任务信息，不改变后续的设计与输出路径。", "The mode changes the required task inputs, not the design and output flow."],
  "mode.create.title": ["从零创建", "Create"],
  "mode.create.detail": ["描述产品、用户和页面", "Define product, users, and pages"],
  "mode.rebuild.title": ["参考图还原", "Rebuild"],
  "mode.rebuild.detail": ["还原页面、状态与交互", "Recreate pages, states, and interactions"],
  "mode.improve.title": ["优化现有页面", "Improve"],
  "mode.improve.detail": ["诊断问题并实施优化", "Diagnose and implement improvements"],
  "mode.explore.title": ["探索现有项目", "Explore"],
  "mode.explore.detail": ["理解结构、风险和缺口", "Understand structure, risks, and gaps"],
  "mode.system.title": ["比较设计系统", "Compare systems"],
  "mode.system.detail": ["同一目标下公平比较", "Compare on the same target"],
  "requirements.title": ["填写任务信息", "Describe the task"],
  "requirements.intro": ["只填写这个模式真正需要的信息；缺失项会在右侧实时提示。", "Only provide what this mode actually needs; missing items appear in the output panel immediately."],
  "style.title": ["视觉方向", "Visual direction"],
  "style.intro": ["决定构图、密度和视觉气质，不替代产品目标。", "Choose composition, density, and visual character without replacing product goals."],
  "platform.title": ["目标平台", "Target platform"],
  "platform.intro": ["平台会影响导航、控件尺寸、安全区、字体和交互惯例。", "Platform affects navigation, target sizes, safe areas, typography, and interaction conventions."],
  "system.title": ["Design System", "Design system"],
  "system.intro": ["选择组件与 Token 的来源，再用同一预览检查差异。", "Choose the source of components and tokens, then compare through the same preview."],
  "system.explorer": ["探索设计系统 ↗", "Explore design systems ↗"],
  "platform.ios.detail": ["iPhone · 原生移动端", "iPhone · native mobile"],
  "platform.android.detail": ["Phone · Material 生态", "Phone · Material ecosystem"],
  "platform.windows.detail": ["Desktop · Fluent 桌面端", "Desktop · Fluent"],
  "platform.macos.detail": ["Mac · Apple 桌面端", "Mac · Apple desktop"],
  "workbench.foundation": ["Foundation", "Foundation"],
  "workbench.components": ["Components", "Components"],
  "workbench.preview": ["Page Preview", "Page Preview"],
  "workbench.rule": ["组件调用规则：", "Component rule:"],
  "workbench.rule.detail": ["生成页面时优先调用当前 Design System 的现成组件与交互模式；只有 Registry 中不存在目标组件时，才允许自定义绘制。", "Prefer components and interaction patterns from the selected design system. Draw custom components only when the registry has no suitable option."],
  "output.kicker": ["当前任务", "Current task"],
  "output.title": ["检查并输出", "Review & output"],
  "output.prompt": ["实时调用指令", "Live execution prompt"],
  "output.sync": ["随表单实时更新", "Updates live with the form"],
  "output.apply": ["应用最新生成", "Apply latest generated"],
  "output.notice": ["表单内容已更新；你的手动修改仍保留。", "The form changed; your manual edits are still preserved."],
  "output.generate": ["生成指令", "Generate prompt"],
  "output.copy": ["复制指令", "Copy prompt"],
  "case.eyebrow": ["参考案例", "Reference cases"],
  "case.title": ["从案例库选择", "Choose from the case library"],
  "case.search": ["搜索案例", "Search cases"],
  "case.placeholder": ["名称、风格或标签", "Name, style, or tag"],
  "case.empty": ["没有符合当前条件的案例。", "No cases match the current filters."],
  "assistant.trigger": ["任务助手", "Task assistant"],
  "assistant.eyebrow": ["工作区助手", "Workspace assistant"],
  "assistant.title": ["下一步建议", "Next suggestion"],
};

const HERO_COPY = {
  create: {
    zh: ["从零创建界面", "先定义产品、用户与核心任务，再设置视觉、平台和组件约束。"],
    en: ["Create an interface", "Define the product, users, and core task first, then set visual, platform, and component constraints."],
  },
  rebuild: {
    zh: ["参考图还原", "选择案例或上传参考图，明确要还原的页面、状态与交互，再决定实现约束。"],
    en: ["Rebuild from a reference", "Choose a case or upload a reference, define the pages, states, and interactions to recreate, then set implementation constraints."],
  },
  improve: {
    zh: ["优化现有页面", "明确检查对象、优化目标与操作权限，再输出有边界的实施指令。"],
    en: ["Improve an existing page", "Define the target, improvement goal, and permission boundary before producing an implementation prompt."],
  },
  explore: {
    zh: ["探索现有项目", "先确定项目范围与检查重点，再生成只读或有限权限的探索指令。"],
    en: ["Explore an existing project", "Define project scope and inspection focus before generating a bounded exploration prompt."],
  },
  "design-system": {
    zh: ["比较设计系统", "用同一页面目标与关键操作公平比较多套系统的组件、Token、交互与迁移成本。"],
    en: ["Compare design systems", "Use one shared page goal and key actions to compare components, tokens, interactions, and migration cost fairly."],
  },
};

const locale = () => {
  const query = new URL(location.href).searchParams.get("lang");
  if (query === "en" || query === "zh") return query;
  return window.image2I18n?.language === "en" ? "en" : "zh";
};

function text(key) {
  const item = COPY[key];
  if (!item) return "";
  return item[locale() === "en" ? 1 : 0];
}

function localized(zh, en) {
  return locale() === "en" ? en : zh;
}

function setAttr(selector, name, zh, en) {
  const node = document.querySelector(selector);
  if (node) node.setAttribute(name, localized(zh, en));
}

function currentIntent() {
  const fromUrl = new URL(location.href).searchParams.get("intent");
  if (HERO_COPY[fromUrl]) return fromUrl;
  return document.querySelector("#modeTabs [aria-selected='true']")?.dataset.intent || "create";
}

function syncIntentHero() {
  const copy = HERO_COPY[currentIntent()] || HERO_COPY.create;
  const localizedCopy = copy[locale()];
  const title = document.querySelector("#pageTitle");
  const intro = document.querySelector("#pageIntro");
  if (title) title.textContent = localizedCopy[0];
  if (intro) intro.textContent = localizedCopy[1];
}

function applyStaticCopy() {
  document.querySelectorAll("[data-launcher-copy]").forEach((node) => {
    const value = text(node.dataset.launcherCopy);
    if (value) node.textContent = value;
  });
  document.querySelectorAll("[data-launcher-placeholder]").forEach((node) => {
    const value = text(node.dataset.launcherPlaceholder);
    if (value) node.setAttribute("placeholder", value);
  });

  document.documentElement.lang = locale() === "en" ? "en" : "zh-CN";
  setAttr("#modeTabs", "aria-label", "任务模式", "Task mode");
  setAttr("#platformGrid", "aria-label", "目标平台", "Target platform");
  setAttr("#styleDirectionGrid", "aria-label", "风格方向", "Visual direction");
  setAttr("#colorThemeGrid", "aria-label", "品牌设计规范", "Brand design system");
  setAttr(".launcher-step-nav", "aria-label", "任务流程", "Task workflow");
  setAttr(".ds-tabs", "aria-label", "Design System 详情", "Design system details");
  setAttr(".preview-controls", "aria-label", "预览设备", "Preview device");
  setAttr("#summaryProgress", "aria-label", "任务进度", "Task progress");
  setAttr("#promptOutput", "aria-label", "可编辑的完整调用指令", "Editable full execution prompt");
  setAttr("#caseStyleFilters", "aria-label", "按风格筛选", "Filter by style");
  setAttr("#caseCategoryFilters", "aria-label", "按类型筛选", "Filter by type");
  setAttr("#closeCasePicker", "aria-label", "关闭案例选择器", "Close case picker");
  setAttr("#closeCasePicker", "title", "关闭", "Close");
  setAttr("#assistantClose", "aria-label", "关闭任务助手", "Close task assistant");
  setAttr("#assistantClose", "title", "关闭", "Close");
  const caseHelp = document.querySelector("#casePickerHelp");
  if (caseHelp) caseHelp.textContent = localized("搜索、筛选并选择一个参考案例。按 Escape 可关闭。", "Search, filter, and choose a reference case. Press Escape to close.");

  const platformName = document.querySelector("#previewPlatformName");
  const previewMeta = platformName?.parentElement;
  if (platformName && previewMeta) {
    Array.from(previewMeta.childNodes).forEach((node) => {
      if (node !== platformName) node.remove();
    });
    previewMeta.append(document.createTextNode(localized(
      " · 保持信息结构不变，只切换平台规范、字体、组件骨架、圆角、密度和品牌 Token。",
      " · Keep the information structure fixed while switching platform rules, typography, component anatomy, radius, density, and brand tokens.",
    )));
  }
  syncIntentHero();
}

function setCurrentStep(step) {
  document.querySelectorAll(".launcher-step-link").forEach((link) => {
    if (link.dataset.launcherStep === step) link.setAttribute("aria-current", "step");
    else link.removeAttribute("aria-current");
  });
}

function installStepNavigation() {
  const regions = {
    task: document.querySelector("#taskDefinition"),
    design: document.querySelector("#designDecisions"),
    output: document.querySelector("#outputPanel"),
  };

  document.querySelector(".launcher-step-nav")?.addEventListener("click", (event) => {
    const link = event.target.closest(".launcher-step-link[data-launcher-step]");
    if (link) setCurrentStep(link.dataset.launcherStep);
  });

  document.querySelector("#modeTabs")?.addEventListener("click", (event) => {
    if (!event.target.closest("[data-intent]")) return;
    requestAnimationFrame(syncIntentHero);
  });

  Object.entries(regions).forEach(([key, region]) => {
    region?.addEventListener("focusin", () => setCurrentStep(key));
  });

  document.querySelector("#generatePrompt")?.addEventListener("click", () => setCurrentStep("output"));
  document.querySelector("#copyPrompt")?.addEventListener("click", () => setCurrentStep("output"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      if (visible.target.id === "taskDefinition") setCurrentStep("task");
      if (visible.target.id === "designDecisions") setCurrentStep("design");
    }, { rootMargin: "-18% 0px -52% 0px", threshold: [0.1, 0.35, 0.6] });
    if (regions.task) observer.observe(regions.task);
    if (regions.design) observer.observe(regions.design);
  }
}

function init() {
  if (!document.body.classList.contains("launcher-workspace")) return;
  applyStaticCopy();
  installStepNavigation();
  setCurrentStep("task");
  window.addEventListener("image2:launcherplatformchange", applyStaticCopy);
  window.addEventListener("popstate", () => requestAnimationFrame(syncIntentHero));
  window.image2I18n?.registerPage?.(applyStaticCopy);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
else init();
