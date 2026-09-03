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

    // 1. Give every homepage chapter one shared entrance rhythm. Existing local
    // animations continue to run on the children; this only moves the section shell.
    const chapters = [
      q("#cases"),
      q("#overview"),
      q("#templates"),
      q("#capabilities"),
      q("#design-system"),
      q("#design-system-live"),
      q(".project-cta"),
      q(".project-footer"),
    ].filter(Boolean);

    chapters.forEach((section, index) => {
      gsap.fromTo(section,
        { autoAlpha: .9, y: index % 2 ? 34 : 46 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.05,
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

    // 2. Long-scroll depth: move safe parent layers rather than the elements that
    // already own their own entrance / hover transforms.
    const depthLayers = [
      [q("#cases .featured-carousel-track"), -2.8],
      [q("#overview .project-stats-grid"), -2.1],
      [q("#templates .project-container"), -1.8],
      [q("#capabilities .workflow-explorer"), -2.6],
      [q("#design-system .showcase-scene"), -3.6],
      [q("#design-system-live .system-explainer-stage"), -2.8],
      [q(".project-cta .project-cta-inner"), -1.7],
      [q(".project-footer .footer-grid"), -1.4],
    ].filter(([node]) => Boolean(node));

    depthLayers.forEach(([node, amount]) => {
      const trigger = node.closest("section, footer") || node;
      gsap.fromTo(node,
        { yPercent: amount * -0.4 },
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

    // 3. Headings get a second, softer focus pass so the page reads as one motion
    // system rather than a collection of unrelated card animations.
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

    // 4. Navigation-like controls use the same magnetic response throughout Home.
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

    // 5. Discovery row gets a subtle breathing depth without touching the actual
    // image crop / demo paths.
    const discoveryGrid = q("#templates .template-grid");
    if (discoveryGrid) {
      gsap.to(discoveryGrid, {
        scale: 1.008,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "50% 50%",
      });
    }

    // 6. Workflow poster and Design System scene receive a low-frequency float.
    const workflowPoster = q("#capabilities .workflow-poster");
    if (workflowPoster) {
      gsap.to(workflowPoster, {
        y: -7,
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

    // 7. CTA and footer close the page with a more deliberate reveal.
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
        { autoAlpha: .55, y: 44, scale: .985 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
          scrollTrigger: { trigger: ".project-footer", start: "top 72%", once: true },
        },
      );
    }

    // Keep ScrollTrigger geometry correct after lazy images and dynamic discovery
    // previews settle into their final dimensions.
    window.setTimeout(() => ScrollTrigger.refresh(), 180);
    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => waitForMotion(), { once: true });
  } else {
    waitForMotion();
  }
})();
