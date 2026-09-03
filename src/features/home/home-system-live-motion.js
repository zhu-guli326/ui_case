(() => {
  const section = document.querySelector("#design-system");
  const stage = section?.querySelector(".showcase-scene");
  const cards = [...(stage?.querySelectorAll(".showcase-card") || [])];
  const copy = [...(section?.querySelectorAll(".showcase-copy > *") || [])];

  if (!section || !stage || cards.length < 2) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (reducedMotion.matches) return;

  const depths = [12, 17, 10, 15, 13];

  function bindPointerMotion() {
    if (!finePointer.matches || stage.dataset.showcasePointerBound === "true") return;
    stage.dataset.showcasePointerBound = "true";

    cards.forEach((card) => {
      card.style.willChange = "translate, scale, box-shadow";
      card.style.transition = [
        "translate .46s cubic-bezier(.16,1,.3,1)",
        "scale .42s cubic-bezier(.16,1,.3,1)",
        "box-shadow .42s ease",
      ].join(", ");

      card.addEventListener("pointerenter", () => {
        card.style.scale = "1.04";
        card.style.boxShadow = "0 32px 78px rgba(0,0,0,.44)";
      });

      card.addEventListener("pointerleave", () => {
        card.style.scale = "1";
        card.style.boxShadow = "";
      });
    });

    stage.addEventListener("pointermove", (event) => {
      const rect = stage.getBoundingClientRect();
      const px = ((event.clientX - rect.left) / Math.max(rect.width, 1) - .5) * 2;
      const py = ((event.clientY - rect.top) / Math.max(rect.height, 1) - .5) * 2;

      cards.forEach((card, index) => {
        const direction = index % 2 === 0 ? -1 : 1;
        const depth = depths[index] || 12;
        card.style.translate = `${px * depth * direction}px ${py * depth * .45}px`;
      });
    });

    stage.addEventListener("pointerleave", () => {
      cards.forEach((card) => {
        card.style.translate = "0 0";
        card.style.scale = "1";
        card.style.boxShadow = "";
      });
    });
  }

  function nativeRevealFallback() {
    if (!("IntersectionObserver" in window) || stage.dataset.showcaseRevealBound === "true") return;
    stage.dataset.showcaseRevealBound = "true";

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;

      copy.forEach((node, index) => {
        node.animate(
          [
            { opacity: 0, translate: "0 24px" },
            { opacity: 1, translate: "0 0" },
          ],
          {
            duration: 560,
            delay: index * 70,
            easing: "cubic-bezier(.2,.8,.2,1)",
            fill: "both",
          },
        );
      });

      cards.forEach((card, index) => {
        card.animate(
          [
            { opacity: 0, translate: "0 72px", scale: .9 },
            { opacity: 1, translate: "0 0", scale: 1 },
          ],
          {
            duration: 820,
            delay: 160 + index * 90,
            easing: "cubic-bezier(.16,1,.3,1)",
            fill: "both",
          },
        );
      });

      observer.disconnect();
    }, { threshold: .16 });

    observer.observe(section);
  }

  bindPointerMotion();

  // home.js owns the GSAP entrance reveal for this current section. If GSAP is
  // unavailable, keep the same reveal behavior with the Web Animations API.
  window.setTimeout(() => {
    if (!window.gsap || !window.ScrollTrigger) nativeRevealFallback();
  }, 1200);
})();
