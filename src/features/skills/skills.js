const repositories = [
  { slug: "Vincentwei1021/video-shotcraft", category: "VIDEO", title: "video-shotcraft", skillName: "video-shotcraft", fallback: "面向产品宣传视频的镜头配方与动态样例库。", focus: "视频叙事 / 动态样例" },
  { slug: "emilkowalski/skills", category: "DESIGN", title: "emilkowalski / skills", fallback: "为设计师和工程师准备的一组实用 skills。", focus: "产品设计 / 前端体验" },
  { slug: "pbakaus/impeccable", category: "DESIGN", title: "pbakaus / impeccable", fallback: "帮助 AI 更好理解设计语言与界面质量的 skill。", focus: "设计语言 / UI 品质" },
  { slug: "greensock/GSAP", category: "MOTION", title: "greensock / GSAP", fallback: "现代 Web 动画的成熟工具与生态。", focus: "动效系统 / 交互反馈" },
  { slug: "Leonxlnx/taste-skill", category: "DESIGN", title: "Leonxlnx / taste-skill", fallback: "让 AI 避免生成无聊、通用、模板化界面的设计品味 skill。", focus: "去模板感 / 视觉判断" },
  { slug: "mattpocock/skills", category: "ENGINEERING", title: "mattpocock / skills", fallback: "面向真实工程工作的可复用 agent skills。", focus: "工程工作流 / Agent" },
  { slug: "anthropics/skills", category: "DESIGN", title: "anthropics / skills", fallback: "包含 frontend-design 等面向真实创作任务的官方 skill 集合。", focus: "界面构建 / 创作工作流" },
  { slug: "vercel-labs/agent-skills", category: "FRONTEND", title: "vercel-labs / agent-skills", fallback: "面向 Web 产品的设计规范、React 模式与前端质量检查。", focus: "Web 规范 / React 质量" },
  { slug: "nextlevelbuilder/ui-ux-pro-max-skill", category: "PRESENTATION", title: "ui-ux-pro-max", fallback: "把复杂业务数据转成带交互的 SVG 图表、UI 级看板与高保真演示页面。", focus: "数据复盘 / 产品评审 / 技术展示" },
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
  { slug: "Owl-Listener/ai-design-skills", category: "DIRECTORY", title: "Owl-Listener / ai-design-skills", fallback: "整理 AI 设计能力和扩展入口的开源集合，适合继续发现跨模型的设计工作流。", focus: "AI 设计 / Skill 发现" },
  { slug: "hugohe3/ppt-master", category: "PRESENTATION", title: "ppt-master", fallback: "直接输出带完整图层与文字框的原生可编辑 PPTX，便于改字、换图和正式交付。", focus: "职场汇报 / 客户提案 / 可编辑交付" },
  { slug: "zarazhangrui/frontend-slides", category: "PRESENTATION", title: "frontend-slides", fallback: "生成高完成度、零依赖的单文件 HTML 演示，浏览器双击即可开始展示。", focus: "在线演示 / 远程分享 / 交互展示" },
  { slug: "op7418/guizang-ppt-skill", category: "PRESENTATION", title: "guizang-ppt-skill", fallback: "以杂志风和瑞士国际主义建立画册级、海报级演示视觉。", focus: "产品发布会 / 主题演讲 / 品牌展示" },
  { slug: "alchaincyf/huashu-design", category: "PRESENTATION", title: "huashu-design", fallback: "结合细腻 HTML 动效与可编辑 PPTX 导出，适合复杂设计规范与多格式输出。", focus: "交互原型 / 设计团队 / 混合输出" },
  { slug: "lewislulu/html-ppt-skill", category: "PRESENTATION", title: "html-ppt-skill", fallback: "提供倒计时、逐字稿提词器、双屏演讲者视图与丰富主题。", focus: "答辩 / 路演 / 提词演讲" },
  { slug: "MiniMax-AI/skills", category: "PRESENTATION", title: "MiniMax-pptx", fallback: "将会议记录或 Markdown 大纲快速转成结构化、可编辑的 PPTX 草稿。", focus: "内部对齐 / 临时出稿 / 大纲可视化" },
  { slug: "ningzimu/codex-ppt", category: "PRESENTATION", title: "codex-ppt", fallback: "以强封面感和海报级单页张力生成视觉语言统一的图片流 PPT。", focus: "社媒切片 / 视觉演讲 / 冲击力开场" },
  { slug: "ryanbbrown/revealjs-skill", category: "PRESENTATION", title: "revealjs-skill", fallback: "用 Markdown 驱动代码高亮与二维嵌套导航，适合开发者演示。", focus: "技术架构 / 开发者大会 / 开源宣讲" }
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
  { slug: "nextlevelbuilder/ui-ux-pro-max-skill", category: "PRESENTATION", title: "ui-ux-pro-max", fallback: "Turns complex business data into interactive SVG charts, UI-grade dashboards and high-fidelity presentations.", focus: "Data reviews / product critique / technical demos" },
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
  { slug: "Owl-Listener/ai-design-skills", category: "DIRECTORY", title: "Owl-Listener / ai-design-skills", fallback: "An open collection of AI-design capabilities and extensions for discovering cross-model design workflows.", focus: "AI design / skill discovery" },
  { slug: "hugohe3/ppt-master", category: "PRESENTATION", title: "ppt-master", fallback: "Creates native editable PPTX files with complete layers and text boxes for dependable handoff.", focus: "Business reports / client proposals / editable delivery" },
  { slug: "zarazhangrui/frontend-slides", category: "PRESENTATION", title: "frontend-slides", fallback: "Creates polished zero-dependency HTML presentations that open directly in a browser.", focus: "Online demos / remote talks / interactive presentations" },
  { slug: "op7418/guizang-ppt-skill", category: "PRESENTATION", title: "guizang-ppt-skill", fallback: "Creates editorial and Swiss-inspired presentation visuals with poster-level finish.", focus: "Product launches / talks / personal branding" },
  { slug: "alchaincyf/huashu-design", category: "PRESENTATION", title: "huashu-design", fallback: "Combines detailed HTML motion with editable PPTX export and flexible design specifications.", focus: "Interactive prototypes / design teams / mixed output" },
  { slug: "lewislulu/html-ppt-skill", category: "PRESENTATION", title: "html-ppt-skill", fallback: "Includes countdowns, speaker notes, presenter view and a broad theme system.", focus: "Defenses / roadshows / speaker support" },
  { slug: "MiniMax-AI/skills", category: "PRESENTATION", title: "MiniMax-pptx", fallback: "Turns meeting notes or Markdown outlines into structured editable PPTX drafts.", focus: "Fast alignment / quick drafts / outline visualization" },
  { slug: "ningzimu/codex-ppt", category: "PRESENTATION", title: "codex-ppt", fallback: "Creates visually forceful image-led decks with consistent poster-like art direction.", focus: "Social slices / visual talks / high-impact openings" },
  { slug: "ryanbbrown/revealjs-skill", category: "PRESENTATION", title: "revealjs-skill", fallback: "Markdown-driven code presentations with syntax highlighting and nested navigation.", focus: "Architecture talks / developer events / open-source demos" }
];

