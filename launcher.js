import { brandProfiles, styleGuides, styleProfiles } from "./catalog/index.js";
import {
  caseOverviewImage,
  caseThumbnail,
  filterCases,
  localizeCase,
  normalizeCaseId,
  stylePreviewCaseIds,
} from "./catalog/case-utils.js";
import {
  designSystemLabel,
  designSystemOptions,
} from "./catalog/design-system-utils.js";
import {
  colorThemePrompt,
  colorThemes,
  localizeColorTheme,
  normalizeColorThemeId,
} from "./catalog/color-themes.js";
import {
  findFontPreset,
  fontPresetPrompt,
  fontPresets,
  localizeFontPreset,
  normalizeFontPresetId,
} from "./catalog/font-presets.js";
import {
  LAUNCHER_INTENTS,
  migrateLauncherWorkspace,
  resolveEffectiveDecisions,
  updateIntentDraft,
  validateReadiness,
} from "./launcher-state.mjs";
import {
  CASE_PICKER,
  openCasePickerUrl,
  parseCasePickerUrl,
  replaceCasePickerFiltersUrl,
  selectCaseUrl,
} from "./launcher-url.mjs";

const STORAGE_PREFIX = "image2-ui-launcher:v2:";
const LEGACY_STORAGE_KEY = "image2-ui-launcher";
const PROJECT_STORAGE_KEY = "image2-ui-current-project";
const PRESET_KEY = "image2-ui-preset";
const UPLOAD_DB = "image2-ui-launcher-assets";
const UPLOAD_STORE = "uploads";
const UPLOAD_DB_VERSION = 1;
const FONT_LOAD_TIMEOUT_MS = 10000;
const FONT_PREVIEW_TEXT = "Aa字体Interface24界面样张NorthstarQ3PRODUCTLAUNCH让每一次交付都清晰可控团队正在推进新版工作台从计划评审到发布同一条路径中本周完成待评审预计节省查看任务打开报告";
const VALID_INTENTS = new Set(LAUNCHER_INTENTS);
const CASE_IDS = new Set(styleGuides.map((guide) => guide.id));
const STYLE_IDS = new Set(styleProfiles.map((profile) => profile.id).concat("dense-tool"));
const URL_CATALOG = { caseIds: CASE_IDS, styleIds: STYLE_IDS };

const form = document.querySelector("#launcherForm");
const intentForm = document.querySelector("#intentForm");
const modeTabs = document.querySelector("#modeTabs");
const styleDirectionGrid = document.querySelector("#styleDirectionGrid");
const colorThemeGrid = document.querySelector("#colorThemeGrid");
const colorThemeTitle = document.querySelector("#colorThemeTitle");
const colorThemeIntro = document.querySelector("#colorThemeIntro");
const pageTitle = document.querySelector("#pageTitle");
const pageIntro = document.querySelector("#pageIntro");
const pageKicker = document.querySelector("#pageKicker");
const promptKicker = document.querySelector("#promptKicker");
const promptOutput = document.querySelector("#promptOutput");
const promptEditState = document.querySelector("#promptEditState");
const promptSyncNotice = document.querySelector("#promptSyncNotice");
const applyGeneratedPrompt = document.querySelector("#applyGeneratedPrompt");
const taskSummary = document.querySelector("#taskSummary");
const missingState = document.querySelector("#missingState");
const summaryProgress = document.querySelector("#summaryProgress");
const readyState = document.querySelector("#readyState");
const generatePrompt = document.querySelector("#generatePrompt");
const generatePromptWrap = document.querySelector("#generatePromptWrap");
const copyPrompt = document.querySelector("#copyPrompt");
const savePreset = document.querySelector("#savePreset");
const toast = document.querySelector("#toast");
const casePicker = document.querySelector("#casePicker");
const caseGrid = document.querySelector("#caseGrid");
const caseEmpty = document.querySelector("#caseEmpty");
const caseSearch = document.querySelector("#caseSearch");
const caseStyleFilters = document.querySelector("#caseStyleFilters");
const caseCategoryFilters = document.querySelector("#caseCategoryFilters");
const closeCasePicker = document.querySelector("#closeCasePicker");
const assistantToggle = document.querySelector("#assistantToggle");
const assistantPanel = document.querySelector("#assistantPanel");
const assistantClose = document.querySelector("#assistantClose");
const assistantContent = document.querySelector("#assistantContent");

let persistTimer = 0;
let toastTimer = 0;
let filterTimer = 0;
let fontWarmTimer = 0;
let projectProgressSignature = "";
let suppressProjectRefresh = false;
let lastPickerTrigger = null;
let storageWarningShown = false;
const uploadUrls = new Map();
const fontStylesheetStates = new Map();

function language() {
  return window.image2I18n?.language === "en" ? "en" : "zh";
}

function tr(zh, en) {
  return language() === "en" ? en : zh;
}

function caseCategoryLabel(value) {
  const labels = {
    culture: tr("文化内容", "Culture"),
    commerce: tr("零售电商", "Commerce"),
    editorial: tr("内容与编辑", "Editorial"),
    travel: tr("旅行体验", "Travel"),
    creative: tr("创意工具", "Creative"),
    wellness: tr("生活方式", "Lifestyle"),
  };
  return labels[value] || value || tr("未分类", "Uncategorized");
}

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/[&<>'"]/g, function (character) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character];
  });
}

function track(event, payload) {
  window.image2Analytics?.track?.(event, payload || {});
}

function currentProject() {
  return window.image2Project?.read?.() || {};
}

function projectId(project) {
  return String(project.projectId || "default-project");
}

function storageKey(id) {
  return STORAGE_PREFIX + id;
}

function readSavedWorkspace(project) {
  let raw = null;
  try {
    raw = JSON.parse(localStorage.getItem(storageKey(projectId(project))) || "null");
    if (!raw) raw = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) || "null");
  } catch {
    raw = null;
  }
  return raw;
}

function urlIntent() {
  const value = new URL(window.location.href).searchParams.get("intent");
  return VALID_INTENTS.has(value) ? value : null;
}

const initialProject = currentProject();
const savedWorkspace = readSavedWorkspace(initialProject);
let workspace = migrateLauncherWorkspace(savedWorkspace, {
  projectId: projectId(initialProject),
  activeIntent: urlIntent() || savedWorkspace?.activeIntent || savedWorkspace?.intent || "create",
  contract: initialProject,
});

function activeIntent() {
  return workspace.activeIntent;
}

function activeDraft() {
  return workspace.intents[activeIntent()];
}

function activeFields() {
  return activeDraft().fields;
}

function guideById(id) {
  const normalized = normalizeCaseId(id);
  return styleGuides.find((guide) => guide.id === normalized) || null;
}

function localizedGuide(id) {
  return localizeCase(guideById(id), language());
}

function profileById(id) {
  return styleProfiles.find((profile) => profile.id === id) || null;
}

function localizedProfile(profile) {
  if (!profile || language() !== "en" || !profile.locales?.en) return profile;
  return { ...profile, ...profile.locales.en };
}

function referenceForGuide(guide) {
  return {
    mode: "case",
    caseId: guide.id,
    caseName: guide.name,
    caseStyle: guide.style,
    caseImage: caseThumbnail(guide),
  };
}

function applyInitialUrlPreset() {
  const url = new URL(window.location.href);
  const source = url.searchParams.get("source");
  const guide = guideById(url.searchParams.get("case"));
  const patch = { overrides: {} };
  if (source === "library") {
    patch.overrides.reference = guide ? referenceForGuide(guide) : { mode: "case" };
    if (guide?.styleProfileIds?.[0]) {
      Object.assign(patch.overrides, styleOverridesForChoice(guide.styleProfileIds[0]));
    }
  }
  if (Object.keys(patch.overrides).length) {
    workspace = updateIntentDraft(workspace, activeIntent(), patch);
  }
}

applyInitialUrlPreset();

function saveWorkspaceNow() {
  window.clearTimeout(persistTimer);
  persistTimer = 0;
  try {
    localStorage.setItem(storageKey(workspace.projectId), JSON.stringify(workspace));
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    if (!storageWarningShown) {
      storageWarningShown = true;
      showToast(tr("浏览器存储不可用，草稿只能保留在当前页面。", "Browser storage is unavailable; this draft will only remain on this page."));
    }
  }
}

function scheduleWorkspaceSave() {
  window.clearTimeout(persistTimer);
  persistTimer = window.setTimeout(saveWorkspaceNow, 180);
}

function updateDraft(patch, options) {
  workspace = updateIntentDraft(workspace, activeIntent(), patch);
  if (options?.immediate) saveWorkspaceNow();
  else scheduleWorkspaceSave();
}

function scalarOverrideFromField(name, previous) {
  const field = intentForm.querySelector('[name="' + name + '"]');
  if (!field) return previous;
  const contractKey = name === "format" ? "format" : "system";
  return workspace.contract[contractKey] === field.value
    ? { mode: "inherit" }
    : { mode: "override", value: field.value };
}

function splitPages(value) {
  return String(value || "").split(/[、,，;\n]+/).map((item) => item.trim()).filter(Boolean);
}

function captureFieldsFromDom() {
  const fields = { ...activeFields() };
  Object.keys(fields).forEach(function (name) {
    const controls = Array.from(intentForm.querySelectorAll('[name="' + name + '"]'));
    if (!controls.length) return;
    if (name === "requiredPages") {
      fields[name] = splitPages(controls[0].value);
      return;
    }
    if (Array.isArray(fields[name])) {
      fields[name] = controls.filter((control) => control.checked).map((control) => control.value);
      return;
    }
    if (controls[0].type === "radio") {
      fields[name] = controls.find((control) => control.checked)?.value || fields[name];
      return;
    }
    if (controls[0].type === "checkbox") {
      fields[name] = controls[0].checked ? "true" : "false";
      return;
    }
    fields[name] = controls[0].value;
  });
  return fields;
}

function captureFormState(options) {
  const overrides = activeDraft().overrides;
  updateDraft({
    fields: captureFieldsFromDom(),
    overrides: {
      format: scalarOverrideFromField("format", overrides.format),
      system: scalarOverrideFromField("designSystem", overrides.system),
    },
  }, options);
}

function checked(value, expected) {
  return value === expected ? " checked" : "";
}

function selected(value, expected) {
  return value === expected ? " selected" : "";
}

function sectionMarkup(id, title, intro, body, action) {
  return '<section class="config-section" aria-labelledby="' + id + '">' +
    '<div class="section-heading"><div><h2 id="' + id + '">' + escapeHtml(title) + '</h2><p>' + escapeHtml(intro) +
    '</p></div>' + (action || "") + '</div>' + body + '</section>';
}

function textField(name, label, value, placeholder, multiline) {
  const tag = multiline
    ? '<textarea name="' + name + '" placeholder="' + escapeHtml(placeholder) + '">' + escapeHtml(value) + '</textarea>'
    : '<input name="' + name + '" value="' + escapeHtml(value) + '" placeholder="' + escapeHtml(placeholder) + '">';
  return '<label class="text-field"><span>' + escapeHtml(label) + '</span>' + tag + '</label>';
}

function selectField(name, labelText, value, options) {
  return '<label class="select-field"><span>' + escapeHtml(labelText) + '</span><select name="' + name + '">' +
    options.map(function (option) {
      if (Array.isArray(option.options)) {
        return '<optgroup label="' + escapeHtml(option.groupLabel) + '">' + option.options.map(function (child) {
          return '<option value="' + escapeHtml(child.value) + '"' + selected(value, child.value) + '>' + escapeHtml(child.label) + '</option>';
        }).join("") + '</optgroup>';
      }
      return '<option value="' + escapeHtml(option.value) + '"' + selected(value, option.value) + '>' + escapeHtml(option.label) + '</option>';
    }).join("") + '</select></label>';
}

