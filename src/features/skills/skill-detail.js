import {
  repositories,
  repositoriesEn,
  categoryLabels,
  skillVisuals,
  skillOfficialPages
} from "./skills-data.js";

(() => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("repo") || "Leonxlnx/taste-skill";
  const language = params.get("lang") === "en" ? "en" : "zh";
  const index = repositories.findIndex((item) => item.slug === slug);
  const base = index >= 0 ? repositories[index] : null;
  const translated = language === "en" && index >= 0 ? (repositoriesEn[index] || base) : base;
  const item = base ? { ...base, fallback: translated?.fallback || base.fallback, focus: translated?.focus || base.focus } : null;

  const copy = {
    zh: { back:"全部 Skills",copyCommand:"复制调用",previewTab:"能力预览",usageTab:"调用方式",sourceTab:"来源信息",outputLabel:"SKILL OUTPUT",capabilityLabel:"CAPABILITY",capabilityTitle:"它能帮助你完成什么",usageLabel:"HOW TO USE",usageTitle:"两步开始调用",stepInstallTitle:"复制并安装",stepInstallBody:"将仓库克隆到本地 Skills 目录。",stepPromptTitle:"描述你的任务",stepPromptBody:"在 Codex、Claude Code 或其他 Agent 中说明目标并引用该 Skill。",promptLabel:"提示词起点",copyPrompt:"复制提示词",sourceLabel:"SOURCE",sourceTitle:"调用前了解来源",sourceBody:"本站整理公开仓库的信息与使用入口，不会自动执行仓库代码，也不代表已完成安全审计。安装或调用前，请阅读原始来源说明和代码。",openSource:"打开原始来源",sourceLink:"原始来源",metadata:"元信息",repository:"仓库",updated:"更新时间",category:"分类",quickStart:"快速上手",quickInstall:"复制安装命令",quickPrompt:"复制提示词并描述任务",recent:"近期更新",notFound:"没有找到这个 Skill",copied:"已复制" },
    en: { back:"All skills",copyCommand:"Copy command",previewTab:"Capability preview",usageTab:"How to use",sourceTab:"Source",outputLabel:"SKILL OUTPUT",capabilityLabel:"CAPABILITY",capabilityTitle:"What this skill helps you accomplish",usageLabel:"HOW TO USE",usageTitle:"Start in two steps",stepInstallTitle:"Copy and install",stepInstallBody:"Clone the repository into your local Skills directory.",stepPromptTitle:"Describe the task",stepPromptBody:"State your goal and reference this skill in Codex, Claude Code or another agent.",promptLabel:"Prompt starter",copyPrompt:"Copy prompt",sourceLabel:"SOURCE",sourceTitle:"Understand the source before use",sourceBody:"This page organizes public repository information and usage links. It does not execute repository code or represent a completed security audit. Read the original source documentation and code before installing.",openSource:"Open original source",sourceLink:"Original source",metadata:"Metadata",repository:"Repository",updated:"Updated",category:"Category",quickStart:"Quick start",quickInstall:"Copy install command",quickPrompt:"Copy the prompt and describe your task",recent:"Recently updated",notFound:"Skill not found",copied:"Copied" }
  }[language];

  document.documentElement.lang = language === "en" ? "en" : "zh-CN";
  document.querySelectorAll("[data-copy]").forEach((node) => {
    const key = node.dataset.copy;
    if (copy[key]) node.textContent = copy[key];
  });

  const back = document.querySelector("[data-back-link]");
  if (back) {
    const backParams = new URLSearchParams();
    ["lang", "mode", "sort", "categories", "q"].forEach((key) => {
      const value = params.get(key);
      if (value) backParams.set(key, value);
    });
    if (!backParams.has("lang")) backParams.set("lang", language);
    back.href = `./skills.html?${backParams.toString()}`;
  }

  if (!item) {
    document.title = `${copy.notFound} · ONDesign`;
    document.querySelector("[data-title]").textContent = copy.notFound;
    document.querySelector("[data-description]").textContent = slug;
    document.querySelectorAll("[data-copy-command], [data-copy-prompt]").forEach((button) => { button.disabled = true; });
    document.querySelectorAll("[data-source-link]").forEach((link) => link.removeAttribute("href"));
    return;
  }

  const categoryLabel = categoryLabels[item.category]?.[language] || item.category;
  const outcome = skillVisuals[item.slug]?.[language] || item.focus;
  const repoName = item.slug.split("/").pop();
  const command = `git clone https://github.com/${item.slug}.git ~/.codex/skills/${repoName}`;
  const prompt = language === "en"
    ? `Use the ${item.title} skill to help me with this task: [describe the product, users, constraints and desired outcome]. Explain the design decisions before implementation.`
    : `请使用 ${item.title} Skill 帮我完成以下任务：[描述产品、用户、限制条件和预期结果]。在开始实现前，先说明关键设计判断。`;
  const sourceUrl = skillOfficialPages[item.slug] || `https://github.com/${item.slug}`;

  document.title = `${item.title} · Skill 详情 · ONDesign`;
  document.querySelector("[data-title]").textContent = item.title;
  document.querySelector("[data-description]").textContent = item.fallback;
  document.querySelector("[data-category-label]").textContent = categoryLabel;
  document.querySelector("[data-side-category]").textContent = categoryLabel;
  document.querySelector("[data-repository]").textContent = item.slug;
  document.querySelector("[data-outcome]").textContent = outcome;
  document.querySelector("[data-focus]").textContent = item.focus;
  const output = document.querySelector("[data-output-category]");
  output.dataset.category = item.category;
  renderDetailMedia(item, output);
  document.querySelector("[data-capability-copy]").textContent = language === "en"
    ? `Use this skill when you need support with ${item.focus.toLowerCase()}. It provides a focused starting point instead of a generic design response.`
    : `当你的任务涉及「${item.focus}」时，可以用这个 Skill 建立更明确的判断与执行起点，避免得到过于通用的设计回答。`;
  document.querySelector("[data-command]").textContent = command;
  document.querySelector("[data-prompt]").textContent = prompt;
  document.querySelectorAll("[data-source-link]").forEach((link) => { link.href = sourceUrl; });

  const tags = item.focus.split(/\s*\/\s*/).filter(Boolean);
  const extraTags = Array.isArray(item.extraTags?.[language]) ? item.extraTags[language] : [];
  const displayTags = [...new Set([categoryLabel, ...extraTags, ...tags])];
  document.querySelector("[data-tags]").innerHTML = displayTags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  document.querySelector("[data-use-grid]").innerHTML = tags.slice(0, 2).map((tag, tagIndex) => `<div><b>0${tagIndex + 1}</b><strong>${escapeHtml(tag)}</strong></div>`).join("") + `<div><b>03</b><strong>${language === "en" ? "Reusable workflow" : "可复用工作流"}</strong></div><div><b>04</b><strong>${language === "en" ? "Clearer design decisions" : "更清晰的设计判断"}</strong></div>`;

  const copyValue = (button, value) => navigator.clipboard.writeText(value).then(() => {
    const label = button.querySelector("span") || button;
    const original = label.textContent;
    label.textContent = copy.copied;
    button.classList.add("is-copied");
    setTimeout(() => {
      label.textContent = original;
      button.classList.remove("is-copied");
    }, 1600);
  });
  document.querySelectorAll("[data-copy-command]").forEach((button) => button.addEventListener("click", () => copyValue(button, command)));
  document.querySelectorAll("[data-copy-prompt]").forEach((button) => button.addEventListener("click", () => copyValue(button, prompt)));

  const statsCacheKey = "ondesign-skill-repository-stats-v1";
  try {
    const cached = JSON.parse(localStorage.getItem(statsCacheKey) || "null")?.items?.[item.slug];
    if (cached?.starsLabel || Number.isFinite(cached?.stars)) document.querySelector("[data-stars]").textContent = cached.starsLabel || formatNumber(cached.stars);
    if (cached?.updatedAt) document.querySelector("[data-updated]").textContent = formatDate(cached.updatedAt, language);
  } catch {}

  fetch(`https://api.github.com/repos/${item.slug}`, { headers:{ Accept:"application/vnd.github+json" }, cache:"no-store" })
    .then((response) => response.ok ? response.json() : Promise.reject())
    .then((repo) => {
      document.querySelector("[data-stars]").textContent = formatNumber(repo.stargazers_count);
      document.querySelector("[data-updated]").textContent = formatDate(repo.pushed_at, language);
    })
    .catch(() => fetch(`https://img.shields.io/github/stars/${item.slug}.json`, { cache:"no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((badge) => {
        if (badge.message) document.querySelector("[data-stars]").textContent = badge.message;
      })
      .catch(() => {}));

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, (character) => ({ "&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;" })[character]);
  }

  function renderDetailMedia(skill, outputElement) {
    const frame = document.querySelector(".detail-output-ui");
    if (!frame || !skill.detailMediaSrc) return;
    outputElement.classList.add("has-detail-media");
    frame.removeAttribute("aria-hidden");
    frame.setAttribute("aria-label", language === "en" ? `${skill.title} preview media` : `${skill.title} 预览媒体`);
    if (skill.detailMediaType === "video") {
      const posterAttribute = skill.coverImage ? ` poster="${escapeHtml(skill.coverImage)}"` : "";
      frame.innerHTML = `<video src="${escapeHtml(skill.detailMediaSrc)}"${posterAttribute} autoplay muted loop playsinline preload="metadata"></video>`;
      return;
    }
    frame.innerHTML = `<img src="${escapeHtml(skill.detailMediaSrc)}" alt="">`;
  }

  function formatNumber(value) {
    return value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : String(value ?? "--");
  }

  function formatDate(value, lang) {
    if (!value) return copy.recent;
    return new Intl.DateTimeFormat(lang === "en" ? "en" : "zh-CN", { year:"numeric", month:"short", day:"numeric" }).format(new Date(value));
  }
})();
