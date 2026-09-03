import {
  DESIGN_SYSTEMS,
  DESIGN_SYSTEM_CATEGORY_LABELS as CATEGORY_LABELS,
  DESIGN_SYSTEM_SOURCE_REPO as SOURCE_REPO,
  DESIGN_SYSTEM_SOURCE_BASE as SOURCE_BASE,
} from "./design-systems-catalog.js";
import {
  designSystemUsage,
  designSystemUsageLabel,
  normalizeDesignSystemForLauncher,
} from "./design-system-usage.js";

const STORAGE_KEY = "ondesign:design-system-preset:v2";
const STYLE_HREF = "./src/features/launcher/launcher-design-systems.css";
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

const BRAND_DOMAINS = {
  claude: "claude.ai",
  cohere: "cohere.com",
  elevenlabs: "elevenlabs.io",
  minimax: "minimax.io",
  "mistral.ai": "mistral.ai",
  ollama: "ollama.com",
  "opencode.ai": "opencode.ai",
  replicate: "replicate.com",
  runwayml: "runwayml.com",
  "together.ai": "together.ai",
  voltagent: "voltagent.dev",
  "x.ai": "x.ai",
  cursor: "cursor.com",
  expo: "expo.dev",
  lovable: "lovable.dev",
  raycast: "raycast.com",
  superhuman: "superhuman.com",
  vercel: "vercel.com",
  warp: "warp.dev",
  clickhouse: "clickhouse.com",
  composio: "composio.dev",
  hashicorp: "hashicorp.com",
  mongodb: "mongodb.com",
  posthog: "posthog.com",
  sanity: "sanity.io",
  sentry: "sentry.io",
  supabase: "supabase.com",
  cal: "cal.com",
  intercom: "intercom.com",
  "linear.app": "linear.app",
  mintlify: "mintlify.com",
  notion: "notion.so",
  resend: "resend.com",
  zapier: "zapier.com",
  airtable: "airtable.com",
  clay: "clay.com",
  figma: "figma.com",
  framer: "framer.com",
  miro: "miro.com",
  webflow: "webflow.com",
  binance: "binance.com",
  coinbase: "coinbase.com",
  kraken: "kraken.com",
  mastercard: "mastercard.com",
  revolut: "revolut.com",
  stripe: "stripe.com",
  wise: "wise.com",
  airbnb: "airbnb.com",
  meta: "meta.com",
  nike: "nike.com",
  shopify: "shopify.com",
  starbucks: "starbucks.com",
  apple: "apple.com",
  hp: "hp.com",
  ibm: "ibm.com",
  nvidia: "nvidia.com",
  pinterest: "pinterest.com",
  playstation: "playstation.com",
  spacex: "spacex.com",
  spotify: "spotify.com",
  theverge: "theverge.com",
  uber: "uber.com",
  vodafone: "vodafone.com",
  wired: "wired.com",
  bmw: "bmw.com",
  "bmw-m": "bmw-m.com",
  bugatti: "bugatti.com",
  ferrari: "ferrari.com",
  lamborghini: "lamborghini.com",
  renault: "renault.com",
  tesla: "tesla.com",
  "dell-1996": "dell.com",
  "nintendo-2001": "nintendo.com",
};

const FEATURED_DESIGN_SYSTEM_SLUGS = [
  "apple",
  "figma",
  "notion",
  "linear.app",
  "vercel",
  "stripe",
  "airbnb",
  "shopify",
  "spotify",
  "nike",
  "tesla",
  "ibm",
  "nvidia",
  "cursor",
  "claude",
  "supabase",
  "webflow",
  "framer",
];
const FEATURED_DESIGN_SYSTEM_RANK = new Map(FEATURED_DESIGN_SYSTEM_SLUGS.map((slug, index) => [slug, index]));
const CATALOG_DESIGN_SYSTEM_RANK = new Map(DESIGN_SYSTEMS.map((entry, index) => [entry.slug, index]));

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

