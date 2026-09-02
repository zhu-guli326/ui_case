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
    const animatedElements = [outgoingFace, incomingFace, outgoingContent, incomingContent];

    gsap.killTweensOf([card, ...animatedElements]);
    front.style.transition = "none";
    back.style.transition = "none";

    gsap.set(card, {
      transformPerspective: 1100,
      transformOrigin: "50% 50%",
    });
    gsap.set(incomingFace, { opacity: 0.12 });
    gsap.set(incomingContent, {
      opacity: 0,
      y: 12,
      scale: 0.982,
      filter: "blur(4px)",
    });

    const timeline = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => finishFlip(card, front, back, animatedElements, moveFocus, flipped, gsap),
    });

    timeline
      .to(card, {
        y: -4,
        scale: 0.995,
        rotationY: direction * 2.5,
        duration: 0.15,
        ease: "power2.out",
      }, 0)
      .to(outgoingContent, {
        opacity: 0,
        y: -7,
        scale: 0.982,
        filter: "blur(3px)",
        duration: 0.22,
        ease: "power2.inOut",
      }, 0)
      .to(outgoingFace, {
        opacity: 0.1,
        duration: 0.22,
        ease: "power2.inOut",
      }, 0.02)
      .to(card, {
        scaleX: 0.982,
        rotationY: direction * 8,
        duration: 0.18,
        ease: "power2.inOut",
      }, 0.12)
      .call(() => {
        applyFaceState(card, flipped);
      }, null, 0.28)
      .to(card, {
        rotationY: direction * -2.6,
        scaleX: 1.004,
        scale: 1.006,
        duration: 0.22,
        ease: "power3.out",
      }, 0.28)
      .to(incomingFace, {
        opacity: 1,
        duration: 0.26,
        ease: "power2.out",
      }, 0.28)
      .to(incomingContent, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.34,
        ease: "power3.out",
      }, 0.31)
      .to(card, {
        y: 0,
        scale: 1,
        scaleX: 1,
        rotationY: 0,
        duration: 0.3,
        ease: "power3.out",
      }, 0.43);
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

// Capture on window so the polished transition owns flip clicks before the
// older delegated reliability handler runs on #entryGrid. Other controls keep
// their existing behavior because only flip targets/card surfaces are stopped.
window.addEventListener("click", handleFlipCapture, true);
loadGsap();
