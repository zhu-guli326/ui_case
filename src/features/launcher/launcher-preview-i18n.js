const lang = () => (window.image2I18n?.language === "en" ? "en" : "zh");
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const pick = (copy) => copy[lang()] ?? copy.zh;

function setText(selector, copy, root = document) {
  const node = $(selector, root);
  if (node) node.textContent = pick(copy);
}

function setTexts(selector, copy, root = document) {
  const values = pick(copy);
  $$(selector, root).forEach((node, index) => {
    if (values[index] != null) node.textContent = values[index];
  });
}

function setHtml(selector, copy, root = document) {
  const node = $(selector, root);
  if (node) node.innerHTML = pick(copy);
}

function setAttr(selector, attr, copy, root = document) {
  const node = $(selector, root);
  if (node) node.setAttribute(attr, pick(copy));
}

function syncPageMeta() {
  document.title = pick({ zh: "界面设计 DNA · ONDesign", en: "Interface DNA · ONDesign" });
  const description = $('meta[name="description"]');
  if (description) {
    description.content = pick({
      zh: "在开始前端开发前，搭建并保存一套可复用的界面设计 DNA。",
      en: "Build and save a reusable interface design DNA before starting front-end development.",
    });
  }

  setAttr(".dna-controls", "aria-label", { zh: "界面 DNA 设置", en: "Interface DNA settings" });
  setAttr(".direction-grid", "aria-label", { zh: "界面风格", en: "Interface style" });
  setAttr(".palette-list", "aria-label", { zh: "颜色方案", en: "Color palette" });
  setAttr(".type-list", "aria-label", { zh: "字体气质", en: "Typography style" });
  setAttr("[data-preset-list]", "aria-label", { zh: "设计 DNA 预设", en: "Design DNA presets" });
  setAttr("[data-preview-picker]", "aria-label", { zh: "选择预览页面或组件", en: "Choose a preview page or component" });
  setAttr(".device-switch", "aria-label", { zh: "预览设备", en: "Preview device" });
  setAttr(".preview-dock", "aria-label", { zh: "当前设计 DNA", en: "Current design DNA" });
  setAttr(".site-footer nav", "aria-label", { zh: "页脚导航", en: "Footer navigation" });

  const paletteLabels = {
    sage: { zh: "鼠尾草绿", en: "Sage green" },
    ink: { zh: "墨黑灰", en: "Ink black" },
    blue: { zh: "深海蓝", en: "Deep blue" },
    coral: { zh: "暖珊瑚", en: "Warm coral" },
  };
  Object.entries(paletteLabels).forEach(([key, copy]) => {
    const node = $(`.palette-option[data-value="${key}"]`);
    if (node) node.setAttribute("aria-label", pick(copy));
  });

  const nameInput = $("#dnaName");
  if (nameInput && ["克制绿 · Web DNA", "Restrained green · Web DNA"].includes(nameInput.value)) {
    nameInput.value = pick({ zh: "克制绿 · Web DNA", en: "Restrained green · Web DNA" });
  }
}

function syncDirectionDemos() {
  const titles = {
    fithub: { zh: "克制方向绑定的案例：极简训练规划", en: "Case linked to Restrained: FitHub training planner" },
    organique: { zh: "编辑感方向绑定的案例：编辑式有机餐食", en: "Case linked to Editorial: Organique Food" },
    "plate-play": { zh: "活力方向绑定的案例：高彩插画食谱", en: "Case linked to Vivid: Plate Play recipe" },
    "volt-route": { zh: "未来感方向绑定的案例：暗色电车充电导航", en: "Case linked to Futuristic: Volt Route EV navigation" },
  };

  $$(".direction-live[data-demo]").forEach((wrap) => {
    const frame = $("iframe", wrap);
    if (!frame) return;
    const key = wrap.dataset.demo;
    if (titles[key]) frame.title = pick(titles[key]);
    const source = frame.getAttribute("src") || "";
    const next = source.match(/(?:[?&])lang=(?:zh|en)/)
      ? source.replace(/([?&]lang=)(?:zh|en)/, `$1${lang()}`)
      : `${source}${source.includes("?") ? "&" : "?"}lang=${lang()}`;
    if (next !== source) frame.setAttribute("src", next);
  });
}

