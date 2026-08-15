const v = [...document.querySelectorAll(".view")],
  o = document.querySelector("output");
let t;
const q = new URLSearchParams(location.search);
if (q.has("embed")) {
  document.documentElement.classList.add("embed-mode");
  const f = () =>
    document.documentElement.style.setProperty(
      "--s",
      Math.min(innerWidth / 390, innerHeight / 693),
    );
  f();
  addEventListener("resize", f);
}
function go(n) {
  v.forEach((x) => (x.hidden = !x.classList.contains(n)));
  note(
    {
      home: "Fresh offers ready.",
      menu: "Burger added to your menu.",
      track: "Delivery status updated.",
    }[n],
  );
}
function note(x) {
  o.textContent = x;
  o.classList.add("show");
  clearTimeout(t);
  t = setTimeout(() => o.classList.remove("show"), 1500);
}
document
  .querySelectorAll("[data-view]")
  .forEach((b) => (b.onclick = () => go(b.dataset.view)));
document
  .querySelectorAll("[data-note]")
  .forEach((b) => (b.onclick = () => note(b.dataset.note)));
