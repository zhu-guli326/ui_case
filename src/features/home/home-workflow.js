const WORKFLOW_STAGES = [
  {
    label: "DEFINE",
    image: "./assets/home/figures/steve-jobs.png",
    route: "./library.html",
    alt: {
      zh: "史蒂夫·乔布斯像素人物肖像",
      en: "Pixel portrait of Steve Jobs",
    },
    person: {
      zh: "史蒂夫·乔布斯",
      en: "Steve Jobs",
    },
    title: {
      zh: "判断什么值得做",
      en: "Decide what matters",
    },
    body: {
      zh: "判断、聚焦和取舍。先确定真正重要的目标、页面和参考，再开始设计。",
      en: "Judgment, focus, and trade-offs. Define the goal, page, and references before you start designing.",
    },
  },
  {
    label: "CREATE",
    image: "./assets/home/figures/leonardo-da-vinci.png",
    route: "./vocabulary.html",
    alt: {
      zh: "达·芬奇像素人物肖像",
      en: "Pixel portrait of Leonardo da Vinci",
    },
    person: {
      zh: "达·芬奇",
      en: "Leonardo da Vinci",
    },
    title: {
      zh: "把想法组织成视觉",
      en: "Turn ideas into a visual system",
    },
    body: {
      zh: "创造、整合和表达。把参考拆成布局、字体、颜色与组件，再组合成一个完整的视觉方向。",
      en: "Creation, synthesis, and expression. Break references into layout, type, color, and components, then combine them into one coherent visual direction.",
    },
  },
  {
    label: "BUILD",
    image: "./assets/home/figures/bill-gates.png",
    route: "./launcher.html",
    alt: {
      zh: "比尔·盖茨像素人物肖像",
      en: "Pixel portrait of Bill Gates",
    },
    person: {
      zh: "比尔·盖茨",
      en: "Bill Gates",
    },
    title: {
      zh: "把规则变成产品",
      en: "Turn rules into a product",
    },
    body: {
      zh: "软件、系统和实现。把 Design DNA 交给 AI Coding，让设计规则真正进入代码并运行起来。",
      en: "Software, systems, and implementation. Hand the Design DNA to AI coding so the design rules become working product code.",
    },
  },
  {
    label: "ITERATE",
    image: "./assets/home/figures/thomas-edison.png",
    route: "./launcher.html",
    alt: {
      zh: "爱迪生像素人物肖像",
      en: "Pixel portrait of Thomas Edison",
    },
    person: {
      zh: "爱迪生",
      en: "Thomas Edison",
    },
    title: {
      zh: "不断验证，直到成立",
      en: "Validate until it holds up",
    },
    body: {
      zh: "实验、验证和迭代。持续对照结果、调整问题，直到界面好看、统一，也真的能用。",
      en: "Experimentation, validation, and iteration. Compare, refine, and repeat until the interface looks coherent and works in practice.",
    },
  },
];

const WORKFLOW_STAGE_BOUNDARIES = [0.24, 0.5, 0.76];

const workflow = document.querySelector("[data-workflow-explorer]");
const workflowSection = workflow?.closest("#capabilities");
const workflowHeading = workflowSection?.querySelector(".section-heading");
const workflowButtons = [...(workflow?.querySelectorAll("[data-workflow-stage]") || [])];
const workflowPoster = workflow?.querySelector("[data-workflow-poster]");
const workflowImage = workflow?.querySelector("[data-workflow-image]");
const workflowDetail = workflow?.querySelector(".workflow-detail");
const workflowTitle = workflow?.querySelector("[data-workflow-title]");
const workflowBody = workflow?.querySelector("[data-workflow-body]");
const workflowReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const workflowFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const workflowDesktop = window.matchMedia("(min-width: 901px)");

let workflowPerson = workflow?.querySelector("[data-workflow-person]");
let activeWorkflowIndex = 0;
let workflowScrollTrigger = null;
let workflowGsapRetryFrame = 0;
let workflowPosterQuickSetters = null;
let workflowPosterPointerRect = null;

if (workflowDetail && workflowTitle && !workflowPerson) {
  workflowPerson = document.createElement("p");
  workflowPerson.className = "workflow-person";
  workflowPerson.dataset.workflowPerson = "";
  workflowDetail.insertBefore(workflowPerson, workflowTitle);
}

WORKFLOW_STAGES.forEach((stage) => {
  const image = new Image();
  image.src = new URL(stage.image, location.href).href;
});

function workflowLanguage() {
  if (document.documentElement.lang === "en") return "en";
  return new URLSearchParams(location.search).get("lang") === "en" ? "en" : "zh";
}