const designReferenceGroups = [
  { key: "DIRECTION", zh: "整体方向", en: "Direction", descriptionZh: "建立视觉方向、版式语言与页面整体节奏。", descriptionEn: "Set visual direction, layout language and overall page rhythm." },
  { key: "PRODUCT", zh: "产品 UI", en: "Product UI", descriptionZh: "拆解真实产品流程、功能结构与交互模式。", descriptionEn: "Study real product flows, feature structures and interaction patterns." },
  { key: "DETAIL", zh: "局部细节", en: "UI details", descriptionZh: "研究导航、首屏、CTA、页脚与微交互细节。", descriptionEn: "Study navigation, heroes, CTAs, footers and interaction details." },
  { key: "EXPERIMENT", zh: "实验感", en: "Experimental", descriptionZh: "寻找更先锋的动效、交互和创意表达。", descriptionEn: "Find experimental motion, interaction and creative expression." },
  { key: "MOTION", zh: "动画引擎", en: "Animation engines", descriptionZh: "构建时间轴、SVG、DOM 与复杂交互动效。", descriptionEn: "Build timelines, SVG, DOM and complex interactive motion." },
  { key: "PRESENTATION", zh: "演示工具", en: "Presentation tools", descriptionZh: "快速生成可编辑 PPT 或零代码在线演示。", descriptionEn: "Create editable decks or no-code online presentations quickly." }
];

