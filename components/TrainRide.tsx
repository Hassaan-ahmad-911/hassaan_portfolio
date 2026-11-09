"use client";

import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { profile } from "@/data/portfolio";
import { cn } from "@/lib/site";
import { ArrowRight } from "./ui/Icons";
import { MagneticButton } from "./ui/MagneticButton";

/**
 * Scroll-driven roller-coaster: carts spelling `profile.trainWords` roll in from
 * the left as you scroll, pause in the dip, then leave to the right.
 * The section pins (sticky) for ~2 screens; scroll progress is spring-smoothed
 * for a little coaster momentum. Carts are moved with transforms only.
 */

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

type Geometry = {
  w: number;
  h: number;
  /** Arc-length lookup: [s, x] pairs along the track, increasing. */
  s: Float64Array;
  x: Float64Array;
};

/** Phones get their own track shape and cart sizing. */
const PHONE = 640;

/**
 * Track height at x: high on both sides, a long dip in the middle (like the reference coaster).
 * On phones the dip has a wide flat bottom with short, gentle ramps at the edges, so the
 * whole train fits on the flat and its letters stay upright and readable.
 */
function trackY(x: number, w: number, h: number) {
  const u = x / w;
  if (w < PHONE) {
    // Phones: one soft dip spanning the full width (max slope ≈ 15°) — every cart stays readable.
    const soft = u <= 0 || u >= 1 ? 0 : (1 - Math.cos(2 * Math.PI * u)) / 2;
    return h * (0.3 + 0.17 * soft);
  }
  const dip = smoothstep(0.02, 0.32, u) - smoothstep(0.68, 0.98, u);
  const amp = Math.min(0.5, Math.max(0.22, (w / h) * 0.18));
  const base = 0.14 + (0.5 - amp) * 0.8;
  return h * (base + amp * dip);
}

function buildGeometry(w: number, h: number): Geometry {
  const from = -1.5 * w;
  const to = 2.5 * w;
  const step = 3;
  const n = Math.ceil((to - from) / step) + 1;
  const s = new Float64Array(n);
  const x = new Float64Array(n);
  let acc = 0;
  let px = from;
  let py = trackY(from, w, h);
  for (let i = 0; i < n; i++) {
    const cx = from + i * step;
    const cy = trackY(cx, w, h);
    acc += Math.hypot(cx - px, cy - py);
    s[i] = acc;
    x[i] = cx;
    px = cx;
    py = cy;
  }
  return { w, h, s, x };
}

/** Arc length at a given x. */
function sAtX(g: Geometry, xv: number) {
  const i = Math.max(0, Math.min(g.x.length - 2, Math.floor((xv - g.x[0]) / (g.x[1] - g.x[0]))));
  const t = (xv - g.x[i]) / (g.x[i + 1] - g.x[i]);
  return g.s[i] + (g.s[i + 1] - g.s[i]) * t;
}

/** Point + angle at a given arc length. */
function pointAtS(g: Geometry, sv: number) {
  let lo = 0;
  let hi = g.s.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (g.s[mid] < sv) lo = mid;
    else hi = mid;
  }
  const t = (sv - g.s[lo]) / (g.s[hi] - g.s[lo] || 1);
  const x = g.x[lo] + (g.x[hi] - g.x[lo]) * t;
  const y = trackY(x, g.w, g.h);
  const angle = Math.atan2(trackY(x + 1, g.w, g.h) - trackY(x - 1, g.w, g.h), 2);
  return { x, y, angle };
}

