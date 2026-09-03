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
    card.dataset.workflowTiltReady = "true";
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
        if (attempt < 180) requestAnimationFrame(() => initGsap(attempt + 1));
        return;
      }
      const { gsap } = window;
      gsap.set(card, { transformPerspective: 1100, transformOrigin: "50% 50%", force3D: true });

      const reset = () => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          y: 0,
          boxShadow: "0 16px 36px rgba(0,0,0,.10)",
          duration: .65,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      card.addEventListener("pointermove", (event) => {
        if (!finePointer.matches || reducedMotion.matches) return;
        const rect = card.getBoundingClientRect();
        const px = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(rect.width, 1)));
        const py = Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(rect.height, 1)));
        gsap.to(card, {
          rotationY: (px - .5) * 7,
          rotationX: (.5 - py) * 5,
          scale: 1.018,
          y: -6,
          boxShadow: "0 28px 62px rgba(0,0,0,.18)",
          duration: .28,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
      card.addEventListener("pointerleave", reset);
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

    if (window.gsap && window.ScrollTrigger && !reducedMotion.matches) {
      window.gsap.from(grid.children, {
        autoAlpha: 0,
        y: 30,
        scale: .97,
        stagger: .09,
        duration: .72,
        ease: "power3.out",
        clearProps: "opacity,visibility,transform",
        scrollTrigger: { trigger: grid, start: "top 84%", once: true },
      });
    }

    window.ScrollTrigger?.refresh?.();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();