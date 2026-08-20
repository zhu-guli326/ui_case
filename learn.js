const translations = {
  layout: {
    zh: ["布局", "先看页面如何分区：顶部导航、全幅主视觉、主行动，以及下方商品区。布局讨论的是区域比例、对齐关系和留白，而不是先讨论颜色。"],
    en: ["Layout", "Start with the major regions: top navigation, full-bleed hero, primary action, and the product section below. Layout is about proportion, alignment, and spacing before styling."]
  },
  hierarchy: {
    zh: ["层级", "先看第一眼应该落在哪里。这个页面用超大主标题、人物主视觉和单一主按钮建立第一层，再让 Bestseller 标题和商品卡承担第二层。"],
    en: ["Hierarchy", "Decide where the eye should land first. The oversized headline, hero photography, and single primary CTA form level one; the bestseller heading and product cards form level two."]
  },
  pattern: {
    zh: ["模式", "识别可以复用的 UI 模式：顶部导航、Hero、CTA、筛选标签、商品卡片和商品网格。知道模式名称后，就不必再逐像素描述。"],
    en: ["Pattern", "Recognize reusable UI patterns: top navigation, hero, CTA, filter tabs, product cards, and a product grid. Once patterns are named, you no longer have to describe pixels."]
  },
  action: {
    zh: ["动作", "页面只把一个动作做成强主行动：立即购买。进入商品区后，再把“查看全部”作为次级动作。动作越少，优先级越清楚。"],
    en: ["Action", "The hero promotes one dominant action: Shop now. In the product section, See all becomes a secondary action. Fewer competing actions make priority clearer."]
  },
  state: {
    zh: ["状态", "静态参考图里看不到完整状态，所以设计时还要补上导航 Hover、按钮 Hover / Pressed、商品卡 Hover、收藏状态、加载与空状态。"],
    en: ["State", "A static reference cannot show the whole experience. Add navigation hover, CTA hover / pressed, product-card hover, favorite state, loading, and empty states during implementation."]
  },
  visual: {
    zh: ["视觉", "最后再读视觉语言：高对比窄体大字、全幅人物摄影、黑白基础色配高饱和服装、密集商品网格。视觉负责气质，但建立在清楚结构之上。"],
    en: ["Visual", "Read the visual language last: high-contrast condensed type, full-bleed fashion photography, black-and-white foundations with saturated clothing, and a dense product grid."]
  }
};

const SUPPORTED_LANGUAGES = new Set(["zh", "en"]);
let activeLanguage = null;

function languageFromEvent(event) {
  if (typeof event === "string" && SUPPORTED_LANGUAGES.has(event)) return event;
  const detail = event?.detail;
  if (typeof detail === "string" && SUPPORTED_LANGUAGES.has(detail)) return detail;
  if (detail && typeof detail === "object") {
    const candidate = detail.language || detail.lang || detail.value;
    if (SUPPORTED_LANGUAGES.has(candidate)) return candidate;
  }
  return null;
}

function currentLanguage(event) {
  const eventLanguage = languageFromEvent(event);
  if (eventLanguage) return eventLanguage;
  const appLanguage = window.image2I18n?.language;
  if (SUPPORTED_LANGUAGES.has(appLanguage)) return appLanguage;
  const param = new URLSearchParams(location.search).get("lang");
  if (SUPPORTED_LANGUAGES.has(param)) return param;
  return activeLanguage || "zh";
}

