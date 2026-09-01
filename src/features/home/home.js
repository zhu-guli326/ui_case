const SUPPORTED_LANGUAGES = new Set(["zh", "en"]);
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)");
const GSAP_VERSION = "3.15.0";
const GSAP_URL = `https://cdn.jsdelivr.net/npm/gsap@${GSAP_VERSION}/dist/gsap.min.js`;
const SCROLL_TRIGGER_URL = `https://cdn.jsdelivr.net/npm/gsap@${GSAP_VERSION}/dist/ScrollTrigger.min.js`;

const DISCOVERY_PREVIEWS = [
  {
    src: "./assets/cases/fashion-shopping-app/hero-screen.png",
    route: "./library.html",
    eyebrow: "APP DESIGN · MOBILE",
    title: "Fashion Shopping App",
    alt: { zh: "Fashion Shopping App 局部裁切", en: "Cropped Fashion Shopping App interface" },
    copy: { zh: "只看导航、商品层级和留白，不把整张竖屏截图塞进来。", en: "Focus on navigation, product hierarchy and spacing instead of showing the full tall screenshot." },
    mainPosition: "50% 16%",
    detailPosition: "50% 42%",
    mainScale: 1.34,
    detailScale: 2.5,
  },
  {
    src: "./assets/home/case-product-designer-20260831.png",
    route: "./skills.html?mode=WEB",
    eyebrow: "WEB DESIGN · PORTFOLIO",
    title: "Product Designer",
    alt: { zh: "Product Designer 官网局部裁切", en: "Cropped Product Designer website" },
    copy: { zh: "放大标题、像素图形和留白比例，只保留最有识别度的部分。", en: "Zoom into the title, pixel graphics and spacing proportions that define the visual language." },
    mainPosition: "50% 10%",
    detailPosition: "62% 52%",
    mainScale: 1.12,
    detailScale: 1.8,
  },
  {
    src: "./assets/skills/repositories/leonxlnx-taste-skill-detail.png",
    route: "./skills.html",
    eyebrow: "DESIGN SKILL · REPOSITORY",
    title: "Taste Skill",
    alt: { zh: "Taste Skill 页面局部裁切", en: "Cropped Taste Skill interface" },
    copy: { zh: "直接看结构、提示词和可复用方法，不把详情页当成整张海报展示。", en: "Read structure, prompts and reusable methods without treating the entire detail page as a poster." },
    mainPosition: "50% 12%",
    detailPosition: "50% 54%",
    mainScale: 1.18,
    detailScale: 1.9,
  },
  {
    src: "./assets/demo-preview.gif",
    route: "./launcher.html",
    eyebrow: "DESIGN TOOL · WORKFLOW",
    title: "Start Designing",
    alt: { zh: "Start Designing 工作流局部裁切", en: "Cropped Start Designing workflow" },
    copy: { zh: "把参考、字体、颜色和组件组合成可以继续生成的 Design DNA。", en: "Combine references, type, color and components into a Design DNA you can keep building from." },
    mainPosition: "50% 20%",
    detailPosition: "50% 60%",
    mainScale: 1.16,
    detailScale: 1.7,
  },
  {
    src: "./assets/vocabulary/generated-v2/content-display-sheet.png",
    route: "./vocabulary.html",
    eyebrow: "UI VOCABULARY · PATTERNS",
    title: "UI Vocabulary",
    alt: { zh: "UI Vocabulary 局部裁切", en: "Cropped UI Vocabulary interface" },
    copy: { zh: "不知道一个界面元素叫什么时，先把词找对，再让 AI 执行。", en: "When you do not know an interface term, identify it first and then ask AI to execute it." },
    mainPosition: "50% 18%",
    detailPosition: "50% 54%",
    mainScale: 1.2,
    detailScale: 1.9,
  },
];

