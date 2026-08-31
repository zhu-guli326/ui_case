function syncCardFaces(card, flipped) {
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

  requestAnimationFrame(() => {
    const target = flipped
      ? back.querySelector(".entry-variant-back, [data-flip-card]")
      : front.querySelector(".entry-flip-tag, [data-flip-card]");
    target?.focus({ preventScroll: true });
  });
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

  // Cards are replaced whenever filters, search, language or favorites re-render
  // the grid. Capture-phase delegation keeps flip/state controls reliable without
  // depending on listeners attached to replaceable card nodes.
  grid.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const flipButton = event.target.closest("[data-flip-card]");
    if (flipButton && grid.contains(flipButton)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const card = flipButton.closest(".entry-card");
      if (!card) return;
      syncCardFaces(card, !card.classList.contains("is-flipped"));
      return;
    }

    const variantButton = event.target.closest("[data-variant-state]");
    if (variantButton && grid.contains(variantButton)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      syncVariantState(variantButton);
    }
  }, true);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", installPersistentCardInteractions, { once: true });
} else {
  installPersistentCardInteractions();
}
