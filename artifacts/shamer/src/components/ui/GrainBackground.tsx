import { useEffect, useRef } from "react";

// Settings taken from the Grain Gradient design file
const BG = {
  colorStart: "#f8b6b4",
  colorEnd: "#ff9999",
  angle: 100,             // degrees
  midpoint: 64,           // %
  softness: 60,           // %
  highlightColor: "#fcd6d0",
  highlightStrength: 61,  // %
  highlightX: 28,         // %
  highlightY: 37,         // %
  highlightSize: 57,      // %
  grainAmount: 10,        // %
  grainSize: 1,           // px
  grainTint: "#ffffff",
  grainShadow: "#f25e5e",
  grainColor: 50,         // %
  grainBrightness: 0,
  seed: 1,
  resolution: 1,
};

function hex(h: string): [number, number, number] {
  let s = (h || "#000").replace("#", "");
  if (s.length === 3) s = s.split("").map((c) => c + c).join("");
  const n = parseInt(s, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function draw(c: HTMLCanvasElement) {
  const p = BG;
  const cw = c.clientWidth;
  const ch = c.clientHeight;
  if (!cw || !ch) return;

  let res = p.resolution * Math.min(window.devicePixelRatio || 1, 2);
  const maxPx = 4.5e6;
  if (cw * ch * res * res > maxPx) res = Math.sqrt(maxPx / (cw * ch));
  const W = Math.max(1, Math.round(cw * res));
  const H = Math.max(1, Math.round(ch * res));
  if (c.width === W && c.height === H) return; // nothing changed, skip redraw
  c.width = W;
  c.height = H;

  const ctx = c.getContext("2d");
  if (!ctx) return;

  // Linear gradient
  const ang = ((p.angle - 90) * Math.PI) / 180;
  const cx = W / 2, cy = H / 2;
  const L = (Math.abs(W * Math.cos(ang)) + Math.abs(H * Math.sin(ang))) / 2;
  const g = ctx.createLinearGradient(
    cx - Math.cos(ang) * L, cy - Math.sin(ang) * L,
    cx + Math.cos(ang) * L, cy + Math.sin(ang) * L,
  );
  const mid = p.midpoint / 100, soft = p.softness / 100;
  g.addColorStop(0, p.colorStart);
  g.addColorStop(Math.max(0, mid - soft / 2), p.colorStart);
  g.addColorStop(Math.min(1, mid + soft / 2), p.colorEnd);
  g.addColorStop(1, p.colorEnd);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Soft highlight
  const hs = p.highlightStrength / 100;
  if (hs > 0) {
    const hx = (p.highlightX / 100) * W;
    const hy = (p.highlightY / 100) * H;
    const hr = (p.highlightSize / 100) * Math.hypot(W, H) * 0.86;
    const [r, gg, b] = hex(p.highlightColor);
    const rg = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr);
    rg.addColorStop(0, `rgba(${r},${gg},${b},${hs})`);
    rg.addColorStop(1, `rgba(${r},${gg},${b},0)`);
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, W, H);
  }

  // Grain
  const amt = (p.grainAmount / 100) * 255;
  const chroma = p.grainColor / 100;
  const bias = (p.grainBrightness / 100) * 255;
  if (amt <= 0 && bias === 0) return;
  const gs = Math.max(1, Math.round(p.grainSize * res));
  const img = ctx.getImageData(0, 0, W, H);
  const d = img.data;
  let seed = (p.seed * 99991) >>> 0;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const cols = Math.ceil(W / gs), rows = Math.ceil(H / gs);
  const [tr, tg, tb] = hex(p.grainTint);
  const [sr, sg, sb] = hex(p.grainShadow);
  const nl = new Float32Array(cols * 2);

  for (let ry = 0; ry < rows; ry++) {
    for (let i = 0; i < cols; i++) {
      nl[i * 2] = (rnd() - 0.5) * 2;
      nl[i * 2 + 1] = Math.max(0, rnd() - 0.5) * 2 * chroma;
    }
    for (let y = ry * gs, ye = Math.min(H, y + gs); y < ye; y++) {
      for (let x = 0; x < W; x++) {
        const k = ((x / gs) | 0) * 2;
        const o = (y * W + x) * 4;
        const v = nl[k], t = nl[k + 1];
        if (v >= 0) {
          const n = v * amt;
          d[o] += n + bias + (tr - d[o]) * t;
          d[o + 1] += n + bias + (tg - d[o + 1]) * t;
          d[o + 2] += n + bias + (tb - d[o + 2]) * t;
        } else {
          const s = ((-v * amt) / 255) * 1.6;
          d[o] += (sr - d[o]) * s + bias;
          d[o + 1] += (sg - d[o + 1]) * s + bias;
          d[o + 2] += (sb - d[o + 2]) * s + bias;
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0);
}

export default function GrainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    let raf = 0;
    draw(c);
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => draw(c));
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        display: "block",
        zIndex: 0,
        pointerEvents: "none",
        // shown instantly while the canvas draws
        background: "linear-gradient(100deg, #f8b6b4, #ff9999)",
      }}
    />
  );
}