function mountSeeLab() {
  const lab = document.querySelector("#see .see-lab");
  if (!lab) return;

  lab.innerHTML = `
    <div class="see-toolbar">
      <div class="see-toolbar-copy">
        <span class="see-toolbar-kicker" data-zh="界面观察实验" data-en="INTERFACE LENS">界面观察实验</span>
        <p data-zh="不要先看代码。点一个维度，看看同一张优秀页面能读出什么。" data-en="Ignore the code first. Pick a lens and inspect what the same strong interface can teach you.">不要先看代码。点一个维度，看看同一张优秀页面能读出什么。</p>
      </div>
      <div class="see-controls" role="tablist" aria-label="界面观察维度">
        <button class="is-active" data-lens="layout" type="button" role="tab" aria-selected="true"><span data-zh="布局" data-en="Layout">布局</span></button>
        <button data-lens="hierarchy" type="button" role="tab" aria-selected="false"><span data-zh="层级" data-en="Hierarchy">层级</span></button>
        <button data-lens="pattern" type="button" role="tab" aria-selected="false"><span data-zh="模式" data-en="Pattern">模式</span></button>
        <button data-lens="action" type="button" role="tab" aria-selected="false"><span data-zh="动作" data-en="Action">动作</span></button>
        <button data-lens="state" type="button" role="tab" aria-selected="false"><span data-zh="状态" data-en="State">状态</span></button>
        <button data-lens="visual" type="button" role="tab" aria-selected="false"><span data-zh="视觉" data-en="Visual">视觉</span></button>
      </div>
    </div>

    <div class="see-stage">
      <div class="fashion-preview" id="sampleUi" data-lens="layout">
        <img class="fashion-reference" src="./assets/cases/fashion-shopping-app/reference-overview.png" alt="Streetwear ecommerce reference page">
        <div class="fashion-dim"></div>

        <div class="lens-overlay lens-layout">
          <div class="region region-nav"><span data-zh="顶部导航" data-en="TOP NAV">顶部导航</span></div>
          <div class="region region-hero"><span data-zh="主视觉 Hero" data-en="HERO">主视觉 Hero</span></div>
          <div class="region region-products"><span data-zh="商品区" data-en="PRODUCT GRID">商品区</span></div>
        </div>

        <div class="lens-overlay lens-hierarchy">
          <span class="focus-ring focus-title"><b>01</b><em data-zh="主标题" data-en="Headline">主标题</em></span>
          <span class="focus-ring focus-cta"><b>02</b><em data-zh="主行动" data-en="Primary CTA">主行动</em></span>
          <span class="focus-ring focus-products"><b>03</b><em data-zh="第二层内容" data-en="Secondary content">第二层内容</em></span>
        </div>

        <div class="lens-overlay lens-pattern">
          <span class="pattern-tag tag-nav" data-zh="导航栏" data-en="Navigation">导航栏</span>
          <span class="pattern-tag tag-hero" data-zh="主视觉" data-en="Hero">主视觉</span>
          <span class="pattern-tag tag-cta" data-zh="主按钮" data-en="CTA">主按钮</span>
          <span class="pattern-tag tag-tabs" data-zh="筛选标签" data-en="Filter tabs">筛选标签</span>
          <span class="pattern-tag tag-grid" data-zh="商品网格" data-en="Product grid">商品网格</span>
        </div>

        <div class="lens-overlay lens-action">
          <span class="action-box action-primary"><b data-zh="主行动" data-en="PRIMARY">主行动</b><small data-zh="立即购买" data-en="Shop now">立即购买</small></span>
          <span class="action-box action-secondary"><b data-zh="次行动" data-en="SECONDARY">次行动</b><small data-zh="查看全部" data-en="See all">查看全部</small></span>
        </div>

        <div class="lens-overlay lens-state">
          <div class="state-strip">
            <span data-zh="默认" data-en="Default">默认</span><i>→</i>
            <span data-zh="悬停" data-en="Hover">悬停</span><i>→</i>
            <span data-zh="按下" data-en="Pressed">按下</span><i>→</i>
            <span data-zh="完成" data-en="Done">完成</span>
          </div>
          <span class="state-pointer state-nav-pointer" data-zh="导航需要 Hover / Active" data-en="Navigation needs Hover / Active">导航需要 Hover / Active</span>
          <span class="state-pointer state-card-pointer" data-zh="商品卡需要 Hover / 收藏" data-en="Cards need Hover / Favorite">商品卡需要 Hover / 收藏</span>
        </div>

        <div class="lens-overlay lens-visual">
          <div class="visual-notes">
            <span data-zh="窄体大标题" data-en="Condensed display type">窄体大标题</span>
            <span data-zh="全幅人物摄影" data-en="Full-bleed photography">全幅人物摄影</span>
            <span data-zh="高饱和服装色" data-en="Saturated apparel color">高饱和服装色</span>
            <span data-zh="密集商品网格" data-en="Dense product grid">密集商品网格</span>
          </div>
        </div>
      </div>

      <aside class="lens-note">
        <span class="lens-note-index">02 / SEE</span>
        <strong id="lensTitle">布局</strong>
        <p id="lensText">先看页面如何分区：顶部导航、全幅主视觉、主行动，以及下方商品区。</p>
        <div class="lens-note-rule"></div>
        <small data-zh="参考页不是拿来照抄，而是拿来拆出可以复用的设计判断。" data-en="A reference is not something to copy blindly. It is material for extracting reusable design decisions.">参考页不是拿来照抄，而是拿来拆出可以复用的设计判断。</small>
      </aside>
    </div>
  `;

  let style = document.querySelector("#learn-see-redesign-style");
  if (!style) {
    style = document.createElement("style");
    style.id = "learn-see-redesign-style";
    document.head.append(style);
  }

  style.textContent = `
    #see::before{background:#f2f0ea!important}
    #see{color:var(--ink)!important;border-top-color:var(--line)!important}
    #see .chapter-index,#see .eyebrow{color:var(--green)!important}
    #see .lead{color:var(--muted)!important}
    #see .see-lab{display:block!important;margin:64px 0 0 min(12vw,160px)!important;border:1px solid rgba(15,21,17,.14)!important;background:#fff!important;box-shadow:0 24px 70px rgba(15,21,17,.08)!important;overflow:hidden!important}
    #see .see-toolbar{display:grid;grid-template-columns:minmax(210px,.7fr) minmax(0,1.4fr);gap:28px;align-items:end;padding:22px 24px 20px;border-bottom:1px solid rgba(15,21,17,.12);background:#fbfaf7}
    #see .see-toolbar-copy{display:grid;gap:8px}
    #see .see-toolbar-kicker{font-size:10px;font-weight:900;letter-spacing:.14em;color:var(--green)}
    #see .see-toolbar-copy p{margin:0;max-width:430px;color:#6a716c;font-size:13px;line-height:1.55}
    #see .see-controls{display:flex!important;flex-direction:row!important;justify-content:flex-end;gap:6px;padding:0!important;border:0!important;background:transparent!important;overflow-x:auto}
    #see .see-controls::before{display:none!important}
    #see .see-controls button{display:block!important;min-height:36px!important;padding:0 13px!important;border:1px solid rgba(15,21,17,.14)!important;border-radius:999px!important;background:#fff!important;color:#555d58!important;text-align:center!important;font-size:11px!important;font-weight:780!important;white-space:nowrap;transition:background .18s ease,color .18s ease,border-color .18s ease,transform .18s ease}
    #see .see-controls button::before{display:none!important}
    #see .see-controls button:hover{padding-left:13px!important;background:#f0f1ed!important;color:#111!important;transform:translateY(-1px)}
    #see .see-controls button.is-active{padding-left:13px!important;background:#111713!important;color:#fff!important;border-color:#111713!important}
    #see .see-stage{display:grid;grid-template-columns:minmax(0,1fr) 280px;align-items:stretch;background:#ebe9e2}
    #see .fashion-preview{position:relative;min-width:0;padding:22px;background:#e4e2dc;overflow:hidden}
    #see .fashion-reference{display:block;width:100%;height:auto;max-height:690px;object-fit:contain;object-position:center top;margin:0 auto;background:#fff;box-shadow:0 12px 35px rgba(0,0,0,.12);transition:filter .22s ease,transform .22s ease}
    #see .fashion-dim{position:absolute;inset:22px;pointer-events:none;background:rgba(7,11,8,0);transition:background .2s ease}
    #see .lens-overlay{position:absolute;inset:22px;pointer-events:none;opacity:0;transition:opacity .18s ease}
    #see .fashion-preview[data-lens="layout"] .lens-layout,
    #see .fashion-preview[data-lens="hierarchy"] .lens-hierarchy,
    #see .fashion-preview[data-lens="pattern"] .lens-pattern,
    #see .fashion-preview[data-lens="action"] .lens-action,
    #see .fashion-preview[data-lens="state"] .lens-state,
    #see .fashion-preview[data-lens="visual"] .lens-visual{opacity:1}
    #see .fashion-preview[data-lens="hierarchy"] .fashion-dim,
    #see .fashion-preview[data-lens="pattern"] .fashion-dim,
    #see .fashion-preview[data-lens="action"] .fashion-dim,
    #see .fashion-preview[data-lens="state"] .fashion-dim{background:rgba(7,11,8,.16)}
    #see .region{position:absolute;border:2px solid #d7ff42;box-shadow:inset 0 0 0 1px rgba(0,0,0,.24)}
    #see .region span{position:absolute;left:8px;top:8px;padding:5px 7px;background:#d7ff42;color:#111;font-size:9px;font-weight:900;letter-spacing:.05em}
    #see .region-nav{left:2.5%;right:2.5%;top:1.5%;height:6%}
    #see .region-hero{left:0;right:0;top:0;height:51%}
    #see .region-products{left:0;right:0;top:51%;bottom:0}
    #see .focus-ring{position:absolute;display:flex;align-items:center;gap:7px;color:#fff;font-style:normal}
    #see .focus-ring::before{content:"";position:absolute;inset:-13px -18px;border:2px solid #d7ff42;border-radius:999px;box-shadow:0 0 0 999px rgba(0,0,0,.08)}
    #see .focus-ring b{position:relative;z-index:1;display:grid;width:26px;height:26px;place-items:center;border-radius:50%;background:#d7ff42;color:#111;font-size:9px}
    #see .focus-ring em{position:relative;z-index:1;padding:5px 7px;background:#111;color:#fff;font-size:9px;font-style:normal;font-weight:800}
    #see .focus-title{left:38%;top:28%}
    #see .focus-cta{left:48%;top:43%}
    #see .focus-products{left:16%;top:61%}
    #see .pattern-tag{position:absolute;padding:6px 8px;background:#111;color:#fff;border:1px solid rgba(255,255,255,.4);font-size:9px;font-weight:850;box-shadow:0 5px 16px rgba(0,0,0,.18)}
    #see .tag-nav{left:34%;top:2.5%}.tag-hero{left:7%;top:24%}.tag-cta{left:48%;top:43%}.tag-tabs{right:13%;top:58%}.tag-grid{left:46%;top:74%}
    #see .action-box{position:absolute;display:grid;gap:3px;padding:8px 10px;border:2px solid #d7ff42;background:#111;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.22)}
    #see .action-box b{color:#d7ff42;font-size:8px;letter-spacing:.09em}.action-box small{font-size:10px;font-weight:800}
    #see .action-primary{left:44%;top:40%}.action-secondary{right:3.5%;top:57%}
    #see .state-strip{position:absolute;left:50%;top:41%;transform:translateX(-50%);display:flex;align-items:center;gap:7px;padding:8px 10px;background:#fff;color:#111;border:1px solid #111;box-shadow:0 8px 24px rgba(0,0,0,.16);font-size:9px;font-weight:800}
    #see .state-strip i{font-style:normal;color:#788078}
    #see .state-pointer{position:absolute;padding:6px 8px;background:#d7ff42;color:#111;font-size:9px;font-weight:850}
    #see .state-nav-pointer{right:4%;top:3%}.state-card-pointer{left:20%;top:78%}
    #see .visual-notes{position:absolute;right:2.5%;top:5%;display:grid;gap:6px;width:min(190px,28%)}
    #see .visual-notes span{padding:7px 9px;background:rgba(255,255,255,.94);border-left:4px solid #d7ff42;color:#111;font-size:9px;font-weight:850;box-shadow:0 5px 16px rgba(0,0,0,.12)}
    #see .fashion-preview[data-lens="visual"] .fashion-reference{filter:saturate(1.08) contrast(1.04)}
    #see .lens-note{grid-column:auto!important;display:flex!important;flex-direction:column;gap:18px;padding:28px 24px!important;border:0!important;border-left:1px solid rgba(15,21,17,.12)!important;background:#111713!important;color:#fff!important}
    #see .lens-note-index{color:#d7ff42;font-size:9px;font-weight:900;letter-spacing:.14em}
    #see .lens-note strong{font-size:30px;line-height:1;letter-spacing:-.035em;color:#fff}
    #see .lens-note p{margin:0!important;color:#c4cbc6!important;font-size:14px!important;line-height:1.72!important}
    #see .lens-note-rule{height:1px;background:rgba(255,255,255,.15);margin-top:auto}
    #see .lens-note small{color:#929d96;font-size:11px;line-height:1.6}
    @media(max-width:980px){
      #see .see-lab{margin-left:0!important}
      #see .see-toolbar{grid-template-columns:1fr}
      #see .see-controls{justify-content:flex-start}
      #see .see-stage{grid-template-columns:1fr}
      #see .lens-note{border-left:0!important;border-top:1px solid rgba(255,255,255,.12)!important}
      #see .fashion-reference{max-height:620px}
    }
    @media(max-width:640px){
      #see .see-toolbar{padding:18px}
      #see .see-controls{padding-bottom:2px!important}
      #see .fashion-preview{padding:10px}
      #see .fashion-dim,#see .lens-overlay{inset:10px}
      #see .fashion-reference{max-height:none}
      #see .lens-note{padding:22px 18px!important}
      #see .lens-note strong{font-size:24px}
      #see .visual-notes{width:42%;right:2%;top:4%}
      #see .pattern-tag,#see .state-pointer,#see .action-box{transform:scale(.86);transform-origin:top left}
    }
  `;
}

