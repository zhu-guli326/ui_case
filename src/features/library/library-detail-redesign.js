import { styleGuides } from "../../../catalog/index.js?v=20260820-media-assets-v2";
import { getLibraryPreviewDevice } from "../../../library-preview-config.mjs";

const SCREEN_RAILS = Object.freeze({});
const PREFERRED_IMAGE_INDEX = Object.freeze({});

const categoryLabels = Object.freeze({
  zh: { culture: "文化", commerce: "零售电商", editorial: "新闻阅读", travel: "旅行", creative: "创意工具", wellness: "健康陪伴" },
  en: { culture: "Culture", commerce: "Commerce", editorial: "Editorial", travel: "Travel", creative: "Creative", wellness: "Wellness" }
});

const dialog = document.querySelector("#previewDialog");
const stage = document.querySelector("#previewMediaStage");
const frame = document.querySelector("#previewMediaFrame");
const phoneScreen = document.querySelector("#previewPhoneScreen");
const image = document.querySelector("#previewDialogImage");
const video = document.querySelector("#previewDialogVideo");
const sequence = document.querySelector("#previewDialogSequence");
const demo = document.querySelector("#previewDialogDemo");
const modeSwitch = document.querySelector("#previewModeSwitch");
const details = document.querySelector("#previewDialogDetails");
const title = document.querySelector("#previewDialogTitle");
const imageCount = document.querySelector("#previewImageCount");
const imageNext = document.querySelector("#previewImageNext");
const copyMarker = document.querySelector("#previewDialogCopy");
const rail = document.querySelector("#previewScreenRail");
const badge = document.querySelector("#previewModeBadge");

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

function sourceGuide() {
  return styleGuides.find((guide) => guide.id === currentCaseId()) || null;
}

function currentGuide() {
  return localized(sourceGuide());
}

function codeContract(guide) {
  const isFuFu = guide?.id === "fufu";
  return isFuFu
    ? `<!-- FuFu Bakery: readable UI stays in code -->\n<header class="statusbar">\n  <time>10:04</time>\n  <span class="status-icons" aria-label="Signal, Wi-Fi and battery">\n    <svg aria-hidden="true"><use href="#i-signal"></use></svg>\n    <svg aria-hidden="true"><use href="#i-wifi"></use></svg>\n    <svg aria-hidden="true"><use href="#i-battery"></use></svg>\n  </span>\n</header>\n<nav class="tabbar" aria-label="Primary navigation">\n  <button class="tab is-active">小店</button>\n  <button class="tab">菜单</button>\n  <button class="tab">会员</button>\n</nav>`
    : `// ${guide?.name || "UI case"}: coded interface contract\nconst screen = {\n  size: "390 × 844",\n  statusBar: "code-rendered",\n  navigation: "code-rendered",\n  components: "${guide?.recipe?.components || "semantic controls and states"}"\n};`;
}

function currentMode() {
  return modeSwitch?.querySelector("[data-preview-view].is-active")?.dataset.previewView || "image";
}

function currentBaseImageIndex() {
  const match = (imageCount?.textContent || "").match(/(\d+)\s*\/\s*(\d+)/);
  return match ? Math.max(0, Number(match[1]) - 1) : 0;
}

function goToBaseImageIndex(targetIndex) {
  const match = (imageCount?.textContent || "").match(/(\d+)\s*\/\s*(\d+)/);
  if (!match || !imageNext) return;
  const current = Math.max(0, Number(match[1]) - 1);
  const total = Math.max(1, Number(match[2]));
  const target = ((targetIndex % total) + total) % total;
  const steps = (target - current + total) % total;
  for (let index = 0; index < steps; index += 1) imageNext.click();
}