const designReferenceWebsites = [
  { name: "Recent", domain: "recent.design", url: "https://recent.design/", group: "DIRECTION", descriptionZh: "聚合近期设计作品，适合快速感知正在发生的视觉趋势。", descriptionEn: "A feed of recent design work for sensing current visual trends.", focusZh: "趋势扫描 / 视觉方向", focusEn: "Trend scan / visual direction" },
  { name: "Lapa Ninja", domain: "lapa.ninja", url: "https://www.lapa.ninja/", group: "DIRECTION", descriptionZh: "收集大量落地页案例，用于研究首屏、内容节奏与转化结构。", descriptionEn: "A large landing-page collection for studying heroes, rhythm and conversion structure.", focusZh: "落地页 / 转化结构", focusEn: "Landing pages / conversion" },
  { name: "Land-book", domain: "land-book.com", url: "https://land-book.com/", group: "DIRECTION", descriptionZh: "按风格与类型浏览网站案例，适合建立项目情绪板。", descriptionEn: "Browse websites by style and type to build project moodboards.", focusZh: "网站风格 / 情绪板", focusEn: "Web style / moodboards" },
  { name: "Awwwards", domain: "awwwards.com", url: "https://www.awwwards.com/", group: "DIRECTION", descriptionZh: "聚焦高质量网站、创意开发与完整交互体验。", descriptionEn: "High-quality websites, creative development and complete interactive experiences.", focusZh: "创意网站 / 交互叙事", focusEn: "Creative web / interaction" },
  { name: "Mobbin", domain: "mobbin.com", url: "https://mobbin.com/", group: "PRODUCT", descriptionZh: "按真实产品流程检索移动端与 Web 界面，适合拆解成熟 UX 模式。", descriptionEn: "Search real mobile and web product flows to study mature UX patterns.", focusZh: "App 流程 / UX 模式", focusEn: "App flows / UX patterns" },
  { name: "Refero", domain: "refero.design", url: "https://refero.design/", group: "PRODUCT", descriptionZh: "围绕真实界面与产品流程组织参考，方便研究功能结构。", descriptionEn: "Product references organized around real screens and flows.", focusZh: "产品界面 / 功能拆解", focusEn: "Product UI / feature study" },
  { name: "Design Spells", domain: "designspells.com", url: "https://www.designspells.com/", group: "DETAIL", descriptionZh: "收集产品中让体验更细腻的设计细节与微交互。", descriptionEn: "A collection of thoughtful product details and micro-interactions.", focusZh: "微交互 / 体验细节", focusEn: "Micro-interactions / details" },
  { name: "Supahero", domain: "supahero.io", url: "https://supahero.io/", group: "DETAIL", descriptionZh: "专注网站首屏与 Hero 区域，适合研究信息密度和视觉焦点。", descriptionEn: "Focused on website hero sections, information density and visual focus.", focusZh: "Hero / 首屏设计", focusEn: "Hero sections / first fold" },
  { name: "Navbar Gallery", domain: "navbar.gallery", url: "https://www.navbar.gallery/", group: "DETAIL", descriptionZh: "专门收集导航栏案例，适合比较结构、状态与布局方式。", descriptionEn: "A gallery of navigation patterns, states and layout approaches.", focusZh: "导航 / 信息架构", focusEn: "Navigation / information architecture" },
  { name: "CTA Gallery", domain: "cta.gallery", url: "https://www.cta.gallery/", group: "DETAIL", descriptionZh: "聚焦行动按钮与转化模块，帮助研究文案和视觉层级。", descriptionEn: "CTA examples for studying conversion copy and visual hierarchy.", focusZh: "CTA / 转化设计", focusEn: "CTA / conversion design" },
  { name: "Footer Design", domain: "footer.design", url: "https://www.footer.design/", group: "DETAIL", descriptionZh: "收集不同类型的网站页脚，适合研究信息收尾与导航补充。", descriptionEn: "Website footer examples for studying closing content and secondary navigation.", focusZh: "页脚 / 信息收尾", focusEn: "Footers / closing content" },
  { name: "Loadmo.re", domain: "loadmo.re", url: "https://loadmo.re/", group: "EXPERIMENT", descriptionZh: "发现更具实验性的网页、动效与创意交互表达。", descriptionEn: "Discover experimental websites, motion and creative interaction work.", focusZh: "实验网页 / 创意动效", focusEn: "Experimental web / motion" },
  { name: "Anime.js", domain: "animejs.com", url: "https://animejs.com/", group: "MOTION", descriptionZh: "轻量而强大的 JavaScript 动画引擎，可编排 DOM、SVG、CSS 属性与时间轴动画。", descriptionEn: "A lightweight JavaScript animation engine for DOM, SVG, CSS properties and timeline choreography.", focusZh: "时间轴 / SVG / 交互动效", focusEn: "Timelines / SVG / interaction motion" },
  { name: "Slidify", domain: "slidify.cn", url: "https://slidify.cn/", group: "PRESENTATION", descriptionZh: "无需配置开发环境，用一句话快速生成可编辑 PPT。", descriptionEn: "Generate editable presentations from a prompt without configuring a development environment.", focusZh: "急用出稿 / 轻量任务 / 非技术用户", focusEn: "Quick drafts / light tasks / non-technical users" }
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
  "skills.officialSkill": { zh: "官方设计 Skill", en: "OFFICIAL DESIGN SKILL" },
  "skills.updateCount": { zh: "本次更新", en: "THIS UPDATE" },
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
  "skills.directoryModeLabel": { zh: "浏览类型", en: "Browse type" },
  "skills.sortCurated": { zh: "精选", en: "Curated" },
  "skills.sortStars": { zh: "Stars", en: "Stars" },
  "skills.sortUpdated": { zh: "最近更新", en: "Latest" },
  "skills.clearFilters": { zh: "重置", en: "Reset" },
  "skills.columnNumber": { zh: "编号", en: "No." },
  "skills.columnCategory": { zh: "分类", en: "Category" },
  "skills.columnSkill": { zh: "Skill / 用途", en: "Skill / purpose" },
  "skills.columnBestFor": { zh: "适合", en: "Best for" },
  "skills.columnStats": { zh: "热度", en: "Activity" },
  "skills.columnAction": { zh: "调用", en: "Use" }
};