function syncDocumentMeta(lang) {
  document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  document.title = lang === "en" ? "How to Design with AI · ONDesign" : "如何与 AI 一起做 UI · ONDesign";
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.content = lang === "en"
      ? "Learn to see, describe, build and review interfaces with AI."
      : "学习如何看懂、拆解、描述、生成并判断 AI UI。";
  }
  const tablist = document.querySelector(".see-controls");
  if (tablist) tablist.setAttribute("aria-label", lang === "en" ? "Interface inspection lenses" : "界面观察维度");
}

function syncWhySection(lang) {
  const why = document.querySelector("#why");
  if (!why) return;
  const eyebrow = why.querySelector(".eyebrow");
  if (eyebrow) eyebrow.textContent = lang === "en" ? "WHY THIS MATTERS" : "为什么这很重要";
  const systemCopy = why.querySelector(".translation-board > div:last-child p");
  if (systemCopy) {
    systemCopy.textContent = lang === "en"
      ? "Visual hierarchy · Combobox · Responsive reflow · Loading state · Spacing system · Interaction rule"
      : "视觉层级 · 组合框 · 响应式重排 · 加载状态 · 间距系统 · 交互规则";
  }
  const quote = why.querySelector(".chapter-quote");
  if (quote) quote.textContent = lang === "en" ? "The better you see design, the better you can direct AI." : "你越能看懂设计，就越能准确地指挥 AI。";
  let roleStyle = document.querySelector("#learn-role-label-style");
  if (!roleStyle) {
    roleStyle = document.createElement("style");
    roleStyle.id = "learn-role-label-style";
    document.head.append(roleStyle);
  }
  roleStyle.textContent = lang === "en"
    ? '#why .translation-board>div:first-child::before{content:"HUMAN"}#why .translation-board>div:last-child::before{content:"SYSTEM"}'
    : '#why .translation-board>div:first-child::before{content:"人"}#why .translation-board>div:last-child::before{content:"系统"}';
}

