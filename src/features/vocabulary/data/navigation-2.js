export const navigationEntries2 = [
  {
    "id": "segmented",
    "name": "分段控件",
    "en": "Segmented Control",
    "category": "navigation",
    "level": "基础",
    "tags": [
      "切换",
      "视图",
      "code-control"
    ],
    "ask": "就两个或三个模式并排，点哪个就切哪个，像 iPhone 的切换条。",
    "definition": "分段控件让用户在少量互斥选项之间切换当前视图或状态。",
    "role": "比下拉更快，比标签页更紧凑，适合网格/列表、周/月或浅色/深色等模式。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "分段控件的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "分段容器",
        "保持同一组视觉边界"
      ],
      [
        "选项",
        "2-4 个短词，互斥"
      ],
      [
        "选中滑块",
        "表达当前模式，不改变整体宽度"
      ],
      [
        "状态反馈",
        "切换后内容立即同步"
      ]
    ],
    "variants": [
      [
        "文字分段",
        "最通用"
      ],
      [
        "图标 + 文字",
        "图标提供辅助识别"
      ],
      [
        "紧凑分段",
        "工具栏中的小尺寸视图切换"
      ]
    ],
    "states": [
      [
        "选中",
        "滑块或底色移动，避免只换文字颜色"
      ],
      [
        "禁用",
        "保持布局，降低对比度"
      ],
      [
        "加载",
        "保留选中项并在面板反馈"
      ]
    ],
    "useWhen": [
      "只有少量互斥模式",
      "切换后仍在同一页面和同一任务"
    ],
    "avoidWhen": [
      "选项不是互斥的",
      "每个选项需要长说明或图片"
    ],
    "confusedWith": "分段控件偏向模式切换；Tabs 偏向内容分组和面板导航。",
    "codeUI": [
      "button、radiogroup、aria-pressed/checked、稳定尺寸"
    ],
    "media": [
      "分段控件与选中滑块全部由代码呈现，不需要配图"
    ],
    "prompt": "请使用一个 3 段 Segmented Control 切换数据视图，选中滑块保持同一宽度和高度；为键盘与屏幕阅读器提供 radiogroup 语义，不要把长句塞进选项。",
    "related": [
      "tabs",
      "filter-chips",
      "responsive"
    ],
    "source": "https://m3.material.io/components/segmented-buttons/overview"
  },
  {
    "id": "search",
    "name": "搜索框",
    "en": "Search",
    "category": "navigation",
    "level": "基础",
    "tags": [
      "发现",
      "输入",
      "code-control"
    ],
    "ask": "项目太多了，加个搜索让我按名字或关键词马上找到。",
    "definition": "搜索框接收用户的查询，并在本地或远程内容中返回相关结果、建议或无结果状态。",
    "role": "把浏览从‘一张张看’变成‘带着意图找’，尤其适合术语、案例、文件和商品目录。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "搜索框的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "输入区",
        "明确 placeholder 与清除按钮"
      ],
      [
        "搜索图标",
        "辅助识别，不替代可访问名称"
      ],
      [
        "建议/历史",
        "帮助用户快速完成查询"
      ],
      [
        "结果状态",
        "加载、匹配、无结果、错误"
      ]
    ],
    "variants": [
      [
        "即时搜索",
        "输入后实时筛选，适合本地数据"
      ],
      [
        "提交搜索",
        "按 Enter 或按钮触发，适合远程查询"
      ],
      [
        "命令搜索",
        "支持快捷键和分组结果"
      ]
    ],
    "states": [
      [
        "输入中",
        "保留查询值，显示清除动作"
      ],
      [
        "加载",
        "显示进行中，不清空输入"
      ],
      [
        "无结果",
        "说明如何修改查询并提供清除"
      ]
    ],
    "useWhen": [
      "条目多且用户有明确关键词",
      "内容需要跨分类查找"
    ],
    "avoidWhen": [
      "内容少到 5 项以内",
      "查询结果无法解释或没有恢复路径"
    ],
    "confusedWith": "搜索主动查找；筛选标签是在已知集合中缩小范围。",
    "codeUI": [
      "input type=search、debounce、键盘提交、结果 live region"
    ],
    "media": [
      "搜索图标用代码，不能把输入框烘焙进图片"
    ],
    "prompt": "请添加一个可访问的搜索框，支持 Enter 提交、Esc 清空、即时结果和无结果状态；搜索结果按名称、英文名、标签和用户表达匹配，输入值始终保留。",
    "related": [
      "filter-chips",
      "empty-state",
      "form"
    ],
    "source": "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/"
  },
  {
    "id": "filter-chips",
    "name": "筛选标签",
    "en": "Filter Chips",
    "category": "navigation",
    "level": "基础",
    "tags": [
      "发现",
      "筛选",
      "code-control"
    ],
    "ask": "只显示本周、未完成、负责人是我的项目，其他先别看。",
    "definition": "筛选标签是紧凑的可选条件，用于快速缩小当前集合或表达已启用的过滤条件。",
    "role": "让用户看见‘为什么只剩这些结果’，并允许低成本地打开、关闭和清除条件。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "筛选标签的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "标签文案",
        "条件短而可扫描"
      ],
      [
        "选中态",
        "颜色 + 勾选或填充"
      ],
      [
        "清除动作",
        "单个移除或一键清空"
      ],
      [
        "结果反馈",
        "数量、空状态或加载"
      ]
    ],
    "variants": [
      [
        "单选筛选",
        "多个条件只能选一个"
      ],
      [
        "多选筛选",
        "条件可以叠加"
      ],
      [
        "可关闭标签",
        "把已选条件固定在结果顶部"
      ]
    ],
    "states": [
      [
        "默认",
        "未启用条件保持轻量"
      ],
      [
        "选中",
        "明显但不喧宾夺主"
      ],
      [
        "无结果",
        "保留条件并解释如何放宽"
      ]
    ],
    "useWhen": [
      "结果集合需要快速缩小",
      "用户需要看到当前条件"
    ],
    "avoidWhen": [
      "条件多且有层级，使用筛选面板更清晰",
      "筛选逻辑无法用短标签表达"
    ],
    "confusedWith": "筛选标签是条件；标签页是内容容器；Badge 只是状态或数量展示。",
    "codeUI": [
      "button/checkbox、pressed 状态、筛选状态管理"
    ],
    "media": [
      "标签形状和文字由代码渲染"
    ],
    "prompt": "请在搜索下方放置可多选筛选标签，标签显示当前条件和结果数量；支持清除单个条件、一键重置和无结果说明，移动端可横向滚动但不造成页面溢出。",
    "related": [
      "search",
      "tabs",
      "empty-state"
    ],
    "source": "https://m3.material.io/components/chips/overview"
  }
];

