const repositories = [
  { slug: "Vincentwei1021/video-shotcraft", category: "VIDEO", title: "video-shotcraft", skillName: "video-shotcraft", coverType: "video", coverSrc: "./assets/skills/repositories/vincentwei1021-video-shotcraft-cover.mp4", detailMediaType: "video", detailMediaSrc: "./assets/skills/repositories/vincentwei1021-video-shotcraft-cover.mp4", fallback: "面向产品宣传视频的镜头配方与动态样例库。", focus: "视频叙事 / 动态样例" },
  { slug: "emilkowalski/skills", category: "DESIGN", title: "emilkowalski / skills", coverImage: "./assets/skills/repositories/emilkowalski-skills-cover.png", detailMediaSrc: "./assets/skills/repositories/emilkowalski-skills-cover.png", fallback: "为设计师和工程师准备的一组实用 skills。", focus: "产品设计 / 前端体验" },
  { slug: "pbakaus/impeccable", category: "DESIGN", title: "pbakaus / impeccable", fallback: "帮助 AI 更好理解设计语言与界面质量的 skill。", focus: "设计语言 / UI 品质" },
  { slug: "greensock/GSAP", category: "MOTION", title: "greensock / GSAP", coverType: "video", coverSrc: "./assets/skills/repositories/greensock-gsap-cover.mp4", detailMediaType: "video", detailMediaSrc: "./assets/skills/repositories/greensock-gsap-cover.mp4", extraTags: { zh: ["强推", "动效"], en: ["Strong pick", "Motion"] }, fallback: "现代 Web 动画的成熟工具与生态。", focus: "动效系统 / 交互反馈" },
  { slug: "Leonxlnx/taste-skill", category: "DESIGN", title: "Leonxlnx / taste-skill", coverImage: "./assets/skills/repositories/leonxlnx-taste-skill-cover.png", detailMediaSrc: "./assets/skills/repositories/leonxlnx-taste-skill-detail.png", fallback: "让 AI 避免生成无聊、通用、模板化界面的设计品味 skill。", focus: "去模板感 / 视觉判断" },
  { slug: "mattpocock/skills", category: "ENGINEERING", title: "mattpocock / skills", coverType: "video", coverSrc: "./assets/skills/repositories/mattpocock-skills-cover.mp4", coverImage: "./assets/skills/repositories/mattpocock-skills-cover.png", detailMediaType: "video", detailMediaSrc: "./assets/skills/repositories/mattpocock-skills-cover.mp4", fallback: "面向真实工程工作的可复用 agent skills。", focus: "工程工作流 / Agent" },
  { slug: "anthropics/skills", category: "DESIGN", title: "anthropics / skills", coverImage: "./assets/skills/repositories/anthropics-skills-cover.png", detailMediaSrc: "./assets/skills/repositories/anthropics-skills-cover.png", fallback: "包含 frontend-design 等面向真实创作任务的官方 skill 集合。", focus: "界面构建 / 创作工作流" },
  { slug: "vercel-labs/agent-skills", category: "FRONTEND", title: "vercel-labs / agent-skills", coverImage: "./assets/skills/repositories/vercel-labs-agent-skills-cover.svg", detailMediaSrc: "./assets/skills/repositories/vercel-labs-agent-skills-cover.svg", fallback: "面向 Web 产品的设计规范、React 模式与前端质量检查。", focus: "Web 规范 / React 质量" },
  { slug: "nexu-io/open-design", category: "AI DESIGN", title: "nexu-io / open-design", coverImage: "./assets/skills/repositories/nexu-io-open-design-cover.png", detailMediaSrc: "./assets/skills/repositories/nexu-io-open-design-cover.png", fallback: "面向 AI 设计生成的开放式工作台，支持 UI Mockup、线框、移动应用、文档、视频等多类型创作入口，并围绕设计系统和工作目录组织产出。", focus: "AI 设计工作台 / UI Mockup / 多类型生成" },
  { slug: "vercel-labs/design-systems-to-agent-skills", category: "SYSTEM", title: "Design Systems → Agent Skills", fallback: "把已有设计系统转成 Agent Skill 的方法库，强调访谈、源码事实提取、使用模式分析和可执行规范沉淀。", focus: "Design System 转 Skill / 规范提取" },
  { slug: "Subhan-code/Amicro--Micro-transitions-", category: "MOTION", title: "Subhan-code / Amicro", coverImage: "./assets/skills/repositories/subhan-code-amicro-micro-transitions-cover.svg", detailMediaSrc: "./assets/skills/repositories/subhan-code-amicro-micro-transitions-cover.svg", fallback: "面向 React 的微交互、转场动画与卡片布局集合，强调平滑节奏与简洁反馈。", focus: "Micro transitions / Motion / Card layouts" },
  { slug: "weareoxd/design-skill-generator", category: "AI DESIGN", title: "Design Skill Generator", fallback: "从截图或 Figma URL 自动生成 SKILL.md 与 tokens.css，提取颜色、字体、间距、组件模式、导航、图标与反模式。", focus: "截图转 Skill / Figma / Tokens" },
  { slug: "nolly-studio/agent-skills", category: "SYSTEM", title: "Nolly Studio / design-md", fallback: "基于真实项目代码生成 DESIGN.md 设计语言契约，帮助 Agent 明确字体、颜色、圆角、阴影、动效和 Token 用法。", focus: "DESIGN.md / 设计语言契约" },
  { slug: "nextlevelbuilder/ui-ux-pro-max-skill", category: "PRESENTATION", title: "ui-ux-pro-max", coverImage: "./assets/skills/repositories/nextlevelbuilder-ui-ux-pro-max-skill-cover.png", detailMediaSrc: "./assets/skills/repositories/nextlevelbuilder-ui-ux-pro-max-skill-cover.png", fallback: "把复杂业务数据转成带交互的 SVG 图表、UI 级看板与高保真演示页面。", focus: "数据复盘 / 产品评审 / 技术展示" },
  { slug: "motiondivision/motion", category: "MOTION", title: "motiondivision / motion", fallback: "为 React、Vue 和原生 Web 提供流畅、可组合的界面动效。", focus: "组件动效 / 微交互" },
  { slug: "radix-ui/primitives", category: "A11Y", title: "radix-ui / primitives", coverType: "video", coverSrc: "./assets/skills/repositories/radix-ui-primitives-cover.mp4", detailMediaType: "video", detailMediaSrc: "./assets/skills/repositories/radix-ui-primitives-cover.mp4", fallback: "无样式、可访问、可组合的 UI 原语，适合建立可靠组件层。", focus: "无障碍 / 组件原语" },
  { slug: "shadcn-ui/ui", category: "FRONTEND", title: "shadcn-ui / ui", coverType: "video", coverSrc: "./assets/skills/repositories/shadcn-ui-ui-cover.mp4", detailMediaType: "video", detailMediaSrc: "./assets/skills/repositories/shadcn-ui-ui-cover.mp4", fallback: "把可复制、可定制的 React 组件直接带进项目，适合快速建立高质量界面系统。", focus: "组件库 / Tailwind / 设计系统" },
  { slug: "wshobson/agents-tailwind-design-system", category: "SYSTEM", title: "Tailwind Design System", fallback: "来自 wshobson/agents 的 Tailwind CSS v4 设计系统 Skill，覆盖 CSS-first 配置、设计 Token、组件变体、响应式模式、暗色模式和可访问性。", focus: "Tailwind v4 / Design Tokens / 组件库" },
  { slug: "tailwindlabs/headlessui", category: "A11Y", title: "tailwindlabs / headlessui", coverType: "video", coverSrc: "./assets/skills/repositories/tailwindlabs-headlessui-cover.mp4", detailMediaType: "video", detailMediaSrc: "./assets/skills/repositories/tailwindlabs-headlessui-cover.mp4", fallback: "为 Tailwind 设计的无样式交互组件，覆盖菜单、弹窗和列表等模式。", focus: "交互模式 / 可访问性" },
  { slug: "twostraws/SwiftUI-Agent-Skill", category: "FRONTEND", title: "SwiftUI Agent Skill", fallback: "面向 Claude Code、Codex 等 AI Coding Assistant 的 SwiftUI Skill，帮助生成更现代、更简洁的 SwiftUI，覆盖导航、布局、动画、状态管理、VoiceOver、性能和弃用 API。", focus: "SwiftUI / iOS / AI Coding" },
  { slug: "lucide-icons/lucide", category: "SYSTEM", title: "lucide-icons / lucide", coverImage: "./assets/skills/repositories/lucide-icons-lucide-cover.png", detailMediaSrc: "./assets/skills/repositories/lucide-icons-lucide-cover.png", fallback: "清晰、可定制的开源图标系统，适合统一产品中的图标语言。", focus: "图标系统 / 视觉一致性" },
  { slug: "pmndrs/react-three-fiber", category: "3D", title: "pmndrs / react-three-fiber", coverType: "video", coverSrc: "./assets/skills/repositories/pmndrs-react-three-fiber-cover.mp4", detailMediaType: "video", detailMediaSrc: "./assets/skills/repositories/pmndrs-react-three-fiber-cover.mp4", fallback: "在 React 中构建 3D 体验的声明式渲染工具。", focus: "3D 交互 / 空间体验" },
  { slug: "ahujasid/blender-mcp", category: "3D", title: "ahujasid / blender-mcp", coverImage: "./assets/skills/repositories/ahujasid-blender-mcp-cover.png", detailMediaSrc: "./assets/skills/repositories/ahujasid-blender-mcp-cover.png", fallback: "把 Blender 接入 MCP，让 AI Agent 可以通过自然语言控制 Blender、创建模型、调整场景、材质和渲染流程。", focus: "Blender / MCP / 3D Agent" },
  { slug: "storybookjs/storybook", category: "SYSTEM", title: "storybookjs / storybook", fallback: "用于开发、测试和记录 UI 组件的工作台。", focus: "组件文档 / 设计协作" },
  { slug: "google-labs-code/stitch-skills", category: "AI DESIGN", title: "google-labs-code / stitch-skills", fallback: "为 Google Stitch MCP 准备的 Agent Skill 集合，覆盖从界面生成到迭代的工作流。", focus: "界面生成 / MCP 工作流" },
  { slug: "figma/mcp-server-guide", category: "AI DESIGN", title: "Figma MCP Server Guide", coverImage: "./assets/skills/repositories/figma-mcp-server-guide-cover.png", detailMediaSrc: "./assets/skills/repositories/figma-mcp-server-guide-cover.png", fallback: "Figma 官方 MCP 连接指南与客户端目录，把 Figma 设计上下文接入 Codex、Claude Code、Cursor 等 Agent 工具。", focus: "Figma MCP / 设计上下文 / Agent 工具" },
  { slug: "bergside/awesome-design-skills", category: "DIRECTORY", title: "bergside / awesome-design-skills", coverType: "video", coverSrc: "./assets/skills/repositories/bergside-awesome-design-skills-cover.mp4", detailMediaType: "video", detailMediaSrc: "./assets/skills/repositories/bergside-awesome-design-skills-cover.mp4", fallback: "整理大量 DESIGN.md 与 SKILL.md 设计能力文件的开放目录。", focus: "设计资源 / Skill 发现" },
  { slug: "gztchan/awesome-design", category: "DIRECTORY", title: "gztchan / awesome-design", fallback: "面向 UI/UX 设计师的高质量资源与工具清单，覆盖图库、图标、色彩、字体、原型、样机、用户测试、教程与社区等日常设计素材。", focus: "设计资源 / 工具索引 / UI/UX 日常" },
  { slug: "magnus919/agent-skills", category: "UX", title: "Product Design & UX", fallback: "面向产品体验的 Agent Skill，覆盖信息架构、任务流、状态恢复、交互模式选择、可用性检查和工程交付说明。", focus: "IA / Task Flow / UX 行为" },
  { slug: "sergekostenchuk/ui-ux-agent-skill-system", category: "FRONTEND", title: "Web App UI Skill", fallback: "专注 Dashboard、Admin、CRM、设置页、表格和筛选器等真实产品 UI，并覆盖 loading、empty、error、disabled、focus、selected、submitting、success 等状态。", focus: "Web App UI / 状态补全 / 后台界面" },
  { slug: "content-designer/ux-writing-skill", category: "UX", title: "UX Writing Skill", fallback: "系统化处理界面文案，包括按钮标签、错误提示、空状态、引导、校验、通知与 Voice & Tone，让产品语言更一致。", focus: "界面文案 / 空状态 / 错误提示" },
  { slug: "Community-Access/accessibility-agents", category: "A11Y", title: "Accessibility Agents", fallback: "提供面向 HTML、JSX、CSS、React 等 UI 的无障碍审查能力，适合在交付前做最终 A11y Audit。", focus: "A11y Audit / HTML / React" },
  { slug: "skydashnet/material-design-3-ui-skill", category: "SYSTEM", title: "Material Design 3 UI Skill", fallback: "围绕 Google Material Design 3 / Material You 的 UI Skill，覆盖语义 Token、自适应布局、可折叠设备、无障碍、动效、导航、表单与字体等模块。", focus: "Material 3 / Semantic Tokens / Adaptive UI" },
  { slug: "wenkang-deepblue/frontend-design", category: "AI DESIGN", title: "frontend-design", fallback: "生成可交互 HTML Preview，让设计师像 DevTools 一样点击元素、调整 Token、写评论，再把修改整理成结构化 Prompt 交回 Claude Code 或 Codex。", focus: "可交互预览 / 设计调整 / Prompt 回传" },
  { slug: "SeanJ1ang/design-judge-skills", category: "REVIEW", title: "SeanJ1ang / design-judge-skills", fallback: "帮助 AI 从视觉质量、信息层级和完成度角度审查界面。", focus: "设计评审 / 质量检查" },
  { slug: "ConardLi/garden-skills", category: "DESIGN", title: "ConardLi / garden-skills", fallback: "面向 AI 产品开发的多类可复用 skills，包含界面与体验工作流。", focus: "产品开发 / 复用能力" },
  { slug: "Owl-Listener/designer-skills", category: "DESIGN", title: "Owl-Listener / designer-skills", coverImage: "./assets/skills/repositories/owl-listener-designer-skills-cover.svg", detailMediaSrc: "./assets/skills/repositories/owl-listener-designer-skills-cover.svg", fallback: "面向设计任务的轻量 skill 集合，适合补充日常界面决策。", focus: "日常设计 / 决策辅助" },
  { slug: "superdesigndev/superdesign-skill", category: "AI DESIGN", title: "superdesigndev / superdesign-skill", fallback: "把设计思考、视觉方向和前端落地连接起来的设计 skill。", focus: "设计思考 / 前端落地" },
  { slug: "mistyhx/frontend-design-audit", category: "REVIEW", title: "mistyhx / frontend-design-audit", fallback: "面向前端页面的设计审计与改进检查清单。", focus: "页面审计 / 改进建议" },
  { slug: "plugin87/ux-ui-agent-skills", category: "UX", title: "plugin87 / ux-ui-agent-skills", fallback: "专注 UX/UI 任务的 Agent Skills 集合，覆盖界面体验与产品设计相关工作。", focus: "UX/UI 设计 / Agent 工作流" },
  { slug: "ZeroZ-lab/cc-design", category: "DESIGN", title: "ZeroZ-lab / cc-design", fallback: "面向 Claude Code 的设计插件与参考资料，包含设计红旗和插件发布工作流。", focus: "设计规范 / Claude Code" },
  { slug: "JimLiu/baoyu-design", category: "SYSTEM", title: "JimLiu / baoyu-design", coverImage: "./assets/skills/repositories/jimliu-baoyu-design-cover.png", detailMediaSrc: "./assets/skills/repositories/jimliu-baoyu-design-cover.png", fallback: "围绕设计系统创建、Figma 导入和实验工作流组织的一套设计能力。", focus: "设计系统 / Figma 导入" },
  { slug: "scottstts/Threejs-Awesome-Graphics-Agent-Skills", category: "3D", title: "scottstts / Threejs-Awesome-Graphics-Agent-Skills", fallback: "面向 Three.js 与图形创作的 Agent Skills 集合，适合补充 3D 和交互视觉能力。", focus: "Three.js / 图形 Agent" },
  { slug: "Owl-Listener/ai-design-skills", category: "DIRECTORY", title: "Owl-Listener / ai-design-skills", fallback: "整理 AI 设计能力和扩展入口的开源集合，适合继续发现跨模型的设计工作流。", focus: "AI 设计 / Skill 发现" },
  { slug: "hugohe3/ppt-master", category: "PRESENTATION", title: "ppt-master", coverType: "video", coverSrc: "./assets/skills/repositories/hugohe3-ppt-master-cover.mp4", detailMediaType: "video", detailMediaSrc: "./assets/skills/repositories/hugohe3-ppt-master-cover.mp4", fallback: "直接输出带完整图层与文字框的原生可编辑 PPTX，便于改字、换图和正式交付。", focus: "职场汇报 / 客户提案 / 可编辑交付" },
  { slug: "zarazhangrui/frontend-slides", category: "PRESENTATION", title: "frontend-slides", coverImage: "./assets/skills/repositories/zarazhangrui-frontend-slides-cover.png", detailMediaSrc: "./assets/skills/repositories/zarazhangrui-frontend-slides-cover.png", fallback: "生成高完成度、零依赖的单文件 HTML 演示，浏览器双击即可开始展示。", focus: "在线演示 / 远程分享 / 交互展示" },
  { slug: "op7418/guizang-ppt-skill", category: "PRESENTATION", title: "guizang-ppt-skill", coverImage: "./assets/skills/repositories/op7418-guizang-ppt-skill-cover.png", detailMediaSrc: "./assets/skills/repositories/op7418-guizang-ppt-skill-cover.png", fallback: "以杂志风和瑞士国际主义建立画册级、海报级演示视觉。", focus: "产品发布会 / 主题演讲 / 品牌展示" },
  { slug: "alchaincyf/huashu-design", category: "PRESENTATION", title: "huashu-design", coverImage: "./assets/skills/repositories/alchaincyf-huashu-design-cover.gif", detailMediaSrc: "./assets/skills/repositories/alchaincyf-huashu-design-cover.gif", fallback: "结合细腻 HTML 动效与可编辑 PPTX 导出，适合复杂设计规范与多格式输出。", focus: "交互原型 / 设计团队 / 混合输出" },
  { slug: "lewislulu/html-ppt-skill", category: "PRESENTATION", title: "html-ppt-skill", coverImage: "./assets/skills/repositories/lewislulu-html-ppt-skill.jpg", detailMediaSrc: "./assets/skills/repositories/lewislulu-html-ppt-skill.jpg", fallback: "提供倒计时、逐字稿提词器、双屏演讲者视图与丰富主题。", focus: "答辩 / 路演 / 提词演讲" },
  { slug: "MiniMax-AI/skills", category: "PRESENTATION", title: "MiniMax-pptx", fallback: "将会议记录或 Markdown 大纲快速转成结构化、可编辑的 PPTX 草稿。", focus: "内部对齐 / 临时出稿 / 大纲可视化" },
  { slug: "ningzimu/codex-ppt", category: "PRESENTATION", title: "codex-ppt", fallback: "以强封面感和海报级单页张力生成视觉语言统一的图片流 PPT。", focus: "社媒切片 / 视觉演讲 / 冲击力开场" },
  { slug: "ningzimu/image-to-editable-ppt-skill", category: "PRESENTATION", title: "image-to-editable-ppt-skill", coverImage: "./assets/skills/repositories/ningzimu-image-to-editable-ppt-skill-cover.png", detailMediaSrc: "./assets/skills/repositories/ningzimu-image-to-editable-ppt-skill-cover.png", fallback: "把图片、PDF 或图片版 PPTX 通过多 Agent 视觉重建成可编辑 PPTX，并支持按需 imagegen 与 OCR 文字校正。", focus: "图片转 PPT / 可编辑 PPTX / OCR 校正" },
  { slug: "ryanbbrown/revealjs-skill", category: "PRESENTATION", title: "revealjs-skill", fallback: "用 Markdown 驱动代码高亮与二维嵌套导航，适合开发者演示。", focus: "技术架构 / 开发者大会 / 开源宣讲" }
];

