import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const write = (p, content) => {
  const target = path.join(root, p);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf8");
};
const remove = (p) => fs.rmSync(path.join(root, p), { recursive: true, force: true });
const exists = (p) => fs.existsSync(path.join(root, p));

function replaceAcrossRootHtml(replacements) {
  for (const name of fs.readdirSync(root)) {
    if (!name.endsWith(".html")) continue;
    const file = path.join(root, name);
    let source = fs.readFileSync(file, "utf8");
    const before = source;
    for (const [from, to] of replacements) source = source.split(from).join(to);
    if (source !== before) fs.writeFileSync(file, source, "utf8");
  }
}

const skillsCssPath = "src/features/skills/skills.css";
const skillsLayoutPath = "src/features/skills/skills-reference-layout.css";
if (!exists(skillsCssPath) || !exists(skillsLayoutPath)) throw new Error("Expected Skills canonical + reference layout files.");
let skillsCss = read(skillsCssPath).trimEnd();
let skillsLayout = read(skillsLayoutPath)
  .replace(/^\/\*[\s\S]*?\*\/\s*/, "")
  .replace(/\/\* Hero: two independent cards, matching the reference composition\. \*\//g, "/* Current Skills hero layout */")
  .replace(/\/\* Task rail: restored as the primary task-level filter above the directory\. \*\//g, "/* Current task-level filter layout */")
  .replace(/\/\* Keep the rest of the directory inside the same full-width card rhythm\. \*\//g, "/* Current full-width directory rhythm */")
  .replace(/\/\* WEB mode: filtering lives only in the left sidebar\.[\s\S]*?continuous card grid\. \*\//g, "/* WEB mode uses sidebar filtering and one continuous card grid. */")
  .trim();
write(skillsCssPath, `${skillsCss}\n\n/* Current full-width Skills layout */\n${skillsLayout}\n`);
remove(skillsLayoutPath);

const homeCssOld = "src/features/home/squarespace-home.css";
const homeJsOld = "src/features/home/editorial-home.js";
const homeCssNew = "src/features/home/home.css";
const homeJsNew = "src/features/home/home.js";
if (!exists(homeCssOld) || !exists(homeJsOld)) throw new Error("Expected current Home implementation files.");
write(homeCssNew, read(homeCssOld));
write(homeJsNew, read(homeJsOld));
remove(homeCssOld);
remove(homeJsOld);

const infoCssOld = "src/features/home/index.css";
const infoCssNew = "src/features/info/info.css";
if (!exists(infoCssOld)) throw new Error("Expected info-page stylesheet at old Home path.");
write(infoCssNew, read(infoCssOld));
remove(infoCssOld);

const libraryDetailOld = "src/features/library/library-detail-minimal.css";
const libraryDetailNew = "src/features/library/library-detail.css";
if (!exists(libraryDetailOld)) throw new Error("Expected current Library detail stylesheet.");
write(libraryDetailNew, read(libraryDetailOld));
remove(libraryDetailOld);

replaceAcrossRootHtml([
  ["  <link rel=\"stylesheet\" href=\"./src/features/skills/skills-reference-layout.css?v=20260829-reference-layout-v1\">\n", ""],
  ["./src/features/home/squarespace-home.css?v=20260829-reference-layout-v1", "./src/features/home/home.css?v=20260830"],
  ["./src/features/home/editorial-home.js?v=20260829-reference-layout-v1", "./src/features/home/home.js?v=20260830"],
  ["./src/features/home/index.css?v=20260828-unified-v1", "./src/features/info/info.css?v=20260830"],
  ["./src/features/home/index.css", "./src/features/info/info.css"],
  ["./src/features/library/library-detail-minimal.css?v=20260820-detail-layout-v2", "./src/features/library/library-detail.css?v=20260830"],
]);

const skillsHtmlPath = path.join(root, "skills.html");
let skillsHtml = fs.readFileSync(skillsHtmlPath, "utf8");
skillsHtml = skillsHtml.replace("./src/features/skills/skills.css?v=20260829-open-hero-v3", "./src/features/skills/skills.css?v=20260830");
fs.writeFileSync(skillsHtmlPath, skillsHtml, "utf8");

const checkerPath = path.join(root, "scripts/check_site.mjs");
let checker = fs.readFileSync(checkerPath, "utf8");
const marker = "// Single-source feature naming guard.";
if (!checker.includes(marker)) {
  const guard = [
    "",
    marker,
    "const featureRoot = path.join(root, \"src/features\");",
    "const versionLikeName = /(?:^|[-_.])(new|old|backup|final|redesign|reference-layout|override|overrides|fix|fixes|hardening|legacy|compat|compatibility)(?:[-_.]|$)|[-_.]v\\d+(?:[-_.]|$)/i;",
    "const walkFeatures = (dir) => {",
    "  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {",
    "    const absolute = path.join(dir, entry.name);",
    "    if (entry.isDirectory()) walkFeatures(absolute);",
    "    else if (versionLikeName.test(entry.name)) {",
    "      failures.push(\"Version-like feature file is not allowed; update the canonical file instead: \" + path.relative(root, absolute));",
    "    }",
    "  }",
    "};",
    "walkFeatures(featureRoot);",
    "",
  ].join("\n");
  checker = checker.replace("\ntry {\n  const catalog", `${guard}try {\n  const catalog`);
  fs.writeFileSync(checkerPath, checker, "utf8");
}

for (const docName of ["AGENTS.md", "CLAUDE.md"]) {
  const docPath = path.join(root, docName);
  if (!fs.existsSync(docPath)) continue;
  let doc = fs.readFileSync(docPath, "utf8").trimEnd();
  if (!doc.includes("## Single Source of Truth")) {
    doc += [
      "",
      "",
      "## Single Source of Truth",
      "",
      "- Each public page has one current production implementation on `main`. Git history is the archive.",
      "- Never create parallel page versions such as `*-v2`, `*-final`, `*-reference-layout`, `*-override`, `*-fix`, `*-legacy`, or `*-redesign` under `src/features/`.",
      "- When a redesign is accepted, merge it into the canonical page CSS/JS and delete the superseded implementation in the same change.",
      "- Split files only by stable responsibility (data, filtering, rendering, preview, i18n, detail), never by design iteration.",
    ].join("\n");
    fs.writeFileSync(docPath, `${doc}\n`, "utf8");
  }
}

for (const retired of [skillsLayoutPath, homeCssOld, homeJsOld, infoCssOld, libraryDetailOld]) {
  if (exists(retired)) throw new Error(`Retired version path still exists: ${retired}`);
}
for (const canonical of [skillsCssPath, homeCssNew, homeJsNew, infoCssNew, libraryDetailNew]) {
  if (!exists(canonical)) throw new Error(`Canonical path missing: ${canonical}`);
}

console.log("Single-source page refactor complete.");
