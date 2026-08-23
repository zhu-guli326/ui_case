const DEFAULT_IMAGE_URL = "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80";

const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
}[character]));

const line = (size = "medium") => `<span class="vp-line vp-line--${size}"></span>`;
const pill = (label, active = false) => `<span class="vp-pill${active ? " is-active" : ""}">${escapeHtml(label)}</span>`;
const media = (imageUrl, modifier = "") => `<img class="vp-media${modifier ? ` vp-media--${modifier}` : ""}" src="${escapeHtml(imageUrl)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">`;

// Keep preview media external and use a restrained editorial set so unrelated
// product photos do not compete with the component being explained.
const projectMediaUrl = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=82`;

const solutionMedia = Object.freeze({
  "app-shell": projectMediaUrl("photo-1497366811353-6870744d04b2"),
  "bottom-tabs": projectMediaUrl("photo-1500534623283-312aade485b7"),
  hero: projectMediaUrl("photo-1497366754035-f200968a6e72"),
  card: projectMediaUrl("photo-1455390582262-044cdead277a"),
  "card-grid": projectMediaUrl("photo-1518005020951-eccb494ad742"),
  list: projectMediaUrl("photo-1494438639946-1ebd1d20bf85"),
  "media-tile": projectMediaUrl("photo-1549490349-8643362247b5"),
  "detail-panel": projectMediaUrl("photo-1497366216548-37526070297c"),
  "layout-single-column": projectMediaUrl("photo-1455390582262-044cdead277a"),
  "layout-landing-page": projectMediaUrl("photo-1523275335684-37898b6baf30"),
  "layout-masonry": projectMediaUrl("photo-1549490349-8643362247b5"),
  "layout-fullscreen": projectMediaUrl("photo-1500530855697-b586d89ba3ee"),
  "layout-split-pane": projectMediaUrl("photo-1518005020951-eccb494ad742"),
  "layout-dashboard": projectMediaUrl("photo-1497366811353-6870744d04b2"),
  "layout-modular": projectMediaUrl("photo-1497366216548-37526070297c"),
  "carousel-fade": projectMediaUrl("photo-1500534623283-312aade485b7"),
  "carousel-3d": projectMediaUrl("photo-1523275335684-37898b6baf30"),
  "carousel-stack": projectMediaUrl("photo-1455390582262-044cdead277a"),
  "carousel-page": projectMediaUrl("photo-1497366754035-f200968a6e72"),
  "carousel-accordion": projectMediaUrl("photo-1549490349-8643362247b5"),
  "carousel-360": projectMediaUrl("photo-1518005020951-eccb494ad742"),
  "carousel-parallax": projectMediaUrl("photo-1500530855697-b586d89ba3ee"),
});

const solutionMediaSets = Object.freeze({
  "layout-masonry": [
    projectMediaUrl("photo-1549490349-8643362247b5"),
    projectMediaUrl("photo-1518005020951-eccb494ad742"),
    projectMediaUrl("photo-1455390582262-044cdead277a"),
    projectMediaUrl("photo-1497366216548-37526070297c"),
    projectMediaUrl("photo-1500534623283-312aade485b7"),
    projectMediaUrl("photo-1497366754035-f200968a6e72"),
  ],
  "card-grid": [
    projectMediaUrl("photo-1455390582262-044cdead277a"),
    projectMediaUrl("photo-1518005020951-eccb494ad742"),
    projectMediaUrl("photo-1497366216548-37526070297c"),
  ],
  "filter-chips": [
    projectMediaUrl("photo-1455390582262-044cdead277a"),
    projectMediaUrl("photo-1549490349-8643362247b5"),
    projectMediaUrl("photo-1497366754035-f200968a6e72"),
  ],
  list: [
    projectMediaUrl("photo-1494438639946-1ebd1d20bf85"),
    projectMediaUrl("photo-1497366811353-6870744d04b2"),
    projectMediaUrl("photo-1497366216548-37526070297c"),
  ],
  "media-tile": [
    projectMediaUrl("photo-1549490349-8643362247b5"),
    projectMediaUrl("photo-1518005020951-eccb494ad742"),
    projectMediaUrl("photo-1455390582262-044cdead277a"),
  ],
  "carousel-fade": [projectMediaUrl("photo-1500534623283-312aade485b7"), projectMediaUrl("photo-1497366754035-f200968a6e72")],
  "carousel-3d": [projectMediaUrl("photo-1455390582262-044cdead277a"), projectMediaUrl("photo-1523275335684-37898b6baf30"), projectMediaUrl("photo-1518005020951-eccb494ad742")],
  "carousel-stack": [projectMediaUrl("photo-1497366216548-37526070297c"), projectMediaUrl("photo-1549490349-8643362247b5"), projectMediaUrl("photo-1494438639946-1ebd1d20bf85")],
  "carousel-page": [projectMediaUrl("photo-1497366754035-f200968a6e72"), projectMediaUrl("photo-1455390582262-044cdead277a")],
  "carousel-accordion": [projectMediaUrl("photo-1549490349-8643362247b5"), projectMediaUrl("photo-1518005020951-eccb494ad742"), projectMediaUrl("photo-1497366216548-37526070297c"), projectMediaUrl("photo-1500534623283-312aade485b7")],
  "carousel-360": [projectMediaUrl("photo-1523275335684-37898b6baf30")],
  "carousel-parallax": [projectMediaUrl("photo-1500530855697-b586d89ba3ee"), projectMediaUrl("photo-1497366754035-f200968a6e72")],
});

const componentHeroMedia = Object.freeze({
  centered: projectMediaUrl("photo-1494438639946-1ebd1d20bf85"),
  split: projectMediaUrl("photo-1497366811353-6870744d04b2"),
  fullbleed: projectMediaUrl("photo-1500530855697-b586d89ba3ee"),
  video: projectMediaUrl("photo-1518005020951-eccb494ad742"),
  mockup: projectMediaUrl("photo-1523275335684-37898b6baf30"),
  search: projectMediaUrl("photo-1455390582262-044cdead277a"),
  bento: projectMediaUrl("photo-1497366216548-37526070297c"),
});

const componentCardMedia = Object.freeze({
  "image-top": projectMediaUrl("photo-1494438639946-1ebd1d20bf85"),
  "image-side": projectMediaUrl("photo-1500530855697-b586d89ba3ee"),
  overlay: projectMediaUrl("photo-1518005020951-eccb494ad742"),
  product: projectMediaUrl("photo-1523275335684-37898b6baf30"),
  article: projectMediaUrl("photo-1455390582262-044cdead277a"),
  borderless: projectMediaUrl("photo-1497366216548-37526070297c"),
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
  "layout-single-column": ({ copy, imageUrl }) => `
    <div class="vp-layout vp-layout--single"><div class="vp-layout-browser"><i><b>FIELD NOTES</b><small>${copy.about}　${copy.work}</small></i><main><small>LONG READ / 08</small><strong>${copy.typeHeading}</strong><p>${copy.typeBody}</p>${media(imageUrl, "layout-inline")}<span></span><span></span><span></span><span></span><span class="is-short"></span></main></div></div>`,
  "layout-landing-page": ({ copy, imageUrl }) => `
    <div class="vp-layout vp-layout--landing"><section>${media(imageUrl, "layout-landing")}<div><small>NEW PRODUCT</small><strong>${copy.heroTitle}</strong><p>${copy.heroBody}</p><b>${copy.explore} →</b></div></section><footer><span><i>01</i>${copy.design}</span><span><i>02</i>${copy.product}</span><span><i>03</i>${copy.research}</span></footer></div>`,
  "layout-masonry": ({ copy, mediaUrls }) => `
    <div class="vp-layout vp-layout--masonry"><header><b>FRAME</b><small>${copy.featured}　${copy.collections}</small></header><div>${[0,1,2,3,4,5,0,1,2].map((index, order) => `<figure class="tile-${order + 1}">${media(mediaUrls[index], `masonry-${order + 1}`)}<figcaption>${escapeHtml(copy.productNames[index % copy.productNames.length])}</figcaption></figure>`).join("")}</div></div>`,
  "layout-fullscreen": ({ copy, imageUrl }) => `
    <div class="vp-layout vp-layout--fullscreen">${media(imageUrl, "layout-fullscreen")}<header><b>NOCTURNE</b><small>${copy.about}　${copy.work}</small></header><div><small>IMMERSIVE STORY / 01</small><strong>${copy.heroTitle}</strong><span>${copy.explore} ↘</span></div></div>`,
  "layout-split-pane": ({ copy, imageUrl }) => `
    <div class="vp-layout vp-layout--split"><section><header><b>EDITOR</b><small>index.html</small></header><code><i>01</i>&lt;main&gt;<br><i>02</i>　&lt;h1&gt;${copy.project}&lt;/h1&gt;<br><i>03</i>　&lt;p&gt;${copy.updated}&lt;/p&gt;<br><i>04</i>&lt;/main&gt;</code></section><i class="vp-layout-divider"><b>⋮</b></i><section>${media(imageUrl, "layout-split")}<div><small>LIVE PREVIEW</small><strong>${copy.project}</strong><p>${copy.heroBody}</p></div></section></div>`,
  "layout-dashboard": ({ copy }) => `
    <div class="vp-layout vp-layout--dashboard"><aside><b>AXIS</b><span>⌂</span><span>◇</span><span>□</span></aside><main><header><div><small>${copy.dashboard}</small><strong>${copy.project}</strong></div><b>${copy.thisMonth}</b></header><div class="vp-layout-kpis"><i><small>${copy.visitors}</small><strong>12.4k</strong><em>+18%</em></i><i><small>${copy.projects}</small><strong>24</strong><em>+4</em></i><i><small>${copy.status}</small><strong>98%</strong><em>${copy.active}</em></i></div><div class="vp-layout-chart"><span></span><i></i><i></i><i></i><i></i><i></i></div></main></div>`,
  "layout-modular": ({ copy, imageUrl }) => `
    <div class="vp-layout vp-layout--modular"><header><b>MY SPACE</b><small>＋ ${copy.create}</small></header><main><section class="is-profile"><span class="vp-avatar"></span><strong>${copy.account}</strong><small>${copy.online}</small></section><section class="is-feature">${media(imageUrl, "layout-module")}<div><small>${copy.featured}</small><strong>${copy.cardTitle}</strong></div></section><section class="is-stat"><small>${copy.projects}</small><strong>24</strong></section><section class="is-note"><small>${copy.today}</small><p>${copy.listSummaries[2]}</p></section></main></div>`,
  "carousel-fade": ({ mediaUrls }) => `<div class="vp-carousel vp-carousel--fade"><div>${media(mediaUrls[0], "carousel-main")}<div><b>01</b><span>FADE</span></div></div><i></i><i></i><i></i></div>`,
  "carousel-3d": ({ mediaUrls }) => `<div class="vp-carousel vp-carousel--3d"><div>${media(mediaUrls[0], "carousel-side")}</div><div class="is-active">${media(mediaUrls[1], "carousel-main")}</div><div>${media(mediaUrls[2], "carousel-side")}</div></div>`,
  "carousel-stack": ({ mediaUrls }) => `<div class="vp-carousel vp-carousel--stack"><div>${media(mediaUrls[0], "carousel-main")}</div><div>${media(mediaUrls[1], "carousel-main")}</div><div>${media(mediaUrls[2], "carousel-main")}</div><b>SWIPE</b></div>`,
  "carousel-page": ({ mediaUrls }) => `<div class="vp-carousel vp-carousel--page"><div>${media(mediaUrls[0], "carousel-main")}</div><div>${media(mediaUrls[1], "carousel-main")}</div><span>‹　›</span></div>`,
  "carousel-accordion": ({ mediaUrls }) => `<div class="vp-carousel vp-carousel--accordion">${mediaUrls.slice(0, 4).map((url, index) => `<div class="${index === 1 ? "is-active" : ""}">${media(url, "carousel-main")}<b>0${index + 1}</b></div>`).join("")}</div>`,
  "carousel-360": ({ mediaUrls }) => `<div class="vp-carousel vp-carousel--360"><div>${media(mediaUrls[0], "carousel-main")}<span>↔ DRAG TO ROTATE</span></div><b>360°</b></div>`,
  "carousel-parallax": ({ mediaUrls }) => `<div class="vp-carousel vp-carousel--parallax">${media(mediaUrls[0], "carousel-back")}${media(mediaUrls[1], "carousel-main")}<strong>MOVE THROUGH<br>THE STORY</strong></div>`,
  "top-nav": ({ copy }) => `
    <div class="vp-navbar"><div class="vp-navbar-head"><span class="vp-wordmark"><i></i>${copy.studio}</span><div class="vp-nav-links"><b class="is-active">${copy.home}</b><b>${copy.work}</b><b>${copy.about}</b></div><span class="vp-nav-action">${copy.contact}</span></div><main class="vp-navbar-content"><small>${copy.featured}</small><strong>${copy.heroTitle}</strong><p>${copy.heroBody}</p><div class="vp-navbar-cards"><span><b>${copy.projects}</b><small>${copy.listOne}</small></span><span><b>${copy.analytics}</b><small>${copy.listTwo}</small></span><span><b>${copy.team}</b><small>${copy.listThree}</small></span></div></main></div>`,
  sidebar: ({ copy }) => `
    <div class="vp-sidebar-demo"><aside class="vp-side-nav"><span class="vp-side-brand"><i></i>${copy.workspace}</span><small>${copy.mainMenu}</small><div class="vp-side-links"><span class="is-active"><i>⌂</i>${copy.overview}</span><span><i>□</i>${copy.projects}</span><span><i>◇</i>${copy.analytics}</span><span><i>○</i>${copy.team}</span></div><div class="vp-side-user"><i></i><span>${copy.account}<small>${copy.online}</small></span></div></aside><section class="vp-side-page"><div><small>${copy.dashboard}</small><span>•••</span></div><h2>${copy.project}</h2><p>${copy.updated}</p><div class="vp-side-panels"><i><small>${copy.visitors}</small><strong>12,480</strong><em>+18.4%</em></i><i><small>${copy.projects}</small><strong>24</strong><em>${copy.activeCount}</em></i></div></section></div>`,
  breadcrumbs: ({ copy }) => `
    <div class="vp-breadcrumbs-demo"><div class="vp-crumbs"><span>⌂</span><i>›</i><span>${copy.library}</span><i>›</i><span>${copy.collections}</span><i>›</i><b>${copy.summerEdit}</b></div><div class="vp-crumb-page"><small>${copy.collection}</small><strong>${copy.summerEdit}</strong><p>${copy.breadcrumbHint}</p><div class="vp-crumb-meta"><span>24 ${copy.objects}</span><b>${copy.updated}</b></div></div></div>`,
  "bottom-tabs": ({ copy }) => `
    <div class="vp-phone"><div class="vp-phone-head">${copy.today}<span class="vp-avatar"></span></div><div class="vp-phone-content"><small>${copy.featured}</small><strong>${copy.heroTitle}</strong><p>${copy.heroBody}</p><div class="vp-phone-card">${copy.explore}<b>→</b></div></div><div class="vp-bottom-tabs"><span class="is-active"><i>⌂</i>${copy.home}</span><span><i>◇</i>${copy.explore}</span><span><i>♡</i>${copy.saved}</span><span><i>○</i>${copy.profile}</span></div></div>`,
  tabs: ({ copy }) => `
    <div class="vp-tabs vp-tabs--clean"><div class="vp-tab-list"><span class="is-active">${copy.overview}</span><span>${copy.activity}</span><span>${copy.files}</span></div><div class="vp-tab-panel"><div class="vp-tabs-summary"><div><small>${copy.thisMonth}</small><strong>12,480</strong><em>+18.4%</em></div><span>${copy.updated}</span></div><div class="vp-tabs-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="vp-tabs-footer"><span>${copy.projects}</span><b>${copy.activeCount}</b></div></div></div>`,
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

