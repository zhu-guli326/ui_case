export const contentEntries2 = [
  {
    "id": "data-table",
    "name": "数据表格",
    "en": "Data Table",
    "category": "content",
    "level": "进阶",
    "tags": [
      "数据",
      "高密度",
      "比较"
    ],
    "ask": "订单很多，我要按列对比状态、金额和负责人，还能排序筛选。",
    "definition": "数据表格用行和列展示结构一致的记录，让用户按字段扫描、比较和操作。",
    "role": "它以较高信息密度呈现可比较数据，适合后台、审计、清单和运营工作流。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "数据表格的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "表头",
        "明确列名、单位和排序状态"
      ],
      [
        "数据行",
        "每行代表一个对象或记录"
      ],
      [
        "行操作",
        "次要动作集中在末列或菜单"
      ],
      [
        "工具区",
        "搜索、筛选、批量操作和结果数量"
      ]
    ],
    "variants": [
      [
        "只读表格",
        "浏览和比较结构化数据"
      ],
      [
        "可排序表格",
        "按关键列重新排列记录"
      ],
      [
        "可选择表格",
        "支持复选、批量操作和固定表头"
      ]
    ],
    "states": [
      [
        "加载",
        "保留列宽并使用行骨架"
      ],
      [
        "空/无结果",
        "说明原因并提供清除筛选"
      ],
      [
        "窄屏",
        "优先保留关键列，必要时转为列表而非压扁文字"
      ]
    ],
    "useWhen": [
      "记录共享相同字段且需要横向比较",
      "用户需要排序、筛选或批量操作"
    ],
    "avoidWhen": [
      "每项结构不同或需要大量叙述",
      "移动端只展示一个对象的详情"
    ],
    "confusedWith": "数据表格强调列间比较；列表强调顺序扫描；卡片强调独立对象的视觉识别。",
    "codeUI": [
      "table 语义、caption、th scope、排序状态、键盘焦点、稳定列宽"
    ],
    "media": [
      "头像或对象缩略图可使用外部图片；数据、状态和操作必须由代码渲染"
    ],
    "prompt": "请实现一个可访问 Data Table：提供 caption 与正确的 th scope，列头显示排序方向，首列可复选并支持批量操作；加载时保持列宽，手机端隐藏低优先级列或切换为结构化列表。",
    "related": [
      "list",
      "search",
      "filter-chips",
      "responsive",
      "checkbox"
    ],
    "source": "https://www.w3.org/WAI/ARIA/apg/patterns/grid/"
  },
  {
    "id": "carousel-fade",
    "name": "淡入式轮播",
    "en": "Fade Carousel",
    "category": "content",
    "level": "进阶",
    "tags": [
      "轮播形式",
      "动效",
      "内容展示"
    ],
    "ask": "图片交叉淡化，适合品牌感强的大图展示。",
    "definition": "淡入式轮播是一种有明确过渡逻辑的图片轮播，不只是默认的左右滑加圆点。",
    "role": "先根据内容场景选择运动方式，再明确手势、速度、层级和可访问的静态降级。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "淡入式轮播代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "内容层",
        "每张图片或产品帧保持清晰主体"
      ],
      [
        "过渡方式",
        "图片交叉淡化，适合品牌感强的大图展示。"
      ],
      [
        "交互提示",
        "支持拖拽、键盘和触摸，并让当前状态可感知"
      ],
      [
        "降级方案",
        "减弱动效时仍能按顺序浏览全部内容"
      ]
    ],
    "variants": [
      [
        "默认",
        "品牌官网、作品集首屏"
      ],
      [
        "窄屏",
        "保留主体与操作，不让卡片被裁切"
      ],
      [
        "减弱动效",
        "关闭 3D、视差或自动播放，改为直接切换"
      ]
    ],
    "states": [
      [
        "默认",
        "第一张图清晰可见，过渡以交叉淡化完成"
      ],
      [
        "淡化过渡",
        "当前图与下一张图同时可见，避免突然切换"
      ],
      [
        "暂停",
        "停留在当前画面，并保留继续浏览的控制"
      ]
    ],
    "useWhen": [
      "品牌官网、作品集首屏",
      "需要让多张视觉内容形成连续叙事"
    ],
    "avoidWhen": [
      "用户需要同时比较所有内容，或动效会影响任务效率"
    ],
    "confusedWith": "轮播形式决定内容如何移动与切换，不等同于图片本身或页面整体布局。",
    "codeUI": [
      "真实图片、状态类名、pointer/touch 事件、键盘控制、prefers-reduced-motion"
    ],
    "media": [
      "图片只提供视觉内容，轮播结构、标题、指示器和状态由代码渲染"
    ],
    "prompt": "图片交叉淡化，适合品牌感强的大图展示。 请同时定义当前索引、拖拽/键盘操作、自动播放暂停规则、触摸目标和 reduced-motion 降级，不要只做左右箭头和圆点。",
    "related": [
      "media-tile",
      "card",
      "responsive",
      "carousel-3d",
      "carousel-stack",
      "carousel-page",
      "carousel-accordion",
      "carousel-360",
      "carousel-parallax"
    ],
    "source": "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type"
  },
  {
    "id": "carousel-3d",
    "name": "3D 旋转木马",
    "en": "3D Carousel",
    "category": "content",
    "level": "进阶",
    "tags": [
      "轮播形式",
      "动效",
      "内容展示"
    ],
    "ask": "中间卡片最大，两侧卡片缩小并带透视，像一个展示橱窗。",
    "definition": "3D 旋转木马是一种有明确过渡逻辑的图片轮播，不只是默认的左右滑加圆点。",
    "role": "先根据内容场景选择运动方式，再明确手势、速度、层级和可访问的静态降级。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "3D 旋转木马代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "内容层",
        "每张图片或产品帧保持清晰主体"
      ],
      [
        "过渡方式",
        "中间卡片最大，两侧卡片缩小并带透视，像一个展示橱窗。"
      ],
      [
        "交互提示",
        "支持拖拽、键盘和触摸，并让当前状态可感知"
      ],
      [
        "降级方案",
        "减弱动效时仍能按顺序浏览全部内容"
      ]
    ],
    "variants": [
      [
        "默认",
        "作品集、产品陈列"
      ],
      [
        "窄屏",
        "保留主体与操作，不让卡片被裁切"
      ],
      [
        "减弱动效",
        "关闭 3D、视差或自动播放，改为直接切换"
      ]
    ],
    "states": [
      [
        "默认",
        "中间卡片最大，两侧卡片保留透视关系"
      ],
      [
        "旋转中",
        "中心位置和两侧深度随拖拽连续变化"
      ],
      [
        "暂停",
        "停止自动旋转，当前卡片仍可操作"
      ]
    ],
    "useWhen": [
      "作品集、产品陈列",
      "需要让多张视觉内容形成连续叙事"
    ],
    "avoidWhen": [
      "用户需要同时比较所有内容，或动效会影响任务效率"
    ],
    "confusedWith": "轮播形式决定内容如何移动与切换，不等同于图片本身或页面整体布局。",
    "codeUI": [
      "真实图片、状态类名、pointer/touch 事件、键盘控制、prefers-reduced-motion"
    ],
    "media": [
      "图片只提供视觉内容，轮播结构、标题、指示器和状态由代码渲染"
    ],
    "prompt": "中间卡片最大，两侧卡片缩小并带透视，像一个展示橱窗。 请同时定义当前索引、拖拽/键盘操作、自动播放暂停规则、触摸目标和 reduced-motion 降级，不要只做左右箭头和圆点。",
    "related": [
      "media-tile",
      "card",
      "responsive",
      "carousel-fade",
      "carousel-stack",
      "carousel-page",
      "carousel-accordion",
      "carousel-360",
      "carousel-parallax"
    ],
    "source": "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type"
  },
  {
    "id": "carousel-stack",
    "name": "卡片堆叠轮播",
    "en": "Stacked Cards",
    "category": "content",
    "level": "进阶",
    "tags": [
      "轮播形式",
      "动效",
      "内容展示"
    ],
    "ask": "像一摞扑克牌一样，划走最上面一张露出下一张。",
    "definition": "卡片堆叠轮播是一种有明确过渡逻辑的图片轮播，不只是默认的左右滑加圆点。",
    "role": "先根据内容场景选择运动方式，再明确手势、速度、层级和可访问的静态降级。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "卡片堆叠轮播代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "内容层",
        "每张图片或产品帧保持清晰主体"
      ],
      [
        "过渡方式",
        "像一摞扑克牌一样，划走最上面一张露出下一张。"
      ],
      [
        "交互提示",
        "支持拖拽、键盘和触摸，并让当前状态可感知"
      ],
      [
        "降级方案",
        "减弱动效时仍能按顺序浏览全部内容"
      ]
    ],
    "variants": [
      [
        "默认",
        "推荐流、移动端内容卡片"
      ],
      [
        "窄屏",
        "保留主体与操作，不让卡片被裁切"
      ],
      [
        "减弱动效",
        "关闭 3D、视差或自动播放，改为直接切换"
      ]
    ],
    "states": [
      [
        "默认",
        "顶部卡片完整显示，下一张露出层级提示"
      ],
      [
        "拖拽中",
        "顶部卡片跟随手势移动，下面卡片保持稳定"
      ],
      [
        "停留",
        "松手后停在当前卡片，不依赖自动播放"
      ]
    ],
    "useWhen": [
      "推荐流、移动端内容卡片",
      "需要让多张视觉内容形成连续叙事"
    ],
    "avoidWhen": [
      "用户需要同时比较所有内容，或动效会影响任务效率"
    ],
    "confusedWith": "轮播形式决定内容如何移动与切换，不等同于图片本身或页面整体布局。",
    "codeUI": [
      "真实图片、状态类名、pointer/touch 事件、键盘控制、prefers-reduced-motion"
    ],
    "media": [
      "图片只提供视觉内容，轮播结构、标题、指示器和状态由代码渲染"
    ],
    "prompt": "像一摞扑克牌一样，划走最上面一张露出下一张。 请同时定义当前索引、拖拽/键盘操作、自动播放暂停规则、触摸目标和 reduced-motion 降级，不要只做左右箭头和圆点。",
    "related": [
      "media-tile",
      "card",
      "responsive",
      "carousel-fade",
      "carousel-3d",
      "carousel-page",
      "carousel-accordion",
      "carousel-360",
      "carousel-parallax"
    ],
    "source": "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type"
  },
  {
    "id": "carousel-page",
    "name": "翻页式轮播",
    "en": "Page-turn Carousel",
    "category": "content",
    "level": "进阶",
    "tags": [
      "轮播形式",
      "动效",
      "内容展示"
    ],
    "ask": "左右两页带 3D 翻面和卷边效果，适合杂志或品牌画册。",
    "definition": "翻页式轮播是一种有明确过渡逻辑的图片轮播，不只是默认的左右滑加圆点。",
    "role": "先根据内容场景选择运动方式，再明确手势、速度、层级和可访问的静态降级。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "翻页式轮播代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "内容层",
        "每张图片或产品帧保持清晰主体"
      ],
      [
        "过渡方式",
        "左右两页带 3D 翻面和卷边效果，适合杂志或品牌画册。"
      ],
      [
        "交互提示",
        "支持拖拽、键盘和触摸，并让当前状态可感知"
      ],
      [
        "降级方案",
        "减弱动效时仍能按顺序浏览全部内容"
      ]
    ],
    "variants": [
      [
        "默认",
        "电子杂志、品牌画册"
      ],
      [
        "窄屏",
        "保留主体与操作，不让卡片被裁切"
      ],
      [
        "减弱动效",
        "关闭 3D、视差或自动播放，改为直接切换"
      ]
    ],
    "states": [
      [
        "默认",
        "左右两页保持可读，并显示翻页方向"
      ],
      [
        "翻页中",
        "页面绕书脊翻转，背面不会穿透成乱码"
      ],
      [
        "暂停",
        "停留在当前页，保留左右翻页入口"
      ]
    ],
    "useWhen": [
      "电子杂志、品牌画册",
      "需要让多张视觉内容形成连续叙事"
    ],
    "avoidWhen": [
      "用户需要同时比较所有内容，或动效会影响任务效率"
    ],
    "confusedWith": "轮播形式决定内容如何移动与切换，不等同于图片本身或页面整体布局。",
    "codeUI": [
      "真实图片、状态类名、pointer/touch 事件、键盘控制、prefers-reduced-motion"
    ],
    "media": [
      "图片只提供视觉内容，轮播结构、标题、指示器和状态由代码渲染"
    ],
    "prompt": "左右两页带 3D 翻面和卷边效果，适合杂志或品牌画册。 请同时定义当前索引、拖拽/键盘操作、自动播放暂停规则、触摸目标和 reduced-motion 降级，不要只做左右箭头和圆点。",
    "related": [
      "media-tile",
      "card",
      "responsive",
      "carousel-fade",
      "carousel-3d",
      "carousel-stack",
      "carousel-accordion",
      "carousel-360",
      "carousel-parallax"
    ],
    "source": "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type"
  }
];

