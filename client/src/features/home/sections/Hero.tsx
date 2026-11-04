import { useEffect, useRef } from 'react';
import { useScrollFrame } from '@/hooks/useScrollFrame';
import { clamp01, LINKS, prefersReducedMotion } from '@/lib/motion';
import SearchBar from '@/components/site/SearchBar';
import { PlayGlyph } from '@/components/site/Glyphs';

/**
 * Real photos from the test gallery floating around the stage edges (x, y in % of the stage,
 * z = depth 0..1). As you scroll they stream into the phone while it rises.
 */
const CONSTELLATION = [
  { src: 'sea-2', x: 7, y: 20, z: 0.9 }, { src: 'church-7', x: 17, y: 44, z: 0.6 },
  { src: 'flower-8', x: 5, y: 64, z: 1 }, { src: 'market-1', x: 19, y: 82, z: 0.75 },
  { src: 'mountain-3', x: 27, y: 14, z: 0.55 }, { src: 'bus-4', x: 30, y: 92, z: 0.6 },
  { src: 'flower-3', x: 93, y: 18, z: 0.85 }, { src: 'church-4', x: 83, y: 41, z: 0.65 },
  { src: 'sea-4', x: 95, y: 62, z: 1 }, { src: 'market-4', x: 81, y: 80, z: 0.8 },
  { src: 'bus-11', x: 73, y: 12, z: 0.55 }, { src: 'mountain-5', x: 70, y: 93, z: 0.6 },
  { src: 'church-10', x: 11, y: 96, z: 0.5 }, { src: 'flower-10', x: 89, y: 95, z: 0.5 },
];
const TARGET = { x: 50, y: 56 }; // where the phone screen lands

/**
 * Hero (prototype A "Cinema" + C's search bar). A dark sticky stage: the copy lifts away, the
 * gallery streams in, and the real KitaKo phone render (alpha webm) rises and scales to center.
 * --p (0→1) drives the CSS-only parts; the photos get their transforms written directly.
 */
export default function Hero({ onFilm }: { onFilm: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const progress = useRef(0);

  const paintPhotos = () => {
    const el = ref.current;
    if (!el) return;
    const w = el.clientWidth;
    const h = window.innerHeight;
    const p = prefersReducedMotion() ? 0 : progress.current;
    CONSTELLATION.forEach((c, i) => {
      const node = photoRefs.current[i];
      if (!node) return;
      const start = 0.04 + (i % 7) * 0.035;
      const t = clamp01((p - start) / 0.42);
      const k = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2; // ease-in-out: they glide, then dive in
      const dx = ((TARGET.x - c.x) / 100) * w * k + pointer.current.x * c.z * 18;
      const dy = ((TARGET.y - c.y) / 100) * h * k + pointer.current.y * c.z * 14;
      node.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${(1 - 0.82 * k).toFixed(3)})`;
      node.style.opacity = String(((0.35 + 0.55 * c.z) * (1 - k ** 2)).toFixed(3));
    });
  };

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
    paintPhotos();
  });

  // Gentle pointer parallax on the photos (mouse only).
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pointer.current = { x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 };
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; paintPhotos(); });
    };
    el.addEventListener('pointermove', onMove);
    return () => { el.removeEventListener('pointermove', onMove); if (raf) cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section ref={ref} id="top" className="cinema" data-nav="dark" aria-labelledby="hero-title">
      <div className="cinema-stage">
        <div className="cinema-glow" aria-hidden="true" />

        <div className="constellation" aria-hidden="true">
          {CONSTELLATION.map((c, i) => (
            <div
              key={c.src}
              ref={(n) => { photoRefs.current[i] = n; }}
              className="star"
              style={{ left: `${c.x}%`, top: `${c.y}%`, ['--z' as string]: c.z, ['--d' as string]: i % 7 }}
            >
              <img src={`/media/galaxy/${c.src}.webp`} alt="" width="160" height="160" decoding="async" />
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
