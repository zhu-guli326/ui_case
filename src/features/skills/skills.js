const repositories = [
  { slug: "Vincentwei1021/video-shotcraft", category: "VIDEO", title: "video-shotcraft", skillName: "video-shotcraft", fallback: "面向产品宣传视频的镜头配方与动态样例库。", focus: "视频叙事 / 动态样例" },
  { slug: "emilkowalski/skills", category: "DESIGN", title: "emilkowalski / skills", fallback: "为设计师和工程师准备的一组实用 skills。", focus: "产品设计 / 前端体验" },
  { slug: "pbakaus/impeccable", category: "DESIGN", title: "pbakaus / impeccable", fallback: "帮助 AI 更好理解设计语言与界面质量的 skill。", focus: "设计语言 / UI 品质" },
  { slug: "greensock/GSAP", category: "MOTION", title: "greensock / GSAP", fallback: "现代 Web 动画的成熟工具与生态。", focus: "动效系统 / 交互反馈" },
  { slug: "Leonxlnx/taste-skill", category: "DESIGN", title: "Leonxlnx / taste-skill", fallback: "让 AI 避免生成无聊、通用、模板化界面的设计品味 skill。", focus: "去模板感 / 视觉判断" },
  { slug: "mattpocock/skills", category: "ENGINEERING", title: "mattpocock / skills", fallback: "面向真实工程工作的可复用 agent skills。", focus: "工程工作流 / Agent" },
  { slug: "anthropics/skills", category: "DESIGN", title: "anthropics / skills", fallback: "包含 frontend-design 等面向真实创作任务的官方 skill 集合。", focus: "界面构建 / 创作工作流" },
  { slug: "vercel-labs/agent-skills", category: "FRONTEND", title: "vercel-labs / agent-skills", fallback: "面向 Web 产品的设计规范、React 模式与前端质量检查。", focus: "Web 规范 / React 质量" },
  { slug: "nextlevelbuilder/ui-ux-pro-max-skill", category: "UX", title: "nextlevelbuilder / ui-ux-pro-max-skill", fallback: "从产品意图到视觉系统，帮助 AI 产出更完整的 UI/UX 方案。", focus: "UX 规划 / 视觉系统" },
  { slug: "motiondivision/motion", category: "MOTION", title: "motiondivision / motion", fallback: "为 React、Vue 和原生 Web 提供流畅、可组合的界面动效。", focus: "组件动效 / 微交互" },
  { slug: "radix-ui/primitives", category: "A11Y", title: "radix-ui / primitives", fallback: "无样式、可访问、可组合的 UI 原语，适合建立可靠组件层。", focus: "无障碍 / 组件原语" },
  { slug: "tailwindlabs/headlessui", category: "A11Y", title: "tailwindlabs / headlessui", fallback: "为 Tailwind 设计的无样式交互组件，覆盖菜单、弹窗和列表等模式。", focus: "交互模式 / 可访问性" },
  { slug: "lucide-icons/lucide", category: "SYSTEM", title: "lucide-icons / lucide", fallback: "清晰、可定制的开源图标系统，适合统一产品中的图标语言。", focus: "图标系统 / 视觉一致性" },
  { slug: "pmndrs/react-three-fiber", category: "3D", title: "pmndrs / react-three-fiber", fallback: "在 React 中构建 3D 体验的声明式渲染工具。", focus: "3D 交互 / 空间体验" },
  { slug: "storybookjs/storybook", category: "SYSTEM", title: "storybookjs / storybook", fallback: "用于开发、测试和记录 UI 组件的工作台。", focus: "组件文档 / 设计协作" },
  { slug: "google-labs-code/stitch-skills", category: "AI DESIGN", title: "google-labs-code / stitch-skills", fallback: "为 Google Stitch MCP 准备的 Agent Skill 集合，覆盖从界面生成到迭代的工作流。", focus: "界面生成 / MCP 工作流" },
  { slug: "bergside/awesome-design-skills", category: "DIRECTORY", title: "bergside / awesome-design-skills", fallback: "整理大量 DESIGN.md 与 SKILL.md 设计能力文件的开放目录。", focus: "设计资源 / Skill 发现" },
  { slug: "SeanJ1ang/design-judge-skills", category: "REVIEW", title: "SeanJ1ang / design-judge-skills", fallback: "帮助 AI 从视觉质量、信息层级和完成度角度审查界面。", focus: "设计评审 / 质量检查" },
  { slug: "ConardLi/garden-skills", category: "DESIGN", title: "ConardLi / garden-skills", fallback: "面向 AI 产品开发的多类可复用 skills，包含界面与体验工作流。", focus: "产品开发 / 复用能力" },
  { slug: "Owl-Listener/designer-skills", category: "DESIGN", title: "Owl-Listener / designer-skills", fallback: "面向设计任务的轻量 skill 集合，适合补充日常界面决策。", focus: "日常设计 / 决策辅助" },
  { slug: "superdesigndev/superdesign-skill", category: "AI DESIGN", title: "superdesigndev / superdesign-skill", fallback: "把设计思考、视觉方向和前端落地连接起来的设计 skill。", focus: "设计思考 / 前端落地" },
  { slug: "mistyhx/frontend-design-audit", category: "REVIEW", title: "mistyhx / frontend-design-audit", fallback: "面向前端页面的设计审计与改进检查清单。", focus: "页面审计 / 改进建议" }
];

