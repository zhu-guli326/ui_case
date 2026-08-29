export const navigationEntries1 = [
  {
    "id": "top-nav",
    "name": "顶部导航栏",
    "en": "Navbar",
    "category": "navigation",
    "level": "基础",
    "tags": [
      "导航",
      "code-ui",
      "全局"
    ],
    "ask": "logo、主要栏目和登录入口都放在最上面，还要看得出当前在哪。",
    "definition": "顶部导航栏是网站级的主要导航和全局操作区域，通常位于页面顶部并可吸顶。",
    "role": "让用户快速在主要栏目之间切换，同时提供搜索、主题或账户入口。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "顶部导航栏的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "品牌入口",
        "回到首页或产品起点"
      ],
      [
        "一级链接",
        "主要栏目，控制数量"
      ],
      [
        "当前标记",
        "颜色、下划线或背景表达位置"
      ],
      [
        "全局操作",
        "搜索、语言、主题、账户"
      ]
    ],
    "variants": [
      [
        "标准导航",
        "品牌 + 链接 + 操作"
      ],
      [
        "居中品牌",
        "适合内容和品牌导向网站"
      ],
      [
        "透明/覆盖",
        "适合首屏媒体，但需加强对比度"
      ]
    ],
    "states": [
      [
        "吸顶",
        "滚动后仍可访问，但不遮挡内容"
      ],
      [
        "菜单展开",
        "移动端抽屉或下拉菜单"
      ],
      [
        "当前项",
        "不仅依赖颜色，补充文字/线条"
      ]
    ],
    "useWhen": [
      "网站有多个主要栏目",
      "用户需要跨页面快速切换"
    ],
    "avoidWhen": [
      "单任务流程中会分散注意力",
      "导航项目多到无法扫描"
    ],
    "confusedWith": "顶部导航栏组织站点入口；页头可以包含它，也可以只包含页面标题。",
    "codeUI": [
      "nav、a、button、aria-current、移动菜单焦点管理"
    ],
    "media": [
      "导航与 logo 由代码或矢量资源呈现，不使用外部图片占位"
    ],
    "prompt": "请做一条克制的顶部导航：左侧品牌，中间 4 个以内的一级入口，右侧搜索与账户；当前入口使用 aria-current 和明显视觉状态，移动端把链接收进可关闭菜单。",
    "related": [
      "header",
      "sidebar",
      "menu",
      "app-shell",
      "bottom-tabs"
    ],
    "source": "https://www.w3.org/WAI/ARIA/apg/patterns/menubar/"
  },
  {
    "id": "sidebar",
    "name": "侧边栏",
    "en": "Sidebar",
    "category": "navigation",
    "level": "基础",
    "tags": [
      "导航",
      "工作台",
      "响应式"
    ],
    "ask": "左边固定一列放工作区和主要入口，内容滚动时它还在。",
    "definition": "侧边栏是在主内容旁持续呈现导航、筛选或上下文工具的纵向区域。",
    "role": "它让高频入口始终可见，适合信息密度较高、需要频繁切换上下文的桌面工作流。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "侧边栏的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "区域标题",
        "说明当前产品、工作区或导航范围"
      ],
      [
        "导航分组",
        "按任务或层级组织入口"
      ],
      [
        "当前项",
        "使用 aria-current 和稳定视觉标记"
      ],
      [
        "收起策略",
        "窄屏转为抽屉、图标轨或底部入口"
      ]
    ],
    "variants": [
      [
        "固定侧栏",
        "桌面工作台和后台"
      ],
      [
        "可折叠侧栏",
        "在内容宽度与快速访问之间切换"
      ],
      [
        "上下文侧栏",
        "展示当前对象的大纲、筛选或属性"
      ]
    ],
    "states": [
      [
        "展开",
        "标签和分组完整可见"
      ],
      [
        "收起",
        "只保留有可访问名称的图标"
      ],
      [
        "移动端",
        "作为可关闭抽屉出现，不遮住返回路径"
      ]
    ],
    "useWhen": [
      "一级入口较多且用户频繁切换",
      "桌面端需要持续显示工作区上下文"
    ],
    "avoidWhen": [
      "只有少量页面，顶部导航更直接",
      "内容本身需要全宽沉浸展示"
    ],
    "confusedWith": "侧边栏是页面布局区域；抽屉是临时浮层，两者在窄屏可以互相转换。",
    "codeUI": [
      "aside/nav、分组链接、aria-current、焦点顺序、折叠状态"
    ],
    "media": [
      "入口文字和图标由代码渲染；仅对象缩略图可使用外部图片"
    ],
    "prompt": "请实现桌面左侧 Sidebar：按组展示主要入口并标记当前页，内容区独立滚动；窄屏改成可关闭 Drawer，收起为图标时每个入口仍有可访问名称和 tooltip。",
    "related": [
      "app-shell",
      "top-nav",
      "drawer",
      "responsive"
    ],
    "source": "https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/navigation.html"
  },
  {
    "id": "breadcrumbs",
    "name": "面包屑",
    "en": "Breadcrumbs",
    "category": "navigation",
    "level": "基础",
    "tags": [
      "导航",
      "层级",
      "定位"
    ],
    "ask": "在标题上方显示我从项目到文件夹再到当前页面的路径。",
    "definition": "面包屑用一串层级链接展示当前页面在信息架构中的位置。",
    "role": "它帮助用户理解上下级关系，并快速返回任意祖先层级，而不替代主要导航。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "面包屑的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "导航容器",
        "使用带名称的 nav landmark"
      ],
      [
        "祖先链接",
        "从根层级按顺序排列"
      ],
      [
        "分隔符",
        "只作视觉表达，不进入无障碍名称"
      ],
      [
        "当前页",
        "最后一项不跳转并标记 aria-current=page"
      ]
    ],
    "variants": [
      [
        "完整路径",
        "层级较浅的文档和后台"
      ],
      [
        "折叠路径",
        "窄屏隐藏中间层级但保留返回"
      ],
      [
        "对象路径",
        "项目、文件夹、文件等层级"
      ]
    ],
    "states": [
      [
        "默认",
        "当前页与可点击祖先明显区分"
      ],
      [
        "过长",
        "中间项折叠，首尾层级仍可识别"
      ],
      [
        "窄屏",
        "允许换行或缩短，不制造页面横向滚动"
      ]
    ],
    "useWhen": [
      "内容有稳定的父子层级",
      "用户可能从搜索或深链接直接进入详情"
    ],
    "avoidWhen": [
      "页面是线性步骤流程",
      "站点只有一层或层级经常变化"
    ],
    "confusedWith": "面包屑表达信息层级；返回按钮表达浏览历史，两者不是同一件事。",
    "codeUI": [
      "nav、ol、真实链接、aria-label、aria-current、CSS 分隔符"
    ],
    "media": [
      "路径文字和分隔符全部由代码渲染，不需要图片"
    ],
    "prompt": "请在页面标题上方添加可访问 Breadcrumbs：使用 nav + ol，祖先项为真实链接，当前页使用 aria-current=page；分隔符通过 CSS 呈现，窄屏折叠中间层级但保留起点和当前页。",
    "related": [
      "header",
      "top-nav",
      "detail-panel"
    ],
    "source": "https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/"
  },
  {
    "id": "bottom-tabs",
    "name": "底部标签栏",
    "en": "Bottom Tab Bar",
    "category": "navigation",
    "level": "基础",
    "tags": [
      "移动端",
      "导航",
      "code-icon"
    ],
    "ask": "手机底部固定几个入口，首页、收藏和个人资料随时能切换。",
    "definition": "底部标签栏是移动端的一级导航容器，固定在屏幕底部并展示少量高频目的地。",
    "role": "减少返回成本，让用户在几个核心页面之间快速切换。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "底部标签栏的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "标签项",
        "图标 + 短标签，控制在 3-5 项"
      ],
      [
        "选中态",
        "图标、颜色和文字共同表达"
      ],
      [
        "安全区",
        "适配 iOS home indicator"
      ],
      [
        "徽标",
        "只在有未读信息时出现"
      ]
    ],
    "variants": [
      [
        "图标 + 文字",
        "最容易理解，适合主导航"
      ],
      [
        "仅图标",
        "只适合熟悉用户和极少入口"
      ],
      [
        "中心主操作",
        "把创建或发布作为突出入口"
      ]
    ],
    "states": [
      [
        "选中",
        "不可只靠颜色，保持文字可见"
      ],
      [
        "键盘/读屏",
        "每项有可访问名称和当前页"
      ],
      [
        "滚动",
        "可保持或隐藏，但必须可恢复"
      ]
    ],
    "useWhen": [
      "移动端有 3-5 个高频一级页面",
      "用户经常跨页面切换"
    ],
    "avoidWhen": [
      "入口超过 5 个",
      "页面需要沉浸式全屏操作"
    ],
    "confusedWith": "底部标签栏是一级导航；工具栏或操作栏不应该混进来。",
    "codeUI": [
      "nav、button/link、统一 SVG 图标、safe-area-inset-bottom"
    ],
    "media": [
      "图标、标签和选中态全部由代码呈现，不需要配图"
    ],
    "prompt": "请为移动端添加 4 项底部标签栏，固定在 safe-area 上方；每项包含统一线性图标和短标签，当前页使用 aria-current，内容滚动时不能遮挡最后一项。",
    "related": [
      "tabs",
      "app-shell",
      "top-nav"
    ],
    "source": "https://m3.material.io/components/navigation-bar/overview"
  },
  {
    "id": "tabs",
    "name": "标签页",
    "en": "Tabs",
    "category": "navigation",
    "level": "基础",
    "tags": [
      "切换",
      "内容组织",
      "code-control"
    ],
    "ask": "内容太多了，分几个页签，点一下就在同一块区域换内容。",
    "definition": "标签页在同一语境中切换互相关联的内容面板，不应被用来隐藏完全不同的任务。",
    "role": "降低页面高度和认知负担，让用户在同一上下文比较或浏览内容。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "标签页的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "标签列表",
        "短标题，顺序表达内容关系"
      ],
      [
        "选中指示",
        "下划线、底色或高对比"
      ],
      [
        "面板",
        "与标签一一对应"
      ],
      [
        "键盘行为",
        "左右键切换，Tab 进入面板"
      ]
    ],
    "variants": [
      [
        "线性标签",
        "轻量、适合内容阅读"
      ],
      [
        "胶囊标签",
        "适合筛选和视图切换"
      ],
      [
        "滚动标签",
        "窄屏容纳较多同级内容"
      ]
    ],
    "states": [
      [
        "选中",
        "保持焦点和面板同步"
      ],
      [
        "禁用",
        "说明为什么不可用"
      ],
      [
        "加载",
        "只替换面板，不抖动标签栏"
      ]
    ],
    "useWhen": [
      "同一对象有 2-5 组并列内容",
      "用户需要在同一语境内来回比较"
    ],
    "avoidWhen": [
      "每个标签都是完全独立的任务",
      "标签数量多到无法扫描"
    ],
    "confusedWith": "Tabs 切换内容面板；分段控件更像切换一个视图模式或筛选值。",
    "codeUI": [
      "button、role=tab、aria-controls、键盘方向键与面板隐藏"
    ],
    "media": [
      "标签文字与选中态必须由代码渲染"
    ],
    "prompt": "请实现一组可访问 Tabs：标签与面板一一对应，支持键盘左右切换和深链接；切换时不重置滚动位置，移动端允许横向滚动但不能出现页面横向溢出。",
    "related": [
      "segmented",
      "filter-chips",
      "bottom-tabs"
    ],
    "source": "https://www.w3.org/WAI/ARIA/apg/patterns/tabs/"
  }
];

