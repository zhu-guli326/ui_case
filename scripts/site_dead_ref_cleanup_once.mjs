import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const learnPath = path.join(root, "learn.html");
let learn = fs.readFileSync(learnPath, "utf8");
const relayReplacements = [
  ["./demo/relay/index.html?lang=zh", "./demo/fithub/index.html?lang=zh"],
  ["./demo/relay/index.html", "./demo/fithub/index.html"],
  ["./demo/relay/mobile-preview.png", "./demo/fithub/mobile-preview.png"],
  ["RELAY 移动端界面案例", "FITHUB 移动端界面案例"],
  [">RELAY<", ">FITHUB<"],
  ["克制的移动工具界面", "极简训练规划界面"],
  ["A restrained mobile utility interface", "A minimal training planner interface"],
];
for (const [from, to] of relayReplacements) learn = learn.split(from).join(to);
if (learn.includes("./demo/relay/")) throw new Error("learn.html still references removed demo/relay.");
fs.writeFileSync(learnPath, learn, "utf8");

const vocabularyPath = path.join(root, "vocabulary.html");
let vocabulary = fs.readFileSync(vocabularyPath, "utf8");
vocabulary = vocabulary.replace(
  /<a\b[^>]*href=["']\.\/reference\.html\?doc=ui-section-vocabulary["'][^>]*>([\s\S]*?)<\/a>/g,
  "$1",
);
if (vocabulary.includes("./reference.html?doc=ui-section-vocabulary")) {
  throw new Error("vocabulary.html still references removed reference.html.");
}
fs.writeFileSync(vocabularyPath, vocabulary, "utf8");

console.log("Removed stale site references to demo/relay and reference.html.");
