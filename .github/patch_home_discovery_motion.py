from pathlib import Path

js_path = Path("src/features/home/home.js")
js = js_path.read_text(encoding="utf-8")

old = '''function animateDiscoveryCard(card) {
  if (!card || !window.gsap || reducedMotion.matches) return;
  const image = card.querySelector("img");
  window.gsap.fromTo(
    card,
    { autoAlpha: 0, scale: .965, filter: "blur(10px)" },
    { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: .62, ease: "power3.out", clearProps: "opacity,visibility,transform,filter" },
  );
  if (image) {
    window.gsap.fromTo(image, { scale: 1.055 }, { scale: 1, duration: .8, ease: "power3.out", clearProps: "transform" });
  }
}
'''

new = '''const MULTI_DISCOVERY_INDEXES = new Set([0, 2, 3]);
const discoveryTileMotionBound = new WeakSet();

function discoveryVisualTiles(card) {
  if (!card) return [];
  const index = discoveryCards.indexOf(card);
  if (!MULTI_DISCOVERY_INDEXES.has(index)) return [];
  return [...card.children].filter((child) => child.matches("img, .template-card-shade, small, div"));
}

function animateDiscoveryTiles(card, { scrollTrigger = null } = {}) {
  if (!card || !window.gsap || reducedMotion.matches) return false;
  const tiles = discoveryVisualTiles(card);
  if (tiles.length < 2) return false;

  const { gsap } = window;
  gsap.killTweensOf([card, ...tiles]);
  gsap.set(card, { autoAlpha: 1, scale: 1, filter: "none" });
  gsap.fromTo(
    tiles,
    {
      autoAlpha: 0,
      y: 64,
      z: -24,
      scale: .9,
      rotationX: 9,
      rotationY: (index) => (index % 2 === 0 ? -7 : 7),
      rotationZ: (index) => (index - 1.5) * 2.2,
      transformPerspective: 860,
      transformOrigin: "50% 60%",
    },
    {
      autoAlpha: 1,
      y: 0,
      z: 0,
      scale: 1,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      duration: .78,
      stagger: .09,
      ease: "back.out(1.45)",
      clearProps: "opacity,visibility,transform",
      ...(scrollTrigger ? { scrollTrigger } : {}),
    },
  );
  return true;
}

function initDiscoveryTileMotion(card) {
  const tiles = discoveryVisualTiles(card);
  if (tiles.length < 2) return;

  const canMove = () => finePointer.matches && !reducedMotion.matches && Boolean(window.gsap);
  tiles.forEach((tile, index) => {
    if (discoveryTileMotionBound.has(tile)) return;
    discoveryTileMotionBound.add(tile);

    const siblings = tiles.filter((item) => item !== tile);
    tile.addEventListener("pointerenter", () => {
      if (!canMove()) return;
      const { gsap } = window;
      gsap.killTweensOf(tiles);
      gsap.to(siblings, {
        autoAlpha: .72,
        y: 8,
        scale: .972,
        duration: .28,
        stagger: .018,
        ease: "power2.out",
      });
      gsap.to(tile, {
        y: -16,
        z: 54,
        scale: 1.045,
        rotationZ: (index - 1.5) * .35,
        boxShadow: "0 28px 58px rgba(0,0,0,.16)",
        transformPerspective: 760,
        duration: .34,
        ease: "power3.out",
      });
    });

    tile.addEventListener("pointermove", (event) => {
      if (!canMove()) return;
      const rect = tile.getBoundingClientRect();
      const px = (event.clientX - rect.left) / Math.max(rect.width, 1) - .5;
      const py = (event.clientY - rect.top) / Math.max(rect.height, 1) - .5;
      window.gsap.to(tile, {
        rotationY: px * 10,
        rotationX: py * -8,
        duration: .2,
        ease: "power2.out",
        overwrite: "auto",
      });
    });

    tile.addEventListener("pointerleave", () => {
      if (!canMove()) return;
      const { gsap } = window;
      gsap.to(tile, {
        y: 0,
        z: 0,
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        boxShadow: "0 10px 30px rgba(0,0,0,.06)",
        duration: .52,
        ease: "back.out(1.7)",
        clearProps: "transform,boxShadow",
      });
      gsap.to(siblings, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: .38,
        ease: "power3.out",
        clearProps: "opacity,visibility,transform",
      });
    });
  });
}

function animateDiscoveryCard(card) {
  if (!card || !window.gsap || reducedMotion.matches) return;
  if (animateDiscoveryTiles(card)) return;

  const image = card.querySelector("img");
  window.gsap.fromTo(
    card,
    { autoAlpha: 0, scale: .965, filter: "blur(10px)" },
    { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: .62, ease: "power3.out", clearProps: "opacity,visibility,transform,filter" },
  );
  if (image) {
    window.gsap.fromTo(image, { scale: 1.055 }, { scale: 1, duration: .8, ease: "power3.out", clearProps: "transform" });
  }
}
'''

if old not in js:
  raise SystemExit("home.js animateDiscoveryCard block not found")
js = js.replace(old, new, 1)