function syncLanding(root) {
  setTexts(".sample-nav div span", { zh: ["作品", "方法", "关于"], en: ["Work", "Method", "About"] }, root);
  setText(".sample-nav button", { zh: "联系", en: "Contact" }, root);
  setText(".sample-copy h3", { zh: "让每一个页面，都拥有同一种气质。", en: "Give every page the same design character." }, root);
  setText(".sample-copy p", { zh: "清晰的颜色、字体、形状与间距，让设计不再从头开始。", en: "Clear rules for color, type, shape and spacing mean every design starts with a system." }, root);
  setHtml(".sample-copy a", { zh: "查看项目 <span>→</span>", en: "View projects <span>→</span>" }, root);
  setAttr(".sample-visual img", "alt", { zh: "城市高楼建筑实景", en: "City skyscrapers viewed from below" }, root);
  setTexts(".sample-grid article strong", { zh: ["视觉方向", "基础规范", "持续复用"], en: ["Visual direction", "Foundation", "Reuse consistently"] }, root);
  setTexts(".sample-grid article p", {
    zh: ["用统一的视觉语言建立第一印象。", "把关键选择变成可以复用的规则。", "让不同页面保持相同的设计气质。"],
    en: ["Build a first impression with one visual language.", "Turn key choices into reusable rules.", "Keep the same design character across pages."],
  }, root);
}

function syncNav(root) {
  setTexts(".v-navbar div span", { zh: ["首页", "作品", "服务", "关于"], en: ["Home", "Work", "Services", "About"] }, root);
  setText(".v-navbar button", { zh: "联系我们", en: "Contact us" }, root);
  setTexts(".v-tabs span", { zh: ["全部作品", "品牌设计", "界面设计", "动效"], en: ["All work", "Brand design", "UI design", "Motion"] }, root);
  setHtml(".v-breadcrumb", { zh: "首页 / 作品 / <b>品牌设计</b>", en: "Home / Work / <b>Brand design</b>" }, root);
  setText(".v-menu-card small", { zh: "菜单预览", en: "Menu preview" }, root);
  setTexts(".v-menu-card a", { zh: ["作品集管理", "团队协作", "发布设置", "数据洞察"], en: ["Portfolio management", "Team collaboration", "Publishing settings", "Analytics"] }, root);
}

function syncCards(root) {
  setTexts(".v-card .v-tag", { zh: ["新品", "方法论", "案例"], en: ["New", "Method", "Case"] }, root);
  setTexts(".v-card h4", { zh: ["年度设计系统盘点", "界面气质的五种来源", "把 DNA 应用到新页面"], en: ["Design systems: annual review", "Five sources of interface character", "Apply DNA to a new page"] }, root);
  setTexts(".v-card > p", {
    zh: ["从色彩到圆角，一套可复用的界面规范。", "方向、色彩、字体、形状与密度如何协同。", "保留规范，只调整内容结构。"],
    en: ["A reusable interface system from color to radius.", "How direction, color, type, shape and density work together.", "Keep the rules; only adjust the content structure."],
  }, root);
  setTexts(".v-card footer button", { zh: ["查看", "阅读", "查看"], en: ["View", "Read", "View"] }, root);
  const prices = $$(".v-card footer b", root);
  if (prices[1]) prices[1].textContent = pick({ zh: "免费", en: "Free" });
  setTexts(".v-cover", { zh: [], en: [] }, root);
  const images = $$(".v-cover", root);
  const alts = pick({
    zh: ["城市人物摄影", "咖啡店室内空间摄影", "沙漠公路旅行摄影"],
    en: ["Urban portrait photography", "Coffee shop interior photography", "Desert road-trip photography"],
  });
  images.forEach((image, index) => { if (alts[index]) image.alt = alts[index]; });
}

function syncForm(root) {
  setText(".v-form h4", { zh: "创建你的账户", en: "Create your account" }, root);
  setTexts(".v-form > label:not(.v-check) > span", { zh: ["名称", "邮箱", "使用场景"], en: ["Name", "Email", "Use case"] }, root);
  const nameInput = $('.v-form input[type="text"]', root);
  if (nameInput) nameInput.placeholder = pick({ zh: "你的名字或团队", en: "Your name or team" });
  setTexts(".v-form select option", { zh: ["个人学习", "团队协作", "客户项目"], en: ["Personal learning", "Team collaboration", "Client project"] }, root);
  setText(".v-check span", { zh: "同意接收设计月刊", en: "Receive the monthly design newsletter" }, root);
  setText(".v-form > .v-btn", { zh: "创建账户", en: "Create account" }, root);
  setText(".v-form > small", { zh: "已有账户？直接登录。", en: "Already have an account? Sign in." }, root);
}

