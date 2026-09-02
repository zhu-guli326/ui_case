const SUPPORTED_LANGUAGES = new Set(["zh", "en"]);
const HOME_MOTION_SCRIPTS = [
  "https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js",
  "https://cdn.jsdelivr.net/npm/gsap@3.15/dist/ScrollTrigger.min.js",
];

const templateFilters = [...document.querySelectorAll("[data-template-filter]")];
const templateCards = [...document.querySelectorAll("[data-template-category]")];

function filterTemplates(category) {
  templateFilters.forEach((button) => {
    const selected = button.dataset.templateFilter === category;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  templateCards.forEach((card) => {
    card.classList.toggle("is-hidden", category !== "all" && card.dataset.templateCategory !== category);
  });
}

templateFilters.forEach((button) => button.addEventListener("click", () => filterTemplates(button.dataset.templateFilter)));

const discoveryStrip = document.querySelector(".discovery-strip");
const discoveryTabs = [...(discoveryStrip?.querySelectorAll(".template-filters a") || [])];
const discoveryCards = [...(discoveryStrip?.querySelectorAll(".template-grid .template-card") || [])];
const DISCOVERY_PREVIEWS = [
  {
    src: "./assets/cases/fashion-shopping-app/hero-screen.png",
    ratio: "9 / 16",
    maxWidth: "390px",
    fit: "cover",
    position: "center top",
    route: "./library.html",
    alt: { zh: "ONDesign 案例库中的 Fashion Shopping App 移动端界面", en: "Fashion Shopping App mobile UI from the ONDesign case library" },
  },
  {
    src: "./assets/home/case-product-designer-20260831.png",
    ratio: "16 / 9",
    maxWidth: "1120px",
    fit: "cover",
    position: "center top",
    route: "./skills.html?mode=WEB",
    alt: { zh: "ONDesign 收录的真实 Web 设计案例", en: "A real web design case featured in ONDesign" },
  },
  {
    src: "./assets/skills/repositories/leonxlnx-taste-skill-detail.png",
    ratio: "3 / 4",
    maxWidth: "640px",
    fit: "cover",
    position: "center top",
    route: "./skills.html",
    alt: { zh: "ONDesign 设计 Skill 库中的 Skill 详情卡片", en: "A real Skill detail preview from the ONDesign Skills library" },
  },
  {
    src: "./assets/demo-preview.gif",
    ratio: "3 / 4",
    maxWidth: "640px",
    fit: "cover",
    position: "center top",
    route: "./launcher.html",
    alt: { zh: "ONDesign Start Designing / Design DNA 实际工作流预览", en: "ONDesign Start Designing and Design DNA workflow preview" },
  },
  {
    src: "./assets/vocabulary/generated-v2/content-display-sheet.png",
    ratio: "3 / 4",
    maxWidth: "640px",
    fit: "cover",
    position: "center top",
    route: "./vocabulary.html",
    alt: { zh: "ONDesign UI 词库中的内容展示与组件术语卡片", en: "Content-display and component terminology cards from ONDesign UI Vocabulary" },
  },
];
let activeDiscoveryIndex = 0;
let discoveryMoreLink = null;

function localizedRoute(route, language = currentLanguage()) {
  const target = new URL(route, location.href);
  target.searchParams.set("lang", language);
  return `${target.pathname.split("/").pop()}${target.search}${target.hash}`;
}

function configureDiscoveryCard(card, index) {
  const preview = DISCOVERY_PREVIEWS[index];
  if (!card || !preview) return;
  const image = card.querySelector("img");
  if (image) {
    image.src = new URL(preview.src, location.href).href;
    image.alt = preview.alt[currentLanguage()];
    image.style.objectFit = preview.fit;
    image.style.objectPosition = preview.position;
  }
  card.style.setProperty("--discovery-ratio", preview.ratio);
  card.style.setProperty("--discovery-max-width", preview.maxWidth);
}

function animateDiscoveryCard(card) {
  if (!card || !window.gsap || reducedMotion.matches) return;
  const image = card.querySelector("img");
  window.gsap.fromTo(
    card,
    { autoAlpha: 0, scale: .965, filter: "blur(10px)" },
    { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: .62, ease: "power3.out", clearProps: "opacity,visibility,transform,filter" },
  );
  if (image) {
    window.gsap.fromTo(image, { scale: 1.055 }, { scale: 1, duration: .8, ease: "power3.out", clearProps: "transform" });
  }
}

function transitionDiscovery(index) {
  if (index === activeDiscoveryIndex) return;
  const currentCard = discoveryCards[activeDiscoveryIndex];
  if (!window.gsap || reducedMotion.matches || !currentCard) {
    renderDiscovery(index);
    return;
  }

  window.gsap.to(currentCard, {
    autoAlpha: 0,
    scale: .97,
    filter: "blur(10px)",
    duration: .2,
    ease: "power2.in",
    onComplete: () => {
      window.gsap.set(currentCard, { clearProps: "opacity,visibility,transform,filter" });
      renderDiscovery(index);
      animateDiscoveryCard(discoveryCards[activeDiscoveryIndex]);
    },
  });
}

function ensureDiscoveryEnhancement() {
  if (!discoveryStrip || !discoveryTabs.length || !discoveryCards.length) return;

  discoveryTabs.forEach((tab, index) => {
    tab.setAttribute("role", "tab");
    tab.removeAttribute("target");
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      transitionDiscovery(index);
    });
  });

  discoveryCards.forEach((card, index) => {
    configureDiscoveryCard(card, index);
    card.addEventListener("click", (event) => event.preventDefault());
    card.setAttribute("aria-disabled", "true");
  });

  const footer = document.createElement("div");
  footer.className = "discovery-footer";
  discoveryMoreLink = document.createElement("a");
  discoveryMoreLink.className = "discovery-more";
  discoveryMoreLink.innerHTML = '<span data-zh="查看更多" data-en="View more">查看更多</span> ↗';
  footer.append(discoveryMoreLink);
  discoveryStrip.querySelector(".project-container")?.append(footer);

  renderDiscovery(0);
}

