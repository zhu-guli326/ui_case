const DEFAULT_IMAGE_URL = "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80";

const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
}[character]));

const line = (size = "medium") => `<span class="vp-line vp-line--${size}"></span>`;
const pill = (label, active = false) => `<span class="vp-pill${active ? " is-active" : ""}">${escapeHtml(label)}</span>`;
const media = (imageUrl, modifier = "") => `<img class="vp-media${modifier ? ` vp-media--${modifier}` : ""}" src="${escapeHtml(imageUrl)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">`;

// Project-owned media turns each specimen into a believable solution instead
// of a grey placeholder, while remaining stable on GitHub Pages.
const projectMediaUrl = (path) => `https://zhu-guli326.github.io/ui_case/${path}`;

const solutionMedia = Object.freeze({
  "app-shell": projectMediaUrl("demo/pulse-desk/assets/device-diagnostics.png"),
  "bottom-tabs": projectMediaUrl("demo/northline-travel/assets/north-atlantic-hero.png"),
  hero: projectMediaUrl("demo/northline-travel/assets/north-atlantic-hero.png"),
  card: projectMediaUrl("demo/still-form/assets/linen-shirt.png"),
  "card-grid": projectMediaUrl("demo/still-form/assets/linen-shirt.png"),
  list: projectMediaUrl("demo/northline-travel/assets/north-atlantic-hero.png"),
  "media-tile": projectMediaUrl("demo/artmuse-ios/assets/starry-night-youtoken.png"),
  "detail-panel": projectMediaUrl("demo/artmuse-ios/assets/starry-night-youtoken.png"),
});

const solutionMediaSets = Object.freeze({
  "card-grid": [
    projectMediaUrl("demo/still-form/assets/linen-shirt.png"),
    projectMediaUrl("demo/carry-bag/assets/outdoor-backpack.png"),
    projectMediaUrl("demo/terra-elix/assets/herbix-capsules.png"),
  ],
  "filter-chips": [
    projectMediaUrl("demo/still-form/assets/linen-shirt.png"),
    projectMediaUrl("demo/carry-bag/assets/outdoor-backpack.png"),
    projectMediaUrl("demo/terra-elix/assets/herbix-capsules.png"),
  ],
  list: [
    projectMediaUrl("demo/northline-travel/assets/north-atlantic-hero.png"),
    projectMediaUrl("demo/signal-grid/assets/network-orb.png"),
    projectMediaUrl("demo/volt-route/assets/night-street-grid.png"),
  ],
  "media-tile": [
    projectMediaUrl("demo/artmuse-ios/assets/starry-night-youtoken.png"),
    projectMediaUrl("demo/artmuse-ios/assets/exhibition-modern-visions-youtoken.png"),
    projectMediaUrl("demo/artmuse-ios/assets/exhibition-impressionists-youtoken.png"),
  ],
});

