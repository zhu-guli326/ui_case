const translations = {
  layout: {
    zh: ["布局", "先看页面如何分区：顶部导航、全幅主视觉、主行动，以及下方商品区。布局讨论的是区域比例、对齐关系和留白，而不是先讨论颜色。"],
    en: ["Layout", "Start with the major regions: top navigation, full-bleed hero, primary action, and the product section below. Layout is about proportion, alignment, and spacing before styling."]
  },
  hierarchy: {
    zh: ["层级", "第一眼应该先落在大标题、人物主视觉和主按钮，再进入热卖商品区。字号、位置、对比和留白共同决定阅读顺序。"],
    en: ["Hierarchy", "The eye should land on the display headline, hero image, and primary CTA first, then move into the bestseller section. Scale, position, contrast, and space create the reading order."]
  },
  pattern: {
    zh: ["模式", "识别可复用的 UI 模式：顶部导航、Hero、CTA、筛选标签、商品卡片和商品网格。知道模式名称后，就不必逐像素描述。"],
    en: ["Pattern", "Recognize reusable UI patterns: top navigation, hero, CTA, filter tabs, product cards, and a product grid. Naming patterns replaces pixel-by-pixel description."]
  },
  action: {
    zh: ["动作", "主视觉里只保留一个强主行动“立即选购”，进入商品区后再出现筛选、收藏和查看全部等次级动作。"],
    en: ["Action", "Keep one dominant hero action — Shop now — then introduce filtering, favorites, and See all as secondary actions in the product section."]
  },
  state: {
    zh: ["状态", "这不是截图。你可以真的点击筛选、收藏、购物袋和主按钮，观察 Hover、Pressed、Selected 与反馈状态。"],
    en: ["State", "This is not a screenshot. Click filters, favorites, the bag, and the primary CTA to inspect hover, pressed, selected, and feedback states."]
  },
  visual: {
    zh: ["视觉", "最后再读视觉语言：窄体大字、全幅时尚摄影、黑白基础色、高饱和服装色，以及紧凑的商品网格。"],
    en: ["Visual", "Read the visual language last: condensed display type, full-bleed fashion photography, black-and-white foundations, saturated apparel color, and a compact product grid."]
  }
};

const breakdownThemes = {
  morning: { accent: "#f1c957", soft: "#f8ead2", label: "#46647c", moodZh: "早安烘焙", moodEn: "GOOD MORNING" },
  picnic: { accent: "#97c98b", soft: "#e1f0d8", label: "#2d6a47", moodZh: "野餐日", moodEn: "PICNIC DAY" },
  berry: { accent: "#edaaa8", soft: "#f7dddd", label: "#8f4249", moodZh: "莓果时刻", moodEn: "BERRY HOUR" }
};

