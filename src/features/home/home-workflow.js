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

const workflow = document.querySelector("[data-workflow-explorer]");
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

function setWorkflowButtonState(index) {
  workflowButtons.forEach((button, buttonIndex) => {
    const selected = buttonIndex === index;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
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

  const transitionTargets = [workflowImage, workflowDetail].filter(Boolean);
  window.gsap.killTweensOf(transitionTargets);
  window.gsap.to(transitionTargets, {
    autoAlpha: 0,
    y: 14,
    duration: .16,
    ease: "power2.in",
    overwrite: true,
    onComplete: () => {
      applyWorkflowContent(nextIndex);
      window.gsap.fromTo(
        transitionTargets,
        { autoAlpha: 0, y: -12 },
        { autoAlpha: 1, y: 0, duration: .38, ease: "power3.out", overwrite: true },
      );
    },
  });
}

function workflowProgressForIndex(index) {
  return WORKFLOW_STAGES.length <= 1 ? 0 : index / (WORKFLOW_STAGES.length - 1);
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
    rotationX: window.gsap.quickTo(workflowPoster, "rotationX", { duration: .34, ease: "power3.out" }),
    rotationY: window.gsap.quickTo(workflowPoster, "rotationY", { duration: .34, ease: "power3.out" }),
    scale: window.gsap.quickTo(workflowPoster, "scale", { duration: .38, ease: "power3.out" }),
    y: window.gsap.quickTo(workflowPoster, "y", { duration: .38, ease: "power3.out" }),
  };

  return workflowPosterQuickSetters;
}

function resetPosterTilt() {
  if (!workflowPoster) return;
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
      duration: .62,
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
  workflowPoster.classList.add("is-tilting");
  const setters = ensurePosterQuickSetters();
  setters?.scale(1.035);
  setters?.y(-10);
  window.gsap?.to(workflowPoster, {
    boxShadow: "0 38px 82px rgba(0, 0, 0, .18)",
    duration: .32,
    ease: "power2.out",
    overwrite: "auto",
  });
});

workflowPoster?.addEventListener("pointermove", (event) => {
  if (!workflowFinePointer.matches || workflowReducedMotion.matches) return;
  const rect = workflowPoster.getBoundingClientRect();
  const px = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(rect.width, 1)));
  const py = Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(rect.height, 1)));
  workflowPoster.classList.add("is-tilting");
  workflowPoster.style.setProperty("--pointer-x", `${px * 100}%`);
  workflowPoster.style.setProperty("--pointer-y", `${py * 100}%`);

  const setters = ensurePosterQuickSetters();
  if (setters) {
    setters.rotationY((px - .5) * 12);
    setters.rotationX((.5 - py) * 9);
    setters.scale(1.035);
    setters.y(-10);
    return;
  }

  workflowPoster.style.setProperty("--tilt-x", `${(px - .5) * 10}deg`);
  workflowPoster.style.setProperty("--tilt-y", `${(.5 - py) * 8}deg`);
});

workflowPoster?.addEventListener("pointerleave", resetPosterTilt);

function destroyWorkflowScrollMotion() {
  if (workflowGsapRetryFrame) {
    window.cancelAnimationFrame(workflowGsapRetryFrame);
    workflowGsapRetryFrame = 0;
  }
  workflowScrollTrigger?.kill(true);
  workflowScrollTrigger = null;
  workflow?.classList.remove("is-scroll-driven");
  workflow?.style.setProperty("--workflow-scroll-progress", "0deg");
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
    start: "top 10%",
    end: () => `+=${Math.max(window.innerHeight * 2.6, 1900)}`,
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    snap: {
      snapTo: 1 / (WORKFLOW_STAGES.length - 1),
      duration: { min: .18, max: .42 },
      delay: .06,
      ease: "power1.inOut",
    },
    onUpdate: (self) => {
      const index = Math.round(self.progress * (WORKFLOW_STAGES.length - 1));
      workflow.style.setProperty("--workflow-scroll-progress", `${self.progress * 360}deg`);
      if (index !== activeWorkflowIndex) renderWorkflow(index);
    },
  });
}

workflowReducedMotion.addEventListener?.("change", () => {
  resetPosterTilt();
  initWorkflowScrollMotion();
});
workflowFinePointer.addEventListener?.("change", resetPosterTilt);
workflowDesktop.addEventListener?.("change", () => initWorkflowScrollMotion());
window.addEventListener("resize", () => workflowScrollTrigger?.refresh());
window.addEventListener("image2:languagechange", () => renderWorkflow(activeWorkflowIndex, { animate: false }));

const workflowLanguageObserver = new MutationObserver(() => renderWorkflow(activeWorkflowIndex, { animate: false }));
workflowLanguageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

renderWorkflow(0, { animate: false });
initWorkflowScrollMotion();
