<<<<<<< HEAD
import { labThemes } from "../catalog/color-themes.js";

=======
>>>>>>> b0afc67405740d9ad16be3979c2e00244622a074
export const componentKinds = [
  "navigation", "button", "input", "select", "card", "list", "dialog", "notification",
];

export const templates = [
  {
<<<<<<< HEAD
    id: "dashboard",
    name: "SaaS Dashboard",
    description: "指标概览、项目进度与团队协作",
    icon: "DB",
    sections: [{ type: "navigation" }, { type: "card" }, { type: "list" }, { type: "button", label: "新建项目" }, { type: "notification", message: "项目已创建" }],
  },
  {
    id: "commerce",
    name: "电商页面",
    description: "商品发现、筛选、详情与购买行动",
    icon: "EC",
    sections: [{ type: "navigation" }, { type: "card" }, { type: "select" }, { type: "button", label: "加入购物袋" }, { type: "notification", message: "已加入购物袋" }],
  },
  {
    id: "landing",
    name: "产品落地页",
    description: "价值主张、功能说明与转化行动",
    icon: "LP",
    sections: [{ type: "navigation" }, { type: "card" }, { type: "button", label: "免费开始" }, { type: "notification", message: "欢迎开始体验" }],
  },
  {
    id: "social",
    name: "社交 App",
    description: "动态流、内容互动与个人关系",
    icon: "SO",
    sections: [{ type: "navigation" }, { type: "input" }, { type: "list" }, { type: "button", label: "发布" }, { type: "notification", message: "动态已发布" }],
  },
  {
=======
>>>>>>> b0afc67405740d9ad16be3979c2e00244622a074
    id: "login",
    name: "登录",
    description: "身份验证、输入校验与登录反馈",
    icon: "LG",
    sections: [
      { type: "navigation", title: "Workspace" },
      { type: "card", title: "欢迎回来" },
      { type: "input", id: "email", label: "电子邮箱", value: "hello@example.com" },
      { type: "input", id: "password", label: "密码", value: "password", password: true },
      { type: "select", id: "workspace", label: "工作空间", options: ["Atlas Studio", "Personal"] },
      { type: "button", label: "登录" },
      { type: "notification", message: "登录成功，正在进入工作空间" },
    ],
  },
  {
    id: "account-settings",
    name: "账户设置",
    description: "资料编辑、偏好设置与保存反馈",
    icon: "AC",
    sections: [
      { type: "navigation", title: "账户设置" },
      { type: "card", title: "个人资料" },
      { type: "input", id: "display-name", label: "显示名称", value: "Ju Guli" },
      { type: "input", id: "email", label: "电子邮箱", value: "hello@example.com" },
      { type: "select", id: "language", label: "界面语言", options: ["简体中文", "English"] },
      { type: "list", items: ["产品更新", "安全提醒", "每周摘要"] },
      { type: "button", label: "保存修改" },
      { type: "notification", message: "账户设置已保存" },
    ],
  },
  {
    id: "list-detail",
    name: "列表详情",
    description: "数据浏览、状态筛选与详情弹窗",
    icon: "LD",
    sections: [
      { type: "navigation", title: "项目" },
      { type: "select", id: "status", label: "状态", options: ["全部状态", "进行中", "已归档"] },
      { type: "list", items: ["Atlas Mobile", "Northstar Web", "Relay Console"] },
      { type: "card", title: "Atlas Mobile" },
      { type: "button", label: "查看详情" },
      { type: "dialog", title: "项目详情" },
      { type: "notification", message: "项目状态已更新" },
    ],
  },
];

