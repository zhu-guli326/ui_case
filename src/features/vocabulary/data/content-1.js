export const contentEntries1 = [
  {
    "id": "card",
    "name": "卡片",
    "en": "Card",
    "category": "content",
    "level": "基础",
    "tags": [
      "内容",
      "容器",
      "外部图片"
    ],
    "ask": "每个商品做成一张卡片，图、名字、价格和操作放在一起，整张能点。",
    "definition": "卡片把同一对象的标题、摘要、媒体和相关操作组织成一个边界清楚的内容容器。",
    "role": "帮助用户扫读一组对象，同时保留对象级点击和局部操作的边界。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "卡片的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "封面",
        "图片或媒体，提供快速识别"
      ],
      [
        "标题",
        "对象名称，视觉权重最高"
      ],
      [
        "元信息",
        "价格、作者、状态等短信息"
      ],
      [
        "操作区",
        "收藏、预览或进入详情"
      ]
    ],
    "variants": [
      [
        "基础卡片",
        "以文字和状态为主"
      ],
      [
        "带封面",
        "媒体是主要识别信息"
      ],
      [
        "带操作",
        "卡片内有独立按钮，需避免误触"
      ]
    ],
    "states": [
      [
        "默认/悬停",
        "边框或阴影变化，不布局跳动"
      ],
      [
        "选中/收藏",
        "状态可见且能撤销"
      ],
      [
        "加载",
        "骨架形状与最终卡片一致"
      ]
    ],
    "useWhen": [
      "每个对象可以独立浏览",
      "需要重复展示一组相似对象"
    ],
    "avoidWhen": [
      "内容是连续长文",
      "每项只有一行文字，列表更紧凑",
      "把卡片再嵌套卡片"
    ],
    "confusedWith": "卡片是对象边界；卡片网格是布局；列表是更高密度的重复结构。",
    "codeUI": [
      "article、链接区域、局部按钮、固定宽高比和 alt"
    ],
    "media": [
      "产品图、照片、插画和缩略图可使用外部图片；卡片文字与按钮由代码呈现"
    ],
    "prompt": "请把每个对象做成独立卡片：封面、标题、短摘要和一个局部操作；主区域进入详情，局部按钮不触发主区域跳转；不要嵌套卡片，并固定媒体比例避免加载抖动。",
    "related": [
      "card-grid",
      "media-tile",
      "list"
    ],
    "source": "https://m3.material.io/components/cards/overview"
  },
  {
    "id": "card-grid",
    "name": "卡片网格",
    "en": "Card Grid",
    "category": "content",
    "level": "基础",
    "tags": [
      "布局",
      "重复内容",
      "responsive"
    ],
    "ask": "这些案例排成整齐的格子，屏幕窄了自动变成两列或一列。",
    "definition": "卡片网格用二维列和行组织重复对象，并根据可用宽度调整列数和卡片最小尺寸。",
    "role": "适合比较和浏览同类对象，空间节奏比信息流更规整。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "卡片网格的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "网格容器",
        "定义列数、间距和最大宽度"
      ],
      [
        "卡片项",
        "保持对象边界与一致比例"
      ],
      [
        "排序/筛选",
        "改变结果时保留节奏"
      ],
      [
        "响应式断点",
        "从多列收敛到单列"
      ]
    ],
    "variants": [
      [
        "等宽网格",
        "适合案例、商品、模板"
      ],
      [
        "混合尺寸网格",
        "突出一两个重点对象"
      ],
      [
        "水平滚动网格",
        "适合移动端相关内容"
      ]
    ],
    "states": [
      [
        "加载",
        "显示同尺寸骨架"
      ],
      [
        "无结果",
        "网格位置出现下一步"
      ],
      [
        "窄屏",
        "列数下降，卡片不挤压文字"
      ]
    ],
    "useWhen": [
      "对象同质、需要并排比较",
      "每个对象都有可视化封面"
    ],
    "avoidWhen": [
      "内容顺序和时间关系更重要",
      "单项信息量太大无法在卡片内读完"
    ],
    "confusedWith": "网格是布局方式，不等于卡片；网格也可以承载媒体图块或数据条。",
    "codeUI": [
      "CSS Grid、minmax、gap、容器宽度和焦点顺序"
    ],
    "media": [
      "卡片中的媒体位使用可替换的外部图片，标题、标签和操作保持代码渲染"
    ],
    "prompt": "请用 CSS Grid 实现卡片网格：桌面端 3 列、窄桌面 2 列、手机 1 列；使用 minmax 和固定媒体比例，卡片内部文字不得溢出，筛选后保持网格节奏。",
    "related": [
      "card",
      "media-tile",
      "responsive"
    ],
    "source": "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout"
  },
  {
    "id": "list",
    "name": "信息流列表",
    "en": "Feed List",
    "category": "content",
    "level": "基础",
    "tags": [
      "内容",
      "密度",
      "时间"
    ],
    "ask": "内容一条一条排下来，最新的在上面，扫一眼就能看懂。",
    "definition": "信息流列表按时间、相关性或优先级连续排列内容项，强调快速扫描和顺序关系。",
    "role": "在有限空间里承载更多对象，比卡片网格更适合标题、状态和时间。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "信息流列表的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "列表项",
        "每行一个对象，边界清楚"
      ],
      [
        "主标题",
        "承担主要识别信息"
      ],
      [
        "辅助元信息",
        "时间、分类、作者或状态"
      ],
      [
        "分页/加载",
        "追加或分页需保持位置"
      ]
    ],
    "variants": [
      [
        "媒体列表",
        "左图右文，适合新闻"
      ],
      [
        "活动列表",
        "时间、状态和动作更重要"
      ],
      [
        "紧凑列表",
        "适合后台和设置页"
      ]
    ],
    "states": [
      [
        "未读",
        "字重或状态点表达"
      ],
      [
        "加载更多",
        "追加时不跳回顶部"
      ],
      [
        "错误",
        "保留已加载内容并提供重试"
      ]
    ],
    "useWhen": [
      "顺序、时间或密度比大图更重要",
      "对象有较长标题和多条元信息"
    ],
    "avoidWhen": [
      "每个对象都依赖大图识别",
      "用户需要并排比较多张图片"
    ],
    "confusedWith": "信息流强调顺序和密度；卡片强调对象边界和媒体识别。",
    "codeUI": [
      "ul/li、链接、时间语义、加载更多和可访问状态"
    ],
    "media": [
      "列表缩略图可以使用外部照片或插画，但文字必须由代码呈现"
    ],
    "prompt": "请做一个新闻信息流：每项包含缩略图、标题、分类和时间，列表按时间排序；移动端保持标题可读，加载更多使用追加而不是重置列表。",
    "related": [
      "card",
      "media-tile",
      "card-grid"
    ],
    "source": "https://www.nngroup.com/articles/list-design/"
  },
  {
    "id": "media-tile",
    "name": "媒体图块",
    "en": "Media Tile",
    "category": "content",
    "level": "基础",
    "tags": [
      "图片",
      "视频",
      "外部图片"
    ],
    "ask": "做一组图片或视频图块，图是主角，文字只补充标题和类型。",
    "definition": "媒体图块以图片或视频作为主要识别信息，代码文字和操作作为辅助层。",
    "role": "让用户通过视觉快速发现内容，适合画廊、作品集、媒体库和探索页。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "媒体图块的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "媒体槽位",
        "固定比例、object-fit 和加载占位"
      ],
      [
        "标签",
        "类型、时长或状态"
      ],
      [
        "标题",
        "短而可扫描"
      ],
      [
        "操作",
        "播放、收藏或打开详情"
      ]
    ],
    "variants": [
      [
        "网格图块",
        "适合视觉浏览"
      ],
      [
        "瀑布流图块",
        "保留不同图片高度"
      ],
      [
        "视频图块",
        "必须有 poster、控件和暂停行为"
      ]
    ],
    "states": [
      [
        "加载",
        "使用同尺寸占位避免跳动"
      ],
      [
        "播放",
        "控件和状态由代码绘制"
      ],
      [
        "失败",
        "显示破图替代和重试"
      ]
    ],
    "useWhen": [
      "图片/视频本身是主要内容",
      "用户需要先看视觉再决定是否打开"
    ],
    "avoidWhen": [
      "图片只是装饰，文字才是主要任务",
      "外部占位图无法代表最终内容或版权状态"
    ],
    "confusedWith": "媒体图块是内容展示角色；UI 图标和导航 glyph 不能用图片图块替代。",
    "codeUI": [
      "img/video、alt/poster、播放/收藏按钮、比例约束"
    ],
    "media": [
      "摄影、插画、产品抠图、纹理和缩略图使用可替换的外部图片"
    ],
    "prompt": "请构建一个媒体图块网格：所有图片使用可替换的外部 URL、固定比例和有意义的 alt；标题、按钮和播放图标由代码呈现，卡片内提供真实可点击控件。",
    "related": [
      "card",
      "hero",
      "card-grid"
    ],
    "source": "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture"
  },
  {
    "id": "detail-panel",
    "name": "详情面板",
    "en": "Detail Panel",
    "category": "content",
    "level": "进阶",
    "tags": [
      "检查器",
      "对象详情",
      "层级"
    ],
    "ask": "点中一个对象后，旁边展开详情，列表还留在原位方便对照。",
    "definition": "详情面板在当前页面上下文中展示被选对象的完整信息、状态和相关操作。",
    "role": "让用户查看细节而不丢失列表、网格或工作区的上下文。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "详情面板的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "对象摘要",
        "标题、状态、主媒体"
      ],
      [
        "信息分组",
        "描述、元数据、历史"
      ],
      [
        "局部操作",
        "编辑、收藏、分享或关闭"
      ],
      [
        "上下文返回",
        "保留来源列表或面包屑"
      ]
    ],
    "variants": [
      [
        "右侧检查器",
        "桌面工作区中保持列表可见"
      ],
      [
        "全屏详情",
        "移动端或复杂对象"
      ],
      [
        "内联展开",
        "简单对象的轻量展开"
      ]
    ],
    "states": [
      [
        "打开/关闭",
        "可回退，焦点有明确落点"
      ],
      [
        "加载",
        "只替换面板内容"
      ],
      [
        "错误",
        "提供重试和返回列表"
      ]
    ],
    "useWhen": [
      "用户需要对照列表和详情",
      "对象信息多但不应离开当前任务"
    ],
    "avoidWhen": [
      "详情只有一行文字",
      "打开后必须完成独立长流程"
    ],
    "confusedWith": "详情面板强调上下文；模态框会打断背景任务；抽屉是详情面板的一种承载方式。",
    "codeUI": [
      "aside/dialog、焦点管理、关闭与返回、响应式重排"
    ],
    "media": [
      "对象媒体、照片和插画；面板内文案/状态由代码"
    ],
    "prompt": "请在桌面端用右侧详情面板展示选中对象，保留左侧列表；移动端切换成全屏详情并提供返回按钮；打开、关闭、加载和错误状态都要可恢复。",
    "related": [
      "drawer",
      "breadcrumbs",
      "modal",
      "card"
    ],
    "source": "https://m3.material.io/components/dialogs/overview"
  }
];

