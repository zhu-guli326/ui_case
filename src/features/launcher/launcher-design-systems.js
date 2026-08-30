import {
  DESIGN_SYSTEMS,
  DESIGN_SYSTEM_CATEGORY_LABELS as CATEGORY_LABELS,
  DESIGN_SYSTEM_SOURCE_REPO as SOURCE_REPO,
  DESIGN_SYSTEM_SOURCE_BASE as SOURCE_BASE,
} from "./design-systems-catalog.js";

const STORAGE_KEY = "ondesign:design-system-preset:v2";
const cache = new Map();
let selectedEntry = null;
let selectedSpec = null;
let field = null;
let trigger = null;
let menu = null;
let list = null;
let searchInput = null;
let observer = null;
let promptSnapshot = "";

const lang = () => (window.image2I18n?.language === "en" || document.documentElement.lang.startsWith("en") ? "en" : "zh");
const txt = (zh, en) => (lang() === "en" ? en : zh);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));
const sourceUrl = (entry) => `${SOURCE_BASE}/${entry.slug}/DESIGN.md`;
const cssValue = (value, fallback) => {
  const v = String(value || "").trim();
  return /^#(?:[\da-f]{3,8})$/i.test(v) || /^(?:rgb|hsl|oklch|color)\(/i.test(v) ? v : fallback;
};
const pxNumber = (value, fallback) => {
  const match = String(value || "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : fallback;
};

function parseDesign(text, entry) {
  const result = { description: entry.description, colors: {}, typography: {}, rounded: {}, spacing: {}, components: [], raw: text };
  const end = text.startsWith("---") ? text.indexOf("\n---", 3) : -1;
  const frontmatter = text.startsWith("---") ? text.slice(3, end > 0 ? end : text.length) : text;
  let section = "";
  let subkey = "";
  for (const line of frontmatter.split(/\r?\n/)) {
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const top = line.match(/^([A-Za-z][\w-]*):(?:\s*(.*))?$/);
    if (top) {
      section = top[1];
      subkey = "";
      const topValue = (top[2] || "").trim().replace(/^["']|["']$/g, "");
      if (section === "description" && topValue) result.description = topValue;
      continue;
    }
    if (section === "colors" || section === "rounded" || section === "spacing") {
      const match = line.match(/^\s{2}([\w-]+):\s*["']?([^"']+?)["']?\s*$/);
      if (match) result[section][match[1]] = match[2].trim();
    } else if (section === "typography") {
      const role = line.match(/^\s{2}([\w-]+):\s*$/);
      if (role) {
        subkey = role[1];
        result.typography[subkey] = {};
        continue;
      }
      const prop = line.match(/^\s{4}([\w-]+):\s*["']?([^"']+?)["']?\s*$/);
      if (prop && subkey) result.typography[subkey][prop[1]] = prop[2].trim();
    } else if (section === "components") {
      const component = line.match(/^\s{2}([\w-]+):\s*$/);
      if (component) result.components.push(component[1]);
    }
  }
  if (!Object.keys(result.colors).length) {
    [...new Set(text.match(/#[0-9a-fA-F]{3,8}\b/g) || [])].slice(0, 12).forEach((value, index) => {
      result.colors[`color-${index + 1}`] = value;
    });
  }
  return result;
}

async function loadSpec(entry) {
  if (cache.has(entry.slug)) return cache.get(entry.slug);
  const request = fetch(sourceUrl(entry), { cache: "force-cache" })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then((text) => parseDesign(text, entry))
    .catch((error) => ({ description: entry.description, colors: {}, typography: {}, rounded: {}, spacing: {}, components: [], raw: "", error: String(error) }));
  cache.set(entry.slug, request);
  return request;
}

function pickColor(spec, names, fallback) {
  for (const name of names) if (spec.colors[name]) return cssValue(spec.colors[name], fallback);
  const values = Object.values(spec.colors).filter(Boolean);
  return cssValue(values[0], fallback);
}

function paletteFor(spec) {
  return {
    accent: pickColor(spec, ["primary", "accent", "brand", "brand-primary", "action", "cta", "highlight"], "#18a957"),
    canvas: pickColor(spec, ["canvas", "background", "bg", "page", "base"], "#f5f5f5"),
    surface: pickColor(spec, ["surface-1", "surface", "card", "panel", "surface-primary"], "#ffffff"),
    ink: pickColor(spec, ["ink", "text", "foreground", "text-primary", "on-background"], "#202020"),
    muted: pickColor(spec, ["ink-muted", "muted", "text-secondary", "subtle"], "#737373"),
  };
}

function typographyList(spec) {
  const entries = Object.entries(spec.typography);
  const preferred = ["display-xl", "display-lg", "headline", "title", "body", "body-sm", "caption", "mono"];
  return [
    ...preferred.map((key) => [key, spec.typography[key]]).filter(([, value]) => value),
    ...entries.filter(([key]) => !preferred.includes(key)),
  ].slice(0, 6);
}

function primaryFont(spec) {
  return typographyList(spec).find(([, value]) => value?.fontFamily)?.[1]?.fontFamily || "system-ui";
}
function radiusValue(spec) {
  return spec.rounded.md || spec.rounded.base || spec.rounded.sm || Object.values(spec.rounded)[0] || "8px";
}
function spacingValue(spec) {
  return spec.spacing.md || spec.spacing.base || spec.spacing.sm || Object.values(spec.spacing)[0] || "16px";
}

function createStyles() {
  if (document.getElementById("ondesign-design-system-style")) return;
  const style = document.createElement("style");
  style.id = "ondesign-design-system-style";
  style.textContent = `
    .ds-field{margin:0 0 16px;padding:0;border:0}.ds-field>legend{margin:0 0 8px;padding:0;color:var(--ant-text,#262626);font-size:13px;font-weight:500}
    .ds-trigger{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;width:100%;min-height:54px;padding:9px 11px;border:1px solid var(--ant-border,#d9d9d9);border-radius:7px;background:#fff;text-align:left;transition:border-color .16s ease,box-shadow .16s ease}.ds-trigger:hover,.ds-trigger[aria-expanded="true"]{border-color:var(--ant-primary,#18a957)}.ds-trigger[aria-expanded="true"]{box-shadow:0 0 0 2px rgb(24 169 87 / 10%)}
    .ds-trigger-copy{min-width:0;display:grid;gap:2px}.ds-trigger-copy strong{overflow:hidden;color:var(--ant-text,#262626);font-size:13px;font-weight:600;text-overflow:ellipsis;white-space:nowrap}.ds-trigger-copy small{overflow:hidden;color:var(--ant-text-secondary,#737373);font-size:11px;text-overflow:ellipsis;white-space:nowrap}.ds-trigger-side{display:flex;align-items:center;gap:9px}.ds-trigger-swatches{display:flex;gap:3px}.ds-trigger-swatches i{display:block;width:13px;height:28px;border:1px solid rgb(0 0 0 / 7%);border-radius:3px;background:#eee}.ds-trigger-arrow{width:7px;height:7px;border-right:1.5px solid #777;border-bottom:1.5px solid #777;transform:translateY(-2px) rotate(45deg);transition:transform .16s ease}.ds-trigger[aria-expanded="true"] .ds-trigger-arrow{transform:translateY(2px) rotate(225deg)}
    .ds-menu{margin-top:8px;border:1px solid var(--ant-border,#d9d9d9);border-radius:9px;background:#fff;box-shadow:0 8px 24px rgb(0 0 0 / 8%);overflow:hidden}.ds-menu[hidden]{display:none}.ds-menu-head{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:8px;padding:8px;border-bottom:1px solid #f0f0f0}.ds-search{width:100%;min-height:34px;padding:0 10px;border:1px solid #d9d9d9;border-radius:6px;background:#fff;color:#262626;font:inherit;font-size:12px;outline:0}.ds-search:focus{border-color:#18a957;box-shadow:0 0 0 2px rgb(24 169 87 / 10%)}.ds-count{padding-right:4px;color:#8c8c8c;font-size:10px;white-space:nowrap}
    .ds-list{max-height:330px;padding:6px;overflow:auto;background:#fafafa}.ds-option{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;width:100%;min-height:58px;padding:8px 9px;border:1px solid transparent;border-radius:7px;background:transparent;text-align:left}.ds-option:hover{border-color:#d9d9d9;background:#fff}.ds-option.is-selected{border-color:#18a957;background:#f0f9f3}.ds-option-copy{min-width:0;display:grid;gap:3px}.ds-option-title{display:flex;align-items:center;gap:7px;min-width:0}.ds-option-title strong{overflow:hidden;color:#262626;font-size:12px;font-weight:600;text-overflow:ellipsis;white-space:nowrap}.ds-option-title span{flex:0 0 auto;padding:2px 5px;border-radius:999px;background:#f0f0f0;color:#737373;font-size:8px}.ds-option-copy small{overflow:hidden;color:#8c8c8c;font-size:9.5px;text-overflow:ellipsis;white-space:nowrap}.ds-option-preview{display:grid;gap:4px;justify-items:end}.ds-option-swatches{display:flex;gap:2px}.ds-option-swatches i{display:block;width:15px;height:22px;border:1px solid rgb(0 0 0 / 6%);border-radius:3px;background:#ececec}.ds-option-meta{max-width:148px;overflow:hidden;color:#8c8c8c;font-size:8.5px;text-overflow:ellipsis;white-space:nowrap}.ds-option[data-loaded="false"] .ds-option-swatches i{background:linear-gradient(90deg,#f1f1f1,#e5e5e5,#f1f1f1);background-size:200% 100%;animation:ds-shimmer 1.2s linear infinite}.ds-empty{padding:28px 12px;color:#8c8c8c;font-size:12px;text-align:center}
    .ds-note{margin:6px 0 0;color:#8c8c8c;font-size:10px;line-height:1.45}.ds-note a{color:#595959;text-underline-offset:3px}
    @keyframes ds-shimmer{to{background-position:-200% 0}}
  `;
  document.head.append(style);
}

function swatchHtml(colors = []) {
  return colors.slice(0, 4).map((color) => `<i style="background:${esc(color)}"></i>`).join("");
}

function bindStaticField() {
  field = document.querySelector("[data-design-system-field]");
  if (!field) {
    console.warn("[ONDesign] Static design-system field is missing from launcher.html");
    return false;
  }
  trigger = field.querySelector("[data-ds-trigger]");
  menu = field.querySelector("[data-ds-menu]");
  list = field.querySelector("[data-ds-list]");
  searchInput = field.querySelector(".ds-search");
  if (!trigger || !menu || !list || !searchInput) return false;

  if (trigger.dataset.bound !== "true") {
    trigger.dataset.bound = "true";
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = menu.hidden;
      menu.hidden = !open;
      trigger.setAttribute("aria-expanded", String(open));
      if (open) {
        renderOptions();
        requestAnimationFrame(() => searchInput.focus());
      }
    });
    searchInput.addEventListener("input", renderOptions);
  }
  return true;
}

function syncStaticLabels() {
  if (!field) return;
  const legend = field.querySelector("legend");
  const note = field.querySelector(".ds-note");
  if (legend) legend.textContent = txt("设计规范", "Design system");
  if (searchInput) {
    searchInput.placeholder = txt("搜索 Linear、Apple、Figma…", "Search Linear, Apple, Figma…");
    searchInput.setAttribute("aria-label", txt("搜索设计规范", "Search design systems"));
  }
  if (note) note.textContent = txt(
    "来源：VoltAgent/awesome-design-md（MIT）。选择后同步颜色、字体、圆角与间距；下方仍可继续微调。",
    "Source: VoltAgent/awesome-design-md (MIT). Selection syncs color, typography, radius and spacing; fine-tune below.",
  );
  updateTrigger();
}

function filteredEntries() {
  const query = (searchInput?.value || "").trim().toLowerCase();
  return DESIGN_SYSTEMS.filter((entry) => !query || `${entry.name} ${entry.slug} ${entry.description} ${CATEGORY_LABELS[entry.category]?.zh || ""} ${CATEGORY_LABELS[entry.category]?.en || ""}`.toLowerCase().includes(query));
}

function optionHtml(entry) {
  const category = CATEGORY_LABELS[entry.category]?.[lang()] || entry.category;
  return `<button type="button" class="ds-option${selectedEntry?.slug === entry.slug ? " is-selected" : ""}" data-ds-slug="${esc(entry.slug)}" data-loaded="false">
    <span class="ds-option-copy"><span class="ds-option-title"><strong>${esc(entry.name)}</strong><span>${esc(category)}</span></span><small>${esc(entry.description)}</small></span>
    <span class="ds-option-preview"><span class="ds-option-swatches"><i></i><i></i><i></i><i></i></span><span class="ds-option-meta">${txt("加载预览…", "Loading preview…")}</span></span>
  </button>`;
}

function renderOptions() {
  if (!list || !field) return;
  observer?.disconnect();
  const entries = filteredEntries();
  const count = field.querySelector("[data-ds-count]");
  if (count) count.textContent = `${entries.length} / ${DESIGN_SYSTEMS.length}`;
  list.innerHTML = entries.length ? entries.map(optionHtml).join("") : `<div class="ds-empty">${txt("没有匹配的设计规范", "No matching design systems")}</div>`;
  observer = new IntersectionObserver((items) => {
    items.forEach((item) => {
      if (!item.isIntersecting) return;
      observer.unobserve(item.target);
      hydrateOption(item.target);
    });
  }, { root: list, rootMargin: "80px" });
  list.querySelectorAll("[data-ds-slug]").forEach((button) => {
    observer.observe(button);
    button.addEventListener("click", async (event) => {
      event.stopPropagation();
      const entry = DESIGN_SYSTEMS.find((item) => item.slug === button.dataset.dsSlug);
      if (!entry) return;
      const spec = await loadSpec(entry);
      applyDesignSystem(entry, spec);
      closeMenu();
    });
  });
}

async function hydrateOption(button) {
  const entry = DESIGN_SYSTEMS.find((item) => item.slug === button.dataset.dsSlug);
  if (!entry || button.dataset.loaded === "true") return;
  const spec = await loadSpec(entry);
  if (!button.isConnected) return;
  const palette = paletteFor(spec);
  button.querySelector(".ds-option-swatches").innerHTML = swatchHtml([palette.accent, palette.surface, palette.canvas, palette.ink]);
  button.querySelector(".ds-option-meta").textContent = `${primaryFont(spec)} · ${radiusValue(spec)} · ${spacingValue(spec)}`;
  button.dataset.loaded = "true";
}

function closeMenu() {
  if (!menu || !trigger) return;
  menu.hidden = true;
  trigger.setAttribute("aria-expanded", "false");
}

function buildPrompt(entry, spec) {
  const palette = paletteFor(spec);
  const type = typographyList(spec);
  return [
    `${txt("设计规范", "Design system")}: ${entry.name}`,
    `${txt("来源", "Source")}: ${SOURCE_REPO}/design-md/${entry.slug}/DESIGN.md`,
    `${txt("视觉方向", "Visual direction")}: ${spec.description || entry.description}`,
    `${txt("核心颜色", "Core colors")}: accent ${palette.accent}; canvas ${palette.canvas}; surface ${palette.surface}; ink ${palette.ink}; muted ${palette.muted}`,
    `${txt("字体", "Typography")}: ${type.map(([role, token]) => `${role}=${token.fontFamily || ""} ${token.fontSize || ""} ${token.fontWeight || ""}`.trim()).join("; ") || primaryFont(spec)}`,
    `${txt("圆角", "Radius")}: ${Object.entries(spec.rounded).slice(0, 8).map(([key, value]) => `${key} ${value}`).join(", ") || radiusValue(spec)}`,
    `${txt("间距", "Spacing")}: ${Object.entries(spec.spacing).slice(0, 8).map(([key, value]) => `${key} ${value}`).join(", ") || spacingValue(spec)}`,
    `${txt("组件", "Components")}: ${spec.components.slice(0, 16).join(", ") || "Follow source DESIGN.md component rules."}`,
    txt("复用要求：新页面持续遵循这套视觉语言，保持表面层级、字体层级、间距节奏与组件状态一致；不要复制品牌素材或打包专有字体文件。", "Reuse rule: keep surface hierarchy, type scale, spacing rhythm and component states consistent across pages. Do not copy brand assets or proprietary font files."),
  ].join("\n");
}

function applyDesignSystem(entry, spec, { silent = false } = {}) {
  selectedEntry = entry;
  selectedSpec = spec;
  promptSnapshot = buildPrompt(entry, spec);
  const palette = paletteFor(spec);
  const radius = Math.max(0, pxNumber(radiusValue(spec), 8));
  const spacing = Math.max(4, pxNumber(spacingValue(spec), 16));
  const root = document.documentElement;
  root.style.setProperty("--dna-accent", palette.accent);
  root.style.setProperty("--dna-accent-soft", `color-mix(in srgb, ${palette.accent} 12%, ${palette.surface})`);
  root.style.setProperty("--dna-canvas", palette.canvas);
  root.style.setProperty("--dna-surface", palette.surface);
  root.style.setProperty("--dna-ink", palette.ink);
  root.style.setProperty("--dna-muted", palette.muted);
  root.style.setProperty("--dna-radius", `${radius}px`);
  root.style.setProperty("--dna-space", `${spacing}px`);
  root.style.setProperty("--dna-display", `"${primaryFont(spec)}",system-ui,-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif`);
  document.body.dataset.designSystem = entry.slug;

  const prompt = document.querySelector("#dnaPrompt");
  if (prompt) prompt.textContent = promptSnapshot;
  const name = document.querySelector("#dnaName");
  if (name) name.value = `${entry.name} · Web DNA`;
  const rulesChip = document.querySelector('[data-section-value="rules"]');
  if (rulesChip) rulesChip.textContent = `${entry.name} · ${primaryFont(spec)}`;
  const dockFont = document.querySelector("#dockFont");
  if (dockFont) dockFont.textContent = primaryFont(spec);
  const dockRadius = document.querySelector("#dockRadius");
  if (dockRadius) dockRadius.textContent = `${radius}px ${txt("圆角", "radius")}`;
  const dockPalette = document.querySelectorAll("#dockPalette i");
  [palette.accent, palette.surface, palette.canvas, palette.ink].forEach((color, index) => { if (dockPalette[index]) dockPalette[index].style.background = color; });
  updateTrigger();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ slug: entry.slug })); } catch {}

  window.dispatchEvent(new CustomEvent("ondesign:designsystemapply", {
    detail: {
      slug: entry.slug,
      name: entry.name,
      radius,
      radiusSource: radiusValue(spec),
    },
  }));
  if (!silent) window.dispatchEvent(new CustomEvent("ondesign:designsystemchange", { detail: { slug: entry.slug, name: entry.name, radius } }));
}

