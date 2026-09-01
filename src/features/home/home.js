const SUPPORTED_LANGUAGES = new Set(["zh", "en"]);
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)");
const FINE_POINTER = window.matchMedia("(hover: hover) and (pointer: fine)");
const GSAP_VERSION = "3.15.0";
const GSAP_URL = `https://cdn.jsdelivr.net/npm/gsap@${GSAP_VERSION}/dist/gsap.min.js`;
const SCROLL_TRIGGER_URL = `https://cdn.jsdelivr.net/npm/gsap@${GSAP_VERSION}/dist/ScrollTrigger.min.js`;

const DISCOVERY_PREVIEWS = [
  {
    src: "./assets/cases/fashion-shopping-app/hero-screen.png",
    route: "./library.html",
    eyebrow: "APP DESIGN · MOBILE",
    title: "Fashion Shopping App",
    alt: { zh: "ONDesign 案例库中的 Fashion Shopping App 移动端界面", en: "Fashion Shopping App mobile UI from the ONDesign case library" },
    copy: { zh: "从真实移动端页面里找布局、层级和组件参考。", en: "Use a real mobile interface to study layout, hierarchy and components." },
    fit: "cover",
    position: "center top",
  },
  {
    src: "./assets/home/case-product-designer-20260831.png",
    route: "./skills.html?mode=WEB",
    eyebrow: "WEB DESIGN · PORTFOLIO",
    title: "Product Designer",
    alt: { zh: "ONDesign 收录的真实官网设计案例", en: "A real website design case featured in ONDesign" },
    copy: { zh: "从真实官网里观察大标题、图片比例、留白和视觉节奏。", en: "Study large type, image proportion, whitespace and visual rhythm from a real website." },
    fit: "cover",
    position: "center top",
  },
  {
    src: "./assets/skills/repositories/leonxlnx-taste-skill-detail.png",
    route: "./skills.html",
    eyebrow: "DESIGN SKILL · REPOSITORY",
    title: "Taste Skill",
    alt: { zh: "ONDesign 设计 Skill 库中的 Skill 详情预览", en: "A Design Skill detail preview from the ONDesign Skills library" },
    copy: { zh: "直接看已经整理好的设计能力、提示词和可复用方法。", en: "Browse reusable design capabilities, prompts and methods that are already packaged." },
    fit: "cover",
    position: "center top",
  },
  {
    src: "./assets/demo-preview.gif",
    route: "./launcher.html",
    eyebrow: "DESIGN TOOL · WORKFLOW",
    title: "Start Designing",
    alt: { zh: "ONDesign Start Designing 与 Design DNA 工作流预览", en: "ONDesign Start Designing and Design DNA workflow preview" },
    copy: { zh: "把参考、字体、颜色和组件组合成一套可以继续生成的 Design DNA。", en: "Combine references, type, color and components into a Design DNA you can keep building from." },
    fit: "cover",
    position: "center top",
  },
  {
    src: "./assets/vocabulary/generated-v2/content-display-sheet.png",
    route: "./vocabulary.html",
    eyebrow: "UI VOCABULARY · PATTERNS",
    title: "UI Vocabulary",
    alt: { zh: "ONDesign UI 词库中的组件与术语预览", en: "Component and terminology preview from ONDesign UI Vocabulary" },
    copy: { zh: "不知道一个界面元素叫什么时，先把词找对，再让 AI 执行。", en: "When you do not know what an interface element is called, find the right term before asking AI to execute it." },
    fit: "cover",
    position: "center top",
  },
];

let activeDiscoveryIndex = 0;
let homeMotionContext = null;
let workflowStep = 0;
let dnaStep = 0;
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
}