const WORKFLOW_STEPS = [
  {
    image: "./assets/home/figures/steve-jobs.png",
    color: "#6540b7",
    label: "01 · DEFINE",
    title: "DEFINE",
    lead: { zh: "确定目标 / 页面 / 参考", en: "Goal / Page / Reference" },
    copy: { zh: "先确定做什么、为谁做，以及参考什么。", en: "Clarify what you are building, who it is for, and what should guide it." },
  },
  {
    image: "./assets/home/figures/leonardo-da-vinci.png",
    color: "#c6672c",
    label: "02 · CREATE",
    title: "CREATE",
    lead: { zh: "布局 / 字体 / 颜色 / 组件", en: "Layout / Type / Color / Components" },
    copy: { zh: "把喜欢的感觉拆成真正可以执行的视觉规则。", en: "Turn the feeling you like into visual rules that can actually be executed." },
  },
  {
    image: "./assets/home/figures/bill-gates.png",
    color: "#2867a8",
    label: "03 · BUILD",
    title: "BUILD",
    lead: { zh: "Design DNA / AI Coding / Demo", en: "Design DNA / AI Coding / Demo" },
    copy: { zh: "把规则交给 AI Coding，生成真正能运行的 Demo。", en: "Hand the rules to AI Coding and build a demo that actually runs." },
  },
  {
    image: "./assets/home/figures/thomas-edison.png",
    color: "#497d35",
    label: "04 · ITERATE",
    title: "ITERATE",
    lead: { zh: "对照 / 调整 / 验证", en: "Compare / Refine / Validate" },
    copy: { zh: "继续对照目标调整，直到它像、顺，而且真的能用。", en: "Keep refining against the goal until it feels right, reads clearly and works." },
  },
];

const DNA_STEPS = [
  {
    kicker: "01 · TYPE SCALE",
    title: "Typography",
    copy: { zh: "64 / 40 / 16 / 12，把层级先固定下来。", en: "64 / 40 / 16 / 12. Lock the hierarchy first." },
  },
  {
    kicker: "02 · COLOR ROLES",
    title: "Color",
    copy: { zh: "主色、表面和状态色开始有明确职责。", en: "Primary, surface and status colors now have explicit roles." },
  },
  {
    kicker: "03 · SPACING SCALE",
    title: "Spacing",
    copy: { zh: "4 / 8 / 16 / 24，把零散间距收进同一套 scale。", en: "4 / 8 / 16 / 24. Bring scattered gaps into one spacing scale." },
  },
  {
    kicker: "04 · COMPONENT STATES",
    title: "Components",
    copy: { zh: "补齐按钮、输入框、开关和状态，一个完整系统才成立。", en: "Finish buttons, fields, toggles and states so the system can actually scale." },
  },
];

let activeDiscoveryIndex = 0;
let activeWorkflowIndex = 0;
let activeDnaIndex = 0;
let homeMotionContext = null;
let resizeTimer = 0;

function currentLanguage(event) {
  const detail = event?.detail;
  const eventLanguage = typeof detail === "string" ? detail : detail?.language || detail?.lang || detail?.value;
  if (SUPPORTED_LANGUAGES.has(eventLanguage)) return eventLanguage;
  if (SUPPORTED_LANGUAGES.has(window.image2I18n?.language)) return window.image2I18n.language;
  const queryLanguage = new URLSearchParams(location.search).get("lang");
  return SUPPORTED_LANGUAGES.has(queryLanguage) ? queryLanguage : "zh";
}

function localizedRoute(route, language = currentLanguage()) {
  const target = new URL(route, location.href);
  target.searchParams.set("lang", language);
  return `${target.pathname.split("/").pop()}${target.search}${target.hash}`;
}

function applyLanguage(event) {
  const language = currentLanguage(event);
  document.documentElement.lang = language === "en" ? "en" : "zh-CN";
  document.title = language === "en" ? "ONDesign · Design DNA for AI Coding" : "ONDesign · 让 AI Coding 理解你的 Design DNA";

  document.querySelectorAll("[data-zh][data-en]").forEach((element) => {
    const value = element.dataset[language];
    if (value) element.textContent = value;
  });

  document.querySelectorAll("[data-smart-lang-link]").forEach((link) => {
    link.href = localizedRoute(link.dataset.smartLangLink, language);
  });

  renderDiscovery(activeDiscoveryIndex, { animate: false, language });
  renderWorkflow(activeWorkflowIndex, { animate: false, language });
  renderDna(activeDnaIndex, { animate: false, language });
}

