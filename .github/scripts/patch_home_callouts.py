from pathlib import Path

path = Path("src/features/home/home.js")
text = path.read_text(encoding="utf-8")

old = '''  const liveTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: "#design-system-live .system-explainer-stage",
      start: "top 82%",
      end: "bottom 58%",
      scrub: .7,
    },
  });
  liveTimeline
    .from("#design-system-live .system-app", { autoAlpha: 0, filter: "blur(14px)", duration: 1 })
    .from("#design-system-live .system-callout-type", { autoAlpha: 0, x: -74, duration: .65, clearProps: "transform" }, .28)
    .from("#design-system-live .system-callout-color", { autoAlpha: 0, x: 74, duration: .65, clearProps: "transform" }, .48)
    .from("#design-system-live .system-callout-spacing", { autoAlpha: 0, x: -74, duration: .65, clearProps: "transform" }, .68)
    .from("#design-system-live .system-callout-states", { autoAlpha: 0, x: 74, duration: .65, clearProps: "transform" }, .88);'''

new = '''  const liveTimeline = gsap.timeline({
    defaults: { ease: "power3.out" },
    scrollTrigger: {
      trigger: "#design-system-live .system-explainer-stage",
      start: "top 78%",
      once: true,
    },
  });
  liveTimeline
    .from("#design-system-live .system-app", {
      autoAlpha: 0,
      y: 22,
      scale: .985,
      filter: "blur(12px)",
      duration: .68,
      clearProps: "opacity,visibility,transform,filter",
    })
    .from("#design-system-live .system-callout-type", {
      autoAlpha: 0,
      x: -42,
      y: -16,
      scale: .94,
      duration: .52,
      clearProps: "opacity,visibility,transform",
    }, "-=.08")
    .from("#design-system-live .system-callout-color", {
      autoAlpha: 0,
      x: 42,
      y: -16,
      scale: .94,
      duration: .52,
      clearProps: "opacity,visibility,transform",
    }, "-=.34")
    .from("#design-system-live .system-callout-spacing", {
      autoAlpha: 0,
      x: -42,
      y: 16,
      scale: .94,
      duration: .52,
      clearProps: "opacity,visibility,transform",
    }, "-=.34")
    .from("#design-system-live .system-callout-states", {
      autoAlpha: 0,
      x: 42,
      y: 16,
      scale: .94,
      duration: .52,
      clearProps: "opacity,visibility,transform",
    }, "-=.34");'''

if old not in text:
    raise SystemExit("Expected liveTimeline block was not found; refusing to patch.")

path.write_text(text.replace(old, new, 1), encoding="utf-8")
