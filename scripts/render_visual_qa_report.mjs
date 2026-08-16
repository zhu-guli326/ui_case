#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const reportPath = path.join(repoRoot, "artifacts", "visual-qa", "visual-qa.json");
const markdownPath = path.join(repoRoot, "artifacts", "visual-qa", "visual-qa.md");

if (!fs.existsSync(reportPath)) {
  console.error(`Missing visual QA report: ${reportPath}`);
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const lines = [
  "# 23-case visual QA",
  "",
  `Viewport: ${report.viewport?.width || 390}×${report.viewport?.height || 844}`,
  "",
  "| Case | Card | Video | Live | Hard issues | Review flags |",
  "|---|---:|---:|---:|---|---|",
];

for (const item of report.cases || []) {
  const card = item.card?.ok ? `${item.card.width}×${item.card.height}` : "missing";
  const video = item.video ? (item.video.ok ? `${item.video.width}×${item.video.height}` : `error:${item.video.reason || "unknown"}`) : "—";
  const live = item.live ? "yes" : "—";
  const issues = item.issues?.length ? item.issues.join(", ") : "pass";
  const review = item.review?.length ? item.review.join(", ") : "—";
  lines.push(`| ${item.id} | ${card} | ${video} | ${live} | ${issues} | ${review} |`);
}

lines.push(
  "",
  `Hard failures: ${report.summary?.failed ?? 0}/${report.summary?.total ?? 0}`,
  `Human-review candidates: ${report.summary?.review ?? 0}/${report.summary?.total ?? 0}`,
);

for (const item of (report.cases || []).filter((entry) => entry.issues?.length || entry.review?.length)) {
  lines.push("", `## ${item.id}`, "");
  for (const issue of item.issues || []) lines.push(`- FAIL: ${issue}`);
  for (const flag of item.review || []) lines.push(`- REVIEW: ${flag}`);

  const visual = item.live?.visual;
  if (Number.isFinite(visual?.rgbDelta) && Number.isFinite(visual?.luminanceDelta)) {
    lines.push(`- visual delta: RGB ${visual.rgbDelta.toFixed(3)}, luminance ${visual.luminanceDelta.toFixed(3)}`);
  }

  const geometry = item.live?.geometry;
  if (geometry?.contentBottomGap != null) {
    lines.push(`- lower content gap: ${Math.round(geometry.contentBottomGap)}px`);
  }
  if (geometry?.interactiveOverflow?.length) {
    lines.push(`- hard hitarea overflow: ${JSON.stringify(geometry.interactiveOverflow)}`);
  }
  if (geometry?.offscreenInteractive?.length) {
    lines.push(`- offscreen/peek hitareas: ${JSON.stringify(geometry.offscreenInteractive)}`);
  }
}

fs.writeFileSync(markdownPath, `${lines.join("\n")}\n`);
console.log(`Rendered ${path.relative(repoRoot, markdownPath)}`);
