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
  { slug: "mistyhx/frontend-design-audit", category: "REVIEW", title: "mistyhx / frontend-design-audit", fallback: "面向前端页面的设计审计与改进检查清单。", focus: "页面审计 / 改进建议" },
  { slug: "plugin87/ux-ui-agent-skills", category: "UX", title: "plugin87 / ux-ui-agent-skills", fallback: "专注 UX/UI 任务的 Agent Skills 集合，覆盖界面体验与产品设计相关工作。", focus: "UX/UI 设计 / Agent 工作流" },
  { slug: "ZeroZ-lab/cc-design", category: "DESIGN", title: "ZeroZ-lab / cc-design", fallback: "面向 Claude Code 的设计插件与参考资料，包含设计红旗和插件发布工作流。", focus: "设计规范 / Claude Code" },
  { slug: "JimLiu/baoyu-design", category: "SYSTEM", title: "JimLiu / baoyu-design", fallback: "围绕设计系统创建、Figma 导入和实验工作流组织的一套设计能力。", focus: "设计系统 / Figma 导入" },
  { slug: "scottstts/Threejs-Awesome-Graphics-Agent-Skills", category: "3D", title: "scottstts / Threejs-Awesome-Graphics-Agent-Skills", fallback: "面向 Three.js 与图形创作的 Agent Skills 集合，适合补充 3D 和交互视觉能力。", focus: "Three.js / 图形 Agent" },
  { slug: "Owl-Listener/ai-design-skills", category: "DIRECTORY", title: "Owl-Listener / ai-design-skills", fallback: "整理 AI 设计能力和扩展入口的开源集合，适合继续发现跨模型的设计工作流。", focus: "AI 设计 / Skill 发现" }
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
  { slug: "mistyhx/frontend-design-audit", category: "REVIEW", title: "mistyhx / frontend-design-audit", fallback: "A design-audit checklist for reviewing and improving frontend pages.", focus: "Page audits / improvement ideas" },
  { slug: "plugin87/ux-ui-agent-skills", category: "UX", title: "plugin87 / ux-ui-agent-skills", fallback: "A collection of agent skills for UX/UI tasks, covering interface experience and product-design work.", focus: "UX/UI design / Agent workflow" },
  { slug: "ZeroZ-lab/cc-design", category: "DESIGN", title: "ZeroZ-lab / cc-design", fallback: "A Claude Code design plugin and reference set with design red flags and publishing workflows.", focus: "Design guidance / Claude Code" },
  { slug: "JimLiu/baoyu-design", category: "SYSTEM", title: "JimLiu / baoyu-design", fallback: "A design capability set around creating systems, importing from Figma and running design experiments.", focus: "Design systems / Figma import" },
  { slug: "scottstts/Threejs-Awesome-Graphics-Agent-Skills", category: "3D", title: "scottstts / Threejs-Awesome-Graphics-Agent-Skills", fallback: "An agent-skill collection for Three.js and graphics work, extending 3D and interactive visual capability.", focus: "Three.js / graphics agents" },
  { slug: "Owl-Listener/ai-design-skills", category: "DIRECTORY", title: "Owl-Listener / ai-design-skills", fallback: "An open collection of AI-design capabilities and extensions for discovering cross-model design workflows.", focus: "AI design / skill discovery" }
];

const designWebsites = [
  { name: "Dribbble", url: "https://dribbble.com", type: "视觉灵感", description: "适合快速浏览单屏视觉、组件细节、品牌语言与插画风格。", bestFor: "首页视觉 / 组件灵感" },
  { name: "Behance", url: "https://www.behance.net", type: "完整项目", description: "更适合研究从品牌、页面到案例叙事的一整套项目表达。", bestFor: "品牌系统 / 案例拆解" },
  { name: "Awwwards", url: "https://www.awwwards.com", type: "网页体验", description: "聚焦高质量网站、交互叙事与创意开发作品。", bestFor: "作品集 / 交互动效" },
  { name: "Mobbin", url: "https://mobbin.com", type: "产品 UI", description: "按真实产品流程查找移动端与 Web 应用界面。", bestFor: "App 流程 / UX 模式" },
  { name: "Land-book", url: "https://land-book.com", type: "落地页", description: "专注收集落地页和营销网站，适合寻找首屏与转化结构。", bestFor: "Landing page / 首屏" },
  { name: "SiteInspire", url: "https://www.siteinspire.com", type: "网站策展", description: "按风格、行业和平台筛选网页参考，适合建立视觉情绪板。", bestFor: "网页风格 / Moodboard" },
  { name: "Godly", url: "https://godly.website/", type: "创意网站", description: "收录强调视觉表达与交互叙事的网站，适合寻找更强的创意方向。", bestFor: "品牌 / 创意开发" },
  { name: "Refero", url: "https://refero.design/", type: "产品模式", description: "按真实界面与产品流程组织的 UI 参考，适合拆解功能与交互模式。", bestFor: "Web / App 流程" },
  { name: "SaaSFrame", url: "https://www.saasframe.io/", type: "SaaS 产品", description: "面向 SaaS 产品的界面与营销参考库，适合研究 B2B 信息结构。", bestFor: "SaaS / Dashboard" },
  { name: "Lapa Ninja", url: "https://www.lapa.ninja/", type: "落地页", description: "聚合营销与落地页案例，适合研究首屏、信息节奏与转化结构。", bestFor: "Landing / 转化" }
];

