(() => {
  const previewRoot = document.querySelector('.preview-page');
  if (!previewRoot) return;

  const dictionary = {
    '每个产品第一次打开画布时都要回答同样的问题：主色是什么、标题用什么气质、卡片有多圆。没有 DNA 时，这些答案散落在每一次临时决定里。': 'Every product faces the same questions when a canvas opens for the first time: What is the accent color? What should the headline feel like? How rounded should the cards be? Without DNA, those answers get scattered across one-off decisions.',
    '我们把答案压缩成五组变量——方向、颜色、字体、形状与密度。它们像基因一样进入每个新页面，决定气质，而不是规定布局。': 'We compress those answers into five variable groups—direction, color, typography, shape, and density. Like genes, they flow into every new page to shape its character without dictating the layout.',
    '先选一个方向确定整体气质，密度与留白随之匹配；再把颜色、字体、圆角与间距固化成可复用的规则。': 'Choose a direction to set the overall character first; density and whitespace follow. Then lock color, typography, radius, and spacing into reusable rules.',
    '清晰的颜色、字体、形状与间距，让设计不再从头开始。': 'Clear color, typography, shape, and spacing keep every page from starting over.',
    '让每一个页面，都拥有同一种气质。': 'Give every page a consistent design character.',
    '方向、色彩、字体、形状与密度如何协同。': 'How direction, color, type, shape, and density work together.',
    '从色彩到圆角，一套可复用的界面规范。': 'A reusable UI foundation, from color to radius.',
    '这些偏好会跟随你的 DNA 一起保存。': 'These preferences are saved with your DNA.',
    '轻盈乳液质地，沙漠植萃系列包装，配套同色系礼盒。': 'A lightweight lotion texture with desert botanical packaging and a matching gift box.',
    '预览画布与示例页面一起变化': 'Preview canvas and sample pages change together',
    '切换设备主题时自动同步': 'Sync automatically when your device theme changes',
    '关注的作者发布时通知我': 'Notify me when followed creators publish',
    '每周一发送上周的设计灵感': 'Send last week’s inspiration every Monday',
    '预览示例文案的显示语言': 'Language used by preview copy',
    '退出当前浏览器上的账户': 'Sign out of this browser',
    '用统一的视觉语言建立第一印象。': 'Establish the first impression with one visual language.',
    '把关键选择变成可以复用的规则。': 'Turn key decisions into reusable rules.',
    '让不同页面保持相同的设计气质。': 'Keep the same design character across pages.',
    '保留规范，只调整内容结构。': 'Keep the foundation; change only the content structure.',
    '已有账户？直接登录。': 'Already have an account? Sign in.',
    '写下你身边的设计系统故事': 'Tell the design-system stories around you',
    '方向决定对比与留白的基调': 'Direction sets the baseline for contrast and whitespace',
    '颜色体系约束情绪与可用性': 'Color constrains mood and usability',
    '形状与密度控制阅读节奏': 'Shape and density control reading rhythm',
    '「规范不是限制，而是让下一次创作有迹可循。」': '“A system is not a restriction; it gives the next creation a trail to follow.”',
    '2026 年 8 月 · 6 分钟阅读': 'Aug 2026 · 6 min read',
    '日常护理精华 · 沙漠限定版': 'Daily Care Serum · Desert Edition',
    '年度设计系统盘点': 'Annual design system review',
    '界面气质的五种来源': 'Five sources of interface character',
    '把 DNA 应用到新页面': 'Apply DNA to a new page',
    '一套 DNA 是如何生长的': 'How a DNA system grows',
    '从方向到变量': 'From direction to variables',
    '日常护理精华': 'Daily Care Serum',
    '轻盈乳液': 'Lightweight lotion',
    '可回收纸盒': 'Recyclable paper box',
    '创建你的账户': 'Create your account',
    '同意接收设计月刊': 'Receive the monthly design digest',
    '个人学习': 'Personal learning',
    '团队协作': 'Team collaboration',
    '客户项目': 'Client project',
    '你的名字或团队': 'Your name or team',
    '全部作品': 'All work',
    '品牌设计': 'Brand design',
    '界面设计': 'UI design',
    '作品集管理': 'Portfolio',
    '发布设置': 'Publishing',
    '数据洞察': 'Insights',
    '菜单预览': 'Menu preview',
    '联系我们': 'Contact us',
    '设计方法论': 'Design methodology',
    '通用设置': 'General settings',
    '外观主题': 'Appearance',
    '跟随系统': 'Follow system',
    '新作品提醒': 'New work alerts',
    '每周摘要': 'Weekly digest',
    '界面语言': 'Interface language',
    '简体中文': 'Simplified Chinese',
    '退出登录': 'Sign out',
    '加入购物车': 'Add to cart',
    '收藏': 'Save',
    '颜色': 'Color',
    '尺寸': 'Size',
    '质地': 'Texture',
    '容量': 'Volume',
    '包装': 'Packaging',
    '包邮': 'Free shipping',
    '本月访问': 'Visits this month',
    '复用 DNA': 'Reused DNA',
    '转化率': 'Conversion rate',
    '落地页 A': 'Landing A',
    '定价页 B': 'Pricing B',
    '导航 C': 'Nav C',
    '克制 · 鼠尾草绿': 'Restrained · Sage green',
    '活力 · 暖珊瑚': 'Vivid · Warm coral',
    '编辑感 · 墨黑灰': 'Editorial · Ink black',
    '体验版': 'Starter',
    '工作室': 'Studio',
    '企业': 'Enterprise',
    '推荐': 'Recommended',
    '3 套 DNA': '3 DNA presets',
    '基础预览': 'Basic preview',
    '社区支持': 'Community support',
    '无限 DNA': 'Unlimited DNA',
    '组件级预览': 'Component previews',
    '提示词导出': 'Prompt export',
    '优先支持': 'Priority support',
    '私有部署': 'Private deployment',
    '品牌规范接入': 'Brand system integration',
    '专属顾问': 'Dedicated advisor',
    '开始使用': 'Get started',
    '立即订阅': 'Subscribe',
    '联系销售': 'Contact sales',
    '定制': 'Custom',
    '/月': '/mo',
    '周一': 'Mon', '周二': 'Tue', '周三': 'Wed', '周四': 'Thu', '周五': 'Fri', '周六': 'Sat', '周日': 'Sun',
    '新品': 'New',
    '方法论': 'Method',
    '案例': 'Case study',
    '免费': 'Free',
    '阅读': 'Read',
    '查看': 'View',
    '创建账户': 'Create account',
    '名称': 'Name',
    '邮箱': 'Email',
    '使用场景': 'Use case',
    '首页': 'Home',
    '商店': 'Shop',
    '作品': 'Work',
    '方法': 'Method',
    '服务': 'Services',
    '关于': 'About',
    '联系': 'Contact',
    '动效': 'Motion',
    '查看项目': 'View projects',
    '视觉方向': 'Visual direction',
    '基础规范': 'Foundation',
    '持续复用': 'Reuse',
    '林一设计': 'Lin Yi Design',
    '关注': 'Follow',
    '浅色': 'Light',
    '深色': 'Dark',
    '退出': 'Sign out',
    '界面 DNA 设置': 'Interface DNA settings',
    '界面风格': 'Interface style',
    '颜色方案': 'Color scheme',
    '选择预览页面或组件': 'Choose a page or component to preview',
    '预览设备': 'Preview device',
    '当前设计 DNA': 'Current design DNA',
    '设计 DNA 预设': 'Design DNA presets'
  };

  const imageAltDictionary = {
    '城市高楼建筑实景': 'City architecture photo',
    '城市人物摄影': 'Urban portrait photo',
    '咖啡店室内空间摄影': 'Cafe interior photo',
    '沙漠公路旅行摄影': 'Desert road travel photo',
    '林一设计头像': 'Lin Yi Design avatar',
    '现代设计工作室实景': 'Modern design studio photo',
    '沙漠场景中的护理产品摄影': 'Care product photographed in a desert setting',
    '护理产品主视图': 'Care product main view',
    '花卉场景产品氛围图': 'Floral product mood image',
    '建筑场景产品氛围图': 'Architectural product mood image'
  };

  const entries = Object.entries(dictionary).sort((a, b) => b[0].length - a[0].length);
  const originals = new WeakMap();
  const attrOriginals = new WeakMap();
  const translate = (value) => entries.reduce((result, [zh, en]) => result.split(zh).join(en), value);
  let fontSelect = null;
  let fontList = null;
  let fontObserver = null;

  function language() {
    return window.image2I18n?.language === 'en' || document.documentElement.lang.startsWith('en') ? 'en' : 'zh';
  }

  function syncPreviewCopy() {
    const lang = language();
    const walker = document.createTreeWalker(previewRoot, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!originals.has(node)) originals.set(node, node.nodeValue);
      const original = originals.get(node);
      node.nodeValue = lang === 'en' ? translate(original) : original;
    }

    document.querySelectorAll('.dna-app [placeholder], .dna-app [aria-label]').forEach((element) => {
      if (!attrOriginals.has(element)) {
        attrOriginals.set(element, {
          placeholder: element.getAttribute('placeholder'),
          ariaLabel: element.getAttribute('aria-label')
        });
      }
      const original = attrOriginals.get(element);
      if (original.placeholder != null) element.setAttribute('placeholder', lang === 'en' ? translate(original.placeholder) : original.placeholder);
      if (original.ariaLabel != null) element.setAttribute('aria-label', lang === 'en' ? translate(original.ariaLabel) : original.ariaLabel);
    });

    previewRoot.querySelectorAll('img[alt]').forEach((image) => {
      if (!image.dataset.originalAlt) image.dataset.originalAlt = image.getAttribute('alt') || '';
      const original = image.dataset.originalAlt;
      image.alt = lang === 'en' ? (imageAltDictionary[original] || translate(original)) : original;
    });

    const dnaName = document.querySelector('#dnaName');
    if (dnaName && ['克制绿 · Web DNA', 'Restrained Green · Web DNA'].includes(dnaName.value)) {
      dnaName.value = lang === 'en' ? 'Restrained Green · Web DNA' : '克制绿 · Web DNA';
    }

    document.title = lang === 'en' ? 'Interface DNA · ONDesign' : '界面设计 DNA · ONDesign';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = lang === 'en'
      ? 'Build and save a reusable interface design DNA before you start front-end development.'
      : '在开始前端开发前，搭建并保存一套可复用的界面设计 DNA。';
  }

  function buildLibraryUrl(caseId = '') {
    const params = new URLSearchParams({ lang: language() });
    if (caseId) params.set('case', caseId);
    return `./library.html?${params.toString()}`;
  }

  function currentCaseIdFromLink(link) {
    if (link?.dataset.directionCardCase) return link.dataset.directionCardCase;
    const raw = link?.getAttribute('href');
    if (!raw) return '';
    try { return new URL(raw, window.location.href).searchParams.get('case') || ''; }
    catch { return ''; }
  }

  function openCaseLibrary(caseId = '') {
    const dialog = document.querySelector('[data-case-library-dialog]');
    const frame = document.querySelector('[data-case-library-frame]');
    const fullLink = document.querySelector('[data-case-library-full]');
    if (!dialog) return;

    dialog.dataset.caseId = caseId;
    const url = buildLibraryUrl(caseId);
    if (frame) frame.setAttribute('src', url);
    if (fullLink) fullLink.setAttribute('href', url);

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
      const raw = link.getAttribute('href');
      if (!raw) return;
      const url = new URL(raw, window.location.href);
      url.searchParams.set('lang', lang);
      link.setAttribute('href', `./library.html${url.search}`);
    });

    const dialog = document.querySelector('[data-case-library-dialog]');
    if (dialog?.dataset.caseId) {
      const url = buildLibraryUrl(dialog.dataset.caseId);
      document.querySelector('[data-case-library-frame]')?.setAttribute('src', url);
      document.querySelector('[data-case-library-full]')?.setAttribute('href', url);
    }
  }

  function getFontButtons() {
    return fontList ? [...fontList.querySelectorAll('button[data-value]')] : [];
  }

  function renderFontSelectOptions() {
    if (!fontSelect || !fontList) return;
    const buttons = getFontButtons();
    const currentValue = buttons.find((button) => button.classList.contains('is-selected') || button.getAttribute('aria-checked') === 'true')?.dataset.value || fontSelect.value;
    fontSelect.replaceChildren(...buttons.map((button) => {
      const option = document.createElement('option');
      option.value = button.dataset.value || '';
      const name = button.querySelector('b')?.textContent?.trim() || button.textContent.trim();
      const description = button.querySelector('span')?.textContent?.trim() || '';
      option.textContent = description ? `${name} · ${description}` : name;
      return option;
    }));
    if (currentValue) fontSelect.value = currentValue;
    fontSelect.setAttribute('aria-label', language() === 'en' ? 'Typography' : '字体');
  }

  function syncFontSelect() {
    if (!fontSelect || !fontList) return;
    const selected = getFontButtons().find((button) => button.classList.contains('is-selected') || button.getAttribute('aria-checked') === 'true');
    if (selected?.dataset.value && fontSelect.value !== selected.dataset.value) fontSelect.value = selected.dataset.value;
  }

  function installFontSelect() {
    fontList = document.querySelector('.font-field .type-list');
    if (!fontList || fontList.dataset.compactSelect === 'true') return;
    fontList.dataset.compactSelect = 'true';

    const control = document.createElement('div');
    control.className = 'select-control font-select-control';
    fontSelect = document.createElement('select');
    fontSelect.dataset.fontCompactSelect = '';
    control.append(fontSelect);
    fontList.before(control);
    fontList.style.display = 'none';
    renderFontSelectOptions();

    fontSelect.addEventListener('change', () => {
      const target = getFontButtons().find((button) => button.dataset.value === fontSelect.value);
      target?.click();
      window.requestAnimationFrame(syncFontSelect);
    });

    fontObserver = new MutationObserver(() => syncFontSelect());
    getFontButtons().forEach((button) => fontObserver.observe(button, { attributes: true, attributeFilter: ['class', 'aria-checked'] }));
  }

  function sync() {
    syncPreviewCopy();
    syncLanguageLinks();
    renderFontSelectOptions();
    syncFontSelect();
  }

  installFontSelect();
  installCaseDialogLinks();
  sync();
  window.addEventListener('image2:languagechange', sync);
})();