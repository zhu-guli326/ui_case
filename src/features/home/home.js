const SUPPORTED_LANGUAGES = new Set(["zh", "en"]);

function currentLanguage(event) {
  const detail = event?.detail;
  const eventLanguage = typeof detail === "string" ? detail : detail?.language || detail?.lang || detail?.value;
  if (SUPPORTED_LANGUAGES.has(eventLanguage)) return eventLanguage;
  if (SUPPORTED_LANGUAGES.has(window.image2I18n?.language)) return window.image2I18n.language;
  const queryLanguage = new URLSearchParams(location.search).get("lang");
  return SUPPORTED_LANGUAGES.has(queryLanguage) ? queryLanguage : "zh";
}

function applyLanguage(event) {
  const language = currentLanguage(event);
  document.documentElement.lang = language === "en" ? "en" : "zh-CN";
  document.title = language === "en" ? "ONDesign · From reference to interface" : "ONDesign · 从设计参考到真实界面";

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.content = language === "en"
      ? "ONDesign connects real UI cases, interface vocabulary, design systems, and an AI building workspace."
      : "ONDesign：从真实 UI 案例、界面词汇和设计系统出发，与 AI 一起构建可运行的界面。";
  }

  document.querySelectorAll("[data-zh][data-en]").forEach((element) => {
    const value = element.dataset[language];
    if (value) element.textContent = value;
  });

  document.querySelectorAll("[data-smart-lang-link]").forEach((link) => {
    const target = new URL(link.dataset.smartLangLink, location.href);
    target.searchParams.set("lang", language);
    link.href = `${target.pathname.split("/").pop()}${target.search}${target.hash}`;
  });

  if (previousButton) previousButton.setAttribute("aria-label", language === "en" ? "Previous case" : "上一个案例");
  if (nextButton) nextButton.setAttribute("aria-label", language === "en" ? "Next case" : "下一个案例");
  carouselDots.forEach((dot, index) => dot.setAttribute("aria-label", language === "en" ? `Show case ${index + 1}` : `显示第 ${index + 1} 个案例`));
}

const carousel = document.querySelector("[data-featured-carousel]");
const carouselViewport = carousel?.querySelector("[data-carousel-viewport]");
const caseCards = [...(carousel?.querySelectorAll("[data-case-slide]") || [])];
const previousButton = carousel?.querySelector("[data-carousel-prev]");
const nextButton = carousel?.querySelector("[data-carousel-next]");
const dotsContainer = carousel?.querySelector("[data-carousel-dots]");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let activeCase = Math.min(1, caseCards.length - 1);
let autoplayTimer = 0;
let dragStart = null;
let dragDistance = 0;
let suppressNextClick = false;

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
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    numbers.forEach((node, index) => { node.textContent = String(targets[index]); });
    return;
  }

  numbers.forEach((node) => {
    node.textContent = "0";
    node.style.opacity = ".5";
    node.style.transform = "translateY(12px)";
    node.style.transition = "opacity 280ms ease, transform 420ms cubic-bezier(.2,.78,.18,1)";
  });

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();

    numbers.forEach((node, index) => {
      const target = targets[index];
      const delay = index * 110;
      const duration = 920 + index * 90;

      window.setTimeout(() => {
        node.style.opacity = "1";
        node.style.transform = "translateY(0)";
        const startedAt = performance.now();

        const tick = (now) => {
          const progress = Math.min(1, (now - startedAt) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          node.textContent = String(Math.round(target * eased));
          if (progress < 1) requestAnimationFrame(tick);
          else node.textContent = String(target);
        };

        requestAnimationFrame(tick);
      }, delay);
    });
  }, { threshold: .38 });

  observer.observe(stats);
}

renderCarousel();
scheduleAutoplay();
initStatsCounter();

applyLanguage();
if (window.image2I18n?.registerPage) window.image2I18n.registerPage((language) => applyLanguage({ detail: language }));
else window.addEventListener("image2:languagechange", applyLanguage);
