#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const write = (relative, content) => fs.writeFileSync(path.join(root, relative), content, "utf8");

function stripManualVersions(source) {
  return source.replace(/(["'`])((?:\.\.?\/|\/(?!\/))[^"'`\s]+?)\?v=[^"'`\s&#)]+/g, "$1$2");
}

function walk(dir, visitor) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(absolute, visitor);
    else visitor(absolute);
  }
}

function takeConst(source, name) {
  const start = source.indexOf(`const ${name} =`);
  if (start < 0) throw new Error(`Missing const ${name}`);
  const equals = source.indexOf("=", start);
  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  let end = -1;

  for (let index = equals + 1; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (lineComment) {
      if (char === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") { blockComment = false; index += 1; }
      continue;
    }
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (char === "\\") { escaped = true; continue; }
      if (char === quote) quote = null;
      continue;
    }

    if (char === "/" && next === "/") { lineComment = true; index += 1; continue; }
    if (char === "/" && next === "*") { blockComment = true; index += 1; continue; }
    if (char === "\"" || char === "'" || char === "`") { quote = char; continue; }
    if (char === "(" || char === "[" || char === "{") { depth += 1; continue; }
    if (char === ")" || char === "]" || char === "}") { depth -= 1; continue; }
    if (char === ";" && depth === 0) { end = index + 1; break; }
  }

  if (end < 0) throw new Error(`Could not find end of const ${name}`);
  let removeEnd = end;
  while (source[removeEnd] === "\r" || source[removeEnd] === "\n") removeEnd += 1;
  const statement = source.slice(start, end);
  const initializer = statement.slice(statement.indexOf("=") + 1, -1).trim();
  return {
    statement,
    initializer,
    source: `${source.slice(0, start)}${source.slice(removeEnd)}`,
  };
}

// 1) Launcher: accepted page CSS lives in the canonical feature stylesheet, not HTML.
{
  const htmlPath = "launcher.html";
  const cssPath = "src/features/launcher/launcher-dna.css";
  let html = read(htmlPath);
  const inlineBlocks = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)];
  if (inlineBlocks.length) {
    const movedCss = inlineBlocks.map((match) => match[1].trim()).filter(Boolean).join("\n\n");
    html = html.replace(/\s*<style\b[^>]*>[\s\S]*?<\/style>\s*/gi, "\n");
    const css = read(cssPath).trimEnd();
    write(cssPath, `${css}\n\n/* Launcher page layout migrated from the retired inline patch. */\n${movedCss}\n`);
    write(htmlPath, html);
  }
}

// 2) Vocabulary runtime: move static responsibility blocks out of the orchestration entry.
{
  const file = "src/features/vocabulary/vocabulary.js";
  let source = read(file);

  const translationStart = source.indexOf("i18n?.addTranslations({");
  const translationEnd = source.indexOf("\n\nconst tr =", translationStart);
  if (translationStart < 0 || translationEnd < 0) throw new Error("Could not locate vocabulary translations block");
  const translationCall = source.slice(translationStart, translationEnd);
  const translationObject = translationCall.slice(translationCall.indexOf("(") + 1, translationCall.lastIndexOf(");")).trim();
  write("src/features/vocabulary/vocabulary-i18n.js", `export const vocabularyTranslations = ${translationObject};\n`);
  source = `${source.slice(0, translationStart)}i18n?.addTranslations(vocabularyTranslations);${source.slice(translationEnd)}`;

  const navPrinciples = takeConst(source, "navigationPrinciples"); source = navPrinciples.source;
  const navPatterns = takeConst(source, "navigationPatterns"); source = navPatterns.source;
  write("src/features/vocabulary/vocabulary-navigation-data.js", `${navPrinciples.statement.replace(/^const /, "export const ")}\n\n${navPatterns.statement.replace(/^const /, "export const ")}\n`);

  const variantIds = takeConst(source, "interactiveVariantIds"); source = variantIds.source;
  const cardMediaPool = takeConst(source, "cardMediaPool"); source = cardMediaPool.source;
  const layoutCardMedia = takeConst(source, "layoutCardMedia"); source = layoutCardMedia.source;
  write("src/features/vocabulary/vocabulary-card-config.js", `${variantIds.statement.replace(/^const /, "export const ")}\n\n${cardMediaPool.statement.replace(/^const /, "export const ")}\n\n${layoutCardMedia.statement.replace(/^const /, "export const ")}\n`);

  source = `import { vocabularyTranslations } from "./vocabulary-i18n.js";\nimport { navigationPatterns, navigationPrinciples } from "./vocabulary-navigation-data.js";\nimport { cardMediaPool, interactiveVariantIds, layoutCardMedia } from "./vocabulary-card-config.js";\n${source}`;
  write(file, source);
}

