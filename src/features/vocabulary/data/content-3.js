export const contentEntries3 = [
  {
    "id": "carousel-accordion",
    "name": "手风琴画廊",
    "en": "Accordion Gallery",
    "category": "content",
    "level": "进阶",
    "tags": [
      "轮播形式",
      "动效",
      "内容展示"
    ],
    "ask": "一排图片只露出窄边，鼠标移入哪张哪张展开。",
    "definition": "手风琴画廊是一种有明确过渡逻辑的图片轮播，不只是默认的左右滑加圆点。",
    "role": "先根据内容场景选择运动方式，再明确手势、速度、层级和可访问的静态降级。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "手风琴画廊代码组件预览",
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
        "一排图片只露出窄边，鼠标移入哪张哪张展开。"
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
        "作品墙、案例浏览"
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
        "每张图露出边缘，当前图保持展开"
      ],
      [
        "展开中",
        "指针所在图片扩大，其余图片收窄但仍可识别"
      ],
      [
        "停留",
        "停止自动展开，当前图片保持可点击"
      ]
    ],
    "useWhen": [
      "作品墙、案例浏览",
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
    "prompt": "一排图片只露出窄边，鼠标移入哪张哪张展开。 请同时定义当前索引、拖拽/键盘操作、自动播放暂停规则、触摸目标和 reduced-motion 降级，不要只做左右箭头和圆点。",
    "related": [
      "media-tile",
      "card",
      "responsive",
      "carousel-fade",
      "carousel-3d",
      "carousel-stack",
      "carousel-page",
      "carousel-360",
      "carousel-parallax"
    ],
    "source": "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type"
  },
  {
    "id": "carousel-360",
    "name": "360° 旋转展示",
    "en": "360° Product Spin",
    "category": "content",
    "level": "进阶",
    "tags": [
      "轮播形式",
      "动效",
      "内容展示"
    ],
    "ask": "按住拖动一圈查看产品不同角度，适合商品展示。",
    "definition": "360° 旋转展示是一种有明确过渡逻辑的图片轮播，不只是默认的左右滑加圆点。",
    "role": "先根据内容场景选择运动方式，再明确手势、速度、层级和可访问的静态降级。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "360° 旋转展示代码组件预览",
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
        "按住拖动一圈查看产品不同角度，适合商品展示。"
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
        "电商产品、家具、鞋包"
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
        "产品正面和拖动提示清晰可见"
      ],
      [
        "拖动中",
        "产品角度随水平拖动变化，并保留主体比例"
      ],
      [
        "暂停",
        "停止旋转，当前角度保持不变"
      ]
    ],
    "useWhen": [
      "电商产品、家具、鞋包",
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
    "prompt": "按住拖动一圈查看产品不同角度，适合商品展示。 请同时定义当前索引、拖拽/键盘操作、自动播放暂停规则、触摸目标和 reduced-motion 降级，不要只做左右箭头和圆点。",
    "related": [
      "media-tile",
      "card",
      "responsive",
      "carousel-fade",
      "carousel-3d",
      "carousel-stack",
      "carousel-page",
      "carousel-accordion",
      "carousel-parallax"
    ],
    "source": "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type"
  },
  {
    "id": "carousel-parallax",
    "name": "视差轮播",
    "en": "Parallax Carousel",
    "category": "content",
    "level": "进阶",
    "tags": [
      "轮播形式",
      "动效",
      "内容展示"
    ],
    "ask": "前景图片与背景以不同速度滚动，形成有层次的活动首屏。",
    "definition": "视差轮播是一种有明确过渡逻辑的图片轮播，不只是默认的左右滑加圆点。",
    "role": "先根据内容场景选择运动方式，再明确手势、速度、层级和可访问的静态降级。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "视差轮播代码组件预览",
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
        "前景图片与背景以不同速度滚动，形成有层次的活动首屏。"
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
        "品牌页、活动主页"
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
        "前景和背景分层显示，层级关系清楚"
      ],
      [
        "滚动中",
        "前景移动更快，背景缓慢移动形成深度"
      ],
      [
        "减弱动效",
        "关闭错速移动，改为稳定的静态浏览"
      ]
    ],
    "useWhen": [
      "品牌页、活动主页",
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
    "prompt": "前景图片与背景以不同速度滚动，形成有层次的活动首屏。 请同时定义当前索引、拖拽/键盘操作、自动播放暂停规则、触摸目标和 reduced-motion 降级，不要只做左右箭头和圆点。",
    "related": [
      "media-tile",
      "card",
      "responsive",
      "carousel-fade",
      "carousel-3d",
      "carousel-stack",
      "carousel-page",
      "carousel-accordion",
      "carousel-360"
    ],
    "source": "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type"
  }
];

