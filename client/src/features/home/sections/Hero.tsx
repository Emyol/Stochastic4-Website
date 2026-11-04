import { useEffect, useMemo, useRef, useState } from 'react';
import { useScrollFrame } from '@/hooks/useScrollFrame';
import { clamp01, LINKS, prefersReducedMotion } from '@/lib/motion';
import SearchBar from '@/components/site/SearchBar';
import { PlayGlyph } from '@/components/site/Glyphs';

/* ------------------------------------------------------------------ constellation layout */

const CLUSTERS: [string, number][] = [['flower', 12], ['sea', 6], ['church', 12], ['market', 8], ['mountain', 5], ['bus', 12]];
/** Round-robin across clusters so neighbours on screen are visually varied. */
const POOL = (() => {
  const out: string[] = [];
  for (let n = 1; n <= 12; n++) CLUSTERS.forEach(([c, count]) => { if (n <= count) out.push(`${c}-${n}`); });
  return out;
})();

interface Star {
  src: string; x: number; y: number; z: number;
  f1: number; f2: number; f3: number; p1: number; p2: number; p3: number; amp: number;
}

function rng(seed: number) {
  return () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
}

/** x, y in % of the stage. Keeps the headline/search/CTA block clear; the phone sits in front. */
function buildStars(kind: 'wide' | 'tall', aspect: number): Star[] {
  const rand = rng(kind === 'wide' ? 3 : 5);
  const count = kind === 'wide' ? 32 : 14;
  const minGap = kind === 'wide' ? 13 : 14; // in % of height; x distances are scaled by the viewport aspect
  const stars: Star[] = [];
  for (let tries = 0; stars.length < count && tries < 6000; tries++) {
    const x = 2 + rand() * 96;
    const y = 7 + rand() * 91;
    if (kind === 'wide' && x > 22 && x < 78 && y < 73) continue; // copy column
    if (kind === 'tall' && ((y < 74 && x > 13 && x < 87) || y < 12)) continue;
    if (stars.some((s) => Math.hypot((s.x - x) * aspect, s.y - y) < minGap)) continue;
    const TAU = Math.PI * 2;
    stars.push({
      src: POOL[stars.length % POOL.length], x, y,
      z: 0.32 + rand() * 0.68,
      // two slow, mismatched waves per axis → aperiodic drift (periods 9–30s)
      f1: TAU / (16 + rand() * 14), f2: TAU / (9 + rand() * 8), f3: TAU / (18 + rand() * 12),
      p1: rand() * TAU, p2: rand() * TAU, p3: rand() * TAU,
      amp: 0.6 + rand() * 0.4,
    });
  }
  return stars;
}

const TARGET = { x: 50, y: 56 }; // where the phone screen lands

/* ------------------------------------------------------------------ component */

/**
 * Hero (prototype A "Cinema" + C's search bar). A dark sticky stage: real gallery photos drift
 * around the copy; on scroll the copy lifts away, the photos stream into the phone, and the
 * KitaKo phone render (alpha webm) rises and scales to center. --p (0→1) drives the CSS-only
 * parts; photo transforms are written per element each frame while the hero is on screen.
 */
