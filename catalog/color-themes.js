export const DEFAULT_COLOR_THEME_ID = "ant-design";

const definitions = [
  {
    id: "ant-design",
    designSystemId: "ant-design",
    organization: "Ant Group",
    sourceUrl: "https://ant.design/",
    guidelineUrl: "https://ant.design/docs/spec/colors/",
    name: "Ant Design 品牌蓝",
    description: "清晰的企业蓝与中性灰阶，适合表格、表单和复杂业务流程",
    guidance: "用品牌蓝标记主要操作、选中与焦点；高密度信息仍以中性色建立层级。",
    mappingNote: "数值对应默认浅色 Seed / Map / Alias Token；文字型主操作使用对比度更高的 colorPrimaryActive。",
    labName: "Ant Design 品牌蓝",
    labDescription: "企业蓝、中性表面与清晰状态层级",
    tags: ["企业产品", "高密度", "业务流程"],
    voice: "直接、明确，以任务状态和下一步操作为中心。",
    colors: {
      canvas: "#f5f5f5", surface: "#ffffff", ink: "#1f1f1f", muted: "#595959",
      accent: "#1677ff", actionAccent: "#0958d9", accentSoft: "#e6f4ff", success: "#52c41a", warning: "#faad14",
      danger: "#ff4d4f", border: "#d9d9d9", onAccent: "#ffffff",
    },
    locales: {
      en: {
        name: "Ant Design blue",
        description: "A precise enterprise blue with neutral grays for tables, forms, and complex workflows",
        guidance: "Use brand blue for primary actions, selection, and focus; let neutral tones structure dense information.",
        mappingNote: "Values map to the default light Seed, Map, and Alias Tokens; text-bearing primary actions use the higher-contrast colorPrimaryActive.",
      },
    },
  },
  {
    id: "tdesign",
    designSystemId: "tdesign",
    organization: "Tencent",
    sourceUrl: "https://tdesign.tencent.com/",
    guidelineUrl: "https://tdesign.tencent.com/design/color",
    name: "TDesign 品牌蓝",
    description: "鲜明蓝色与轻灰表面，适合跨端企业应用和运营工具",
    guidance: "保持蓝色操作层级一致，成功、警告与危险状态必须同时提供文字或图标。",
    mappingNote: "数值对应 TDesign Web 默认浅色语义变量；实现时优先使用 --td-* Token。",
    labName: "TDesign 品牌蓝",
    labDescription: "跨端企业蓝与轻量中性表面",
    tags: ["跨端", "企业应用", "运营工具"],
    voice: "简洁、稳健，优先说明操作结果和状态变化。",
    colors: {
      canvas: "#eeeeee", surface: "#ffffff", ink: "#1a1a1a", muted: "#666666",
      accent: "#0052d9", actionAccent: "#0052d9", accentSoft: "#f2f3ff", success: "#2ba471", warning: "#e37318",
      danger: "#d54941", border: "#e8e8e8", onAccent: "#ffffff",
    },
    locales: {
      en: {
        name: "TDesign blue",
        description: "A vivid blue with light-gray surfaces for cross-platform enterprise and operations tools",
        guidance: "Keep blue action hierarchy consistent, and pair success, warning, and danger colors with text or icons.",
        mappingNote: "Values map to TDesign Web's default light semantic variables; implementations should prefer --td-* tokens.",
      },
    },
  },
  {
    id: "google-material-3",
    designSystemId: "google-material-3",
    organization: "Google",
    sourceUrl: "https://m3.material.io/",
    guidelineUrl: "https://m3.material.io/styles/color/roles",
    name: "Material 3 紫",
    description: "柔和紫色与分层表面，适合自适应布局和富状态移动体验",
    guidance: "用容器色表达层级，用主色表达关键行动；不要用阴影代替所有表面关系。",
    mappingNote: "M3 基线没有通用 success / warning 角色；此处两项是为项目补齐的扩展 Token，不作为 M3 官方值。",
    labName: "Material 3 紫",
    labDescription: "紫色主调、柔和容器与动态层级",
    tags: ["移动端", "自适应", "容器层级"],
    voice: "自然、友好，通过清楚的动作和状态引导用户。",
    colors: {
      canvas: "#fffbfe", surface: "#fffbfe", ink: "#1c1b1f", muted: "#49454f",
      accent: "#6750a4", actionAccent: "#6750a4", accentSoft: "#eaddff", success: "#386a20", warning: "#7d5700",
      danger: "#b3261e", border: "#79747e", onAccent: "#ffffff",
    },
    locales: {
      en: {
        name: "Material 3 purple",
        description: "Soft purple and layered surfaces for adaptive layouts and state-rich mobile experiences",
        guidance: "Express hierarchy with container colors and key actions with the primary color; do not make shadows carry every surface relationship.",
        mappingNote: "The M3 baseline has no generic success or warning roles; those two values are project extensions, not official M3 tokens.",
      },
    },
  },
  {
    id: "apple-hig",
    designSystemId: "apple-hig",
    organization: "Apple",
    sourceUrl: "https://developer.apple.com/design/human-interface-guidelines/",
    guidelineUrl: "https://developer.apple.com/design/human-interface-guidelines/color",
    name: "Apple 系统蓝",
    description: "克制系统蓝、明亮表面和高可读文字，适合内容优先的原生体验",
    guidance: "让内容保持主导，系统蓝只用于可操作元素、选择和焦点，不用装饰性色彩制造噪音。",
    mappingNote: "Hex 只用于 Web 静态预览；Apple 原生实现必须改用 systemBackground、label、tintColor 等动态语义 API。",
    labName: "Apple 系统蓝",
    labDescription: "明亮表面、系统蓝与内容优先层级",
    tags: ["原生体验", "内容优先", "克制"],
    voice: "简短、自然，让标签直接说明动作。",
    colors: {
      canvas: "#f2f2f7", surface: "#ffffff", ink: "#1d1d1f", muted: "#515154",
      accent: "#007aff", actionAccent: "#0066cc", accentSoft: "#e8f2ff", success: "#248a3d", warning: "#8a4b00",
      danger: "#d70015", border: "#d2d2d7", onAccent: "#ffffff",
    },
    locales: {
      en: {
        name: "Apple system blue",
        description: "Restrained system blue, bright surfaces, and highly legible text for content-first native experiences",
        guidance: "Keep content dominant and reserve system blue for interactive elements, selection, and focus rather than decoration.",
        mappingNote: "Hex values are only a static web preview; native Apple implementations must use dynamic semantic APIs such as systemBackground, label, and tintColor.",
      },
    },
  },
  {
    id: "fluent-2",
    designSystemId: "fluent-2",
    organization: "Microsoft",
    sourceUrl: "https://fluent2.microsoft.design/",
    guidelineUrl: "https://fluent2.microsoft.design/color-tokens/",
    name: "Fluent 2 蓝",
    description: "生产力蓝与柔和层级表面，适合跨平台工作流和协作应用",
    guidance: "使用品牌蓝连接跨平台操作，依靠表面、边界和状态共同表达层级。",
    mappingNote: "数值对应 Fluent 2 Web 浅色 Alias Token；实现时使用 colorNeutral* / colorBrand* / colorStatus* 别名。",
    labName: "Fluent 2 蓝",
    labDescription: "生产力蓝、柔和表面与跨平台层级",
    tags: ["生产力", "跨平台", "协作"],
    voice: "专业、包容，清楚说明上下文和操作影响。",
    colors: {
      canvas: "#fafafa", surface: "#ffffff", ink: "#242424", muted: "#616161",
      accent: "#0f6cbd", actionAccent: "#0f6cbd", accentSoft: "#ebf3fc", success: "#0e700e", warning: "#bc4b09",
      danger: "#b10e1c", border: "#d1d1d1", onAccent: "#ffffff",
    },
    locales: {
      en: {
        name: "Fluent 2 blue",
        description: "Productivity blue and softly layered surfaces for cross-platform workflows and collaboration",
        guidance: "Use brand blue to connect cross-platform actions, and combine surfaces, borders, and status cues to express hierarchy.",
        mappingNote: "Values map to Fluent 2 Web light alias tokens; use colorNeutral*, colorBrand*, and colorStatus* aliases in implementation.",
      },
    },
  },
  {
    id: "carbon-design",
    designSystemId: "carbon-design",
    organization: "IBM",
    sourceUrl: "https://carbondesignsystem.com/",
    guidelineUrl: "https://carbondesignsystem.com/elements/color/tokens/",
    name: "Carbon 蓝",
    description: "强对比 IBM 蓝与结构化灰阶，适合复杂数据、分析和企业工作台",
    guidance: "用灰阶组织大规模信息，只让蓝色承担主要行动、链接与当前状态。",
    mappingNote: "数值对应 Carbon White 主题；页面 background 为白，layer-01 容器为浅灰。",
    labName: "Carbon 蓝",
    labDescription: "结构化灰阶、强对比蓝与数据密度",
    tags: ["复杂数据", "分析", "企业工作台"],
    voice: "准确、可扫描，先给事实再给操作。",
    colors: {
      canvas: "#ffffff", surface: "#f4f4f4", ink: "#161616", muted: "#525252",
      accent: "#0f62fe", actionAccent: "#0f62fe", accentSoft: "#d0e2ff", success: "#24a148", warning: "#f1c21b",
      danger: "#da1e28", border: "#e0e0e0", onAccent: "#ffffff",
    },
    locales: {
      en: {
        name: "Carbon blue",
        description: "High-contrast IBM blue and structured grays for complex data, analytics, and enterprise workspaces",
        guidance: "Organize large information sets with gray tones, reserving blue for primary actions, links, and current state.",
        mappingNote: "Values map to Carbon's White theme: the page background is white and layer-01 surfaces are light gray.",
      },
    },
  },
  {
    id: "adobe-spectrum",
    designSystemId: "adobe-spectrum",
    organization: "Adobe",
    sourceUrl: "https://spectrum.adobe.com/",
    guidelineUrl: "https://spectrum.adobe.com/page/color-system/",
    name: "Spectrum 蓝",
    description: "清晰行动蓝与稳定中性色，适合创意工具和复杂多面板工作区",
    guidance: "让颜色表达操作语义和反馈，不让工具栏、面板与画布争夺视觉注意力。",
    mappingNote: "数值对应 Spectrum 2 浅色语义色；border 是针对本项目的 gray-300 映射，不声称为单一全局边框 Token。",
    labName: "Spectrum 蓝",
    labDescription: "行动蓝、中性面板与创意工作区层级",
    tags: ["创意工具", "复杂工作区", "多面板"],
    voice: "精确、克制，使用熟悉术语描述工具和结果。",
    colors: {
      canvas: "#f8f8f8", surface: "#ffffff", ink: "#292929", muted: "#505050",
      accent: "#3b63fb", actionAccent: "#3b63fb", accentSoft: "#e5f0fe", success: "#079355", warning: "#d45b00",
      danger: "#f03823", border: "#dadada", onAccent: "#ffffff",
    },
    locales: {
      en: {
        name: "Spectrum blue",
        description: "Clear action blue and stable neutrals for creative tools and complex multi-panel workspaces",
        guidance: "Use color for action semantics and feedback without making toolbars, panels, and canvas compete for attention.",
        mappingNote: "Values map to Spectrum 2 light semantic colors; border is this project's gray-300 mapping rather than one universal border token.",
      },
    },
  },
  {
    id: "github-primer",
    designSystemId: "github-primer",
    organization: "GitHub",
    sourceUrl: "https://primer.style/",
    guidelineUrl: "https://primer.style/product/primitives/color/",
    name: "Primer 开发者蓝",
    description: "浅灰画布、白色表面与高可见蓝色，适合开发者工具和代码协作",
    guidance: "用边界和表面分隔代码密集区域，蓝色用于链接、主要操作和当前选择。",
    mappingNote: "数值对应 Primer 浅色功能 Token；bgColor.muted 作为项目画布，bgColor.default 作为内容表面。",
    labName: "Primer 开发者蓝",
    labDescription: "浅灰画布、清晰边界与开发者蓝",
    tags: ["开发者工具", "代码协作", "高密度"],
    voice: "技术化但直接，保持标签、状态和错误信息可扫描。",
    colors: {
      canvas: "#f6f8fa", surface: "#ffffff", ink: "#1f2328", muted: "#59636e",
      accent: "#0969da", actionAccent: "#0969da", accentSoft: "#ddf4ff", success: "#1a7f37", warning: "#9a6700",
      danger: "#d1242f", border: "#d1d9e0", onAccent: "#ffffff",
    },
    locales: {
      en: {
        name: "Primer developer blue",
        description: "A light-gray canvas, white surfaces, and a visible blue for developer tools and code collaboration",
        guidance: "Separate code-dense regions with borders and surfaces, using blue for links, primary actions, and current selection.",
        mappingNote: "Values map to Primer light functional tokens, using bgColor.muted as the project canvas and bgColor.default as the content surface.",
      },
    },
  },
];

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
}

