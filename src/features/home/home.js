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
    copy: { zh: "从移动端页面里只看层级、导航和商品信息的关系。", en: "Study only the hierarchy, navigation and product-information relationships." },
    mainPosition: "50% 18%",
    detailPosition: "50% 56%",
  },
  {
    src: "./assets/home/case-product-designer-20260831.png",
    route: "./skills.html?mode=WEB",
    eyebrow: "WEB DESIGN · PORTFOLIO",
    title: "Product Designer",
    copy: { zh: "看大标题、像素纹理和非对称留白怎么一起成立。", en: "See how oversized type, pixel texture and asymmetric space work together." },
    mainPosition: "50% 12%",
    detailPosition: "62% 48%",
  },
  {
    src: "./assets/skills/repositories/leonxlnx-taste-skill-detail.png",
    route: "./skills.html",
    eyebrow: "DESIGN SKILL · REPOSITORY",
    title: "Taste Skill",
    copy: { zh: "看已经整理好的设计能力、提示词和方法怎么被组织。", en: "See how reusable design capabilities, prompts and methods are organized." },
    mainPosition: "50% 10%",
    detailPosition: "50% 45%",
  },
  {
    src: "./assets/demo-preview.gif",
    route: "./launcher.html",
    eyebrow: "DESIGN TOOL · WORKFLOW",
    title: "Start Designing",
    copy: { zh: "看参考、字体、颜色和组件怎样被组合成可继续生成的 Design DNA。", en: "See how references, type, color and components become a Design DNA you can keep building from." },
    mainPosition: "50% 12%",
    detailPosition: "54% 58%",
  },
  {
    src: "./assets/vocabulary/generated-v2/content-display-sheet.png",
    route: "./vocabulary.html",
    eyebrow: "UI VOCABULARY · PATTERNS",
    title: "UI Vocabulary",
    copy: { zh: "不知道一个界面元素叫什么时，先把词找对，再让 AI 执行。", en: "Find the right UI term before asking AI to execute it." },
    mainPosition: "50% 14%",
    detailPosition: "52% 52%",
  },
];

const WORKFLOW_STEPS = [
  {
    title: "DEFINE",
    image: "./assets/home/figures/steve-jobs.png",
    color: "#6b43b7",
    lead: { zh: "确定目标 / 页面 / 参考", en: "Goal / Page / Reference" },
    copy: { zh: "先确定做什么、为谁做，以及参考什么。", en: "Clarify what you are building, who it is for, and what should guide it." },
  },
  {
    title: "CREATE",
    image: "./assets/home/figures/leonardo-da-vinci.png",
    color: "#d66b2c",
    lead: { zh: "布局 / 字体 / 颜色 / 组件", en: "Layout / Type / Color / Components" },
    copy: { zh: "把参考拆成真正能执行的视觉规则。", en: "Turn references into visual rules that can actually be executed." },
  },
  {
    title: "BUILD",
    image: "./assets/home/figures/bill-gates.png",
    color: "#2f68c9",
    lead: { zh: "Design DNA / AI Coding / Demo", en: "Design DNA / AI Coding / Demo" },
    copy: { zh: "把规则交给 AI Coding，做出真正能运行的 Demo。", en: "Hand the rules to AI Coding and build a runnable demo." },
  },
  {
    title: "ITERATE",
    image: "./assets/home/figures/thomas-edison.png",
    color: "#419259",
    lead: { zh: "对照 / 调整 / 验证", en: "Compare / Refine / Validate" },
    copy: { zh: "继续对照目标调整，直到它顺、像，而且真的能用。", en: "Keep refining against the goal until it feels right and actually works." },
  },
];

const DNA_NOTES = [
  { index: "01 · TYPE SYSTEM", title: "Typography", copy: { zh: "先建立字阶，页面才有稳定层级。", en: "Start with a type scale so the page has a stable hierarchy." } },
  { index: "02 · COLOR SYSTEM", title: "Color", copy: { zh: "再给主色、表面和状态色固定角色。", en: "Then give primary, surface and state colors fixed roles." } },
  { index: "03 · SPACING SYSTEM", title: "Spacing", copy: { zh: "把间距统一到同一套 scale，页面节奏才一致。", en: "Use one spacing scale so the page keeps a consistent rhythm." } },
  { index: "04 · COMPONENT SYSTEM", title: "Components", copy: { zh: "最后补齐组件状态，Design DNA 才真正可以复用。", en: "Complete component states so the Design DNA becomes truly reusable." } },
];

