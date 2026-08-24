import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(path.join(root, 'index.html'), 'utf8');
const css = readFileSync(path.join(root, 'src', 'features', 'home', 'index.css'), 'utf8');
const runtime = readFileSync(path.join(root, 'src', 'features', 'home', 'index.js'), 'utf8');

test('home page exposes three full-page scroll panels', () => {
  assert.equal((html.match(/data-home-panel/g) || []).length, 3);
  assert.match(html, /class="home-hero home-panel"/);
  assert.match(html, /class="home-intro home-panel"/);
  assert.match(html, /class="home-links home-panel"/);
  assert.match(css, /scroll-snap-type:\s*y mandatory/);
  assert.match(css, /scroll-snap-stop:\s*always/);
  assert.match(css, /\.home-intro,\s*\n\s*\.home-links\s*\{\s*min-height:\s*100svh/);
});

test('home wheel runtime advances one panel and suppresses trackpad momentum', () => {
  assert.match(runtime, /addEventListener\('wheel', onWheel, \{ passive: false \}\)/);
  assert.match(runtime, /event\.preventDefault\(\)/);
  assert.match(runtime, /if \(gestureActive \|\| Math\.abs\(event\.deltaY\) < 4\) return/);
  assert.match(runtime, /moveToPanel\(activeIndex \+ direction\)/);
  assert.match(runtime, /}, 520\)/);
});

test('full-page wheel behavior respects mobile and reduced-motion preferences', () => {
  assert.match(runtime, /matchMedia\('\(min-width: 781px\)'\)/);
  assert.match(runtime, /matchMedia\('\(prefers-reduced-motion: reduce\)'\)/);
  assert.match(runtime, /desktop\.matches && !reducedMotion\.matches/);
});

test('one wheel gesture moves exactly one viewport before the gesture lock resets', () => {
  const listeners = new Map();
  const timers = new Map();
  const scrollTargets = [];
  const viewportHeight = 900;
  let timerId = 0;

  const fakeWindow = {
    scrollY: 0,
    innerHeight: viewportHeight,
    matchMedia(query) {
      return { matches: !query.includes('prefers-reduced-motion'), addEventListener() {} };
    },
    addEventListener(type, handler) { listeners.set(type, handler); },
    clearTimeout(id) { timers.delete(id); },
    setTimeout(handler, delay) {
      timerId += 1;
      timers.set(timerId, { handler, delay });
      return timerId;
    },
    requestAnimationFrame(handler) { handler(); return 1; },
    scrollTo({ top }) {
      this.scrollY = top;
      scrollTargets.push(top);
    },
  };
  const panels = [0, viewportHeight, viewportHeight * 2].map((top) => ({
    offsetHeight: viewportHeight,
    getBoundingClientRect: () => ({ top: top - fakeWindow.scrollY }),
  }));
  const rootClassNames = new Set();
  const fakeDocument = {
    documentElement: {
      classList: {
        toggle(name, force) {
          if (force) rootClassNames.add(name);
          else rootClassNames.delete(name);
        },
      },
    },
    querySelector: () => ({}),
    querySelectorAll: () => panels,
  };
  class FakeHTMLElement {}

  vm.runInNewContext(runtime, {
    document: fakeDocument,
    window: fakeWindow,
    HTMLElement: FakeHTMLElement,
    Number,
    Math,
    Array,
  });

  const wheel = listeners.get('wheel');
  const event = () => ({
    deltaY: 40,
    deltaX: 0,
    ctrlKey: false,
    preventDefault() {},
  });

  wheel(event());
  wheel(event());
  wheel(event());
  assert.deepEqual(scrollTargets, [viewportHeight]);

  const gestureTimer = [...timers.values()].find(({ delay }) => delay === 520);
  assert.ok(gestureTimer);
  gestureTimer.handler();
  wheel(event());
  assert.deepEqual(scrollTargets, [viewportHeight, viewportHeight * 2]);
  assert.ok(rootClassNames.has('home-snap-enabled'));
});
