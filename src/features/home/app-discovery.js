(() => {
  const APP_DISCOVERY_ASSETS = [
    { src: "./assets/home/discovery/app-1.png", alt: "FuFu Bakery App interface" },
    { src: "./assets/home/discovery/app-2.png", alt: "FitHub fitness App interface" },
    { src: "./assets/home/discovery/app-3.png", alt: "Cook smarter recipe App interface" },
    { src: "./assets/home/discovery/app-4.png", alt: "Purple health App interface" },
  ];

  function mountAppDiscovery() {
    const card = document.querySelector("#templates .template-grid .template-card:nth-child(1)");
    if (!card || card.querySelector(":scope > .app-discovery-grid")) return;

    card.classList.add("app-discovery-host");

    const grid = document.createElement("ul");
    grid.className = "app-discovery-grid";
    grid.setAttribute("aria-label", "App design references");

    APP_DISCOVERY_ASSETS.forEach(({ src, alt }) => {
      const item = document.createElement("li");
      item.className = "app-discovery-item";

      const image = document.createElement("img");
      image.src = src;
      image.alt = alt;
      image.loading = "lazy";
      image.decoding = "async";
      image.draggable = false;

      item.append(image);
      grid.append(item);
    });

    card.append(grid);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountAppDiscovery, { once: true });
  } else {
    mountAppDiscovery();
  }
})();
