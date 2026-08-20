function getCaseStudies() {
  const isEn = window.image2I18n?.language === "en";
  return {
    fufu: {
      id: "fufu", name: "FuFu Bakery", style: isEn ? "Hand-drawn bakery membership" : "手绘烘焙会员", template: "commerce", brand: "airbnb", theme: "soft-lifestyle",
      reference: "./demo/fufu-bakery/assets/reference-overview.png",
      referenceAlt: isEn ? "FuFu Bakery original reference" : "FuFu Bakery 烘焙会员应用原始参考图",
      image: "./demo/fufu-bakery/mobile-preview.png",
      alt: isEn ? "FuFu Bakery final clickable pages" : "FuFu Bakery 手绘烘焙会员最终可点击页面",
      structure: isEn ? "Welcome, bakery home, today's menu, and member card form a lightweight store flow." : "欢迎页、烘焙首页、今日菜单和会员卡组成轻量门店流程。",
      assets: isEn ? "Dog baker illustration and bakery atmosphere reference." : "狗狗烘焙师插画和烘焙氛围参考图。",
      controls: isEn ? ["Enter button", "Menu switch", "Member card", "Bottom navigation"] : ["进入按钮", "菜单切换", "会员卡", "底部导航"],
      demo: "./demo/fufu-bakery/index.html",
      prompt: "使用 image-to-ui-skill，参考我上传的手绘烘焙会员应用图片，保留狗狗烘焙师、纸白留白、黄色按钮和底部导航结构，生成欢迎页、烘焙首页、今日菜单和会员卡可点击手机页面，并检查进入按钮、菜单切换与底部导航交互。"
    },
    plate: {
      id: "plate-play", name: "Plate Play", style: isEn ? "Vivid recipe illustration" : "高彩食谱插画", template: "commerce", brand: "airbnb", theme: "editorial-commerce",
      reference: "./demo/plate-play/assets/reference-overview.png",
      referenceAlt: isEn ? "Plate Play original reference" : "Plate Play 食谱应用原始参考图",
      image: "./demo/plate-play/mobile-preview.png",
      alt: isEn ? "Plate Play final clickable pages" : "Plate Play 食谱最终可点击页面",
      structure: isEn ? "Home intro, recipe list, and recipe detail form a flow from discovery to cooking." : "首页介绍、食谱列表和食谱详情形成从发现到烹饪的流程。",
      assets: isEn ? "Chef illustration and food photos." : "厨师主插画和食物照片。",
      controls: isEn ? ["Recipe categories", "Favorite button", "Bottom navigation"] : ["食谱分类", "收藏按钮", "底部导航"],
      demo: "./demo/plate-play/index.html",
      prompt: "使用 image-to-ui-skill，参考我上传的食谱应用图片，保留高彩插画、主行动按钮和食谱卡片结构，生成首页、食谱列表和详情三个可点击手机页面，并检查收藏与导航交互。"
    },
    relay: {
      id: "relay-music", name: "RELAY", style: isEn ? "Editorial music discovery" : "编辑感音乐发现", template: "social", brand: "notion", theme: "editorial-commerce",
      reference: "./demo/relay-music/assets/reference-overview.png",
      referenceAlt: isEn ? "RELAY original reference" : "RELAY 音乐应用原始参考图",
      image: "./demo/relay-music/assets/relay-effect-board.png",
      alt: isEn ? "RELAY final clickable pages" : "RELAY 音乐发现最终可点击页面",
      structure: isEn ? "Artist page, now playing, and discovery feed handle intro, playback, and exploration." : "艺人主页、正在播放和音乐发现流分别承担介绍、播放和继续探索。",
      assets: isEn ? "Artist photography, album covers, and content thumbnails." : "艺人摄影、专辑封面和内容缩略图。",
      controls: isEn ? ["Playback controls", "Favorite button", "Page switching"] : ["播放控制", "收藏按钮", "页面切换"],
      demo: "./demo/relay-music/index.html",
      prompt: "使用 image-to-ui-skill，参考我上传的音乐应用图片，保留编辑式摄影、深色播放器和发现流结构，生成艺人主页、播放页和发现页三个可点击手机页面，并检查播放与收藏状态。"
    }
  };
}

function copyText(text, statusElement, message) {
  const fallback = () => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  };

  const task = navigator.clipboard?.writeText ? navigator.clipboard.writeText(text) : Promise.resolve(fallback());
  task.then(() => { statusElement.textContent = message; }).catch(() => {
    fallback();
    statusElement.textContent = message;
  });
}

