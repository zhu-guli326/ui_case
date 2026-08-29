import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const featureDir = path.join(root, "src/features/vocabulary");
const dataDir = path.join(featureDir, "data");
const sourcePath = path.join(dataDir, "index.js");
const before = await import(`${pathToFileURL(sourcePath).href}?before=${Date.now()}`);
const categories = before.vocabularyCategories;
const entries = before.vocabularyEntries;

if (!Array.isArray(categories) || !Array.isArray(entries) || typeof before.localizeVocabularyEntry !== "function") {
  throw new Error("Unexpected Vocabulary data exports.");
}

const assertSerializable = (value, label) => {
  const type = typeof value;
  if (value === undefined || type === "function" || type === "symbol" || type === "bigint") {
    throw new Error(`Non-serializable value at ${label}`);
  }
  if (value && type === "object") {
    if (Array.isArray(value)) value.forEach((item, index) => assertSerializable(item, `${label}[${index}]`));
    else {
      if (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) {
        throw new Error(`Non-plain object at ${label}`);
      }
      Object.entries(value).forEach(([key, item]) => assertSerializable(item, `${label}.${key}`));
    }
  }
};

assertSerializable(categories, "categories");
assertSerializable(entries, "entries");

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const localizedDiff = (entry) => {
  const localized = before.localizeVocabularyEntry(entry, "en");
  const diff = {};
  for (const [key, value] of Object.entries(localized)) {
    if (!same(entry[key], value)) diff[key] = value;
  }
  assertSerializable(diff, `english.${entry.id}`);
  return diff;
};

const declaredCategories = categories
  .map((item) => item.id)
  .filter((id) => !["all", "favorites"].includes(id));
const groups = new Map(declaredCategories.map((id) => [id, []]));
for (const entry of entries) {
  const key = entry.category || "other";
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(entry);
}

const camel = (value) => value
  .replace(/[^a-zA-Z0-9]+(.)/g, (_, next) => next.toUpperCase())
  .replace(/^[^a-zA-Z_]+/, "");

const renderModule = (category, chunk, suffix = "") => {
  const base = camel(category) || "other";
  const english = Object.fromEntries(chunk.map((entry) => [entry.id, localizedDiff(entry)]));
  return [
    `export const ${base}Entries${suffix} = ${JSON.stringify(chunk, null, 2)};`,
    "",
    `export const ${base}English${suffix} = ${JSON.stringify(english, null, 2)};`,
    "",
  ].join("\n");
};

const MAX_MODULE_BYTES = 28000;
const moduleSpecs = [];
for (const [category, group] of groups) {
  if (!group.length) continue;
  const chunks = [];
  let current = [];
  for (const entry of group) {
    const candidate = [...current, entry];
    if (current.length && Buffer.byteLength(renderModule(category, candidate, "1"), "utf8") > MAX_MODULE_BYTES) {
      chunks.push(current);
      current = [entry];
    } else {
      current = candidate;
    }
  }
  if (current.length) chunks.push(current);

  chunks.forEach((chunk, index) => {
    const suffix = chunks.length === 1 ? "" : String(index + 1);
    const fileSuffix = chunks.length === 1 ? "" : `-${index + 1}`;
    const fileName = `${category}${fileSuffix}.js`;
    const source = renderModule(category, chunk, suffix);
    if (Buffer.byteLength(source, "utf8") > 32000) throw new Error(`${fileName} still exceeds 32KB.`);
    moduleSpecs.push({ category, fileName, suffix, source });
  });
}

for (const file of fs.readdirSync(dataDir)) {
  if (file.endsWith(".js") && file !== "index.js") fs.rmSync(path.join(dataDir, file));
}
for (const spec of moduleSpecs) fs.writeFileSync(path.join(dataDir, spec.fileName), spec.source, "utf8");

const importLines = [];
const entryRefs = [];
const englishRefs = [];
for (const spec of moduleSpecs) {
  const base = camel(spec.category) || "other";
  const entryName = `${base}Entries${spec.suffix}`;
  const englishName = `${base}English${spec.suffix}`;
  importLines.push(`import { ${entryName}, ${englishName} } from "./${spec.fileName}";`);
  entryRefs.push(`...${entryName}`);
  englishRefs.push(englishName);
}