function ensureStylesheet() {
  if (document.querySelector(`link[href="${STYLE_HREF}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = STYLE_HREF;
  document.head.append(link);
}

function brandInitials(entry) {
  if (!entry) return "DS";
  const parts = entry.name.replace(/\([^)]*\)/g, "").trim().split(/[\s.-]+/).filter(Boolean);
  return (parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : parts[0]?.slice(0, 2) || "DS").toUpperCase();
}

function brandLogoUrl(entry) {
  const domain = BRAND_DOMAINS[entry?.slug];
  if (!domain) return "";
  return `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(`https://${domain}`)}&sz=128`;
}

function brandLogoHtml(entry, extraClass = "") {
  const url = brandLogoUrl(entry);
  const classes = `ds-brand-logo${extraClass ? ` ${extraClass}` : ""}${url ? "" : " is-fallback"}`;
  return `<span class="${classes}" data-brand-logo="${esc(entry?.slug || "")}"><img src="${esc(url)}" alt="${esc(entry ? `${entry.name} logo` : "")}" loading="lazy" decoding="async"><b aria-hidden="true">${esc(brandInitials(entry))}</b></span>`;
}

function bindLogoFallbacks(root = document) {
  root.querySelectorAll?.("[data-brand-logo]").forEach((node) => {
    const image = node.querySelector("img");
    if (!image || image.dataset.logoBound === "true") return;
    image.dataset.logoBound = "true";
    const fallback = () => node.classList.add("is-fallback");
    const ready = () => node.classList.remove("is-fallback");
    image.addEventListener("error", fallback, { once: true });
    image.addEventListener("load", ready, { once: true });
    if (!image.getAttribute("src") || (image.complete && image.naturalWidth === 0)) fallback();
    else if (image.complete && image.naturalWidth > 0) ready();
  });
}

function setBrandLogo(node, entry) {
  if (!node) return;
  const image = node.querySelector("img");
  const fallback = node.querySelector("b");
  const url = brandLogoUrl(entry);
  node.dataset.brandLogo = entry?.slug || "";
  if (fallback) fallback.textContent = brandInitials(entry);
  if (!image) return;
  image.alt = entry ? `${entry.name} logo` : "";
  image.dataset.logoBound = "";
  image.src = url;
  node.classList.toggle("is-fallback", !url);
  bindLogoFallbacks(node.parentElement || node);
}

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
    if (["colors", "rounded", "spacing"].includes(section)) {
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
    .then((text) => normalizeDesignSystemForLauncher(entry, parseDesign(text, entry)))
    .catch((error) => normalizeDesignSystemForLauncher(entry, { description: entry.description, colors: {}, typography: {}, rounded: {}, spacing: {}, components: [], raw: "", error: String(error) }));
  cache.set(entry.slug, request);
  return request;
}

function pickColor(spec, names, fallback) {
  for (const name of names) if (spec.colors[name]) return cssValue(spec.colors[name], fallback);
  return cssValue(Object.values(spec.colors).find(Boolean), fallback);
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

function swatchHtml(colors = []) {
  return colors.slice(0, 4).map((color) => `<i style="background:${esc(color)}"></i>`).join("");
}

function resetListScroll() {
  if (!list) return;
  list.scrollTop = 0;
}

function bindStaticField() {
  field = document.querySelector("[data-design-system-field]");
  if (!field) return false;
  trigger = field.querySelector("[data-ds-trigger]");
  menu = field.querySelector("[data-ds-menu]");
  list = field.querySelector("[data-ds-list]");
  searchInput = field.querySelector(".ds-search");
  if (!trigger || !menu || !list || !searchInput) return false;

  if (!trigger.querySelector(".ds-trigger-logo")) {
    const shell = document.createElement("span");
    shell.innerHTML = brandLogoHtml(null, "ds-trigger-logo");
    trigger.prepend(shell.firstElementChild);
  }
  bindLogoFallbacks(trigger);

  if (trigger.dataset.bound !== "true") {
    trigger.dataset.bound = "true";
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = menu.hidden;
      menu.hidden = !open;
      trigger.setAttribute("aria-expanded", String(open));
      if (open) {
        renderOptions();
        resetListScroll();
        requestAnimationFrame(() => searchInput.focus());
      }
    });
    searchInput.addEventListener("input", () => {
      renderOptions();
      resetListScroll();
    });
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
    "所有来源都会先经过 UI Coding 适配；品牌官网与历史页面只保留可复用的视觉特征，不直接继承营销页级 Token。来源：VoltAgent/awesome-design-md（MIT）。",
    "Every source is normalized for UI Coding first. Brand websites and historical pages keep reusable visual cues without directly inheriting marketing-scale tokens. Source: VoltAgent/awesome-design-md (MIT).",
  );
  updateTrigger();
}

function designSystemOrder(entry) {
  const featuredRank = FEATURED_DESIGN_SYSTEM_RANK.get(entry.slug);
  if (featuredRank != null) return featuredRank;
  return FEATURED_DESIGN_SYSTEM_SLUGS.length + (CATALOG_DESIGN_SYSTEM_RANK.get(entry.slug) ?? DESIGN_SYSTEMS.length);
}

function filteredEntries() {
  const query = (searchInput?.value || "").trim().toLowerCase();
  return DESIGN_SYSTEMS
    .filter((entry) => !query || `${entry.name} ${entry.slug} ${entry.description} ${CATEGORY_LABELS[entry.category]?.zh || ""} ${CATEGORY_LABELS[entry.category]?.en || ""} ${designSystemUsageLabel(entry, lang())}`.toLowerCase().includes(query))
    .slice()
    .sort((left, right) => designSystemOrder(left) - designSystemOrder(right));
}

function optionHtml(entry) {
  const category = CATEGORY_LABELS[entry.category]?.[lang()] || entry.category;
  const usage = designSystemUsage(entry);
  const scope = designSystemUsageLabel(entry, lang());
  return `<button type="button" class="ds-option${selectedEntry?.slug === entry.slug ? " is-selected" : ""}" data-ds-slug="${esc(entry.slug)}" data-ds-scope="${esc(usage.scope)}" data-loaded="false">
    ${brandLogoHtml(entry)}
    <span class="ds-option-copy"><span class="ds-option-title"><strong>${esc(entry.name)}</strong><span>${esc(category)}</span><span class="ds-scope-tag">${esc(scope)}</span></span><small>${esc(entry.description)}</small></span>
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
  bindLogoFallbacks(list);
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
      applyDesignSystem(entry, await loadSpec(entry));
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
  const usage = designSystemUsage(entry);
  return [
    `${txt("设计规范", "Design system")}: ${entry.name}`,
    `${txt("适用范围", "Usage scope")}: ${designSystemUsageLabel(entry, lang())}`,
    `${txt("来源", "Source")}: ${SOURCE_REPO}/design-md/${entry.slug}/DESIGN.md`,
    `${txt("视觉方向", "Visual direction")}: ${spec.description || entry.description}`,
    `${txt("核心颜色", "Core colors")}: accent ${palette.accent}; canvas ${palette.canvas}; surface ${palette.surface}; ink ${palette.ink}; muted ${palette.muted}`,
    `${txt("字体", "Typography")}: ${type.map(([role, token]) => `${role}=${token.fontFamily || ""} ${token.fontSize || ""} ${token.fontWeight || ""}`.trim()).join("; ") || primaryFont(spec)}`,
    `${txt("圆角", "Radius")}: ${Object.entries(spec.rounded).slice(0, 8).map(([key, value]) => `${key} ${value}`).join(", ") || radiusValue(spec)}`,
    `${txt("间距", "Spacing")}: ${Object.entries(spec.spacing).slice(0, 8).map(([key, value]) => `${key} ${value}`).join(", ") || spacingValue(spec)}`,
    `${txt("组件", "Components")}: ${spec.components.slice(0, 16).join(", ") || "Follow source DESIGN.md component rules."}`,
    usage.scope === "product-ui"
      ? txt("复用要求：以产品 UI 为基准复用视觉语言，保持表面层级、字体层级、间距节奏与组件状态一致；不要复制品牌素材或打包专有字体文件。", "Reuse rule: use this as a product UI foundation, keeping surface hierarchy, type scale, spacing rhythm and component states consistent. Do not copy brand assets or proprietary font files.")
      : txt("适配要求：该来源主要是品牌官网/历史视觉参考。只复用品牌色、气质和可迁移的视觉语言；不要复制营销页的大标题、摄影布局、超大 section 间距或展示型几何到产品 UI。", "Adaptation rule: this source is primarily a brand website or historical visual reference. Reuse brand color, tone and transferable visual language only; do not copy marketing-scale headlines, photography layouts, oversized section spacing or display geometry into product UI."),
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
  root.style.setProperty("--ds-radius", `${radius}px`);
  root.style.setProperty("--dna-space", `${spacing}px`);
  root.style.setProperty("--dna-display", `"${primaryFont(spec)}",system-ui,-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif`);
  document.body.dataset.designSystem = entry.slug;
  document.body.dataset.designSystemScope = designSystemUsage(entry).scope;

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
  [palette.accent, palette.surface, palette.canvas, palette.ink].forEach((color, index) => {
    if (dockPalette[index]) dockPalette[index].style.background = color;
  });
  updateTrigger();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ slug: entry.slug })); } catch {}

  window.dispatchEvent(new CustomEvent("ondesign:designsystemapply", {
    detail: { slug: entry.slug, name: entry.name, radius, radiusSource: radiusValue(spec), scope: designSystemUsage(entry).scope },
  }));
  if (!silent) window.dispatchEvent(new CustomEvent("ondesign:designsystemchange", { detail: { slug: entry.slug, name: entry.name, radius, scope: designSystemUsage(entry).scope } }));
}

