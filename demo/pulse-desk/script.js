const services=[
  {id:'diagnostic',code:'DX',name:'全设备深度诊断',category:'phone',desc:'40 项硬件检测与系统健康报告',price:199,duration:45,tag:'新客首选',features:['电池与核心硬件检测','系统性能与安全扫描','工程师当面解读报告']},
  {id:'battery',code:'BT',name:'手机电池焕新',category:'phone',desc:'原厂级电芯检测与更换服务',price:329,duration:60,tag:'热门',features:['更换前健康度检测','高品质电芯与 90 天保障','免费清洁充电接口']},
  {id:'screen',code:'SC',name:'屏幕精细修复',category:'phone',desc:'显示、触控与玻璃状态完整评估',price:599,duration:90,tag:'',features:['屏幕与触控联合检测','透明报价后再维修','维修后完整功能复测']},
  {id:'tuneup',code:'PC',name:'电脑性能调优',category:'computer',desc:'系统清理、温控优化与性能恢复',price:259,duration:60,tag:'推荐',features:['存储与启动项优化','散热系统状态评估','性能前后对比报告']},
  {id:'data',code:'DR',name:'数据迁移护航',category:'computer',desc:'新旧设备资料安全迁移与核验',price:159,duration:50,tag:'',features:['照片与文件完整迁移','应用与账户迁移指导','迁移结果现场核验']},
  {id:'audio',code:'AU',name:'音频设备精护',category:'audio',desc:'耳机清洁、声学检测与连接修复',price:99,duration:30,tag:'快捷',features:['左右声道声学检测','深度清洁与消毒','蓝牙连接稳定性修复']}
];
let selected=services[0];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const routes={home:'概览',menu:'服务菜单',checkout:'确认并支付',orders:'我的订单'};
function card(s){return `<button class="service-card ${s.id===selected.id?'is-selected':''}" data-service="${s.id}" data-category="${s.category}"><span class="service-code">${s.code}</span>${s.tag?`<span style="position:absolute;right:16px;top:16px;color:#0052d9;font-size:9px">${s.tag}</span>`:''}<h3>${s.name}</h3><p>${s.desc} · ${s.duration} min</p><strong>¥ ${s.price}</strong></button>`}
function renderHome(){$('#homeServices').innerHTML=services.slice(0,3).map(card).join('')}
function renderMenu(filter='all'){
  let list=filter==='all'?services:services.filter(s=>s.category===filter);
  const sort=$('#sortServices').value;if(sort==='price')list=[...list].sort((a,b)=>a.price-b.price);if(sort==='duration')list=[...list].sort((a,b)=>a.duration-b.duration);
  $('#menuList').innerHTML=list.map(card).join('');renderDetail();bindServiceCards();
}
function renderDetail(){const s=selected;$('#detailPanel').innerHTML=`<div class="detail-top"><span class="detail-code">${s.code}</span><span class="status-chip"><i></i>${s.tag||'标准服务'}</span></div><h2>${s.name}</h2><p>${s.desc}。到店后由认证工程师先行确认设备状态与服务范围，全程透明可追踪。</p><div class="detail-meta"><div><span>标准价格</span><b>¥ ${s.price}</b></div><div><span>预计用时</span><b>${s.duration} 分钟</b></div></div><p class="eyebrow">服务包含</p><ul class="feature-list">${s.features.map(x=>`<li><svg><use href="#i-check"/></svg>${x}</li>`).join('')}</ul><button class="primary" data-book="${s.id}">预约这项服务 <svg><use href="#i-arrow"/></svg></button>`;$('#detailPanel [data-book]').addEventListener('click',()=>startCheckout(s.id))}
function bindServiceCards(){$$('[data-service]').forEach(el=>el.addEventListener('click',()=>{selected=services.find(s=>s.id===el.dataset.service);if(el.closest('#homeServices')){show('menu')}else{renderMenu($('.filter-tabs .is-active')?.dataset.filter||'all')}}))}
function show(name){$$('.page').forEach(p=>p.classList.toggle('is-active',p.dataset.page===name));$$('.nav-item[data-route]').forEach(n=>n.classList.toggle('is-active',n.dataset.route===name));$('#crumbCurrent').textContent=routes[name];history.replaceState(null,'',`#${name}`);window.scrollTo({top:0,behavior:'smooth'});$('.sidebar').classList.remove('is-open')}
function startCheckout(id){selected=services.find(s=>s.id===id)||selected;$('#summaryIcon').textContent=selected.code;$('#summaryName').textContent=selected.name;$('#summaryDuration').textContent=`约 ${selected.duration} 分钟`;$('#summaryPrice').textContent=`¥${selected.price}`;const total=Math.max(0,selected.price-30);$('#summaryTotal').textContent=`¥${total}`;$('#payButton').childNodes[0].textContent=`确认支付 ¥${total} `;$('#ticketService').textContent=selected.name;$('#ticketDuration').textContent=`预计 ${selected.duration} 分钟`;show('checkout')}
function toast(message){const t=$('.toast');t.textContent=message;t.classList.add('is-visible');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('is-visible'),2200)}
renderHome();renderMenu();bindServiceCards();
$$('[data-route]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.route)));
$$('[data-open-service]').forEach(b=>b.addEventListener('click',()=>startCheckout(b.dataset.openService)));
$$('.filter-tabs button').forEach(b=>b.addEventListener('click',()=>{$$('.filter-tabs button').forEach(x=>x.classList.toggle('is-active',x===b));renderMenu(b.dataset.filter)}));
$('#sortServices').addEventListener('change',()=>renderMenu($('.filter-tabs .is-active').dataset.filter));
$$('.choice').forEach(b=>b.addEventListener('click',()=>{[...b.parentElement.children].forEach(x=>x.classList.remove('is-selected'));b.classList.add('is-selected')}));
$$('.date-strip button,.time-grid button').forEach(b=>b.addEventListener('click',()=>{[...b.parentElement.children].forEach(x=>x.classList.remove('is-selected'));b.classList.add('is-selected')}));
$('#payButton').addEventListener('click',()=>{if(!$('.agreement input').checked){toast('请先同意预约规则与退款政策');return}$('#payButton').disabled=true;$('#payButton').textContent='支付处理中…';setTimeout(()=>{show('orders');toast('支付成功，预约已确认')},650)});
$('#cancelOrder').addEventListener('click',()=>toast('取消申请已记录，请在到店前 2 小时完成确认'));
$('.mobile-menu').addEventListener('click',()=>$('.sidebar').classList.toggle('is-open'));
$('.search input').addEventListener('keydown',e=>{if(e.key==='Enter'){show('menu');toast(`正在显示与“${e.target.value||'全部'}”相关的服务`)}});
const initial=location.hash.slice(1);if(routes[initial])show(initial);