// 3) Vocabulary preview: media selection/configuration is a separate stable responsibility.
{
  const file = "src/features/vocabulary/vocabulary-preview.js";
  let source = read(file);
  const projectMediaUrl = takeConst(source, "projectMediaUrl"); source = projectMediaUrl.source;
  const solutionMedia = takeConst(source, "solutionMedia"); source = solutionMedia.source;
  const solutionMediaSets = takeConst(source, "solutionMediaSets"); source = solutionMediaSets.source;
  const componentHeroMedia = takeConst(source, "componentHeroMedia"); source = componentHeroMedia.source;
  const componentCardMedia = takeConst(source, "componentCardMedia"); source = componentCardMedia.source;

  write("src/features/vocabulary/vocabulary-preview-media.js", `${projectMediaUrl.statement}\n\n${solutionMedia.statement.replace(/^const /, "export const ")}\n\n${solutionMediaSets.statement.replace(/^const /, "export const ")}\n\n${componentHeroMedia.statement.replace(/^const /, "export const ")}\n\n${componentCardMedia.statement.replace(/^const /, "export const ")}\n`);
  source = `import { componentCardMedia, componentHeroMedia, solutionMedia, solutionMediaSets } from "./vocabulary-preview-media.js";\n${source}`;
  write(file, source);
}

// 4) Manual cache-busting query strings are removed. HTTP validators own normal static caching.
for (const name of fs.readdirSync(root)) {
  if (!name.endsWith(".html")) continue;
  const relative = name;
  write(relative, stripManualVersions(read(relative)));
}
walk(path.join(root, "src"), (absolute) => {
  if (!/\.(?:js|mjs|css)$/i.test(absolute)) return;
  const relative = path.relative(root, absolute);
  write(relative, stripManualVersions(read(relative)));
});

// 5) Strengthen the permanent site contract.
{
  const file = "scripts/check_site.mjs";
  let source = read(file);
  source = source.replace(
    /for \(const style of source\.matchAll\(\/<style\\b\[\^>\]\*>\(\[\\s\\S\]\*\?\)<\\\/style>\/gi\)\) \{[\s\S]*?\n  \}\n\}/,
    `if (/<style\\b/i.test(source)) failures.push(\`${"${entry}"} must not keep accepted page CSS in inline <style>; move it to the canonical feature stylesheet.\`);\n}`
  );

  const cacheGuard = `\n// Local static assets rely on normal HTTP validators. Do not hand-maintain ?v= cache strings.\nconst manualVersionPattern = /["'\\\`]((?:\\.\\.?\\/|\\/(?!\\/))[^"'\\\`\\s]+)\\?v=/i;\nfor (const entry of publicEntries) {\n  const source = fs.readFileSync(path.join(root, entry), "utf8");\n  if (manualVersionPattern.test(source)) failures.push(\`${"${entry}"} contains a manual local ?v= cache version. Remove it instead of maintaining per-file versions.\`);\n}\nconst walkSourceVersions = (dir) => {\n  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {\n    const absolute = path.join(dir, entry.name);\n    if (entry.isDirectory()) { walkSourceVersions(absolute); continue; }\n    if (!/\\.(?:js|mjs|css)$/i.test(entry.name)) continue;\n    const source = fs.readFileSync(absolute, "utf8");\n    if (manualVersionPattern.test(source)) failures.push(\`${"${path.relative(root, absolute)}"} contains a manual local ?v= cache version.\`);\n  }\n};\nwalkSourceVersions(path.join(root, "src"));\n`;
  source = source.replace("\ntry {\n  const catalog = await import", `${cacheGuard}\ntry {\n  const catalog = await import`);
  write(file, source);
}

