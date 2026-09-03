(() => {
  const init = () => {
    const carousel = document.querySelector('[data-featured-carousel]');
    const nextButton = carousel?.querySelector('[data-carousel-next]');
    const slides = [...(carousel?.querySelectorAll('[data-case-slide]') || [])];
    if (!carousel || !nextButton || slides.length < 2) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const STALE_AFTER = 3000;
    const CHECK_EVERY = 250;
    let lastChangeAt = performance.now();
    let activeIndex = slides.findIndex((slide) => slide.dataset.position === 'active');

    const markChanged = () => {
      const nextActive = slides.findIndex((slide) => slide.dataset.position === 'active');
      if (nextActive !== activeIndex) {
        activeIndex = nextActive;
        lastChangeAt = performance.now();
      }
    };

    const observer = new MutationObserver(markChanged);
    slides.forEach((slide) => observer.observe(slide, { attributes: true, attributeFilter: ['data-position'] }));

    window.setInterval(() => {
      markChanged();
      if (document.hidden || reducedMotion.matches || carousel.querySelector('.is-dragging')) return;
      if (performance.now() - lastChangeAt < STALE_AFTER) return;
      lastChangeAt = performance.now();
      nextButton.click();
    }, CHECK_EVERY);

    document.addEventListener('visibilitychange', () => {
      lastChangeAt = performance.now();
      markChanged();
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
