const translations = {
  layout: {
    zh: ["Layout", "页面先分成顶部导航、主视觉、内容卡片和底部导航，再决定它们之间的比例与留白。"],
    en: ["Layout", "Start by dividing the page into navigation, hero, content cards, and bottom navigation, then decide their proportions and spacing."]
  },
  hierarchy: {
    zh: ["Hierarchy", "先看什么最重要：标题、主视觉和主行动要明显高于辅助信息。"],
    en: ["Hierarchy", "Decide what matters most first: headline, hero visual, and primary action should clearly outrank supporting information."]
  },
  pattern: {
    zh: ["Pattern", "辨认熟悉的 UI Pattern：导航、Hero、Card、CTA。识别 Pattern 后，AI 更容易实现稳定结构。"],
    en: ["Pattern", "Recognize familiar UI patterns such as navigation, hero, cards, and CTA. Naming patterns makes AI output more reliable."]
  },
  action: {
    zh: ["Action", "找到用户真正要做的动作，并确保主行动只有一个明显的视觉优先级。"],
    en: ["Action", "Find the action the user actually needs to take and give the primary action one clear visual priority."]
  },
  state: {
    zh: ["State", "不要只看默认画面。还要问：Hover、Pressed、Loading、Success、Error、Empty 时会发生什么？"],
    en: ["State", "Do not inspect only the default screen. Ask what happens in hover, pressed, loading, success, error, and empty states."]
  },
  visual: {
    zh: ["Visual", "最后再看字体、颜色、圆角、边框和间距。这些决定视觉语气，但不能替代结构和层级。"],
    en: ["Visual", "Only then inspect type, color, radius, borders, and spacing. They shape visual tone but cannot replace structure and hierarchy."]
  }
};

const SUPPORTED_LANGUAGES = new Set(["zh", "en"]);
let activeLanguage = null;

function languageFromEvent(event) {
  if (typeof event === "string" && SUPPORTED_LANGUAGES.has(event)) return event;
  const detail = event?.detail;
  if (typeof detail === "string" && SUPPORTED_LANGUAGES.has(detail)) return detail;
  if (detail && typeof detail === "object") {
    const candidate = detail.language || detail.lang || detail.value;
    if (SUPPORTED_LANGUAGES.has(candidate)) return candidate;
  }
  return null;
}

function currentLanguage(event) {
  const eventLanguage = languageFromEvent(event);
  if (eventLanguage) return eventLanguage;

  const appLanguage = window.image2I18n?.language;
  if (SUPPORTED_LANGUAGES.has(appLanguage)) return appLanguage;

  const param = new URLSearchParams(location.search).get("lang");
  if (SUPPORTED_LANGUAGES.has(param)) return param;

  return activeLanguage || "zh";
}

function syncDocumentMeta(lang) {
  document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  document.title = lang === "en" ? "How to Design with AI · ONDesign" : "如何与 AI 一起做 UI · ONDesign";
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.content = lang === "en"
      ? "Learn to see, describe, build and review interfaces with AI."
      : "学习如何看懂、拆解、描述、生成并判断 AI UI。";
  }
}

function applyLanguage(event) {
  const lang = currentLanguage(event);
  activeLanguage = lang;
  syncDocumentMeta(lang);

  document.querySelectorAll("[data-zh][data-en]").forEach((el) => {
    const value = el.dataset[lang];
    if (!value) return;
    if (value.includes("\\n") && /^(H1|H2|H3|P|SPAN|STRONG)$/.test(el.tagName)) {
      el.innerHTML = value.split("\\n").map((line) => line.trim()).join("<br>");
    } else {
      el.textContent = value;
    }
  });

  document.querySelectorAll("[data-smart-lang-link]").forEach((link) => {
    const target = new URL(link.dataset.smartLangLink, location.href);
    target.searchParams.set("lang", lang);
    link.href = `${target.pathname.split("/").pop()}${target.search}${target.hash}`;
  });

  const rebuildLink = document.querySelector('.final-links a[href*="launcher.html"]');
  if (rebuildLink) {
    const target = new URL(rebuildLink.href, location.href);
    target.searchParams.set("lang", lang);
    rebuildLink.href = target.href;
  }

  updateLens(document.querySelector("[data-lens].is-active")?.dataset.lens || "layout", lang);
}

function updateLens(lens, forcedLanguage) {
  const lang = forcedLanguage || activeLanguage || currentLanguage();
  const note = translations[lens]?.[lang] || translations.layout[lang];
  const sample = document.querySelector("#sampleUi");
  if (sample) sample.dataset.lens = lens;
  const title = document.querySelector("#lensTitle");
  const text = document.querySelector("#lensText");
  if (title) title.textContent = note[0];
  if (text) text.textContent = note[1];
}

document.querySelectorAll("[data-lens]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-lens]").forEach((item) => item.classList.toggle("is-active", item === button));
    updateLens(button.dataset.lens);
  });
});

const progressBar = document.querySelector("#pageProgressBar");
const chapterLinks = [...document.querySelectorAll("[data-section-link]")];
const chapters = [...document.querySelectorAll("[data-section]")];

function updateScrollState() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const progress = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
  if (progressBar) progressBar.style.width = `${progress * 100}%`;

  let current = chapters[0]?.dataset.section;
  chapters.forEach((chapter) => {
    const rect = chapter.getBoundingClientRect();
    if (rect.top <= innerHeight * 0.34) current = chapter.dataset.section;
  });
  chapterLinks.forEach((link) => link.classList.toggle("is-current", link.dataset.sectionLink === current));
}

addEventListener("scroll", updateScrollState, { passive: true });
addEventListener("resize", updateScrollState);

applyLanguage();
updateScrollState();

// The global app shell exposes the canonical language lifecycle through
// image2I18n.registerPage(). Registering here makes the Learn content update in
// the same tick as the header switch instead of waiting for a page reload.
if (window.image2I18n?.registerPage) {
  window.image2I18n.registerPage((lang) => applyLanguage(lang));
} else {
  // Fallback for standalone/older shells.
  window.addEventListener("image2:languagechange", applyLanguage);
}
