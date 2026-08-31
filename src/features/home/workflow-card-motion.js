/*
 * Learn home motion system.
 * GSAP + ScrollTrigger drive page-level motion; the workflow cards keep their
 * React Bits ProfileCard-inspired pointer tilt in vanilla JS.
 */

(() => {
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');
  const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)');
  const WORKFLOW_SELECTOR = '#capabilities .capability-grid > a';
  const GSAP_VERSION = '3.13.0';

  const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);
  const round = (value, precision = 3) => Number(value.toFixed(precision));

  function loadScript(src, test) {
    if (test()) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const existing = [...document.scripts].find((script) => script.src === src);
      if (existing) {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
  }

  async function ensureGsap() {
    await loadScript(`https://cdn.jsdelivr.net/npm/gsap@${GSAP_VERSION}/dist/gsap.min.js`, () => Boolean(window.gsap));
    await loadScript(`https://cdn.jsdelivr.net/npm/gsap@${GSAP_VERSION}/dist/ScrollTrigger.min.js`, () => Boolean(window.ScrollTrigger));
    window.gsap.registerPlugin(window.ScrollTrigger);
    return { gsap: window.gsap, ScrollTrigger: window.ScrollTrigger };
  }

  function setTiltVars(card, x, y) {
    const width = card.clientWidth || 1;
    const height = card.clientHeight || 1;
    const percentX = clamp((100 / width) * x);
    const percentY = clamp((100 / height) * y);
    card.style.setProperty('--pointer-x', `${percentX}%`);
    card.style.setProperty('--pointer-y', `${percentY}%`);
    card.style.setProperty('--pointer-from-center', `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`);
    card.style.setProperty('--pointer-from-top', `${percentY / 100}`);
    card.style.setProperty('--pointer-from-left', `${percentX / 100}`);
    card.style.setProperty('--rotate-x', `${round(-(percentX - 50) / 6.25)}deg`);
    card.style.setProperty('--rotate-y', `${round((percentY - 50) / 5)}deg`);
  }

  function enhanceWorkflowCard(card) {
    if (card.dataset.workflowTiltReady === 'true') return;
    card.dataset.workflowTiltReady = 'true';
    let raf = 0;
    let currentX = card.clientWidth / 2;
    let currentY = card.clientHeight / 2;
    let targetX = currentX;
    let targetY = currentY;

    const animate = () => {
      currentX += (targetX - currentX) * .16;
      currentY += (targetY - currentY) * .16;
      setTiltVars(card, currentX, currentY);
      if (Math.abs(targetX - currentX) > .1 || Math.abs(targetY - currentY) > .1) raf = requestAnimationFrame(animate);
      else raf = 0;
    };

    const setTarget = (x, y) => {
      targetX = x;
      targetY = y;
      if (!raf) raf = requestAnimationFrame(animate);
    };

    const canTilt = () => FINE_POINTER.matches && !REDUCED_MOTION.matches;

    card.addEventListener('pointerenter', (event) => {
      if (!canTilt()) return;
      card.classList.add('workflow-card-active');
      const rect = card.getBoundingClientRect();
      setTarget(event.clientX - rect.left, event.clientY - rect.top);
    });
    card.addEventListener('pointermove', (event) => {
      if (!canTilt()) return;
      const rect = card.getBoundingClientRect();
      setTarget(event.clientX - rect.left, event.clientY - rect.top);
    });
    card.addEventListener('pointerleave', () => {
      if (!canTilt()) return;
      setTarget(card.clientWidth / 2, card.clientHeight / 2);
      window.setTimeout(() => card.classList.remove('workflow-card-active'), 320);
    });
  }

  function initWorkflowTilt() {
    document.querySelectorAll(WORKFLOW_SELECTOR).forEach(enhanceWorkflowCard);
  }

  function initDiscoveryTransitions(gsap, ScrollTrigger) {
    const strip = document.querySelector('.discovery-strip');
    if (!strip || typeof window.renderDiscovery !== 'function') return;
    const tabs = [...strip.querySelectorAll('.template-filters a')];

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        const current = strip.querySelector('.template-card.is-active-discovery');
        if (tab.classList.contains('is-active')) return;

        const swap = () => {
          window.renderDiscovery(index);
          const next = strip.querySelector('.template-card.is-active-discovery');
          if (!next) return;
          gsap.fromTo(next,
            { opacity: 0, scale: 1.035, filter: 'blur(12px)' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: .55, ease: 'power3.out', clearProps: 'filter,transform,opacity' }
          );
          ScrollTrigger.refresh();
        };

        if (!current) swap();
        else gsap.to(current, { opacity: 0, scale: .965, filter: 'blur(10px)', duration: .26, ease: 'power2.in', onComplete: swap });
      }, true);
    });
  }

  function initMagneticLinks(gsap) {
    if (!FINE_POINTER.matches) return;
    const links = document.querySelectorAll('.project-hero-actions a, .project-cta-actions a, .discovery-more');
    links.forEach((link) => {
      link.addEventListener('pointermove', (event) => {
        const rect = link.getBoundingClientRect();
        gsap.to(link, {
          x: (event.clientX - rect.left - rect.width / 2) * .12,
          y: (event.clientY - rect.top - rect.height / 2) * .16,
          duration: .3,
          ease: 'power2.out',
          overwrite: true,
        });
      });
      link.addEventListener('pointerleave', () => gsap.to(link, { x: 0, y: 0, duration: .45, ease: 'elastic.out(1,.45)' }));
    });
  }

  function initPageMotion(gsap, ScrollTrigger) {
    if (REDUCED_MOTION.matches) return;
    document.documentElement.classList.add('has-home-motion');

    const hero = document.querySelector('.project-hero');
    if (hero) {
      const heroIntro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroIntro
        .from('.project-hero-image', { scale: 1.09, duration: 1.6, ease: 'power2.out' })
        .from('.project-hero .project-eyebrow', { y: 20, opacity: 0, duration: .65 }, .08)
        .from('.project-hero h1', { y: 58, opacity: 0, duration: 1 }, .18)
        .from('.project-hero-content > p:not(.project-eyebrow)', { y: 28, opacity: 0, duration: .75 }, .38)
        .from('.project-hero-actions > *', { y: 22, opacity: 0, stagger: .1, duration: .62 }, .52)
        .from('.project-scroll', { opacity: 0, y: -12, duration: .55 }, .72);

      gsap.to('.project-hero-image', {
        scale: 1.14,
        yPercent: 4,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .8 },
      });
      gsap.to('.project-hero-content', {
        y: -95,
        opacity: .35,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: '35% top', end: 'bottom top', scrub: .8 },
      });
    }

    gsap.from('.featured-carousel', {
      opacity: 0,
      y: 60,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#cases', start: 'top 76%', once: true },
    });

    gsap.from('#overview article', {
      opacity: 0,
      y: 42,
      stagger: .14,
      duration: .75,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#overview', start: 'top 78%', once: true },
    });

    const discovery = document.querySelector('.discovery-strip');
    if (discovery) {
      gsap.from('.discovery-strip .template-gallery-heading > *', {
        opacity: 0,
        y: 34,
        stagger: .09,
        duration: .72,
        scrollTrigger: { trigger: discovery, start: 'top 75%', once: true },
      });
      gsap.from('.discovery-strip .template-filters a', {
        opacity: 0,
        y: 20,
        stagger: .06,
        duration: .55,
        scrollTrigger: { trigger: discovery, start: 'top 68%', once: true },
      });
      const preview = discovery.querySelector('.template-grid');
      if (preview) gsap.from(preview, { opacity: 0, scale: .97, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: preview, start: 'top 82%', once: true } });
    }

    gsap.from('#capabilities .section-heading > *', {
      opacity: 0,
      y: 32,
      stagger: .1,
      duration: .7,
      scrollTrigger: { trigger: '#capabilities', start: 'top 76%', once: true },
    });
    gsap.from(WORKFLOW_SELECTOR, {
      opacity: 0,
      clipPath: 'inset(12% 0 0 0 round 8px)',
      stagger: .12,
      duration: .9,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#capabilities .capability-grid', start: 'top 78%', once: true },
      clearProps: 'clipPath',
    });

    const showcase = document.querySelector('.project-showcase');
    if (showcase) {
      gsap.from('.showcase-copy > *', { opacity: 0, y: 34, stagger: .1, duration: .72, scrollTrigger: { trigger: showcase, start: 'top 72%', once: true } });
      gsap.from('.showcase-card', {
        opacity: 0,
        filter: 'blur(10px)',
        clipPath: 'inset(10% 8% 10% 8% round 8px)',
        stagger: .1,
        duration: .85,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.showcase-scene', start: 'top 80%', once: true },
        clearProps: 'filter,clipPath',
      });
    }

    const explainer = document.querySelector('.design-system-explainer');
    if (explainer) {
      gsap.from('.system-explainer-heading > *', { opacity: 0, y: 34, stagger: .1, duration: .72, scrollTrigger: { trigger: explainer, start: 'top 72%', once: true } });
      gsap.from('.system-app', {
        opacity: 0,
        filter: 'blur(14px)',
        duration: .95,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.system-explainer-stage', start: 'top 76%', once: true },
        clearProps: 'filter',
      });
      gsap.from('.system-callout', {
        opacity: 0,
        clipPath: 'inset(14% 10% 14% 10% round 18px)',
        stagger: .16,
        duration: .8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.system-explainer-stage', start: 'top 68%', once: true },
        clearProps: 'clipPath',
      });
      gsap.to('.system-app-art i', {
        boxShadow: '0 0 72px rgba(115,242,167,.5)',
        repeat: -1,
        yoyo: true,
        duration: 1.8,
        ease: 'sine.inOut',
      });
    }

    const finalCta = document.querySelector('.project-cta');
    if (finalCta) {
      gsap.from('.project-cta-inner > *', {
        opacity: 0,
        y: 42,
        stagger: .14,
        duration: .8,
        ease: 'power3.out',
        scrollTrigger: { trigger: finalCta, start: 'top 82%', once: true },
      });
    }

    initDiscoveryTransitions(gsap, ScrollTrigger);
    initMagneticLinks(gsap);
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  }

  async function boot() {
    initWorkflowTilt();
    if (REDUCED_MOTION.matches) return;
    try {
      const { gsap, ScrollTrigger } = await ensureGsap();
      initPageMotion(gsap, ScrollTrigger);
    } catch (error) {
      console.warn('[ONDesign] GSAP motion layer could not load; keeping the static page.', error);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
