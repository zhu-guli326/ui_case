export const layoutEntries1 = [
  {
    "id": "layout-single-column",
    "name": "单栏布局",
    "en": "Single Column Layout",
    "category": "layout",
    "level": "进阶",
    "tags": [
      "页面布局",
      "结构选择",
      "响应式"
    ],
    "ask": "内容一列通到底，让用户顺着读完，不要被侧栏打断。",
    "definition": "单栏布局把主要内容放进一条受控宽度的垂直阅读流。",
    "role": "用稳定的行宽和段落节奏降低阅读负担，突出连续叙事。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "单栏布局的代码组件预览",
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
        "博客、长文、产品介绍页"
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
      "博客、长文、产品介绍页",
      "页面需要明确的整体结构而不是零散组件"
    ],
    "avoidWhen": [
      "需要同时比较多组数据或频繁跨区操作"
    ],
    "confusedWith": "单栏布局决定整页的空间组织，不等同于其中某一张卡片或某个首屏区块。",
    "codeUI": [
      "语义区域、CSS Grid/Flex、容器查询、稳定阅读顺序"
    ],
    "media": [
      "图片和视频是可替换内容，标题、控件和状态必须由代码渲染"
    ],
    "prompt": "请使用单栏布局制作长内容页面：正文容器限制在 680–760px，标题、摘要、正文和文末行动纵向排列；桌面与手机都保持自然阅读顺序，并用段落间距而不是卡片边框区分章节。",
    "related": [
      "layout-landing-page",
      "typography",
      "responsive"
    ],
    "source": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout"
  },
  {
    "id": "layout-landing-page",
    "name": "落地页布局",
    "en": "Landing Page Layout",
    "category": "layout",
    "level": "进阶",
    "tags": [
      "页面布局",
      "结构选择",
      "响应式"
    ],
    "ask": "先用大图和一句话讲清价值，再介绍功能，最后把行动收住。",
    "definition": "落地页布局按认知、证明和转化组织连续区段。",
    "role": "让用户沿着一条明确叙事从看懂产品走到采取行动。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "落地页布局的代码组件预览",
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
        "SaaS 官网、App 下载页、活动推广页"
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
      "SaaS 官网、App 下载页、活动推广页",
      "页面需要明确的整体结构而不是零散组件"
    ],
    "avoidWhen": [
      "高频工具、复杂后台或没有单一转化目标的页面"
    ],
    "confusedWith": "落地页布局决定整页的空间组织，不等同于其中某一张卡片或某个首屏区块。",
    "codeUI": [
      "语义区域、CSS Grid/Flex、容器查询、稳定阅读顺序"
    ],
    "media": [
      "图片和视频是可替换内容，标题、控件和状态必须由代码渲染"
    ],
    "prompt": "请设计一页完整落地页：大图首屏只保留一个主 CTA，之后依次放价值点、产品截图、使用场景、社会证明和结尾 CTA；每个区段承担一个问题，移动端保持相同叙事顺序。",
    "related": [
      "layout-fullscreen",
      "hero",
      "cta"
    ],
    "source": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout"
  },
  {
    "id": "layout-masonry",
    "name": "瀑布流布局",
    "en": "Masonry Layout",
    "category": "layout",
    "level": "进阶",
    "tags": [
      "页面布局",
      "结构选择",
      "响应式"
    ],
    "ask": "图片高矮不一也要紧密排下去，继续滚动时不要出现大片空白。",
    "definition": "瀑布流布局把不同高度的内容按列紧密排列，弱化严格的横向行对齐。",
    "role": "最大化视觉内容密度，同时保留每张图片原本的比例和差异。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "瀑布流布局的代码组件预览",
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
        "灵感采集站、作品墙、电商内容流"
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
      "灵感采集站、作品墙、电商内容流",
      "页面需要明确的整体结构而不是零散组件"
    ],
    "avoidWhen": [
      "需要逐行比较、严格排序或键盘阅读顺序必须完全可见"
    ],
    "confusedWith": "瀑布流布局决定整页的空间组织，不等同于其中某一张卡片或某个首屏区块。",
    "codeUI": [
      "语义区域、CSS Grid/Flex、容器查询、稳定阅读顺序"
    ],
    "media": [
      "图片和视频是可替换内容，标题、控件和状态必须由代码渲染"
    ],
    "prompt": "请实现响应式瀑布流：桌面 4 列、平板 3 列、手机 2 列，卡片保持图片原始比例并使用稳定间距；懒加载时预留尺寸，新增内容不能造成页面跳动，DOM 阅读顺序保持可预测。",
    "related": [
      "layout-modular",
      "media-tile",
      "card-grid"
    ],
    "source": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout"
  },
  {
    "id": "layout-fullscreen",
    "name": "全屏沉浸式",
    "en": "Fullscreen Immersive Layout",
    "category": "layout",
    "level": "进阶",
    "tags": [
      "页面布局",
      "结构选择",
      "响应式"
    ],
    "ask": "首屏让画面占满，只留一句主标题，用户一进来就进入氛围。",
    "definition": "全屏沉浸式布局让一个视觉场景占据完整视口，并把界面控制降到最低。",
    "role": "先建立情绪、世界观或发布瞬间，再引导用户进入后续内容。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "全屏沉浸式的代码组件预览",
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
        "品牌官网、发布会页、游戏站"
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
      "品牌官网、发布会页、游戏站",
      "页面需要明确的整体结构而不是零散组件"
    ],
    "avoidWhen": [
      "用户需要立即扫读大量信息或完成高频任务"
    ],
    "confusedWith": "全屏沉浸式决定整页的空间组织，不等同于其中某一张卡片或某个首屏区块。",
    "codeUI": [
      "语义区域、CSS Grid/Flex、容器查询、稳定阅读顺序"
    ],
    "media": [
      "图片和视频是可替换内容，标题、控件和状态必须由代码渲染"
    ],
    "prompt": "请制作一个 100dvh 的全屏沉浸式首屏：背景图片或视频完整铺满，页面只保留一句主标题、一个低干扰入口和向下滚动提示；为文字设置安全区与遮罩，并支持 reduced-motion 和移动端裁切。",
    "related": [
      "layout-split-pane",
      "hero",
      "layout-landing-page"
    ],
    "source": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout"
  }
];

