(() => {
  const init = () => {
    const hero = document.querySelector('.project-hero');
    const image = hero?.querySelector('.project-hero-image');
    if (!hero || !image || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'project-hero-ripple';
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, {position:'absolute',inset:'0',width:'100%',height:'100%',zIndex:'-2',pointerEvents:'none'});
    hero.insertBefore(canvas, image.nextSibling);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = { x:.5, y:.44, tx:.5, ty:.44, energy:0 };
    const brushSize = 70, strength = .055, swirl = 1, rings = 4;

    function resize(){
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(hero.clientWidth*dpr);
      canvas.height = Math.round(hero.clientHeight*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    const ro = new ResizeObserver(resize); ro.observe(hero); resize();

    function cover(){
      const w=hero.clientWidth,h=hero.clientHeight,iw=image.naturalWidth,ih=image.naturalHeight;
      const s=Math.max(w/iw,h/ih), dw=iw*s, dh=ih*s;
      return [(w-dw)/2,(h-dh)/2,dw,dh];
    }
    function drawImage(dx=0,dy=0,scale=1){
      const [x,y,w,h]=cover();
      ctx.save();
      ctx.translate(hero.clientWidth/2+dx,hero.clientHeight/2+dy);
      ctx.scale(scale,scale);
      ctx.translate(-hero.clientWidth/2,-hero.clientHeight/2);
      ctx.filter='grayscale(1) contrast(1.06)';
      ctx.drawImage(image,x,y,w,h);
      ctx.restore();
    }
    function render(){
      const w=hero.clientWidth,h=hero.clientHeight;
      state.x += (state.tx-state.x)*.16; state.y += (state.ty-state.y)*.16; state.energy*=.965;
      ctx.clearRect(0,0,w,h); drawImage();
      ctx.save(); ctx.globalCompositeOperation='multiply'; ctx.fillStyle='rgba(16,185,129,.26)'; ctx.fillRect(0,0,w,h); ctx.restore();
      if(state.energy>.002){
        const px=state.x*w, py=state.y*h;
        for(let i=rings;i>=1;i--){
          const r=brushSize*(.72+i*.48)*(1+state.energy*.55);
          const phase=performance.now()*.006+i*1.7;
          const off=Math.sin(phase)*strength*brushSize*state.energy*8;
          ctx.save(); ctx.beginPath(); ctx.arc(px,py,r,0,Math.PI*2); ctx.clip();
          const angle=phase*swirl*.08; ctx.translate(px,py); ctx.rotate(angle*state.energy); ctx.translate(-px,-py);
          drawImage(Math.cos(phase)*off,Math.sin(phase)*off,1+strength*state.energy*(rings-i+1)); ctx.restore();
        }
        ctx.save(); ctx.globalCompositeOperation='screen';
        for(let i=1;i<=rings;i++){ const r=brushSize*(.72+i*.48)*(1+state.energy*.55); ctx.beginPath(); ctx.arc(px,py,r,0,Math.PI*2); ctx.strokeStyle=`rgba(16,185,129,${.08*state.energy})`; ctx.lineWidth=1.25; ctx.stroke(); }
        ctx.restore();
      }
      requestAnimationFrame(render);
    }
    const start=()=>{ image.style.visibility='hidden'; render(); };
    if(image.complete && image.naturalWidth) start(); else image.addEventListener('load',start,{once:true});
    hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect(); state.tx=(e.clientX-r.left)/r.width; state.ty=(e.clientY-r.top)/r.height; state.energy=Math.min(1,state.energy+.18);});
    hero.addEventListener('pointerenter',()=>state.energy=.55);
    hero.addEventListener('pointerleave',()=>{state.tx=.5;state.ty=.44;state.energy*=.55;});
  };
  document.readyState==='loading' ? document.addEventListener('DOMContentLoaded',init,{once:true}) : init();
})();
