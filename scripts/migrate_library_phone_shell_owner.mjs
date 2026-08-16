import fs from "node:fs";

const file = "src/features/library/library.css";
let css = fs.readFileSync(file, "utf8");

const removeRule = (pattern, label, replacement = "") => {
  const before = css;
  css = css.replace(pattern, replacement);
  if (before === css) console.log(`already clean: ${label}`);
  else console.log(`removed: ${label}`);
};

// Repair any malformed selector created by an older one-time migration attempt.
css = css
  .replace(/\.demo-card-preview\s*>\s*\.demo-card-preview\s*>\s*\.phone-media/g, ".phone-media")
  .replace(/\.phone-frame--card\s+\.phone-preview-media\.is-unavailable\s+\.phone-screen::before/g, ".phone-preview-media.is-unavailable .phone-screen::before");

// Hardware tokens belong exclusively to PhoneShell.
css = css
  .replace(/^\s*--radius-phone:[^\n]*\n/gm, "")
  .replace(/^\s*--radius-screen:[^\n]*\n/gm, "")
  .replace(/^\s*--screen-ratio:[^\n]*\n/gm, "")
  .replace(/^\s*--iphone-bezel(?:-edge|-shadow)?:[^\n]*\n/gm, "");

// Remove prior Library invocation-layout rules first so this migration is idempotent.
removeRule(/\.demo-card-preview\s*>\s*\.phone-frame\s*\{[^{}]*\}\s*/g, "existing Library PhoneShell invocation layout");
removeRule(/\.phone-frame--card\s*\{[^{}]*\}\s*/g, "existing Library card invocation sizing");

// Remove old top-level hardware painting only; contextual component invocations are not matched.
removeRule(/(^|\n)\.phone-frame\s*\{[^{}]*\}\s*/g, "Library phone-frame hardware rule", "$1");
removeRule(/\.phone-frame::before,\s*\.phone-frame::after\s*\{[^{}]*\}\s*/g, "Library phone side-button shared rule");
removeRule(/\.phone-frame::before\s*\{[^{}]*\}\s*/g, "Library left phone buttons");
removeRule(/\.phone-frame::after\s*\{[^{}]*\}\s*/g, "Library right phone button");
removeRule(/(^|\n)\.phone-screen\s*\{[^{}]*\}\s*/g, "Library phone screen hardware rule", "$1");
removeRule(/\.phone-frame--card\s*\.phone-screen\s*\{[^{}]*\}\s*/g, "Library card screen radius");
removeRule(/\.phone-frame--card::before,\s*\.phone-frame--card::after\s*\{[^{}]*\}\s*/g, "Library card side-button shared rule");
removeRule(/\.phone-frame--card::before\s*\{[^{}]*\}\s*/g, "Library card left buttons");
removeRule(/\.phone-frame--card::after\s*\{[^{}]*\}\s*/g, "Library card right button");
removeRule(/\.phone-frame--card\s+\.phone-media\s*\{[^{}]*\}\s*/g, "legacy card media scale");
removeRule(/\.phone-frame--card\.has-wide-device-art\s*\{[^{}]*\}\s*/g, "legacy wide-device scale");
removeRule(/\.phone-frame--card\.has-fitted-device-art\s*\{[^{}]*\}\s*/g, "legacy fitted-device scale");

// Re-add only page-layout positioning/sizing for an invocation of the shared component.
css = css.replace(
  /(\.demo-card-preview::before\s*\{[^{}]*\}\s*)/,
  `$1.demo-card-preview > .phone-frame { z-index: 1; margin: 0; overflow: visible; }\n.phone-frame--card { width: auto; height: min(var(--card-device-height), calc(100% - 48px)); }\n`,
);

// Remove any later references to retired Library hardware tokens.
css = css
  .replace(/\s*box-shadow:\s*var\(--iphone-bezel-shadow\);/g, "")
  .replace(/\s*border-radius:\s*var\(--radius-phone\);/g, "")
  .replace(/\s*border-radius:\s*var\(--radius-screen\);/g, "")
  .replace(/\s*aspect-ratio:\s*var\(--screen-ratio\);/g, "");

const forbidden = [
  /--iphone-bezel/,
  /--radius-phone/,
  /--radius-screen/,
  /--screen-ratio/,
  /\.phone-frame::before/,
  /\.phone-frame::after/,
  /(^|\n)\.phone-frame\s*\{[^}]*box-shadow/s,
  /(^|\n)\.phone-frame\s*\{[^}]*border-radius/s,
  /\.phone-frame--card\s*\{[^}]*border-radius/s,
  /\.phone-frame--card\s*\{[^}]*box-shadow/s,
  /\.demo-card-preview\s*>\s*\.demo-card-preview/,
];
for (const pattern of forbidden) {
  if (pattern.test(css)) throw new Error(`Library still owns PhoneShell hardware or has a malformed selector: ${pattern}`);
}

if (!/\.phone-media\s*\{[^}]*object-fit:\s*cover/.test(css)) {
  throw new Error("Library phone media base rule was lost during migration");
}

fs.writeFileSync(file, css);
console.log("Library hardware ownership removed; PhoneShell is the single visual owner.");