const quickPrompt = document.querySelector("#quickPrompt");
document.querySelector("#copyQuickPrompt")?.addEventListener("click", () => {
  copyText(quickPrompt.textContent.trim(), document.querySelector("#copyStatus"), learnT("learn.copyPromptSuccess", "Prompt 已复制，可以和参考图一起发送。", "Prompt copied — send it along with your reference image.") );
  window.image2Analytics?.track("beginner_prompt_copy", { source: "quick_start" });
});

const fufuThemes = {
  morning: { mood: "GOOD MORNING", title: () => learnT("learn.fufuMorningTitle", "早晨黄：温暖、醒目，适合主行动", "Morning yellow: warm and vivid, made for the primary action"), text: () => learnT("learn.fufuMorningText", "这是 CSS 在改变视觉语气。接着点击购买，让 JavaScript 改变会员状态。", "This is CSS changing the visual tone. Next, click buy and watch JavaScript change the member state.") },
  picnic: { mood: "PICNIC DAY", title: () => learnT("learn.fufuPicnicTitle", "野餐绿：清新、放松，像一次户外小憩", "Picnic green: fresh and calm, like a short outdoor break"), text: () => learnT("learn.fufuPicnicText", "同样的结构换一组颜色，就会形成不同气氛；功能仍然保持不变。", "The same structure with another palette creates a different mood; functionality stays the same.") },
  berry: { mood: "BERRY HOUR", title: () => learnT("learn.fufuBerryTitle", "莓果粉：甜美、亲近，更像一份小礼物", "Berry pink: sweet and warm, like a small gift"), text: () => learnT("learn.fufuBerryText", "颜色影响感受，清楚的按钮文案和反馈则决定操作是否容易理解。", "Color shapes feeling; clear button copy and feedback make actions easy to understand.") }
};

const fufuCodeSnippets = {
  html: `<section class="bakery-card">
  <header>
    <span>FU FU BAKERY</span>
    <strong>GOOD MORNING</strong>
  </header>

  <div class="product">
    <p>今日刚出炉</p>
    <h2>海盐黄油卷</h2>
    <img src="fufu-baker.png" alt="FuFu 狗狗烘焙师">
  </div>

  <div class="member-card">
    <strong><span id="stampCount">0</span> / 4</strong>
    <div id="stamps"><i></i><i></i><i></i><i></i></div>
  </div>

  <button id="buyButton">买一个面包，收集印章</button>
</section>`,
  css: `.bakery-card {
  --accent: #f1c957;
  --soft: #f8ead2;
  --label: #46647c;
  background: #fffefa;
}

.bakery-card[data-theme="picnic"] {
  --accent: #97c98b;
  --soft: #e1f0d8;
  --label: #2d6a47;
}

.bakery-card[data-theme="berry"] {
  --accent: #edaaa8;
  --soft: #f7dddd;
  --label: #8f4249;
}

.bakery-card header,
#buyButton { background: var(--accent); }
.product { background: var(--soft); }
.product > p { color: var(--label); }
#stamps i.is-stamped { background: var(--accent); }`,
  js: `let stampTotal = 0;
const buyButton = document.querySelector("#buyButton");
const stampCount = document.querySelector("#stampCount");
const stamps = document.querySelectorAll("#stamps i");

buyButton.addEventListener("click", () => {
  if (stampTotal >= 4) return;

  stampTotal += 1;
  stampCount.textContent = stampTotal;
  stamps.forEach((stamp, index) => {
    stamp.classList.toggle("is-stamped", index < stampTotal);
  });

  if (stampTotal === 4) {
    buyButton.disabled = true;
    buyButton.textContent = "已集满 4 枚印章";
  }
});`
};

function fufuCodeNote(type) {
  return type === "html" ? learnT("learn.codeNoteHtml", "HTML 决定页面里有哪些内容。", "HTML defines what content is on the page.")
    : type === "css" ? learnT("learn.codeNoteCss", "CSS 使用变量切换颜色，同一套结构可以呈现三种店铺气氛。", "CSS uses variables to switch colors; the same structure shows three different moods.")
    : learnT("learn.codeNoteJs", "JavaScript 记录购买次数，并把数据变化同步成印章状态。", "JavaScript tracks purchases and syncs data changes to stamp states.");
}

let activeFufuCode = "html";
const fufuCodeOutput = document.querySelector("#fufuCodeOutput");
const fufuCodeStatus = document.querySelector("#fufuCodeStatus");