function radioCards(name, value, options, className) {
  return '<div class="choice-grid ' + (className || "") + '">' + options.map(function (option) {
    return '<label><input type="radio" name="' + name + '" value="' + escapeHtml(option.value) + '"' + checked(value, option.value) +
      '><strong>' + escapeHtml(option.label) + '</strong><small>' + escapeHtml(option.detail) + '</small></label>';
  }).join("") + '</div>';
}

function checkCards(name, values, options, className) {
  return '<div class="choice-grid ' + (className || "") + '">' + options.map(function (option) {
    return '<label><input type="checkbox" name="' + name + '" value="' + escapeHtml(option.value) + '"' +
      (values.includes(option.value) ? " checked" : "") + '><strong>' + escapeHtml(option.label) +
      '</strong><small>' + escapeHtml(option.detail) + '</small></label>';
  }).join("") + '</div>';
}

function currentDecisionOptions(kind, fieldName) {
  const decision = resolveEffectiveDecisions(workspace, activeIntent(), { locale: language() })[kind];
  const options = kind === "format"
    ? [
        { value: "web", label: tr("响应式网页", "Responsive web") },
        { value: "mobile", label: tr("手机 App", "Mobile app") },
        { value: "dashboard", label: tr("产品后台", "Product dashboard") },
        { value: "desktop", label: tr("桌面应用", "Desktop app") },
      ]
    : [
        {
          groupLabel: tr("推荐", "Recommended"),
          options: [{ value: "auto", label: tr("自动推荐", "Auto-recommend") }],
        },
        {
          groupLabel: tr("设计系统目录（" + brandProfiles.length + " 套）", "Design-system catalog (" + brandProfiles.length + ")"),
          options: designSystemOptions(brandProfiles, language()).map(function (option) {
            return { value: option.value, label: option.optionLabel };
          }),
        },
        {
          groupLabel: tr("其他", "Other"),
          options: [{ value: "custom", label: tr("自定义", "Custom") }],
        },
      ];
  const override = activeDraft().overrides[kind];
  const value = override?.mode === "override" ? override.value : decision.value;
  const label = kind === "format"
    ? tr("交付形式", "Deliverable")
    : tr("设计系统（" + brandProfiles.length + " 套）", "Design system (" + brandProfiles.length + ")");
  return selectField(fieldName, label, value, options);
}

function tokenFoundationMarkup(decisions) {
  const items = [
    { label: tr("密度", "Density"), decision: decisions.density },
    { label: tr("间距", "Spacing"), decision: decisions.spacingBase },
  ];
  return '<div class="token-foundation-block">' +
    '<div class="token-foundation-heading"><h3>' + tr("基础参数", "Foundations") + '</h3></div>' +
    '<dl class="token-foundation">' + items.map(function (item) {
      return '<div><dt>' + escapeHtml(item.label) + '</dt><dd><strong>' + escapeHtml(item.decision.label) + '</strong></dd></div>';
    }).join("") + '</dl></div>';
}

function fontFamilyPair(preset) {
  return preset.sources.map(function (source) { return source.family; }).join(" + ");
}

function fontSourceLinksMarkup(preset) {
  return preset.sources.map(function (source) {
    return '<a href="' + escapeHtml(source.sourceUrl) + '" target="_blank" rel="noopener noreferrer">' +
      escapeHtml(source.family) + '<span aria-hidden="true"> ↗</span></a>';
  }).join('<span aria-hidden="true">·</span>');
}

function fontPresetMarkup(decision) {
  const selectedPreset = findFontPreset(decision.value);
  const selectedLocalized = localizeFontPreset(selectedPreset, language());
  const cards = fontPresets.map(function (preset) {
    const localized = localizeFontPreset(preset, language());
    const isSelected = preset.id === selectedPreset.id;
    const displayWeight = preset.roles.display.weights[preset.roles.display.weights.length - 1] || 700;
    const bodyWeight = preset.roles.body.weights[0] || 400;
    const bodyStrongWeight = preset.roles.body.weights[preset.roles.body.weights.length - 1] || 600;
    return '<label class="font-preset-card' + (isSelected ? ' is-selected' : '') + '" style="--preview-heading-font:' +
      escapeHtml(preset.roles.display.fontFamily) + ';--preview-body-font:' + escapeHtml(preset.roles.body.fontFamily) +
      ';--preview-heading-weight:' + displayWeight + ';--preview-body-weight:' + bodyWeight + ';--preview-body-strong-weight:' + bodyStrongWeight + '">' +
      '<input type="radio" name="fontScheme" value="' + escapeHtml(preset.id) + '"' + (isSelected ? ' checked' : '') + '>' +
      '<span class="font-preset-choice" aria-hidden="true"></span><span class="font-preset-sample" aria-hidden="true"><strong>Aa 字体</strong><small>Interface 24 / 界面样张</small></span>' +
      '<span class="font-preset-copy"><strong>' + escapeHtml(localized.name) + '</strong><small>' +
      escapeHtml(fontFamilyPair(preset)) + '</small></span></label>';
  }).join("");
  return '<section class="font-workbench" aria-labelledby="fontPresetTitle">' +
    '<div class="font-workbench-heading"><div><h3 id="fontPresetTitle">' + tr("字体方案", "Typography") + '</h3><p id="fontPresetDescription">' +
    escapeHtml(selectedLocalized.description) + '</p></div><span class="font-source-status" id="fontLoadState" data-font-preset="' +
    escapeHtml(selectedPreset.id) + '" aria-live="polite"></span></div>' +
    '<div class="font-preset-grid" role="radiogroup" aria-label="' + tr("字体方案", "Typography presets") + '">' + cards + '</div>' +
    '<article class="font-preview-shell" aria-label="' + tr("字体页面样张", "Typography page specimen") + '"><header class="font-preview-toolbar"><span><strong id="fontPreviewName">' +
    escapeHtml(selectedLocalized.name) + '</strong> · <span id="fontPreviewPair">' + escapeHtml(fontFamilyPair(selectedPreset)) +
    '</span></span><span class="font-preview-sources" id="fontPreviewSources">' + fontSourceLinksMarkup(selectedPreset) + '</span></header>' +
    '<div class="font-preview-page" data-font-preview aria-hidden="true"><header class="font-preview-nav"><strong class="font-preview-brand">Northstar</strong><nav class="font-preview-nav-items" aria-label="' +
    tr("样张导航", "Specimen navigation") + '"><span>' + tr("项目", "Projects") + '</span><span>' + tr("团队", "Team") + '</span><span>' +
    tr("报告", "Reports") + '</span></nav></header><div class="font-preview-content"><p class="font-preview-eyebrow">Q3 PRODUCT LAUNCH</p><h4 class="font-preview-title">' +
    tr("让每一次交付都清晰可控", "Make every delivery clear") + '</h4><p class="font-preview-lede">' +
    tr("团队正在推进新版工作台，从计划、评审到发布都在同一条清晰路径中。", "The team is moving the new workspace from planning through review and release on one clear path.") +
    '</p><div class="font-preview-metrics"><div class="font-preview-metric"><strong>84%</strong><small>' + tr("本周完成", "Completed") +
    '</small></div><div class="font-preview-metric"><strong>12</strong><small>' + tr("待评审", "In review") +
    '</small></div><div class="font-preview-metric"><strong>18.5h</strong><small>' + tr("预计节省", "Time saved") +
    '</small></div></div><div class="font-preview-actions"><span class="font-preview-primary">' + tr("查看任务", "View tasks") +
    '</span><span class="font-preview-secondary">' + tr("打开报告", "Open report") + '</span></div></div></div></article></section>';
}

function fontLoadLabel(preset, status) {
  if (!preset.remoteCssUrl) return tr("本机字体", "Local fonts");
  if (status === "loaded") return tr("外部字体已加载", "Web fonts loaded");
  if (status === "failed") return tr("已使用系统回退", "Using system fallback");
  return tr("字体加载中", "Loading fonts");
}

function updateFontLoadIndicator(preset, status) {
  const indicator = intentForm.querySelector("#fontLoadState");
  if (!indicator || indicator.dataset.fontPreset !== preset.id) return;
  indicator.dataset.state = status;
  indicator.classList.toggle("is-loading", status === "loading");
  indicator.classList.toggle("is-ready", status === "loaded" || status === "system");
  indicator.classList.toggle("is-fallback", status === "failed");
  indicator.textContent = fontLoadLabel(preset, status);
}

function fontPreviewCssUrl(preset) {
  const url = new URL(preset.remoteCssUrl);
  url.searchParams.set("text", FONT_PREVIEW_TEXT);
  return url.href;
}