export const layoutEnglish1 = {
  "layout-single-column": {
    "name": "Single Column Layout",
    "level": "Advanced",
    "tags": [
      "Page layout",
      "Structure choice",
      "Responsive"
    ],
    "ask": "Keep the content in one continuous column so readers can move through it without sidebar distractions.",
    "definition": "A single-column layout places primary content in one controlled-width vertical reading flow.",
    "role": "It reduces reading effort with stable line length and pacing while emphasizing continuous narrative.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Single Column Layout code component preview",
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
        "Blogs, long-form articles, and product introductions"
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
      "Blogs, long-form articles, and product introductions",
      "The page needs a deliberate overall structure rather than isolated components"
    ],
    "avoidWhen": [
      "Avoid when users must compare several data groups or act across regions"
    ],
    "confusedWith": "Single Column Layout defines the spatial organization of a whole page, not one card or hero section inside it.",
    "codeUI": [
      "Semantic regions, CSS Grid or Flexbox, container queries, and stable source order"
    ],
    "media": [
      "Images and video remain replaceable content; headings, controls, and states stay code-rendered"
    ],
    "prompt": "Build a long-form page with a single-column layout. Keep the reading container between 680 and 760px, stack the title, summary, body, and final action vertically, preserve natural source order on desktop and mobile, and separate sections with spacing rather than card borders."
  },
  "layout-landing-page": {
    "name": "Landing Page Layout",
    "level": "Advanced",
    "tags": [
      "Page layout",
      "Structure choice",
      "Responsive"
    ],
    "ask": "Open with one strong value statement and image, explain the benefits, then close with a focused action.",
    "definition": "A landing-page layout sequences sections around understanding, proof, and conversion.",
    "role": "It moves visitors through a clear narrative from understanding the offer to taking action.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Landing Page Layout code component preview",
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
        "SaaS sites, app download pages, and campaign pages"
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
      "SaaS sites, app download pages, and campaign pages",
      "The page needs a deliberate overall structure rather than isolated components"
    ],
    "avoidWhen": [
      "Avoid for frequent-use tools, complex admin products, or pages without one conversion goal"
    ],
    "confusedWith": "Landing Page Layout defines the spatial organization of a whole page, not one card or hero section inside it.",
    "codeUI": [
      "Semantic regions, CSS Grid or Flexbox, container queries, and stable source order"
    ],
    "media": [
      "Images and video remain replaceable content; headings, controls, and states stay code-rendered"
    ],
    "prompt": "Design a complete landing page with a large hero and one primary CTA, followed by value points, product proof, use cases, social proof, and a final CTA. Give each section one job and preserve the narrative order on mobile."
  },
  "layout-masonry": {
    "name": "Masonry Layout",
    "level": "Advanced",
    "tags": [
      "Page layout",
      "Structure choice",
      "Responsive"
    ],
    "ask": "Pack images of different heights tightly and keep the feed flowing without large gaps.",
    "definition": "A masonry layout packs variable-height content into columns without enforcing strict horizontal rows.",
    "role": "It maximizes visual density while preserving each item's natural ratio and variation.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Masonry Layout code component preview",
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
        "Inspiration boards, portfolios, and commerce content feeds"
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
      "Inspiration boards, portfolios, and commerce content feeds",
      "The page needs a deliberate overall structure rather than isolated components"
    ],
    "avoidWhen": [
      "Avoid when row comparison, strict ordering, or obvious keyboard reading order is essential"
    ],
    "confusedWith": "Masonry Layout defines the spatial organization of a whole page, not one card or hero section inside it.",
    "codeUI": [
      "Semantic regions, CSS Grid or Flexbox, container queries, and stable source order"
    ],
    "media": [
      "Images and video remain replaceable content; headings, controls, and states stay code-rendered"
    ],
    "prompt": "Implement a responsive masonry feed with four desktop columns, three tablet columns, and two mobile columns. Preserve image ratios and stable gaps, reserve dimensions during lazy loading, prevent layout shift, and keep DOM reading order predictable."
  },
  "layout-fullscreen": {
    "name": "Fullscreen Immersive Layout",
    "level": "Advanced",
    "tags": [
      "Page layout",
      "Structure choice",
      "Responsive"
    ],
    "ask": "Let the visual fill the first screen and keep only one headline so visitors enter the atmosphere immediately.",
    "definition": "A fullscreen immersive layout gives one visual scene the entire viewport and minimizes interface chrome.",
    "role": "It establishes mood, world-building, or a launch moment before guiding users into deeper content.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Fullscreen Immersive Layout code component preview",
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
        "Brand sites, launch pages, and game sites"
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
      "Brand sites, launch pages, and game sites",
      "The page needs a deliberate overall structure rather than isolated components"
    ],
    "avoidWhen": [
      "Avoid when users must scan dense information or complete frequent tasks immediately"
    ],
    "confusedWith": "Fullscreen Immersive Layout defines the spatial organization of a whole page, not one card or hero section inside it.",
    "codeUI": [
      "Semantic regions, CSS Grid or Flexbox, container queries, and stable source order"
    ],
    "media": [
      "Images and video remain replaceable content; headings, controls, and states stay code-rendered"
    ],
    "prompt": "Create a 100dvh immersive hero with full-bleed image or video, one headline, one low-noise entry action, and a scroll cue. Protect the text with a safe area and overlay, and support reduced motion plus mobile cropping."
  }
};
