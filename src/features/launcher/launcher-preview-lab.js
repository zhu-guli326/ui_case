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
      .format-select-hidden{position:absolute!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important}
      .format-icon-picker{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:8px}
      .format-icon-option{display:grid;min-height:82px;place-items:center;gap:6px;padding:10px 8px;border:1px solid #d9dfda;border-radius:10px;background:#fff;color:#4f5851;cursor:pointer}
      .format-icon-option:hover{border-color:#aeb8b0;background:#fafcfb}.format-icon-option.is-active{border-color:#16804b;background:#edf7f1;color:#126b3e;box-shadow:0 0 0 1px #16804b inset}
      .format-icon-option svg{width:28px;height:28px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
      .format-icon-option strong{font-size:10px}.format-icon-option small{font-size:8px;color:#7a837c;text-align:center;line-height:1.35}
      .brief-preset-select{width:100%;height:30px;margin-top:7px;padding:0 30px 0 9px;border:1px solid #d9e2db;border-radius:8px;background:#fff;color:#4c5b51;font:inherit;font-size:9px;font-weight:700;cursor:pointer;outline:none}
      .brief-preset-select:hover{border-color:#aebbb1}.brief-preset-select:focus{border-color:#16804b;box-shadow:0 0 0 2px rgba(22,128,75,.08)}
      .brief-preset-select option{font-weight:500;color:#243129}

      /* Create flow: one decision per section, one full-page preview at the end. */
      body.create-flow-refactored .page-heading{display:none}
      body.create-flow-refactored .requirement-stage{display:none}
      body.create-flow-refactored .workspace-flow{margin-top:14px}
      body.create-flow-refactored .mode-picker{padding:12px 14px;border-radius:12px}
      body.create-flow-refactored .mode-picker-heading{display:none}
      body.create-flow-refactored .mode-tabs{display:flex;gap:6px;overflow:auto}
      body.create-flow-refactored .mode-tabs>button{flex:0 0 auto;min-height:38px;padding:8px 12px;border-radius:999px}
      body.create-flow-refactored .mode-tabs strong{font-size:10px}
      body.create-flow-refactored .mode-tabs small{display:none}
      body.create-flow-refactored .launcher-grid{border:1px solid #dde2dd;border-radius:14px;overflow:hidden;background:#fff}
      body.create-flow-refactored .intent-form>.config-section{border:0!important}
      body.create-flow-refactored #briefTitle{font-size:20px}
      body.create-flow-refactored .structured-brief::before{display:none}
      body.create-flow-refactored .structured-brief{margin-top:12px}
      body.create-flow-refactored .brief-chips{margin-top:8px}
      body.create-flow-refactored .flow-step-head{margin-bottom:14px}
      body.create-flow-refactored .flow-step-head .flow-label{margin-bottom:6px}
      body.create-flow-refactored .flow-step-head h2{margin:0;font-size:19px;letter-spacing:-.02em}
      body.create-flow-refactored .flow-step-head p{margin:5px 0 0;color:var(--muted);font-size:10px;line-height:1.5}
      body.create-flow-refactored .platform-section,body.create-flow-refactored .color-theme-section,body.create-flow-refactored .style-direction,body.create-flow-refactored .component-step{padding:20px}
      body.create-flow-refactored .platform-section .section-heading,body.create-flow-refactored .color-theme-section .section-heading,body.create-flow-refactored .style-direction .section-heading{margin-bottom:14px}
      body.create-flow-refactored .platform-section .section-heading .flow-label,body.create-flow-refactored .color-theme-section .section-heading .flow-label,body.create-flow-refactored .style-direction .section-heading .flow-label{display:inline-flex}
      body.create-flow-refactored .color-theme-section .design-system-workbench{display:none!important}
      body.create-flow-refactored .font-preview-shell{display:none!important}
      body.create-flow-refactored .font-workbench{margin-top:18px;padding-top:18px;border-top:1px solid #e5eae6}
      body.create-flow-refactored .font-workbench-heading{margin-bottom:10px}
      body.create-flow-refactored .font-preset-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
      body.create-flow-refactored .component-step{order:4;border:1px solid #dde2dd;border-radius:14px;background:#fff}
      body.create-flow-refactored .component-system-picker{margin-bottom:14px;padding:12px;border:1px solid #e1e6e2;border-radius:10px;background:#f8faf8}
      body.create-flow-refactored .component-system-picker .select-field{display:grid;grid-template-columns:160px minmax(0,1fr);align-items:center;gap:12px}
      body.create-flow-refactored .component-system-picker select{min-height:38px}
      body.create-flow-refactored .component-panel{display:block!important}
      body.create-flow-refactored .style-direction{order:5}
      body.create-flow-refactored .style-direction .style-card-grid{margin-bottom:2px}
      body.create-flow-refactored .token-foundation-block{margin-top:14px;padding-top:14px;border-top:1px solid #e5eae6}
      body.create-flow-refactored .create-advanced{margin-top:0;border:1px solid #dde2dd;border-radius:14px;background:#fff;overflow:hidden}
      body.create-flow-refactored .create-advanced>summary{padding:14px 18px;cursor:pointer;font-size:11px;font-weight:850;color:#385142;list-style:none}
      body.create-flow-refactored .create-advanced>summary::-webkit-details-marker{display:none}
      body.create-flow-refactored .create-advanced>summary::after{content:'＋';float:right;color:#6a776d}
      body.create-flow-refactored .create-advanced[open]>summary::after{content:'−'}
      body.create-flow-refactored .create-advanced .config-section{padding:18px!important;border-top:1px solid #e5eae6!important}
      body.create-flow-refactored .create-advanced .decision-controls>.select-field:has([name="format"]),body.create-flow-refactored .create-advanced .decision-controls>.select-field:has([name="designSystem"]){display:none}
      body.create-flow-refactored .create-advanced .format-icon-picker{display:none}
      body.create-flow-refactored #designSystemWorkbench{display:none!important}

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
      @media(max-width:780px){.format-icon-picker{grid-template-columns:repeat(2,minmax(0,1fr))}.preview-lab-stage .ds-preview-shell{grid-template-columns:1fr}.config-section[aria-labelledby="referenceTitle"] .choice-grid,.case-grid{grid-template-columns:1fr}.preview-field{width:100%}.preview-field select{width:100%}body.create-flow-refactored .font-preset-grid{grid-template-columns:1fr}body.create-flow-refactored .component-system-picker .select-field{grid-template-columns:1fr}}
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

    function enhanceBriefPresets(){
      const brief=document.querySelector('#intentForm .structured-brief');
      if(!brief)return;
      const fields=[...brief.querySelectorAll('label')].filter(label=>label.querySelector('input,textarea'));
      if(fields.length<3)return;
      const presets=[
        ['选择用户预设…','普通消费者','新用户 / 首次使用者','付费会员','团队管理员','内容创作者','附近上班族','学生 / 年轻用户','企业员工'],
        ['选择核心任务预设…','浏览与搜索内容','预约并完成支付','注册登录并完成设置','创建 / 编辑 / 发布内容','查看数据并管理任务','选购商品并完成下单','上传文件并整理资料','聊天 / 匹配 / 建立联系'],
        ['选择页面组合预设…','首页、列表、详情','登录、注册、首页、个人中心','首页、搜索、详情、结算、订单','工作台、列表、详情、设置','Onboarding、首页、编辑、发布','首页、日历、预约、支付、订单','首页、消息、聊天、个人资料','首页、上传、文件库、详情、设置']
      ];
      fields.slice(0,3).forEach((label,index)=>{
        if(label.querySelector('.brief-preset-select'))return;
        const input=label.querySelector('input,textarea');
        const select=document.createElement('select');
        select.className='brief-preset-select';
        select.setAttribute('aria-label',presets[index][0]);
        presets[index].forEach((text,i)=>{const option=document.createElement('option');option.value=i?text:'';option.textContent=text;select.append(option)});
        select.addEventListener('change',()=>{
          if(!select.value)return;
          input.value=select.value;
          input.dispatchEvent(new Event('input',{bubbles:true}));
          input.dispatchEvent(new Event('change',{bubbles:true}));
          select.value='';
        });
        label.append(select);
      });
    }

    function setStepHeading(section, number, kicker, title, intro){
      if(!section)return;
      const heading=section.querySelector(':scope > .section-heading');
      if(!heading)return;
      const box=heading.querySelector(':scope > div')||heading;
      let label=box.querySelector('.flow-label');
      if(!label){label=document.createElement('div');label.className='flow-label';box.prepend(label)}
      label.innerHTML='<span>'+number+'</span> '+kicker;
      const h=box.querySelector('h2');if(h)h.textContent=title;
      const p=box.querySelector('p');if(p)p.textContent=intro;
    }

    function restructureCreateFlow(){
      const intentForm=document.querySelector('#intentForm');
      const isCreate=intentForm?.dataset.intent==='create';
      document.body.classList.toggle('create-flow-refactored',Boolean(isCreate));
      if(!isCreate)return;

      const briefSection=intentForm.querySelector('.config-section[aria-labelledby="briefTitle"]');
      if(briefSection){
        const heading=briefSection.querySelector(':scope > .section-heading');
        if(heading){
          const box=heading.querySelector(':scope > div')||heading;
          let label=box.querySelector('.flow-label');if(!label){label=document.createElement('div');label.className='flow-label';box.prepend(label)}
          label.innerHTML='<span>1</span> Product';
          const h=box.querySelector('h2');if(h)h.textContent='做什么产品';
          const p=box.querySelector('p');if(p)p.textContent='先把产品、用户、核心任务和必要页面说清楚。';
        }
      }

      const platform=document.querySelector('.platform-section');
      setStepHeading(platform,'2','Platform','选平台','选择最终运行的平台，导航、控件和安全区会跟随平台规范。');

      const color=document.querySelector('.color-theme-section');
      setStepHeading(color,'3','Color','选颜色','先选一套颜色方向；组件系统可以在下一步单独调整。');

      let componentStep=document.querySelector('#componentStep');
      if(!componentStep){
        componentStep=document.createElement('section');componentStep.id='componentStep';componentStep.className='component-step';
        componentStep.innerHTML='<div class="flow-step-head"><div class="flow-label"><span>4</span> Components</div><h2>选组件系统</h2><p>决定按钮、表单、列表、导航等组件采用哪套设计系统。</p></div><div class="component-system-picker" id="componentSystemPicker"></div><div class="component-panel" id="componentPanel"></div>';
        color?.insertAdjacentElement('afterend',componentStep);
      }

      const decisions=intentForm.querySelector('.config-section[aria-labelledby="decisionsTitle"]');
      const systemSelect=decisions?.querySelector('.select-field:has(select[name="designSystem"])');
      const picker=componentStep.querySelector('#componentSystemPicker');
      if(systemSelect&&picker&&!picker.contains(systemSelect))picker.append(systemSelect);
      const components=workbench.querySelector('[data-ds-panel="components"]');
      const componentPanel=componentStep.querySelector('#componentPanel');
      if(components&&componentPanel&&!componentPanel.contains(components)){components.classList.add('is-active');componentPanel.append(components)}

      const visual=document.querySelector('.style-direction');
      setStepHeading(visual,'5','Visual','字体与基础视觉','选择整体视觉方向和字体；密度、间距等基础参数放在这里统一处理。');
      if(componentStep&&visual&&componentStep.nextElementSibling!==visual)componentStep.insertAdjacentElement('afterend',visual);

      const font=decisions?.querySelector('.font-workbench');
      if(font&&visual&&!visual.contains(font))visual.append(font);
      const tokens=decisions?.querySelector('.token-foundation-block');
      if(tokens&&visual&&!visual.contains(tokens))visual.append(tokens);

      let advanced=document.querySelector('#createAdvanced');
      if(!advanced){advanced=document.createElement('details');advanced.id='createAdvanced';advanced.className='create-advanced';advanced.innerHTML='<summary>更多设置 · 参考案例 / 实现深度 / 图片资产</summary>';visual?.insertAdjacentElement('afterend',advanced)}
      const reference=intentForm.querySelector('.config-section[aria-labelledby="referenceTitle"]');
      if(reference&&advanced&&!advanced.contains(reference))advanced.append(reference);
      if(decisions&&advanced&&!advanced.contains(decisions))advanced.append(decisions);
    }

    const intentForm=document.querySelector('#intentForm');
    if(intentForm){
      let enhanceTimer=0;
      new MutationObserver(()=>{clearTimeout(enhanceTimer);enhanceTimer=setTimeout(()=>{enhanceFormatSelector();enhanceBriefPresets();restructureCreateFlow()},30)}).observe(intentForm,{childList:true,subtree:true});
      enhanceFormatSelector();enhanceBriefPresets();restructureCreateFlow();
    }

    const previewTab=workbench.querySelector('[data-ds-tab="preview"]');previewTab?.remove();
    const foundationTab=workbench.querySelector('[data-ds-tab="foundation"]'),foundationPanel=workbench.querySelector('[data-ds-panel="foundation"]');
    workbench.querySelectorAll('.ds-tab').forEach(el=>el.classList.toggle('is-active',el===foundationTab));workbench.querySelectorAll('.ds-panel').forEach(el=>el.classList.toggle('is-active',el===foundationPanel));

    const section=document.createElement('section');section.className='preview-lab-section';section.id='previewLabSection';section.innerHTML=`
      <div class="preview-lab-head"><div><div class="flow-label"><span>6</span> Live preview</div><h2>最终页面效果</h2><p>前面的颜色、组件、字体和平台会直接应用到这里。完整页面只在这里预览一次。</p></div><span class="preview-lab-badge">实时联动</span></div>
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
    function syncSystem(){const text=document.querySelector('#previewSystemName')?.textContent?.trim()||document.querySelector('#componentSystemPicker select')?.selectedOptions?.[0]?.textContent||'跟随上方选择';section.querySelector('#previewCurrentSystem').textContent=text}
    pageSelect.addEventListener('change',applyCopy);languageSelect.addEventListener('change',applyCopy);section.querySelectorAll('#previewDeviceSegment button').forEach(b=>b.onclick=()=>setDevice(b.dataset.size));section.querySelectorAll('#previewThemeSegment button').forEach(b=>b.onclick=()=>setTheme(b.dataset.theme));
    const platformGrid=document.querySelector('#platformGrid');if(platformGrid)new MutationObserver(()=>{const p=document.querySelector('.platform-card.is-active')?.dataset.platform;if(p==='windows'||p==='macos')setDevice('desktop');else if(p)setDevice('mobile')}).observe(platformGrid,{subtree:true,attributes:true,attributeFilter:['class']});
    const systemName=document.querySelector('#previewSystemName');if(systemName)new MutationObserver(syncSystem).observe(systemName,{childList:true,characterData:true,subtree:true});
    document.addEventListener('change',e=>{if(e.target.matches('#componentSystemPicker select,[name="colorTheme"],[name="fontScheme"]'))setTimeout(syncSystem,30)});
    applyCopy();setDevice(device?.dataset.size||'mobile');syncSystem();restructureCreateFlow();
  });
})();