function updateTrigger() {
  if (!trigger) return;
  const strong = trigger.querySelector("strong");
  const small = trigger.querySelector("small");
  const swatches = trigger.querySelectorAll(".ds-trigger-swatches i");
  const brandLogo = trigger.querySelector(".ds-trigger-logo");
  if (!selectedEntry || !selectedSpec) {
    if (strong) strong.textContent = txt("选择设计规范", "Choose a design system");
    if (small) small.textContent = txt("先选基础规范，再微调 Token", "Choose a foundation, then fine-tune tokens");
    setBrandLogo(brandLogo, null);
    swatches.forEach((node) => { node.style.background = "#eee"; });
    return;
  }
  if (strong) strong.textContent = selectedEntry.name;
  if (small) small.textContent = `${designSystemUsageLabel(selectedEntry, lang())} · ${primaryFont(selectedSpec)} · ${radiusValue(selectedSpec)} · ${spacingValue(selectedSpec)}`;
  setBrandLogo(brandLogo, selectedEntry);
  const palette = paletteFor(selectedSpec);
  [palette.accent, palette.surface, palette.canvas, palette.ink].forEach((color, index) => {
    if (swatches[index]) swatches[index].style.background = color;
  });
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
  if (wasOpen) {
    renderOptions();
    resetListScroll();
  }
}

function openDropdown() {
  if (!field || !menu || !trigger) return;
  menu.hidden = false;
  trigger.setAttribute("aria-expanded", "true");
  renderOptions();
  resetListScroll();
}

function init() {
  ensureStylesheet();
  if (!bindStaticField()) return;
  syncStaticLabels();
  restoreSelection();
  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-design-system-field]")) closeMenu();
  });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
  window.addEventListener("image2:languagechange", syncLanguage);
  window.ONDesignDesignSystems = { entries: DESIGN_SYSTEMS, open: openDropdown, load: loadSpec, apply: applyDesignSystem, usage: designSystemUsage };
}

init();