// The spotlight is one curated exhibit. It reads the same filtered catalog as
// the wall, keeps the selected case across renders, and never auto-advances.

const FOCUS_KEY = "ondesign-library-focus";

export function createLibrarySpotlight({
  host,
  localizeRecord,
  getPreviewScreens,
  openPreview,
  getCopy
}) {
  if (!host) return { render() {} };

  const pad = (value) => String(value).padStart(2, "0");
  const isEnglish = () => (window.image2I18n?.language || document.documentElement.lang || "zh").toLowerCase().startsWith("en");
  const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  let guides = [];
  let selectedId = "";
  let paintedId = "";
  let paintToken = 0;
  let swipe = null;
  let suppressClickUntil = 0;

  try {
    selectedId = sessionStorage.getItem(FOCUS_KEY) || "";
  } catch {
    selectedId = "";
  }

  host.innerHTML = `
    <div class="spotlight-stage" tabindex="0" role="region" aria-roledescription="carousel">
      <span class="spotlight-word" aria-hidden="true"></span>
      <div class="spotlight-copy">
        <p class="spotlight-kicker"><i aria-hidden="true"></i><span class="spotlight-kicker-label"></span></p>
        <h2></h2>
        <p class="spotlight-summary"></p>
        <div class="spotlight-meta"></div>
        <div class="spotlight-actions">
          <button class="spotlight-primary" type="button"></button>
          <a class="spotlight-browse" href="#caseWall"></a>
        </div>
      </div>
      <div class="spotlight-visual">
        <button class="spotlight-phone is-left" type="button" data-screen="1"><span class="phone-frame"><span class="phone-screen"><img class="phone-media" alt="" decoding="async"></span></span></button>
        <button class="spotlight-phone is-main" type="button" data-screen="0"><span class="phone-frame"><span class="phone-screen"><img class="phone-media" alt="" decoding="async"></span></span></button>
        <button class="spotlight-phone is-right" type="button" data-screen="2"><span class="phone-frame"><span class="phone-screen"><img class="phone-media" alt="" decoding="async"></span></span></button>
        <p class="spotlight-unavailable" hidden></p>
      </div>
      <div class="spotlight-controls">
        <button class="spotlight-step" type="button" data-step="-1">&#8592;</button>
        <div class="spotlight-progress">
          <span class="spotlight-count" role="status" aria-live="polite"></span>
          <span class="spotlight-track"><i></i></span>
        </div>
        <button class="spotlight-step" type="button" data-step="1">&#8594;</button>
      </div>
    </div>`;

  const stage = host.querySelector(".spotlight-stage");
  const word = host.querySelector(".spotlight-word");
  const copyEl = host.querySelector(".spotlight-copy");
  const kicker = host.querySelector(".spotlight-kicker-label");
  const title = host.querySelector(".spotlight-copy h2");
  const summary = host.querySelector(".spotlight-summary");
  const meta = host.querySelector(".spotlight-meta");
  const primary = host.querySelector(".spotlight-primary");
  const browse = host.querySelector(".spotlight-browse");
  const visual = host.querySelector(".spotlight-visual");
  const unavailable = host.querySelector(".spotlight-unavailable");
  const counter = host.querySelector(".spotlight-count");
  const progress = host.querySelector(".spotlight-track i");
  const phones = [...host.querySelectorAll(".spotlight-phone")];
  const stepButtons = [...host.querySelectorAll("[data-step]")];

  function screenLabel(screen) {
    if (!screen?.label) return "";
    return isEnglish() ? (screen.label.en || screen.label.zh || "") : (screen.label.zh || screen.label.en || "");
  }

  function paintScreens(source, guide, copy) {
    const token = ++paintToken;
    const screens = (getPreviewScreens(source) || []).slice(0, 3);
    visual.classList.toggle("is-empty", screens.length === 0);
    unavailable.hidden = screens.length !== 0;

    phones.forEach((button) => {
      const index = Number(button.dataset.screen);
      const screen = screens[index];
      const image = button.querySelector("img");
      button.hidden = !screen;
      if (!screen) return;

      button.classList.remove("is-missing");
      button.setAttribute("aria-label", `${copy.openPreview}: ${guide.style}${screenLabel(screen) ? ` — ${screenLabel(screen)}` : ""}`);

      if (image.getAttribute("src") === screen.src) return;

      const pending = new Image();
      pending.src = screen.src;
      const apply = () => {
        if (token !== paintToken) return;
        image.src = screen.src;
        image.alt = `${guide.name} — ${guide.style}`;
      };
      if (typeof pending.decode === "function") {
        pending.decode().then(apply).catch(() => {
          if (token !== paintToken) return;
          button.classList.add("is-missing");
          if (index === 0) {
            unavailable.hidden = false;
            unavailable.textContent = copy.spotlightUnavailable;
          }
        });
      } else {
        pending.addEventListener("load", apply, { once: true });
        pending.addEventListener("error", () => button.classList.add("is-missing"), { once: true });
      }
    });

    if (!screens.length) unavailable.textContent = copy.spotlightUnavailable;
  }

  function paint() {
    if (!guides.length) {
      host.hidden = true;
      return;
    }

    host.hidden = false;
    let index = guides.findIndex((guide) => guide.id === selectedId);
    if (index < 0) index = 0;
    const source = guides[index];
    const guide = localizeRecord(source);
    const copy = getCopy();

    selectedId = source.id;
    try {
      sessionStorage.setItem(FOCUS_KEY, selectedId);
    } catch {
      // Storage may be unavailable in private contexts; the stage still works.
    }

    const changed = paintedId && paintedId !== selectedId;
    paintedId = selectedId;

    stage.dataset.focusedCase = selectedId;
    stage.style.setProperty("--spot-tint", source.preview || "#e7e8e2");
    stage.setAttribute("aria-label", `${copy.spotlightLabel}: ${guide.style}`);
    stage.setAttribute("aria-busy", "false");

    word.textContent = guide.name;
    kicker.textContent = `${copy.inFocus} / ${guide.name}`;
    title.textContent = guide.style;
    summary.textContent = guide.summary;
    browse.textContent = copy.browseWall;

    meta.replaceChildren();
    const facts = [copy.categories[source.category], (guide.bestFor || "").split(/[、,]/)[0].trim()].filter(Boolean);
    for (const fact of facts) {
      const chip = document.createElement("span");
      chip.textContent = fact;
      meta.append(chip);
    }

    const openLabel = guide.liveDemo ? copy.spotlightOpen : copy.spotlightDetails;
    primary.textContent = openLabel;
    primary.setAttribute("aria-label", `${openLabel}: ${guide.style}`);

    stepButtons.forEach((button) => {
      button.disabled = guides.length < 2;
      const direction = Number(button.dataset.step) < 0;
      button.setAttribute("aria-label", direction ? copy.previousCase : copy.nextCase);
    });

    counter.textContent = `${pad(index + 1)} / ${pad(guides.length)}`;
    progress.style.width = `${((index + 1) / guides.length) * 100}%`;

    paintScreens(source, guide, copy);

    if (changed && !reducedMotion()) {
      copyEl.animate(
        [{ opacity: .3, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }],
        { duration: 320, easing: "cubic-bezier(.2,.7,.2,1)" }
      );
      visual.animate(
        [{ opacity: .55, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }],
        { duration: 360, easing: "cubic-bezier(.2,.7,.2,1)" }
      );
    }
  }

  function step(delta) {
    if (guides.length < 2) return;
    const index = Math.max(0, guides.findIndex((guide) => guide.id === selectedId));
    selectedId = guides[(index + delta + guides.length) % guides.length].id;
    paint();
  }

  function selectAt(index) {
    if (!guides[index]) return;
    selectedId = guides[index].id;
    paint();
  }

  primary.addEventListener("click", () => {
    if (Date.now() < suppressClickUntil) return;
    if (selectedId) openPreview(selectedId);
  });

  phones.forEach((button) => button.addEventListener("click", () => {
    if (Date.now() < suppressClickUntil) return;
    if (selectedId) openPreview(selectedId);
  }));

  stepButtons.forEach((button) => button.addEventListener("click", () => step(Number(button.dataset.step))));

  stage.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectAt(0);
    } else if (event.key === "End") {
      event.preventDefault();
      selectAt(guides.length - 1);
    }
  });

  stage.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse") return;
    swipe = { x: event.clientX, y: event.clientY };
  });

  stage.addEventListener("pointerup", (event) => {
    if (!swipe) return;
    const dx = event.clientX - swipe.x;
    const dy = event.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) {
      suppressClickUntil = Date.now() + 400;
      step(dx < 0 ? 1 : -1);
    }
  });

  stage.addEventListener("pointercancel", () => {
    swipe = null;
  });

  stage.addEventListener("click", (event) => {
    if (Date.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  return {
    render(nextGuides) {
      guides = nextGuides || [];
      if (!guides.length) {
        host.hidden = true;
        return;
      }
      if (!guides.some((guide) => guide.id === selectedId)) selectedId = guides[0].id;
      paint();
    }
  };
}
