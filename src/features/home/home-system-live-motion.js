(() => {
  const stage = document.querySelector("#design-system-live .system-explainer-stage");
  const app = stage?.querySelector(".system-app");
  const callouts = [
    stage?.querySelector(".system-callout-type"),
    stage?.querySelector(".system-callout-color"),
    stage?.querySelector(".system-callout-spacing"),
    stage?.querySelector(".system-callout-states"),
  ].filter(Boolean);

  if (!stage || !app || callouts.length < 4) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (reducedMotion.matches) return;

  function initMotion() {
    if (!window.gsap || !window.ScrollTrigger) return false;

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    // Re-run the reveal whenever the section comes back into view so the motion
    // does not disappear after the first visit / refresh at a deep scroll position.
    const reveal = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
    reveal
      .fromTo(app,
        { autoAlpha: .2, y: 42, scale: .965, filter: "blur(18px)", transformOrigin: "50% 50%" },
        { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: .82, clearProps: "opacity,visibility,filter" },
      )
      .fromTo(callouts[0],
        { autoAlpha: 0, x: -72, y: -24, scale: .9 },
        { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: .62 },
        "-=.18",
      )
      .fromTo(callouts[1],
        { autoAlpha: 0, x: 72, y: -24, scale: .9 },
        { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: .62 },
        "-=.42",
      )
      .fromTo(callouts[2],
        { autoAlpha: 0, x: -72, y: 24, scale: .9 },
        { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: .62 },
        "-=.42",
      )
      .fromTo(callouts[3],
        { autoAlpha: 0, x: 72, y: 24, scale: .9 },
        { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: .62 },
        "-=.42",
      );

    ScrollTrigger.create({
      trigger: stage,
      start: "top 78%",
      end: "bottom 20%",
      onEnter: () => reveal.restart(),
      onEnterBack: () => reveal.restart(),
    });

    // Keep the real screenshot interactive after the entrance animation: the
    // canvas tilts toward the pointer while the four rule cards drift at
    // different depths, preserving the old interactive-canvas feel.
    if (finePointer.matches) {
      const appRotX = gsap.quickTo(app, "rotationX", { duration: .45, ease: "power3.out" });
      const appRotY = gsap.quickTo(app, "rotationY", { duration: .45, ease: "power3.out" });
      const appX = gsap.quickTo(app, "x", { duration: .5, ease: "power3.out" });
      const appY = gsap.quickTo(app, "y", { duration: .5, ease: "power3.out" });

      const calloutSetters = callouts.map((callout, index) => ({
        x: gsap.quickTo(callout, "x", { duration: .5 + index * .04, ease: "power3.out" }),
        y: gsap.quickTo(callout, "y", { duration: .5 + index * .04, ease: "power3.out" }),
      }));

      stage.addEventListener("pointerenter", () => {
        gsap.to(app, {
          scale: 1.012,
          boxShadow: "0 54px 150px rgba(0,0,0,.68), 0 0 64px rgba(115,242,167,.1)",
          duration: .48,
          ease: "power3.out",
          overwrite: "auto",
        });
        gsap.to(callouts, {
          boxShadow: "0 24px 70px rgba(0,0,0,.34)",
          duration: .45,
          stagger: .035,
          ease: "power3.out",
        });
      });

      stage.addEventListener("pointermove", (event) => {
        const rect = stage.getBoundingClientRect();
        const px = ((event.clientX - rect.left) / Math.max(rect.width, 1) - .5) * 2;
        const py = ((event.clientY - rect.top) / Math.max(rect.height, 1) - .5) * 2;

        appRotY(px * 3.2);
        appRotX(py * -2.4);
        appX(px * 10);
        appY(py * 7);

        const depths = [14, 12, 10, 16];
        calloutSetters.forEach((setters, index) => {
          const direction = index % 2 === 0 ? -1 : 1;
          setters.x(px * depths[index] * direction);
          setters.y(py * (depths[index] * .55));
        });
      });

      stage.addEventListener("pointerleave", () => {
        appRotX(0);
        appRotY(0);
        appX(0);
        appY(0);
        calloutSetters.forEach(({ x, y }) => { x(0); y(0); });

        gsap.to(app, {
          scale: 1,
          boxShadow: "0 42px 120px rgba(0,0,0,.58), 0 0 0 1px rgba(115,242,167,.05)",
          duration: .72,
          ease: "power3.out",
          clearProps: "rotationX,rotationY,x,y",
        });
        gsap.to(callouts, {
          boxShadow: "none",
          duration: .55,
          stagger: .025,
          ease: "power3.out",
          clearProps: "x,y,boxShadow",
        });
      });

      gsap.set(app, { transformPerspective: 1200, transformOrigin: "50% 50%" });
    }

    return true;
  }

  let attempts = 0;
  function boot() {
    if (initMotion()) return;
    attempts += 1;
    if (attempts < 80) window.setTimeout(boot, 75);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