const repositoriesEn = [
  { slug: "Vincentwei1021/video-shotcraft", category: "VIDEO", title: "video-shotcraft", fallback: "An AI video skill with shot recipes and motion examples for product films.", focus: "Video storytelling / motion examples" },
  { slug: "emilkowalski/skills", category: "DESIGN", title: "emilkowalski / skills", coverImage: "./assets/skills/repositories/emilkowalski-skills-cover.png", detailMediaSrc: "./assets/skills/repositories/emilkowalski-skills-cover.png", fallback: "A practical collection of skills for designers and engineers.", focus: "Product design / frontend experience" },
  { slug: "pbakaus/impeccable", category: "DESIGN", title: "pbakaus / impeccable", fallback: "A skill that helps AI understand design language and interface quality.", focus: "Design language / UI quality" },
  { slug: "greensock/GSAP", category: "MOTION", title: "greensock / GSAP", fallback: "A mature toolkit and ecosystem for modern Web animation.", focus: "Motion systems / interaction feedback" },
  { slug: "Leonxlnx/taste-skill", category: "DESIGN", title: "Leonxlnx / taste-skill", coverImage: "./assets/skills/repositories/leonxlnx-taste-skill-cover.png", detailMediaSrc: "./assets/skills/repositories/leonxlnx-taste-skill-detail.png", fallback: "A design-taste skill that helps AI avoid bland, generic, templated interfaces.", focus: "Less templated / visual judgment" },
  { slug: "mattpocock/skills", category: "ENGINEERING", title: "mattpocock / skills", coverType: "video", coverSrc: "./assets/skills/repositories/mattpocock-skills-cover.mp4", coverImage: "./assets/skills/repositories/mattpocock-skills-cover.png", detailMediaType: "video", detailMediaSrc: "./assets/skills/repositories/mattpocock-skills-cover.mp4", fallback: "Reusable agent skills for real-world engineering work.", focus: "Engineering workflow / Agent" },
  { slug: "anthropics/skills", category: "DESIGN", title: "anthropics / skills", coverImage: "./assets/skills/repositories/anthropics-skills-cover.png", detailMediaSrc: "./assets/skills/repositories/anthropics-skills-cover.png", fallback: "An official collection of skills for real creative tasks, including frontend-design.", focus: "Interface building / creative workflow" },
  { slug: "vercel-labs/agent-skills", category: "FRONTEND", title: "vercel-labs / agent-skills", coverImage: "./assets/skills/repositories/vercel-labs-agent-skills-cover.svg", detailMediaSrc: "./assets/skills/repositories/vercel-labs-agent-skills-cover.svg", fallback: "Design guidelines, React patterns and frontend quality checks for Web products.", focus: "Web guidelines / React quality" },
  { slug: "nexu-io/open-design", category: "AI DESIGN", title: "nexu-io / open-design", coverImage: "./assets/skills/repositories/nexu-io-open-design-cover.png", detailMediaSrc: "./assets/skills/repositories/nexu-io-open-design-cover.png", fallback: "An open AI design workspace for UI mockups, wireframes, mobile apps, documents and video-oriented creation, organized around design systems and working directories.", focus: "AI design workspace / UI mockups / multi-format generation" },
  { slug: "vercel-labs/design-systems-to-agent-skills", category: "SYSTEM", title: "Design Systems → Agent Skills", fallback: "A process for transforming an existing design system into an Agent Skill through interviews, source-code fact extraction, usage-pattern analysis and executable guidelines.", focus: "Design system to Skill / guideline extraction" },
  { slug: "Subhan-code/Amicro--Micro-transitions-", category: "MOTION", title: "Subhan-code / Amicro", coverImage: "./assets/skills/repositories/subhan-code-amicro-micro-transitions-cover.svg", detailMediaSrc: "./assets/skills/repositories/subhan-code-amicro-micro-transitions-cover.svg", fallback: "A React micro-interactions, transitions and card-layout collection focused on smooth rhythm and lightweight feedback.", focus: "Micro transitions / Motion / Card layouts" },
  { slug: "weareoxd/design-skill-generator", category: "AI DESIGN", title: "Design Skill Generator", fallback: "Turns screenshots or Figma URLs into SKILL.md and tokens.css by extracting colors, typography, spacing, component patterns, navigation, icons and anti-patterns.", focus: "Screenshot to Skill / Figma / tokens" },
  { slug: "nolly-studio/agent-skills", category: "SYSTEM", title: "Nolly Studio / design-md", fallback: "Generates a project-level DESIGN.md design-language contract from real code so agents understand typography, color, radii, shadows, motion and token usage.", focus: "DESIGN.md / design-language contract" },
  { slug: "nextlevelbuilder/ui-ux-pro-max-skill", category: "PRESENTATION", title: "ui-ux-pro-max", fallback: "Turns complex business data into interactive SVG charts, UI-grade dashboards and high-fidelity presentations.", focus: "Data reviews / product critique / technical demos" },
  { slug: "motiondivision/motion", category: "MOTION", title: "motiondivision / motion", fallback: "Smooth, composable interface motion for React, Vue and the Web platform.", focus: "Component motion / micro-interactions" },
  { slug: "radix-ui/primitives", category: "A11Y", title: "radix-ui / primitives", coverType: "video", coverSrc: "./assets/skills/repositories/radix-ui-primitives-cover.mp4", detailMediaType: "video", detailMediaSrc: "./assets/skills/repositories/radix-ui-primitives-cover.mp4", fallback: "Unstyled, accessible and composable UI primitives for a dependable component layer.", focus: "Accessibility / primitives" },
  { slug: "shadcn-ui/ui", category: "FRONTEND", title: "shadcn-ui / ui", coverType: "video", coverSrc: "./assets/skills/repositories/shadcn-ui-ui-cover.mp4", detailMediaType: "video", detailMediaSrc: "./assets/skills/repositories/shadcn-ui-ui-cover.mp4", fallback: "Copyable, customizable React components for building high-quality interface systems quickly.", focus: "Component library / Tailwind / design systems" },
  { slug: "wshobson/agents-tailwind-design-system", category: "SYSTEM", title: "Tailwind Design System", fallback: "A Tailwind CSS v4 design-system skill from wshobson/agents covering CSS-first configuration, design tokens, component variants, responsive patterns, dark mode and accessibility.", focus: "Tailwind v4 / design tokens / component libraries" },
  { slug: "tailwindlabs/headlessui", category: "A11Y", title: "tailwindlabs / headlessui", coverType: "video", coverSrc: "./assets/skills/repositories/tailwindlabs-headlessui-cover.mp4", detailMediaType: "video", detailMediaSrc: "./assets/skills/repositories/tailwindlabs-headlessui-cover.mp4", fallback: "Unstyled accessible interaction components designed for Tailwind projects.", focus: "Interaction patterns / accessibility" },
  { slug: "twostraws/SwiftUI-Agent-Skill", category: "FRONTEND", title: "SwiftUI Agent Skill", fallback: "A SwiftUI skill for Claude Code, Codex and other AI coding assistants, helping them write more modern and simpler SwiftUI across navigation, layout, animation, state management, VoiceOver, performance and deprecated APIs.", focus: "SwiftUI / iOS / AI coding" },
  { slug: "lucide-icons/lucide", category: "SYSTEM", title: "lucide-icons / lucide", fallback: "A clear, customizable open-source icon system for consistent product language.", focus: "Icon systems / visual consistency" },
  { slug: "pmndrs/react-three-fiber", category: "3D", title: "pmndrs / react-three-fiber", fallback: "A declarative renderer for building 3D experiences in React.", focus: "3D interaction / spatial experience" },
  { slug: "ahujasid/blender-mcp", category: "3D", title: "ahujasid / blender-mcp", coverImage: "./assets/skills/repositories/ahujasid-blender-mcp-cover.png", detailMediaSrc: "./assets/skills/repositories/ahujasid-blender-mcp-cover.png", fallback: "Connects Blender to MCP so AI agents can control Blender with natural language, create models, adjust scenes, materials and rendering workflows.", focus: "Blender / MCP / 3D agents" },
  { slug: "storybookjs/storybook", category: "SYSTEM", title: "storybookjs / storybook", fallback: "A workbench for developing, testing and documenting UI components.", focus: "Component docs / design collaboration" },
  { slug: "google-labs-code/stitch-skills", category: "AI DESIGN", title: "google-labs-code / stitch-skills", fallback: "Agent Skills for the Google Stitch MCP server, covering interface generation and iteration workflows.", focus: "Interface generation / MCP workflow" },
  { slug: "figma/mcp-server-guide", category: "AI DESIGN", title: "Figma MCP Server Guide", coverImage: "./assets/skills/repositories/figma-mcp-server-guide-cover.png", detailMediaSrc: "./assets/skills/repositories/figma-mcp-server-guide-cover.png", fallback: "Figma's official MCP connection guide and client catalog for bringing Figma design context into Codex, Claude Code, Cursor and other agentic tools.", focus: "Figma MCP / design context / agent tools" },
  { slug: "bergside/awesome-design-skills", category: "DIRECTORY", title: "bergside / awesome-design-skills", coverType: "video", coverSrc: "./assets/skills/repositories/bergside-awesome-design-skills-cover.mp4", detailMediaType: "video", detailMediaSrc: "./assets/skills/repositories/bergside-awesome-design-skills-cover.mp4", fallback: "An open directory of DESIGN.md and SKILL.md files for discovering design capabilities.", focus: "Design resources / skill discovery" },
  { slug: "gztchan/awesome-design", category: "DIRECTORY", title: "gztchan / awesome-design", fallback: "A curated list of high-quality resources and tools for UI/UX designers, covering stock, icons, color, typography, prototyping, mockups, user testing, tutorials and communities.", focus: "Design resources / tool index / UI/UX practice" },
  { slug: "magnus919/agent-skills", category: "UX", title: "Product Design & UX", fallback: "An agent skill for product experience work, covering information architecture, task flows, state recovery, interaction-pattern choices, usability checks and engineering handoff.", focus: "IA / task flows / UX behavior" },
  { slug: "sergekostenchuk/ui-ux-agent-skill-system", category: "FRONTEND", title: "Web App UI Skill", fallback: "A web-app UI skill for dashboards, admin tools, CRM, settings, tables and filters, with coverage for loading, empty, error, disabled, focus, selected, submitting and success states.", focus: "Web app UI / state coverage / admin interfaces" },
  { slug: "content-designer/ux-writing-skill", category: "UX", title: "UX Writing Skill", fallback: "Systematic UX writing for button labels, errors, empty states, onboarding, validation, notifications and voice and tone consistency.", focus: "Interface copy / empty states / errors" },
  { slug: "Community-Access/accessibility-agents", category: "A11Y", title: "Accessibility Agents", fallback: "Accessibility audit skills for HTML, JSX, CSS, React and related UI work, useful as a final A11y review before shipping.", focus: "A11y audit / HTML / React" },
  { slug: "skydashnet/material-design-3-ui-skill", category: "SYSTEM", title: "Material Design 3 UI Skill", fallback: "A Material Design 3 / Material You UI skill covering semantic tokens, adaptive layouts, foldables, accessibility, motion, navigation, forms and typography.", focus: "Material 3 / semantic tokens / adaptive UI" },
  { slug: "wenkang-deepblue/frontend-design", category: "AI DESIGN", title: "frontend-design", fallback: "Creates an interactive HTML preview where designers can click elements, adjust tokens and leave comments, then send a structured prompt back to Claude Code or Codex.", focus: "Interactive preview / design tweaks / prompt handoff" },
  { slug: "SeanJ1ang/design-judge-skills", category: "REVIEW", title: "SeanJ1ang / design-judge-skills", fallback: "Helps AI review interface quality, hierarchy and finish from a visual-design perspective.", focus: "Design review / quality checks" },
  { slug: "ConardLi/garden-skills", category: "DESIGN", title: "ConardLi / garden-skills", fallback: "Reusable skills for AI product development, including interface and experience workflows.", focus: "Product development / reusable skills" },
  { slug: "Owl-Listener/designer-skills", category: "DESIGN", title: "Owl-Listener / designer-skills", coverImage: "./assets/skills/repositories/owl-listener-designer-skills-cover.svg", detailMediaSrc: "./assets/skills/repositories/owl-listener-designer-skills-cover.svg", fallback: "A lightweight collection of skills for everyday interface decisions and design tasks.", focus: "Daily design / decision support" },
  { slug: "superdesigndev/superdesign-skill", category: "AI DESIGN", title: "superdesigndev / superdesign-skill", fallback: "A design skill that connects design thinking, visual direction and frontend execution.", focus: "Design thinking / frontend craft" },
  { slug: "mistyhx/frontend-design-audit", category: "REVIEW", title: "mistyhx / frontend-design-audit", fallback: "A design-audit checklist for reviewing and improving frontend pages.", focus: "Page audits / improvement ideas" },
  { slug: "plugin87/ux-ui-agent-skills", category: "UX", title: "plugin87 / ux-ui-agent-skills", fallback: "A collection of agent skills for UX/UI tasks, covering interface experience and product-design work.", focus: "UX/UI design / Agent workflow" },
  { slug: "ZeroZ-lab/cc-design", category: "DESIGN", title: "ZeroZ-lab / cc-design", fallback: "A Claude Code design plugin and reference set with design red flags and publishing workflows.", focus: "Design guidance / Claude Code" },
  { slug: "JimLiu/baoyu-design", category: "SYSTEM", title: "JimLiu / baoyu-design", coverImage: "./assets/skills/repositories/jimliu-baoyu-design-cover.png", detailMediaSrc: "./assets/skills/repositories/jimliu-baoyu-design-cover.png", fallback: "A design capability set around creating systems, importing from Figma and running design experiments.", focus: "Design systems / Figma import" },
  { slug: "scottstts/Threejs-Awesome-Graphics-Agent-Skills", category: "3D", title: "scottstts / Threejs-Awesome-Graphics-Agent-Skills", fallback: "An agent-skill collection for Three.js and graphics work, extending 3D and interactive visual capability.", focus: "Three.js / graphics agents" },
  { slug: "Owl-Listener/ai-design-skills", category: "DIRECTORY", title: "Owl-Listener / ai-design-skills", fallback: "An open collection of AI-design capabilities and extensions for discovering cross-model design workflows.", focus: "AI design / skill discovery" },
  { slug: "hugohe3/ppt-master", category: "PRESENTATION", title: "ppt-master", coverType: "video", coverSrc: "./assets/skills/repositories/hugohe3-ppt-master-cover.mp4", detailMediaType: "video", detailMediaSrc: "./assets/skills/repositories/hugohe3-ppt-master-cover.mp4", fallback: "Creates native editable PPTX files with complete layers and text boxes for dependable handoff.", focus: "Business reports / client proposals / editable delivery" },
  { slug: "zarazhangrui/frontend-slides", category: "PRESENTATION", title: "frontend-slides", fallback: "Creates polished zero-dependency HTML presentations that open directly in a browser.", focus: "Online demos / remote talks / interactive presentations" },
  { slug: "op7418/guizang-ppt-skill", category: "PRESENTATION", title: "guizang-ppt-skill", fallback: "Creates editorial and Swiss-inspired presentation visuals with poster-level finish.", focus: "Product launches / talks / personal branding" },
  { slug: "alchaincyf/huashu-design", category: "PRESENTATION", title: "huashu-design", fallback: "Combines detailed HTML motion with editable PPTX export and flexible design specifications.", focus: "Interactive prototypes / design teams / mixed output" },
  { slug: "lewislulu/html-ppt-skill", category: "PRESENTATION", title: "html-ppt-skill", coverImage: "./assets/skills/repositories/lewislulu-html-ppt-skill.jpg", detailMediaSrc: "./assets/skills/repositories/lewislulu-html-ppt-skill.jpg", fallback: "Includes countdowns, speaker notes, presenter view and a broad theme system.", focus: "Defenses / roadshows / speaker support" },
  { slug: "MiniMax-AI/skills", category: "PRESENTATION", title: "MiniMax-pptx", fallback: "Turns meeting notes or Markdown outlines into structured editable PPTX drafts.", focus: "Fast alignment / quick drafts / outline visualization" },
  { slug: "ningzimu/codex-ppt", category: "PRESENTATION", title: "codex-ppt", fallback: "Creates visually forceful image-led decks with consistent poster-like art direction.", focus: "Social slices / visual talks / high-impact openings" },
  { slug: "ningzimu/image-to-editable-ppt-skill", category: "PRESENTATION", title: "image-to-editable-ppt-skill", coverImage: "./assets/skills/repositories/ningzimu-image-to-editable-ppt-skill-cover.png", detailMediaSrc: "./assets/skills/repositories/ningzimu-image-to-editable-ppt-skill-cover.png", fallback: "Rebuilds images, PDFs or image-based PPTX files into editable PPTX through multi-agent visual reconstruction, with optional imagegen and OCR text correction.", focus: "Image to PPT / editable PPTX / OCR correction" },
  { slug: "ryanbbrown/revealjs-skill", category: "PRESENTATION", title: "revealjs-skill", fallback: "Markdown-driven code presentations with syntax highlighting and nested navigation.", focus: "Architecture talks / developer events / open-source demos" }
];

