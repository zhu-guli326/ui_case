// Launcher usage policy for external design references.
//
// Upstream DESIGN.md files may describe product UI, public marketing sites,
// brand flagships, or historical web pages. Launcher uses every selection as
// an AI Coding foundation, so raw website-scale tokens must be adapted before
// they are allowed to drive product UI.

const BRAND_WEB_REFERENCE_SLUGS = new Set([
  "clay",
  "mastercard",
  "meta",
  "nike",
  "starbucks",
  "apple",
  "hp",
  "nvidia",
  "playstation",
  "spacex",
  "theverge",
  "vodafone",
  "wired",
  "bmw",
  "bmw-m",
  "bugatti",
  "ferrari",
  "lamborghini",
  "renault",
  "tesla",
]);

const HISTORICAL_REFERENCE_SLUGS = new Set([
  "dell-1996",
  "nintendo-2001",
]);

const PRODUCT_UI_OVERRIDES = {
  cursor: {
    description: "Cursor product UI foundation. Neutral dark editor surfaces, compact geometry and low-chroma interaction styling. The upstream Cursor DESIGN.md describes cursor.com marketing, so Launcher intentionally adapts it to the editor/product UI.",
    colors: {
      primary: "#c7c7c7",
      canvas: "#1e1e1e",
      surface: "#252525",
      "surface-1": "#252525",
      muted: "#a3a3a3",
      ink: "#f2f2f2",
    },
    typography: {
      body: { fontFamily: "system-ui", fontSize: "14px", fontWeight: "400" },
      mono: { fontFamily: "ui-monospace", fontSize: "13px", fontWeight: "400" },
    },
    rounded: { sm: "4px", md: "6px", lg: "8px" },
    spacing: { sm: "6px", base: "8px", md: "8px", lg: "12px" },
  },
};

const clamp = (value, min, max, fallback) => {
  const match = String(value || "").match(/-?\d+(?:\.\d+)?/);
  const number = match ? Number(match[0]) : fallback;
  return Math.min(max, Math.max(min, number));
};

export function designSystemUsage(entry) {
  if (HISTORICAL_REFERENCE_SLUGS.has(entry?.slug)) {
    return { scope: "historical", zh: "历史风格参考", en: "Historical reference" };
  }
  if (BRAND_WEB_REFERENCE_SLUGS.has(entry?.slug)) {
    return { scope: "brand-web", zh: "品牌 / 官网参考", en: "Brand / web reference" };
  }
  return { scope: "product-ui", zh: "产品 UI", en: "Product UI" };
}

export function normalizeDesignSystemForLauncher(entry, sourceSpec) {
  const override = PRODUCT_UI_OVERRIDES[entry?.slug];
  if (override) {
    return {
      ...sourceSpec,
      ...override,
      colors: { ...sourceSpec.colors, ...override.colors },
      typography: { ...sourceSpec.typography, ...override.typography },
      rounded: { ...sourceSpec.rounded, ...override.rounded },
      spacing: { ...sourceSpec.spacing, ...override.spacing },
      launcherUsage: designSystemUsage(entry),
      launcherAdapted: true,
    };
  }

  const usage = designSystemUsage(entry);
  const rawRadius = sourceSpec.rounded?.md || sourceSpec.rounded?.base || sourceSpec.rounded?.sm;
  const rawSpacing = sourceSpec.spacing?.md || sourceSpec.spacing?.base || sourceSpec.spacing?.sm;

  // All Launcher presets use a product-safe geometry envelope. Website DESIGN.md
  // files can contain 20–96px section rhythm or display-only radii that should
  // never become ordinary application component tokens.
  const radius = clamp(rawRadius, usage.scope === "historical" ? 0 : 4, 12, 8);
  const spacing = clamp(rawSpacing, 8, 16, 12);

  const normalized = {
    ...sourceSpec,
    rounded: { ...sourceSpec.rounded, md: `${radius}px` },
    spacing: { ...sourceSpec.spacing, md: `${spacing}px` },
    launcherUsage: usage,
    launcherAdapted: usage.scope !== "product-ui" || `${radius}px` !== String(rawRadius || "") || `${spacing}px` !== String(rawSpacing || ""),
  };

  if (usage.scope === "brand-web") {
    // Preserve brand colors, but use a dependable UI font foundation rather
    // than assuming proprietary campaign/display fonts are available in code.
    normalized.typography = {
      ...sourceSpec.typography,
      body: { ...(sourceSpec.typography?.body || {}), fontFamily: "system-ui" },
    };
  }

  if (usage.scope === "historical") {
    normalized.typography = {
      ...sourceSpec.typography,
      body: { ...(sourceSpec.typography?.body || {}), fontFamily: "system-ui" },
    };
  }

  return normalized;
}

export function designSystemUsageLabel(entry, language = "en") {
  const usage = designSystemUsage(entry);
  return language === "zh" ? usage.zh : usage.en;
}
