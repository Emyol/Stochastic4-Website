import { useEffect, useMemo, useRef, useState } from 'react';
import { clamp01, prefersReducedMotion } from '@/lib/motion';
import { PauseIcon, PlayIcon } from '@/components/site/Glyphs';

/* ------------------------------------------------------------------ data */

type Cluster = 'flower' | 'market' | 'church' | 'sea' | 'mountain' | 'bus';
const COUNTS: Record<Cluster, number> = { flower: 12, market: 8, church: 12, sea: 6, mountain: 5, bus: 12 };
const LABELS: Record<Cluster, string> = {
  flower: 'Flowers', market: 'Markets', church: 'Churches & fiestas', sea: 'Sea & sky', mountain: 'Mountains', bus: 'Buses',
};

/** Two hand-placed maps: related ideas sit near each other (sea ↔ mountains, markets ↔ fiestas). */
const LAYOUTS = {
  wide: {
    w: 1000, h: 580, rx: 150, ry: 100, gap: 66,
    centers: { flower: [185, 165], market: [500, 150], church: [815, 170], sea: [235, 425], mountain: [470, 455], bus: [790, 420] },
  },
  tall: {
    w: 600, h: 1000, rx: 132, ry: 108, gap: 78,
    centers: { flower: [165, 200], market: [445, 210], church: [410, 460], sea: [165, 520], mountain: [210, 760], bus: [425, 800] },
  },
} as const;
type LayoutKey = keyof typeof LAYOUTS;

/**
 * Queries and their top-5. Flowers and buses use the app's real result order from our
 * recordings (text.mp4 / image.mp4); sea and market rankings are hand-picked for the illustration.
 */
const QUERIES: { id: string; label: string; target: Cluster; ranking: string[]; image?: string }[] = [
  { id: 'flower', label: 'mga bulaklak sa garden', target: 'flower', ranking: ['flower-1', 'flower-2', 'flower-3', 'flower-4', 'flower-5'] },
  { id: 'sea', label: 'sunset sa beach', target: 'sea', ranking: ['sea-2', 'sea-1', 'sea-4', 'sea-5', 'sea-6'] },
  { id: 'market', label: 'market na maraming tao', target: 'market', ranking: ['market-5', 'market-6', 'market-7', 'market-4', 'market-1'] },
  { id: 'photo', label: 'Search with a photo', target: 'bus', ranking: ['bus-1', 'bus-2', 'bus-3', 'bus-4', 'bus-5'], image: '/media/galaxy/bus-query.webp' },
];
const TOP_K = 5;

/** Deterministic PRNG so the map looks the same on every visit. */
function rng(seed: number) {
  return () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
}

interface Item { id: string; src: string; cluster: Cluster; x: number; y: number; z: number; sx: number; sy: number }

function buildLayout(key: LayoutKey): Item[] {
  const L = LAYOUTS[key];
  const rand = rng(key === 'wide' ? 7 : 11);
  const items: Item[] = [];
  (Object.keys(COUNTS) as Cluster[]).forEach((cluster) => {
    const [cx, cy] = L.centers[cluster];
    const scale = COUNTS[cluster] <= 6 ? 0.72 : 1;
    for (let n = 1; n <= COUNTS[cluster]; n++) {
      let x = cx, y = cy;
      for (let tries = 0; tries < 60; tries++) {
        const a = rand() * Math.PI * 2, r = Math.sqrt(rand());
        x = cx + Math.cos(a) * r * L.rx * scale;
        y = cy + Math.sin(a) * r * L.ry * scale;
        if (items.every((o) => Math.hypot(o.x - x, o.y - y) > L.gap * (o.cluster === cluster ? 1 : 0.8))) break;
      }
      const a = rand() * Math.PI * 2;
      items.push({
        id: `${cluster}-${n}`, src: `/media/galaxy/${cluster}-${n}.webp`, cluster, x, y,
        z: 0.62 + rand() * 0.38,
        sx: Math.cos(a) * (260 + rand() * 260), sy: Math.sin(a) * (200 + rand() * 200), // scattered start, for the assembly
      });
    }
  });
  return items;
}

function probeFor(key: LayoutKey, cluster: Cluster) {
  const L = LAYOUTS[key];
  const [cx, cy] = L.centers[cluster];
  // sit just inside the cluster, nudged toward the map's middle
  return { x: cx + (L.w / 2 - cx) * 0.18, y: cy + (L.h / 2 - cy) * 0.18 };
}

/* ------------------------------------------------------------------ component */

