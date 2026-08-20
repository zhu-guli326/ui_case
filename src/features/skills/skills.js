const repositories = [
  { slug: "Vincentwei1021/video-shotcraft", category: "VIDEO", title: "video-shotcraft", skillName: "video-shotcraft", fallback: "面向产品宣传视频的镜头配方与动态样例库。", focus: "视频叙事 / 动态样例" },
  { slug: "emilkowalski/skills", category: "DESIGN", title: "emilkowalski / skills", fallback: "为设计师和工程师准备的一组实用 skills。", focus: "产品设计 / 前端体验" },
  { slug: "pbakaus/impeccable", category: "DESIGN", title: "pbakaus / impeccable", fallback: "帮助 AI 更好理解设计语言与界面质量的 skill。", focus: "设计语言 / UI 品质" },
  { slug: "greensock/GSAP", category: "MOTION", title: "greensock / GSAP", fallback: "现代 Web 动画的成熟工具与生态。", focus: "动效系统 / 交互反馈" },
  { slug: "Leonxlnx/taste-skill", category: "DESIGN", title: "Leonxlnx / taste-skill", fallback: "让 AI 避免生成无聊、通用、模板化界面的设计品味 skill。", focus: "去模板感 / 视觉判断" },
  { slug: "mattpocock/skills", category: "ENGINEERING", title: "mattpocock / skills", fallback: "面向真实工程工作的可复用 agent skills。", focus: "工程工作流 / Agent" }
];

const repositoriesEn = [
  { slug: "Vincentwei1021/video-shotcraft", category: "VIDEO", title: "video-shotcraft", fallback: "An AI video skill with shot recipes and motion examples for product films.", focus: "Video storytelling / motion examples" },
  { slug: "emilkowalski/skills", category: "DESIGN", title: "emilkowalski / skills", fallback: "A practical collection of skills for designers and engineers.", focus: "Product design / frontend experience" },
  { slug: "pbakaus/impeccable", category: "DESIGN", title: "pbakaus / impeccable", fallback: "A skill that helps AI understand design language and interface quality.", focus: "Design language / UI quality" },
  { slug: "greensock/GSAP", category: "MOTION", title: "greensock / GSAP", fallback: "A mature toolkit and ecosystem for modern Web animation.", focus: "Motion systems / interaction feedback" },
  { slug: "Leonxlnx/taste-skill", category: "DESIGN", title: "Leonxlnx / taste-skill", fallback: "A design-taste skill that helps AI avoid bland, generic, templated interfaces.", focus: "Less templated / visual judgment" },
  { slug: "mattpocock/skills", category: "ENGINEERING", title: "mattpocock / skills", fallback: "Reusable agent skills for real-world engineering work.", focus: "Engineering workflow / Agent" }
];

const designWebsites = [
  { name: "Dribbble", url: "https://dribbble.com", type: "视觉灵感", description: "适合快速浏览单屏视觉、组件细节、品牌语言与插画风格。", bestFor: "首页视觉 / 组件灵感" },
  { name: "Behance", url: "https://www.behance.net", type: "完整项目", description: "更适合研究从品牌、页面到案例叙事的一整套项目表达。", bestFor: "品牌系统 / 案例拆解" },
  { name: "Awwwards", url: "https://www.awwwards.com", type: "网页体验", description: "聚焦高质量网站、交互叙事与创意开发作品。", bestFor: "作品集 / 交互动效" },
  { name: "Mobbin", url: "https://mobbin.com", type: "产品 UI", description: "按真实产品流程查找移动端与 Web 应用界面。", bestFor: "App 流程 / UX 模式" },
  { name: "Land-book", url: "https://land-book.com", type: "落地页", description: "专注收集落地页和营销网站，适合寻找首屏与转化结构。", bestFor: "Landing page / 首屏" },
  { name: "SiteInspire", url: "https://www.siteinspire.com", type: "网站策展", description: "按风格、行业和平台筛选网页参考，适合建立视觉情绪板。", bestFor: "网页风格 / Moodboard" }
];

