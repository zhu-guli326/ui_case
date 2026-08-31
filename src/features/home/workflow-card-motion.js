/*
 * Pointer tilt engine for the four Idea → Demo workflow cards.
 * Motion math is adapted from React Bits ProfileCard (JS-CSS registry variant)
 * for ONDesign's framework-free page architecture.
 */

(() => {
  const SELECTOR = '#capabilities .capability-grid > a';
  const ENTER_TRANSITION_MS = 180;
  const DEFAULT_TAU = 0.14;
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');
  const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)');

  const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);
  const round = (value, precision = 3) => Number(value.toFixed(precision));
  const adjust = (value, fromMin, fromMax, toMin, toMax) =>
    round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));

  function setVarsFromXY(card, x, y) {
    const width = card.clientWidth || 1;
    const height = card.clientHeight || 1;
    const percentX = clamp((100 / width) * x);
    const percentY = clamp((100 / height) * y);
    const centerX = percentX - 50;
    const centerY = percentY - 50;

    const properties = {
      '--pointer-x': `${percentX}%`,
      '--pointer-y': `${percentY}%`,
      '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
      '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
      '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
      '--pointer-from-top': `${percentY / 100}`,
      '--pointer-from-left': `${percentX / 100}`,
      '--rotate-x': `${round(-(centerX / 6.25))}deg`,
      '--rotate-y': `${round(centerY / 5)}deg`,
    };

    Object.entries(properties).forEach(([property, value]) => card.style.setProperty(property, value));
  }

  function createTiltEngine(card) {
    let rafId = null;
    let running = false;
    let lastTs = 0;
    let currentX = card.clientWidth / 2;
    let currentY = card.clientHeight / 2;
    let targetX = currentX;
    let targetY = currentY;

    const step = (timestamp) => {
      if (!running) return;
      if (lastTs === 0) lastTs = timestamp;
      const deltaSeconds = (timestamp - lastTs) / 1000;
      lastTs = timestamp;
      const smoothing = 1 - Math.exp(-deltaSeconds / DEFAULT_TAU);

      currentX += (targetX - currentX) * smoothing;
      currentY += (targetY - currentY) * smoothing;
      setVarsFromXY(card, currentX, currentY);

      const stillMoving = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;
      if (stillMoving) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false;
        lastTs = 0;
        rafId = null;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(step);
    };

    return {
      setTarget(x, y) {
        targetX = x;
        targetY = y;
        start();
      },
      toCenter() {
        this.setTarget(card.clientWidth / 2, card.clientHeight / 2);
      },
      isSettled() {
        return Math.hypot(targetX - currentX, targetY - currentY) < 0.6;
      },
      cancel() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        running = false;
        lastTs = 0;
      },
    };
  }

  function enhanceCard(card) {
    if (card.dataset.workflowTiltReady === 'true') return;
    card.dataset.workflowTiltReady = 'true';

    const engine = createTiltEngine(card);
    let enterTimer = null;
    let settleRaf = null;

    const canTilt = () => FINE_POINTER.matches && !REDUCED_MOTION.matches;
    const pointerPosition = (event) => {
      const rect = card.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const onPointerEnter = (event) => {
      if (!canTilt()) return;
      card.classList.add('workflow-card-active', 'workflow-card-entering');
      if (enterTimer) clearTimeout(enterTimer);
      enterTimer = window.setTimeout(() => card.classList.remove('workflow-card-entering'), ENTER_TRANSITION_MS);
      const { x, y } = pointerPosition(event);
      engine.setTarget(x, y);
    };

    const onPointerMove = (event) => {
      if (!canTilt()) return;
      const { x, y } = pointerPosition(event);
      engine.setTarget(x, y);
    };

    const onPointerLeave = () => {
      if (!canTilt()) return;
      engine.toCenter();
      if (settleRaf) cancelAnimationFrame(settleRaf);

      const waitForCenter = () => {
        if (engine.isSettled()) {
          card.classList.remove('workflow-card-active', 'workflow-card-entering');
          settleRaf = null;
          return;
        }
        settleRaf = requestAnimationFrame(waitForCenter);
      };

      settleRaf = requestAnimationFrame(waitForCenter);
    };

    const reset = () => {
      engine.cancel();
      card.classList.remove('workflow-card-active', 'workflow-card-entering');
      card.style.setProperty('--pointer-x', '50%');
      card.style.setProperty('--pointer-y', '50%');
      card.style.setProperty('--pointer-from-center', '0');
      card.style.setProperty('--pointer-from-top', '.5');
      card.style.setProperty('--pointer-from-left', '.5');
      card.style.setProperty('--rotate-x', '0deg');
      card.style.setProperty('--rotate-y', '0deg');
    };

    card.addEventListener('pointerenter', onPointerEnter);
    card.addEventListener('pointermove', onPointerMove);
    card.addEventListener('pointerleave', onPointerLeave);
    REDUCED_MOTION.addEventListener?.('change', reset);
    FINE_POINTER.addEventListener?.('change', reset);
  }

  function initWorkflowCardMotion() {
    document.querySelectorAll(SELECTOR).forEach(enhanceCard);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWorkflowCardMotion, { once: true });
  } else {
    initWorkflowCardMotion();
  }
})();
