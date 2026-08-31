(() => {
  const previewRoot = document.querySelector('.preview-page');
  const language = () => (window.image2I18n?.language === 'en' || document.documentElement.lang.startsWith('en') ? 'en' : 'zh');

  const directionPreviewSizes = {
    fithub: [390, 844],
    organique: [390, 844],
    'plate-play': [390, 844],
    'volt-route': [390, 844],
  };

  function syncDirectionPreviewSizes() {
    document.querySelectorAll('.direction-live').forEach((wrap) => {
      const [width, height] = directionPreviewSizes[wrap.dataset.demo] || [390, 844];
      const frame = wrap.querySelector('iframe');
      wrap.style.aspectRatio = `${width} / ${height}`;
      if (!frame) return;
      frame.style.width = `${width}px`;
      frame.style.height = `${height}px`;
      wrap.style.setProperty('--demo-scale', String(wrap.clientWidth ? wrap.clientWidth / width : 1));
    });
  }

  function syncWorkspaceAlignment() {
    const controls = document.querySelector('.dna-controls');
    const canvas = document.querySelector('.dna-canvas');
    const browser = document.querySelector('.preview-browser');
    if (!controls || !canvas || !browser) return;
    if (window.matchMedia('(max-width: 1024px)').matches) {
      controls.style.marginTop = '0px';
      return;
    }
    const offset = Math.max(0, Math.round(browser.getBoundingClientRect().top - canvas.getBoundingClientRect().top));
    controls.style.marginTop = `${offset}px`;
  }

  function buildLibraryUrl(caseId = '') {
    const params = new URLSearchParams({ lang: language() });
    if (caseId) params.set('case', caseId);
    return `./library.html?${params.toString()}`;
  }

  function currentCaseIdFromLink(link) {
    if (link?.dataset.directionCardCase) return link.dataset.directionCardCase;
    try {
      return new URL(link?.getAttribute('href') || '', window.location.href).searchParams.get('case') || '';
    } catch {
      return '';
    }
  }

  function openCaseLibrary(caseId = '') {
    const dialog = document.querySelector('[data-case-library-dialog]');
    const frame = document.querySelector('[data-case-library-frame]');
    const fullLink = document.querySelector('[data-case-library-full]');
    if (!dialog) return;
    dialog.dataset.caseId = caseId;
    const url = buildLibraryUrl(caseId);
    if (frame) frame.src = url;
    if (fullLink) fullLink.href = url;
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  function installCaseDialogLinks() {
    document.querySelectorAll('[data-direction-case-link], [data-direction-card-case]').forEach((link) => {
      if (link.dataset.caseDialogBound === 'true') return;
      link.dataset.caseDialogBound = 'true';
      link.removeAttribute('target');
      link.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        openCaseLibrary(currentCaseIdFromLink(link));
      });
    });
  }

  function syncLanguageLinks() {
    const lang = language();
    document.querySelectorAll('.direction-live iframe').forEach((frame) => {
      const current = frame.getAttribute('src') || '';
      const path = current.split('?')[0];
      const next = `${path}?embed=1&lang=${lang}`;
      if (current !== next) frame.setAttribute('src', next);
    });
    document.querySelectorAll('a[href*="library.html?case="]').forEach((link) => {
      link.href = buildLibraryUrl(currentCaseIdFromLink(link));
    });
    const dialog = document.querySelector('[data-case-library-dialog]');
    if (dialog?.dataset.caseId) {
      const url = buildLibraryUrl(dialog.dataset.caseId);
      document.querySelector('[data-case-library-frame]')?.setAttribute('src', url);
      document.querySelector('[data-case-library-full]')?.setAttribute('href', url);
    }
  }

  function syncFontSelectLanguage() {
    const select = document.querySelector('[data-font-select]');
    const presets = window.ONDesignFontPresets;
    if (!select || !Array.isArray(presets) || !presets.length) return;

    const lang = language();
    const presetById = new Map(presets.map((preset) => [preset.id, preset]));
    [...select.options].forEach((option) => {
      const preset = presetById.get(option.value);
      if (!preset) return;
      option.textContent = lang === 'en' ? preset.en : preset.zh;
    });

    const groupLabels = lang === 'en'
      ? ['System / local fonts', 'Google Fonts · CJK', 'Google Fonts · Latin']
      : ['系统 / 本机字体', 'Google Fonts · 中文', 'Google Fonts · 英文'];
    [...select.querySelectorAll('optgroup')].forEach((group, index) => {
      if (groupLabels[index]) group.label = groupLabels[index];
    });
    select.setAttribute('aria-label', lang === 'en' ? 'Typography' : '字体');
  }

  function translatePreviewSamples() {
    if (!previewRoot) return;
    const pairs = [
      ['让每一个页面，都拥有同一种气质。', 'Give every page a consistent design character.'],
      ['清晰的颜色、字体、形状与间距，让设计不再从头开始。', 'Clear color, typography, shape, and spacing keep every page from starting over.'],
      ['用统一的视觉语言建立第一印象。', 'Establish the first impression with one visual language.'],
      ['把关键选择变成可以复用的规则。', 'Turn key decisions into reusable rules.'],
      ['让不同页面保持相同的设计气质。', 'Keep the same design character across pages.'],
      ['视觉方向', 'Visual direction'], ['基础规范', 'Foundation'], ['持续复用', 'Reuse'],
      ['首页', 'Home'], ['作品', 'Work'], ['服务', 'Services'], ['关于', 'About'], ['联系', 'Contact'],
      ['联系我们', 'Contact us'], ['全部作品', 'All work'], ['品牌设计', 'Brand design'], ['界面设计', 'UI design'],
      ['创建你的账户', 'Create your account'], ['名称', 'Name'], ['邮箱', 'Email'], ['使用场景', 'Use case'],
      ['个人学习', 'Personal learning'], ['团队协作', 'Team collaboration'], ['客户项目', 'Client project'],
      ['创建账户', 'Create account'], ['退出登录', 'Sign out'], ['退出', 'Sign out'],
      ['浅色', 'Light'], ['深色', 'Dark'], ['跟随系统', 'Follow system'], ['界面语言', 'Interface language'],
    ];

    if (!previewRoot.dataset.originalHtml) previewRoot.dataset.originalHtml = previewRoot.innerHTML;
    if (language() === 'zh') {
      if (previewRoot.dataset.translated === 'true') {
        previewRoot.innerHTML = previewRoot.dataset.originalHtml;
        previewRoot.dataset.translated = 'false';
      }
      return;
    }
    if (previewRoot.dataset.translated === 'true') return;
    const walker = document.createTreeWalker(previewRoot, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      let value = node.nodeValue;
      pairs.forEach(([zh, en]) => { value = value.split(zh).join(en); });
      node.nodeValue = value;
    }
    previewRoot.dataset.translated = 'true';
  }

  function sync() {
    installCaseDialogLinks();
    syncLanguageLinks();
    syncFontSelectLanguage();
    syncDirectionPreviewSizes();
    syncWorkspaceAlignment();
    translatePreviewSamples();
  }

  window.addEventListener('resize', () => {
    syncDirectionPreviewSizes();
    syncWorkspaceAlignment();
  });
  window.addEventListener('image2:languagechange', sync);
  window.addEventListener('ondesign:fontpresetsready', syncFontSelectLanguage);
  window.addEventListener('load', sync, { once: true });

  sync();
})();
