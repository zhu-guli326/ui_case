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
      [q("#capabilities .workflow-poster"), -2.1],
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
        "#capabilities .workflow-stage-button",
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

    const workflowPoster = q("#capabilities .workflow-poster");
    if (workflowPoster) {
      gsap.to(workflowPoster, {
        y: -5,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
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