const designWebsitesEn = [
  { name: "Dribbble", url: "https://dribbble.com", type: "Visual inspiration", description: "Quickly browse single-screen visuals, component details, brand language and illustration styles.", bestFor: "Hero visuals / component ideas" },
  { name: "Behance", url: "https://www.behance.net", type: "Full projects", description: "Study complete project narratives across branding, pages and case-study presentation.", bestFor: "Brand systems / case studies" },
  { name: "Awwwards", url: "https://www.awwwards.com", type: "Web experiences", description: "Explore high-quality websites, interaction stories and creative development work.", bestFor: "Portfolios / interaction motion" },
  { name: "Mobbin", url: "https://mobbin.com", type: "Product UI", description: "Find mobile and Web app interfaces organized by real product flows.", bestFor: "App flows / UX patterns" },
  { name: "Land-book", url: "https://land-book.com", type: "Landing pages", description: "A focused collection of landing and marketing sites for hero and conversion structures.", bestFor: "Landing pages / hero sections" },
  { name: "SiteInspire", url: "https://www.siteinspire.com", type: "Web curation", description: "Filter web references by style, industry and platform to build a visual moodboard.", bestFor: "Web style / moodboards" },
  { name: "Godly", url: "https://godly.website/", type: "Creative web", description: "A collection of visually expressive, interaction-led websites for stronger creative directions.", bestFor: "Brand / creative dev" },
  { name: "Refero", url: "https://refero.design/", type: "Product patterns", description: "UI references organized around real screens and flows for studying product interaction patterns.", bestFor: "Web / app flows" },
  { name: "SaaSFrame", url: "https://www.saasframe.io/", type: "SaaS product", description: "A SaaS interface and marketing reference library for studying B2B information architecture.", bestFor: "SaaS / dashboards" },
  { name: "Lapa Ninja", url: "https://www.lapa.ninja/", type: "Landing pages", description: "Marketing and landing-page references for studying hero content, rhythm and conversion structure.", bestFor: "Landing / conversion" }
];

const skillCollections = [
  { name: "skills.sh", url: "https://skills.sh/", type: "Skill 发现", description: "面向 AI 编程助手的 Skill 目录与安装入口，适合继续发现可复用能力。", bestFor: "发现 / 安装" },
  { name: "Agent Skills", url: "https://agentskills.io/", type: "开放规范", description: "Agent Skills 的开放格式与实现说明，帮助理解 Skill 如何跨工具复用。", bestFor: "规范 / 兼容性" },
  { name: "Awesome Agent Skills", url: "https://github.com/VoltAgent/awesome-agent-skills", type: "开源集合", description: "社区维护的 Agent Skills 精选仓库，覆盖开发、研究、生产力等方向。", bestFor: "社区精选" },
  { name: "Awesome Claude Skills", url: "https://github.com/ComposioHQ/awesome-claude-skills", type: "开源集合", description: "围绕 Claude 与 Agent 工作流整理的 Skills、案例和资源入口。", bestFor: "Claude / Agent" },
  { name: "Smithery", url: "https://smithery.ai/", type: "MCP 生态", description: "可发现和管理 MCP 能力的目录，适合将 Skill 与外部工具连接起来。", bestFor: "MCP / 工具连接" },
  { name: "MCP.so", url: "https://mcp.so/", type: "MCP 目录", description: "聚合 MCP Server 与工具能力的公开目录，可用于补充 Agent 的调用范围。", bestFor: "MCP 发现" }
];

