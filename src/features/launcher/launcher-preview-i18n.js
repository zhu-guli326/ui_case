(() => {
  const previewRoot = document.querySelector('.preview-page');
  const language = () => (window.image2I18n?.language === 'en' || document.documentElement.lang.startsWith('en') ? 'en' : 'zh');

  const directionPreviewSizes = {
    fithub: [390, 844],
    organique: [390, 844],
    'plate-play': [390, 844],
    'volt-route': [390, 844],
  };

  const previewTranslations = new Map([
    ['首页', 'Home'],
    ['作品', 'Work'],
    ['方法', 'Method'],
    ['关于', 'About'],
    ['联系', 'Contact'],
    ['联系我们', 'Contact us'],
    ['查看项目 →', 'View projects →'],
    ['让每一个页面，都拥有同一种气质。', 'Give every page a consistent design character.'],
    ['清晰的颜色、字体、形状与间距，让设计不再从头开始。', 'Clear color, typography, shape, and spacing keep every page from starting over.'],
    ['01视觉方向', '01 Visual direction'],
    ['视觉方向', 'Visual direction'],
    ['用统一的视觉语言建立第一印象。', 'Establish the first impression with one visual language.'],
    ['02基础规范', '02 Foundation'],
    ['基础规范', 'Foundation'],
    ['把关键选择变成可以复用的规则。', 'Turn key decisions into reusable rules.'],
    ['03持续复用', '03 Reuse'],
    ['持续复用', 'Reuse'],
    ['让不同页面保持相同的设计气质。', 'Keep the same design character across pages.'],
    ['全部作品', 'All work'],
    ['品牌设计', 'Brand design'],
    ['界面设计', 'UI design'],
    ['动效', 'Motion'],
    ['菜单', 'Menu'],
    ['预览', 'Preview'],
    ['作品集', 'Portfolio'],
    ['管理', 'Manage'],
    ['团队协作', 'Team collaboration'],
    ['发布', 'Publish'],
    ['设置', 'Settings'],
    ['数据洞察', 'Analytics'],
    ['新品', 'New'],
    ['年度设计系统盘点', 'Annual design system review'],
    ['从色彩到圆角，一套可复用的界面规范。', 'A reusable interface system, from color to radius.'],
    ['查看', 'View'],
    ['方法论', 'Methodology'],
    ['界面气质的五种来源', 'Five sources of interface character'],
    ['方向、色彩、字体、形状与密度如何协同。', 'How direction, color, typography, shape, and density work together.'],
    ['免费', 'Free'],
    ['阅读', 'Read'],
    ['案例', 'Case'],
    ['把 DNA 应用到新页面', 'Apply DNA to a new page'],
    ['保留规范，只调整内容结构。', 'Keep the rules and only adjust the content structure.'],
    ['创建你的账户', 'Create your account'],
    ['名称', 'Name'],
    ['邮箱', 'Email'],
    ['使用场景', 'Use case'],
    ['个人学习', 'Personal learning'],
    ['客户项目', 'Client project'],
    ['同意接收设计月刊', 'Subscribe to the design monthly'],
    ['创建账户', 'Create account'],
    ['已有账户？直接登录。', 'Already have an account? Sign in.'],
    ['体验版', 'Starter'],
    ['基础预览', 'Basic preview'],
    ['社区支持', 'Community support'],
    ['开始使用', 'Get started'],
    ['推荐', 'Recommended'],
    ['工作室', 'Studio'],
    ['无限 DNA', 'Unlimited DNA'],
    ['组件级预览', 'Component previews'],
    ['提示词导出', 'Prompt export'],
    ['优先支持', 'Priority support'],
    ['立即订阅', 'Subscribe now'],
    ['企业', 'Enterprise'],
    ['定制', 'Custom'],
    ['私有部署', 'Private deployment'],
    ['品牌规范接入', 'Brand system integration'],
    ['专属顾问', 'Dedicated advisor'],
    ['联系销售', 'Contact sales'],
    ['本月访问', 'Visits this month'],
    ['复用 DNA', 'DNA reuses'],
    ['转化率', 'Conversion'],
    ['周一', 'Mon'],
    ['周二', 'Tue'],
    ['周三', 'Wed'],
    ['周四', 'Thu'],
    ['周五', 'Fri'],
    ['周六', 'Sat'],
    ['周日', 'Sun'],
    ['落地页 A', 'Landing A'],
    ['定价页 B', 'Pricing B'],
    ['导航 C', 'Navigation C'],
    ['克制 · 鼠尾草绿', 'Restrained · Sage green'],
    ['活力 · 暖珊瑚', 'Vivid · Warm coral'],
    ['编辑感 · 墨黑灰', 'Editorial · Ink black'],
    ['设计方法论', 'Design methodology'],
    ['一套 DNA 是如何生长的', 'How a design DNA grows'],
    ['林一设计', 'Lin Yi Design'],
    ['2026 年 8 月 · 6 分钟阅读', 'Aug 2026 · 6 min read'],
    ['每个产品第一次打开画布时都要回答同样的问题：主色是什么、标题用什么气质、卡片有多圆。没有 DNA 时，这些答案散落在每一次临时决定里。', 'Every product starts with the same questions: what is the primary color, what should headings feel like, and how rounded should cards be? Without DNA, those answers are scattered across one-off decisions.'],
    ['我们把答案压缩成五组变量——方向、颜色、字体、形状与密度。它们像基因一样进入每个新页面，决定气质，而不是规定布局。', 'We compress those answers into five groups of variables: direction, color, typography, shape, and density. They act like genes across new pages, shaping character without dictating layout.'],
    ['「规范不是限制，而是让下一次创作有迹可循。」', '“A system is not a constraint; it gives the next creation something to build on.”'],
    ['从方向到变量', 'From direction to variables'],
    ['先选一个方向确定整体气质，密度与留白随之匹配；再把颜色、字体、圆角与间距固化成可复用的规则。', 'Choose a direction to set the overall character, then align density and whitespace; finally turn color, typography, radius, and spacing into reusable rules.'],
    ['方向决定对比与留白的基调', 'Direction sets the baseline for contrast and whitespace'],
    ['颜色体系约束情绪与可用性', 'The color system balances mood and usability'],
    ['形状与密度控制阅读节奏', 'Shape and density control reading rhythm'],
    ['写下你身边的设计系统故事', 'Share a design system story around you'],
    ['关注', 'Follow'],
    ['日常护理精华 · 沙漠限定版', 'Daily Care Serum · Desert Edition'],
    ['¥129 包邮', '¥129 · Free shipping'],
    ['轻盈乳液质地，沙漠植萃系列包装，配套同色系礼盒。', 'A lightweight lotion texture with desert-botanical packaging and a matching gift box.'],
    ['颜色', 'Color'],
    ['尺寸', 'Size'],
    ['加入购物车', 'Add to cart'],
    ['收藏', 'Save'],
    ['质地', 'Texture'],
    ['轻盈乳液', 'Light lotion'],
    ['容量', 'Volume'],
    ['包装', 'Packaging'],
    ['可回收纸盒', 'Recyclable paper box'],
    ['通用设置', 'General settings'],
    ['这些偏好会跟随你的 DNA 一起保存。', 'These preferences are saved with your DNA.'],
    ['外观主题', 'Appearance'],
    ['预览画布与示例页面一起变化', 'Preview canvas and sample pages change together'],
    ['浅色', 'Light'],
    ['深色', 'Dark'],
    ['跟随系统', 'Follow system'],
    ['切换设备主题时自动同步', 'Sync automatically when the device theme changes'],
    ['新作品提醒', 'New work alerts'],
    ['关注的作者发布时通知我', 'Notify me when followed creators publish'],
    ['每周摘要', 'Weekly digest'],
    ['每周一发送上周的设计灵感', 'Send last week’s design inspiration every Monday'],
    ['界面语言', 'Interface language'],
    ['预览示例文案的显示语言', 'Language used in preview examples'],
    ['简体中文', 'Simplified Chinese'],
    ['退出登录', 'Sign out'],
    ['退出当前浏览器上的账户', 'Sign out of the account in this browser'],
    ['退出', 'Sign out'],
  ]);

  const previewPlaceholderTranslations = new Map([
    ['你的名字或团队', 'Your name or team'],
  ]);

  const fontGroupLabels = {
    zh: {
      system: '系统字体',
      'google-cjk': 'Google Fonts · 中文字体',
      'google-latin': 'Google Fonts · 拉丁字体',
    },
    en: {
      system: 'System / Local fonts',
      'google-cjk': 'Google Fonts · CJK',
      'google-latin': 'Google Fonts · Latin',
    },
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

  function syncDocumentLanguageMeta() {
    const isEnglish = language() === 'en';
    document.title = isEnglish ? 'Interface DNA · ONDesign' : '界面设计 DNA · ONDesign';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = isEnglish
      ? 'Build and save a reusable interface Design DNA before frontend development.'
      : '在开始前端开发前，搭建并保存一套可复用的界面设计 DNA。';
  }

  function syncFontSelectLanguage() {
    const select = document.querySelector('[data-font-select]');
    const presets = Array.isArray(window.ONDesignFontPresets) ? window.ONDesignFontPresets : [];
    if (!select || !presets.length) return;

    const currentLanguage = language();
    const presetById = new Map(presets.map((preset) => [preset.id, preset]));
    select.setAttribute('aria-label', currentLanguage === 'en' ? 'Typography' : '字体');

    select.querySelectorAll('optgroup').forEach((group) => {
      const firstOption = group.querySelector('option');
      const groupKey = presetById.get(firstOption?.value)?.group;
      if (groupKey && fontGroupLabels[currentLanguage][groupKey]) {
        group.label = fontGroupLabels[currentLanguage][groupKey];
      }
    });

    [...select.options].forEach((option) => {
      const preset = presetById.get(option.value);
      if (!preset) return;
      option.textContent = currentLanguage === 'en' ? preset.en : preset.zh;
      option.title = currentLanguage === 'en' ? preset.descEn : preset.descZh;
    });
  }

  function syncStaticLauncherCopy() {
    const isEnglish = language() === 'en';
    const trigger = document.querySelector('[data-ds-trigger]');
    const triggerSmall = trigger?.querySelector('small');
    const note = document.querySelector('[data-design-system-field] .ds-note');
    const hasAppliedDesignSystem = Boolean(document.body.dataset.designSystem);

    if (triggerSmall && !hasAppliedDesignSystem) {
      triggerSmall.textContent = isEnglish
        ? 'Choose a foundation, then fine-tune design tokens'
        : '先选基础规范，再微调设计变量';
    }

    if (note) {
      note.textContent = isEnglish
        ? 'Every source is normalized for UI Coding first. Brand websites and historical pages keep reusable visual cues without directly inheriting marketing-scale tokens. Source: VoltAgent/awesome-design-md (MIT).'
        : '所有来源都会先做界面编码适配；品牌官网与历史页面只保留可复用的视觉特征，不直接继承营销页面的设计变量。来源：VoltAgent/awesome-design-md（MIT）。';
    }
  }

  function syncControlAriaLabels() {
    const isEnglish = language() === 'en';
    document.querySelector('.dna-controls')?.setAttribute('aria-label', isEnglish ? 'Interface DNA controls' : '界面 DNA 设置');
    document.querySelector('[data-choice-group="palette"]')?.setAttribute('aria-label', isEnglish ? 'Color palette' : '颜色方案');
    document.querySelector('.direction-grid')?.setAttribute('aria-label', isEnglish ? 'Interface style' : '界面风格');
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

  function translatePreviewSamples() {
    if (!previewRoot) return;

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
      const original = node.nodeValue;
      const trimmed = original.trim();
      const translated = previewTranslations.get(trimmed);
      if (!translated) continue;
      const leading = original.match(/^\s*/)?.[0] || '';
      const trailing = original.match(/\s*$/)?.[0] || '';
      node.nodeValue = `${leading}${translated}${trailing}`;
    }

    previewRoot.querySelectorAll('[placeholder]').forEach((element) => {
      const translated = previewPlaceholderTranslations.get(element.getAttribute('placeholder') || '');
      if (translated) element.setAttribute('placeholder', translated);
    });

    previewRoot.dataset.translated = 'true';
  }

  function sync() {
    syncDocumentLanguageMeta();
    syncFontSelectLanguage();
    syncStaticLauncherCopy();
    syncControlAriaLabels();
    installCaseDialogLinks();
    syncLanguageLinks();
    syncDirectionPreviewSizes();
    syncWorkspaceAlignment();
    translatePreviewSamples();
  }

  window.addEventListener('resize', () => {
    syncDirectionPreviewSizes();
    syncWorkspaceAlignment();
  });
  window.addEventListener('image2:languagechange', sync);
  window.addEventListener('load', sync, { once: true });

  sync();
})();