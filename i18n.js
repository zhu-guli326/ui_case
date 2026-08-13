(() => {
  const STORAGE_KEY = "image2-ui-language";
  const SUPPORTED = ["zh", "en"];
  const pageHandlers = new Set();
  const translations = {
    "nav.library": { zh: "案例库", en: "Library" },
    "nav.learn": { zh: "新手入门", en: "Quick start" },
    "nav.brands": { zh: "设计系统", en: "Design systems" },
    "nav.launcher": { zh: "可视化启动", en: "Visual launcher" },
    "nav.skills": { zh: "设计 Skill", en: "Design skills" },
    "nav.vocabulary": { zh: "UI 词典", en: "UI vocabulary" },
    "nav.docs": { zh: "文档", en: "Docs" },
    "common.language": { zh: "语言 / Language", en: "Language / 语言" },
    "common.chinese": { zh: "中文", en: "中文" },
    "common.english": { zh: "English", en: "English" },
    "common.close": { zh: "关闭", en: "Close" },
    "common.backLibrary": { zh: "返回案例库", en: "Back to library" },
    "common.copy": { zh: "复制", en: "Copy" },
    "common.copied": { zh: "已复制", en: "Copied" },
    "common.retry": { zh: "重试", en: "Retry" },
    "common.loading": { zh: "正在加载...", en: "Loading..." },
  };

  function isSupported(value) {
    return SUPPORTED.includes(value);
  }

  function readLanguage() {
    const queryLanguage = new URL(window.location.href).searchParams.get("lang");
    if (isSupported(queryLanguage)) return queryLanguage;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isSupported(saved)) return saved;
    } catch {}
    return navigator.language?.toLowerCase().startsWith("en") ? "en" : "zh";
  }

  let language = readLanguage();
  let githubStars = 288;
  let githubStarsRequested = false;

  function text(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value[language] ?? value.zh ?? value.en ?? "";
    }
    return String(value ?? "");
  }

  function t(key, fallback = "") {
    return text(translations[key] || fallback);
  }

  function addTranslations(entries) {
    if (!entries || typeof entries !== "object") return;
    Object.assign(translations, entries);
  }

  function siteNavigationItems() {
    return [
      { href: "./library.html", key: "nav.library" },
      { href: "./brands.html", key: "nav.brands" },
      { href: "./launcher.html", key: "nav.launcher" },
      { href: "https://github.com/zhu-guli326/ui_case", label: "GitHub", external: true, stars: true },
      { href: "https://x.com/JGuli49724", label: "X", external: true, ariaLabel: "在 X 查看 JGuli49724 的主页" },
      { href: "https://www.xiaohongshu.com/user/profile/57b3456c82ec3947f79496e9", label: "小红书", external: true },
      { href: "./learn.html", key: "nav.learn" },
      { href: "./skills.html", key: "nav.skills" },
      { href: "./vocabulary.html", key: "nav.vocabulary" },
    ];
  }

  function currentPage() {
    return document.body?.dataset.sitePage || window.location.pathname.split("/").pop() || "library.html";
  }

  function resolveLocalHref(href) {
    if (!href.startsWith("./")) return href;
    return window.location.pathname.includes("/lab/") ? `../${href.slice(2)}` : href;
  }

  function renderSiteNavigation(nav) {
    const activePage = currentPage();
    nav.classList.add("site-nav");
    nav.innerHTML = siteNavigationItems().map((item) => {
      const file = item.external ? "" : item.href.replace(/^\.\//, "");
      const current = file === activePage ? ' aria-current="page"' : "";
      const external = item.external ? ' target="_blank" rel="noopener noreferrer"' : "";
      const ariaLabel = item.ariaLabel ? ` aria-label="${item.ariaLabel}"` : "";
      const label = item.key ? `<span data-i18n="${item.key}">${t(item.key)}</span>` : item.label;
      const stars = item.stars ? ` <span class="site-nav-stars" id="githubStarsNav">${githubStars}</span>` : "";
      const arrow = item.external && !item.stars ? ' <span class="site-nav-external" aria-hidden="true">↗</span>' : "";
      return `<a href="${resolveLocalHref(item.href)}"${current}${external}${ariaLabel}>${label}${stars}${arrow}</a>`;
    }).join("") + '<div data-language-switch></div>';
  }

  function updateSiteStars(value) {
    if (Number.isFinite(value)) githubStars = value;
    const formatted = new Intl.NumberFormat(language === "en" ? "en" : "zh-CN").format(githubStars);
    document.querySelectorAll(".site-nav-stars").forEach((element) => { element.textContent = formatted; });
  }

  async function requestGitHubStars() {
    if (githubStarsRequested) return;
    githubStarsRequested = true;
    try {
      const response = await fetch("https://api.github.com/repos/zhu-guli326/ui_case", {
        headers: { Accept: "application/vnd.github+json" },
        cache: "no-store",
      });
      if (!response.ok) return;
      updateSiteStars(Number((await response.json()).stargazers_count));
    } catch {}
  }

  function setHtmlLanguage() {
    document.documentElement.lang = language === "en" ? "en" : "zh-CN";
  }

  function updateUrl({ replace = false } = {}) {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", language);
    const method = replace ? "replaceState" : "pushState";
    window.history[method]({ lang: language }, "", url);
  }

  function persistLanguage() {
    try { localStorage.setItem(STORAGE_KEY, language); } catch {}
  }

  function renderSwitch(switcher) {
    if (!switcher) return;
    switcher.classList.add("global-language-switch");
    switcher.setAttribute("role", "group");
    switcher.setAttribute("aria-label", t("common.language"));
    switcher.innerHTML = SUPPORTED.map((item) => {
      const selected = item === language;
      const label = item === "zh" ? t("common.chinese") : t("common.english");
      return `<button type="button" data-language="${item}" aria-pressed="${selected}" title="${label}">${label}</button>`;
    }).join("");
    switcher.querySelectorAll("[data-language]").forEach((button) => {
      button.addEventListener("click", () => {
        setLanguage(button.dataset.language);
      });
    });
  }

  function mountSwitches() {
    let switchers = [...document.querySelectorAll("[data-language-switch], #languageSwitch")];
    if (!switchers.length) {
      document.querySelectorAll("header nav").forEach((nav) => {
        if (nav.closest(".docs-topbar") && nav.querySelector("#languageSwitch")) return;
        const switcher = document.createElement("div");
        switcher.dataset.languageSwitch = "";
        nav.append(switcher);
        switchers.push(switcher);
      });
    }
    switchers.forEach(renderSwitch);
  }

  function applyDataTranslations(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;
      element.textContent = t(key, element.dataset[`i18n${language === "en" ? "En" : "Zh"}`] || element.textContent);
    });
    root.querySelectorAll("[data-i18n-attr]").forEach((element) => {
      element.dataset.i18nAttr.split(",").forEach((entry) => {
        const [attribute, key] = entry.split(":");
        if (!attribute || !key) return;
        const fallback = element.dataset[`i18n${language === "en" ? "En" : "Zh"}${attribute[0].toUpperCase()}${attribute.slice(1)}`] || element.getAttribute(attribute) || "";
        element.setAttribute(attribute, t(key, fallback));
      });
    });
  }

  function localizeLinks(root = document) {
    const pages = /^(?:index|library|learn|brands|launcher|skills|vocabulary|reference|markdown)\.html$/i;
    root.querySelectorAll("a[href]").forEach((link) => {
      const raw = link.getAttribute("href");
      if (!raw || raw.startsWith("#") || /^(?:https?:|mailto:|tel:|javascript:)/i.test(raw)) return;
      try {
        const url = new URL(raw, window.location.href);
        if (url.origin !== window.location.origin || !pages.test(url.pathname.split("/").pop() || "")) return;
        url.searchParams.set("lang", language);
        const path = window.location.pathname.includes("/lab/") ? `../${url.pathname.split("/").pop()}` : url.pathname.split("/").pop();
        link.setAttribute("href", `${path}${url.search}${url.hash}`);
      } catch {}
    });
  }

  function refresh() {
    setHtmlLanguage();
    document.querySelectorAll("[data-site-nav]").forEach(renderSiteNavigation);
    mountSwitches();
    applyDataTranslations();
    localizeLinks();
    updateSiteStars(githubStars);
    requestGitHubStars();
    pageHandlers.forEach((handler) => handler(language));
    window.dispatchEvent(new CustomEvent("image2:languagechange", { detail: { language } }));
  }

  function registerPage(handler) {
    if (typeof handler !== "function") return () => {};
    pageHandlers.add(handler);
    handler(language);
    return () => pageHandlers.delete(handler);
  }

  function setLanguage(next, { replace = false } = {}) {
    if (!isSupported(next) || next === language) return;
    language = next;
    persistLanguage();
    updateUrl({ replace });
    refresh();
  }

  window.image2I18n = Object.freeze({
    supported: SUPPORTED,
    get language() { return language; },
    text,
    t,
    addTranslations,
    registerPage,
    refresh,
    setLanguage,
    localizeUrl(value) {
      try {
        const url = new URL(value, window.location.href);
        if (url.origin === window.location.origin) url.searchParams.set("lang", language);
        return url.href;
      } catch { return value; }
    },
  });

  window.addEventListener("popstate", () => {
    const queryLanguage = new URL(window.location.href).searchParams.get("lang");
    const next = isSupported(queryLanguage) ? queryLanguage : readLanguage();
    if (next === language) return;
    language = next;
    refresh();
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", refresh, { once: true });
  else refresh();
})();