function renderDiscovery(index) {
  if (!discoveryTabs.length || !discoveryCards.length) return;
  activeDiscoveryIndex = Math.max(0, Math.min(index, discoveryTabs.length - 1));

  discoveryTabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === activeDiscoveryIndex;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.setAttribute("aria-pressed", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  discoveryCards.forEach((card, cardIndex) => {
    const selected = cardIndex === activeDiscoveryIndex;
    configureDiscoveryCard(card, cardIndex);
    card.classList.toggle("is-active-discovery", selected);
    card.hidden = !selected;
    card.setAttribute("aria-hidden", String(!selected));
  });

  if (discoveryMoreLink) {
    const preview = DISCOVERY_PREVIEWS[activeDiscoveryIndex];
    const route = preview?.route || "./library.html";
    discoveryMoreLink.dataset.smartLangLink = route;
    discoveryMoreLink.href = localizedRoute(route);
  }
}

const CAPABILITY_FIGURES = [
  {
    stage: "01 · DEFINE",
    image: "./assets/home/figures/steve-jobs.png",
    alt: { zh: "史蒂夫·乔布斯像素人物肖像", en: "Pixel portrait of Steve Jobs" },
    name: { zh: "DEFINE", en: "DEFINE" },
    person: { zh: "史蒂夫·乔布斯", en: "Steve Jobs" },
    thinking: { zh: "确定目标 / 页面 / 参考", en: "Goal / Page / Reference" },
    tagline: { zh: "先确定做什么、为谁做，以及参考什么。", en: "Clarify what you are building, who it is for, and what should guide it." },
  },
  {
    stage: "02 · CREATE",
    image: "./assets/home/figures/leonardo-da-vinci.png",
    alt: { zh: "达·芬奇像素人物肖像", en: "Pixel portrait of Leonardo da Vinci" },
    name: { zh: "CREATE", en: "CREATE" },
    person: { zh: "达·芬奇", en: "Leonardo da Vinci" },
    thinking: { zh: "拆解 / 组合 / 视觉方向", en: "Break down / Compose / Visual direction" },
    tagline: { zh: "把参考转成布局、字体、颜色和组件。", en: "Turn references into layout, typography, color, and components." },
  },
  {
    stage: "03 · BUILD",
    image: "./assets/home/figures/bill-gates.png",
    alt: { zh: "比尔·盖茨像素人物肖像", en: "Pixel portrait of Bill Gates" },
    name: { zh: "BUILD", en: "BUILD" },
    person: { zh: "比尔·盖茨", en: "Bill Gates" },
    thinking: { zh: "Design DNA / AI Coding / Demo", en: "Design DNA / AI Coding / Demo" },
    tagline: { zh: "把设计规则交给 AI Coding，做出能运行的 Demo。", en: "Hand the design rules to AI Coding and build a runnable demo." },
  },
  {
    stage: "04 · ITERATE",
    image: "./assets/home/figures/thomas-edison.png",
    alt: { zh: "爱迪生像素人物肖像", en: "Pixel portrait of Thomas Edison" },
    name: { zh: "ITERATE", en: "ITERATE" },
    person: { zh: "爱迪生", en: "Thomas Edison" },
    thinking: { zh: "对照 / 调整 / 验证", en: "Compare / Refine / Validate" },
    tagline: { zh: "对照目标持续迭代，让 Demo 更像、更顺、更能用。", en: "Compare, refine, and validate until the demo looks right and works well." },
  },
];

function currentLanguage(event) {
  const detail = event?.detail;
  const eventLanguage = typeof detail === "string" ? detail : detail?.language || detail?.lang || detail?.value;
  if (SUPPORTED_LANGUAGES.has(eventLanguage)) return eventLanguage;
  if (SUPPORTED_LANGUAGES.has(window.image2I18n?.language)) return window.image2I18n.language;
  const queryLanguage = new URLSearchParams(location.search).get("lang");
  return SUPPORTED_LANGUAGES.has(queryLanguage) ? queryLanguage : "zh";
}

function renderCapabilityFigures(language) {
  const cards = [...document.querySelectorAll("#capabilities .capability-grid > a")];
  cards.forEach((card, index) => {
    const figure = CAPABILITY_FIGURES[index];
    if (!figure) return;

    const image = card.querySelector("img");
    const shade = card.querySelector(".capability-shade");
    const stage = card.querySelector("small");
    const title = card.querySelector("strong");
    const copy = card.querySelector("p");
    const imageUrl = new URL(figure.image, location.href).href;

    if (image) {
      image.src = imageUrl;
      image.alt = figure.alt[language];
      image.loading = "lazy";
      image.decoding = "async";
      image.style.display = "block";
      image.style.opacity = "1";
      image.style.visibility = "visible";
    }
    if (shade) {
      shade.style.background = "linear-gradient(180deg, rgba(0,0,0,0) 38%, rgba(0,0,0,.16) 52%, rgba(0,0,0,.72) 74%, rgba(0,0,0,.96) 100%)";
    }
    if (stage) stage.textContent = figure.stage;
    if (title) {
      title.removeAttribute("data-zh");
      title.removeAttribute("data-en");
      title.textContent = figure.name[language];
    }
    if (copy) {
      copy.removeAttribute("data-zh");
      copy.removeAttribute("data-en");
      copy.style.minHeight = "0";
      copy.innerHTML = `<span style="display:block;font-weight:650;color:#fff">${figure.person[language]}</span><span style="display:block;margin-top:4px">${figure.thinking[language]}</span><span style="display:block;margin-top:4px;color:rgba(255,255,255,.9)">${figure.tagline[language]}</span>`;
    }
  });
}

function applyLanguage(event) {
  const language = currentLanguage(event);
  document.documentElement.lang = language === "en" ? "en" : "zh-CN";
  document.title = language === "en" ? "ONDesign · Find references. Build with AI." : "ONDesign · 看参考，拆设计，交给 AI 做";

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.content = language === "en"
      ? "ONDesign helps you find real UI references, break down the design, and hand clearer decisions to AI coding."
      : "ONDesign：看真实参考，拆字体、颜色、组件和设计规则，再交给 AI Coding 去做。";
  }

  document.querySelectorAll("[data-zh][data-en]").forEach((element) => {
    const value = element.dataset[language];
    if (value) element.textContent = value;
  });

  const capabilityEyebrow = document.querySelector("#capabilities .section-eyebrow");
  const capabilityHeading = document.querySelector("#capabilities .section-heading h2");
  if (capabilityEyebrow) capabilityEyebrow.textContent = "image2 to ui";
  if (capabilityHeading) {
    capabilityHeading.removeAttribute("data-zh");
    capabilityHeading.removeAttribute("data-en");
    capabilityHeading.textContent = language === "en"
      ? "From an idea to a demo, you move through four steps."
      : "从一个 Idea 到一个 Demo，你需要经历这 4 步。";
  }

  renderCapabilityFigures(language);

  document.querySelectorAll("[data-smart-lang-link]").forEach((link) => {
    const target = new URL(link.dataset.smartLangLink, location.href);
    target.searchParams.set("lang", language);
    link.href = `${target.pathname.split("/").pop()}${target.search}${target.hash}`;
  });

  renderDiscovery(activeDiscoveryIndex);

  if (previousButton) previousButton.setAttribute("aria-label", language === "en" ? "Previous case" : "上一个案例");
  if (nextButton) nextButton.setAttribute("aria-label", language === "en" ? "Next case" : "下一个案例");
  carouselDots.forEach((dot, index) => dot.setAttribute("aria-label", language === "en" ? `Show case ${index + 1}` : `显示第 ${index + 1} 个案例`));

  if (event && homeMotionInitialized && !reducedMotion.matches) {
    window.requestAnimationFrame(() => {
      replayHeroIntroMotion();
      window.ScrollTrigger?.refresh();
    });
  }
}