export const contentEnglish2 = {
  "data-table": {
    "name": "Data Table",
    "level": "Advanced",
    "tags": [
      "Data",
      "High density",
      "Comparison"
    ],
    "ask": "I have many orders and need to compare status, amount, and owner by column, then sort and filter them.",
    "definition": "A data table presents structurally consistent records in rows and columns for field-by-field scanning, comparison, and action.",
    "role": "It provides high information density for administration, auditing, inventories, and operational workflows.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Data table code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Column headers",
        "Name fields, units, and sort state clearly"
      ],
      [
        "Data rows",
        "Represent one object or record per row"
      ],
      [
        "Row actions",
        "Keep secondary commands in the final column or a menu"
      ],
      [
        "Toolbar",
        "Provides search, filters, bulk actions, and result count"
      ]
    ],
    "variants": [
      [
        "Read-only table",
        "Scans and compares structured data"
      ],
      [
        "Sortable table",
        "Reorders records by key columns"
      ],
      [
        "Selectable table",
        "Supports checkboxes, bulk actions, and a sticky header"
      ]
    ],
    "states": [
      [
        "Loading",
        "Preserves column widths with row skeletons"
      ],
      [
        "Empty or no results",
        "Explains why and offers filter reset"
      ],
      [
        "Narrow screen",
        "Keeps priority columns or becomes a list instead of crushing text"
      ]
    ],
    "useWhen": [
      "Records share fields and need horizontal comparison",
      "Users need sorting, filtering, or bulk actions"
    ],
    "avoidWhen": [
      "Items have different structures or long narratives",
      "Mobile shows one object's detail at a time"
    ],
    "confusedWith": "A data table emphasizes column comparison, a list emphasizes ordered scanning, and a card emphasizes visual recognition of independent objects.",
    "codeUI": [
      "Table semantics, caption, th scope, sort state, keyboard focus, and stable column widths"
    ],
    "media": [
      "Avatars or object thumbnails may use external images; data, status, and actions stay code-rendered"
    ],
    "prompt": "Build an accessible data table with a caption and correct th scope, show sort direction in column headers, and support first-column selection plus bulk actions. Preserve column widths while loading, and hide low-priority columns or switch to a structured list on phones."
  },
  "carousel-fade": {
    "name": "Fade Carousel",
    "level": "Advanced",
    "tags": [
      "Carousel",
      "Motion",
      "Content display"
    ],
    "ask": "Use cross-fade transitions between full-bleed images for a calm, brand-led carousel.",
    "definition": "A carousel pattern defines how a sequence of visual items moves, transitions, and remains navigable.",
    "role": "Choose the motion model for the content scenario, then specify gestures, timing, hierarchy, and an accessible static fallback.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Fade Carousel code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "states": [
      [
        "Default",
        "The first image is clear and transitions cross-fade"
      ],
      [
        "Fading",
        "Current and next images overlap without a hard cut"
      ],
      [
        "Paused",
        "The current image stays visible with browsing controls"
      ]
    ],
    "useWhen": [
      "品牌官网、作品集首屏",
      "When several visual items need a continuous story"
    ],
    "avoidWhen": [
      "When users must compare every item at once or motion harms task efficiency"
    ],
    "confusedWith": "A carousel pattern controls movement and transition; it is not the image asset or the page layout.",
    "prompt": "Use cross-fade transitions between full-bleed images for a calm, brand-led carousel. Define the active index, drag and keyboard behavior, autoplay pause rules, touch targets, and a reduced-motion fallback instead of only adding arrows and dots."
  },
  "carousel-3d": {
    "name": "3D Carousel",
    "level": "Advanced",
    "tags": [
      "Carousel",
      "Motion",
      "Content display"
    ],
    "ask": "Make the center slide larger while side slides recede with perspective, like a visual showcase.",
    "definition": "A carousel pattern defines how a sequence of visual items moves, transitions, and remains navigable.",
    "role": "Choose the motion model for the content scenario, then specify gestures, timing, hierarchy, and an accessible static fallback.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "3D Carousel code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "states": [
      [
        "Default",
        "The center card is largest and side cards keep perspective"
      ],
      [
        "Rotating",
        "Center position and depth change continuously with drag"
      ],
      [
        "Paused",
        "Auto-rotation stops while the current card remains usable"
      ]
    ],
    "useWhen": [
      "作品集、产品陈列",
      "When several visual items need a continuous story"
    ],
    "avoidWhen": [
      "When users must compare every item at once or motion harms task efficiency"
    ],
    "confusedWith": "A carousel pattern controls movement and transition; it is not the image asset or the page layout.",
    "prompt": "Make the center slide larger while side slides recede with perspective, like a visual showcase. Define the active index, drag and keyboard behavior, autoplay pause rules, touch targets, and a reduced-motion fallback instead of only adding arrows and dots."
  },
  "carousel-stack": {
    "name": "Stacked Cards",
    "level": "Advanced",
    "tags": [
      "Carousel",
      "Motion",
      "Content display"
    ],
    "ask": "Stack slides like a deck of cards so swiping the top card reveals the next one.",
    "definition": "A carousel pattern defines how a sequence of visual items moves, transitions, and remains navigable.",
    "role": "Choose the motion model for the content scenario, then specify gestures, timing, hierarchy, and an accessible static fallback.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Stacked Cards code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "states": [
      [
        "Default",
        "The top card is complete and the next card peeks through"
      ],
      [
        "Dragging",
        "The top card follows the gesture while the stack stays stable"
      ],
      [
        "Settled",
        "The card rests in place without relying on autoplay"
      ]
    ],
    "useWhen": [
      "推荐流、移动端内容卡片",
      "When several visual items need a continuous story"
    ],
    "avoidWhen": [
      "When users must compare every item at once or motion harms task efficiency"
    ],
    "confusedWith": "A carousel pattern controls movement and transition; it is not the image asset or the page layout.",
    "prompt": "Stack slides like a deck of cards so swiping the top card reveals the next one. Define the active index, drag and keyboard behavior, autoplay pause rules, touch targets, and a reduced-motion fallback instead of only adding arrows and dots."
  },
  "carousel-page": {
    "name": "Page-turn Carousel",
    "level": "Advanced",
    "tags": [
      "Carousel",
      "Motion",
      "Content display"
    ],
    "ask": "Turn two pages with a 3D fold and curled edge for an editorial, magazine-like rhythm.",
    "definition": "A carousel pattern defines how a sequence of visual items moves, transitions, and remains navigable.",
    "role": "Choose the motion model for the content scenario, then specify gestures, timing, hierarchy, and an accessible static fallback.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Page-turn Carousel code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "states": [
      [
        "Default",
        "Both pages remain readable with a clear turn direction"
      ],
      [
        "Turning",
        "Pages rotate around the spine without showing broken backs"
      ],
      [
        "Paused",
        "The current page remains with previous and next controls"
      ]
    ],
    "useWhen": [
      "电子杂志、品牌画册",
      "When several visual items need a continuous story"
    ],
    "avoidWhen": [
      "When users must compare every item at once or motion harms task efficiency"
    ],
    "confusedWith": "A carousel pattern controls movement and transition; it is not the image asset or the page layout.",
    "prompt": "Turn two pages with a 3D fold and curled edge for an editorial, magazine-like rhythm. Define the active index, drag and keyboard behavior, autoplay pause rules, touch targets, and a reduced-motion fallback instead of only adding arrows and dots."
  }
};
