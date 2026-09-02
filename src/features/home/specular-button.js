(() => {
  const PAD = 20;
  const VERT = `#version 300 es
    in vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const FRAG = `#version 300 es
    precision highp float;

    uniform vec2 uCenter;
    uniform vec2 uHalfSize;
    uniform float uRadius;
    uniform float uAngle;
    uniform float uPx;
    uniform vec3 uLineColor;
    uniform vec3 uBaseColor;
    uniform float uIntensity;
    uniform float uShineSize;
    uniform float uShineFade;
    uniform float uThickness;
    uniform float uBaseWidth;

    out vec4 fragColor;

    float sdRoundedRect(vec2 p, vec2 b, float r) {
      vec2 q = abs(p) - b + r;
      return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
    }

    float gaussianLine(float d, float sigma) {
      float x = d / (sigma + 1e-6);
      float k = mix(1.0, 1.6, smoothstep(0.0, 1.5, x));
      return exp(-k * x * x);
    }

    void main() {
      vec2 p = gl_FragCoord.xy - uCenter;
      float d = sdRoundedRect(p, uHalfSize, uRadius);
      vec2 L = vec2(cos(uAngle), sin(uAngle));

      float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * 0.45;
      vec2 nEll = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
      float phi = acos(clamp(abs(dot(nEll, L)), 0.0, 1.0));
      float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);
      float line = gaussianLine(d, uThickness);
      float edgeClamp = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d));
      float hi = line * rim * edgeClamp * uIntensity;

      vec3 col = uBaseColor * base + uLineColor * hi;
      float a = clamp(base + hi, 0.0, 1.0);
      fragColor = vec4(col, a);
    }
  `;

  function compile(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('SpecularButton shader error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function link(gl) {
    const vertex = compile(gl, gl.VERTEX_SHADER, VERT);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vertex || !fragment) return null;
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('SpecularButton program error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    return program;
  }

  function ensureLabel(button) {
    let label = button.querySelector('.specular-button__label');
    if (label) return label;

    const currentText = button.textContent.trim();
    const zh = button.dataset.zh;
    const en = button.dataset.en;
    label = document.createElement('span');
    label.className = 'specular-button__label';
    if (zh) label.dataset.zh = zh;
    if (en) label.dataset.en = en;
    label.textContent = currentText;

    button.removeAttribute('data-zh');
    button.removeAttribute('data-en');
    button.textContent = '';
    button.append(label);
    return label;
  }

  function initButton(button) {
    if (!button || button.dataset.specularReady === 'true') return;
    ensureLabel(button);
    button.classList.add('specular-button');
    button.dataset.specularReady = 'true';

    if (matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia('(hover: none), (pointer: coarse)').matches) return;

    const fx = document.createElement('span');
    fx.className = 'specular-button__fx';
    fx.setAttribute('aria-hidden', 'true');
    const canvas = document.createElement('canvas');
    fx.append(canvas);
    button.append(fx);

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });
    if (!gl) {
      fx.remove();
      return;
    }

    const program = link(gl);
    if (!program) {
      fx.remove();
      return;
    }
    gl.useProgram(program);
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {};
    ['uCenter','uHalfSize','uRadius','uAngle','uPx','uLineColor','uBaseColor','uIntensity','uShineSize','uShineFade','uThickness','uBaseWidth'].forEach((name) => {
      uniforms[name] = gl.getUniformLocation(program, name);
    });

    const settings = {
      radius: 18,
      intensity: 1,
      shineSize: 10,
      shineFade: 40,
      thickness: 1,
      speed: 0.35,
      proximity: 250,
    };

    const size = { w: 1, h: 1, dpr: 1 };
    const resize = () => {
      const rect = button.getBoundingClientRect();
      size.w = rect.width;
      size.h = rect.height;
      size.dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round((rect.width + PAD * 2) * size.dpr));
      canvas.height = Math.max(1, Math.round((rect.height + PAD * 2) * size.dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.uCenter, (PAD + rect.width / 2) * size.dpr, (PAD + rect.height / 2) * size.dpr);
      gl.uniform2f(uniforms.uHalfSize, (rect.width / 2) * size.dpr, (rect.height / 2) * size.dpr);
      gl.uniform1f(uniforms.uPx, size.dpr);
      gl.uniform1f(uniforms.uBaseWidth, size.dpr);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(button);
    resize();

    let pointerAngle = null;
    let proximityT = 0;
    const onPointerMove = (event) => {
      const rect = button.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.max(rect.left - event.clientX, 0, event.clientX - rect.right);
      const dy = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom);
      const dist = Math.hypot(dx, dy);

      if (dist === 0) {
        const nx = (event.clientX - cx) / Math.max(rect.width / 2, 1);
        const ny = (cy - event.clientY) / Math.max(rect.height / 2, 1);
        pointerAngle = Math.atan2(2 / rect.height, -2 / rect.width) + nx * 0.3 + ny * 0.15;
      } else {
        pointerAngle = Math.atan2(cy - event.clientY, event.clientX - cx);
      }

      const t = Math.max(0, 1 - dist / settings.proximity);
      proximityT = t * t * (3 - 2 * t);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let angle = 2.4;
    let idleAngle = 2.4;
    let bright = 0;
    let last = performance.now();
    let raf = 0;

    const render = (now) => {
      raf = requestAnimationFrame(render);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      idleAngle += settings.speed * dt;
      const target = pointerAngle == null ? idleAngle : pointerAngle;
      const diff = ((target - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      angle += diff * (1 - Math.exp(-dt * 7));
      bright += (proximityT - bright) * (1 - Math.exp(-dt * 8));

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uniforms.uAngle, angle);
      gl.uniform1f(uniforms.uRadius, Math.min(settings.radius, Math.min(size.w, size.h) / 2) * size.dpr);
      gl.uniform3f(uniforms.uLineColor, 1, 1, 1);
      gl.uniform3f(uniforms.uBaseColor, 0.32, 0.32, 0.32);
      gl.uniform1f(uniforms.uIntensity, settings.intensity * bright);
      gl.uniform1f(uniforms.uShineSize, settings.shineSize * Math.PI / 180);
      gl.uniform1f(uniforms.uShineFade, settings.shineFade * Math.PI / 180);
      gl.uniform1f(uniforms.uThickness, settings.thickness * size.dpr);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(render);

    window.addEventListener('pagehide', () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
    }, { once: true });
  }

  const init = () => {
    document.querySelectorAll('.project-hero-actions .button-outline-light').forEach(initButton);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