const carousel = document.querySelector("[data-featured-carousel]");
const carouselViewport = carousel?.querySelector("[data-carousel-viewport]");
const caseCards = [...(carousel?.querySelectorAll("[data-case-slide]") || [])];
const previousButton = carousel?.querySelector("[data-carousel-prev]");
const nextButton = carousel?.querySelector("[data-carousel-next]");
const dotsContainer = carousel?.querySelector("[data-carousel-dots]");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
let activeCase = Math.min(1, caseCards.length - 1);
let autoplayTimer = 0;
let dragStart = null;
let dragDistance = 0;
let suppressNextClick = false;
let homeMotionInitialized = false;
let heroIntroTimeline = null;

const carouselDots = caseCards.map((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.addEventListener("click", () => setActiveCase(index));
  dotsContainer?.append(dot);
  return dot;
});

function relativeCasePosition(index) {
  let offset = index - activeCase;
  const midpoint = Math.floor(caseCards.length / 2);
  if (offset > midpoint) offset -= caseCards.length;
  if (offset < -midpoint) offset += caseCards.length;
  return offset;
}

function renderCarousel() {
  caseCards.forEach((card, index) => {
    const offset = relativeCasePosition(index);
    card.dataset.position = offset === 0 ? "active" : offset < 0 ? "left" : "right";
    card.toggleAttribute("aria-current", offset === 0);
    card.tabIndex = offset === 0 ? 0 : -1;
  });
  carouselDots.forEach((dot, index) => {
    const selected = index === activeCase;
    dot.classList.toggle("is-active", selected);
    dot.setAttribute("aria-pressed", String(selected));
  });
}

function scheduleAutoplay() {
  clearTimeout(autoplayTimer);
  if (!carousel || reducedMotion.matches || document.hidden) return;
  autoplayTimer = window.setTimeout(() => setActiveCase(activeCase + 1), 5600);
}

function setActiveCase(index) {
  if (!caseCards.length) return;
  activeCase = (index + caseCards.length) % caseCards.length;
  carouselViewport?.style.setProperty("--drag-x", "0px");
  renderCarousel();
  scheduleAutoplay();
}

previousButton?.addEventListener("click", () => setActiveCase(activeCase - 1));
nextButton?.addEventListener("click", () => setActiveCase(activeCase + 1));

caseCards.forEach((card, index) => {
  card.addEventListener("click", (event) => {
    if (suppressNextClick) {
      event.preventDefault();
      suppressNextClick = false;
      return;
    }
    if (index !== activeCase) {
      event.preventDefault();
      setActiveCase(index);
    }
  });
});

carouselViewport?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    setActiveCase(activeCase - 1);
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    setActiveCase(activeCase + 1);
  }
});

carouselViewport?.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  dragStart = event.clientX;
  dragDistance = 0;
  carouselViewport.setPointerCapture(event.pointerId);
  carouselViewport.classList.add("is-dragging");
  clearTimeout(autoplayTimer);
});

carouselViewport?.addEventListener("pointermove", (event) => {
  if (dragStart === null) return;
  dragDistance = event.clientX - dragStart;
  const restrainedDistance = Math.max(-110, Math.min(110, dragDistance * .32));
  carouselViewport.style.setProperty("--drag-x", `${restrainedDistance}px`);
});

function finishDrag(event) {
  if (dragStart === null) return;
  if (carouselViewport?.hasPointerCapture(event.pointerId)) carouselViewport.releasePointerCapture(event.pointerId);
  carouselViewport?.classList.remove("is-dragging");
  carouselViewport?.style.setProperty("--drag-x", "0px");
  if (Math.abs(dragDistance) > 52) {
    suppressNextClick = true;
    setActiveCase(activeCase + (dragDistance < 0 ? 1 : -1));
  } else {
    scheduleAutoplay();
  }
  dragStart = null;
  dragDistance = 0;
}

carouselViewport?.addEventListener("pointerup", finishDrag);
carouselViewport?.addEventListener("pointercancel", finishDrag);
carousel?.addEventListener("mouseenter", () => clearTimeout(autoplayTimer));
carousel?.addEventListener("mouseleave", scheduleAutoplay);
carousel?.addEventListener("focusin", () => clearTimeout(autoplayTimer));
carousel?.addEventListener("focusout", scheduleAutoplay);
document.addEventListener("visibilitychange", scheduleAutoplay);
reducedMotion.addEventListener?.("change", scheduleAutoplay);

if (carousel) {
  if (reducedMotion.matches || !("IntersectionObserver" in window)) carousel.classList.add("is-visible");
  else {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      carousel.classList.add("is-visible");
      observer.disconnect();
    }, { threshold: .18 });
    observer.observe(carousel);
  }
}

function initStatsCounter() {
  const stats = document.querySelector("#overview");
  const numbers = [...(stats?.querySelectorAll("strong") || [])];
  if (!stats || !numbers.length) return;

  const targets = numbers.map((node) => Number.parseInt(node.textContent, 10) || 0);
  const formatValue = (value) => `${value}+`;

  numbers.forEach((node) => {
    node.dataset.number = "";
  });

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    numbers.forEach((node, index) => { node.textContent = formatValue(targets[index]); });
    return;
  }

  numbers.forEach((node) => {
    node.textContent = formatValue(0);
    node.style.opacity = ".35";
    node.style.transform = "translateY(16px) scale(.97)";
    node.style.transition = "opacity 360ms ease, transform 560ms cubic-bezier(.2,.78,.18,1)";
  });

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();

    numbers.forEach((node, index) => {
      const target = targets[index];
      const delay = index * 130;
      const duration = 1200 + index * 120;

      window.setTimeout(() => {
        node.style.opacity = "1";
        node.style.transform = "translateY(0) scale(1)";
        const startedAt = performance.now();

        const tick = (now) => {
          const progress = Math.min(1, (now - startedAt) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          node.textContent = formatValue(Math.round(target * eased));
          if (progress < 1) requestAnimationFrame(tick);
          else node.textContent = formatValue(target);
        };

        requestAnimationFrame(tick);
      }, delay);
    });
  }, { threshold: .35 });

  observer.observe(stats);
}