function renderDetails() {
  const guide = currentGuide();
  if (!guide || !details || !title) return;
  if (details.querySelector(".case-detail-summary")?.dataset.caseId === guide.id) return;

  const locale = isEnglish() ? "en" : "zh";
  const category = categoryLabels[locale][guide.category] || guide.category;
  title.innerHTML = `<strong>${escapeHtml(guide.name)}</strong><span>/ ${escapeHtml(guide.style)}</span>`;
  const tags = [category, ...(guide.tags || []).slice(0, 2)];
  const factLabels = isEnglish() ? ["Palette", "Structure", "Best for"] : ["色彩", "页面结构", "适用场景"];
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
      <summary><span>${detailTitle}</span><small></small></summary>
      <div class="case-design-notes-content"><dl>
        <div><dt>${principleLabel}</dt><dd>${escapeHtml(guide.recipe?.principle)}</dd></div>
        <div><dt>${referenceLabel}</dt><dd>${escapeHtml(guide.reference)}</dd></div>
        <div><dt>${componentsLabel}</dt><dd>${escapeHtml(guide.recipe?.components)}</dd></div>
        <div><dt>${typeLabel}</dt><dd>${escapeHtml(guide.recipe?.type)}</dd></div>
        <div><dt>${imageLabel}</dt><dd>${escapeHtml(guide.recipe?.image)}</dd></div>
      </dl></div>
    </details>
    <details class="preview-dialog-code">
      <summary><span>${isEnglish() ? "Code implementation" : "代码实现"}</span><small>${isEnglish() ? "Readable UI layer" : "可读界面层"}</small></summary>
      <pre><code>${escapeHtml(codeContract(guide))}</code></pre>
    </details>`;
}

function renderScreenRail() {
  if (!rail) return;
  const id = currentCaseId();
  const screens = SCREEN_RAILS[id] || [];
  rail.hidden = currentMode() !== "image" || screens.length < 2;
  if (rail.hidden) return;

  if (rail.dataset.caseId !== id) {
    rail.dataset.caseId = id;
    rail.innerHTML = screens.map((screen) => `
      <button type="button" data-base-index="${screen.baseIndex}" aria-label="${escapeHtml(screen.label)}">
        <img src="${escapeHtml(screen.src)}" alt="" loading="lazy" decoding="async">
        <span>${escapeHtml(screen.label)}</span>
      </button>`).join("");
    rail.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => goToBaseImageIndex(Number(button.dataset.baseIndex)));
    });
  }

  const activeIndex = currentBaseImageIndex();
  rail.querySelectorAll("button").forEach((button) => {
    const active = Number(button.dataset.baseIndex) === activeIndex;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function relabelModes() {
  const guide = sourceGuide();
  if (!guide || !modeSwitch) return;
  const videoButton = modeSwitch.querySelector('[data-preview-view="video"]');
  if (videoButton && guide.videoSequence) {
    videoButton.textContent = isEnglish() ? "Flow preview" : "流程预览";
    videoButton.setAttribute("aria-label", videoButton.textContent);
  }
}

function syncLiveScale() {
  if (!frame || !phoneScreen || !demo || demo.hidden || currentMode() !== "live") return;
  const guide = sourceGuide();
  if (!guide) return;
  const { width, height } = getLibraryPreviewDevice(guide.id, "live") || { width: 390, height: 844 };
  if (!phoneScreen.clientWidth || !phoneScreen.clientHeight) return;
  const scale = Math.min(phoneScreen.clientWidth / width, phoneScreen.clientHeight / height);
  frame.style.setProperty("--preview-embed-scale", String(scale));
}

function syncModePresentation() {
  if (!stage || !frame) return;
  const guide = sourceGuide();
  const mode = currentMode();
  stage.dataset.previewMode = mode;

  // Keep the active media node explicit. Multiple observers update this dialog
  // during open/mode changes; relying on a previous `hidden` state can leave a
  // blank white viewport even though the source and thumbnail loaded correctly.
  // Avoid writing the same attribute value repeatedly. The media nodes are
  // observed below, so unconditional assignments create a feedback loop:
  // sync -> hidden mutation -> sync -> hidden mutation.
  const setHidden = (element, hidden) => {
    if (element && element.hidden !== hidden) element.hidden = hidden;
  };
  setHidden(image, mode !== "image");
  setHidden(sequence, mode !== "video" || !guide?.videoSequence);
  setHidden(video, mode !== "video" || Boolean(guide?.videoSequence));
  setHidden(demo, mode !== "live");

  // A sequence is screen-only and uses the neutral Library viewport. Only a raw
  // MP4 receives source-video treatment for the legacy baked-device fallback.
  const rawVideo = mode === "video" && video && !video.hidden && (!sequence || sequence.hidden);
  frame.classList.toggle("is-source-video", Boolean(rawVideo));

  relabelModes();
  if (badge) {
    const labels = isEnglish()
      ? { image: "Screens", video: guide?.videoSequence ? "Flow preview" : "Demo video", live: "Interactive" }
      : { image: "效果图", video: guide?.videoSequence ? "流程预览" : "Demo 视频", live: "可点击 Demo" };
    const screenCount = SCREEN_RAILS[currentCaseId()]?.length || 0;
    badge.textContent = mode === "image" && screenCount > 1
      ? `${labels.image} · ${screenCount} ${isEnglish() ? "screens" : "屏"}`
      : labels[mode];
  }

  renderScreenRail();
  if (mode === "live") requestAnimationFrame(syncLiveScale);
}

function applyPreferredScreen() {
  const id = currentCaseId();
  if (!dialog?.open || currentMode() !== "image" || dialog.dataset.preferredScreenApplied === id) return;
  const preferred = PREFERRED_IMAGE_INDEX[id];
  dialog.dataset.preferredScreenApplied = id;
  if (!Number.isFinite(preferred)) return;
  requestAnimationFrame(() => goToBaseImageIndex(preferred));
}

function syncDialog() {
  if (!dialog?.open) return;
  renderDetails();
  syncModePresentation();
  applyPreferredScreen();
}

function boot() {
  if (!dialog || !modeSwitch || !copyMarker) return;

  new MutationObserver(() => requestAnimationFrame(syncDialog)).observe(dialog, {
    attributes: true,
    attributeFilter: ["open"]
  });
  new MutationObserver(() => {
    delete dialog.dataset.preferredScreenApplied;
    if (rail) rail.dataset.caseId = "";
    requestAnimationFrame(syncDialog);
  }).observe(copyMarker, {
    attributes: true,
    attributeFilter: ["data-copy-style"]
  });
  new MutationObserver(() => requestAnimationFrame(syncModePresentation)).observe(modeSwitch, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["class", "aria-pressed"]
  });
  if (imageCount) {
    new MutationObserver(() => requestAnimationFrame(renderScreenRail)).observe(imageCount, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
  [video, sequence, demo].filter(Boolean).forEach((element) => {
    new MutationObserver(() => requestAnimationFrame(syncModePresentation)).observe(element, {
      attributes: true,
      attributeFilter: ["hidden", "src"]
    });
  });
  if (details) {
    new MutationObserver(() => requestAnimationFrame(renderDetails)).observe(details, { childList: true });
  }
  if (phoneScreen && "ResizeObserver" in window) {
    new ResizeObserver(() => requestAnimationFrame(syncLiveScale)).observe(phoneScreen);
  }

  dialog.addEventListener("close", () => {
    delete dialog.dataset.preferredScreenApplied;
    frame?.classList.remove("is-source-video");
    if (rail) rail.hidden = true;
  });

  window.image2I18n?.registerPage?.(() => {
    const caption = stage?.querySelector(".preview-mode-caption");
    if (caption) caption.textContent = isEnglish() ? "Preview" : "预览方式";
    if (dialog.open) {
      if (details) details.innerHTML = "";
      renderDetails();
      syncModePresentation();
    }
  });

  syncDialog();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
else boot();
