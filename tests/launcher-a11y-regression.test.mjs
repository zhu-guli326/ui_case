import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../launcher.html', import.meta.url), 'utf8');
const js = await readFile(new URL('../launcher.js', import.meta.url), 'utf8');
const shell = await readFile(new URL('../src/core/app-shell/app-shell.js', import.meta.url), 'utf8');

test('launcher exposes an accessible modal case picker', () => {
  assert.match(html, /<dialog[^>]+id="casePicker"[^>]+aria-labelledby="casePickerTitle"/);
  assert.match(html, /id="closeCasePicker"[^>]+aria-label=/);
});

test('launcher tabs expose tab semantics and active state is synchronized', () => {
  assert.match(html, /id="modeTabs"[^>]+role="tablist"/);
  assert.match(html, /role="tab"[^>]+id="tab-create"/);
  assert.match(js, /aria-selected/);
});

test('generate action exposes disabled state and missing-state description', () => {
  assert.match(html, /id="generatePrompt"[^>]+aria-describedby="missingState"[^>]+disabled/);
  assert.match(js, /generatePrompt\.disabled\s*=\s*!readiness\.ready/);
  assert.match(js, /setAttribute\("aria-disabled"/);
});

test('language shell honors URL lang before persisted language', () => {
  assert.match(shell, /searchParams\.get\("lang"\)/);
  assert.match(shell, /if \(isSupported\(queryLanguage\)\) return queryLanguage/);
});

test('dynamic user-facing HTML is escaped before insertion', () => {
  assert.match(js, /function escapeHtml/);
  assert.match(js, /escapeHtml\(first\.label\[language\(\)\]\)/);
  assert.match(js, /escapeHtml\(guide\.name/);
});