let activeDiscoveryIndex = 0;
let activeWorkflowIndex = 0;
let activeDnaIndex = 0;
let motionContext = null;
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
  const item = DISCOVERY_PREVIEWS[index];
  const preview = document.querySelector("[data-discovery-preview]");
  if (!item || !preview) return;

  const apply = () => {
    activeDiscoveryIndex = index;
    document.querySelectorAll("[data-discovery-index]").forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
    });

    const main = document.querySelector("[data-discovery-image]");
    const detail = document.querySelector("[data-discovery-detail-image]");
    if (main) {
      main.src = new URL(item.src, location.href).href;
      main.style.objectPosition = item.mainPosition;
    }
    if (detail) {
      detail.src = new URL(item.src, location.href).href;
      detail.style.objectPosition = item.detailPosition;
    }
    document.querySelector("[data-discovery-eyebrow]")?.replaceChildren(document.createTextNode(item.eyebrow));
    document.querySelector("[data-discovery-title]")?.replaceChildren(document.createTextNode(item.title));
    document.querySelector("[data-discovery-copy]")?.replaceChildren(document.createTextNode(item.copy[language]));
    const link = document.querySelector("[data-discovery-link]");
    if (link) {
      link.dataset.smartLangLink = item.route;
      link.href = localizedRoute(item.route, language);
    }
  };

  if (!animate || !window.gsap || REDUCED_MOTION.matches) {
    apply();
    return;
  }

  window.gsap.timeline()
    .to(preview, { autoAlpha: 0, y: 12, scale: .99, duration: .16, ease: "power2.in" })
    .add(apply)
    .fromTo(preview, { autoAlpha: 0, y: 20, scale: .985 }, { autoAlpha: 1, y: 0, scale: 1, duration: .48, ease: "power3.out", clearProps: "opacity,visibility,transform" });
}

function initDiscovery() {
  document.querySelectorAll("[data-discovery-index]").forEach((button) => {
    button.addEventListener("click", () => renderDiscovery(Number(button.dataset.discoveryIndex), { animate: true }));
  });
}

function renderWorkflow(index, { animate = true, language = currentLanguage() } = {}) {
  const item = WORKFLOW_STEPS[index];
  const stage = document.querySelector("[data-workflow-focus]");
  if (!item || !stage) return;

  const apply = () => {
    activeWorkflowIndex = index;
    document.querySelectorAll("[data-workflow-step]").forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === index);
    });
    stage.style.setProperty("--stage-bg", item.color);
    const image = document.querySelector("[data-workflow-image]");
    if (image) image.src = new URL(item.image, location.href).href;
    document.querySelector("[data-workflow-index]")?.replaceChildren(document.createTextNode(`0${index + 1} · ${item.title}`));
    document.querySelector("[data-workflow-title]")?.replaceChildren(document.createTextNode(item.title));
    document.querySelector("[data-workflow-ghost]")?.replaceChildren(document.createTextNode(item.title));
    document.querySelector("[data-workflow-lead]")?.replaceChildren(document.createTextNode(item.lead[language]));
    document.querySelector("[data-workflow-copy]")?.replaceChildren(document.createTextNode(item.copy[language]));
  };

  if (!animate || !window.gsap || REDUCED_MOTION.matches) {
    apply();
    return;
  }

  const image = stage.querySelector("[data-workflow-image]");
  const copy = stage.querySelector(".workflow-stage-copy");
  window.gsap.timeline()
    .to([image, copy], { autoAlpha: 0, y: 14, duration: .16, ease: "power2.in" })
    .add(apply)
    .fromTo(image, { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1.04, duration: .54, ease: "power3.out" })
    .fromTo(copy, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .42, ease: "power3.out" }, "-=.36");
}

function initWorkflow() {
  document.querySelectorAll("[data-workflow-step]").forEach((button) => {
    button.addEventListener("click", () => renderWorkflow(Number(button.dataset.workflowStep), { animate: true }));
  });
}

function renderDna(index, { animate = true, language = currentLanguage() } = {}) {
  const scene = document.querySelector(".dna-scene");
  const note = DNA_NOTES[index];
  if (!scene || !note) return;

  const apply = () => {
    activeDnaIndex = index;
    scene.dataset.dnaStep = String(index);
    document.querySelectorAll("[data-dna-rule]").forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === index);
      button.classList.toggle("is-built", buttonIndex < index);
    });
    document.querySelector("[data-dna-note-index]")?.replaceChildren(document.createTextNode(note.index));
    document.querySelector("[data-dna-note-title]")?.replaceChildren(document.createTextNode(note.title));
    document.querySelector("[data-dna-note-copy]")?.replaceChildren(document.createTextNode(note.copy[language]));
  };

  const noteNode = document.querySelector(".dna-note");
  const workspace = document.querySelector(".dna-workspace");
  if (!animate || !window.gsap || REDUCED_MOTION.matches || !noteNode || !workspace) {
    apply();
    return;
  }

  window.gsap.timeline()
    .to(noteNode, { autoAlpha: 0, y: 8, duration: .14, ease: "power2.in" })
    .add(apply)
    .fromTo(noteNode, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .34, ease: "power3.out" })
    .fromTo(workspace, { scale: .996 }, { scale: 1, duration: .28, ease: "power2.out" }, "<");
}