function updateTrigger() {
  if (!trigger) return;
  const strong = trigger.querySelector("strong");
  const small = trigger.querySelector("small");
  const swatches = trigger.querySelectorAll(".ds-trigger-swatches i");
  if (!selectedEntry || !selectedSpec) {
    if (strong) strong.textContent = txt("选择设计规范", "Choose a design system");
    if (small) small.textContent = txt("73 套真实网站规范，可直接预览并应用", "73 real-site systems with inline previews");
    swatches.forEach((node) => { node.style.background = "#eee"; });
    return;
  }
  if (strong) strong.textContent = selectedEntry.name;
  if (small) small.textContent = `${primaryFont(selectedSpec)} · ${radiusValue(selectedSpec)} · ${spacingValue(selectedSpec)}`;
  const palette = paletteFor(selectedSpec);
  [palette.accent, palette.surface, palette.canvas, palette.ink].forEach((color, index) => { if (swatches[index]) swatches[index].style.background = color; });
}

async function restoreSelection() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch {}
  if (!saved?.slug) return;
  const entry = DESIGN_SYSTEMS.find((item) => item.slug === saved.slug);
  if (!entry) return;
  applyDesignSystem(entry, await loadSpec(entry), { silent: true });
}

function syncLanguage() {
  if (!field) return;
  const wasOpen = !menu.hidden;
  syncStaticLabels();
  if (wasOpen) renderOptions();
}

function openDropdown() {
  if (!field || !menu || !trigger) return;
  menu.hidden = false;
  trigger.setAttribute("aria-expanded", "true");
  renderOptions();
}

function init() {
  createStyles();
  if (!bindStaticField()) return;
  syncStaticLabels();
  restoreSelection();
  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-design-system-field]")) closeMenu();
  });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
  window.addEventListener("image2:languagechange", syncLanguage);
  window.ONDesignDesignSystems = { entries: DESIGN_SYSTEMS, open: openDropdown, load: loadSpec, apply: applyDesignSystem };
}

init();