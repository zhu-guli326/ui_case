import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../launcher.html', import.meta.url), 'utf8');
const launcher = fs.readFileSync(new URL('../launcher.js', import.meta.url), 'utf8');
const shell = fs.readFileSync(new URL('../src/core/app-shell/app-shell.js', import.meta.url), 'utf8');
const config = fs.readFileSync(new URL('../src/core/analytics/analytics.config.js', import.meta.url), 'utf8');
const entry = fs.readFileSync(new URL('../src/features/launcher/launcher-entry.js', import.meta.url), 'utf8');
const runtime = fs.readFileSync(new URL('../src/features/launcher/launcher-simplified-runtime.js', import.meta.url), 'utf8');
const simplifiedCss = fs.readFileSync(new URL('../src/features/launcher/launcher-simplified.css', import.meta.url), 'utf8');
const designSystem = fs.readFileSync(new URL('../src/features/launcher/launcher-design-system.js', import.meta.url), 'utf8');

test('launcher task tabs expose tab semantics', () => {
  assert.match(html, /id="modeTabs"[^>]+role="tablist"/);
  assert.match(html, /role="tab"[^>]+id="tab-create"/);
  assert.match(launcher, /aria-selected/);
  assert.match(runtime, /syncPrimaryTabs/);
});

test('generate button readiness is announced', () => {
  assert.match(launcher, /generatePrompt\.disabled = !readiness\.ready/);
  assert.match(launcher, /aria-disabled/);
  assert.match(runtime, /showBlockedFeedback/);
  assert.match(runtime, /aria-invalid/);
  assert.match(runtime, /syncGenerateReadiness/);
});

test('query language takes precedence', () => {
  assert.match(shell, /searchParams\.get\("lang"\)/);
  assert.match(shell, /if \(isSupported\(queryLanguage\)\) return queryLanguage/);
  assert.match(runtime, /searchParams\.get\("lang"\)/);
  assert.match(designSystem, /searchParams\.get\("lang"\)/);
});

test('case picker is hardened as a modal dialog', () => {
  assert.match(html, /<dialog class="case-picker"/);
  assert.match(html, /aria-modal="true"/);
  assert.match(html, /aria-describedby="casePickerHelp"/);
  assert.match(runtime, /function hardenDialog/);
  assert.match(runtime, /casePickerHelp/);
});

test('dynamic content escapes HTML where markup is generated', () => {
  assert.match(launcher, /function escapeHtml/);
  assert.match(launcher, /escapeHtml\(guide\.name/);
});

test('launcher feature loading has one explicit four-owner entry point', () => {
  assert.match(html, /launcher-entry\.js/);
  assert.match(entry, /load\("core"/);
  assert.match(entry, /load\("design-system"/);
  assert.match(entry, /load\("final-preview"/);
  assert.match(entry, /load\("runtime"/);
  assert.doesNotMatch(entry, /launcher-hardening\.js|launcher-stability\.js|launcher-shell\.js/);
  assert.doesNotMatch(config, /launcher-hardening|launcher-entry|launcher\\\.html/);
});

test('task tabs and platform choices retain dedicated keyboard ownership', () => {
  assert.match(runtime, /Home/);
  assert.match(runtime, /End/);
  assert.match(runtime, /aria-selected/);
  assert.match(designSystem, /ArrowLeft/);
  assert.match(designSystem, /ArrowRight/);
  assert.match(designSystem, /ArrowUp/);
  assert.match(designSystem, /ArrowDown/);
  assert.match(designSystem, /aria-checked/);
  assert.doesNotMatch(designSystem, /aria-selected|setDesignSystemTab|\.ds-tabs/);
});

test('simplified styles own high contrast and reduced motion hardening', () => {
  assert.match(simplifiedCss, /prefers-contrast:more/);
  assert.match(simplifiedCss, /prefers-reduced-motion:reduce/);
  assert.match(simplifiedCss, /focus-visible/);
  assert.match(simplifiedCss, /field-validation-error/);
});
