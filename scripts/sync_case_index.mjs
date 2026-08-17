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
const startMarker = "export const styleGuides = [";
const start = source.indexOf(startMarker);
if (start < 0) throw new Error("Could not find styleGuides export in catalog/index.js");

const nextExport = source.indexOf("\n\nexport const ", start + startMarker.length);
if (nextExport < 0) throw new Error("Could not find the export following styleGuides");

const block = `export const styleGuides = ${JSON.stringify(records, null, 2)};`;
const next = `${source.slice(0, start)}${block}${source.slice(nextExport)}`;
fs.writeFileSync(indexPath, next, "utf8");
console.log(`Synced ${records.length} case records into catalog/index.js`);
