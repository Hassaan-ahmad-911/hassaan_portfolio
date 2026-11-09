"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { profile } from "@/data/portfolio";
import { cn } from "@/lib/site";

/**
 * Hero portrait made of particles.
 *
 * On load, thousands of dots fly in from every edge of the hero and settle into
 * the photo. Afterwards they scatter away from the cursor and spring back.
 * "Reveal" swaps the dots for the real (background-removed) photo.
 *
 * The canvas is portalled into #hero-particles (which covers the whole hero),
 * so dots can start anywhere on screen. Plain Canvas 2D, transform-free, and the
 * loop stops whenever nothing is moving.
 */

type Particle = {
  x: number; // current position (CSS px, canvas space)
  y: number;
  vx: number;
  vy: number;
  sx: number; // flight start + bezier control point
  sy: number;
  cx: number;
  cy: number;
  tx: number; // target (home) position
  ty: number;
  delay: number; // seconds
  dur: number; // seconds
  size: number;
  shade: number; // 0..SHADES-1
  alpha: number; // animated 0..1
  base: number; // static opacity (soft fade at the bottom edge)
};

const SHADES = 14;
const REPEL_RADIUS = 90;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function ParticlePortrait() {
  const targetRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [ready, setReady] = useState(false);
  const revealRef = useRef(revealed);
  const restartRef = useRef<(() => void) | null>(null);

  useEffect(() => setHost(document.getElementById("hero-particles")), []);

  useEffect(() => {
    revealRef.current = revealed;
    restartRef.current?.();
  }, [revealed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const target = targetRef.current;
    if (!host || !canvas || !target) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    let particles: Particle[] = [];
    let img: HTMLImageElement | null = null;
    let raf = 0;
    let running = false;
    let visible = true;
    let startTime = 0;
    let phase: "intro" | "settled" | "scatter" = "intro";
    let scatterStart = 0;
    let width = 0;
    let height = 0;
    // Cached geometry (page coordinates), so pointer moves never force a layout read.
    let hostX = 0;
    let hostY = 0;
    const zone = { x0: 0, y0: 0, x1: 0, y1: 0 }; // portrait box + repel radius, canvas space
    const mouse = { x: -9999, y: -9999, active: false };
    const shadeColors = Array.from({ length: SHADES }, (_, i) => {
      const v = Math.round(48 + Math.pow(i / (SHADES - 1), 1.1) * 207); // 48..255 — keeps facial contrast
      return `rgb(${v},${v},${Math.min(255, v + 2)})`;
    });

    /** Sample the cut-out photo into particle targets, laid over the target box. */
    function build(fromCurrent: boolean) {
      if (!img) return;
      const hostRect = host!.getBoundingClientRect();
      const box = target!.getBoundingClientRect();
      width = hostRect.width;
      height = hostRect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const bx = box.left - hostRect.left;
      const by = box.top - hostRect.top;
      hostX = hostRect.left + window.scrollX;
      hostY = hostRect.top + window.scrollY;
      zone.x0 = bx - REPEL_RADIUS;
      zone.y0 = by - REPEL_RADIUS;
      zone.x1 = bx + box.width + REPEL_RADIUS;
      zone.y1 = by + box.height + REPEL_RADIUS;
      const want = width < 768 ? 6000 : 14000;
      const gap = Math.max(2.4, Math.sqrt((box.width * box.height * 0.55) / want));
      const cols = Math.max(1, Math.floor(box.width / gap));
      const rows = Math.max(1, Math.floor(box.height / gap));

      // Draw the photo "object-fit: cover" into a small grid-sized canvas and read its pixels.
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const octx = off.getContext("2d", { willReadFrequently: true })!;
      const scale = Math.max(cols / img.naturalWidth, rows / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      octx.drawImage(img, (cols - dw) * 0.53, rows - dh, dw, dh);
      const data = octx.getImageData(0, 0, cols, rows).data;

      const previous = particles;
      const next: Particle[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = (r * cols + c) * 4;
          const a = data[i + 3];
          if (a < 110) continue;
          const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
          const tx = bx + (c + 0.5 + (Math.random() - 0.5) * 0.9) * gap;
          const ty = by + (r + 0.5 + (Math.random() - 0.5) * 0.9) * gap;
          const v = r / rows;
          const fade = v < 0.8 ? 1 : Math.max(0, 1 - (v - 0.8) / 0.2); // dissolve the bottom edge
          const prev = fromCurrent ? previous[next.length % Math.max(previous.length, 1)] : undefined;
          // Start anywhere on (or just beyond) the screen.
          const sx = prev ? prev.x : (Math.random() * 1.3 - 0.15) * width;
          const sy = prev ? prev.y : (Math.random() * 1.3 - 0.15) * height;
          // Curved path: control point pushed sideways from the straight line.
          const mx = (sx + tx) / 2;
          const my = (sy + ty) / 2;
          const bend = (Math.random() - 0.5) * 0.6;
          next.push({
            x: sx,
            y: sy,
            vx: 0,
            vy: 0,
            sx,
            sy,
            cx: mx - (ty - sy) * bend,
            cy: my + (tx - sx) * bend,
            tx,
            ty,
            delay: Math.random() * (fromCurrent ? 0.35 : 0.9),
            dur: (fromCurrent ? 0.9 : 1.5) + Math.random() * 0.8,
            // Halftone: brighter areas get bigger dots, which keeps the face readable.
            size: gap * (0.42 + lum * 0.5 + Math.random() * 0.12),
            shade: Math.min(SHADES - 1, Math.floor(lum * SHADES)),
            alpha: prev ? prev.alpha : 0,
            base: fade,
          });
        }
      }
      // Group by shade so each colour is set once per frame.
      next.sort((p, q) => p.shade - q.shade);
      particles = next;
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      let shade = -1;
      for (const p of particles) {
        const a = p.alpha * p.base;
        if (a <= 0.01) continue;
        if (p.shade !== shade) {
          shade = p.shade;
          ctx!.fillStyle = shadeColors[shade];
        }
        ctx!.globalAlpha = a;
        ctx!.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx!.globalAlpha = 1;
      // Cursor ring while it's repelling dots.
      if (mouse.active && phase === "settled") {
        ctx!.strokeStyle = "rgba(237,237,239,0.55)";
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.arc(mouse.x, mouse.y, REPEL_RADIUS * 0.55, 0, Math.PI * 2);
        ctx!.stroke();
      }
    }

    /** Advance one frame. Returns true while anything is still moving. */
    function step(now: number) {
      const t = (now - startTime) / 1000;
      let moving = false;

      if (phase === "intro") {
        let done = true;
        for (const p of particles) {
          const k = Math.min(1, Math.max(0, (t - p.delay) / p.dur));
          if (k < 1) done = false;
          const e = easeInOutCubic(k);
          const u = 1 - e;
          p.x = u * u * p.sx + 2 * u * e * p.cx + e * e * p.tx;
          p.y = u * u * p.sy + 2 * u * e * p.cy + e * e * p.ty;
          p.alpha = Math.min(1, k * 2.2);
        }
        if (done) phase = "settled";
        moving = true;
      } else if (phase === "scatter") {
        const k = Math.min(1, (now - scatterStart) / 700);
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.94;
          p.vy *= 0.94;
          p.alpha = Math.max(0, 1 - k);
        }
        moving = k < 1;
      } else {
        // Settled: spring home, pushed away from the cursor.
        const r2 = REPEL_RADIUS * REPEL_RADIUS;
        for (const p of particles) {
          let fx = (p.tx - p.x) * 0.06;
          let fy = (p.ty - p.y) * 0.06;
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < r2 && d2 > 0.01) {
              const d = Math.sqrt(d2);
              const f = (1 - d / REPEL_RADIUS) * 6;
              fx += (dx / d) * f;
              fy += (dy / d) * f;
            }
          }
          p.vx = (p.vx + fx) * 0.82;
          p.vy = (p.vy + fy) * 0.82;
          p.x += p.vx;
          p.y += p.vy;
          if (Math.abs(p.vx) + Math.abs(p.vy) > 0.02) moving = true;
        }
        // Note: a resting cursor doesn't keep the loop alive — once the dots settle
        // around it, drawing stops until the pointer moves again.
      }
      return moving;
    }

    function loop(now: number) {
      const moving = step(now);
      draw();
      if (moving && visible) raf = requestAnimationFrame(loop);
      else running = false;
    }

    function kick() {
      if (running || !visible) return;
      running = true;
      raf = requestAnimationFrame(loop);
    }

    function settleInstantly() {
      for (const p of particles) {
        p.x = p.tx;
        p.y = p.ty;
        p.alpha = 1;
      }
      phase = "settled";
      draw();
    }

    // Reveal toggles: scatter the dots away, or fly them back in.
    restartRef.current = () => {
      if (!particles.length) return;
      if (revealRef.current) {
        phase = "scatter";
        scatterStart = performance.now();
        for (const p of particles) {
          const ang = Math.random() * Math.PI * 2;
          const sp = 4 + Math.random() * 10;
          p.vx = Math.cos(ang) * sp;
          p.vy = Math.sin(ang) * sp;
        }
        if (reduce) {
          for (const p of particles) p.alpha = 0;
          draw();
        } else kick();
      } else {
        build(true);
        if (reduce) return settleInstantly();
        phase = "intro";
        startTime = performance.now();
        kick();
      }
    };

    // Pause the cursor effect while the page is scrolling, so scrolling into the
    // next section never competes with 14k particles for frame time.
    let scrolling = false;
    let scrollTimer = 0;
    const onScroll = () => {
      if (!scrolling && mouse.active) {
        mouse.active = false;
        kick(); // let any pushed dots spring home
      }
      scrolling = true;
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => (scrolling = false), 160);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (reduce || !finePointer || revealRef.current || !visible || scrolling || phase !== "settled") return;
      const x = e.pageX - hostX;
      const y = e.pageY - hostY;
      const inside = x >= zone.x0 && x <= zone.x1 && y >= zone.y0 && y <= zone.y1;
      if (!inside && !mouse.active) return; // far from the portrait: nothing to do
      mouse.x = x;
      mouse.y = y;
      mouse.active = inside;
      kick(); // runs until the dots settle (also lets them spring back after the cursor leaves)
    };
    const onPointerLeave = () => {
      if (!mouse.active) return;
      mouse.active = false;
      kick();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.intersectionRatio > 0.1;
        if (!visible) mouse.active = false;
        if (visible) kick();
      },
      { threshold: [0, 0.1, 0.5] },
    );
    io.observe(host);

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!img || revealRef.current) return;
        const wasIntro = phase === "intro";
        build(false);
        if (!wasIntro || reduce) settleInstantly();
        else {
          startTime = performance.now();
          kick();
        }
      }, 150);
    });

    const image = new Image();
    image.decoding = "async";
    image.src = profile.photo.cutout;
    image
      .decode()
      .then(() => {
        img = image;
        build(false);
        setReady(true);
        ro.observe(host);
        if (reduce) settleInstantly();
        else {
          startTime = performance.now();
          kick();
        }
      })
      .catch(() => setRevealed(true)); // couldn't load the cut-out → just show the photo

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(scrollTimer);
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      ro.disconnect();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      restartRef.current = null;
    };
  }, [host]);

  return (
    <>
      {host &&
        createPortal(
          <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-0" />,
          host,
        )}

      {/* Target box: the particles settle here; the real photo fades in on Reveal. */}
      <div ref={targetRef} className="relative aspect-[4/5] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element -- transparent WebP, sized by the box */}
        <img
          src={profile.photo.cutout}
          alt={profile.photo.alt}
          data-hidden={!revealed}
          className="portrait-photo absolute inset-0 size-full object-cover object-[53%_100%] grayscale-[0.15] [mask-image:linear-gradient(to_bottom,#000_80%,transparent)]"
          decoding="async"
        />
      </div>

      <button
        type="button"
        onClick={() => setRevealed((v) => !v)}
        aria-pressed={revealed}
        disabled={!ready}
        className={cn(
          "absolute bottom-3 left-1/2 z-20 inline-flex min-h-11 -translate-x-1/2 items-center gap-2 rounded-full border border-line-4 bg-ink/70 px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-fg backdrop-blur transition-[opacity,border-color] duration-500 hover:border-fg disabled:opacity-0",
        )}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="fill-current">
          {[2, 7, 12].flatMap((x) => [2, 7, 12].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" />))}
        </svg>
        {revealed ? "Particles" : "Reveal"}
      </button>
    </>
  );
}
