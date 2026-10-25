// Liquid image renderer: draws one image into a WebGL canvas and warps it in
// horizontal bands, so edges ripple like a reflection on water. The warp is
// strongest while the image is being revealed and whenever the page scrolls fast.

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform float uTime;
uniform float uReveal;
uniform float uAmp;
uniform float uImgAspect;
uniform float uCanvasAspect;
uniform float uWipe;
varying vec2 vUv;

float hash(float n) { return fract(sin(n) * 43758.5453123); }
float noise(float x) {
  float i = floor(x);
  float f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(hash(i), hash(i + 1.0), f) * 2.0 - 1.0;
}

void main() {
  vec2 uv = vUv;
  float y = uv.y;
  // layered bands: broad swells, finer ripples and a thin shimmer
  float w = noise(y * 4.0 + uTime * 0.45) * 0.6
          + noise(y * 13.0 - uTime * 0.9) * 0.32
          + sin(y * 38.0 + uTime * 2.2) * 0.08;

  vec2 d = uv;
  d.x += w * uAmp;
  d.y += noise(uv.x * 3.0 + uTime * 0.3) * uAmp * 0.08;

  // wavy wipe from the left while revealing
  float edge = uReveal * 1.35 - 0.2 + w * 0.18 * (1.0 - uReveal);
  float mask = mix(1.0, 1.0 - smoothstep(edge - 0.1, edge, uv.x), uWipe);

  // object-fit: cover
  vec2 ratio = vec2(
    min(uCanvasAspect / uImgAspect, 1.0),
    min(uImgAspect / uCanvasAspect, 1.0)
  );
  vec2 t = d * ratio + (1.0 - ratio) * 0.5;

  float inside = step(0.0, d.x) * step(d.x, 1.0) * step(0.0, d.y) * step(d.y, 1.0);
  vec4 c = texture2D(uTex, t);
  float dim = 1.0 - 0.3 * clamp(uAmp * 6.0, 0.0, 1.0);
  // the texture is premultiplied, so cut-out marks (logos) keep clean edges
  float m = mask * inside * smoothstep(0.0, 0.35, uReveal);
  gl_FragColor = vec4(c.rgb * dim * m, c.a * m);
}
`

// ---- shared scroll velocity (px per frame, smoothed) ----
let velocity = 0
let lastY = 0
let tracking = false
function trackScroll() {
  if (tracking || typeof window === 'undefined') return
  tracking = true
  lastY = window.scrollY
  const loop = () => {
    const y = window.scrollY
    const v = Math.abs(y - lastY)
    lastY = y
    velocity += (v - velocity) * 0.12
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
}
export function scrollVelocity() {
  return velocity
}

const REVEAL_MS = 2600
const REVEAL_AMP = 0.22
const SCROLL_AMP = 0.0016
const MAX_SCROLL_AMP = 0.09

export type Liquid = {
  start: () => void
  destroy: () => void
}

export function createLiquid(
  canvas: HTMLCanvasElement,
  src: string | HTMLVideoElement | HTMLCanvasElement,
  state: { revealStart: number | null },
  onFail: () => void,
  { wipe = true }: { wipe?: boolean } = {},
): Liquid | null {
  trackScroll()
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false })
  if (!gl) return null

  const compile = (type: number, code: string) => {
    const s = gl.createShader(type)!
    gl.shaderSource(s, code)
    gl.compileShader(s)
    return s
  }
  const prog = gl.createProgram()!
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
  gl.useProgram(prog)

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  const aPos = gl.getAttribLocation(prog, 'aPos')
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

  const u = (n: string) => gl.getUniformLocation(prog, n)
  const uTime = u('uTime')
  const uReveal = u('uReveal')
  const uAmp = u('uAmp')
  const uImgAspect = u('uImgAspect')
  const uCanvasAspect = u('uCanvasAspect')
  gl.uniform1f(u('uWipe'), wipe ? 1 : 0)

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

  const tex = gl.createTexture()
  let imgAspect = 1
  let loaded = false
  let raf = 0
  let running = false
  let dead = false
  const t0 = performance.now()

  const upload = (source: TexImageSource) => {
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
  }
  const initTexture = () => {
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  }

  // a playing <video> is re-uploaded every frame; an image or canvas once
  const video = src instanceof HTMLVideoElement ? src : null
  if (src instanceof HTMLCanvasElement) {
    imgAspect = src.width / src.height
    initTexture()
    upload(src)
    loaded = true
  } else if (video) {
    const ready = () => {
      if (dead || loaded || video.readyState < 2) return
      imgAspect = video.videoWidth / video.videoHeight
      initTexture()
      upload(video)
      loaded = true
      if (running) loop()
    }
    video.addEventListener('loadeddata', ready)
    video.addEventListener('error', onFail)
    ready()
  } else {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      if (dead) return
      imgAspect = img.naturalWidth / img.naturalHeight
      initTexture()
      upload(img)
      loaded = true
      if (running) loop()
    }
    img.onerror = onFail
    img.src = src as string
  }

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr))
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr))
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    gl.viewport(0, 0, w, h)
  }

  const loop = () => {
    if (dead || !loaded) return
    raf = requestAnimationFrame(loop)
    resize()
    const now = performance.now()
    if (state.revealStart === null) state.revealStart = now
    const p = Math.min((now - state.revealStart) / REVEAL_MS, 1)
    const eased = 1 - Math.pow(1 - p, 3)
    const amp = REVEAL_AMP * (1 - eased) + Math.min(velocity * SCROLL_AMP, MAX_SCROLL_AMP)
    if (video && video.readyState >= 2) upload(video)
    gl.uniform1f(uTime, (now - t0) / 1000)
    gl.uniform1f(uReveal, eased)
    gl.uniform1f(uAmp, amp)
    gl.uniform1f(uImgAspect, imgAspect)
    gl.uniform1f(uCanvasAspect, canvas.width / canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  return {
    start() {
      if (running) return
      running = true
      loop()
    },
    destroy() {
      dead = true
      cancelAnimationFrame(raf)
      gl.deleteTexture(tex)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}
