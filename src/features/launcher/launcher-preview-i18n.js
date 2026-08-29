(() => {
  const scriptUrl = document.currentScript?.src || window.location.href;
  const previewRoot = document.querySelector('.preview-page');
  const FONT_STORAGE_KEY = 'ondesign:launcher-font-preset:v2';

  const language = () => (window.image2I18n?.language === 'en' || document.documentElement.lang.startsWith('en') ? 'en' : 'zh');
  const text = (zh, en) => (language() === 'en' ? en : zh);

  const directionPreviewSizes = {
    fithub: [390, 844],
    organique: [390, 844],
    'plate-play': [390, 844],
    'volt-route': [390, 844],
  };

  const fontPresets = [
    {
      id: 'system-sans', base: 'sans', zh: '系统无衬线', en: 'System sans',
      descZh: 'System UI · PingFang SC', descEn: 'System UI · PingFang SC',
      stack: 'system-ui,-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif'
    },
    {
      id: 'songti', base: 'serif', zh: '宋体', en: 'Songti',
      descZh: 'Songti SC · SimSun', descEn: 'Songti SC · SimSun',
      stack: '"Songti SC","STSong","SimSun","Noto Serif SC",Georgia,serif'
    },
    {
      id: 'mono', base: 'mono', zh: '等宽', en: 'Monospace',
      descZh: 'SFMono · Consolas', descEn: 'SFMono · Consolas',
      stack: 'ui-monospace,"SFMono-Regular",Consolas,"Liberation Mono",monospace'
    },
    {
      id: 'hei', base: 'hei', zh: '黑体', en: 'Heiti',
      descZh: 'SimHei · Microsoft YaHei', descEn: 'SimHei · Microsoft YaHei',
      stack: '"SimHei","Microsoft YaHei","PingFang SC","Noto Sans SC",sans-serif'
    },
    {
      id: 'kaiti', base: 'kai', zh: '楷体', en: 'Kaiti',
      descZh: 'Kaiti SC · KaiTi', descEn: 'Kaiti SC · KaiTi',
      stack: '"Kaiti SC","STKaiti",KaiTi,"TW-Kai",cursive'
    },
    {
      id: 'fangsong', base: 'fangsong', zh: '仿宋', en: 'Fangsong',
      descZh: 'STFangsong · FangSong', descEn: 'STFangsong · FangSong',
      stack: '"Fangsong SC","STFangsong",FangSong,"SimSun",serif'
    },
    {
      id: 'yuan', base: 'yuan', zh: '圆体', en: 'Rounded CJK',
      descZh: 'Yuanti SC · YouYuan', descEn: 'Yuanti SC · YouYuan',
      stack: '"Yuanti SC",YouYuan,"PingFang SC","Microsoft YaHei",sans-serif'
    },
    {
      id: 'geometric', base: 'geometric', zh: '几何无衬线', en: 'Geometric sans',
      descZh: 'Futura · Century Gothic', descEn: 'Futura · Century Gothic',
      stack: 'Futura,"Century Gothic","Avenir Next","Trebuchet MS",sans-serif'
    },
    {
      id: 'noto-sans-sc', base: 'hei', zh: 'Noto Sans SC', en: 'Noto Sans SC',
      descZh: 'Google Fonts · 中文无衬线', descEn: 'Google Fonts · CJK sans',
      stack: '"Noto Sans SC","Source Han Sans SC","PingFang SC","Microsoft YaHei",sans-serif'
    },
    {
      id: 'noto-serif-sc', base: 'serif', zh: 'Noto Serif SC', en: 'Noto Serif SC',
      descZh: 'Google Fonts · 中文衬线', descEn: 'Google Fonts · CJK serif',
      stack: '"Noto Serif SC","Source Han Serif SC","Songti SC","SimSun",serif'
    },
    {
      id: 'zcool-qingke', base: 'hei', zh: 'ZCOOL QingKe HuangYou', en: 'ZCOOL QingKe HuangYou',
      descZh: 'Google Fonts · 中文标题', descEn: 'Google Fonts · CJK display',
      stack: '"ZCOOL QingKe HuangYou","Noto Sans SC","Microsoft YaHei",sans-serif'
    },
    {
      id: 'zcool-xiaowei', base: 'serif', zh: 'ZCOOL XiaoWei', en: 'ZCOOL XiaoWei',
      descZh: 'Google Fonts · 中文衬线', descEn: 'Google Fonts · CJK serif',
      stack: '"ZCOOL XiaoWei","Noto Serif SC","Songti SC",serif'
    },
    {
      id: 'ma-shan-zheng', base: 'kai', zh: 'Ma Shan Zheng', en: 'Ma Shan Zheng',
      descZh: 'Google Fonts · 中文手写', descEn: 'Google Fonts · CJK handwriting',
      stack: '"Ma Shan Zheng","Kaiti SC",KaiTi,cursive'
    },
    {
      id: 'long-cang', base: 'kai', zh: 'Long Cang', en: 'Long Cang',
      descZh: 'Google Fonts · 中文书写', descEn: 'Google Fonts · CJK handwriting',
      stack: '"Long Cang","Kaiti SC",KaiTi,cursive'
    },
    {
      id: 'liu-jian-mao-cao', base: 'kai', zh: 'Liu Jian Mao Cao', en: 'Liu Jian Mao Cao',
      descZh: 'Google Fonts · 中文草书', descEn: 'Google Fonts · CJK cursive',
      stack: '"Liu Jian Mao Cao","Kaiti SC",KaiTi,cursive'
    },
    {
      id: 'zhi-mang-xing', base: 'kai', zh: 'Zhi Mang Xing', en: 'Zhi Mang Xing',
      descZh: 'Google Fonts · 中文行书', descEn: 'Google Fonts · CJK running script',
      stack: '"Zhi Mang Xing","Kaiti SC",KaiTi,cursive'
    },
  ];

  let fontSelect = null;
  let activeFontId = 'system-sans';
  let designBootstrap = null;
  let designImportPromise = null;

  function syncDirectionPreviewSizes() {
    document.querySelectorAll('.direction-live').forEach((wrap) => {
      const [width, height] = directionPreviewSizes[wrap.dataset.demo] || [390, 844];
      const frame = wrap.querySelector('iframe');
      wrap.style.aspectRatio = `${width} / ${height}`;
      if (!frame) return;
      frame.style.width = `${width}px`;
      frame.style.height = `${height}px`;
      const scale = wrap.clientWidth ? wrap.clientWidth / width : 1;
      wrap.style.setProperty('--demo-scale', String(scale));
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
    try { return new URL(link?.getAttribute('href') || '', window.location.href).searchParams.get('case') || ''; }
    catch { return ''; }
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
    } else dialog.setAttribute('open', '');
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
      const caseId = currentCaseIdFromLink(link);
      link.href = buildLibraryUrl(caseId);
    });
    const dialog = document.querySelector('[data-case-library-dialog]');
    if (dialog?.dataset.caseId) {
      const url = buildLibraryUrl(dialog.dataset.caseId);
      document.querySelector('[data-case-library-frame]')?.setAttribute('src', url);
      document.querySelector('[data-case-library-full]')?.setAttribute('href', url);
    }
  }

  function selectedFontPreset() {
    return fontPresets.find((item) => item.id === activeFontId) || fontPresets[0];
  }

  function updatePromptTypography(preset) {
    const prompt = document.querySelector('#dnaPrompt');
    if (!prompt) return;
    const label = language() === 'en' ? preset.en : preset.zh;
    const line = language() === 'en' ? `Typography: ${label}` : `字体：${label}`;
    const pattern = language() === 'en' ? /^Typography:.*$/m : /^字体：.*$/m;
    if (pattern.test(prompt.textContent)) prompt.textContent = prompt.textContent.replace(pattern, line);
  }

  function reapplyFontOverride() {
    const preset = selectedFontPreset();
    document.documentElement.style.setProperty('--dna-display', preset.stack);
    const dock = document.querySelector('#dockFont');
    if (dock) dock.textContent = language() === 'en' ? preset.en : preset.zh;
    const rules = document.querySelector('[data-section-value="rules"]');
    if (rules) {
      const palette = (rules.textContent || '').split(' · ')[0] || text('配色', 'Palette');
      rules.textContent = `${palette} · ${language() === 'en' ? preset.en : preset.zh}`;
    }
    updatePromptTypography(preset);
  }

  function renderFontOptions() {
    if (!fontSelect) return;
    const current = activeFontId;
    fontSelect.replaceChildren(...fontPresets.map((preset) => {
      const option = document.createElement('option');
      option.value = preset.id;
      const label = language() === 'en' ? preset.en : preset.zh;
      const desc = language() === 'en' ? preset.descEn : preset.descZh;
      option.textContent = `${label} · ${desc}`;
      return option;
    }));
    fontSelect.value = fontPresets.some((item) => item.id === current) ? current : fontPresets[0].id;
    fontSelect.setAttribute('aria-label', text('字体', 'Typography'));
  }

  function installFontSelect() {
    const field = document.querySelector('.font-field');
    const list = field?.querySelector('.type-list');
    if (!field || !list) return;

    let control = field.querySelector('.font-select-control');
    if (!control) {
      control = document.createElement('div');
      control.className = 'select-control font-select-control';
      fontSelect = document.createElement('select');
      fontSelect.dataset.fontCompactSelect = '';
      control.append(fontSelect);
      list.before(control);
    } else fontSelect = control.querySelector('select');

    list.style.display = 'none';
    try {
      const saved = JSON.parse(localStorage.getItem(FONT_STORAGE_KEY) || 'null');
      if (saved?.id && fontPresets.some((item) => item.id === saved.id)) activeFontId = saved.id;
      else {
        const selectedBase = list.querySelector('button.is-selected[data-value]')?.dataset.value;
        activeFontId = fontPresets.find((item) => item.base === selectedBase)?.id || 'system-sans';
      }
    } catch {}

    renderFontOptions();
    if (fontSelect.dataset.bound !== 'true') {
      fontSelect.dataset.bound = 'true';
      fontSelect.addEventListener('change', () => {
        const preset = fontPresets.find((item) => item.id === fontSelect.value) || fontPresets[0];
        activeFontId = preset.id;
        const baseButton = list.querySelector(`button[data-value="${preset.base}"]`);
        baseButton?.click();
        try { localStorage.setItem(FONT_STORAGE_KEY, JSON.stringify({ id: preset.id })); } catch {}
        window.requestAnimationFrame(reapplyFontOverride);
      });
    }
    window.requestAnimationFrame(reapplyFontOverride);
  }

  function ensureDesignBootstrap() {
    const rulesBody = document.querySelector('#dna-rules .dna-section-body');
    if (!rulesBody) return null;
    if (document.querySelector('[data-design-system-field]')) return null;
    designBootstrap = rulesBody.querySelector('[data-design-system-bootstrap]');
    if (!designBootstrap) {
      designBootstrap = document.createElement('fieldset');
      designBootstrap.className = 'ds-bootstrap-field';
      designBootstrap.dataset.designSystemBootstrap = '';
      designBootstrap.style.cssText = 'margin:0 0 16px;padding:0;border:0';
      designBootstrap.innerHTML = `
        <legend style="margin:0 0 8px;padding:0;font-size:13px;font-weight:600">${text('设计规范', 'Design system')}</legend>
        <button type="button" data-ds-bootstrap-button style="display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;width:100%;min-height:58px;padding:10px 12px;border:1px solid #d9d9d9;border-radius:8px;background:#fff;text-align:left">
          <span style="display:grid;gap:2px;min-width:0"><strong>${text('73 套设计规范', '73 design systems')}</strong><small data-ds-bootstrap-status style="color:#737373;font-size:11px">${text('正在加载真实网站 DESIGN.md…', 'Loading real-site DESIGN.md presets…')}</small></span>
          <span aria-hidden="true" style="font-size:18px;color:#777">⌄</span>
        </button>`;
      rulesBody.prepend(designBootstrap);
      designBootstrap.querySelector('[data-ds-bootstrap-button]')?.addEventListener('click', () => loadDesignSystemLibrary(true));
    }
    return designBootstrap;
  }

  function setDesignBootstrapStatus(message) {
    const node = designBootstrap?.querySelector('[data-ds-bootstrap-status]');
    if (node) node.textContent = message;
  }

  async function loadDesignSystemLibrary(force = false) {
    ensureDesignBootstrap();
    if (window.ONDesignDesignSystems?.open) {
      designBootstrap?.remove();
      if (force) window.ONDesignDesignSystems.open();
      return;
    }
    if (designImportPromise && !force) return designImportPromise;
    setDesignBootstrapStatus(text('正在加载 73 套真实网站 DESIGN.md…', 'Loading 73 real-site DESIGN.md presets…'));
    const moduleUrl = new URL(`./launcher-design-systems.js?v=20260829-ds-v4${force ? `&retry=${Date.now()}` : ''}`, scriptUrl).href;
    designImportPromise = import(moduleUrl)
      .then(() => {
        if (document.querySelector('[data-design-system-field]')) {
          designBootstrap?.remove();
          designBootstrap = null;
          if (force) window.ONDesignDesignSystems?.open?.();
        } else {
          setDesignBootstrapStatus(text('规范库已加载，点击打开', 'Design system library loaded — click to open'));
        }
      })
      .catch((error) => {
        console.error('[ONDesign] design system library failed to load', error);
        setDesignBootstrapStatus(text('加载失败，点击重试', 'Load failed — click to retry'));
        designImportPromise = null;
      });
    return designImportPromise;
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
    syncDirectionPreviewSizes();
    syncWorkspaceAlignment();
    installFontSelect();
    renderFontOptions();
    window.requestAnimationFrame(reapplyFontOverride);
    ensureDesignBootstrap();
    loadDesignSystemLibrary(false);
    translatePreviewSamples();
  }

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.font-select-control') && activeFontId) window.requestAnimationFrame(reapplyFontOverride);
  });
  document.addEventListener('change', () => window.requestAnimationFrame(reapplyFontOverride));
  window.addEventListener('resize', () => {
    syncDirectionPreviewSizes();
    syncWorkspaceAlignment();
  });
  window.addEventListener('image2:languagechange', sync);
  window.addEventListener('load', () => {
    syncDirectionPreviewSizes();
    syncWorkspaceAlignment();
  }, { once: true });

  sync();
})();