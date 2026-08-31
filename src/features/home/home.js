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

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.content = language === "en"
      ? "ONDesign turns real UI references into reusable design rules for AI Coding."
      : "ONDesign：从真实 UI 参考出发，把字体、颜色、组件和节奏变成 AI Coding 能执行的 Design DNA。";
  }

  document.querySelectorAll("[data-zh][data-en]").forEach((node) => {
    const value = node.dataset[language];
    if (value) node.textContent = value;
  });

  document.querySelectorAll("[data-smart-lang-link]").forEach((link) => {
    const route = link.dataset.smartLangLink;
    if (route) link.href = localizedRoute(route, language);
  });

  renderDiscovery(activeDiscoveryIndex, { animate: false, language });
}

function renderDiscovery(index, { animate = true, language = currentLanguage() } = {}) {
  const preview = DISCOVERY_PREVIEWS[index];
  if (!preview) return;

  const tabs = [...document.querySelectorAll("[data-discovery-index]")];
  const card = document.querySelector("[data-discovery-preview]");
  const image = document.querySelector("[data-discovery-image]");
  const eyebrow = document.querySelector("[data-discovery-eyebrow]");
  const title = document.querySelector("[data-discovery-title]");
  const copy = document.querySelector("[data-discovery-copy]");
  const link = document.querySelector("[data-discovery-link]");

  const update = () => {
    activeDiscoveryIndex = index;
    tabs.forEach((tab, tabIndex) => {
      const active = tabIndex === index;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    if (image) {
      image.src = new URL(preview.src, location.href).href;
      image.alt = preview.alt[language];
      image.style.objectFit = preview.fit;
      image.style.objectPosition = preview.position;
    }
    if (eyebrow) eyebrow.textContent = preview.eyebrow;
    if (title) title.textContent = preview.title;
    if (copy) copy.textContent = preview.copy[language];
    if (link) {
      link.dataset.smartLangLink = preview.route;
      link.href = localizedRoute(preview.route, language);
    }
  };

  if (!animate || !window.gsap || REDUCED_MOTION.matches || !card) {
    update();
    return;
  }

  window.gsap.to(card, {
    autoAlpha: 0,
    scale: .975,
    filter: "blur(10px)",
    duration: .18,
    ease: "power2.in",
    onComplete: () => {
      update();
      window.gsap.fromTo(card, { autoAlpha: 0, scale: 1.025, filter: "blur(10px)" }, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: .52, ease: "power3.out", clearProps: "opacity,visibility,transform,filter" });
    },
  });
}

function initDiscovery() {
  document.querySelectorAll("[data-discovery-index]").forEach((tab) => {
    tab.addEventListener("click", () => renderDiscovery(Number(tab.dataset.discoveryIndex)));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const delta = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
      const next = (activeDiscoveryIndex + delta + DISCOVERY_PREVIEWS.length) % DISCOVERY_PREVIEWS.length;
      renderDiscovery(next);
      document.querySelector(`[data-discovery-index="${next}"]`)?.focus();
    });
  });
  renderDiscovery(0, { animate: false });
}

