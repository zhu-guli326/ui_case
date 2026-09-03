(() => {
  const stages = [
    {
      label: "01 · DEFINE",
      image: "./assets/home/figures/steve-jobs.png",
      route: "./library.html",
      alt: { zh: "史蒂夫·乔布斯像素人物肖像", en: "Pixel portrait of Steve Jobs" },
      title: { zh: "理解真正重要的事", en: "Decide what matters" },
      person: { zh: "史蒂夫·乔布斯", en: "Steve Jobs" },
      note: { zh: "判断 / 聚焦 / 取舍", en: "Judgment / focus / trade-offs" },
    },
    {
      label: "02 · CREATE",
      image: "./assets/home/figures/leonardo-da-vinci.png",
      route: "./vocabulary.html",
      alt: { zh: "达·芬奇像素人物肖像", en: "Pixel portrait of Leonardo da Vinci" },
      title: { zh: "让想法形成完整体验", en: "Shape ideas into an experience" },
      person: { zh: "达·芬奇", en: "Leonardo da Vinci" },
      note: { zh: "创造 / 整合 / 表达", en: "Create / synthesize / express" },
    },
    {
      label: "03 · BUILD",
      image: "./assets/home/figures/bill-gates.png",
      route: "./launcher.html",
      alt: { zh: "比尔·盖茨像素人物肖像", en: "Pixel portrait of Bill Gates" },
      title: { zh: "把想法变成真正运行的产品", en: "Turn ideas into a working product" },
      person: { zh: "比尔·盖茨", en: "Bill Gates" },
      note: { zh: "软件 / 系统 / 实现", en: "Software / systems / implementation" },
    },
    {
      label: "04 · ITERATE",
      image: "./assets/home/figures/thomas-edison.png",
      route: "./launcher.html",
      alt: { zh: "爱迪生像素人物肖像", en: "Pixel portrait of Thomas Edison" },
      title: { zh: "不断验证，直到成立", en: "Validate until it works" },
      person: { zh: "爱迪生", en: "Thomas Edison" },
      note: { zh: "实验 / 验证 / 迭代", en: "Experiment / validate / iterate" },
    },
  ];

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  function lang() {
    if (document.documentElement.lang === "en") return "en";
    return new URLSearchParams(location.search).get("lang") === "en" ? "en" : "zh";
  }

  function hrefFor(route) {
    const url = new URL(route, location.href);
    url.searchParams.set("lang", lang());
    return `${url.pathname.split("/").pop()}${url.search}${url.hash}`;
  }

  function buildCard(stage) {
    const card = document.createElement("a");
    card.href = hrefFor(stage.route);
    card.dataset.smartLangLink = stage.route;
    card.innerHTML = `
      <img src="${stage.image}" alt="${stage.alt[lang()]}" loading="lazy" decoding="async">
      <span class="capability-shade" aria-hidden="true"></span>
      <small>${stage.label}</small>
      <div>
        <strong data-zh="${stage.title.zh}" data-en="${stage.title.en}">${stage.title[lang()]}</strong>
        <p><span data-zh="${stage.person.zh}" data-en="${stage.person.en}">${stage.person[lang()]}</span><span data-zh="${stage.note.zh}" data-en="${stage.note.en}">${stage.note[lang()]}</span></p>
        <i>↗</i>
      </div>`;
    return card;
  }

  function addTilt(card) {
    const initGsap = (attempt = 0) => {
      if (!window.gsap) {
        if (attempt < 240) requestAnimationFrame(() => initGsap(attempt + 1));
        return;
      }

      const { gsap } = window;
      const image = card.querySelector("img");
      let rect = null;

      const rotateX = gsap.quickTo(card, "rotationX", { duration: .32, ease: "power3.out" });
      const rotateY = gsap.quickTo(card, "rotationY", { duration: .32, ease: "power3.out" });
      const scale = gsap.quickTo(card, "scale", { duration: .34, ease: "power3.out" });
      const moveY = gsap.quickTo(card, "y", { duration: .34, ease: "power3.out" });
      const imageX = image ? gsap.quickTo(image, "x", { duration: .4, ease: "power3.out" }) : null;
      const imageY = image ? gsap.quickTo(image, "y", { duration: .4, ease: "power3.out" }) : null;
      const imageScale = image ? gsap.quickTo(image, "scale", { duration: .42, ease: "power3.out" }) : null;

      const reset = () => {
        rect = null;
        card.classList.remove("workflow-card-active");
        card.style.setProperty("--workflow-x", "50%");
        card.style.setProperty("--workflow-y", "50%");
        card.style.setProperty("--workflow-glow", "0");
        rotateX(0);
        rotateY(0);
        scale(1);
        moveY(0);
        imageX?.(0);
        imageY?.(0);
        imageScale?.(1.001);
        gsap.to(card, {
          boxShadow: "0 16px 36px rgba(0,0,0,.10)",
          duration: .58,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      card.addEventListener("pointerenter", () => {
        if (!finePointer.matches || reducedMotion.matches) return;
        rect = card.getBoundingClientRect();
        card.classList.add("workflow-card-active");
        card.style.setProperty("--workflow-glow", "1");
        scale(1.022);
        moveY(-8);
        imageScale?.(1.045);
        gsap.to(card, {
          boxShadow: "0 34px 76px rgba(0,0,0,.20)",
          duration: .3,
          ease: "power2.out",
          overwrite: "auto",
        });
      });

      card.addEventListener("pointermove", (event) => {
        if (!finePointer.matches || reducedMotion.matches) return;
        rect ||= card.getBoundingClientRect();
        const px = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(rect.width, 1)));
        const py = Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(rect.height, 1)));
        const dx = px - .5;
        const dy = py - .5;

        card.style.setProperty("--workflow-x", `${px * 100}%`);
        card.style.setProperty("--workflow-y", `${py * 100}%`);
        card.style.setProperty("--workflow-glow", "1");

        rotateY(dx * 11);
        rotateX(-dy * 8);
        imageX?.(-dx * 12);
        imageY?.(-dy * 10);
      });

      card.addEventListener("pointerleave", reset);
      window.addEventListener("resize", () => { rect = null; });
      reducedMotion.addEventListener?.("change", reset);
      finePointer.addEventListener?.("change", reset);
    };

    initGsap();
  }

  function init() {
    const workflow = document.querySelector("#capabilities [data-workflow-explorer]");
    if (!workflow || workflow.dataset.fourUpRestored === "true") return;

    const grid = document.createElement("div");
    grid.className = "capability-grid";
    grid.dataset.fourUpRestored = "true";

    stages.forEach((stage) => {
      const card = buildCard(stage);
      grid.appendChild(card);
      addTilt(card);
    });

    workflow.replaceWith(grid);

    const animateIn = (attempt = 0) => {
      if (!window.gsap || !window.ScrollTrigger) {
        if (attempt < 240) requestAnimationFrame(() => animateIn(attempt + 1));
        return;
      }
      if (reducedMotion.matches) return;

      window.gsap.from(grid.children, {
        autoAlpha: 0,
        y: 34,
        scale: .965,
        filter: "blur(8px)",
        stagger: .09,
        duration: .78,
        ease: "power3.out",
        clearProps: "opacity,visibility,filter",
        scrollTrigger: { trigger: grid, start: "top 84%", once: true },
      });
      window.ScrollTrigger.refresh();
    };

    animateIn();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
