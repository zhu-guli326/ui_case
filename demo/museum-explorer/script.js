const panel = document.querySelector(".detail-panel");
const scrim = document.querySelector(".scrim");
const closeButton = document.querySelector(".close-button");
const toast = document.querySelector(".toast");
const detailTitle = document.querySelector("#detail-title");
const detailArt = document.querySelector(".detail-art img");
const detailArtist = document.querySelector(".artist");
const detailDescription = document.querySelector(".detail-description");
let toastTimer;

const artwork = {
  modern: {
    title: "Modern Visions",
    artist: "Mar 20 - Jul 28 · Level 2, East",
    description: "A generous introduction to artists who used color, rhythm, and an everyday view to create something entirely new.",
    image: "./assets/starry-night.svg",
  },
  starry: {
    title: "The Starry Night",
    artist: "Vincent van Gogh · 1889",
    description: "A familiar scene made strange and luminous: movement, memory, and the sensation of looking after dark.",
    image: "./assets/starry-night.svg",
  },
  memory: {
    title: "The Persistence of Memory",
    artist: "Salvador Dali · 1931",
    description: "An elastic, sunlit landscape where time itself seems to lose its usual shape.",
    image: "./assets/memory.svg",
  },
  pearl: {
    title: "Girl with a Pearl Earring",
    artist: "Johannes Vermeer · c. 1665",
    description: "A quiet exchange of light, color, and attention. Look at the blue of the headscarf, then return to the gaze.",
    image: "./assets/pearl.svg",
  },
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function openPanel(key) {
  const item = artwork[key];
  if (!item) return;
  detailTitle.textContent = item.title;
  detailArtist.textContent = item.artist;
  detailDescription.textContent = item.description;
  detailArt.src = item.image;
  detailArt.alt = item.title;
  panel.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
  scrim.hidden = false;
  closeButton.focus();
}

function closePanel() {
  panel.classList.remove("is-open");
  panel.setAttribute("aria-hidden", "true");
  scrim.hidden = true;
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.openDetail) {
    openPanel(button.dataset.openDetail);
    return;
  }

  if (button.dataset.day) {
    document.querySelectorAll(".day-picker button").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    showToast(`${button.dataset.day} program selected`);
    return;
  }

  if (button.dataset.filter) {
    document.querySelectorAll(".filter").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    document.querySelectorAll(".work-card").forEach((card) => {
      card.classList.toggle("is-filtered", button.dataset.filter !== "All" && card.dataset.category !== button.dataset.filter);
    });
    return;
  }

  if (button.dataset.save) {
    const saved = button.classList.toggle("is-saved");
    button.textContent = saved ? "Saved" : "Save";
    showToast(saved ? `${button.dataset.save} saved` : `${button.dataset.save} removed`);
    return;
  }

  if (button.dataset.message) showToast(button.dataset.message);
});

closeButton.addEventListener("click", closePanel);
scrim.addEventListener("click", closePanel);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && panel.classList.contains("is-open")) closePanel();
});
