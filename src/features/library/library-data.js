export const previewImageSets = Object.freeze({
  museum: [
    { src: "./assets/cases/museum-app/home-screen.png", label: { zh: "首页", en: "Home" } },
    { src: "./assets/cases/museum-app/exhibitions-screen.png", label: { zh: "展览列表", en: "Exhibitions" } },
    { src: "./assets/cases/museum-app/detail-screen.png", label: { zh: "展览详情", en: "Exhibition detail" } }
  ],
  fashion: [
    { src: "./assets/cases/fashion-shopping-app/hero-screen.png", label: { zh: "品牌首页", en: "Brand home" } },
    { src: "./assets/cases/fashion-shopping-app/catalog-screen.png", label: { zh: "商品目录", en: "Catalog" } },
    { src: "./assets/cases/fashion-shopping-app/favorites-screen.png", label: { zh: "收藏页", en: "Favorites" } }
  ],
  fufu: [{ src: "./demo/fufu-bakery/screenshots/library-preview-2x.png", label: { zh: "烘焙首页", en: "Bakery home" } }],
  organique: [{ src: "./demo/organique-food/screenshots/library-preview-2x.png", label: { zh: "选择餐食", en: "Choose meals" } }],
  "plate-play": [{ src: "./demo/plate-play/screenshots/library-preview-2x.png", label: { zh: "食谱首页", en: "Recipes home" } }],
  fithub: [{ src: "./demo/fithub/screenshots/library-preview-2x.png", label: { zh: "训练发现", en: "Discover" } }],
  "still-form": [{ src: "./demo/still-form/screenshots/library-preview-2x.png", label: { zh: "系列目录", en: "Collection" } }],
  news: [
    { src: "./assets/cases/news-app/headlines-screen.png", label: { zh: "头条页", en: "Headlines" } },
    { src: "./assets/cases/news-app/feed-screen.png", label: { zh: "新闻流", en: "News feed" } },
    { src: "./assets/cases/news-app/discover-screen.png", label: { zh: "发现页", en: "Discover" } }
  ],
  "signal-grid": [{ src: "./demo/signal-grid/screenshots/library-preview-2x.png", label: { zh: "扫描页", en: "Scan" } }],
  "volt-route": [{ src: "./demo/volt-route/screenshots/library-preview-2x.png", label: { zh: "车辆状态", en: "Vehicle status" } }],
  moe: [{ src: "./demo/moe-habits/screenshots/library-preview-2x.png", label: { zh: "习惯首页", en: "Habits home" } }],
  moodly: [{ src: "./demo/moodly-health/screenshots/library-preview-2x.png", label: { zh: "情绪签到", en: "Mood check-in" } }],
  reflect: [{ src: "./demo/reflect-journal/screenshots/library-preview-2x.png", label: { zh: "日记首页", en: "Journal home" } }],
  mimo: [{ src: "./demo/mimo-activities/screenshots/library-preview-2x.png", label: { zh: "日程轮播", en: "Schedule carousel" } }]
});

export const canonicalCardScreens = Object.freeze({
  "relay-music": "./demo/relay-music/screenshots/library-preview-2x.png",
  "signal-grid": "./demo/signal-grid/screenshots/library-preview-2x.png",
  mimo: "./demo/mimo-activities/screenshots/library-preview-2x.png"
});

export const fittedCardPreviewIds = new Set(["museum", "fashion", "news"]);
export const featuredCaseOrder = Object.freeze(["museum", "news", "notebook"]);

