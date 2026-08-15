export const DESIGN_SYSTEM_ID_ALIASES = Object.freeze({
  ant: "ant-design",
  apple: "apple-hig",
  arco: "arco-design",
  atlassian: "atlassian-design",
  carbon: "carbon-design",
  chakra: "chakra-ui",
  fluent: "fluent-2",
  headless: "headless-ui",
  material: "google-material-3",
  polaris: "shopify-polaris",
  primer: "github-primer",
  radix: "radix-ui",
  semi: "semi-design",
  shadcn: "shadcn-ui",
  spectrum: "adobe-spectrum",
});

const SPECIAL_LABELS = Object.freeze({
  auto: { zh: "自动推荐", en: "Auto-recommend" },
  custom: { zh: "自定义", en: "Custom" },
});

export function normalizeDesignSystemId(value) {
  const id = value == null ? "" : String(value).trim();
  return DESIGN_SYSTEM_ID_ALIASES[id] || id;
}

export function normalizeDesignSystemIds(values) {
  const source = Array.isArray(values) ? values : values == null || values === "" ? [] : [values];
  return [...new Set(source.map(normalizeDesignSystemId).filter(Boolean))];
}

export function localizeDesignSystem(profile, locale = "zh") {
  if (!profile) return null;
  const language = locale === "en" ? "en" : "zh";
  return language === "en" ? { ...profile, ...(profile.locales?.en || {}) } : profile;
}

export function designSystemOptions(profiles, locale = "zh") {
  return (profiles || []).map(function (profile) {
    const localized = localizeDesignSystem(profile, locale);
    const organization = localized.organization || "";
    return Object.freeze({
      value: localized.id,
      label: localized.name,
      optionLabel: organization && organization !== localized.name
        ? localized.name + " · " + organization
        : localized.name,
      organization,
      detail: localized.description || "",
    });
  });
}

export function designSystemLabel(value, profiles, locale = "zh") {
  const language = locale === "en" ? "en" : "zh";
  const id = normalizeDesignSystemId(value);
  const special = SPECIAL_LABELS[id];
  if (special) return special[language];
  return (profiles || []).find((profile) => profile.id === id)?.name || id;
}