const repoList = document.querySelector("#repoList");
const repoSearch = document.querySelector("#repoSearch");
const repoFacets = document.querySelector("#repoFacets");
const topTaskFilters = document.querySelector("#topTaskFilters");
const repoCount = document.querySelector("#repoCount");
const repoSyncStatus = document.querySelector("#repoSyncStatus");
const skillsHeroCount = document.querySelector("#skillsHeroCount");
const skillsHeroKind = document.querySelector("#skillsHeroKind");
const skillsHeroBody = document.querySelector("#skillsHeroBody");
const heroBrowseLink = document.querySelector("#heroBrowseLink");
const heroUpdateCount = document.querySelector("#heroUpdateCount");
const heroUpdateLabel = document.querySelector("#heroUpdateLabel");
const categoryCount = document.querySelector("#categoryCount");
const repoSortButtons = document.querySelectorAll("[data-repo-sort]");
const directoryModeButtons = document.querySelectorAll("[data-directory-mode]");
const taskRailLabel = document.querySelector("#taskRailLabel");
const repoSort = document.querySelector("#repoSort");
const repoInspector = document.querySelector("#repoInspector");
const repoClearFilters = document.querySelector("#repoClearFilters");
const officialSkillLink = document.querySelector("[data-official-skill-link]");
const track = (name, properties) => window.image2Analytics?.track(name, properties);
let currentLanguage = "zh";
let resolvedRepositories = null;
let activeDirectoryMode = "SKILL";
const activeCategories = new Set();
let activeSort = "CURATED";
let searchQuery = "";
let selectedSlug = repositories[0].slug;
let repositoryStatsStatus = "loading";
let repositoryStatsUpdatedAt = null;