export const libraryCopy = Object.freeze({
  zh: {
    modes: { image: "效果图", video: "Demo 视频", live: "可点击 Demo" },
    categories: { all: "全部案例", culture: "文化内容", commerce: "零售电商", editorial: "新闻阅读", travel: "旅行体验", creative: "创意工具", wellness: "健康陪伴" },
    title: "image2 UI 风格案例库", description: "image2 UI 风格案例库。", skip: "跳到案例列表", sidebarLabel: "想看哪一类？", localDemo: "本地演示", realCases: (count) => `${count} 个真实 UI 案例`, allSkills: "全部浏览", skills: [["video-shotcraft", "视频与镜头"], ["impeccable", "设计质量"], ["taste-skill", "设计品味"], ["GSAP", "动效系统"]], guides: [["使用指南", "从选择到交付"], ["项目原理", "Image2 UI"]], author: "作者动态", profile: "查看主页",
    heroTitle: "看看这些，\n再决定你想做成什么样。", heroIntro: "从真实案例开始找方向。看界面、试 Demo，再把喜欢的感觉带进你的设计。", heroAuthor: "作者主页", cases: "案例", styles: "风格", search: "搜索案例名称、使用场景或风格...", featured: "案例", searchResults: "搜索结果", startVisual: "从一个喜欢的界面开始。", searchTitle: "匹配的界面方向", count: (count) => `${count} 个案例`, empty: "没有找到匹配的案例。",
    imagePreview: "效果图预览", video: "视频", clickable: "可点击", details: "查看要点", copyConfig: "复制配置", applyProject: "用这个风格", localReference: "本地参考图", styleKeywords: "风格关键词", brands: "适用风格档案", openDetails: "查看案例详情", openPreview: "打开预览", unavailable: "效果图不可用",
    previous: "上一张效果图", next: "下一张效果图", loadDemo: "正在加载可点击 Demo...", timeout: "Demo 加载超时，请重试或在新窗口打开。", failed: "Demo 加载失败，请重试或使用下方链接在新窗口打开。", openLive: "新窗口打开可点击 Demo", retry: "重试", previewTitle: "案例预览", previewType: "预览方式", play: "播放视频", pause: "暂停视频", progress: "视频进度", fullscreen: "全屏查看", exitFullscreen: "退出全屏",
    facts: ["画面色彩", "页面节奏", "参考方向", "适用场景"], recipe: ["图片", "排版", "组件", "动效"], brandProfiles: "适用风格档案", componentLibrary: "另选品牌组件", copyFull: "复制图片与提示词配置", viewImage: "查看效果图", playVideo: "播放 Demo 视频", openDemo: "打开可点击 Demo", copied: "已复制", generated: "已生成"
  },
  en: {
    modes: { image: "Screens", video: "Demo video", live: "Interactive demo" },
    categories: { all: "All cases", culture: "Culture", commerce: "Commerce", editorial: "Editorial", travel: "Travel", creative: "Creative tools", wellness: "Wellness" },
    title: "image2 UI Style Library", description: "A visual style library of image2 UI cases.", skip: "Skip to case list", sidebarLabel: "What do you want to see?", localDemo: "Local demos", realCases: (count) => `${count} real UI cases`, allSkills: "Browse all", skills: [["video-shotcraft", "Video & shot craft"], ["impeccable", "Design quality"], ["taste-skill", "Design taste"], ["GSAP", "Motion system"]], guides: [["How to use", "From selection to delivery"], ["Principles", "Image2 UI"]], author: "Creator", profile: "View profile",
    heroTitle: "Take a look.\nThen decide what you want to make.", heroIntro: "Start with real cases. Explore the screens, try the demos, and bring the direction you like into your own design.", heroAuthor: "Creator profiles", cases: "Cases", styles: "Styles", search: "Search by case, use case, or visual style...", featured: "Cases", searchResults: "Search results", startVisual: "Start with an interface you like.", searchTitle: "Matching interface directions", count: (count) => `${count} cases`, empty: "No matching cases found.",
    imagePreview: "Screen preview", video: "Video", clickable: "Interactive", details: "View notes", copyConfig: "Copy config", applyProject: "Use this style", localReference: "Local reference", styleKeywords: "Style keywords", brands: "Compatible style profiles", openDetails: "View case details", openPreview: "Open preview", unavailable: "Screen unavailable",
    previous: "Previous screen", next: "Next screen", loadDemo: "Loading interactive demo...", timeout: "The demo timed out. Retry or open it in a new window.", failed: "The demo failed to load. Retry or use the link below to open it in a new window.", openLive: "Open interactive demo in a new window", retry: "Retry", previewTitle: "Case preview", previewType: "Preview type", play: "Play video", pause: "Pause video", progress: "Video progress", fullscreen: "View full screen", exitFullscreen: "Exit full screen",
    facts: ["Palette", "Page rhythm", "Reference direction", "Best for"], recipe: ["Image", "Typography", "Components", "Motion"], brandProfiles: "Compatible style profiles", componentLibrary: "Choose brand components", copyFull: "Copy image and prompt config", viewImage: "View screens", playVideo: "Play demo video", openDemo: "Open interactive demo", copied: "Copied", generated: "Generated"
  }
});