function renderFufuCode(type) {
  activeFufuCode = type;
  fufuCodeOutput.textContent = fufuCodeSnippets[type];
  fufuCodeStatus.textContent = fufuCodeNote(type);
  document.querySelectorAll("[data-fufu-code]").forEach((button) => {
    const selected = button.dataset.fufuCode === type;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-selected", String(selected));
  });
}

document.querySelectorAll("[data-fufu-view]").forEach((button) => {
  button.addEventListener("click", () => {
    const showCode = button.dataset.fufuView === "code";
    document.querySelector("#fufuPreviewPanel").hidden = showCode;
    document.querySelector("#fufuCodePanel").hidden = !showCode;
    document.querySelectorAll("[data-fufu-view]").forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", String(selected));
    });
    if (showCode) renderFufuCode(activeFufuCode);
  });
});

document.querySelectorAll("[data-fufu-code]").forEach((button) => {
  button.addEventListener("click", () => renderFufuCode(button.dataset.fufuCode));
});

document.querySelector("#fufuCopyCode")?.addEventListener("click", () => {
  copyText(fufuCodeSnippets[activeFufuCode], fufuCodeStatus, `${activeFufuCode.toUpperCase()} 代码已复制。`);
});

renderFufuCode(activeFufuCode);

const fufuShop = document.querySelector("#fufuShop");
const fufuStampCount = document.querySelector("#fufuStampCount");
const fufuStamps = [...document.querySelectorAll("#fufuStamps span")];
const fufuBuyButton = document.querySelector("#fufuBuyButton");
const fufuResetButton = document.querySelector("#fufuResetButton");
const fufuStatus = document.querySelector("#fufuStatus");
let fufuStampTotal = 0;
let fufuCheerTimer;

document.querySelectorAll("[data-fufu-theme]").forEach((button) => {
  button.addEventListener("click", () => {
    const theme = fufuThemes[button.dataset.fufuTheme];
    document.querySelectorAll("[data-fufu-theme]").forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    fufuShop.dataset.theme = button.dataset.fufuTheme;
    document.querySelector("#fufuShopMood").textContent = theme.mood || "";
    document.querySelector("#fufuLessonTitle").textContent = typeof theme.title === "function" ? theme.title() : theme.title;
    document.querySelector("#fufuLessonText").textContent = typeof theme.text === "function" ? theme.text() : theme.text;
  });
});

function renderFufuStamps() {
  fufuStampCount.textContent = String(fufuStampTotal);
  fufuStamps.forEach((stamp, index) => stamp.classList.toggle("is-stamped", index < fufuStampTotal));
  document.querySelector("#fufuStamps").setAttribute("aria-label", window.image2I18n?.language === "en" ? `${fufuStampTotal} of 4 stamps collected` : `已收集 ${fufuStampTotal} 枚，共 4 枚印章`);
  document.querySelector("#fufuRewardText").textContent = fufuStampTotal === 4
    ? learnT("learn.fufuRewardFull", "集满了，可以兑换一枚免费的海盐黄油卷。", "All collected! Redeem a free sea salt butter roll.")
    : window.image2I18n?.language === "en" ? `Buy ${4 - fufuStampTotal} more to get a free bread.` : `再买 ${4 - fufuStampTotal} 个，就能兑换免费面包。`;
}

fufuBuyButton?.addEventListener("click", () => {
  if (fufuStampTotal >= 4) return;
  fufuStampTotal += 1;
  renderFufuStamps();
  fufuShop.classList.remove("is-stamping");
  requestAnimationFrame(() => {
    window.clearTimeout(fufuCheerTimer);
    fufuShop.classList.add("is-stamping");
    fufuCheerTimer = window.setTimeout(() => fufuShop.classList.remove("is-stamping"), 300);
  });
  if (fufuStampTotal === 4) {
    fufuBuyButton.disabled = true;
    fufuBuyButton.textContent = learnT("learn.fufuBuyFull", "已集满 4 枚印章", "4 stamps collected");
    fufuResetButton.classList.remove("is-hidden");
    fufuResetButton.setAttribute("aria-hidden", "false");
    fufuResetButton.tabIndex = 0;
    fufuStatus.textContent = learnT("learn.fufuStatusFull", "集满了！FuFu 请你吃一个免费的海盐黄油卷。", "All full! FuFu treats you to a free sea salt butter roll.");
  } else {
    fufuStatus.textContent = window.image2I18n?.language === "en" ? `Sold a bread — stamp ${fufuStampTotal} of 4.` : `卖出一个面包，获得第 ${fufuStampTotal} 枚印章。`;
  }
});