export const contentEnglish3 = {
  "carousel-accordion": {
    "name": "Accordion Gallery",
    "level": "Advanced",
    "tags": [
      "Carousel",
      "Motion",
      "Content display"
    ],
    "ask": "Expose a narrow edge for each image and expand the one under the pointer.",
    "definition": "A carousel pattern defines how a sequence of visual items moves, transitions, and remains navigable.",
    "role": "Choose the motion model for the content scenario, then specify gestures, timing, hierarchy, and an accessible static fallback.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Accordion Gallery code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "states": [
      [
        "Default",
        "Each image exposes an edge and the active image stays open"
      ],
      [
        "Expanding",
        "The hovered image widens while the others remain identifiable"
      ],
      [
        "Settled",
        "Auto-expansion stops and the active image stays clickable"
      ]
    ],
    "useWhen": [
      "作品墙、案例浏览",
      "When several visual items need a continuous story"
    ],
    "avoidWhen": [
      "When users must compare every item at once or motion harms task efficiency"
    ],
    "confusedWith": "A carousel pattern controls movement and transition; it is not the image asset or the page layout.",
    "prompt": "Expose a narrow edge for each image and expand the one under the pointer. Define the active index, drag and keyboard behavior, autoplay pause rules, touch targets, and a reduced-motion fallback instead of only adding arrows and dots."
  },
  "carousel-360": {
    "name": "360° Product Spin",
    "level": "Advanced",
    "tags": [
      "Carousel",
      "Motion",
      "Content display"
    ],
    "ask": "Let users drag around a full rotation to inspect a product from every angle.",
    "definition": "A carousel pattern defines how a sequence of visual items moves, transitions, and remains navigable.",
    "role": "Choose the motion model for the content scenario, then specify gestures, timing, hierarchy, and an accessible static fallback.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "360° Product Spin code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "states": [
      [
        "Default",
        "The product face and drag hint remain clear"
      ],
      [
        "Dragging",
        "The product angle follows horizontal drag while preserving scale"
      ],
      [
        "Paused",
        "Rotation stops and the current angle stays in place"
      ]
    ],
    "useWhen": [
      "电商产品、家具、鞋包",
      "When several visual items need a continuous story"
    ],
    "avoidWhen": [
      "When users must compare every item at once or motion harms task efficiency"
    ],
    "confusedWith": "A carousel pattern controls movement and transition; it is not the image asset or the page layout.",
    "prompt": "Let users drag around a full rotation to inspect a product from every angle. Define the active index, drag and keyboard behavior, autoplay pause rules, touch targets, and a reduced-motion fallback instead of only adding arrows and dots."
  },
  "carousel-parallax": {
    "name": "Parallax Carousel",
    "level": "Advanced",
    "tags": [
      "Carousel",
      "Motion",
      "Content display"
    ],
    "ask": "Move foreground and background layers at different speeds to create depth in a campaign hero.",
    "definition": "A carousel pattern defines how a sequence of visual items moves, transitions, and remains navigable.",
    "role": "Choose the motion model for the content scenario, then specify gestures, timing, hierarchy, and an accessible static fallback.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Parallax Carousel code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "states": [
      [
        "Default",
        "Foreground and background layers establish a clear depth order"
      ],
      [
        "Scrolling",
        "Foreground moves faster than the background to create depth"
      ],
      [
        "Reduced motion",
        "Layered movement is disabled for stable browsing"
      ]
    ],
    "useWhen": [
      "品牌页、活动主页",
      "When several visual items need a continuous story"
    ],
    "avoidWhen": [
      "When users must compare every item at once or motion harms task efficiency"
    ],
    "confusedWith": "A carousel pattern controls movement and transition; it is not the image asset or the page layout.",
    "prompt": "Move foreground and background layers at different speeds to create depth in a campaign hero. Define the active index, drag and keyboard behavior, autoplay pause rules, touch targets, and a reduced-motion fallback instead of only adding arrows and dots."
  }
};