const componentPreviewFactories = Object.freeze({
  "component-btn-solid": ({ entry, language }) => `
    <div class="vp-component-entry vp-component-button-preview vp-component-button-preview--solid">
      <span class="vp-component-entry__type">${escapeHtml(entry.componentKind)}</span>
      <strong>${escapeHtml(language === "en" ? entry.en : entry.name)}</strong>
      <div class="vp-component-button-stage"><span class="vp-component-btn is-solid">${language === "en" ? "Save changes" : "保存更改"}</span><i></i></div>
      <small>${escapeHtml(entry.role)}</small>
    </div>`,
  "component-btn-outline": ({ entry, language }) => `
    <div class="vp-component-entry vp-component-button-preview vp-component-button-preview--outline">
      <span class="vp-component-entry__type">${escapeHtml(entry.componentKind)}</span>
      <strong>${escapeHtml(language === "en" ? entry.en : entry.name)}</strong>
      <div class="vp-component-button-stage"><span class="vp-component-btn is-outline">${language === "en" ? "Back" : "返回"}</span><span class="vp-component-btn is-muted">${language === "en" ? "Cancel" : "取消"}</span></div>
      <small>${escapeHtml(entry.role)}</small>
    </div>`,
  "component-btn-ghost": ({ entry, language }) => `
    <div class="vp-component-entry vp-component-button-preview vp-component-button-preview--ghost">
      <span class="vp-component-entry__type">${escapeHtml(entry.componentKind)}</span>
      <strong>${escapeHtml(language === "en" ? entry.en : entry.name)}</strong>
      <div class="vp-component-toolbar"><span></span><span></span><span class="vp-component-btn is-ghost">${language === "en" ? "Duplicate" : "复制"}</span></div>
      <small>${escapeHtml(entry.role)}</small>
    </div>`,
  "component-btn-text": ({ entry, language }) => `
    <div class="vp-component-entry vp-component-button-preview vp-component-button-preview--text">
      <span class="vp-component-entry__type">${escapeHtml(entry.componentKind)}</span>
      <strong>${escapeHtml(language === "en" ? entry.en : entry.name)}</strong>
      <div class="vp-component-text-row"><i></i><span class="vp-component-btn is-text">${language === "en" ? "View details" : "查看详情"} ↗</span></div>
      <small>${escapeHtml(entry.role)}</small>
    </div>`,
  "component-btn-icon": ({ entry, language }) => `
    <div class="vp-component-entry vp-component-button-preview vp-component-button-preview--icon">
      <span class="vp-component-entry__type">${escapeHtml(entry.componentKind)}</span>
      <strong>${escapeHtml(language === "en" ? entry.en : entry.name)}</strong>
      <div class="vp-component-icon-row"><span class="vp-component-icon-btn">⌕</span><span class="vp-component-icon-btn is-active">＋</span><span class="vp-component-icon-btn">♡</span><span class="vp-component-icon-btn">⋯</span></div>
      <small>${escapeHtml(entry.role)}</small>
    </div>`,
  "component-btn-fab": ({ entry, language }) => `
    <div class="vp-component-entry vp-component-button-preview vp-component-button-preview--fab">
      <span class="vp-component-entry__type">${escapeHtml(entry.componentKind)}</span>
      <strong>${escapeHtml(language === "en" ? entry.en : entry.name)}</strong>
      <div class="vp-component-phone-scene"><i></i><i></i><i></i><span class="vp-component-fab">＋</span></div>
      <small>${escapeHtml(entry.role)}</small>
    </div>`,
  "component-btn-split": ({ entry, language }) => `
    <div class="vp-component-entry vp-component-button-preview vp-component-button-preview--split">
      <span class="vp-component-entry__type">${escapeHtml(entry.componentKind)}</span>
      <strong>${escapeHtml(language === "en" ? entry.en : entry.name)}</strong>
      <div class="vp-component-split-btn"><span>${language === "en" ? "Export" : "导出"}</span><b>⌄</b></div>
      <small>${escapeHtml(entry.role)}</small>
    </div>`,
  "component-btn-destructive": ({ entry, language }) => `
    <div class="vp-component-entry vp-component-button-preview vp-component-button-preview--danger">
      <span class="vp-component-entry__type">${escapeHtml(entry.componentKind)}</span>
      <strong>${escapeHtml(language === "en" ? entry.en : entry.name)}</strong>
      <div class="vp-component-button-stage"><span class="vp-component-btn is-danger">${language === "en" ? "Delete item" : "删除项目"}</span><span class="vp-component-warning"></span></div>
      <small>${escapeHtml(entry.role)}</small>
    </div>`,
});

