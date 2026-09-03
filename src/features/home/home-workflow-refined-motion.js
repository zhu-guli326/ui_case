(() => {
  const STAGES = [
    {
      label: "DEFINE",
      image: "./assets/home/figures/steve-jobs.png",
      route: "./library.html",
      alt: { zh: "史蒂夫·乔布斯像素人物肖像", en: "Pixel portrait of Steve Jobs" },
      person: { zh: "史蒂夫·乔布斯", en: "Steve Jobs" },
      title: { zh: "判断什么值得做", en: "Decide what matters" },
      body: {
        zh: "判断、聚焦和取舍。先确定真正重要的目标、页面和参考，再开始设计。",
        en: "Judgment, focus, and trade-offs. Define the goal, page, and references before you start designing.",
      },
    },
    {
      label: "CREATE",
      image: "./assets/home/figures/leonardo-da-vinci.png",
      route: "./vocabulary.html",
      alt: { zh: "达·芬奇像素人物肖像", en: "Pixel portrait of Leonardo da Vinci" },
      person: { zh: "达·芬奇", en: "Leonardo da Vinci" },
      title: { zh: "把想法组织成视觉", en: "Turn ideas into a visual system" },
      body: {
        zh: "创造、整合和表达。把参考拆成布局、字体、颜色与组件，再组合成一个完整的视觉方向。",
        en: "Creation, synthesis, and expression. Break references into layout, type, color, and components, then combine them into one coherent visual direction.",
      },
    },
    {
      label: "BUILD",
      image: "./assets/home/figures/bill-gates.png",
      route: "./launcher.html",
      alt: { zh: "比尔·盖茨像素人物肖像", en: "Pixel portrait of Bill Gates" },
      person: { zh: "比尔·盖茨", en: "Bill Gates" },
      title: { zh: "把规则变成产品", en: "Turn rules into a product" },
      body: {
        zh: "软件、系统和实现。把 Design DNA 交给 AI Coding，让设计规则真正进入代码并运行起来。",
        en: "Software, systems, and implementation. Hand the Design DNA to AI coding so the design rules become working product code.",
      },
    },
    {
      label: "ITERATE",
      image: "./assets/home/figures/thomas-edison.png",
      route: "./launcher.html",
      alt: { zh: "爱迪生像素人物肖像", en: "Pixel portrait of Thomas Edison" },
      person: { zh: "爱迪生", en: "Thomas Edison" },
      title: { zh: "不断验证，直到成立", en: "Validate until it holds up" },
      body: {
        zh: "实验、验证和迭代。持续对照结果、调整问题，直到界面好看、统一，也真的能用。",
        en: "Experimentation, validation, and iteration. Compare, refine, and repeat until the interface looks coherent and works in practice.",
      },
    },
  ];

  const BOUNDARIES = [0.24, 0.5, 0.76];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktop = window.matchMedia("(min-width: 901px)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  function language() {
    if (document.documentElement.lang === "en") return "en";
    return new URLSearchParams(location.search).get("lang") === "en" ? "en" : "zh";
  }

  function hrefFor(route) {
    const target = new URL(route, location.href);
    target.searchParams.set("lang", language());
    return `${target.pathname.split("/").pop()}${target.search}${target.hash}`;
  }

  function indexForProgress(progress) {
    if (progress < BOUNDARIES[0]) return 0;
    if (progress < BOUNDARIES[1]) return 1;
    if (progress < BOUNDARIES[2]) return 2;
    return 3;
  }

  function init(attempt = 0) {
    const workflow = document.querySelector("[data-workflow-explorer]");
    if (!workflow) return;
    if (!window.gsap || !window.ScrollTrigger) {
      if (attempt < 240) requestAnimationFrame(() => init(attempt + 1));
      return;
    }
    if (workflow.dataset.refinedMotion === "true") return;
    workflow.dataset.refinedMotion = "true";

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const section = workflow.closest("#capabilities");
    const buttons = [...workflow.querySelectorAll("[data-workflow-stage]")];
    const poster = workflow.querySelector("[data-workflow-poster]");
    const image = workflow.querySelector("[data-workflow-image]");
    const detail = workflow.querySelector(".workflow-detail");
    const title = workflow.querySelector("[data-workflow-title]");
    const body = workflow.querySelector("[data-workflow-body]");
    let person = workflow.querySelector("[data-workflow-person]");
    let activeIndex = Math.max(0, buttons.findIndex((button) => button.getAttribute("aria-selected") === "true"));
    let scrollTrigger = null;
    let tiltSetters = null;
    let posterRect = null;

    if (detail && title && !person) {
      person = document.createElement("p");
      person.className = "workflow-person";
      person.dataset.workflowPerson = "";
      detail.insertBefore(person, title);
    }

    // The legacy trigger uses abrupt stage changes and also makes the heading sticky,
    // which can visually collide with the workflow. Replace only that trigger.
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.trigger === workflow) trigger.kill(true);
    });

    function applyContent(index) {
      const stage = STAGES[index];
      const lang = language();
      if (image) {
        image.src = new URL(stage.image, location.href).href;
        image.alt = stage.alt[lang];
      }
      if (poster) {
        poster.href = hrefFor(stage.route);
        poster.dataset.smartLangLink = stage.route;
        poster.setAttribute("aria-label", `${stage.label}: ${stage.person[lang]} — ${stage.title[lang]}`);
      }
      if (person) person.textContent = stage.person[lang];
      if (title) title.textContent = stage.title[lang];
      if (body) body.textContent = stage.body[lang];
    }

    function setButtons(index, animate = true) {
      buttons.forEach((button, buttonIndex) => {
        const selected = buttonIndex === index;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-selected", String(selected));
        button.tabIndex = selected ? 0 : -1;

        if (!desktop.matches || reducedMotion.matches || !animate) {
          gsap.set(button, {
            scale: 1,
            y: 0,
            opacity: selected ? 1 : 0.28,
            letterSpacing: selected ? "-.025em" : "-.015em",
            transformOrigin: "left center",
          });
          return;
        }

        gsap.killTweensOf(button);
        gsap.to(button, {
          scale: 1,
          y: 0,
          opacity: selected ? 1 : 0.28,
          letterSpacing: selected ? "-.025em" : "-.015em",
          transformOrigin: "left center",
          duration: selected ? 0.7 : 0.52,
          ease: "power2.out",
          overwrite: true,
        });
      });
    }

    function render(index, { animate = true } = {}) {
      const nextIndex = Math.max(0, Math.min(STAGES.length - 1, index));
      const changed = nextIndex !== activeIndex;
      activeIndex = nextIndex;
      setButtons(nextIndex, animate);

      if (!changed || !animate || reducedMotion.matches) {
        applyContent(nextIndex);
        return;
      }

      const targets = [image, detail].filter(Boolean);
      gsap.killTweensOf(targets);

      const timeline = gsap.timeline({ defaults: { overwrite: "auto" } });

      if (image) {
        timeline.to(image, {
          autoAlpha: 0,
          y: 8,
          scale: 0.995,
          filter: "blur(6px)",
          duration: 0.34,
          ease: "power1.inOut",
        }, 0);
      }

      if (detail) {
        timeline.to(detail, {
          autoAlpha: 0,
          y: 7,
          filter: "blur(3px)",
          duration: 0.28,
          ease: "power1.inOut",
        }, 0.02);
      }

      timeline.add(() => applyContent(nextIndex), 0.32);

      if (image) {
        timeline.fromTo(image,
          { autoAlpha: 0, y: 12, scale: 1.004, filter: "blur(7px)" },
          { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.72, ease: "power2.out" },
          0.34,
        );
      }

      if (detail) {
        timeline.fromTo(detail,
          { autoAlpha: 0, y: 14, filter: "blur(4px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.64, ease: "power2.out" },
          0.42,
        );
      }
    }

    function buildScrollTrigger() {
      scrollTrigger?.kill(true);
      scrollTrigger = null;
      if (!desktop.matches || reducedMotion.matches) return;

      scrollTrigger = ScrollTrigger.create({
        trigger: workflow,
        start: "top 24%",
        end: () => `+=${Math.max(window.innerHeight * 2.55, 1850)}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: (self) => render(indexForProgress(self.progress), { animate: false }),
        onUpdate: (self) => {
          const index = indexForProgress(self.progress);
          if (index !== activeIndex) render(index);
        },
      });
    }

    function scrollToStage(index) {
      render(index);
      if (!scrollTrigger || !desktop.matches) return;
      const progress = STAGES.length <= 1 ? 0 : index / (STAGES.length - 1);
      const top = scrollTrigger.start + ((scrollTrigger.end - scrollTrigger.start) * progress);
      window.scrollTo({ top, behavior: reducedMotion.matches ? "auto" : "smooth" });
    }

    buttons.forEach((button, index) => {
      button.addEventListener("mouseenter", (event) => {
        event.stopImmediatePropagation();
        render(index);
      }, true);
      button.addEventListener("focus", (event) => {
        event.stopImmediatePropagation();
        render(index);
      }, true);
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        scrollToStage(index);
      }, true);
      button.addEventListener("keydown", (event) => {
        if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(event.key)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
        const nextIndex = (index + direction + STAGES.length) % STAGES.length;
        buttons[nextIndex]?.focus();
      }, true);
    });

    function ensureTiltSetters() {
      if (!poster) return null;
      if (tiltSetters) return tiltSetters;
      gsap.set(poster, { transformPerspective: 1200, transformOrigin: "50% 50%", force3D: true });
      tiltSetters = {
        rotationX: gsap.quickTo(poster, "rotationX", { duration: 0.62, ease: "power2.out" }),
        rotationY: gsap.quickTo(poster, "rotationY", { duration: 0.62, ease: "power2.out" }),
        scale: gsap.quickTo(poster, "scale", { duration: 0.64, ease: "power2.out" }),
        y: gsap.quickTo(poster, "y", { duration: 0.64, ease: "power2.out" }),
      };
      return tiltSetters;
    }

    function resetTilt(event) {
      if (event) event.stopImmediatePropagation();
      posterRect = null;
      if (!poster) return;
      poster.classList.remove("is-tilting");
      poster.style.setProperty("--pointer-x", "50%");
      poster.style.setProperty("--pointer-y", "50%");
      gsap.to(poster, {
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        y: 0,
        boxShadow: "0 24px 54px rgba(0, 0, 0, .11)",
        duration: 0.82,
        ease: "power2.out",
        overwrite: true,
      });
    }

    poster?.addEventListener("pointerenter", (event) => {
      event.stopImmediatePropagation();
      if (!finePointer.matches || reducedMotion.matches) return;
      posterRect = poster.getBoundingClientRect();
      poster.classList.add("is-tilting");
      const setters = ensureTiltSetters();
      setters?.scale(1.006);
      setters?.y(-2);
      gsap.to(poster, {
        boxShadow: "0 28px 60px rgba(0, 0, 0, .13)",
        duration: 0.6,
        ease: "power2.out",
        overwrite: true,
      });
    }, true);

    poster?.addEventListener("pointermove", (event) => {
      event.stopImmediatePropagation();
      if (!finePointer.matches || reducedMotion.matches) return;
      const rect = posterRect || poster.getBoundingClientRect();
      const px = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(rect.width, 1)));
      const py = Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(rect.height, 1)));
      poster.style.setProperty("--pointer-x", `${px * 100}%`);
      poster.style.setProperty("--pointer-y", `${py * 100}%`);
      const setters = ensureTiltSetters();
      setters?.rotationY((px - 0.5) * 4.2);
      setters?.rotationX((0.5 - py) * 3.2);
      setters?.scale(1.006);
      setters?.y(-2);
    }, true);

    poster?.addEventListener("pointerleave", resetTilt, true);

    reducedMotion.addEventListener?.("change", () => {
      resetTilt();
      setButtons(activeIndex, false);
      buildScrollTrigger();
    });
    desktop.addEventListener?.("change", () => {
      setButtons(activeIndex, false);
      buildScrollTrigger();
    });
    window.addEventListener("resize", () => {
      posterRect = null;
      scrollTrigger?.refresh();
    });
    window.addEventListener("image2:languagechange", () => applyContent(activeIndex));

    const languageObserver = new MutationObserver(() => applyContent(activeIndex));
    languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

    setButtons(activeIndex, false);
    applyContent(activeIndex);
    buildScrollTrigger();
  }

  const start = () => requestAnimationFrame(() => requestAnimationFrame(() => init()));
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
