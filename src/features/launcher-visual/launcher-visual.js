import { DESIGN_SYSTEMS } from "../launcher/design-systems-catalog.js";
import { COMPONENT_SYSTEMS } from "../launcher/component-systems-catalog.js";
import { designSystemLogoUrl, faviconUrl, logoInitials, setLogo } from "../launcher/brand-logo-utils.js";

const state = {
  direction: "restrained",
  palette: "lime",
  density: 50,
  radius: 12,
  spacing: 20,
  view: "landing",
  device: "desktop",
  visualSystem: "figma",
  componentSystem: "antd"
};

const labels = {
  direction: { restrained: "克制", editorial: "编辑感", vivid: "活力" },
  palette: {
    lime: { color: "#22C55E" },
    magenta: { color: "#EF35B8" },
    blue: { color: "#2563EB" },
    orange: { color: "#F97316" }
  }
};

const stage = document.querySelector("[data-preview-stage]");
const stageShell = document.querySelector("[data-stage-shell]");
const feedback = document.querySelector("[data-feedback]");
let feedbackTimer;

function populateStandards() {
  if (!DESIGN_SYSTEMS.some((item) => item.slug === state.visualSystem)) state.visualSystem = DESIGN_SYSTEMS[0].slug;
  if (!COMPONENT_SYSTEMS.some((item) => item.id === state.componentSystem)) state.componentSystem = COMPONENT_SYSTEMS[0].id;
  populateStandardPicker("visual", DESIGN_SYSTEMS);
  populateStandardPicker("component", COMPONENT_SYSTEMS);
}

function populateStandardPicker(kind, items) {
  const picker = document.querySelector(`[data-standard-picker="${kind}"]`);
  const options = picker.querySelector("[data-standard-options]");
  picker.querySelector("[data-standard-count]").textContent = `${items.length} 套`;
  options.replaceChildren(...items.map((item) => {
    const value = kind === "visual" ? item.slug : item.id;
    const logoUrl = kind === "visual" ? designSystemLogoUrl(item) : faviconUrl(item.domain);
    const initials = kind === "visual" ? logoInitials(item) : item.short;
    const option = document.createElement("button");
    option.className = "standard-option";
    option.type = "button";
    option.dataset.standardValue = value;
    option.setAttribute("role", "option");
    option.innerHTML = `<span class="standard-logo"><img alt="" decoding="async"><b aria-hidden="true"></b></span><span></span><small>${kind === "visual" ? "VISUAL" : "UI"}</small>`;
    option.querySelector("span:nth-child(2)").textContent = item.name;
    setLogo(option.querySelector(".standard-logo"), { url: logoUrl, name: item.name, initials });
    return option;
  }));
}

function visualSystem() {
  return DESIGN_SYSTEMS.find((item) => item.slug === state.visualSystem) || DESIGN_SYSTEMS[0];
}

function componentSystem() {
  return COMPONENT_SYSTEMS.find((item) => item.id === state.componentSystem) || COMPONENT_SYSTEMS[0];
}

function densityLabel(value) {
  if (value < 34) return "宽松";
  if (value > 66) return "紧凑";
  return "平衡";
}

function setSelected(selector, attribute, value) {
  document.querySelectorAll(selector).forEach((button) => {
    const active = button.dataset[attribute] === value;
    button.classList.toggle("is-active", active);
    if (button.getAttribute("role") === "radio") button.setAttribute("aria-checked", String(active));
  });
}

function updateDial(name, value, min, max) {
  const dial = document.querySelector(`[data-dial="${name}"]`);
  const angle = -125 + ((value - min) / (max - min)) * 250;
  dial.style.setProperty("--angle", `${angle}deg`);
  const input = document.querySelector(`[data-control="${name}"]`);
  input.style.setProperty("--fill", `${((value - min) / (max - min)) * 100}%`);
  dial.setAttribute("aria-valuenow", String(value));
}

function announce(message) {
  feedback.textContent = message;
  clearTimeout(feedbackTimer);
  feedbackTimer = window.setTimeout(() => {
    feedback.textContent = "所有调整会自动同步到预览";
  }, 1800);
}