export const COLOR_THEME_ID_ALIASES = deepFreeze({
  "minimal-tech": "ant-design",
  "editorial-commerce": "adobe-spectrum",
  "soft-lifestyle": "apple-hig",
  "future-tech": "google-material-3",
  "neo-brutal": "tdesign",
  glass: "fluent-2",
  retro: "github-primer",
});

export const colorThemes = deepFreeze(definitions);

export const labThemes = deepFreeze(colorThemes.map(function (theme) {
  return {
    id: theme.id,
    name: theme.labName,
    description: theme.labDescription,
    tags: theme.tags,
    colors: theme.colors,
    voice: theme.voice,
  };
}));

export function findColorTheme(value) {
  const requested = value == null ? "" : String(value);
  const id = COLOR_THEME_ID_ALIASES[requested] || requested;
  return colorThemes.find((theme) => theme.id === id) || colorThemes.find((theme) => theme.id === DEFAULT_COLOR_THEME_ID);
}

export function normalizeColorThemeId(value) {
  return findColorTheme(value).id;
}

export function colorThemeDesignSystemId(value) {
  return findColorTheme(value).designSystemId;
}

export function localizeColorTheme(value, locale = "zh") {
  const theme = typeof value === "object" && value ? value : findColorTheme(value);
  return locale === "en" ? { ...theme, ...(theme.locales?.en || {}) } : theme;
}