function initDna() {
  document.querySelectorAll("[data-dna-rule]").forEach((button) => {
    button.addEventListener("click", () => renderDna(Number(button.dataset.dnaRule), { animate: true }));
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
        const duration = 900 + index * 100;
        const tick = (now) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          node.textContent = `${Math.round(target * eased)}+`;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }, index * 80);
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
  motionContext?.revert?.();

  motionContext = gsap.context(() => {
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".home-hero-copy .home-kicker", { autoAlpha: 0, y: 16, duration: .35 })
      .from(".home-hero h1 span", { autoAlpha: 0, yPercent: 48, stagger: .08, duration: .68 }, "-=.08")
      .from(".home-hero-note", { autoAlpha: 0, y: 22, duration: .48 }, "-=.35")
      .from(".hero-art-strip", { autoAlpha: 0, x: 30, duration: .56 }, "-=.42");

    gsap.to(".hero-art-main img", { scale: 1.14, ease: "none", scrollTrigger: { trigger: ".home-hero", start: "top top", end: "bottom top", scrub: .8 } });
    gsap.to(".home-hero-copy", { yPercent: -6, autoAlpha: .22, ease: "none", scrollTrigger: { trigger: ".home-hero", start: "top top", end: "bottom 15%", scrub: .8 } });

    gsap.from(".case-intro > *", { autoAlpha: 0, y: 26, stagger: .07, duration: .5, scrollTrigger: { trigger: ".case-intro", start: "top 82%", once: true } });

    const viewport = document.querySelector("[data-case-viewport]");
    const track = document.querySelector("[data-case-track]");
    if (viewport && track && window.innerWidth > 760) {
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth + 48);
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: ".case-story",
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 1.25, distance() * .9)}`,
          pin: true,
          scrub: .8,
          invalidateOnRefresh: true,
        },
      });
    }

    gsap.from(".proof-grid > *", { autoAlpha: 0, y: 18, stagger: .06, duration: .45, scrollTrigger: { trigger: ".proof-strip", start: "top 88%", once: true } });
    gsap.from(".explore-head > *", { autoAlpha: 0, y: 22, stagger: .06, duration: .48, scrollTrigger: { trigger: ".explore-head", start: "top 84%", once: true } });
    gsap.from(".explore-index button", { autoAlpha: 0, x: -16, stagger: .04, duration: .34, scrollTrigger: { trigger: ".explore-index", start: "top 86%", once: true } });
    gsap.from(".explore-composition", { autoAlpha: 0, y: 30, duration: .6, scrollTrigger: { trigger: ".explore-composition", start: "top 84%", once: true } });

    gsap.from(".workflow-head > *", { autoAlpha: 0, y: 22, stagger: .06, duration: .48, scrollTrigger: { trigger: ".workflow-head", start: "top 84%", once: true } });
    gsap.from(".workflow-stage", { autoAlpha: 0, x: -24, duration: .58, scrollTrigger: { trigger: ".workflow-layout", start: "top 84%", once: true } });
    gsap.from(".workflow-index > *", { autoAlpha: 0, x: 18, stagger: .045, duration: .4, scrollTrigger: { trigger: ".workflow-layout", start: "top 84%", once: true } });

    gsap.from(".dna-head > *", { autoAlpha: 0, y: 22, stagger: .06, duration: .48, scrollTrigger: { trigger: ".dna-head", start: "top 84%", once: true } });
    gsap.from(".dna-index, .dna-workspace, .dna-note", { autoAlpha: 0, y: 24, stagger: .08, duration: .54, scrollTrigger: { trigger: ".dna-layout", start: "top 84%", once: true } });

    gsap.from(".final-cta-grid > *", { autoAlpha: 0, y: 24, stagger: .07, duration: .5, scrollTrigger: { trigger: ".final-cta", start: "top 82%", once: true } });
  });

  window.setTimeout(() => ScrollTrigger.refresh(), 100);
}

function destroyHomeMotion() {
  motionContext?.revert?.();
  motionContext = null;
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
  }, 220);
});
