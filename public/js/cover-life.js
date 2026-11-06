// ═══════════════════════════════════════════════════════════
// Cover "Living Illustration": Gentle Organic Ambient Motion
// Realistic motion for: Brass Temple Bell, Hanging Flowers,
// Red Silk Drapery. Plaque & Monogram remain rock-solid static.
// ═══════════════════════════════════════════════════════════

const SRC_W = 1152;
const SRC_H = 2048;

const VERT = `#version 300 es
out vec2 vUv;
void main() {
  vec2 pos = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = vec2(pos.x, 1.0 - pos.y);
  gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform sampler2D uMask;
uniform float uTime;
uniform vec4 uCover; // scaleU, scaleV, offU, offV
in vec2 vUv;
out vec4 outColor;

const vec2 SRC = vec2(${SRC_W}.0, ${SRC_H}.0);

void main() {
  vec2 uv = vec2(uCover.z + vUv.x * uCover.x, uCover.w + vUv.y * uCover.y);
  vec2 p = uv * SRC;
  float t = uTime;
  vec3 m = texture(uMask, uv).rgb;
  vec2 d = vec2(0.0);

  // 1. Unified Top-Right Flowers, Leaves & Temple Bell (Green Channel m.g):
  // Slow, graceful pendulum breeze field — zero internal boundaries, zero tearing
  if (m.g > 0.002) {
    float hang = clamp(p.y / 480.0, 0.15, 1.0);
    float sway = sin(t * 1.65 - p.x * 0.0016) * 0.82 + sin(t * 0.95 + 0.8) * 0.18;
    d.x += m.g * sway * 7.2 * hang;
    d.y += m.g * abs(sway) * 1.0 * hang;
  }

  // 2. Top-Left Red Silk Drapery Interior (Red Channel m.r):
  if (m.r > 0.002) {
    float cWave = sin(t * 1.45 + p.y * 0.0038 - p.x * 0.0028);
    d.x += m.r * cWave * 6.8;
    d.y += m.r * cos(t * 1.20 + p.y * 0.0032) * 2.8;
  }

  vec2 finalUV = clamp((p - d) / SRC, vec2(0.0005), vec2(0.9995));
  vec3 col = texture(uTex, finalUV).rgb;

  // 4. Zero-offset golden breathing glow directly on the G&K wreath & letters (no double image!)
  vec2 gkCenter = vec2(576.0, 825.0);
  float gkDist = length((p - gkCenter) / vec2(260.0, 210.0));
  if (gkDist < 1.0) {
    float gkMask = smoothstep(1.0, 0.35, gkDist);
    float goldBreathe = 0.5 + 0.5 * sin(t * 2.1);
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    // Boost warm gold/crimson highlights on the monogram & wreath in-place
    col += vec3(0.22, 0.15, 0.04) * gkMask * goldBreathe * smoothstep(0.25, 0.85, lum);
  }

  // Subtle natural sunlight flutter through leaves
  if (m.g > 0.02) {
    float leafGlint = sin(t * 2.2 + p.x * 0.03 - p.y * 0.02) * 0.5 + 0.5;
    col += col * m.g * 0.045 * (leafGlint - 0.5);
  }

  outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

function compile(gl, type, source) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, source);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('cover-life shader error:', gl.getShaderInfoLog(sh));
    return null;
  }
  return sh;
}

export function initCoverLife() {
  const card = document.getElementById('cover-card');
  const img = card && card.querySelector('.page-fullwidth-img');
  if (!card || !img) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'cover-life-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'low-power' });
  if (!gl) return;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn('cover-life link error:', gl.getProgramInfoLog(prog));
    return;
  }
  gl.useProgram(prog);
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const uTime = gl.getUniformLocation(prog, 'uTime');
  const uCover = gl.getUniformLocation(prog, 'uCover');
  gl.uniform1i(gl.getUniformLocation(prog, 'uTex'), 0);
  gl.uniform1i(gl.getUniformLocation(prog, 'uMask'), 1);

  function makeTexture(unit, source, mips) {
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    if (mips) gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mips ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  }

  let ready = false;
  let visible = true;
  let hasDrawn = false;
  let raf = 0;
  let w = 0;
  let h = 0;

  function layout() {
    const cw = img.offsetWidth;
    const ch = img.offsetHeight;
    if (!cw || !ch) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.style.position = 'absolute';
    canvas.style.left = img.offsetLeft + 'px';
    canvas.style.top = img.offsetTop + 'px';
    canvas.style.width = cw + 'px';
    canvas.style.height = ch + 'px';
    w = Math.round(cw * dpr);
    h = Math.round(ch * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);

    // Cover math
    const imgAspect = SRC_W / SRC_H;
    const boxAspect = cw / ch;
    let su = 1, sv = 1, ou = 0, ov = 0;
    if (boxAspect > imgAspect) {
      sv = imgAspect / boxAspect;
    } else {
      su = boxAspect / imgAspect;
      ou = (1 - su) / 2;
    }
    gl.uniform4f(uCover, su, sv, ou, ov);
  }

  function draw(seconds) {
    if (!w || !h) layout();
    if (!w || !h) return;
    gl.useProgram(prog);
    gl.bindVertexArray(vao);
    gl.uniform1f(uTime, seconds);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!hasDrawn) {
      hasDrawn = true;
      img.style.visibility = 'hidden';
    }
  }

  function frame(now) {
    raf = 0;
    if (!visible || document.hidden) return;
    if (!document.body.classList.contains('is-envelope-closed')) {
      draw(now / 1000);
    }
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (!raf && ready && visible && !document.hidden) raf = requestAnimationFrame(frame);
  }

  function boot() {
    if (ready) return;
    const mask = new Image();
    mask.onload = () => {
      if (ready) return;
      try {
        makeTexture(0, img, false);
        makeTexture(1, mask, false);
      } catch (e) {
        console.warn('cover-life texture error:', e);
        return;
      }
      card.insertBefore(canvas, img.nextSibling);
      ready = true;
      layout();
      draw(0);
      start();
    };
    mask.src = '/media/cover_ghat_mask.png?v=15';
  }

  if (img.complete && img.naturalWidth) boot();
  else img.addEventListener('load', boot, { once: true });

  if (window.ResizeObserver) new ResizeObserver(() => ready && layout()).observe(img);
  window.addEventListener('resize', () => ready && layout(), { passive: true });
  document.addEventListener('visibilitychange', start);
  if (window.IntersectionObserver) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      start();
    }, { threshold: 0 }).observe(card);
  }
}
