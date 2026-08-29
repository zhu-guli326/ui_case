import { brandProfiles } from "./catalog/index.js";
import {
  designSystemLabel,
  normalizeDesignSystemId,
  normalizeDesignSystemIds,
} from "./catalog/design-system-utils.js";
import {
  DEFAULT_COLOR_THEME_ID,
  colorThemeDesignSystemId,
  colorThemeLabel,
  normalizeColorThemeId,
} from "./catalog/color-themes.js";
import {
  DEFAULT_FONT_PRESET_ID,
  findFontPreset,
  fontPresetLabel,
  normalizeFontPresetId,
} from "./catalog/font-presets.js";

export const LAUNCHER_WORKSPACE_VERSION = 2;

export const LAUNCHER_INTENTS = Object.freeze([
  "explore",
  "create",
  "rebuild",
  "improve",
  "design-system",
]);

export const CASE_ID_ALIASES = Object.freeze({ plate: "plate-play" });

const INTENT_ALIASES = Object.freeze({ build: "create", review: "improve", fix: "improve" });

const INTENT_FIELD_DEFAULTS = deepFreeze({
  explore: {
    targetType: "url",
    target: "",
    focus: ["architecture", "interaction", "tokens"],
    reviewAll: "false",
    reviewDepth: "full",
    permission: "readonly",
  },
  create: {
    brief: "",
    audience: "",
    coreTask: "",
    requiredPages: [],
    briefSuggestion: "",
    interaction: "path",
    assets: "needed",
  },
  rebuild: {
    brief: "",
    fidelity: "visual",
  },
  improve: {
    targetType: "url",
    target: "",
    improveGoal: "",
    focus: ["clarity", "visual", "interaction"],
    reviewAll: "false",
    permission: "implement",
  },
  "design-system": {
    brief: "",
    systems: ["apple-hig", "google-material-3", "ant-design"],
    systemOutput: "comparison",
  },
});

export const DEFAULT_PROJECT_CONTRACT = deepFreeze({
  format: "web",
  system: "auto",
  style: "minimal-tech",
  colorTheme: DEFAULT_COLOR_THEME_ID,
  density: "balanced",
  spacingBase: "8pt",
  fontScheme: DEFAULT_FONT_PRESET_ID,
  reference: { mode: "pending" },
});

export const FIELD_METADATA = deepFreeze({
  target: {
    key: "target",
    labelKey: "launcher.fields.target",
    label: { zh: "检查对象", en: "Inspection target" },
    selector: '[name="target"]',
    sectionId: "targetTitle",
  },
  focus: {
    key: "focus",
    labelKey: "launcher.fields.focus",
    label: { zh: "检查重点", en: "Review focus" },
    selector: 'input[name="focus"]',
    sectionId: "focusTitle",
  },
  audience: {
    key: "audience",
    labelKey: "launcher.fields.audience",
    label: { zh: "给谁用", en: "Audience" },
    selector: '[name="audience"]',
    sectionId: "briefTitle",
  },
  coreTask: {
    key: "coreTask",
    labelKey: "launcher.fields.coreTask",
    label: { zh: "核心任务", en: "Core task" },
    selector: '[name="coreTask"]',
    sectionId: "briefTitle",
  },
  requiredPages: {
    key: "requiredPages",
    labelKey: "launcher.fields.requiredPages",
    label: { zh: "必要页面", en: "Required pages" },
    selector: '[name="requiredPages"]',
    sectionId: "briefTitle",
  },
  rebuildBrief: {
    key: "rebuildBrief",
    labelKey: "launcher.fields.rebuildBrief",
    label: { zh: "还原说明", en: "Rebuild brief" },
    selector: '[name="brief"]',
    sectionId: "briefTitle",
  },
  reference: {
    key: "reference",
    labelKey: "launcher.fields.reference",
    label: { zh: "参考来源", en: "Reference source" },
    selector: 'input[name="referenceSource"]',
    sectionId: "referenceTitle",
  },
  improveGoal: {
    key: "improveGoal",
    labelKey: "launcher.fields.improveGoal",
    label: { zh: "优化目标", en: "Improvement goal" },
    selector: '[name="improveGoal"]',
    sectionId: "improveGoalTitle",
  },
  interfaceGoal: {
    key: "interfaceGoal",
    labelKey: "launcher.fields.interfaceGoal",
    label: { zh: "界面目标", en: "Interface goal" },
    selector: '[name="brief"]',
    sectionId: "briefTitle",
  },
  systems: {
    key: "systems",
    labelKey: "launcher.fields.systems",
    label: { zh: "至少两套设计系统", en: "At least two design systems" },
    selector: 'input[name="systems"]',
    sectionId: "systemsTitle",
  },
});