const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);
const round = (value, precision = 3) => Number(value.toFixed(precision));
const adjust = (value, fromMin, fromMax, toMin, toMax) =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));

function setWorkflowTiltVars(card, x, y) {
  const width = card.clientWidth || 1;
  const height = card.clientHeight || 1;
  const percentX = clamp((100 / width) * x);
  const percentY = clamp((100 / height) * y);
  const centerX = percentX - 50;
  const centerY = percentY - 50;

  const properties = {
    "--pointer-x": `${percentX}%`,
    "--pointer-y": `${percentY}%`,
    "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
    "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
    "--pointer-from-center": `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
    "--pointer-from-top": `${percentY / 100}`,
    "--pointer-from-left": `${percentX / 100}`,
    "--rotate-x": `${round(-(centerX / 6.25))}deg`,
    "--rotate-y": `${round(centerY / 5)}deg`,
  };

  Object.entries(properties).forEach(([property, value]) => card.style.setProperty(property, value));
}

function createWorkflowTiltEngine(card) {
  let rafId = null;
  let running = false;
  let lastTs = 0;
  let currentX = card.clientWidth / 2;
  let currentY = card.clientHeight / 2;
  let targetX = currentX;
  let targetY = currentY;

  const step = (timestamp) => {
    if (!running) return;
    if (lastTs === 0) lastTs = timestamp;
    const deltaSeconds = (timestamp - lastTs) / 1000;
    lastTs = timestamp;
    const smoothing = 1 - Math.exp(-deltaSeconds / .14);

    currentX += (targetX - currentX) * smoothing;
    currentY += (targetY - currentY) * smoothing;
    setWorkflowTiltVars(card, currentX, currentY);

    const stillMoving = Math.abs(targetX - currentX) > .05 || Math.abs(targetY - currentY) > .05;
    if (stillMoving) {
      rafId = requestAnimationFrame(step);
    } else {
      running = false;
      lastTs = 0;
      rafId = null;
    }
  };

  const start = () => {
    if (running) return;
    running = true;
    lastTs = 0;
    rafId = requestAnimationFrame(step);
  };

  return {
    setTarget(x, y) {
      targetX = x;
      targetY = y;
      start();
    },
    toCenter() {
      this.setTarget(card.clientWidth / 2, card.clientHeight / 2);
    },
    isSettled() {
      return Math.hypot(targetX - currentX, targetY - currentY) < .6;
    },
    cancel() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      running = false;
      lastTs = 0;
    },
  };
}

function enhanceWorkflowCard(card) {
  if (card.dataset.workflowTiltReady === "true") return;
  card.dataset.workflowTiltReady = "true";

  const engine = createWorkflowTiltEngine(card);
  let enterTimer = null;
  let settleRaf = null;

  const canTilt = () => finePointer.matches && !reducedMotion.matches;
  const pointerPosition = (event) => {
    const rect = card.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onPointerEnter = (event) => {
    if (!canTilt()) return;
    card.classList.add("workflow-card-active", "workflow-card-entering");
    if (enterTimer) clearTimeout(enterTimer);
    enterTimer = window.setTimeout(() => card.classList.remove("workflow-card-entering"), 180);
    const { x, y } = pointerPosition(event);
    engine.setTarget(x, y);
  };

  const onPointerMove = (event) => {
    if (!canTilt()) return;
    const { x, y } = pointerPosition(event);
    engine.setTarget(x, y);
  };

  const onPointerLeave = () => {
    if (!canTilt()) return;
    engine.toCenter();
    if (settleRaf) cancelAnimationFrame(settleRaf);

    const waitForCenter = () => {
      if (engine.isSettled()) {
        card.classList.remove("workflow-card-active", "workflow-card-entering");
        settleRaf = null;
        return;
      }
      settleRaf = requestAnimationFrame(waitForCenter);
    };

    settleRaf = requestAnimationFrame(waitForCenter);
  };

  const reset = () => {
    engine.cancel();
    card.classList.remove("workflow-card-active", "workflow-card-entering");
    card.style.setProperty("--pointer-x", "50%");
    card.style.setProperty("--pointer-y", "50%");
    card.style.setProperty("--pointer-from-center", "0");
    card.style.setProperty("--pointer-from-top", ".5");
    card.style.setProperty("--pointer-from-left", ".5");
    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
  };

  card.addEventListener("pointerenter", onPointerEnter);
  card.addEventListener("pointermove", onPointerMove);
  card.addEventListener("pointerleave", onPointerLeave);
  reducedMotion.addEventListener?.("change", reset);
  finePointer.addEventListener?.("change", reset);
}

function initWorkflowCardMotion() {
  document.querySelectorAll("#capabilities .capability-grid > a").forEach(enhanceWorkflowCard);
}

function loadMotionScript(src) {
  return new Promise((resolve, reject) => {
    const existing = [...document.scripts].find((script) => script.src === src);
    if (existing) {
      if (existing.dataset.loaded === "true") resolve();
      else {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.homeMotion = "true";
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    }, { once: true });
    script.addEventListener("error", reject, { once: true });
    document.head.append(script);
  });
}

async function ensureHomeMotionLibraries() {
  if (window.gsap && window.ScrollTrigger) return true;
  try {
    if (!window.gsap) await loadMotionScript(HOME_MOTION_SCRIPTS[0]);
    if (!window.ScrollTrigger) await loadMotionScript(HOME_MOTION_SCRIPTS[1]);
    return Boolean(window.gsap && window.ScrollTrigger);
  } catch (error) {
    console.warn("Home motion enhancement unavailable; continuing with the static experience.", error);
    return false;
  }
}

function initHeroPointer() {
  const hero = document.querySelector(".project-hero");
  const image = hero?.querySelector(".project-hero-image");
  if (!hero || !image || !finePointer.matches || reducedMotion.matches || !window.gsap) return;

  const moveX = window.gsap.quickTo(image, "x", { duration: .8, ease: "power3.out" });
  const moveY = window.gsap.quickTo(image, "y", { duration: .8, ease: "power3.out" });

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const px = clamp(((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100);
    const py = clamp(((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100);
    hero.style.setProperty("--hero-pointer-x", `${px}%`);
    hero.style.setProperty("--hero-pointer-y", `${py}%`);
    moveX((px - 50) * -.08);
    moveY((py - 50) * -.06);
  });

  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--hero-pointer-x", "50%");
    hero.style.setProperty("--hero-pointer-y", "44%");
    moveX(0);
    moveY(0);
  });
}

function initMagneticLinks() {
  if (!finePointer.matches || reducedMotion.matches || !window.gsap) return;
  const links = document.querySelectorAll(".project-hero-actions a, .project-cta-actions a, .discovery-more");

  links.forEach((link) => {
    const moveX = window.gsap.quickTo(link, "x", { duration: .35, ease: "power3.out" });
    const moveY = window.gsap.quickTo(link, "y", { duration: .35, ease: "power3.out" });

    link.addEventListener("pointermove", (event) => {
      const rect = link.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      moveX(clamp(dx * .16, -10, 10));
      moveY(clamp(dy * .16, -8, 8));
    });

    link.addEventListener("pointerleave", () => {
      moveX(0);
      moveY(0);
    });
  });
}

function replayHeroIntroMotion() {
  if (reducedMotion.matches || !window.gsap) return;
  if (window.scrollY > 120) {
    window.ScrollTrigger?.refresh();
    return;
  }

  const hero = document.querySelector(".project-hero");
  const heroContent = hero?.querySelector(".project-hero-content");
  if (!hero || !heroContent) return;

  const heroIntro = [
    heroContent.querySelector(".project-eyebrow"),
    heroContent.querySelector("h1"),
    heroContent.querySelector("p:not(.project-eyebrow)"),
    heroContent.querySelector(".project-hero-actions"),
  ].filter(Boolean);
  const scrollHint = hero.querySelector(".project-scroll");
  if (!heroIntro.length) return;

  heroIntroTimeline?.kill();
  window.gsap.set([...heroIntro, scrollHint].filter(Boolean), { clearProps: "opacity,visibility,transform" });

  heroIntroTimeline = window.gsap.timeline({ defaults: { ease: "power3.out" } });
  heroIntroTimeline
    .from(heroIntro[0], { autoAlpha: 0, y: 18, duration: .55, clearProps: "opacity,visibility,transform" })
    .from(heroIntro[1], { autoAlpha: 0, y: 52, duration: .9, clearProps: "opacity,visibility,transform" }, "-=.28")
    .from(heroIntro[2], { autoAlpha: 0, y: 24, duration: .65, clearProps: "opacity,visibility,transform" }, "-=.48")
    .from(heroIntro[3], { autoAlpha: 0, y: 20, duration: .6, clearProps: "opacity,visibility,transform" }, "-=.42");

  if (scrollHint) {
    heroIntroTimeline.from(scrollHint, { autoAlpha: 0, y: 16, duration: .5, clearProps: "opacity,visibility,transform" }, "-=.24");
  }
}

function initHomeMotion() {
  if (reducedMotion.matches || !window.gsap || !window.ScrollTrigger) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add("home-motion-active");

  const hero = document.querySelector(".project-hero");
  const heroImage = hero?.querySelector(".project-hero-image");
  const heroContent = hero?.querySelector(".project-hero-content");
  homeMotionInitialized = true;
  replayHeroIntroMotion();

  if (hero && heroImage && heroContent) {
    gsap.to(heroImage, {
      scale: 1.13,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: .8 },
    });
    gsap.to(heroContent, {
      yPercent: -13,
      autoAlpha: .28,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom 18%", scrub: .8 },
    });
    gsap.to(".project-scroll", {
      autoAlpha: 0,
      y: -18,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "35% top", scrub: true },
    });
  }

  gsap.from(".featured-carousel", {
    autoAlpha: 0,
    filter: "blur(10px)",
    duration: .9,
    ease: "power3.out",
    clearProps: "opacity,visibility,filter",
    scrollTrigger: { trigger: "#cases", start: "top 78%", once: true },
  });
  gsap.from(".featured-carousel-arrow, .featured-carousel-footer", {
    autoAlpha: 0,
    y: 18,
    stagger: .08,
    duration: .65,
    ease: "power3.out",
    clearProps: "opacity,visibility,transform",
    scrollTrigger: { trigger: "#cases", start: "top 68%", once: true },
  });

  gsap.from("#overview article", {
    autoAlpha: 0,
    y: 30,
    stagger: .12,
    duration: .7,
    ease: "power3.out",
    clearProps: "opacity,visibility,transform",
    scrollTrigger: { trigger: "#overview", start: "top 82%", once: true },
  });

  gsap.from("#templates .template-gallery-heading > *", {
    autoAlpha: 0,
    y: 30,
    stagger: .09,
    duration: .65,
    ease: "power3.out",
    clearProps: "opacity,visibility,transform",
    scrollTrigger: { trigger: "#templates", start: "top 76%", once: true },
  });
  gsap.from("#templates .template-filters a", {
    autoAlpha: 0,
    y: 18,
    stagger: .055,
    duration: .5,
    ease: "power3.out",
    clearProps: "opacity,visibility,transform",
    scrollTrigger: { trigger: "#templates .template-filters", start: "top 86%", once: true },
  });
  const activeDiscoveryCard = discoveryCards[activeDiscoveryIndex];
  if (activeDiscoveryCard) {
    gsap.from(activeDiscoveryCard, {
      autoAlpha: 0,
      scale: .96,
      filter: "blur(9px)",
      duration: .75,
      ease: "power3.out",
      clearProps: "opacity,visibility,transform,filter",
      scrollTrigger: { trigger: "#templates .template-grid", start: "top 84%", once: true },
    });
  }

  gsap.from("#capabilities .section-heading > *", {
    autoAlpha: 0,
    y: 30,
    stagger: .1,
    duration: .7,
    ease: "power3.out",
    clearProps: "opacity,visibility,transform",
    scrollTrigger: { trigger: "#capabilities", start: "top 76%", once: true },
  });
  gsap.from("#capabilities .capability-grid > a", {
    autoAlpha: 0,
    filter: "blur(10px)",
    clipPath: "inset(9% 0 0 0 round 8px)",
    stagger: .12,
    duration: .8,
    ease: "power3.out",
    clearProps: "opacity,visibility,filter,clipPath",
    scrollTrigger: { trigger: "#capabilities .capability-grid", start: "top 82%", once: true },
  });
  gsap.from("#capabilities .workflow-source", {
    autoAlpha: 0,
    y: 12,
    duration: .5,
    ease: "power3.out",
    clearProps: "opacity,visibility,transform",
    scrollTrigger: { trigger: "#capabilities .capability-grid", start: "bottom 90%", once: true },
  });

  gsap.from("#design-system .showcase-copy > *", {
    autoAlpha: 0,
    y: 28,
    stagger: .09,
    duration: .7,
    ease: "power3.out",
    clearProps: "opacity,visibility,transform",
    scrollTrigger: { trigger: "#design-system", start: "top 72%", once: true },
  });
  gsap.from("#design-system .showcase-card", {
    autoAlpha: 0,
    y: 86,
    rotation: 0,
    scale: .88,
    stagger: .11,
    duration: .9,
    ease: "power3.out",
    clearProps: "opacity,visibility,transform",
    scrollTrigger: { trigger: "#design-system .showcase-scene", start: "top 82%", once: true },
  });

  gsap.from("#design-system-live .system-explainer-heading > *", {
    autoAlpha: 0,
    y: 28,
    stagger: .09,
    duration: .7,
    ease: "power3.out",
    clearProps: "opacity,visibility,transform",
    scrollTrigger: { trigger: "#design-system-live", start: "top 76%", once: true },
  });

  const liveTimeline = gsap.timeline({
    defaults: { ease: "power3.out" },
    scrollTrigger: {
      trigger: "#design-system-live .system-explainer-stage",
      start: "top 78%",
      once: true,
    },
  });
  liveTimeline
    .from("#design-system-live .system-app", {
      autoAlpha: 0,
      y: 22,
      scale: .985,
      filter: "blur(12px)",
      duration: .68,
      clearProps: "opacity,visibility,transform,filter",
    })
    .from("#design-system-live .system-callout-type", {
      autoAlpha: 0,
      x: -42,
      y: -16,
      scale: .94,
      duration: .52,
      clearProps: "opacity,visibility,transform",
    }, "-=.08")
    .from("#design-system-live .system-callout-color", {
      autoAlpha: 0,
      x: 42,
      y: -16,
      scale: .94,
      duration: .52,
      clearProps: "opacity,visibility,transform",
    }, "-=.34")
    .from("#design-system-live .system-callout-spacing", {
      autoAlpha: 0,
      x: -42,
      y: 16,
      scale: .94,
      duration: .52,
      clearProps: "opacity,visibility,transform",
    }, "-=.34")
    .from("#design-system-live .system-callout-states", {
      autoAlpha: 0,
      x: 42,
      y: 16,
      scale: .94,
      duration: .52,
      clearProps: "opacity,visibility,transform",
    }, "-=.34");

  gsap.from(".project-editorial .project-container > *, .project-cta-inner > *", {
    autoAlpha: 0,
    y: 34,
    stagger: .1,
    duration: .75,
    ease: "power3.out",
    clearProps: "opacity,visibility,transform",
    scrollTrigger: { trigger: ".project-editorial", start: "top 76%", once: true },
  });
  gsap.from(".project-footer .footer-grid > *, .project-footer .footer-bottom > *", {
    autoAlpha: 0,
    y: 22,
    stagger: .055,
    duration: .6,
    ease: "power3.out",
    clearProps: "opacity,visibility,transform",
    scrollTrigger: { trigger: ".project-footer", start: "top 88%", once: true },
  });

  initHeroPointer();
  initMagneticLinks();
  window.setTimeout(() => ScrollTrigger.refresh(), 120);
}

ensureDiscoveryEnhancement();
renderCarousel();
scheduleAutoplay();
initStatsCounter();
initWorkflowCardMotion();

applyLanguage();
if (window.image2I18n?.registerPage) window.image2I18n.registerPage((language) => applyLanguage({ detail: language }));
else window.addEventListener("image2:languagechange", applyLanguage);

if (!reducedMotion.matches) {
  ensureHomeMotionLibraries().then((ready) => {
    if (ready) initHomeMotion();
  });
}

// Reuse the real Vocabulary navigation cards in the Home discovery strip.
// The Vocabulary page remains the source of truth; this renderer mirrors the
// same three terms and code-preview structures without turning them into images.
const HOME_VOCABULARY_DISCOVERY_INDEX = 4;
const HOME_VOCABULARY_ITEMS = [
  {
    id: "top-nav",
    zh: "顶部导航栏",
    en: "Navbar",
    askZh: "logo、主要栏目和登录入口都放在最上面，还要看得出当前在哪。",
    askEn: "Put the logo, primary sections, and sign-in entry at the top, and make the current location clear.",
    tagsZh: ["导航", "code-ui", "全局"],
    tagsEn: ["Navigation", "Code UI", "Global"],
    preview: "top-nav",
  },
  {
    id: "sidebar",
    zh: "侧边栏",
    en: "Sidebar",
    askZh: "左边固定一列放工作区和主要入口，内容滚动时它还在。",
    askEn: "Keep workspaces and primary destinations in a column on the left while the main content scrolls.",
    tagsZh: ["导航", "工作台", "响应式"],
    tagsEn: ["Navigation", "Workspace", "Responsive"],
    preview: "sidebar",
  },
  {
    id: "bottom-tabs",
    zh: "底部标签栏",
    en: "Bottom Tab Bar",
    askZh: "手机底部固定几个入口，首页、收藏和个人资料随时能切换。",
    askEn: "Keep Home, Favorites, and Profile available from a fixed bar at the bottom of the phone.",
    tagsZh: ["移动端", "导航", "code-icon"],
    tagsEn: ["Mobile", "Navigation", "Code icon"],
    preview: "bottom-tabs",
  },
];

function homeVocabularyPreviewMarkup(type) {
  if (type === "top-nav") return `
    <div class="vp-navbar">
      <div class="vp-navbar-head"><span class="vp-wordmark"><i></i>NORTH STUDIO</span><div class="vp-nav-links"><b class="is-active">Home</b><b>Work</b><b>About</b></div><span class="vp-nav-action">Contact</span></div>
      <main class="vp-navbar-content"><small>FEATURED</small><strong>Make room for everyday life</strong><p>Quiet, clear, and focused on what matters most.</p><div class="vp-navbar-cards"><span><b>Projects</b><small>Design system update</small></span><span><b>Analytics</b><small>Summer product research</small></span><span><b>Team</b><small>Team working notes</small></span></div></main>
    </div>`;
  if (type === "sidebar") return `
    <div class="vp-sidebar-demo"><aside class="vp-side-nav"><span class="vp-side-brand"><i></i>Workspace</span><small>MAIN MENU</small><div class="vp-side-links"><span class="is-active"><i>⌂</i>Overview</span><span><i>□</i>Projects</span><span><i>◇</i>Analytics</span><span><i>○</i>Team</span></div><div class="vp-side-user"><i></i><span>Lin Qing<small>Online</small></span></div></aside><section class="vp-side-page"><div><small>Dashboard</small><span>•••</span></div><h2>Project overview</h2><p>Updated just now</p><div class="vp-side-panels"><i><small>Visitors</small><strong>12,480</strong><em>+18.4%</em></i><i><small>Projects</small><strong>24</strong><em>8 active</em></i></div></section></div>`;
  return `
    <div class="vp-phone"><div class="vp-phone-head">Today<span class="vp-avatar"></span></div><div class="vp-phone-content"><small>FEATURED</small><strong>Make room for everyday life</strong><p>Quiet, clear, and focused on what matters most.</p><div class="vp-phone-card">Explore<b>→</b></div></div><div class="vp-bottom-tabs"><span class="is-active"><i>⌂</i>Home</span><span><i>◇</i>Explore</span><span><i>♡</i>Saved</span><span><i>○</i>Profile</span></div></div>`;
}

function homeVocabularyText(zh, en) {
  return currentLanguage() === "en" ? en : zh;
}

function homeVocabularyCardMarkup(item) {
  const category = homeVocabularyText("导航与发现", "Navigation and discovery");
  const stateVariants = homeVocabularyText("状态变体", "STATE VARIANTS");
  const copyPrompt = homeVocabularyText("复制 Prompt", "Copy prompt");
  const title = homeVocabularyText(item.zh, item.en);
  const ask = homeVocabularyText(item.askZh, item.askEn);
  const tags = (currentLanguage() === "en" ? item.tagsEn : item.tagsZh)
    .map((tag, index) => `<span data-zh="${item.tagsZh[index]}" data-en="${item.tagsEn[index]}">${tag}</span>`)
    .join("");
  return `<article class="entry-card home-vocab-card" data-entry-id="${item.id}">
    <div class="entry-card-inner">
      <section class="entry-card-face entry-card-front">
        <div class="entry-card-body">
          <div class="entry-card-meta"><span data-zh="导航与发现" data-en="Navigation and discovery">${category}</span><span class="entry-flip-tag" data-zh="状态变体 ↻" data-en="STATE VARIANTS ↻">${stateVariants} ↻</span><span class="favorite-button" aria-hidden="true">☆</span></div>
          <h3><span data-zh="${item.zh}" data-en="${item.en}">${title}</span><em>${item.en}</em></h3>
          <p class="entry-ask">“<span data-zh="${item.askZh}" data-en="${item.askEn}">${ask}</span>”</p>
          <div class="entry-visual">${homeVocabularyPreviewMarkup(item.preview)}</div>
          <div class="entry-tags">${tags}</div>
          <span class="copy-prompt"><b data-zh="复制 Prompt" data-en="Copy prompt">${copyPrompt}</b><i aria-hidden="true">▣</i></span>
        </div>
      </section>
    </div>
  </article>`;
}

function ensureHomeVocabularyStyles() {
  if (document.getElementById("homeVocabularyDiscoveryStyles")) return;
  const style = document.createElement("style");
  style.id = "homeVocabularyDiscoveryStyles";
  style.textContent = `
    #templates .template-card.home-vocab-host{display:block!important;width:100%!important;max-width:none!important;aspect-ratio:auto!important;overflow:visible!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;color:#202020!important;cursor:default!important;}
    #templates .template-card.home-vocab-host::before,#templates .template-card.home-vocab-host::after{display:none!important;}
    #templates .home-vocab-strip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;width:100%;overflow-x:auto;overscroll-behavior-inline:contain;scroll-snap-type:x proximity;padding:2px 2px 8px;scrollbar-width:thin;}
    #templates .home-vocab-card{min-width:0;scroll-snap-align:start;border:1px solid #dedede;border-radius:12px;background:#fff;box-shadow:0 4px 18px rgba(0,0,0,.035);color:#222;text-decoration:none;}
    #templates .home-vocab-card .entry-card-inner,#templates .home-vocab-card .entry-card-face,#templates .home-vocab-card .entry-card-body{height:100%;}
    #templates .home-vocab-card .entry-card-body{display:flex;flex-direction:column;padding:22px 20px 18px;}
    #templates .home-vocab-card .entry-card-meta{display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:10px;color:#707070;font-size:11px;line-height:1.2;}
    #templates .home-vocab-card .entry-flip-tag{padding:7px 10px;border:1px solid #bfe1cc;border-radius:6px;background:#f4fbf6;color:#12a85a;font-size:10px;letter-spacing:.035em;white-space:nowrap;}
    #templates .home-vocab-card .favorite-button{font-size:22px;font-weight:300;color:#aaa;line-height:1;}
    #templates .home-vocab-card h3{display:flex;align-items:baseline;gap:8px;margin:20px 0 12px;font-size:28px;font-weight:500;letter-spacing:-.04em;line-height:1.08;}
    #templates .home-vocab-card h3 em{color:#12a85a;font-size:13px;font-style:normal;font-weight:700;letter-spacing:0;}
    html[lang^="en"] #templates .home-vocab-card h3 em{display:none;}
    #templates .home-vocab-card .entry-ask{min-height:54px;margin:0 0 16px;color:#666;font-size:13px;line-height:1.55;}
    #templates .home-vocab-card .entry-visual{display:grid;min-height:250px;place-items:center;padding:14px;border:1px solid #e8e8e8;border-radius:8px;background:#fff;overflow:hidden;}
    #templates .home-vocab-card .entry-tags{display:flex;flex-wrap:wrap;gap:6px;margin:14px 0 16px;}
    #templates .home-vocab-card .entry-tags span{padding:5px 8px;border:1px solid #ddd;border-radius:5px;background:#fff;color:#666;font-size:10px;}
    #templates .home-vocab-card .copy-prompt{display:flex;min-height:42px;align-items:center;justify-content:center;gap:10px;margin-top:auto;border-radius:6px;background:#15ad59;color:#fff;font-size:12px;font-weight:700;}
    #templates .home-vocab-card .copy-prompt i{font-style:normal;font-size:14px;}
    #templates .vp-navbar{width:100%;border:1px solid #d9e0dc;border-radius:6px;overflow:hidden;background:#f5f8f6;color:#26302b;}
    #templates .vp-navbar-head{display:grid;grid-template-columns:1.2fr auto auto;align-items:center;gap:12px;padding:14px;background:#fff;border-bottom:1px solid #dbe2dd;font-size:9px;}
    #templates .vp-wordmark,#templates .vp-side-brand{display:flex;align-items:center;gap:7px;font-weight:800;}
    #templates .vp-wordmark i,#templates .vp-side-brand i{width:13px;height:13px;border-radius:4px;background:#278b5a;}
    #templates .vp-nav-links{display:flex;gap:14px;color:#818781;}
    #templates .vp-nav-links .is-active{color:#16834d;}
    #templates .vp-nav-action{padding:8px 10px;border-radius:5px;background:#278b5a;color:#fff;font-weight:700;}
    #templates .vp-navbar-content{padding:20px 18px 24px;background:linear-gradient(135deg,#f6faf7,#eef5f0);}
    #templates .vp-navbar-content>small,#templates .vp-phone-content>small{color:#16834d;font-size:8px;font-weight:800;letter-spacing:.04em;}
    #templates .vp-navbar-content>strong{display:block;max-width:90%;margin:8px 0 6px;font-size:21px;line-height:1.05;}
    #templates .vp-navbar-content>p{margin:0;color:#7b827d;font-size:9px;}
    #templates .vp-navbar-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:15px;}
    #templates .vp-navbar-cards span{padding:10px;border:1px solid #dce4df;border-radius:6px;background:rgba(255,255,255,.86);}
    #templates .vp-navbar-cards b,#templates .vp-navbar-cards small{display:block;font-size:8px;}
    #templates .vp-navbar-cards small{margin-top:4px;color:#8c928e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    #templates .vp-sidebar-demo{display:grid;width:100%;grid-template-columns:36% 64%;min-height:226px;border:1px solid #d9e0dc;border-radius:6px;overflow:hidden;background:#fff;color:#26302b;}
    #templates .vp-side-nav{display:flex;flex-direction:column;padding:13px 10px;border-right:1px solid #dce3de;background:#f5f8f6;}
    #templates .vp-side-nav>small{margin:13px 0 8px;color:#89918b;font-size:7px;}
    #templates .vp-side-links{display:grid;gap:3px;font-size:8px;}
    #templates .vp-side-links span{display:flex;align-items:center;gap:7px;padding:7px;border-radius:5px;color:#66706a;}
    #templates .vp-side-links .is-active{background:#fff;color:#15834c;font-weight:700;}
    #templates .vp-side-links i{font-style:normal;}
    #templates .vp-side-user{display:flex;align-items:center;gap:7px;margin-top:auto;padding-top:10px;border-top:1px solid #dce3de;font-size:8px;}
    #templates .vp-side-user>i{width:17px;height:17px;border-radius:50%;background:#c8ef71;}
    #templates .vp-side-user span small{display:block;color:#16834d;font-size:7px;}
    #templates .vp-side-page{padding:14px 13px;}
    #templates .vp-side-page>div:first-child{display:flex;justify-content:space-between;color:#7f8983;font-size:9px;}
    #templates .vp-side-page h2{margin:6px 0 2px;font-size:15px;font-weight:500;}
    #templates .vp-side-page>p{margin:0;color:#7d8580;font-size:7px;}
    #templates .vp-side-panels{display:grid;grid-template-columns:1.3fr 1fr;gap:8px;margin-top:16px;}
    #templates .vp-side-panels>i{display:flex;min-height:96px;flex-direction:column;justify-content:center;padding:10px;border:1px solid #d9e0dc;border-radius:5px;background:#f5f8f6;font-style:normal;}
    #templates .vp-side-panels>i:first-child{background:#d7eadf;}
    #templates .vp-side-panels small{font-size:7px;color:#69736d;}
    #templates .vp-side-panels strong{margin:4px 0;font-size:14px;}
    #templates .vp-side-panels em{color:#16834d;font-size:7px;font-style:normal;}
    #templates .vp-phone{display:flex;width:min(180px,72%);min-height:244px;flex-direction:column;border:2px solid #27322c;border-radius:14px;background:#fff;overflow:hidden;color:#26302b;}
    #templates .vp-phone-head{display:flex;align-items:center;justify-content:space-between;padding:16px 12px 10px;font-size:9px;font-weight:800;}
    #templates .vp-avatar{display:inline-block;width:13px;height:13px;border-radius:50%;background:#c8ef71;}
    #templates .vp-phone-content{padding:24px 12px 12px;}
    #templates .vp-phone-content>strong{display:block;margin:7px 0 3px;font-size:11px;line-height:1.2;}
    #templates .vp-phone-content>p{margin:0;color:#7c847f;font-size:6px;line-height:1.45;}
    #templates .vp-phone-card{display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding:10px;border-radius:5px;background:#469e6d;color:#fff;font-size:7px;font-weight:700;}
    #templates .vp-bottom-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-top:auto;padding:11px 7px;border-top:1px solid #d8dfda;font-size:6px;text-align:center;color:#747d77;}
    #templates .vp-bottom-tabs span{display:grid;gap:3px;justify-items:center;}
    #templates .vp-bottom-tabs i{font-style:normal;font-size:10px;}
    #templates .vp-bottom-tabs .is-active{color:#16834d;font-weight:700;}
    @media(max-width:1050px){#templates .home-vocab-strip{grid-template-columns:none;grid-auto-flow:column;grid-auto-columns:minmax(320px,46%);}}
    @media(max-width:680px){#templates .home-vocab-strip{margin-inline:calc((100vw - var(--home-page))/ -2);padding-inline:20px;grid-auto-columns:minmax(286px,86vw);scroll-padding-inline:20px;}#templates .home-vocab-card .entry-card-body{padding:18px 16px 15px;}#templates .home-vocab-card h3{font-size:24px;}#templates .home-vocab-card .entry-visual{min-height:230px;}}
  `;
  document.head.append(style);
}

function initHomeVocabularyDiscovery() {
  const card = discoveryCards[HOME_VOCABULARY_DISCOVERY_INDEX];
  if (!card || card.dataset.homeVocabularyReady === "true") return;
  card.dataset.homeVocabularyReady = "true";
  card.classList.add("home-vocab-host");
  card.removeAttribute("href");
  card.removeAttribute("data-smart-lang-link");
  card.innerHTML = `<div class="home-vocab-strip" role="group" aria-label="UI Vocabulary preview">${HOME_VOCABULARY_ITEMS.map(homeVocabularyCardMarkup).join("")}</div>`;
  card.style.setProperty("--discovery-ratio", "auto");
  card.style.setProperty("--discovery-max-width", "none");
  ensureHomeVocabularyStyles();
}

initHomeVocabularyDiscovery();