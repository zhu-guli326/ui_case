const header = document.querySelector("[data-header]");

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const promoBar = document.querySelector(".promo-bar");
const promoDismiss = promoBar?.querySelector("button");

promoDismiss?.addEventListener("click", () => {
  promoBar.hidden = true;
  document.body.classList.add("promo-dismissed");
});

const pillRow = document.querySelector(".pill-row");
const templateGrid = document.querySelector(".template-grid");
const templateCards = [...document.querySelectorAll(".template-grid .image-card")];
const templateSets = {
  popular: [
    ["Architecture", "Quiet rooms for ambitious work.", "architecture.webp"],
    ["Agency", "Launch a studio site in one evening.", "workspace.webp"],
    ["Editorial", "Let the imagery carry the sentence.", "flowers.webp"]
  ],
  portfolio: [
    ["Photography", "A frame for every point of view.", "travel.webp"],
    ["Art direction", "Turn a body of work into a world.", "editorial.webp"],
    ["Studio", "Make the work impossible to overlook.", "barber-portrait.webp"]
  ],
  store: [
    ["Objects", "A quiet storefront for considered goods.", "objects.webp"],
    ["Food", "Sell the story before the first bite.", "restaurant.webp"],
    ["Botanical", "A shop that feels carefully cultivated.", "flowers.webp"]
  ],
  services: [
    ["Architecture", "Turn expertise into a clear invitation.", "architecture.webp"],
    ["Consulting", "Give complex work a simple front door.", "workspace.webp"],
    ["Hospitality", "Let every detail make the welcome.", "restaurant.webp"]
  ],
  blog: [
    ["Journal", "Build an archive worth returning to.", "editorial.webp"],
    ["Culture", "Give every story room to breathe.", "travel.webp"],
    ["Ideas", "A flexible home for unfinished thinking.", "workspace.webp"]
  ]
};

function positionPillIndicator(pill) {
  if (!pillRow || !pill) return;
  pillRow.style.setProperty("--pill-left", `${pill.offsetLeft}px`);
  pillRow.style.setProperty("--pill-width", `${pill.offsetWidth}px`);
  pillRow.style.setProperty("--pill-height", `${pill.offsetHeight}px`);
}

function showTemplateSet(name) {
  const set = templateSets[name];
  if (!set || !templateGrid) return;
  templateGrid.classList.add("is-switching");

  window.setTimeout(() => {
    templateCards.forEach((card, index) => {
      const [label, title, assetName] = set[index];
      const image = card.querySelector("img");
      image.src = `assets/${assetName}`;
      image.alt = `${label} website template preview`;
      card.querySelector("span").textContent = label;
      card.querySelector("h3").textContent = title;
    });
    templateGrid.classList.remove("is-switching");
  }, 190);
}

document.querySelectorAll(".pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".pill").forEach((item) => item.classList.remove("active"));
    pill.classList.add("active");
    positionPillIndicator(pill);
    showTemplateSet(pill.dataset.templateFilter);
    pill.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  });
});

positionPillIndicator(document.querySelector(".pill.active"));
window.addEventListener("resize", () => positionPillIndicator(document.querySelector(".pill.active")));

if (pillRow) {
  let tagDragging = false;
  let tagMoved = false;
  let tagStartX = 0;
  let tagStartScroll = 0;

  pillRow.addEventListener("pointerdown", (event) => {
    tagDragging = true;
    tagMoved = false;
    tagStartX = event.clientX;
    tagStartScroll = pillRow.scrollLeft;
    pillRow.classList.add("is-dragging");
  });

  pillRow.addEventListener("pointermove", (event) => {
    if (!tagDragging) return;
    const distance = event.clientX - tagStartX;
    if (Math.abs(distance) > 4) tagMoved = true;
    pillRow.scrollLeft = tagStartScroll - distance;
  });

  const stopTagDrag = () => {
    tagDragging = false;
    pillRow.classList.remove("is-dragging");
  };

  pillRow.addEventListener("pointerup", stopTagDrag);
  pillRow.addEventListener("pointercancel", stopTagDrag);
  pillRow.addEventListener("click", (event) => {
    if (tagMoved) event.preventDefault();
    tagMoved = false;
  }, true);
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.querySelectorAll("[data-card-rail]").forEach((rail) => {
  const track = rail.querySelector(".multi-card-track");
  const originalCards = [...track.children];
  const direction = Number(rail.dataset.direction || 1);
  let paused = false;
  let dragging = false;
  let startX = 0;
  let startScroll = 0;
  let previousTime = performance.now();

  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });

  const halfWidth = () => track.scrollWidth / 2;

  if (direction < 0) {
    requestAnimationFrame(() => {
      rail.scrollLeft = halfWidth();
    });
  }

  function animate(time) {
    const delta = Math.min(time - previousTime, 32);
    previousTime = time;

    if (!paused && !dragging && !prefersReducedMotion.matches) {
      rail.scrollLeft += direction * delta * 0.035;
      const midpoint = halfWidth();

      if (direction > 0 && rail.scrollLeft >= midpoint) {
        rail.scrollLeft -= midpoint;
      } else if (direction < 0 && rail.scrollLeft <= 0) {
        rail.scrollLeft += midpoint;
      }
    }

    requestAnimationFrame(animate);
  }

  rail.addEventListener("pointerdown", (event) => {
    dragging = true;
    startX = event.clientX;
    startScroll = rail.scrollLeft;
    rail.classList.add("is-dragging");
    rail.setPointerCapture(event.pointerId);
  });

  rail.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    rail.scrollLeft = startScroll - (event.clientX - startX);
  });

  function stopDragging(event) {
    if (!dragging) return;
    dragging = false;
    rail.classList.remove("is-dragging");
    if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
  }

  rail.addEventListener("pointerup", stopDragging);
  rail.addEventListener("pointercancel", stopDragging);
  rail.addEventListener("mouseenter", () => { paused = true; });
  rail.addEventListener("mouseleave", () => { paused = false; });

  requestAnimationFrame(animate);
});