const designReferenceGroups = [
  { key: "DIRECTION", zh: "整体方向", en: "Direction", descriptionZh: "建立视觉方向、版式语言与页面整体节奏。", descriptionEn: "Set visual direction, layout language and overall page rhythm." },
  { key: "DIRECTORY", zh: "资源目录", en: "Resource directories", descriptionZh: "集中检索设计工具、素材、模板与可复用资源，减少分散寻找的时间。", descriptionEn: "Search curated design tools, assets, templates and reusable resources in one place." },
  { key: "PRODUCT", zh: "产品 UI", en: "Product UI", descriptionZh: "拆解真实产品流程、功能结构与交互模式。", descriptionEn: "Study real product flows, feature structures and interaction patterns." },
  { key: "COMPONENT", zh: "组件资源", en: "Component libraries", descriptionZh: "寻找可直接组合、定制并交给 AI Coding 使用的界面组件与设计系统基础。", descriptionEn: "Find composable, customizable UI components and design-system foundations for AI-assisted coding." },
  { key: "DETAIL", zh: "局部细节", en: "UI details", descriptionZh: "研究导航、首屏、CTA、页脚与微交互细节。", descriptionEn: "Study navigation, heroes, CTAs, footers and interaction details." },
  { key: "EXPERIMENT", zh: "创意网页", en: "Creative web", descriptionZh: "收集动效强、交互大胆的网页案例，适合研究滚动叙事、转场和创意表达。", descriptionEn: "Find web examples with bold motion, interaction and creative expression." },
  { key: "MOTION", zh: "动效与交互", en: "Motion & interaction", descriptionZh: "收集界面动画组件、页面转场、状态反馈与动效开发工具。", descriptionEn: "Explore interface animation components, page transitions, state feedback and motion development tools." },
  { key: "PRESENTATION", zh: "演示工具", en: "Presentation tools", descriptionZh: "快速生成可编辑 PPT 或零代码在线演示。", descriptionEn: "Create editable decks or no-code online presentations quickly." }
];

