(() => {
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
    else fn();
  }

  ready(() => {
    if (!document.body.classList.contains("launcher-workspace")) return;
    const main = document.querySelector(".workspace-main");
    const dsSection = document.querySelector(".color-theme-section");
    const workbench = document.querySelector("#designSystemWorkbench");
    const previewPanel = workbench?.querySelector('[data-ds-panel="preview"]');
    if (!main || !dsSection || !workbench || !previewPanel || document.querySelector("#previewLabSection")) return;

    const style = document.createElement("style");
    style.textContent = `
      .structured-brief::before{grid-column:1/-1;width:100%;margin-bottom:2px}
      .color-theme-section .design-system-workbench{margin-top:14px;padding-top:14px}
      .color-theme-section .ds-toolbar{margin-bottom:10px}
      .color-theme-section .ds-tabs{justify-content:flex-end}
      .preview-lab-section{order:5;padding:22px;border:1px solid #dde2dd;border-radius:14px;background:#fff}
      .preview-lab-head{display:flex;align-items:end;justify-content:space-between;gap:18px;margin-bottom:16px}
      .preview-lab-head h2{margin:0;font-size:18px;letter-spacing:-.02em}
      .preview-lab-head p{margin:5px 0 0;color:var(--muted);font-size:11px}
      .preview-lab-badge{padding:7px 10px;border:1px solid #dce4dd;border-radius:999px;background:#f7faf8;color:#55705f;font-size:9px;font-weight:800}
      .preview-lab-layout{display:grid;grid-template-columns:260px minmax(0,1fr);gap:14px;align-items:start}
      .preview-config-panel{padding:14px;border:1px solid #dde4de;border-radius:12px;background:#fbfcfb}
      .preview-config-panel h3{margin:0 0 12px;font-size:12px}
      .preview-field{display:grid;gap:5px;margin-bottom:11px}
      .preview-field>span{font-size:9px;font-weight:800;color:#4d5750}
      .preview-field select,.preview-field input{width:100%;height:36px;padding:0 10px;border:1px solid #d5ddd6;border-radius:8px;background:#fff;color:#202721;font:inherit;font-size:10px;outline:none}
      .preview-field select:focus,.preview-field input:focus{border-color:#16804b;box-shadow:0 0 0 2px rgba(22,128,75,.08)}
      .preview-segment{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
      .preview-segment.three{grid-template-columns:repeat(3,minmax(0,1fr))}
      .preview-segment button{height:34px;border:1px solid #d8dfd9;border-radius:8px;background:#fff;color:#3d4740;font-size:9px;font-weight:800;cursor:pointer}
      .preview-segment button.is-active{border-color:#17804b;background:#edf7f1;color:#126b3e;box-shadow:0 0 0 1px #17804b inset}
      .preview-config-note{margin-top:12px;padding:9px 10px;border-radius:8px;background:#f0f5f1;color:#5d685f;font-size:8px;line-height:1.55}
      .preview-lab-stage{min-width:0;padding:12px;border:1px solid #dde4de;border-radius:12px;background:#f0f3f1;overflow:auto}
      .preview-lab-stage .ds-preview-shell{grid-template-columns:170px minmax(0,1fr);min-height:480px;margin:0;background:#f5f7f5}
      .preview-lab-stage .preview-canvas{min-height:450px}
      .preview-lab-stage .preview-device[data-size="desktop"]{max-width:920px}
      .preview-lab-stage[data-theme="dark"]{background:#1d211e;border-color:#303631}
      .preview-lab-stage[data-theme="dark"] .ds-preview-shell{background:#252a26;border-color:#39403a}
      .preview-lab-stage[data-theme="dark"] .preview-meta{background:#171a18;color:#f4f6f4}
      .preview-lab-stage[data-theme="dark"] .preview-meta p,.preview-lab-stage[data-theme="dark"] .preview-meta ul{color:#abb4ad}
      .preview-lab-stage[data-theme="dark"] .preview-canvas{background:#151815}
      .preview-lab-stage[data-theme="dark"] .preview-device{background:#202421;color:#f6f7f6;border-color:#383f39}
      .preview-lab-stage[data-theme="dark"] .preview-card,.preview-lab-stage[data-theme="dark"] .preview-list{background:#272c28;border-color:#3a413b}
      .preview-lab-stage[data-theme="dark"] .preview-list div{border-color:#343a35}
      .preview-lab-stage[data-grid="on"] .preview-canvas{background-image:linear-gradient(rgba(40,75,53,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(40,75,53,.055) 1px,transparent 1px);background-size:16px 16px}
      @media(max-width:900px){.preview-lab-layout{grid-template-columns:1fr}.preview-config-panel{display:grid;grid-template-columns:1fr 1fr;gap:10px}.preview-config-panel h3,.preview-config-note{grid-column:1/-1}.preview-field{margin:0}}
      @media(max-width:620px){.preview-lab-section{padding:16px}.preview-config-panel{grid-template-columns:1fr}.preview-config-panel h3,.preview-config-note{grid-column:auto}.preview-lab-stage .ds-preview-shell{grid-template-columns:1fr}.preview-lab-stage .preview-meta{display:block}}
    `;
    document.head.append(style);

    const previewTab = workbench.querySelector('[data-ds-tab="preview"]');
    previewTab?.remove();
    const foundationTab = workbench.querySelector('[data-ds-tab="foundation"]');
    const foundationPanel = workbench.querySelector('[data-ds-panel="foundation"]');
    workbench.querySelectorAll(".ds-tab").forEach((el) => el.classList.toggle("is-active", el === foundationTab));
    workbench.querySelectorAll(".ds-panel").forEach((el) => el.classList.toggle("is-active", el === foundationPanel));

    const section = document.createElement("section");
    section.className = "preview-lab-section";
    section.id = "previewLabSection";
    section.innerHTML = `
      <div class="preview-lab-head">
        <div>
          <div class="flow-label"><span>6</span> Live preview</div>
          <h2>最后预览完整页面效果</h2>
          <p>把平台、设计系统和页面参数集中到一个设置面板里；下拉调整后直接看最终页面，而不是在上面打断选择流程。</p>
        </div>
        <span class="preview-lab-badge">实时联动</span>
      </div>
      <div class="preview-lab-layout">
        <aside class="preview-config-panel" aria-label="预览设置">
          <h3>设计系统实验室设置</h3>
          <label class="preview-field"><span>页面模板</span><select id="previewPageTemplate"><option value="account">账户设置 / Account Settings</option><option value="dashboard">数据面板 / Dashboard</option><option value="commerce">商品详情 / Product Detail</option><option value="editorial">内容主页 / Editorial Home</option></select></label>
          <label class="preview-field"><span>设计系统</span><select id="previewDesignSystem"><option value="current">跟随上方当前选择</option><option value="Apple System">Apple HIG</option><option value="Material 3">Material 3</option><option value="Ant Design">Ant Design</option><option value="Fluent 2">Fluent 2</option><option value="Carbon">Carbon</option><option value="Primer">Primer</option><option value="Spectrum">Spectrum</option></select></label>
          <div class="preview-field"><span>设备</span><div class="preview-segment three" id="previewDeviceSegment"><button type="button" data-size="desktop">Desktop</button><button type="button" data-size="tablet">Tablet</button><button type="button" data-size="mobile" class="is-active">Mobile</button></div></div>
          <div class="preview-field"><span>主题模式</span><div class="preview-segment" id="previewThemeSegment"><button type="button" data-theme="light" class="is-active">Light</button><button type="button" data-theme="dark">Dark</button></div></div>
          <label class="preview-field"><span>布局宽度</span><input id="previewWidth" type="number" min="320" max="1440" step="20" value="390"></label>
          <div class="preview-field"><span>网格</span><div class="preview-segment" id="previewGridSegment"><button type="button" data-grid="on" class="is-active">是</button><button type="button" data-grid="off">否</button></div></div>
          <label class="preview-field"><span>语言</span><select id="previewLanguage"><option value="zh">简体中文</option><option value="en">English</option></select></label>
          <div class="preview-config-note">上方负责“选方向与规范”，这里负责“验证最终页面”。参数只影响预览，不会把页面结构拆散。</div>
        </aside>
        <div class="preview-lab-stage" id="previewLabStage" data-theme="light" data-grid="on"></div>
      </div>`;
    main.append(section);

    const stage = section.querySelector("#previewLabStage");
    previewPanel.classList.add("is-active");
    previewPanel.style.display = "block";
    stage.append(previewPanel);

    const oldControls = previewPanel.querySelector(".preview-controls");
    if (oldControls) oldControls.hidden = true;

    const device = document.querySelector("#previewDevice");
    const pageSelect = section.querySelector("#previewPageTemplate");
    const dsSelect = section.querySelector("#previewDesignSystem");
    const widthInput = section.querySelector("#previewWidth");
    const languageSelect = section.querySelector("#previewLanguage");
    const title = device?.querySelector(".preview-nav strong");
    const cardKicker = device?.querySelector(".preview-card small");
    const cardTitle = device?.querySelector(".preview-card h4");
    const listLabels = device ? [...device.querySelectorAll(".preview-list div span")] : [];
    const primary = device?.querySelector(".preview-primary");

    const copy = {
      zh: {
        account: ["账户设置", "个人偏好", "管理你的账号与系统偏好", ["个人资料", "通知", "隐私"], "保存设置"],
        dashboard: ["工作台", "本周进度", "让每一次交付都清晰可控", ["项目", "待评审", "报告"], "查看任务"],
        commerce: ["商品详情", "本周精选", "一件更适合你的新选择", ["规格", "配送", "售后"], "加入购物车"],
        editorial: ["今日内容", "编辑推荐", "把重点内容放在第一眼能看到的位置", ["最新", "收藏", "专题"], "继续阅读"]
      },
      en: {
        account: ["Account Settings", "Preferences", "Manage your account and system preferences", ["Profile", "Notifications", "Privacy"], "Save changes"],
        dashboard: ["Workspace", "Weekly progress", "Keep every delivery clear and controlled", ["Projects", "Reviews", "Reports"], "View tasks"],
        commerce: ["Product Detail", "Weekly pick", "A better new choice for you", ["Options", "Shipping", "Support"], "Add to cart"],
        editorial: ["Today", "Editor’s pick", "Put the most important content where it is seen first", ["Latest", "Saved", "Topics"], "Continue reading"]
      }
    };

    function applyCopy() {
      if (!device) return;
      const lang = languageSelect.value;
      const values = copy[lang][pageSelect.value];
      title.textContent = values[0];
      cardKicker.textContent = values[1];
      cardTitle.textContent = values[2];
      listLabels.forEach((el, i) => { if (values[3][i]) el.textContent = values[3][i]; });
      primary.textContent = values[4];
    }

    function setDevice(size) {
      if (!device) return;
      device.dataset.size = size;
      section.querySelectorAll("#previewDeviceSegment button").forEach((b) => b.classList.toggle("is-active", b.dataset.size === size));
      const defaults = { mobile: 390, tablet: 768, desktop: 1180 };
      widthInput.value = defaults[size];
      applyWidth();
    }

    function applyWidth() {
      if (!device) return;
      const v = Math.max(320, Math.min(1440, Number(widthInput.value) || 390));
      if (device.dataset.size === "desktop") device.style.width = `min(100%, ${v}px)`;
      else device.style.width = `min(100%, ${v}px)`;
    }

    function setTheme(theme) {
      stage.dataset.theme = theme;
      section.querySelectorAll("#previewThemeSegment button").forEach((b) => b.classList.toggle("is-active", b.dataset.theme === theme));
    }

    function setGrid(value) {
      stage.dataset.grid = value;
      section.querySelectorAll("#previewGridSegment button").forEach((b) => b.classList.toggle("is-active", b.dataset.grid === value));
    }

    function syncDesignSystemSelect() {
      const text = document.querySelector("#previewSystemName")?.textContent || "";
      const option = [...dsSelect.options].find((o) => o.value !== "current" && text.includes(o.value));
      dsSelect.value = option ? option.value : "current";
    }

    function chooseDesignSystem(value) {
      if (value === "current") return;
      const cards = [...document.querySelectorAll("#colorThemeGrid .color-theme-card")];
      const aliases = {
        "Apple System": /Apple|苹果/i,
        "Material 3": /Material/i,
        "Ant Design": /Ant Design|Ant/i,
        "Fluent 2": /Fluent/i,
        Carbon: /Carbon|IBM/i,
        Primer: /Primer/i,
        Spectrum: /Spectrum|Adobe/i
      };
      const target = cards.find((card) => aliases[value]?.test(card.innerText));
      if (target) {
        const input = target.querySelector("input");
        if (input) { input.click(); input.dispatchEvent(new Event("change", { bubbles: true })); }
        else target.click();
      }
    }

    pageSelect.addEventListener("change", applyCopy);
    languageSelect.addEventListener("change", applyCopy);
    dsSelect.addEventListener("change", () => chooseDesignSystem(dsSelect.value));
    widthInput.addEventListener("input", applyWidth);
    section.querySelectorAll("#previewDeviceSegment button").forEach((b) => b.addEventListener("click", () => setDevice(b.dataset.size)));
    section.querySelectorAll("#previewThemeSegment button").forEach((b) => b.addEventListener("click", () => setTheme(b.dataset.theme)));
    section.querySelectorAll("#previewGridSegment button").forEach((b) => b.addEventListener("click", () => setGrid(b.dataset.grid)));

    const platformObserver = new MutationObserver(() => {
      const platform = document.querySelector(".platform-card.is-active")?.dataset.platform;
      if (platform === "windows" || platform === "macos") setDevice("desktop");
      else if (platform) setDevice("mobile");
    });
    const platformGrid = document.querySelector("#platformGrid");
    if (platformGrid) platformObserver.observe(platformGrid, { subtree: true, attributes: true, attributeFilter: ["class"] });

    const systemName = document.querySelector("#previewSystemName");
    if (systemName) new MutationObserver(syncDesignSystemSelect).observe(systemName, { childList: true, characterData: true, subtree: true });

    applyCopy();
    setDevice(device?.dataset.size || "mobile");
    syncDesignSystemSelect();
  });
})();