/** SVG for rails, ties, truss and support posts. */
function TrackArt({ w, h }: { w: number; h: number }) {
  const art = useMemo(() => {
    if (!w || !h) return null;
    const truss = Math.max(14, h * 0.07);
    const pts: [number, number][] = [];
    for (let x = -20; x <= w + 20; x += 8) pts.push([x, trackY(x, w, h)]);
    const rail = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("");
    const inner = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${(y + 5).toFixed(1)}`).join("");
    const chord = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${(y + truss).toFixed(1)}`).join("");

    let zig = "";
    let k = 0;
    for (let x = -10; x <= w + 10; x += 22, k++) {
      const x2 = x + 22;
      const top1 = trackY(x, w, h) + 5;
      const bot2 = trackY(x2, w, h) + truss;
      const bot1 = trackY(x, w, h) + truss;
      const top2 = trackY(x2, w, h) + 5;
      zig += k % 2 ? `M${x},${top1}L${x2},${bot2}` : `M${x},${bot1}L${x2},${top2}`;
    }

    const posts: string[] = [];
    const braces: string[] = [];
    const spacing = Math.max(70, w / 13);
    const xs: number[] = [];
    for (let x = spacing / 2; x < w; x += spacing) xs.push(x);
    xs.forEach((x, i) => {
      const top = trackY(x, w, h) + truss;
      posts.push(`M${x},${top}L${x},${h}`);
      const nx = xs[i + 1];
      if (nx !== undefined) {
        const ntop = trackY(nx, w, h) + truss;
        braces.push(`M${x},${top}L${nx},${h}`, `M${nx},${ntop}L${x},${h}`);
      }
    });

    let ties = "";
    for (let x = -10; x <= w + 10; x += 12) {
      const y = trackY(x, w, h);
      ties += `M${x},${y - 1}L${x},${y + 6}`;
    }
    return { rail, inner, chord, zig, posts: posts.join(""), braces: braces.join(""), ties };
  }, [w, h]);

  if (!art) return null;
  return (
    <svg aria-hidden="true" width={w} height={h} className="absolute inset-0 overflow-visible">
      <path d={art.braces} className="stroke-line-2" strokeWidth="1" fill="none" />
      <path d={art.posts} className="stroke-line-4" strokeWidth="2" fill="none" />
      <path d={art.zig} className="stroke-dim" strokeWidth="1" fill="none" />
      <path d={art.chord} className="stroke-dim" strokeWidth="1.5" fill="none" />
      <path d={art.ties} className="stroke-line-4" strokeWidth="1.5" fill="none" />
      <path d={art.inner} className="stroke-muted" strokeWidth="1.5" fill="none" />
      <path d={art.rail} className="stroke-fg" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

export function TrainRide() {
  // Read the motion preference only after mounting, so server and client HTML match.
  const prefersReduced = useReducedMotion();
  const [reduce, setReduce] = useState(false);
  useEffect(() => setReduce(Boolean(prefersReduced)), [prefersReduced]);
  const sectionRef = useRef<HTMLElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const trainRef = useRef<HTMLDivElement>(null);
  const cartRefs = useRef<(HTMLDivElement | null)[]>([]);
  const speedRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const geo = useMemo(() => (dims.w ? buildGeometry(dims.w, dims.h) : null), [dims]);

  // One slot per character; a space becomes a gap instead of a cart.
  const slots = useMemo(() => [...profile.trainWords.toUpperCase()], []);
  const phone = dims.w > 0 && dims.w < PHONE;
  const carts = slots.filter((c) => c !== " ").length;
  const spaces = slots.length - carts;
  // Phones: carts as large as possible while the whole phrase still fits across the screen.
  const cartSize = phone
    ? Math.max(16, Math.min(32, Math.floor((dims.w * 0.96) / (carts + (carts - 1) * 0.1 + spaces * 0.45))))
    : dims.w < 1024
      ? 44
      : 56;
  const gap = Math.max(2, Math.round(cartSize * (phone ? 0.1 : 0.18)));
  const spaceGap = phone ? cartSize * 0.45 : cartSize * 0.7;

  const offsets = useMemo(() => {
    let acc = 0;
    return slots.map((ch) => {
      const o = acc;
      acc += ch === " " ? spaceGap : cartSize + gap;
      return o;
    });
  }, [slots, cartSize, gap, spaceGap]);
  const trainLength = offsets[offsets.length - 1] + cartSize;

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDims({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  // Start (whole train off-screen left) and end (whole train off-screen right) along the track.
  const bounds = useMemo(() => {
    if (!geo) return null;
    return { start: sAtX(geo, -cartSize * 1.5), end: sAtX(geo, geo.w + cartSize * 1.5) + trainLength };
  }, [geo, cartSize, trainLength]);

  /** Per-frame state for the motion loop (kept out of React so frames never re-render). */
  const motion = useRef({ cur: 0, target: 0, raf: 0, last: 0, prevHead: Number.NaN, speed: 0, lean: 0, readoutAt: 0 });

  /** Place every cart for progress p (0..1). dt = ms since the last frame; `final` forces the readout. */
  const place = useCallback(
    (p: number, dt: number, final = false) => {
      if (!geo || !bounds) return;
      const m = motion.current;

      // One smooth curve (continuous speed): quick entry, a gentle slow roll through
      // the dip around the middle, then picking up speed on the way out. No dead stop.
      const q = p - 0.5;
      const a = 0.28; // relative speed in the dip
      const g = 0.5 + a * q + (4 - 4 * a) * q * q * q;
      const head = bounds.start + (bounds.end - bounds.start) * g;

      // The train travels right, so the last letter leads and the first trails —
      // reading left to right it spells the words in order.
      for (let i = 0; i < offsets.length; i++) {
        const el = cartRefs.current[i];
        if (!el) continue;
        const { x, y, angle } = pointAtS(geo, head - trainLength + offsets[i] + cartSize / 2);
        el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${angle.toFixed(4)}rad)`;
      }

      // Speed (smoothed), shown ~10×/s; carts lean back a little at speed.
      const v = Number.isNaN(m.prevHead) ? 0 : Math.abs(head - m.prevHead) / (dt / 1000);
      m.prevHead = head;
      m.speed += (v - m.speed) * 0.15;
      const kmh = Math.min(199, Math.round(m.speed * 0.06));
      const now = performance.now();
      if (final || now - m.readoutAt > 100) {
        m.readoutAt = now;
        if (speedRef.current) speedRef.current.textContent = String(final ? 0 : kmh);
        if (statusRef.current) {
          statusRef.current.textContent =
            p < 0.02 ? "Departing soon" : p < 0.38 ? "Arriving" : p < 0.62 ? "Boarding" : p < 0.98 ? "Departing" : "Departed";
        }
      }
      const lean = -Math.min(kmh / 16, 8);
      if (Math.abs(lean - m.lean) > 0.25) {
        m.lean = lean;
        trainRef.current?.style.setProperty("--lean", `${lean.toFixed(1)}deg`);
      }
    },
    [geo, bounds, offsets, cartSize, trainLength],
  );

  const placeRef = useRef(place);
  useEffect(() => {
    placeRef.current = place;
  }, [place]);

  /**
   * Motion loop: eases the train toward the scroll position each frame
   * (frame-rate independent), then keeps going briefly so the speed readout
   * settles to 0. Stops itself when idle.
   */
  const tick = useCallback((now: number) => {
    const m = motion.current;
    const dt = m.last ? Math.min(64, now - m.last) : 16.7;
    m.last = now;
    const k = 1 - Math.pow(1 - 0.18, dt / 16.67);
    m.cur += (m.target - m.cur) * k;
    if (Math.abs(m.target - m.cur) < 0.0002) m.cur = m.target;
    const done = m.cur === m.target && m.speed <= 0.5;
    placeRef.current(m.cur, dt, done);
    if (!done) {
      m.raf = requestAnimationFrame(tickRef.current);
    } else {
      m.raf = 0;
      m.last = 0;
    }
  }, []);
  const tickRef = useRef(tick);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (reduce) return;
    const m = motion.current;
    m.target = p;
    if (!m.raf) m.raf = requestAnimationFrame(tickRef.current);
  });

  // Initial placement and on resize. Reduced motion: park the train in the dip.
  useEffect(() => {
    const m = motion.current;
    if (reduce) {
      place(0.5, 16.7, true);
      return;
    }
    m.cur = m.target = scrollYProgress.get();
    m.prevHead = Number.NaN;
    place(m.cur, 16.7, true);
  }, [place, reduce, scrollYProgress]);

  useEffect(() => () => cancelAnimationFrame(motion.current.raf), []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="ride-h"
      className={cn("relative border-t border-line", reduce ? "h-[100svh]" : "h-[260svh]")}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pb-16 pt-20 sm:justify-start sm:pb-0 sm:pt-0">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center sm:gap-5 sm:pt-28">
          <p className="inline-flex items-center gap-2 rounded-full border border-line-3 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            <span className="grid size-4 place-items-center rounded bg-fg font-sans text-[9px] font-bold text-ink">
              {profile.initials.slice(0, 1)}
            </span>
            Portfolio &apos;26
          </p>
          <h2 id="ride-h" className="text-[clamp(2rem,5vw,4rem)] font-medium leading-[1.02] tracking-[-0.035em]">
            Hop on — <span className="serif-italic text-white">enjoy the ride.</span>
          </h2>
        </div>

        {/* Track + train: fills the space between heading and buttons; compact and centred on phones */}
        <div className="mt-8 flex min-h-0 flex-none sm:mt-0 sm:flex-1 sm:items-end">
          <div ref={areaRef} className="relative h-[160px] w-full sm:h-[min(100%,520px)]">
            <TrackArt w={dims.w} h={dims.h} />
          <div
            ref={trainRef}
            aria-hidden="true"
            className={cn("absolute inset-0 transition-opacity duration-500", geo ? "opacity-100" : "opacity-0")}
          >
            {slots.map((ch, i) =>
              ch === " " ? null : (
                <div
                  key={i}
                  ref={(el) => {
                    cartRefs.current[i] = el;
                  }}
                  className="absolute left-0 top-0 origin-bottom will-change-transform"
                  style={{
                    width: cartSize,
                    height: cartSize * 1.3,
                    marginLeft: -cartSize / 2,
                    marginTop: -cartSize * 1.3,
                    transform: "translate3d(-200px, 0, 0)",
                  }}
                >
                  {/* Letter block — leans back with speed */}
                  <div
                    className={cn(
                      "grid origin-bottom place-items-center rounded-[22%] font-semibold shadow-[0_6px_14px_rgba(0,0,0,0.5)] will-change-transform",
                      i < profile.trainWords.indexOf(" ") || profile.trainWords.indexOf(" ") === -1
                        ? "bg-fg text-ink"
                        : "border border-line-4 bg-raised text-fg",
                    )}
                    style={{
                      width: cartSize,
                      height: cartSize * 0.86,
                      fontSize: cartSize * (phone ? 0.6 : 0.5),
                      transform: "rotate(var(--lean, 0deg))",
                    }}
                  >
                    {ch}
                  </div>
                  {/* Cart body + wheels */}
                  <div
                    className="relative mx-auto -mt-[12%] rounded-b-[30%] rounded-t-sm bg-linear-to-b from-[#3a3a40] to-[#26262a]"
                    style={{ width: cartSize * 0.92, height: cartSize * 0.4 }}
                  >
                    <span className="absolute -bottom-[3px] left-[18%] size-[22%] min-h-1.5 min-w-1.5 rounded-full border border-dim bg-ink" />
                    <span className="absolute -bottom-[3px] right-[18%] size-[22%] min-h-1.5 min-w-1.5 rounded-full border border-dim bg-ink" />
                  </div>
                </div>
              ),
            )}
          </div>
          </div>
        </div>

        {/* Bottom bar (in normal flow, so it never sits on the track). Extra bottom room on
            phones keeps the buttons clear of the floating WhatsApp button. */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-3 px-4 pt-6 sm:justify-between sm:px-8 sm:pb-6 sm:pt-4">
          <p
            aria-hidden="true"
            className="hidden items-center gap-2 rounded-full border border-line-3 bg-ink/90 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted sm:inline-flex"
          >
            <span ref={statusRef}>{reduce ? "Boarding" : "Departing soon"}</span>
            <span className="text-line-4">·</span>
            <span ref={speedRef} className="tabular-nums text-fg">
              0
            </span>{" "}
            km/h
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <MagneticButton href="/work" className="min-h-11 px-5 text-sm">
              View selected work
              <ArrowRight size={16} className="transition-[translate] duration-500 ease-out-expo group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton href="#about" variant="ghost" className="min-h-11 bg-ink/90 px-5 text-sm">
              About me
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