old = '''  discoveryCards.forEach((card, index) => {
    configureDiscoveryCard(card, index);
    card.addEventListener("click", (event) => event.preventDefault());
    card.setAttribute("aria-disabled", "true");
  });
'''
new = '''  discoveryCards.forEach((card, index) => {
    configureDiscoveryCard(card, index);
    initDiscoveryTileMotion(card);
    card.addEventListener("click", (event) => event.preventDefault());
    card.setAttribute("aria-disabled", "true");
  });
'''
if old not in js:
  raise SystemExit("home.js discovery setup block not found")
js = js.replace(old, new, 1)

old = '''  const activeDiscoveryCard = discoveryCards[activeDiscoveryIndex];
  if (activeDiscoveryCard) {
    gsap.from(activeDiscoveryCard, {
      autoAlpha: 0,
      scale: .96,
      filter: "blur(9px)",
      duration: .75,
      ease: "power3.out",
      clearProps: "opacity,visibility,transform,filter",
      scrollTrigger: { trigger: "#templates .template-grid", start: "top 84%", once: true },
    });
  }
'''
new = '''  const activeDiscoveryCard = discoveryCards[activeDiscoveryIndex];
  if (activeDiscoveryCard && !animateDiscoveryTiles(activeDiscoveryCard, {
    scrollTrigger: { trigger: "#templates .template-grid", start: "top 84%", once: true },
  })) {
    gsap.from(activeDiscoveryCard, {
      autoAlpha: 0,
      scale: .96,
      filter: "blur(9px)",
      duration: .75,
      ease: "power3.out",
      clearProps: "opacity,visibility,transform,filter",
      scrollTrigger: { trigger: "#templates .template-grid", start: "top 84%", once: true },
    });
  }
'''
if old not in js:
  raise SystemExit("home.js initial discovery motion block not found")
js = js.replace(old, new, 1)
js_path.write_text(js, encoding="utf-8")

css_path = Path("src/features/home/home.css")
css = css_path.read_text(encoding="utf-8")
css = css.replace('''  object-position: center top !important;\n  transform: none !important;\n  filter: none !important;\n''', '''  object-position: center top !important;\n''')
for index in (1, 3, 4):
  block = f'''\n.discovery-strip .template-card:nth-child({index}).is-active-discovery:hover > img {{\n  transform: none !important;\n  filter: none !important;\n}}\n'''
  css = css.replace(block, "\n")

motion_css = '''

/* GSAP discovery-card depth: preserve the static layout while allowing the four-up previews to move independently. */
.home-motion-active .discovery-strip .template-card:nth-child(1).is-active-discovery > img,
.home-motion-active .discovery-strip .template-card:nth-child(1).is-active-discovery > .template-card-shade,
.home-motion-active .discovery-strip .template-card:nth-child(1).is-active-discovery > small,
.home-motion-active .discovery-strip .template-card:nth-child(1).is-active-discovery > div,
.home-motion-active .discovery-strip .template-card:nth-child(3).is-active-discovery > img,
.home-motion-active .discovery-strip .template-card:nth-child(3).is-active-discovery > .template-card-shade,
.home-motion-active .discovery-strip .template-card:nth-child(3).is-active-discovery > small,
.home-motion-active .discovery-strip .template-card:nth-child(3).is-active-discovery > div,
.home-motion-active .discovery-strip .template-card:nth-child(4).is-active-discovery > img,
.home-motion-active .discovery-strip .template-card:nth-child(4).is-active-discovery > .template-card-shade,
.home-motion-active .discovery-strip .template-card:nth-child(4).is-active-discovery > small,
.home-motion-active .discovery-strip .template-card:nth-child(4).is-active-discovery > div {
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform;
}

@media (prefers-reduced-motion: reduce), (hover: none), (pointer: coarse) {
  .home-motion-active .discovery-strip .template-card:nth-child(1).is-active-discovery > img,
  .home-motion-active .discovery-strip .template-card:nth-child(1).is-active-discovery > .template-card-shade,
  .home-motion-active .discovery-strip .template-card:nth-child(1).is-active-discovery > small,
  .home-motion-active .discovery-strip .template-card:nth-child(1).is-active-discovery > div,
  .home-motion-active .discovery-strip .template-card:nth-child(3).is-active-discovery > img,
  .home-motion-active .discovery-strip .template-card:nth-child(3).is-active-discovery > .template-card-shade,
  .home-motion-active .discovery-strip .template-card:nth-child(3).is-active-discovery > small,
  .home-motion-active .discovery-strip .template-card:nth-child(3).is-active-discovery > div,
  .home-motion-active .discovery-strip .template-card:nth-child(4).is-active-discovery > img,
  .home-motion-active .discovery-strip .template-card:nth-child(4).is-active-discovery > .template-card-shade,
  .home-motion-active .discovery-strip .template-card:nth-child(4).is-active-discovery > small,
  .home-motion-active .discovery-strip .template-card:nth-child(4).is-active-discovery > div {
    will-change: auto;
  }
}
'''
if "GSAP discovery-card depth" not in css:
  css += motion_css
css_path.write_text(css, encoding="utf-8")

html_path = Path("learn.html")
html = html_path.read_text(encoding="utf-8")
html = html.replace('./brands.html?lang=zh', './launcher.html?lang=zh')
html = html.replace('data-smart-lang-link="./brands.html"', 'data-smart-lang-link="./launcher.html"')
html_path.write_text(html, encoding="utf-8")
