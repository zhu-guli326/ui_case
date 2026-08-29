#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicEntries = [
  "index.html", "learn.html", "library.html", "brands.html", "vocabulary.html",
  "launcher.html", "skills.html", "skill-detail.html", "about.html", "contact.html", "privacy.html"
];
const shellPages = publicEntries.filter((entry) => entry !== "index.html");
const requiredDirs = ["assets", "catalog", "demo", "src"];
const failures = [];

for (const entry of [...publicEntries, ...requiredDirs, "catalog/index.js"]) {
  if (!fs.existsSync(path.join(root, entry))) failures.push(`Missing required site path: ${entry}`);
}

for (const entry of publicEntries) {
  const source = fs.readFileSync(path.join(root, entry), "utf8");
  for (const match of source.matchAll(/(?:src|href)=["']([^"']+)["']/gi)) {
    const value = match[1].trim();
    if (!value || /^(?:https?:|mailto:|tel:|javascript:|#|\/\/)/i.test(value)) continue;
    const clean = value.split(/[?#]/)[0];
    if (!clean) continue;
    const siteRelative = clean.replace(/^(?:\.\/|\/)/, "");
    const target = path.resolve(root, siteRelative);
    if (!target.startsWith(root) || !fs.existsSync(target)) failures.push(`${entry} references missing local path: ${value}`);
  }
}

// Global App Shell contract: every full page uses exactly the same shared chrome.
const directShellStyles = [
  "./src/core/app-shell/design-tokens.css",
  "./src/core/app-shell/language-switch.css",
  "./src/components/site-header/site-header.css",
  "./src/components/site-header/site-footer.css",
];
const countMatches = (source, pattern) => [...source.matchAll(pattern)].length;
const sharedShellSelector = /(?:\.site-header\b|\.site-nav(?:-[\w-]+)?\b|\.site-brand(?:-[\w-]+)?\b|\.global-language-switch\b|\.site-footer(?:-[\w-]+)?\b|image2-site-header\b)/i;

for (const entry of shellPages) {
  const source = fs.readFileSync(path.join(root, entry), "utf8");
  const shellCssCount = countMatches(source, /href=["']\.\/src\/core\/app-shell\/site-shell\.css(?:\?[^"']*)?["']/gi);
  const shellJsCount = countMatches(source, /src=["']\.\/src\/core\/app-shell\/app-shell\.js(?:\?[^"']*)?["']/gi);
  const headerCount = countMatches(source, /<image2-site-header\b[^>]*data-site-header[^>]*><\/image2-site-header>/gi);

  if (shellCssCount !== 1) failures.push(`${entry} must load site-shell.css exactly once; found ${shellCssCount}.`);
  if (shellJsCount !== 1) failures.push(`${entry} must load app-shell.js exactly once; found ${shellJsCount}.`);
  if (headerCount !== 1) failures.push(`${entry} must render the canonical image2-site-header exactly once; found ${headerCount}.`);

  for (const href of directShellStyles) {
    if (source.includes(href)) failures.push(`${entry} loads shared chrome directly (${href}); load site-shell.css instead.`);
  }

  if (/<style\b/i.test(source)) failures.push(`${entry} must not keep accepted page CSS in inline <style>; move it to the canonical feature stylesheet.`);
}

// Feature styles own page content only; shared header/nav/footer styling stays global.
const featureRoot = path.join(root, "src/features");
const versionLikeName = /(?:^|[-_.])(new|old|backup|final|redesign|reference-layout|override|overrides|fix|fixes|hardening|legacy|compat|compatibility)(?:[-_.]|$)|[-_.]v\d+(?:[-_.]|$)/i;
const walkFeatures = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFeatures(absolute);
      continue;
    }

    const relative = path.relative(root, absolute);
    if (versionLikeName.test(entry.name)) failures.push(`Version-like feature file is not allowed; update the canonical file instead: ${relative}`);

    if (entry.name.endsWith(".css")) {
      const css = fs.readFileSync(absolute, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
      if (sharedShellSelector.test(css)) failures.push(`Feature CSS must not override shared App Shell selectors: ${relative}`);
    }
  }
};
walkFeatures(featureRoot);

// Local static assets rely on normal HTTP validators. Do not hand-maintain ?v= cache strings.
const manualVersionPattern = /["'\`]((?:\.\.?\/|\/(?!\/))[^"'\`\s]+)\?v=/i;
for (const entry of publicEntries) {
  const source = fs.readFileSync(path.join(root, entry), "utf8");
  if (manualVersionPattern.test(source)) failures.push(`${entry} contains a manual local ?v= cache version. Remove it instead of maintaining per-file versions.`);
}
const walkSourceVersions = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) { walkSourceVersions(absolute); continue; }
    if (!/\.(?:js|mjs|css)$/i.test(entry.name)) continue;
    const source = fs.readFileSync(absolute, "utf8");
    if (manualVersionPattern.test(source)) failures.push(`${path.relative(root, absolute)} contains a manual local ?v= cache version.`);
  }
};
walkSourceVersions(path.join(root, "src"));

try {
  const catalog = await import(`${new URL("../catalog/index.js", import.meta.url).href}?check=${Date.now()}`);
  for (const key of ["styleGuides", "styleProfiles", "brandProfiles", "componentReferences"]) {
    if (!Array.isArray(catalog[key])) failures.push(`catalog/index.js must export array ${key}`);
  }
} catch (error) {
  failures.push(`catalog/index.js could not be imported: ${error.message}`);
}

if (failures.length) {
  console.error("Site check failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Site check passed. ${publicEntries.length} public entries and ${shellPages.length} shared-shell pages verified.`);