const previewFactories = Object.freeze({
  "app-shell": ({ copy, imageUrl }) => `
    <div class="vp-shell">
      <div class="vp-shell-top"><span class="vp-logo"></span><strong>PULSE DESK</strong><span class="vp-shell-search">⌕ ${copy.search}</span><span class="vp-avatar"></span></div>
      <div class="vp-shell-body"><div class="vp-sidebar"><span class="is-active">⌂ ${copy.overview}</span><span>□ ${copy.projects}</span><span>◇ ${copy.analytics}</span><span>○ ${copy.team}</span></div><div class="vp-workspace"><small>${copy.dashboard}</small><h2>${copy.project}</h2><div class="vp-metrics"><i><small>${copy.visitors}</small><strong>12,480</strong><em>+18.4%</em></i><i><small>${copy.projects}</small><strong>24</strong><em>${copy.activeCount}</em></i><i><small>${copy.status}</small><strong>98.6%</strong><em>${copy.active}</em></i></div><div class="vp-shell-feature">${media(imageUrl, "shell-feature")}<div><small>${copy.healthKicker}</small><strong>${copy.healthReady}</strong><span>${copy.updated}</span></div></div></div></div>
    </div>`,
  header: ({ copy }) => `
    <div class="vp-page-header"><div class="vp-breadcrumb">${copy.workspace} / ${copy.project}</div><div class="vp-page-header-row"><div><small>${copy.overview}</small><strong>${copy.project}</strong><span>${copy.updated}</span></div><div class="vp-actions">${pill(copy.share)}${pill(copy.create, true)}</div></div></div>`,
  hero: ({ copy, imageUrl }) => `
    <div class="vp-hero"><div class="vp-hero-copy"><small>${copy.newCollection}</small><strong>${copy.heroTitle}</strong><p>${copy.heroBody}</p><div>${pill(copy.explore, true)}${pill(copy.learn)}</div></div>${media(imageUrl, "hero")}</div>`,
  cta: ({ copy }) => `
    <div class="vp-cta"><span class="vp-cta-mark">+</span><div><small>${copy.nextStep}</small><strong>${copy.ctaTitle}</strong><p>${copy.ctaBody}</p></div><span class="vp-cta-button">${copy.start}<b>→</b></span></div>`,
  responsive: ({ copy }) => `
    <div class="vp-responsive"><div class="vp-device vp-device--desktop"><i><b>NORTH</b><small>${copy.home}　${copy.work}　${copy.about}</small></i><strong>${copy.heroTitle}</strong><p>${copy.heroBody}</p><div><span>${copy.explore}</span><span>${copy.learn}</span></div></div><div class="vp-device vp-device--tablet"><i><b>NORTH</b><small>☰</small></i><strong>${copy.heroTitle}</strong><p>${copy.heroBody}</p><span>${copy.explore}</span></div><div class="vp-device vp-device--mobile"><i><b>N</b><small>☰</small></i><strong>${copy.heroTitle}</strong><span>${copy.explore}</span></div></div>`,
  "top-nav": ({ copy }) => `
    <div class="vp-navbar"><span class="vp-wordmark"><i></i>${copy.studio}</span><div class="vp-nav-links"><b class="is-active">${copy.home}</b><b>${copy.work}</b><b>${copy.about}</b></div><span class="vp-nav-action">${copy.contact}</span></div>`,
  sidebar: ({ copy }) => `
    <div class="vp-sidebar-demo"><aside class="vp-side-nav"><span class="vp-side-brand"><i></i>${copy.workspace}</span><small>${copy.mainMenu}</small><div class="vp-side-links"><span class="is-active"><i>⌂</i>${copy.overview}</span><span><i>□</i>${copy.projects}</span><span><i>◇</i>${copy.analytics}</span><span><i>○</i>${copy.team}</span></div><div class="vp-side-user"><i></i><span>${copy.account}<small>${copy.online}</small></span></div></aside><section class="vp-side-page"><div><small>${copy.dashboard}</small><span>•••</span></div><h2>${copy.project}</h2><p>${copy.updated}</p><div class="vp-side-panels"><i><small>${copy.visitors}</small><strong>12,480</strong><em>+18.4%</em></i><i><small>${copy.projects}</small><strong>24</strong><em>${copy.activeCount}</em></i></div></section></div>`,
  breadcrumbs: ({ copy }) => `
    <div class="vp-breadcrumbs-demo"><div class="vp-crumbs"><span>⌂</span><i>›</i><span>${copy.library}</span><i>›</i><span>${copy.collections}</span><i>›</i><b>${copy.summerEdit}</b></div><div class="vp-crumb-page"><small>${copy.collection}</small><strong>${copy.summerEdit}</strong><p>${copy.breadcrumbHint}</p><div class="vp-crumb-meta"><span>24 ${copy.objects}</span><b>${copy.updated}</b></div></div></div>`,
  "bottom-tabs": ({ copy }) => `
    <div class="vp-phone"><div class="vp-phone-head">${copy.today}<span class="vp-avatar"></span></div><div class="vp-phone-content"><small>${copy.featured}</small><strong>${copy.heroTitle}</strong><p>${copy.heroBody}</p><div class="vp-phone-card">${copy.explore}<b>→</b></div></div><div class="vp-bottom-tabs"><span class="is-active"><i>⌂</i>${copy.home}</span><span><i>◇</i>${copy.explore}</span><span><i>♡</i>${copy.saved}</span><span><i>○</i>${copy.profile}</span></div></div>`,
  tabs: ({ copy }) => `
    <div class="vp-tabs"><div class="vp-tab-list"><span class="is-active">${copy.overview}</span><span>${copy.activity}</span><span>${copy.files}</span></div><div class="vp-tab-panel"><small>${copy.thisMonth}</small>${line("title")}<div class="vp-chart vp-chart--compact"></div></div></div>`,
  segmented: ({ copy }) => `
    <div class="vp-segmented-demo"><div class="vp-segmented"><span class="is-active">${copy.day}</span><span>${copy.week}</span><span>${copy.month}</span></div><div class="vp-segment-value"><small>${copy.visitors}</small><strong>12,480</strong><span>+18.4%</span></div><div class="vp-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>`,
  search: ({ copy }) => `
    <div class="vp-search-demo"><div class="vp-search-field"><span>⌕</span><b>${copy.search}</b><kbd>⌘ K</kbd></div><div class="vp-search-results"><small>${copy.recent}</small><span><i></i>${copy.project}<b>↗</b></span><span><i></i>${copy.workspace}<b>↗</b></span></div></div>`,
  "filter-chips": ({ copy, mediaUrls }) => `
    <div class="vp-filter-demo"><div class="vp-filter-row">${pill(copy.all, true)}${pill(copy.design)}${pill(copy.product)}${pill(copy.research)}</div><div class="vp-filter-count">30 ${copy.results}</div><div class="vp-filter-items">${copy.productNames.map((name, index) => `<span>${media(mediaUrls[index], `filter-${index + 1}`)}<b>${escapeHtml(name)}</b><small>${escapeHtml(copy.productPrices[index])}</small></span>`).join("")}</div></div>`,
  card: ({ copy, imageUrl }) => `
    <div class="vp-card-demo">${media(imageUrl, "card")}<div class="vp-card-copy"><small>${copy.featured}</small><strong>${copy.cardTitle}</strong><p>${copy.cardBody}</p><span>${copy.view}<b>↗</b></span></div></div>`,
  "card-grid": ({ copy, mediaUrls }) => `
    <div class="vp-card-grid">${[copy.design, copy.product, copy.research].map((label, index) => `<div class="vp-mini-card">${media(mediaUrls[index], `crop-${index + 1}`)}<small>${escapeHtml(label)}</small><strong>${escapeHtml(copy.productNames[index])}</strong><span>${escapeHtml(copy.productPrices[index])}</span></div>`).join("")}</div>`,
  list: ({ copy, mediaUrls }) => `
    <div class="vp-list">${[copy.listOne, copy.listTwo, copy.listThree].map((label, index) => `<div class="vp-list-row">${media(mediaUrls[index], `thumb-${index + 1}`)}<div><strong>${escapeHtml(label)}</strong><p>${escapeHtml(copy.listSummaries[index])}</p><small>${index + 2}h · ${escapeHtml(copy.read)}</small></div><b>•••</b></div>`).join("")}</div>`,
  "media-tile": ({ copy, mediaUrls }) => `
    <div class="vp-media-grid"><figure class="is-large">${media(mediaUrls[0], "tile-1")}<figcaption>${copy.mediaCaptions[0]}<b>12</b></figcaption></figure><figure>${media(mediaUrls[1], "tile-2")}<figcaption>${copy.mediaCaptions[1]}</figcaption></figure><figure>${media(mediaUrls[2], "tile-3")}<figcaption>${copy.mediaCaptions[2]}</figcaption></figure></div>`,
  "detail-panel": ({ copy, imageUrl }) => `
    <div class="vp-detail">${media(imageUrl, "detail")}<div class="vp-detail-copy"><small>${copy.collection}</small><strong>${copy.detailTitle}</strong><p>${copy.detailBody}</p><dl><div><dt>${copy.date}</dt><dd>18 Aug</dd></div><div><dt>${copy.status}</dt><dd>${copy.available}</dd></div></dl><span>${copy.open}<b>→</b></span></div></div>`,
  "data-table": ({ copy }) => `
    <div class="vp-data-table"><div class="vp-table-toolbar"><div><small>${copy.allProjects}</small><strong>128 ${copy.records}</strong></div><span>⌕ ${copy.filter}</span></div><div class="vp-table-scroll"><table><thead><tr><th>${copy.projects}</th><th>${copy.owner}</th><th>${copy.status}</th><th>${copy.updatedShort}</th></tr></thead><tbody><tr><td><i></i>${copy.atlas}</td><td>Mei</td><td><b>${copy.active}</b></td><td>${copy.today}</td></tr><tr><td><i></i>${copy.orbit}</td><td>Alex</td><td><b class="is-review">${copy.review}</b></td><td>${copy.yesterday}</td></tr><tr><td><i></i>${copy.fieldNotes}</td><td>Sam</td><td><b class="is-draft">${copy.draft}</b></td><td>12 Aug</td></tr></tbody></table></div></div>`,
  button: ({ copy }) => `
    <div class="vp-button-demo"><div><small>${copy.primary}</small><span class="vp-button is-primary">${copy.continue}</span></div><div><small>${copy.secondary}</small><span class="vp-button">${copy.saveDraft}</span></div><div><small>${copy.icon}</small><span class="vp-icon-button">+</span></div><div><small>${copy.disabled}</small><span class="vp-button is-disabled">${copy.submit}</span></div></div>`,
  checkbox: ({ copy }) => `
    <div class="vp-checkbox-demo"><div class="vp-checkbox-head"><div><small>${copy.permissions}</small><strong>${copy.chooseAccess}</strong></div><span>2 / 3</span></div><div class="vp-checkbox-list"><div><i class="is-checked">✓</i><span><b>${copy.viewAccess}</b><small>${copy.viewAccessHint}</small></span></div><div><i class="is-mixed">−</i><span><b>${copy.editAccess}</b><small>${copy.editAccessHint}</small></span></div><div><i></i><span><b>${copy.adminAccess}</b><small>${copy.adminAccessHint}</small></span></div></div></div>`,
  form: ({ copy }) => `
    <div class="vp-form"><div class="vp-field"><small>${copy.name}</small><span>${copy.nameValue}</span></div><div class="vp-field"><small>${copy.email}</small><span>hello@example.com</span></div><div class="vp-field is-error"><small>${copy.password}</small><span>••••••••</span><em>${copy.passwordHint}</em></div><div class="vp-check"><i>✓</i>${copy.remember}</div><span class="vp-form-submit">${copy.createAccount}</span></div>`,
  toggle: ({ copy }) => `
    <div class="vp-settings"><strong>${copy.preferences}</strong>${[[copy.notifications, true], [copy.weekly, false], [copy.autoSave, true]].map(([label, active]) => `<div class="vp-setting"><span>${escapeHtml(label)}${line("short")}</span><i class="vp-switch${active ? " is-on" : ""}"><b></b></i></div>`).join("")}</div>`,
  menu: ({ copy }) => `
    <div class="vp-menu-scene"><div class="vp-menu-page"><div><span>${copy.projectActions}</span><b>•••</b></div>${line("title")}${line("long")}<div class="vp-menu-card"></div></div><div class="vp-menu-popover"><small>${copy.actions}</small><span class="is-active"><i>↗</i><b>${copy.open}</b><kbd>↵</kbd></span><span><i>□</i><b>${copy.duplicate}</b><kbd>⌘D</kbd></span><span><i>↪</i><b>${copy.move}</b><kbd>⌘M</kbd></span><hr><span class="is-danger"><i>×</i><b>${copy.delete}</b><kbd>⌫</kbd></span></div></div>`,
  modal: ({ copy }) => `
    <div class="vp-overlay"><div class="vp-modal"><span class="vp-close">×</span><small>${copy.confirmation}</small><strong>${copy.modalTitle}</strong><p>${copy.modalBody}</p><div>${pill(copy.cancel)}${pill(copy.confirm, true)}</div></div></div>`,
  drawer: ({ copy }) => `
    <div class="vp-drawer-scene"><div class="vp-drawer-page"><small>${copy.dashboard}</small><strong>${copy.project}</strong><p>${copy.updated}</p><div><span>${copy.visitors}</span><b>12,480</b></div></div><aside class="vp-drawer"><span class="vp-drawer-handle"></span><small>${copy.details}</small><strong>${copy.drawerTitle}</strong><p>${copy.drawerSummary}</p><dl><div><dt>${copy.owner}</dt><dd>Alex</dd></div><div><dt>${copy.status}</dt><dd>${copy.active}</dd></div></dl></aside></div>`,
  toast: ({ copy }) => `
    <div class="vp-toast-scene"><div class="vp-toast-page"><small>${copy.project}</small><strong>${copy.modalTitle}</strong><p>${copy.modalBody}</p><span>${copy.confirm}</span></div><div class="vp-toast"><span>✓</span><div><strong>${copy.savedTitle}</strong><small>${copy.savedBody}</small></div><b>×</b></div></div>`,
  skeleton: ({ copy }) => `
    <div class="vp-skeleton"><div class="vp-skeleton-head"><span class="vp-skeleton-avatar"></span><div>${line("medium")}${line("short")}</div><small>${copy.loading}</small></div><div class="vp-skeleton-feature"></div><div class="vp-skeleton-copy">${line("title")}${line("long")}${line("medium")}</div><div class="vp-skeleton-cards"><span></span><span></span><span></span></div></div>`,
  "empty-state": ({ copy }) => `
    <div class="vp-empty"><span class="vp-empty-icon">⌕</span><strong>${copy.emptyTitle}</strong><p>${copy.emptyBody}</p><span class="vp-empty-action">${copy.clear}</span></div>`,
  typography: ({ copy }) => `
    <div class="vp-type"><small>DISPLAY / 56</small><h2>${copy.typeTitle}</h2><div><span>01</span><h3>${copy.typeHeading}</h3></div><p>${copy.typeBody}</p><blockquote>${copy.typeQuote}</blockquote><footer><b>Label</b><span>Supporting text</span><code>Mono 12</code></footer></div>`,
});