const repositoriesEn = [
  { slug: "Vincentwei1021/video-shotcraft", category: "VIDEO", title: "video-shotcraft", fallback: "An AI video skill with shot recipes and motion examples for product films.", focus: "Video storytelling / motion examples" },
  { slug: "emilkowalski/skills", category: "DESIGN", title: "emilkowalski / skills", fallback: "A practical collection of skills for designers and engineers.", focus: "Product design / frontend experience" },
  { slug: "pbakaus/impeccable", category: "DESIGN", title: "pbakaus / impeccable", fallback: "A skill that helps AI understand design language and interface quality.", focus: "Design language / UI quality" },
  { slug: "greensock/GSAP", category: "MOTION", title: "greensock / GSAP", fallback: "A mature toolkit and ecosystem for modern Web animation.", focus: "Motion systems / interaction feedback" },
  { slug: "Leonxlnx/taste-skill", category: "DESIGN", title: "Leonxlnx / taste-skill", fallback: "A design-taste skill that helps AI avoid bland, generic, templated interfaces.", focus: "Less templated / visual judgment" },
  { slug: "mattpocock/skills", category: "ENGINEERING", title: "mattpocock / skills", fallback: "Reusable agent skills for real-world engineering work.", focus: "Engineering workflow / Agent" },
  { slug: "anthropics/skills", category: "DESIGN", title: "anthropics / skills", fallback: "An official collection of skills for real creative tasks, including frontend-design.", focus: "Interface building / creative workflow" },
  { slug: "vercel-labs/agent-skills", category: "FRONTEND", title: "vercel-labs / agent-skills", fallback: "Design guidelines, React patterns and frontend quality checks for Web products.", focus: "Web guidelines / React quality" },
  { slug: "nextlevelbuilder/ui-ux-pro-max-skill", category: "UX", title: "nextlevelbuilder / ui-ux-pro-max-skill", fallback: "Helps AI move from product intent to a more complete UI/UX and visual system.", focus: "UX planning / visual systems" },
  { slug: "motiondivision/motion", category: "MOTION", title: "motiondivision / motion", fallback: "Smooth, composable interface motion for React, Vue and the Web platform.", focus: "Component motion / micro-interactions" },
  { slug: "radix-ui/primitives", category: "A11Y", title: "radix-ui / primitives", fallback: "Unstyled, accessible and composable UI primitives for a dependable component layer.", focus: "Accessibility / primitives" },
  { slug: "tailwindlabs/headlessui", category: "A11Y", title: "tailwindlabs / headlessui", fallback: "Unstyled accessible interaction components designed for Tailwind projects.", focus: "Interaction patterns / accessibility" },
  { slug: "lucide-icons/lucide", category: "SYSTEM", title: "lucide-icons / lucide", fallback: "A clear, customizable open-source icon system for consistent product language.", focus: "Icon systems / visual consistency" },
  { slug: "pmndrs/react-three-fiber", category: "3D", title: "pmndrs / react-three-fiber", fallback: "A declarative renderer for building 3D experiences in React.", focus: "3D interaction / spatial experience" },
  { slug: "storybookjs/storybook", category: "SYSTEM", title: "storybookjs / storybook", fallback: "A workbench for developing, testing and documenting UI components.", focus: "Component docs / design collaboration" },
  { slug: "google-labs-code/stitch-skills", category: "AI DESIGN", title: "google-labs-code / stitch-skills", fallback: "Agent Skills for the Google Stitch MCP server, covering interface generation and iteration workflows.", focus: "Interface generation / MCP workflow" },
  { slug: "bergside/awesome-design-skills", category: "DIRECTORY", title: "bergside / awesome-design-skills", fallback: "An open directory of DESIGN.md and SKILL.md files for discovering design capabilities.", focus: "Design resources / skill discovery" },
  { slug: "SeanJ1ang/design-judge-skills", category: "REVIEW", title: "SeanJ1ang / design-judge-skills", fallback: "Helps AI review interface quality, hierarchy and finish from a visual-design perspective.", focus: "Design review / quality checks" },
  { slug: "ConardLi/garden-skills", category: "DESIGN", title: "ConardLi / garden-skills", fallback: "Reusable skills for AI product development, including interface and experience workflows.", focus: "Product development / reusable skills" },
  { slug: "Owl-Listener/designer-skills", category: "DESIGN", title: "Owl-Listener / designer-skills", fallback: "A lightweight collection of skills for everyday interface decisions and design tasks.", focus: "Daily design / decision support" },
  { slug: "superdesigndev/superdesign-skill", category: "AI DESIGN", title: "superdesigndev / superdesign-skill", fallback: "A design skill that connects design thinking, visual direction and frontend execution.", focus: "Design thinking / frontend craft" },
  { slug: "mistyhx/frontend-design-audit", category: "REVIEW", title: "mistyhx / frontend-design-audit", fallback: "A design-audit checklist for reviewing and improving frontend pages.", focus: "Page audits / improvement ideas" }
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
  "skills.heroBody": { zh: "收录界面、体验、动效、视频、无障碍、设计系统与 AI 设计工作流相关的开源 Skill 与工具。现在已覆盖 22 个方向入口，可直接跳转到仓库查看。", en: "A curated directory of open-source Skills and tools for interfaces, UX, motion, video, accessibility, design systems and AI design workflows. It now covers 22 practical entry points with direct links to source repositories." },
  "skills.configure": { zh: "配置并调用", en: "Configure and use" },
  "skills.browse": { zh: "浏览 Skills", en: "Browse Skills" },
  "skills.radarLabel": { zh: "当前观察指标", en: "Current directory metrics" },
  "skills.radarSkills": { zh: "开源 Skills", en: "Open-source Skills" },
  "skills.radarDirections": { zh: "设计方向", en: "Design directions" },
  "skills.radarSource": { zh: "实时数据源", en: "Live data source" },
  "skills.radarNote": { zh: "持续补充 · 从设计判断到组件落地", en: "Continuously curated · from design judgment to component craft" },
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
      <div class="repo-actions">
        <button class="repo-copy-btn" type="button" data-copy-repo="${item.slug}" title="${currentLanguage === "en" ? "Copy repo slug" : "复制仓库名"}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span>${currentLanguage === "en" ? "Copy" : "复制"}</span></button>
        <button class="repo-clone-btn" type="button" data-clone-repo="${item.slug}" title="${currentLanguage === "en" ? "Clone into the Codex skills folder" : "克隆到 Codex 配置的 skills 目录"}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg><span>${currentLanguage === "en" ? "Clone" : "克隆"}</span></button>
      </div>
      </article>
  `).join("");
  repoList.querySelectorAll("[data-repo-link]").forEach((link) => link.addEventListener("click", () => track("skill_repo_open", { repository: link.dataset.repoLink })));
  repoList.querySelectorAll("[data-copy-repo]").forEach((btn) => btn.addEventListener("click", () => copyRepoSlug(btn)));
  repoList.querySelectorAll("[data-clone-repo]").forEach((btn) => btn.addEventListener("click", () => copyCloneCommand(btn)));
}

function copyToClipboard(btn, value) {
  const span = btn.querySelector("span");
  const originalLabel = span ? span.textContent : "";
  const doneLabel = currentLanguage === "en" ? "Copied!" : "已复制";
  const failLabel = currentLanguage === "en" ? "Failed" : "复制失败";
  const succeed = () => {
    btn.classList.add("is-copied");
    if (span) span.textContent = doneLabel;
    window.setTimeout(() => {
      btn.classList.remove("is-copied");
      if (span) span.textContent = originalLabel;
    }, 1800);
  };
  const fail = () => { if (span) span.textContent = failLabel; };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(value).then(succeed).catch(fail);
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try { document.execCommand("copy"); succeed(); } catch { fail(); }
    textarea.remove();
  }
}

function copyRepoSlug(btn) {
  copyToClipboard(btn, btn.dataset.copyRepo);
}

function copyCloneCommand(btn) {
  const slug = btn.dataset.cloneRepo;
  const repoName = slug.split("/").pop();
  copyToClipboard(btn, `git clone https://github.com/${slug}.git ~/.codex/skills/${repoName}`);
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