const designReferenceWebsites = [
  { name: "Recent", domain: "recent.design", url: "https://recent.design/", group: "DIRECTION", previewType: "video", previewSrc: "./assets/skills/web/recent-design.mp4", previewRatio: "1 / 1", descriptionZh: "聚合近期设计作品，适合快速感知正在发生的视觉趋势。", descriptionEn: "A feed of recent design work for sensing current visual trends.", focusZh: "趋势扫描 / 视觉方向", focusEn: "Trend scan / visual direction" },
  { name: "Cosmos", domain: "cosmos.so", url: "https://cosmos.so/", group: "DIRECTION", previewType: "video", previewSrc: "./assets/skills/web/cosmos-so-cover.mp4", previewImage: "./assets/skills/web/cosmos-so-cover.png", previewRatio: "192 / 101", descriptionZh: "面向创意团队的视觉灵感空间，可按文字、颜色与视觉相似度搜索，并把参考整理成可检索的个人收藏。", descriptionEn: "A visual inspiration space for creative teams with text, color and similarity search plus connected personal collections.", focusZh: "视觉搜索 / 情绪板 / 灵感收藏", focusEn: "Visual search / moodboards / collections" },
  { name: "Refframe", domain: "refframe.com", url: "https://refframe.com/", group: "DIRECTION", previewType: "video", previewSrc: "./assets/skills/web/refframe-com-cover.mp4", previewImage: "./assets/skills/web/refframe-com-cover.png", previewRatio: "40 / 21", descriptionZh: "按网站、页面区块、风格和行业组织参考，方便比较完整网页与 Hero、定价、页脚等局部结构。", descriptionEn: "Web references organized by site, section, style and industry for comparing full pages and reusable interface patterns.", focusZh: "网页参考 / 区块拆解 / 项目看板", focusEn: "Web references / section study / boards" },
  { name: "Best Designs on X", domain: "bestdesignsonx.com", url: "https://bestdesignsonx.com/", group: "DIRECTION", previewType: "video", previewSrc: "./assets/skills/web/bestdesignsonx-com-cover.mp4", previewImage: "./assets/skills/web/bestdesignsonx-com-cover.png", previewRatio: "40 / 21", descriptionZh: "从 X 持续整理优秀视觉作品，覆盖 UI、品牌、Logo 等方向，适合快速追踪设计社区的新鲜表达。", descriptionEn: "Hourly hand-picked design inspiration from X across UI, branding, logos and other visual disciplines.", focusZh: "X 灵感 / 社区趋势 / 视觉扫描", focusEn: "X inspiration / community trends / visual scan" },
  { name: "The Internet Designs", domain: "theinternetdesigns.com", url: "https://theinternetdesigns.com/", group: "DIRECTION", previewType: "video", previewSrc: "./assets/skills/web/theinternetdesigns-com-cover.mp4", previewImage: "./assets/skills/web/theinternetdesigns-com-cover.png", previewRatio: "40 / 21", descriptionZh: "汇集来自 X 与 Pinterest 的设计灵感，可按 Interfaces、Landing page、Mobile apps、Dashboards、Interactions、Typography、3D、Brand 等分类筛选，每条作品附来源链接、配色色板与交互类型标注。", descriptionEn: "Design inspiration curated from X and Pinterest, filterable by interfaces, landing pages, mobile apps, dashboards, interactions, typography, 3D and brand design — each entry carries its source link, color palette and interaction type.", focusZh: "多类型 UI 灵感 / 分类筛选 / 来源与配色标注", focusEn: "Multi-type UI inspiration / category filters / source & palette notes" },
  { name: "Inspora", domain: "inspora.design", url: "https://inspora.design/", group: "DIRECTION", previewType: "video", previewSrc: "./assets/skills/web/inspora-design-cover.mp4", previewImage: "./assets/skills/web/inspora-design-cover.png", previewRatio: "40 / 21", descriptionZh: "持续更新的视觉设计档案，按 Web、品牌、产品、动效、插画、3D 与印刷分类浏览近期作品。", descriptionEn: "A curated archive of recent work across web, branding, product, motion, illustration, 3D and print.", focusZh: "近期作品 / 多领域灵感 / 动效", focusEn: "Recent work / multidisciplinary inspiration / motion" },
  { name: "DesignBookmark", domain: "designbookmark.com", url: "https://designbookmark.com/", group: "DIRECTORY", previewType: "video", previewSrc: "./assets/skills/web/designbookmark-com-cover.mp4", previewImage: "./assets/skills/web/designbookmark-com-cover.png", previewRatio: "959 / 522", descriptionZh: "收录 2,000+ 设计工具与网站，并按图标、字体、样机、Figma、模板、AI 和开发等类别集中检索。", descriptionEn: "A curated directory of 2,000+ design tools, sites, icons, fonts, mockups, templates, AI and development resources.", focusZh: "设计工具 / 素材目录 / 快速检索", focusEn: "Design tools / resource directory / search" },
  { name: "Lapa Ninja", domain: "lapa.ninja", url: "https://www.lapa.ninja/", group: "DIRECTION", previewType: "video", previewSrc: "./assets/skills/web/lapa-ninja.mp4", previewRatio: "403 / 230", descriptionZh: "收集大量落地页案例，用于研究首屏、内容节奏与转化结构。", descriptionEn: "A large landing-page collection for studying heroes, rhythm and conversion structure.", focusZh: "落地页 / 转化结构", focusEn: "Landing pages / conversion" },
  { name: "Landingfolio", domain: "landingfolio.com", url: "https://www.landingfolio.com/", group: "DIRECTION", previewType: "video", previewSrc: "./assets/skills/web/landingfolio-com-cover.mp4", previewImage: "./assets/skills/web/landingfolio-com-poster.png", descriptionZh: "收集高质量落地页、组件与设计灵感，适合研究首屏表达、转化路径和 SaaS 页面结构。", descriptionEn: "A landing-page inspiration library for studying hero sections, conversion paths, SaaS structures and reusable page patterns.", focusZh: "落地页 / SaaS / 转化结构", focusEn: "Landing pages / SaaS / conversion" },
  { name: "Land-book", domain: "land-book.com", url: "https://land-book.com/", group: "DIRECTION", previewType: "video", previewSrc: "./assets/skills/web/land-book-com.mp4", previewRatio: "578 / 303", descriptionZh: "按风格与类型浏览网站案例，适合建立项目情绪板。", descriptionEn: "Browse websites by style and type to build project moodboards.", focusZh: "网站风格 / 情绪板", focusEn: "Web style / moodboards" },
  { name: "Awwwards", domain: "awwwards.com", url: "https://www.awwwards.com/sites/michael-gatt", group: "EXPERIMENT", previewType: "video", previewSrc: "./assets/skills/web/awwwards-com-cover.mp4", previewImage: "./assets/skills/web/awwwards-com-cover.png", previewRatio: "40 / 21", descriptionZh: "聚焦高质量网站、创意开发与完整交互体验。", descriptionEn: "High-quality websites, creative development and complete interactive experiences.", focusZh: "创意网站 / 交互叙事", focusEn: "Creative web / interaction" },
  { name: "Mobbin", domain: "mobbin.com", url: "https://mobbin.com/discover/apps/ios/latest", group: "PRODUCT", previewType: "video", previewSrc: "./assets/skills/web/mobbin-com.mp4", previewRatio: "137 / 68", descriptionZh: "按真实产品流程检索移动端与 Web 界面，适合拆解成熟 UX 模式。", descriptionEn: "Search real mobile and web product flows to study mature UX patterns.", focusZh: "App 流程 / UX 模式", focusEn: "App flows / UX patterns" },
  { name: "Refero", domain: "refero.design", url: "https://refero.design/", group: "PRODUCT", previewType: "video", previewSrc: "./assets/skills/web/refero-design-cover.mp4", previewImage: "./assets/skills/web/refero-design-cover.png", descriptionZh: "围绕真实界面与产品流程组织参考，方便研究功能结构。", descriptionEn: "Product references organized around real screens and flows.", focusZh: "产品界面 / 功能拆解", focusEn: "Product UI / feature study" },
  { name: "Beautiful UI", openSource: true, domain: "beautifului.dev", url: "https://beautifului.dev/", group: "COMPONENT", previewType: "video", previewSrc: "./assets/skills/web/beautifului-dev-cover.mp4", previewImage: "./assets/skills/web/beautifului-dev-cover.png", previewRatio: "163 / 135", descriptionZh: "专为 AI 原生界面设计的基础组件，覆盖像素网格 Loading、可展开 Thinking、流式文本、Approval Card、Tool Chips 与实时 Task Rows。", descriptionEn: "Primitives for AI-native interfaces, including pixel-grid loading, expandable thinking, streaming text, approval cards, tool chips and live task rows.", focusZh: "AI 产品 / Agent 界面 / 状态设计", focusEn: "AI products / agent UI / states" },
  { name: "shadcn/ui", openSource: true, domain: "ui.shadcn.com", url: "https://ui.shadcn.com/", group: "COMPONENT", previewType: "video", previewSrc: "./assets/skills/web/ui-shadcn-com-cover.mp4", previewImage: "./assets/skills/web/ui-shadcn-com-cover.png", previewRatio: "40 / 21", descriptionZh: "设计系统的开放地基：一套设计精良、可自定义、可扩展的组件与区块，从这里开始，再改成自己的产品语言。", descriptionEn: "An open foundation for design systems: beautifully designed, customizable and extensible components to make your own.", focusZh: "组件基础 / 设计系统 / React", focusEn: "Component foundation / design systems / React" },
  { name: "Design Spells", domain: "designspells.com", url: "https://www.designspells.com/", group: "DETAIL", previewType: "video", previewSrc: "./assets/skills/web/designspells-cover.mp4", previewImage: "./assets/skills/web/designspells-cover.png", previewRatio: "40 / 21", descriptionZh: "收集产品中让体验更细腻的设计细节与微交互。", descriptionEn: "A collection of thoughtful product details and micro-interactions.", focusZh: "微交互 / 体验细节", focusEn: "Micro-interactions / details" },
  { name: "Supahero", domain: "supahero.io", url: "https://supahero.io/", group: "DETAIL", previewType: "video", previewSrc: "./assets/skills/web/supahero-io-cover.mp4", previewImage: "./assets/skills/web/supahero-io-cover.png", previewRatio: "40 / 21", descriptionZh: "精选真实网站的 Hero 首屏库，每条附可交互预览与跳转原站链接，适合研究信息密度、视觉焦点和首屏动效。", descriptionEn: "A curated library of real website hero sections with interactive previews and links to the original sites — great for studying first-fold density, visual focus and hero motion.", focusZh: "Hero / 首屏设计", focusEn: "Hero sections / first fold" },
  { name: "Navbar Gallery", domain: "navbar.gallery", url: "https://www.navbar.gallery/", group: "DETAIL", previewType: "video", previewSrc: "./assets/skills/web/navbar-gallery-cover.mp4", previewImage: "./assets/skills/web/navbar-gallery-cover.png", previewRatio: "40 / 21", descriptionZh: "真实网站的导航栏案例库，可按 Static、Dropdown、Mega Menu、Side Bar、Search Bar、Full Screen、Breadcrumbs 等类型筛选，每条附可交互预览、导航类型与网站类型标注，并可跳转原站。", descriptionEn: "A library of real website navbars filterable by type — static, dropdown, mega menu, side bar, search bar, full screen, breadcrumbs — each with an interactive preview, navbar/website type metadata and a link to the live site.", focusZh: "导航类型 / Mega Menu / 信息架构", focusEn: "Navbar types / mega menu / information architecture" },
  { name: "CTA Gallery", domain: "cta.gallery", url: "https://www.cta.gallery/", group: "DETAIL", previewType: "video", previewSrc: "./assets/skills/web/cta-gallery-cover.mp4", previewImage: "./assets/skills/web/cta-gallery-cover.png", previewRatio: "40 / 21", descriptionZh: "聚焦行动按钮与转化模块，帮助研究文案和视觉层级。", descriptionEn: "CTA examples for studying conversion copy and visual hierarchy.", focusZh: "CTA / 转化设计", focusEn: "CTA / conversion design" },
  { name: "Footer Design", domain: "footer.design", url: "https://www.footer.design/", group: "DETAIL", previewType: "video", previewSrc: "./assets/skills/web/footer-design-cover.mp4", previewImage: "./assets/skills/web/footer-design-cover.png", previewRatio: "40 / 21", descriptionZh: "收集不同类型的网站页脚，适合研究信息收尾与导航补充。", descriptionEn: "Website footer examples for studying closing content and secondary navigation.", focusZh: "页脚 / 信息收尾", focusEn: "Footers / closing content" },
  { name: "Motion Sites", domain: "motionsites.ai", url: "https://motionsites.ai/", group: "DIRECTORY", previewType: "video", previewSrc: "./assets/skills/web/motionsites-ai-cover.mp4", descriptionZh: "面向 AI 建站的提示词与模板资源，用于快速生成动效强、完成度高的网站。", descriptionEn: "Premium AI website prompts and templates for building high-craft motion sites.", focusZh: "AI 建站提示词 / 动效网站模板", focusEn: "AI website prompts / motion site templates" },
  { name: "Loadmo.re", domain: "loadmo.re", url: "https://loadmo.re/", group: "EXPERIMENT", previewType: "video", previewSrc: "./assets/skills/web/loadmo-re-cover.mp4", descriptionZh: "发现更具实验性的网页、动效与创意交互表达。", descriptionEn: "Discover experimental websites, motion and creative interaction work.", focusZh: "实验网页 / 创意动效", focusEn: "Experimental web / motion" },
  { name: "Pryzm", domain: "pryzm.design", url: "https://pryzm.design/", group: "DIRECTORY", previewType: "video", previewSrc: "./assets/skills/web/pryzm-design-cover.mp4", previewImage: "./assets/skills/web/pryzm-design-cover.png", previewRatio: "40 / 21", descriptionZh: "把渐变、玻璃与噪点混合成独特背景和动态循环的生成式工作台，为界面与 AI 产品快速造背景素材。", descriptionEn: "A generative studio blending gradients, glass and grain into unique backgrounds and animated loops for interfaces and AI products.", focusZh: "渐变背景 / 玻璃噪点 / 动态循环", focusEn: "Gradient backgrounds / glass & grain / animated loops" },
  { name: "beUI", openSource: true, domain: "beui.dev", url: "https://beui.dev/", group: "MOTION", previewType: "video", previewSrc: "./assets/skills/web/beui-dev-cover.mp4", previewImage: "./assets/skills/web/beui-dev-cover.png", previewRatio: "40 / 21", descriptionZh: "111 个 React / Next.js 动画组件，基于 Motion、Tailwind CSS 与 React 构建，免费开源，可通过 shadcn CLI 安装。", descriptionEn: "111 open-source animated React and Next.js components built with Motion and Tailwind CSS and installable via shadcn CLI.", focusZh: "React 动效 / 微交互 / Tailwind", focusEn: "React motion / micro-interactions / Tailwind" },
  { name: "Rare UI", openSource: true, domain: "rareui.com", url: "https://rareui.com/", group: "MOTION", previewType: "video", previewSrc: "./assets/skills/web/rareui-com-cover.mp4", previewImage: "./assets/skills/web/rareui-com-cover.png", previewRatio: "40 / 21", descriptionZh: "14+ 个少见且有记忆点的开源动画 React 组件，可通过 shadcn CLI 安装，包括 Fluid Orb、Gravity Letters 与 OTP Input。", descriptionEn: "14+ distinctive open-source animated React components, including Fluid Orb, Gravity Letters and OTP Input, installable via shadcn CLI.", focusZh: "特色组件 / 动画反馈 / React", focusEn: "Distinctive components / motion feedback / React" },
  { name: "Transitions", openSource: true, domain: "transitions.dev", url: "https://transitions.dev/", group: "MOTION", previewType: "video", previewSrc: "./assets/skills/web/transitions-dev-cover.mp4", previewImage: "./assets/skills/web/transitions-dev-cover.png", previewRatio: "761 / 540", descriptionZh: "面向 Web 与 AI Agent 的常用过渡动画，覆盖卡片 resize、数字弹出、通知徽章、文本切换、模态框开合、成功勾选和错误抖动。", descriptionEn: "Essential transitions for web and AI agents, including card resize, number pop-in, badges, text swaps, modals, success checks and error shakes.", focusZh: "页面转场 / 状态切换 / Agent Skill", focusEn: "UI transitions / state changes / agent skill" },
  { name: "Anime.js", openSource: true, domain: "animejs.com", url: "https://animejs.com/", group: "MOTION", previewType: "video", previewSrc: "./assets/skills/web/animejs-com-cover.mp4", descriptionZh: "轻量而强大的 JavaScript 动画引擎，可编排 DOM、SVG、CSS 属性与时间轴动画。", descriptionEn: "A lightweight JavaScript animation engine for DOM, SVG, CSS properties and timeline choreography.", focusZh: "时间轴 / SVG / 交互动效", focusEn: "Timelines / SVG / interaction motion" }
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
let activeSourceOnly = false;
let selectedSlug = repositories[0].slug;
let repositoryStatsStatus = "loading";
let repositoryStatsUpdatedAt = null;
const validDirectoryModes = new Set(["SKILL", "WEB"]);
const validSorts = new Set(["CURATED", "STARS", "UPDATED"]);

function restoreDirectoryStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  const sort = params.get("sort");
  activeDirectoryMode = validDirectoryModes.has(mode) ? mode : "SKILL";
  activeSort = validSorts.has(sort) ? sort : "CURATED";
  searchQuery = params.get("q") || "";
  activeCategories.clear();
  (params.get("categories") || "").split(",").map((item) => item.trim()).filter(Boolean).forEach((category) => activeCategories.add(category));
}