export default function Hero({ onFilm }: { onFilm: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progress = useRef(0);
  const [kind, setKind] = useState<'wide' | 'tall'>('wide');
  const stars = useMemo(
    () => buildStars(kind, typeof window === 'undefined' ? 1.6 : window.innerWidth / window.innerHeight),
    [kind],
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => setKind(mq.matches ? 'tall' : 'wide');
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useScrollFrame(ref, (el, vh) => {
    const r = el.getBoundingClientRect();
    const total = Math.max(1, el.offsetHeight - vh);
    progress.current = clamp01(-r.top / total);
    el.style.setProperty('--p', progress.current.toFixed(4));

    // Start the phone just below the copy, whatever the viewport height.
    const copy = el.querySelector<HTMLElement>('.cinema-copy');
    const phone = el.querySelector<HTMLElement>('.cinema-phone');
    if (copy && phone) {
      const H = phone.offsetHeight;
      const copyBottom = copy.offsetTop + copy.offsetHeight;
      // phone box is centered (top = vh/2 - H/2); the device starts ~14% down the clip
      const off = Math.max(0, copyBottom + 36 - (vh / 2 - H / 2) - 0.14 * H);
      el.style.setProperty('--off', `${Math.round(off)}px`);
    }
  });

  // One loop paints drift + scroll stream + mouse parallax. Runs only while the hero is visible.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = prefersReducedMotion();
    let raf = 0;
    let visible = true;
    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
    const t0 = performance.now();

    const paint = (now: number) => {
      raf = 0;
      const w = el.clientWidth;
      const h = window.innerHeight;
      const time = reduce ? 0 : (now - t0) / 1000;
      const p = reduce ? 0 : progress.current;
      ptr.x += (ptr.tx - ptr.x) * 0.06;
      ptr.y += (ptr.ty - ptr.y) * 0.06;
      const unit = Math.min(w, h) / 135; // drift amplitude scales with the viewport

      stars.forEach((s, i) => {
        const node = photoRefs.current[i];
        if (!node) return;
        // free drift (nearer photos move more)
        const a = s.amp * (0.5 + s.z) * unit;
        const driftX = reduce ? 0 : a * (2.2 * Math.sin(time * s.f1 + s.p1) + 1.1 * Math.sin(time * s.f2 + s.p2));
        const driftY = reduce ? 0 : a * (1.8 * Math.cos(time * s.f2 + s.p3) + 1.0 * Math.sin(time * s.f3 + s.p1));
        const rot = reduce ? 0 : 3.5 * s.amp * Math.sin(time * s.f3 + s.p2);
        // scroll: glide, then dive into the phone (ease-in-out), staggered
        const start = 0.03 + (i % 10) * 0.028;
        const t = clamp01((p - start) / 0.45);
        const k = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
        const free = 1 - k;
        const dx = ((TARGET.x - s.x) / 100) * w * k + (driftX + ptr.x * s.z * 18) * free;
        const dy = ((TARGET.y - s.y) / 100) * h * k + (driftY + ptr.y * s.z * 14) * free;
        node.style.transform =
          `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) rotate(${(rot * free).toFixed(2)}deg) scale(${(1 - 0.82 * k).toFixed(3)})`;
        node.style.opacity = ((0.3 + 0.6 * s.z) * (1 - k ** 2)).toFixed(3);
      });

      const settled = progress.current >= 0.999;
      if (visible && !document.hidden && !(reduce && Math.abs(ptr.tx - ptr.x) < 0.001) && !settled) {
        raf = requestAnimationFrame(paint);
      }
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(paint); };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }, { threshold: 0 });
    io.observe(el);
    const onScroll = () => start(); // wake the loop if it settled
    const onVis = () => { if (!document.hidden) start(); };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || reduce) return;
      ptr.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ptr.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      start();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    el.addEventListener('pointermove', onMove);
    start();
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVis);
      el.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [stars]);

  return (
    <section ref={ref} id="top" className="cinema" data-nav="dark" aria-labelledby="hero-title">
      <div className="cinema-stage">
        <div className="cinema-glow" aria-hidden="true" />

        <div className="constellation" aria-hidden="true">
          {stars.map((s, i) => (
            <div
              key={`${kind}-${i}`}
              ref={(n) => { photoRefs.current[i] = n; }}
              className="star"
              style={{ left: `${s.x}%`, top: `${s.y}%`, zIndex: Math.round(s.z * 10), ['--z' as string]: s.z.toFixed(2), ['--d' as string]: i % 12 }}
            >
              <img src={`/media/galaxy/${s.src}.webp`} alt="" width="160" height="160" decoding="async" />
            </div>
          ))}
        </div>

        <div className="cinema-copy">
          <p className="eyebrow rise" style={{ ['--d' as string]: 0 }}>KitaKo</p>
          <h1 id="hero-title" className="display rise" style={{ ['--d' as string]: 1 }}>
            Search your photos<br className="br-desk" /> the way you talk.
          </h1>
          <p className="intro is-dark rise" style={{ ['--d' as string]: 2 }}>
            Taglish, English, or Filipino. On your phone, with nothing leaving it.
          </p>
          <SearchBar tone="dark" className="rise" style={{ ['--d' as string]: 3 }} />
          <div className="ctas rise" style={{ ['--d' as string]: 4 }}>
            <a className="pill" href={LINKS.download} target="_blank" rel="noopener noreferrer">Download for Android</a>
            <button type="button" className="tlink is-dark" onClick={onFilm}>Watch the film <PlayGlyph /></button>
          </div>
        </div>

        <p className="cinema-side is-left" aria-hidden="true">Type in Taglish.</p>
        <p className="cinema-side is-right" aria-hidden="true">Get your photos.</p>

        <div className="cinema-phone" aria-hidden="true">
          {/* The device is drawn at x≈75% of this 16:9 clip; CSS offsets it to the center. */}
          <video src="/media/hero.webm" autoPlay muted playsInline preload="auto" disablePictureInPicture />
        </div>
      </div>
    </section>
  );
}