const designWebsitesEn = [
  { name: "Dribbble", url: "https://dribbble.com", type: "Visual inspiration", description: "Quickly browse single-screen visuals, component details, brand language and illustration styles.", bestFor: "Hero visuals / component ideas" },
  { name: "Behance", url: "https://www.behance.net", type: "Full projects", description: "Study complete project narratives across branding, pages and case-study presentation.", bestFor: "Brand systems / case studies" },
  { name: "Awwwards", url: "https://www.awwwards.com", type: "Web experiences", description: "Explore high-quality websites, interaction stories and creative development work.", bestFor: "Portfolios / interaction motion" },
  { name: "Mobbin", url: "https://mobbin.com", type: "Product UI", description: "Find mobile and Web app interfaces organized by real product flows.", bestFor: "App flows / UX patterns" },
  { name: "Land-book", url: "https://land-book.com", type: "Landing pages", description: "A focused collection of landing and marketing sites for hero and conversion structures.", bestFor: "Landing pages / hero sections" },
  { name: "SiteInspire", url: "https://www.siteinspire.com", type: "Web curation", description: "Filter web references by style, industry and platform to build a visual moodboard.", bestFor: "Web style / moodboards" }
];

const skillsTranslations = {
  "skills.heroEyebrow": { zh: "OPEN SOURCE SKILL DIRECTORY", en: "OPEN SOURCE SKILL DIRECTORY" },
  "skills.heroTitle": { zh: "设计与创作", en: "Design & creation" },
  "skills.heroTitleEm": { zh: "Skill 清单。", en: "Skill directory." },
  "skills.heroBody": { zh: "收录和界面、动效、视频、设计质量相关的开源 Skill 与工具。数据在打开页面时从 GitHub 更新，可直接跳转到仓库查看。", en: "A curated directory of open-source Skills and tools for interfaces, motion, video and design quality. Data refreshes from GitHub when this page opens, so you can jump straight to the source repositories." },
  "skills.configure": { zh: "配置并调用", en: "Configure and use" },
  "skills.browse": { zh: "浏览 Skills", en: "Browse Skills" },
  "skills.radarLabel": { zh: "当前观察指标", en: "Current directory metrics" },
  "skills.radarSkills": { zh: "开源 Skills", en: "Open-source Skills" },
  "skills.radarDirections": { zh: "设计方向", en: "Design directions" },
  "skills.radarSource": { zh: "实时数据源", en: "Live data source" },
  "skills.radarNote": { zh: "持续补充 · 仅收录可公开访问的仓库", en: "Continuously curated · public repositories only" },
  "skills.repoEyebrow": { zh: "CURATED REPOSITORIES", en: "CURATED REPOSITORIES" },
  "skills.repoTitle": { zh: "Skill 列表", en: "Skill directory" },
  "skills.repoBody": { zh: "Star、Fork 与更新时间由 GitHub API 提供。点击项目名直接打开源码仓库。", en: "Stars, forks and update times come from the GitHub API. Select a project name to open its source repository." },
  "skills.websiteEyebrow": { zh: "DESIGN REFERENCE WEBSITES", en: "DESIGN REFERENCE WEBSITES" },
  "skills.websiteTitle": { zh: "网页推荐", en: "Web references" },
  "skills.websiteBody": { zh: "用于寻找网页、产品界面与完整项目参考。每个平台的内容密度和适合查找的内容都不同。", en: "Reference sites for web pages, product interfaces and complete projects. Each platform has a different content density and focus." }
};

const repoList = document.querySelector("#repoList");
const track = (name, properties) => window.image2Analytics?.track(name, properties);
let currentLanguage = "zh";
let resolvedRepositories = null;

function formatNumber(value) {
  if (typeof value !== "number") return "--";
  return value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : String(value);
}

