(() => {
  const hero = document.querySelector(".project-hero");
  if (!hero || hero.dataset.layeredHeroMotion === "true") return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (reducedMotion.matches) return;

  const image = hero.querySelector(".project-hero-image");
  const overlay = hero.querySelector(".project-hero-overlay");
  const content = hero.querySelector(".project-hero-content");
  const eyebrow = content?.querySelector(".project-eyebrow");
  const title = content?.querySelector("h1");
  const bodyCopy = content?.querySelector("p:not(.project-eyebrow)");
  const actions = [...(content?.querySelectorAll(".project-hero-actions a") || [])];
  const scrollHint = hero.querySelector(".project-scroll");
  const scrollLine = scrollHint?.querySelector("i");
  if (!image || !overlay || !content || !title) return;

  function injectStyles() {
    if (document.querySelector("#home-hero-layered-motion-styles")) return;
    const style = document.createElement("style");
    style.id = "home-hero-layered-motion-styles";
    style.textContent = `
      .project-hero[data-layered-motion="true"] { perspective: 1200px; }
      .project-hero[data-layered-motion="true"] .project-hero-content { transform-style: preserve-3d; }
      .project-hero[data-layered-motion="true"] .hero-motion-ambient {
        position: absolute;
        z-index: 0;
        inset: -16%;
        overflow: hidden;
        pointer-events: none;
        mix-blend-mode: screen;
        will-change: transform, opacity;
      }
      .project-hero[data-layered-motion="true"] .hero-motion-glow {
        position: absolute;
        width: clamp(420px, 46vw, 760px);
        aspect-ratio: 1;
        border-radius: 50%;
        filter: blur(10px);
        opacity: .46;
        will-change: transform, opacity;
      }
      .project-hero[data-layered-motion="true"] .hero-motion-glow-a {
        top: 2%;
        left: 4%;
        background: radial-gradient(circle, rgba(115,242,167,.24) 0%, rgba(115,242,167,.08) 31%, transparent 69%);
      }
      .project-hero[data-layered-motion="true"] .hero-motion-glow-b {
        right: 2%;
        bottom: -8%;
        width: clamp(360px, 40vw, 680px);
        background: radial-gradient(circle, rgba(188,255,214,.16) 0%, rgba(115,242,167,.05) 34%, transparent 70%);
      }
      .project-hero[data-layered-motion="true"] .hero-motion-grid {
        position: absolute;
        inset: 0;
        opacity: .12;
        background-image:
          linear-gradient(rgba(255,255,255,.055) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,.055) 1px, transparent 1px);
        background-size: 76px 76px;
        mask-image: radial-gradient(circle at 50% 46%, #000 0%, rgba(0,0,0,.75) 32%, transparent 70%);
        transform: rotate(-4deg) scale(1.08);
        transform-origin: 50% 50%;
        will-change: transform, opacity;
      }
      .project-hero[data-layered-motion="true"] .hero-motion-sweep {
        position: absolute;
        top: -22%;
        bottom: -22%;
        left: -22%;
        width: 24%;
        opacity: 0;
        background: linear-gradient(90deg, transparent, rgba(115,242,167,.12), rgba(255,255,255,.13), transparent);
        filter: blur(18px);
        transform: skewX(-14deg);
        will-change: transform, opacity;
      }
      .project-hero[data-layered-motion="true"] .project-hero h1,
      .project-hero[data-layered-motion="true"] h1 { position: relative; }
      .project-hero[data-layered-motion="true"] .hero-motion-title-ghost {
        position: absolute;
        z-index: -1;
        inset: 0;
        display: block;
        color: transparent;
        -webkit-text-stroke: 1px rgba(115,242,167,.38);
        text-shadow: 0 0 34px rgba(115,242,167,.18);
        opacity: .2;
        pointer-events: none;
        user-select: none;
        will-change: transform, opacity, filter;
      }
      .project-hero[data-layered-motion="true"] .hero-motion-eyebrow-line {
        display: inline-block;
        width: 38px;
        height: 1px;
        margin-right: 10px;
        vertical-align: middle;
        background: #73f2a7;
        transform-origin: left center;
      }
      .project-hero[data-layered-motion="true"] .project-hero-actions a {
        will-change: transform, box-shadow, filter;
      }
      @media (max-width: 720px) {
        .project-hero[data-layered-motion="true"] .hero-motion-grid { background-size: 54px 54px; opacity: .08; }
        .project-hero[data-layered-motion="true"] .hero-motion-glow { opacity: .34; }
        .project-hero[data-layered-motion="true"] .hero-motion-title-ghost { opacity: .14; }
      }
    `;
    document.head.append(style);
  }

  function ensureLayers() {
    injectStyles();
    hero.dataset.layeredMotion = "true";

    let ambient = hero.querySelector(".hero-motion-ambient");
    if (!ambient) {
      ambient = document.createElement("div");
      ambient.className = "hero-motion-ambient";
      ambient.setAttribute("aria-hidden", "true");
      ambient.innerHTML = `
        <span class="hero-motion-glow hero-motion-glow-a"></span>
        <span class="hero-motion-glow hero-motion-glow-b"></span>
        <span class="hero-motion-grid"></span>
        <span class="hero-motion-sweep"></span>
      `;
      hero.insertBefore(ambient, content);
    }

    let ghost = title.querySelector(".hero-motion-title-ghost");
    if (!ghost) {
      ghost = document.createElement("span");
      ghost.className = "hero-motion-title-ghost";
      ghost.setAttribute("aria-hidden", "true");
      ghost.textContent = title.childNodes[0]?.textContent?.trim() || title.textContent.trim();
      title.append(ghost);
    }

    let eyebrowLine = eyebrow?.querySelector(".hero-motion-eyebrow-line");
    if (eyebrow && !eyebrowLine) {
      eyebrowLine = document.createElement("span");
      eyebrowLine.className = "hero-motion-eyebrow-line";
      eyebrowLine.setAttribute("aria-hidden", "true");
      eyebrow.prepend(eyebrowLine);
    }

    return {
      ambient,
      glowA: ambient.querySelector(".hero-motion-glow-a"),
      glowB: ambient.querySelector(".hero-motion-glow-b"),
      grid: ambient.querySelector(".hero-motion-grid"),
      sweep: ambient.querySelector(".hero-motion-sweep"),
      ghost,
      eyebrowLine,
    };
  }

  function initMotion() {
    if (!window.gsap) return false;
    const { gsap } = window;
    const layers = ensureLayers();
    hero.dataset.layeredHeroMotion = "true";

    const introTargets = [layers.ambient, layers.ghost, layers.eyebrowLine, title, bodyCopy, ...actions].filter(Boolean);
    gsap.killTweensOf(introTargets);

    if (window.scrollY < 140) {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" }, delay: .08 });
      intro
        .fromTo(layers.ambient,
          { autoAlpha: 0, scale: .94 },
          { autoAlpha: 1, scale: 1, duration: 1.15, clearProps: "opacity,visibility,transform" },
          0,
        )
        .fromTo(layers.glowA,
          { autoAlpha: 0, scale: .66 },
          { autoAlpha: .46, scale: 1, duration: 1.35, ease: "expo.out" },
          .05,
        )
        .fromTo(layers.glowB,
          { autoAlpha: 0, scale: .72 },
          { autoAlpha: .38, scale: 1, duration: 1.5, ease: "expo.out" },
          .16,
        )
        .fromTo(layers.ghost,
          { autoAlpha: 0, x: -24, filter: "blur(10px)" },
          { autoAlpha: .22, x: 0, filter: "blur(0px)", duration: 1.05, clearProps: "filter" },
          .3,
        )
        .fromTo(title,
          { filter: "blur(4px)", letterSpacing: "-.035em" },
          { filter: "blur(0px)", letterSpacing: "-.065em", duration: 1.0, clearProps: "filter,letterSpacing" },
          .25,
        );

      if (layers.eyebrowLine) {
        intro.fromTo(layers.eyebrowLine,
          { scaleX: 0, autoAlpha: 0 },
          { scaleX: 1, autoAlpha: 1, duration: .65 },
          .28,
        );
      }

      if (bodyCopy) {
        intro.fromTo(bodyCopy,
          { filter: "blur(5px)" },
          { filter: "blur(0px)", duration: .8, clearProps: "filter" },
          .48,
        );
      }

      if (actions.length) {
        intro.fromTo(actions,
          { autoAlpha: 0, y: 18, scale: .95 },
          { autoAlpha: 1, y: 0, scale: 1, stagger: .09, duration: .6, ease: "back.out(1.5)", clearProps: "opacity,visibility,transform" },
          .6,
        );
      }
    }

    gsap.set(layers.grid, { transformOrigin: "50% 50%" });
    gsap.to(layers.grid, {
      rotation: 1.5,
      scale: 1.12,
      opacity: .18,
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(layers.glowA, {
      rotation: 12,
      scale: 1.09,
      opacity: .54,
      duration: 7.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(layers.glowB, {
      rotation: -10,
      scale: .92,
      opacity: .46,
      duration: 9.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.fromTo(layers.sweep,
      { xPercent: -110, autoAlpha: 0 },
      { xPercent: 620, autoAlpha: .72, duration: 4.6, repeat: -1, repeatDelay: 2.4, ease: "power2.inOut" },
    );
    gsap.to(layers.ghost, {
      autoAlpha: .3,
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(overlay, {
      opacity: .9,
      duration: 4.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    if (scrollLine) {
      gsap.set(scrollLine, { transformOrigin: "50% 0%" });
      gsap.timeline({ repeat: -1, repeatDelay: .25 })
        .fromTo(scrollLine,
          { scaleY: .35, autoAlpha: .35 },
          { scaleY: 1, autoAlpha: .95, duration: .78, ease: "power2.out" },
        )
        .to(scrollLine, { scaleY: .28, autoAlpha: .28, duration: .58, ease: "power2.in" });
    }

    actions.forEach((action) => {
      action.addEventListener("pointerenter", () => {
        if (!finePointer.matches) return;
        gsap.to(action, {
          scale: 1.035,
          filter: "brightness(1.08)",
          boxShadow: "0 18px 52px rgba(115,242,167,.16)",
          duration: .28,
          ease: "power3.out",
          overwrite: "auto",
        });
      });
      action.addEventListener("pointerleave", () => {
        gsap.to(action, {
          scale: 1,
          filter: "brightness(1)",
          boxShadow: "0 0 0 rgba(115,242,167,0)",
          duration: .45,
          ease: "back.out(1.5)",
          clearProps: "scale,filter,boxShadow",
        });
      });
    });

    if (finePointer.matches) {
      const glowAX = gsap.quickTo(layers.glowA, "x", { duration: .75, ease: "power3.out" });
      const glowAY = gsap.quickTo(layers.glowA, "y", { duration: .75, ease: "power3.out" });
      const glowBX = gsap.quickTo(layers.glowB, "x", { duration: .9, ease: "power3.out" });
      const glowBY = gsap.quickTo(layers.glowB, "y", { duration: .9, ease: "power3.out" });
      const ghostX = gsap.quickTo(layers.ghost, "x", { duration: .55, ease: "power3.out" });
      const ghostY = gsap.quickTo(layers.ghost, "y", { duration: .55, ease: "power3.out" });
      const eyebrowX = eyebrow ? gsap.quickTo(eyebrow, "x", { duration: .62, ease: "power3.out" }) : null;
      const bodyX = bodyCopy ? gsap.quickTo(bodyCopy, "x", { duration: .72, ease: "power3.out" }) : null;

      hero.addEventListener("pointermove", (event) => {
        const rect = hero.getBoundingClientRect();
        const px = ((event.clientX - rect.left) / Math.max(rect.width, 1) - .5) * 2;
        const py = ((event.clientY - rect.top) / Math.max(rect.height, 1) - .5) * 2;
        glowAX(px * 32);
        glowAY(py * 22);
        glowBX(px * -24);
        glowBY(py * -16);
        ghostX(px * 5.5);
        ghostY(py * 3.5);
        eyebrowX?.(px * -3.5);
        bodyX?.(px * 2.5);
      });

      hero.addEventListener("pointerleave", () => {
        glowAX(0);
        glowAY(0);
        glowBX(0);
        glowBY(0);
        ghostX(0);
        ghostY(0);
        eyebrowX?.(0);
        bodyX?.(0);
      });
    }

    if (window.ScrollTrigger) {
      gsap.registerPlugin(window.ScrollTrigger);
      gsap.to(layers.ambient, {
        yPercent: -12,
        scale: 1.04,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: .9 },
      });
      gsap.to(layers.ghost, {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "18% top", end: "72% top", scrub: .8 },
      });
    }

    return true;
  }

  let attempts = 0;
  const boot = () => {
    if (initMotion()) return;
    attempts += 1;
    if (attempts < 100) window.setTimeout(boot, 80);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