const vocabularyPreviewCopy = {
  zh: { dashboard: "数据看板", workspace: "工作区", project: "项目概览", overview: "概览", updated: "刚刚更新", share: "分享", create: "新建", newCollection: "新系列", heroTitle: "为日常留出空间", heroBody: "克制、清晰，并为真正重要的内容保留焦点。", explore: "浏览系列", learn: "了解更多", nextStep: "下一步", ctaTitle: "准备好开始了吗？", ctaBody: "创建第一个项目，并邀请团队一起协作。", start: "开始创建", studio: "NORTH STUDIO", home: "首页", work: "作品", about: "关于", contact: "联系", mainMenu: "主菜单", projects: "项目", analytics: "数据分析", team: "团队", account: "林清", online: "在线", library: "资料库", collections: "系列", summerEdit: "夏日精选", breadcrumbHint: "沿层级返回上级，快速确认当前位置。", today: "今天", yesterday: "昨天", saved: "收藏", profile: "我的", activity: "动态", files: "文件", thisMonth: "本月表现", day: "日", week: "周", month: "月", visitors: "访问人数", search: "搜索项目或文件", recent: "最近访问", all: "全部", design: "设计", product: "产品", research: "研究", results: "项结果", featured: "精选", cardTitle: "Quiet Forms", cardBody: "材质、光线与克制的空间秩序。", view: "查看详情", listOne: "设计系统更新", listTwo: "夏季产品研究", listThree: "团队工作纪要", read: "阅读", collection: "系列", objects: "对象", detailTitle: "Calm Interior No. 04", detailBody: "一组关于材质、结构和自然光的空间研究。", date: "日期", status: "状态", available: "可浏览", open: "打开详情", allProjects: "全部项目", records: "条记录", filter: "筛选", updatedShort: "更新", atlas: "Atlas 设计系统", orbit: "Orbit 研究", fieldNotes: "田野笔记", review: "待审核", draft: "草稿", primary: "主要按钮", secondary: "次要按钮", icon: "图标按钮", disabled: "禁用", continue: "继续", saveDraft: "保存草稿", submit: "提交", permissions: "权限", chooseAccess: "选择成员权限", viewAccess: "查看", viewAccessHint: "可以浏览和评论", editAccess: "编辑", editAccessHint: "部分成员可编辑", adminAccess: "管理", adminAccessHint: "可以管理权限", name: "姓名", nameValue: "林清", email: "邮箱", password: "密码", passwordHint: "至少需要 8 个字符", remember: "记住我的选择", createAccount: "创建账户", preferences: "偏好设置", notifications: "通知提醒", weekly: "每周摘要", autoSave: "自动保存", projectActions: "项目操作", actions: "操作", duplicate: "创建副本", move: "移动到…", delete: "移至回收站", confirmation: "确认操作", modalTitle: "发布这个项目？", modalBody: "发布后，拥有链接的人都可以查看。", cancel: "取消", confirm: "确认发布", details: "详情", drawerTitle: "项目设置", owner: "负责人", active: "进行中", savedTitle: "更改已保存", savedBody: "所有内容已同步", loading: "正在载入", emptyTitle: "还没有内容", emptyBody: "调整筛选条件，或创建第一个项目。", clear: "清除筛选", typeTitle: "清晰先于装饰", typeHeading: "建立可读的层级", typeBody: "稳定的字号、行高与内容宽度，让信息自然形成阅读顺序。", typeQuote: "设计不是增加，而是决定什么值得被看见。" },
  en: { dashboard: "Dashboard", workspace: "Workspace", project: "Project overview", overview: "Overview", updated: "Updated just now", share: "Share", create: "Create", newCollection: "New collection", heroTitle: "Make room for everyday life", heroBody: "Quiet, clear, and focused on what matters most.", explore: "Explore", learn: "Learn more", nextStep: "Next step", ctaTitle: "Ready to begin?", ctaBody: "Create your first project and invite the team.", start: "Get started", studio: "NORTH STUDIO", home: "Home", work: "Work", about: "About", contact: "Contact", mainMenu: "Main menu", projects: "Projects", analytics: "Analytics", team: "Team", account: "Lin Qing", online: "Online", library: "Library", collections: "Collections", summerEdit: "Summer edit", breadcrumbHint: "Move up the hierarchy and confirm the current location.", today: "Today", yesterday: "Yesterday", saved: "Saved", profile: "Profile", activity: "Activity", files: "Files", thisMonth: "This month", day: "Day", week: "Week", month: "Month", visitors: "Visitors", search: "Search projects or files", recent: "Recent", all: "All", design: "Design", product: "Product", research: "Research", results: "results", featured: "Featured", cardTitle: "Quiet Forms", cardBody: "Material, light, and restrained spatial order.", view: "View details", listOne: "Design system update", listTwo: "Summer product research", listThree: "Team working notes", read: "read", collection: "Collection", objects: "Objects", detailTitle: "Calm Interior No. 04", detailBody: "A study of material, structure, and natural light.", date: "Date", status: "Status", available: "Available", open: "Open details", allProjects: "All projects", records: "records", filter: "Filter", updatedShort: "Updated", atlas: "Atlas design system", orbit: "Orbit research", fieldNotes: "Field notes", review: "Review", draft: "Draft", primary: "Primary", secondary: "Secondary", icon: "Icon", disabled: "Disabled", continue: "Continue", saveDraft: "Save draft", submit: "Submit", permissions: "Permissions", chooseAccess: "Choose member access", viewAccess: "View", viewAccessHint: "Can browse and comment", editAccess: "Edit", editAccessHint: "Some members can edit", adminAccess: "Admin", adminAccessHint: "Can manage access", name: "Name", nameValue: "Lin Qing", email: "Email", password: "Password", passwordHint: "Use at least 8 characters", remember: "Remember my choice", createAccount: "Create account", preferences: "Preferences", notifications: "Notifications", weekly: "Weekly summary", autoSave: "Auto save", projectActions: "Project actions", actions: "Actions", duplicate: "Duplicate", move: "Move to…", delete: "Move to trash", confirmation: "Confirmation", modalTitle: "Publish this project?", modalBody: "Anyone with the link will be able to view it.", cancel: "Cancel", confirm: "Publish", details: "Details", drawerTitle: "Project settings", owner: "Owner", active: "Active", savedTitle: "Changes saved", savedBody: "Everything is in sync", loading: "Loading", emptyTitle: "Nothing here yet", emptyBody: "Adjust the filters or create your first project.", clear: "Clear filters", typeTitle: "Clarity before decoration", typeHeading: "Build a readable hierarchy", typeBody: "Stable type sizes, line heights, and content widths create a natural reading order.", typeQuote: "Design is deciding what deserves to be seen." },
};

