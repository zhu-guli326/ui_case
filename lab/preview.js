import { findSystem, findTemplate, findTheme } from "./lab-data.js";

const root = document.querySelector("#previewRoot");
const query = new URL(window.location.href).searchParams;
let state = {
  template: query.get("template") || "account-settings",
  system: query.get("system") || "ant",
  theme: query.get("theme") || "minimal-tech",
  appearance: query.get("appearance") || "light",
  device: query.get("device") || "desktop",
};

window.addEventListener("message", (event) => {
  if (event.source !== window.parent || event.data?.type !== "image2-lab-state") return;
  state = { ...state, ...event.data.state };
  render();
});

render();

function render() {
  const template = findTemplate(state.template);
  const system = findSystem(state.system);
  const theme = findTheme(state.theme);
  document.documentElement.dataset.system = system.id;
  document.documentElement.dataset.appearance = state.appearance;
  document.documentElement.dataset.device = state.device;
  setSystemTokens(system);
  setTheme(theme, state.appearance);
  root.innerHTML = `<div class="system-page ${escapeHtml(template.id)}">
    ${renderNavigation(template, system)}
    <section class="page-content">
      ${renderTemplate(template, system)}
    </section>
    <div class="preview-toast" role="status" hidden></div>
    <dialog class="preview-dialog"><form method="dialog"><button class="dialog-close" aria-label="关闭">×</button><h2>${escapeHtml(dialogTitle(template))}</h2><p>${escapeHtml(dialogBody(template))}</p><button class="primary-control" value="confirm">确认</button></form></dialog>
  </div>`;
  bindInteractions(template);
}

function renderNavigation(template, system) {
  const navName = system.mapping.navigation.split(" / ")[0];
  return `<header class="system-nav"><div class="nav-brand"><span class="brand-symbol" aria-hidden="true"></span><strong>Atlas</strong></div><nav aria-label="页面导航"><button class="nav-item is-current" type="button">${escapeHtml(template.name)}</button><button class="nav-item" type="button">活动</button><button class="nav-item" type="button">团队</button></nav><button class="avatar" type="button" aria-label="账户菜单">JG</button><small>${escapeHtml(navName)}</small></header>`;
}

function renderTemplate(template, system) {
  if (template.id === "login") return renderLogin(template, system);
  if (template.id === "list-detail") return renderListDetail(template, system);
  return renderAccount(template, system);
}

function renderLogin(template, system) {
  return `<section class="login-layout"><div class="login-intro"><span class="system-mark">${escapeHtml(system.shortName)}</span><h1>欢迎回来</h1><p>继续进入 Atlas Studio，查看团队的设计与发布状态。</p></div><form class="form-surface" data-action-form><h2>登录</h2>${field("电子邮箱", "hello@example.com", "email")}${field("密码", "password", "password")}${selectField("工作空间", ["Atlas Studio", "Personal"])}<button class="primary-control" type="submit">登录</button><button class="secondary-control" type="button">使用通行密钥</button></form></section>`;
}

function renderAccount(template, system) {
  return `<div class="content-heading"><div><p class="context-label">Workspace / Account</p><h1>账户设置</h1><p>管理公开资料、语言偏好和消息通知。</p></div><span class="system-pill">${escapeHtml(system.mapping.card)}</span></div><div class="account-layout"><aside class="settings-list" aria-label="设置分类"><button class="is-current" type="button">个人资料</button><button type="button">安全</button><button type="button">通知</button><button type="button">账单</button></aside><form class="form-surface" data-action-form><div class="profile-line"><span class="profile-avatar">JG</span><div><strong>个人资料</strong><p>这些信息会显示在团队空间中。</p></div><button class="secondary-control compact" type="button">更换头像</button></div>${field("显示名称", "Ju Guli", "text")}${field("电子邮箱", "hello@example.com", "email")}${selectField("界面语言", ["简体中文", "English"])}<fieldset class="check-list"><legend>消息通知</legend>${["产品更新", "安全提醒", "每周摘要"].map((item, index) => `<label><input type="checkbox" ${index < 2 ? "checked" : ""}><span>${item}</span></label>`).join("")}</fieldset><div class="form-actions"><button class="secondary-control" type="button" data-dialog-trigger>取消</button><button class="primary-control" type="submit">保存修改</button></div></form></div>`;
}