fufuResetButton?.addEventListener("click", () => {
  fufuStampTotal = 0;
  renderFufuStamps();
  fufuBuyButton.disabled = false;
  fufuBuyButton.textContent = learnT("learn.fufuBuyButton", "买一个面包，收集印章", "Buy a bread, collect a stamp");
  fufuResetButton.classList.add("is-hidden");
  fufuResetButton.setAttribute("aria-hidden", "true");
  fufuResetButton.tabIndex = -1;
  fufuStatus.textContent = learnT("learn.fufuStatusReset", "会员卡已经清空，烤箱仍然热着。", "The member card is clear and the oven is still warm.");
});

const casePanel = document.querySelector("#casePanel");
let activeCase = "fufu";
function renderCase(id) {
  const item = getCaseStudies()[id];
  activeCase = id;
  document.querySelector("#caseReferenceImage").src = item.reference;
  document.querySelector("#caseReferenceImage").alt = item.referenceAlt;
  document.querySelector("#caseImage").src = item.image;
  document.querySelector("#caseImage").alt = item.alt;
  document.querySelector("#caseStructure").textContent = item.structure;
  document.querySelector("#caseAssets").textContent = item.assets;
  document.querySelector("#caseControls").innerHTML = item.controls.map((control) => `<span>${control}</span>`).join("");
  document.querySelector("#caseDemoLink").href = item.demo;
  const taskUrl = new URL("./launcher.html", window.location.href);
  taskUrl.searchParams.set("intent", "rebuild");
  taskUrl.searchParams.set("source", "library");
  taskUrl.searchParams.set("case", item.id);
  document.querySelector("#caseTaskLink").href = window.image2I18n?.localizeUrl?.(taskUrl.href) || taskUrl.href;
}