export const infoPanels = {
  guide: {
    eyebrow: "IMAGE2 UI / GUIDE",
    title: "使用指南",
    intro: "从真实参考开始，把风格选择、图片资产与可点击界面连成一条可复用的工作流。",
    steps: [
      ["选择案例", "在案例库中查看统一 390×844 外框的效果图或 Demo 视频，打开风格详情，确认最接近的视觉方向。"],
      ["复制配置", "复制按钮会带出本地参考图路径、图像提示词、排版和组件原则。"],
      ["拆分实现", "把文字、按钮、导航、状态与常规图标放进代码；把照片、插画、纹理和产品图作为图片资产。"],
      ["连接本地资产", "把生成或选择的图片保存到项目目录，再接回页面中对应的视觉槽位。"],
      ["验证交付", "打开本地预览，检查点击路径、图片加载、移动端布局和 reduced-motion。"]
    ],
    callout: "开始时不需要写“做得更高级”。先选一个案例，再复制配置，沟通会准确得多。"
  },
  principles: {
    eyebrow: "IMAGE2 UI / PRINCIPLES",
    title: "项目原理",
    intro: "Image2 UI 的目标不是把截图压成一张图片，而是把可编辑、可交互的界面和真实视觉资产重新组合起来。",
    steps: [
      ["代码负责界面", "真实文本、按钮、输入、导航、状态栏、筛选控件和常规图标全部由代码渲染。"],
      ["图片负责视觉", "照片、产品、人物、插画、纹理、背景和缩略图使用真实本地图片资产。"],
      ["提示词可追溯", "每套风格保留本地参考图路径和提示词，避免下次又从模糊形容词开始。"],
      ["结构先于装饰", "先命名 top app bar、card grid、filter chips、detail dialog 等区域，再确定视觉表现。"],
      ["输出必须可用", "最终交付不是静态截图，而是可以打开、点击、修改并继续迭代的页面。"]
    ],
    callout: "图片不承担可读文字、导航或功能图标。这样界面才能保持清楚、可访问并且便于修改。"
  }
};

export const infoPanelsEnglish = {
  guide: {
    eyebrow: "IMAGE2 UI / GUIDE",
    title: "How to use it",
    intro: "Start from a real reference and connect style selection, image assets, and a clickable interface in one reusable workflow.",
    steps: [
      ["Choose a case", "Compare screens and demo videos in the library, then open the closest visual direction."],
      ["Copy the configuration", "The copy action includes the local reference path, image prompt, typography, and component principles."],
      ["Split the implementation", "Keep copy, buttons, navigation, state, and ordinary icons in code. Use image assets for photos, illustration, texture, and products."],
      ["Connect local assets", "Save generated or selected images in the project and connect them to the matching visual slots."],
      ["Verify delivery", "Open the local preview and check click paths, image loading, mobile layout, and reduced motion."]
    ],
    callout: "Do not start with 'make it more premium.' Choose a case and copy its configuration so the direction is concrete."
  },
  principles: {
    eyebrow: "IMAGE2 UI / PRINCIPLES",
    title: "Principles",
    intro: "Image2 UI does not flatten a screenshot into one image. It recombines editable, interactive UI with real visual assets.",
    steps: [
      ["Code owns interface", "Render real copy, buttons, inputs, navigation, status bars, filters, and ordinary icons in code."],
      ["Images own visual material", "Use real local assets for photography, products, people, illustration, texture, backgrounds, and thumbnails."],
      ["Prompts stay traceable", "Each style keeps its local reference path and prompt so the next project does not restart from vague adjectives."],
      ["Structure before decoration", "Name regions such as top app bar, card grid, filter chips, and detail dialog before styling them."],
      ["Output must work", "The deliverable is a page that opens, responds, can be edited, and supports another iteration, not a static screenshot."]
    ],
    callout: "Images must not carry readable copy, navigation, or functional icons. Keeping those in code preserves clarity, accessibility, and editability."
  }
};