// 6) Keep the Agent handbook aligned with the architecture.
{
  const file = "AGENTS.md";
  let source = read(file);
  if (!source.includes("## Cache and inline-style hygiene")) {
    source = `${source.trimEnd()}\n\n## Cache and inline-style hygiene\n\n- Do not append hand-maintained local asset query versions such as \`?v=20260830\`, \`?v=v2\`, or descriptive migration tags. Normal static delivery relies on HTTP cache validators; if immutable hashed assets are introduced later, they must come from a real build step rather than manual HTML edits.\n- Accepted page CSS must live in the canonical feature stylesheet. Do not leave normal production styling in inline \`<style>\` blocks as a patch layer.\n- A refactor that reduces an AI context hotspot should split by stable responsibility and keep orchestration entry files below roughly 50 KB when practical.\n`;
    write(file, source);
  }
}

// Normalize line endings/trailing newline for touched text files.
for (const relative of [
  "launcher.html",
  "src/features/launcher/launcher-dna.css",
  "src/features/vocabulary/vocabulary.js",
  "src/features/vocabulary/vocabulary-preview.js",
  "src/features/vocabulary/vocabulary-i18n.js",
  "src/features/vocabulary/vocabulary-navigation-data.js",
  "src/features/vocabulary/vocabulary-card-config.js",
  "src/features/vocabulary/vocabulary-preview-media.js",
  "scripts/check_site.mjs",
  "AGENTS.md",
]) {
  write(relative, `${read(relative).replace(/\r\n/g, "\n").trimEnd()}\n`);
}

for (const relative of [
  "src/features/vocabulary/vocabulary.js",
  "src/features/vocabulary/vocabulary-preview.js",
  "src/features/vocabulary/vocabulary-i18n.js",
  "src/features/vocabulary/vocabulary-navigation-data.js",
  "src/features/vocabulary/vocabulary-card-config.js",
  "src/features/vocabulary/vocabulary-preview-media.js",
  "scripts/check_site.mjs",
]) {
  execFileSync(process.execPath, ["--check", path.join(root, relative)], { stdio: "inherit" });
}

const runtimeSize = fs.statSync(path.join(root, "src/features/vocabulary/vocabulary.js")).size;
const previewSize = fs.statSync(path.join(root, "src/features/vocabulary/vocabulary-preview.js")).size;
console.log(`Vocabulary runtime entry: ${runtimeSize} bytes`);
console.log(`Vocabulary preview entry: ${previewSize} bytes`);
if (runtimeSize >= 50000) throw new Error(`vocabulary.js is still a context hotspot at ${runtimeSize} bytes`);
if (previewSize >= 50000) throw new Error(`vocabulary-preview.js is still a context hotspot at ${previewSize} bytes`);

for (const name of fs.readdirSync(root).filter((name) => name.endsWith(".html") && name !== "index.html")) {
  if (/<style\b/i.test(read(name))) throw new Error(`${name} still contains inline <style>`);
}

execFileSync("npm", ["run", "build:catalog", "--", "--check"], { cwd: root, stdio: "inherit" });
execFileSync("npm", ["run", "check"], { cwd: root, stdio: "inherit" });
console.log("One-time runtime cleanup completed successfully.");
