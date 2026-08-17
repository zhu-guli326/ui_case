import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const caseDirectory = path.join(root, "catalog", "cases");

function readLocalAssets(htmlPath, html, tag, attribute) {
  const baseDirectory = path.dirname(htmlPath);
  const pattern = tag === "script"
    ? /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/gi
    : /<link\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi;
  const assets = [];
  for (const match of html.matchAll(pattern)) {
    const source = match[1];
    if (/^(?:https?:)?\/\//.test(source) || source.startsWith("data:")) continue;
    const cleanSource = source.split(/[?#]/, 1)[0];
    const absolutePath = path.resolve(baseDirectory, cleanSource);
    if (existsSync(absolutePath)) assets.push({ path: absolutePath, content: readFileSync(absolutePath, "utf8") });
  }
  return assets;
}

function liveDemoRecords() {
  return readdirSync(caseDirectory)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => JSON.parse(readFileSync(path.join(caseDirectory, name), "utf8")))
    .filter((record) => record.liveDemo);
}

test("all clickable demos implement the shared embed query contract", () => {
  const records = liveDemoRecords();
  assert.equal(records.length, 19);

  const failures = [];
  for (const record of records) {
    const htmlPath = path.join(root, record.liveDemo.replace(/^\.\//, ""));
    const html = readFileSync(htmlPath, "utf8");
    const scripts = readLocalAssets(htmlPath, html, "script", "src");
    const runtimeSource = [html, ...scripts.map((asset) => asset.content)].join("\n");

    const readsEmbedQuery = /URLSearchParams|location\.search|searchParams/.test(runtimeSource) && /\bembed\b/.test(runtimeSource);
    const activatesEmbedMode = /embed-mode/.test(runtimeSource) || /classList\.(?:add|toggle)\([^\n]*embed/.test(runtimeSource);

    if (!readsEmbedQuery || !activatesEmbedMode) {
      failures.push(`${record.id}: query=${readsEmbedQuery} mode=${activatesEmbedMode} (${record.liveDemo})`);
    }
  }

  assert.deepEqual(failures, [], `inconsistent embedded demos:\n${failures.join("\n")}`);
});

test("embedded demo CSS owns one 390 x 844 screen and never widens it", () => {
  const records = liveDemoRecords();
  const failures = [];

  for (const record of records) {
    const htmlPath = path.join(root, record.liveDemo.replace(/^\.\//, ""));
    const html = readFileSync(htmlPath, "utf8");
    const stylesheets = readLocalAssets(htmlPath, html, "link", "href");
    const css = stylesheets.map((asset) => asset.content).join("\n");

    if (!/iphone-frame\.css/.test(html)) {
      failures.push(`${record.id}: shared iphone-frame.css missing`);
      continue;
    }

    const suspiciousEmbedWidth = [...css.matchAll(/\.embed(?:-mode)?[^{}]*\{[^}]*\b(?:width|inline-size)\s*:\s*(\d+)px/gi)]
      .map((match) => Number(match[1]))
      .filter((width) => width > 430);
    if (suspiciousEmbedWidth.length) {
      failures.push(`${record.id}: embed width ${suspiciousEmbedWidth.join(", ")}px`);
    }
  }

  assert.deepEqual(failures, [], `embed viewport width regressions:\n${failures.join("\n")}`);
});
