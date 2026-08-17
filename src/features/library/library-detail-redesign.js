import { styleGuides } from "../../../catalog/index.js?v=20260815-artmuse-sequence";

const SCREEN_RAILS = Object.freeze({
  museum: [
    { baseIndex: 0, src: "./assets/cases/museum-app/home-screen.png", label: "首页" },
    { baseIndex: 1, src: "./assets/cases/museum-app/exhibitions-screen.png", label: "展览" },
    { baseIndex: 2, src: "./assets/cases/museum-app/detail-screen.png", label: "详情" }
  ],
  fashion: [
    { baseIndex: 0, src: "./assets/cases/fashion-shopping-app/hero-screen.png", label: "首页" },
    { baseIndex: 1, src: "./assets/cases/fashion-shopping-app/catalog-screen.png", label: "目录" },
    { baseIndex: 2, src: "./assets/cases/fashion-shopping-app/favorites-screen.png", label: "收藏" }
  ],
  fufu: [
    { baseIndex: 1, src: "./demo/fufu-bakery/screenshots/02-home.png", label: "首页" },
    { baseIndex: 2, src: "./demo/fufu-bakery/screenshots/04-menu.png", label: "菜单" },
    { baseIndex: 3, src: "./demo/fufu-bakery/screenshots/03-member.png", label: "会员" },
    { baseIndex: 0, src: "./demo/fufu-bakery/screenshots/01-welcome.png", label: "欢迎" }
  ],
  organique: [
    { baseIndex: 0, src: "./demo/organique-food/screenshots/01-choose.png", label: "选餐" },
    { baseIndex: 1, src: "./demo/organique-food/screenshots/02-plan.png", label: "计划" },
    { baseIndex: 2, src: "./demo/organique-food/screenshots/03-confirmation.png", label: "确认" }
  ],
  "plate-play": [
    { baseIndex: 1, src: "./demo/plate-play/screenshots/recipes.png", label: "食谱" },
    { baseIndex: 2, src: "./demo/plate-play/screenshots/detail.png", label: "详情" },
    { baseIndex: 0, src: "./demo/plate-play/screenshots/library-preview-2x.png", label: "欢迎" }
  ],
  "carry-bag": [
    { baseIndex: 0, src: "./demo/carry-bag/screenshots/03-hero.png", label: "首页" },
    { baseIndex: 1, src: "./demo/carry-bag/screenshots/01-catalog.png", label: "目录" },
    { baseIndex: 2, src: "./demo/carry-bag/screenshots/02-detail.png", label: "详情" }
  ],
  fithub: [
    { baseIndex: 0, src: "./demo/fithub/screenshots/01-discover.png", label: "发现" },
    { baseIndex: 1, src: "./demo/fithub/screenshots/02-activity.png", label: "活动" },
    { baseIndex: 2, src: "./demo/fithub/screenshots/03-focus.png", label: "目标" }
  ],
  "still-form": [
    { baseIndex: 1, src: "./demo/still-form/screenshots/02-catalog.png", label: "目录" },
    { baseIndex: 2, src: "./demo/still-form/screenshots/03-detail.png", label: "详情" },
    { baseIndex: 0, src: "./demo/still-form/screenshots/01-intro.png", label: "入口" }
  ],
  news: [
    { baseIndex: 0, src: "./assets/cases/news-app/headlines-screen.png", label: "头条" },
    { baseIndex: 1, src: "./assets/cases/news-app/feed-screen.png", label: "新闻流" },
    { baseIndex: 2, src: "./assets/cases/news-app/discover-screen.png", label: "发现" }
  ],
  "signal-grid": [
    { baseIndex: 0, src: "./demo/signal-grid/screenshots/01-scan.png", label: "扫描" },
    { baseIndex: 1, src: "./demo/signal-grid/screenshots/02-plans.png", label: "方案" },
    { baseIndex: 2, src: "./demo/signal-grid/screenshots/03-confirmation.png", label: "确认" }
  ],
  "volt-route": [
    { baseIndex: 0, src: "./demo/volt-route/screenshots/01-dashboard.png", label: "车辆" },
    { baseIndex: 1, src: "./demo/volt-route/screenshots/02-route.png", label: "路线" },
    { baseIndex: 2, src: "./demo/volt-route/screenshots/03-charging.png", label: "充电" }
  ],
  moe: [
    { baseIndex: 1, src: "./demo/moe-habits/screenshots/video-2x/02-home.png", label: "习惯首页" },
    { baseIndex: 2, src: "./demo/moe-habits/screenshots/video-2x/03-task.png", label: "任务" },
    { baseIndex: 3, src: "./demo/moe-habits/screenshots/video-2x/04-celebration.png", label: "完成" },
    { baseIndex: 0, src: "./demo/moe-habits/screenshots/video-2x/01-intro.png", label: "欢迎" }
  ],
  loy: [
    { baseIndex: 1, src: "./demo/loy-wellness/screenshots/01-home.png", label: "健康首页" },
    { baseIndex: 2, src: "./demo/loy-wellness/screenshots/02-playlist.png", label: "播放列表" },
    { baseIndex: 0, src: "./demo/loy-wellness/screenshots/03-welcome.png", label: "欢迎" }
  ],
  moodly: [
    { baseIndex: 0, src: "./demo/moodly-health/screenshots/01-checkin.png", label: "签到" },
    { baseIndex: 1, src: "./demo/moodly-health/screenshots/02-confirm.png", label: "完成" }
  ],
  reflect: [
    { baseIndex: 0, src: "./demo/reflect-journal/screenshots/01-home.png", label: "日记首页" },
    { baseIndex: 1, src: "./demo/reflect-journal/screenshots/02-detail.png", label: "日记详情" }
  ],
  mimo: [
    { baseIndex: 0, src: "./demo/mimo-activities/screenshots/01-carousel.png", label: "日程" },
    { baseIndex: 1, src: "./demo/mimo-activities/screenshots/02-walk-focus.png", label: "任务" }
  ]
});