const componentKindFactories = Object.freeze({
  hero: ({ entry, language }) => {
    const title = language === "en" ? entry.en : entry.name;
    const variant = entry.id.replace("component-hero-", "");
    const labels = { centered: ["居中主视觉", "Centered hero"], split: ["左右分栏", "Split hero"], fullbleed: ["全屏图片", "Full-bleed hero"], video: ["视频背景", "Video hero"], mockup: ["产品展示", "Product mockup"], search: ["搜索主导", "Search-led hero"], bento: ["Bento 网格", "Bento hero"] };
    const label = labels[variant]?.[language === "en" ? 1 : 0] || (language === "en" ? "Hero layout" : "首屏布局");
    const imageUrl = componentHeroMedia[variant] || componentHeroMedia.centered;
    const image = `<img class="vp-hero-real-image" src="${escapeHtml(imageUrl)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">`;
    if (variant === "bento") return `<div class="vp-variant-scene vp-variant-scene--hero vp-variant-scene--bento"><div class="vp-hero-bento-main">${image}<div><small>${escapeHtml(label)}</small><strong>${escapeHtml(title)}</strong></div></div><div class="vp-hero-bento-side"><img src="${escapeHtml(componentHeroMedia.mockup)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"><span>${language === "en" ? "Product" : "产品"}</span><img src="${escapeHtml(componentHeroMedia.search)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"></div></div>`;
    return `<div class="vp-variant-scene vp-variant-scene--hero vp-variant-scene--${escapeHtml(variant)}">${image}<div class="vp-hero-real-overlay"></div><div class="vp-hero-real-copy"><div class="vp-variant-kicker">${escapeHtml(label)}</div><strong>${escapeHtml(title)}</strong>${variant === "search" ? `<div class="vp-hero-search-field">⌕ <span>${language === "en" ? "Search ideas, places, products…" : "搜索灵感、目的地或产品…"}</span></div>` : `<span class="vp-variant-line"></span><div class="vp-variant-action">${language === "en" ? "Explore" : "开始探索"}</div>`}${variant === "video" ? `<span class="vp-hero-play">▶</span>` : ""}</div></div>`;
  },
  card: ({ entry, language }) => {
    const title = language === "en" ? entry.en : entry.name;
    const variant = entry.id.replace("component-card-", "");
    const zh = language !== "en";
    const label = zh ? `${title}布局` : `${variant} card`;
    const imageUrl = componentCardMedia[variant] || componentCardMedia["image-top"];
    const image = `<img class="vp-card-real-image" src="${escapeHtml(imageUrl)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">`;
    if (variant === "data") return `<div class="vp-variant-scene vp-variant-scene--card vp-variant-scene--data"><div class="vp-data-card-head"><small>${zh ? "本月收入" : "Monthly revenue"}</small><span>•••</span></div><strong class="vp-data-card-value">¥428,600</strong><em>+18.4%</em><div class="vp-data-card-chart"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>`;
    if (variant === "pricing") return `<div class="vp-variant-scene vp-variant-scene--card vp-variant-scene--pricing"><small>${zh ? "专业版" : "PRO"}</small><strong>¥168<em>/${zh ? "月" : "mo"}</em></strong><p>${zh ? "适合需要完整协作能力的团队" : "For teams that need full collaboration"}</p><ul><li>✓ ${zh ? "无限项目" : "Unlimited projects"}</li><li>✓ ${zh ? "团队工作区" : "Team workspace"}</li><li>✓ ${zh ? "版本历史" : "Version history"}</li></ul><span>${zh ? "开始使用" : "Get started"}</span></div>`;
    if (variant === "borderless") return `<div class="vp-variant-scene vp-variant-scene--card vp-variant-scene--borderless"><div>${image}<span><small>${zh ? "空间" : "SPACE"}</small><strong>${zh ? "安静的材料研究" : "Quiet material study"}</strong></span></div><div><img src="${escapeHtml(componentCardMedia.product)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"><span><small>${zh ? "产品" : "PRODUCT"}</small><strong>${zh ? "每日器物精选" : "Everyday objects"}</strong></span></div></div>`;
    return `<div class="vp-variant-scene vp-variant-scene--card vp-variant-scene--${escapeHtml(variant)}">${image}<div class="vp-card-variant-copy"><small>${escapeHtml(label)}</small><strong>${escapeHtml(title)}</strong><p>${variant === "product" ? (zh ? "轻量腕表 · 雾灰" : "Minimal watch · Fog grey") : variant === "article" ? (zh ? "从真实案例开始理解界面结构。" : "Learn interface structure from real cases.") : (zh ? "完整内容摘要与真实媒体。" : "Real media with a complete content summary.")}</p><span>${variant === "product" ? "¥1,280" : (zh ? "查看详情" : "View details")} ↗</span></div></div>`;
  },
  modal: ({ entry, language }) => {
    const title = language === "en" ? entry.en : entry.name;
    const variant = entry.id.replace("component-modal-", "");
    return `<div class="vp-variant-scene vp-variant-scene--modal vp-variant-scene--${escapeHtml(variant)}"><div class="vp-modal-variant-backdrop"></div><div class="vp-modal-variant-box"><small>${escapeHtml(variant)}</small><strong>${escapeHtml(title)}</strong><p>${language === "en" ? "Keep the task focused and make the next action clear." : "让当前任务保持聚焦，并明确下一步操作。"}</p><div><span>${language === "en" ? "Cancel" : "取消"}</span><b>${language === "en" ? "Confirm" : "确认"}</b></div></div></div>`;
  },
  form: ({ entry, language }) => {
    const title = language === "en" ? entry.en : entry.name;
    const variant = entry.id.replace("component-form-", "");
    const zh = language !== "en";
    const fields = {
      single: zh ? ["姓名", "工作邮箱", "职位", "需求说明"] : ["Name", "Work email", "Role", "Project brief"],
      multi: zh ? ["公司名称", "官网", "国家 / 地区", "城市"] : ["Company", "Website", "Country", "City"],
      login: zh ? ["邮箱地址", "密码"] : ["Email address", "Password"],
      checkout: zh ? ["联系邮箱", "配送地址", "付款方式"] : ["Contact email", "Shipping address", "Payment method"],
    };
    const fieldMarkup = (items) => items.map((label) => `<label><span>${escapeHtml(label)}</span><i></i></label>`).join("");
    let body = "";
    if (variant === "stepper") body = `<div class="vp-form-progress"><span class="is-done">1</span><i></i><span class="is-active">2</span><i></i><span>3</span><i></i><span>4</span></div><div class="vp-form-step-copy"><small>${zh ? "第 2 / 4 步" : "Step 2 of 4"}</small><b>${zh ? "公司资料" : "Company details"}</b></div>${fieldMarkup((fields.multi || []).slice(0, 2))}<em>${zh ? "继续" : "Continue"} →</em>`;
    else if (variant === "inline") body = `<div class="vp-inline-display"><small>${zh ? "项目标题" : "Project title"}</small><div><b>Atlas Design System</b><span>${zh ? "编辑" : "Edit"}</span></div></div><div class="vp-inline-edit"><input value="Atlas Design System" readonly><div><button>${zh ? "取消" : "Cancel"}</button><b>${zh ? "保存" : "Save"}</b></div></div>`;
    else if (variant === "conversational") body = `<div class="vp-conversation-progress"><span style="width:50%"></span></div><small>${zh ? "第 2 / 4 题" : "Question 2 of 4"}</small><b class="vp-conversation-question">${zh ? "这个产品主要给谁使用？" : "Who is this product for?"}</b><div class="vp-conversation-options"><span>${zh ? "个人用户" : "Individuals"}</span><span class="is-active">${zh ? "产品团队" : "Product teams"}</span><span>${zh ? "企业客户" : "Enterprises"}</span></div>`;
    else if (variant === "checkout") body = `<div class="vp-checkout-layout"><div>${fieldMarkup(fields.checkout)}</div><aside><small>${zh ? "订单摘要" : "Order summary"}</small><p><span>${zh ? "专业版年付" : "Pro annual"}</span><b>¥1,688</b></p><p><span>${zh ? "税费" : "Tax"}</span><b>¥0</b></p><strong><span>${zh ? "总计" : "Total"}</span><b>¥1,688</b></strong></aside></div>`;
    else {
      const selectedFields = fields[variant] || fields.single;
      body = `${fieldMarkup(selectedFields)}${variant === "login" ? `<div class="vp-login-options"><span>□ ${zh ? "记住我" : "Remember me"}</span><b>${zh ? "忘记密码？" : "Forgot password?"}</b></div>` : ""}<em>${variant === "login" ? (zh ? "登录" : "Sign in") : (zh ? "继续" : "Continue")} →</em>`;
    }
    return `<div class="vp-variant-scene vp-variant-scene--form vp-variant-scene--${escapeHtml(variant)}"><div class="vp-form-variant-head"><small>${escapeHtml(variant)}</small><strong>${escapeHtml(title)}</strong><p>${escapeHtml(entry.role)}</p></div><div class="vp-form-variant-body">${body}</div></div>`;
  },
  tabs: ({ entry, language }) => {
    const title = language === "en" ? entry.en : entry.name;
    const variant = entry.id.replace("component-tabs-", "");
    const zh = language !== "en";
    const labels = zh ? ["概览", "动态", "文件"] : ["Overview", "Activity", "Files"];
    const icons = ["⌂", "◇", "□"];
    const tabItems = labels.map((label, index) => `<span class="${index === 0 ? "is-active" : ""}">${variant === "icon" ? `<b>${icons[index]}</b>` : ""}${label}</span>`).join("");
    if (variant === "vertical") return `<div class="vp-variant-scene vp-variant-scene--tabs vp-variant-scene--vertical"><aside><small>${zh ? "工作区设置" : "WORKSPACE SETTINGS"}</small>${[zh ? "常规" : "General", zh ? "成员" : "Members", zh ? "通知" : "Notifications", zh ? "账单" : "Billing"].map((label, index) => `<span class="${index === 0 ? "is-active" : ""}">${label}</span>`).join("")}</aside><div class="vp-tabs-variant-panel"><small>${zh ? "常规" : "GENERAL"}</small><strong>${zh ? "工作区资料" : "Workspace profile"}</strong><i></i><i></i><button>${zh ? "保存更改" : "Save changes"}</button></div></div>`;
    if (variant === "scroll") return `<div class="vp-variant-scene vp-variant-scene--tabs vp-variant-scene--scroll"><div class="vp-tabs-scroll-head"><strong>${zh ? "发现" : "Discover"}</strong><span>⌕</span></div><div class="vp-tabs-variant-bar">${(zh ? ["推荐", "设计", "AI", "商业", "文化", "旅行"] : ["For you", "Design", "AI", "Business", "Culture", "Travel"]).map((label, index) => `<span class="${index === 0 ? "is-active" : ""}">${label}</span>`).join("")}</div><div class="vp-tabs-article"><b>${zh ? "设计团队如何使用 AI" : "How design teams use AI"}</b><p>${zh ? "当前分类的真实内容摘要。" : "A real summary for the active category."}</p></div></div>`;
    return `<div class="vp-variant-scene vp-variant-scene--tabs vp-variant-scene--${escapeHtml(variant)}"><div class="vp-tabs-variant-title">${escapeHtml(title)}</div><div class="vp-tabs-variant-bar">${tabItems}</div><div class="vp-tabs-variant-panel"><small>${zh ? "本月表现" : "THIS MONTH"}</small><strong>12,480</strong><em>+18.4%</em><div class="vp-tabs-mini-bars"><i></i><i></i><i></i><i></i><i></i></div></div></div>`;
  },
});

