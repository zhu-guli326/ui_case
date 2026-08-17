export const DEFAULT_COLOR_THEME_ID = "airbnb";

const definitions = [
  brandTheme({
    id: "airbnb", organization: "Airbnb", name: "Airbnb 珊瑚红",
    description: "暖白画布 + Rausch 珊瑚红，适合消费、旅行与生活方式产品",
    guidance: "让摄影与留白主导页面，珊瑚红只承担主操作、搜索与关键状态。",
    colors: { canvas:"#ffffff", surface:"#f7f7f7", ink:"#222222", muted:"#6a6a6a", accent:"#ff385c", actionAccent:"#e00b41", accentSoft:"#ffd1da", success:"#2f8f4e", warning:"#b26a00", danger:"#c13515", border:"#dddddd", onAccent:"#ffffff" },
    tags:["消费","旅行","生活方式"], voice:"温暖、直接、可信。",
    enName:"Airbnb coral", enDescription:"Warm white surfaces with Airbnb Rausch coral for consumer, travel, and lifestyle products",
  }),
  brandTheme({
    id: "claude", organization: "Anthropic", name: "Claude 暖珊瑚",
    description: "奶油色画布、暖珊瑚 CTA 与深色产品表面，适合 AI 与编辑型体验",
    guidance: "避免冷蓝科技感，用奶油色、暖珊瑚和深色表面建立人文科技层级。",
    colors: { canvas:"#faf9f5", surface:"#f5f0e8", ink:"#141413", muted:"#6c6a64", accent:"#cc785c", actionAccent:"#a9583e", accentSoft:"#efe9de", success:"#5db872", warning:"#d4a017", danger:"#c64545", border:"#e6dfd8", onAccent:"#ffffff" },
    tags:["AI","编辑型","人文科技"], voice:"克制、温暖、解释性强。",
    enName:"Claude warm coral", enDescription:"Cream canvas, warm coral CTAs, and dark product surfaces for humanist AI experiences",
  }),
  brandTheme({
    id: "cursor", organization: "Cursor", name: "Cursor 橙",
    description: "暖奶油画布、近黑文字与高电压橙色，适合 AI 开发者工具与编辑型产品",
    guidance: "橙色只用于主 CTA 和品牌关键点；正文保持暖黑，辅助状态可用低饱和粉彩。",
    colors: { canvas:"#f7f7f4", surface:"#ffffff", ink:"#26251e", muted:"#807d72", accent:"#f54e00", actionAccent:"#d04200", accentSoft:"#fff0e8", success:"#1f8a65", warning:"#c08532", danger:"#cf2d56", border:"#e6e5e0", onAccent:"#ffffff" },
    tags:["AI","开发者工具","编辑型"], voice:"安静、自信、技术但不冷。",
    enName:"Cursor orange", enDescription:"Warm cream canvas with near-black ink and a high-voltage orange accent for AI developer tools",
  }),
  brandTheme({
    id: "binance", organization: "Binance", name: "Binance 黄黑",
    description: "近黑画布与高识别黄色主色，适合交易、金融与高频数据产品",
    guidance: "黄色承担主操作和价值强调；涨跌使用独立绿红语义，不与品牌色混用。",
    colors: { canvas:"#0b0e11", surface:"#1e2329", ink:"#eaecef", muted:"#929aa5", accent:"#fcd535", actionAccent:"#f0b90b", accentSoft:"#3a3a1f", success:"#0ecb81", warning:"#f0b90b", danger:"#f6465d", border:"#2b3139", onAccent:"#181a20" },
    tags:["金融","交易","深色"], voice:"高效、明确、数据优先。",
    enName:"Binance yellow & black", enDescription:"Near-black surfaces with iconic Binance yellow for trading and financial products",
  }),
  brandTheme({
    id: "bmw-m", organization: "BMW M", name: "BMW M 黑白三色",
    description: "纯黑画布、白色文字与 M 三色签名，适合汽车、性能与高端工程品牌",
    guidance: "黑白建立主层级，M 蓝/深蓝/红只作为签名式强调，不做大面积装饰。",
    colors: { canvas:"#000000", surface:"#1a1a1a", ink:"#ffffff", muted:"#7e7e7e", accent:"#1c69d4", actionAccent:"#0066b1", accentSoft:"#262626", success:"#0fa336", warning:"#f4b400", danger:"#e22718", border:"#3c3c3c", onAccent:"#ffffff" },
    tags:["汽车","高端","性能"], voice:"冷静、工程化、强视觉。",
    enName:"BMW M black & tricolor", enDescription:"Black canvas, white typography, and restrained M tricolor accents for premium performance products",
  }),
  brandTheme({
    id: "coinbase", organization: "Coinbase", name: "Coinbase 蓝白",
    description: "纯白画布与高纯度 Coinbase 蓝，适合金融、加密与机构级产品",
    guidance: "蓝色克制使用在主 CTA、图标和少量强调；大部分界面依赖白灰层级与卡片叠层。",
    colors: { canvas:"#ffffff", surface:"#f7f7f7", ink:"#0a0b0d", muted:"#7c828a", accent:"#0052ff", actionAccent:"#003ecc", accentSoft:"#eef3ff", success:"#05b169", warning:"#f4b000", danger:"#cf202f", border:"#dee1e6", onAccent:"#ffffff" },
    tags:["金融","机构级","极简"], voice:"安静、自信、机构化。",
    enName:"Coinbase blue", enDescription:"Pure white surfaces with concentrated Coinbase blue for institutional financial and crypto products",
  }),
  systemTheme({
    id:"apple-hig", organization:"Apple", name:"Apple 系统蓝", description:"克制系统蓝、明亮表面和高可读文字，适合内容优先的原生体验",
    sourceUrl:"https://developer.apple.com/design/human-interface-guidelines/", guidelineUrl:"https://developer.apple.com/design/human-interface-guidelines/color",
    guidance:"系统蓝只用于可操作元素、选择和焦点。", mappingNote:"Web 静态预览用 Hex；原生实现应使用动态语义 API。",
    colors:{ canvas:"#f2f2f7", surface:"#ffffff", ink:"#1d1d1f", muted:"#515154", accent:"#007aff", actionAccent:"#0066cc", accentSoft:"#e8f2ff", success:"#248a3d", warning:"#8a4b00", danger:"#d70015", border:"#d2d2d7", onAccent:"#ffffff" },
    tags:["原生体验","内容优先","克制"], voice:"简短、自然。", enName:"Apple system blue", enDescription:"Restrained system blue and bright content-first surfaces",
  }),
  systemTheme({
    id:"google-material-3", organization:"Google", name:"Material 3 紫", description:"柔和紫色与分层表面，适合自适应布局和富状态移动体验",
    sourceUrl:"https://m3.material.io/", guidelineUrl:"https://m3.material.io/styles/color/roles", guidance:"用容器色表达层级，用主色表达关键行动。", mappingNote:"Material 3 基线配色。",
    colors:{ canvas:"#fffbfe", surface:"#fffbfe", ink:"#1c1b1f", muted:"#49454f", accent:"#6750a4", actionAccent:"#6750a4", accentSoft:"#eaddff", success:"#386a20", warning:"#7d5700", danger:"#b3261e", border:"#79747e", onAccent:"#ffffff" },
    tags:["移动端","自适应","容器层级"], voice:"自然、友好。", enName:"Material 3 purple", enDescription:"Soft purple and layered surfaces for adaptive mobile experiences",
  }),
  systemTheme({
    id:"ant-design", organization:"Ant Group", name:"Ant Design 品牌蓝", description:"清晰企业蓝与中性灰阶，适合表格、表单和复杂业务流程",
    sourceUrl:"https://ant.design/", guidelineUrl:"https://ant.design/docs/spec/colors/", guidance:"用品牌蓝标记主要操作、选中与焦点。", mappingNote:"默认浅色 Seed / Map / Alias Token。",
    colors:{ canvas:"#f5f5f5", surface:"#ffffff", ink:"#1f1f1f", muted:"#595959", accent:"#1677ff", actionAccent:"#0958d9", accentSoft:"#e6f4ff", success:"#52c41a", warning:"#faad14", danger:"#ff4d4f", border:"#d9d9d9", onAccent:"#ffffff" },
    tags:["企业产品","高密度","业务流程"], voice:"直接、明确。", enName:"Ant Design blue", enDescription:"Precise enterprise blue with neutral grays for complex workflows",
  }),
  systemTheme({
    id:"fluent-2", organization:"Microsoft", name:"Fluent 2 蓝", description:"生产力蓝与柔和层级表面，适合跨平台工作流和协作应用",
    sourceUrl:"https://fluent2.microsoft.design/", guidelineUrl:"https://fluent2.microsoft.design/color-tokens/", guidance:"使用品牌蓝连接跨平台操作。", mappingNote:"Fluent 2 Web 浅色 Alias Token。",
    colors:{ canvas:"#fafafa", surface:"#ffffff", ink:"#242424", muted:"#616161", accent:"#0f6cbd", actionAccent:"#0f6cbd", accentSoft:"#ebf3fc", success:"#0e700e", warning:"#bc4b09", danger:"#b10e1c", border:"#d1d1d1", onAccent:"#ffffff" },
    tags:["生产力","跨平台","协作"], voice:"专业、包容。", enName:"Fluent 2 blue", enDescription:"Productivity blue and softly layered cross-platform surfaces",
  }),
  systemTheme({
    id:"tdesign", organization:"Tencent", name:"TDesign 品牌蓝", description:"鲜明蓝色与轻灰表面，适合跨端企业应用和运营工具",
    sourceUrl:"https://tdesign.tencent.com/", guidelineUrl:"https://tdesign.tencent.com/design/color", guidance:"保持蓝色操作层级一致。", mappingNote:"TDesign Web 默认浅色语义变量。",
    colors:{ canvas:"#eeeeee", surface:"#ffffff", ink:"#1a1a1a", muted:"#666666", accent:"#0052d9", actionAccent:"#0052d9", accentSoft:"#f2f3ff", success:"#2ba471", warning:"#e37318", danger:"#d54941", border:"#e8e8e8", onAccent:"#ffffff" },
    tags:["跨端","企业应用","运营工具"], voice:"简洁、稳健。", enName:"TDesign blue", enDescription:"Vivid blue with light-gray surfaces for enterprise tools",
  }),
  systemTheme({
    id:"carbon-design", organization:"IBM", name:"Carbon 蓝", description:"强对比 IBM 蓝与结构化灰阶，适合复杂数据、分析和企业工作台",
    sourceUrl:"https://carbondesignsystem.com/", guidelineUrl:"https://carbondesignsystem.com/elements/color/tokens/", guidance:"用灰阶组织大规模信息，只让蓝色承担主要行动。", mappingNote:"Carbon White 主题。",
    colors:{ canvas:"#ffffff", surface:"#f4f4f4", ink:"#161616", muted:"#525252", accent:"#0f62fe", actionAccent:"#0f62fe", accentSoft:"#d0e2ff", success:"#24a148", warning:"#f1c21b", danger:"#da1e28", border:"#e0e0e0", onAccent:"#ffffff" },
    tags:["复杂数据","分析","企业工作台"], voice:"准确、可扫描。", enName:"Carbon blue", enDescription:"IBM blue and structured grays for complex data workspaces",
  }),
  systemTheme({
    id:"adobe-spectrum", organization:"Adobe", name:"Spectrum 蓝", description:"清晰行动蓝与稳定中性色，适合创意工具和复杂多面板工作区",
    sourceUrl:"https://spectrum.adobe.com/", guidelineUrl:"https://spectrum.adobe.com/page/color-system/", guidance:"让颜色表达操作语义和反馈。", mappingNote:"Spectrum 2 浅色语义色。",
    colors:{ canvas:"#f8f8f8", surface:"#ffffff", ink:"#292929", muted:"#505050", accent:"#3b63fb", actionAccent:"#3b63fb", accentSoft:"#e5f0fe", success:"#079355", warning:"#d45b00", danger:"#f03823", border:"#dadada", onAccent:"#ffffff" },
    tags:["创意工具","复杂工作区","多面板"], voice:"精确、克制。", enName:"Spectrum blue", enDescription:"Action blue and stable neutral panels for creative tools",
  }),
  systemTheme({
    id:"github-primer", organization:"GitHub", name:"Primer 开发者蓝", description:"浅灰画布、白色表面与高可见蓝色，适合开发者工具和代码协作",
    sourceUrl:"https://primer.style/", guidelineUrl:"https://primer.style/product/primitives/color/", guidance:"用边界和表面分隔代码密集区域。", mappingNote:"Primer 浅色功能 Token。",
    colors:{ canvas:"#f6f8fa", surface:"#ffffff", ink:"#1f2328", muted:"#59636e", accent:"#0969da", actionAccent:"#0969da", accentSoft:"#ddf4ff", success:"#1a7f37", warning:"#9a6700", danger:"#d1242f", border:"#d1d9e0", onAccent:"#ffffff" },
    tags:["开发者工具","代码协作","高密度"], voice:"技术化但直接。", enName:"Primer developer blue", enDescription:"Light-gray canvas and visible blue for developer tools",
  }),
];