function render(message) {
  stage.dataset.direction = state.direction;
  stage.dataset.palette = state.palette;
  stage.dataset.view = state.view;
  stage.style.setProperty("--preview-radius", `${state.radius}px`);
  stage.style.setProperty("--preview-space", `${state.spacing}px`);

  document.querySelectorAll("[data-sample]").forEach((view) => {
    view.hidden = view.dataset.sample !== state.view;
  });
  stageShell.classList.toggle("is-mobile", state.device === "mobile");

  setSelected("[data-direction]", "direction", state.direction);
  setSelected("[data-palette]", "palette", state.palette);
  setSelected("[data-view]", "view", state.view);
  setSelected("[data-device]", "device", state.device);

  document.querySelectorAll("[data-number]").forEach((input) => {
    if (document.activeElement !== input) input.value = state[input.dataset.number];
  });
  document.querySelector("[data-token-direction]").textContent = labels.direction[state.direction];
  document.querySelector("[data-token-density]").textContent = densityLabel(state.density);
  document.querySelector("[data-token-radius]").textContent = `${state.radius}px`;
  document.querySelector("[data-token-spacing]").textContent = `${state.spacing}px`;
  document.querySelector("[data-token-visual]").textContent = visualSystem().name;
  document.querySelector("[data-token-component]").textContent = componentSystem().name;
  document.querySelector("[data-token-color]").textContent = labels.palette[state.palette].color;
  document.querySelector(".token-color i").style.background = labels.palette[state.palette].color;

  const densityHint = document.querySelector('[data-dial="density"] + span small');
  const radiusHint = document.querySelector('[data-dial="radius"] + span small');
  const spacingHint = document.querySelector('[data-dial="spacing"] + span small');
  densityHint.textContent = densityLabel(state.density);
  radiusHint.textContent = `${state.radius} px`;
  spacingHint.textContent = `${state.spacing} px`;

  const visual = visualSystem();
  const component = componentSystem();
  const visualPicker = document.querySelector('[data-standard-picker="visual"]');
  visualPicker.querySelector("[data-standard-selected-name]").textContent = visual.name;
  document.querySelector("[data-visual-description]").textContent = visual.description;
  setLogo(visualPicker.querySelector("[data-standard-selected-logo]"), {
    url: designSystemLogoUrl(visual), name: visual.name, initials: logoInitials(visual)
  });
  const componentPicker = document.querySelector('[data-standard-picker="component"]');
  componentPicker.querySelector("[data-standard-selected-name]").textContent = component.name;
  document.querySelector("[data-component-description]").textContent = component.metaZh;
  setLogo(componentPicker.querySelector("[data-standard-selected-logo]"), {
    url: faviconUrl(component.domain), name: component.name, initials: component.short
  });
  document.querySelectorAll("[data-standard-picker]").forEach((picker) => {
    const selectedValue = picker.dataset.standardPicker === "visual" ? state.visualSystem : state.componentSystem;
    picker.querySelectorAll("[data-standard-value]").forEach((option) => {
      const active = option.dataset.standardValue === selectedValue;
      option.classList.toggle("is-active", active);
      option.setAttribute("aria-selected", String(active));
    });
  });
  stage.style.setProperty("--preview-control-height", component.height);
  stage.style.setProperty("--preview-control-weight", component.weight);
  stage.style.setProperty("--preview-control-shadow", component.shadow);

  updateDial("density", state.density, 0, 100);
  updateDial("radius", state.radius, 0, 28);
  updateDial("spacing", state.spacing, 12, 36);
  if (message) announce(message);
}

document.querySelectorAll("[data-direction]").forEach((button) => {
  button.addEventListener("click", () => {
    state.direction = button.dataset.direction;
    render(`已切换为${labels.direction[state.direction]}方向`);
  });
});

document.querySelectorAll("[data-palette]").forEach((button) => {
  button.addEventListener("click", () => {
    state.palette = button.dataset.palette;
    render(`强调色已更新为 ${labels.palette[state.palette].color}`);
  });
});

document.querySelectorAll("[data-standard-picker]").forEach((picker) => {
  const trigger = picker.querySelector("[data-standard-trigger]");
  const options = picker.querySelector("[data-standard-options]");
  trigger.addEventListener("click", () => {
    const willOpen = !picker.classList.contains("is-open");
    document.querySelectorAll("[data-standard-picker]").forEach((item) => {
      item.classList.remove("is-open");
      item.querySelector("[data-standard-trigger]").setAttribute("aria-expanded", "false");
      item.querySelector("[data-standard-options]").hidden = true;
    });
    if (willOpen) {
      picker.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      options.hidden = false;
      options.querySelector(".is-active")?.scrollIntoView({ block: "nearest" });
    }
  });
  options.addEventListener("click", (event) => {
    const option = event.target.closest("[data-standard-value]");
    if (!option) return;
    if (picker.dataset.standardPicker === "visual") {
      state.visualSystem = option.dataset.standardValue;
      render(`已应用 ${visualSystem().name} 视觉规范`);
    } else {
      state.componentSystem = option.dataset.standardValue;
      const component = componentSystem();
      state.radius = Number.parseInt(component.radius, 10);
      document.querySelector('[data-control="radius"]').value = state.radius;
      render(`已应用 ${component.name} 组件规范`);
    }
    picker.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    options.hidden = true;
    trigger.focus();
  });
});

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-standard-picker]")) return;
  document.querySelectorAll("[data-standard-picker].is-open").forEach((picker) => {
    picker.classList.remove("is-open");
    picker.querySelector("[data-standard-trigger]").setAttribute("aria-expanded", "false");
    picker.querySelector("[data-standard-options]").hidden = true;
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const picker = document.querySelector("[data-standard-picker].is-open");
  if (!picker) return;
  picker.classList.remove("is-open");
  picker.querySelector("[data-standard-trigger]").setAttribute("aria-expanded", "false");
  picker.querySelector("[data-standard-options]").hidden = true;
  picker.querySelector("[data-standard-trigger]").focus();
});

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    state.view = button.dataset.view;
    render("预览内容已切换");
  });
});