function ensureFontPresetLoaded(preset) {
  if (!preset.remoteCssUrl) {
    updateFontLoadIndicator(preset, "system");
    return;
  }
  const existing = fontStylesheetStates.get(preset.id);
  if (existing) {
    if (existing.status === "failed") {
      existing.link.remove();
      fontStylesheetStates.delete(preset.id);
    } else {
      updateFontLoadIndicator(preset, existing.status);
      return;
    }
  }
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = fontPreviewCssUrl(preset);
  link.dataset.fontPreset = preset.id;
  fontStylesheetStates.set(preset.id, { link, status: "loading" });
  updateFontLoadIndicator(preset, "loading");
  let settled = false;
  const finish = function (status) {
    if (settled) return;
    settled = true;
    window.clearTimeout(timeout);
    if (status === "failed") link.remove();
    fontStylesheetStates.set(preset.id, { link, status });
    updateFontLoadIndicator(preset, status);
  };
  const timeout = window.setTimeout(function () { finish("failed"); }, FONT_LOAD_TIMEOUT_MS);
  link.addEventListener("load", function () {
    const fontLoads = document.fonts?.load
      ? preset.sources.map(function (source) {
          const sample = /Noto/.test(source.family) ? "界面样张" : "Northstar";
          return document.fonts.load('600 24px "' + source.family.replace(/"/g, "") + '"', sample);
        })
      : [];
    Promise.all(fontLoads).then(function (results) {
      finish(results.some(function (faces) { return faces.length === 0; }) ? "failed" : "loaded");
    }).catch(function () { finish("failed"); });
  });
  link.addEventListener("error", function () { finish("failed"); });
  document.head.append(link);
}

function warmFontPresetSamples() {
  window.clearTimeout(fontWarmTimer);
  fontWarmTimer = window.setTimeout(function () {
    fontPresets.filter(function (preset) { return preset.remoteCssUrl; }).forEach(ensureFontPresetLoaded);
  }, 120);
}

function syncFontPresetUi(value) {
  const preset = findFontPreset(value);
  const localized = localizeFontPreset(preset, language());
  intentForm.querySelectorAll(".font-preset-card").forEach(function (card) {
    const radio = card.querySelector('input[name="fontScheme"]');
    const selectedPreset = radio?.value === preset.id;
    card.classList.toggle("is-selected", selectedPreset);
    if (radio) radio.checked = selectedPreset;
  });
  const preview = intentForm.querySelector("[data-font-preview]");
  if (!preview) return;
  preview.style.setProperty("--preview-heading-font", preset.roles.display.fontFamily);
  preview.style.setProperty("--preview-body-font", preset.roles.body.fontFamily);
  preview.style.setProperty("--preview-heading-weight", preset.roles.display.weights[preset.roles.display.weights.length - 1] || 700);
  preview.style.setProperty("--preview-body-weight", preset.roles.body.weights[0] || 400);
  preview.style.setProperty("--preview-body-strong-weight", preset.roles.body.weights[preset.roles.body.weights.length - 1] || 600);
  const name = intentForm.querySelector("#fontPreviewName");
  const pair = intentForm.querySelector("#fontPreviewPair");
  const sources = intentForm.querySelector("#fontPreviewSources");
  const indicator = intentForm.querySelector("#fontLoadState");
  const description = intentForm.querySelector("#fontPresetDescription");
  if (name) name.textContent = localized.name;
  if (pair) pair.textContent = fontFamilyPair(preset);
  if (sources) sources.innerHTML = fontSourceLinksMarkup(preset);
  if (indicator) indicator.dataset.fontPreset = preset.id;
  if (description) description.textContent = localized.description;
  ensureFontPresetLoaded(preset);
  warmFontPresetSamples();
}

function applyFontPresetChoice(value) {
  const fontPreset = normalizeFontPresetId(value);
  const inherited = workspace.contract.fontScheme === fontPreset;
  updateDraft({
    overrides: {
      fontScheme: inherited ? { mode: "inherit" } : { mode: "override", value: fontPreset },
    },
  });
  syncFontPresetUi(fontPreset);
  updateOutput();
  track("launcher_font_preset_change", { fontPreset, intent: activeIntent() });
}

function decisionSection(extra) {
  const decisions = resolveEffectiveDecisions(workspace, activeIntent(), { locale: language() });
  const body = '<div class="decision-controls">' + currentDecisionOptions("format", "format") +
    currentDecisionOptions("system", "designSystem") + '</div>' +
    tokenFoundationMarkup(decisions) + fontPresetMarkup(decisions.fontScheme) + (extra || "");
  return sectionMarkup("decisionsTitle", tr("交付与实现约束", "Delivery and implementation"), tr("选择本次任务的交付形式与实现约束。", "Choose the deliverable and implementation constraints for this task."), body);
}

function referenceMode() {
  const mode = activeDraft().overrides.reference?.mode;
  if (["case", "upload", "none"].includes(mode)) return mode;
  return activeIntent() === "rebuild" ? "case" : "none";
}

function referenceSourceMarkup() {
  const mode = referenceMode();
  const options = [
    { value: "case", label: tr("案例库", "Case library"), detail: tr("从完整案例网格选择", "Choose from the full grid") },
    { value: "upload", label: tr("本地图片", "Local image"), detail: tr("上传参考图", "Upload a reference") },
    { value: "none", label: tr("不使用参考", "No reference"), detail: tr("明确跳过此步骤", "Explicitly skip this step") },
  ];
  return radioCards("referenceSource", mode, options, "reference-source");
}

function referenceContentMarkup() {
  const override = activeDraft().overrides.reference || { mode: referenceMode() };
  if (override.mode === "none") {
    return '<p class="reference-empty is-skipped">' + tr("本次任务明确不使用参考，进度中会显示“已跳过”。", "This task explicitly uses no reference; progress will show “Skipped”.") + '</p>';
  }
  if (override.mode === "case") {
    const guide = localizedGuide(override.caseId);
    if (guide) return selectedCaseMarkup(guide, tr("本次参考", "Task reference"), true);
    return '<div class="reference-empty"><p>' + tr("尚未选择案例。", "No case selected yet.") +
      '</p><button class="inline-primary-button" type="button" data-open-case-picker>' + tr("打开案例选择器", "Open case picker") + '</button></div>';
  }
  const uploadUrl = uploadUrls.get(activeIntent());
  if (override.mode === "upload" && uploadUrl) {
    return '<div class="upload-preview"><img src="' + escapeHtml(uploadUrl) + '" alt=""><div><strong>' +
      escapeHtml(override.fileName || tr("本地参考图", "Local reference")) + '</strong><small>' +
      tr("已随此模式草稿保存", "Saved with this intent draft") + '</small></div><button type="button" data-remove-upload>' +
      tr("移除", "Remove") + '</button></div>';
  }
  return '<label class="upload-zone"><input type="file" name="referenceFile" accept="image/*"><span aria-hidden="true">+</span><strong>' +
    tr("选择参考图片", "Choose a reference image") + '</strong><small>' +
    tr("图片会保存在此浏览器中，刷新后可恢复", "The image is stored in this browser and restored after refresh") + '</small></label>';
}

function selectedCaseMarkup(guide, eyebrow, canChange) {
  const facts = [
    [tr("适用场景", "Best for"), guide.bestFor],
    [tr("配色", "Palette"), guide.palette],
    [tr("布局", "Layout"), guide.layout],
  ].filter(function (entry) { return entry[1]; });
  const tags = (guide.tags || []).map(function (tag) { return '<li>' + escapeHtml(tag) + '</li>'; }).join("");
  return '<article class="selected-case"><figure class="selected-case-media"><img src="' +
    escapeHtml(caseOverviewImage(guide)) + '" alt="' + escapeHtml(guide.name + tr(" 案例总览", " case overview")) +
    '"></figure><div class="selected-case-content"><header class="selected-case-heading"><small>' +
    escapeHtml(eyebrow + " · " + caseCategoryLabel(guide.category)) + '</small><h3>' + escapeHtml(guide.name) +
    '</h3><span>' + escapeHtml(guide.style || "") + '</span></header><p class="selected-case-summary">' +
    escapeHtml(guide.summary || guide.bestFor || "") + '</p><dl class="selected-case-facts">' + facts.map(function (entry) {
      return '<div><dt>' + escapeHtml(entry[0]) + '</dt><dd>' + escapeHtml(entry[1]) + '</dd></div>';
    }).join("") + '</dl>' + (tags ? '<ul class="selected-case-tags">' + tags + '</ul>' : "") + '</div>' +
    (canChange ? '<div class="selected-case-actions"><button type="button" data-open-case-picker>' +
      tr("更换案例", "Change case") + '</button></div>' : "") + '</article>';
}

function referenceSection() {
  const body = '<fieldset class="control-group"><legend>' + tr("参考来源", "Reference source") +
    '</legend>' + referenceSourceMarkup() + '</fieldset><div class="reference-content" id="referenceContent">' +
    referenceContentMarkup() + '</div>';
  return sectionMarkup("referenceTitle", tr("参考来源", "Reference source"), tr("案例选择会同步预览、摘要、指令、URL 与草稿。", "Case selection stays synchronized across preview, summary, prompt, URL, and draft."), body);
}

function suggestionMarkup() {
  const raw = activeFields().briefSuggestion;
  if (!raw) return "";
  let suggestion;
  try { suggestion = JSON.parse(raw); } catch { return ""; }
  return '<div class="brief-suggestion" id="briefSuggestion"><div><strong>' + tr("结构建议待确认", "Structured suggestion") +
    '</strong><small>' + escapeHtml(suggestion.provider === "host" ? tr("由宿主 AI 生成", "Generated by host AI") : tr("由本地智能整理生成", "Generated by local structuring")) +
    '</small></div><dl><dt>' + tr("给谁用", "Audience") + '</dt><dd>' + escapeHtml(suggestion.audience) +
    '</dd><dt>' + tr("核心任务", "Core task") + '</dt><dd>' + escapeHtml(suggestion.coreTask) +
    '</dd><dt>' + tr("必要页面", "Required pages") + '</dt><dd>' + escapeHtml((suggestion.requiredPages || []).join(tr("、", ", "))) +
    '</dd></dl><div><button type="button" class="inline-primary-button" data-confirm-brief>' + tr("确认写入", "Apply") +
    '</button><button type="button" class="text-button" data-dismiss-brief>' + tr("取消", "Dismiss") + '</button></div></div>';
}

function renderCreate() {
  const fields = activeFields();
  const objective = '<div class="brief-seed-row">' +
    textField("brief", tr("先写一句话", "Start with one sentence"), fields.brief, tr("例如：做一个帮助独立咖啡店接单的网站", "Example: a website helping independent cafes take orders"), false) +
    '<button class="assist-brief-button" type="button" data-expand-brief>' + tr("帮我完善", "Help me expand") + '</button></div>' +
    '<div class="brief-chips" aria-label="' + tr("项目目标提示", "Project goal prompts") + '">' +
    ["咖啡店官网", "SaaS 数据后台", "课程预约 App"].map(function (label) {
      return '<button type="button" data-brief-chip="' + label + '">' + label + '</button>';
    }).join("") + '</div>' + suggestionMarkup() +
    '<div class="structured-brief">' +
    textField("audience", tr("给谁用", "Audience"), fields.audience, tr("例如：附近上班族与咖啡店店员", "Example: nearby office workers and cafe staff"), false) +
    textField("coreTask", tr("核心任务", "Core task"), fields.coreTask, tr("例如：浏览菜单、预约自取并完成付款", "Example: browse, schedule pickup, and pay"), false) +
    textField("requiredPages", tr("必要页面", "Required pages"), fields.requiredPages.join(tr("、", ", ")), tr("例如：首页、菜单、结算、订单详情", "Example: Home, Menu, Checkout, Order detail"), false) +
    '</div>';
  const depth = '<div class="decision-controls">' +
    selectField("interaction", tr("实现深度", "Implementation depth"), fields.interaction, [
      { value: "static", label: tr("静态布局", "Static layout") },
      { value: "path", label: tr("关键路径可交互", "Interactive key path") },
      { value: "complete", label: tr("完整交互", "Complete interaction") },
    ]) +
    selectField("assets", tr("图片资产", "Image assets"), fields.assets, [
      { value: "needed", label: tr("按需生成", "Generate as needed") },
      { value: "existing", label: tr("只用现有资产", "Existing assets only") },
      { value: "none", label: tr("不使用图片", "No images") },
    ]) + '</div>';
  return sectionMarkup("briefTitle", tr("定义项目目标", "Define the project goal"), tr("一句话可由助手整理，最终以三个结构字段为准。", "A short idea can be expanded; the three structured fields remain authoritative."), objective) +
    referenceSection() + decisionSection(depth);
}

function renderRebuild() {
  const fields = activeFields();
  const brief = textField("brief", tr("还原说明", "Rebuild brief"), fields.brief, tr("说明要还原的页面、重点状态与交互边界", "Describe the page, key states, and interaction boundary"), true);
  const fidelity = selectField("fidelity", tr("还原深度", "Rebuild depth"), fields.fidelity, [
    { value: "visual", label: tr("视觉与布局", "Visual and layout") },
    { value: "interactive", label: tr("视觉 + 关键交互", "Visual and key interactions") },
    { value: "production", label: tr("生产级实现", "Production implementation") },
  ]);
  return referenceSection() +
    sectionMarkup("briefTitle", tr("说明还原目标", "Describe the rebuild"), tr("写清页面范围和不能丢失的状态。", "State the page scope and essential states."), brief) +
    decisionSection('<div class="single-control">' + fidelity + '</div>');
}

function targetSection() {
  const fields = activeFields();
  const types = [
    { value: "url", label: "URL", detail: tr("已运行页面", "Running page") },
    { value: "file", label: tr("本地路径", "Local path"), detail: tr("文件或目录", "File or directory") },
    { value: "workspace", label: tr("当前工作区", "Current workspace"), detail: tr("直接检查此项目", "Inspect this project") },
  ];
  const target = '<fieldset class="control-group"><legend>' + tr("检查范围", "Inspection scope") +
    '</legend>' + radioCards("targetType", fields.targetType, types, "target-type-grid") + '</fieldset>' +
    textField("target", tr("检查对象", "Inspection target"), fields.target, tr("粘贴 URL 或输入路径", "Paste a URL or enter a path"), false);
  return sectionMarkup("targetTitle", tr("指定检查对象", "Choose the inspection target"), tr("当前工作区模式不会要求额外路径。", "Current workspace mode does not require a separate path."), target);
}

function focusSection() {
  const fields = activeFields();
  const all = fields.reviewAll === "true";
  const options = activeIntent() === "improve"
    ? [
        { value: "clarity", label: tr("信息清晰度", "Information clarity"), detail: tr("层级与文案", "Hierarchy and copy") },
        { value: "visual", label: tr("视觉质量", "Visual quality"), detail: tr("排版、色彩与密度", "Type, color, density") },
        { value: "interaction", label: tr("交互体验", "Interaction"), detail: tr("状态与反馈", "States and feedback") },
        { value: "accessibility", label: tr("可访问性", "Accessibility"), detail: tr("键盘与读屏", "Keyboard and screen reader") },
      ]
    : [
        { value: "architecture", label: tr("代码架构", "Architecture"), detail: tr("模块与依赖", "Modules and dependencies") },
        { value: "interaction", label: tr("页面与交互", "Page and interaction"), detail: tr("流程、状态与反馈", "Flows, states, feedback") },
        { value: "tokens", label: "Design Tokens", detail: tr("视觉基础与一致性", "Foundations and consistency") },
        { value: "tests", label: tr("测试缺口", "Test gaps"), detail: tr("风险与验证", "Risk and verification") },
      ];
  return sectionMarkup("focusTitle", tr("选择检查重点", "Choose review focus"), tr("“全面检查”是独立互斥开关，开启后其他重点不会参与指令。", "Full review is an exclusive switch; other focus areas are disabled while it is on."),
    '<label class="full-review-switch"><span><strong>' + tr("全面检查", "Full review") + '</strong><small>' +
    tr("覆盖架构、视觉、交互、可访问性与测试", "Cover architecture, visuals, interactions, accessibility, and tests") +
    '</small></span><input type="checkbox" name="reviewAll"' + (all ? " checked" : "") + ' role="switch"></label>' +
    '<fieldset class="control-group focus-options' + (all ? " is-disabled" : "") + '"><legend>' +
    tr("自定义重点", "Custom focus") + '</legend>' + checkCards("focus", fields.focus, options, "focus-grid") + '</fieldset>');
}

function renderExplore() {
  const fields = activeFields();
  const permission = selectField("permission", tr("操作权限", "Permission"), fields.permission, [
    { value: "readonly", label: tr("只读检查", "Read-only inspection") },
    { value: "suggest", label: tr("只给建议", "Suggestions only") },
    { value: "implement", label: tr("允许实施并验证", "Implement and verify") },
  ]);
  return targetSection() + focusSection() + sectionMarkup("permissionTitle", tr("设定输出边界", "Set the output boundary"), tr("明确是否允许修改文件。", "Explicitly choose whether file edits are allowed."), permission);
}

function renderImprove() {
  const fields = activeFields();
  const goal = textField("improveGoal", tr("优化目标", "Improvement goal"), fields.improveGoal, tr("例如：减少首屏噪音并提高表格扫描效率", "Example: reduce first-screen noise and improve table scanning"), true);
  const permission = selectField("permission", tr("操作权限", "Permission"), fields.permission, [
    { value: "suggest", label: tr("只给建议", "Suggestions only") },
    { value: "implement", label: tr("检查后直接实施", "Implement after review") },
  ]);
  return targetSection() +
    sectionMarkup("improveGoalTitle", tr("明确优化目标", "Define the improvement goal"), tr("用可验证的结果描述改进方向。", "Describe the intended result in verifiable terms."), goal) +
    focusSection() + decisionSection('<div class="single-control">' + permission + '</div>');
}

function renderDesignSystem() {
  const fields = activeFields();
  const systems = designSystemOptions(brandProfiles, language()).map(function (option) {
    return {
      value: option.value,
      label: option.label,
      detail: option.organization && option.detail
        ? option.organization + " · " + option.detail
        : option.detail || option.organization,
    };
  });
  const goal = textField("brief", tr("界面目标", "Interface goal"), fields.brief, tr("描述要比较的页面、用户和关键动作", "Describe the page, users, and key actions"), true);
  const output = selectField("systemOutput", tr("输出方式", "Output"), fields.systemOutput, [
    { value: "comparison", label: tr("对比与推荐", "Comparison and recommendation") },
    { value: "prototypes", label: tr("并列原型", "Side-by-side prototypes") },
    { value: "migration", label: tr("迁移方案", "Migration plan") },
  ]);
  return sectionMarkup("briefTitle", tr("定义比较目标", "Define the comparison goal"), tr("所有系统使用相同内容与动作，确保公平比较。", "Use identical content and actions for a fair comparison."), goal) +
    sectionMarkup("systemsTitle", tr("选择设计系统", "Choose design systems"), tr("至少选择两套。", "Choose at least two."), checkCards("systems", fields.systems, systems, "systems-grid")) +
    sectionMarkup("systemOutputTitle", tr("选择输出方式", "Choose the output"), tr("决定比较的深度与交付物。", "Choose the comparison depth and deliverable."), output);
}

const renderers = {
  create: renderCreate,
  rebuild: renderRebuild,
  improve: renderImprove,
  explore: renderExplore,
  "design-system": renderDesignSystem,
};

const intentCopy = {
  create: {
    zh: ["从零创建界面", "先确定风格，再把一句想法整理成可执行的结构化任务。"],
    en: ["Create an interface", "Choose a style, then turn a short idea into an executable structured task."],
  },
  rebuild: {
    zh: ["参考案例还原", "在工作区内选择案例或上传图片，表单不会因打开案例库而丢失。"],
    en: ["Rebuild from a reference", "Choose a case or upload an image without leaving or losing the form."],
  },
  improve: {
    zh: ["优化现有页面", "明确对象、目标与权限，生成有边界的检查和实施指令。"],
    en: ["Improve an existing page", "Define the target, outcome, and permission boundary."],
  },
  explore: {
    zh: ["探索现有项目", "选择检查范围和重点，生成只读或有限权限的探索指令。"],
    en: ["Explore an existing project", "Choose scope and focus for a bounded exploration prompt."],
  },
  "design-system": {
    zh: ["比较设计系统", "用同一目标公平比较多套系统的适配与迁移成本。"],
    en: ["Compare design systems", "Compare system fit and migration cost against one shared goal."],
  },
};

function syncDynamicControls() {
  const target = intentForm.querySelector('[name="target"]');
  const targetType = intentForm.querySelector('[name="targetType"]:checked')?.value;
  if (target) {
    target.disabled = targetType === "workspace";
    target.closest(".text-field")?.classList.toggle("is-disabled", target.disabled);
  }
  const reviewAll = intentForm.querySelector('[name="reviewAll"]')?.checked;
  const focusGroup = intentForm.querySelector(".focus-options");
  focusGroup?.classList.toggle("is-disabled", Boolean(reviewAll));
  intentForm.querySelectorAll('[name="focus"]').forEach(function (control) {
    control.disabled = Boolean(reviewAll);
  });
}

function renderIntent() {
  const copy = intentCopy[activeIntent()][language()];
  pageTitle.textContent = copy[0];
  pageIntro.textContent = copy[1];
  pageKicker.textContent = tr("单一任务工作区", "Single task workspace");
  promptKicker.textContent = tr("CODEX 指令准备", "CODEX prompt readiness");
  intentForm.innerHTML = renderers[activeIntent()]();
  intentForm.dataset.intent = activeIntent();
  intentForm.setAttribute("aria-labelledby", "tab-" + activeIntent());
  modeTabs.querySelectorAll("[data-intent]").forEach(function (button) {
    const selectedIntent = button.dataset.intent === activeIntent();
    button.setAttribute("aria-selected", String(selectedIntent));
    button.tabIndex = selectedIntent ? 0 : -1;
  });
  syncDynamicControls();
  syncFontPresetUi(resolveEffectiveDecisions(workspace, activeIntent(), { locale: language() }).fontScheme.value);
}

function styleCardDefinitions() {
  const cards = styleProfiles.map(function (source) {
    const profile = localizedProfile(source);
    const guide = localizedGuide(stylePreviewCaseIds[source.id] || source.previewCaseId);
    return {
      id: source.id,
      label: profile.name,
      detail: profile.summary || (profile.styles || []).join(" / "),
      example: guide?.name || "",
      image: caseOverviewImage(guide),
      density: source.densityDefault,
      spacingBase: source.tokenFoundation?.spacingBase,
      fontScheme: source.tokenFoundation?.fontScheme,
    };
  });
  const denseGuide = localizedGuide(stylePreviewCaseIds["dense-tool"]) || localizeCase(styleGuides[0], language());
  cards.push({
    id: "dense-tool",
    label: tr("高密度工具型", "High-density tool"),
    detail: tr("紧凑信息、快速扫描、重复操作", "Compact information, scanning, and repeated actions"),
    example: denseGuide?.name || "",
    image: caseOverviewImage(denseGuide),
    density: "compact",
    spacingBase: "4pt",
    fontScheme: "system-cjk",
  });
  return cards;
}

function renderStyleCards() {
  const decision = resolveEffectiveDecisions(workspace, activeIntent(), { locale: language() }).style;
  styleDirectionGrid.innerHTML = styleCardDefinitions().map(function (card) {
    const selectedCard = decision.value === card.id;
    return '<label class="style-card' + (selectedCard ? " is-selected" : "") + '">' +
      '<input type="radio" name="styleDirection" value="' + escapeHtml(card.id) + '"' + (selectedCard ? " checked" : "") + '>' +
      '<span class="style-card-media"><img src="' + escapeHtml(card.image) + '" alt="' +
      escapeHtml(card.example + tr(" 案例预览", " case preview")) + '"></span>' +
      '<span class="style-card-copy"><span class="style-card-example">' + escapeHtml(tr("案例 · ", "Case · ") + card.example) +
      '</span><strong>' + escapeHtml(card.label) + '</strong><small>' + escapeHtml(card.detail) + '</small></span>' +
      '<span class="selection-check" aria-hidden="true">✓</span></label>';
  }).join("");
}

function styleOverridesForChoice(id) {
  const card = styleCardDefinitions().find((item) => item.id === id);
  if (!card) return {};
  const inherited = workspace.contract.style === id;
  const fontPreset = normalizeFontPresetId(card.fontScheme);
  return {
    style: inherited ? { mode: "inherit" } : { mode: "override", value: id },
    density: inherited ? { mode: "inherit" } : { mode: "override", value: card.density },
    spacingBase: inherited ? { mode: "inherit" } : { mode: "override", value: card.spacingBase },
    fontScheme: workspace.contract.fontScheme === fontPreset ? { mode: "inherit" } : { mode: "override", value: fontPreset },
  };
}

function applyStyleChoice(id) {
  const styleOverrides = styleOverridesForChoice(id);
  if (!Object.keys(styleOverrides).length) return;
  updateDraft({ overrides: styleOverrides });
  renderStyleCards();
  renderIntent();
  updateOutput();
  if (casePicker.open) {
    const next = replaceCasePickerFiltersUrl(window.location.href, { style: id }, URL_CATALOG);
    history.replaceState({ ...history.state, image2Picker: CASE_PICKER }, "", next);
    syncPickerFromUrl();
  }
}

function colorThemeVariables(theme) {
  const colors = theme.colors;
  return [
    ["canvas", colors.canvas],
    ["surface", colors.surface],
    ["ink", colors.ink],
    ["muted", colors.muted],
    ["accent", colors.accent],
    ["action-accent", colors.actionAccent],
    ["accent-soft", colors.accentSoft],
    ["border", colors.border],
    ["on-accent", colors.onAccent],
  ].map(function (entry) {
    return "--theme-" + entry[0] + ":" + entry[1];
  }).join(";");
}

function renderColorThemes() {
  const decision = resolveEffectiveDecisions(workspace, activeIntent(), { locale: language() }).colorTheme;
  colorThemeTitle.textContent = tr("选择品牌规范", "Choose a brand system");
  colorThemeIntro.textContent = tr(
    "色彩 Token 来自公开规范；选择后会同步对应设计系统，避免组件与颜色混用。",
    "Color tokens follow public guidelines; selection also syncs the matching design system.",
  );
  colorThemeGrid.setAttribute("aria-label", tr("品牌设计规范", "Brand design system"));
  colorThemeGrid.innerHTML = colorThemes.map(function (theme) {
    const localized = localizeColorTheme(theme, language());
    const selected = decision.value === theme.id;
    return '<article class="color-theme-card' + (selected ? " is-selected" : "") + '" style="' +
      escapeHtml(colorThemeVariables(theme)) + '"><label class="color-theme-choice">' +
      '<input type="radio" name="colorTheme" value="' + escapeHtml(theme.id) + '"' + (selected ? " checked" : "") + '>' +
      '<span class="color-theme-palette" aria-hidden="true">' +
      '<i class="theme-swatch-canvas"></i><i class="theme-swatch-surface"></i><i class="theme-swatch-accent"></i>' +
      '<i class="theme-swatch-accent-soft"></i><i class="theme-swatch-ink"></i></span>' +
      '<span class="color-theme-copy"><strong>' + escapeHtml(localized.name) + '</strong>' +
      '<span class="color-theme-meta"><span>' + escapeHtml(theme.organization) + '</span></span><small>' +
      escapeHtml(localized.description) + '</small></span><span class="color-theme-check" aria-hidden="true">✓</span></label>' +
      '<a class="color-theme-source" href="' + escapeHtml(theme.guidelineUrl) + '" target="_blank" rel="noopener noreferrer" aria-label="' +
      escapeHtml(tr("查看 " + localized.name + " 公开规范", "Open the public guidelines for " + localized.name)) + '">' +
      escapeHtml(tr("公开规范 ↗", "Public guideline ↗")) + '</a></article>';
  }).join("");
}

function applyColorThemeChoice(id) {
  const colorTheme = normalizeColorThemeId(id);
  const theme = colorThemes.find((item) => item.id === colorTheme) || colorThemes[0];
  const inheritedTheme = workspace.contract.colorTheme === colorTheme;
  const inheritedSystem = workspace.contract.system === theme.designSystemId;
  updateDraft({
    overrides: {
      colorTheme: inheritedTheme ? { mode: "inherit" } : { mode: "override", value: colorTheme },
      system: inheritedSystem ? { mode: "inherit" } : { mode: "override", value: theme.designSystemId },
    },
  });
  renderColorThemes();
  renderIntent();
  updateOutput();
  track("launcher_color_theme_change", { colorTheme, designSystem: theme.designSystemId, intent: activeIntent() });
}

function syncColorThemeToDesignSystem(value) {
  if (value === "inherit") {
    updateDraft({ overrides: { colorTheme: { mode: "inherit" } } });
    return;
  }
  const theme = colorThemes.find((item) => item.designSystemId === value);
  if (!theme) return;
  updateDraft({
    overrides: {
      colorTheme: workspace.contract.colorTheme === theme.id
        ? { mode: "inherit" }
        : { mode: "override", value: theme.id },
    },
  });
}

function placeholder(value, labelText) {
  return String(value || "").trim() || "[" + tr("待补充：", "Missing: ") + labelText + "]";
}

function buildPrompt() {
  const fields = activeFields();
  const decisions = resolveEffectiveDecisions(workspace, activeIntent(), { locale: language() });
  const reference = decisions.reference.label;
  const tokens = decisions.density.label + " / " + decisions.spacingBase.label;
  const typography = fontPresetPrompt(decisions.fontScheme.value, language());
  const palette = colorThemePrompt(decisions.colorTheme.value, language());
  if (activeIntent() === "create") {
    return tr(
      "使用 $image-to-ui-skill 从零创建并直接实施以下界面。\n\n给谁用：" + placeholder(fields.audience, "给谁用") +
      "\n核心任务：" + placeholder(fields.coreTask, "核心任务") +
      "\n必要页面：" + placeholder(fields.requiredPages.join("、"), "必要页面") +
      "\n交付形式：" + decisions.format.label +
      "\n参考来源：" + reference +
      "\n风格方向：" + decisions.style.label +
      "\n主题色：" + palette +
      "\n设计系统：" + decisions.system.label +
      "\nToken 地基：" + tokens +
      "\n字体方案：" + typography +
      "\n实现深度：" + fields.interaction +
      "\n图片资产：" + fields.assets +
      "\n\n优先用代码实现文字、控件、图标和布局；只为代码无法表达的照片、插画或纹理生成位图。完成响应式实现、关键交互和浏览器验证。",
      "Use $image-to-ui-skill to create and directly implement this interface.\n\nAudience: " + placeholder(fields.audience, "audience") +
      "\nCore task: " + placeholder(fields.coreTask, "core task") +
      "\nRequired pages: " + placeholder(fields.requiredPages.join(", "), "required pages") +
      "\nDeliverable: " + decisions.format.label +
      "\nReference: " + reference +
      "\nStyle: " + decisions.style.label +
      "\nColor theme: " + palette +
      "\nDesign system: " + decisions.system.label +
      "\nToken foundation: " + tokens +
      "\nTypography: " + typography +
      "\nImplementation depth: " + fields.interaction +
      "\nImage assets: " + fields.assets +
      "\n\nRender text, controls, icons, and layout in code. Generate bitmap assets only when needed. Complete responsive implementation, interactions, and browser verification."
    );
  }
  if (activeIntent() === "rebuild") {
    return tr(
      "使用 $image-to-ui-skill 还原参考界面并直接实施。\n\n还原说明：" + placeholder(fields.brief, "还原说明") +
      "\n参考来源：" + reference +
      "\n目标形式：" + decisions.format.label +
      "\n风格方向：" + decisions.style.label +
      "\n主题色：" + palette +
      "\n设计系统：" + decisions.system.label +
      "\nToken 地基：" + tokens +
      "\n字体方案：" + typography +
      "\n还原深度：" + fields.fidelity +
      "\n\n分析结构、视觉 Tokens、组件、资产和交互；可读文字与常规控件必须由代码渲染。完成可点击实现并验证桌面和移动布局。",
      "Use $image-to-ui-skill to rebuild and directly implement the reference.\n\nBrief: " + placeholder(fields.brief, "rebuild brief") +
      "\nReference: " + reference +
      "\nTarget: " + decisions.format.label +
      "\nStyle: " + decisions.style.label +
      "\nColor theme: " + palette +
      "\nDesign system: " + decisions.system.label +
      "\nToken foundation: " + tokens +
      "\nTypography: " + typography +
      "\nDepth: " + fields.fidelity +
      "\n\nAnalyze structure, tokens, components, assets, and interactions. Render readable text and standard controls in code. Verify desktop and mobile."
    );
  }
  if (activeIntent() === "improve") {
    const target = fields.targetType === "workspace" ? tr("当前工作区", "current workspace") : placeholder(fields.target, tr("检查对象", "target"));
    const focus = fields.reviewAll === "true" ? tr("全面检查", "Full review") : placeholder(fields.focus.join(tr("、", ", ")), tr("优化重点", "focus"));
    return tr(
      "检查并优化这个现有界面：" + target + "\n\n优化目标：" + placeholder(fields.improveGoal, "优化目标") +
      "\n优化重点：" + focus + "\n设计系统：" + decisions.system.label +
      "\n目标主题色：" + palette +
      "\n目标字体：" + typography +
      "\n操作权限：" + fields.permission + "\n\n先按严重程度报告问题与证据，再在权限范围内实施并验证。保留产品语言，避免无关重构。",
      "Inspect and improve: " + target + "\n\nGoal: " + placeholder(fields.improveGoal, "improvement goal") +
      "\nFocus: " + focus + "\nDesign system: " + decisions.system.label +
      "\nTarget color theme: " + palette +
      "\nTarget typography: " + typography +
      "\nPermission: " + fields.permission + "\n\nReport evidence by severity, then implement and verify within the permission boundary."
    );
  }
  if (activeIntent() === "explore") {
    const target = fields.targetType === "workspace" ? tr("当前工作区", "current workspace") : placeholder(fields.target, tr("检查对象", "target"));
    const focus = fields.reviewAll === "true" ? tr("全面检查", "Full review") : placeholder(fields.focus.join(tr("、", ", ")), tr("检查重点", "focus"));
    return tr(
      "探索并理解这个现有项目：" + target + "\n\n检查重点：" + focus +
      "\n主题色语境：" + palette +
      "\n操作权限：" + fields.permission + "\n\n先读取相关代码、页面结构和资产，基于具体文件与行号给出证据。不要生成新界面；总结发现、风险、测试缺口和下一步。",
      "Explore and understand: " + target + "\n\nFocus: " + focus +
      "\nColor-theme context: " + palette +
      "\nPermission: " + fields.permission + "\n\nRead relevant code, page structure, and assets first. Cite concrete files and lines. Do not generate a new interface; summarize findings, risks, test gaps, and next steps."
    );
  }
  const systemNames = fields.systems.map(function (id) {
    return designSystemLabel(id, brandProfiles, language());
  });
  return tr(
    "为以下界面目标比较设计系统：" + placeholder(fields.brief, "界面目标") +
    "\n\n比较范围：" + placeholder(systemNames.join("、"), "至少两套设计系统") +
    "\n输出方式：" + fields.systemOutput +
    "\n统一主题色：" + palette +
    "\n\n使用同一内容结构和关键操作公平比较平台适配、组件映射、Tokens、交互惯例、技术栈、迁移成本，并给出推荐。",
    "Compare design systems for: " + placeholder(fields.brief, "interface goal") +
    "\n\nSystems: " + placeholder(systemNames.join(", "), "at least two systems") +
    "\nOutput: " + fields.systemOutput +
    "\nShared color theme: " + palette +
    "\n\nUse identical content and actions to compare platform fit, components, tokens, interactions, stack, and migration cost, then recommend."
  );
}

function summaryRows(readiness) {
  const fields = activeFields();
  const decisions = readiness.decisions;
  const taskLabels = {
    create: tr("从零创建", "Create"),
    rebuild: tr("参考图还原", "Rebuild"),
    improve: tr("优化现有页面", "Improve"),
    explore: tr("探索现有项目", "Explore"),
    "design-system": tr("比较设计系统", "Compare systems"),
  };
  const rows = [[tr("任务", "Task"), taskLabels[activeIntent()]]];
  if (activeIntent() === "create") {
    rows.push([tr("目标", "Goal"), placeholder(fields.coreTask, tr("核心任务", "core task"))]);
  } else if (activeIntent() === "rebuild" || activeIntent() === "design-system") {
    rows.push([tr("目标", "Goal"), placeholder(fields.brief, tr("目标说明", "goal"))]);
  } else {
    rows.push([tr("对象", "Target"), fields.targetType === "workspace" ? tr("当前工作区", "Current workspace") : placeholder(fields.target, tr("检查对象", "target"))]);
  }
  if (["create", "rebuild"].includes(activeIntent())) rows.push([tr("参考", "Reference"), decisions.reference.label]);
  if (activeIntent() === "design-system") {
    rows.push([
      tr("系统", "Systems"),
      placeholder(fields.systems.map(function (id) { return designSystemLabel(id, brandProfiles, language()); }).join(tr("、", ", ")), tr("至少两套", "At least two")),
    ]);
  }
  if (!["explore", "design-system"].includes(activeIntent())) rows.push([tr("设计系统", "Design system"), decisions.system.label]);
  rows.push([tr("风格", "Style"), decisions.style.label]);
  rows.push([tr("主题色", "Color theme"), decisions.colorTheme.label]);
  rows.push([tr("密度", "Density"), decisions.density.label]);
  rows.push([tr("Token 地基", "Token foundation"), decisions.spacingBase.label]);
  rows.push([tr("字体方案", "Typography"), decisions.fontScheme.label]);
  if (["create", "rebuild"].includes(activeIntent())) rows.push([tr("交付", "Deliverable"), decisions.format.label]);
  return rows;
}

function renderSummary(readiness) {
  taskSummary.innerHTML = summaryRows(readiness).map(function (row) {
    return "<dt>" + escapeHtml(row[0]) + "</dt><dd>" + escapeHtml(row[1]) + "</dd>";
  }).join("");
}

function focusMissing(item) {
  intentForm.querySelectorAll(".is-attention").forEach(function (node) { node.classList.remove("is-attention"); });
  intentForm.querySelectorAll('[aria-invalid="true"]').forEach(function (node) { node.removeAttribute("aria-invalid"); });
  const field = item.key === "reference"
    ? intentForm.querySelector('input[name="referenceSource"]:checked') || intentForm.querySelector(item.selector)
    : intentForm.querySelector(item.selector);
  if (!field) return;
  const target = field.closest(".text-field, .control-group, .config-section, .reference-source") || field;
  target.classList.add("is-attention");
  field.setAttribute("aria-invalid", "true");
  target.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(function () { field.focus({ preventScroll: true }); }, 180);
  window.setTimeout(function () { target.classList.remove("is-attention"); }, 1800);
}

function renderMissing(readiness) {
  if (readiness.ready) {
    missingState.hidden = true;
    missingState.replaceChildren();
    generatePromptWrap.removeAttribute("title");
    generatePromptWrap.removeAttribute("data-tooltip");
    return;
  }
  missingState.hidden = false;
  const lead = document.createElement("span");
  lead.textContent = tr("还缺少：", "Missing: ");
  const fragment = document.createDocumentFragment();
  fragment.append(lead);
  readiness.missing.forEach(function (item, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.missingIndex = String(index);
    button.textContent = item.label[language()];
    fragment.append(button);
    if (index < readiness.missing.length - 1) fragment.append(document.createTextNode(tr("、", ", ")));
  });
  missingState.replaceChildren(fragment);
  const tooltip = tr("请先补充：", "Complete: ") + readiness.missing.map(function (item) { return item.label[language()]; }).join(tr("、", ", "));
  generatePromptWrap.title = tooltip;
  generatePromptWrap.dataset.tooltip = tooltip;
}

function renderProgress(readiness) {
  const referenceStatus = readiness.referenceProgress;
  const usesReference = ["create", "rebuild"].includes(activeIntent());
  const referenceDone = referenceStatus === "complete" || referenceStatus === "skipped" || !usesReference;
  const steps = [
    {
      label: tr("参考", "Reference"),
      state: !usesReference ? tr("无需参考", "Not needed") : referenceDone ? (referenceStatus === "skipped" ? tr("已跳过", "Skipped") : tr("已同步", "Synced")) : tr("待选择", "Pending"),
      done: referenceDone,
      skipped: referenceStatus === "skipped" || !usesReference,
    },
    { label: tr("任务", "Task"), state: readiness.ready ? tr("已完整", "Complete") : tr("待补充", "Incomplete"), done: readiness.ready },
    { label: tr("指令", "Prompt"), state: readiness.ready ? tr("可生成", "Ready") : tr("实时预览", "Live draft"), done: readiness.ready },
  ];
  summaryProgress.innerHTML = steps.map(function (step) {
    return '<li class="' + (step.done ? "is-complete " : "") + (step.skipped ? "is-skipped" : "") +
      '"><i aria-hidden="true">' + (step.done ? "✓" : "·") + '</i><span><strong>' + escapeHtml(step.label) +
      '</strong><small>' + escapeHtml(step.state) + '</small></span></li>';
  }).join("");
}

function updatePromptState(generated) {
  const prompt = activeDraft().prompt;
  let nextPrompt;
  if (!prompt.dirty) {
    nextPrompt = { generated, edited: generated, dirty: false };
  } else {
    nextPrompt = { ...prompt, generated };
  }
  if (nextPrompt.generated !== prompt.generated || nextPrompt.edited !== prompt.edited || nextPrompt.dirty !== prompt.dirty) {
    updateDraft({ prompt: nextPrompt });
  }
  promptOutput.value = nextPrompt.dirty ? nextPrompt.edited : generated;
  resizePromptOutput();
  promptEditState.textContent = nextPrompt.dirty ? tr("已手动微调", "Manually edited") : tr("随表单实时更新", "Updates live with the form");
  promptSyncNotice.hidden = !(nextPrompt.dirty && nextPrompt.generated !== nextPrompt.edited);
  applyGeneratedPrompt.hidden = !nextPrompt.dirty;
}

function resizePromptOutput() {
  if (!promptOutput) return;
  promptOutput.style.height = "auto";
  promptOutput.style.height = `${Math.max(promptOutput.scrollHeight, 210)}px`;
}

function syncProjectProgress(readiness) {
  const reference = ["create", "rebuild"].includes(activeIntent())
    ? readiness.decisions.reference
    : { mode: "pending" };
  const patch = {
    taskIntent: activeIntent(),
    taskReady: readiness.ready,
    taskReferenceMode: reference.mode === "case" ? "case" : reference.mode === "upload" ? "upload" : reference.mode === "none" ? "none" : "unset",
    taskReferenceCaseId: reference.mode === "case" ? reference.caseId || "" : "",
    taskReferenceCaseName: reference.mode === "case" ? reference.caseName || "" : "",
    taskReferenceCaseStyle: reference.mode === "case" ? reference.caseStyle || "" : "",
    taskReferenceCaseImage: reference.mode === "case" ? reference.caseImage || "" : "",
    lastStep: "launcher",
  };
  const signature = JSON.stringify(patch);
  if (signature === projectProgressSignature) return;
  projectProgressSignature = signature;
  suppressProjectRefresh = true;
  window.image2Project?.save?.(patch);
  suppressProjectRefresh = false;
}

function renderAssistant(readiness) {
  if (readiness.ready) {
    assistantContent.innerHTML = '<p>' + tr("任务信息已经完整。你可以检查实时指令、手动微调，然后复制交给 Codex。", "The task is complete. Review or edit the live prompt, then copy it for Codex.") +
      '</p><button type="button" data-assistant-action="prompt">' + tr("检查指令", "Review prompt") + '</button>';
    return;
  }
  const first = readiness.missing[0];
  assistantContent.innerHTML = '<p>' + tr("建议先补充“", "Complete “") + escapeHtml(first.label[language()]) + tr("”，摘要和指令会立即同步。", "” next; summary and prompt will update immediately.") +
    '</p><button type="button" data-assistant-action="missing">' + tr("定位缺失项", "Go to missing field") + '</button>' +
    (first.key === "reference" ? '<button type="button" data-assistant-action="cases">' + tr("选择案例", "Choose a case") + '</button>' : "");
}

function updateOutput() {
  const readiness = validateReadiness(workspace, activeIntent());
  renderSummary(readiness);
  renderMissing(readiness);
  renderProgress(readiness);
  updatePromptState(buildPrompt());
  readyState.classList.toggle("is-ready", readiness.ready);
  readyState.querySelector("span").textContent = readiness.ready ? tr("可以生成", "Ready") : tr("等待输入", "Waiting");
  generatePrompt.disabled = !readiness.ready;
  generatePrompt.setAttribute("aria-disabled", String(!readiness.ready));
  renderAssistant(readiness);
  syncProjectProgress(readiness);
  return readiness;
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(function () { toast.hidden = true; }, 2600);
}

async function copyPromptText() {
  const value = promptOutput.value;
  let copied = false;
  try {
    await navigator.clipboard.writeText(value);
    copied = true;
  } catch {
    promptOutput.focus();
    promptOutput.select();
    try { copied = document.execCommand("copy"); } catch { copied = false; }
  }
  showToast(copied ? tr("指令已复制。", "Prompt copied.") : tr("复制失败，请手动选择文本。", "Copy failed; select the text manually."));
  if (copied) track("launcher_prompt_copy", { intent: activeIntent() });
}

function savePresetState() {
  try {
    localStorage.setItem(PRESET_KEY, JSON.stringify({
      intent: activeIntent(),
      summary: summaryRows(validateReadiness(workspace, activeIntent())),
      prompt: promptOutput.value,
      savedAt: new Date().toISOString(),
    }));
    showToast(tr("当前指令快照已保存。", "The prompt snapshot was saved."));
  } catch {
    showToast(tr("无法保存指令快照。", "Unable to save the prompt snapshot."));
  }
}

function setIntent(intent, options) {
  if (!VALID_INTENTS.has(intent) || intent === activeIntent()) return;
  captureFormState({ immediate: true });
  workspace = migrateLauncherWorkspace({ ...workspace, activeIntent: intent }, {
    projectId: workspace.projectId,
    activeIntent: intent,
    contract: workspace.contract,
  });
  if (options?.historyMode) {
    const url = new URL(window.location.href);
    url.searchParams.set("intent", intent);
    url.searchParams.delete("picker");
    url.searchParams.delete("q");
    url.searchParams.delete("category");
    history[options.historyMode + "State"]({ ...history.state, image2Picker: null }, "", url);
  }
  renderAll();
  syncReferenceUrlForActiveDraft();
  restoreUploadForIntent(intent);
  saveWorkspaceNow();
  track("launcher_intent_change", { intent });
}

function updateReferenceUrl(reference, mode) {
  const url = new URL(window.location.href);
  if (reference.mode === "case" && reference.caseId) {
    url.searchParams.set("source", "library");
    url.searchParams.set("case", reference.caseId);
  } else {
    url.searchParams.delete("source");
    url.searchParams.delete("case");
  }
  history[mode === "push" ? "pushState" : "replaceState"]({ ...history.state, image2Picker: null }, "", url);
}

function syncReferenceUrlForActiveDraft() {
  const reference = ["create", "rebuild"].includes(activeIntent())
    ? activeDraft().overrides.reference
    : { mode: "inherit" };
  updateReferenceUrl(reference, "replace");
}

function setReferenceMode(mode) {
  const current = activeDraft().overrides.reference || { mode: referenceMode() };
  let reference;
  if (mode === "none") reference = { mode };
  else if (mode === "case") reference = current.mode === "case" ? current : { mode: "case" };
  else reference = current.mode === "upload" ? current : { mode: "upload" };
  updateDraft({ overrides: { reference } }, { immediate: mode === "case" });
  const content = intentForm.querySelector("#referenceContent");
  if (content) content.innerHTML = referenceContentMarkup();
  updateReferenceUrl(reference, "replace");
  updateOutput();
  if (mode === "case" && !reference.caseId) openPicker(intentForm.querySelector('[name="referenceSource"][value="case"]'));
}

function openUploadDatabase() {
  return new Promise(function (resolve, reject) {
    if (!("indexedDB" in window)) {
      reject(new Error("indexeddb-unavailable"));
      return;
    }
    const request = indexedDB.open(UPLOAD_DB, UPLOAD_DB_VERSION);
    request.onupgradeneeded = function () {
      if (!request.result.objectStoreNames.contains(UPLOAD_STORE)) request.result.createObjectStore(UPLOAD_STORE);
    };
    request.onsuccess = function () { resolve(request.result); };
    request.onerror = function () { reject(request.error); };
  });
}

async function writeUpload(key, file) {
  const db = await openUploadDatabase();
  return new Promise(function (resolve, reject) {
    const transaction = db.transaction(UPLOAD_STORE, "readwrite");
    transaction.objectStore(UPLOAD_STORE).put(file, key);
    transaction.oncomplete = function () { db.close(); resolve(); };
    transaction.onerror = function () { db.close(); reject(transaction.error); };
  });
}

async function readUpload(key) {
  const db = await openUploadDatabase();
  return new Promise(function (resolve, reject) {
    const transaction = db.transaction(UPLOAD_STORE, "readonly");
    const request = transaction.objectStore(UPLOAD_STORE).get(key);
    request.onsuccess = function () { db.close(); resolve(request.result || null); };
    request.onerror = function () { db.close(); reject(request.error); };
  });
}

async function deleteUpload(key) {
  const db = await openUploadDatabase();
  return new Promise(function (resolve, reject) {
    const transaction = db.transaction(UPLOAD_STORE, "readwrite");
    transaction.objectStore(UPLOAD_STORE).delete(key);
    transaction.oncomplete = function () { db.close(); resolve(); };
    transaction.onerror = function () { db.close(); reject(transaction.error); };
  });
}

function uploadKey(intent) {
  return workspace.projectId + ":" + intent;
}

function setUploadUrl(intent, blob) {
  const previous = uploadUrls.get(intent);
  if (previous) URL.revokeObjectURL(previous);
  uploadUrls.set(intent, URL.createObjectURL(blob));
}

async function handleUpload(file) {
  if (!file || !file.type.startsWith("image/")) return;
  const key = uploadKey(activeIntent());
  try {
    await writeUpload(key, file);
    setUploadUrl(activeIntent(), file);
    updateDraft({
      overrides: {
        reference: {
          mode: "upload",
          blobId: key,
          fileName: file.name,
          mimeType: file.type,
          size: file.size,
          lastModified: file.lastModified,
          available: true,
        },
      },
    }, { immediate: true });
    renderIntent();
    updateReferenceUrl(activeDraft().overrides.reference, "replace");
    updateOutput();
    showToast(tr("参考图片已保存到此浏览器。", "Reference image saved in this browser."));
  } catch {
    showToast(tr("无法持久化图片；本次页面内仍可使用。", "The image could not be persisted; it remains available on this page."));
  }
}

async function removeUpload() {
  const intent = activeIntent();
  try { await deleteUpload(uploadKey(intent)); } catch {}
  const previous = uploadUrls.get(intent);
  if (previous) URL.revokeObjectURL(previous);
  uploadUrls.delete(intent);
  updateDraft({ overrides: { reference: { mode: "upload" } } }, { immediate: true });
  renderIntent();
  updateOutput();
}

async function restoreUploadForIntent(intent) {
  const reference = workspace.intents[intent].overrides.reference;
  if (reference?.mode !== "upload" || !reference.blobId) return;
  try {
    const blob = await readUpload(reference.blobId);
    if (!blob) throw new Error("upload-not-found");
    setUploadUrl(intent, blob);
    workspace = updateIntentDraft(workspace, intent, {
      overrides: { reference: { ...reference, available: true } },
    });
  } catch {
    workspace = updateIntentDraft(workspace, intent, {
      overrides: { reference: { ...reference, blobId: "", available: false } },
    });
  }
  if (intent === activeIntent()) {
    renderIntent();
    updateOutput();
  }
  saveWorkspaceNow();
}

function pickerStyleFromUrl() {
  const parsed = parseCasePickerUrl(window.location.href, URL_CATALOG);
  return parsed.style || resolveEffectiveDecisions(workspace, activeIntent()).style.value || "all";
}

function renderPickerFilters() {
  const parsed = parseCasePickerUrl(window.location.href, URL_CATALOG);
  const styleValue = parsed.style || "all";
  const categoryValue = parsed.category || "all";
  const styleOptions = [{ id: "all", label: tr("全部风格", "All styles") }].concat(styleCardDefinitions().map(function (card) {
    return { id: card.id, label: card.label };
  }));
  caseStyleFilters.innerHTML = styleOptions.map(function (option) {
    return '<button type="button" data-case-style="' + escapeHtml(option.id) + '" aria-pressed="' + String(styleValue === option.id) + '">' +
      escapeHtml(option.label) + '</button>';
  }).join("");
  const categories = ["all"].concat(Array.from(new Set(styleGuides.map(function (guide) { return guide.category; }))));
  caseCategoryFilters.innerHTML = categories.map(function (id) {
    return '<button type="button" data-case-category="' + escapeHtml(id) + '" aria-pressed="' + String(categoryValue === id) + '">' +
      escapeHtml(id === "all" ? tr("全部类型", "All types") : caseCategoryLabel(id)) + '</button>';
  }).join("");
  caseSearch.value = parsed.q || "";
}

function renderCaseGrid() {
  const parsed = parseCasePickerUrl(window.location.href, URL_CATALOG);
  const guides = filterCases(styleGuides, {
    styleId: parsed.style || "all",
    category: parsed.category || "all",
    query: parsed.q || "",
  }).map(function (guide) { return localizeCase(guide, language()); });
  caseGrid.innerHTML = guides.map(function (guide) {
    const tags = guide.tags || [];
    const facts = [
      [tr("适用场景", "Best for"), guide.bestFor],
      [tr("配色", "Palette"), guide.palette],
      [tr("布局", "Layout"), guide.layout],
    ].filter(function (entry) { return entry[1]; });
    return '<article class="case-card"><div class="case-card-media"><img src="' + escapeHtml(caseThumbnail(guide)) +
      '" alt="' + escapeHtml(guide.name + tr(" 案例预览", " case preview")) + '" loading="lazy"></div><div class="case-card-body"><div><small>' +
      escapeHtml(caseCategoryLabel(guide.category)) +
      '</small><h3>' + escapeHtml(guide.name) + '</h3><p class="case-style">' + escapeHtml(guide.style || "") +
      '</p></div><p>' + escapeHtml(guide.summary || guide.bestFor || "") + '</p><ul>' +
      tags.map(function (tag) { return "<li>" + escapeHtml(tag) + "</li>"; }).join("") +
      '</ul><details class="case-card-details"><summary>' + tr("查看完整信息", "View full details") + '</summary><dl>' +
      facts.map(function (entry) { return '<div><dt>' + escapeHtml(entry[0]) + '</dt><dd>' + escapeHtml(entry[1]) + '</dd></div>'; }).join("") +
      '</dl></details></div><div class="case-card-actions"><button type="button" data-use-case="' + escapeHtml(guide.id) + '">' + tr("使用此案例", "Use this case") +
      '</button></div></article>';
  }).join("");
  caseEmpty.hidden = guides.length > 0;
}

function ensureDirectPickerHistory() {
  const parsed = parseCasePickerUrl(window.location.href, URL_CATALOG);
  if (parsed.picker !== CASE_PICKER || history.state?.image2Picker === CASE_PICKER) return;
  const pickerUrl = new URL(window.location.href);
  const baseline = new URL(pickerUrl);
  baseline.searchParams.delete("picker");
  baseline.searchParams.delete("q");
  baseline.searchParams.delete("category");
  history.replaceState({ ...history.state, image2Picker: null }, "", baseline);
  history.pushState({ ...history.state, image2Picker: CASE_PICKER }, "", pickerUrl);
}

function showPicker() {
  if (!casePicker.open) casePicker.showModal();
  document.body.classList.add("case-picker-open");
  renderPickerFilters();
  renderCaseGrid();
  window.setTimeout(function () { caseSearch.focus(); }, 40);
}

function hidePicker() {
  if (casePicker.open) casePicker.close();
  document.body.classList.remove("case-picker-open");
  if (lastPickerTrigger?.isConnected) lastPickerTrigger.focus();
}

function openPicker(trigger) {
  captureFormState({ immediate: true });
  lastPickerTrigger = trigger || document.activeElement;
  const style = resolveEffectiveDecisions(workspace, activeIntent()).style.value;
  const next = openCasePickerUrl(window.location.href, { style: STYLE_IDS.has(style) ? style : null }, URL_CATALOG);
  if (parseCasePickerUrl(window.location.href, URL_CATALOG).picker !== CASE_PICKER) {
    history.pushState({ ...history.state, image2Picker: CASE_PICKER }, "", next);
  } else {
    history.replaceState({ ...history.state, image2Picker: CASE_PICKER }, "", next);
  }
  showPicker();
  track("launcher_case_picker_open", { intent: activeIntent(), style });
}

function closePickerThroughHistory() {
  if (parseCasePickerUrl(window.location.href, URL_CATALOG).picker === CASE_PICKER && history.state?.image2Picker === CASE_PICKER) {
    history.back();
    return;
  }
  const url = new URL(window.location.href);
  url.searchParams.delete("picker");
  url.searchParams.delete("q");
  url.searchParams.delete("category");
  history.replaceState({ ...history.state, image2Picker: null }, "", url);
  hidePicker();
}

function syncPickerFromUrl() {
  const parsed = parseCasePickerUrl(window.location.href, URL_CATALOG);
  if (parsed.picker === CASE_PICKER) showPicker();
  else hidePicker();
}

function replacePickerFilters(patch) {
  const parsed = parseCasePickerUrl(window.location.href, URL_CATALOG);
  const filters = {
    style: Object.hasOwn(patch, "style") ? patch.style : parsed.style,
    q: Object.hasOwn(patch, "q") ? patch.q : parsed.q,
    category: Object.hasOwn(patch, "category") ? patch.category : parsed.category,
  };
  const next = replaceCasePickerFiltersUrl(window.location.href, filters, URL_CATALOG);
  history.replaceState({ ...history.state, image2Picker: CASE_PICKER }, "", next);
  renderPickerFilters();
  renderCaseGrid();
}

function useCase(id) {
  const guide = guideById(id);
  if (!guide) return;
  const styleId = guide.styleProfileIds?.[0];
  updateDraft({
    overrides: {
      reference: referenceForGuide(guide),
      ...(styleId ? styleOverridesForChoice(styleId) : {}),
    },
  }, { immediate: true });
  const next = selectCaseUrl(window.location.href, guide.id, URL_CATALOG);
  history.replaceState({ ...history.state, image2Picker: null }, "", next);
  hidePicker();
  renderStyleCards();
  renderIntent();
  updateOutput();
  showToast(tr("案例信息已同步到本次任务。", "Case information is now synchronized with this task."));
  track("launcher_case_select", { caseId: guide.id, intent: activeIntent() });
}

async function expandBrief() {
  const seed = String(intentForm.querySelector('[name="brief"]')?.value || "").trim();
  if (!seed) {
    focusMissing({ selector: '[name="brief"]' });
    showToast(tr("先写一句项目想法。", "Start with a one-line project idea."));
    return;
  }
  const button = intentForm.querySelector("[data-expand-brief]");
  button.disabled = true;
  button.setAttribute("aria-busy", "true");
  button.textContent = tr("整理中…", "Expanding…");
  let suggestion;
  try {
    if (typeof window.image2BriefAssistant?.expand === "function") {
      const result = await window.image2BriefAssistant.expand({ brief: seed, locale: language() });
      if (!result || !result.audience || !result.coreTask || !Array.isArray(result.requiredPages)) throw new Error("invalid-assistant-result");
      suggestion = { ...result, provider: "host" };
    } else {
      const cafe = /咖啡|coffee|cafe/i.test(seed);
      suggestion = {
        provider: "local",
        audience: cafe ? tr("附近顾客与咖啡店店员", "Nearby customers and cafe staff") : tr("目标用户与日常运营人员", "Target users and daily operators"),
        coreTask: seed.replace(/^(做|创建|设计|build|create)\s*/i, ""),
        requiredPages: cafe
          ? [tr("首页", "Home"), tr("菜单与商品详情", "Menu and item detail"), tr("结算", "Checkout"), tr("订单状态", "Order status")]
          : [tr("首页", "Home"), tr("核心任务页", "Core task"), tr("详情页", "Detail"), tr("账户与设置", "Account and settings")],
        assumptions: [tr("需要响应式布局", "Responsive layout is required")],
      };
    }
    captureFormState();
    updateDraft({ fields: { briefSuggestion: JSON.stringify(suggestion) } }, { immediate: true });
    renderIntent();
    updateOutput();
  } catch {
    showToast(tr("完善失败，原输入已保留，请稍后重试。", "Expansion failed; your original input is unchanged."));
  } finally {
    if (button.isConnected) {
      button.disabled = false;
      button.removeAttribute("aria-busy");
      button.textContent = tr("帮我完善", "Help me expand");
    }
  }
}

function applyBriefSuggestion() {
  let suggestion;
  try { suggestion = JSON.parse(activeFields().briefSuggestion); } catch { return; }
  updateDraft({
    fields: {
      audience: suggestion.audience || "",
      coreTask: suggestion.coreTask || "",
      requiredPages: suggestion.requiredPages || [],
      briefSuggestion: "",
    },
  }, { immediate: true });
  renderIntent();
  updateOutput();
  showToast(tr("结构化目标已写入，可以继续微调。", "The structured goal is applied and remains editable."));
}

function toggleAssistant(open) {
  const shouldOpen = open == null ? assistantPanel.hidden : open;
  assistantPanel.hidden = !shouldOpen;
  assistantToggle.setAttribute("aria-expanded", String(shouldOpen));
  document.body.classList.toggle("assistant-open", shouldOpen);
  if (shouldOpen) assistantClose.focus();
  else assistantToggle.focus();
}

function renderAll() {
  renderStyleCards();
  renderColorThemes();
  renderIntent();
  updateOutput();
}

function applyLanguage() {
  document.title = tr("任务工作区 · IMAGE2 UI", "Task workspace · IMAGE2 UI");
  document.documentElement.lang = language() === "en" ? "en" : "zh-CN";
  savePreset.textContent = tr("保存指令快照", "Save prompt snapshot");
  renderAll();
  if (casePicker.open) {
    renderPickerFilters();
    renderCaseGrid();
  }
}

styleDirectionGrid.addEventListener("change", function (event) {
  if (event.target.name === "styleDirection") applyStyleChoice(event.target.value);
});

colorThemeGrid.addEventListener("change", function (event) {
  if (event.target.name === "colorTheme") applyColorThemeChoice(event.target.value);
});

modeTabs.addEventListener("click", function (event) {
  const button = event.target.closest("[data-intent]");
  if (button) setIntent(button.dataset.intent, { historyMode: "push" });
});

modeTabs.addEventListener("keydown", function (event) {
  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  event.preventDefault();
  const buttons = Array.from(modeTabs.querySelectorAll("[data-intent]"));
  const index = buttons.indexOf(document.activeElement);
  const nextIndex = (index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
  buttons[nextIndex].focus();
  setIntent(buttons[nextIndex].dataset.intent, { historyMode: "push" });
});

intentForm.addEventListener("input", function (event) {
  if (event.target.name === "referenceFile" || event.target.name === "fontScheme") return;
  captureFormState();
  syncDynamicControls();
  updateOutput();
});

intentForm.addEventListener("change", function (event) {
  if (event.target.name === "referenceSource") {
    setReferenceMode(event.target.value);
    return;
  }
  if (event.target.name === "referenceFile") {
    handleUpload(event.target.files?.[0]);
    return;
  }
  if (event.target.name === "fontScheme") {
    applyFontPresetChoice(event.target.value);
    return;
  }
  captureFormState();
  if (event.target.name === "designSystem") {
    syncColorThemeToDesignSystem(event.target.value);
    renderColorThemes();
  }
  syncDynamicControls();
  updateOutput();
});

intentForm.addEventListener("click", function (event) {
  const pickerButton = event.target.closest("[data-open-case-picker]");
  if (pickerButton) openPicker(pickerButton);
  if (event.target.closest("[data-remove-upload]")) removeUpload();
  const chip = event.target.closest("[data-brief-chip]");
  if (chip) {
    const field = intentForm.querySelector('[name="brief"]');
    field.value = chip.dataset.briefChip;
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.focus();
  }
  if (event.target.closest("[data-expand-brief]")) expandBrief();
  if (event.target.closest("[data-confirm-brief]")) applyBriefSuggestion();
  if (event.target.closest("[data-dismiss-brief]")) {
    updateDraft({ fields: { briefSuggestion: "" } }, { immediate: true });
    renderIntent();
    updateOutput();
  }
});

missingState.addEventListener("click", function (event) {
  const button = event.target.closest("[data-missing-index]");
  if (!button) return;
  const readiness = validateReadiness(workspace, activeIntent());
  const item = readiness.missing[Number(button.dataset.missingIndex)];
  if (item) focusMissing(item);
});

promptOutput.addEventListener("input", function () {
  const generated = activeDraft().prompt.generated;
  const edited = promptOutput.value;
  updateDraft({ prompt: { generated, edited, dirty: edited !== generated } });
  promptEditState.textContent = edited === generated ? tr("随表单实时更新", "Updates live with the form") : tr("已手动微调", "Manually edited");
  applyGeneratedPrompt.hidden = edited === generated;
  promptSyncNotice.hidden = edited === generated;
  resizePromptOutput();
});

applyGeneratedPrompt.addEventListener("click", function () {
  const generated = activeDraft().prompt.generated;
  updateDraft({ prompt: { generated, edited: generated, dirty: false } }, { immediate: true });
  updateOutput();
  promptOutput.focus();
});

generatePrompt.addEventListener("click", function () {
  if (generatePrompt.disabled) return;
  promptOutput.scrollIntoView({ behavior: "smooth", block: "center" });
  promptOutput.focus();
  promptOutput.setSelectionRange(0, 0);
  showToast(tr("指令已生成，可继续微调或复制。", "Prompt generated; edit or copy it now."));
  track("launcher_prompt_generate", { intent: activeIntent() });
});

copyPrompt.addEventListener("click", copyPromptText);
savePreset.addEventListener("click", savePresetState);

caseGrid.addEventListener("click", function (event) {
  const button = event.target.closest("[data-use-case]");
  if (button) useCase(button.dataset.useCase);
});

caseStyleFilters.addEventListener("click", function (event) {
  const button = event.target.closest("[data-case-style]");
  if (button) replacePickerFilters({ style: button.dataset.caseStyle === "all" ? null : button.dataset.caseStyle });
});

caseCategoryFilters.addEventListener("click", function (event) {
  const button = event.target.closest("[data-case-category]");
  if (button) replacePickerFilters({ category: button.dataset.caseCategory === "all" ? null : button.dataset.caseCategory });
});

caseSearch.addEventListener("input", function () {
  window.clearTimeout(filterTimer);
  filterTimer = window.setTimeout(function () { replacePickerFilters({ q: caseSearch.value.trim() || null }); }, 160);
});

closeCasePicker.addEventListener("click", closePickerThroughHistory);
casePicker.addEventListener("cancel", function (event) {
  event.preventDefault();
  closePickerThroughHistory();
});
casePicker.addEventListener("click", function (event) {
  if (event.target === casePicker) closePickerThroughHistory();
});

assistantToggle.addEventListener("click", function () { toggleAssistant(); });
assistantClose.addEventListener("click", function () { toggleAssistant(false); });
assistantContent.addEventListener("click", function (event) {
  const action = event.target.closest("[data-assistant-action]")?.dataset.assistantAction;
  const readiness = validateReadiness(workspace, activeIntent());
  if (action === "missing" && readiness.missing[0]) {
    toggleAssistant(false);
    focusMissing(readiness.missing[0]);
  }
  if (action === "cases") {
    toggleAssistant(false);
    openPicker(assistantToggle);
  }
  if (action === "prompt") {
    toggleAssistant(false);
    promptOutput.scrollIntoView({ behavior: "smooth", block: "center" });
    promptOutput.focus();
  }
});

window.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !assistantPanel.hidden && !casePicker.open) toggleAssistant(false);
});

