import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function edit(relativePath, transform) {
  const file = path.join(root, relativePath);
  const before = fs.readFileSync(file, "utf8");
  const after = transform(before);
  if (after === before) throw new Error(`No expected shell override changed in ${relativePath}`);
  fs.writeFileSync(file, after, "utf8");
}

edit("src/features/home/home.css", (source) => source
  .replace(".project-home image2-site-header { position: absolute; z-index: 50; top: 0; left: 0; width: 100%; }\n", "")
  .replace(".project-home .site-header { border-color: rgba(255,255,255,.24); background: rgba(255,255,255,.82); }\n", "")
  .replace("  .project-home .site-header { width: calc(100% - 20px); }\n", ""));

edit("src/features/launcher/launcher-dna.css", (source) => source
  .replace(".dna-page image2-site-header { position: relative; z-index: 20; }\n", ""));

edit("src/features/skills/skills.css", (source) => source
  .replace("body.skills-document .site-footer { margin-top: auto; }\n", ""));

edit("src/features/skills/skill-detail.css", (source) => source
  .replace(/\s*\.skill-detail-document \.site-footer \{ margin-top:auto; \}/, ""));

console.log("Removed page-specific shared shell overrides.");