function syncSeeSection(lang) {
  const see = document.querySelector("#see");
  if (!see) return;
  const eyebrow = see.querySelector(".chapter-copy .eyebrow");
  if (eyebrow) eyebrow.textContent = lang === "en" ? "LEARN TO SEE" : "学会看界面";
}

function applyLanguage(event) {
  const lang = currentLanguage(event);
  activeLanguage = lang;
  syncDocumentMeta(lang);
  document.querySelectorAll("[data-zh][data-en]").forEach((el) => {
    const value = el.dataset[lang];
    if (!value) return;
    if (value.includes("\\n") && /^(H1|H2|H3|P|SPAN|STRONG)$/.test(el.tagName)) {
      el.innerHTML = value.split("\\n").map((line) => line.trim()).join("<br>");
    } else {
      el.textContent = value;
    }
  });
  document.querySelectorAll("[data-smart-lang-link]").forEach((link) => {
    const target = new URL(link.dataset.smartLangLink, location.href);
    target.searchParams.set("lang", lang);
    link.href = `${target.pathname.split("/").pop()}${target.search}${target.hash}`;
  });
  const rebuildLink = document.querySelector('.final-links a[href*="launcher.html"]');
  if (rebuildLink) {
    const target = new URL(rebuildLink.href, location.href);
    target.searchParams.set("lang", lang);
    rebuildLink.href = target.href;
  }
  syncWhySection(lang);
  syncSeeSection(lang);
  updateLens(document.querySelector("[data-lens].is-active")?.dataset.lens || "layout", lang);
}

