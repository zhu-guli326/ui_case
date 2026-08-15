const caseStudies = {
  fufu: {
<<<<<<< HEAD
    id: "fufu", name: "FuFu Bakery", style: "手绘烘焙会员", template: "commerce", brand: "airbnb", theme: "soft-lifestyle",
=======
>>>>>>> b0afc67405740d9ad16be3979c2e00244622a074
    reference: "./demo/fufu-bakery/assets/reference-overview.png",
    referenceAlt: "FuFu Bakery 烘焙会员应用原始参考图",
    image: "./demo/fufu-bakery/mobile-preview.png",
    alt: "FuFu Bakery 手绘烘焙会员最终可点击页面",
    structure: "欢迎页、烘焙首页、今日菜单和会员卡组成轻量门店流程。",
    assets: "狗狗烘焙师插画和烘焙氛围参考图。",
    controls: ["进入按钮", "菜单切换", "会员卡", "底部导航"],
    demo: "./demo/fufu-bakery/index.html",
    prompt: "使用 image-to-ui-skill，参考我上传的手绘烘焙会员应用图片，保留狗狗烘焙师、纸白留白、黄色按钮和底部导航结构，生成欢迎页、烘焙首页、今日菜单和会员卡可点击手机页面，并检查进入按钮、菜单切换与底部导航交互。"
  },
  plate: {
<<<<<<< HEAD
    id: "plate-play", name: "Plate Play", style: "高彩食谱插画", template: "commerce", brand: "airbnb", theme: "editorial-commerce",
=======
>>>>>>> b0afc67405740d9ad16be3979c2e00244622a074
    reference: "./demo/plate-play/assets/reference-overview.png",
    referenceAlt: "Plate Play 食谱应用原始参考图",
    image: "./demo/plate-play/mobile-preview.png",
    alt: "Plate Play 食谱最终可点击页面",
    structure: "首页介绍、食谱列表和食谱详情形成从发现到烹饪的流程。",
    assets: "厨师主插画和食物照片。",
    controls: ["食谱分类", "收藏按钮", "底部导航"],
    demo: "./demo/plate-play/index.html",
    prompt: "使用 image-to-ui-skill，参考我上传的食谱应用图片，保留高彩插画、主行动按钮和食谱卡片结构，生成首页、食谱列表和详情三个可点击手机页面，并检查收藏与导航交互。"
  },
  relay: {
<<<<<<< HEAD
    id: "relay-music", name: "RELAY", style: "编辑感音乐发现", template: "social", brand: "notion", theme: "editorial-commerce",
=======
>>>>>>> b0afc67405740d9ad16be3979c2e00244622a074
    reference: "./demo/relay-music/assets/reference-overview.png",
    referenceAlt: "RELAY 音乐应用原始参考图",
    image: "./demo/relay-music/assets/relay-effect-board.png",
    alt: "RELAY 音乐发现最终可点击页面",
    structure: "艺人主页、正在播放和音乐发现流分别承担介绍、播放和继续探索。",
    assets: "艺人摄影、专辑封面和内容缩略图。",
    controls: ["播放控制", "收藏按钮", "页面切换"],
    demo: "./demo/relay-music/index.html",
    prompt: "使用 image-to-ui-skill，参考我上传的音乐应用图片，保留编辑式摄影、深色播放器和发现流结构，生成艺人主页、播放页和发现页三个可点击手机页面，并检查播放与收藏状态。"
  }
};

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
  copyText(quickPrompt.textContent.trim(), document.querySelector("#copyStatus"), "Prompt 已复制，可以和参考图一起发送。" );
  window.image2Analytics?.track("beginner_prompt_copy", { source: "quick_start" });
});

const fufuThemes = {
  morning: { mood: "GOOD MORNING", title: "早晨黄：温暖、醒目，适合主行动", text: "这是 CSS 在改变视觉语气。接着点击购买，让 JavaScript 改变会员状态。" },
  picnic: { mood: "PICNIC DAY", title: "野餐绿：清新、放松，像一次户外小憩", text: "同样的结构换一组颜色，就会形成不同气氛；功能仍然保持不变。" },
  berry: { mood: "BERRY HOUR", title: "莓果粉：甜美、亲近，更像一份小礼物", text: "颜色影响感受，清楚的按钮文案和反馈则决定操作是否容易理解。" }
};