function applyDirectoryStateToParams(params) {
  params.set("lang", currentLanguage);
  if (activeDirectoryMode === "WEB") params.set("mode", activeDirectoryMode);
  else params.delete("mode");
  if (activeDirectoryMode === "SKILL" && activeSort !== "CURATED") params.set("sort", activeSort);
  else params.delete("sort");
  if (activeCategories.size) params.set("categories", [...activeCategories].join(","));
  else params.delete("categories");
  const query = searchQuery.trim();
  if (query) params.set("q", query);
  else params.delete("q");
}

function syncDirectoryStateToUrl() {
  if (!window.history?.replaceState) return;
  const url = new URL(window.location.href);
  applyDirectoryStateToParams(url.searchParams);
  window.history.replaceState(null, "", `${url.pathname}?${url.searchParams.toString()}${url.hash}`);
}

function buildSkillDetailHref(slug) {
  const params = new URLSearchParams();
  params.set("repo", slug);
  applyDirectoryStateToParams(params);
  return `./skill-detail.html?${params.toString()}`;
}

restoreDirectoryStateFromUrl();

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
  "nexu-io/open-design": { zh: "把提示变成\n设计工作台", en: "Turn prompts into\na design workspace" },
  "vercel-labs/design-systems-to-agent-skills": { zh: "把设计系统\n转成 Skill", en: "Turn design systems\ninto agent skills" },
  "Subhan-code/Amicro--Micro-transitions-": { zh: "微交互与\n转场动画", en: "Micro interactions\nand transitions" },
  "weareoxd/design-skill-generator": { zh: "把参考图变成\n设计 Skill", en: "Turn references\ninto design skills" },
  "nolly-studio/agent-skills": { zh: "沉淀项目级\n设计契约", en: "Capture project-level\ndesign contracts" },
  "nextlevelbuilder/ui-ux-pro-max-skill": { zh: "把复杂数据\n变成交互演示", en: "Turn complex data into\nan interactive presentation" },
  "motiondivision/motion": { zh: "为交互增加\n自然反馈", en: "Add natural feedback\nto interactions" },
  "radix-ui/primitives": { zh: "从无障碍原语\n开始构建", en: "Start with accessible\ninterface primitives" },
  "shadcn-ui/ui": { zh: "复制高质量\n组件系统", en: "Copy a polished\ncomponent system" },
  "wshobson/agents-tailwind-design-system": { zh: "用 Tailwind v4\n沉淀设计系统", en: "Shape Tailwind v4\ninto a design system" },
  "tailwindlabs/headlessui": { zh: "组合可靠的\n交互模式", en: "Compose dependable\ninteraction patterns" },
  "twostraws/SwiftUI-Agent-Skill": { zh: "让 Agent 写出\n现代 SwiftUI", en: "Help agents write\nmodern SwiftUI" },
  "lucide-icons/lucide": { zh: "统一产品的\n图标语言", en: "Unify the product's\nicon language" },
  "pmndrs/react-three-fiber": { zh: "把 3D 带进\nReact", en: "Bring 3D into\nReact" },
  "ahujasid/blender-mcp": { zh: "让 Agent 控制\nBlender 场景", en: "Let agents control\nBlender scenes" },
  "storybookjs/storybook": { zh: "让组件可见\n可测可协作", en: "Make components visible,\ntestable and collaborative" },
  "google-labs-code/stitch-skills": { zh: "从提示生成\n可迭代界面", en: "Generate interfaces\nready to iterate" },
  "figma/mcp-server-guide": { zh: "把 Figma 接入\nAgent 工具", en: "Connect Figma\nto agent tools" },
  "bergside/awesome-design-skills": { zh: "快速找到合适的\n设计能力", en: "Find the right\ndesign capability faster" },
  "gztchan/awesome-design": { zh: "把设计资源\n收进工具箱", en: "Put design resources\ninto your toolkit" },
  "magnus919/agent-skills": { zh: "把产品路径\n设计清楚", en: "Make product paths\nclearer" },
  "sergekostenchuk/ui-ux-agent-skill-system": { zh: "补齐真实产品\n界面状态", en: "Cover real product\ninterface states" },
  "content-designer/ux-writing-skill": { zh: "让界面文案\n更清楚", en: "Make interface copy\nclearer" },
  "Community-Access/accessibility-agents": { zh: "交付前完成\n无障碍审查", en: "Audit accessibility\nbefore shipping" },
  "skydashnet/material-design-3-ui-skill": { zh: "按 Material 3\n建立界面", en: "Design with\nMaterial 3" },
  "wenkang-deepblue/frontend-design": { zh: "把设计微调\n交回 Agent", en: "Send design tweaks\nback to agents" },
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
  "lewislulu/html-ppt-skill": { zh: "把 HTML 变成\n演示舞台", en: "Turn HTML into\na presentation stage" },
  "MiniMax-AI/skills": { zh: "把会议大纲快速\n变成 PPT 草稿", en: "Turn meeting outlines\ninto PPT drafts" },
  "ningzimu/codex-ppt": { zh: "用海报级画面\n制造视觉冲击", en: "Create visual impact\nwith poster-like slides" },
  "ningzimu/image-to-editable-ppt-skill": { zh: "把图片重建成\n可编辑 PPT", en: "Rebuild images into\neditable decks" },
  "ryanbbrown/revealjs-skill": { zh: "用代码和 Markdown\n讲清技术方案", en: "Explain technical ideas\nwith code and Markdown" }
};