function renderDiscovery(index, { animate = true, language = currentLanguage() } = {}) {
  const tabs = [...document.querySelectorAll("[data-discovery-index]")];
  const preview = document.querySelector("[data-discovery-preview]");
  const image = document.querySelector("[data-discovery-image]");
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
    if (image) {
      image.src = new URL(item.src, location.href).href;
      image.alt = item.alt[language];
      image.style.objectFit = item.fit;
      image.style.objectPosition = item.position;
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
    .to(preview, { autoAlpha: 0, y: 10, scale: .985, filter: "blur(8px)", duration: .18, ease: "power2.in" })
    .add(apply)
    .fromTo(preview, { autoAlpha: 0, y: 18, scale: .975, filter: "blur(10px)" }, { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: .52, ease: "power3.out", clearProps: "opacity,visibility,transform,filter" });
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
  renderDiscovery(0, { animate: false });
}

function initStatsCounter() {
  const section = document.querySelector("#overview");
  const nodes = [...document.querySelectorAll("[data-count]")];
  if (!section || !nodes.length) return;
  if (REDUCED_MOTION.matches || !("IntersectionObserver" in window)) return;

  nodes.forEach((node) => { node.textContent = "0+"; });
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    nodes.forEach((node, index) => {
      const target = Number(node.dataset.count) || 0;
      const delay = index * 90;
      window.setTimeout(() => {
        const start = performance.now();
        const duration = 1050 + index * 80;
        const tick = (now) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          node.textContent = `${Math.round(target * eased)}+`;
          if (progress < 1) requestAnimationFrame(tick);
          else node.textContent = `${target}+`;
        };
        requestAnimationFrame(tick);
      }, delay);
    });
  }, { threshold: .35 });
  observer.observe(section);
}

function setWorkflowStep(index) {
  workflowStep = index;
  document.querySelectorAll("[data-workflow-dot]").forEach((node, nodeIndex) => node.classList.toggle("is-active", nodeIndex === index));
}

function setDnaStep(index, { animate = true, focus = false } = {}) {
  const rules = [...document.querySelectorAll("[data-dna-rule]")];
  const overlays = [...document.querySelectorAll("[data-dna-overlay]")];
  const product = document.querySelector(".dna-product");
  if (!rules.length) return;

  const next = Math.max(0, Math.min(rules.length - 1, Number(index) || 0));
  const previous = dnaStep;
  dnaStep = next;

  rules.forEach((node, nodeIndex) => {
    const selected = nodeIndex === next;
    const complete = nodeIndex < next;
    node.classList.toggle("is-active", selected);
    node.classList.toggle("is-complete", complete);
    node.setAttribute("aria-pressed", String(selected));
    node.setAttribute("aria-current", selected ? "step" : "false");
    node.style.opacity = selected ? "1" : complete ? ".68" : ".28";
    node.style.cursor = "pointer";
  });

  overlays.forEach((node, nodeIndex) => {
    const selected = nodeIndex === next;
    node.classList.toggle("is-active", selected);
    node.setAttribute("aria-hidden", String(!selected));
  });

  const scene = document.querySelector(".dna-scene");
  if (scene) scene.dataset.dnaStep = String(next + 1);

  if (focus) rules[next]?.focus({ preventScroll: true });
  if (!animate || REDUCED_MOTION.matches || !window.gsap || previous === next) return;

  const activeOverlay = overlays[next];
  const direction = next >= previous ? 1 : -1;
  const timeline = window.gsap.timeline({ defaults: { overwrite: "auto" } });

  if (product) {
    timeline.fromTo(product,
      { y: direction * 8, scale: .992 },
      { y: 0, scale: 1, duration: .42, ease: "power3.out", clearProps: "transform" },
      0
    );
  }
  if (activeOverlay) {
    timeline.fromTo(activeOverlay,
      { autoAlpha: 0, y: 12, scale: .97 },
      { autoAlpha: 1, y: 0, scale: 1, duration: .38, ease: "power3.out", clearProps: "transform" },
      .04
    );
  }
}

