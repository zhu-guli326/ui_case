export const DEFAULT_FONT_PRESET_ID = "system-ui-cjk";

const systemSansStack = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif';
const humanistSansStack = '"Source Sans 3", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif';
const editorialSerifStack = '"Source Serif 4", "Noto Serif SC", "Songti SC", SimSun, Georgia, serif';

const definitions = [
  {
    id: "system-ui-cjk",
    name: "系统无衬线",
    description: "优先使用设备原生界面字体，加载最稳健，适合工具和高密度产品",
    guidance: "不请求远程字体；依靠平台字体保持启动速度，并用字重和字号建立层级。",
    loadStrategy: "system",
    remoteCssUrl: null,
    roles: {
      display: {
        fontFamily: systemSansStack,
        fallbacks: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", "sans-serif"],
        weights: [600, 700],
      },
      body: {
        fontFamily: systemSansStack,
        fallbacks: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", "sans-serif"],
        weights: [400, 500, 600],
      },
    },
    sources: [
      {
        family: "System UI font stack",
        provider: "Operating system and browser",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-family",
        license: "Platform-provided fonts",
      },
    ],
    locales: {
      en: {
        name: "System UI sans",
        description: "Uses native interface fonts first for resilient loading in tools and dense products",
        guidance: "Make no remote font request; preserve startup speed and create hierarchy with size and weight.",
      },
    },
  },
  {
    id: "humanist-sans-cjk",
    name: "人文无衬线组合",
    description: "Source Sans 3 搭配 Noto Sans SC，开放、亲和，适合内容和日常服务",
    guidance: "远程字体仅作增强；加载失败时回退到中文系统黑体，不阻塞内容显示。",
    loadStrategy: "optional-remote",
    remoteCssUrl: "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap",
    roles: {
      display: {
        fontFamily: humanistSansStack,
        fallbacks: ["Noto Sans SC", "PingFang SC", "Microsoft YaHei", "system-ui", "sans-serif"],
        weights: [600, 700],
      },
      body: {
        fontFamily: humanistSansStack,
        fallbacks: ["Noto Sans SC", "PingFang SC", "Microsoft YaHei", "system-ui", "sans-serif"],
        weights: [400, 500, 600],
      },
    },
    sources: [
      {
        family: "Source Sans 3",
        provider: "Adobe",
        sourceUrl: "https://github.com/adobe-fonts/source-sans",
        license: "SIL Open Font License 1.1",
      },
      {
        family: "Noto Sans SC",
        provider: "Google",
        sourceUrl: "https://fonts.google.com/noto/specimen/Noto+Sans+SC",
        license: "SIL Open Font License 1.1",
      },
    ],
    locales: {
      en: {
        name: "Humanist sans pairing",
        description: "Pairs Source Sans 3 with Noto Sans SC for open, approachable content and everyday services",
        guidance: "Treat remote fonts as an enhancement and fall back to CJK system sans without blocking content.",
      },
    },
  },
  {
    id: "editorial-serif-cjk",
    name: "编辑型衬线组合",
    description: "Source Serif 4 搭配 Noto Serif SC，正文保留系统无衬线，适合内容和精品零售",
    guidance: "衬线字体用于标题与短篇展示文字，表单、导航和长正文继续使用系统无衬线。",
    loadStrategy: "optional-remote",
    remoteCssUrl: "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&family=Source+Serif+4:wght@400;500;600;700&display=swap",
    roles: {
      display: {
        fontFamily: editorialSerifStack,
        fallbacks: ["Noto Serif SC", "Songti SC", "SimSun", "Georgia", "serif"],
        weights: [500, 600, 700],
      },
      body: {
        fontFamily: systemSansStack,
        fallbacks: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", "sans-serif"],
        weights: [400, 500, 600],
      },
    },
    sources: [
      {
        family: "Source Serif 4",
        provider: "Adobe",
        sourceUrl: "https://github.com/adobe-fonts/source-serif",
        license: "SIL Open Font License 1.1",
      },
      {
        family: "Noto Serif SC",
        provider: "Google",
        sourceUrl: "https://fonts.google.com/noto/specimen/Noto+Serif+SC",
        license: "SIL Open Font License 1.1",
      },
    ],
    locales: {
      en: {
        name: "Editorial serif pairing",
        description: "Pairs Source Serif 4 with Noto Serif SC while retaining system sans for body UI, content, and premium retail",
        guidance: "Use serif faces for headings and short display copy; keep forms, navigation, and long body copy in system sans.",
      },
    },
  },
];

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
}

export const FONT_PRESET_ID_ALIASES = deepFreeze({
  "system-cjk": "system-ui-cjk",
  "system-sans": "system-ui-cjk",
  "humanist-cjk": "humanist-sans-cjk",
  "cjk-latin-sans": "humanist-sans-cjk",
  "serif-cjk": "editorial-serif-cjk",
  "cjk-latin-editorial": "editorial-serif-cjk",
});

export const fontPresets = deepFreeze(definitions);

export function findFontPreset(value) {
  const requested = value == null ? "" : String(value);
  const id = FONT_PRESET_ID_ALIASES[requested] || requested;
  return fontPresets.find((preset) => preset.id === id) || fontPresets.find((preset) => preset.id === DEFAULT_FONT_PRESET_ID);
}

export function normalizeFontPresetId(value) {
  return findFontPreset(value).id;
}

export function localizeFontPreset(value, locale = "zh") {
  const preset = typeof value === "object" && value ? value : findFontPreset(value);
  return locale === "en" ? { ...preset, ...(preset.locales?.en || {}) } : preset;
}

export function fontPresetLabel(value, locale = "zh") {
  return localizeFontPreset(value, locale).name;
}

export function fontPresetFamily(value, role = "body") {
  const preset = findFontPreset(value);
  return preset.roles[role]?.fontFamily || preset.roles.body.fontFamily;
}

export function fontPresetPrompt(value, locale = "zh") {
  const preset = localizeFontPreset(value, locale);
  const displayWeights = preset.roles.display.weights.join("/");
  const bodyWeights = preset.roles.body.weights.join("/");
  const remote = preset.remoteCssUrl
    ? locale === "en" ? `Optional CSS: ${preset.remoteCssUrl}.` : `可选 CSS：${preset.remoteCssUrl}。`
    : locale === "en" ? "No remote font request." : "不请求远程字体。";
  if (locale === "en") {
    return `${preset.name}: display ${preset.roles.display.fontFamily} at ${displayWeights}; body ${preset.roles.body.fontFamily} at ${bodyWeights}. ${remote} ${preset.guidance}`;
  }
  return `${preset.name}：标题 ${preset.roles.display.fontFamily}，字重 ${displayWeights}；正文 ${preset.roles.body.fontFamily}，字重 ${bodyWeights}。${remote}${preset.guidance}`;
}