Object.assign(vocabularyPreviewCopy.zh, {
  activeCount: "8 个进行中",
  healthKicker: "设备健康 / 01",
  healthReady: "所有系统运行正常",
  productNames: ["亚麻衬衫", "户外通勤包", "每日草本配方"],
  productPrices: ["¥899", "¥1,680", "¥428"],
  listSummaries: ["为产品团队建立更安静清晰的协作系统", "影响下一版本规划的三条关键信号", "本周决策、负责人和下一步行动"],
  mediaCaptions: ["馆藏精选", "现代视野", "印象派展览"],
  drawerSummary: "在侧边完成设置，不离开当前项目。",
});

Object.assign(vocabularyPreviewCopy.en, {
  activeCount: "8 active",
  healthKicker: "DEVICE HEALTH / 01",
  healthReady: "All systems are ready",
  productNames: ["Linen shirt", "Field pack", "Daily herbal ritual"],
  productPrices: ["$128", "$245", "$64"],
  listSummaries: ["A calmer collaboration system for product teams", "Three signals shaping the next product release", "This week’s decisions, owners, and next steps"],
  mediaCaptions: ["Collection highlights", "Modern visions", "Impressionists"],
  drawerSummary: "Adjust settings without leaving the current project.",
});

export const DEFAULT_VOCABULARY_PREVIEW_IMAGE = DEFAULT_IMAGE_URL;
export const SUPPORTED_VOCABULARY_PREVIEW_IDS = Object.freeze(Object.keys(previewFactories));
export const vocabularyPreviewIds = SUPPORTED_VOCABULARY_PREVIEW_IDS;