const order = entries.map((entry) => entry.id);
const indexLines = [
  ...importLines,
  "",
  `export const vocabularyCategories = ${JSON.stringify(categories, null, 2)};`,
  "",
  `const vocabularyEntryPool = Object.fromEntries([${entryRefs.join(", ")}].map((entry) => [entry.id, entry]));`,
  `const vocabularyOrder = ${JSON.stringify(order, null, 2)};`,
  `const vocabularyEnglishById = Object.assign({}, ${englishRefs.join(", ")});`,
  "",
  "export const vocabularyEntries = vocabularyOrder.map((id) => vocabularyEntryPool[id]).filter(Boolean);",
  "",
  "export function localizeVocabularyEntry(entry, language = \"zh\") {",
  "  if (!entry || language !== \"en\") return entry;",
  "  if (entry.componentKind) {",
  "    const categoryNames = { hero: \"hero\", card: \"card\", button: \"button\", modal: \"modal\", form: \"form\", tabs: \"tabs\" };",
  "    const categoryName = categoryNames[entry.componentKind] || \"UI\";",
  "    return {",
  "      ...entry,",
  "      name: entry.en,",
  "      level: \"Component term\",",
  "      tags: [categoryName[0].toUpperCase() + categoryName.slice(1), \"Reusable pattern\"],",
  "      ask: `I need a ${entry.en} for a product interface.`,",
  "      definition: `A ${entry.en} is a reusable ${categoryName} interface pattern.`,",
  "      role: \"It gives the page a clear, reusable structure.\",",
  "      anatomy: [[\"Structure\", \"Keep content, actions, and states clearly organized\"], [\"Responsive behavior\", \"Adapt the layout and size to the available space\"], [\"Interaction states\", \"Cover default, hover, focus, loading, and error states\"]],",
  "      variants: [[\"Default form\", \"Use the standard version for the main scenario\"], [\"Small-screen form\", \"Keep content readable and actions reachable on mobile\"]],",
  "      states: [[\"Default\", \"Content and the main action are visible\"], [\"Focused\", \"Keyboard users can see the current position\"], [\"Loading or error\", \"Feedback appears without shifting the layout\"]],",
  "      useWhen: [\"The interface needs this reusable structure\", \"You need a clear term for design or engineering collaboration\"],",
  "      avoidWhen: [\"The content goal does not match the pattern\"],",
  "      confusedWith: `A ${entry.en} is a reusable interface structure, not an entire page or business workflow.`,",
  "      codeUI: [\"Semantic HTML, stable dimensions, responsive layout, and keyboard focus\"],",
  "      media: [\"Images, video, and illustration remain replaceable content media\"],",
  "      prompt: `Build a ${entry.en} for a product interface. Keep it responsive, accessible, and complete with default, focus, loading, and error states.`,",
  "    };",
  "  }",
  "  return { ...entry, ...(vocabularyEnglishById[entry.id] || {}), en: entry.en };",
  "}",
  "",
  "export const vocabularyById = Object.fromEntries(vocabularyEntries.map((entry) => [entry.id, entry]));",
  "",
];
fs.writeFileSync(sourcePath, indexLines.join("\n"), "utf8");

const runtimePath = path.join(featureDir, "vocabulary.js");
let runtime = fs.readFileSync(runtimePath, "utf8");
const replacements = [
  ["./vocabulary-data.js?v=20260822-layout-section-v1", "./data/index.js?v=20260830-data-split-v1"],
  ["./src/features/vocabulary/vocabulary-component-data.js?v=20260822-form-details-v1", "./vocabulary-component-data.js?v=20260822-form-details-v1"],
  ["./src/features/vocabulary/vocabulary-search.mjs?v=20260824-category-intent-v1", "./vocabulary-search.mjs?v=20260824-category-intent-v1"],
];
for (const [from, to] of replacements) {
  if (!runtime.includes(from)) throw new Error(`Expected runtime import not found: ${from}`);
  runtime = runtime.replace(from, to);
}
if (runtime.includes("./src/features/vocabulary/")) throw new Error("Nested Vocabulary bridge import still exists.");
fs.writeFileSync(runtimePath, runtime, "utf8");

fs.rmSync(path.join(featureDir, "src"), { recursive: true, force: true });
fs.rmSync(path.join(featureDir, "vocabulary-data.js"), { force: true });

const after = await import(`${pathToFileURL(sourcePath).href}?after=${Date.now()}`);
if (!same(after.vocabularyCategories, categories)) throw new Error("Vocabulary categories changed during split.");
if (!same(after.vocabularyEntries, entries)) throw new Error("Vocabulary entry content/order changed during split.");
if (!same(after.vocabularyById, before.vocabularyById)) throw new Error("Vocabulary index changed during split.");
for (const entry of entries) {
  if (!same(after.localizeVocabularyEntry(entry, "en"), before.localizeVocabularyEntry(entry, "en"))) {
    throw new Error(`English localization changed for ${entry.id}.`);
  }
}
const componentProbe = { id: "probe", en: "Probe Card", componentKind: "card", category: "content" };
if (!same(after.localizeVocabularyEntry(componentProbe, "en"), before.localizeVocabularyEntry(componentProbe, "en"))) {
  throw new Error("Component localization behavior changed.");
}

const sizes = moduleSpecs.map((spec) => ({
  file: spec.fileName,
  bytes: fs.statSync(path.join(dataDir, spec.fileName)).size,
}));
console.log("Vocabulary split complete:", sizes);