function renderListDetail(template, system) {
  const rows = [["Atlas Mobile", "进行中", "今天"], ["Northstar Web", "待审核", "昨天"], ["Relay Console", "已发布", "8 月 11 日"]];
  return `<div class="content-heading"><div><p class="context-label">Workspace / Projects</p><h1>项目</h1><p>跟踪正在进行的设计、负责人和最近更新。</p></div><button class="primary-control" type="button" data-dialog-trigger>新建项目</button></div><div class="list-toolbar">${selectField("状态", ["全部状态", "进行中", "已归档"])}<label class="search-field"><span>搜索</span><input type="search" placeholder="搜索项目"></label></div><section class="data-list" aria-label="项目列表"><div class="list-head"><span>项目</span><span>状态</span><span>更新</span><span></span></div>${rows.map((row, index) => `<button class="list-row${index === 0 ? " is-selected" : ""}" type="button" data-row-detail><strong>${row[0]}</strong><span><i></i>${row[1]}</span><span>${row[2]}</span><b>查看</b></button>`).join("")}</section><section class="detail-surface"><div><span class="system-mark">${escapeHtml(system.shortName)}</span><h2>Atlas Mobile</h2><p>移动端设计系统迁移与组件审计。</p></div><dl><div><dt>负责人</dt><dd>Ju Guli</dd></div><div><dt>状态</dt><dd>进行中</dd></div><div><dt>进度</dt><dd>68%</dd></div></dl></section>`;
}

function field(label, value, type) { return `<label class="field"><span>${escapeHtml(label)}</span><input type="${type}" value="${escapeHtml(value)}"></label>`; }
function selectField(label, options) { return `<label class="field select-field"><span>${escapeHtml(label)}</span><select>${options.map((option) => `<option>${escapeHtml(option)}</option>`).join("")}</select></label>`; }

function bindInteractions(template) {
  root.querySelector("[data-action-form]")?.addEventListener("submit", (event) => { event.preventDefault(); showToast(template.sections.find((section) => section.type === "notification")?.message || "操作已完成"); });
  root.querySelectorAll("[data-dialog-trigger], [data-row-detail]").forEach((button) => button.addEventListener("click", () => root.querySelector(".preview-dialog")?.showModal()));
  root.querySelectorAll(".settings-list button, .nav-item").forEach((button) => button.addEventListener("click", () => { button.parentElement.querySelector(".is-current")?.classList.remove("is-current"); button.classList.add("is-current"); }));
}

function showToast(message) {
  const toast = root.querySelector(".preview-toast");
  toast.textContent = `✓ ${message}`;
  toast.hidden = false;
  window.setTimeout(() => { toast.hidden = true; }, 2200);
}

function setTheme(theme, appearance) {
  const colors = appearance === "dark" ? { canvas: "#151716", surface: "#202320", ink: "#f6f8f5", muted: "#b4bbb5", accent: theme.colors.accent, accentSoft: "#263c30", danger: "#ff8983" } : theme.colors;
  Object.entries(colors).forEach(([key, value]) => document.documentElement.style.setProperty(`--theme-${key}`, value));
}

function setSystemTokens(system) {
  const controlHeight = Number.parseFloat(system.tokens.controlHeight) || 36;
  document.documentElement.style.setProperty("--system-radius-control", system.tokens.radiusControl || "4px");
  document.documentElement.style.setProperty("--system-radius-panel", system.tokens.radiusPanel || "8px");
  document.documentElement.style.setProperty("--system-control-height", `${controlHeight}px`);
}

function dialogTitle(template) { return template.id === "list-detail" ? "项目详情" : "放弃未保存的修改？"; }
function dialogBody(template) { return template.id === "list-detail" ? "Atlas Mobile 正在进行设计系统迁移，当前进度为 68%。" : "关闭后，本次修改不会被保存。"; }
function escapeHtml(value) { return String(value ?? "").replace(/[&<>\"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]); }