function getSkillVisual(item) {
  return skillVisuals[item.slug]?.[currentLanguage] || getCategoryVisual(item.category);
}

const skillOfficialPages = {
  "greensock/GSAP": "https://gsap.com",
  "motiondivision/motion": "https://motion.dev",
  "radix-ui/primitives": "https://www.radix-ui.com/primitives",
  "shadcn-ui/ui": "https://github.com/shadcn-ui/ui",
  "wshobson/agents-tailwind-design-system": "https://github.com/wshobson/agents/tree/main/plugins/frontend-mobile-development/skills/tailwind-design-system",
  "tailwindlabs/headlessui": "https://github.com/tailwindlabs/headlessui",
  "twostraws/SwiftUI-Agent-Skill": "https://github.com/twostraws/SwiftUI-Agent-Skill",
  "gztchan/awesome-design": "https://github.com/gztchan/awesome-design",
  "nexu-io/open-design": "https://github.com/nexu-io/open-design",
  "vercel-labs/design-systems-to-agent-skills": "https://github.com/vercel-labs/design-systems-to-agent-skills",
  "Subhan-code/Amicro--Micro-transitions-": "https://github.com/Subhan-code/Amicro--Micro-transitions-",
  "lewislulu/html-ppt-skill": "https://github.com/lewislulu/html-ppt-skill",
  "weareoxd/design-skill-generator": "https://github.com/weareoxd/design-skill-generator",
  "figma/mcp-server-guide": "https://www.figma.com/mcp-catalog/",
  "nolly-studio/agent-skills": "https://github.com/nolly-studio/agent-skills",
  "magnus919/agent-skills": "https://github.com/magnus919/agent-skills",
  "sergekostenchuk/ui-ux-agent-skill-system": "https://github.com/sergekostenchuk/ui-ux-agent-skill-system",
  "content-designer/ux-writing-skill": "https://github.com/content-designer/ux-writing-skill",
  "Community-Access/accessibility-agents": "https://github.com/Community-Access/accessibility-agents",
  "skydashnet/material-design-3-ui-skill": "https://github.com/skydashnet/material-design-3-ui-skill",
  "wenkang-deepblue/frontend-design": "https://github.com/wenkang-deepblue/frontend-design",
  "ningzimu/image-to-editable-ppt-skill": "https://github.com/ningzimu/image-to-editable-ppt-skill",
  "lucide-icons/lucide": "https://lucide.dev/icons",
  "ahujasid/blender-mcp": "https://github.com/ahujasid/blender-mcp",
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
  if (item.coverImage) return item.coverImage;
  const filename = item.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `./assets/skills/repositories/${filename}.jpg`;
}