const VALUE_LABELS = deepFreeze({
  format: {
    web: { zh: "响应式网页", en: "Responsive web" },
    mobile: { zh: "手机 App", en: "Mobile app" },
    dashboard: { zh: "产品后台", en: "Product dashboard" },
    desktop: { zh: "桌面应用", en: "Desktop app" },
  },
  system: {
    auto: { zh: "自动推荐", en: "Auto-recommend" },
    custom: { zh: "自定义", en: "Custom" },
  },
  style: {
    "minimal-tech": { zh: "极简科技", en: "Minimal tech" },
    "soft-lifestyle": { zh: "温暖亲和", en: "Soft lifestyle" },
    "editorial-commerce": { zh: "编辑型时尚", en: "Editorial commerce" },
    "future-tech": { zh: "未来科技", en: "Future tech" },
    "neo-brutal": { zh: "Neo Brutalism", en: "Neo Brutalism" },
    glass: { zh: "Glassmorphism", en: "Glassmorphism" },
    retro: { zh: "复古数字", en: "Digital retro" },
  },
  density: {
    compact: { zh: "高密度工具型", en: "High-density tool" },
    spacious: { zh: "低密度呼吸感", en: "Low-density airy" },
    "high-density": { zh: "高密度工具型", en: "High-density tool" },
    "low-density": { zh: "低密度呼吸感", en: "Low-density airy" },
    balanced: { zh: "均衡密度", en: "Balanced density" },
  },
  spacingBase: {
    "4pt": { zh: "4pt 间距基数", en: "4pt spacing base" },
    "8pt": { zh: "8pt 间距基数", en: "8pt spacing base" },
  },
});

const SOURCE_LABELS = deepFreeze({
  project: { zh: "项目默认值", en: "Project default" },
  task: { zh: "本次覆写", en: "Task override" },
});

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
}

function cloneValue(value) {
  if (Array.isArray(value)) return value.map(cloneValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, cloneValue(child)]));
}

function hasOwn(object, key) {
  return Boolean(object) && Object.prototype.hasOwnProperty.call(object, key);
}

function normalizeIntent(intent) {
  const normalized = INTENT_ALIASES[intent] || intent;
  return LAUNCHER_INTENTS.includes(normalized) ? normalized : "create";
}

function normalizeString(value, fallback = "") {
  return value == null ? fallback : String(value);
}

function normalizeStringArray(value, fallback) {
  if (value === undefined) return cloneValue(fallback);
  if (value == null || value === "") return [];
  const source = Array.isArray(value) ? value : [value];
  return [...new Set(source.map((item) => String(item)).filter(Boolean))];
}

function normalizeFields(intent, input = {}) {
  const defaults = INTENT_FIELD_DEFAULTS[intent];
  return Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => {
    if (Array.isArray(fallback)) {
      const values = normalizeStringArray(hasOwn(input, key) ? input[key] : undefined, fallback);
      return [key, intent === "design-system" && key === "systems" ? normalizeDesignSystemIds(values) : values];
    }
    return [key, normalizeString(hasOwn(input, key) ? input[key] : undefined, fallback)];
  }));
}

function normalizeScalarOverride(input, normalizeValue = normalizeString) {
  if (typeof input === "string" && input) return { mode: "override", value: normalizeValue(input) };
  if (!input || typeof input !== "object" || input.mode === "inherit") return { mode: "inherit" };
  if (input.mode !== "override" || input.value == null || input.value === "") return { mode: "inherit" };
  return { mode: "override", value: normalizeValue(input.value) };
}

