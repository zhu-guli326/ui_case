(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  function initCtaMotion() {
    const section = document.querySelector(".project-cta");
    if (!section || reducedMotion.matches || !window.gsap || !window.ScrollTrigger) return false;

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const title = section.querySelector("h2");
    const tag = section.querySelector(".section-eyebrow");
    const actions = section.querySelector(".project-cta-actions");
    const button = actions?.querySelector(".button-filled");
    const targets = [title, tag, actions].filter(Boolean);

    section.classList.add("has-gsap-cta-motion");
    gsap.killTweensOf(targets);

    const intro = gsap.timeline({
      defaults: { overwrite: "auto" },
      scrollTrigger: {
        trigger: section,
        start: "top 72%",
        once: true,
      },
    });

    if (title) {
      intro.fromTo(title,
        {
          autoAlpha: 0,
          y: 86,
          scale: 0.965,
          filter: "blur(16px)",
          clipPath: "inset(0 0 100% 0)",
          transformOrigin: "50% 100%",
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          clipPath: "inset(0 0 0% 0)",
          duration: 1.15,
          ease: "power4.out",
          clearProps: "opacity,visibility,filter,clipPath",
        },
      );
    }

    if (tag) {
      intro.fromTo(tag,
        { autoAlpha: 0, y: 28, scale: 0.9 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.58, ease: "back.out(1.7)", clearProps: "opacity,visibility,transform" },
        "-=0.48",
      );
    }

    if (actions) {
      intro.fromTo(actions,
        { autoAlpha: 0, y: 34, scale: 0.9 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.68, ease: "back.out(1.8)", clearProps: "opacity,visibility,transform" },
        "-=0.34",
      );
    }

    if (title) {
      gsap.to(title, {
        yPercent: -7,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.7,
        },
      });
    }

    if (tag) {
      gsap.to(tag, {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.85,
        },
      });
    }

    if (button && finePointer.matches) {
      const enter = () => gsap.to(button, {
        scale: 1.055,
        y: -3,
        boxShadow: "0 16px 42px rgba(115, 242, 167, .24)",
        duration: 0.28,
        ease: "power3.out",
      });
      const leave = () => gsap.to(button, {
        scale: 1,
        y: 0,
        boxShadow: "0 0 0 rgba(115, 242, 167, 0)",
        duration: 0.42,
        ease: "back.out(1.7)",
        clearProps: "transform,boxShadow",
      });
      button.addEventListener("pointerenter", enter);
      button.addEventListener("pointerleave", leave);
    }

    ScrollTrigger.refresh();
    return true;
  }

  let attempts = 0;
  const boot = () => {
    if (initCtaMotion()) return;
    attempts += 1;
    if (attempts < 60) window.setTimeout(boot, 100);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