const PREFERRED_IMAGE_INDEX = Object.freeze({
  moe: 1,
  loy: 1,
  fufu: 1,
  "plate-play": 1,
  "still-form": 1
});

const categoryLabels = Object.freeze({
  zh: { culture: "文化", commerce: "零售电商", editorial: "新闻阅读", travel: "旅行", creative: "创意工具", wellness: "健康陪伴" },
  en: { culture: "Culture", commerce: "Commerce", editorial: "Editorial", travel: "Travel", creative: "Creative", wellness: "Wellness" }
});

const dialog = document.querySelector("#previewDialog");
const stage = document.querySelector("#previewMediaStage");
const frame = document.querySelector("#previewMediaFrame");
const video = document.querySelector("#previewDialogVideo");
const sequence = document.querySelector("#previewDialogSequence");
const modeSwitch = document.querySelector("#previewModeSwitch");
const details = document.querySelector("#previewDialogDetails");
const title = document.querySelector("#previewDialogTitle");
const imageCount = document.querySelector("#previewImageCount");
const imageNext = document.querySelector("#previewImageNext");
const copyMarker = document.querySelector("#previewDialogCopy");

function isEnglish() {
  return window.image2I18n?.language === "en";
}

function localized(record) {
  if (!record || !isEnglish() || !record.locales?.en) return record;
  return { ...record, ...record.locales.en, recipe: { ...record.recipe, ...record.locales.en.recipe } };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function currentCaseId() {
  return copyMarker?.dataset.copyStyle || "";
}

function currentGuide() {
  const source = styleGuides.find((guide) => guide.id === currentCaseId());
  return localized(source);
}

function currentMode() {
  return modeSwitch?.querySelector("[data-preview-view].is-active")?.dataset.previewView || "image";
}

function currentBaseImageIndex() {
  const value = imageCount?.textContent || "";
  const match = value.match(/(\d+)\s*\/\s*(\d+)/);
  return match ? Math.max(0, Number(match[1]) - 1) : 0;
}

function goToBaseImageIndex(targetIndex) {
  const value = imageCount?.textContent || "";
  const match = value.match(/(\d+)\s*\/\s*(\d+)/);
  if (!match || !imageNext) return;
  const current = Math.max(0, Number(match[1]) - 1);
  const total = Math.max(1, Number(match[2]));
  const target = ((targetIndex % total) + total) % total;
  const steps = (target - current + total) % total;
  for (let index = 0; index < steps; index += 1) imageNext.click();
}

function ensureMediaChrome() {
  if (!stage || !modeSwitch || !frame) return;
  let head = stage.querySelector(".preview-mode-head");
  if (!head) {
    head = document.createElement("div");
    head.className = "preview-mode-head";
    head.innerHTML = `<span class="preview-mode-caption">${isEnglish() ? "Preview" : "预览方式"}</span><span class="preview-mode-badge" id="previewModeBadge"></span>`;
    stage.insertBefore(head, frame);
  }
  if (modeSwitch.parentElement !== head) head.insertBefore(modeSwitch, head.querySelector(".preview-mode-badge"));

  let rail = stage.querySelector("#previewScreenRail");
  if (!rail) {
    rail = document.createElement("div");
    rail.id = "previewScreenRail";
    rail.className = "preview-screen-rail";
    rail.setAttribute("aria-label", isEnglish() ? "Case screens" : "案例页面");
    frame.insertAdjacentElement("afterend", rail);
  }
}

function renderDetails() {
  const guide = currentGuide();
  if (!guide || !details || !title) return;
  if (details.querySelector(".case-detail-summary")?.dataset.caseId === guide.id) return;

  const locale = isEnglish() ? "en" : "zh";
  const category = categoryLabels[locale][guide.category] || guide.category;
  title.innerHTML = `<strong>${escapeHtml(guide.name)}</strong><span>/ ${escapeHtml(guide.style)}</span>`;
  const tags = [category, ...(guide.tags || []).slice(0, 2)];
  const factLabels = isEnglish()
    ? ["Palette", "Structure", "Best for"]
    : ["色彩", "页面结构", "适用场景"];
  const detailTitle = isEnglish() ? "Full design notes" : "完整设计说明";
  const principleLabel = isEnglish() ? "Core principle" : "核心原则";
  const referenceLabel = isEnglish() ? "Reference direction" : "参考方向";
  const componentsLabel = isEnglish() ? "Components" : "组件";
  const typeLabel = isEnglish() ? "Typography" : "排版";
  const imageLabel = isEnglish() ? "Imagery" : "图片";

  details.innerHTML = `
    <div class="case-detail-summary" data-case-id="${escapeHtml(guide.id)}">
      <div class="case-detail-tags">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
      <p>${escapeHtml(guide.summary)}</p>
      <div class="case-quick-facts">
        <div><small>${factLabels[0]}</small><strong>${escapeHtml(guide.palette)}</strong></div>
        <div><small>${factLabels[1]}</small><strong>${escapeHtml(guide.layout)}</strong></div>
        <div><small>${factLabels[2]}</small><strong>${escapeHtml(guide.bestFor)}</strong></div>
      </div>
    </div>
    <details class="preview-dialog-more case-design-notes">
      <summary><span>${detailTitle}</span><small>${isEnglish() ? "Principles, type and components" : "原则、排版与组件"}</small></summary>
      <div class="case-design-notes-content">
        <dl>
          <div><dt>${principleLabel}</dt><dd>${escapeHtml(guide.recipe?.principle)}</dd></div>
          <div><dt>${referenceLabel}</dt><dd>${escapeHtml(guide.reference)}</dd></div>
          <div><dt>${componentsLabel}</dt><dd>${escapeHtml(guide.recipe?.components)}</dd></div>
          <div><dt>${typeLabel}</dt><dd>${escapeHtml(guide.recipe?.type)}</dd></div>
          <div><dt>${imageLabel}</dt><dd>${escapeHtml(guide.recipe?.image)}</dd></div>
        </dl>
      </div>
    </details>`;
}

function renderScreenRail() {
  const rail = stage?.querySelector("#previewScreenRail");
  if (!rail) return;
  const id = currentCaseId();
  const screens = SCREEN_RAILS[id] || [];
  const imageMode = currentMode() === "image";
  rail.hidden = !imageMode || screens.length < 2;
  if (rail.hidden) return;

  const currentIndex = currentBaseImageIndex();
  if (rail.dataset.caseId !== id) {
    rail.dataset.caseId = id;
    rail.innerHTML = screens.map((screen) => `
      <button type="button" data-base-index="${screen.baseIndex}" aria-label="${escapeHtml(screen.label)}">
        <img src="${escapeHtml(screen.src)}" alt="" loading="lazy" decoding="async">
        <span>${escapeHtml(screen.label)}</span>
      </button>`).join("");
    rail.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => goToBaseImageIndex(Number(button.dataset.baseIndex))));
  }
  rail.querySelectorAll("button").forEach((button) => {
    const active = Number(button.dataset.baseIndex) === currentIndex;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function syncModePresentation() {
  if (!stage || !frame) return;
  const mode = currentMode();
  stage.dataset.previewMode = mode;
  const rawVideo = mode === "video" && video && !video.hidden && (!sequence || sequence.hidden);
  frame.classList.toggle("is-source-video", Boolean(rawVideo));

  const badge = stage.querySelector("#previewModeBadge");
  if (badge) {
    const labels = isEnglish()
      ? { image: "Screens", video: "Demo video", live: "Interactive" }
      : { image: "效果图", video: "Demo 视频", live: "可点击 Demo" };
    const screenCount = SCREEN_RAILS[currentCaseId()]?.length || 0;
    badge.textContent = mode === "image" && screenCount > 1 ? `${labels[mode]} · ${screenCount} ${isEnglish() ? "screens" : "屏"}` : labels[mode];
  }
  renderScreenRail();
}

function applyPreferredScreen() {
  const id = currentCaseId();
  if (!dialog?.open || currentMode() !== "image" || dialog.dataset.preferredScreenApplied === id) return;
  const preferred = PREFERRED_IMAGE_INDEX[id];
  dialog.dataset.preferredScreenApplied = id;
  if (!Number.isFinite(preferred)) return;
  window.requestAnimationFrame(() => goToBaseImageIndex(preferred));
}

function syncDialog() {
  if (!dialog?.open) return;
  ensureMediaChrome();
  renderDetails();
  syncModePresentation();
  applyPreferredScreen();
}

function boot() {
  ensureMediaChrome();

  new MutationObserver(() => window.requestAnimationFrame(syncDialog)).observe(dialog, {
    attributes: true,
    attributeFilter: ["open"]
  });
  new MutationObserver(() => window.requestAnimationFrame(syncDialog)).observe(copyMarker, {
    attributes: true,
    attributeFilter: ["data-copy-style"]
  });
  new MutationObserver(() => window.requestAnimationFrame(syncDialog)).observe(modeSwitch, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["class", "aria-pressed"]
  });
  new MutationObserver(() => window.requestAnimationFrame(syncModePresentation)).observe(imageCount, {
    childList: true,
    subtree: true,
    characterData: true
  });
  [video, sequence].filter(Boolean).forEach((element) => {
    new MutationObserver(() => window.requestAnimationFrame(syncModePresentation)).observe(element, {
      attributes: true,
      attributeFilter: ["hidden", "src"]
    });
  });
  new MutationObserver(() => window.requestAnimationFrame(renderDetails)).observe(details, { childList: true });

  dialog.addEventListener("close", () => {
    delete dialog.dataset.preferredScreenApplied;
    frame?.classList.remove("is-source-video");
    const rail = stage?.querySelector("#previewScreenRail");
    if (rail) rail.hidden = true;
  });

  window.image2I18n?.registerPage?.(() => {
    const caption = stage?.querySelector(".preview-mode-caption");
    if (caption) caption.textContent = isEnglish() ? "Preview" : "预览方式";
    if (dialog.open) {
      details.innerHTML = "";
      renderDetails();
      syncModePresentation();
    }
  });

  syncDialog();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
else boot();