export const navigationEnglish1 = {
  "top-nav": {
    "name": "Navbar",
    "level": "Foundation",
    "tags": [
      "Navigation",
      "Code UI",
      "Global"
    ],
    "ask": "Put the logo, primary sections, and sign-in entry at the top, and make the current location clear.",
    "definition": "A top navigation bar contains site-level destinations and global actions, usually at the top of the page and sometimes sticky.",
    "role": "It lets users move quickly between major sections while keeping search, theme, or account actions available.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "News product top navigation code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Brand link",
        "Returns to the home or product starting point"
      ],
      [
        "Primary links",
        "A controlled number of major destinations"
      ],
      [
        "Current marker",
        "Color, underline, or background shows location"
      ],
      [
        "Global actions",
        "Search, language, theme, and account"
      ]
    ],
    "variants": [
      [
        "Standard navbar",
        "Brand, links, and actions"
      ],
      [
        "Centered brand",
        "Useful for editorial and brand-led sites"
      ],
      [
        "Transparent overlay",
        "Works on hero media when contrast is reinforced"
      ]
    ],
    "states": [
      [
        "Sticky",
        "Remains reachable without covering content"
      ],
      [
        "Menu open",
        "Uses a mobile drawer or dropdown"
      ],
      [
        "Current item",
        "Uses text or shape in addition to color"
      ]
    ],
    "useWhen": [
      "A site has multiple primary sections",
      "Users need to switch between pages quickly"
    ],
    "avoidWhen": [
      "A single-task flow needs concentration",
      "There are too many destinations to scan"
    ],
    "confusedWith": "A navbar organizes site destinations; a header may contain it or may only provide page context.",
    "codeUI": [
      "nav, links, buttons, aria-current, and mobile-menu focus management"
    ],
    "media": [
      "Navigation and logos use code or vector resources and do not need placeholder imagery"
    ],
    "prompt": "Build a restrained top navbar with the brand on the left, no more than four primary destinations in the middle, and search plus account on the right. Mark the current item with aria-current and a visible state, then move links into a closable menu on mobile."
  },
  "sidebar": {
    "name": "Sidebar",
    "level": "Foundation",
    "tags": [
      "Navigation",
      "Workspace",
      "Responsive"
    ],
    "ask": "Keep workspaces and primary destinations in a column on the left while the main content scrolls.",
    "definition": "A sidebar is a vertical region beside the main content that persistently presents navigation, filters, or contextual tools.",
    "role": "It keeps frequent destinations visible in dense desktop workflows where users switch context often.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Sidebar code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Region heading",
        "Names the product, workspace, or navigation scope"
      ],
      [
        "Navigation groups",
        "Organize destinations by task or hierarchy"
      ],
      [
        "Current item",
        "Uses aria-current and a stable visual marker"
      ],
      [
        "Collapse strategy",
        "Becomes a drawer, rail, or bottom destination on narrow screens"
      ]
    ],
    "variants": [
      [
        "Fixed sidebar",
        "Desktop workspaces and admin tools"
      ],
      [
        "Collapsible sidebar",
        "Balances content width with quick access"
      ],
      [
        "Context sidebar",
        "Shows an outline, filters, or properties for the current object"
      ]
    ],
    "states": [
      [
        "Expanded",
        "Labels and groups remain fully visible"
      ],
      [
        "Collapsed",
        "Icons retain accessible names"
      ],
      [
        "Mobile",
        "Appears as a closable drawer with a clear return path"
      ]
    ],
    "useWhen": [
      "There are many primary destinations and frequent switching",
      "Desktop workflows need persistent workspace context"
    ],
    "avoidWhen": [
      "A few pages fit better in top navigation",
      "Content needs a full-width immersive canvas"
    ],
    "confusedWith": "A sidebar is a layout region; a drawer is a temporary overlay. A responsive design can transform one into the other.",
    "codeUI": [
      "aside/nav, grouped links, aria-current, focus order, and collapse state"
    ],
    "media": [
      "Labels and icons stay code-rendered; only object thumbnails may use external images"
    ],
    "prompt": "Build a desktop left sidebar with grouped primary destinations and a clear current-page state while the content area scrolls independently. Convert it to a closable drawer on narrow screens and keep accessible names and tooltips when labels collapse."
  },
  "breadcrumbs": {
    "name": "Breadcrumbs",
    "level": "Foundation",
    "tags": [
      "Navigation",
      "Hierarchy",
      "Wayfinding"
    ],
    "ask": "Show the path from the project to the folder and current page above the title.",
    "definition": "Breadcrumbs are a sequence of hierarchical links that reveal the current page's position in the information architecture.",
    "role": "They help users understand parent-child relationships and return to any ancestor without replacing primary navigation.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Breadcrumbs code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Navigation landmark",
        "Uses a named nav region"
      ],
      [
        "Ancestor links",
        "Runs from the root toward the current page"
      ],
      [
        "Separators",
        "Remain visual and outside accessible names"
      ],
      [
        "Current page",
        "Is not linked and uses aria-current=page"
      ]
    ],
    "variants": [
      [
        "Full path",
        "Shallow documentation and admin hierarchies"
      ],
      [
        "Collapsed path",
        "Hides middle levels on narrow screens"
      ],
      [
        "Object path",
        "Project, folder, and file hierarchies"
      ]
    ],
    "states": [
      [
        "Default",
        "Current page differs clearly from clickable ancestors"
      ],
      [
        "Long path",
        "Middle items collapse while start and end remain identifiable"
      ],
      [
        "Narrow screen",
        "Wraps or shortens without page-level horizontal scroll"
      ]
    ],
    "useWhen": [
      "Content has a stable parent hierarchy",
      "Users can arrive from search or a deep link"
    ],
    "avoidWhen": [
      "The experience is a linear step flow",
      "The site has one level or an unstable hierarchy"
    ],
    "confusedWith": "Breadcrumbs express information hierarchy; a back button follows browsing history.",
    "codeUI": [
      "nav, ol, real links, aria-label, aria-current, and CSS separators"
    ],
    "media": [
      "Path labels and separators stay entirely code-rendered"
    ],
    "prompt": "Add accessible breadcrumbs above the page title using nav and ol. Make ancestors real links, mark the current page with aria-current=page, render separators in CSS, and collapse middle levels on narrow screens while preserving the root and current page."
  },
  "bottom-tabs": {
    "name": "Bottom Tab Bar",
    "level": "Foundation",
    "tags": [
      "Mobile",
      "Navigation",
      "Code icon"
    ],
    "ask": "Keep Home, Favorites, and Profile available from a fixed bar at the bottom of the phone.",
    "definition": "A bottom tab bar is a mobile primary-navigation container fixed to the bottom edge with a small number of frequent destinations.",
    "role": "It reduces backtracking and makes switching among core screens fast.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Recipe app bottom navigation code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Tab item",
        "Icon plus short label, usually three to five items"
      ],
      [
        "Selected state",
        "Icon, color, and text work together"
      ],
      [
        "Safe area",
        "Accounts for the iOS home indicator"
      ],
      [
        "Badge",
        "Appears only when unread information exists"
      ]
    ],
    "variants": [
      [
        "Icon and label",
        "Most understandable for primary navigation"
      ],
      [
        "Icon only",
        "Only for familiar users and very few destinations"
      ],
      [
        "Central primary action",
        "Highlights creation or publishing"
      ]
    ],
    "states": [
      [
        "Selected",
        "Does not rely on color and keeps the label visible"
      ],
      [
        "Keyboard and screen reader",
        "Every item has a name and current-page state"
      ],
      [
        "Scrolling",
        "May hide, but must be easy to restore"
      ]
    ],
    "useWhen": [
      "A mobile app has three to five frequent primary screens",
      "Users switch between screens often"
    ],
    "avoidWhen": [
      "There are more than five destinations",
      "The screen needs immersive full-screen interaction"
    ],
    "confusedWith": "A bottom tab bar is primary navigation; toolbars and action bars do not belong in it.",
    "codeUI": [
      "nav, link or button, consistent SVG icons, and safe-area-inset-bottom"
    ],
    "media": [
      "Icons, labels, and selected states are entirely code-rendered and need no imagery"
    ],
    "prompt": "Add a four-item mobile bottom tab bar fixed above the safe area. Give every destination a consistent line icon and short label, use aria-current for the active page, and ensure scrolling content is not covered at the bottom."
  },
  "tabs": {
    "name": "Tabs",
    "level": "Foundation",
    "tags": [
      "Switching",
      "Content organization",
      "Code control"
    ],
    "ask": "Split this content into a few tabs so the same region changes when I select one.",
    "definition": "Tabs switch among related content panels within one context and should not hide unrelated tasks.",
    "role": "They reduce page length and cognitive load while supporting browsing and comparison in the same context.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Museum content tabs code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Tab list",
        "Short labels ordered by their relationship"
      ],
      [
        "Selection indicator",
        "Underline, fill, or strong contrast"
      ],
      [
        "Panel",
        "One panel associated with each tab"
      ],
      [
        "Keyboard behavior",
        "Arrow keys switch tabs and Tab enters the panel"
      ]
    ],
    "variants": [
      [
        "Underline tabs",
        "Lightweight and useful for reading"
      ],
      [
        "Pill tabs",
        "Useful for filters and view switching"
      ],
      [
        "Scrollable tabs",
        "Fit more peers on narrow screens"
      ]
    ],
    "states": [
      [
        "Selected",
        "Focus and panel stay synchronized"
      ],
      [
        "Disabled",
        "Explains why the panel is unavailable"
      ],
      [
        "Loading",
        "Only the panel changes and the tab list does not shift"
      ]
    ],
    "useWhen": [
      "One object has two to five peer content groups",
      "Users compare information within one context"
    ],
    "avoidWhen": [
      "Every tab is a completely independent task",
      "There are too many labels to scan"
    ],
    "confusedWith": "Tabs navigate content panels; a segmented control usually switches a view mode or filter value.",
    "codeUI": [
      "button, role=tab, aria-controls, arrow-key behavior, and hidden panels"
    ],
    "media": [
      "Tab labels and selected states must be rendered in code"
    ],
    "prompt": "Implement accessible tabs with a one-to-one relationship between tabs and panels, arrow-key navigation, and deep links. Do not reset scroll position when switching; allow horizontal tab scrolling on mobile without page overflow."
  }
};