const skillCollectionsEn = [
  { name: "skills.sh", url: "https://skills.sh/", type: "Skill discovery", description: "A directory and install entry point for reusable AI coding-agent skills.", bestFor: "Discover / install" },
  { name: "Agent Skills", url: "https://agentskills.io/", type: "Open standard", description: "The open format and implementation guidance for reusable skills across agents.", bestFor: "Standard / compatibility" },
  { name: "Awesome Agent Skills", url: "https://github.com/VoltAgent/awesome-agent-skills", type: "Open-source list", description: "A community-maintained collection of agent skills for development, research and productivity.", bestFor: "Community picks" },
  { name: "Awesome Claude Skills", url: "https://github.com/ComposioHQ/awesome-claude-skills", type: "Open-source list", description: "Skills, examples and resources curated around Claude and agent workflows.", bestFor: "Claude / Agent" },
  { name: "Smithery", url: "https://smithery.ai/", type: "MCP ecosystem", description: "A directory for discovering and managing MCP capabilities alongside Skills.", bestFor: "MCP / connections" },
  { name: "MCP.so", url: "https://mcp.so/", type: "MCP directory", description: "A public directory of MCP servers and tool capabilities for expanding agent workflows.", bestFor: "MCP discovery" }
];

const skillsTranslations = {
  "footer.learn": { zh: "学习路径", en: "Learn" },
  "footer.vocabulary": { zh: "UI 词典", en: "UI vocabulary" },
  "footer.library": { zh: "案例库", en: "Case library" },
  "skills.heroEyebrow": { zh: "DESIGN SKILL MAP", en: "DESIGN SKILL MAP" },
  "skills.heroDiscover": { zh: "发现", en: "Discover" },
  "skills.heroUnit": { zh: "个", en: "" },
  "skills.heroTitle": { zh: "从任务出发，", en: "Start with the task." },
  "skills.heroTitleEm": { zh: "找到真正能用的设计 Skill。", en: "Find the design skill that fits." },
  "skills.heroBody": { zh: "这里不是仓库排行榜，而是一张设计能力地图。先选择你要完成的工作，再比较 Skill 的用途、维护状态与调用方式。", en: "This is a map of design capabilities, not a repository leaderboard. Start with the work you need to do, then compare purpose, activity and invocation." },
  "skills.configure": { zh: "配置调用环境", en: "Configure environment" },
  "skills.browse": { zh: "浏览全部 Skills", en: "Browse all Skills" },
  "skills.radarLabel": { zh: "当前观察指标", en: "Current directory metrics" },
  "skills.radarSkills": { zh: "收录 Skill", en: "Curated skills" },
  "skills.radarDirections": { zh: "任务路径", en: "Task paths" },
  "skills.radarSource": { zh: "数据来源", en: "Data source" },
  "skills.radarNote": { zh: "持续补充 · 从设计判断到组件落地", en: "Continuously curated · from design judgment to component craft" },
  "skills.repoEyebrow": { zh: "CHOOSE BY TASK", en: "CHOOSE BY TASK" },
  "skills.repoTitle": { zh: "浏览设计 Skills", en: "Browse design Skills" },
  "skills.repoBody": { zh: "先选任务路径，再从结果中挑选合适的 Skill。每个项目都保留仓库入口与一键复制调用命令。", en: "Choose a task path first, then compare the relevant skills. Every item keeps its repository link and one-click invocation command." },
  "skills.repoToolbarLabel": { zh: "Skill 筛选工具", en: "Skill directory filters" },
  "skills.repoSearch": { zh: "搜索名称、用途或仓库", en: "Search name, purpose or repository" },
  "skills.filters": { zh: "分类筛选", en: "Categories" },
  "skills.taskRailLabel": { zh: "按任务探索", en: "Explore by task" },
  "skills.sortCurated": { zh: "精选", en: "Curated" },
  "skills.sortStars": { zh: "Stars", en: "Stars" },
  "skills.sortUpdated": { zh: "最近更新", en: "Latest" },
  "skills.clearFilters": { zh: "重置", en: "Reset" },
  "skills.collectionEyebrow": { zh: "EXPLORE FURTHER", en: "EXPLORE FURTHER" },
  "skills.collectionTitle": { zh: "继续扩展你的设计工具箱", en: "Expand your design toolbox" },
  "skills.collectionBody": { zh: "需要更多选择时，再进入 Skill 生态目录或设计参考站。它们是下一步资源，不与核心 Skill 混在一起。", en: "When you need more options, continue into skill ecosystems or design reference sites. These are next-step resources, separate from the core directory." },
  "skills.resourceSkillTitle": { zh: "Skill 与 Agent 生态", en: "Skill and Agent ecosystems" },
  "skills.resourceSkillBody": { zh: "发现规范、集合与 MCP 工具。", en: "Discover standards, collections and MCP tools." },
  "skills.columnNumber": { zh: "编号", en: "No." },
  "skills.columnCategory": { zh: "分类", en: "Category" },
  "skills.columnSkill": { zh: "Skill / 用途", en: "Skill / purpose" },
  "skills.columnBestFor": { zh: "适合", en: "Best for" },
  "skills.columnStats": { zh: "热度", en: "Activity" },
  "skills.columnAction": { zh: "调用", en: "Use" },
  "skills.websiteEyebrow": { zh: "DESIGN REFERENCE WEBSITES", en: "DESIGN REFERENCE WEBSITES" },
  "skills.websiteTitle": { zh: "设计参考网站", en: "Design reference sites" },
  "skills.websiteBody": { zh: "查找真实产品流程、网页和视觉案例。", en: "Find real product flows, websites and visual references." }
};