export function normalizeCaseId(id) {
  const value = normalizeString(id);
  return CASE_ID_ALIASES[value] || value;
}

export function normalizeReferenceDecision(input, { fallbackMode = "pending" } = {}) {
  if (typeof input === "string") {
    if (["inherit", "none", "pending"].includes(input)) return { mode: input };
    return { mode: "case", caseId: normalizeCaseId(input) };
  }
  if (!input || typeof input !== "object") return { mode: fallbackMode };

  if (input.mode === "inherit" || input.mode === "none" || input.mode === "pending") {
    return { mode: input.mode };
  }
  if (input.mode === "case") {
    return compactObject({
      mode: "case",
      caseId: normalizeCaseId(input.caseId ?? input.id),
      caseName: normalizeString(input.caseName ?? input.name),
      caseStyle: normalizeString(input.caseStyle ?? input.style),
      caseImage: normalizeString(input.caseImage ?? input.image),
    });
  }
  if (input.mode === "upload") {
    return compactObject({
      mode: "upload",
      blobId: normalizeString(input.blobId ?? input.assetId),
      fileName: normalizeString(input.fileName ?? input.name),
      mimeType: normalizeString(input.mimeType ?? input.type),
      size: Number.isFinite(Number(input.size)) ? Number(input.size) : undefined,
      lastModified: Number.isFinite(Number(input.lastModified)) ? Number(input.lastModified) : undefined,
      available: typeof input.available === "boolean" ? input.available : undefined,
    });
  }
  return { mode: fallbackMode };
}

function compactObject(input) {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== "" && value !== undefined));
}

function legacyFormat(input) {
  if (input.format) return String(input.format);
  const templateFormats = {
    dashboard: "dashboard",
    social: "mobile",
    commerce: "web",
    landing: "web",
    login: "web",
    "account-settings": "web",
    "list-detail": "web",
  };
  if (templateFormats[input.template]) return templateFormats[input.template];
  if (input.device === "iphone" || input.device === "android") return "mobile";
  if (input.device === "desktop") return "desktop";
  return DEFAULT_PROJECT_CONTRACT.format;
}

function contractReference(input) {
  if (hasOwn(input, "reference")) return normalizeReferenceDecision(input.reference);
  if (input.sourceCaseId || input.sourceCaseName) {
    return normalizeReferenceDecision({
      mode: "case",
      caseId: input.sourceCaseId,
      caseName: input.sourceCaseName,
      caseStyle: input.sourceCaseStyle,
      caseImage: input.sourceCaseImage,
    });
  }
  return cloneValue(DEFAULT_PROJECT_CONTRACT.reference);
}

export function normalizeProjectContract(input = {}) {
  const tokens = input.tokens && typeof input.tokens === "object" ? input.tokens : {};
  const typography = input.typography && typeof input.typography === "object" ? input.typography : {};
  return {
    format: legacyFormat(input),
    system: normalizeDesignSystemId(normalizeString(input.system ?? input.designSystem, DEFAULT_PROJECT_CONTRACT.system)),
    style: normalizeString(input.style ?? input.theme, DEFAULT_PROJECT_CONTRACT.style),
    colorTheme: normalizeColorThemeId(input.colorTheme ?? input.themeColor ?? DEFAULT_PROJECT_CONTRACT.colorTheme),
    density: normalizeString(input.density, DEFAULT_PROJECT_CONTRACT.density),
    spacingBase: normalizeString(input.spacingBase ?? tokens.spacingBase, DEFAULT_PROJECT_CONTRACT.spacingBase),
    fontScheme: normalizeFontPresetId(
      input.fontPreset ?? input.fontScheme ?? tokens.fontPreset ?? tokens.fontScheme ?? typography.fontPreset ?? typography.fontScheme ?? DEFAULT_PROJECT_CONTRACT.fontScheme,
    ),
    reference: contractReference(input),
  };
}

function defaultReferenceOverride(intent) {
  return intent === "rebuild" ? { mode: "case" } : { mode: "none" };
}

