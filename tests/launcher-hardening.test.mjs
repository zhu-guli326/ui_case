import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../launcher.html', import.meta.url), 'utf8');
const launcher = fs.readFileSync(new URL('../launcher.js', import.meta.url), 'utf8');
const shell = fs.readFileSync(new URL('../src/core/app-shell/app-shell.js', import.meta.url), 'utf8');
const config = fs.readFileSync(new URL('../src/core/analytics/analytics.config.js', import.meta.url), 'utf8');
const hardening = fs.readFileSync(new URL('../src/features/launcher/launcher-hardening.js', import.meta.url), 'utf8');

test('launcher task tabs expose tab semantics', () => {
  assert.match(html, /role="tablist"/);
  assert.match(html, /role="tab"/);
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
  assert.match(hardening, /aria-modal/);
  assert.match(hardening, /casePickerHelp/);
});

test('dynamic content escapes HTML where markup is generated', () => {
  assert.match(launcher, /function escapeHtml/);
  assert.match(launcher, /escapeHtml\(guide\.name/);
});

test('hardening module is loaded only on launcher', () => {
  assert.match(config, /launcher\\\.html/);
  assert.match(config, /launcher-hardening\.js/);
});

test('secondary tab and platform keyboard behavior is installed', () => {
  assert.match(hardening, /installDesignSystemTabKeys/);
  assert.match(hardening, /installPlatformKeys/);
  assert.match(hardening, /ArrowLeft/);
  assert.match(hardening, /ArrowRight/);
});