export const systems = [
  {
    id: "apple",
    name: "Apple HIG",
    shortName: "Apple",
    status: "HIG 模拟预览",
    platform: "SwiftUI",
    sourceUrl: "https://developer.apple.com/design/human-interface-guidelines/components/",
    note: "Apple 没有与 antd 对等的官方 Web 组件库；此处为 HIG 规则的 Web 模拟，原生导出使用 SwiftUI。",
    mapping: {
      navigation: "NavigationStack / TabView",
      button: "Button",
      input: "TextField / SecureField",
      select: "Picker",
      card: "GroupBox",
      list: "List",
      dialog: "Sheet / Alert",
      notification: "Overlay feedback",
    },
    tokens: { radiusControl: "10px", radiusPanel: "14px", controlHeight: "44px", spacing: "8pt", focus: "system tint", motion: "200ms" },
  },
  {
    id: "material",
    name: "Material 3",
    shortName: "Material",
    status: "Material 3 适配器",
    platform: "Web / Android",
    sourceUrl: "https://m3.material.io/components",
    note: "预览遵循 Material 3。官方 @material/web 当前处于维护模式，生产导出前应重新评估依赖状态。",
    mapping: {
      navigation: "Top App Bar / Navigation Bar",
      button: "Filled Button",
      input: "Outlined Text Field",
      select: "Exposed Dropdown Menu",
      card: "Outlined Card",
      list: "List",
      dialog: "Basic Dialog",
      notification: "Snackbar",
    },
    tokens: { radiusControl: "20px", radiusPanel: "12px", controlHeight: "48px", spacing: "8dp", focus: "primary state layer", motion: "200ms" },
  },
  {
    id: "ant",
    name: "Ant Design",
    shortName: "Ant",
    status: "官方 React API",
    platform: "React / Web",
    sourceUrl: "https://ant.design/components/overview/",
    note: "预览适配 Ant Design 的结构与 Token；代码导出直接使用官方 React antd 组件。",
    mapping: {
      navigation: "Layout / Menu",
      button: "Button type=primary",
      input: "Input / Input.Password",
      select: "Select",
      card: "Card",
      list: "List / Table",
      dialog: "Modal",
      notification: "message / notification",
    },
    tokens: { radiusControl: "6px", radiusPanel: "8px", controlHeight: "32px", spacing: "8px", focus: "control outline", motion: "200ms" },
  },
  {
    id: "tdesign",
    name: "TDesign",
    shortName: "TDesign",
    status: "官方 React API",
    platform: "React / Vue / Web",
    sourceUrl: "https://tdesign.tencent.com/react/overview",
    note: "预览适配 TDesign 的企业级组件结构与 Design Token；React 代码导出使用官方 tdesign-react 组件。",
    mapping: {
      navigation: "Layout / Menu",
      button: "Button theme=primary",
      input: "Input",
      select: "Select",
      card: "Card",
      list: "List / Table",
      dialog: "Dialog",
      notification: "MessagePlugin / NotificationPlugin",
    },
    tokens: { radiusControl: "3px", radiusPanel: "6px", controlHeight: "32px", spacing: "8px", focus: "brand color outline", motion: "200ms" },
  },
  {
    id: "carbon",
    name: "IBM Carbon",
    shortName: "Carbon",
    status: "公开 React / Web Components API",
    platform: "React / Web Components",
    packageName: "@carbon/react",
    sourceUrl: "https://carbondesignsystem.com/",
    note: "基于 Carbon 公开组件文档的实验室适配，不代表 IBM 背书或合作。",
    mapping: { navigation: "Header / SideNav", button: "Button", input: "TextInput", select: "Select", card: "Tile", list: "DataTable", dialog: "Modal", notification: "InlineNotification" },
    tokens: { radiusControl: "0px", radiusPanel: "0px", controlHeight: "40px", spacing: "8px", focus: "2px interactive outline", motion: "productive" },
  },
  {
    id: "fluent",
    name: "Microsoft Fluent 2",
    shortName: "Fluent",
    status: "公开 React Components API",
    platform: "React / Windows",
    packageName: "@fluentui/react-components",
    sourceUrl: "https://fluent2.microsoft.design/",
    note: "基于 Fluent 2 公开规范与 React Components API 的实验室适配。",
    mapping: { navigation: "Toolbar / TabList", button: "Button", input: "Input", select: "Dropdown", card: "Card", list: "DataGrid", dialog: "Dialog", notification: "Toast" },
    tokens: { radiusControl: "4px", radiusPanel: "8px", controlHeight: "32px", spacing: "4px", focus: "brand stroke", motion: "durationNormal" },
  },
  {
    id: "polaris",
    name: "Shopify Polaris",
    shortName: "Polaris",
    status: "公开 Web Components API",
    platform: "Web Components",
    packageName: "@shopify/polaris",
    sourceUrl: "https://polaris.shopify.com/components",
    note: "基于 Polaris 公开文档的商家后台适配，不代表 Shopify 背书或合作。",
    mapping: { navigation: "Navigation", button: "Button", input: "TextField", select: "Select", card: "Card", list: "IndexTable", dialog: "Modal", notification: "Banner" },
    tokens: { radiusControl: "8px", radiusPanel: "12px", controlHeight: "36px", spacing: "4px", focus: "focused border", motion: "duration-150" },
  },
  {
    id: "primer",
    name: "GitHub Primer",
    shortName: "Primer",
    status: "公开 React API",
    platform: "React / Web",
    packageName: "@primer/react",
    sourceUrl: "https://primer.style/product/components/",
    note: "基于 Primer 公开组件文档的产品工作流适配。",
    mapping: { navigation: "PageLayout / NavList", button: "Button", input: "TextInput", select: "Select", card: "Box", list: "DataTable", dialog: "Dialog", notification: "Flash" },
    tokens: { radiusControl: "6px", radiusPanel: "6px", controlHeight: "32px", spacing: "8px", focus: "focus outline", motion: "duration.fast" },
  },
  {
    id: "spectrum",
    name: "Adobe Spectrum",
    shortName: "Spectrum",
    status: "公开 React Aria / Spectrum API",
    platform: "React / Web Components",
    packageName: "@adobe/react-spectrum",
    sourceUrl: "https://spectrum.adobe.com/page/components/",
    note: "基于 Spectrum 公开组件指南的创意工具适配。",
    mapping: { navigation: "Tabs", button: "ActionButton", input: "TextField", select: "Picker", card: "IllustratedMessage", list: "TableView", dialog: "Dialog", notification: "Toast" },
    tokens: { radiusControl: "5px", radiusPanel: "8px", controlHeight: "32px", spacing: "8px", focus: "focus-ring", motion: "duration-100" },
  },
  {
    id: "mui",
    name: "MUI",
    shortName: "MUI",
    status: "公开 React API",
    platform: "React / Web",
    packageName: "@mui/material",
    sourceUrl: "https://mui.com/material-ui/all-components/",
    note: "基于 MUI 公开组件 API 的 React 页面适配。",
    mapping: { navigation: "AppBar / Tabs", button: "Button", input: "TextField", select: "Select", card: "Card", list: "DataGrid", dialog: "Dialog", notification: "Snackbar" },
    tokens: { radiusControl: "4px", radiusPanel: "8px", controlHeight: "40px", spacing: "8px", focus: "primary outline", motion: "theme.transitions" },
  },
  {
    id: "chakra",
    name: "Chakra UI",
    shortName: "Chakra",
    status: "公开 React API",
    platform: "React / Web",
    packageName: "@chakra-ui/react",
    sourceUrl: "https://chakra-ui.com/docs/components/concepts/overview",
    note: "基于 Chakra UI 公开组件文档的可主题化 React 适配。",
    mapping: { navigation: "Tabs", button: "Button", input: "Input", select: "Select", card: "Card", list: "Table", dialog: "Dialog", notification: "Toast" },
    tokens: { radiusControl: "6px", radiusPanel: "8px", controlHeight: "40px", spacing: "4px", focus: "colorPalette focus ring", motion: "moderate" },
  },
  {
    id: "mantine",
    name: "Mantine",
    shortName: "Mantine",
    status: "公开 React API",
    platform: "React / Web",
    packageName: "@mantine/core",
    sourceUrl: "https://mantine.dev/core/package/",
    note: "基于 Mantine 公开组件与 Notifications 扩展文档的适配。",
    mapping: { navigation: "AppShell / Tabs", button: "Button", input: "TextInput", select: "Select", card: "Card", list: "Table", dialog: "Modal", notification: "Notifications" },
    tokens: { radiusControl: "4px", radiusPanel: "8px", controlHeight: "36px", spacing: "8px", focus: "primary outline", motion: "150ms" },
  },
  {
    id: "radix",
    name: "Radix Primitives",
    shortName: "Radix",
    status: "公开无样式 React Primitives",
    platform: "React / Web",
    packageName: "@radix-ui/react-dialog",
    sourceUrl: "https://www.radix-ui.com/primitives/docs/overview/introduction",
    note: "Radix 提供行为与可访问性原语；视觉由当前品牌主题和本实验室 Token 负责。",
    mapping: { navigation: "Tabs", button: "Primitive button", input: "Label / input", select: "Select", card: "Custom surface", list: "Custom collection", dialog: "Dialog", notification: "Toast" },
    tokens: { radiusControl: "6px", radiusPanel: "8px", controlHeight: "36px", spacing: "8px", focus: "custom focus ring", motion: "custom" },
  },
  {
    id: "shadcn",
    name: "shadcn/ui",
    shortName: "shadcn",
    status: "公开可复制组件源码",
    platform: "React / Web",
    packageName: "components/ui",
    sourceUrl: "https://ui.shadcn.com/docs/components",
    note: "shadcn/ui 是可复制源码集合而非传统依赖包；导出内容使用本地 components/ui 路径。",
    mapping: { navigation: "NavigationMenu / Tabs", button: "Button", input: "Input", select: "Select", card: "Card", list: "Table", dialog: "Dialog", notification: "Sonner", },
    tokens: { radiusControl: "6px", radiusPanel: "8px", controlHeight: "36px", spacing: "4px", focus: "ring", motion: "tailwind duration" },
  },
  {
    id: "headless",
    name: "Headless UI",
    shortName: "Headless",
    status: "公开无样式 React / Vue API",
    platform: "React / Vue",
    packageName: "@headlessui/react",
    sourceUrl: "https://headlessui.com/",
    note: "Headless UI 只提供交互与可访问性行为；预览视觉来自当前品牌主题。",
    mapping: { navigation: "Tab", button: "Button", input: "Input", select: "Listbox / Combobox", card: "Custom surface", list: "Custom collection", dialog: "Dialog", notification: "Custom live region" },
    tokens: { radiusControl: "4px", radiusPanel: "6px", controlHeight: "36px", spacing: "8px", focus: "custom focus ring", motion: "custom transition" },
  },
  {
    id: "element-plus",
    name: "Element Plus",
    shortName: "Element",
    status: "公开 Vue 3 API",
    platform: "Vue / Web",
    packageName: "element-plus",
    sourceUrl: "https://element-plus.org/en-US/component/overview.html",
    note: "基于 Element Plus 公开 Vue 3 组件文档的后台页面适配。",
    mapping: { navigation: "Menu", button: "ElButton", input: "ElInput", select: "ElSelect", card: "ElCard", list: "ElTable", dialog: "ElDialog", notification: "ElMessage" },
    tokens: { radiusControl: "4px", radiusPanel: "4px", controlHeight: "32px", spacing: "8px", focus: "primary border", motion: "0.2s" },
  },
  {
    id: "arco",
    name: "Arco Design",
    shortName: "Arco",
    status: "公开 React / Vue API",
    platform: "React / Vue / Web",
    packageName: "@arco-design/web-react",
    sourceUrl: "https://arco.design/react/components/overview",
    note: "基于 Arco Design 公开组件文档的企业应用适配。",
    mapping: { navigation: "Layout / Menu", button: "Button", input: "Input", select: "Select", card: "Card", list: "Table", dialog: "Modal", notification: "Message" },
    tokens: { radiusControl: "2px", radiusPanel: "4px", controlHeight: "32px", spacing: "8px", focus: "brand outline", motion: "cubic-bezier" },
  },
  {
    id: "semi",
    name: "Semi Design",
    shortName: "Semi",
    status: "公开 React API",
    platform: "React / Web",
    packageName: "@douyinfe/semi-ui",
    sourceUrl: "https://semi.design/en-US/start/introduction",
    note: "基于 Semi Design 公开组件文档的内容与企业产品适配。",
    mapping: { navigation: "Navigation", button: "Button", input: "Input", select: "Select", card: "Card", list: "Table", dialog: "Modal", notification: "Toast" },
    tokens: { radiusControl: "3px", radiusPanel: "6px", controlHeight: "32px", spacing: "8px", focus: "brand outline", motion: "motion duration" },
  },
  {
    id: "atlassian",
    name: "Atlassian Design System",
    shortName: "Atlassian",
    status: "公开 React API",
    platform: "React / Web",
    packageName: "@atlaskit/button",
    sourceUrl: "https://atlassian.design/components/",
    note: "基于 Atlassian Design System 公开组件文档的协作产品适配。",
    mapping: { navigation: "Side navigation", button: "Button", input: "Textfield", select: "Select", card: "Box", list: "DynamicTable", dialog: "ModalDialog", notification: "Flag" },
    tokens: { radiusControl: "3px", radiusPanel: "6px", controlHeight: "32px", spacing: "8px", focus: "focus ring", motion: "medium" },
  },
];