function workflowHref(route) {
  const target = new URL(route, location.href);
  target.searchParams.set("lang", workflowLanguage());
  return `${target.pathname.split("/").pop()}${target.search}${target.hash}`;
}

function applyWorkflowEditorialSpacing() {
  if (!workflowHeading) return;

  if (workflowDesktop.matches) {
    workflowHeading.style.marginBottom = "clamp(22px, 2.1vw, 32px)";
    return;
  }

  workflowHeading.style.removeProperty("margin-bottom");
}

function applyWorkflowContent(index) {
  const stage = WORKFLOW_STAGES[index];
  const language = workflowLanguage();

  if (workflowImage) {
    workflowImage.src = new URL(stage.image, location.href).href;
    workflowImage.alt = stage.alt[language];
  }

  if (workflowPoster) {
    workflowPoster.href = workflowHref(stage.route);
    workflowPoster.dataset.smartLangLink = stage.route;
    workflowPoster.setAttribute("aria-label", `${stage.label}: ${stage.person[language]} — ${stage.title[language]}`);
  }

  if (workflowPerson) workflowPerson.textContent = stage.person[language];
  if (workflowTitle) workflowTitle.textContent = stage.title[language];
  if (workflowBody) workflowBody.textContent = stage.body[language];
}

function workflowStageScale(buttonIndex, activeIndex) {
  const distance = Math.abs(buttonIndex - activeIndex);
  if (distance === 0) return 1.06;
  if (distance === 1) return 0.92;
  if (distance === 2) return 0.87;
  return 0.83;
}

function setWorkflowButtonState(index) {
  workflowButtons.forEach((button, buttonIndex) => {
    const wasSelected = button.classList.contains("is-active");
    const selected = buttonIndex === index;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;

    if (!workflowDesktop.matches) {
      button.style.removeProperty("transition-property");
      button.style.removeProperty("will-change");
      if (window.gsap) window.gsap.set(button, { clearProps: "transform,opacity,transformOrigin,y,letterSpacing" });
      else {
        button.style.removeProperty("transform");
        button.style.removeProperty("opacity");
        button.style.removeProperty("transform-origin");
        button.style.removeProperty("letter-spacing");
      }
      return;
    }

    const distance = Math.abs(buttonIndex - index);
    const scale = workflowStageScale(buttonIndex, index);
    const opacity = selected ? 1 : Math.max(0.5, 0.76 - (distance * 0.08));
    const y = selected ? 0 : Math.min(distance * 2, 5);
    const letterSpacing = selected ? "-.045em" : "-.025em";

    button.style.transitionProperty = "color";
    button.style.willChange = "transform, opacity";

    if (window.gsap && !workflowReducedMotion.matches) {
      window.gsap.killTweensOf(button);

      if (selected && !wasSelected) {
        window.gsap.fromTo(
          button,
          {
            scale: 0.82,
            opacity: 0.42,
            y: 8,
            letterSpacing: ".01em",
            transformOrigin: "left center",
          },
          {
            scale,
            opacity,
            y,
            letterSpacing,
            transformOrigin: "left center",
            duration: 0.62,
            ease: "power3.out",
            overwrite: true,
          },
        );
        return;
      }

      window.gsap.to(button, {
        scale,
        opacity,
        y,
        letterSpacing,
        transformOrigin: "left center",
        duration: selected ? 0.46 : 0.38,
        ease: "power3.out",
        overwrite: true,
      });
      return;
    }

    button.style.transformOrigin = "left center";
    button.style.transform = `translateY(${y}px) scale(${scale})`;
    button.style.opacity = String(opacity);
    button.style.letterSpacing = letterSpacing;
  });
}

