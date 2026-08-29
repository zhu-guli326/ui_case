export const foundationEntries = [
  {
    "id": "app-shell",
    "name": "应用框架",
    "en": "App Shell",
    "category": "foundation",
    "level": "基础",
    "tags": [
      "结构",
      "layout-chrome",
      "响应式"
    ],
    "ask": "这个产品的导航和内容区要一直在，页面之间怎么套起来？",
    "definition": "应用框架是持续存在的外层结构，把导航、内容区、状态栏和安全区组织成一个可复用的页面骨架。",
    "role": "它让用户在不同页面之间移动时，仍然知道自己在哪里，也让各页面共享同一套空间和操作规则。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "应用框架的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "顶部应用栏",
        "品牌、标题、搜索或页面级操作"
      ],
      [
        "主内容区",
        "当前任务和可滚动内容"
      ],
      [
        "导航入口",
        "桌面侧栏或移动底部标签栏"
      ],
      [
        "状态层",
        "加载、错误、弹窗和全局提示"
      ]
    ],
    "variants": [
      [
        "桌面工作台",
        "侧栏 + 顶部工具栏，适合高密度任务"
      ],
      [
        "移动 App",
        "顶部安全区 + 内容 + 底部标签栏"
      ],
      [
        "沉浸式详情",
        "弱化导航，让媒体或对象成为焦点"
      ]
    ],
    "states": [
      [
        "默认",
        "导航和内容都可见，当前入口有选中态"
      ],
      [
        "窄屏",
        "侧栏收起，导航改成横向或底部入口"
      ],
      [
        "加载",
        "保留框架尺寸，用骨架替换内容"
      ]
    ],
    "useWhen": [
      "产品有多个页面或多个主要任务",
      "需要统一导航、主题和响应式规则"
    ],
    "avoidWhen": [
      "只有一张独立海报或一次性活动页",
      "页面内容本身就是完整的沉浸式体验"
    ],
    "confusedWith": "应用框架不是某一条导航栏；导航只是框架中的一个部件。",
    "codeUI": [
      "语义布局、路由出口、导航、safe-area、焦点顺序"
    ],
    "media": [
      "照片、产品图、复杂插画放在内容区，不放进框架位图"
    ],
    "prompt": "请把产品做成可复用的 App Shell：桌面端使用左侧导航和顶部工具栏，移动端改成顶部安全区与底部标签栏；内容区可滚动，导航保持当前选中态，加载和错误状态不能改变外层尺寸。",
    "related": [
      "top-nav",
      "sidebar",
      "bottom-tabs",
      "responsive"
    ],
    "source": "https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/"
  },
  {
    "id": "header",
    "name": "页头",
    "en": "Header",
    "category": "foundation",
    "level": "基础",
    "tags": [
      "结构",
      "品牌",
      "导航"
    ],
    "ask": "顶部放 logo、页面名和几个入口，用户一眼知道自己在哪。",
    "definition": "页头是页面最上方的品牌与上下文区域，负责建立身份、层级和全局入口。",
    "role": "先回答‘这是哪个产品/页面’，再把最常用的全局操作放在用户预期的位置。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "页头的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "品牌标识",
        "产品名或 logo，链接回起点"
      ],
      [
        "页面上下文",
        "当前页面标题、面包屑或返回"
      ],
      [
        "全局操作",
        "搜索、主题、账户、更多"
      ],
      [
        "响应式折叠",
        "窄屏时合并成菜单或图标按钮"
      ]
    ],
    "variants": [
      [
        "品牌页头",
        "突出品牌和一级导航"
      ],
      [
        "应用页头",
        "突出页面标题与返回/更多"
      ],
      [
        "透明页头",
        "叠在首屏媒体上，需确保对比度"
      ]
    ],
    "states": [
      [
        "当前页",
        "当前入口清晰标记"
      ],
      [
        "滚动后",
        "可吸顶或缩短高度"
      ],
      [
        "菜单打开",
        "焦点进入菜单，背景层级明确"
      ]
    ],
    "useWhen": [
      "网站或产品需要持续的身份与全局入口",
      "需要和首屏或内容区形成稳定层级"
    ],
    "avoidWhen": [
      "单一任务的极简确认页",
      "页头会抢走对象详情的视觉焦点"
    ],
    "confusedWith": "页头偏品牌和上下文；顶部导航偏链接组织，二者可以组合但职责不同。",
    "codeUI": [
      "header、nav、真实文字、SVG 图标、键盘焦点"
    ],
    "media": [
      "品牌摄影或插画可作为背景，logo 和导航文字必须用代码"
    ],
    "prompt": "请设计一个轻量页头：左侧品牌名，中间显示当前页面上下文，右侧提供搜索与账户入口；图标使用统一 SVG，所有按钮有 aria-label，移动端把次要入口收进菜单。",
    "related": [
      "top-nav",
      "breadcrumbs",
      "hero",
      "app-shell"
    ],
    "source": "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header"
  },
  {
    "id": "hero",
    "name": "首屏",
    "en": "Hero",
    "category": "foundation",
    "level": "基础",
    "tags": [
      "官网区块",
      "外部图片",
      "首屏"
    ],
    "ask": "网站最上面要有大图和大字，让人马上知道我们是做什么的。",
    "definition": "首屏是页面第一个主要视觉区，用最少的信息建立主题、价值和下一步行动。",
    "role": "首屏不是把所有内容塞在最上面，而是让用户在几秒内完成理解并知道下一步。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "首屏的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "主题标题",
        "一句话说清产品或页面价值"
      ],
      [
        "支持说明",
        "补足对象、场景或可信度"
      ],
      [
        "主行动",
        "一个清晰的 CTA，避免多个同权重按钮"
      ],
      [
        "主视觉",
        "照片、插画或产品场景，预留文案安全区"
      ]
    ],
    "variants": [
      [
        "媒体主导",
        "图片或视频占大面积，适合品牌/产品"
      ],
      [
        "文字主导",
        "窄栏标题和 CTA，适合工具入口"
      ],
      [
        "双栏拆分",
        "桌面左右并置，移动端上下堆叠"
      ]
    ],
    "states": [
      [
        "默认",
        "标题、媒体和 CTA 首屏可见"
      ],
      [
        "窄屏",
        "主视觉裁切保留主体，CTA 不被折叠"
      ],
      [
        "减弱动效",
        "移除自动播放和滚动依赖"
      ]
    ],
    "useWhen": [
      "需要在首屏建立认知和行动",
      "有足够强的图片、插画或产品展示"
    ],
    "avoidWhen": [
      "用户已经进入高频工作流，不需要品牌叙事",
      "复杂数据需要立即可比对时"
    ],
    "confusedWith": "首屏是一个页面区段；主视觉只是其中的媒体或视觉主体。",
    "codeUI": [
      "标题、正文、CTA、布局、遮罩、响应式裁切"
    ],
    "media": [
      "摄影、插画、复杂材质和产品场景，禁止烘焙文字与 UI glyph"
    ],
    "prompt": "请做一个有明确首屏层级的产品主页：标题和一句说明位于左侧，右侧使用一张无文字、无 logo 的真实场景图；只保留一个主 CTA，移动端改为上下结构并保留下一段内容的可见线索。",
    "related": [
      "cta",
      "header",
      "responsive"
    ],
    "source": "https://www.nngroup.com/articles/hero-images/"
  },
  {
    "id": "cta",
    "name": "主按钮 / CTA",
    "en": "Call to Action",
    "category": "foundation",
    "level": "基础",
    "tags": [
      "行动",
      "code-control",
      "转化"
    ],
    "ask": "给我一个最明显的按钮，用户点它就能开始下一步。",
    "definition": "CTA 是页面当前最希望用户完成的主要行动，通常由一个高优先级按钮承载。",
    "role": "把理解转成行动，同时通过文案和层级告诉用户点击后会发生什么。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "主行动 CTA 的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "动作文案",
        "使用开始、保存、继续等动词"
      ],
      [
        "视觉层级",
        "与次要按钮形成明显对比"
      ],
      [
        "反馈状态",
        "按下、加载、成功、失败"
      ],
      [
        "触摸区域",
        "至少 44×44px，文字不被挤压"
      ]
    ],
    "variants": [
      [
        "实心主按钮",
        "高确定性、高优先级动作"
      ],
      [
        "描边次按钮",
        "可选或返回动作"
      ],
      [
        "危险按钮",
        "删除、退出等需要额外确认的动作"
      ]
    ],
    "states": [
      [
        "默认/悬停",
        "颜色或阴影变化，不改变布局"
      ],
      [
        "加载",
        "保留按钮宽度，显示进行中"
      ],
      [
        "成功/错误",
        "给出短反馈与恢复路径"
      ]
    ],
    "useWhen": [
      "页面存在一个明确的下一步",
      "用户需要提交、开始、保存或购买"
    ],
    "avoidWhen": [
      "页面有多个互斥主任务",
      "按钮文案无法说明点击结果"
    ],
    "confusedWith": "CTA 是行动优先级概念，不等同于所有按钮；次级动作也应保留合适层级。",
    "codeUI": [
      "button、状态、键盘焦点、aria-busy、禁用逻辑"
    ],
    "media": [
      "按钮和文字由代码渲染；外部图片只负责情绪和内容"
    ],
    "prompt": "请为页面设置一个单一主 CTA，文案使用明确动词；提供默认、hover、focus、loading、success、error 状态，按钮保持稳定尺寸并满足 44px 触摸目标。",
    "related": [
      "button",
      "hero",
      "toast"
    ],
    "source": "https://www.w3.org/WAI/ARIA/apg/patterns/button/"
  },
  {
    "id": "responsive",
    "name": "响应式设计",
    "en": "Responsive Design",
    "category": "foundation",
    "level": "进阶",
    "tags": [
      "layout",
      "移动端",
      "可用性"
    ],
    "ask": "桌面三列到手机要变一列，内容别重叠也别横向滚。",
    "definition": "响应式设计让同一套内容根据视口和输入方式调整布局、尺寸、顺序与交互。",
    "role": "不是简单缩小桌面页面，而是保留任务优先级并在窄屏重新组织空间。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "响应式设计的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "断点策略",
        "按内容需要而不是设备名称决定"
      ],
      [
        "流式容器",
        "使用 minmax、clamp、max-width"
      ],
      [
        "重排规则",
        "列数、顺序和导航方式变化"
      ],
      [
        "触摸目标",
        "移动端操作区域至少 44px"
      ]
    ],
    "variants": [
      [
        "流式缩放",
        "字号与间距在范围内变化"
      ],
      [
        "结构重排",
        "桌面侧栏改成底部或抽屉"
      ],
      [
        "内容裁剪",
        "保留主体，隐藏非关键元信息"
      ]
    ],
    "states": [
      [
        "桌面",
        "多栏与辅助信息可见"
      ],
      [
        "平板",
        "减少列数和侧栏宽度"
      ],
      [
        "手机",
        "单列优先，避免 hover 依赖"
      ]
    ],
    "useWhen": [
      "用户会在不同宽度设备上使用",
      "内容和操作需要持续可读可点"
    ],
    "avoidWhen": [
      "固定尺寸展览/海报本身就是交付物",
      "只在单一嵌入容器中展示"
    ],
    "confusedWith": "响应式关注结构变化；自适应图片只是其中一个实现手段。",
    "codeUI": [
      "CSS Grid/Flex、container、picture、断点与可访问顺序"
    ],
    "media": [
      "必要时为移动端指定单独的外部裁切图，禁止只拉伸桌面图"
    ],
    "prompt": "请用内容驱动的响应式布局实现页面：桌面端使用两到三列，移动端改为单列；侧栏折叠为横向筛选或底部入口，所有标题、按钮和图片都不能溢出。",
    "related": [
      "app-shell",
      "card-grid",
      "typography"
    ],
    "source": "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design"
  }
];