function defaultOverrides(intent) {
  return {
    format: { mode: "inherit" },
    system: { mode: "inherit" },
    style: { mode: "inherit" },
    colorTheme: { mode: "inherit" },
    density: { mode: "inherit" },
    spacingBase: { mode: "inherit" },
    fontScheme: { mode: "inherit" },
    reference: defaultReferenceOverride(intent),
  };
}

function normalizeOverrides(input = {}, intent = "create") {
  const reference = normalizeReferenceDecision(input.reference, { fallbackMode: defaultReferenceOverride(intent).mode });
  return {
    format: normalizeScalarOverride(input.format),
    system: normalizeScalarOverride(input.system, normalizeDesignSystemId),
    style: normalizeScalarOverride(input.style),
    colorTheme: normalizeScalarOverride(input.colorTheme, normalizeColorThemeId),
    density: normalizeScalarOverride(input.density),
    spacingBase: normalizeScalarOverride(input.spacingBase),
    fontScheme: normalizeScalarOverride(input.fontPreset ?? input.fontScheme, normalizeFontPresetId),
    reference: ["inherit", "pending"].includes(reference.mode) ? defaultReferenceOverride(intent) : reference,
  };
}

function normalizePromptState(input = {}) {
  return {
    generated: normalizeString(input.generated),
    edited: normalizeString(input.edited),
    dirty: input.dirty === true,
  };
}

function createIntentDraft(intent, input = {}) {
  return {
    fields: normalizeFields(intent, input.fields),
    overrides: normalizeOverrides(input.overrides, intent),
    prompt: normalizePromptState(input.prompt),
  };
}

export function createLauncherWorkspace({
  projectId = "current",
  activeIntent = "create",
  contract = DEFAULT_PROJECT_CONTRACT,
} = {}) {
  return {
    version: LAUNCHER_WORKSPACE_VERSION,
    projectId: normalizeString(projectId, "current"),
    activeIntent: normalizeIntent(activeIntent),
    contract: normalizeProjectContract(contract),
    intents: Object.fromEntries(LAUNCHER_INTENTS.map((intent) => [intent, createIntentDraft(intent)])),
  };
}

function legacyReferenceOverride(values, intent) {
  const source = values.referenceSource;
  if (source === "none") return { mode: "none" };
  if (source === "library" || values.referenceCase) {
    return normalizeReferenceDecision({
      mode: "case",
      caseId: values.referenceCase,
    });
  }
  if (source === "upload") {
    return normalizeReferenceDecision({
      mode: "upload",
      blobId: values.referenceBlobId,
      fileName: values.referenceFileName,
      mimeType: values.referenceMimeType,
    });
  }
  return defaultReferenceOverride(intent);
}

function migrateLegacyDraft(intent, values, contract) {
  const fieldInput = { ...values };
  if (intent === "create" && fieldInput.brief && !fieldInput.coreTask) fieldInput.coreTask = fieldInput.brief;
  const overrides = defaultOverrides(intent);
  if (values.format) overrides.format = { mode: "override", value: String(values.format) };
  if (values.designSystem) overrides.system = { mode: "override", value: normalizeDesignSystemId(values.designSystem) };
  if (values.style || values.theme) overrides.style = { mode: "override", value: String(values.style || values.theme) };
  if (values.colorTheme || values.themeColor) overrides.colorTheme = { mode: "override", value: normalizeColorThemeId(values.colorTheme || values.themeColor) };
  if (values.density) overrides.density = { mode: "override", value: String(values.density) };
  if (values.spacingBase) overrides.spacingBase = { mode: "override", value: String(values.spacingBase) };
  if (values.fontPreset || values.fontScheme) {
    overrides.fontScheme = { mode: "override", value: normalizeFontPresetId(values.fontPreset || values.fontScheme) };
  }
  overrides.reference = legacyReferenceOverride(values, intent);
  return createIntentDraft(intent, { fields: fieldInput, overrides });
}

