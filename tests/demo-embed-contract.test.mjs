import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const caseDirectory = path.join(root, "catalog", "cases");

function readLocalAssets(htmlPath, html, tag) {
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

function demoSources(record) {
  const htmlPath = path.join(root, record.liveDemo.replace(/^\.\//, ""));
  const html = readFileSync(htmlPath, "utf8");
  const scripts = readLocalAssets(htmlPath, html, "script");
  const stylesheets = readLocalAssets(htmlPath, html, "link");
  return {
    html,
    runtimeSource: [html, ...scripts.map((asset) => asset.content)].join("\n"),
    styleSource: [html, ...stylesheets.map((asset) => asset.content)].join("\n"),
  };
}

test("all clickable demos implement an explicit embed query contract", () => {
  const records = liveDemoRecords();
  assert.ok(records.length > 0, "catalog must expose at least one live demo");

  const failures = [];
  for (const record of records) {
    const { runtimeSource } = demoSources(record);
    const readsEmbedQuery = /URLSearchParams|location\.search|searchParams/.test(runtimeSource) && /\bembed\b/.test(runtimeSource);
    const activatesEmbedMode = /embed-mode/.test(runtimeSource)
      || /classList\.(?:add|toggle)\([^\n]*embed/.test(runtimeSource)
      || /dataset\.embed/.test(runtimeSource)
      || /data-embed/.test(runtimeSource);

    if (!readsEmbedQuery || !activatesEmbedMode) {
      failures.push(`${record.id}: query=${readsEmbedQuery} mode=${activatesEmbedMode} (${record.liveDemo})`);
    }
  }

  assert.deepEqual(failures, [], `inconsistent embedded demos:\n${failures.join("\n")}`);
});

test("embedded demos resolve to one bounded phone screen without requiring unnecessary chrome", () => {
  const records = liveDemoRecords();
  const failures = [];

  for (const record of records) {
    const { html, styleSource } = demoSources(record);
    const usesPhoneShell = /iphone-frame\.css/.test(html) || /\biphone-frame\b/.test(html);

    const suspiciousEmbedWidth = [...styleSource.matchAll(/(?:\.embed(?:-mode)?|\[data-embed[^\]]*\])[^{}]*\{[^}]*\b(?:width|inline-size)\s*:\s*(\d+)px/gi)]
      .map((match) => Number(match[1]))
      .filter((width) => width > 430);
    if (suspiciousEmbedWidth.length) {
      failures.push(`${record.id}: embed width ${suspiciousEmbedWidth.join(", ")}px`);
      continue;
    }

    if (usesPhoneShell) continue;

    const hasNativeEmbedViewport = /\[data-embed[^\]]*\][^{]*[^}]*\bwidth\s*:\s*100vw[^}]*\bheight\s*:\s*100vh/i.test(styleSource)
      || /body\[data-embed[^\]]*\][^{]*[^}]*\bwidth\s*:\s*100vw[^}]*\bheight\s*:\s*100vh/i.test(styleSource);
    const boundsNativeScreen = /\bwidth\s*:\s*min\(100vw\s*,\s*390px\)/i.test(styleSource)
      || /\bmax-width\s*:\s*390px/i.test(styleSource)
      || /\bwidth\s*:\s*390px/i.test(styleSource);

    if (!hasNativeEmbedViewport || !boundsNativeScreen) {
      failures.push(`${record.id}: native screen source lacks 390px base + 100vw/100vh embed contract`);
    }
  }

  assert.deepEqual(failures, [], `embed viewport regressions:\n${failures.join("\n")}`);
});
