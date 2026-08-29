export const navigationPrinciples = [
  { number: "01", title: ["先分导航层级", "Define the scope"], body: ["全局导航连接产品主要区域；局部导航只切换当前对象或内容。", "Global navigation connects product areas; local navigation switches views within the current context."] },
  { number: "02", title: ["再看入口数量", "Count destinations"], body: ["3–5 个移动端一级入口适合底部标签；大量桌面入口更适合分组侧栏。", "Three to five mobile destinations fit a bottom bar; many desktop destinations need a grouped sidebar."] },
  { number: "03", title: ["最后决定位置", "Choose placement last"], body: ["位置由设备、切换频率和内容密度决定，不是由视觉偏好决定。", "Placement follows device, switching frequency, and content density—not visual taste."] },
];

export const navigationPatterns = [
  {
    number: "01", preview: "top", termId: "top-nav", name: ["顶部导航", "Top navigation"], en: "Navbar",
    scope: ["全局一级", "Global primary"], count: "3–7",
    fit: ["品牌官网、内容站和入口较少的桌面产品。横向空间充足，用户需要频繁跨主栏目。", "Marketing sites, content sites, and desktop products with a small number of primary areas."],
    avoid: ["入口超过一行，或高频工作台需要展示多级目录时。", "Avoid when destinations wrap or a dense workspace needs multiple levels."],
    mobile: ["折叠为抽屉，或将 3–5 个最高频入口改成底部标签。", "Collapse into a drawer, or move the top three to five destinations into a bottom bar."],
  },
  {
    number: "02", preview: "side", termId: "sidebar", name: ["侧边导航", "Side navigation"], en: "Sidebar",
    scope: ["全局 / 工作区", "Global / workspace"], count: "5–20+",
    fit: ["后台、创作工具和企业工作台。需要分组、二级入口和持续可见的工作区上下文。", "Admin panels, creation tools, and enterprise workspaces that need groups and nested destinations."],
    avoid: ["内容需要全宽沉浸，或产品只有三四个简单页面时。", "Avoid for immersive full-width content or products with only a few simple pages."],
    mobile: ["转成可关闭抽屉；不要把整条桌面侧栏硬压窄。", "Convert it into a dismissible drawer instead of squeezing the desktop sidebar."],
  },
  {
    number: "03", preview: "rail", termId: "sidebar", name: ["导航轨道", "Navigation rail"], en: "Navigation Rail",
    scope: ["全局一级", "Global primary"], count: "3–7",
    fit: ["平板、宽屏移动设备或需要给内容让出空间的桌面工具。图标入口高频且稳定。", "Tablets, wide mobile layouts, and desktop tools that need compact, persistent navigation."],
    avoid: ["图标含义不熟悉、入口经常变化或需要多级分组时。", "Avoid when icons are unfamiliar, destinations change often, or nested groups are required."],
    mobile: ["窄屏切换为底部标签；宽屏时可扩展成带文字的侧栏。", "Become a bottom bar on narrow screens or expand into a labeled sidebar on wider screens."],
  },
  {
    number: "04", preview: "bottom", termId: "bottom-tabs", name: ["底部标签栏", "Bottom tab bar"], en: "Bottom Navigation",
    scope: ["移动端全局一级", "Mobile global primary"], count: "3–5",
    fit: ["移动 App 的最高频目的地。入口必须长期稳定，用户需要单手快速切换。", "The most frequent, stable destinations in a mobile app, optimized for one-handed switching."],
    avoid: ["超过 5 个入口、临时操作，或把“发布”之外的普通按钮混入导航。", "Avoid more than five destinations, temporary actions, or mixing ordinary actions into navigation."],
    mobile: ["保持图标和短标签，适配安全区；选中态不能只依赖颜色。", "Keep icons and short labels above the safe area; selection cannot rely on color alone."],
  },
  {
    number: "05", preview: "drawer", termId: "drawer", name: ["抽屉导航", "Navigation drawer"], en: "Navigation Drawer",
    scope: ["全局补充 / 临时", "Global overflow / temporary"], count: "5–20",
    fit: ["移动端入口较多，但不需要持续展示；也适合放账户、设置等低频入口。", "Mobile products with many destinations that do not need to remain visible, plus low-frequency account areas."],
    avoid: ["最高频的 3–5 个核心页面全部藏进去，会降低发现和切换效率。", "Avoid hiding every high-frequency primary destination because discoverability and switching suffer."],
    mobile: ["从屏幕边缘覆盖出现，保留明确关闭方式、焦点管理和背景遮罩。", "Open from an edge with a clear close action, focus management, and backdrop."],
  },
  {
    number: "06", preview: "tabs", termId: "tabs", name: ["标签页导航", "Tab navigation"], en: "Tabs",
    scope: ["当前对象的局部导航", "Local object navigation"], count: "2–6",
    fit: ["同一页面、同一对象下的并列内容，例如概览、评论、版本和设置。", "Peer views within the same page or object, such as overview, comments, versions, and settings."],
    avoid: ["用它连接完全不同的产品区域，或标签多到需要记忆和滚动寻找。", "Avoid connecting unrelated product areas or creating more tabs than users can scan."],
    mobile: ["标签可横向滚动，但当前项必须可见；不要让整个页面横向溢出。", "Tabs may scroll horizontally, but the active tab must remain visible without page-level overflow."],
  },
  {
    number: "07", preview: "crumbs", termId: "breadcrumbs", name: ["面包屑导航", "Breadcrumb navigation"], en: "Breadcrumbs",
    scope: ["层级定位", "Hierarchy and location"], count: "2–5 层",
    fit: ["文档、文件系统、电商分类和后台详情。用户可能从搜索或深链接直接进入。", "Documentation, file systems, commerce categories, and deep admin pages entered from search or links."],
    avoid: ["线性步骤、浏览历史返回，或本来只有一层内容时。", "Avoid for linear steps, browser-history back behavior, or flat information structures."],
    mobile: ["折叠中间层级，至少保留父级返回和当前页面位置。", "Collapse middle ancestors while preserving the parent path and current location."],
  },
  {
    number: "08", preview: "mega", termId: "top-nav", name: ["大型菜单", "Mega menu"], en: "Mega Menu",
    scope: ["全局分类发现", "Global category discovery"], count: "20–100+",
    fit: ["电商、教育、媒体等栏目很多的站点。需要同时展示分组、层级和精选入口。", "Commerce, education, and media sites with many grouped destinations and highlighted entry points."],
    avoid: ["产品入口少、分类不稳定，或仅靠 hover 才能操作时。", "Avoid for small or unstable taxonomies, and never make hover the only way to operate it."],
    mobile: ["改成分层抽屉或手风琴列表，不要缩小桌面大面板。", "Convert it into a layered drawer or accordion instead of shrinking the desktop panel."],
  },
];