function renderDiscovery(index, { animate = true, language = currentLanguage() } = {}) {
  const tabs = [...document.querySelectorAll("[data-discovery-index]")];
  const preview = document.querySelector("[data-discovery-preview]");
  const image = document.querySelector("[data-discovery-image]");
  const detailImage = document.querySelector("[data-discovery-detail-image]");
  const eyebrow = document.querySelector("[data-discovery-eyebrow]");
  const title = document.querySelector("[data-discovery-title]");
  const copy = document.querySelector("[data-discovery-copy]");
  const link = document.querySelector("[data-discovery-link]");
  const item = DISCOVERY_PREVIEWS[index];
  if (!item || !preview) return;

  const apply = () => {
    activeDiscoveryIndex = index;
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === index;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    [image, detailImage].forEach((node) => {
      if (!node) return;
      node.src = new URL(item.src, location.href).href;
      node.alt = item.alt[language];
    });
    if (image) {
      image.style.objectPosition = item.mainPosition;
      image.style.transform = `scale(${item.mainScale})`;
    }
    if (detailImage) {
      detailImage.style.objectPosition = item.detailPosition;
      detailImage.style.transform = `scale(${item.detailScale})`;
    }
    if (eyebrow) eyebrow.textContent = item.eyebrow;
    if (title) title.textContent = item.title;
    if (copy) copy.textContent = item.copy[language];
    if (link) {
      link.dataset.smartLangLink = item.route;
      link.href = localizedRoute(item.route, language);
    }
  };

  if (!animate || !window.gsap || REDUCED_MOTION.matches || index === activeDiscoveryIndex) {
    apply();
    return;
  }

  window.gsap.timeline()
    .to(preview, { autoAlpha: 0, y: 14, scale: .992, duration: .16, ease: "power2.in" })
    .add(apply)
    .fromTo(preview, { autoAlpha: 0, y: 24, scale: .985 }, { autoAlpha: 1, y: 0, scale: 1, duration: .5, ease: "power3.out", clearProps: "opacity,visibility,transform" });
}

function initDiscovery() {
  const tabs = [...document.querySelectorAll("[data-discovery-index]")];
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => renderDiscovery(Number(tab.dataset.discoveryIndex), { animate: true }));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const current = Number(tab.dataset.discoveryIndex);
      const direction = event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1;
      const next = (current + direction + tabs.length) % tabs.length;
      tabs[next].focus();
      renderDiscovery(next, { animate: true });
    });
  });
}

function renderWorkflow(index, { animate = true, language = currentLanguage() } = {}) {
  const step = WORKFLOW_STEPS[index];
  const focus = document.querySelector("[data-workflow-focus]");
  const image = document.querySelector("[data-workflow-image]");
  const label = document.querySelector("[data-workflow-index]");
  const title = document.querySelector("[data-workflow-title]");
  const lead = document.querySelector("[data-workflow-lead]");
  const copy = document.querySelector("[data-workflow-copy]");
  const ghost = document.querySelector("[data-workflow-ghost]");
  const buttons = [...document.querySelectorAll("[data-workflow-step]")];
  if (!step || !focus) return;

  const apply = () => {
    activeWorkflowIndex = index;
    buttons.forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === index);
      button.classList.toggle("is-built", buttonIndex < index);
      button.setAttribute("aria-selected", String(buttonIndex === index));
    });
    focus.style.setProperty("--stage-bg", step.color);
    if (image) image.src = new URL(step.image, location.href).href;
    if (label) label.textContent = step.label;
    if (title) title.textContent = step.title;
    if (lead) lead.textContent = step.lead[language];
    if (copy) copy.textContent = step.copy[language];
    if (ghost) ghost.textContent = step.title;
  };

  if (!animate || !window.gsap || REDUCED_MOTION.matches || index === activeWorkflowIndex) {
    apply();
    return;
  }

  const elements = [image, label, title, lead, copy, ghost].filter(Boolean);
  window.gsap.timeline()
    .to(elements, { autoAlpha: 0, y: 14, duration: .16, stagger: .015, ease: "power2.in" })
    .add(apply)
    .fromTo(elements, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: .46, stagger: .025, ease: "power3.out", clearProps: "opacity,visibility,transform" });
}

function initWorkflow() {
  const buttons = [...document.querySelectorAll("[data-workflow-step]")];
  buttons.forEach((button) => {
    button.setAttribute("role", "tab");
    button.addEventListener("click", () => renderWorkflow(Number(button.dataset.workflowStep), { animate: true }));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const current = Number(button.dataset.workflowStep);
      const direction = event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1;
      const next = (current + direction + buttons.length) % buttons.length;
      buttons[next].focus();
      renderWorkflow(next, { animate: true });
    });
  });
}