function syncPricing(root) {
  setTexts(".v-price h5", { zh: ["体验版", "工作室", "企业"], en: ["Starter", "Studio", "Enterprise"] }, root);
  setTexts(".v-price .v-cost", { zh: ["¥0/月", "¥68/月", "定制"], en: ["¥0/mo", "¥68/mo", "Custom"] }, root);
  setText(".v-flag", { zh: "推荐", en: "Recommended" }, root);
  const lists = $$(".v-price ul", root);
  const items = pick({
    zh: [["3 套 DNA", "基础预览", "社区支持"], ["无限 DNA", "组件级预览", "提示词导出", "优先支持"], ["私有部署", "品牌规范接入", "专属顾问"]],
    en: [["3 DNA presets", "Basic preview", "Community support"], ["Unlimited DNA", "Component previews", "Prompt export", "Priority support"], ["Private deployment", "Brand-system integration", "Dedicated consultant"]],
  });
  lists.forEach((list, index) => setTexts("li", { zh: items[index], en: items[index] }, list));
  setTexts(".v-price > .v-btn", { zh: ["开始使用", "立即订阅", "联系销售"], en: ["Get started", "Subscribe now", "Contact sales"] }, root);
}

function syncDashboard(root) {
  setTexts(".v-stat small", { zh: ["本月访问", "复用 DNA", "转化率"], en: ["Visits this month", "DNA reuses", "Conversion rate"] }, root);
  setTexts(".v-bars-labels span", { zh: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"], en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }, root);
  setTexts(".v-rows b", { zh: ["落地页 A", "定价页 B", "导航 C"], en: ["Landing A", "Pricing B", "Navigation C"] }, root);
  setTexts(".v-rows span", { zh: ["克制 · 鼠尾草绿", "活力 · 暖珊瑚", "编辑感 · 墨黑灰"], en: ["Restrained · Sage green", "Vivid · Warm coral", "Editorial · Ink black"] }, root);
}

function syncArticle(root) {
  setText(".v-tag", { zh: "设计方法论", en: "Design method" }, root);
  setText(".v-article-title", { zh: "一套 DNA 是如何生长的", en: "How a design DNA grows" }, root);
  setText(".v-article-meta b", { zh: "林一设计", en: "Lin Yi Design" }, root);
  setText(".v-article-meta span", { zh: "2026 年 8 月 · 6 分钟阅读", en: "August 2026 · 6 min read" }, root);
  setAttr(".v-article-meta img", "alt", { zh: "林一设计头像", en: "Lin Yi Design avatar" }, root);
  setAttr(".v-article-hero img", "alt", { zh: "现代设计工作室实景", en: "Modern design studio interior" }, root);
  setTexts(".v-article > p", {
    zh: [
      "每个产品第一次打开画布时都要回答同样的问题：主色是什么、标题用什么气质、卡片有多圆。没有 DNA 时，这些答案散落在每一次临时决定里。",
      "我们把答案压缩成五组变量——方向、颜色、字体、形状与密度。它们像基因一样进入每个新页面，决定气质，而不是规定布局。",
      "先选一个方向确定整体气质，密度与留白随之匹配；再把颜色、字体、圆角与间距固化成可复用的规则。",
    ],
    en: [
      "Every product starts with the same questions: what is the main color, what should headlines feel like, and how rounded should cards be? Without DNA, those answers get scattered across one-off decisions.",
      "We compress the answers into five variables — direction, color, typography, shape and density. They flow into every new page like genes, defining character without dictating layout.",
      "Choose a direction to set the overall character, then lock color, typography, radius and spacing into reusable rules.",
    ],
  }, root);
  setText("blockquote", { zh: "「规范不是限制，而是让下一次创作有迹可循。」", en: "“A system is not a restriction; it gives the next design a starting point.”" }, root);
  setText(".v-article h3", { zh: "从方向到变量", en: "From direction to variables" }, root);
  setTexts(".v-article ul li", { zh: ["方向决定对比与留白的基调", "颜色体系约束情绪与可用性", "形状与密度控制阅读节奏"], en: ["Direction sets the tone for contrast and whitespace", "The color system balances mood and usability", "Shape and density control reading rhythm"] }, root);
  setText(".v-author b", { zh: "林一设计", en: "Lin Yi Design" }, root);
  setText(".v-author span", { zh: "写下你身边的设计系统故事", en: "Stories about the design systems around you" }, root);
  setText(".v-author button", { zh: "关注", en: "Follow" }, root);
}

function syncProduct(root) {
  setHtml(".v-breadcrumb", { zh: "首页 / 商店 / <b>日常护理精华</b>", en: "Home / Shop / <b>Daily Care Serum</b>" }, root);
  setText(".v-product-info h3", { zh: "日常护理精华 · 沙漠限定版", en: "Daily Care Serum · Desert Edition" }, root);
  setHtml(".v-product-info .v-cost", { zh: "¥129<i> 包邮</i>", en: "¥129<i> Free shipping</i>" }, root);
  setText(".v-desc", { zh: "轻盈乳液质地，沙漠植萃系列包装，配套同色系礼盒。", en: "A lightweight lotion texture in the Desert Botanicals collection, with a matching gift box." }, root);
  setTexts(".v-option > span", { zh: ["颜色", "尺寸"], en: ["Color", "Size"] }, root);
  setTexts(".v-buy button", { zh: ["加入购物车", "收藏"], en: ["Add to cart", "Save"] }, root);
  setTexts(".v-specs dt", { zh: ["质地", "容量", "包装"], en: ["Texture", "Volume", "Packaging"] }, root);
  setTexts(".v-specs dd", { zh: ["轻盈乳液", "50ml", "可回收纸盒"], en: ["Lightweight lotion", "50ml", "Recyclable paper box"] }, root);
  const images = $$(".v-gallery img", root);
  const alts = pick({
    zh: ["沙漠场景中的护理产品摄影", "护理产品主视图", "花卉场景产品氛围图", "建筑场景产品氛围图"],
    en: ["Care product photographed in a desert setting", "Care product main view", "Product mood image with flowers", "Product mood image with architecture"],
  });
  images.forEach((image, index) => { if (alts[index]) image.alt = alts[index]; });
}

function syncSettings(root) {
  setText(".v-settings h3", { zh: "通用设置", en: "General settings" }, root);
  setText(".v-settings-sub", { zh: "这些偏好会跟随你的 DNA 一起保存。", en: "These preferences are saved with your DNA." }, root);
  setTexts(".v-setting > div:first-child b", { zh: ["外观主题", "跟随系统", "新作品提醒", "每周摘要", "界面语言", "退出登录"], en: ["Appearance", "Follow system", "New work alerts", "Weekly digest", "Interface language", "Sign out"] }, root);
  setTexts(".v-setting > div:first-child small", {
    zh: ["预览画布与示例页面一起变化", "切换设备主题时自动同步", "关注的作者发布时通知我", "每周一发送上周的设计灵感", "预览示例文案的显示语言", "退出当前浏览器上的账户"],
    en: ["Change the preview canvas and sample page together", "Sync automatically when the device theme changes", "Notify me when followed creators publish", "Send last week's design inspiration every Monday", "Language used by the preview examples", "Sign out on this browser"],
  }, root);
  setTexts(".v-setting:first-of-type .v-chips button", { zh: ["浅色", "深色"], en: ["Light", "Dark"] }, root);
  const languageButtons = $$(".v-setting .v-chips button", root).slice(-2);
  if (languageButtons[0]) languageButtons[0].textContent = pick({ zh: "简体中文", en: "Chinese" });
  if (languageButtons[1]) languageButtons[1].textContent = "English";
  setText(".v-setting:last-child > .v-btn", { zh: "退出", en: "Sign out" }, root);
}

function syncPreviewCopy() {
  const views = {
    landing: syncLanding,
    nav: syncNav,
    cards: syncCards,
    form: syncForm,
    pricing: syncPricing,
    dash: syncDashboard,
    article: syncArticle,
    product: syncProduct,
    settings: syncSettings,
  };
  Object.entries(views).forEach(([name, render]) => {
    const root = $(`[data-view="${name}"]`);
    if (root) render(root);
  });
}

function applyLauncherLanguage() {
  syncPageMeta();
  syncDirectionDemos();
  syncPreviewCopy();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applyLauncherLanguage, { once: true });
} else {
  applyLauncherLanguage();
}

window.addEventListener("image2:languagechange", applyLauncherLanguage);