const categoryGroups = [
  { key: "creative", zh: "体验创作", en: "Experience & craft", categories: ["DESIGN", "UX", "MOTION", "VIDEO", "A11Y"] },
  { key: "build", zh: "构建系统", en: "Build & systems", categories: ["FRONTEND", "SYSTEM", "ENGINEERING", "3D"] },
  { key: "agent", zh: "Agent 协作", en: "Agent workflows", categories: ["AI DESIGN", "REVIEW", "DIRECTORY"] },
  { key: "presentation", zh: "演示与汇报", en: "Presentation", categories: ["PRESENTATION"] }
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
  DIRECTORY: { zh: "资源发现", en: "Discovery" },
  PRESENTATION: { zh: "演示 / PPT", en: "Presentation / PPT" }
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
  REVIEW: { zh: "看见还\n缺少什么", en: "See what\nis missing" },
  PRESENTATION: { zh: "把内容变成\n一场演示", en: "Turn content into\na presentation" }
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
  "nextlevelbuilder/ui-ux-pro-max-skill": { zh: "把复杂数据\n变成交互演示", en: "Turn complex data into\nan interactive presentation" },
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
  "Owl-Listener/ai-design-skills": { zh: "发现跨模型的\n设计工作流", en: "Discover cross-model\ndesign workflows" },
  "hugohe3/ppt-master": { zh: "交付真正可编辑的\n原生 PPTX", en: "Deliver a truly editable\nnative PPTX" },
  "zarazhangrui/frontend-slides": { zh: "双击浏览器就能\n开始演示", en: "Open the browser and\nstart presenting" },
  "op7418/guizang-ppt-skill": { zh: "让演示拥有\n杂志级审美", en: "Give presentations\neditorial-level craft" },
  "alchaincyf/huashu-design": { zh: "同时拥有动效与\n可编辑交付", en: "Combine motion with\neditable delivery" },
  "lewislulu/html-ppt-skill": { zh: "带着提词器和计时\n从容上台", en: "Present with notes\nand timing support" },
  "MiniMax-AI/skills": { zh: "把会议大纲快速\n变成 PPT 草稿", en: "Turn meeting outlines\ninto PPT drafts" },
  "ningzimu/codex-ppt": { zh: "用海报级画面\n制造视觉冲击", en: "Create visual impact\nwith poster-like slides" },
  "ryanbbrown/revealjs-skill": { zh: "用代码和 Markdown\n讲清技术方案", en: "Explain technical ideas\nwith code and Markdown" }
};

function getSkillVisual(item) {
  return skillVisuals[item.slug]?.[currentLanguage] || getCategoryVisual(item.category);
}

const skillOfficialPages = {
  "greensock/GSAP": "https://gsap.com",
  "motiondivision/motion": "https://motion.dev",
  "radix-ui/primitives": "https://www.radix-ui.com/primitives",
  "tailwindlabs/headlessui": "https://github.com/tailwindlabs/headlessui",
  "lucide-icons/lucide": "https://lucide.dev/icons",
  "pmndrs/react-three-fiber": "https://r3f.docs.pmnd.rs/getting-started/introduction",
  "storybookjs/storybook": "https://storybook.js.org"
};

function getSkillOfficialPage(item) {
  return skillOfficialPages[item.slug] || `https://github.com/${item.slug}`;
}

function getSkillBrowserLabel(item) {
  return getSkillOfficialPage(item).replace(/^https?:\/\/(?:www\.)?/, "").replace(/\/$/, "");
}

function getSkillCover(item) {
  const filename = item.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `./assets/skills/repositories/${filename}.jpg`;
}

function getWebsitePreviewPath(item) {
  const filename = item.domain.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `./assets/skills/web/${filename}.jpg`;
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
    const categoryMatch = activeCategories.size === 0 || activeCategories.has(item.category);
    const searchMatch = !query || [item.slug, item.title, item.category, item.fallback, item.description, item.focus].some((value) => String(value || "").toLowerCase().includes(query));
    return categoryMatch && searchMatch;
  });
  if (activeSort === "STARS") return items.sort((a, b) => getStarValue(b) - getStarValue(a));
  if (activeSort === "UPDATED") return items.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
  return items;
}