const caseTabs = [...document.querySelectorAll("[data-case]")];
caseTabs.forEach((button, index) => {
  button.addEventListener("click", () => {
    caseTabs.forEach((tab) => {
      const selected = tab === button;
      tab.classList.toggle("is-selected", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    casePanel.setAttribute("aria-labelledby", button.id);
    renderCase(button.dataset.case);
  });
  button.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    caseTabs[(index + direction + caseTabs.length) % caseTabs.length].click();
    caseTabs[(index + direction + caseTabs.length) % caseTabs.length].focus();
  });
});

document.querySelector("#copyCasePrompt")?.addEventListener("click", () => {
  copyText(getCaseStudies()[activeCase].prompt, document.querySelector("#caseCopyStatus"), learnT("learn.copyCasePromptSuccess", "同款结构 Prompt 已复制。", "Case prompt copied.") );
  window.image2Analytics?.track("beginner_prompt_copy", { source: "case_study", case: activeCase });
});

function applyLearningCase() {
  const item = getCaseStudies()[activeCase];
  window.image2Project?.save?.({
    name: `${item.name} / ${item.style}`,
    template: item.template,
    brand: item.brand,
    theme: item.theme,
    sourceCaseId: item.id,
    sourceCaseName: item.name,
    sourceCaseStyle: item.style,
    sourceCaseImage: item.image,
    sourceCaseDemo: item.demo,
    lastStep: "library",
  });
  document.querySelector("#caseCopyStatus").textContent = `${item.name} 已应用到当前项目。`;
}

document.querySelector("#applyLearningCase")?.addEventListener("click", applyLearningCase);
document.querySelector("#caseTaskLink")?.addEventListener("click", () => {
  applyLearningCase();
  window.image2Project?.save?.({ taskIntent: "rebuild" });
});

const learningMapLinks = [...document.querySelectorAll("[data-learn-section]")];
const learningSections = learningMapLinks.map((link) => document.querySelector(`#${link.dataset.learnSection}`)).filter(Boolean);
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleEntry = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visibleEntry) return;
    learningMapLinks.forEach((link) => {
      const isCurrent = link.dataset.learnSection === visibleEntry.target.id;
      link.classList.toggle("is-current", isCurrent);
      if (isCurrent) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-28% 0px -58%", threshold: [0, .2, .5] });
  learningSections.forEach((section) => sectionObserver.observe(section));
}

const progressBar = document.querySelector("#pageProgressBar");
function updateProgress() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${available > 0 ? Math.min(100, (window.scrollY / available) * 100) : 0}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

window.image2Analytics?.track("beginner_guide_view");
// ---- i18n ----
const learnTranslations = {
  "learn.metaDescription": { zh: "不会前端，也能在 5 分钟内用 Image2 UI 把参考图变成可点击界面。", en: "No frontend experience needed to turn a reference image into a clickable interface with Image2 UI in 5 minutes." },
  "learn.pageTitle": { zh: "5 分钟做出第一个可点击界面 · IMAGE2 UI", en: "Build your first clickable interface in 5 minutes · IMAGE2 UI" },
  "learn.progressLabel": { zh: "本页进度", en: "Page progress" },
  "learn.yourProgress": { zh: "你的进度", en: "Your progress" },
  "learn.sectionFufu": { zh: "FuFu 小店", en: "FuFu shop" },
  "learn.sectionQuickStart": { zh: "快速开始", en: "Quick start" },
  "learn.sectionInputOutput": { zh: "输入与结果", en: "Input & output" },
  "learn.sectionCaseStudy": { zh: "案例拆解", en: "Case study" },
  "learn.sectionVocabulary": { zh: "图文词典", en: "Visual vocabulary" },
  "learn.sectionThreeParts": { zh: "实现原理", en: "How it works" },
  "learn.sectionFAQ": { zh: "常见问题", en: "FAQ" },
  "learn.sectionStartMaking": { zh: "开始制作", en: "Start building" },
  "learn.heroLine1": { zh: "不会前端，也能把参考图", en: "No frontend skills needed" },
  "learn.heroLine2": { zh: "变成可点击界面。", en: "to turn a reference into a clickable interface." },
  "learn.heroIntro": { zh: "你只需要看懂页面由哪些部分组成。拆图、生成素材、编写代码和检查交互，可以交给 Image2 UI。", en: "You just need to understand the parts of a page. Image2 UI handles deconstructing, generating assets, coding, and checking interactions." },
  "learn.startWithRef": { zh: "用一张参考图开始", en: "Start with a reference image" },
  "learn.seeCaseStudy": { zh: "先看案例拆解", en: "See the case study first" },
  "learn.heroVisualLabel": { zh: "从参考图到可点击 Demo 的过程示意", en: "Diagram of going from reference to clickable demo" },
  "learn.heroVisualAlt": { zh: "多张参考界面组成的 Image2 UI 案例拼贴", en: "Collage of reference interfaces in the Image2 UI library" },
  "learn.stepUpload": { zh: "上传参考图", en: "Upload reference" },
  "learn.stepIdentify": { zh: "识别结构与资产", en: "Identify structure & assets" },
  "learn.stepDemo": { zh: "获得可点击 Demo", en: "Get clickable demo" },
  "learn.fufuPlayTitle": { zh: "先帮 FuFu 开张今天的小店", en: "Open FuFu's shop for today" },
  "learn.fufuPlayIntro": { zh: "选一种店铺气氛，再卖出面包收集印章。你会直接看到颜色、文案和状态怎样一起改变体验。", en: "Choose a shop mood, then sell bread to collect stamps. See how colors, copy, and state change together." },
  "learn.fufuPickerLabel": { zh: "选择 FuFu Bakery 店铺气氛", en: "Choose a FuFu Bakery shop mood" },
  "learn.fufuMorning": { zh: "早晨黄", en: "Morning yellow" },
  "learn.fufuPicnic": { zh: "野餐绿", en: "Picnic green" },
  "learn.fufuBerry": { zh: "莓果粉", en: "Berry pink" },
  "learn.fufuViewSwitchLabel": { zh: "切换效果与代码", en: "Switch between preview and code" },
  "learn.fufuViewPreview": { zh: "效果", en: "Preview" },
  "learn.fufuViewCode": { zh: "代码", en: "Code" },
  "learn.fufuLiveExample": { zh: "实时示例", en: "Live example" },
  "learn.fufuShopLabel": { zh: "FuFu Bakery 手机样式互动预览", en: "FuFu Bakery phone-style interactive preview" },
  "learn.fufuFreshBaked": { zh: "今日刚出炉", en: "Fresh from the oven today" },
  "learn.fufuProductName": { zh: "海盐黄油卷", en: "Sea salt butter roll" },
  "learn.fufuProductNote": { zh: "松软、温热，最后撒一点海盐。", en: "Soft, warm, with a touch of sea salt." },
  "learn.fufuBakerAlt": { zh: "FuFu 狗狗烘焙师抱着法棍", en: "FuFu the dog baker holding a baguette" },
  "learn.fufuMemberCard": { zh: "今日会员卡", en: "Today's member card" },
  "learn.fufuStampsLabel": { zh: "已收集 0 枚，共 4 枚印章", en: "0 of 4 stamps collected" },
  "learn.fufuRewardText": { zh: "每买一个面包，就会多一枚印章。", en: "Buy a bread to collect a stamp." },
  "learn.fufuBuyButton": { zh: "买一个面包，收集印章", en: "Buy a bread, collect a stamp" },
  "learn.fufuResetButton": { zh: "再玩一次", en: "Play again" },
  "learn.fufuStatus": { zh: "烤箱已经热好了。", en: "The oven is ready." },
  "learn.fufuBottomNavLabel": { zh: "FuFu Bakery 示例底部导航", en: "FuFu Bakery sample bottom navigation" },
  "learn.fufuNavShop": { zh: "小店", en: "Shop" },
  "learn.fufuNavMenu": { zh: "菜单", en: "Menu" },
  "learn.fufuNavMember": { zh: "会员", en: "Member" },
  "learn.codeTabLabel": { zh: "选择代码类型", en: "Choose code type" },
  "learn.copyCode": { zh: "复制代码", en: "Copy code" },
  "learn.codeNoteHtml": { zh: "HTML 决定页面里有哪些内容。", en: "HTML defines what content is on the page." },
  "learn.codeNoteCss": { zh: "CSS 使用变量切换颜色，同一套结构可以呈现三种店铺气氛。", en: "CSS uses variables to switch colors; the same structure shows three different moods." },
  "learn.codeNoteJs": { zh: "JavaScript 记录购买次数，并把数据变化同步成印章状态。", en: "JavaScript tracks purchases and syncs data changes to stamp states." },
  "learn.quickStartTitle": { zh: "四步完成第一个界面", en: "Four steps to your first interface" },
  "learn.quickStartIntro": { zh: "准备一张参考图，把下面这句话连同图片发给 Codex。第一次不需要先学 HTML、CSS 或 JavaScript。", en: "Prepare a reference image, then send the prompt below with it. No HTML, CSS, or JavaScript needed." },
  "learn.quickStep1Title": { zh: "上传参考图", en: "Upload reference" },
  "learn.quickStep1Desc": { zh: "截图、设计稿或你喜欢的产品页面都可以。", en: "Screenshots, design files, or any product page you like." },
  "learn.quickStep2Title": { zh: "选风格规范", en: "Pick a style" },
  "learn.quickStep2Desc": { zh: "沿用参考图，或指定案例风格与品牌规范。", en: "Use the reference style, or pick a case style and brand." },
  "learn.quickStep3Title": { zh: "复制 Prompt", en: "Copy the prompt" },
  "learn.quickStep3Desc": { zh: "明确页面数量、可点击范围和检查要求。", en: "Specify page count, clickable scope, and review criteria." },
  "learn.quickStep4Title": { zh: "体验 Demo", en: "Try the demo" },
  "learn.quickStep4Desc": { zh: "打开结果，检查显示、图片与页面交互。", en: "Open the result and check display, images, and interactions." },
  "learn.promptToolLabel": { zh: "可复制的 Image2 UI Prompt", en: "Copyable Image2 UI prompt" },
  "learn.promptToolHead": { zh: "直接使用这句话", en: "Use this prompt directly" },
  "learn.copyQuickPrompt": { zh: "复制这段 Prompt", en: "Copy this prompt" },
  "learn.viewExample": { zh: "查看生成结果示例", en: "See the generated example" },
  "learn.copyPromptSuccess": { zh: "Prompt 已复制，可以和参考图一起发送。", en: "Prompt copied — send it along with your reference image." },
  "learn.inputOutputTitle": { zh: "你提供方向，Skill 负责落地", en: "You provide direction, the Skill delivers" },
  "learn.inputLabel": { zh: "你的输入", en: "Your input" },
  "learn.inputHeading": { zh: "参考图 + 一句话要求", en: "Reference + one-sentence request" },
  "learn.inputItem1": { zh: "一张或多张参考图", en: "One or more reference images" },
  "learn.inputItem2": { zh: "想做几个页面", en: "How many pages you need" },
  "learn.inputItem3": { zh: "品牌、内容和交互要求", en: "Brand, content, and interaction requirements" },
  "learn.outputLabel": { zh: "最终结果", en: "Final result" },
  "learn.outputHeading": { zh: "可打开、可点击、可继续修改", en: "Openable, clickable, and editable" },
  "learn.outputItem1": { zh: "代码实现的 UI 与交互", en: "Code-rendered UI and interactions" },
  "learn.outputItem2": { zh: "单独生成和管理的图片资产", en: "Separately generated and managed image assets" },
  "learn.outputItem3": { zh: "经过显示、加载与交互检查的 Demo", en: "A demo verified for display, loading, and interaction" },
  "learn.caseTitle": { zh: "看 Skill 如何拆解一个案例", en: "See how the Skill deconstructs a case" },
  "learn.caseIntro": { zh: "切换案例，比较原始参考、拆解决策和最终可点击页面。这里关注的是工作流，不是要求你先会写代码。", en: "Switch cases to compare reference, decisions, and final clickable pages. The focus is on the workflow, not coding." },
  "learn.caseTabsLabel": { zh: "选择教学案例", en: "Choose a teaching case" },
  "learn.caseRefCaption": { zh: "原始参考图", en: "Original reference" },
  "learn.caseResultCaption": { zh: "最终可点击页面", en: "Final clickable page" },
  "learn.caseStructureLabel": { zh: "识别出的页面结构", en: "Identified page structure" },
  "learn.caseAssetsLabel": { zh: "需要生成的图片资产", en: "Image assets to generate" },
  "learn.caseControlsLabel": { zh: "需要代码实现的控件", en: "Controls to implement in code" },
  "learn.caseDemoLink": { zh: "体验 Demo", en: "Try the demo" },
  "learn.applyCase": { zh: "应用到当前项目", en: "Apply to current project" },
  "learn.startFromCase": { zh: "用此案例开始设计", en: "Start designing from this case" },
  "learn.copyCasePrompt": { zh: "复制同款结构 Prompt", en: "Copy case prompt" },
  "learn.copyCasePromptSuccess": { zh: "同款结构 Prompt 已复制。", en: "Case prompt copied." },
  "learn.partsTitle": { zh: "想知道背后怎么实现？", en: "Want to know how it works?" },
  "learn.partsIntro": { zh: "这些知识不是使用 Skill 的前置条件。等你想继续修改生成结果时，再展开了解前端三件套。", en: "This knowledge is optional. Expand when you're ready to customize the generated result." },
  "learn.partsSummary": { zh: "展开了解 HTML、CSS 和 JavaScript", en: "Expand to learn about HTML, CSS, and JavaScript" },
  "learn.partsHtmlDesc": { zh: "决定页面有什么：标题、段落、图片、按钮和页面结构。", en: "Defines what's on the page: headings, paragraphs, images, buttons, and structure." },
  "learn.partsHtmlKeywords": { zh: "关键词：内容、结构、语义", en: "Keywords: content, structure, semantics" },
  "learn.partsCssDesc": { zh: "决定页面长什么样：颜色、字体、间距、布局和响应式。", en: "Defines how the page looks: colors, fonts, spacing, layout, and responsiveness." },
  "learn.partsCssKeywords": { zh: "关键词：外观、布局、适配", en: "Keywords: appearance, layout, adaptation" },
  "learn.partsJsDesc": { zh: "决定页面怎么回应：点击、切换、校验和动态状态。", en: "Defines how the page responds: clicks, toggles, validation, and dynamic states." },
  "learn.partsJsKeywords": { zh: "关键词：交互、状态、反馈", en: "Keywords: interaction, state, feedback" },
  "learn.answersTitle": { zh: "实际使用时最常遇到的问题", en: "Frequently asked questions" },
  "learn.faq1Q": { zh: "完全不会写代码可以使用吗？", en: "Can I use it without any coding experience?" },
  "learn.faq1A": { zh: "可以。你负责提供参考图、目标和反馈；Skill 会拆解页面、实现代码、生成所需图片并检查结果。你只需要能打开 Demo 并说出哪里需要调整。", en: "Yes. You provide the reference, goals, and feedback; the Skill deconstructs the page, writes code, generates images, and checks the result. You just need to open the demo and say what to adjust." },
  "learn.faq2Q": { zh: "每个页面都必须调用 Image2 吗？", en: "Does every page need Image2?" },
  "learn.faq2A": { zh: "不需要。Image2 只用于更适合位图的插画、照片和复杂视觉资产。按钮、文字、导航、表单和大多数图标应由代码实现。", en: "No. Image2 is only needed for bitmaps like illustrations, photos, and complex visuals. Buttons, text, navigation, forms, and most icons should be code-rendered." },
  "learn.faq3Q": { zh: "效果图和可点击 Demo 有什么区别？", en: "What's the difference between a preview and a clickable demo?" },
  "learn.faq3A": { zh: "效果图只展示某个静态画面；可点击 Demo 包含真实页面结构和交互，可以切换页面、点击按钮，并在不同屏幕尺寸下运行。", en: "A preview shows a static image; a clickable demo has real page structure and interactions – you can switch pages, click buttons, and test on different screen sizes." },
  "learn.faq4Q": { zh: "可以应用自己的品牌规范吗？", en: "Can I use my own brand guidelines?" },
  "learn.faq4A": { zh: "可以。提供 Logo、字体、颜色、间距和组件要求，或从品牌规范库选一套基础规则。对于商业字体和品牌资产，请同时说明你拥有使用权限。", en: "Yes. Provide your logo, fonts, colors, spacing, and component requirements, or pick from the brand library. For commercial fonts and assets, confirm you have the license." },
  "learn.faq5Q": { zh: "生成结果还能继续修改吗？", en: "Can I keep editing the generated result?" },
  "learn.faq5A": { zh: "可以。你可以直接用自然语言提出修改，例如“主按钮改成品牌绿、卡片圆角减小、保留当前交互”，也可以让 Skill 只重做指定页面。", en: "Yes. You can request changes in plain language, like 'make the primary button brand green, reduce card radius, keep the interactions.'" },
  "learn.faq6Q": { zh: "为什么有些内容必须由代码实现？", en: "Why must some content be implemented in code?" },
  "learn.faq6A": { zh: "文字、按钮和控件需要清晰、可访问且能响应交互。把它们画进图片会导致无法点击、难以修改，也无法适配不同屏幕。", en: "Text, buttons, and controls need to be clear, accessible, and interactive. Painting them into images makes them unclickable, hard to edit, and non-responsive." },
  "learn.furtherLearning": { zh: "进一步学习：前端与体验设计资料", en: "Further learning: frontend & UX design resources" },
  "learn.startMakingTitle": { zh: "现在，用一张你喜欢的参考图开始。", en: "Now, start with a reference image you like." },
  "learn.startMakingIntro": { zh: "五分钟后，你应该拿到一个可以打开、点击和继续修改的界面，而不是多学一门课。", en: "In five minutes, you'll have an interface you can open, click, and keep editing – not another course to take." },
  "learn.startMakingBtn": { zh: "开始制作第一个界面", en: "Build your first interface" },
  "learn.openLibrary": { zh: "打开案例库", en: "Open the library" },
  "learn.openLab": { zh: "打开设计系统实验室", en: "Open the design lab" },
  "learn.footerTagline": { zh: "从参考图到经过检查的可点击 Demo", en: "From reference to verified clickable demo" },
  "learn.footerLibrary": { zh: "案例库", en: "Library" },
  "learn.footerLab": { zh: "设计系统", en: "Design systems" },
  "learn.footerSkills": { zh: "设计 Skill", en: "Design skills" },
};

function applyLearningLanguage() {
  const lang = window.image2I18n?.language === "en" ? "en" : "zh";
  document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  document.title = window.image2I18n?.t("learn.pageTitle") || document.title;

  // Update status/state text that's dynamically set
  const buyBtn = document.querySelector("#fufuBuyButton");
  if (buyBtn && !buyBtn.disabled) {
    buyBtn.textContent = window.image2I18n?.t("learn.fufuBuyButton") || "买一个面包，收集印章";
  }
  const resetBtn = document.querySelector("#fufuResetButton");
  if (resetBtn && resetBtn.classList.contains("is-hidden")) {
    // keep whatever state
  }
  const status = document.querySelector("#fufuStatus");
  if (status) {
    status.textContent = window.image2I18n?.t("learn.fufuStatus") || "烤箱已经热好了。";
  }
  const rewardText = document.querySelector("#fufuRewardText");
  if (rewardText) {
    const fufuStampTotal = window.__fufuStampTotal || 0;
    if (fufuStampTotal === 0) {
      rewardText.textContent = window.image2I18n?.t("learn.fufuRewardText") || "每买一个面包，就会多一枚印章。";
    }
  }
  // Update the copy status texts
  document.querySelector("#copyStatus") && (document.querySelector("#copyStatus").textContent = "");
  document.querySelector("#caseCopyStatus") && (document.querySelector("#caseCopyStatus").textContent = "");
}

function learnT(key, zh, en) {
  return window.image2I18n?.t ? window.image2I18n.t(key, zh) : zh;
}

if (window.image2I18n) {
  window.image2I18n.addTranslations(learnTranslations);
  window.image2I18n.registerPage(applyLearningLanguage);
  window.image2I18n.refresh();
}