function renderDna(index, { animate = true, language = currentLanguage() } = {}) {
  const step = DNA_STEPS[index];
  const scene = document.querySelector(".dna-scene");
  const browser = document.querySelector(".dna-browser");
  const note = document.querySelector("[data-dna-note]");
  const kicker = document.querySelector("[data-dna-note-kicker]");
  const title = document.querySelector("[data-dna-note-title]");
  const copy = document.querySelector("[data-dna-note-copy]");
  const buttons = [...document.querySelectorAll("[data-dna-rule]")];
  if (!step || !scene) return;

  const apply = () => {
    activeDnaIndex = index;
    scene.dataset.dnaStep = String(index);
    buttons.forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === index);
      button.classList.toggle("is-built", buttonIndex < index);
      button.setAttribute("aria-selected", String(buttonIndex === index));
    });
    if (kicker) kicker.textContent = step.kicker;
    if (title) title.textContent = step.title;
    if (copy) copy.textContent = step.copy[language];
  };

  if (!animate || !window.gsap || REDUCED_MOTION.matches || index === activeDnaIndex) {
    apply();
    return;
  }

  window.gsap.timeline()
    .to([browser, note].filter(Boolean), { autoAlpha: .62, y: 6, duration: .15, ease: "power2.in" })
    .add(apply)
    .fromTo([browser, note].filter(Boolean), { autoAlpha: .72, y: 12 }, { autoAlpha: 1, y: 0, duration: .42, ease: "power3.out", clearProps: "opacity,visibility,transform" });
}

function initDna() {
  const buttons = [...document.querySelectorAll("[data-dna-rule]")];
  buttons.forEach((button) => {
    button.setAttribute("role", "tab");
    button.addEventListener("click", () => renderDna(Number(button.dataset.dnaRule), { animate: true }));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const current = Number(button.dataset.dnaRule);
      const direction = event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1;
      const next = (current + direction + buttons.length) % buttons.length;
      buttons[next].focus();
      renderDna(next, { animate: true });
    });
  });
}

function initStatsCounter() {
  const section = document.querySelector("#overview");
  const nodes = [...document.querySelectorAll("[data-count]")];
  if (!section || !nodes.length || REDUCED_MOTION.matches || !("IntersectionObserver" in window)) return;
  nodes.forEach((node) => { node.textContent = "0+"; });
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    nodes.forEach((node, index) => {
      const target = Number(node.dataset.count) || 0;
      window.setTimeout(() => {
        const start = performance.now();
        const duration = 900 + index * 90;
        const tick = (now) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          node.textContent = `${Math.round(target * eased)}+`;
          if (progress < 1) requestAnimationFrame(tick);
          else node.textContent = `${target}+`;
        };
        requestAnimationFrame(tick);
      }, index * 70);
    });
  }, { threshold: .35 });
  observer.observe(section);
}

function loadScript(src, test) {
  if (test()) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = [...document.scripts].find((script) => script.src === src);
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.addEventListener("load", resolve, { once: true });
    script.addEventListener("error", reject, { once: true });
    document.head.append(script);
  });
}

async function ensureGsap() {
  if (REDUCED_MOTION.matches) return false;
  try {
    await loadScript(GSAP_URL, () => Boolean(window.gsap));
    await loadScript(SCROLL_TRIGGER_URL, () => Boolean(window.ScrollTrigger));
    if (!window.gsap || !window.ScrollTrigger) return false;
    window.gsap.registerPlugin(window.ScrollTrigger);
    return true;
  } catch (error) {
    console.warn("GSAP enhancement unavailable; using static Home experience.", error);
    return false;
  }
}

