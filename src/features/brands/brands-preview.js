/**
 * brands-preview.js — 预览 iframe 渲染、懒加载、尺寸自适应与差异清单
 */
import { findSystem, findBrandReference, findTheme, findTemplate, findDevice } from "../../../lab/lab-data.js";
import { normalizeTheme } from "./brands-state.js";

function loaderSrcDoc() {
  const label = window.image2I18n?.language === "en" ? "Generating page preview" : "正在生成页面预览";
  return "<!doctype html><meta charset='utf-8'><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f7f9f6;color:#657067;font:600 14px system-ui}.loader{display:grid;gap:12px;text-align:center}.bar{width:120px;height:4px;background:#e4e8e2;overflow:hidden}.bar:after{display:block;width:45%;height:100%;background:#168143;content:'';animation:load 1s ease-in-out infinite alternate}@keyframes load{to{transform:translateX(122px)}}</style><div class='loader'><span>" + label + "</span><div class='bar'></div></div>";
}

export function previewUrl(state, systemId) {
  const url = new URL("./lab/preview.html", location.href);
  Object.entries({ ...state, system: systemId }).forEach(([key, value]) => {
    if (!Array.isArray(value)) url.searchParams.set(key, value);
  });
  url.searchParams.set("theme", normalizeTheme(state.theme));
  return url.href;
}

export function renderPreview(stage, state, { fitFrames, observer, previewLoaderObserver }) {
  observer?.disconnect();
  previewLoaderObserver?.disconnect();
  const device = findDevice(state.device);
  const ids = state.view === "compare" ? state.compare.slice(0, 3) : [state.system];
  stage.className = `preview-stage is-${state.view} device-${state.device}`;
  const isEn = window.image2I18n?.language === "en";
  stage.innerHTML = ids
    .map((id, index) => {
      const system = findSystem(id);
      return `<article class="preview-column"><header><div><strong>${escapeHtml(system.name)}</strong><span>${escapeHtml(findBrandReference(state.brand).name)} · ${escapeHtml(findTheme(state.theme).name)}</span></div><b>${escapeHtml(system.tokens.controlHeight)}</b></header><div class="device-frame" data-width="${device.width}" data-height="${device.height}" style="--preview-width:${device.width}px;--preview-height:${device.height}px"><iframe title="${escapeHtml(system.name)} ${escapeHtml(findTemplate(state.template).name)} ${isEn ? "preview" : "预览"}" loading="${index === 0 ? "eager" : "lazy"}" data-preview-src="${escapeHtml(previewUrl(state, id))}" srcdoc="${escapeHtml(loaderSrcDoc())}"></iframe></div></article>`;
    })
    .join("");
  fitFrames();
  const newObserver = new ResizeObserver(fitFrames);
  stage.querySelectorAll(".device-frame").forEach((frame) => newObserver.observe(frame));
  const newPreviewLoader = observePreviewFrames(previewLoaderObserver);
  return { observer: newObserver, previewLoaderObserver: newPreviewLoader };
}

function observePreviewFrames(previous) {
  previous?.disconnect();
  const frames = [...document.querySelectorAll("iframe[data-preview-src]")];
  let observer = null;
  const load = (frame) => {
    if (!frame.dataset.previewSrc) return;
    const src = frame.dataset.previewSrc;
    frame.removeAttribute("srcdoc");
    frame.src = src;
    delete frame.dataset.previewSrc;
    observer?.unobserve(frame);
  };
  if (frames[0]) load(frames[0]);
  if (!("IntersectionObserver" in window)) {
    frames.forEach(load);
    return null;
  }
  observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.isIntersecting && load(entry.target)),
    { rootMargin: "320px 0px" }
  );
  frames.slice(1).forEach((frame) => observer.observe(frame));
  window.setTimeout(() => frames.forEach((frame) => {
    if (frame.dataset.previewSrc && document.visibilityState !== "hidden") load(frame);
  }), 700);
  return observer;
}

export function fitFrames() {
  document.querySelectorAll(".device-frame").forEach((frame) => {
    const width = Number(frame.dataset.width);
    const height = Number(frame.dataset.height);
    const scale = Math.min(1, frame.clientWidth / width);
    frame.style.setProperty("--preview-scale", scale);
    const border = parseFloat(getComputedStyle(frame).borderTopWidth) * 2;
    frame.style.height = `${Math.round(height * scale + border)}px`;
  });
}

export function renderDifferences(panel, state) {
  const isEn = window.image2I18n?.language === "en";
  const ids = (state.compare.length >= 2 ? state.compare : [state.system, "material"]).slice(0, 3).map(findSystem);
  const rows = [
    [isEn ? "Type & tone" : "字体与语气", ...ids.map((s) => (s.id === "apple" ? (isEn ? "System fonts / content first" : "系统字体 / 内容优先") : s.id === "material" ? (isEn ? "Roboto-leaning / clear hierarchy" : "Roboto 倾向 / 清晰分层") : (isEn ? "Neutral sans / efficiency first" : "中性无衬线 / 效率优先")))],
    [isEn ? "Corner radius" : "圆角", ...ids.map((s) => `${s.tokens.radiusControl} ${isEn ? "controls" : "控件"} · ${s.tokens.radiusPanel} ${isEn ? "panels" : "面板"}`)],
    [isEn ? "Control height" : "按钮高度", ...ids.map((s) => s.tokens.controlHeight)],
    [isEn ? "Spacing base" : "间距基准", ...ids.map((s) => s.tokens.spacing)],
    [isEn ? "Focus feedback" : "焦点反馈", ...ids.map((s) => s.tokens.focus)],
    [isEn ? "Card structure" : "卡片结构", ...ids.map((s) => s.mapping.card)],
    [isEn ? "Navigation" : "导航模式", ...ids.map((s) => s.mapping.navigation)],
    [isEn ? "Feedback" : "反馈模式", ...ids.map((s) => s.mapping.notification)],
  ];
  panel.innerHTML = `<table><thead><tr><th>${isEn ? "Difference" : "差异项"}</th>${ids.map((s) => `<th>${escapeHtml(s.name)}</th>`).join("")}</tr></thead><tbody>${rows
    .map((row) => `<tr>${row.map((cell, index) => `<td>${index ? escapeHtml(cell) : `<strong>${escapeHtml(cell)}</strong>`}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);
}