document.querySelectorAll("[data-device]").forEach((button) => {
  button.addEventListener("click", () => {
    state.device = button.dataset.device;
    render(state.device === "mobile" ? "已切换为移动预览" : "已切换为桌面预览");
  });
});

document.querySelectorAll("[data-control]").forEach((input) => {
  input.addEventListener("input", () => {
    state[input.dataset.control] = Number(input.value);
    render();
  });
  input.addEventListener("change", () => render("参数已同步到预览"));
});

document.querySelectorAll(".dial-control").forEach((label) => {
  const input = label.querySelector("[data-control]");
  const numberInput = label.querySelector("[data-number]");
  const dial = label.querySelector(".dial");
  const controlName = input.dataset.control;
  const min = Number(input.min);
  const max = Number(input.max);

  dial.tabIndex = 0;
  dial.setAttribute("role", "slider");
  dial.setAttribute("aria-valuemin", String(min));
  dial.setAttribute("aria-valuemax", String(max));
  dial.setAttribute("aria-label", `${label.querySelector('span:nth-child(2) strong').textContent}旋钮`);

  function commit(next, message = false) {
    const value = Math.min(max, Math.max(min, Math.round(next)));
    input.value = String(value);
    state[controlName] = value;
    render(message ? "参数已同步到预览" : undefined);
  }

  dial.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    if (event.target.closest("input")) return;
    dial.classList.add("is-dragging");
    dial.setPointerCapture(event.pointerId);
    updateFromPointer(event);
  });

  function updateFromPointer(event) {
    const rect = dial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let angle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180 / Math.PI;
    angle = (angle + 360 + 90) % 360;
    const arc = angle <= 180 ? angle + 125 : angle - 235;
    const ratio = Math.min(1, Math.max(0, arc / 250));
    commit(min + ratio * (max - min));
  }

  dial.addEventListener("pointermove", (event) => {
    if (!dial.hasPointerCapture(event.pointerId)) return;
    updateFromPointer(event);
  });

  function endDrag(event) {
    if (!dial.hasPointerCapture(event.pointerId)) return;
    dial.releasePointerCapture(event.pointerId);
    dial.classList.remove("is-dragging");
    announce("参数已同步到预览");
  }

  dial.addEventListener("pointerup", endDrag);
  dial.addEventListener("pointercancel", endDrag);

  dial.addEventListener("keydown", (event) => {
    const direction = event.key === "ArrowUp" || event.key === "ArrowRight" ? 1 : event.key === "ArrowDown" || event.key === "ArrowLeft" ? -1 : 0;
    if (!direction) return;
    event.preventDefault();
    commit(Number(input.value) + direction * (event.shiftKey ? 5 : 1));
  });

  dial.addEventListener("wheel", (event) => {
    event.preventDefault();
    commit(Number(input.value) + (event.deltaY < 0 ? 1 : -1));
  }, { passive: false });

  dial.addEventListener("dblclick", () => {
    const defaults = { density: 50, radius: 12, spacing: 20 };
    commit(defaults[controlName], true);
  });

  numberInput.addEventListener("input", () => {
    if (numberInput.value === "") return;
    commit(Number(numberInput.value));
  });
  numberInput.addEventListener("change", () => commit(Number(numberInput.value), true));

  label.querySelectorAll("[data-step]").forEach((button) => {
    button.addEventListener("click", () => commit(Number(input.value) + Number(button.dataset.step), true));
  });
});

document.querySelector("[data-shuffle]").addEventListener("click", () => {
  const directions = Object.keys(labels.direction);
  const palettes = Object.keys(labels.palette);
  const views = ["landing", "dashboard", "article"];
  state.direction = directions[Math.floor(Math.random() * directions.length)];
  state.palette = palettes[Math.floor(Math.random() * palettes.length)];
  state.view = views[Math.floor(Math.random() * views.length)];
  state.density = Math.round(22 + Math.random() * 62);
  state.radius = Math.round(Math.random() * 24);
  state.spacing = Math.round(14 + Math.random() * 18);
  document.querySelector('[data-control="density"]').value = state.density;
  document.querySelector('[data-control="radius"]').value = state.radius;
  document.querySelector('[data-control="spacing"]').value = state.spacing;
  render("已生成一组新的设计 DNA");
});

document.querySelector("[data-copy]").addEventListener("click", async () => {
  const dna = [
    `视觉方向：${labels.direction[state.direction]}`,
    `强调色：${labels.palette[state.palette].color}`,
    `界面密度：${densityLabel(state.density)} (${state.density})`,
    `圆角：${state.radius}px`,
    `基础间距：${state.spacing}px`,
    `视觉规范：${visualSystem().name}`,
    `组件规范：${componentSystem().name}`,
    `预览类型：${state.view}`
  ].join("\n");
  try {
    await navigator.clipboard.writeText(dna);
    render("设计 DNA 已复制");
  } catch {
    announce("浏览器未允许复制，请在本地地址中重试");
  }
});

populateStandards();
render();