window.addEventListener("popstate", function () {
  const nextIntent = urlIntent();
  if (nextIntent && nextIntent !== activeIntent()) {
    captureFormState({ immediate: true });
    workspace = migrateLauncherWorkspace({ ...workspace, activeIntent: nextIntent }, {
      projectId: workspace.projectId,
      activeIntent: nextIntent,
      contract: workspace.contract,
    });
    renderAll();
    restoreUploadForIntent(nextIntent);
  }
  syncPickerFromUrl();
});

window.addEventListener("image2:projectchange", function (event) {
  if (suppressProjectRefresh) return;
  workspace = migrateLauncherWorkspace(workspace, {
    projectId: projectId(event.detail || currentProject()),
    activeIntent: activeIntent(),
    contract: event.detail || currentProject(),
  });
  renderAll();
  scheduleWorkspaceSave();
});

window.addEventListener("storage", function (event) {
  if (event.key === PROJECT_STORAGE_KEY) {
    let project = currentProject();
    try { project = JSON.parse(event.newValue || "null") || project; } catch {}
    workspace = migrateLauncherWorkspace(workspace, {
      projectId: projectId(project),
      activeIntent: activeIntent(),
      contract: project,
    });
    renderAll();
    scheduleWorkspaceSave();
    return;
  }
  if (event.key !== storageKey(workspace.projectId) || !event.newValue) return;
  try {
    workspace = migrateLauncherWorkspace(JSON.parse(event.newValue), {
      projectId: workspace.projectId,
      contract: currentProject(),
    });
    renderAll();
  } catch {}
});

window.addEventListener("pagehide", saveWorkspaceNow);
window.addEventListener("beforeunload", function () {
  uploadUrls.forEach(function (url) { URL.revokeObjectURL(url); });
});

window.image2I18n?.registerPage?.(applyLanguage);

ensureDirectPickerHistory();
renderAll();
restoreUploadForIntent(activeIntent());
syncPickerFromUrl();
saveWorkspaceNow();
track("launcher_page_view", { intent: activeIntent() });