const repoList = document.querySelector("#repoList");
const repoSearch = document.querySelector("#repoSearch");
const repoFacets = document.querySelector("#repoFacets");
const topTaskFilters = document.querySelector("#topTaskFilters");
const repoCount = document.querySelector("#repoCount");
const repoSyncStatus = document.querySelector("#repoSyncStatus");
const skillsHeroCount = document.querySelector("#skillsHeroCount");
const categoryCount = document.querySelector("#categoryCount");
const repoSortButtons = document.querySelectorAll("[data-repo-sort]");
const repoInspector = document.querySelector("#repoInspector");
const repoClearFilters = document.querySelector("#repoClearFilters");
const track = (name, properties) => window.image2Analytics?.track(name, properties);
let currentLanguage = "zh";
let resolvedRepositories = null;
let activeCategory = "ALL";
let activeSort = "CURATED";
let searchQuery = "";
let selectedSlug = repositories[0].slug;
let repositoryStatsStatus = "loading";
let repositoryStatsUpdatedAt = null;

const categoryGroups = [
  { key: "creative", zh: "体验创作", en: "Experience & craft", categories: ["DESIGN", "UX", "MOTION", "VIDEO", "A11Y"] },
  { key: "build", zh: "构建系统", en: "Build & systems", categories: ["FRONTEND", "SYSTEM", "ENGINEERING", "3D"] },
  { key: "agent", zh: "Agent 协作", en: "Agent workflows", categories: ["AI DESIGN", "REVIEW", "DIRECTORY"] }
];

const categoryLabels = {
  DESIGN: { zh: "界面设计", en: "Interface design" },
  UX: { zh: "用户体验", en: "User experience" },
  MOTION: { zh: "动效", en: "Motion" },
  VIDEO: { zh: "视频创作", en: "Video" },
  A11Y: { zh: "无障碍", en: "Accessibility" },
  FRONTEND: { zh: "前端构建", en: "Frontend" },
  SYSTEM: { zh: "设计系统", en: "Design systems" },
  ENGINEERING: { zh: "工程工作流", en: "Engineering" },
  "3D": { zh: "3D / 图形", en: "3D / graphics" },
  "AI DESIGN": { zh: "AI 设计", en: "AI design" },
  REVIEW: { zh: "设计评审", en: "Design review" },
  DIRECTORY: { zh: "资源发现", en: "Discovery" }
};

function getCategoryLabel(category) {
  return categoryLabels[category]?.[currentLanguage] || category;
}

const categoryVisuals = {
  VIDEO: { zh: "导演下一幕", en: "Direct the\nnext scene" },
  DESIGN: { zh: "从意图到\n界面", en: "From intent\nto interface" },
  MOTION: { zh: "让动效\n有目的", en: "Motion has\na purpose" },
  ENGINEERING: { zh: "更有把握地\n交付", en: "Ship with\nconfidence" },
  FRONTEND: { zh: "为真实使用\n而构建", en: "Build for\nreal use" },
  UX: { zh: "让路径\n更清晰", en: "Make paths\nclear" },
  A11Y: { zh: "默认\n无障碍", en: "Accessible\nby default" },
  SYSTEM: { zh: "让每个部分\n保持一致", en: "Keep every\npiece coherent" },
  "3D": { zh: "增加一个\n新维度", en: "Add a new\ndimension" },
  "AI DESIGN": { zh: "从提示到\n产品", en: "Prompt to\nproduct" },
  DIRECTORY: { zh: "找到真正\n适合的", en: "Find what\nfits" },
  REVIEW: { zh: "看见还\n缺少什么", en: "See what\nis missing" }
};

function getCategoryVisual(category) {
  return categoryVisuals[category]?.[currentLanguage] || (currentLanguage === "en" ? "Make work\nclearer" : "让工作\n更清晰");
}