export const navigationEnglish2 = {
  "segmented": {
    "name": "Segmented Control",
    "level": "Foundation",
    "tags": [
      "Switching",
      "View mode",
      "Code control"
    ],
    "ask": "Put two or three modes side by side so selecting one immediately switches the view, like an iPhone control.",
    "definition": "A segmented control switches the current view or state among a small set of mutually exclusive options.",
    "role": "It is faster than a select and more compact than tabs, making it useful for grid/list, week/month, or light/dark modes.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Fitness workspace segmented control code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Group container",
        "Keeps every option within one visual boundary"
      ],
      [
        "Options",
        "Two to four short, mutually exclusive choices"
      ],
      [
        "Selection indicator",
        "Shows the current mode without resizing the group"
      ],
      [
        "Immediate feedback",
        "The related content updates as soon as selection changes"
      ]
    ],
    "variants": [
      [
        "Text segments",
        "The most general form"
      ],
      [
        "Icon and text",
        "Icons reinforce recognition"
      ],
      [
        "Compact segments",
        "Small view switcher inside a toolbar"
      ]
    ],
    "states": [
      [
        "Selected",
        "A slider or fill changes without relying only on text color"
      ],
      [
        "Disabled",
        "The layout remains stable at lower contrast"
      ],
      [
        "Loading",
        "Selection remains visible while the view responds"
      ]
    ],
    "useWhen": [
      "There are only a few mutually exclusive modes",
      "The user remains on the same page and task after switching"
    ],
    "avoidWhen": [
      "Options can be combined",
      "Options require long descriptions or images"
    ],
    "confusedWith": "Segmented controls switch modes; tabs organize related content panels.",
    "codeUI": [
      "button, radiogroup, aria-pressed or checked, and stable dimensions"
    ],
    "media": [
      "Segments and the selection indicator are entirely code-rendered and need no imagery"
    ],
    "prompt": "Use a three-part segmented control to switch data views. Keep the selection indicator and overall dimensions stable, provide radiogroup semantics for keyboard and screen-reader users, and keep labels short."
  },
  "search": {
    "name": "Search",
    "level": "Foundation",
    "tags": [
      "Discovery",
      "Input",
      "Code control"
    ],
    "ask": "There are too many items. Add search so I can find one immediately by name or keyword.",
    "definition": "A search field accepts a query and returns matching results, suggestions, or a no-results state from local or remote content.",
    "role": "It changes browsing from scanning every item to looking with intent, especially for terms, examples, files, and product catalogs.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Content discovery search code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Input",
        "Has a clear placeholder and clear action"
      ],
      [
        "Search icon",
        "Supports recognition without replacing the accessible name"
      ],
      [
        "Suggestions and history",
        "Help users complete queries quickly"
      ],
      [
        "Result states",
        "Loading, matches, no results, and errors"
      ]
    ],
    "variants": [
      [
        "Instant search",
        "Filters local data as the user types"
      ],
      [
        "Submitted search",
        "Runs on Enter or a button for remote queries"
      ],
      [
        "Command search",
        "Supports shortcuts and grouped results"
      ]
    ],
    "states": [
      [
        "Typing",
        "Preserves the query and exposes a clear action"
      ],
      [
        "Loading",
        "Shows progress without clearing the input"
      ],
      [
        "No results",
        "Explains how to adjust the query and offers reset"
      ]
    ],
    "useWhen": [
      "There are many items and users know likely keywords",
      "Content must be found across categories"
    ],
    "avoidWhen": [
      "There are five or fewer items",
      "Results cannot be explained or recovered"
    ],
    "confusedWith": "Search actively looks for a query; filter chips narrow a known collection.",
    "codeUI": [
      "input type=search, debounce, keyboard submission, and a live results region"
    ],
    "media": [
      "Render the search icon and input in code, never baked into an image"
    ],
    "prompt": "Add an accessible search field with Enter submission, Escape to clear, instant results, and a no-results state. Match names, alternate names, tags, and user phrasing while always preserving the current query."
  },
  "filter-chips": {
    "name": "Filter Chips",
    "level": "Foundation",
    "tags": [
      "Discovery",
      "Filtering",
      "Code control"
    ],
    "ask": "Only show projects from this week that are unfinished and assigned to me.",
    "definition": "Filter chips are compact selectable conditions that narrow a collection or expose the filters currently applied.",
    "role": "They explain why only certain results remain and make enabling, disabling, and clearing conditions inexpensive.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Fitness discovery filter chips code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Label",
        "A short, scannable condition"
      ],
      [
        "Selected state",
        "Color plus a check or filled shape"
      ],
      [
        "Clear action",
        "Remove one condition or reset all"
      ],
      [
        "Results feedback",
        "Count, empty state, or loading"
      ]
    ],
    "variants": [
      [
        "Single-select",
        "Only one condition may be active"
      ],
      [
        "Multi-select",
        "Several conditions may be combined"
      ],
      [
        "Dismissible chip",
        "Pins active conditions above results"
      ]
    ],
    "states": [
      [
        "Default",
        "Inactive conditions remain visually light"
      ],
      [
        "Selected",
        "Clear without overpowering the results"
      ],
      [
        "No results",
        "Keeps conditions visible and explains how to broaden them"
      ]
    ],
    "useWhen": [
      "A result set needs quick narrowing",
      "Users need to see active conditions"
    ],
    "avoidWhen": [
      "Conditions are numerous or hierarchical and need a filter panel",
      "The rule cannot be expressed as a short label"
    ],
    "confusedWith": "A filter chip is a condition, a tab is a content container, and a badge only displays status or quantity.",
    "codeUI": [
      "button or checkbox, pressed state, and filter-state management"
    ],
    "media": [
      "Render chip shape, label, and state in code"
    ],
    "prompt": "Place multi-select filter chips below search, showing each condition and its result count. Support removing one condition, resetting all, and explaining no results; allow horizontal scrolling on mobile without page overflow."
  }
};
