(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  const init = (attempt = 0) => {
    const workflow = document.querySelector("[data-workflow-explorer]");
    const poster = workflow?.querySelector("[data-workflow-poster]");
    if (!workflow || !poster) return;
    if (!window.gsap) {
      if (attempt < 180) requestAnimationFrame(() => init(attempt + 1));
      return;
    }
    if (poster.dataset.workflowCardEffect === "true") return;
    poster.dataset.workflowCardEffect = "true";

    const { gsap } = window;
    let frame = 0;
    let rect = null;

    gsap.set(poster, {
      transformPerspective: 1100,
      transformOrigin: "50% 50%",
      force3D: true,
    });

    const reset = () => {
      cancelAnimationFrame(frame);
      rect = null;
      poster.classList.remove("is-tilting");
      poster.style.setProperty("--pointer-x", "50%");
      poster.style.setProperty("--pointer-y", "50%");
      frame = requestAnimationFrame(() => {
        gsap.to(poster, {
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          y: 0,
          boxShadow: "0 24px 54px rgba(0, 0, 0, .11)",
          duration: 0.72,
          ease: "power3.out",
          overwrite: "auto",
        });
      });
    };

    workflow.addEventListener("pointermove", (event) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      if (!(event.target instanceof Element) || !event.target.closest("[data-workflow-poster]")) return;

      rect ||= poster.getBoundingClientRect();
      const px = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(rect.width, 1)));
      const py = Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(rect.height, 1)));

      poster.classList.add("is-tilting");
      poster.style.setProperty("--pointer-x", `${px * 100}%`);
      poster.style.setProperty("--pointer-y", `${py * 100}%`);

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        gsap.to(poster, {
          rotationY: (px - 0.5) * 8,
          rotationX: (0.5 - py) * 6,
          scale: 1.018,
          y: -6,
          boxShadow: "0 34px 72px rgba(0, 0, 0, .16)",
          duration: 0.24,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    }, true);

    workflow.addEventListener("pointerout", (event) => {
      if (!(event.target instanceof Element) || !event.target.closest("[data-workflow-poster]")) return;
      if (event.relatedTarget instanceof Node && poster.contains(event.relatedTarget)) return;
      reset();
    }, true);

    reducedMotion.addEventListener?.("change", reset);
    finePointer.addEventListener?.("change", reset);
    window.addEventListener("resize", () => { rect = null; });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => init(), { once: true });
  } else {
    init();
  }
})();
