const ctaSection = document.querySelector(".project-cta");
const ctaHeading = ctaSection?.querySelector("h2");
const ctaReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let ctaTypingTimer = 0;
let ctaTypingObserver = null;
let ctaTypingGeneration = 0;

function ctaLanguage() {
  const documentLanguage = document.documentElement.lang.toLowerCase();
  if (documentLanguage.startsWith("en")) return "en";
  if (documentLanguage.startsWith("zh")) return "zh";
  return new URLSearchParams(location.search).get("lang") === "en" ? "en" : "zh";
}

function ctaFullText() {
  if (!ctaHeading) return "";
  const language = ctaLanguage();
  return ctaHeading.dataset[language] || ctaHeading.textContent.trim();
}

function reserveCtaHeadingHeight(text) {
  if (!ctaHeading) return;
  const previousText = ctaHeading.textContent;
  const previousVisibility = ctaHeading.style.visibility;
  const previousMinHeight = ctaHeading.style.minHeight;

  ctaHeading.style.minHeight = "0";
  ctaHeading.style.visibility = "hidden";
  ctaHeading.textContent = text;
  const height = ctaHeading.getBoundingClientRect().height;

  ctaHeading.textContent = previousText;
  ctaHeading.style.visibility = previousVisibility;
  ctaHeading.style.minHeight = previousMinHeight;
  if (height > 0) ctaHeading.style.minHeight = `${Math.ceil(height)}px`;
}

function finishCtaTyping() {
  if (!ctaHeading) return;
  window.clearTimeout(ctaTypingTimer);
  ctaTypingGeneration += 1;
  const text = ctaFullText();
  reserveCtaHeadingHeight(text);
  ctaHeading.textContent = text;
  ctaHeading.setAttribute("aria-label", text);
  ctaHeading.classList.remove("is-typing");
  ctaHeading.classList.add("is-typed");
}

function typeCtaHeading() {
  if (!ctaHeading) return;
  const text = ctaFullText();
  reserveCtaHeadingHeight(text);
  ctaHeading.setAttribute("aria-label", text);

  if (ctaReducedMotion.matches) {
    finishCtaTyping();
    return;
  }

  window.clearTimeout(ctaTypingTimer);
  const generation = ++ctaTypingGeneration;
  const characters = Array.from(text);
  const language = ctaLanguage();
  let index = 0;

  ctaHeading.textContent = "";
  ctaHeading.classList.remove("is-typed");
  ctaHeading.classList.add("is-typing");

  const tick = () => {
    if (generation !== ctaTypingGeneration) return;
    index += 1;
    ctaHeading.textContent = characters.slice(0, index).join("");

    if (index >= characters.length) {
      ctaHeading.classList.remove("is-typing");
      ctaHeading.classList.add("is-typed");
      return;
    }

    const character = characters[index - 1];
    let delay = language === "en" ? 24 : 52;
    if (/\s/.test(character)) delay = 14;
    if (/[，。！？,.!?]/.test(character)) delay += language === "en" ? 80 : 120;
    ctaTypingTimer = window.setTimeout(tick, delay);
  };

  ctaTypingTimer = window.setTimeout(tick, 90);
}

function ctaIsInViewport() {
  if (!ctaHeading) return false;
  const rect = ctaHeading.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight;
}

function prepareCtaTyping() {
  if (!ctaHeading) return;
  const text = ctaFullText();
  reserveCtaHeadingHeight(text);
  ctaHeading.setAttribute("aria-label", text);
  ctaHeading.classList.remove("is-typing", "is-typed");

  if (ctaReducedMotion.matches || !("IntersectionObserver" in window)) {
    ctaHeading.textContent = text;
    return;
  }

  ctaHeading.textContent = "";
  ctaTypingObserver?.disconnect();
  ctaTypingObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    ctaTypingObserver?.disconnect();
    typeCtaHeading();
  }, { threshold: .32 });
  ctaTypingObserver.observe(ctaHeading);
}

if (ctaHeading) {
  prepareCtaTyping();

  const languageObserver = new MutationObserver(() => {
    window.clearTimeout(ctaTypingTimer);
    ctaTypingGeneration += 1;
    window.requestAnimationFrame(() => {
      if (ctaIsInViewport()) typeCtaHeading();
      else prepareCtaTyping();
    });
  });
  languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  ctaReducedMotion.addEventListener?.("change", () => {
    if (ctaReducedMotion.matches) finishCtaTyping();
    else prepareCtaTyping();
  });
}