function initDnaStepper() {
  const rules = [...document.querySelectorAll("[data-dna-rule]")];
  if (!rules.length) return;

  rules.forEach((rule, index) => {
    rule.setAttribute("role", "button");
    rule.setAttribute("tabindex", index === 0 ? "0" : "-1");
    rule.setAttribute("aria-label", `${String(index + 1).padStart(2, "0")} ${rule.querySelector("strong")?.textContent || "Design DNA"}`);
    rule.addEventListener("click", () => setDnaStep(index, { animate: true }));
    rule.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setDnaStep(index, { animate: true });
        return;
      }
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "Home") next = 0;
      else if (event.key === "End") next = rules.length - 1;
      else next = event.key === "ArrowUp" || event.key === "ArrowLeft" ? Math.max(0, index - 1) : Math.min(rules.length - 1, index + 1);
      rules.forEach((node, nodeIndex) => { node.tabIndex = nodeIndex === next ? 0 : -1; });
      setDnaStep(next, { animate: true, focus: true });
    });
  });

  setDnaStep(0, { animate: false });
}

function initWorkflowTilt() {
  const cards = [...document.querySelectorAll("[data-workflow-card]")];
  if (!FINE_POINTER.matches || REDUCED_MOTION.matches) return;
  cards.forEach((card) => {
    const visual = card.querySelector(".workflow-card-visual");
    if (!visual) return;
    const reset = () => {
      card.classList.remove("is-tilting");
      visual.style.setProperty("--pointer-x", "50%");
      visual.style.setProperty("--pointer-y", "50%");
      visual.style.setProperty("--rotate-x", "0deg");
      visual.style.setProperty("--rotate-y", "0deg");
    };
    card.addEventListener("pointermove", (event) => {
      const rect = visual.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(rect.width, 1)));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(rect.height, 1)));
      card.classList.add("is-tilting");
      visual.style.setProperty("--pointer-x", `${x * 100}%`);
      visual.style.setProperty("--pointer-y", `${y * 100}%`);
      visual.style.setProperty("--rotate-x", `${(x - .5) * 8}deg`);
      visual.style.setProperty("--rotate-y", `${(.5 - y) * 7}deg`);
    });
    card.addEventListener("pointerleave", reset);
  });
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
    console.warn("GSAP enhancement unavailable; using the static Home experience.", error);
    return false;
  }
}

function initHeroPointer() {
  const hero = document.querySelector(".home-hero");
  const image = hero?.querySelector(".home-hero-image");
  if (!hero || !image || !FINE_POINTER.matches || REDUCED_MOTION.matches || !window.gsap) return;
  const moveX = window.gsap.quickTo(image, "x", { duration: .8, ease: "power3.out" });
  const moveY = window.gsap.quickTo(image, "y", { duration: .8, ease: "power3.out" });
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const px = Math.max(0, Math.min(100, ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100));
    const py = Math.max(0, Math.min(100, ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100));
    hero.style.setProperty("--hero-x", `${px}%`);
    hero.style.setProperty("--hero-y", `${py}%`);
    moveX((px - 50) * -.055);
    moveY((py - 50) * -.035);
  });
  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--hero-x", "50%");
    hero.style.setProperty("--hero-y", "48%");
    moveX(0);
    moveY(0);
  });
}

function initMagneticLinks() {
  if (!FINE_POINTER.matches || REDUCED_MOTION.matches || !window.gsap) return;
  document.querySelectorAll(".home-button-primary, .explore-more, .final-cta-link").forEach((link) => {
    const moveX = window.gsap.quickTo(link, "x", { duration: .3, ease: "power3.out" });
    const moveY = window.gsap.quickTo(link, "y", { duration: .3, ease: "power3.out" });
    link.addEventListener("pointermove", (event) => {
      const rect = link.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      moveX(Math.max(-8, Math.min(8, dx * .11)));
      moveY(Math.max(-5, Math.min(5, dy * .11)));
    });
    link.addEventListener("pointerleave", () => { moveX(0); moveY(0); });
  });
}