/**
 * "Every photo has a place." An illustration of meaning-based search with real photos from our
 * test gallery. Photos assemble into clusters as the section scrolls in; a query drops a probe
 * that pulls its nearest photos forward with ranked lines. Auto-plays until the visitor picks.
 */
export default function Galaxy() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [layoutKey, setLayoutKey] = useState<LayoutKey>('wide');
  const [ppu, setPpu] = useState(1); // CSS px per layout unit
  const [sel, setSel] = useState<number | null>(null);
  const [auto, setAuto] = useState(() => !prefersReducedMotion());
  const [assembled, setAssembled] = useState(false);
  const [inView, setInView] = useState(false);

  const L = LAYOUTS[layoutKey];
  const items = useMemo(() => buildLayout(layoutKey), [layoutKey]);

  // Pick the layout for the viewport, and track the stage's scale.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => setLayoutKey(mq.matches ? 'tall' : 'wide');
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(() => setPpu(stage.clientWidth / L.w));
    ro.observe(stage);
    return () => ro.disconnect();
  }, [L.w]);

  // Assembly on scroll + pointer parallax, written straight to each item (no React renders).
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const reduce = prefersReducedMotion();
    let raf = 0;
    let mx = 0, my = 0, tx = 0, ty = 0;
    let visible = false;
    let done = false;
    const last: string[] = [];

    const frame = () => {
      raf = 0;
      const r = stage.getBoundingClientRect();
      const vh = window.innerHeight;
      const e = reduce ? 1 : clamp01((vh * 0.92 - r.top) / (vh * 0.62));
      const k = 1 - (1 - e) ** 3; // ease-out
      mx += (tx - mx) * 0.08; my += (ty - my) * 0.08;
      items.forEach((it, i) => {
        const el = itemRefs.current[i];
        if (!el) return;
        const px = ((1 - k) * it.sx + mx * it.z * 14) * ppu;
        const py = ((1 - k) * it.sy + my * it.z * 14) * ppu;
        const s = (0.55 + 0.45 * k).toFixed(3);
        const key = `${px.toFixed(1)}|${py.toFixed(1)}|${s}|${k.toFixed(3)}`;
        if (last[i] === key) return;
        last[i] = key;
        el.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) scale(${s})`;
        el.style.opacity = String(Math.min(1, k * 1.4));
      });
      if (k >= 0.999 && !done) { done = true; setAssembled(true); }
      if (visible && (Math.abs(tx - mx) > 0.001 || Math.abs(ty - my) > 0.001)) raf = requestAnimationFrame(frame);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const onPointer = (ev: PointerEvent) => {
      if (ev.pointerType !== 'mouse' || reduce) return;
      const r = stage.getBoundingClientRect();
      tx = ((ev.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((ev.clientY - r.top) / r.height - 0.5) * 2;
      schedule();
    };
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; setInView(en.isIntersecting); if (visible) schedule(); }, { threshold: 0 });
    io.observe(section);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    stage.addEventListener('pointermove', onPointer);
    schedule();
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      stage.removeEventListener('pointermove', onPointer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [items, ppu]);

  // Auto-play through the queries once the map has assembled.
  useEffect(() => {
    if (!auto || !assembled || !inView) return;
    const t = window.setTimeout(() => setSel((s) => (s === null ? 0 : (s + 1) % QUERIES.length)), sel === null ? 600 : 4200);
    return () => clearTimeout(t);
  }, [auto, assembled, inView, sel]);

  const query = sel === null ? null : QUERIES[sel];
  const probe = query ? probeFor(layoutKey, query.target) : { x: L.w / 2, y: L.h / 2 };
  const ranked = useMemo(
    () => new Map((query?.ranking ?? []).slice(0, TOP_K).map((id, i) => [id, i + 1])),
    [query],
  );

  /** Where match #rank flies to: a ring around the probe, #1 on top, clockwise. */
  const ringPos = (rank: number) => {
    const R = layoutKey === 'wide' ? 118 : 158;
    const a = -Math.PI / 2 + ((rank - 1) * 2 * Math.PI) / TOP_K;
    const pad = layoutKey === 'wide' ? 48 : 52;
    return {
      x: Math.min(L.w - pad, Math.max(pad, probe.x + Math.cos(a) * R)),
      y: Math.min(L.h - pad, Math.max(pad, probe.y + Math.sin(a) * R * 0.86)),
    };
  };

  const pick = (i: number) => { setAuto(false); setSel(i); };

  return (
    <section ref={sectionRef} id="idea" className="galaxy section is-ink" data-nav="dark" aria-labelledby="galaxy-title">
      <div className="wrap">
        <div className="galaxy-head" data-reveal>
          <p className="eyebrow">The idea</p>
          <h2 id="galaxy-title" className="headline">Every photo has a place.</h2>
          <p className="intro is-dark">
            <strong>KitaKo maps your photos by meaning.</strong> Similar photos sit close together, so a
            search in Taglish lands right next to what you mean. Pick one and watch.
          </p>
        </div>

        <div className="galaxy-chips" role="group" aria-label="Try a search">
          {QUERIES.map((q, i) => (
            <button key={q.id} type="button" className={`chip${sel === i ? ' is-active' : ''}`} aria-pressed={sel === i} onClick={() => pick(i)}>
              {q.image ? <img src={q.image} alt="" width="22" height="22" /> : <span className="chip-mark" aria-hidden="true">“</span>}
              {q.label}
            </button>
          ))}
          <button type="button" className="glass-btn is-sm is-dark" aria-label={auto ? 'Pause the demo' : 'Play the demo'} onClick={() => setAuto((a) => !a)}>
            {auto ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>

        <div
          ref={stageRef}
          className={`galaxy-stage${query ? ' has-query' : ''}`}
          style={{ aspectRatio: `${L.w} / ${L.h}` }}
          aria-hidden="true"
        >
          <svg className="galaxy-lines" viewBox={`0 0 ${L.w} ${L.h}`} preserveAspectRatio="none">
            {query && Array.from(ranked.values()).map((rank) => {
              const to = ringPos(rank);
              return (
                <line key={`${sel}-${rank}`} x1={probe.x} y1={probe.y} x2={to.x} y2={to.y} pathLength={1}
                  style={{ animationDelay: `${350 + rank * 70}ms` }} />
              );
            })}
          </svg>

          {(Object.keys(COUNTS) as Cluster[]).map((c) => {
            const [cx, cy] = L.centers[c];
            return (
              <span key={c} className={`galaxy-label${query?.target === c ? ' is-on' : ''}`}
                style={{ left: `${(cx / L.w) * 100}%`, top: `${((cy - L.ry * (COUNTS[c] <= 6 ? 0.72 : 1) - 26) / L.h) * 100}%` }}>
                {LABELS[c]}
              </span>
            );
          })}

          {items.map((it, i) => {
            const rank = ranked.get(it.id);
            const state = !query ? '' : rank ? ' is-match' : it.cluster === query.target ? ' is-peer' : ' is-dim';
            const size = (layoutKey === 'wide' ? 80 : 50) * it.z;
            const pull = rank ? ringPos(rank) : null; // matches fly out of the cluster into the ring
            const pullStyle = pull ? { ['--tx' as string]: `${((pull.x - it.x) * ppu).toFixed(1)}px`, ['--ty' as string]: `${((pull.y - it.y) * ppu).toFixed(1)}px` } : {};
            return (
              <div key={it.id} ref={(el) => { itemRefs.current[i] = el; }} className="galaxy-item"
                style={{
                  left: `${(it.x / L.w) * 100}%`, top: `${(it.y / L.h) * 100}%`,
                  width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2,
                  zIndex: Math.round(it.z * 10) + (rank ? 40 - rank : 0),
                }}>
                <div className={`galaxy-photo${state}`} style={{ ['--r' as string]: rank ?? 0, ...pullStyle }}>
                  <img src={it.src} alt="" loading="lazy" decoding="async" width="160" height="160" />
                  {rank && <span className="galaxy-rank">#{rank}</span>}
                </div>
              </div>
            );
          })}

          <div className="galaxy-probe" style={{ transform: `translate(${probe.x * ppu}px, ${probe.y * ppu}px)` }}>
            <div key={sel ?? 'idle'} className={`probe-pill${query ? ' is-live' : ''}`}>
              {query?.image && <img src={query.image} alt="" width="24" height="24" />}
              <span>{query ? (query.image ? 'This photo' : query.label) : 'Pick a search'}</span>
            </div>
          </div>
        </div>

        <p className="fine galaxy-note" aria-live="polite">
          {query ? `Showing the ${TOP_K} closest photos for “${query.image ? 'a photo of a bus' : query.label}”, ranked by similarity. ` : ''}
          Illustration using real photos from our test gallery. The flower and bus rankings are the app’s
          actual results; the map itself is drawn by hand, since the app compares vectors with hundreds of
          dimensions, not positions on a flat map.
        </p>
      </div>
    </section>
  );
}