function getSkillCoverMarkup(item) {
  const poster = getSkillCover(item);
  if (item.coverType === "video" && item.coverSrc) {
    const posterAttribute = item.coverImage ? ` poster="${escapeHtml(item.coverImage)}"` : "";
    return `<video class="repo-cover-image" src="${escapeHtml(item.coverSrc)}"${posterAttribute} autoplay muted loop playsinline preload="metadata" aria-hidden="true"></video>`;
  }
  return `<img class="repo-cover-image" src="${escapeHtml(poster)}" alt="" loading="lazy" decoding="async">`;
}

function getWebsitePreviewPath(item) {
  if (item.previewImage) return item.previewImage;
  const filename = item.domain.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `./assets/skills/web/${filename}.jpg`;
}

function getWebsitePreviewMarkup(item) {
  const poster = getWebsitePreviewPath(item);
  if (item.previewType === "video" && item.previewSrc) {
    const posterAttribute = item.previewImage ? ` poster="${escapeHtml(item.previewImage)}"` : "";
    return `<video src="${escapeHtml(item.previewSrc)}"${posterAttribute} autoplay muted loop playsinline preload="metadata" aria-label="${escapeHtml(item.name)} ${currentLanguage === "en" ? "official website video preview" : "官网视频预览"}" data-web-preview></video>`;
  }
  return `<img src="${escapeHtml(poster)}" alt="${escapeHtml(item.name)} ${currentLanguage === "en" ? "official website preview" : "官网页面预览"}" loading="lazy" decoding="async" data-web-preview>`;
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

function skillIcon(name, className = "") {
  const safeName = String(name).replace(/[^a-z-]/g, "");
  const safeClassName = String(className).replace(/[^a-z0-9 _-]/gi, "").trim();
  return `<svg class="skills-icon${safeClassName ? ` ${safeClassName}` : ""}" aria-hidden="true"><use href="#ondesign-icon-${safeName}"></use></svg>`;
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
  return items.sort((a, b) => Number(hasReplacementCover(b)) - Number(hasReplacementCover(a)));
}

function hasReplacementCover(item) {
  return Boolean(item.coverImage || (item.coverType === "video" && item.coverSrc));
}

function getFilteredWebsites() {
  const query = searchQuery.trim().toLowerCase();
  return designReferenceWebsites.filter((item) => {
    const categoryMatch = activeCategories.size === 0 || activeCategories.has(item.group);
    const description = currentLanguage === "en" ? item.descriptionEn : item.descriptionZh;
    const focus = currentLanguage === "en" ? item.focusEn : item.focusZh;
    const searchMatch = !query || [item.name, item.domain, item.group, description, focus].some((value) => String(value || "").toLowerCase().includes(query));
    const sourceMatch = !activeSourceOnly || item.openSource;
    return categoryMatch && searchMatch && sourceMatch;
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
    }).join("")}</div></section><section class="facet-group"><h3><span>${currentLanguage === "en" ? "Source code" : "源代码"}</span><b>${designReferenceWebsites.filter((item) => item.openSource).length}</b></h3><div class="repo-subfilters"><button class="repo-subfilter${activeSourceOnly ? " is-active" : ""}" type="button" aria-pressed="${activeSourceOnly}" data-source-filter="OPEN"><span>${currentLanguage === "en" ? "With source code" : "有源代码"}</span><b>${designReferenceWebsites.filter((item) => item.openSource).length}</b></button></div></section>`;
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
    <h3>${escapeHtml(item.title)}<span aria-label="Curated skill">${skillIcon("badge-check")}</span></h3>
    <p class="inspector-copy">${escapeHtml(currentLanguage === "en" ? (item.description || item.fallback) : item.fallback)}</p>
    <dl><div><dt>${currentLanguage === "en" ? "Best for" : "适合用于"}</dt><dd>${escapeHtml(item.focus)}</dd></div><div><dt>${currentLanguage === "en" ? "Repository" : "来源仓库"}</dt><dd>${escapeHtml(item.slug)}</dd></div></dl>
    <div class="inspector-command"><code>git clone https://github.com/${escapeHtml(item.slug)}.git ~/.codex/skills/${escapeHtml(repoName)}</code><button type="button" data-copy-invoke="${item.slug}">${copyLabel}</button></div>
    <a class="inspector-link" href="https://github.com/${item.slug}" target="_blank" rel="noreferrer" data-repo-link="${item.slug}"><span>${currentLanguage === "en" ? "Open repository" : "打开仓库"}</span>${skillIcon("external-link")}</a>
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
  if (heroUpdateCount) heroUpdateCount.textContent = isWebMode ? "+12" : "+8";
  if (heroUpdateLabel) heroUpdateLabel.textContent = isWebMode
    ? (currentLanguage === "en" ? "new Web resources" : "新增 Web 资源")
    : (currentLanguage === "en" ? "presentation Skills" : "新增演示 Skill");
  if (skillsHeroBody) skillsHeroBody.textContent = isWebMode
    ? (currentLanguage === "en" ? "A focused reference directory for finding visual direction, studying product UI, refining interface details and exploring creative web work." : "这是一份按设计用途整理的网站目录。可以用它寻找整体方向、拆解产品 UI、研究局部细节，或发现更有创意的网页表达。")
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
  syncDirectoryStateToUrl();
  if (activeDirectoryMode === "WEB") {
    renderDesignReferences();
    return;
  }
  const items = getFilteredRepositories();
  repoList.classList.remove("is-web-list");
  repoList.innerHTML = items.map((item, index) => `
    <article class="repo-row repo-card-${index % 6}" data-category="${escapeHtml(item.category)}">
      <a class="repo-scene" data-category="${escapeHtml(item.category)}" href="${escapeHtml(buildSkillDetailHref(item.slug))}" aria-label="${currentLanguage === "en" ? "View skill details" : "查看 Skill 详情"}: ${escapeHtml(item.title)}">
        <span class="repo-browser-bar" aria-hidden="true"><i></i><i></i><i></i><b>${escapeHtml(getSkillBrowserLabel(item))}</b><em>${skillIcon("external-link")}</em></span>
        ${getSkillCoverMarkup(item)}
        <span class="repo-cover-shade" aria-hidden="true"></span>
        <span class="repo-index">${String(index + 1).padStart(2, "0")}</span>
        <span class="repo-cover-caption"><strong>${escapeHtml(getSkillVisual(item))}</strong><small>${escapeHtml(getCategoryLabel(item.category))}</small></span>
      </a>
      <div class="repo-card-body">
        <div class="repo-main">
          <p class="repo-category">${escapeHtml(getCategoryLabel(item.category))}</p>
          <a href="${escapeHtml(buildSkillDetailHref(item.slug))}" data-skill-detail="${item.slug}">${escapeHtml(item.title)}<span class="repo-verified" aria-label="Curated skill">${skillIcon("badge-check")}</span></a>
          <p class="repo-description">${escapeHtml(currentLanguage === "en" ? (item.description || item.fallback) : item.fallback)}</p>
          <p class="repo-focus">${escapeHtml(item.focus)}</p>
        </div>
        <div class="repo-footer"><div class="repo-stats"><span title="GitHub Stars"><i aria-hidden="true">${skillIcon("star")}</i><small>GitHub Stars</small><b>${escapeHtml(item.starsLabel || formatNumber(item.stars))}</b></span><small>${formatDate(item.updatedAt)}</small></div><div class="repo-actions"><button class="repo-copy-btn" type="button" data-copy-invoke="${item.slug}" title="${currentLanguage === "en" ? "Copy the Codex clone command" : "复制 Codex 调用命令"}"><span>${currentLanguage === "en" ? "Copy command" : "复制调用"}</span><b aria-hidden="true">${skillIcon("plus")}</b></button></div></div>
      </div>
    </article>
  `).join("");
  repoList.querySelectorAll("[data-skill-detail]").forEach((link) => link.addEventListener("click", () => track("skill_detail_open", { repository: link.dataset.skillDetail })));
  repoList.querySelectorAll("[data-copy-invoke]").forEach((btn) => btn.addEventListener("click", () => copyCloneCommand(btn)));
  repoList.querySelectorAll(".repo-cover-image").forEach((cover) => {
    cover.addEventListener("error", () => {
      cover.closest(".repo-row")?.classList.add("is-cover-missing");
      cover.remove();
    }, { once: true });
    if (cover.tagName === "VIDEO") {
      cover.muted = true;
      cover.play?.().catch(() => {});
    }
  });
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
            <a class="web-reference-visual" href="${site.url}" target="_blank" rel="noreferrer" data-design-reference="${escapeHtml(site.domain)}" aria-label="${escapeHtml(site.name)}" style="--preview-ratio:${escapeHtml(site.previewRatio || "3 / 2")}">
              ${getWebsitePreviewMarkup(site)}
              <span class="web-reference-top"><span>${escapeHtml(currentLanguage === "en" ? group.en : group.zh)}</span><b>${String(index + 1).padStart(2, "0")}</b></span>
            </a>
            <div class="web-reference-body">
              <a class="web-reference-title" href="${site.url}" target="_blank" rel="noreferrer" data-design-reference="${escapeHtml(site.domain)}"><span>${escapeHtml(site.name)}</span><i aria-hidden="true">${skillIcon("external-link")}</i></a>
              <p class="web-reference-domain">${escapeHtml(site.domain)}${site.openSource ? `<span class="web-source-badge">${currentLanguage === "en" ? "Source code" : "有源代码"}</span>` : ""}</p>
              <p class="web-reference-description">${escapeHtml(currentLanguage === "en" ? site.descriptionEn : site.descriptionZh)}</p>
              <footer><span>${currentLanguage === "en" ? "Best for" : "适合用于"}</span><strong>${escapeHtml(currentLanguage === "en" ? site.focusEn : site.focusZh)}</strong></footer>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `).join("");
  repoList.querySelectorAll("[data-web-preview]").forEach((preview) => {
    preview.addEventListener("error", () => {
      preview.closest(".web-reference-card")?.classList.add("is-preview-missing");
    }, { once: true });
    if (preview.tagName === "VIDEO") {
      preview.muted = true;
      preview.play?.().catch(() => {});
    }
  });
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
  document.title = currentLanguage === "en" ? "Design Skill Directory · ONDesign" : "设计 Skill 观察 · ONDesign";
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
  activeSourceOnly = false;
  activeSort = "CURATED";
  searchQuery = "";
  renderRepositories();
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-source-filter]");
  if (!button) return;
  activeSourceOnly = !activeSourceOnly;
  track(activeDirectoryMode === "WEB" ? "source_filter_select" : "skill_filter_select", { sourceOnly: activeSourceOnly });
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
  activeSourceOnly = false;
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
