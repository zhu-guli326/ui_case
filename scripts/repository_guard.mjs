import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const MAX_RUNTIME_BYTES = 80_000;
const sourceExtensions = new Set([".html", ".css", ".js", ".mjs"]);
const embeddedBase64Image = /data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/]{64,}={0,2}/i;
const errors = [];

const git = (args) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
const tracked = git(["ls-files", "-z"]).split("\0").filter(Boolean);

let changed = tracked;
try {
  const base = process.env.REPO_GUARD_BASE?.trim();
  const range = base && !/^0+$/.test(base) ? `${base}..HEAD` : "HEAD^..HEAD";
  changed = git(["diff", "--name-only", "--diff-filter=ACMR", range]).split("\n").filter(Boolean);
} catch { /* first commit or shallow checkout: check everything */ }

const isDataOrGenerated = (file) => {
  const lower = file.toLowerCase();
  return lower === "catalog/index.js"
    || /(?:^|\/)[^/]*-data\.(?:js|mjs|json)$/.test(lower)
    || /^catalog\/(?:cases|styles|brands|components)\//.test(lower)
    || /(?:^|\/)data\//.test(lower);
};

for (const file of tracked) {
  const normalized = file.replaceAll("\\", "/");
  const lower = normalized.toLowerCase();
  const base = path.basename(lower);
  const ext = path.extname(lower);

  if (!normalized.includes("/") && [".js", ".css", ".mjs"].includes(ext)) errors.push(`Root implementation file is forbidden: ${normalized}`);
  if (/-(?:fixes|overrides|hardening|patch|compat)(?:\.|$)/.test(base)) errors.push(`Patch layer is forbidden: ${normalized}`);
  if (/^(?:docs|references|lab|artifacts\/screenshots|screenshots)\//.test(lower) || /(?:^|\/)legacy(?:\/|$)/.test(lower)) errors.push(`Retired/non-site path must stay deleted: ${normalized}`);
  if (/^\.github\/[^/]+\.md$/.test(lower)) errors.push(`Repository-only GitHub note is forbidden: ${normalized}`);
  if (/^scripts\/(?:audit_|capture_|verify_|restore_|optimize_|normalize_|patch_|render-)/.test(lower)) errors.push(`One-off maintenance script is forbidden: ${normalized}`);

  if (sourceExtensions.has(ext)) {
    const source = readFileSync(path.join(root, normalized), "utf8");
    if (embeddedBase64Image.test(source)) errors.push(`Embedded base64 image payload found: ${normalized}`);
  }
}

for (const file of changed) {
  if (!existsSync(path.join(root, file))) continue;
  const ext = path.extname(file).toLowerCase();
  if (!sourceExtensions.has(ext) || isDataOrGenerated(file)) continue;
  const bytes = statSync(path.join(root, file)).size;
  if (bytes > MAX_RUNTIME_BYTES) errors.push(`Changed runtime exceeds 80KB (${(bytes / 1000).toFixed(1)}KB): ${file}`);
}

if (errors.length) {
  console.error("Repository guard failed:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Repository guard passed. Checked ${tracked.length} tracked files.`);