function renderWorkflow(index = activeWorkflowIndex, { animate = true } = {}) {
  if (!workflow) return;
  const nextIndex = Math.max(0, Math.min(WORKFLOW_STAGES.length - 1, index));
  const changed = nextIndex !== activeWorkflowIndex;
  activeWorkflowIndex = nextIndex;
  setWorkflowButtonState(nextIndex);

  if (!changed || !animate || workflowReducedMotion.matches || !window.gsap) {
    applyWorkflowContent(nextIndex);
    return;
  }

  const { gsap } = window;
  const targets = [workflowImage, workflowDetail].filter(Boolean);
  gsap.killTweensOf(targets);

  const timeline = gsap.timeline({
    defaults: { overwrite: "auto" },
    onComplete: () => {
      gsap.set(targets, { clearProps: "opacity,visibility,transform,filter" });
    },
  });

  if (workflowImage) {
    timeline.to(workflowImage, {
      autoAlpha: 0,
      y: 18,
      scale: 0.985,
      filter: "blur(4px)",
      duration: 0.2,
      ease: "power2.inOut",
    }, 0);
  }

  if (workflowDetail) {
    timeline.to(workflowDetail, {
      autoAlpha: 0,
      y: 10,
      duration: 0.18,
      ease: "power2.inOut",
    }, 0);
  }

  timeline.add(() => applyWorkflowContent(nextIndex), 0.2);

  if (workflowImage) {
    timeline.fromTo(workflowImage,
      { autoAlpha: 0, y: -14, scale: 1.012, filter: "blur(6px)" },
      { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.46, ease: "power3.out" },
      0.22,
    );
  }

  if (workflowDetail) {
    timeline.fromTo(workflowDetail,
      { autoAlpha: 0, y: -8 },
      { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" },
      0.28,
    );
  }
}

function workflowProgressForIndex(index) {
  return WORKFLOW_STAGES.length <= 1 ? 0 : index / (WORKFLOW_STAGES.length - 1);
}

function workflowIndexForProgress(progress) {
  if (progress < WORKFLOW_STAGE_BOUNDARIES[0]) return 0;
  if (progress < WORKFLOW_STAGE_BOUNDARIES[1]) return 1;
  if (progress < WORKFLOW_STAGE_BOUNDARIES[2]) return 2;
  return 3;
}

function scrollToWorkflowStage(index) {
  const nextIndex = Math.max(0, Math.min(WORKFLOW_STAGES.length - 1, index));
  renderWorkflow(nextIndex);

  if (!workflowScrollTrigger || !workflowDesktop.matches) return;
  const progress = workflowProgressForIndex(nextIndex);
  const targetScroll = workflowScrollTrigger.start + ((workflowScrollTrigger.end - workflowScrollTrigger.start) * progress);
  window.scrollTo({ top: targetScroll, behavior: workflowReducedMotion.matches ? "auto" : "smooth" });
}

workflowButtons.forEach((button, index) => {
  button.addEventListener("mouseenter", () => renderWorkflow(index));
  button.addEventListener("focus", () => renderWorkflow(index));
  button.addEventListener("click", () => scrollToWorkflowStage(index));
  button.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + WORKFLOW_STAGES.length) % WORKFLOW_STAGES.length;
    workflowButtons[nextIndex]?.focus();
  });
});

function ensurePosterQuickSetters() {
  if (!workflowPoster || !window.gsap) return null;
  if (workflowPosterQuickSetters) return workflowPosterQuickSetters;

  window.gsap.set(workflowPoster, {
    transformPerspective: 1100,
    transformOrigin: "50% 50%",
    force3D: true,
  });

  workflowPosterQuickSetters = {
    rotationX: window.gsap.quickTo(workflowPoster, "rotationX", { duration: 0.42, ease: "power3.out" }),
    rotationY: window.gsap.quickTo(workflowPoster, "rotationY", { duration: 0.42, ease: "power3.out" }),
    scale: window.gsap.quickTo(workflowPoster, "scale", { duration: 0.48, ease: "power3.out" }),
    y: window.gsap.quickTo(workflowPoster, "y", { duration: 0.48, ease: "power3.out" }),
  };

  return workflowPosterQuickSetters;
}

function resetPosterTilt() {
  if (!workflowPoster) return;
  workflowPosterPointerRect = null;
  workflowPoster.classList.remove("is-tilting");
  workflowPoster.style.setProperty("--pointer-x", "50%");
  workflowPoster.style.setProperty("--pointer-y", "50%");

  if (window.gsap) {
    window.gsap.to(workflowPoster, {
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      y: 0,
      boxShadow: "0 24px 54px rgba(0, 0, 0, .11)",
      duration: 0.72,
      ease: "power3.out",
      overwrite: "auto",
    });
    return;
  }

  workflowPoster.style.setProperty("--tilt-x", "0deg");
  workflowPoster.style.setProperty("--tilt-y", "0deg");
}

workflowPoster?.addEventListener("pointerenter", () => {
  if (!workflowFinePointer.matches || workflowReducedMotion.matches) return;
  workflowPosterPointerRect = workflowPoster.getBoundingClientRect();
  workflowPoster.classList.add("is-tilting");
  const setters = ensurePosterQuickSetters();
  setters?.scale(1.018);
  setters?.y(-6);
  window.gsap?.to(workflowPoster, {
    boxShadow: "0 34px 72px rgba(0, 0, 0, .16)",
    duration: 0.4,
    ease: "power2.out",
    overwrite: "auto",
  });
});

