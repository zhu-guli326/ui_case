(() => {
  const root = document.documentElement;
  const shell = document.querySelector('[data-home-snap]');
  const panels = Array.from(document.querySelectorAll('[data-home-panel]'));
  const desktop = window.matchMedia('(min-width: 781px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!shell || panels.length < 2) return;

  let gestureActive = false;
  let gestureEndTimer = 0;
  let navigationTimer = 0;
  let navigationActive = false;
  let scrollFrame = 0;

  const isEnabled = () => desktop.matches && !reducedMotion.matches;
  const setSnapState = () => root.classList.toggle('home-snap-enabled', isEnabled());

  const panelTop = (panel) => panel.getBoundingClientRect().top + window.scrollY;

  const currentPanelIndex = () => {
    const viewportAnchor = window.scrollY + (window.innerHeight * 0.5);
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    panels.forEach((panel, index) => {
      const panelAnchor = panelTop(panel) + (panel.offsetHeight * 0.5);
      const distance = Math.abs(panelAnchor - viewportAnchor);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    return nearestIndex;
  };

  let activeIndex = currentPanelIndex();

  const moveToPanel = (index) => {
    activeIndex = Math.max(0, Math.min(index, panels.length - 1));
    const target = panels[activeIndex];
    if (!target) return;

    navigationActive = true;
    window.clearTimeout(navigationTimer);
    window.scrollTo({ top: activeIndex === 0 ? 0 : panelTop(target), behavior: 'smooth' });
    navigationTimer = window.setTimeout(() => {
      navigationActive = false;
      activeIndex = currentPanelIndex();
    }, 700);
  };

  const finishGestureAfterIdle = () => {
    window.clearTimeout(gestureEndTimer);
    gestureEndTimer = window.setTimeout(() => {
      gestureActive = false;
    }, 520);
  };

  const onWheel = (event) => {
    if (!isEnabled() || event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;

    event.preventDefault();
    finishGestureAfterIdle();
    if (gestureActive || Math.abs(event.deltaY) < 4) return;

    gestureActive = true;
    const direction = event.deltaY > 0 ? 1 : -1;
    moveToPanel(activeIndex + direction);
  };

  const onKeyDown = (event) => {
    if (!isEnabled() || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable="true"]')) return;

    const direction = ['PageDown', 'ArrowDown', ' '].includes(event.key)
      ? 1
      : ['PageUp', 'ArrowUp'].includes(event.key)
        ? -1
        : 0;
    if (!direction) return;

    event.preventDefault();
    moveToPanel(activeIndex + direction);
  };

  const onScroll = () => {
    if (navigationActive || scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      activeIndex = currentPanelIndex();
    });
  };

  const onMediaChange = () => {
    gestureActive = false;
    setSnapState();
  };

  setSnapState();
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('scroll', onScroll, { passive: true });
  desktop.addEventListener('change', onMediaChange);
  reducedMotion.addEventListener('change', onMediaChange);
})();