function formatDate(date) {
  if (!date) return currentLanguage === "en" ? "Recently updated" : "近期更新";
  const days = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 86400000));
  if (currentLanguage === "en") {
    if (days === 0) return "Updated today";
    if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
    if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) === 1 ? "" : "s"} ago`;
    return `${Math.floor(days / 30)} month${Math.floor(days / 30) === 1 ? "" : "s"} ago`;
  }
  if (days === 0) return "今天更新";
  if (days < 7) return `${days} 天前更新`;
  if (days < 30) return `${Math.floor(days / 7)} 周前更新`;
  return `${Math.floor(days / 30)} 个月前更新`;
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function renderRepositories(items) {
  repoList.innerHTML = items.map((item) => `
    <article class="repo-row">
      <p class="repo-category">${escapeHtml(item.category)}</p>
      <div class="repo-main"><a href="https://github.com/${item.slug}" target="_blank" rel="noreferrer" data-repo-link="${item.slug}">${escapeHtml(item.title)}</a><p>${escapeHtml(currentLanguage === "en" ? (item.description || item.fallback) : item.fallback)}</p></div>
      <p class="repo-focus">${escapeHtml(item.focus)}</p>
      <div class="repo-stats"><span title="GitHub Stars">Star <b>${formatNumber(item.stars)}</b></span><span title="Forks">Fork <b>${formatNumber(item.forks)}</b></span><small>${formatDate(item.updatedAt)}</small></div>
    </article>
  `).join("");
  repoList.querySelectorAll("[data-repo-link]").forEach((link) => link.addEventListener("click", () => track("skill_repo_open", { repository: link.dataset.repoLink })));
}

function renderDesignWebsites() {
  const websiteList = document.querySelector("#websiteList");
  const sites = currentLanguage === "en" ? designWebsitesEn : designWebsites;
  websiteList.innerHTML = sites.map((site, index) => `
    <article class="website-row">
      <p>${String(index + 1).padStart(2, "0")}</p>
      <div><a href="${site.url}" target="_blank" rel="noreferrer" data-design-site="${site.name}">${site.name}</a><span>${site.type}</span></div>
      <p>${site.description}</p>
      <small>${site.bestFor}</small>
    </article>
  `).join("");
  websiteList.querySelectorAll("[data-design-site]").forEach((link) => link.addEventListener("click", () => track("design_site_open", { site: link.dataset.designSite })));
}

async function loadRepositoryData() {
  renderRepositories(currentLanguage === "en" ? repositoriesEn : repositories);
  const resolved = await Promise.all(repositories.map(async (item) => {
    try {
      const response = await fetch(`https://api.github.com/repos/${item.slug}`, { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" });
      if (!response.ok) throw new Error("GitHub API request failed");
      const repo = await response.json();
      return { ...item, description: repo.description, stars: repo.stargazers_count, forks: repo.forks_count, updatedAt: repo.pushed_at };
    } catch { return item; }
  }));
  resolvedRepositories = resolved;
  renderRepositories(currentLanguage === "en"
    ? resolved.map((item, index) => ({ ...item, fallback: repositoriesEn[index].fallback, focus: repositoriesEn[index].focus }))
    : resolved);
}

function renderPage(language = "zh") {
  currentLanguage = language === "en" ? "en" : "zh";
  document.title = currentLanguage === "en" ? "Design Skill Directory · IMAGE2 UI" : "设计 Skill 观察 · IMAGE2 UI";
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = currentLanguage === "en"
    ? "A curated directory of open-source design Skills and tools."
    : "设计 Skill 观察与可复制提示词。";
  renderRepositories(resolvedRepositories
    ? (currentLanguage === "en"
      ? resolvedRepositories.map((item, index) => ({ ...item, fallback: repositoriesEn[index].fallback, focus: repositoriesEn[index].focus }))
      : resolvedRepositories)
    : (currentLanguage === "en" ? repositoriesEn : repositories));
  renderDesignWebsites();
}

if (window.image2I18n) {
  window.image2I18n.addTranslations(skillsTranslations);
  window.image2I18n.registerPage(renderPage);
  window.image2I18n.refresh();
} else {
  renderPage("zh");
}
loadRepositoryData();
track("skills_page_view");
