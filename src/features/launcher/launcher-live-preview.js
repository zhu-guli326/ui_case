const STYLE_VERSION = "20260817-simplified-v3";
const q = (selector) => document.querySelector(selector);
const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
const locale = () => {
  const query = new URL(location.href).searchParams.get("lang");
  if (query === "en" || query === "zh") return query;
  return window.image2I18n?.language === "en" ? "en" : "zh";
};
const localized = (zh, en) => locale() === "en" ? en : zh;

function installStyles() {
  if (q('link[data-launcher-live-preview]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(`./launcher-live-preview.css?v=${STYLE_VERSION}`, import.meta.url).href;
  link.dataset.launcherLivePreview = "true";
  document.head.append(link);
}

function sectionMarkup() {
  return `
    <header class="preview-lab-head">
      <div class="preview-lab-head-copy"><h2 id="livePreviewTitle">${localized("页面预览", "Page preview")}</h2><p>${localized("这里只保留一个完整页面预览。平台、Design System 和页面模板会直接同步到这里。", "This is the single full-page preview. Platform, design system, and page template sync here directly.")}</p></div>
      <span class="preview-lab-badge">${localized("实时联动", "Live sync")}</span>
    </header>
    <div class="preview-toolbar" aria-label="${localized("预览控制", "Preview controls")}">
      <label class="preview-field"><span>${localized("页面", "Page")}</span><select id="previewPageTemplate"><option value="account">${localized("账户设置 / Account Settings", "Account Settings")}</option><option value="dashboard">${localized("数据面板 / Dashboard", "Dashboard")}</option><option value="commerce">${localized("商品详情 / Product Detail", "Product Detail")}</option><option value="editorial">${localized("内容主页 / Editorial Home", "Editorial Home")}</option></select></label>
      <div class="preview-field"><span>${localized("设备", "Device")}</span><div class="preview-segment" id="previewDeviceSegment" role="group"><button type="button" data-size="desktop" aria-pressed="false">Desktop</button><button type="button" data-size="tablet" aria-pressed="false">Tablet</button><button type="button" data-size="mobile" class="is-active" aria-pressed="true">Mobile</button></div></div>
      <div class="preview-field"><span>${localized("主题", "Theme")}</span><div class="preview-segment" id="previewThemeSegment" role="group"><button type="button" data-theme="light" class="is-active" aria-pressed="true">Light</button><button type="button" data-theme="dark" aria-pressed="false">Dark</button></div></div>
      <label class="preview-field"><span>${localized("语言", "Language")}</span><select id="previewLanguage"><option value="zh">简体中文</option><option value="en">English</option></select></label>
      <div class="preview-current">${localized("当前系统：", "System: ")}<b id="previewCurrentSystem">${localized("跟随上方选择", "Follow selection")}</b></div>
    </div>
    <div class="preview-lab-stage" id="previewLabStage" data-theme="light"><div class="live-preview-canvas"><div class="preview-device live-preview-device" id="livePreviewDevice" data-size="mobile" data-platform="ios" aria-live="polite"></div></div></div>`;
}

const pageTemplates = {
  account: {
    zh: () => `<div class="preview-template"><div class="pt-top"><div><div class="pt-eyebrow">账户与偏好</div><h3 class="pt-title">账户设置</h3><p class="pt-sub">管理资料、安全、通知与隐私。</p></div><div class="pt-icon">•••</div></div><div class="pt-section-label">个人资料</div><div class="pt-card pt-profile"><div class="pt-avatar"></div><div><strong>Zhuzhu</strong><div class="pt-muted">zhuzhu@example.com</div></div><button class="pt-secondary">编辑</button></div><div class="pt-section-label">偏好设置</div><div class="pt-card pt-setting-list"><div><span>通知</span><span class="pt-toggle"></span></div><div><span>隐私与安全</span><b>›</b></div><div><span>外观</span><span class="pt-muted">跟随系统</span></div></div><button class="pt-primary">保存设置</button></div>`,
    en: () => `<div class="preview-template"><div class="pt-top"><div><div class="pt-eyebrow">ACCOUNT & PREFERENCES</div><h3 class="pt-title">Account Settings</h3><p class="pt-sub">Manage profile, security, notifications and privacy.</p></div><div class="pt-icon">•••</div></div><div class="pt-section-label">Profile</div><div class="pt-card pt-profile"><div class="pt-avatar"></div><div><strong>Zhuzhu</strong><div class="pt-muted">zhuzhu@example.com</div></div><button class="pt-secondary">Edit</button></div><div class="pt-section-label">Preferences</div><div class="pt-card pt-setting-list"><div><span>Notifications</span><span class="pt-toggle"></span></div><div><span>Privacy & Security</span><b>›</b></div><div><span>Appearance</span><span class="pt-muted">System</span></div></div><button class="pt-primary">Save changes</button></div>`
  },
  dashboard: {
    zh: () => `<div class="preview-template"><div class="pt-top"><div><div class="pt-eyebrow">TODAY · WORKSPACE</div><h3 class="pt-title">数据面板</h3><p class="pt-sub">把进度、待处理事项和趋势放在同一屏。</p></div><button class="pt-primary">+ 新建</button></div><div class="pt-grid pt-kpis"><div class="pt-card pt-kpi"><small>本周完成</small><strong>84%</strong><span class="pt-chip">+12%</span></div><div class="pt-card pt-kpi"><small>待评审</small><strong>12</strong><span class="pt-muted">3 紧急</span></div><div class="pt-card pt-kpi"><small>节省时间</small><strong>18.5h</strong><span class="pt-muted">本周</span></div></div><div class="pt-card"><div class="pt-row" style="justify-content:space-between"><strong>交付趋势</strong><span class="pt-muted">过去 7 天</span></div><div class="pt-chart"><div class="pt-bars"><i style="height:35%"></i><i style="height:52%"></i><i style="height:43%"></i><i style="height:72%"></i><i style="height:61%"></i><i style="height:88%"></i><i style="height:76%"></i></div></div></div></div>`,
    en: () => `<div class="preview-template"><div class="pt-top"><div><div class="pt-eyebrow">TODAY · WORKSPACE</div><h3 class="pt-title">Dashboard</h3><p class="pt-sub">Progress, reviews and trends in one focused workspace.</p></div><button class="pt-primary">+ New</button></div><div class="pt-grid pt-kpis"><div class="pt-card pt-kpi"><small>Completed</small><strong>84%</strong><span class="pt-chip">+12%</span></div><div class="pt-card pt-kpi"><small>Review</small><strong>12</strong><span class="pt-muted">3 urgent</span></div><div class="pt-card pt-kpi"><small>Saved</small><strong>18.5h</strong><span class="pt-muted">week</span></div></div><div class="pt-card"><div class="pt-row" style="justify-content:space-between"><strong>Delivery trend</strong><span class="pt-muted">Last 7 days</span></div><div class="pt-chart"><div class="pt-bars"><i style="height:35%"></i><i style="height:52%"></i><i style="height:43%"></i><i style="height:72%"></i><i style="height:61%"></i><i style="height:88%"></i><i style="height:76%"></i></div></div></div></div>`
  },
  commerce: {
    zh: () => `<div class="preview-template"><div class="pt-top"><div><div class="pt-eyebrow">NEW COLLECTION</div><h3 class="pt-title">商品详情</h3></div><div class="pt-icon">♡</div></div><div class="pt-grid pt-product"><div class="pt-product-visual"><div class="pt-product-shape"></div></div><div class="pt-product-info"><span class="pt-chip">新品 · 限量</span><h3 style="margin:0;font-size:22px">日常通勤包</h3><p class="pt-sub">轻量结构与柔软触感，为每天的移动重新设计。</p><div class="pt-price">¥1,299</div><div class="pt-swatches"><i></i><i></i><i></i></div><button class="pt-primary">加入购物车</button><button class="pt-secondary">尺寸与配送</button></div></div></div>`,
    en: () => `<div class="preview-template"><div class="pt-top"><div><div class="pt-eyebrow">NEW COLLECTION</div><h3 class="pt-title">Product Detail</h3></div><div class="pt-icon">♡</div></div><div class="pt-grid pt-product"><div class="pt-product-visual"><div class="pt-product-shape"></div></div><div class="pt-product-info"><span class="pt-chip">New · Limited</span><h3 style="margin:0;font-size:22px">Everyday Carry</h3><p class="pt-sub">A lightweight everyday bag redesigned for the commute.</p><div class="pt-price">$189</div><div class="pt-swatches"><i></i><i></i><i></i></div><button class="pt-primary">Add to cart</button><button class="pt-secondary">Size & delivery</button></div></div></div>`
  },
  editorial: {
    zh: () => `<div class="preview-template"><div class="pt-top"><div><div class="pt-eyebrow">FIELD NOTES · 08</div><h3 class="pt-title">内容主页</h3></div><div class="pt-row"><span class="pt-chip">设计</span><span class="pt-chip">文化</span><span class="pt-chip">产品</span></div></div><div class="pt-editorial-hero"><span class="pt-chip" style="align-self:flex-start;background:rgba(255,255,255,.16);color:#fff">本周专题</span><h3>好的界面，不应该让人意识到界面的存在</h3><p>从信息层级、组件节奏到交互反馈，重新理解安静的产品体验。</p></div><div class="pt-grid pt-stories"><article class="pt-card pt-story"><div class="pt-story-img"></div><div class="pt-story-copy"><span class="pt-eyebrow">DESIGN</span><strong>产品为什么需要视觉语言</strong><p>从品牌到组件建立一致体验。</p></div></article><article class="pt-card pt-story"><div class="pt-story-img"></div><div class="pt-story-copy"><span class="pt-eyebrow">PEOPLE</span><strong>创作者真实的一天</strong><p>工具如何进入日常工作流。</p></div></article></div></div>`,
    en: () => `<div class="preview-template"><div class="pt-top"><div><div class="pt-eyebrow">FIELD NOTES · 08</div><h3 class="pt-title">Editorial Home</h3></div><div class="pt-row"><span class="pt-chip">Design</span><span class="pt-chip">Culture</span><span class="pt-chip">Product</span></div></div><div class="pt-editorial-hero"><span class="pt-chip" style="align-self:flex-start;background:rgba(255,255,255,.16);color:#fff">FEATURE</span><h3>Good interfaces disappear into the experience</h3><p>Rethinking quiet product design through hierarchy, rhythm and feedback.</p></div><div class="pt-grid pt-stories"><article class="pt-card pt-story"><div class="pt-story-img"></div><div class="pt-story-copy"><span class="pt-eyebrow">DESIGN</span><strong>Why products need a visual language</strong><p>Build consistency from brand to components.</p></div></article><article class="pt-card pt-story"><div class="pt-story-img"></div><div class="pt-story-copy"><span class="pt-eyebrow">PEOPLE</span><strong>Inside a creator's day</strong><p>How tools enter real workflows.</p></div></article></div></div>`
  }
};

function currentPlatform() {
  return q('.platform-card[aria-checked="true"]')?.dataset.platform || q('.platform-card.is-active')?.dataset.platform || 'ios';
}

function init() {
  if (!document.body.classList.contains('launcher-workspace')) return;
  installStyles();
  document.body.classList.remove('create-flow-refactored');
  const mount = q('#resultStageBody') || q('.workspace-main');
  const sourceDevice = q('#previewDevice');
  if (!mount || !sourceDevice || q('#previewLabSection')) return;

  const section = document.createElement('section');
  section.className = 'preview-lab-section';
  section.id = 'previewLabSection';
  section.setAttribute('aria-labelledby', 'livePreviewTitle');
  section.innerHTML = sectionMarkup();
  mount.prepend(section);

  const stage = q('#previewLabStage');
  const liveDevice = q('#livePreviewDevice');
  const pageSelect = q('#previewPageTemplate');
  const languageSelect = q('#previewLanguage');
  const currentSystem = q('#previewCurrentSystem');
  if (!stage || !liveDevice || !pageSelect || !languageSelect || !currentSystem) return;
  languageSelect.value = locale();

  function renderPage() {
    const type = pageSelect.value || 'account';
    const language = languageSelect.value === 'en' ? 'en' : 'zh';
    const factory = pageTemplates[type]?.[language] || pageTemplates.account[language];
    liveDevice.innerHTML = factory();
    liveDevice.dataset.template = type;
  }
  function syncMetadata() {
    currentSystem.textContent = q('#previewSystemName')?.textContent?.trim() || localized('跟随上方选择', 'Follow selection');
    const accent = sourceDevice.style.getPropertyValue('--preview-accent') || getComputedStyle(sourceDevice).getPropertyValue('--preview-accent');
    if (accent.trim()) liveDevice.style.setProperty('--preview-accent', accent.trim());
  }
  function setDevice(size) {
    liveDevice.dataset.size = size;
    qa('#previewDeviceSegment button', section).forEach((button) => {
      const active = button.dataset.size === size;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
  function setTheme(theme) {
    stage.dataset.theme = theme;
    qa('#previewThemeSegment button', section).forEach((button) => {
      const active = button.dataset.theme === theme;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
  function setDeviceForPlatform(platform) {
    liveDevice.dataset.platform = platform;
    setDevice(platform === 'windows' || platform === 'macos' ? 'desktop' : 'mobile');
  }
  function syncPlatformFromUi() {
    setDeviceForPlatform(currentPlatform());
  }

  pageSelect.addEventListener('change', renderPage);
  languageSelect.addEventListener('change', renderPage);
  qa('#previewDeviceSegment button', section).forEach((button) => button.addEventListener('click', () => setDevice(button.dataset.size)));
  qa('#previewThemeSegment button', section).forEach((button) => button.addEventListener('click', () => setTheme(button.dataset.theme)));

  const platformGrid = q('#platformGrid');
  platformGrid?.addEventListener('click', (event) => {
    if (!event.target.closest('.platform-card[data-platform]')) return;
    queueMicrotask(syncPlatformFromUi);
    requestAnimationFrame(syncPlatformFromUi);
  });
  if (platformGrid) new MutationObserver(syncPlatformFromUi).observe(platformGrid, { subtree:true, attributes:true, attributeFilter:['aria-checked','class'] });

  new MutationObserver(syncMetadata).observe(sourceDevice, { attributes:true, attributeFilter:['style'] });
  const systemName = q('#previewSystemName');
  if (systemName) new MutationObserver(syncMetadata).observe(systemName, { childList:true, characterData:true, subtree:true });
  window.addEventListener('image2:launcherplatformchange', (event) => setDeviceForPlatform(event.detail?.platform || currentPlatform()));
  document.addEventListener('change', (event) => {
    if (event.target.matches('[name="colorTheme"],[name="fontScheme"]')) window.setTimeout(syncMetadata, 40);
  });
  window.image2I18n?.registerPage?.(() => { languageSelect.value = locale(); renderPage(); window.setTimeout(syncMetadata, 40); });

  setTheme('light');
  syncPlatformFromUi();
  syncMetadata();
  renderPage();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
else init();
