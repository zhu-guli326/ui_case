import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const MAX_RUNTIME_BYTES = 80_000;
const sourceExtensions = new Set([".html", ".css", ".js", ".mjs"]);
const errors = [];

function git(args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

function trackedFiles() {
  return git(["ls-files", "-z"]).split("\0").filter(Boolean);
}

function changedFiles() {
  const explicitBase = process.env.REPO_GUARD_BASE?.trim();
  const zeroSha = /^0+$/.test(explicitBase || "");

  if (explicitBase && !zeroSha) {
    try {
      return git(["diff", "--name-only", "--diff-filter=ACMR", `${explicitBase}..HEAD`])
        .split("\n")
        .filter(Boolean);
    } catch {
      // Fall through to the previous-commit comparison.
    }
  }

  try {
    return git(["diff", "--name-only", "--diff-filter=ACMR", "HEAD^..HEAD"])
      .split("\n")
      .filter(Boolean);
  } catch {
    return trackedFiles();
  }
}

function isDataOrGenerated(filePath) {
  const lower = filePath.toLowerCase();
  return lower === "catalog/index.js"
    || /(?:^|\/)[^/]*-data\.(?:js|mjs|json)$/.test(lower)
    || /^catalog\/(?:cases|styles|brands|components)\//.test(lower)
    || /(?:^|\/)data\//.test(lower);
}

function isRuntime(filePath) {
  return sourceExtensions.has(path.extname(filePath).toLowerCase()) && !isDataOrGenerated(filePath);
}

function addError(message) {
  errors.push(message);
}

const tracked = trackedFiles();
const changed = new Set(changedFiles());

for (const filePath of tracked) {
  const normalized = filePath.replaceAll("\\", "/");
  const lower = normalized.toLowerCase();
  const base = path.basename(lower);
  const ext = path.extname(lower);

  if (!normalized.includes("/") && [".js", ".css", ".mjs"].includes(ext)) {
    addError(`Root implementation file is forbidden: ${normalized}`);
  }

  if (/-(?:fixes|overrides|hardening)(?:\.|$)/.test(base)) {
    addError(`Patch-layer filename is forbidden; merge into the canonical implementation: ${normalized}`);
  }

  if (lower.startsWith("artifacts/screenshots/") || lower.startsWith("screenshots/")) {
    addError(`Screenshot output must stay untracked: ${normalized}`);
  }

  if (lower.startsWith("docs/")
      || lower.startsWith("references/")
      || /(?:^|\/)legacy(?:\/|$)/.test(lower)) {
    addError(`Retired documentation/legacy path must stay deleted: ${normalized}`);
  }

  if (sourceExtensions.has(ext)) {
    const source = readFileSync(path.join(root, normalized), "utf8");
    if (/data:image\/[a-z0-9.+-]+;base64,/i.test(source)) {
      addError(`Base64 image payload found in source: ${normalized}`);
    }
  }
}

for (const filePath of changed) {
  if (!existsSync(path.join(root, filePath)) || !isRuntime(filePath)) continue;
  const bytes = statSync(path.join(root, filePath)).size;
  if (bytes > MAX_RUNTIME_BYTES) {
    addError(`Changed runtime file exceeds 80KB (${(bytes / 1000).toFixed(1)}KB): ${filePath}`);
  }
}

if (errors.length) {
  console.error("Repository guard failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  console.error("\nKeep runtime canonical, generated assets out of source, and large data isolated from normal AI context.");
  process.exit(1);
}

console.log(`Repository guard passed. Checked ${tracked.length} tracked files and ${changed.size} changed files.`);
