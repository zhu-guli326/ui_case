const translations = {
  layout: {
    zh: ["布局 · Layout", "先看页面被分成哪些区域：顶部导航、主视觉、内容卡片和底部导航。布局关注的是区域之间的关系、比例、对齐和留白，而不是颜色好不好看。"],
    en: ["Layout", "Start by dividing the page into navigation, hero, content cards, and bottom navigation. Layout is about relationships, proportions, alignment, and spacing before visual styling."]
  },
  hierarchy: {
    zh: ["层级 · Hierarchy", "先看什么最重要：标题、主视觉和主行动要明显高于辅助信息。可以用字号、位置、对比和留白建立阅读顺序。"],
    en: ["Hierarchy", "Decide what matters most first. Headline, hero visual, and primary action should clearly outrank supporting information through scale, position, contrast, and space."]
  },
  pattern: {
    zh: ["模式 · Pattern", "辨认熟悉的 UI Pattern：导航、Hero、Card、CTA。识别 Pattern 后，你就不是在描述像素，而是在告诉 AI 应该使用什么结构。"],
    en: ["Pattern", "Recognize familiar UI patterns such as navigation, hero, cards, and CTA. Naming patterns lets you describe structure instead of pixels."]
  },
  action: {
    zh: ["动作 · Action", "找到用户真正要做的动作。主行动应该只有一个明确视觉优先级，其余操作退到次级，不要让所有按钮同时喊得很大声。"],
    en: ["Action", "Find the action the user actually needs to take. Give one primary action clear visual priority and let secondary actions step back."]
  },
  state: {
    zh: ["状态 · State", "不要只看默认画面。还要问：Hover、Pressed、Loading、Success、Error、Empty 时会发生什么？完整的界面是时间中的界面。"],
    en: ["State", "Do not inspect only the default screen. Ask what happens in hover, pressed, loading, success, error, and empty states. A complete interface exists over time."]
  },
  visual: {
    zh: ["视觉 · Visual", "最后再看字体、颜色、圆角、边框、材质和间距节奏。它们决定视觉语气，但不能替代清楚的结构、层级和交互。"],
    en: ["Visual", "Only then inspect type, color, radius, borders, texture, and spacing rhythm. They shape visual tone but cannot replace structure, hierarchy, and interaction."]
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

  const tablist = document.querySelector(".see-controls");
  if (tablist) tablist.setAttribute("aria-label", lang === "en" ? "Interface inspection lenses" : "界面观察维度");
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
  if (sample) {
    sample.dataset.lens = lens;
    sample.dataset.lang = lang;
  }
  const title = document.querySelector("#lensTitle");
  const text = document.querySelector("#lensText");
  if (title) title.textContent = note[0];
  if (text) text.textContent = note[1];
}

const lensButtons = [...document.querySelectorAll("[data-lens]")];
lensButtons.forEach((button) => {
  button.addEventListener("click", () => {
    lensButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", String(selected));
    });
    updateLens(button.dataset.lens);
  });

  button.addEventListener("keydown", (event) => {
    if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
    const currentIndex = lensButtons.indexOf(button);
    const nextButton = lensButtons[(currentIndex + direction + lensButtons.length) % lensButtons.length];
    nextButton.focus();
    nextButton.click();
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

if (window.image2I18n?.registerPage) {
  window.image2I18n.registerPage((lang) => applyLanguage(lang));
} else {
  window.addEventListener("image2:languagechange", applyLanguage);
}
