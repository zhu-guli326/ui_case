const destinations = [
  { id: 'WEB', href: './skills.html?mode=WEB', zh: ['设计工具', '发现让设计更进一步的好工具。', '动效网站', '灵感'], en: ['Design Tools', 'Find tools that take your work further.', 'Motion sites', 'Inspiration'], links: ['./skills.html?mode=WEB', './skills.html?mode=WEB'] },
  { id: 'SKILL', href: './skills.html', zh: ['设计 Skills', '把设计经验变成 AI 的能力。', '设计', '产品'], en: ['Design Skills', 'Turn design expertise into AI capabilities.', 'Design', 'Product'], links: ['./skills.html', './skills.html'] },
  { id: 'vocabulary', href: './vocabulary.html', zh: ['UI 词典', '看懂界面，也说清你的想法。', '导航页面', '页面布局'], en: ['UI Dictionary', 'Understand interfaces. Express your ideas.', 'Navigation', 'Page layout'], links: ['./vocabulary.html?category=navigation', './vocabulary.html?category=layout'] },
  { id: 'library', href: './library.html', zh: ['案例库', '从真实界面中，找到下一个方向。', 'App 设计', 'Web 设计'], en: ['Case Library', 'Find your next direction in real interfaces.', 'App design', 'Web design'], links: ['./library.html?tag=APP设计', './library.html?tag=web设计'] },
];

class KnowledgeNav extends HTMLElement {
  connectedCallback() {
    this.render = this.render.bind(this);
    this.render();
    window.addEventListener('image2:languagechange', this.render);
    window.addEventListener('image2:directorychange', this.render);
    window.addEventListener('popstate', this.render);
  }

  disconnectedCallback() {
    window.removeEventListener('image2:languagechange', this.render);
    window.removeEventListener('image2:directorychange', this.render);
    window.removeEventListener('popstate', this.render);
  }

  render() {
    const lang = window.image2I18n?.language === 'en' ? 'en' : 'zh';
    const page = location.pathname.split('/').pop();
    const active = page === 'skills.html' ? (new URLSearchParams(location.search).get('mode') === 'WEB' ? 'WEB' : 'SKILL') : page?.replace('.html', '');
    const href = (path) => {
      const url = new URL(path, location.href);
      url.searchParams.set('lang', lang);
      return `${url.pathname}${url.search}`;
    };
    this.innerHTML = `<section class="knowledge-directory" aria-label="${lang === 'en' ? 'Knowledge Library' : '知识库内容'}">
      <div class="knowledge-directory-head"><p>KNOWLEDGE LIBRARY</p><span>${lang === 'en' ? 'EXPLORE · UNDERSTAND · CREATE' : '参考 · 理解 · 创作'}</span></div>
      <nav class="knowledge-directory-links" aria-label="${lang === 'en' ? 'Knowledge destinations' : '知识库栏目'}">
        ${destinations.map((item) => {
          const copy = item[lang];
          const current = item.id === active;
          return `<section class="knowledge-directory-group${current ? ' is-current' : ''}">
            <a href="${href(item.href)}"${current ? ' aria-current="page"' : ''}><strong>${copy[0]}</strong></a>
            <p>${copy[1]}</p>
            ${item.links.map((link, index) => `<a href="${href(link)}"><span>${copy[index + 2]}</span></a>`).join('')}
          </section>`;
        }).join('')}
      </nav>
    </section>`;
  }
}

customElements.define('image2-knowledge-nav', KnowledgeNav);