function initStatsCounter() {
  const section = document.querySelector("#overview");
  const numbers = [...document.querySelectorAll("[data-count]")];
  if (!section || !numbers.length) return;

  const showFinal = () => numbers.forEach((node) => { node.textContent = `${node.dataset.count}+`; });
  if (REDUCED_MOTION.matches || !("IntersectionObserver" in window)) {
    showFinal();
    return;
  }

  numbers.forEach((node) => { node.textContent = "0+"; });
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();

    numbers.forEach((node, index) => {
      const target = Number(node.dataset.count) || 0;
      const startAt = performance.now() + index * 100;
      const duration = 1100;
      const tick = (now) => {
        if (now < startAt) {
          requestAnimationFrame(tick);
          return;
        }
        const progress = Math.min(1, (now - startAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = `${Math.round(target * eased)}+`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: .45 });

  observer.observe(section);
}

function initWorkflowTilt() {
  document.querySelectorAll(".workflow-card").forEach((card) => {
    const visual = card.querySelector(".workflow-card-visual");
    if (!visual) return;

    const reset = () => {
      card.classList.remove("is-tilting");
      visual.style.setProperty("--pointer-x", "50%");
      visual.style.setProperty("--pointer-y", "50%");
      visual.style.setProperty("--rotate-x", "0deg");
      visual.style.setProperty("--rotate-y", "0deg");
    };

    card.addEventListener("pointerenter", () => {
      if (!FINE_POINTER.matches || REDUCED_MOTION.matches) return;
      card.classList.add("is-tilting");
    });

    card.addEventListener("pointermove", (event) => {
      if (!FINE_POINTER.matches || REDUCED_MOTION.matches) return;
      const rect = visual.getBoundingClientRect();
      const px = Math.max(0, Math.min(100, ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100));
      const py = Math.max(0, Math.min(100, ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100));
      const cx = px - 50;
      const cy = py - 50;
      visual.style.setProperty("--pointer-x", `${px}%`);
      visual.style.setProperty("--pointer-y", `${py}%`);
      visual.style.setProperty("--rotate-x", `${-(cx / 6.5)}deg`);
      visual.style.setProperty("--rotate-y", `${cy / 5.2}deg`);
    });

    card.addEventListener("pointerleave", reset);
    REDUCED_MOTION.addEventListener?.("change", reset);
    FINE_POINTER.addEventListener?.("change", reset);
  });
}

function setWorkflowStep(index) {
  workflowStep = index;
  document.querySelectorAll("[data-workflow-dot]").forEach((node, nodeIndex) => node.classList.toggle("is-active", nodeIndex === index));
}

function setDnaStep(index) {
  dnaStep = index;
  document.querySelectorAll("[data-dna-rule]").forEach((node, nodeIndex) => node.classList.toggle("is-active", nodeIndex === index));
  document.querySelectorAll("[data-dna-overlay]").forEach((node, nodeIndex) => node.classList.toggle("is-active", nodeIndex === index));
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
    moveX((px - 50) * -.08);
    moveY((py - 50) * -.05);
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
    const moveX = window.gsap.quickTo(link, "x", { duration: .32, ease: "power3.out" });
    const moveY = window.gsap.quickTo(link, "y", { duration: .32, ease: "power3.out" });
    link.addEventListener("pointermove", (event) => {
      const rect = link.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      moveX(Math.max(-10, Math.min(10, dx * .13)));
      moveY(Math.max(-7, Math.min(7, dy * .13)));
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
    const heroPieces = [
      ".home-hero-title .home-kicker",
      ".home-hero h1 span:first-child",
      ".home-hero h1 span:last-child",
      ".home-hero-aside > p",
      ".home-hero-actions",
      ".home-scroll-cue",
    ];

    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(heroPieces[0], { autoAlpha: 0, y: 18, duration: .45 })
      .from(heroPieces[1], { autoAlpha: 0, yPercent: 70, duration: .78 }, "-=.18")
      .from(heroPieces[2], { autoAlpha: 0, yPercent: 70, duration: .82 }, "-=.5")
      .from(heroPieces[3], { autoAlpha: 0, y: 26, duration: .55 }, "-=.48")
      .from(heroPieces[4], { autoAlpha: 0, y: 18, duration: .48 }, "-=.36")
      .from(heroPieces[5], { autoAlpha: 0, x: 16, duration: .4 }, "-=.22");

    if (hero && heroImage && heroLayout) {
      gsap.to(heroImage, { scale: 1.16, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: .8 } });
      gsap.to(heroLayout, { yPercent: -10, autoAlpha: .18, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom 10%", scrub: .8 } });
    }

    gsap.from(".case-story-heading > *", { autoAlpha: 0, y: 34, stagger: .1, duration: .7, ease: "power3.out", scrollTrigger: { trigger: ".case-story-heading", start: "top 78%", once: true } });

    const caseViewport = document.querySelector("[data-case-viewport]");
    const caseTrack = document.querySelector("[data-case-track]");
    if (caseViewport && caseTrack && window.innerWidth > 720) {
      const horizontalDistance = () => Math.max(0, caseTrack.scrollWidth - caseViewport.clientWidth + Math.max(32, window.innerWidth * .05));
      gsap.to(caseTrack, {
        x: () => -horizontalDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: ".case-story-inner",
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 1.5, horizontalDistance())}`,
          pin: true,
          scrub: .8,
          invalidateOnRefresh: true,
        },
      });
      gsap.from(".case-panel", { autoAlpha: 0, y: 44, scale: .96, stagger: .09, duration: .7, ease: "power3.out", scrollTrigger: { trigger: ".case-story-track", start: "top 78%", once: true } });
    }

    gsap.from(".proof-grid > *", { autoAlpha: 0, y: 28, stagger: .08, duration: .6, ease: "power3.out", scrollTrigger: { trigger: "#overview", start: "top 82%", once: true } });
    gsap.from(".explore-copy > .home-kicker, .explore-copy > h2, .explore-copy > p", { autoAlpha: 0, y: 28, stagger: .08, duration: .65, ease: "power3.out", scrollTrigger: { trigger: ".explore-scene", start: "top 76%", once: true } });
    gsap.from(".explore-tabs button", { autoAlpha: 0, x: -18, stagger: .055, duration: .46, ease: "power3.out", scrollTrigger: { trigger: ".explore-tabs", start: "top 84%", once: true } });
    gsap.from(".explore-preview", { autoAlpha: 0, y: 46, scale: .965, filter: "blur(12px)", duration: .8, ease: "power3.out", clearProps: "filter", scrollTrigger: { trigger: ".explore-preview-wrap", start: "top 82%", once: true } });

    const workflowCards = [...document.querySelectorAll("[data-workflow-card]")];
    if (workflowCards.length && window.innerWidth > 720) {
      workflowCards.forEach((card, index) => {
        const tablet = window.innerWidth <= 1100;
        gsap.set(card, { xPercent: tablet ? -50 : 0, yPercent: -50, autoAlpha: index === 0 ? 1 : 0, scale: index === 0 ? 1 : .88, y: index === 0 ? 0 : 90, rotation: index === 0 ? 0 : index % 2 ? 2.5 : -2.5 });
      });

      const workflowTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".workflow-stage",
          start: "top top",
          end: "+=3000",
          pin: true,
          scrub: .75,
          onUpdate: (self) => {
            const index = Math.min(3, Math.floor(self.progress * 4));
            if (index !== workflowStep) setWorkflowStep(index);
          },
        },
      });

      workflowCards.forEach((card, index) => {
        if (index === 0) return;
        const previous = workflowCards[index - 1];
        const time = index;
        workflowTimeline
          .to(previous, { autoAlpha: .18, scale: .84, y: -72, rotation: index % 2 ? -3 : 3, duration: .55, ease: "power2.inOut" }, time - .1)
          .to(card, { autoAlpha: 1, scale: 1, y: 0, rotation: 0, duration: .7, ease: "power3.out" }, time);
      });
      workflowTimeline.to(workflowCards.at(-1), { scale: 1.02, duration: .35 }, 3.8);
    } else {
      gsap.from(".workflow-card", { autoAlpha: 0, y: 38, stagger: .1, duration: .65, ease: "power3.out", scrollTrigger: { trigger: ".workflow-cards", start: "top 82%", once: true } });
    }

    gsap.from(".workflow-copy > .home-kicker, .workflow-copy > h2, .workflow-copy > p, .workflow-index, .workflow-source", { autoAlpha: 0, y: 24, stagger: .07, duration: .6, ease: "power3.out", scrollTrigger: { trigger: ".workflow-scene", start: "top 78%", once: true } });
    gsap.from(".dna-heading > *", { autoAlpha: 0, y: 32, stagger: .08, duration: .7, ease: "power3.out", scrollTrigger: { trigger: ".dna-heading", start: "top 78%", once: true } });

    const dnaStage = document.querySelector("[data-dna-stage]");
    const dnaProduct = document.querySelector(".dna-product");
    const dnaOverlays = [...document.querySelectorAll("[data-dna-overlay]")];
    if (dnaStage && dnaProduct && window.innerWidth > 720) {
      gsap.set(dnaOverlays, { autoAlpha: .12, scale: .94 });
      gsap.set(dnaOverlays[0], { autoAlpha: 1, scale: 1 });
      setDnaStep(0);

      const dnaTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: dnaStage,
          start: "top top",
          end: "+=2800",
          pin: true,
          scrub: .72,
          onUpdate: (self) => {
            const index = Math.min(3, Math.floor(self.progress * 4));
            if (index !== dnaStep) setDnaStep(index);
          },
        },
      });

      dnaTimeline.from(dnaProduct, { autoAlpha: 0, y: 44, scale: .94, filter: "blur(12px)", duration: .75, ease: "power3.out" }, 0);
      dnaOverlays.forEach((overlay, index) => {
        if (index === 0) return;
        dnaTimeline
          .to(dnaOverlays[index - 1], { autoAlpha: .18, scale: .95, duration: .35 }, index)
          .to(overlay, { autoAlpha: 1, scale: 1, duration: .5, ease: "power3.out" }, index + .05);
      });
      dnaTimeline
        .to(".dna-main-head h3", { color: "#73f2a7", duration: .3 }, 1.1)
        .to(".dna-project-grid", { gap: 18, duration: .45 }, 2.1)
        .to(".dna-component-row", { y: -4, duration: .3 }, 3.1);
    } else {
      gsap.from(".dna-rule, .dna-product", { autoAlpha: 0, y: 34, stagger: .08, duration: .65, ease: "power3.out", scrollTrigger: { trigger: ".dna-stage", start: "top 82%", once: true } });
    }

    gsap.from(".final-cta-inner > *", { autoAlpha: 0, y: 40, stagger: .09, duration: .72, ease: "power3.out", scrollTrigger: { trigger: ".final-cta", start: "top 76%", once: true } });
    gsap.from(".footer-grid > *, .footer-bottom > *", { autoAlpha: 0, y: 22, stagger: .055, duration: .52, ease: "power3.out", scrollTrigger: { trigger: ".project-footer", start: "top 90%", once: true } });
  });

  initHeroPointer();
  initMagneticLinks();
  window.setTimeout(() => ScrollTrigger.refresh(), 120);
}

function destroyHomeMotion() {
  homeMotionContext?.revert?.();
  homeMotionContext = null;
  window.ScrollTrigger?.getAll?.().forEach((trigger) => trigger.kill());
  document.body.classList.remove("home-motion-active");
  setWorkflowStep(0);
  setDnaStep(0);
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
setWorkflowStep(0);
setDnaStep(0);
applyLanguage();

if (window.image2I18n?.registerPage) window.image2I18n.registerPage((language) => applyLanguage({ detail: language }));
else window.addEventListener("image2:languagechange", applyLanguage);

handleMotionPreference();
REDUCED_MOTION.addEventListener?.("change", handleMotionPreference);

let resizeTimer = 0;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    if (!REDUCED_MOTION.matches && window.gsap && window.ScrollTrigger) {
      destroyHomeMotion();
      initHomeMotion();
    }
  }, 220);
});