function brandTheme(config) {
  return {
    id: config.id,
    designSystemId: "custom",
    organization: config.organization,
    sourceUrl: `https://github.com/VoltAgent/awesome-design-md/tree/main/design-md/${config.id}`,
    guidelineUrl: `https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/${config.id}/DESIGN.md`,
    name: config.name,
    description: config.description,
    guidance: config.guidance,
    mappingNote: `来自 awesome-design-md 的 ${config.organization} DESIGN.md 分析。`,
    labName: config.name,
    labDescription: config.description,
    tags: config.tags,
    voice: config.voice,
    colors: config.colors,
    locales: { en: { name: config.enName, description: config.enDescription } },
  };
}

function systemTheme(config) {
  return {
    id: config.id,
    designSystemId: config.id,
    organization: config.organization,
    sourceUrl: config.sourceUrl,
    guidelineUrl: config.guidelineUrl,
    name: config.name,
    description: config.description,
    guidance: config.guidance,
    mappingNote: config.mappingNote,
    labName: config.name,
    labDescription: config.description,
    tags: config.tags,
    voice: config.voice,
    colors: config.colors,
    locales: { en: { name: config.enName, description: config.enDescription } },
  };
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
}

export const COLOR_THEME_ID_ALIASES = deepFreeze({
  "minimal-tech": "cursor",
  "editorial-commerce": "airbnb",
  "soft-lifestyle": "claude",
  "future-tech": "google-material-3",
  "neo-brutal": "bmw-m",
  glass: "fluent-2",
  retro: "binance",
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
