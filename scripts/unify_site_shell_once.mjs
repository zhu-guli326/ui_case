import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const pages = [
  "learn.html",
  "library.html",
  "brands.html",
  "vocabulary.html",
  "launcher.html",
  "skills.html",
  "skill-detail.html",
  "about.html",
  "contact.html",
  "privacy.html",
];

const retiredShellLinks = [
  "./src/core/app-shell/design-tokens.css",
  "./src/core/app-shell/language-switch.css",
  "./src/components/site-header/site-header.css",
  "./src/components/site-header/site-footer.css",
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

for (const page of pages) {
  const file = path.join(root, page);
  let source = fs.readFileSync(file, "utf8");

  source = source.replace(/\s*<link\b[^>]*href=["']\.\/src\/core\/app-shell\/site-shell\.css(?:\?[^"']*)?["'][^>]*>\s*/gi, "\n");

  for (const href of retiredShellLinks) {
    const pattern = new RegExp(`\\s*<link\\b[^>]*href=["']${escapeRegExp(href)}(?:\\?[^"']*)?["'][^>]*>\\s*`, "gi");
    source = source.replace(pattern, "\n");
  }

  if (!source.includes("<image2-site-header data-site-header></image2-site-header>")) {
    throw new Error(`${page} is missing the canonical image2-site-header element.`);
  }

  if (!/<\/title>/i.test(source)) throw new Error(`${page} is missing </title>.`);
  source = source.replace(/<\/title>/i, `</title>\n  <link rel="stylesheet" href="./src/core/app-shell/site-shell.css?v=20260830-shell-v1">`);

  const appShellPattern = /<script\s+src=["']\.\/src\/core\/app-shell\/app-shell\.js(?:\?[^"']*)?["']><\/script>/gi;
  const appShellMatches = [...source.matchAll(appShellPattern)];
  if (appShellMatches.length !== 1) throw new Error(`${page} must have exactly one app-shell.js script before normalization; found ${appShellMatches.length}.`);
  source = source.replace(appShellPattern, '<script src="./src/core/app-shell/app-shell.js?v=20260830-shell-v1"></script>');

  fs.writeFileSync(file, source, "utf8");
}

console.log(`Unified shared shell imports for ${pages.length} public pages.`);