export function migrateLauncherWorkspace(raw, options = {}) {
  const source = raw && typeof raw === "object" ? raw : {};
  const suppliedContract = options.contract ?? options.project;
  const contract = normalizeProjectContract(suppliedContract ?? source.contract ?? DEFAULT_PROJECT_CONTRACT);
  const workspace = createLauncherWorkspace({
    projectId: options.projectId ?? source.projectId ?? "current",
    activeIntent: options.activeIntent ?? source.activeIntent ?? source.intent ?? "create",
    contract,
  });

  if (Number(source.version) === LAUNCHER_WORKSPACE_VERSION && source.intents && typeof source.intents === "object") {
    LAUNCHER_INTENTS.forEach((intent) => {
      const draft = source.intents[intent] || {};
      workspace.intents[intent] = createIntentDraft(intent, {
        fields: draft.fields || {},
        overrides: draft.overrides || {},
        prompt: draft.prompt || {},
      });
    });
    return workspace;
  }

  const intent = normalizeIntent(source.intent ?? workspace.activeIntent);
  const values = source.values && typeof source.values === "object" ? source.values : {};
  workspace.activeIntent = intent;
  workspace.intents[intent] = migrateLegacyDraft(intent, values, contract);
  return workspace;
}

export function updateIntentDraft(workspace, intent, patch = {}) {
  const current = migrateLauncherWorkspace(workspace);
  const selectedIntent = normalizeIntent(intent);
  const currentDraft = current.intents[selectedIntent];
  const nextDraft = createIntentDraft(selectedIntent, {
    fields: { ...currentDraft.fields, ...(patch.fields || {}) },
    overrides: { ...currentDraft.overrides, ...(patch.overrides || {}) },
    prompt: { ...currentDraft.prompt, ...(patch.prompt || {}) },
  });
  return {
    ...current,
    activeIntent: selectedIntent,
    intents: { ...current.intents, [selectedIntent]: nextDraft },
  };
}

export function resolveDecision(contractValue, override) {
  const normalized = normalizeScalarOverride(override);
  if (normalized.mode === "override") {
    return { value: normalized.value, source: "task", inherited: false };
  }
  return { value: contractValue, source: "project", inherited: true };
}

export function resolveReferenceDecision(contractValue, override) {
  const normalizedOverride = normalizeReferenceDecision(override, { fallbackMode: "inherit" });
  if (normalizedOverride.mode !== "inherit") {
    return { ...normalizedOverride, source: "task", inherited: false };
  }
  const normalizedContract = normalizeReferenceDecision(contractValue);
  return { ...normalizedContract, source: "project", inherited: true };
}

export function referenceProgress(decision, inheritedReference) {
  const effective = decision?.mode === "inherit"
    ? resolveReferenceDecision(inheritedReference, decision)
    : normalizeReferenceDecision(decision);
  if (effective.mode === "none") return "skipped";
  if (effective.mode === "case" && effective.caseId) return "complete";
  if (effective.mode === "upload" && (effective.available === true || effective.blobId && effective.available !== false)) return "complete";
  return "pending";
}

function valueLabel(kind, value, locale) {
  if (kind === "system") return designSystemLabel(value, brandProfiles, locale);
  if (kind === "colorTheme") return colorThemeLabel(value, locale);
  if (kind === "fontScheme") return fontPresetLabel(value, locale);
  return VALUE_LABELS[kind]?.[value]?.[locale] || normalizeString(value);
}

function fontDecisionMetadata(value) {
  const preset = findFontPreset(value);
  return {
    fontPresetId: preset.id,
    displayFontFamily: preset.roles.display.fontFamily,
    displayFontWeights: preset.roles.display.weights,
    bodyFontFamily: preset.roles.body.fontFamily,
    bodyFontWeights: preset.roles.body.weights,
    remoteCssUrl: preset.remoteCssUrl,
    fontSources: preset.sources,
  };
}

function referenceLabel(decision, locale) {
  if (decision.mode === "none") return locale === "en" ? "No reference" : "不使用参考";
  if (decision.mode === "case") return decision.caseName || decision.caseId || (locale === "en" ? "Case not selected" : "尚未选择案例");
  if (decision.mode === "upload") return decision.fileName || (locale === "en" ? "Local image" : "本地图片");
  return locale === "en" ? "Not selected" : "未选择";
}