const SUPPORTED_LANGUAGES = new Set(["zh", "en"]);
let activeLanguage = null;
let activeBreakdownTheme = "morning";

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
        <span class="see-toolbar-kicker" data-zh="真实网页观察实验" data-en="LIVE INTERFACE LENS">真实网页观察实验</span>
        <p data-zh="下面不是截图，而是一张真正可点击的响应式网页。先操作它，再切换观察维度。" data-en="This is a real responsive webpage, not a screenshot. Interact with it first, then switch inspection lenses.">下面不是截图，而是一张真正可点击的响应式网页。先操作它，再切换观察维度。</p>
      </div>
    </div>

    <div class="see-stage">
      <div class="fashion-preview" id="sampleUi" data-lens="layout">
        <iframe class="fashion-demo-frame" id="fashionDemoFrame" src="./demo/fashion/index.html?embed=1&lang=zh" title="可交互时尚电商网页演示" loading="lazy"></iframe>
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
          <span class="action-box action-primary"><b data-zh="主行动" data-en="PRIMARY">主行动</b><small data-zh="立即选购" data-en="Shop now">立即选购</small></span>
          <span class="action-box action-secondary"><b data-zh="次行动" data-en="SECONDARY">次行动</b><small data-zh="筛选 / 收藏" data-en="Filter / Favorite">筛选 / 收藏</small></span>
        </div>
        <div class="lens-overlay lens-state">
          <div class="state-strip"><span data-zh="默认" data-en="Default">默认</span><i>→</i><span data-zh="悬停" data-en="Hover">悬停</span><i>→</i><span data-zh="选中" data-en="Selected">选中</span><i>→</i><span data-zh="反馈" data-en="Feedback">反馈</span></div>
          <span class="state-pointer state-nav-pointer" data-zh="试着点筛选" data-en="Try the filters">试着点筛选</span>
          <span class="state-pointer state-card-pointer" data-zh="试着点收藏 ♡" data-en="Try favorite ♡">试着点收藏 ♡</span>
        </div>
        <div class="lens-overlay lens-visual">
          <div class="visual-notes">
            <span data-zh="窄体大标题" data-en="Condensed display type">窄体大标题</span>
            <span data-zh="全幅时尚摄影" data-en="Full-bleed photography">全幅时尚摄影</span>
            <span data-zh="高对比黑白" data-en="High-contrast monochrome">高对比黑白</span>
            <span data-zh="紧凑商品网格" data-en="Compact product grid">紧凑商品网格</span>
          </div>
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
      <aside class="lens-note">
        <span class="lens-note-index">02 / SEE</span>
        <strong id="lensTitle">布局</strong>
        <p id="lensText">先看页面如何分区：顶部导航、全幅主视觉、主行动，以及下方商品区。</p>
        <div class="lens-note-rule"></div>
        <small data-zh="先操作，再分析。好的 UI 学习应该能看到行为，而不只是看一张静态图。" data-en="Interact first, analyze second. Good UI learning should expose behavior, not only a static image.">先操作，再分析。好的 UI 学习应该能看到行为，而不只是看一张静态图。</small>
        <a class="open-live-demo" href="./demo/fashion/index.html?lang=zh" target="_blank" rel="noopener" data-zh="单独打开网页 ↗" data-en="Open live webpage ↗">单独打开网页 ↗</a>
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
    #see .see-lab{display:block!important;margin:64px 0 0 min(10vw,140px)!important;border:1px solid rgba(15,21,17,.14)!important;background:#fff!important;box-shadow:0 24px 70px rgba(15,21,17,.07)!important;overflow:hidden!important}
    #see .see-toolbar{display:block;padding:22px 24px 20px;border-bottom:1px solid rgba(15,21,17,.12);background:#fbfaf7}
    #see .see-toolbar-copy{display:grid;gap:8px}
    #see .see-toolbar-kicker{font-size:10px;font-weight:900;letter-spacing:.14em;color:var(--green)}
    #see .see-toolbar-copy p{margin:0;max-width:480px;color:#6a716c;font-size:13px;line-height:1.55}
    #see .see-controls{position:absolute;z-index:5;left:50%;bottom:18px;display:flex!important;flex-direction:row!important;justify-content:center;gap:6px;width:max-content;max-width:calc(100% - 32px);padding:6px!important;border:1px solid rgba(15,21,17,.14)!important;border-radius:999px;background:rgba(251,250,247,.92)!important;box-shadow:0 12px 32px rgba(15,21,17,.18);backdrop-filter:blur(12px);overflow-x:auto;transform:translateX(-50%)}
    #see .see-controls::before{display:none!important}
    #see .see-controls button{display:block!important;min-height:36px!important;padding:0 13px!important;border:1px solid rgba(15,21,17,.14)!important;border-radius:999px!important;background:#fff!important;color:#555d58!important;text-align:center!important;font-size:11px!important;font-weight:780!important;white-space:nowrap;transition:.18s ease}
    #see .see-controls button::before{display:none!important}
    #see .see-controls button:hover{padding-left:13px!important;background:#f0f1ed!important;color:#111!important;transform:translateY(-1px)}
    #see .see-controls button.is-active{padding-left:13px!important;background:#111713!important;color:#fff!important;border-color:#111713!important}
    #see .see-stage{display:grid;grid-template-columns:minmax(0,1fr) 280px;align-items:stretch;background:#e7e5df}
    #see .fashion-preview{position:relative;min-width:0;aspect-ratio:16/10;background:#d9d7d0;overflow:hidden}
    #see .fashion-demo-frame{display:block;width:100%;height:100%;border:0;background:#fff;transition:filter .2s ease,transform .2s ease}
    #see .fashion-dim,#see .lens-overlay{position:absolute;inset:0;pointer-events:none}
    #see .fashion-dim{z-index:2;background:rgba(7,11,8,0);transition:background .2s ease}
    #see .lens-overlay{z-index:3;opacity:0;transition:opacity .18s ease}
    #see .fashion-preview[data-lens="layout"] .lens-layout,#see .fashion-preview[data-lens="hierarchy"] .lens-hierarchy,#see .fashion-preview[data-lens="pattern"] .lens-pattern,#see .fashion-preview[data-lens="action"] .lens-action,#see .fashion-preview[data-lens="state"] .lens-state,#see .fashion-preview[data-lens="visual"] .lens-visual{opacity:1}
    #see .fashion-preview[data-lens="hierarchy"] .fashion-dim,#see .fashion-preview[data-lens="pattern"] .fashion-dim,#see .fashion-preview[data-lens="action"] .fashion-dim{background:rgba(7,11,8,.14)}
    #see .region{position:absolute;border:2px solid #d7ff42;box-shadow:inset 0 0 0 1px rgba(0,0,0,.2)}
    #see .region span{position:absolute;left:7px;top:7px;padding:5px 7px;background:#d7ff42;color:#111;font-size:9px;font-weight:900;letter-spacing:.04em}
    #see .region-nav{left:0;right:0;top:0;height:10%}#see .region-hero{left:0;right:0;top:0;height:61%}#see .region-products{left:0;right:0;top:61%;bottom:0}
    #see .focus-ring{position:absolute;display:flex;align-items:center;gap:7px;color:#fff;font-style:normal}
    #see .focus-ring::before{content:"";position:absolute;inset:-12px -16px;border:2px solid #d7ff42;border-radius:999px}
    #see .focus-ring b{position:relative;z-index:1;display:grid;width:26px;height:26px;place-items:center;border-radius:50%;background:#d7ff42;color:#111;font-size:9px}
    #see .focus-ring em{position:relative;z-index:1;padding:5px 7px;background:#111;color:#fff;font-size:9px;font-style:normal;font-weight:800}
    #see .focus-title{left:39%;top:31%}#see .focus-cta{left:47%;top:50%}#see .focus-products{left:12%;top:69%}
    #see .pattern-tag{position:absolute;padding:6px 8px;background:#111;color:#fff;border:1px solid rgba(255,255,255,.45);font-size:9px;font-weight:850;box-shadow:0 5px 16px rgba(0,0,0,.18)}
    #see .tag-nav{left:38%;top:4%}#see .tag-hero{left:7%;top:27%}#see .tag-cta{left:48%;top:49%}#see .tag-tabs{right:15%;top:67%}#see .tag-grid{left:46%;top:82%}
    #see .action-box{position:absolute;display:grid;gap:3px;padding:8px 10px;border:2px solid #d7ff42;background:#111;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.22)}
    #see .action-box b{color:#d7ff42;font-size:8px;letter-spacing:.09em}#see .action-box small{font-size:10px;font-weight:800}#see .action-primary{left:45%;top:47%}#see .action-secondary{right:8%;top:67%}
    #see .state-strip{position:absolute;left:50%;top:53%;transform:translateX(-50%);display:flex;align-items:center;gap:7px;padding:8px 10px;background:#fff;color:#111;border:1px solid #111;box-shadow:0 8px 24px rgba(0,0,0,.16);font-size:9px;font-weight:800}
    #see .state-strip i{font-style:normal;color:#788078}#see .state-pointer{position:absolute;padding:6px 8px;background:#d7ff42;color:#111;font-size:9px;font-weight:850}#see .state-nav-pointer{right:18%;top:67%}#see .state-card-pointer{left:18%;top:82%}
    #see .visual-notes{position:absolute;right:2.5%;top:5%;display:grid;gap:6px;width:min(190px,28%)}
    #see .visual-notes span{padding:7px 9px;background:rgba(255,255,255,.95);border-left:4px solid #d7ff42;color:#111;font-size:9px;font-weight:850;box-shadow:0 5px 16px rgba(0,0,0,.12)}
    #see .fashion-preview[data-lens="visual"] .fashion-demo-frame{filter:saturate(1.08) contrast(1.04)}
    #see .lens-note{display:flex!important;flex-direction:column;gap:18px;padding:28px 24px!important;border:0!important;border-left:1px solid rgba(15,21,17,.12)!important;background:#111713!important;color:#fff!important}
    #see .lens-note-index{color:#d7ff42;font-size:9px;font-weight:900;letter-spacing:.14em}#see .lens-note strong{font-size:30px;line-height:1;letter-spacing:-.035em;color:#fff}#see .lens-note p{margin:0!important;color:#c4cbc6!important;font-size:14px!important;line-height:1.72!important}#see .lens-note-rule{height:1px;background:rgba(255,255,255,.15);margin-top:auto}#see .lens-note small{color:#929d96;font-size:11px;line-height:1.6}
    #see .open-live-demo{display:inline-flex;align-items:center;justify-content:center;min-height:38px;padding:0 12px;border:1px solid rgba(255,255,255,.2);color:#fff;font-size:10px;font-weight:800;text-decoration:none}
    #see .open-live-demo:hover{background:#d7ff42;color:#111;border-color:#d7ff42}
    @media(max-width:980px){#see .see-lab{margin-left:0!important}#see .see-stage{grid-template-columns:1fr}#see .lens-note{border-left:0!important;border-top:1px solid rgba(255,255,255,.12)!important}#see .fashion-preview{aspect-ratio:16/11}}
    @media(max-width:640px){#see .see-toolbar{padding:18px}#see .fashion-preview{aspect-ratio:4/5}#see .see-controls{left:12px;right:12px;bottom:12px;justify-content:flex-start;width:auto;max-width:none;border-radius:18px;transform:none}#see .see-controls button{min-height:34px!important;padding:0 11px!important}#see .lens-note{padding:22px 18px!important}#see .lens-note strong{font-size:24px}#see .visual-notes{width:42%;right:2%;top:4%}#see .pattern-tag,#see .state-pointer,#see .action-box{transform:scale(.82);transform-origin:top left}}
  `;
}

function mountBreakdownLab() {
  const board = document.querySelector("#breakdown .breakdown-board");
  if (!board) return;
  board.innerHTML = `
    <div class="breakdown-guide">
      <div class="breakdown-guide-head">
        <span>01 / DECOMPOSE</span>
        <p data-zh="先确定观察尺度，再进入具体组件。" data-en="Choose the scale first, then inspect the components.">先确定观察尺度，再进入具体组件。</p>
      </div>
      <div class="breakdown-stack" aria-label="Page decomposition levels">
        <div><small>01</small><strong>PAGE</strong></div>
        <i>→</i>
        <div><small>02</small><strong>SECTION</strong></div>
        <i>→</i>
        <div><small>03</small><strong>PATTERN</strong></div>
        <i>→</i>
        <div><small>04</small><strong>COMPONENT</strong></div>
        <i>→</i>
        <div><small>05</small><strong>ELEMENT</strong></div>
        <i>→</i>
        <div><small>06</small><strong>STATE</strong></div>
      </div>
      <div class="anatomy-card">
        <div class="anatomy-title"><span>02 / STRUCTURE</span><h3>FuFu Bakery</h3></div>
        <div><small>01</small><b>Header</b><span data-zh="品牌与辅助操作" data-en="Brand and utility actions">品牌与辅助操作</span></div>
        <div><small>02</small><b>Hero</b><span data-zh="图片、标题与主行动" data-en="Image, headline, and primary CTA">图片、标题与主行动</span></div>
        <div><small>03</small><b data-zh="会员卡" data-en="Membership card">会员卡</b><span data-zh="进度与奖励状态" data-en="Progress and reward state">进度与奖励状态</span></div>
        <div><small>04</small><b data-zh="底部导航" data-en="Bottom navigation">底部导航</b><span data-zh="3 个入口与选中状态" data-en="Three destinations and selected state">3 个入口与选中状态</span></div>
      </div>
    </div>
    <div class="breakdown-css-lab" id="breakdownCssLab">
      <div class="breakdown-lab-head"><span>CSS / LIVE</span><small data-zh="只改颜色变量，结构不动" data-en="Change color variables, keep structure">只改颜色变量，结构不动</small></div>
      <div class="breakdown-theme-tabs" role="group" aria-label="CSS theme palettes">
        <button class="is-active" type="button" data-breakdown-theme="morning" aria-pressed="true"><i style="--chip:#f1c957"></i><span data-zh="早晨黄" data-en="Morning">早晨黄</span></button>
        <button type="button" data-breakdown-theme="picnic" aria-pressed="false"><i style="--chip:#97c98b"></i><span data-zh="野餐绿" data-en="Picnic">野餐绿</span></button>
        <button type="button" data-breakdown-theme="berry" aria-pressed="false"><i style="--chip:#edaaa8"></i><span data-zh="莓果粉" data-en="Berry">莓果粉</span></button>
      </div>
      <div class="mini-bakery" id="miniBakery">
        <div class="mini-bakery-top"><b>FuFu Bakery</b><span id="breakdownMood">早安烘焙</span></div>
        <div class="mini-bakery-body"><div><small data-zh="今日刚出炉" data-en="Fresh today">今日刚出炉</small><strong data-zh="海盐黄油卷" data-en="Sea salt butter roll">海盐黄油卷</strong><button type="button" id="miniBuy" data-zh="买一个面包" data-en="Buy a bread">买一个面包</button></div><img src="./demo/fufu-bakery/assets/fufu-baker.png" alt="FuFu baker"></div>
        <div class="mini-bakery-stamps"><span></span><span></span><span></span><span></span></div>
      </div>
      <pre class="breakdown-css-code" id="breakdownCssCode"></pre>
    </div>
  `;

  let style = document.querySelector("#learn-breakdown-lab-style");
  if (!style) { style = document.createElement("style"); style.id = "learn-breakdown-lab-style"; document.head.append(style); }
  style.textContent = `
    #breakdown .chapter-copy{max-width:1160px}
    #breakdown .chapter-copy h2{max-width:1160px;font-size:clamp(48px,5.2vw,72px);white-space:pre-line}
    #breakdown .breakdown-board{display:grid!important;grid-template-columns:minmax(0,1.08fr) minmax(360px,.92fr)!important;gap:16px!important;align-items:stretch}
    #breakdown .breakdown-guide{display:flex;min-width:0;flex-direction:column;border:1px solid var(--line-strong);background:rgba(255,255,255,.42)}
    #breakdown .breakdown-guide-head{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:20px 22px;border-bottom:1px solid var(--line)}
    #breakdown .breakdown-guide-head>span,#breakdown .anatomy-title>span{color:var(--green);font-size:9px;font-weight:900;letter-spacing:.14em}
    #breakdown .breakdown-guide-head p{margin:0;color:var(--muted);font-size:11px}
    #breakdown .breakdown-stack{display:grid;grid-template-columns:repeat(11,auto);align-items:center;gap:8px;padding:22px;border-bottom:1px solid var(--line);overflow-x:auto}
    #breakdown .breakdown-stack div{display:grid;gap:5px;min-width:max-content}
    #breakdown .breakdown-stack small{color:#89918b;font-size:8px;font-weight:850}
    #breakdown .breakdown-stack strong{font-size:clamp(12px,1.05vw,15px);letter-spacing:-.01em}
    #breakdown .breakdown-stack i{color:var(--green);font-size:12px;font-style:normal}
    #breakdown .anatomy-card{display:grid;grid-template-columns:1fr 1fr;gap:0;padding:0 22px 22px}
    #breakdown .anatomy-title{grid-column:1/-1;display:flex;justify-content:space-between;align-items:end;gap:18px;padding:22px 0 18px}
    #breakdown .anatomy-title h3{margin:0;font-size:clamp(23px,2.2vw,32px);letter-spacing:-.04em}
    #breakdown .anatomy-card>div:not(.anatomy-title){display:grid;grid-template-columns:24px 1fr;gap:4px 10px;min-height:94px;padding:18px 16px;border-top:1px solid var(--line)}
    #breakdown .anatomy-card>div:nth-child(even){border-right:1px solid var(--line)}
    #breakdown .anatomy-card>div:not(.anatomy-title)>small{grid-row:1/3;color:var(--green);font-size:9px;font-weight:900}
    #breakdown .anatomy-card b{font-size:16px;letter-spacing:-.02em}
    #breakdown .anatomy-card>div:not(.anatomy-title)>span{color:var(--muted);font-size:12px;line-height:1.45}
    #breakdown .breakdown-css-lab{display:flex;min-width:0;flex-direction:column;gap:14px;padding:22px;border:1px solid #111713;background:#111713;color:#fff}
    #breakdown .breakdown-lab-head{display:flex;justify-content:space-between;gap:14px;align-items:center}
    #breakdown .breakdown-lab-head>span{font-size:10px;font-weight:900;letter-spacing:.13em;color:#d7ff42}
    #breakdown .breakdown-lab-head small{color:#8f9992;font-size:10px}
    #breakdown .breakdown-theme-tabs{display:flex;gap:6px;flex-wrap:wrap}
    #breakdown .breakdown-theme-tabs button{display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:0 10px;border:1px solid rgba(255,255,255,.18);background:transparent;color:#cbd1cd;font-size:9px;font-weight:800;cursor:pointer}
    #breakdown .breakdown-theme-tabs button.is-active{background:#fff;color:#111}
    #breakdown .breakdown-theme-tabs i{width:9px;height:9px;border-radius:50%;background:var(--chip)}
    #breakdown .mini-bakery{--accent:#f1c957;--soft:#f8ead2;--label:#46647c;background:#fffefa;color:#111;border:1px solid rgba(255,255,255,.15);transition:background .2s ease}
    #breakdown .mini-bakery-top{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:10px 12px;background:var(--accent);font-size:9px}
    #breakdown .mini-bakery-top b{font-size:14px}
    #breakdown .mini-bakery-body{display:grid;grid-template-columns:1fr 106px;min-height:142px;background:var(--soft);padding:14px;gap:12px;overflow:hidden}
    #breakdown .mini-bakery-body>div{display:flex;flex-direction:column;align-items:flex-start}
    #breakdown .mini-bakery-body small{color:var(--label);font-weight:850}
    #breakdown .mini-bakery-body strong{font-size:21px;line-height:1.08;margin:5px 0 10px}
    #breakdown .mini-bakery-body button{margin-top:auto;border:1px solid #111;background:var(--accent);padding:8px 10px;font-size:9px;font-weight:850;cursor:pointer}
    #breakdown .mini-bakery-body img{width:100%;height:118px;object-fit:contain;align-self:end;background:rgba(255,255,255,.7)}
    #breakdown .mini-bakery-stamps{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:9px 12px}
    #breakdown .mini-bakery-stamps span{height:7px;border:1px solid rgba(0,0,0,.28)}
    #breakdown .mini-bakery-stamps span.is-stamped{background:var(--accent);border-color:var(--accent)}
    #breakdown .breakdown-css-code{flex:1;margin:0;padding:13px 14px;background:#080b09;border:1px solid rgba(255,255,255,.11);color:#c7d1ca;min-height:124px;overflow:auto;font:10px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap}
    @media(max-width:1050px){#breakdown .breakdown-board{grid-template-columns:1fr!important}#breakdown .breakdown-css-lab{min-height:430px}}
    @media(max-width:700px){#breakdown .breakdown-guide-head,#breakdown .anatomy-title{align-items:flex-start;flex-direction:column}#breakdown .anatomy-card{grid-template-columns:1fr}#breakdown .anatomy-card>div:nth-child(even){border-right:0}#breakdown .mini-bakery-body{grid-template-columns:1fr 84px}}
  `;
}

function renderBreakdownTheme(themeName = activeBreakdownTheme) {
  activeBreakdownTheme = themeName;
  const theme = breakdownThemes[themeName] || breakdownThemes.morning;
  const mini = document.querySelector("#miniBakery");
  if (mini) { mini.style.setProperty("--accent", theme.accent); mini.style.setProperty("--soft", theme.soft); mini.style.setProperty("--label", theme.label); }
  document.querySelectorAll("[data-breakdown-theme]").forEach(button => { const selected = button.dataset.breakdownTheme === themeName; button.classList.toggle("is-active", selected); button.setAttribute("aria-pressed", String(selected)); });
  const mood = document.querySelector("#breakdownMood");
  if (mood) mood.textContent = activeLanguage === "en" ? theme.moodEn : theme.moodZh;
  const code = document.querySelector("#breakdownCssCode");
  if (code) code.textContent = `.bakery-card {\n  --accent: ${theme.accent};\n  --soft: ${theme.soft};\n  --label: ${theme.label};\n}\n\nheader, button { background: var(--accent); }\n.product { background: var(--soft); }`;
}

function bindBreakdownLab() {
  document.querySelectorAll("[data-breakdown-theme]").forEach(button => button.addEventListener("click", () => renderBreakdownTheme(button.dataset.breakdownTheme)));
  let stamps = 0;
  document.querySelector("#miniBuy")?.addEventListener("click", () => { stamps = stamps >= 4 ? 0 : stamps + 1; document.querySelectorAll(".mini-bakery-stamps span").forEach((stamp, index) => stamp.classList.toggle("is-stamped", index < stamps)); });
}

function syncDocumentMeta(lang) {
  document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  document.title = lang === "en" ? "How to Design with AI · ONDesign" : "如何与 AI 一起做 UI · ONDesign";
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = lang === "en" ? "Learn to see, describe, build and review interfaces with AI." : "学习如何看懂、拆解、描述、生成并判断 AI UI。";
  const tablist = document.querySelector(".see-controls");
  if (tablist) tablist.setAttribute("aria-label", lang === "en" ? "Interface inspection lenses" : "界面观察维度");
}

function syncWhySection(lang) {
  const why = document.querySelector("#why"); if (!why) return;
  const eyebrow = why.querySelector(".eyebrow"); if (eyebrow) eyebrow.textContent = lang === "en" ? "WHY THIS MATTERS" : "为什么这很重要";
  const systemCopy = why.querySelector(".translation-board > div:last-child p"); if (systemCopy) systemCopy.textContent = lang === "en" ? "Visual hierarchy · Combobox · Responsive reflow · Loading state · Spacing system · Interaction rule" : "视觉层级 · 组合框 · 响应式重排 · 加载状态 · 间距系统 · 交互规则";
  const quote = why.querySelector(".chapter-quote"); if (quote) quote.textContent = lang === "en" ? "The better you see design, the better you can direct AI." : "你越能看懂设计，就越能准确地指挥 AI。";
  let roleStyle = document.querySelector("#learn-role-label-style"); if (!roleStyle) { roleStyle = document.createElement("style"); roleStyle.id = "learn-role-label-style"; document.head.append(roleStyle); }
  roleStyle.textContent = lang === "en" ? '#why .translation-board>div:first-child::before{content:"HUMAN"}#why .translation-board>div:last-child::before{content:"SYSTEM"}' : '#why .translation-board>div:first-child::before{content:"人"}#why .translation-board>div:last-child::before{content:"系统"}';
}

function syncFashionFrame(lang) {
  const frame = document.querySelector("#fashionDemoFrame");
  if (frame && frame.dataset.lang !== lang) { frame.dataset.lang = lang; frame.src = `./demo/fashion/index.html?embed=1&lang=${lang}`; frame.title = lang === "en" ? "Interactive fashion ecommerce webpage demo" : "可交互时尚电商网页演示"; }
  const open = document.querySelector(".open-live-demo"); if (open) open.href = `./demo/fashion/index.html?lang=${lang}`;
}

function applyLanguage(event) {
  const lang = currentLanguage(event); activeLanguage = lang; syncDocumentMeta(lang);
  document.querySelectorAll("[data-zh][data-en]").forEach(el => { const value = el.dataset[lang]; if (value) el.textContent = value.replace(/\\n/g, "\n"); });
  document.querySelectorAll("[data-smart-lang-link]").forEach(link => { const target = new URL(link.dataset.smartLangLink, location.href); target.searchParams.set("lang", lang); link.href = `${target.pathname.split("/").pop()}${target.search}${target.hash}`; });
  const rebuildLink = document.querySelector('.final-links a[href*="launcher.html"]'); if (rebuildLink) { const target = new URL(rebuildLink.href, location.href); target.searchParams.set("lang", lang); rebuildLink.href = target.href; }
  syncWhySection(lang); syncFashionFrame(lang); updateLens(document.querySelector("[data-lens].is-active")?.dataset.lens || "layout", lang); renderBreakdownTheme(activeBreakdownTheme);
}

function updateLens(lens, forcedLanguage) {
  const lang = forcedLanguage || activeLanguage || currentLanguage();
  const note = translations[lens]?.[lang] || translations.layout[lang];
  const sample = document.querySelector("#sampleUi"); if (sample) { sample.dataset.lens = lens; sample.dataset.lang = lang; }
  const title = document.querySelector("#lensTitle"); const text = document.querySelector("#lensText"); if (title) title.textContent = note[0]; if (text) text.textContent = note[1];
}

mountSeeLab();
mountBreakdownLab();
bindBreakdownLab();

const lensButtons = [...document.querySelectorAll(".see-controls button[data-lens]")];
lensButtons.forEach(button => {
  button.addEventListener("click", () => { lensButtons.forEach(item => { const selected = item === button; item.classList.toggle("is-active", selected); item.setAttribute("aria-selected", String(selected)); }); updateLens(button.dataset.lens); });
  button.addEventListener("keydown", event => { if (!["ArrowDown","ArrowRight","ArrowUp","ArrowLeft"].includes(event.key)) return; event.preventDefault(); const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1; const currentIndex = lensButtons.indexOf(button); const nextButton = lensButtons[(currentIndex + direction + lensButtons.length) % lensButtons.length]; nextButton.focus(); nextButton.click(); });
});

const progressBar = document.querySelector("#pageProgressBar");
const chapterLinks = [...document.querySelectorAll("[data-section-link]")];
const chapters = [...document.querySelectorAll("[data-section]")];
function updateScrollState() {
  const max = document.documentElement.scrollHeight - innerHeight; const progress = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0; if (progressBar) progressBar.style.width = `${progress * 100}%`;
  let current = chapters[0]?.dataset.section;
  chapters.forEach(chapter => { const rect = chapter.getBoundingClientRect(); if (rect.top <= innerHeight * .34) current = chapter.dataset.section; });
  const activeIndex = chapterLinks.findIndex(link => link.dataset.sectionLink === current);
  chapterLinks.forEach((link, index) => {
    const distance = Math.abs(index - activeIndex);
    link.classList.toggle("is-current", distance === 0);
    link.classList.toggle("rail-near-1", distance === 1);
    link.classList.toggle("rail-near-2", distance === 2);
  });
}
addEventListener("scroll", updateScrollState, { passive: true });
addEventListener("resize", updateScrollState);

applyLanguage();
renderBreakdownTheme();
updateScrollState();

if (window.image2I18n?.registerPage) window.image2I18n.registerPage(lang => applyLanguage(lang));
else window.addEventListener("image2:languagechange", applyLanguage);
