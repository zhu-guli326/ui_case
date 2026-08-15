#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredEntries = [
  "index.html",
  "library.html",
  "brands.html",
  "launcher.html",
  "learn.html",
  "skills.html",
  "vocabulary.html",
  "lab/index.html",
  "catalog/index.js"
];
const sourceReferenceFiles = ["library.js", "launcher.js", "launcher.html", "vocabulary-data.js"];
const forbiddenDirectoryNames = ["node_modules", "dist", ".image2-ui", "tmp"];
const failures = [];
const trackedFiles = readTrackedFiles();

for (const entry of requiredEntries) requirePath(entry, `missing required site entry: ${entry}`);

let catalog = { styleGuides: [], styleProfiles: [], brandProfiles: [], componentReferences: [] };
let checkedMediaReferences = 0;
try {
  catalog = await import(`${new URL("../catalog/index.js", import.meta.url).href}?check=${Date.now()}`);
} catch (error) {
  failures.push(`catalog could not be imported: ${error.message}`);
}

if (catalog.styleGuides.length !== 23) failures.push(`expected 23 cases, found ${catalog.styleGuides.length}`);
if (catalog.styleProfiles.length < 1) failures.push("expected at least one style profile");
if (catalog.brandProfiles.length < 1) failures.push("expected at least one design-system profile");
if (catalog.componentReferences.length < 1) failures.push("expected at least one component reference");

const brandIds = new Set(catalog.brandProfiles.map((brand) => brand.id));
const styleProfileIds = new Set(catalog.styleProfiles.map((profile) => profile.id));
const caseIds = new Set();
for (const item of catalog.styleGuides) {
  if (!item.id || caseIds.has(item.id)) failures.push(`invalid or duplicate case id: ${item.id || "(missing)"}`);
  caseIds.add(item.id);
  for (const key of ["referenceImage", "poster", "previewImage", "video", "liveDemo"]) {
    if (item[key]) requireLocalReference(item[key], `${item.id}.${key}`);
  }
  if (!Array.isArray(item.styleProfileIds) || item.styleProfileIds.length === 0) {
    failures.push(`${item.id} has no styleProfileIds`);
  } else {
    for (const profileId of item.styleProfileIds) {
      if (!styleProfileIds.has(profileId)) failures.push(`${item.id} references missing style profile ${profileId}`);
    }
  }
}

for (const component of catalog.componentReferences) {
  if (!brandIds.has(component.brandProfileId)) {
    failures.push(`${component.id} references missing design-system profile ${component.brandProfileId}`);
  }
}

for (const sourceFile of sourceReferenceFiles) {
  const source = fs.readFileSync(path.join(root, sourceFile), "utf8");
  for (const match of source.matchAll(/["'](\.\/[^"']+\.(?:png|jpe?g|gif|webp|mp4|html)(?:[?#][^"']*)?)["']/gi)) {
    requireLocalReference(match[1], sourceFile);
  }
}

walk(root, (absolute, relative, stat) => {
  if (stat.isDirectory()) {
    const name = path.basename(absolute);
    if (forbiddenDirectoryNames.includes(name)) failures.push(`forbidden generated directory: ${relative}`);
    if (relative === "screenshots") failures.push("forbidden root verification directory: screenshots");
    return;
  }
  if (/^demo\/[^/]+\/screenshots\/validate-/.test(relative)) failures.push(`forbidden validation artifact: ${relative}`);
});

if (failures.length) {
  console.error(JSON.stringify({ status: "fail", failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "pass",
  cases: catalog.styleGuides.length,
  styles: catalog.styleProfiles.length,
  brands: catalog.brandProfiles.length,
  components: catalog.componentReferences.length,
  checkedMediaReferences
}, null, 2));

function requireLocalReference(value, label) {
  if (/^(?:https?:|data:)/.test(value)) return;
  const clean = value.split(/[?#]/)[0].replace(/^\.\//, "");
  requirePath(clean, `${label} points to missing file: ${value}`);
  if (trackedFiles && !trackedFiles.has(clean)) failures.push(`${label} points to an untracked file: ${value}`);
  checkedMediaReferences += 1;
}

function readTrackedFiles() {
  try {
    const output = execFileSync("git", ["ls-files", "-z"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    });
    return new Set(output.split("\0").filter(Boolean));
  } catch (error) {
    const details = `${error?.stderr || ""}\n${error?.message || ""}`;
    if (error?.code === "ENOENT" || /not a git repository/i.test(details)) return null;
    throw error;
  }
}

function requirePath(relative, message) {
  if (!fs.existsSync(path.join(root, relative))) failures.push(message);
}

function walk(directory, visit) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git") continue;
    const absolute = path.join(directory, entry.name);
    const relative = path.relative(root, absolute);
    visit(absolute, relative, entry);
    if (entry.isDirectory()) walk(absolute, visit);
  }
}
