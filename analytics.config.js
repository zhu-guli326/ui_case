window.IMAGE2_ANALYTICS = {
  enabled: true,
  endpoint: "/api/analytics/events",
  site: "image2-ui-library"
};

// Learn page chapter rail: keep it fixed on the right, remove the card shell,
// and make the progress dots grow toward the active chapter, then shrink away.
if (/\/learn\.html$/.test(location.pathname)) {
  const railStyle = document.createElement("style");
  railStyle.id = "learn-right-center-rail-hotfix";
  railStyle.textContent = `
    @media (min-width: 981px) {
      .chapter-nav {
        position: fixed !important;
        top: 50% !important;
        right: 28px !important;
        left: auto !important;
        bottom: auto !important;
        transform: translateY(-50%) !important;
        z-index: 80 !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-end !important;
        gap: 7px !important;
        width: auto !important;
        min-height: 0 !important;
        padding: 0 !important;
        overflow: visible !important;
        border: 0 !important;
        border-radius: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      .chapter-nav a {
        display: grid !important;
        grid-template-columns: minmax(0,1fr) 20px !important;
        align-items: center !important;
        gap: 11px !important;
        width: 118px !important;
        min-height: 30px !important;
        padding: 0 !important;
        border: 0 !important;
        border-radius: 0 !important;
        background: transparent !important;
        color: #a4aaa6 !important;
        font-size: 11px !important;
        letter-spacing: .025em !important;
        text-decoration: none !important;
        white-space: nowrap !important;
        opacity: .62 !important;
        transform: none !important;
        transition: color .2s ease, opacity .2s ease, transform .2s ease, font-size .2s ease !important;
      }

      .chapter-nav a:hover {
        color: #59615b !important;
        opacity: .95 !important;
        background: transparent !important;
        transform: translateX(-2px) !important;
      }

      .chapter-nav a b {
        grid-column: 1 !important;
        grid-row: 1 !important;
        justify-self: end !important;
        font-weight: 720 !important;
      }

      .chapter-nav a span {
        grid-column: 2 !important;
        grid-row: 1 !important;
        justify-self: center !important;
        display: block !important;
        width: 5px !important;
        height: 5px !important;
        padding: 0 !important;
        border-radius: 50% !important;
        background: #a7adaa !important;
        color: transparent !important;
        font-size: 0 !important;
        line-height: 0 !important;
        opacity: 1 !important;
        box-shadow: none !important;
        transition: width .22s ease, height .22s ease, background .22s ease, box-shadow .22s ease, opacity .22s ease !important;
      }

      /* Far → near → active → near → far = small → large → small. */
      .chapter-nav a.rail-near-2 {
        opacity: .72 !important;
        font-size: 11.5px !important;
      }
      .chapter-nav a.rail-near-2 span {
        width: 7px !important;
        height: 7px !important;
      }

      .chapter-nav a.rail-near-1 {
        color: #7d8580 !important;
        opacity: .86 !important;
        font-size: 12px !important;
      }
      .chapter-nav a.rail-near-1 span {
        width: 10px !important;
        height: 10px !important;
        background: #8f9792 !important;
      }

      .chapter-nav a.is-current {
        color: #0b6b3b !important;
        opacity: 1 !important;
        font-size: 13px !important;
        background: transparent !important;
        transform: none !important;
      }
      .chapter-nav a.is-current b {
        font-weight: 820 !important;
      }
      .chapter-nav a.is-current span {
        width: 17px !important;
        height: 17px !important;
        background: #0b6b3b !important;
        box-shadow: 0 0 0 5px rgba(11,107,59,.12) !important;
      }
    }
  `;
  document.head.appendChild(railStyle);

  const setupRailScale = () => {
    const nav = document.querySelector(".chapter-nav");
    if (!nav) return;
    const links = [...nav.querySelectorAll("a")];
    let lastActiveIndex = -2;

    const syncRailScale = () => {
      const activeIndex = links.findIndex((link) => link.classList.contains("is-current"));
      if (activeIndex === lastActiveIndex) return;
      lastActiveIndex = activeIndex;

      links.forEach((link, index) => {
        link.classList.remove("rail-near-1", "rail-near-2");
        if (activeIndex < 0) return;
        const distance = Math.abs(index - activeIndex);
        if (distance === 1) link.classList.add("rail-near-1");
        if (distance === 2) link.classList.add("rail-near-2");
      });
    };

    syncRailScale();
    new MutationObserver(syncRailScale).observe(nav, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class"]
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupRailScale, { once: true });
  } else {
    setupRailScale();
  }
}
