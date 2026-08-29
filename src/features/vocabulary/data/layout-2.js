export const layoutEntries2 = [
  {
    "id": "layout-split-pane",
    "name": "分隔面板",
    "en": "Split Pane Layout",
    "category": "layout",
    "level": "进阶",
    "tags": [
      "页面布局",
      "结构选择",
      "响应式"
    ],
    "ask": "左右两边都要一直看得到，中间的线还能拖动改变宽度。",
    "definition": "分隔面板用可调整的分隔线把同一工作区划成两个相互关联的区域。",
    "role": "让用户同时查看来源与结果、编辑与预览，减少来回切换。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "分隔面板的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "内容骨架",
        "先确定主要区域、顺序和视觉重心"
      ],
      [
        "空间规则",
        "明确列数、宽度、间距和内容比例"
      ],
      [
        "响应式变化",
        "说明窄屏如何重排而不是简单缩小"
      ],
      [
        "交互与状态",
        "覆盖加载、空内容和必要的操作反馈"
      ]
    ],
    "variants": [
      [
        "桌面方案",
        "代码编辑器、BI 看板、文件与详情对照"
      ],
      [
        "窄屏方案",
        "保留任务顺序并重新组织列与模块"
      ],
      [
        "增强方案",
        "在不破坏阅读顺序的前提下加入交互"
      ]
    ],
    "states": [
      [
        "默认",
        "核心内容与主要操作完整可见"
      ],
      [
        "窄屏",
        "列数减少，操作仍可触达"
      ],
      [
        "加载/空状态",
        "保持布局稳定并说明下一步"
      ]
    ],
    "useWhen": [
      "代码编辑器、BI 看板、文件与详情对照",
      "页面需要明确的整体结构而不是零散组件"
    ],
    "avoidWhen": [
      "手机窄屏或两个区域没有直接任务关系"
    ],
    "confusedWith": "分隔面板决定整页的空间组织，不等同于其中某一张卡片或某个首屏区块。",
    "codeUI": [
      "语义区域、CSS Grid/Flex、容器查询、稳定阅读顺序"
    ],
    "media": [
      "图片和视频是可替换内容，标题、控件和状态必须由代码渲染"
    ],
    "prompt": "请实现可拖动分隔面板：左侧最小 280px、右侧最小 360px，分隔线支持鼠标、触摸和键盘调整并提供 aria-valuenow；记住用户宽度，窄屏时切换为标签页或上下布局。",
    "related": [
      "layout-dashboard",
      "detail-panel",
      "responsive"
    ],
    "source": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout"
  },
  {
    "id": "layout-dashboard",
    "name": "仪表盘布局",
    "en": "Dashboard Layout",
    "category": "layout",
    "level": "进阶",
    "tags": [
      "页面布局",
      "结构选择",
      "响应式"
    ],
    "ask": "把关键数字、趋势和待办排成卡片，让人进来一眼扫完。",
    "definition": "仪表盘布局用网格组织指标、图表、状态和操作，并建立清晰的数据优先级。",
    "role": "把最重要的变化与异常放在首屏，支持快速监控和进一步下钻。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "仪表盘布局的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "内容骨架",
        "先确定主要区域、顺序和视觉重心"
      ],
      [
        "空间规则",
        "明确列数、宽度、间距和内容比例"
      ],
      [
        "响应式变化",
        "说明窄屏如何重排而不是简单缩小"
      ],
      [
        "交互与状态",
        "覆盖加载、空内容和必要的操作反馈"
      ]
    ],
    "variants": [
      [
        "桌面方案",
        "数据看板、监控台、B 端工作台"
      ],
      [
        "窄屏方案",
        "保留任务顺序并重新组织列与模块"
      ],
      [
        "增强方案",
        "在不破坏阅读顺序的前提下加入交互"
      ]
    ],
    "states": [
      [
        "默认",
        "核心内容与主要操作完整可见"
      ],
      [
        "窄屏",
        "列数减少，操作仍可触达"
      ],
      [
        "加载/空状态",
        "保持布局稳定并说明下一步"
      ]
    ],
    "useWhen": [
      "数据看板、监控台、B 端工作台",
      "页面需要明确的整体结构而不是零散组件"
    ],
    "avoidWhen": [
      "内容以连续阅读为主，或指标之间没有明确优先级"
    ],
    "confusedWith": "仪表盘布局决定整页的空间组织，不等同于其中某一张卡片或某个首屏区块。",
    "codeUI": [
      "语义区域、CSS Grid/Flex、容器查询、稳定阅读顺序"
    ],
    "media": [
      "图片和视频是可替换内容，标题、控件和状态必须由代码渲染"
    ],
    "prompt": "请设计响应式仪表盘：第一行放 4 个核心 KPI，第二行放主趋势图和异常列表，第三行放明细表；使用 12 列网格，标出时间范围和数据更新时间，并提供加载、空数据、错误和异常状态。",
    "related": [
      "layout-modular",
      "data-table",
      "card-grid"
    ],
    "source": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout"
  },
  {
    "id": "layout-modular",
    "name": "模块化布局",
    "en": "Modular Layout",
    "category": "layout",
    "level": "进阶",
    "tags": [
      "页面布局",
      "结构选择",
      "响应式"
    ],
    "ask": "页面像积木一样，每个模块能换位置、改大小，还能保存自己的排列。",
    "definition": "模块化布局把页面拆成可独立排列、缩放和配置的内容单元。",
    "role": "让不同用户围绕自己的任务重新组织首页或工作台。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "模块化布局的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "内容骨架",
        "先确定主要区域、顺序和视觉重心"
      ],
      [
        "空间规则",
        "明确列数、宽度、间距和内容比例"
      ],
      [
        "响应式变化",
        "说明窄屏如何重排而不是简单缩小"
      ],
      [
        "交互与状态",
        "覆盖加载、空内容和必要的操作反馈"
      ]
    ],
    "variants": [
      [
        "桌面方案",
        "个人主页、工作台、可定制博客首页"
      ],
      [
        "窄屏方案",
        "保留任务顺序并重新组织列与模块"
      ],
      [
        "增强方案",
        "在不破坏阅读顺序的前提下加入交互"
      ]
    ],
    "states": [
      [
        "默认",
        "核心内容与主要操作完整可见"
      ],
      [
        "窄屏",
        "列数减少，操作仍可触达"
      ],
      [
        "加载/空状态",
        "保持布局稳定并说明下一步"
      ]
    ],
    "useWhen": [
      "个人主页、工作台、可定制博客首页",
      "页面需要明确的整体结构而不是零散组件"
    ],
    "avoidWhen": [
      "内容顺序必须固定，或自由拖动会破坏关键流程"
    ],
    "confusedWith": "模块化布局决定整页的空间组织，不等同于其中某一张卡片或某个首屏区块。",
    "codeUI": [
      "语义区域、CSS Grid/Flex、容器查询、稳定阅读顺序"
    ],
    "media": [
      "图片和视频是可替换内容，标题、控件和状态必须由代码渲染"
    ],
    "prompt": "请实现模块化工作台：模块支持拖拽排序、跨列移动、尺寸切换、隐藏和恢复；使用可访问的键盘移动操作，显示放置预览，保存用户布局，并提供一键恢复默认排列。",
    "related": [
      "layout-single-column",
      "layout-masonry",
      "layout-dashboard"
    ],
    "source": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout"
  }
];

