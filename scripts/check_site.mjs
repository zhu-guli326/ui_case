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
const requiredDirs = ["assets", "catalog", "demo", "src", "docs/pages"];
const requirementManifestRelative = "docs/pages/manifest.json";
const requirementReadmeRelative = "docs/pages/README.md";
const failures = [];

for (const entry of [
  ...publicEntries,
  ...requiredDirs,
  "AGENTS.md",
  "catalog/index.js",
  requirementManifestRelative,
  requirementReadmeRelative,
]) {
  if (!fs.existsSync(path.join(root, entry))) failures.push(`Missing required site path: ${entry}`);
}

// Per-page requirement-document contract: every full public product page owns one
// independent document, resolved through the machine-readable manifest.
const requiredRequirementSections = [
  "Page identity",
  "Page goal",
  "Core user task",
  "Core functions",
  "Information structure",
  "Interaction rules",
  "Keep",
  "Remove / avoid",
  "Modification boundary",
];
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const hasRequirementSection = (source, title) => new RegExp(`^##\\s+${escapeRegExp(title)}\\s*$`, "m").test(source);
const implementationOwnershipPattern = /\b(?:Canonical (?:implementation|runtime|core|styles)|Shared implementation family|Main styles):/i;
const requirementManifestPath = path.join(root, requirementManifestRelative);
const requirementDir = path.join(root, "docs/pages");
let requirementManifest = null;
let mappedRequirementCount = 0;

if (fs.existsSync(requirementManifestPath)) {
  try {
    requirementManifest = JSON.parse(fs.readFileSync(requirementManifestPath, "utf8"));
  } catch (error) {
    failures.push(`${requirementManifestRelative} is not valid JSON: ${error.message}`);
  }
}

if (requirementManifest) {
  const pages = requirementManifest.pages;
  const redirects = requirementManifest.redirects ?? {};

  if (!Number.isInteger(requirementManifest.version) || requirementManifest.version < 1) {
    failures.push(`${requirementManifestRelative} must contain an integer version >= 1.`);
  }
  if (!pages || typeof pages !== "object" || Array.isArray(pages)) {
    failures.push(`${requirementManifestRelative} must contain a pages object.`);
  } else {
    const mappedDocs = new Map();
    mappedRequirementCount = Object.keys(pages).length;

    for (const entry of shellPages) {
      if (!pages[entry]) failures.push(`${entry} has no requirement document mapping in ${requirementManifestRelative}.`);
    }

    for (const [route, docRelative] of Object.entries(pages)) {
      if (!shellPages.includes(route)) {
        failures.push(`${requirementManifestRelative} maps unknown or redirect-only route as a product page: ${route}`);
      }
      if (typeof docRelative !== "string" || !docRelative.startsWith("docs/pages/") || !docRelative.endsWith(".md")) {
        failures.push(`${requirementManifestRelative} must map ${route} to a Markdown file under docs/pages/.`);
        continue;
      }

      const previousRoute = mappedDocs.get(docRelative);
      if (previousRoute) {
        failures.push(`Requirement document must be unique per page: ${docRelative} is mapped by both ${previousRoute} and ${route}.`);
      } else {
        mappedDocs.set(docRelative, route);
      }

      const docPath = path.join(root, docRelative);
      if (!fs.existsSync(docPath)) {
        failures.push(`${route} maps to missing requirement document: ${docRelative}`);
        continue;
      }

      const docSource = fs.readFileSync(docPath, "utf8");
      if (!docSource.includes(`Public route: \`${route}\``)) {
        failures.push(`${docRelative} must declare the exact public route: ${route}.`);
      }
      if (!/^Last updated: \d{4}-\d{2}-\d{2}\s*$/m.test(docSource)) {
        failures.push(`${docRelative} must contain Last updated: YYYY-MM-DD.`);
      }
      for (const section of requiredRequirementSections) {
        if (!hasRequirementSection(docSource, section)) {
          failures.push(`${docRelative} is missing required section: ${section}.`);
        }
      }
      if (!implementationOwnershipPattern.test(docSource)) {
        failures.push(`${docRelative} must identify its canonical/runtime/shared implementation ownership.`);
      }
    }

    if (fs.existsSync(requirementDir)) {
      for (const entry of fs.readdirSync(requirementDir, { withFileTypes: true })) {
        if (!entry.isFile() || !entry.name.endsWith(".md") || entry.name === "README.md") continue;
        const docRelative = `docs/pages/${entry.name}`;
        if (!mappedDocs.has(docRelative)) failures.push(`Orphan page requirement document is not mapped in ${requirementManifestRelative}: ${docRelative}`);
      }
    }
  }

  if (!redirects || typeof redirects !== "object" || Array.isArray(redirects)) {
    failures.push(`${requirementManifestRelative} redirects must be an object when provided.`);
  } else if (pages && typeof pages === "object" && !Array.isArray(pages)) {
    for (const entry of publicEntries) {
      if (!pages[entry] && !redirects[entry]) {
        failures.push(`${entry} is not covered by either pages or redirects in ${requirementManifestRelative}.`);
      }
    }

    for (const [route, target] of Object.entries(redirects)) {
      if (!publicEntries.includes(route)) failures.push(`${requirementManifestRelative} contains redirect for unknown public entry: ${route}`);
      if (pages[route]) failures.push(`${route} cannot be both a product page and a redirect in ${requirementManifestRelative}.`);
      if (typeof target !== "string" || !pages[target]) {
        failures.push(`${route} redirect target must be a mapped product page in ${requirementManifestRelative}: ${target}`);
      }
    }
  }
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

console.log(`Site check passed. ${publicEntries.length} public entries, ${shellPages.length} shared-shell pages and ${mappedRequirementCount} page requirement documents verified.`);
