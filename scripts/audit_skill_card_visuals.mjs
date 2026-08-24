#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "src", "features", "skills", "skills.js");
const capturePath = path.join(root, "scripts", "capture_skill_web_previews.mjs");
const webAssetDir = path.join(root, "assets", "skills", "web");
const repositoryAssetDir = path.join(root, "assets", "skills", "repositories");
const source = fs.readFileSync(sourcePath, "utf8");
const captureSource = fs.readFileSync(capturePath, "utf8");
const errors = [];
const warnings = [];

function blockBetween(start, end) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  if (startIndex < 0 || endIndex < 0) {
    errors.push(`Unable to locate source block: ${start}`);
    return "";
  }
  return source.slice(startIndex, endIndex);
}

function propertyValues(block, property) {
  return [...block.matchAll(new RegExp(`${property}:\\s*"([^"]+)"`, "g"))].map((match) => match[1]);
}

function duplicates(values) {
  const seen = new Set();
  return [...new Set(values.filter((value) => seen.has(value) || !seen.add(value)))];
}

function filenameFor(domain) {
  return `${domain.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.jpg`;
}

function jpegDimensions(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;
  const sofMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  while (offset + 8 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    while (buffer[offset] === 0xff) offset += 1;
    const marker = buffer[offset++];
    if (marker === 0xd9 || marker === 0xda) break;
    if (marker >= 0xd0 && marker <= 0xd7) continue;
    if (offset + 2 > buffer.length) break;
    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) break;
    if (sofMarkers.has(marker)) {
      return { height: buffer.readUInt16BE(offset + 3), width: buffer.readUInt16BE(offset + 5) };
    }
    offset += length;
  }
  return null;
}

const repositoryBlock = blockBetween("const repositories = [", "const repositoriesEn = [");
const websiteBlock = blockBetween("const designReferenceWebsites = [", "const skillsTranslations = {");
const skillSlugs = propertyValues(repositoryBlock, "slug");
const websiteDomains = propertyValues(websiteBlock, "domain");
const websiteUrls = propertyValues(websiteBlock, "url");

if (skillSlugs.length !== 35) errors.push(`Expected 35 Skill cards, found ${skillSlugs.length}`);
if (websiteDomains.length !== 14) errors.push(`Expected 14 Web cards, found ${websiteDomains.length}`);
if (websiteDomains.length !== websiteUrls.length) errors.push("Web card domains and URLs are out of sync");
for (const slug of duplicates(skillSlugs)) errors.push(`Duplicate Skill slug: ${slug}`);
for (const domain of duplicates(websiteDomains)) errors.push(`Duplicate Web domain: ${domain}`);

if (!source.includes("./assets/skills/repositories/")) errors.push("Skill cards are not using local official-page screenshots");
if (!source.includes("repo-browser-bar")) errors.push("Skill cards are missing browser-page chrome");
if (!source.includes("<img class=\"repo-cover-image\"")) errors.push("Skill card image element is missing");
if (!source.includes("./assets/skills/web/")) errors.push("Web cards are not mapped to local official-page screenshots");
if (!source.includes("data-web-preview")) errors.push("Web card image element is missing");

const webRows = websiteDomains.map((domain, index) => {
  const url = websiteUrls[index];
  const filename = filenameFor(domain);
  const file = path.join(webAssetDir, filename);
  const exists = fs.existsSync(file) && fs.statSync(file).isFile();
  const row = { domain, url, filename, exists, bytes: 0, width: 0, height: 0 };

  if (!captureSource.includes(`"${domain}"`) || !captureSource.includes(`"${url}"`)) {
    errors.push(`${domain}: missing or mismatched capture target`);
  }
  if (!exists) {
    errors.push(`${domain}: missing official-page screenshot -> assets/skills/web/${filename}`);
    return row;
  }

  const buffer = fs.readFileSync(file);
  const dimensions = jpegDimensions(buffer);
  row.bytes = buffer.length;
  row.width = dimensions?.width || 0;
  row.height = dimensions?.height || 0;
  if (!dimensions) errors.push(`${domain}: screenshot is not a readable JPEG`);
  if (buffer.length < 20_000) warnings.push(`${domain}: screenshot is unusually small (${buffer.length} bytes)`);
  if (dimensions && (dimensions.width < 1000 || dimensions.height < 600)) {
    errors.push(`${domain}: screenshot is too small (${dimensions.width}x${dimensions.height})`);
  }
  return row;
});

const skillRows = skillSlugs.map((slug) => {
  const filename = `${slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.jpg`;
  const file = path.join(repositoryAssetDir, filename);
  const exists = fs.existsSync(file) && fs.statSync(file).isFile();
  const row = { slug, filename, exists, bytes: 0, width: 0, height: 0 };
  if (!exists) {
    errors.push(`${slug}: missing official-page screenshot -> assets/skills/repositories/${filename}`);
    return row;
  }
  const buffer = fs.readFileSync(file);
  const dimensions = jpegDimensions(buffer);
  row.bytes = buffer.length;
  row.width = dimensions?.width || 0;
  row.height = dimensions?.height || 0;
  if (!dimensions) errors.push(`${slug}: screenshot is not a readable JPEG`);
  if (dimensions && (dimensions.width < 800 || dimensions.height < 500)) errors.push(`${slug}: screenshot is too small (${dimensions.width}x${dimensions.height})`);
  return row;
});

const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    skillCards: skillSlugs.length,
    skillScreenshots: skillRows.filter((row) => row.exists).length,
    webCards: websiteDomains.length,
    webScreenshots: webRows.filter((row) => row.exists).length,
    errors: errors.length,
    warnings: warnings.length,
  },
  errors,
  warnings,
  websites: webRows,
  skills: skillRows,
};

console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
