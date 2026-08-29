#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicEntries = [
  "index.html", "learn.html", "library.html", "brands.html", "vocabulary.html",
  "launcher.html", "skills.html", "skill-detail.html", "about.html", "contact.html", "privacy.html"
];
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

// Single-source feature naming guard.
const featureRoot = path.join(root, "src/features");
const versionLikeName = /(?:^|[-_.])(new|old|backup|final|redesign|reference-layout|override|overrides|fix|fixes|hardening|legacy|compat|compatibility)(?:[-_.]|$)|[-_.]v\d+(?:[-_.]|$)/i;
const walkFeatures = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFeatures(absolute);
    else if (versionLikeName.test(entry.name)) {
      failures.push("Version-like feature file is not allowed; update the canonical file instead: " + path.relative(root, absolute));
    }
  }
};
walkFeatures(featureRoot);
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

console.log(`Site check passed. ${publicEntries.length} public entries verified.`);