workflowPoster?.addEventListener("pointermove", (event) => {
  if (!workflowFinePointer.matches || workflowReducedMotion.matches) return;
  const rect = workflowPosterPointerRect || workflowPoster.getBoundingClientRect();
  const px = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(rect.width, 1)));
  const py = Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(rect.height, 1)));

  workflowPoster.classList.add("is-tilting");
  workflowPoster.style.setProperty("--pointer-x", `${px * 100}%`);
  workflowPoster.style.setProperty("--pointer-y", `${py * 100}%`);

  const setters = ensurePosterQuickSetters();
  if (setters) {
    setters.rotationY((px - 0.5) * 8);
    setters.rotationX((0.5 - py) * 6);
    setters.scale(1.018);
    setters.y(-6);
    return;
  }

  workflowPoster.style.setProperty("--tilt-x", `${(px - 0.5) * 8}deg`);
  workflowPoster.style.setProperty("--tilt-y", `${(0.5 - py) * 6}deg`);
});

workflowPoster?.addEventListener("pointerleave", resetPosterTilt);

function setWorkflowHeadingPinned(enabled) {
  if (!workflowHeading) return;

  if (enabled) {
    workflowHeading.style.position = "sticky";
    workflowHeading.style.top = "72px";
    workflowHeading.style.zIndex = "6";
    workflowHeading.style.background = "#fff";
    return;
  }

  workflowHeading.style.removeProperty("position");
  workflowHeading.style.removeProperty("top");
  workflowHeading.style.removeProperty("z-index");
  workflowHeading.style.removeProperty("background");
}

function destroyWorkflowScrollMotion() {
  if (workflowGsapRetryFrame) {
    window.cancelAnimationFrame(workflowGsapRetryFrame);
    workflowGsapRetryFrame = 0;
  }
  workflowScrollTrigger?.kill(true);
  workflowScrollTrigger = null;
  workflow?.classList.remove("is-scroll-driven");
  workflow?.style.setProperty("--workflow-scroll-progress", "0deg");
  setWorkflowHeadingPinned(false);
}

function initWorkflowScrollMotion(attempt = 0) {
  if (!workflow || workflowReducedMotion.matches || !workflowDesktop.matches) {
    destroyWorkflowScrollMotion();
    return;
  }

  if (!window.gsap || !window.ScrollTrigger) {
    if (attempt > 360) return;
    workflowGsapRetryFrame = window.requestAnimationFrame(() => initWorkflowScrollMotion(attempt + 1));
    return;
  }

  destroyWorkflowScrollMotion();
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  workflow.classList.add("is-scroll-driven");

  workflowScrollTrigger = ScrollTrigger.create({
    trigger: workflow,
    start: "top 34%",
    end: () => `+=${Math.max(window.innerHeight * 2.15, 1600)}`,
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onToggle: (self) => {
      setWorkflowHeadingPinned(self.isActive);
    },
    onRefresh: (self) => {
      setWorkflowHeadingPinned(self.isActive);
      const index = workflowIndexForProgress(self.progress);
      workflow.style.setProperty("--workflow-scroll-progress", `${self.progress * 360}deg`);
      renderWorkflow(index, { animate: false });
    },
    onUpdate: (self) => {
      const index = workflowIndexForProgress(self.progress);
      workflow.style.setProperty("--workflow-scroll-progress", `${self.progress * 360}deg`);
      if (index !== activeWorkflowIndex) renderWorkflow(index);
    },
  });
}

workflowReducedMotion.addEventListener?.("change", () => {
  resetPosterTilt();
  setWorkflowButtonState(activeWorkflowIndex);
  initWorkflowScrollMotion();
});
workflowFinePointer.addEventListener?.("change", resetPosterTilt);
workflowDesktop.addEventListener?.("change", () => {
  applyWorkflowEditorialSpacing();
  setWorkflowButtonState(activeWorkflowIndex);
  initWorkflowScrollMotion();
});
window.addEventListener("resize", () => {
  workflowPosterPointerRect = null;
  applyWorkflowEditorialSpacing();
  workflowScrollTrigger?.refresh();
});
window.addEventListener("image2:languagechange", () => renderWorkflow(activeWorkflowIndex, { animate: false }));

const workflowLanguageObserver = new MutationObserver(() => renderWorkflow(activeWorkflowIndex, { animate: false }));
workflowLanguageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

applyWorkflowEditorialSpacing();
renderWorkflow(0, { animate: false });
initWorkflowScrollMotion();