function externalImageUrl(value) {
  try {
    const url = new URL(value || DEFAULT_IMAGE_URL);
    return url.protocol === "https:" ? url.href : DEFAULT_IMAGE_URL;
  } catch {
    return DEFAULT_IMAGE_URL;
  }
}

export function vocabularyPreviewMarkup(entryOrId, { imageUrl = DEFAULT_IMAGE_URL, language = "zh" } = {}) {
  const id = typeof entryOrId === "string" ? entryOrId : entryOrId?.id;
  const factory = previewFactories[id];
  if (!factory) throw new RangeError(`Unsupported vocabulary preview: ${id || "(missing id)"}`);
  const copy = vocabularyPreviewCopy[language === "en" ? "en" : "zh"];
  const safeRequestedImage = externalImageUrl(imageUrl);
  const rejectedImage = Boolean(imageUrl) && safeRequestedImage === DEFAULT_IMAGE_URL && imageUrl !== DEFAULT_IMAGE_URL;
  const resolvedImage = rejectedImage ? DEFAULT_IMAGE_URL : solutionMedia[id] || safeRequestedImage;
  const mediaUrls = solutionMediaSets[id] || [resolvedImage, resolvedImage, resolvedImage];
  return `<div class="vocabulary-preview vocabulary-preview--${id}" data-vocabulary-preview="${id}" aria-hidden="true"><div class="vp-canvas">${factory({ copy, imageUrl: resolvedImage, mediaUrls })}</div></div>`;
}

export function renderVocabularyPreview(target, entryOrId, options) {
  if (!target?.ownerDocument || typeof target.replaceChildren !== "function") throw new TypeError("A DOM target element is required");
  const template = target.ownerDocument.createElement("template");
  template.innerHTML = vocabularyPreviewMarkup(entryOrId, options);
  target.replaceChildren(template.content.cloneNode(true));
  return target.firstElementChild;
}