export const contentEnglish1 = {
  "card": {
    "name": "Card",
    "level": "Foundation",
    "tags": [
      "Content",
      "Container",
      "External media"
    ],
    "ask": "Make each product a card that groups its image, name, price, and actions, with a clickable main area.",
    "definition": "A card groups one object's title, summary, media, and related actions within a clear content boundary.",
    "role": "It supports scanning a collection while preserving the boundary between opening the object and using its local actions.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Fashion catalog card code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Cover",
        "Image or media used for quick recognition"
      ],
      [
        "Title",
        "The object's highest-priority identifier"
      ],
      [
        "Metadata",
        "Short details such as price, author, or status"
      ],
      [
        "Actions",
        "Favorite, preview, or open detail"
      ]
    ],
    "variants": [
      [
        "Basic card",
        "Mostly text and status"
      ],
      [
        "Media card",
        "The cover is the primary identifier"
      ],
      [
        "Action card",
        "Contains local buttons that must avoid accidental activation"
      ]
    ],
    "states": [
      [
        "Default and hover",
        "Border or shadow changes without layout shift"
      ],
      [
        "Selected or saved",
        "State is visible and reversible"
      ],
      [
        "Loading",
        "Skeleton geometry matches the final card"
      ]
    ],
    "useWhen": [
      "Every object can be browsed independently",
      "A set of similar objects repeats"
    ],
    "avoidWhen": [
      "The content is a continuous article",
      "Each item is only one line and a list would be denser",
      "The design nests cards inside cards"
    ],
    "confusedWith": "A card defines an object boundary, a card grid defines layout, and a list is a denser repeated structure.",
    "codeUI": [
      "article, primary link area, local buttons, fixed aspect ratio, and alt text"
    ],
    "media": [
      "Product images, photography, illustrations, and thumbnails without card text or buttons"
    ],
    "prompt": "Make every object an independent card with a cover, title, short summary, and one local action. Let the main region open details without local buttons triggering it, avoid nested cards, and fix the media ratio to prevent loading shift."
  },
  "card-grid": {
    "name": "Card Grid",
    "level": "Foundation",
    "tags": [
      "Layout",
      "Repeated content",
      "Responsive"
    ],
    "ask": "Arrange these examples in a tidy grid that automatically becomes two columns or one on narrower screens.",
    "definition": "A card grid organizes repeated objects across rows and columns, adapting its column count and minimum card size to available width.",
    "role": "It supports comparison and browsing of similar objects with a more regular spatial rhythm than a feed.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Content card grid code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Grid container",
        "Defines columns, gap, and maximum width"
      ],
      [
        "Card item",
        "Maintains object boundaries and a consistent ratio"
      ],
      [
        "Sort and filter",
        "Preserve visual rhythm as results change"
      ],
      [
        "Responsive rule",
        "Converges from several columns to one"
      ]
    ],
    "variants": [
      [
        "Equal grid",
        "Useful for examples, products, and templates"
      ],
      [
        "Mixed-size grid",
        "Emphasizes one or two objects"
      ],
      [
        "Horizontal rail",
        "Useful for related mobile content"
      ]
    ],
    "states": [
      [
        "Loading",
        "Uses skeletons with matching dimensions"
      ],
      [
        "No results",
        "Places a clear next step where the grid was"
      ],
      [
        "Narrow",
        "Drops columns instead of compressing text"
      ]
    ],
    "useWhen": [
      "Objects are similar and need side-by-side comparison",
      "Every object has a visual cover"
    ],
    "avoidWhen": [
      "Sequence and time matter more",
      "Each item contains too much information for a card"
    ],
    "confusedWith": "A grid is a layout method, not a synonym for card; it can also contain media tiles or data items.",
    "codeUI": [
      "CSS Grid, minmax, gap, container width, and focus order"
    ],
    "media": [
      "Card media uses a replaceable external image while titles, labels, and actions remain code-rendered"
    ],
    "prompt": "Implement a CSS Grid card layout with three columns on desktop, two on narrow desktop, and one on mobile. Use minmax and fixed media ratios, prevent text overflow, and preserve the grid rhythm after filtering."
  },
  "list": {
    "name": "Feed List",
    "level": "Foundation",
    "tags": [
      "Content",
      "Density",
      "Time"
    ],
    "ask": "Stack content in rows with the newest first so each item is easy to scan.",
    "definition": "A feed list orders items continuously by time, relevance, or priority and emphasizes scanning plus sequence.",
    "role": "It carries more objects in limited space than a card grid and works well for titles, status, and timestamps.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "News feed list code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "List item",
        "One object per row with a clear boundary"
      ],
      [
        "Primary title",
        "Carries the main identifying information"
      ],
      [
        "Supporting metadata",
        "Time, category, author, or status"
      ],
      [
        "Pagination",
        "Appends content without losing position"
      ]
    ],
    "variants": [
      [
        "Media list",
        "Image and text for news or articles"
      ],
      [
        "Activity list",
        "Prioritizes time, status, and action"
      ],
      [
        "Compact list",
        "Fits settings and operational tools"
      ]
    ],
    "states": [
      [
        "Unread",
        "Uses weight or a status dot"
      ],
      [
        "Load more",
        "Appends without returning to the top"
      ],
      [
        "Error",
        "Keeps loaded content and offers retry"
      ]
    ],
    "useWhen": [
      "Order, time, or density matters more than large imagery",
      "Objects have longer titles and several metadata points"
    ],
    "avoidWhen": [
      "Every object depends on a large image for recognition",
      "Users need to compare several images side by side"
    ],
    "confusedWith": "A feed emphasizes order and density; a card emphasizes object boundary and media recognition.",
    "codeUI": [
      "ul and li, links, semantic time, load-more behavior, and accessible status"
    ],
    "media": [
      "List thumbnails may use external photos or illustrations, while all text stays in code"
    ],
    "prompt": "Create a news feed where each row contains a thumbnail, headline, category, and timestamp, ordered by time. Keep headlines readable on mobile and append results when loading more instead of resetting the list."
  },
  "media-tile": {
    "name": "Media Tile",
    "level": "Foundation",
    "tags": [
      "Image",
      "Video",
      "External media"
    ],
    "ask": "Create image or video tiles where the media leads and text only adds the title and type.",
    "definition": "A media tile uses an image or video as its primary identifier, with code-rendered labels and actions as a supporting layer.",
    "role": "It enables visual discovery in galleries, portfolios, media libraries, and exploration views.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Museum media tile code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Media slot",
        "Fixed ratio, object-fit, and loading placeholder"
      ],
      [
        "Label",
        "Type, duration, or status"
      ],
      [
        "Title",
        "Short and scannable"
      ],
      [
        "Action",
        "Play, save, or open details"
      ]
    ],
    "variants": [
      [
        "Grid tile",
        "Useful for visual browsing"
      ],
      [
        "Masonry tile",
        "Preserves different image heights"
      ],
      [
        "Video tile",
        "Requires a poster, controls, and pause behavior"
      ]
    ],
    "states": [
      [
        "Loading",
        "Uses an equal-size placeholder to prevent shift"
      ],
      [
        "Playing",
        "Controls and status are drawn in code"
      ],
      [
        "Failure",
        "Shows an image fallback and retry"
      ]
    ],
    "useWhen": [
      "The image or video is the primary content",
      "Users decide what to open by looking first"
    ],
    "avoidWhen": [
      "The image is decorative and text carries the task",
      "Placeholder media cannot guarantee authentic content or usage rights"
    ],
    "confusedWith": "A media tile is a content role; it cannot replace UI icons or navigation glyphs.",
    "codeUI": [
      "img or video, alt or poster, play and save buttons, and ratio constraints"
    ],
    "media": [
      "Photography, illustration, product cutouts, textures, and thumbnails"
    ],
    "prompt": "Build a media-tile grid using replaceable external URLs, fixed aspect ratios, and meaningful alt text. Render titles, buttons, and play icons in code, with real interactive controls in each tile."
  },
  "detail-panel": {
    "name": "Detail Panel",
    "level": "Advanced",
    "tags": [
      "Inspector",
      "Object details",
      "Hierarchy"
    ],
    "ask": "When I select an object, open its details beside the list so I can keep comparing it in context.",
    "definition": "A detail panel shows the selected object's full information, status, and actions within the current page context.",
    "role": "It reveals detail without losing the source list, grid, or workspace.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Museum detail panel code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Object summary",
        "Title, status, and primary media"
      ],
      [
        "Information groups",
        "Description, metadata, and history"
      ],
      [
        "Local actions",
        "Edit, save, share, or close"
      ],
      [
        "Context return",
        "Preserves the source list or breadcrumb"
      ]
    ],
    "variants": [
      [
        "Right inspector",
        "Keeps the desktop workspace list visible"
      ],
      [
        "Full-screen detail",
        "Fits mobile or complex objects"
      ],
      [
        "Inline expansion",
        "A light treatment for simple objects"
      ]
    ],
    "states": [
      [
        "Open and close",
        "Reversible with a clear focus destination"
      ],
      [
        "Loading",
        "Only panel content is replaced"
      ],
      [
        "Error",
        "Offers retry and return to the list"
      ]
    ],
    "useWhen": [
      "Users compare a list and its details",
      "The object has rich information but should not leave the task"
    ],
    "avoidWhen": [
      "The detail is only one line",
      "Opening begins a long independent workflow"
    ],
    "confusedWith": "A detail panel preserves context, a modal interrupts it, and a drawer is one possible container for the panel.",
    "codeUI": [
      "aside or dialog, focus management, close and return behavior, and responsive reflow"
    ],
    "media": [
      "Object media, photography, and illustration; all panel copy and status remain code"
    ],
    "prompt": "Show the selected object in a right-side detail panel on desktop while keeping the source list visible. Switch to full-screen detail with a back action on mobile, and make open, close, loading, and error states recoverable."
  }
};
