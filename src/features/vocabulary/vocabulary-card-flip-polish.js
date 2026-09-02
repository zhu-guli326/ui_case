const GSAP_SRC = "https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "input",
  "select",
  "textarea",
  "label",
  "[contenteditable='true']",
  "[role='button']",
  "[data-copy-prompt]",
  "[data-term-detail]",
  "[data-favorite]",
  "[data-variant-state]",
].join(",");

let gsapPromise = null;

function loadGsap() {
  if (window.gsap) return Promise.resolve(window.gsap);
  if (gsapPromise) return gsapPromise;

  gsapPromise = new Promise((resolve) => {
    const existing = document.querySelector('script[data-vocabulary-gsap="true"]');
    const finish = () => resolve(window.gsap || null);

    if (existing) {
      if (window.gsap) finish();
      else {
        existing.addEventListener("load", finish, { once: true });
        existing.addEventListener("error", () => resolve(null), { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.src = GSAP_SRC;
    script.async = true;
    script.dataset.vocabularyGsap = "true";
    script.addEventListener("load", finish, { once: true });
    script.addEventListener("error", () => resolve(null), { once: true });
    document.head.append(script);
  });

  return gsapPromise;
}

function applyFaceState(card, flipped) {
  const front = card.querySelector(".entry-card-front");
  const back = card.querySelector(".entry-card-back");
  if (!front || !back) return;

  card.classList.toggle("is-flipped", flipped);
  front.setAttribute("aria-hidden", String(flipped));
  back.setAttribute("aria-hidden", String(!flipped));
  front.toggleAttribute("inert", flipped);
  back.toggleAttribute("inert", !flipped);
  card.querySelectorAll("[data-flip-card]").forEach((button) => {
    button.setAttribute("aria-pressed", String(flipped));
  });
}

function focusVisibleFlipControl(card, flipped) {
  requestAnimationFrame(() => {
    const target = flipped
      ? card.querySelector(".entry-card-back .entry-variant-back, .entry-card-back [data-flip-card]")
      : card.querySelector(".entry-card-front .entry-flip-tag, .entry-card-front [data-flip-card]");
    target?.focus({ preventScroll: true });
  });
}

function finishFlip(card, front, back, elements, moveFocus, flipped, gsap) {
  front.style.transition = "";
  back.style.transition = "";
  gsap.set(elements, { clearProps: "opacity,visibility,transform,filter" });
  gsap.set(card, { clearProps: "transform,transformOrigin" });
  delete card.dataset.flipBusy;
  if (moveFocus) focusVisibleFlipControl(card, flipped);
}

function smoothFlip(card, { moveFocus = true } = {}) {
  if (!card || card.dataset.flipBusy === "true") return;
  card.dataset.flipBusy = "true";

  const flipped = !card.classList.contains("is-flipped");
  const front = card.querySelector(".entry-card-front");
  const back = card.querySelector(".entry-card-back");
  const outgoingFace = flipped ? front : back;
  const incomingFace = flipped ? back : front;
  const outgoingContent = flipped
    ? card.querySelector(".entry-card-front .entry-card-body")
    : card.querySelector(".entry-card-back .entry-card-back-shell");
  const incomingContent = flipped
    ? card.querySelector(".entry-card-back .entry-card-back-shell")
    : card.querySelector(".entry-card-front .entry-card-body");

  if (!front || !back || !outgoingFace || !incomingFace || !outgoingContent || !incomingContent) {
    applyFaceState(card, flipped);
    delete card.dataset.flipBusy;
    if (moveFocus) focusVisibleFlipControl(card, flipped);
    return;
  }

  if (reducedMotion.matches) {
    applyFaceState(card, flipped);
    delete card.dataset.flipBusy;
    if (moveFocus) focusVisibleFlipControl(card, flipped);
    return;
  }

  loadGsap().then((gsap) => {
    if (!gsap || !card.isConnected) {
      applyFaceState(card, flipped);
      delete card.dataset.flipBusy;
      if (moveFocus) focusVisibleFlipControl(card, flipped);
      return;
    }

    const direction = flipped ? 1 : -1;
    const edgeAngle = 82;
    const animatedElements = [outgoingFace, incomingFace, outgoingContent, incomingContent];

    gsap.killTweensOf([card, ...animatedElements]);
    front.style.transition = "none";
    back.style.transition = "none";

    gsap.set(card, {
      transformPerspective: 1200,
      transformOrigin: "50% 50%",
      rotationY: 0,
      rotationX: 0,
    });
    gsap.set(outgoingFace, { opacity: 1 });
    gsap.set(incomingFace, { opacity: 1 });
    gsap.set(incomingContent, {
      opacity: 0.72,
      x: direction * 10,
      scale: 0.992,
      filter: "blur(1.5px)",
    });

    const timeline = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => finishFlip(card, front, back, animatedElements, moveFocus, flipped, gsap),
    });

    timeline
      .to(card, {
        y: -5,
        scale: 0.992,
        rotationY: direction * edgeAngle,
        duration: 0.3,
        ease: "power2.in",
      }, 0)
      .to(outgoingContent, {
        opacity: 0.72,
        x: direction * -10,
        scale: 0.992,
        filter: "blur(1.5px)",
        duration: 0.24,
        ease: "power2.in",
      }, 0.04)
      .call(() => {
        applyFaceState(card, flipped);
        gsap.set(card, {
          rotationY: direction * -edgeAngle,
          y: -5,
          scale: 0.992,
        });
        gsap.set(incomingContent, {
          opacity: 0.72,
          x: direction * 10,
          scale: 0.992,
          filter: "blur(1.5px)",
        });
      }, null, 0.3)
      .to(card, {
        y: 0,
        scale: 1,
        rotationY: 0,
        duration: 0.38,
        ease: "power3.out",
      }, 0.3)
      .to(incomingContent, {
        opacity: 1,
        x: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.32,
        ease: "power3.out",
      }, 0.34)
      .to(card, {
        scale: 1.008,
        duration: 0.12,
        ease: "power2.out",
      }, 0.55)
      .to(card, {
        scale: 1,
        duration: 0.16,
        ease: "power3.out",
      }, 0.64);
  });
}

function shouldFlipFromSurface(card, target) {
  if (target.closest(INTERACTIVE_SELECTOR)) return false;
  return card.classList.contains("is-flipped")
    ? Boolean(target.closest(".entry-card-back"))
    : Boolean(target.closest(".entry-card-front"));
}

function handleFlipCapture(event) {
  if (!(event.target instanceof Element)) return;

  const grid = document.querySelector("#entryGrid");
  if (!grid) return;

  const card = event.target.closest(".entry-card");
  if (!card || !grid.contains(card)) return;

  const explicitFlip = event.target.closest("[data-flip-card]");
  const surfaceFlip = !explicitFlip && shouldFlipFromSurface(card, event.target);
  if (!explicitFlip && !surfaceFlip) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  if (card.dataset.flipBusy === "true") return;
  smoothFlip(card, { moveFocus: Boolean(explicitFlip) });
}

// Capture on window so this transition owns flip clicks before the persistent
// grid handler. The card still switches its real front/back state at the
// edge-on midpoint, preserving reliable hit testing while making the visual
// rotation read as a true card flip.
window.addEventListener("click", handleFlipCapture, true);
loadGsap();
