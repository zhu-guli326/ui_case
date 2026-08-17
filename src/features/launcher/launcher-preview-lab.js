(() => {
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
    else fn();
  }

  ready(() => {
    if (!document.body.classList.contains("launcher-workspace")) return;
    const main = document.querySelector(".workspace-main");
    const workbench = document.querySelector("#designSystemWorkbench");
    const previewPanel = workbench?.querySelector('[data-ds-panel="preview"]');
    if (!main || !workbench || !previewPanel || document.querySelector("#previewLabSection")) return;

    const style = document.createElement("style");
    style.textContent = `
      .structured-brief::before{grid-column:1/-1;width:100%;margin-bottom:2px}
      .config-section[aria-labelledby="referenceTitle"] .choice-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
      .config-section[aria-labelledby="referenceTitle"] .choice-grid label{min-height:68px;padding:10px 34px 10px 12px}
      .case-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
      .case-card-media{aspect-ratio:4/3!important;padding:6px!important;background:#f2f4f1}
      .case-card-media img,.case-grid>article .case-card-media img{object-fit:contain!important;object-position:center!important}
      .case-card-body,.case-grid>article>.case-card-body{padding:10px;gap:6px}
      .case-card p,.case-grid>article p{font-size:9px;line-height:1.45}.case-card h3,.case-grid>article h3{font-size:12px}
      .case-card-tags span,.case-card-body li{font-size:8px;padding:3px 5px}
      .color-theme-section .design-system-workbench{margin-top:14px;padding-top:14px}
      .color-theme-section .ds-toolbar{margin-bottom:10px}.color-theme-section .ds-tabs{justify-content:flex-end}
      .format-select-hidden{position:absolute!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important}
      .format-icon-picker{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:8px}
      .format-icon-option{display:grid;min-height:82px;place-items:center;gap:6px;padding:10px 8px;border:1px solid #d9dfda;border-radius:10px;background:#fff;color:#4f5851;cursor:pointer}
      .format-icon-option:hover{border-color:#aeb8b0;background:#fafcfb}.format-icon-option.is-active{border-color:#16804b;background:#edf7f1;color:#126b3e;box-shadow:0 0 0 1px #16804b inset}
      .format-icon-option svg{width:28px;height:28px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
      .format-icon-option strong{font-size:10px}.format-icon-option small{font-size:8px;color:#7a837c;text-align:center;line-height:1.35}
      .preview-lab-section{order:99;padding:22px;border:1px solid #dde2dd;border-radius:14px;background:#fff}
      .preview-lab-head{display:flex;align-items:end;justify-content:space-between;gap:18px;margin-bottom:14px}.preview-lab-head h2{margin:0;font-size:20px;letter-spacing:-.02em}.preview-lab-head p{margin:5px 0 0;color:var(--muted);font-size:11px}
      .preview-lab-badge{padding:7px 10px;border:1px solid #dce4dd;border-radius:999px;background:#f7faf8;color:#55705f;font-size:9px;font-weight:800}
      .preview-toolbar{display:flex;align-items:end;gap:10px;flex-wrap:wrap;margin-bottom:12px;padding:10px 12px;border:1px solid #dde4de;border-radius:11px;background:#fbfcfb}
      .preview-field{display:grid;gap:5px;margin:0}.preview-field>span{font-size:8px;font-weight:800;color:#657067}.preview-field select{height:34px;min-width:190px;padding:0 10px;border:1px solid #d5ddd6;border-radius:8px;background:#fff;color:#202721;font:inherit;font-size:10px}
      .preview-segment{display:flex;gap:5px}.preview-segment button{height:34px;padding:0 12px;border:1px solid #d8dfd9;border-radius:8px;background:#fff;color:#3d4740;font-size:9px;font-weight:800;cursor:pointer}.preview-segment button.is-active{border-color:#17804b;background:#edf7f1;color:#126b3e;box-shadow:0 0 0 1px #17804b inset}
      .preview-current{margin-left:auto;align-self:center;color:#6a746c;font-size:9px}.preview-current b{color:#245c3b}
      .preview-lab-stage{min-width:0;padding:12px;border:1px solid #dde4de;border-radius:12px;background:#f0f3f1;overflow:auto}
      .preview-lab-stage .ds-preview-shell{grid-template-columns:190px minmax(0,1fr);min-height:520px;margin:0;background:#f5f7f5}.preview-lab-stage .preview-canvas{min-height:490px}.preview-lab-stage .preview-device[data-size="desktop"]{max-width:980px}
      .preview-lab-stage[data-theme="dark"]{background:#1d211e;border-color:#303631}.preview-lab-stage[data-theme="dark"] .ds-preview-shell{background:#252a26;border-color:#39403a}.preview-lab-stage[data-theme="dark"] .preview-meta{background:#171a18;color:#f4f6f4}.preview-lab-stage[data-theme="dark"] .preview-meta p,.preview-lab-stage[data-theme="dark"] .preview-meta ul{color:#abb4ad}.preview-lab-stage[data-theme="dark"] .preview-canvas{background:#151815}.preview-lab-stage[data-theme="dark"] .preview-device{background:#202421;color:#f6f7f6;border-color:#383f39}.preview-lab-stage[data-theme="dark"] .preview-card,.preview-lab-stage[data-theme="dark"] .preview-list{background:#272c28;border-color:#3a413b}.preview-lab-stage[data-theme="dark"] .preview-list div{border-color:#343a35}
      @media(max-width:1180px){.case-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.preview-current{width:100%;margin-left:0}}
      @media(max-width:780px){.format-icon-picker{grid-template-columns:repeat(2,minmax(0,1fr))}.preview-lab-stage .ds-preview-shell{grid-template-columns:1fr}.config-section[aria-labelledby="referenceTitle"] .choice-grid,.case-grid{grid-template-columns:1fr}.preview-field{width:100%}.preview-field select{width:100%}}
    `;
    document.head.append(style);

    function formatIcon(value) {
      const icons = {
        web:'<svg viewBox="0 0 32 32"><rect x="3" y="5" width="26" height="20" rx="2"></rect><path d="M3 10h26M8 8h.1M11 8h.1M14 8h.1"></path></svg>',
        mobile:'<svg viewBox="0 0 32 32"><rect x="9" y="3" width="14" height="26" rx="4"></rect><path d="M13 6h6M14 26h4"></path></svg>',
        dashboard:'<svg viewBox="0 0 32 32"><rect x="3" y="4" width="26" height="24" rx="2"></rect><path d="M3 10h26M10 10v18M14 15h11M14 20h7M14 24h9"></path></svg>',
        desktop:'<svg viewBox="0 0 32 32"><rect x="4" y="4" width="24" height="17" rx="2"></rect><path d="M12 27h8M16 21v6"></path></svg>'
      }; return icons[value]||icons.web;
    }
    function enhanceFormatSelector(){
      const select=document.querySelector('#intentForm select[name="format"]'); if(!select||select.dataset.iconEnhanced==='true')return;
      select.dataset.iconEnhanced='true';select.classList.add('format-select-hidden');const picker=document.createElement('div');picker.className='format-icon-picker';
      const details={web:['响应式网页','Browser / Web'],mobile:['手机 App','iOS / Android'],dashboard:['产品后台','Dashboard / Admin'],desktop:['桌面应用','Windows / macOS']};
      [...select.options].forEach(o=>{if(!details[o.value])return;const b=document.createElement('button');b.type='button';b.className='format-icon-option';b.dataset.value=o.value;b.innerHTML=formatIcon(o.value)+'<strong>'+details[o.value][0]+'</strong><small>'+details[o.value][1]+'</small>';b.onclick=()=>{select.value=o.value;select.dispatchEvent(new Event('change',{bubbles:true}));sync()};picker.append(b)});select.insertAdjacentElement('afterend',picker);
      function sync(){picker.querySelectorAll('button').forEach(b=>b.classList.toggle('is-active',b.dataset.value===select.value))}select.addEventListener('change',sync);sync();
    }
    const intentForm=document.querySelector('#intentForm');if(intentForm){new MutationObserver(enhanceFormatSelector).observe(intentForm,{childList:true,subtree:true});enhanceFormatSelector()}

    const previewTab=workbench.querySelector('[data-ds-tab="preview"]');previewTab?.remove();
    const foundationTab=workbench.querySelector('[data-ds-tab="foundation"]'),foundationPanel=workbench.querySelector('[data-ds-panel="foundation"]');
    workbench.querySelectorAll('.ds-tab').forEach(el=>el.classList.toggle('is-active',el===foundationTab));workbench.querySelectorAll('.ds-panel').forEach(el=>el.classList.toggle('is-active',el===foundationPanel));

    const section=document.createElement('section');section.className='preview-lab-section';section.id='previewLabSection';section.innerHTML=`
      <div class="preview-lab-head"><div><div class="flow-label"><span>6</span> Live preview</div><h2>最终页面效果</h2><p>前面的颜色、组件、字体和设计系统会直接应用到这里。这里只保留预览需要的视图切换。</p></div><span class="preview-lab-badge">实时联动</span></div>
      <div class="preview-toolbar">
        <label class="preview-field"><span>页面</span><select id="previewPageTemplate"><option value="account">账户设置 / Account Settings</option><option value="dashboard">数据面板 / Dashboard</option><option value="commerce">商品详情 / Product Detail</option><option value="editorial">内容主页 / Editorial Home</option></select></label>
        <div class="preview-field"><span>设备</span><div class="preview-segment" id="previewDeviceSegment"><button type="button" data-size="desktop">Desktop</button><button type="button" data-size="tablet">Tablet</button><button type="button" data-size="mobile" class="is-active">Mobile</button></div></div>
        <div class="preview-field"><span>主题</span><div class="preview-segment" id="previewThemeSegment"><button type="button" data-theme="light" class="is-active">Light</button><button type="button" data-theme="dark">Dark</button></div></div>
        <label class="preview-field"><span>语言</span><select id="previewLanguage"><option value="zh">简体中文</option><option value="en">English</option></select></label>
        <div class="preview-current">当前方案：<b id="previewCurrentSystem">跟随上方选择</b></div>
      </div>
      <div class="preview-lab-stage" id="previewLabStage" data-theme="light"></div>`;
    main.append(section);
    const stage=section.querySelector('#previewLabStage');previewPanel.classList.add('is-active');previewPanel.style.display='block';stage.append(previewPanel);previewPanel.querySelector('.preview-controls')?.setAttribute('hidden','');
    const device=document.querySelector('#previewDevice'),pageSelect=section.querySelector('#previewPageTemplate'),languageSelect=section.querySelector('#previewLanguage');
    const title=device?.querySelector('.preview-nav strong'),cardKicker=device?.querySelector('.preview-card small'),cardTitle=device?.querySelector('.preview-card h4'),listLabels=device?[...device.querySelectorAll('.preview-list div span')]:[],primary=device?.querySelector('.preview-primary');
    const copy={zh:{account:['账户设置','个人偏好','管理你的账号与系统偏好',['个人资料','通知','隐私'],'保存设置'],dashboard:['工作台','本周进度','让每一次交付都清晰可控',['项目','待评审','报告'],'查看任务'],commerce:['商品详情','本周精选','一件更适合你的新选择',['规格','配送','售后'],'加入购物车'],editorial:['今日内容','编辑推荐','把重点内容放在第一眼能看到的位置',['最新','收藏','专题'],'继续阅读']},en:{account:['Account Settings','Preferences','Manage your account and system preferences',['Profile','Notifications','Privacy'],'Save changes'],dashboard:['Workspace','Weekly progress','Keep every delivery clear and controlled',['Projects','Reviews','Reports'],'View tasks'],commerce:['Product Detail','Weekly pick','A better new choice for you',['Options','Shipping','Support'],'Add to cart'],editorial:['Today','Editor’s pick','Put the most important content where it is seen first',['Latest','Saved','Topics'],'Continue reading']}};
    function applyCopy(){if(!device)return;const v=copy[languageSelect.value][pageSelect.value];title.textContent=v[0];cardKicker.textContent=v[1];cardTitle.textContent=v[2];listLabels.forEach((el,i)=>{if(v[3][i])el.textContent=v[3][i]});primary.textContent=v[4]}
    function setDevice(size){if(!device)return;device.dataset.size=size;section.querySelectorAll('#previewDeviceSegment button').forEach(b=>b.classList.toggle('is-active',b.dataset.size===size));const widths={mobile:390,tablet:768,desktop:1180};device.style.width=`min(100%, ${widths[size]}px)`}
    function setTheme(theme){stage.dataset.theme=theme;section.querySelectorAll('#previewThemeSegment button').forEach(b=>b.classList.toggle('is-active',b.dataset.theme===theme))}
    function syncSystem(){const text=document.querySelector('#previewSystemName')?.textContent?.trim()||'跟随上方选择';section.querySelector('#previewCurrentSystem').textContent=text}
    pageSelect.addEventListener('change',applyCopy);languageSelect.addEventListener('change',applyCopy);section.querySelectorAll('#previewDeviceSegment button').forEach(b=>b.onclick=()=>setDevice(b.dataset.size));section.querySelectorAll('#previewThemeSegment button').forEach(b=>b.onclick=()=>setTheme(b.dataset.theme));
    const platformGrid=document.querySelector('#platformGrid');if(platformGrid)new MutationObserver(()=>{const p=document.querySelector('.platform-card.is-active')?.dataset.platform;if(p==='windows'||p==='macos')setDevice('desktop');else if(p)setDevice('mobile')}).observe(platformGrid,{subtree:true,attributes:true,attributeFilter:['class']});
    const systemName=document.querySelector('#previewSystemName');if(systemName)new MutationObserver(syncSystem).observe(systemName,{childList:true,characterData:true,subtree:true});
    applyCopy();setDevice(device?.dataset.size||'mobile');syncSystem();
  });
})();