const skillVisuals = {
  "Vincentwei1021/video-shotcraft": { zh: "把镜头写成\n可复用配方", en: "Turn shots into\nreusable recipes" },
  "emilkowalski/skills": { zh: "让界面细节\n更自然", en: "Make interface\ndetails feel natural" },
  "pbakaus/impeccable": { zh: "提升界面的\n完成度", en: "Raise the level\nof interface polish" },
  "greensock/GSAP": { zh: "让动效流畅\n且有节奏", en: "Make motion fluid\nand intentional" },
  "Leonxlnx/taste-skill": { zh: "摆脱模板化\n设计", en: "Move beyond\ntemplated design" },
  "mattpocock/skills": { zh: "把工程经验\n变成工作流", en: "Turn engineering\npractice into workflows" },
  "anthropics/skills": { zh: "从需求构建\n真实界面", en: "Build real interfaces\nfrom requirements" },
  "vercel-labs/agent-skills": { zh: "按生产标准\n构建前端", en: "Build frontend work\nto production standards" },
  "nextlevelbuilder/ui-ux-pro-max-skill": { zh: "把产品意图\n变成完整体验", en: "Turn product intent\ninto a complete experience" },
  "motiondivision/motion": { zh: "为交互增加\n自然反馈", en: "Add natural feedback\nto interactions" },
  "radix-ui/primitives": { zh: "从无障碍原语\n开始构建", en: "Start with accessible\ninterface primitives" },
  "tailwindlabs/headlessui": { zh: "组合可靠的\n交互模式", en: "Compose dependable\ninteraction patterns" },
  "lucide-icons/lucide": { zh: "统一产品的\n图标语言", en: "Unify the product's\nicon language" },
  "pmndrs/react-three-fiber": { zh: "把 3D 带进\nReact", en: "Bring 3D into\nReact" },
  "storybookjs/storybook": { zh: "让组件可见\n可测可协作", en: "Make components visible,\ntestable and collaborative" },
  "google-labs-code/stitch-skills": { zh: "从提示生成\n可迭代界面", en: "Generate interfaces\nready to iterate" },
  "bergside/awesome-design-skills": { zh: "快速找到合适的\n设计能力", en: "Find the right\ndesign capability faster" },
  "SeanJ1ang/design-judge-skills": { zh: "看见界面还\n缺少什么", en: "See what the interface\nis still missing" },
  "ConardLi/garden-skills": { zh: "组合 AI 产品\n开发能力", en: "Combine capabilities\nfor AI product work" },
  "Owl-Listener/designer-skills": { zh: "辅助日常的\n设计决策", en: "Support everyday\ndesign decisions" },
  "superdesigndev/superdesign-skill": { zh: "连接设计思考\n与前端落地", en: "Connect design thinking\nto frontend execution" },
  "mistyhx/frontend-design-audit": { zh: "系统审查\n前端页面", en: "Audit frontend pages\nsystematically" },
  "plugin87/ux-ui-agent-skills": { zh: "覆盖完整的\nUX/UI 工作流", en: "Cover the complete\nUX/UI workflow" },
  "ZeroZ-lab/cc-design": { zh: "提前识别\n设计红旗", en: "Spot design red flags\nearly" },
  "JimLiu/baoyu-design": { zh: "建立可复用的\n设计系统", en: "Build a reusable\ndesign system" },
  "scottstts/Threejs-Awesome-Graphics-Agent-Skills": { zh: "增加一个互动\n新维度", en: "Add a new dimension\nof interaction" },
  "Owl-Listener/ai-design-skills": { zh: "发现跨模型的\n设计工作流", en: "Discover cross-model\ndesign workflows" }
};

function getSkillVisual(item) {
  return skillVisuals[item.slug]?.[currentLanguage] || getCategoryVisual(item.category);
}

window.image2SkillsCatalog = { repositories, repositoriesEn, categoryLabels, skillVisuals };