function initHomeMotion() {
  if (!window.gsap || !window.ScrollTrigger || REDUCED_MOTION.matches) return;
  const { gsap, ScrollTrigger } = window;
  homeMotionContext?.revert?.();

  homeMotionContext = gsap.context(() => {
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".home-hero-title .home-kicker", { autoAlpha: 0, y: 14, duration: .35 })
      .from(".home-hero h1 span:first-child", { autoAlpha: 0, yPercent: 72, duration: .72 }, "-=.12")
      .from(".home-hero h1 span:last-child", { autoAlpha: 0, yPercent: 72, duration: .78 }, "-=.5")
      .from(".home-hero-aside", { autoAlpha: 0, y: 22, duration: .5 }, "-=.35")
      .from(".home-scroll-cue", { autoAlpha: 0, x: 10, duration: .32 }, "-=.18");

    const hero = document.querySelector(".home-hero");
    const heroImage = document.querySelector(".home-hero-image");
    if (hero && heroImage) {
      gsap.to(heroImage, { scale: 1.13, yPercent: 3, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: .8 } });
    }

    gsap.from(".case-story-heading > *", { autoAlpha: 0, y: 28, stagger: .08, duration: .56, ease: "power3.out", scrollTrigger: { trigger: ".case-story-heading", start: "top 82%", once: true } });

    const caseViewport = document.querySelector("[data-case-viewport]");
    const caseTrack = document.querySelector("[data-case-track]");
    if (caseViewport && caseTrack && window.innerWidth > 760) {
      const horizontalDistance = () => Math.max(0, caseTrack.scrollWidth - caseViewport.clientWidth + Math.max(40, window.innerWidth * .035));
      gsap.to(caseTrack, {
        x: () => -horizontalDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: ".case-story",
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 1.25, horizontalDistance() * .95)}`,
          pin: true,
          scrub: .82,
          invalidateOnRefresh: true,
        },
      });
      gsap.utils.toArray(".case-panel").forEach((panel) => {
        const main = panel.querySelector(".case-crop-main img");
        const detail = panel.querySelector(".case-crop-detail img");
        if (main) gsap.to(main, { xPercent: -4, ease: "none", scrollTrigger: { trigger: panel, start: "left right", end: "right left", scrub: true } });
        if (detail) gsap.to(detail, { xPercent: 6, ease: "none", scrollTrigger: { trigger: panel, start: "left right", end: "right left", scrub: true } });
      });
    }

    gsap.from(".proof-grid > *", { autoAlpha: 0, y: 18, stagger: .06, duration: .45, ease: "power3.out", scrollTrigger: { trigger: "#overview", start: "top 86%", once: true } });
    gsap.from(".explore-copy > *", { autoAlpha: 0, y: 22, stagger: .055, duration: .48, ease: "power3.out", scrollTrigger: { trigger: ".explore-scene", start: "top 82%", once: true } });
    gsap.from(".explore-canvas", { autoAlpha: 0, y: 34, scale: .985, duration: .64, ease: "power3.out", scrollTrigger: { trigger: ".explore-canvas", start: "top 84%", once: true } });

    gsap.from(".workflow-heading > *", { autoAlpha: 0, y: 26, stagger: .07, duration: .52, ease: "power3.out", scrollTrigger: { trigger: ".workflow-heading", start: "top 84%", once: true } });
    gsap.from(".workflow-rail button", { autoAlpha: 0, x: -16, stagger: .045, duration: .4, ease: "power3.out", scrollTrigger: { trigger: ".workflow-stage", start: "top 82%", once: true } });
    gsap.from(".workflow-focus", { autoAlpha: 0, y: 26, duration: .6, ease: "power3.out", scrollTrigger: { trigger: ".workflow-stage", start: "top 82%", once: true } });

    gsap.from(".dna-heading > *", { autoAlpha: 0, y: 26, stagger: .06, duration: .5, ease: "power3.out", scrollTrigger: { trigger: ".dna-heading", start: "top 84%", once: true } });
    gsap.from(".dna-rules", { autoAlpha: 0, x: -18, duration: .5, ease: "power3.out", scrollTrigger: { trigger: ".dna-stage", start: "top 84%", once: true } });
    gsap.from(".dna-product", { autoAlpha: 0, y: 30, duration: .62, ease: "power3.out", scrollTrigger: { trigger: ".dna-stage", start: "top 84%", once: true } });

    gsap.from(".final-cta-inner > *", { autoAlpha: 0, y: 30, stagger: .07, duration: .56, ease: "power3.out", scrollTrigger: { trigger: ".final-cta", start: "top 82%", once: true } });
    gsap.from(".footer-grid > *, .footer-bottom > *", { autoAlpha: 0, y: 16, stagger: .035, duration: .4, ease: "power3.out", scrollTrigger: { trigger: ".project-footer", start: "top 92%", once: true } });
  });

  window.setTimeout(() => ScrollTrigger.refresh(), 100);
}

function destroyHomeMotion() {
  homeMotionContext?.revert?.();
  homeMotionContext = null;
  window.ScrollTrigger?.getAll?.().forEach((trigger) => trigger.kill());
}

function handleMotionPreference() {
  if (REDUCED_MOTION.matches) {
    destroyHomeMotion();
    return;
  }
  ensureGsap().then((ready) => { if (ready) initHomeMotion(); });
}

initDiscovery();
initWorkflow();
initDna();
initStatsCounter();
renderDiscovery(0, { animate: false });
renderWorkflow(0, { animate: false });
renderDna(0, { animate: false });
applyLanguage();

if (window.image2I18n?.registerPage) window.image2I18n.registerPage((language) => applyLanguage({ detail: language }));
else window.addEventListener("image2:languagechange", applyLanguage);

handleMotionPreference();
REDUCED_MOTION.addEventListener?.("change", handleMotionPreference);

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    if (!REDUCED_MOTION.matches && window.gsap && window.ScrollTrigger) {
      destroyHomeMotion();
      initHomeMotion();
    }
  }, 240);
});