<<<<<<< HEAD
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

const fufuCodeNotes = {
  html: "HTML 决定页面里有哪些内容，以及内容之间的结构。",
  css: "CSS 使用变量切换颜色，同一套结构可以呈现三种店铺气氛。",
  js: "JavaScript 记录购买次数，并把数据变化同步成印章状态。"
};

let activeFufuCode = "html";
const fufuCodeOutput = document.querySelector("#fufuCodeOutput");
const fufuCodeStatus = document.querySelector("#fufuCodeStatus");

function renderFufuCode(type) {
  activeFufuCode = type;
  fufuCodeOutput.textContent = fufuCodeSnippets[type];
  fufuCodeStatus.textContent = fufuCodeNotes[type];
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

=======
>>>>>>> b0afc67405740d9ad16be3979c2e00244622a074
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
    document.querySelector("#fufuShopMood").textContent = theme.mood;
    document.querySelector("#fufuLessonTitle").textContent = theme.title;
    document.querySelector("#fufuLessonText").textContent = theme.text;
  });
});

function renderFufuStamps() {
  fufuStampCount.textContent = String(fufuStampTotal);
  fufuStamps.forEach((stamp, index) => stamp.classList.toggle("is-stamped", index < fufuStampTotal));
  document.querySelector("#fufuStamps").setAttribute("aria-label", `已收集 ${fufuStampTotal} 枚，共 4 枚印章`);
  document.querySelector("#fufuRewardText").textContent = fufuStampTotal === 4 ? "集满了，可以兑换一枚免费的海盐黄油卷。" : `再买 ${4 - fufuStampTotal} 个，就能兑换免费面包。`;
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
    fufuBuyButton.textContent = "已集满 4 枚印章";
    fufuResetButton.classList.remove("is-hidden");
    fufuResetButton.setAttribute("aria-hidden", "false");
    fufuResetButton.tabIndex = 0;
    fufuStatus.textContent = "集满了！FuFu 请你吃一个免费的海盐黄油卷。";
  } else {
    fufuStatus.textContent = `卖出一个面包，获得第 ${fufuStampTotal} 枚印章。`;
  }
});

fufuResetButton?.addEventListener("click", () => {
  fufuStampTotal = 0;
  renderFufuStamps();
  fufuBuyButton.disabled = false;
  fufuBuyButton.textContent = "买一个面包，收集印章";
  fufuResetButton.classList.add("is-hidden");
  fufuResetButton.setAttribute("aria-hidden", "true");
  fufuResetButton.tabIndex = -1;
  fufuStatus.textContent = "会员卡已经清空，烤箱仍然热着。";
});

const casePanel = document.querySelector("#casePanel");
let activeCase = "fufu";
function renderCase(id) {
  const item = caseStudies[id];
  activeCase = id;
  document.querySelector("#caseReferenceImage").src = item.reference;
  document.querySelector("#caseReferenceImage").alt = item.referenceAlt;
  document.querySelector("#caseImage").src = item.image;
  document.querySelector("#caseImage").alt = item.alt;
  document.querySelector("#caseStructure").textContent = item.structure;
  document.querySelector("#caseAssets").textContent = item.assets;
  document.querySelector("#caseControls").innerHTML = item.controls.map((control) => `<span>${control}</span>`).join("");
  document.querySelector("#caseDemoLink").href = item.demo;
<<<<<<< HEAD
  const taskUrl = new URL("./launcher.html", window.location.href);
  taskUrl.searchParams.set("intent", "rebuild");
  taskUrl.searchParams.set("source", "library");
  taskUrl.searchParams.set("case", item.id);
  document.querySelector("#caseTaskLink").href = window.image2I18n?.localizeUrl?.(taskUrl.href) || taskUrl.href;
=======
>>>>>>> b0afc67405740d9ad16be3979c2e00244622a074
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
  copyText(caseStudies[activeCase].prompt, document.querySelector("#caseCopyStatus"), "同款结构 Prompt 已复制。" );
  window.image2Analytics?.track("beginner_prompt_copy", { source: "case_study", case: activeCase });
});

<<<<<<< HEAD
function applyLearningCase() {
  const item = caseStudies[activeCase];
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

=======
>>>>>>> b0afc67405740d9ad16be3979c2e00244622a074
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