<<<<<<< HEAD
export const themes = labThemes;

export const brandReferences = [
  { id: "linear", name: "Linear", description: "冷静、精确、面向高效软件团队", accent: "#5e6ad2" },
  { id: "apple", name: "Apple", description: "清晰、克制，以内容与留白建立秩序", accent: "#0071e3" },
  { id: "stripe", name: "Stripe", description: "明亮渐变、技术可信度与商业表达", accent: "#635bff" },
  { id: "notion", name: "Notion", description: "中性、内容优先、工具感自然", accent: "#222222" },
  { id: "airbnb", name: "Airbnb", description: "温暖、人本、适合生活方式产品", accent: "#ff385c" },
];

export const changeIntensities = [
  { id: "light", name: "轻度", description: "只调整颜色、字体和圆角" },
  { id: "standard", name: "标准", description: "替换组件与局部布局细节" },
  { id: "deep", name: "深度", description: "按目标体系重新组织页面" },
  { id: "strict", name: "严格", description: "尽可能遵循指定系统规范" },
=======
export const themes = [
  {
    id: "minimal-tech",
    name: "极简科技",
    description: "高对比功能主义，颜色只服务于状态和行动",
    tags: ["功能主义", "高对比", "任务导向"],
    colors: { canvas: "#f4f6f4", surface: "#ffffff", ink: "#151716", muted: "#5d625e", accent: "#168143", accentSoft: "#e1f3e7", danger: "#b42318" },
    voice: "直接、可扫描，以任务和状态为中心。",
  },
  {
    id: "editorial-commerce",
    name: "编辑型时尚",
    description: "克制的零售编辑感，留白与内容层级优先",
    tags: ["编辑感", "零售", "内容优先"],
    colors: { canvas: "#f7f4ef", surface: "#fffdfa", ink: "#2d251f", muted: "#716961", accent: "#a45855", accentSoft: "#f2e4e2", danger: "#a33832" },
    voice: "简短、具体，避免促销堆叠。",
  },
  {
    id: "soft-lifestyle",
    name: "柔和生活方式",
    description: "温和但明确，适合内容、健康与日常任务",
    tags: ["亲和", "柔和", "生活方式"],
    colors: { canvas: "#f7faf8", surface: "#ffffff", ink: "#282421", muted: "#68615d", accent: "#427a68", accentSoft: "#e4f0eb", danger: "#a23d36" },
    voice: "温和但不含糊，用具体下一步取代空泛鼓励。",
  },
>>>>>>> b0afc67405740d9ad16be3979c2e00244622a074
];

export const devices = [
  { id: "iphone", name: "iPhone", width: 390, height: 844 },
  { id: "android", name: "Android", width: 412, height: 915 },
  { id: "desktop", name: "Desktop", width: 1120, height: 720 },
];

export function findTemplate(id) { return templates.find((item) => item.id === id) || templates[1]; }
export function findSystem(id) { return systems.find((item) => item.id === id) || systems[2]; }
export function findTheme(id) { return themes.find((item) => item.id === id) || themes[0]; }
export function findDevice(id) { return devices.find((item) => item.id === id) || devices[2]; }
<<<<<<< HEAD
export function findBrandReference(id) { return brandReferences.find((item) => item.id === id) || brandReferences[0]; }
export function findChangeIntensity(id) { return changeIntensities.find((item) => item.id === id) || changeIntensities[1]; }
=======
>>>>>>> b0afc67405740d9ad16be3979c2e00244622a074

export function buildTokenExport(state) {
  const system = findSystem(state.system);
  const theme = findTheme(state.theme);
  const device = findDevice(state.device);
  return {
    schemaVersion: 1,
    pageTemplate: state.template,
    designSystem: { id: system.id, name: system.name, status: system.status, source: system.sourceUrl },
    brandTheme: { id: theme.id, name: theme.name, colors: theme.colors, voice: theme.voice },
    device: { id: device.id, width: device.width, height: device.height },
    appearance: state.appearance,
    components: system.mapping,
    systemTokens: system.tokens,
  };
}

export function buildCodeExport(state) {
  const template = findTemplate(state.template);
  if (state.system === "apple") return buildSwiftUI(template);
  if (state.system === "material") return buildMaterial(template);
  if (state.system === "tdesign") return buildTDesign(template);
  if (state.system === "ant") return buildAnt(template);
  return buildSystemAdapter(template, findSystem(state.system));
}

function buildSystemAdapter(template, system) {
  const componentImports = [...new Set([system.mapping.button, system.mapping.input, system.mapping.select, system.mapping.card, system.mapping.dialog].map((value) => value.split(/[ /]/)[0]).filter((value) => /^[A-Z][A-Za-z]+$/.test(value)))];
  const importLine = system.id === "shadcn"
    ? `import { Button } from '@/components/ui/button';\nimport { Card } from '@/components/ui/card';\nimport { Input } from '@/components/ui/input';`
    : `import { ${componentImports.join(", ")} } from '${system.packageName}';`;
  return `${importLine}

// Adapter blueprint for ${system.name}. Verify package version and exact imports before production use.
// Public guideline: ${system.sourceUrl}
export function ${pascal(template.id)}Page() {
  return (
    <main data-design-system="${system.id}">
      <header><h1>${template.name}</h1></header>
      {/* ${system.mapping.card}: page surface */}
      {/* ${system.mapping.input}: email field */}
      {/* ${system.mapping.select}: language selection */}
      {/* ${system.mapping.button}: primary save action */}
      {/* ${system.mapping.dialog}: confirmation flow */}
    </main>
  );
}`;
}

function buildSwiftUI(template) {
  return `import SwiftUI\n\nstruct ${pascal(template.id)}View: View {\n  @State private var showDialog = false\n\n  var body: some View {\n    NavigationStack {\n      Form {\n${swiftSections(template.sections)}\n      }\n      .navigationTitle("${template.name}")\n      .alert("操作完成", isPresented: $showDialog) { Button("好") {} }\n    }\n  }\n}`;
}

function swiftSections(sections) {
  return sections.filter((section) => section.type !== "navigation").map((section) => {
    if (section.type === "input") return `        TextField("${section.label}", text: .constant("${section.value}"))`;
    if (section.type === "select") return `        Picker("${section.label}", selection: .constant("${section.options[0]}")) { Text("${section.options[0]}").tag("${section.options[0]}") }`;
    if (section.type === "button") return `        Button("${section.label}") { showDialog = true }`;
    if (section.type === "list") return section.items.map((item) => `        Text("${item}")`).join("\n");
    return "";
  }).filter(Boolean).join("\n");
}

function buildMaterial(template) {
  return `import '@material/web/button/filled-button.js';\nimport '@material/web/textfield/outlined-text-field.js';\nimport '@material/web/select/outlined-select.js';\n\n// @material/web is currently in maintenance mode. Review before production use.\nexport function ${pascal(template.id)}Page() {\n  return html\`\n    <main class="page">\n      <header><h1>${template.name}</h1></header>\n      <md-outlined-text-field label="电子邮箱"></md-outlined-text-field>\n      <md-outlined-select label="选项"></md-outlined-select>\n      <md-filled-button>保存</md-filled-button>\n    </main>\n  \`;\n}`;
}

function buildAnt(template) {
  return `import { Button, Card, Form, Input, Layout, List, Modal, Select, message } from 'antd';\n\nexport function ${pascal(template.id)}Page() {\n  const [open, setOpen] = React.useState(false);\n  const [api, contextHolder] = message.useMessage();\n\n  return (\n    <Layout>\n      {contextHolder}\n      <Layout.Header>${template.name}</Layout.Header>\n      <Layout.Content>\n        <Card title="${template.name}">\n          <Form layout="vertical">\n            <Form.Item label="电子邮箱"><Input /></Form.Item>\n            <Form.Item label="界面语言"><Select options={[{ value: 'zh', label: '简体中文' }]} /></Form.Item>\n            <Button type="primary" onClick={() => api.success('已保存')}>保存修改</Button>\n          </Form>\n        </Card>\n      </Layout.Content>\n      <Modal open={open} onCancel={() => setOpen(false)} title="详情" />\n    </Layout>\n  );\n}`;
}

function buildTDesign(template) {
  return `import { Button, Card, Dialog, Form, Input, Layout, List, MessagePlugin, Select } from 'tdesign-react';

export function ${pascal(template.id)}Page() {
  const [open, setOpen] = React.useState(false);

  return (
    <Layout>
      <Layout.Header>${template.name}</Layout.Header>
      <Layout.Content>
        <Card title="${template.name}">
          <Form layout="vertical">
            <Form.FormItem label="电子邮箱"><Input /></Form.FormItem>
            <Form.FormItem label="界面语言"><Select options={[{ value: 'zh', label: '简体中文' }]} /></Form.FormItem>
            <Button theme="primary" onClick={() => MessagePlugin.success('已保存')}>保存修改</Button>
          </Form>
        </Card>
      </Layout.Content>
      <Dialog visible={open} onClose={() => setOpen(false)} header="详情" />
    </Layout>
  );
}`;
}

function pascal(value) { return value.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(""); }
