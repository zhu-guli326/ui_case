import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../launcher.html', import.meta.url), 'utf8');
const launcher = fs.readFileSync(new URL('../launcher.js', import.meta.url), 'utf8');
const shell = fs.readFileSync(new URL('../src/core/app-shell/app-shell.js', import.meta.url), 'utf8');
const config = fs.readFileSync(new URL('../src/core/analytics/analytics.config.js', import.meta.url), 'utf8');
const entry = fs.readFileSync(new URL('../src/features/launcher/launcher-entry.js', import.meta.url), 'utf8');
const hardening = fs.readFileSync(new URL('../src/features/launcher/launcher-hardening.js', import.meta.url), 'utf8');
const designSystem = fs.readFileSync(new URL('../src/features/launcher/launcher-design-system.js', import.meta.url), 'utf8');

test('launcher task tabs expose tab semantics', () => {
  assert.match(html, /id="modeTabs"[^>]+role="tablist"/);
  assert.match(html, /role="tab"[^>]+id="tab-create"/);
  assert.match(launcher, /aria-selected/);
});

test('generate button readiness is announced', () => {
  assert.match(launcher, /generatePrompt\.disabled = !readiness\.ready/);
  assert.match(launcher, /aria-disabled/);
  assert.match(hardening, /showBlockedFeedback/);
  assert.match(hardening, /aria-invalid/);
});

test('query language takes precedence', () => {
  assert.match(shell, /searchParams\.get\("lang"\)/);
  assert.match(shell, /if \(isSupported\(queryLanguage\)\) return queryLanguage/);
  assert.match(hardening, /searchParams\.get\("lang"\)/);
});

test('case picker is hardened as a modal dialog', () => {
  assert.match(html, /<dialog class="case-picker"/);
  assert.match(html, /aria-modal="true"/);
  assert.match(html, /aria-describedby="casePickerHelp"/);
  assert.match(hardening, /casePickerHelp/);
});

test('dynamic content escapes HTML where markup is generated', () => {
  assert.match(launcher, /function escapeHtml/);
  assert.match(launcher, /escapeHtml\(guide\.name/);
});

test('launcher feature loading has a single explicit entry point', () => {
  assert.match(html, /launcher-entry\.js/);
  assert.match(entry, /launcher-hardening\.js/);
  assert.match(entry, /launcher-design-system\.js/);
  assert.doesNotMatch(config, /launcher-hardening|launcher-entry|launcher\\\.html/);
});

test('secondary tabs and platform choices have dedicated keyboard ownership', () => {
  assert.match(designSystem, /ArrowLeft/);
  assert.match(designSystem, /ArrowRight/);
  assert.match(designSystem, /ArrowUp/);
  assert.match(designSystem, /ArrowDown/);
  assert.match(designSystem, /aria-checked/);
  assert.match(designSystem, /aria-selected/);
  assert.doesNotMatch(hardening, /installDesignSystemTabKeys|installPlatformKeys/);
});

test('hardening supports high contrast and reduced motion preferences', () => {
  assert.match(hardening, /prefers-contrast:more/);
  assert.match(hardening, /prefers-reduced-motion:reduce/);
});