export function colorThemeLabel(value, locale = "zh") {
  return localizeColorTheme(value, locale).name;
}

export function colorThemePrompt(value, locale = "zh") {
  const theme = localizeColorTheme(value, locale);
  const colors = theme.colors;
  if (locale === "en") {
    return `${theme.name} (${theme.organization}, ${theme.guidelineUrl}): canvas ${colors.canvas}; surface ${colors.surface}; primary text ${colors.ink}; muted text ${colors.muted}; primary accent ${colors.accent}; text-action background ${colors.actionAccent}; on-accent text ${colors.onAccent}; soft accent ${colors.accentSoft}; border ${colors.border}; success ${colors.success}; warning ${colors.warning}; danger ${colors.danger}. ${theme.guidance} ${theme.mappingNote}`;
  }
  return `${theme.name}（${theme.organization}，${theme.guidelineUrl}）：画布 ${colors.canvas}；表面 ${colors.surface}；主文字 ${colors.ink}；次要文字 ${colors.muted}；主强调 ${colors.accent}；文字型主操作底色 ${colors.actionAccent}；强调色上文字 ${colors.onAccent}；柔和强调 ${colors.accentSoft}；边界 ${colors.border}；成功 ${colors.success}；警告 ${colors.warning}；危险 ${colors.danger}。${theme.guidance} ${theme.mappingNote}`;
}