function componentPreviewFactory(entry) {
  if (!entry?.componentKind) return null;
  return componentPreviewFactories[entry.id] || componentKindFactories[entry.componentKind] || (({ entry: currentEntry, language }) => `
    <div class="vp-component-entry vp-component-entry--${escapeHtml(currentEntry.componentKind)}">
      <span class="vp-component-entry__type">${escapeHtml(currentEntry.componentKind)}</span>
      <strong>${escapeHtml(language === "en" ? currentEntry.en : currentEntry.name)}</strong>
      <div class="vp-component-entry__layout"><i></i><i></i><i></i></div>
      <small>${escapeHtml(currentEntry.role)}</small>
    </div>`);
}

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
  const entry = typeof entryOrId === "object" ? entryOrId : null;
  const factory = previewFactories[id] || componentPreviewFactory(entry);
  if (!factory) throw new RangeError(`Unsupported vocabulary preview: ${id || "(missing id)"}`);
  const copy = vocabularyPreviewCopy[language === "en" ? "en" : "zh"];
  const safeRequestedImage = externalImageUrl(imageUrl);
  const rejectedImage = Boolean(imageUrl) && safeRequestedImage === DEFAULT_IMAGE_URL && imageUrl !== DEFAULT_IMAGE_URL;
  const resolvedImage = rejectedImage ? DEFAULT_IMAGE_URL : solutionMedia[id] || safeRequestedImage;
  const mediaUrls = solutionMediaSets[id] || [resolvedImage, resolvedImage, resolvedImage];
  return `<div class="vocabulary-preview vocabulary-preview--${id}" data-vocabulary-preview="${id}" aria-hidden="true"><div class="vp-canvas">${factory({ copy, entry, imageUrl: resolvedImage, language, mediaUrls })}</div></div>`;
}

export function renderVocabularyPreview(target, entryOrId, options) {
  if (!target?.ownerDocument || typeof target.replaceChildren !== "function") throw new TypeError("A DOM target element is required");
  const template = target.ownerDocument.createElement("template");
  template.innerHTML = vocabularyPreviewMarkup(entryOrId, options);
  target.replaceChildren(template.content.cloneNode(true));
  return target.firstElementChild;
}
