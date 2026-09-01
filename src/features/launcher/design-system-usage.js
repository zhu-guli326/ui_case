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
  spotify: {
    description: "Spotify product UI foundation. Near-black immersive surfaces with Spotify Green reserved for primary actions, active states and functional highlights.",
    colors: {
      primary: "#1ed760",
      accent: "#1ed760",
      canvas: "#121212",
      surface: "#181818",
      "surface-1": "#181818",
      "surface-2": "#1f1f1f",
      card: "#181818",
      ink: "#ffffff",
      text: "#ffffff",
      muted: "#b3b3b3",
      "text-secondary": "#b3b3b3",
      border: "#4d4d4d",
      "on-primary": "#000000",
      "on-dark": "#ffffff",
    },
    typography: {
      body: { fontFamily: "system-ui", fontSize: "14px", fontWeight: "400" },
      title: { fontFamily: "system-ui", fontSize: "16px", fontWeight: "700" },
    },
    rounded: { sm: "6px", md: "8px", lg: "12px", pill: "9999px" },
    spacing: { sm: "8px", base: "8px", md: "12px", lg: "16px" },
  },
};

const clamp = (value, min, max, fallback) => {
  const match = String(value || "").match(/-?\d+(?:\.\d+)?/);
  const number = match ? Number(match[0]) : fallback;
  return Math.min(max, Math.max(min, number));
};

const firstColor = (colors, keys) => {
  for (const key of keys) {
    const value = String(colors?.[key] || "").trim();
    if (value) return value;
  }
  return "";
};

const firstPrefixedColor = (colors, prefixes) => {
  const entries = Object.entries(colors || {});
  for (const prefix of prefixes) {
    const match = entries.find(([key, value]) => key.startsWith(prefix) && String(value || "").trim());
    if (match) return String(match[1]).trim();
  }
  return "";
};

const hexToRgb = (value) => {
  const hex = String(value || "").trim().replace(/^#/, "");
  if (!/^[\da-f]{3,8}$/i.test(hex)) return null;
  const normalized = hex.length === 3 || hex.length === 4
    ? hex.slice(0, 3).split("").map((char) => char + char).join("")
    : hex.slice(0, 6);
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
};

const relativeLuminance = (value) => {
  const rgb = hexToRgb(value);
  if (!rgb) return null;
  const channels = [rgb.r, rgb.g, rgb.b].map((channel) => {
    const unit = channel / 255;
    return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};

const contrastRatio = (background, foreground) => {
  const backgroundLum = relativeLuminance(background);
  const foregroundLum = relativeLuminance(foreground);
  if (backgroundLum == null || foregroundLum == null) return null;
  const lighter = Math.max(backgroundLum, foregroundLum);
  const darker = Math.min(backgroundLum, foregroundLum);
  return (lighter + 0.05) / (darker + 0.05);
};

const readableColor = (background, preferred, minimum, lightFallback, darkFallback) => {
  const preferredRatio = contrastRatio(background, preferred);
  if (preferredRatio == null || preferredRatio >= minimum) return preferred;
  const lightRatio = contrastRatio(background, lightFallback) || 0;
  const darkRatio = contrastRatio(background, darkFallback) || 0;
  return lightRatio >= darkRatio ? lightFallback : darkFallback;
};

function normalizeLauncherColors(sourceColors = {}) {
  const colors = { ...sourceColors };

  // Never use the first arbitrary brand color as a page surface. Prefer
  // semantic canvas/surface tokens, then closely related named variants.
  const canvas = firstColor(colors, ["canvas", "background", "bg", "page", "base", "canvas-parchment"])
    || firstPrefixedColor(colors, ["canvas-", "background-", "bg-"])
    || "#f5f5f5";
  const surface = firstColor(colors, ["surface", "surface-1", "surface-primary", "surface-default", "surface-base", "card", "panel", "surface-pearl"])
    || firstPrefixedColor(colors, ["surface-"])
    || canvas;

  const surfaceLum = relativeLuminance(surface);
  const canvasLum = relativeLuminance(canvas);
  const themeAnchor = surfaceLum == null ? canvasLum : surfaceLum;
  const theme = themeAnchor != null && themeAnchor < 0.34 ? "dark" : "light";

  const preferredInk = theme === "dark"
    ? firstColor(colors, ["body-on-dark", "on-dark", "text-on-dark", "foreground-on-dark", "text-primary-on-dark", "ink", "text", "foreground", "text-primary", "body"])
    : firstColor(colors, ["ink", "text", "foreground", "text-primary", "body", "on-background"]);
  const preferredMuted = theme === "dark"
    ? firstColor(colors, ["body-muted", "muted-on-dark", "text-secondary-on-dark", "ink-muted", "muted", "text-secondary", "subtle"])
    : firstColor(colors, ["ink-muted-48", "ink-muted-80", "body-muted", "ink-muted", "muted", "text-secondary", "subtle"]);

  const defaultInk = theme === "dark" ? "#f5f5f7" : "#1d1d1f";
  const defaultMuted = theme === "dark" ? "#c7c7cc" : "#6e6e73";
  const ink = readableColor(surface, preferredInk || defaultInk, 4.5, "#ffffff", "#111111");
  const muted = readableColor(surface, preferredMuted || defaultMuted, 3, "#d1d1d6", "#5f6368");

  return {
    colors: {
      ...colors,
      canvas,
      surface,
      ink,
      muted,
    },
    theme,
  };
}

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
    const normalizedColors = normalizeLauncherColors({ ...sourceSpec.colors, ...override.colors });
    return {
      ...sourceSpec,
      ...override,
      colors: normalizedColors.colors,
      typography: { ...sourceSpec.typography, ...override.typography },
      rounded: { ...sourceSpec.rounded, ...override.rounded },
      spacing: { ...sourceSpec.spacing, ...override.spacing },
      launcherUsage: designSystemUsage(entry),
      launcherTheme: normalizedColors.theme,
      launcherAdapted: true,
    };
  }

  const usage = designSystemUsage(entry);
  const rawRadius = sourceSpec.rounded?.md || sourceSpec.rounded?.base || sourceSpec.rounded?.sm;
  const rawSpacing = sourceSpec.spacing?.md || sourceSpec.spacing?.base || sourceSpec.spacing?.sm;
  const normalizedColors = normalizeLauncherColors(sourceSpec.colors);

  // All Launcher presets use a product-safe geometry envelope. Website DESIGN.md
  // files can contain 20–96px section rhythm or display-only radii that should
  // never become ordinary application component tokens.
  const radius = clamp(rawRadius, usage.scope === "historical" ? 0 : 4, 12, 8);
  const spacing = clamp(rawSpacing, 8, 16, 12);

  const normalized = {
    ...sourceSpec,
    colors: normalizedColors.colors,
    rounded: { ...sourceSpec.rounded, md: `${radius}px` },
    spacing: { ...sourceSpec.spacing, md: `${spacing}px` },
    launcherUsage: usage,
    launcherTheme: normalizedColors.theme,
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
