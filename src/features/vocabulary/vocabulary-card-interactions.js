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

const GSAP_SRC = "https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const hintedEntryIds = new Set();
let gsapPromise = null;
let gsapInstance = window.gsap || null;

function loadGsap() {
  if (window.gsap) return Promise.resolve(window.gsap);
  if (gsapPromise) return gsapPromise;

  gsapPromise = new Promise((resolve) => {
    const existing = document.querySelector('script[data-vocabulary-gsap="true"]');
    const finish = () => {
      gsapInstance = window.gsap || null;
      resolve(gsapInstance);
    };

    if (existing) {
      existing.addEventListener("load", finish, { once: true });
      existing.addEventListener("error", () => resolve(null), { once: true });
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

function setCardFaceState(card, flipped, { moveFocus = true } = {}) {
  if (!card) return;
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

  if (!moveFocus) return;
  requestAnimationFrame(() => {
    const target = flipped
      ? back.querySelector(".entry-variant-back, [data-flip-card]")
      : front.querySelector(".entry-flip-tag, [data-flip-card]");
    target?.focus({ preventScroll: true });
  });
}

function finishCardMotion(card) {
  if (card?.isConnected) delete card.dataset.flipBusy;
}

function toggleCard(card, { moveFocus = true } = {}) {
  if (!card || card.dataset.flipBusy === "true") return;
  card.dataset.flipBusy = "true";

  const flipped = !card.classList.contains("is-flipped");
  const outgoing = card.querySelector(flipped ? ".entry-card-front .entry-card-body" : ".entry-card-back-shell");
  const incoming = card.querySelector(flipped ? ".entry-card-back-shell" : ".entry-card-front .entry-card-body");
  const gsap = gsapInstance || window.gsap;

  if (!gsap || reducedMotion.matches || !outgoing || !incoming) {
    setCardFaceState(card, flipped, { moveFocus });
    window.setTimeout(() => finishCardMotion(card), 140);
    return;
  }

  const direction = flipped ? 1 : -1;
  gsap.killTweensOf([card, outgoing, incoming]);

  const timeline = gsap.timeline({
    defaults: { overwrite: "auto" },
    onComplete: () => {
      gsap.set(card, { clearProps: "transform" });
      gsap.set([outgoing, incoming], { clearProps: "opacity,visibility,transform" });
      finishCardMotion(card);
      if (!moveFocus) return;
      requestAnimationFrame(() => {
        const target = flipped
          ? card.querySelector(".entry-card-back .entry-variant-back, .entry-card-back [data-flip-card]")
          : card.querySelector(".entry-card-front .entry-flip-tag, .entry-card-front [data-flip-card]");
        target?.focus({ preventScroll: true });
      });
    },
  });

  timeline
    .to(outgoing, {
      autoAlpha: 0.32,
      y: -4,
      scale: 0.99,
      duration: 0.13,
      ease: "power2.in",
    }, 0)
    .to(card, {
      y: -2,
      scale: 0.985,
      rotationY: direction * 7,
      transformPerspective: 900,
      duration: 0.15,
      ease: "power2.in",
    }, 0)
    .call(() => {
      setCardFaceState(card, flipped, { moveFocus: false });
      gsap.set(incoming, { autoAlpha: 0, y: 10, scale: 0.99 });
    })
    .to(card, {
      scale: 1.012,
      rotationY: direction * -2.5,
      duration: 0.18,
      ease: "power3.out",
    })
    .to(incoming, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: "power3.out",
    }, "<")
    .to(card, {
      y: 0,
      scale: 1,
      rotationY: 0,
      duration: 0.24,
      ease: "power3.out",
    }, "-=0.1");
}

function syncVariantState(button) {
  const panel = button.closest("[data-variant-panel]");
  if (!panel) return;

  const tone = [...button.classList]
    .find((name) => name.startsWith("is-") && name !== "is-active")
    ?.replace("is-", "") || "info";
  panel.dataset.variantTone = tone;
  panel.dataset.variantIndex = button.dataset.variantState || "0";

  panel.querySelectorAll("[data-variant-state]").forEach((item) => {
    const active = item === button;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", String(active));
  });

  const output = panel.querySelector("[data-variant-active]");
  if (output && button.dataset.variantCopy) output.textContent = button.dataset.variantCopy;
}

function decorateFlipTag(tag) {
  if (!tag || tag.dataset.motionDecorated === "true") return;
  tag.dataset.motionDecorated = "true";
  const labelText = tag.textContent.replace(/\s*↻\s*$/, "").trim();
  tag.textContent = "";

  const label = document.createElement("span");
  label.className = "entry-flip-tag-label";
  label.textContent = labelText;

  const icon = document.createElement("span");
  icon.className = "entry-flip-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "↻";

  tag.append(label, icon);
}

function decorateGridCards(grid) {
  grid.querySelectorAll(".entry-flip-tag").forEach(decorateFlipTag);
}

function hintClickableCards(grid) {
  const gsap = gsapInstance || window.gsap;
  if (!gsap || reducedMotion.matches) return;

  const cards = [...grid.querySelectorAll(".entry-card")].filter((card) => {
    const id = card.dataset.entryId;
    return id && !hintedEntryIds.has(id);
  }).slice(0, 6);

  cards.forEach((card, index) => {
    const id = card.dataset.entryId;
    const tag = card.querySelector(".entry-flip-tag");
    const icon = card.querySelector(".entry-flip-icon");
    if (!id || !tag || !icon) return;
    hintedEntryIds.add(id);
    card.classList.add("has-motion-affordance");

    const delay = 0.18 + index * 0.07;
    gsap.fromTo(card,
      { y: 5, rotationY: -1.4, transformPerspective: 900 },
      { y: 0, rotationY: 0, duration: 0.52, delay, ease: "power3.out", clearProps: "transform" },
    );
    gsap.fromTo(tag,
      { scale: 0.94, x: -3 },
      { scale: 1, x: 0, duration: 0.48, delay: delay + 0.08, ease: "back.out(2)", clearProps: "transform" },
    );
    gsap.fromTo(icon,
      { rotation: -24 },
      { rotation: 0, duration: 0.62, delay: delay + 0.12, ease: "back.out(2.2)", clearProps: "transform" },
    );
  });
}

function resetCardHover(card) {
  const gsap = gsapInstance || window.gsap;
  if (!gsap || reducedMotion.matches || !card) return;
  const icon = card.querySelector(".entry-flip-icon");
  gsap.to(card, {
    y: 0,
    scale: 1,
    rotationX: 0,
    rotationY: 0,
    duration: 0.34,
    ease: "power3.out",
    overwrite: "auto",
    clearProps: "transform",
  });
  if (icon) gsap.to(icon, { rotation: 0, x: 0, duration: 0.28, ease: "power3.out", overwrite: "auto", clearProps: "transform" });
}

function animateCardHover(card, event = null) {
  const gsap = gsapInstance || window.gsap;
  if (!gsap || reducedMotion.matches || !finePointer.matches || !card || card.dataset.flipBusy === "true") return;

  let rotationX = 0;
  let rotationY = 0;
  if (event instanceof PointerEvent) {
    const rect = card.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)) - 0.5;
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)) - 0.5;
    rotationY = x * 4;
    rotationX = y * -3;
  }

  gsap.to(card, {
    y: -6,
    scale: 1.008,
    rotationX,
    rotationY,
    transformPerspective: 900,
    duration: 0.28,
    ease: "power2.out",
    overwrite: "auto",
  });

  const icon = card.querySelector(".entry-flip-icon");
  if (icon) gsap.to(icon, { rotation: 14, x: 1, duration: 0.24, ease: "power2.out", overwrite: "auto" });
}

