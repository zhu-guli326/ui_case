(() => {
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
    else fn();
  }

  ready(() => {
    if (!document.body.classList.contains("launcher-workspace")) return;

    const style = document.createElement("style");
    style.textContent = `
      .platform-section{display:none!important}
      .format-platform-detail{display:none;margin-top:12px;padding:12px;border:1px solid #dfe5e0;border-radius:10px;background:#f7faf8}
      .format-platform-detail.is-visible{display:block}
      .format-platform-title{margin-bottom:9px;color:#4f5952;font-size:9px;font-weight:850}
      .format-platform-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
      .format-platform-option{display:flex;align-items:center;gap:9px;min-height:58px;padding:9px 11px;border:1px solid #d9dfda;border-radius:9px;background:#fff;color:#454e47;cursor:pointer;text-align:left}
      .format-platform-option:hover{border-color:#aeb8b0}
      .format-platform-option.is-active{border-color:#16804b;background:#edf7f1;color:#126b3e;box-shadow:0 0 0 1px #16804b inset}
      .format-platform-option svg{width:24px;height:24px;flex:0 0 24px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
      .format-platform-option strong{display:block;font-size:10px}.format-platform-option small{display:block;margin-top:2px;color:#7c857e;font-size:8px}

      body.create-flow-refactored .create-advanced{display:none!important}
      body.create-flow-refactored .style-direction{display:none!important}
      body.create-flow-refactored #designSystemWorkbench{display:none!important}
      body.create-flow-refactored .color-theme-section{display:none!important}

      /* Create / rebuild / improve / explore / compare must share the same launcher shell. */
      body.create-flow-refactored .page-heading{display:flex!important}
      body.create-flow-refactored .workspace-flow{margin-top:22px!important}
      body.create-flow-refactored .mode-picker{padding:22px!important;border-radius:14px!important}
      body.create-flow-refactored .mode-picker-heading{display:flex!important;align-items:end;justify-content:space-between;gap:18px;margin-bottom:14px}
      body.create-flow-refactored .mode-tabs{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:8px!important;overflow:visible!important}
      body.create-flow-refactored .mode-tabs>button{position:relative;display:block;min-height:76px!important;padding:14px 14px 12px!important;border-radius:10px!important;flex:initial!important}
      body.create-flow-refactored .mode-tabs strong{display:block;font-size:12px!important}
      body.create-flow-refactored .mode-tabs small{display:block!important;margin-top:6px;font-size:9px;line-height:1.4}
      @media(max-width:1120px){body.create-flow-refactored .mode-tabs{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
      @media(max-width:780px){body.create-flow-refactored .mode-picker{padding:16px!important}body.create-flow-refactored .mode-tabs{grid-template-columns:1fr 1fr!important}}
      @media(max-width:520px){body.create-flow-refactored .mode-tabs{grid-template-columns:1fr!important}}

      .brief-delivery-block{margin-top:16px;padding-top:16px;border-top:1px solid #e2e8e3}
      .brief-delivery-head{margin-bottom:10px}
      .brief-delivery-head strong{display:block;font-size:11px;color:#253128}
      .brief-delivery-head small{display:block;margin-top:3px;color:#778079;font-size:9px}
      .brief-delivery-block .select-field>span{display:none}
      .brief-delivery-block .format-icon-picker{display:grid!important;margin-top:0}
      .brief-delivery-block .format-platform-detail{margin-top:10px}

      /* The section title already explains this is a component system selector. */
      body.create-flow-refactored #componentSystemPicker .select-field>span{display:none!important}
      body.create-flow-refactored #componentSystemPicker{padding:10px!important}
      body.create-flow-refactored #componentSystemPicker .select-field{display:block!important}
      body.create-flow-refactored #componentSystemPicker select{width:100%;min-height:44px}

      .preview-color-field{display:grid;gap:5px}.preview-color-field>span{font-size:8px;font-weight:800;color:#657067}
      .preview-color-picker{position:relative;min-width:180px}
      .preview-color-button{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;height:34px;padding:0 10px;border:1px solid #d5ddd6;border-radius:8px;background:#fff;color:#202721;font:inherit;font-size:10px;cursor:pointer}
      .preview-color-button:hover{border-color:#aebbb1}.preview-color-button i{display:flex;gap:3px}.preview-color-button i b{display:block;width:14px;height:18px;border-radius:4px;border:1px solid rgba(0,0,0,.07)}
      .preview-color-menu{position:absolute;z-index:20;top:39px;left:0;display:none;width:320px;max-height:320px;overflow:auto;padding:7px;border:1px solid #dce3dd;border-radius:10px;background:#fff;box-shadow:0 14px 34px rgba(27,41,32,.16)}
      .preview-color-picker.is-open .preview-color-menu{display:grid;gap:5px}
      .preview-color-option{display:grid;grid-template-columns:58px minmax(0,1fr);align-items:center;gap:9px;padding:8px;border:1px solid transparent;border-radius:8px;background:#fff;cursor:pointer;text-align:left}
      .preview-color-option:hover{background:#f6f9f7}.preview-color-option.is-active{border-color:#16804b;background:#edf7f1}
      .preview-color-option .swatches{display:flex;overflow:hidden;height:28px;border:1px solid #e1e5e2;border-radius:6px}.preview-color-option .swatches b{flex:1}
      .preview-color-option strong{display:block;font-size:9px}.preview-color-option small{display:block;margin-top:2px;color:#7c857e;font-size:7px}

      .final-brand-summary{display:grid;grid-template-columns:minmax(190px,1.25fr) repeat(4,minmax(100px,.7fr));gap:8px;margin:0 0 12px;padding:10px;border:1px solid #dde4de;border-radius:11px;background:#fbfcfb}
      .final-brand-main,.final-brand-item{min-width:0;padding:9px 10px;border-radius:9px;background:#fff;border:1px solid #e5e9e6}
      .final-brand-main{display:flex;align-items:center;gap:10px}.final-brand-swatches{display:flex;gap:4px;flex:0 0 auto}.final-brand-swatches i{width:18px;height:30px;border:1px solid rgba(0,0,0,.07);border-radius:5px;background:#eee}
      .final-brand-copy{min-width:0}.final-brand-copy small,.final-brand-item small{display:block;margin-bottom:3px;color:#7a847c;font-size:7px;font-weight:800;text-transform:uppercase;letter-spacing:.06em}
      .final-brand-copy strong,.final-brand-item strong{display:block;overflow:hidden;color:#202721;font-size:10px;line-height:1.35;text-overflow:ellipsis;white-space:nowrap}.final-brand-item span{display:block;margin-top:2px;color:#7a837c;font-size:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .final-brand-details{grid-column:1/-1;margin-top:1px}.final-brand-details summary{cursor:pointer;color:#4c6655;font-size:8px;font-weight:800;list-style:none}.final-brand-details summary::-webkit-details-marker{display:none}.final-brand-details summary::after{content:'＋';margin-left:5px}.final-brand-details[open] summary::after{content:'−'}
      .final-brand-components{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:8px}.final-brand-components .component-demo{min-height:88px;background:#fff}
      @media(max-width:980px){.final-brand-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.final-brand-main{grid-column:1/-1}}
      @media(max-width:620px){.format-platform-options{grid-template-columns:1fr}.brief-delivery-block .format-icon-picker{grid-template-columns:1fr 1fr!important}.final-brand-summary,.final-brand-components{grid-template-columns:1fr}.final-brand-main{grid-column:auto}.preview-color-picker{min-width:100%}.preview-color-menu{width:min(320px,calc(100vw - 48px))}}
    `;
    document.head.append(style);

    const platformSection = document.querySelector(".platform-section");
    if (platformSection) platformSection.hidden = true;

    function platformIcon(key) {
      const icons = {
        ios: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="9" y="3" width="14" height="26" rx="4"></rect><path d="M13 6h6M14 26h4"></path></svg>',
        android: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M9 12h14v10H9zM11 12a5 5 0 0 1 10 0M12 7 10 4M20 7l2-3M7 13v7M25 13v7M12 22v5M20 22v5"></path></svg>',
        windows: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 6l11-1.5V15H4zM17 4.2 28 2.7V15H17zM4 17h11v10.5L4 26zM17 17h11v12.3L17 27.8z"></path></svg>',
        macos: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="5" width="22" height="16" rx="2"></rect><path d="M2.5 25h27M12 25h8"></path></svg>'
      };
      return icons[key] || "";
    }

    function platformData(format) {
      if (format === "mobile") return [["ios", "iOS", "iPhone · Apple HIG"],["android", "Android", "Phone · Material 3"]];
      if (format === "desktop") return [["windows", "Windows", "Desktop · Fluent 2"],["macos", "macOS", "Mac · Apple HIG"]];
      return [];
    }

    function platformDeliveryLabel(key, format) {
      if (format === 'web') return '响应式网页';
      if (format === 'dashboard') return '产品后台';
      if (format === 'mobile') return key === 'android' ? 'Android · 手机 App' : 'iOS · 手机 App';
      if (format === 'desktop') return key === 'windows' ? 'Windows · 桌面应用' : 'macOS · 桌面应用';
      return '';
    }

    function syncPlatformSummary(key) {
      const format = document.querySelector('#intentForm select[name="format"]')?.value || '';
      const label = platformDeliveryLabel(key || localStorage.getItem('image2-ui-target-platform') || 'ios', format);
      if (!label) return;
      document.querySelectorAll('#taskSummary > div').forEach((row) => {
        const dt = row.querySelector('dt');
        const dd = row.querySelector('dd');
        if (dt && dd && /交付|Deliverable/i.test(dt.textContent || '')) dd.textContent = label;
      });
    }

    function selectPlatform(key) {
      const original = document.querySelector('.platform-card[data-platform="' + key + '"]');
      if (original) original.click();
      try { localStorage.setItem("image2-ui-target-platform", key); } catch {}
      setTimeout(() => syncPlatformSummary(key), 20);
    }

    function moveDeliveryUnderBrief() {
      if (!document.body.classList.contains('create-flow-refactored')) return;
      const brief = document.querySelector('#intentForm .config-section[aria-labelledby="briefTitle"]');
      const select = document.querySelector('#intentForm select[name="format"]');
      const field = select?.closest('.select-field');
      const picker = document.querySelector('#intentForm .format-icon-picker');
      if (!brief || !field || !picker) return;
      let block = brief.querySelector('#briefDeliveryBlock');
      if (!block) {
        block = document.createElement('div');
        block.id = 'briefDeliveryBlock';
        block.className = 'brief-delivery-block';
        block.innerHTML = '<div class="brief-delivery-head"><strong>交付形式</strong><small>先确定要做网页、手机 App、产品后台还是桌面应用。</small></div>';
        const structured = brief.querySelector('.structured-brief');
        (structured || brief).insertAdjacentElement('afterend', block);
      }
      if (!block.contains(field)) block.append(field);
      if (!field.contains(picker)) field.append(picker);
      const detail = document.querySelector('#intentForm .format-platform-detail');
      if (detail && !field.contains(detail)) field.append(detail);
    }

    function dedupeComponentSystemPicker() {
      const picker = document.querySelector('#componentSystemPicker');
      if (!picker) return;
      const fields = [...picker.querySelectorAll('.select-field')].filter((field) => field.querySelector('select[name="designSystem"]'));
      if (fields.length > 1) fields.slice(0, -1).forEach((field) => field.remove());
      const keep = [...picker.querySelectorAll('.select-field')].find((field) => field.querySelector('select[name="designSystem"]'));
      if (keep) {
        keep.querySelector(':scope > span')?.remove();
        [...picker.children].forEach((child) => { if (child !== keep) child.remove(); });
      }
    }

    function enhance() {
      const select = document.querySelector('#intentForm select[name="format"]');
      const picker = document.querySelector("#intentForm .format-icon-picker");
      if (!select || !picker) return;
      let detail = document.querySelector("#intentForm .format-platform-detail");
      if (!detail) { detail = document.createElement("div"); detail.className = "format-platform-detail"; picker.insertAdjacentElement("afterend", detail); }
      const render = () => {
        const options = platformData(select.value);
        if (!options.length) { detail.classList.remove("is-visible"); detail.innerHTML = ""; syncPlatformSummary(''); return; }
        const saved = localStorage.getItem("image2-ui-target-platform");
        const validKeys = options.map((x) => x[0]);
        const active = validKeys.includes(saved) ? saved : options[0][0];
        if (!validKeys.includes(saved)) selectPlatform(active);
        detail.innerHTML = '<div class="format-platform-title">' + (select.value === "mobile" ? "选择移动平台" : "选择桌面系统") + '</div><div class="format-platform-options"></div>';
        const wrap = detail.querySelector(".format-platform-options");
        options.forEach(([key, label, hint]) => {
          const button = document.createElement("button"); button.type = "button"; button.className = "format-platform-option" + (key === active ? " is-active" : ""); button.dataset.platform = key;
          button.innerHTML = platformIcon(key) + '<span><strong>' + label + '</strong><small>' + hint + '</small></span>';
          button.addEventListener("click", () => { selectPlatform(key); wrap.querySelectorAll(".format-platform-option").forEach((item) => item.classList.toggle("is-active", item === button)); });
          wrap.append(button);
        });
        detail.classList.add("is-visible");
        syncPlatformSummary(active);
      };
      if (detail.dataset.bound !== "true") { detail.dataset.bound = "true"; select.addEventListener("change", render); }
      render();
      moveDeliveryUnderBrief();
      dedupeComponentSystemPicker();
    }

    function colorDataFromCard(card) {
      const radio = card.querySelector('input[name="colorTheme"]');
      if (!radio) return null;
      const title = card.querySelector('.color-theme-copy strong')?.textContent?.trim() || radio.value;
      const desc = card.querySelector('.color-theme-copy small')?.textContent?.trim() || '';
      const swatches = [...card.querySelectorAll('.color-theme-palette i')].slice(0,5).map((el) => getComputedStyle(el).backgroundColor || '#eee');
      return { value: radio.value, title, desc, swatches, checked: radio.checked };
    }

    function syncPreviewColorPicker() {
      const toolbar = document.querySelector('#previewLabSection .preview-toolbar');
      const sourceCards = [...document.querySelectorAll('.color-theme-card')];
      if (!toolbar || !sourceCards.length) return;
      let field = toolbar.querySelector('#previewColorField');
      if (!field) {
        field = document.createElement('div'); field.id = 'previewColorField'; field.className = 'preview-color-field';
        field.innerHTML = '<span>颜色</span><div class="preview-color-picker"><button class="preview-color-button" type="button"><i></i><strong>选择颜色</strong><span>⌄</span></button><div class="preview-color-menu"></div></div>';
        const current = toolbar.querySelector('.preview-current');
        toolbar.insertBefore(field, current || null);
        const picker = field.querySelector('.preview-color-picker');
        field.querySelector('.preview-color-button').addEventListener('click', (e) => { e.stopPropagation(); picker.classList.toggle('is-open'); });
      }
      const data = sourceCards.map(colorDataFromCard).filter(Boolean);
      const active = data.find((x) => x.checked) || data[0];
      const button = field.querySelector('.preview-color-button');
      button.querySelector('strong').textContent = active?.title || '选择颜色';
      button.querySelector('i').innerHTML = (active?.swatches || []).slice(0,4).map((c) => '<b style="background:'+c+'"></b>').join('');
      const menu = field.querySelector('.preview-color-menu');
      menu.innerHTML = '';
      data.forEach((item) => {
        const option = document.createElement('button'); option.type = 'button'; option.className = 'preview-color-option' + (item.value === active?.value ? ' is-active' : '');
        option.innerHTML = '<span class="swatches">' + item.swatches.slice(0,5).map((c) => '<b style="background:'+c+'"></b>').join('') + '</span><span><strong>'+item.title+'</strong><small>'+item.desc+'</small></span>';
        option.addEventListener('click', () => {
          const radio = document.querySelector('.color-theme-card input[name="colorTheme"][value="'+CSS.escape(item.value)+'"]');
          if (radio) { radio.checked = true; radio.dispatchEvent(new Event('change',{bubbles:true})); }
          field.querySelector('.preview-color-picker').classList.remove('is-open');
          setTimeout(() => { syncPreviewColorPicker(); syncBrandSummary(); }, 30);
        });
        menu.append(option);
      });
    }

    document.addEventListener('click', (e) => {
      const picker = document.querySelector('.preview-color-picker');
      if (picker && !picker.contains(e.target)) picker.classList.remove('is-open');
    });

    function valueText(selector, fallback) { return document.querySelector(selector)?.textContent?.trim() || fallback; }
    function syncBrandSummary() {
      const preview = document.querySelector("#previewLabSection"); const toolbar = preview?.querySelector(".preview-toolbar"); if (!preview || !toolbar) return;
      let summary = preview.querySelector("#finalBrandSummary");
      if (!summary) { summary = document.createElement("div"); summary.id = "finalBrandSummary"; summary.className = "final-brand-summary"; toolbar.insertAdjacentElement("afterend", summary); }
      const swatches = [...document.querySelectorAll("#dsSwatches .ds-swatch")].slice(0, 4).map((item) => '<i style="background:' + (getComputedStyle(item).getPropertyValue('--swatch').trim() || '#eee') + '"></i>').join("");
      const system = valueText("#previewSystemName", valueText("#previewCurrentSystem", "当前设计系统"));
      const font = valueText("#dsFontSample", "System UI"); const radius = valueText("#dsRadius", "—"); const spacing = valueText("#dsSpacing", "—"); const density = valueText("#dsDensity", "—");
      const components = document.querySelector('[data-ds-panel="components"] .component-strip');
      summary.innerHTML = `<div class="final-brand-main"><div class="final-brand-swatches">${swatches}</div><div class="final-brand-copy"><small>Brand system</small><strong>${system}</strong></div></div><div class="final-brand-item"><small>Typography</small><strong>${font}</strong><span>当前字体方案</span></div><div class="final-brand-item"><small>Radius</small><strong>${radius}</strong><span>圆角基准</span></div><div class="final-brand-item"><small>Spacing</small><strong>${spacing}</strong><span>间距基准</span></div><div class="final-brand-item"><small>Density</small><strong>${density}</strong><span>界面密度</span></div><details class="final-brand-details"><summary>查看当前组件骨架</summary><div class="final-brand-components"></div></details>`;
      const target = summary.querySelector(".final-brand-components"); if (components && target) target.innerHTML = components.innerHTML;
    }

    const intentForm = document.querySelector("#intentForm");
    if (intentForm) {
      let timer = 0;
      new MutationObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(() => { enhance(); moveDeliveryUnderBrief(); dedupeComponentSystemPicker(); syncPreviewColorPicker(); syncBrandSummary(); syncPlatformSummary(); }, 50);
      }).observe(intentForm, { childList: true, subtree: true });
    }
    const taskSummary = document.querySelector('#taskSummary');
    if (taskSummary) new MutationObserver(() => syncPlatformSummary()).observe(taskSummary, { childList:true, subtree:true, characterData:true });
    const componentPickerObserver = new MutationObserver(() => dedupeComponentSystemPicker());
    componentPickerObserver.observe(document.body, { childList:true, subtree:true });
    const previewLabObserver = new MutationObserver(() => { const label = document.querySelector("#previewLabSection .flow-label span"); if (label) label.textContent = "4"; syncPreviewColorPicker(); syncBrandSummary(); });
    previewLabObserver.observe(document.body, { childList: true, subtree: true });
    const workbench = document.querySelector("#designSystemWorkbench"); if (workbench) new MutationObserver(() => { syncPreviewColorPicker(); syncBrandSummary(); }).observe(workbench, { subtree: true, childList: true, characterData: true, attributes: true });
    document.addEventListener("change", () => setTimeout(() => { moveDeliveryUnderBrief(); dedupeComponentSystemPicker(); syncPreviewColorPicker(); syncBrandSummary(); syncPlatformSummary(); }, 40));
    enhance(); moveDeliveryUnderBrief(); dedupeComponentSystemPicker(); syncPreviewColorPicker(); syncBrandSummary(); syncPlatformSummary();
  });
})();