function initHomeMotion() {
  if (!window.gsap || !window.ScrollTrigger || REDUCED_MOTION.matches) return;
  const { gsap, ScrollTrigger } = window;
  document.body.classList.add("home-motion-active");
  homeMotionContext?.revert?.();

  homeMotionContext = gsap.context(() => {
    const hero = document.querySelector(".home-hero");
    const heroImage = hero?.querySelector(".home-hero-image");
    const heroLayout = hero?.querySelector(".home-hero-layout");

    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".home-hero-title .home-kicker", { autoAlpha: 0, y: 16, duration: .38 })
      .from(".home-hero h1 span:first-child", { autoAlpha: 0, yPercent: 56, duration: .7 }, "-=.14")
      .from(".home-hero h1 span:last-child", { autoAlpha: 0, yPercent: 56, duration: .74 }, "-=.48")
      .from(".home-hero-aside > p", { autoAlpha: 0, y: 20, duration: .48 }, "-=.38")
      .from(".home-hero-actions", { autoAlpha: 0, y: 14, duration: .42 }, "-=.3")
      .from(".home-scroll-cue", { autoAlpha: 0, x: 12, duration: .34 }, "-=.2");

    if (hero && heroImage && heroLayout) {
      gsap.to(heroImage, { scale: 1.12, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: .8 } });
      gsap.to(heroLayout, { yPercent: -7, autoAlpha: .16, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom 12%", scrub: .75 } });
    }

    gsap.from(".case-story-heading > *", { autoAlpha: 0, y: 26, stagger: .08, duration: .58, ease: "power3.out", scrollTrigger: { trigger: ".case-story-heading", start: "top 82%", once: true } });

    const caseViewport = document.querySelector("[data-case-viewport]");
    const caseTrack = document.querySelector("[data-case-track]");
    const casePanels = [...document.querySelectorAll(".case-panel")];
    if (caseViewport && caseTrack && window.innerWidth > 760) {
      const horizontalDistance = () => Math.max(0, caseTrack.scrollWidth - caseViewport.clientWidth + Math.max(36, window.innerWidth * .035));
      const caseTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".case-story-inner",
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 1.35, horizontalDistance() * .92)}`,
          pin: true,
          scrub: .8,
          invalidateOnRefresh: true,
        },
      });
      caseTimeline.to(caseTrack, { x: () => -horizontalDistance(), ease: "none", duration: 1 });
      casePanels.forEach((panel, index) => {
        gsap.fromTo(panel, { scale: index === 0 ? 1 : .94, autoAlpha: index === 0 ? 1 : .6 }, {
          scale: 1,
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            containerAnimation: caseTimeline,
            start: "left 88%",
            end: "center 56%",
            scrub: true,
          },
        });
      });
    }

    gsap.from(".proof-grid > *", { autoAlpha: 0, y: 22, stagger: .07, duration: .5, ease: "power3.out", scrollTrigger: { trigger: "#overview", start: "top 84%", once: true } });
    gsap.from(".explore-copy > .home-kicker, .explore-copy > h2, .explore-copy > p", { autoAlpha: 0, y: 24, stagger: .07, duration: .55, ease: "power3.out", scrollTrigger: { trigger: ".explore-scene", start: "top 80%", once: true } });
    gsap.from(".explore-tabs button", { autoAlpha: 0, x: -14, stagger: .045, duration: .38, ease: "power3.out", scrollTrigger: { trigger: ".explore-tabs", start: "top 88%", once: true } });
    gsap.from(".explore-preview", { autoAlpha: 0, y: 34, scale: .98, filter: "blur(8px)", duration: .68, ease: "power3.out", clearProps: "filter", scrollTrigger: { trigger: ".explore-preview-wrap", start: "top 84%", once: true } });

    gsap.from(".workflow-copy > .home-kicker, .workflow-copy > h2, .workflow-copy > p, .workflow-index, .workflow-source", { autoAlpha: 0, y: 20, stagger: .055, duration: .48, ease: "power3.out", scrollTrigger: { trigger: ".workflow-scene", start: "top 82%", once: true } });

    const workflowCards = [...document.querySelectorAll("[data-workflow-card]")];
    if (workflowCards.length && window.innerWidth > 760) {
      const tablet = window.innerWidth <= 1100;
      workflowCards.forEach((card, index) => {
        gsap.set(card, {
          xPercent: tablet ? 50 : 0,
          yPercent: -50,
          autoAlpha: index === 0 ? 1 : 0,
          scale: index === 0 ? 1 : .9,
          y: index === 0 ? 0 : 72,
          rotation: index === 0 ? 0 : index % 2 ? 1.4 : -1.4,
          pointerEvents: index === 0 ? "auto" : "none",
        });
      });

      const workflowTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".workflow-stage",
          start: "top top",
          end: "+=2500",
          pin: true,
          scrub: .72,
          onUpdate: (self) => {
            const index = Math.min(3, Math.floor(self.progress * 4));
            if (index !== workflowStep) setWorkflowStep(index);
          },
        },
      });

      workflowCards.forEach((card, index) => {
        if (index === 0) return;
        const previous = workflowCards[index - 1];
        const start = index - .05;
        workflowTimeline
          .to(previous, { autoAlpha: 0, scale: .86, y: -54, rotation: index % 2 ? -1.8 : 1.8, pointerEvents: "none", duration: .42, ease: "power2.inOut" }, start)
          .fromTo(card, { autoAlpha: 0, scale: .9, y: 72, rotation: index % 2 ? 1.4 : -1.4 }, { autoAlpha: 1, scale: 1, y: 0, rotation: 0, pointerEvents: "auto", duration: .58, ease: "power3.out" }, start + .16);
      });
    } else {
      gsap.from(".workflow-card", { autoAlpha: 0, y: 28, stagger: .08, duration: .52, ease: "power3.out", scrollTrigger: { trigger: ".workflow-cards", start: "top 84%", once: true } });
    }

    gsap.from(".dna-heading > *", { autoAlpha: 0, y: 26, stagger: .065, duration: .55, ease: "power3.out", scrollTrigger: { trigger: ".dna-heading", start: "top 82%", once: true } });
    gsap.from(".dna-rule", { autoAlpha: 0, x: -16, stagger: .07, duration: .46, ease: "power3.out", scrollTrigger: { trigger: ".dna-stage", start: "top 82%", once: true } });
    gsap.from(".dna-product", { autoAlpha: 0, y: 28, scale: .975, duration: .62, ease: "power3.out", scrollTrigger: { trigger: ".dna-stage", start: "top 80%", once: true } });

    gsap.from(".final-cta-inner > *", { autoAlpha: 0, y: 30, stagger: .075, duration: .58, ease: "power3.out", scrollTrigger: { trigger: ".final-cta", start: "top 80%", once: true } });
    gsap.from(".footer-grid > *, .footer-bottom > *", { autoAlpha: 0, y: 18, stagger: .04, duration: .42, ease: "power3.out", scrollTrigger: { trigger: ".project-footer", start: "top 92%", once: true } });
  });

  initHeroPointer();
  initMagneticLinks();
  window.setTimeout(() => ScrollTrigger.refresh(), 100);
}

function destroyHomeMotion() {
  homeMotionContext?.revert?.();
  homeMotionContext = null;
  window.ScrollTrigger?.getAll?.().forEach((trigger) => trigger.kill());
  document.body.classList.remove("home-motion-active");
  document.querySelectorAll("[data-workflow-card]").forEach((card) => card.style.removeProperty("pointer-events"));
  setWorkflowStep(0);
  setDnaStep(dnaStep, { animate: false });
}

function handleMotionPreference() {
  if (REDUCED_MOTION.matches) {
    destroyHomeMotion();
    return;
  }
  ensureGsap().then((ready) => { if (ready) initHomeMotion(); });
}

initDiscovery();
initStatsCounter();
initWorkflowTilt();
initDnaStepper();
setWorkflowStep(0);
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