function installMotionAffordance(grid) {
  decorateGridCards(grid);
  loadGsap().then((gsap) => {
    if (!gsap || !grid.isConnected) return;
    gsapInstance = gsap;
    grid.classList.add("has-gsap-card-motion");
    decorateGridCards(grid);
    hintClickableCards(grid);
  });

  const observer = new MutationObserver(() => {
    decorateGridCards(grid);
    if (!gsapInstance || reducedMotion.matches) return;
    requestAnimationFrame(() => hintClickableCards(grid));
  });
  observer.observe(grid, { childList: true });

  grid.addEventListener("pointerover", (event) => {
    if (!(event.target instanceof Element)) return;
    const card = event.target.closest(".entry-card");
    if (!card || !grid.contains(card)) return;
    if (event.relatedTarget instanceof Node && card.contains(event.relatedTarget)) return;
    animateCardHover(card, event);
  });

  grid.addEventListener("pointermove", (event) => {
    if (!(event.target instanceof Element)) return;
    const card = event.target.closest(".entry-card");
    if (!card || !grid.contains(card)) return;
    animateCardHover(card, event);
  });

  grid.addEventListener("pointerout", (event) => {
    if (!(event.target instanceof Element)) return;
    const card = event.target.closest(".entry-card");
    if (!card || !grid.contains(card)) return;
    if (event.relatedTarget instanceof Node && card.contains(event.relatedTarget)) return;
    resetCardHover(card);
  });

  grid.addEventListener("focusin", (event) => {
    if (!(event.target instanceof Element)) return;
    const card = event.target.closest(".entry-card");
    if (!card || !grid.contains(card)) return;
    animateCardHover(card);
  });

  grid.addEventListener("focusout", (event) => {
    if (!(event.target instanceof Element)) return;
    const card = event.target.closest(".entry-card");
    if (!card || !grid.contains(card)) return;
    if (event.relatedTarget instanceof Node && card.contains(event.relatedTarget)) return;
    resetCardHover(card);
  });
}

function installPersistentCardInteractions() {
  const grid = document.querySelector("#entryGrid");
  if (!grid || grid.dataset.persistentCardInteractions === "true") return;
  grid.dataset.persistentCardInteractions = "true";
  installMotionAffordance(grid);

  // Cards are replaced whenever search, filters, favorites or language cause a
  // re-render. Keep all flip/state handling on the persistent grid so no card
  // can lose its interaction listeners after its DOM node is replaced.
  grid.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const card = event.target.closest(".entry-card");
    if (!card || !grid.contains(card)) return;

    const variantButton = event.target.closest("[data-variant-state]");
    if (variantButton && card.contains(variantButton)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      syncVariantState(variantButton);
      return;
    }

    const explicitFlip = event.target.closest("[data-flip-card]");
    if (explicitFlip && card.contains(explicitFlip)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      toggleCard(card);
      return;
    }

    // Copy, favorite and detail controls keep their existing dedicated actions.
    // They must never trigger a card flip as a side effect.
    if (event.target.closest(INTERACTIVE_SELECTOR)) return;

    // The visible card surface itself is also a reliable toggle target. This is
    // intentionally independent of the transparent hit-area so clicking the
    // preview, title or empty card space still works if browser hit-testing of
    // layered elements changes after a re-render.
    const visibleFace = card.classList.contains("is-flipped")
      ? event.target.closest(".entry-card-back")
      : event.target.closest(".entry-card-front");
    if (!visibleFace) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    toggleCard(card, { moveFocus: false });
  }, true);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", installPersistentCardInteractions, { once: true });
} else {
  installPersistentCardInteractions();
}
