(() => {
  const hero = document.querySelector('.story-hero');
  const cards = [...document.querySelectorAll('[data-orbit-depth]')];
  if (!hero) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const moveCards = (event) => {
    if (reducedMotion.matches) return;
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    cards.forEach((card) => {
      const depth = Number(card.dataset.orbitDepth || 1);
      card.style.setProperty('--parallax-x', `${(x * 18 * depth).toFixed(2)}px`);
      card.style.setProperty('--parallax-y', `${(y * 14 * depth).toFixed(2)}px`);
    });
  };

  const resetCards = () => cards.forEach((card) => {
    card.style.setProperty('--parallax-x', '0px');
    card.style.setProperty('--parallax-y', '0px');
  });

  if (cards.length) {
    hero.addEventListener('pointermove', moveCards, { passive: true });
    hero.addEventListener('pointerleave', resetCards, { passive: true });
  }

  const updateHeroState = () => {
    document.body.classList.toggle('hero-passed', hero.getBoundingClientRect().bottom <= 160);
  };

  updateHeroState();
  window.addEventListener('scroll', updateHeroState, { passive: true });
})();