export const foundationEnglish = {
  "app-shell": {
    "name": "App Shell",
    "level": "Foundation",
    "tags": [
      "Structure",
      "Layout chrome",
      "Responsive"
    ],
    "ask": "How do I keep the product navigation and content area consistent across pages?",
    "definition": "An app shell is the persistent outer structure that organizes navigation, content, status layers, and safe areas into a reusable page frame.",
    "role": "It preserves orientation as users move between pages and gives every screen the same spatial and interaction rules.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "News product app shell code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Top app bar",
        "Brand, title, search, and page actions"
      ],
      [
        "Main content",
        "The current task and scrollable content"
      ],
      [
        "Navigation",
        "A desktop sidebar or mobile bottom tabs"
      ],
      [
        "Status layer",
        "Loading, errors, dialogs, and global notices"
      ]
    ],
    "variants": [
      [
        "Desktop workspace",
        "Sidebar plus toolbar for dense tasks"
      ],
      [
        "Mobile app",
        "Top safe area, content, and bottom tabs"
      ],
      [
        "Immersive detail",
        "Reduced navigation so the object or media leads"
      ]
    ],
    "states": [
      [
        "Default",
        "Navigation and content are visible with a clear current item"
      ],
      [
        "Narrow",
        "The sidebar collapses into horizontal or bottom navigation"
      ],
      [
        "Loading",
        "The shell stays stable while content becomes a skeleton"
      ]
    ],
    "useWhen": [
      "A product has multiple pages or primary tasks",
      "Navigation, themes, and responsive behavior must stay consistent"
    ],
    "avoidWhen": [
      "The deliverable is one standalone poster or campaign page",
      "The content itself is a complete immersive experience"
    ],
    "confusedWith": "An app shell is not one navigation bar; navigation is only one part of the shell.",
    "codeUI": [
      "Semantic layout, route outlet, navigation, safe areas, and focus order"
    ],
    "media": [
      "Place photography, product images, and complex illustration inside the content area, not in a shell bitmap"
    ],
    "prompt": "Build the product as a reusable app shell: use a left navigation and top toolbar on desktop, then a top safe area and bottom tab bar on mobile. Keep the content scrollable, preserve the current navigation state, and prevent loading or errors from resizing the shell."
  },
  "header": {
    "name": "Header",
    "level": "Foundation",
    "tags": [
      "Structure",
      "Brand",
      "Navigation"
    ],
    "ask": "Put the logo, page name, and a few destinations at the top so users immediately know where they are.",
    "definition": "A header is the topmost brand and context region of a page. It establishes identity, hierarchy, and global entry points.",
    "role": "It first answers which product or page this is, then places common global actions where users expect them.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Recipe app header code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Brand identity",
        "Product name or logo linked to the starting point"
      ],
      [
        "Page context",
        "Current title, breadcrumb, or back action"
      ],
      [
        "Global actions",
        "Search, theme, account, and overflow"
      ],
      [
        "Responsive collapse",
        "Secondary actions become a menu or icon buttons"
      ]
    ],
    "variants": [
      [
        "Brand header",
        "Emphasizes identity and primary navigation"
      ],
      [
        "App header",
        "Emphasizes the page title, back, and overflow"
      ],
      [
        "Overlay header",
        "Sits on hero media and needs strong contrast"
      ]
    ],
    "states": [
      [
        "Current page",
        "The active destination is clearly marked"
      ],
      [
        "After scroll",
        "It can become sticky or reduce in height"
      ],
      [
        "Menu open",
        "Focus enters the menu and layering stays clear"
      ]
    ],
    "useWhen": [
      "A site needs persistent identity and global entry points",
      "The first section needs a stable hierarchy with the content"
    ],
    "avoidWhen": [
      "A minimal, single-task confirmation screen",
      "The header would compete with the detail object"
    ],
    "confusedWith": "A header owns brand and page context; top navigation owns link organization. They can be combined but have different responsibilities.",
    "codeUI": [
      "header, nav, real text, SVG icons, and keyboard focus"
    ],
    "media": [
      "Brand photography or illustration may sit behind it, but logo and navigation text stay in code"
    ],
    "prompt": "Design a lightweight header with the brand on the left, current page context in the middle, and search plus account actions on the right. Use consistent SVG icons, give every icon button an accessible name, and move secondary destinations into a mobile menu."
  },
  "hero": {
    "name": "Hero",
    "level": "Foundation",
    "tags": [
      "Website section",
      "External media",
      "First viewport"
    ],
    "ask": "Use a strong image and headline at the top so people immediately understand what we do.",
    "definition": "A hero is the first major visual section of a page. It establishes the subject, value, and next action with minimal information.",
    "role": "A hero should not contain everything. It should create understanding in seconds and make the next step obvious.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Fashion product hero code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Headline",
        "States the product or page value in one thought"
      ],
      [
        "Supporting copy",
        "Adds audience, context, or credibility"
      ],
      [
        "Primary action",
        "One clear CTA instead of several equal buttons"
      ],
      [
        "Hero media",
        "Photography, illustration, or product scene with a safe text area"
      ]
    ],
    "variants": [
      [
        "Media-led",
        "Large image or video for brands and products"
      ],
      [
        "Copy-led",
        "A narrow headline and CTA for tool entry points"
      ],
      [
        "Split layout",
        "Side by side on desktop and stacked on mobile"
      ]
    ],
    "states": [
      [
        "Default",
        "Headline, media, and CTA are visible in the first viewport"
      ],
      [
        "Narrow",
        "The crop preserves the subject and the CTA remains visible"
      ],
      [
        "Reduced motion",
        "Autoplay and scroll-dependent motion are removed"
      ]
    ],
    "useWhen": [
      "The page must establish understanding and action immediately",
      "There is strong photography, illustration, or product media"
    ],
    "avoidWhen": [
      "The user is already inside a frequent workflow",
      "Complex data must be compared immediately"
    ],
    "confusedWith": "A hero is a page section; hero media is only the visual asset inside it.",
    "codeUI": [
      "Headline, body copy, CTA, layout, overlay, and responsive crop"
    ],
    "media": [
      "Photography, illustration, rich material, and product scenes without baked-in text or UI glyphs"
    ],
    "prompt": "Create a clearly ranked product-page hero with a headline and one supporting sentence on the left and a text-free, logo-free real-world image on the right. Keep one primary CTA, stack the layout on mobile, and leave a visible hint of the next section."
  },
  "cta": {
    "name": "Call to Action",
    "level": "Foundation",
    "tags": [
      "Action",
      "Code control",
      "Conversion"
    ],
    "ask": "Give me one prominent button that starts the user's next step.",
    "definition": "A CTA is the action the page most wants the user to complete, usually represented by one high-priority button.",
    "role": "It turns understanding into action and uses wording plus visual priority to set the expectation for what happens next.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Primary action on a recipe detail page",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Action label",
        "Uses verbs such as Start, Save, or Continue"
      ],
      [
        "Visual priority",
        "Clearly differs from secondary actions"
      ],
      [
        "Feedback",
        "Pressed, loading, success, and error states"
      ],
      [
        "Touch target",
        "At least 44 by 44 pixels without cramped text"
      ]
    ],
    "variants": [
      [
        "Filled primary",
        "High-certainty, high-priority action"
      ],
      [
        "Outlined secondary",
        "Optional, alternate, or back action"
      ],
      [
        "Destructive",
        "Delete or exit actions that need confirmation"
      ]
    ],
    "states": [
      [
        "Default and hover",
        "Color or shadow changes without layout shift"
      ],
      [
        "Loading",
        "Width stays fixed while progress is shown"
      ],
      [
        "Success and error",
        "Brief feedback includes a recovery path"
      ]
    ],
    "useWhen": [
      "The page has one clear next step",
      "The user needs to submit, start, save, or purchase"
    ],
    "avoidWhen": [
      "The page contains several mutually exclusive primary tasks",
      "The label cannot explain the result of clicking"
    ],
    "confusedWith": "CTA describes action priority, not every button. Secondary actions still need an appropriate hierarchy.",
    "codeUI": [
      "button, states, keyboard focus, aria-busy, and disabled logic"
    ],
    "media": [
      "Buttons and labels stay code-rendered; external images carry mood and content only"
    ],
    "prompt": "Give the page one primary CTA with a clear action verb. Include default, hover, focus, loading, success, and error states; keep its dimensions stable and meet a 44px touch target."
  },
  "responsive": {
    "name": "Responsive Design",
    "level": "Advanced",
    "tags": [
      "Layout",
      "Mobile",
      "Usability"
    ],
    "ask": "Turn three desktop columns into one on mobile without overlap or horizontal scrolling.",
    "definition": "Responsive design adapts layout, size, order, and interaction to the available viewport and input method while keeping the same content.",
    "role": "It is not a scaled-down desktop page; it preserves task priority and reorganizes space for narrower contexts.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Responsive news feed code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Breakpoint strategy",
        "Responds to content needs instead of device names"
      ],
      [
        "Fluid container",
        "Uses minmax, clamp, and max-width"
      ],
      [
        "Reflow rules",
        "Changes columns, order, and navigation mode"
      ],
      [
        "Touch targets",
        "Keeps mobile actions at least 44px"
      ]
    ],
    "variants": [
      [
        "Fluid scaling",
        "Type and spacing adapt within limits"
      ],
      [
        "Structural reflow",
        "A desktop sidebar becomes a drawer or bottom entry"
      ],
      [
        "Content reduction",
        "Keeps the subject and removes nonessential metadata"
      ]
    ],
    "states": [
      [
        "Desktop",
        "Multiple columns and supporting information are visible"
      ],
      [
        "Tablet",
        "Column count and sidebar width decrease"
      ],
      [
        "Phone",
        "One column leads and interaction does not depend on hover"
      ]
    ],
    "useWhen": [
      "People use the product at different widths",
      "Content and actions must stay readable and operable"
    ],
    "avoidWhen": [
      "A fixed-size exhibition or poster is the actual deliverable",
      "The UI only appears in one fixed embed"
    ],
    "confusedWith": "Responsive design changes structure; responsive images are only one implementation technique.",
    "codeUI": [
      "CSS Grid and Flexbox, containers, picture, breakpoints, and accessible source order"
    ],
    "media": [
      "Use a separate external mobile crop when needed; never stretch a desktop image"
    ],
    "prompt": "Implement a content-driven responsive layout with two or three columns on desktop and one column on mobile. Collapse the sidebar into a horizontal filter or bottom entry, and prevent every heading, button, and image from overflowing."
  }
};
