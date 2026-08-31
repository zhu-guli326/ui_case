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

function toggleCard(card, { moveFocus = true } = {}) {
  if (!card || card.dataset.flipBusy === "true") return;
  card.dataset.flipBusy = "true";
  setCardFaceState(card, !card.classList.contains("is-flipped"), { moveFocus });
  window.setTimeout(() => {
    if (card.isConnected) delete card.dataset.flipBusy;
  }, 140);
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

function installPersistentCardInteractions() {
  const grid = document.querySelector("#entryGrid");
  if (!grid || grid.dataset.persistentCardInteractions === "true") return;
  grid.dataset.persistentCardInteractions = "true";

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
