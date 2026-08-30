export function createSkillsRenderer({ elements, data, state, helpers, actions }) {
  const {
    repoList,
    repoSearch,
    repoFacets,
    repoCount,
    repoSyncStatus,
    skillsHeroCount,
    skillsHeroKind,
    skillsHeroBody,
    heroUpdateCount,
    heroUpdateLabel,
    categoryCount,
    repoSortButtons,
    directoryModeButtons,
    repoSort,
    repoInspector
  } = elements;

  const { categoryGroups, designReferenceGroups, designReferenceWebsites } = data;
  const {
    getRepositoryItems,
    getFilteredRepositories,
    getFilteredWebsites,
    escapeHtml,
    skillIcon,
    getCategoryLabel,
    getSkillBrowserLabel,
    getSkillCoverMarkup,
    getSkillVisual,
    formatNumber,
    formatDate,
    formatSyncTime,
    buildSkillDetailHref,
    getWebsitePreviewMarkup
  } = helpers;
  const { track, copyCloneCommand, syncDirectoryStateToUrl } = actions;

  function renderRepositoryFilters() {
    if (state.activeDirectoryMode === "WEB") {
      if (categoryCount) categoryCount.textContent = String(designReferenceGroups.length);
      if (repoFacets) repoFacets.innerHTML = `<section class="facet-group"><h3><span>${state.currentLanguage === "en" ? "Website purpose" : "网站用途"}</span><b>${designReferenceWebsites.length}</b></h3><div class="repo-subfilters">${designReferenceGroups.map((group) => {
        const itemCount = designReferenceWebsites.filter((item) => item.group === group.key).length;
        const isActive = state.activeCategories.has(group.key);
        return `<button class="repo-subfilter${isActive ? " is-active" : ""}" type="button" aria-pressed="${isActive}" data-repo-filter="${escapeHtml(group.key)}"><span>${escapeHtml(state.currentLanguage === "en" ? group.en : group.zh)}</span><b>${itemCount}</b></button>`;
      }).join("")}</div></section><section class="facet-group"><h3><span>${state.currentLanguage === "en" ? "Source code" : "源代码"}</span><b>${designReferenceWebsites.filter((item) => item.openSource).length}</b></h3><div class="repo-subfilters"><button class="repo-subfilter${state.activeSourceOnly ? " is-active" : ""}" type="button" aria-pressed="${state.activeSourceOnly}" data-source-filter="OPEN"><span>${state.currentLanguage === "en" ? "With source code" : "有源代码"}</span><b>${designReferenceWebsites.filter((item) => item.openSource).length}</b></button></div></section>`;
    } else {
      const repositoryItems = getRepositoryItems();
      const categories = [...new Set(repositoryItems.map((item) => item.category))];
      if (categoryCount) categoryCount.textContent = String(categories.length);
      if (repoFacets) repoFacets.innerHTML = categoryGroups.map((group) => {
        const groupCategories = group.categories.filter((category) => categories.includes(category));
        const groupCount = repositoryItems.filter((item) => groupCategories.includes(item.category)).length;
        const buttons = groupCategories.map((category) => {
          const itemCount = repositoryItems.filter((item) => item.category === category).length;
          const isActive = state.activeCategories.has(category);
          return `<button class="repo-subfilter${isActive ? " is-active" : ""}" type="button" aria-pressed="${isActive}" data-repo-filter="${escapeHtml(category)}"><span>${escapeHtml(getCategoryLabel(category))}</span><b>${itemCount}</b></button>`;
        }).join("");
        return `<section class="facet-group"><h3><span>${escapeHtml(state.currentLanguage === "en" ? group.en : group.zh)}</span><b>${groupCount}</b></h3><div class="repo-subfilters">${buttons}</div></section>`;
      }).join("");
    }

    document.querySelectorAll("[data-repo-filter]").forEach((button) => button.addEventListener("click", () => {
      const filterKey = button.dataset.repoFilter;
      if (state.activeDirectoryMode === "WEB") state.activeSourceOnly = false;
      if (state.activeCategories.has(filterKey)) state.activeCategories.delete(filterKey);
      else state.activeCategories.add(filterKey);
      track(state.activeDirectoryMode === "WEB" ? "website_filter_select" : "skill_filter_select", { categories: [...state.activeCategories] });
      renderRepositories();
    }));
  }

  function renderInspector() {
    if (!repoInspector) return;
    const item = getRepositoryItems().find((repository) => repository.slug === state.selectedSlug) || getFilteredRepositories()[0] || getRepositoryItems()[0];
    if (!item) return;
    state.selectedSlug = item.slug;
    const copyLabel = state.currentLanguage === "en" ? "Copy command" : "复制调用";
    const repoName = item.slug.split("/").pop();
    repoInspector.innerHTML = `
      <p class="inspector-label">${state.currentLanguage === "en" ? "SELECTED SKILL" : "当前选中"}</p>
      <p class="inspector-category">${escapeHtml(getCategoryLabel(item.category))}</p>
      <h3>${escapeHtml(item.title)}<span aria-label="Curated skill">${skillIcon("badge-check")}</span></h3>
      <p class="inspector-copy">${escapeHtml(state.currentLanguage === "en" ? (item.description || item.fallback) : item.fallback)}</p>
      <dl><div><dt>${state.currentLanguage === "en" ? "Best for" : "适合用于"}</dt><dd>${escapeHtml(item.focus)}</dd></div><div><dt>${state.currentLanguage === "en" ? "Repository" : "来源仓库"}</dt><dd>${escapeHtml(item.slug)}</dd></div></dl>
      <div class="inspector-command"><code>git clone https://github.com/${escapeHtml(item.slug)}.git ~/.codex/skills/${escapeHtml(repoName)}</code><button type="button" data-copy-invoke="${item.slug}">${copyLabel}</button></div>
      <a class="inspector-link" href="https://github.com/${item.slug}" target="_blank" rel="noreferrer" data-repo-link="${item.slug}"><span>${state.currentLanguage === "en" ? "Open repository" : "打开仓库"}</span>${skillIcon("external-link")}</a>
    `;
    repoInspector.querySelectorAll("[data-copy-invoke]").forEach((button) => button.addEventListener("click", () => copyCloneCommand(button)));
    repoInspector.querySelectorAll("[data-repo-link]").forEach((link) => link.addEventListener("click", () => track("skill_repo_open", { repository: link.dataset.repoLink })));
  }

  function selectRepository(slug) {
    state.selectedSlug = slug;
    renderRepositories();
  }

  function renderRepositoryToolbar() {
    renderRepositoryFilters();
    const isWebMode = state.activeDirectoryMode === "WEB";
    const filteredCount = isWebMode ? getFilteredWebsites().length : getFilteredRepositories().length;
    const totalCount = isWebMode ? designReferenceWebsites.length : getRepositoryItems().length;
    directoryModeButtons.forEach((button) => {
      const isActive = button.dataset.directoryMode === state.activeDirectoryMode;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
      const count = button.querySelector("b");
      if (count) count.textContent = button.dataset.directoryMode === "WEB" ? String(designReferenceWebsites.length) : String(getRepositoryItems().length);
    });
    if (skillsHeroCount) skillsHeroCount.textContent = String(totalCount);
    if (skillsHeroKind) skillsHeroKind.textContent = isWebMode ? "Design Websites" : "Design Skills";
    if (heroUpdateCount) heroUpdateCount.textContent = isWebMode ? "+13" : "+8";
    if (heroUpdateLabel) heroUpdateLabel.textContent = isWebMode
      ? (state.currentLanguage === "en" ? "new Web resources" : "新增 Web 资源")
      : (state.currentLanguage === "en" ? "presentation Skills" : "新增演示 Skill");
    if (skillsHeroBody) skillsHeroBody.textContent = isWebMode
      ? (state.currentLanguage === "en" ? "A focused reference directory for finding visual direction, studying product UI, refining interface details and exploring creative web work." : "这是一份按设计用途整理的网站目录。可以用它寻找整体方向、拆解产品 UI、研究局部细节，或发现更有创意的网页表达。")
      : (state.currentLanguage === "en" ? "This is a map of design capabilities, not a repository leaderboard. Start with the work you need to do, then compare purpose, activity and invocation." : "这里不是仓库排行榜，而是一张设计能力地图。先选择你要完成的工作，再比较 Skill 的用途、维护状态与调用方式。");
    if (repoSort) repoSort.hidden = isWebMode;
    if (repoSyncStatus) repoSyncStatus.hidden = isWebMode;
    if (repoSearch) {
      repoSearch.value = state.searchQuery;
      repoSearch.placeholder = isWebMode
        ? (state.currentLanguage === "en" ? "Search website, purpose or domain" : "搜索网站、用途或域名")
        : (state.currentLanguage === "en" ? "Search name, purpose or repository" : "搜索名称、用途或仓库");
    }
    if (repoCount) repoCount.textContent = state.currentLanguage === "en" ? `${filteredCount} of ${totalCount}` : `${filteredCount} / ${totalCount}`;
    if (repoSyncStatus && !isWebMode) {
      const prefix = state.currentLanguage === "en" ? "Latest GitHub Stars" : "GitHub 最新 Stars";
      if (state.repositoryStatsStatus === "loading") repoSyncStatus.textContent = `${prefix} · ${state.currentLanguage === "en" ? "syncing…" : "正在同步…"}`;
      else if (state.repositoryStatsStatus === "unavailable") repoSyncStatus.textContent = `${prefix} · ${state.currentLanguage === "en" ? "temporarily unavailable" : "暂时无法更新"}`;
      else repoSyncStatus.textContent = `${prefix} · ${formatSyncTime(state.repositoryStatsUpdatedAt)}`;
    }
    repoSortButtons.forEach((button) => {
      const isActive = button.dataset.repoSort === state.activeSort;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function renderRepositories() {
    if (!repoList) return;
    renderRepositoryToolbar();
    syncDirectoryStateToUrl();
    if (state.activeDirectoryMode === "WEB") {
      renderDesignReferences();
      return;
    }
    const items = getFilteredRepositories();
    repoList.classList.remove("is-web-list");
    repoList.innerHTML = items.map((item, index) => `
      <article class="repo-row repo-card-${index % 6}" data-category="${escapeHtml(item.category)}">
        <a class="repo-scene" data-category="${escapeHtml(item.category)}" href="${escapeHtml(buildSkillDetailHref(item.slug))}" aria-label="${state.currentLanguage === "en" ? "View skill details" : "查看 Skill 详情"}: ${escapeHtml(item.title)}">
          <span class="repo-browser-bar" aria-hidden="true"><i></i><i></i><i></i><b>${escapeHtml(getSkillBrowserLabel(item))}</b><em>${skillIcon("external-link")}</em></span>
          ${getSkillCoverMarkup(item)}
          <span class="repo-cover-shade" aria-hidden="true"></span>
          <span class="repo-index">${String(index + 1).padStart(2, "0")}</span>
          <span class="repo-cover-caption"><strong>${escapeHtml(getSkillVisual(item))}</strong><small>${escapeHtml(getCategoryLabel(item.category))}</small></span>
        </a>
        <div class="repo-card-body">
          <div class="repo-main">
            <p class="repo-category">${escapeHtml(getCategoryLabel(item.category))}</p>
            <a href="${escapeHtml(buildSkillDetailHref(item.slug))}" data-skill-detail="${item.slug}">${escapeHtml(item.title)}<span class="repo-verified" aria-label="Curated skill">${skillIcon("badge-check")}</span></a>
            <p class="repo-description">${escapeHtml(state.currentLanguage === "en" ? (item.description || item.fallback) : item.fallback)}</p>
            <p class="repo-focus">${escapeHtml(item.focus)}</p>
          </div>
          <div class="repo-footer"><div class="repo-stats"><span title="GitHub Stars"><i aria-hidden="true">${skillIcon("star")}</i><small>GitHub Stars</small><b>${escapeHtml(item.starsLabel || formatNumber(item.stars))}</b></span><small>${formatDate(item.updatedAt)}</small></div><div class="repo-actions"><button class="repo-copy-btn" type="button" data-copy-invoke="${item.slug}" title="${state.currentLanguage === "en" ? "Copy the Codex clone command" : "复制 Codex 调用命令"}"><span>${state.currentLanguage === "en" ? "Copy command" : "复制调用"}</span><b aria-hidden="true">${skillIcon("plus")}</b></button></div></div>
        </div>
      </article>
    `).join("");
    repoList.querySelectorAll("[data-skill-detail]").forEach((link) => link.addEventListener("click", () => track("skill_detail_open", { repository: link.dataset.skillDetail })));
    repoList.querySelectorAll("[data-copy-invoke]").forEach((button) => button.addEventListener("click", () => copyCloneCommand(button)));
    repoList.querySelectorAll(".repo-cover-image").forEach((cover) => {
      cover.addEventListener("error", () => {
        cover.closest(".repo-row")?.classList.add("is-cover-missing");
        cover.remove();
      }, { once: true });
      if (cover.tagName === "VIDEO") {
        cover.muted = true;
        cover.play?.().catch(() => {});
      }
    });
    if (!items.length) repoList.innerHTML = `<p class="repo-empty">${state.currentLanguage === "en" ? "No matching skills. Try another keyword or category." : "没有找到匹配的 Skill，请换个关键词或分类。"}</p>`;
  }

  function renderDesignReferences() {
    const items = getFilteredWebsites();
    repoList.classList.add("is-web-list");
    const groups = designReferenceGroups.map((group) => ({ ...group, items: items.filter((item) => item.group === group.key) })).filter((group) => group.items.length);
    repoList.innerHTML = groups.map((group) => `
      <section class="web-reference-group">
        <header><div><span>${escapeHtml(group.key)}</span><h3>${escapeHtml(state.currentLanguage === "en" ? group.en : group.zh)}</h3></div><p>${escapeHtml(state.currentLanguage === "en" ? group.descriptionEn : group.descriptionZh)}</p><b>${String(group.items.length).padStart(2, "0")}</b></header>
        <div class="web-reference-grid">
          ${group.items.map((site, index) => `
            <article class="web-reference-card">
              <a class="web-reference-visual" href="${site.url}" target="_blank" rel="noreferrer" data-design-reference="${escapeHtml(site.domain)}" aria-label="${escapeHtml(site.name)}" style="--preview-ratio:${escapeHtml(site.previewRatio || "3 / 2")}">
                ${getWebsitePreviewMarkup(site)}
                <span class="web-reference-top"><span>${escapeHtml(state.currentLanguage === "en" ? group.en : group.zh)}</span><b>${String(index + 1).padStart(2, "0")}</b></span>
              </a>
              <div class="web-reference-body">
                <a class="web-reference-title" href="${site.url}" target="_blank" rel="noreferrer" data-design-reference="${escapeHtml(site.domain)}"><span>${escapeHtml(site.name)}</span><i aria-hidden="true">${skillIcon("external-link")}</i></a>
                <p class="web-reference-domain">${escapeHtml(site.domain)}${site.openSource ? `<span class="web-source-badge">${state.currentLanguage === "en" ? "Source code" : "有源代码"}</span>` : ""}</p>
                <p class="web-reference-description">${escapeHtml(state.currentLanguage === "en" ? site.descriptionEn : site.descriptionZh)}</p>
                <footer><span>${state.currentLanguage === "en" ? "Best for" : "适合用于"}</span><strong>${escapeHtml(state.currentLanguage === "en" ? site.focusEn : site.focusZh)}</strong></footer>
              </div>
            </article>
          `).join("")}
        </div>
      </section>
    `).join("");
    repoList.querySelectorAll("[data-web-preview]").forEach((preview) => {
      preview.addEventListener("error", () => {
        preview.closest(".web-reference-card")?.classList.add("is-preview-missing");
      }, { once: true });
      if (preview.tagName === "VIDEO") {
        preview.muted = true;
        preview.play?.().catch(() => {});
      }
    });
    repoList.querySelectorAll("[data-design-reference]").forEach((link) => link.addEventListener("click", () => track("design_reference_open", { website: link.dataset.designReference })));
    if (!items.length) repoList.innerHTML = `<p class="repo-empty">${state.currentLanguage === "en" ? "No matching websites. Try another keyword or purpose." : "没有找到匹配的网站，请换个关键词或用途。"}</p>`;
  }

  return { renderRepositories, renderInspector, selectRepository };
}