export const layoutEnglish2 = {
  "layout-split-pane": {
    "name": "Split Pane Layout",
    "level": "Advanced",
    "tags": [
      "Page layout",
      "Structure choice",
      "Responsive"
    ],
    "ask": "Keep both sides visible and let users drag the divider to change their widths.",
    "definition": "A split-pane layout divides one workspace into two related regions with an adjustable separator.",
    "role": "It keeps source and result, or editor and preview, visible together to reduce context switching.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Split Pane Layout code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Content skeleton",
        "Define the primary regions, sequence, and visual focus"
      ],
      [
        "Spatial rules",
        "Specify columns, width, gaps, and content ratios"
      ],
      [
        "Responsive change",
        "Explain narrow-screen reflow instead of simply shrinking"
      ],
      [
        "Interaction and state",
        "Cover loading, empty content, and necessary feedback"
      ]
    ],
    "variants": [
      [
        "Desktop",
        "Code editors, BI workspaces, and file-detail comparison"
      ],
      [
        "Narrow screen",
        "Preserve task order while reorganizing columns and modules"
      ],
      [
        "Enhanced",
        "Add interaction without breaking reading order"
      ]
    ],
    "states": [
      [
        "Default",
        "Core content and the primary action are visible"
      ],
      [
        "Narrow",
        "Columns reduce while actions remain reachable"
      ],
      [
        "Loading or empty",
        "The layout stays stable and explains the next step"
      ]
    ],
    "useWhen": [
      "Code editors, BI workspaces, and file-detail comparison",
      "The page needs a deliberate overall structure rather than isolated components"
    ],
    "avoidWhen": [
      "Avoid on narrow phones or when the two regions do not support one shared task"
    ],
    "confusedWith": "Split Pane Layout defines the spatial organization of a whole page, not one card or hero section inside it.",
    "codeUI": [
      "Semantic regions, CSS Grid or Flexbox, container queries, and stable source order"
    ],
    "media": [
      "Images and video remain replaceable content; headings, controls, and states stay code-rendered"
    ],
    "prompt": "Implement an adjustable split pane with a 280px minimum left side and 360px minimum right side. Support pointer, touch, and keyboard resizing with aria-valuenow, remember the chosen ratio, and switch to tabs or a stacked layout on narrow screens."
  },
  "layout-dashboard": {
    "name": "Dashboard Layout",
    "level": "Advanced",
    "tags": [
      "Page layout",
      "Structure choice",
      "Responsive"
    ],
    "ask": "Arrange key metrics, trends, and tasks into cards so the important state is scannable at a glance.",
    "definition": "A dashboard layout uses a grid to organize metrics, charts, status, and actions with clear data priority.",
    "role": "It surfaces important changes and exceptions first, supporting fast monitoring and drill-down.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Dashboard Layout code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Content skeleton",
        "Define the primary regions, sequence, and visual focus"
      ],
      [
        "Spatial rules",
        "Specify columns, width, gaps, and content ratios"
      ],
      [
        "Responsive change",
        "Explain narrow-screen reflow instead of simply shrinking"
      ],
      [
        "Interaction and state",
        "Cover loading, empty content, and necessary feedback"
      ]
    ],
    "variants": [
      [
        "Desktop",
        "Analytics dashboards, monitoring consoles, and enterprise workspaces"
      ],
      [
        "Narrow screen",
        "Preserve task order while reorganizing columns and modules"
      ],
      [
        "Enhanced",
        "Add interaction without breaking reading order"
      ]
    ],
    "states": [
      [
        "Default",
        "Core content and the primary action are visible"
      ],
      [
        "Narrow",
        "Columns reduce while actions remain reachable"
      ],
      [
        "Loading or empty",
        "The layout stays stable and explains the next step"
      ]
    ],
    "useWhen": [
      "Analytics dashboards, monitoring consoles, and enterprise workspaces",
      "The page needs a deliberate overall structure rather than isolated components"
    ],
    "avoidWhen": [
      "Avoid when content is primarily narrative or metrics have no defined priority"
    ],
    "confusedWith": "Dashboard Layout defines the spatial organization of a whole page, not one card or hero section inside it.",
    "codeUI": [
      "Semantic regions, CSS Grid or Flexbox, container queries, and stable source order"
    ],
    "media": [
      "Images and video remain replaceable content; headings, controls, and states stay code-rendered"
    ],
    "prompt": "Design a responsive dashboard with four core KPIs first, a primary trend and exception list second, and a detail table third. Use a 12-column grid, show the time range and freshness, and include loading, empty, error, and alert states."
  },
  "layout-modular": {
    "name": "Modular Layout",
    "level": "Advanced",
    "tags": [
      "Page layout",
      "Structure choice",
      "Responsive"
    ],
    "ask": "Make the page behave like building blocks whose modules can move, resize, and remember each user's arrangement.",
    "definition": "A modular layout breaks a page into content units that can be independently arranged, resized, and configured.",
    "role": "It lets different users organize a home page or workspace around their own tasks.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Modular Layout code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Content skeleton",
        "Define the primary regions, sequence, and visual focus"
      ],
      [
        "Spatial rules",
        "Specify columns, width, gaps, and content ratios"
      ],
      [
        "Responsive change",
        "Explain narrow-screen reflow instead of simply shrinking"
      ],
      [
        "Interaction and state",
        "Cover loading, empty content, and necessary feedback"
      ]
    ],
    "variants": [
      [
        "Desktop",
        "Personal pages, workspaces, and customizable blog homepages"
      ],
      [
        "Narrow screen",
        "Preserve task order while reorganizing columns and modules"
      ],
      [
        "Enhanced",
        "Add interaction without breaking reading order"
      ]
    ],
    "states": [
      [
        "Default",
        "Core content and the primary action are visible"
      ],
      [
        "Narrow",
        "Columns reduce while actions remain reachable"
      ],
      [
        "Loading or empty",
        "The layout stays stable and explains the next step"
      ]
    ],
    "useWhen": [
      "Personal pages, workspaces, and customizable blog homepages",
      "The page needs a deliberate overall structure rather than isolated components"
    ],
    "avoidWhen": [
      "Avoid when content order is mandatory or free arrangement would break a critical flow"
    ],
    "confusedWith": "Modular Layout defines the spatial organization of a whole page, not one card or hero section inside it.",
    "codeUI": [
      "Semantic regions, CSS Grid or Flexbox, container queries, and stable source order"
    ],
    "media": [
      "Images and video remain replaceable content; headings, controls, and states stay code-rendered"
    ],
    "prompt": "Build a modular workspace whose blocks support drag reordering, column movement, size changes, hiding, and restoration. Add accessible keyboard movement, show placement previews, persist the user's layout, and provide one-click reset."
  }
};
