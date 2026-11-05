import { useEffect, useMemo, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * Load intro, "Focus" (chosen from prototype B). A wall of real gallery photos sits blurred; a
 * glass lens opens in the center and brings the photos inside it into focus ("Kita mo?"), then
 * expands until the whole wall is sharp ("Kita ko.") and dissolves into the hero.
 *
 * Plays on every load. Skipped by any click, key, scroll or touch; skipped entirely for reduced
 * motion and for deep links (/#section). While it plays, page scroll is locked and the hero's
 * entrance is held (html.intro-playing); on exit the hero entrance and phone video start, so they
 * play as the wall fades.
 */

type Phase = 'wait' | 'play' | 'exit' | 'done';

const EXIT_AT = 2500;   // ms after the timeline starts
const EXIT_MS = 900;    // fade-out length (matches CSS)
const SWAP_AT = 1500;   // "Kita mo?" → "Kita ko."
const DECODE_CAP = 700; // never wait longer than this for images before starting

const CLUSTERS: [string, number][] = [['flower', 12], ['sea', 6], ['church', 12], ['market', 8], ['mountain', 5], ['bus', 12]];
const POOL = (() => {
  const out: string[] = [];
  for (let n = 1; n <= 12; n++) CLUSTERS.forEach(([c, m]) => { if (n <= m) out.push(`${c}-${n}`); });
  return out;
})();
/** The tiles that land under the lens first: the strongest photos we have. */
const CENTER_PICKS = ['flower-3', 'mountain-3', 'flower-10', 'market-1', 'sea-2', 'flower-8', 'church-7', 'sea-4', 'mountain-5']; // [4] = dead center

function shouldPlay() {
  if (typeof window === 'undefined') return false;
  if (prefersReducedMotion()) return false;
  if (window.location.hash && window.location.hash !== '#top') return false; // deep link: go straight there
  return true;
}

/** Tiles to cover the viewport, with the curated picks placed around the lens center. */
function buildWall(): { cols: number; tiles: string[] } {
  const w = window.innerWidth, h = window.innerHeight;
  const tile = Math.min(128, Math.max(72, w * 0.09));
  const gap = 12;
  const odd = (n: number) => (n % 2 ? n : n + 1); // odd counts put a whole tile under the lens
  const cols = odd(Math.max(3, Math.floor((w * 1.08) / (tile + gap)))); // round down: fewer, larger tiles
  const actual = (w * 1.08 - 24 - (cols - 1) * gap) / cols; // real tile size once the grid divides the width
  const rows = odd(Math.ceil((h * 1.08) / (actual + gap)));
  const tiles = Array.from({ length: cols * rows }, (_, i) => POOL[(i * 7) % POOL.length]);
  const cc = Math.floor(cols / 2), cr = Math.floor(rows / 2);
  let k = 0;
  for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
    const r = cr + dr, c = cc + dc;
    if (r >= 0 && r < rows && c >= 0 && c < cols) tiles[r * cols + c] = CENTER_PICKS[k++ % CENTER_PICKS.length];
  }
  return { cols, tiles };
}

export default function IntroFocus() {
  const [play] = useState(shouldPlay);
  const [phase, setPhase] = useState<Phase>(play ? 'wait' : 'done');
  const [saw, setSaw] = useState(false);
  const wallRef = useRef<HTMLDivElement>(null);
  const wall = useMemo(() => (play ? buildWall() : { cols: 0, tiles: [] }), [play]);

  // Hold the page while the intro runs; wait (briefly) for the photos to decode, then start.
  useEffect(() => {
    if (!play) return;
    const root = document.documentElement;
    root.classList.add('intro-playing');
    let cancelled = false;
    const imgs = Array.from(wallRef.current?.querySelectorAll('img') ?? []);
    const decoded = Promise.allSettled(imgs.slice(0, 40).map((i) => i.decode()));
    const cap = new Promise((r) => setTimeout(r, DECODE_CAP));
    Promise.race([decoded, cap]).then(() => { if (!cancelled) setPhase((p) => (p === 'wait' ? 'play' : p)); });

    const skip = () => setPhase((p) => (p === 'wait' || p === 'play' ? 'exit' : p));
    const events = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;
    events.forEach((e) => window.addEventListener(e, skip, { passive: true }));
    return () => {
      cancelled = true;
      events.forEach((e) => window.removeEventListener(e, skip));
      root.classList.remove('intro-playing');
    };
  }, [play]);

  // Timeline: swap the line, then hand over to the page.
  useEffect(() => {
    if (phase !== 'play') return;
    const a = window.setTimeout(() => setSaw(true), SWAP_AT);
    const b = window.setTimeout(() => setPhase((p) => (p === 'play' ? 'exit' : p)), EXIT_AT);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'exit') return;
    document.documentElement.classList.remove('intro-playing');
    const v = document.querySelector<HTMLVideoElement>('.cinema-phone video');
    if (v) { try { v.currentTime = 0; } catch { /* not loaded yet */ } v.play().catch(() => {}); }
    const t = window.setTimeout(() => setPhase('done'), EXIT_MS);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === 'done') return null;

  const grid = { gridTemplateColumns: `repeat(${wall.cols}, minmax(0, 1fr))` };
  return (
    <div className={`boot is-${phase}`} aria-hidden="true">
      <div ref={wallRef} className="boot-wall is-blur" style={grid}>
        {wall.tiles.map((s, i) => <img key={i} src={`/media/galaxy/${s}.webp`} alt="" width="160" height="160" />)}
      </div>
      <div className="boot-wall is-sharp" style={grid}>
        {wall.tiles.map((s, i) => <img key={i} src={`/media/galaxy/${s}.webp`} alt="" width="160" height="160" />)}
      </div>
      <div className="boot-lens" />
      <p className="boot-line">
        <span className={saw ? 'is-out' : ''}>Kita mo?</span>
        <span className={saw ? '' : 'is-out'}>Kita ko.</span>
      </p>
    </div>
  );
}