export function describeDecision(kind, decision, locale = "zh") {
  const language = locale === "en" ? "en" : "zh";
  const label = kind === "reference" ? referenceLabel(decision, language) : valueLabel(kind, decision.value, language);
  const sourceLabel = SOURCE_LABELS[decision.source]?.[language] || decision.source;
  return {
    ...decision,
    kind,
    ...(kind === "colorTheme" ? { designSystemId: colorThemeDesignSystemId(decision.value) } : {}),
    ...(kind === "fontScheme" ? fontDecisionMetadata(decision.value) : {}),
    label,
    sourceLabel,
    text: language === "en" ? `${label} (${sourceLabel})` : `${label}（${sourceLabel}）`,
  };
}

export function resolveEffectiveDecisions(workspace, intent = workspace?.activeIntent, { locale = "zh" } = {}) {
  const current = migrateLauncherWorkspace(workspace);
  const selectedIntent = normalizeIntent(intent ?? current.activeIntent);
  const overrides = current.intents[selectedIntent].overrides;
  const raw = {
    format: resolveDecision(current.contract.format, overrides.format),
    system: resolveDecision(current.contract.system, overrides.system),
    style: resolveDecision(current.contract.style, overrides.style),
    colorTheme: resolveDecision(current.contract.colorTheme, overrides.colorTheme),
    density: resolveDecision(current.contract.density, overrides.density),
    spacingBase: resolveDecision(current.contract.spacingBase, overrides.spacingBase),
    fontScheme: resolveDecision(current.contract.fontScheme, overrides.fontScheme),
    reference: resolveReferenceDecision(current.contract.reference, overrides.reference),
  };
  return {
    format: describeDecision("format", raw.format, locale),
    system: describeDecision("system", raw.system, locale),
    style: describeDecision("style", raw.style, locale),
    colorTheme: describeDecision("colorTheme", raw.colorTheme, locale),
    density: describeDecision("density", raw.density, locale),
    spacingBase: describeDecision("spacingBase", raw.spacingBase, locale),
    fontScheme: describeDecision("fontScheme", raw.fontScheme, locale),
    reference: describeDecision("reference", raw.reference, locale),
  };
}

function missingField(key) {
  return cloneValue(FIELD_METADATA[key]);
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateTarget(fields, missing) {
  if (fields.targetType !== "workspace" && !hasText(fields.target)) missing.push(missingField("target"));
}

export function validateReadiness(workspace, intent = workspace?.activeIntent) {
  const current = migrateLauncherWorkspace(workspace);
  const selectedIntent = normalizeIntent(intent ?? current.activeIntent);
  const fields = current.intents[selectedIntent].fields;
  const decisions = resolveEffectiveDecisions(current, selectedIntent);
  const referenceStatus = referenceProgress(decisions.reference);
  const missing = [];

  if (selectedIntent === "explore") {
    validateTarget(fields, missing);
    if (!fields.focus.length) missing.push(missingField("focus"));
  } else if (selectedIntent === "create") {
    if (!hasText(fields.audience)) missing.push(missingField("audience"));
    if (!hasText(fields.coreTask)) missing.push(missingField("coreTask"));
    if (!fields.requiredPages.length) missing.push(missingField("requiredPages"));
  } else if (selectedIntent === "rebuild") {
    if (!hasText(fields.brief)) missing.push(missingField("rebuildBrief"));
    if (referenceStatus !== "complete") missing.push(missingField("reference"));
  } else if (selectedIntent === "improve") {
    validateTarget(fields, missing);
    if (!hasText(fields.improveGoal)) missing.push(missingField("improveGoal"));
    if (!fields.focus.length) missing.push(missingField("focus"));
  } else if (selectedIntent === "design-system") {
    if (!hasText(fields.brief)) missing.push(missingField("interfaceGoal"));
    if (fields.systems.length < 2) missing.push(missingField("systems"));
  }

  return {
    intent: selectedIntent,
    ready: missing.length === 0,
    missing,
    referenceProgress: referenceStatus,
    decisions,
  };
}