function getFilteredWebsites() {
  const query = searchQuery.trim().toLowerCase();
  return designReferenceWebsites.filter((item) => {
    const categoryMatch = activeCategories.size === 0 || activeCategories.has(item.group);
    const description = currentLanguage === "en" ? item.descriptionEn : item.descriptionZh;
    const focus = currentLanguage === "en" ? item.focusEn : item.focusZh;
    const searchMatch = !query || [item.name, item.domain, item.group, description, focus].some((value) => String(value || "").toLowerCase().includes(query));
    return categoryMatch && searchMatch;
  });
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
  if (activeDirectoryMode === "WEB") {
    const filters = [{ key: "ALL", zh: "全部网站", en: "All websites" }, ...designReferenceGroups];
    if (topTaskFilters) topTaskFilters.innerHTML = filters.map((filter) => {
      const itemCount = filter.key === "ALL" ? designReferenceWebsites.length : designReferenceWebsites.filter((item) => item.group === filter.key).length;
      const label = currentLanguage === "en" ? filter.en : filter.zh;
      const isActive = filter.key === "ALL" ? activeCategories.size === 0 : activeCategories.has(filter.key);
      return `<button class="repo-filter${isActive ? " is-active" : ""}" type="button" aria-pressed="${isActive}" data-repo-filter="${escapeHtml(filter.key)}"><span>${escapeHtml(label)}</span><b>${itemCount}</b></button>`;
    }).join("");
    if (categoryCount) categoryCount.textContent = String(designReferenceGroups.length);
    if (repoFacets) repoFacets.innerHTML = `<section class="facet-group"><h3><span>${currentLanguage === "en" ? "Website purpose" : "网站用途"}</span><b>${designReferenceWebsites.length}</b></h3><div class="repo-subfilters">${designReferenceGroups.map((group) => {
      const itemCount = designReferenceWebsites.filter((item) => item.group === group.key).length;
      const isActive = activeCategories.has(group.key);
      return `<button class="repo-subfilter${isActive ? " is-active" : ""}" type="button" aria-pressed="${isActive}" data-repo-filter="${escapeHtml(group.key)}"><span>${escapeHtml(currentLanguage === "en" ? group.en : group.zh)}</span><b>${itemCount}</b></button>`;
    }).join("")}</div></section>`;
  } else {
  const filters = [{ key: "ALL", zh: "全部能力", en: "All capabilities", categories: null }, ...categoryGroups];
  const pathFilters = filters.map((filter) => {
    const itemCount = filter.key === "ALL" ? getRepositoryItems().length : getRepositoryItems().filter((item) => filter.categories.includes(item.category)).length;
    const label = currentLanguage === "en" ? filter.en : filter.zh;
    const selectedCount = filter.key === "ALL" ? 0 : filter.categories.filter((category) => activeCategories.has(category)).length;
    const isActive = filter.key === "ALL" ? activeCategories.size === 0 : selectedCount === filter.categories.length;
    const isPartial = filter.key !== "ALL" && selectedCount > 0 && !isActive;
    return `<button class="repo-filter${isActive ? " is-active" : ""}${isPartial ? " is-partial" : ""}" type="button" aria-pressed="${isActive}" data-repo-filter="${escapeHtml(filter.key)}"><span>${escapeHtml(label)}</span><b>${itemCount}</b></button>`;
  }).join("");
  if (topTaskFilters) topTaskFilters.innerHTML = pathFilters;

  const categories = [...new Set(getRepositoryItems().map((item) => item.category))];
  if (categoryCount) categoryCount.textContent = String(categories.length);
  if (repoFacets) repoFacets.innerHTML = categoryGroups.map((group) => {
    const groupCategories = group.categories.filter((category) => categories.includes(category));
    const groupCount = getRepositoryItems().filter((item) => groupCategories.includes(item.category)).length;
    const buttons = groupCategories.map((category) => {
      const itemCount = getRepositoryItems().filter((item) => item.category === category).length;
      const isActive = activeCategories.has(category);
      return `<button class="repo-subfilter${isActive ? " is-active" : ""}" type="button" aria-pressed="${isActive}" data-repo-filter="${escapeHtml(category)}"><span>${escapeHtml(getCategoryLabel(category))}</span><b>${itemCount}</b></button>`;
    }).join("");
    return `<section class="facet-group"><h3><span>${escapeHtml(currentLanguage === "en" ? group.en : group.zh)}</span><b>${groupCount}</b></h3><div class="repo-subfilters">${buttons}</div></section>`;
  }).join("");
  }

  document.querySelectorAll("[data-repo-filter]").forEach((button) => button.addEventListener("click", () => {
    const filterKey = button.dataset.repoFilter;
    if (filterKey === "ALL") {
      activeCategories.clear();
    } else if (activeDirectoryMode === "SKILL") {
      const group = categoryGroups.find((item) => item.key === filterKey);
      if (group) {
        const availableCategories = new Set(getRepositoryItems().map((item) => item.category));
        const groupCategories = group.categories.filter((category) => availableCategories.has(category));
        const allSelected = groupCategories.every((category) => activeCategories.has(category));
        groupCategories.forEach((category) => allSelected ? activeCategories.delete(category) : activeCategories.add(category));
      } else if (activeCategories.has(filterKey)) {
        activeCategories.delete(filterKey);
      } else {
        activeCategories.add(filterKey);
      }
    } else if (activeCategories.has(filterKey)) {
      activeCategories.delete(filterKey);
    } else {
      activeCategories.add(filterKey);
    }
    track(activeDirectoryMode === "WEB" ? "website_filter_select" : "skill_filter_select", { categories: [...activeCategories] });
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
  const isWebMode = activeDirectoryMode === "WEB";
  const filteredCount = isWebMode ? getFilteredWebsites().length : getFilteredRepositories().length;
  const totalCount = isWebMode ? designReferenceWebsites.length : getRepositoryItems().length;
  directoryModeButtons.forEach((button) => {
    const isActive = button.dataset.directoryMode === activeDirectoryMode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    const count = button.querySelector("b");
    if (count) count.textContent = button.dataset.directoryMode === "WEB" ? String(designReferenceWebsites.length) : String(getRepositoryItems().length);
  });
  if (skillsHeroCount) skillsHeroCount.textContent = String(totalCount);
  if (skillsHeroKind) skillsHeroKind.textContent = isWebMode ? "Design Websites" : "Design Skills";
  if (heroUpdateCount) heroUpdateCount.textContent = isWebMode ? "+2" : "+8";
  if (heroUpdateLabel) heroUpdateLabel.textContent = isWebMode
    ? (currentLanguage === "en" ? "new Web resources" : "新增 Web 资源")
    : (currentLanguage === "en" ? "presentation Skills" : "新增演示 Skill");
  if (skillsHeroBody) skillsHeroBody.textContent = isWebMode
    ? (currentLanguage === "en" ? "A focused reference directory for finding visual direction, studying product UI, refining interface details and exploring experimental web work." : "这是一份按设计用途整理的网站目录。可以用它寻找整体方向、拆解产品 UI、研究局部细节，或发现更具实验感的网页表达。")
    : (currentLanguage === "en" ? "This is a map of design capabilities, not a repository leaderboard. Start with the work you need to do, then compare purpose, activity and invocation." : "这里不是仓库排行榜，而是一张设计能力地图。先选择你要完成的工作，再比较 Skill 的用途、维护状态与调用方式。");
  if (heroBrowseLink) heroBrowseLink.textContent = isWebMode
    ? (currentLanguage === "en" ? "Browse all websites" : "浏览全部网站")
    : (currentLanguage === "en" ? "Browse all Skills" : "浏览全部 Skills");
  if (taskRailLabel) taskRailLabel.textContent = isWebMode
    ? (currentLanguage === "en" ? "Explore by purpose" : "按用途探索")
    : (currentLanguage === "en" ? "Explore by task" : "按任务探索");
  if (repoSort) repoSort.hidden = isWebMode;
  if (repoSyncStatus) repoSyncStatus.hidden = isWebMode;
  if (repoSearch) {
    repoSearch.value = searchQuery;
    repoSearch.placeholder = isWebMode
      ? (currentLanguage === "en" ? "Search website, purpose or domain" : "搜索网站、用途或域名")
      : (currentLanguage === "en" ? "Search name, purpose or repository" : "搜索名称、用途或仓库");
  }
  if (repoCount) {
    repoCount.textContent = currentLanguage === "en" ? `${filteredCount} of ${totalCount}` : `${filteredCount} / ${totalCount}`;
  }
  if (repoSyncStatus && !isWebMode) {
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

function renderRepositories() {
  renderRepositoryToolbar();
  if (activeDirectoryMode === "WEB") {
    renderDesignReferences();
    return;
  }
  const items = getFilteredRepositories();
  repoList.classList.remove("is-web-list");
  repoList.innerHTML = items.map((item, index) => `
    <article class="repo-row repo-card-${index % 6}" data-category="${escapeHtml(item.category)}">
      <a class="repo-scene" data-category="${escapeHtml(item.category)}" href="./skill-detail.html?repo=${encodeURIComponent(item.slug)}&lang=${currentLanguage}" aria-label="${currentLanguage === "en" ? "View skill details" : "查看 Skill 详情"}: ${escapeHtml(item.title)}">
        <span class="repo-browser-bar" aria-hidden="true"><i></i><i></i><i></i><b>${escapeHtml(getSkillBrowserLabel(item))}</b><em>↗</em></span>
        <img class="repo-cover-image" src="${escapeHtml(getSkillCover(item))}" alt="" loading="lazy" decoding="async">
        <span class="repo-cover-shade" aria-hidden="true"></span>
        <span class="repo-index">${String(index + 1).padStart(2, "0")}</span>
        <span class="repo-cover-caption"><strong>${escapeHtml(getSkillVisual(item))}</strong><small>${escapeHtml(getCategoryLabel(item.category))}</small></span>
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
  repoList.querySelectorAll(".repo-cover-image").forEach((image) => image.addEventListener("error", () => {
    image.closest(".repo-row")?.classList.add("is-cover-missing");
    image.remove();
  }, { once: true }));
  if (!items.length) repoList.innerHTML = `<p class="repo-empty">${currentLanguage === "en" ? "No matching skills. Try another keyword or category." : "没有找到匹配的 Skill，请换个关键词或分类。"}</p>`;
}

function renderDesignReferences() {
  const items = getFilteredWebsites();
  repoList.classList.add("is-web-list");
  const groups = designReferenceGroups.map((group) => ({ ...group, items: items.filter((item) => item.group === group.key) })).filter((group) => group.items.length);
  repoList.innerHTML = groups.map((group) => `
    <section class="web-reference-group">
      <header><div><span>${escapeHtml(group.key)}</span><h3>${escapeHtml(currentLanguage === "en" ? group.en : group.zh)}</h3></div><p>${escapeHtml(currentLanguage === "en" ? group.descriptionEn : group.descriptionZh)}</p><b>${String(group.items.length).padStart(2, "0")}</b></header>
      <div class="web-reference-grid">
        ${group.items.map((site, index) => `
          <article class="web-reference-card">
            <a class="web-reference-visual" href="${site.url}" target="_blank" rel="noreferrer" data-design-reference="${escapeHtml(site.domain)}" aria-label="${escapeHtml(site.name)}">
              <img src="${escapeHtml(getWebsitePreviewPath(site))}" alt="${escapeHtml(site.name)} ${currentLanguage === "en" ? "official website preview" : "官网页面预览"}" loading="lazy" decoding="async" data-web-preview>
              <span class="web-reference-top"><span>${escapeHtml(currentLanguage === "en" ? group.en : group.zh)}</span><b>${String(index + 1).padStart(2, "0")}</b></span>
            </a>
            <div class="web-reference-body">
              <a class="web-reference-title" href="${site.url}" target="_blank" rel="noreferrer" data-design-reference="${escapeHtml(site.domain)}"><span>${escapeHtml(site.name)}</span><i aria-hidden="true">↗</i></a>
              <p class="web-reference-domain">${escapeHtml(site.domain)}</p>
              <p class="web-reference-description">${escapeHtml(currentLanguage === "en" ? site.descriptionEn : site.descriptionZh)}</p>
              <footer><span>${currentLanguage === "en" ? "Best for" : "适合用于"}</span><strong>${escapeHtml(currentLanguage === "en" ? site.focusEn : site.focusZh)}</strong></footer>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `).join("");
  repoList.querySelectorAll("[data-web-preview]").forEach((image) => image.addEventListener("error", () => {
    image.closest(".web-reference-card")?.classList.add("is-preview-missing");
  }, { once: true }));
  repoList.querySelectorAll("[data-design-reference]").forEach((link) => link.addEventListener("click", () => track("design_reference_open", { website: link.dataset.designReference })));
  if (!items.length) repoList.innerHTML = `<p class="repo-empty">${currentLanguage === "en" ? "No matching websites. Try another keyword or purpose." : "没有找到匹配的网站，请换个关键词或用途。"}</p>`;
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
  const cacheIsComplete = repositories.every((item) => Boolean(cachedItems[item.slug]));
  const cacheIsFresh = Boolean(cacheIsComplete && cache?.savedAt && Date.now() - cache.savedAt < repositoryStatsCacheTtl);
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
}

if (repoSearch) repoSearch.addEventListener("input", () => {
  searchQuery = repoSearch.value;
  renderRepositories();
});

if (repoClearFilters) repoClearFilters.addEventListener("click", () => {
  activeCategories.clear();
  activeSort = "CURATED";
  searchQuery = "";
  renderRepositories();
});

repoSortButtons.forEach((button) => button.addEventListener("click", () => {
  activeSort = button.dataset.repoSort;
  track("skill_sort_select", { sort: activeSort });
  renderRepositories();
}));

directoryModeButtons.forEach((button) => button.addEventListener("click", () => {
  activeDirectoryMode = button.dataset.directoryMode;
  activeCategories.clear();
  activeSort = "CURATED";
  searchQuery = "";
  track("directory_mode_select", { mode: activeDirectoryMode });
  renderRepositories();
}));

if (officialSkillLink) officialSkillLink.addEventListener("click", () => track("official_skill_open", { repository: "zhu-guli326/image2_UI_skill" }));

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