function updateLens(lens, forcedLanguage) {
  const lang = forcedLanguage || activeLanguage || currentLanguage();
  const note = translations[lens]?.[lang] || translations.layout[lang];
  const sample = document.querySelector("#sampleUi");
  if (sample) {
    sample.dataset.lens = lens;
    sample.dataset.lang = lang;
  }
  const title = document.querySelector("#lensTitle");
  const text = document.querySelector("#lensText");
  if (title) title.textContent = note[0];
  if (text) text.textContent = note[1];
}

mountSeeLab();

const lensButtons = [...document.querySelectorAll("[data-lens]")];
lensButtons.forEach((button) => {
  button.addEventListener("click", () => {
    lensButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", String(selected));
    });
    updateLens(button.dataset.lens);
  });
  button.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
    const currentIndex = lensButtons.indexOf(button);
    const nextButton = lensButtons[(currentIndex + direction + lensButtons.length) % lensButtons.length];
    nextButton.focus();
    nextButton.click();
  });
});

const progressBar = document.querySelector("#pageProgressBar");
const chapterLinks = [...document.querySelectorAll("[data-section-link]")];
const chapters = [...document.querySelectorAll("[data-section]")];

function updateScrollState() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const progress = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
  if (progressBar) progressBar.style.width = `${progress * 100}%`;
  let current = chapters[0]?.dataset.section;
  chapters.forEach((chapter) => {
    const rect = chapter.getBoundingClientRect();
    if (rect.top <= innerHeight * 0.34) current = chapter.dataset.section;
  });
  chapterLinks.forEach((link) => link.classList.toggle("is-current", link.dataset.sectionLink === current));
}

addEventListener("scroll", updateScrollState, { passive: true });
addEventListener("resize", updateScrollState);

applyLanguage();
updateScrollState();

if (window.image2I18n?.registerPage) {
  window.image2I18n.registerPage((lang) => applyLanguage(lang));
} else {
  window.addEventListener("image2:languagechange", applyLanguage);
}
