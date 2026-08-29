import { execFileSync } from "node:child_process";
import { closeSync, openSync, readSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const THRESHOLDS = [30_000, 50_000, 100_000];
const binaryExtensions = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".ico",
  ".mp4", ".mov", ".webm", ".mp3", ".wav", ".ogg",
  ".woff", ".woff2", ".ttf", ".otf", ".eot",
  ".pdf", ".zip", ".gz", ".7z", ".rar", ".psd", ".sketch",
]);

function gitTrackedFiles() {
  return execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" })
    .split("\0")
    .filter(Boolean);
}

function looksLikeText(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (binaryExtensions.has(ext)) return false;

  const fd = openSync(path.join(root, filePath), "r");
  try {
    const sample = Buffer.alloc(8192);
    const bytesRead = readSync(fd, sample, 0, sample.length, 0);
    for (let index = 0; index < bytesRead; index += 1) {
      if (sample[index] === 0) return false;
    }
    return true;
  } finally {
    closeSync(fd);
  }
}

function isDataFile(filePath) {
  const lower = filePath.toLowerCase();
  return /(?:^|\/)[^/]*-data\.(?:js|mjs|json)$/.test(lower)
    || /^catalog\/(?:cases|styles|brands|components)\//.test(lower)
    || /(?:^|\/)data\//.test(lower);
}

function categoryFor(filePath) {
  const lower = filePath.toLowerCase();
  const base = path.basename(lower);

  if (lower === "catalog/index.js") return "generated";
  if (/(?:^|\/)(?:legacy|archive|archives|old|backup|backups)(?:\/|$)/.test(lower)
      || /-(?:fixes|overrides|hardening)(?:\.|$)/.test(base)) {
    return "history/duplicate";
  }
  if (/(?:^|\/)artifacts(?:\/|$)/.test(lower)
      || lower.startsWith("docs/")
      || lower.startsWith("references/")) {
    return "ai-cold";
  }
  if (isDataFile(lower)) return "data";
  if (/\.(?:html|css|js|mjs|cjs|ts|tsx|jsx)$/.test(lower)) return "runtime";
  if (/\.(?:json|jsonc|yaml|yml|toml|xml|md|txt|csv)$/.test(lower)) return "data";
  return "ai-cold";
}

function aiDefaultFor(filePath, category) {
  const lower = filePath.toLowerCase();
  if (["generated", "history/duplicate", "ai-cold"].includes(category)) return "skip";
  if (lower.startsWith("demo/") || lower.startsWith("tests/") || lower.startsWith("scripts/") || lower.startsWith(".github/")) {
    return "target-only";
  }
  return "targeted";
}

function tierFor(bytes) {
  if (bytes > THRESHOLDS[2]) return ">100KB";
  if (bytes > THRESHOLDS[1]) return ">50KB";
  return ">30KB";
}

const rows = gitTrackedFiles()
  .map((filePath) => ({ filePath, bytes: statSync(path.join(root, filePath)).size }))
  .filter(({ bytes }) => bytes > THRESHOLDS[0])
  .filter(({ filePath }) => looksLikeText(filePath))
  .map(({ filePath, bytes }) => {
    const category = categoryFor(filePath);
    return {
      filePath,
      bytes,
      kb: (bytes / 1000).toFixed(1),
      estimatedTokens: Math.ceil(bytes / 4),
      tier: tierFor(bytes),
      category,
      aiDefault: aiDefaultFor(filePath, category),
    };
  })
  .sort((a, b) => b.bytes - a.bytes || a.filePath.localeCompare(b.filePath));

const counts = new Map();
for (const row of rows) counts.set(row.category, (counts.get(row.category) || 0) + 1);

console.log("# Repository Token Audit");
console.log("");
console.log(`Tracked text files >30KB: ${rows.length}`);
console.log(`>50KB: ${rows.filter((row) => row.bytes > THRESHOLDS[1]).length}`);
console.log(`>100KB: ${rows.filter((row) => row.bytes > THRESHOLDS[2]).length}`);
console.log("");
console.log("Category counts:");
for (const [category, count] of [...counts.entries()].sort()) {
  console.log(`- ${category}: ${count}`);
}
console.log("");
console.log("| Tier | Size | Est. tokens | Category | AI default | File |");
console.log("| --- | ---: | ---: | --- | --- | --- |");
for (const row of rows) {
  console.log(`| ${row.tier} | ${row.kb}KB | ~${row.estimatedTokens.toLocaleString("en-US")} | ${row.category} | ${row.aiDefault} | \`${row.filePath}\` |`);
}
console.log("");
console.log("Notes:");
console.log("- Token estimates use a deliberately rough 4 bytes/token heuristic; file size is the stable audit signal.");
console.log("- `targeted` means read only when the requested feature needs it; `target-only` means skip unless that demo/test/script is explicitly relevant.");
console.log("- Generated and ai-cold files should never be opened by default during normal feature work.");