function formatNumber(value) {
  if (typeof value !== "number") return "…";
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

function getRepositoryItems() {
  const source = resolvedRepositories || repositories;
  return currentLanguage === "en"
    ? source.map((item, index) => ({ ...item, fallback: repositoriesEn[index].fallback, focus: repositoriesEn[index].focus }))
    : source;
}

function formatSyncTime(timestamp) {
  if (!timestamp) return currentLanguage === "en" ? "Live data" : "实时数据";
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (currentLanguage === "en") {
    if (elapsedMinutes < 1) return "just synced";
    if (elapsedMinutes < 60) return `synced ${elapsedMinutes}m ago`;
    return `synced ${Math.floor(elapsedMinutes / 60)}h ago`;
  }
  if (elapsedMinutes < 1) return "刚刚同步";
  if (elapsedMinutes < 60) return `${elapsedMinutes} 分钟前同步`;
  return `${Math.floor(elapsedMinutes / 60)} 小时前同步`;
}

function getFilteredRepositories() {
  const query = searchQuery.trim().toLowerCase();
  const items = getRepositoryItems().filter((item) => {
    const activeGroup = categoryGroups.find((group) => group.key === activeCategory);
    const categoryMatch = activeCategory === "ALL" || (activeGroup ? activeGroup.categories.includes(item.category) : item.category === activeCategory);
    const searchMatch = !query || [item.slug, item.title, item.category, item.fallback, item.description, item.focus].some((value) => String(value || "").toLowerCase().includes(query));
    return categoryMatch && searchMatch;
  });
  if (activeSort === "STARS") return items.sort((a, b) => getStarValue(b) - getStarValue(a));
  if (activeSort === "UPDATED") return items.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
  return items;
}

function getStarValue(item) {
  if (typeof item.stars === "number") return item.stars;
  const label = String(item.starsLabel || "").trim().toLowerCase();
  const value = Number.parseFloat(label.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(value)) return -1;
  if (label.includes("m")) return value * 1000000;
  if (label.includes("k")) return value * 1000;
  return value;
}

function renderRepositoryFilters() {
  const filters = [{ key: "ALL", zh: "全部能力", en: "All capabilities", categories: null }, ...categoryGroups];
  const pathFilters = filters.map((filter) => {
    const itemCount = filter.key === "ALL" ? getRepositoryItems().length : getRepositoryItems().filter((item) => filter.categories.includes(item.category)).length;
    const label = currentLanguage === "en" ? filter.en : filter.zh;
    const activeGroup = categoryGroups.find((group) => group.categories.includes(activeCategory))?.key;
    const isActive = activeCategory === filter.key || (filter.key !== "ALL" && activeGroup === filter.key);
    return `<button class="repo-filter${isActive ? " is-active" : ""}" type="button" aria-pressed="${isActive}" data-repo-filter="${escapeHtml(filter.key)}"><span>${escapeHtml(label)}</span><b>${itemCount}</b></button>`;
  }).join("");
  if (topTaskFilters) topTaskFilters.innerHTML = pathFilters;

  const categories = [...new Set(getRepositoryItems().map((item) => item.category))];
  if (categoryCount) categoryCount.textContent = String(categories.length);
  if (repoFacets) repoFacets.innerHTML = categoryGroups.map((group) => {
    const groupCategories = group.categories.filter((category) => categories.includes(category));
    const groupCount = getRepositoryItems().filter((item) => groupCategories.includes(item.category)).length;
    const buttons = groupCategories.map((category) => {
      const itemCount = getRepositoryItems().filter((item) => item.category === category).length;
      return `<button class="repo-subfilter${activeCategory === category ? " is-active" : ""}" type="button" aria-pressed="${activeCategory === category}" data-repo-filter="${escapeHtml(category)}"><span>${escapeHtml(getCategoryLabel(category))}</span><b>${itemCount}</b></button>`;
    }).join("");
    return `<section class="facet-group"><h3><span>${escapeHtml(currentLanguage === "en" ? group.en : group.zh)}</span><b>${groupCount}</b></h3><div class="repo-subfilters">${buttons}</div></section>`;
  }).join("");

  document.querySelectorAll("[data-repo-filter]").forEach((button) => button.addEventListener("click", () => {
    activeCategory = button.dataset.repoFilter;
    track("skill_filter_select", { category: activeCategory });
    renderRepositories();
  }));
}

function renderInspector() {
  if (!repoInspector) return;
  const item = getRepositoryItems().find((repository) => repository.slug === selectedSlug) || getFilteredRepositories()[0] || getRepositoryItems()[0];
  if (!item) return;
  selectedSlug = item.slug;
  const copyLabel = currentLanguage === "en" ? "Copy command" : "复制调用";
  const repoName = item.slug.split("/").pop();
  repoInspector.innerHTML = `
    <p class="inspector-label">${currentLanguage === "en" ? "SELECTED SKILL" : "当前选中"}</p>
    <p class="inspector-category">${escapeHtml(getCategoryLabel(item.category))}</p>
    <h3>${escapeHtml(item.title)}<span aria-label="Curated skill">✓</span></h3>
    <p class="inspector-copy">${escapeHtml(currentLanguage === "en" ? (item.description || item.fallback) : item.fallback)}</p>
    <dl><div><dt>${currentLanguage === "en" ? "Best for" : "适合用于"}</dt><dd>${escapeHtml(item.focus)}</dd></div><div><dt>${currentLanguage === "en" ? "Repository" : "来源仓库"}</dt><dd>${escapeHtml(item.slug)}</dd></div></dl>
    <div class="inspector-command"><code>git clone https://github.com/${escapeHtml(item.slug)}.git ~/.codex/skills/${escapeHtml(repoName)}</code><button type="button" data-copy-invoke="${item.slug}">${copyLabel}</button></div>
    <a class="inspector-link" href="https://github.com/${item.slug}" target="_blank" rel="noreferrer" data-repo-link="${item.slug}">${currentLanguage === "en" ? "Open repository ↗" : "打开仓库 ↗"}</a>
  `;
  repoInspector.querySelectorAll("[data-copy-invoke]").forEach((button) => button.addEventListener("click", () => copyCloneCommand(button)));
  repoInspector.querySelectorAll("[data-repo-link]").forEach((link) => link.addEventListener("click", () => track("skill_repo_open", { repository: link.dataset.repoLink })));
}

function selectRepository(slug) {
  selectedSlug = slug;
  renderRepositories();
}

function renderRepositoryToolbar() {
  renderRepositoryFilters();
  if (repoSearch) {
    repoSearch.value = searchQuery;
    repoSearch.placeholder = currentLanguage === "en" ? "Search name, purpose or repository" : "搜索名称、用途或仓库";
  }
  if (repoCount) {
    const count = getFilteredRepositories().length;
    repoCount.textContent = currentLanguage === "en" ? `${count} of ${getRepositoryItems().length}` : `${count} / ${getRepositoryItems().length}`;
  }
  if (repoSyncStatus) {
    const prefix = currentLanguage === "en" ? "Latest GitHub Stars" : "GitHub 最新 Stars";
    if (repositoryStatsStatus === "loading") repoSyncStatus.textContent = `${prefix} · ${currentLanguage === "en" ? "syncing…" : "正在同步…"}`;
    else if (repositoryStatsStatus === "unavailable") repoSyncStatus.textContent = `${prefix} · ${currentLanguage === "en" ? "temporarily unavailable" : "暂时无法更新"}`;
    else repoSyncStatus.textContent = `${prefix} · ${formatSyncTime(repositoryStatsUpdatedAt)}`;
  }
  repoSortButtons.forEach((button) => {
    const isActive = button.dataset.repoSort === activeSort;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderRepositories(items = getFilteredRepositories()) {
  renderRepositoryToolbar();
  repoList.innerHTML = items.map((item, index) => `
    <article class="repo-row repo-card-${index % 6}" data-category="${escapeHtml(item.category)}">
      <a class="repo-scene" data-category="${escapeHtml(item.category)}" href="./skill-detail.html?repo=${encodeURIComponent(item.slug)}&lang=${currentLanguage}" aria-label="${currentLanguage === "en" ? "View skill details" : "查看 Skill 详情"}: ${escapeHtml(item.title)}">
        <span class="repo-index">${String(index + 1).padStart(2, "0")}</span>
        <strong>${escapeHtml(getSkillVisual(item))}</strong>
        <div class="repo-preview" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
        <small>${escapeHtml(getCategoryLabel(item.category))} OUTPUT</small>
      </a>
      <div class="repo-card-body">
        <div class="repo-main">
          <p class="repo-category">${escapeHtml(getCategoryLabel(item.category))}</p>
          <a href="./skill-detail.html?repo=${encodeURIComponent(item.slug)}&lang=${currentLanguage}" data-skill-detail="${item.slug}">${escapeHtml(item.title)}<span class="repo-verified" aria-label="Curated skill">✓</span></a>
          <p class="repo-description">${escapeHtml(currentLanguage === "en" ? (item.description || item.fallback) : item.fallback)}</p>
          <p class="repo-focus">${escapeHtml(item.focus)}</p>
        </div>
        <div class="repo-footer"><div class="repo-stats"><span title="GitHub Stars"><i aria-hidden="true">☆</i><small>GitHub Stars</small><b>${escapeHtml(item.starsLabel || formatNumber(item.stars))}</b></span><small>${formatDate(item.updatedAt)}</small></div><div class="repo-actions"><button class="repo-copy-btn" type="button" data-copy-invoke="${item.slug}" title="${currentLanguage === "en" ? "Copy the Codex clone command" : "复制 Codex 调用命令"}"><span>${currentLanguage === "en" ? "Copy command" : "复制调用"}</span><b aria-hidden="true">＋</b></button></div></div>
      </div>
    </article>
  `).join("");
  repoList.querySelectorAll("[data-skill-detail]").forEach((link) => link.addEventListener("click", () => track("skill_detail_open", { repository: link.dataset.skillDetail })));
  repoList.querySelectorAll("[data-copy-invoke]").forEach((btn) => btn.addEventListener("click", () => copyCloneCommand(btn)));
  if (!items.length) repoList.innerHTML = `<p class="repo-empty">${currentLanguage === "en" ? "No matching skills. Try another keyword or category." : "没有找到匹配的 Skill，请换个关键词或分类。"}</p>`;
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

function copyCloneCommand(btn) {
  const slug = btn.dataset.copyInvoke;
  const repoName = slug.split("/").pop();
  copyToClipboard(btn, `git clone https://github.com/${slug}.git ~/.codex/skills/${repoName}`);
}

function renderSkillCollections() {
  const collectionList = document.querySelector("#collectionList");
  if (!collectionList) return;
  const collections = currentLanguage === "en" ? skillCollectionsEn : skillCollections;
  collectionList.innerHTML = collections.map((site, index) => `
    <article class="collection-row"><p>${String(index + 1).padStart(2, "0")}</p><div><a href="${site.url}" target="_blank" rel="noreferrer" data-skill-collection="${site.name}">${site.name}</a><span>${site.type}</span></div><p>${site.description}</p><small>${site.bestFor}</small></article>
  `).join("");
  collectionList.querySelectorAll("[data-skill-collection]").forEach((link) => link.addEventListener("click", () => track("skill_collection_open", { collection: link.dataset.skillCollection })));
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

const repositoryStatsCacheKey = "ondesign-skill-repository-stats-v1";
const repositoryStatsCacheTtl = 6 * 60 * 60 * 1000;

function readRepositoryStatsCache() {
  try { return JSON.parse(localStorage.getItem(repositoryStatsCacheKey) || "null"); } catch { return null; }
}

function applyRepositoryStats(items, cachedItems = {}) {
  return items.map((item) => ({ ...item, ...(cachedItems[item.slug] || {}) }));
}

async function fetchRepositoryStats(item, previous = {}) {
  try {
    const response = await fetch(`https://api.github.com/repos/${item.slug}`, { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" });
    if (!response.ok) throw new Error(`GitHub API ${response.status}`);
    const repo = await response.json();
    return { ...item, description: repo.description, stars: repo.stargazers_count, starsLabel: "", forks: repo.forks_count, updatedAt: repo.pushed_at };
  } catch {
    try {
      const response = await fetch(`https://img.shields.io/github/stars/${item.slug}.json`, { cache: "no-store" });
      if (!response.ok) throw new Error("Shields request failed");
      const badge = await response.json();
      return { ...item, ...previous, starsLabel: badge.message || previous.starsLabel || "" };
    } catch { return { ...item, ...previous }; }
  }
}

async function loadRepositoryData() {
  const cache = readRepositoryStatsCache();
  const cachedItems = cache?.items || {};
  const cacheIsFresh = Boolean(cache?.savedAt && Date.now() - cache.savedAt < repositoryStatsCacheTtl);
  resolvedRepositories = applyRepositoryStats(repositories, cachedItems);
  repositoryStatsUpdatedAt = cache?.savedAt || null;
  repositoryStatsStatus = cacheIsFresh ? "ready" : "loading";
  renderRepositories();
  if (cacheIsFresh) return;

  const resolved = await Promise.all(repositories.map((item) => fetchRepositoryStats(item, cachedItems[item.slug])));
  resolvedRepositories = resolved;
  const hasStats = resolved.some((item) => typeof item.stars === "number" || Boolean(item.starsLabel));
  repositoryStatsStatus = hasStats ? "ready" : "unavailable";
  repositoryStatsUpdatedAt = hasStats ? Date.now() : (cache?.savedAt || null);
  const items = Object.fromEntries(resolved.map((item) => [item.slug, { description: item.description, stars: item.stars, starsLabel: item.starsLabel, forks: item.forks, updatedAt: item.updatedAt }]));
  if (hasStats) {
    try { localStorage.setItem(repositoryStatsCacheKey, JSON.stringify({ savedAt: repositoryStatsUpdatedAt, items })); } catch {}
  }
  renderRepositories();
}

function renderPage(language = "zh") {
  currentLanguage = language === "en" ? "en" : "zh";
  document.title = currentLanguage === "en" ? "Design Skill Directory · IMAGE2 UI" : "设计 Skill 观察 · IMAGE2 UI";
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = currentLanguage === "en"
    ? "A curated directory of open-source design Skills and tools."
    : "设计 Skill 观察与可复制提示词。";
  if (skillsHeroCount) skillsHeroCount.textContent = String(getRepositoryItems().length);
  renderRepositories();
  renderSkillCollections();
  renderDesignWebsites();
}

if (repoSearch) repoSearch.addEventListener("input", () => {
  searchQuery = repoSearch.value;
  renderRepositories();
});

if (repoClearFilters) repoClearFilters.addEventListener("click", () => {
  activeCategory = "ALL";
  activeSort = "CURATED";
  searchQuery = "";
  renderRepositories();
});

repoSortButtons.forEach((button) => button.addEventListener("click", () => {
  activeSort = button.dataset.repoSort;
  track("skill_sort_select", { sort: activeSort });
  renderRepositories();
}));

if (repoList) {
  if (window.image2I18n) {
    window.image2I18n.addTranslations(skillsTranslations);
    window.image2I18n.registerPage(renderPage);
    window.image2I18n.refresh();
  } else {
    renderPage("zh");
  }
  loadRepositoryData();
  track("skills_page_view");
}
