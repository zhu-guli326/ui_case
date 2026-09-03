(() => {
  const body = document.body;
  if (!body?.classList.contains("project-home") || body.dataset.globalGsapMotion === "true") return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (reducedMotion.matches) return;

  const waitForMotion = (attempt = 0) => {
    if (window.gsap && window.ScrollTrigger) {
      initGlobalMotion();
      return;
    }
    if (attempt < 120) window.setTimeout(() => waitForMotion(attempt + 1), 80);
  };

  function initGlobalMotion() {
    if (body.dataset.globalGsapMotion === "true") return;
    body.dataset.globalGsapMotion = "true";

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const q = (selector, scope = document) => scope.querySelector(selector);
    const qa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

    // Never translate the section shell itself: moving a full section creates a
    // visible gap between adjacent backgrounds. Animate only safe inner content.
    const chapterEntrances = [
      [q("#cases"), q("#cases .featured-carousel")],
      [q("#overview"), q("#overview .project-stats-grid")],
      [q("#templates"), q("#templates .project-container")],
      [q("#capabilities"), q("#capabilities .project-container")],
      [q("#design-system"), q("#design-system .showcase-copy")],
      [q("#design-system-live"), q("#design-system-live .system-explainer-heading")],
      [q(".project-cta"), q(".project-cta .project-cta-inner")],
      [q(".project-footer"), q(".project-footer .footer-brand")],
    ].filter(([section, target]) => Boolean(section && target));

    chapterEntrances.forEach(([section, target], index) => {
      gsap.fromTo(target,
        { autoAlpha: .88, y: index % 2 ? 20 : 26 },
        {
          autoAlpha: 1,
          y: 0,
          duration: .92,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: section,
            start: "top 91%",
            once: true,
          },
        },
      );
    });

    // Keep parallax on visual layers only. The stats / section containers are
    // intentionally excluded so their top and bottom edges never pull apart.
    const depthLayers = [
      [q("#cases .featured-carousel-track"), -1.8],
      [q("#design-system .showcase-scene"), -2.8],
      [q("#design-system-live .system-explainer-stage"), -2.2],
    ].filter(([node]) => Boolean(node));

    depthLayers.forEach(([node, amount]) => {
      const trigger = node.closest("section, footer") || node;
      gsap.fromTo(node,
        { yPercent: amount * -0.3 },
        {
          yPercent: amount,
          ease: "none",
          scrollTrigger: {
            trigger,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
    });

    // Headings retain a soft focus reveal without changing section geometry.
    qa("main .section-heading h2, main .template-gallery-heading h2, main .showcase-copy h2, main .system-explainer-heading h2, main .project-cta h2")
      .forEach((heading) => {
        const section = heading.closest("section") || heading;
        gsap.fromTo(heading,
          { filter: "blur(7px)", letterSpacing: ".015em" },
          {
            filter: "blur(0px)",
            letterSpacing: getComputedStyle(heading).letterSpacing,
            duration: .95,
            ease: "power3.out",
            clearProps: "filter,letterSpacing",
            scrollTrigger: { trigger: section, start: "top 82%", once: true },
          },
        );
      });

    // Navigation-like controls use the same magnetic response throughout Home.
    if (finePointer.matches) {
      const magneticTargets = qa([
        "#templates .template-filters a",
        ".featured-carousel-arrow",
        ".project-footer nav a",
      ].join(","));

      magneticTargets.forEach((element) => {
        if (element.dataset.globalMagnetic === "true") return;
        element.dataset.globalMagnetic = "true";
        const moveX = gsap.quickTo(element, "x", { duration: .36, ease: "power3.out" });
        const moveY = gsap.quickTo(element, "y", { duration: .36, ease: "power3.out" });

        element.addEventListener("pointermove", (event) => {
          const rect = element.getBoundingClientRect();
          const dx = event.clientX - (rect.left + rect.width / 2);
          const dy = event.clientY - (rect.top + rect.height / 2);
          moveX(gsap.utils.clamp(-9, 9, dx * .15));
          moveY(gsap.utils.clamp(-7, 7, dy * .15));
        });

        element.addEventListener("pointerleave", () => {
          moveX(0);
          moveY(0);
        });
      });
    }

    // The four capability cards keep the current four-up layout and only regain
    // a restrained interaction layer: staggered reveal, lift, image depth and
    // pointer-following 3D tilt. No old workflow layout/state is restored here.
    const capabilityCards = qa("#capabilities .capability-grid > a");
    if (capabilityCards.length) {
      gsap.fromTo(capabilityCards,
        { autoAlpha: 0, y: 34, scale: .975 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: .68,
          stagger: .07,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: "#capabilities .capability-grid",
            start: "top 84%",
            once: true,
          },
        },
      );

      if (finePointer.matches) {
        capabilityCards.forEach((card) => {
          if (card.dataset.capabilityTilt === "true") return;
          card.dataset.capabilityTilt = "true";

          const image = q("img", card);
          gsap.set(card, {
            transformPerspective: 900,
            transformOrigin: "50% 50%",
            transformStyle: "preserve-3d",
            willChange: "transform",
          });

          const tiltX = gsap.quickTo(card, "rotationX", { duration: .28, ease: "power3.out" });
          const tiltY = gsap.quickTo(card, "rotationY", { duration: .28, ease: "power3.out" });
          const lift = gsap.quickTo(card, "y", { duration: .34, ease: "power3.out" });
          const cardScale = gsap.quickTo(card, "scale", { duration: .34, ease: "power3.out" });

          card.addEventListener("pointerenter", () => {
            lift(-8);
            cardScale(1.015);
            gsap.to(card, {
              boxShadow: "0 26px 58px rgba(0,0,0,.18)",
              duration: .34,
              ease: "power3.out",
            });
            if (image) {
              gsap.to(image, {
                scale: 1.055,
                filter: "brightness(1.035) saturate(1.04)",
                duration: .55,
                ease: "power3.out",
                overwrite: "auto",
              });
            }
          });

          card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            const px = (event.clientX - rect.left) / Math.max(rect.width, 1) - .5;
            const py = (event.clientY - rect.top) / Math.max(rect.height, 1) - .5;
            tiltY(gsap.utils.clamp(-5, 5, px * 10));
            tiltX(gsap.utils.clamp(-4, 4, py * -8));
          });

          card.addEventListener("pointerleave", () => {
            tiltX(0);
            tiltY(0);
            lift(0);
            cardScale(1);
            gsap.to(card, {
              boxShadow: "0 0 0 rgba(0,0,0,0)",
              duration: .48,
              ease: "power3.out",
            });
            if (image) {
              gsap.to(image, {
                scale: 1,
                filter: "none",
                duration: .58,
                ease: "power3.out",
                overwrite: "auto",
              });
            }
          });
        });
      }
    }

    // Discovery row gets subtle breathing depth without touching image crop / paths.
    const discoveryGrid = q("#templates .template-grid");
    if (discoveryGrid) {
      gsap.to(discoveryGrid, {
        scale: 1.006,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "50% 50%",
      });
    }

    const showcaseScene = q("#design-system .showcase-scene");
    if (showcaseScene) {
      gsap.to(showcaseScene, {
        rotationX: .7,
        rotationY: -.45,
        duration: 5.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformPerspective: 1400,
        transformOrigin: "50% 50%",
      });
    }

    const ctaActions = qa(".project-cta-actions a");
    if (ctaActions.length) {
      gsap.from(ctaActions, {
        autoAlpha: 0,
        y: 18,
        scale: .94,
        stagger: .08,
        duration: .62,
        ease: "back.out(1.5)",
        clearProps: "opacity,visibility,transform",
        scrollTrigger: { trigger: ".project-cta", start: "top 78%", once: true },
      });
    }

    const footerBrand = q(".project-footer .footer-brand");
    if (footerBrand) {
      gsap.fromTo(footerBrand,
        { autoAlpha: .55, y: 30, scale: .99 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.05,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
          scrollTrigger: { trigger: ".project-footer", start: "top 72%", once: true },
        },
      );
    }

    window.setTimeout(() => ScrollTrigger.refresh(), 180);
    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => waitForMotion(), { once: true });
  } else {
    waitForMotion();
  }
})();