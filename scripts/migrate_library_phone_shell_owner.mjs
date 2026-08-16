import fs from "node:fs";

const file = "src/features/library/library.css";
let css = fs.readFileSync(file, "utf8");

const removeRule = (pattern, label) => {
  const before = css;
  css = css.replace(pattern, "");
  if (before === css) console.log(`already clean: ${label}`);
  else console.log(`removed: ${label}`);
};

// Hardware tokens belong exclusively to PhoneShell.
css = css
  .replace(/^\s*--radius-phone:[^\n]*\n/gm, "")
  .replace(/^\s*--radius-screen:[^\n]*\n/gm, "")
  .replace(/^\s*--screen-ratio:[^\n]*\n/gm, "")
  .replace(/^\s*--iphone-bezel(?:-edge|-shadow)?:[^\n]*\n/gm, "");

// Keep only Library-specific positioning/sizing; remove all hardware painting.
removeRule(/\.phone-frame\s*\{[^{}]*\}\s*/g, "Library phone-frame hardware rule");
removeRule(/\.phone-frame::before,\s*\.phone-frame::after\s*\{[^{}]*\}\s*/g, "Library phone side-button shared rule");
removeRule(/\.phone-frame::before\s*\{[^{}]*\}\s*/g, "Library left phone buttons");
removeRule(/\.phone-frame::after\s*\{[^{}]*\}\s*/g, "Library right phone button");
removeRule(/\.phone-screen\s*\{[^{}]*\}\s*/g, "Library phone screen hardware rule");
removeRule(/\.phone-frame--card\s*\.phone-screen\s*\{[^{}]*\}\s*/g, "Library card screen radius");
removeRule(/\.phone-frame--card::before,\s*\.phone-frame--card::after\s*\{[^{}]*\}\s*/g, "Library card side-button shared rule");
removeRule(/\.phone-frame--card::before\s*\{[^{}]*\}\s*/g, "Library card left buttons");
removeRule(/\.phone-frame--card::after\s*\{[^{}]*\}\s*/g, "Library card right button");
removeRule(/\.phone-frame--card\s+\.phone-media\s*\{[^{}]*\}\s*/g, "legacy card media scale");
removeRule(/\.phone-frame--card\.has-wide-device-art\s*\{[^{}]*\}\s*/g, "legacy wide-device scale");
removeRule(/\.phone-frame--card\.has-fitted-device-art\s*\{[^{}]*\}\s*/g, "legacy fitted-device scale");

// Re-add only page-layout sizing for a card invocation of the shared component.
css = css.replace(
  /(\.demo-card-preview::before\s*\{[^{}]*\}\s*)/,
  `$1.demo-card-preview > .phone-frame { z-index: 1; margin: 0; overflow: visible; }\n.phone-frame--card { width: auto; height: min(var(--card-device-height), calc(100% - 48px)); }\n`,
);

// Remove any later references to the retired Library hardware tokens.
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
  /\.phone-frame\s*\{[^}]*box-shadow/s,
  /\.phone-frame\s*\{[^}]*border-radius/s,
];
for (const pattern of forbidden) {
  if (pattern.test(css)) throw new Error(`Library still owns PhoneShell hardware: ${pattern}`);
}

fs.writeFileSync(file, css);
console.log("Library hardware ownership removed; PhoneShell is the single visual owner.");
