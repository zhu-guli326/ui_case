const WORKFLOW_STAGES = [
  {
    label: "DEFINE",
    image: "./assets/home/figures/steve-jobs.png",
    route: "./library.html",
    alt: {
      zh: "史蒂夫·乔布斯像素人物肖像",
      en: "Pixel portrait of Steve Jobs",
    },
    title: {
      zh: "判断什么值得做",
      en: "Decide what matters",
    },
    body: {
      zh: "乔布斯代表判断、聚焦和取舍。先确定真正重要的目标、页面和参考，再开始设计。",
      en: "Steve Jobs represents judgment, focus, and trade-offs. Define the goal, page, and references before you start designing.",
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
    title: {
      zh: "把想法变成视觉",
      en: "Turn ideas into visuals",
    },
    body: {
      zh: "达·芬奇代表创造、整合和表达。把参考拆成布局、字体、颜色与组件，再组合成完整的视觉方向。",
      en: "Leonardo da Vinci represents creation, synthesis, and expression. Break references into layout, type, color, and components, then recombine them into one clear direction.",
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
    title: {
      zh: "把规则变成产品",
      en: "Turn rules into products",
    },
    body: {
      zh: "比尔·盖茨代表软件、系统和实现。把 Design DNA 交给 AI Coding，让设计真正进入代码并运行起来。",
      en: "Bill Gates represents software, systems, and implementation. Hand the Design DNA to AI coding so the design becomes working product code.",
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
    title: {
      zh: "不断验证，直到成立",
      en: "Validate until it works",
    },
    body: {
      zh: "爱迪生代表实验、验证和迭代。持续对照结果、调整问题，直到界面好看、统一，也真的能用。",
      en: "Thomas Edison represents experimentation, validation, and iteration. Compare, refine, and repeat until the interface looks coherent and works in practice.",
    },
  },
];

const workflow = document.querySelector("[data-workflow-explorer]");
const workflowButtons = [...(workflow?.querySelectorAll("[data-workflow-stage]") || [])];
const workflowPoster = workflow?.querySelector("[data-workflow-poster]");
const workflowImage = workflow?.querySelector("[data-workflow-image]");
const workflowTitle = workflow?.querySelector("[data-workflow-title]");
const workflowBody = workflow?.querySelector("[data-workflow-body]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

let activeWorkflowIndex = 0;
let workflowTimer = 0;

function workflowLanguage() {
  if (document.documentElement.lang === "en") return "en";
  return new URLSearchParams(location.search).get("lang") === "en" ? "en" : "zh";
}

function workflowHref(route) {
  const target = new URL(route, location.href);
  target.searchParams.set("lang", workflowLanguage());
  return `${target.pathname.split("/").pop()}${target.search}${target.hash}`;
}

function renderWorkflow(index = activeWorkflowIndex) {
  if (!workflow) return;
  activeWorkflowIndex = (index + WORKFLOW_STAGES.length) % WORKFLOW_STAGES.length;
  const stage = WORKFLOW_STAGES[activeWorkflowIndex];
  const language = workflowLanguage();

  workflowButtons.forEach((button, buttonIndex) => {
    const selected = buttonIndex === activeWorkflowIndex;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });

  if (workflowImage) {
    workflowImage.src = new URL(stage.image, location.href).href;
    workflowImage.alt = stage.alt[language];
  }

  if (workflowPoster) {
    workflowPoster.href = workflowHref(stage.route);
    workflowPoster.dataset.smartLangLink = stage.route;
    workflowPoster.setAttribute("aria-label", `${stage.label}: ${stage.title[language]}`);
  }

  if (workflowTitle) workflowTitle.textContent = stage.title[language];
  if (workflowBody) workflowBody.textContent = stage.body[language];
}

function stopWorkflowAutoplay() {
  window.clearInterval(workflowTimer);
  workflowTimer = 0;
  workflow?.classList.add("is-paused");
}

function startWorkflowAutoplay() {
  if (!workflow || reducedMotion.matches) return;
  window.clearInterval(workflowTimer);
  workflow?.classList.remove("is-paused");
  workflowTimer = window.setInterval(() => renderWorkflow(activeWorkflowIndex + 1), 5000);
}

workflowButtons.forEach((button, index) => {
  button.addEventListener("mouseenter", () => {
    stopWorkflowAutoplay();
    renderWorkflow(index);
  });
  button.addEventListener("focus", () => {
    stopWorkflowAutoplay();
    renderWorkflow(index);
  });
  button.addEventListener("click", () => {
    stopWorkflowAutoplay();
    renderWorkflow(index);
  });
});

workflow?.addEventListener("mouseenter", stopWorkflowAutoplay);
workflow?.addEventListener("mouseleave", startWorkflowAutoplay);
workflow?.addEventListener("focusin", stopWorkflowAutoplay);
workflow?.addEventListener("focusout", (event) => {
  if (!workflow.contains(event.relatedTarget)) startWorkflowAutoplay();
});

function resetPosterTilt() {
  if (!workflowPoster) return;
  workflowPoster.classList.remove("is-tilting");
  workflowPoster.style.setProperty("--tilt-x", "0deg");
  workflowPoster.style.setProperty("--tilt-y", "0deg");
  workflowPoster.style.setProperty("--pointer-x", "50%");
  workflowPoster.style.setProperty("--pointer-y", "50%");
}

workflowPoster?.addEventListener("pointermove", (event) => {
  if (!finePointer.matches || reducedMotion.matches) return;
  const rect = workflowPoster.getBoundingClientRect();
  const px = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(rect.width, 1)));
  const py = Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(rect.height, 1)));
  workflowPoster.classList.add("is-tilting");
  workflowPoster.style.setProperty("--pointer-x", `${px * 100}%`);
  workflowPoster.style.setProperty("--pointer-y", `${py * 100}%`);
  workflowPoster.style.setProperty("--tilt-x", `${(px - .5) * 8}deg`);
  workflowPoster.style.setProperty("--tilt-y", `${(.5 - py) * 6}deg`);
});

workflowPoster?.addEventListener("pointerleave", resetPosterTilt);
reducedMotion.addEventListener?.("change", () => {
  resetPosterTilt();
  if (reducedMotion.matches) stopWorkflowAutoplay();
  else startWorkflowAutoplay();
});
finePointer.addEventListener?.("change", resetPosterTilt);

window.addEventListener("image2:languagechange", () => renderWorkflow(activeWorkflowIndex));

renderWorkflow(0);
startWorkflowAutoplay();