#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const caseDir = path.join(root, "catalog", "cases");
const indexPath = path.join(root, "catalog", "index.js");

const records = fs.readdirSync(caseDir)
  .filter((name) => name.endsWith(".json"))
  .sort()
  .map((name) => JSON.parse(fs.readFileSync(path.join(caseDir, name), "utf8")));

const source = fs.readFileSync(indexPath, "utf8");
const declaration = "export const styleGuides = ";
const start = source.indexOf(declaration);
if (start < 0) throw new Error("Could not find styleGuides export in catalog/index.js");

const arrayStart = source.indexOf("[", start + declaration.length);
if (arrayStart < 0) throw new Error("Could not find styleGuides array start");

let depth = 0;
let quote = "";
let escaped = false;
let arrayEnd = -1;
for (let index = arrayStart; index < source.length; index += 1) {
  const char = source[index];
  if (quote) {
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === quote) quote = "";
    continue;
  }
  if (char === '"' || char === "'" || char === "`") {
    quote = char;
    continue;
  }
  if (char === "[") depth += 1;
  if (char === "]") {
    depth -= 1;
    if (depth === 0) {
      arrayEnd = index;
      break;
    }
  }
}
if (arrayEnd < 0) throw new Error("Could not find styleGuides array end");

let replacementEnd = arrayEnd + 1;
while (replacementEnd < source.length && /[\s;]/.test(source[replacementEnd])) replacementEnd += 1;

const block = `export const styleGuides = ${JSON.stringify(records, null, 2)};\n\n`;
const next = `${source.slice(0, start)}${block}${source.slice(replacementEnd)}`;
fs.writeFileSync(indexPath, next, "utf8");
console.log(`Synced ${records.length} case records into catalog/index.js`);
