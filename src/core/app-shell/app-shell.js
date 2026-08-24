(() => {
  if (window.location.protocol === "file:") {
    const isLabPage = /[\\/]lab[\\/]/i.test(window.location.pathname);
    const fileName = window.location.pathname.split(/[\\/]/).pop() || "index.html";
    const relativePath = isLabPage ? `lab/${fileName}` : fileName;
    const target = `http://127.0.0.1:4174/${relativePath}${window.location.search}${window.location.hash}`;
    const revealLocalPreviewHelp = () => {
      if (document.querySelector(".local-preview-help")) return;
      const help = document.createElement("aside");
      help.className = "local-preview-help";
      help.setAttribute("role", "alert");
      help.innerHTML = `<strong>当前是文件预览，交互功能不会运行</strong><span>请双击项目里的“启动本地预览.cmd”，再重新打开页面。</span><a href="${target}">服务已启动？点这里进入</a>`;
      document.body.prepend(help);
    };
    const probe = new Image();
    probe.onload = () => window.location.replace(target);
    probe.onerror = () => document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", revealLocalPreviewHelp, { once: true }) : revealLocalPreviewHelp();
    probe.src = `http://127.0.0.1:4174/assets/readme/hero.png?preview=${Date.now()}`;
  }

  const STORAGE_KEY = "image2-ui-language";
  const SUPPORTED = ["zh", "en"];
  const pageHandlers = new Set();
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
  const translations = {
    "nav.library": { zh: "图书馆", en: "Library" },
    "nav.explore": { zh: "探索", en: "Explore" },
    "nav.caseLibrary": { zh: "案例库", en: "Case Library" },
    "nav.caseLibraryHint": { zh: "浏览可点击 UI 案例", en: "Browse clickable UI cases" },
    "nav.uiVocabulary": { zh: "UI 词库", en: "UI Vocabulary" },
    "nav.uiVocabularyHint": { zh: "看图理解界面语言", en: "Learn interface language visually" },
    "nav.designSkills": { zh: "设计 Skill", en: "Design Skills" },
    "nav.designSkillsHint": { zh: "查找可调用的设计能力", en: "Find reusable design capabilities" },
    "nav.learn": { zh: "使用指南", en: "Guide" },
    "nav.brands": { zh: "设计系统", en: "Design systems" },
    "nav.launcher": { zh: "开始设计", en: "Start Designing" },
    "nav.skills": { zh: "设计 Skill", en: "Design skills" },
    "nav.vocabulary": { zh: "UI 词典", en: "UI vocabulary" },
    "nav.resources": { zh: "更多", en: "More" },
    "nav.docs": { zh: "文档", en: "Docs" },
    "footer.about": { zh: "关于 ONDesign", en: "About ONDesign" },
    "footer.privacy": { zh: "隐私政策", en: "Privacy Policy" },
    "footer.contact": { zh: "联系我们", en: "Contact" },
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
    const browserLanguages = [...(navigator.languages || []), navigator.language]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase());
    if (browserLanguages.some((value) => /^(?:zh|yue)(?:-|$)/.test(value))) return "zh";
    if (browserLanguages.some((value) => /^en(?:-|$)/.test(value))) return "en";
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (/^(?:Asia\/(?:Shanghai|Chongqing|Harbin|Urumqi|Hong_Kong|Macau|Taipei))$/i.test(timeZone)) return "zh";
    } catch {}
    return "en";
  }

  let language = readLanguage();
  const STAR_CACHE_KEY = "image2-ui-github-stars";
  const STAR_CACHE_TTL = 6 * 60 * 60 * 1000;
  function readStarCache() {
    try {
      const cached = JSON.parse(localStorage.getItem(STAR_CACHE_KEY) || "null");
      return cached && Number.isFinite(cached.value) ? cached : null;
    } catch { return null; }
  }
  const cachedStars = readStarCache();
  let githubStars = Number.isFinite(cachedStars?.value) ? cachedStars.value : null;
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
      { href: "./learn.html", key: "nav.explore" },
    ];
  }

  function libraryNavigationItems() {
    return [
      { href: "./library.html", key: "nav.caseLibrary", hintKey: "nav.caseLibraryHint" },
      { href: "./vocabulary.html", key: "nav.uiVocabulary", hintKey: "nav.uiVocabularyHint" },
      { href: "./skills.html", key: "nav.designSkills", hintKey: "nav.designSkillsHint" },
    ];
  }

  function resourceNavigationItems() {
    return [
      { href: "https://x.com/JGuli49724", label: '<svg class="site-social-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.967 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/></svg>', external: true, className: "site-nav-social site-nav-x", ariaLabel: language === "en" ? "Open JGuli49724's profile on X" : "在 X 查看 JGuli49724 的主页" },
      { href: "https://github.com/zhu-guli326/image2_UI_skill", label: `GitHub <span class="site-nav-star-glyph" aria-hidden="true">★</span><span class="site-nav-stars">${githubStars ?? "…"}</span>`, external: true, className: "site-nav-github", ariaLabel: language === "en" ? "Open GitHub repository" : "打开 GitHub 仓库" },
      { href: "https://www.xiaohongshu.com/user/profile/57b3456c82ec3947f79496e9", label: '<svg class="site-social-svg site-xhs-svg" viewBox="0 0 42 28" aria-hidden="true"><rect x="1" y="3" width="40" height="22" rx="8"/><text x="21" y="18.2" text-anchor="middle">RED</text></svg>', external: true, className: "site-nav-social site-nav-xhs", ariaLabel: language === "en" ? "Open the creator profile on Xiaohongshu" : "打开作者的小红书主页" },
    ];
  }

  const PROJECT_KEY = "image2-ui-current-project";
  const projectDefaults = {
    version: 2,
    projectId: "default-project",
    name: "Atlas Dashboard",
    template: "dashboard",
    system: "ant",
    brand: "linear",
    theme: "minimal-tech",
    intensity: "standard",
    device: "desktop",
    density: "balanced",
    spacingBase: "8pt",
    fontScheme: "system-cjk",
    sourceCaseId: "",
    sourceCaseName: "",
    sourceCaseStyle: "",
    taskIntent: "",
    taskReady: false,
    taskReferenceMode: "unset",
    taskReferenceCaseId: "",
    taskReferenceCaseName: "",
    taskReferenceCaseStyle: "",
    taskReferenceCaseImage: "",
    lastStep: ""
  };
  function readCurrentProject() {
    try { return { ...projectDefaults, ...(JSON.parse(localStorage.getItem(PROJECT_KEY) || "{}") || {}) }; }
    catch { return { ...projectDefaults }; }
  }

  function currentPage() {
    if (window.history.state?.image2Shell || document.body?.classList.contains("site-shell-active")) {
      return window.location.pathname.split("/").pop() || "library.html";
    }
    if (document.body?.dataset.sitePage) return document.body.dataset.sitePage;
    if (/\/lab\//i.test(window.location.pathname)) return "brands.html";
    return window.location.pathname.split("/").pop() || "library.html";
  }

  function resolveLocalHref(href) {
    if (!href.startsWith("./")) return href;
    return window.location.pathname.includes("/lab/") ? `../${href.slice(2)}` : href;
  }

  function renderSiteNavigation(nav) {
    const activePage = currentPage();
    nav.classList.add("site-nav");
    const renderLink = (item) => {
      const file = item.external ? "" : item.href.replace(/^\.\//, "");
      const current = file === activePage ? ' aria-current="page"' : "";
      const external = item.external ? ' target="_blank" rel="noopener noreferrer"' : "";
      const ariaLabel = item.ariaLabel ? ` aria-label="${item.ariaLabel}"` : "";
      const className = item.className ? ` class="${item.className}"` : "";
      const label = item.key ? `<span data-i18n="${item.key}">${t(item.key)}</span>` : item.label;
      return `<a href="${resolveLocalHref(item.href)}"${className}${current}${external}${ariaLabel}>${label}</a>`;
    };
    const resources = resourceNavigationItems();
    const start = renderLink({ href: "./launcher.html", key: "nav.launcher", className: "site-nav-start" });
    const libraryPages = new Set(libraryNavigationItems().map((item) => item.href.replace(/^\.\//, "")));
    const libraryCurrent = libraryPages.has(activePage);
    const libraryMenu = `<details class="site-nav-more site-nav-library${libraryCurrent ? " is-current" : ""}"><summary${libraryCurrent ? ' aria-current="page"' : ""}>${t("nav.library")}</summary><div class="site-nav-menu">${libraryNavigationItems().map((item) => {
      const file = item.href.replace(/^\.\//, "");
      return `<a href="${resolveLocalHref(item.href)}"${file === activePage ? ' aria-current="page"' : ""}><span><strong data-i18n="${item.key}">${t(item.key)}</strong><small data-i18n="${item.hintKey}">${t(item.hintKey)}</small></span><i aria-hidden="true">↗</i></a>`;
    }).join("")}</div></details>`;
    nav.innerHTML = `<div class="site-nav-community">${siteNavigationItems().map(renderLink).join("")}${libraryMenu}${resources.map(renderLink).join("")}${start}</div><div class="site-nav-utility" data-language-switch></div>`;
    nav.querySelectorAll(".site-nav-menu a").forEach((link) => link.addEventListener("click", () => link.closest("details")?.removeAttribute("open")));
  }

  function renderSiteHeader(target) {
    const header = target || document.querySelector("[data-site-header]");
    if (!header) return;
    if (new URL(window.location.href).searchParams.get("embed") === "1") {
      header.hidden = true;
      return;
    }
    header.hidden = false;
    header.className = "site-header";
    header.innerHTML = `
      <a class="site-brand" href="${resolveLocalHref("./learn.html")}" aria-label="${language === "en" ? "Back to ONDesign home" : "返回 ONDesign 首页"}">
        <img class="site-brand-logo" src="${resolveLocalHref("./assets/branding/ondesign-mark.png")}" width="322" height="348" alt="">
        <span class="site-brand-copy">
          <img class="site-brand-wordmark" src="${resolveLocalHref("./assets/branding/ondesign-wordmark.png")}" width="837" height="150" alt="">
          <small>DESIGN STUDIO</small>
        </span>
      </a>
      <nav class="site-nav" data-site-nav aria-label="${language === "en" ? "Primary navigation" : "主导航"}"></nav>`;
  }

  function updateSiteStars(value) {
    if (Number.isFinite(value)) githubStars = value;
    const formatted = Number.isFinite(githubStars) ? new Intl.NumberFormat(language === "en" ? "en" : "zh-CN").format(githubStars) : "…";
    document.querySelectorAll(".site-nav-stars, [data-github-stars], #githubStars").forEach((element) => { element.textContent = formatted; });
    window.dispatchEvent(new CustomEvent("image2:githubstars", { detail: { value: githubStars, formatted } }));
  }

  function cacheGitHubStars(value) {
    if (!Number.isFinite(value)) return;
    updateSiteStars(value);
    try { localStorage.setItem(STAR_CACHE_KEY, JSON.stringify({ value, savedAt: Date.now() })); } catch {}
  }

  async function requestGitHubStars() {
    if (githubStarsRequested) return;
    if (cachedStars && Date.now() - cachedStars.savedAt < STAR_CACHE_TTL) return;
    githubStarsRequested = true;
    try {
      const response = await fetch("https://api.github.com/repos/zhu-guli326/image2_UI_skill", {
        headers: { Accept: "application/vnd.github+json" },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
      const value = Number((await response.json()).stargazers_count);
      if (!Number.isFinite(value)) throw new Error("Missing GitHub star count");
      cacheGitHubStars(value);
    } catch {
      try {
        const response = await fetch("https://img.shields.io/github/stars/zhu-guli326/image2_UI_skill.json", { cache: "no-store" });
        if (!response.ok) return;
        const value = Number((await response.json()).value);
        if (Number.isFinite(value)) cacheGitHubStars(value);
      } catch {}
    }
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
    switcher.classList.remove("is-compact");
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
    const pages = /^(?:index|library|learn|brands|launcher|skills|vocabulary|reference|markdown|about|privacy|contact)\.html$/i;
    root.querySelectorAll("a[href]").forEach((link) => {
      const raw = link.getAttribute("href");
      if (!raw || raw.startsWith("#") || /^(?:https?:|mailto:|tel:|javascript:)/i.test(raw)) return;
      try {
        const url = new URL(raw, window.location.href);
        if (url.origin !== window.location.origin || !pages.test(url.pathname.split("/").pop() || "")) return;
        url.searchParams.set("lang", language);
        if (new URL(window.location.href).searchParams.get("embed") === "1") url.searchParams.set("embed", "1");
        const path = window.location.pathname.includes("/lab/") ? `../${url.pathname.split("/").pop()}` : url.pathname.split("/").pop();
        link.setAttribute("href", `${path}${url.search}${url.hash}`);
      } catch {}
    });
  }

  function mountSiteFooter() {
    if (!document.body || document.body.dataset.siteFooter === "disabled" || document.querySelector("[data-site-footer]")) return;
    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.dataset.siteFooter = "";
    footer.innerHTML = `<div class="site-footer-inner"><p><strong>ONDesign</strong><span>AI × UI design learning studio</span></p><nav aria-label="${language === "en" ? "Footer" : "页脚导航"}"><a href="./about.html" data-i18n="footer.about">${t("footer.about")}</a><a href="./privacy.html" data-i18n="footer.privacy">${t("footer.privacy")}</a><a href="./contact.html" data-i18n="footer.contact">${t("footer.contact")}</a><a href="https://github.com/zhu-guli326/image2_UI_skill" target="_blank" rel="noopener noreferrer">GitHub</a></nav><small>© 2026 ONDesign. Content and examples are for learning purposes.</small></div>`;
    document.body.appendChild(footer);
    localizeLinks(footer);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        if (footer.isConnected) document.body.appendChild(footer);
      }, { once: true });
    }
  }

  function hydrateSiteHeader(header) {
    renderSiteHeader(header);
    if (header.hidden) return;
    header.querySelectorAll("[data-site-nav]").forEach(renderSiteNavigation);
    mountSwitches();
    applyDataTranslations(header);
    localizeLinks(header);
    updateSiteStars(githubStars);
    mountSiteFooter();
  }

  if ("customElements" in window && !customElements.get("image2-site-header")) {
    customElements.define("image2-site-header", class extends HTMLElement {
      connectedCallback() { hydrateSiteHeader(this); }
    });
  }

  // The task workspace owns same-page drawers and browser history, so it must
  // remain a top-level document rather than an embedded shell route.
  const SHELL_PAGE_PATTERN = /\/(?:index|library|launcher|brands|learn|skills|vocabulary)\.html$/i;
  // Keep top-level navigation on full document loads. Reusing an iframe shell
  // makes page-specific layout rules leak into the persistent header.
  const ENABLE_EMBEDDED_SHELL = false;
  const prefetchedPages = new Set();
  let shellElement = null;
  let shellFrame = null;
  let shellNavigationId = 0;

  function routableUrl(value) {
    try {
      const url = new URL(value, window.location.href);
      return url.origin === window.location.origin && SHELL_PAGE_PATTERN.test(url.pathname) ? url : null;
    } catch { return null; }
  }

  function embeddedUrl(route) {
    const url = new URL(route.href);
    url.searchParams.set("embed", "1");
    url.searchParams.set("lang", language);
    return url.href;
  }

  function ensureShell() {
    if (shellElement) return shellElement;
    shellElement = document.createElement("main");
    shellElement.className = "site-app-shell";
    shellElement.hidden = true;
    shellElement.setAttribute("aria-live", "polite");
    document.body.append(shellElement);
    return shellElement;
  }

  function refreshPersistentHeader() {
    const header = document.querySelector("[data-site-header]");
    if (header) hydrateSiteHeader(header);
  }

  function navigateInShell(value, { historyMode = "push", force = false } = {}) {
    const route = routableUrl(value);
    if (!route) return false;
    route.searchParams.delete("embed");
    route.searchParams.set("lang", language);
    if (route.href === window.location.href && shellFrame && !force) return true;

    const navigationId = ++shellNavigationId;
    const shell = ensureShell();
    const nextFrame = document.createElement("iframe");
    nextFrame.className = "site-shell-frame is-next";
    nextFrame.title = language === "en" ? "Image2 UI page content" : "Image2 UI 页面内容";
    nextFrame.src = embeddedUrl(route);
    shell.append(nextFrame);

    if (historyMode === "push") window.history.pushState({ image2Shell: true }, "", route);
    else if (historyMode === "replace") window.history.replaceState({ image2Shell: true }, "", route);
    refreshPersistentHeader();

    nextFrame.addEventListener("load", () => {
      if (navigationId !== shellNavigationId) { nextFrame.remove(); return; }
      const previousFrame = shellFrame;
      const swap = () => {
        document.body.classList.add("site-shell-active");
        shell.hidden = false;
        previousFrame?.remove();
        nextFrame.classList.remove("is-next");
        nextFrame.classList.add("is-current");
        shellFrame = nextFrame;
        try { document.title = nextFrame.contentDocument?.title || document.title; } catch {}
      };
      if (document.startViewTransition) document.startViewTransition(swap);
      else swap();
    }, { once: true });
    return true;
  }

  function prefetchPage(value) {
    const url = routableUrl(value);
    if (!url || url.href === window.location.href || prefetchedPages.has(url.href)) return;
    prefetchedPages.add(url.href);
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "document";
    link.href = url.href;
    document.head.append(link);
  }

  function prefetchPrimaryPages() {
    if (new URL(window.location.href).searchParams.get("embed") === "1") return;
    siteNavigationItems().forEach((item) => prefetchPage(resolveLocalHref(item.href)));
  }

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest?.(".site-header a[href]");
    if (!link || link.target === "_blank") return;
    link.classList.add("is-navigating");
    link.setAttribute("aria-busy", "true");
    window.setTimeout(() => {
      link.classList.remove("is-navigating");
      link.removeAttribute("aria-busy");
    }, 4000);
    if (ENABLE_EMBEDDED_SHELL && navigateInShell(link.href)) event.preventDefault();
  });
  document.addEventListener("pointerover", (event) => {
    const link = event.target.closest?.(".site-header a[href]");
    if (link) prefetchPage(link.href);
  }, { passive: true });
  document.addEventListener("focusin", (event) => {
    const link = event.target.closest?.(".site-header a[href]");
    if (link) prefetchPage(link.href);
  });

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin || event.data?.type !== "image2:embedded-route") return;
    const route = routableUrl(event.data.url);
    if (!route) return;
    route.searchParams.delete("embed");
    if (route.pathname !== window.location.pathname || route.search !== window.location.search) {
      window.history.replaceState({ image2Shell: true }, "", route);
      refreshPersistentHeader();
    }
  });

  function refresh() {
    setHtmlLanguage();
    renderSiteHeader();
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
    if (ENABLE_EMBEDDED_SHELL && shellFrame) navigateInShell(window.location.href, { historyMode: "replace", force: true });
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
        if (url.origin === window.location.origin) {
          url.searchParams.set("lang", language);
          const page = url.pathname.split("/").pop() || "";
          if (new URL(window.location.href).searchParams.get("embed") === "1" && /^(?:index|library|learn|brands|launcher|skills|vocabulary)\.html$/i.test(page)) url.searchParams.set("embed", "1");
        }
        return url.href;
      } catch { return value; }
    },
  });

  window.image2Project = Object.freeze({
    read: readCurrentProject,
    save(patch) {
      const next = { ...readCurrentProject(), ...(patch || {}) };
      try { localStorage.setItem(PROJECT_KEY, JSON.stringify(next)); } catch {}
      window.dispatchEvent(new CustomEvent("image2:projectchange", { detail: next }));
      return next;
    },
  });

  window.addEventListener("storage", (event) => {
    if (event.key === STAR_CACHE_KEY && event.newValue) {
      try {
        const cached = JSON.parse(event.newValue);
        if (Number.isFinite(cached?.value)) updateSiteStars(cached.value);
      } catch {}
    }
  });

  window.addEventListener("popstate", () => {
    const queryLanguage = new URL(window.location.href).searchParams.get("lang");
    const next = isSupported(queryLanguage) ? queryLanguage : readLanguage();
    if (next === language) return;
    language = next;
    refresh();
  });

  window.addEventListener("popstate", () => {
    if (ENABLE_EMBEDDED_SHELL && (shellFrame || document.body?.classList.contains("site-shell-active"))) {
      navigateInShell(window.location.href, { historyMode: "none", force: true });
    }
  });

  const schedulePrefetch = () => {
    if ("requestIdleCallback" in window) window.requestIdleCallback(prefetchPrimaryPages, { timeout: 1600 });
    else window.setTimeout(prefetchPrimaryPages, 350);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", schedulePrefetch, { once: true });
  else schedulePrefetch();

  if (new URL(window.location.href).searchParams.get("embed") === "1" && window.parent !== window) {
    const parentRoute = new URL(window.location.href);
    parentRoute.searchParams.delete("embed");
    window.parent.postMessage({ type: "image2:embedded-route", url: parentRoute.href }, window.location.origin);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", refresh, { once: true });
  else refresh();
})();
