const views = [...document.querySelectorAll("[data-view]")];
const toast = document.querySelector(".toast");
const navItems = [...document.querySelectorAll(".nav-item")];
let toastTimer;
let currentRecipe = "ramen";
const recipes = {
  pasta: {
    image: "assets/pasta-primavera-generated.webp",
    alt: "Pasta primavera with tomatoes, peas and basil",
    category: "FRESH & EASY",
    title: "Pasta Primavera,<br /><em>your way.</em>",
    description: "A bright, herby bowl with tomatoes, peas and whatever fresh greens you have.",
    minutes: "20",
    calories: "430",
    index: "01",
    name: "Pasta Primavera"
  },
  ramen: {
    image: "assets/miso-ramen-generated.webp",
    alt: "Miso ramen with pork, egg and greens",
    category: "COMFORT FOOD",
    title: "Miso ramen,<br /><em>your way.</em>",
    description: "A rich, cozy bowl with a jammy egg and whatever greens are in your fridge.",
    minutes: "28",
    calories: "520",
    index: "02",
    name: "Miso ramen"
  }
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1600);
}

function showRecipe(recipeName) {
  currentRecipe = recipes[recipeName] ? recipeName : "ramen";
  const recipe = recipes[currentRecipe];
  document.querySelector("#detailImage").src = recipe.image;
  document.querySelector("#detailImage").alt = recipe.alt;
  document.querySelector("#detailCategory").textContent = recipe.category;
  document.querySelector("#detailTitle").innerHTML = recipe.title;
  document.querySelector("#detailCopy").textContent = recipe.description;
  document.querySelector("#detailMinutes").textContent = recipe.minutes;
  document.querySelector("#detailCalories").textContent = recipe.calories;
  document.querySelector("#detailIndex").textContent = `RECIPE ${recipe.index} / 172`;
}

function go(viewName, recipeName = currentRecipe, record = true, announce = true) {
  if (!views.some((view) => view.dataset.view === viewName)) return;
  if (viewName === "detail") showRecipe(recipeName);
  views.forEach((view) => { view.hidden = view.dataset.view !== viewName; });
  navItems.forEach((item) => item.classList.toggle("is-active", item.dataset.viewTarget === (viewName === "detail" ? "recipes" : viewName)));
  if (record) {
    const hash = viewName === "detail" ? `#detail/${currentRecipe}` : `#${viewName}`;
    if (location.hash !== hash) history.pushState(null, "", hash);
  }
  if (announce) showToast({ home: "A good idea for lunch.", recipes: "172 lunches, sorted for you.", detail: "Recipe details opened." }[viewName]);
}

document.querySelectorAll("[data-view-target]").forEach((button) => {
  button.addEventListener("click", () => go(button.dataset.viewTarget, button.dataset.recipe || currentRecipe));
});

function restoreRoute() {
  const [viewName, recipeName] = location.hash.slice(1).split("/");
  go(viewName || "home", recipeName || currentRecipe, false, false);
}

window.addEventListener("popstate", restoreRoute);
restoreRoute();

document.querySelectorAll("[data-toast]").forEach((button) => {
  button.addEventListener("click", () => showToast(button.dataset.toast));
});

document.querySelectorAll("[data-category]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-category]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });
    showToast(`${button.dataset.category} recipes selected.`);
  });
});

document.querySelector("[data-heart]")?.addEventListener("click", (event) => {
  const button = event.currentTarget;
  const saved = button.textContent.trim() === "♡";
  button.textContent = saved ? "♥" : "♡";
  button.style.color = saved ? "var(--red)" : "";
  showToast(saved ? "Saved to your recipe box." : "Removed from saved recipes.");
});

document.querySelector("#detailAddPlan")?.addEventListener("click", () => {
  showToast(`${recipes[currentRecipe].name} added to your cooking plan.`);
});

const query = new URLSearchParams(location.search);
if (query.has("embed")) {
  document.documentElement.classList.add("embed-mode");
  const fit = () => document.documentElement.style.setProperty("--s", Math.min(innerWidth / 390, innerHeight / 844));
  fit();
  addEventListener("resize", fit);
}
