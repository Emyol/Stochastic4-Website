import { useCallback, useEffect, useRef, useState } from 'react';
import PhoneFrame from '@/components/site/PhoneFrame';
import { PauseIcon, PlayGlyph, PlayIcon } from '@/components/site/Glyphs';
import { prefersReducedMotion } from '@/lib/motion';

const ITEMS = [
  { lead: 'Taglish search.', rest: 'Type “mga bulaklak sa garden” and KitaKo finds every one.', name: 'text', tint: 'is-sky' },
  { lead: 'Search by photo.', rest: 'Show it a picture. Get the ones that look alike.', name: 'image', tint: 'is-mint' },
  { lead: 'Filter what matters.', rest: 'Sort by date or relevance, and choose how many to show.', name: 'filter', tint: 'is-sand' },
  { lead: 'Easy on the eyes.', rest: 'Light, dark, and pink themes for any hour.', name: 'darkmode', tint: 'is-night' },
  { lead: 'Your whole gallery, indexed.', rest: 'Every photo embedded once, on-device, then instantly searchable.', name: 'gallery', tint: 'is-lilac' },
] as const;

/**
 * "Get the highlights." gallery (design-language §8). Native scroll-snap for touch; the active
 * card's recording plays, the active dot fills with its progress, and it advances on `ended`.
 * Only the active card and its neighbours hold a video src.
 */
export default function Highlights({ onFilm }: { onFilm: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [inView, setInView] = useState(false);

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    const card = track?.children[i] as HTMLElement | undefined;
    if (!track || !card) return;
    const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    track.scrollTo({ left: card.offsetLeft - pad, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, []);

  // The card nearest the start edge is the active one.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
        let best = 0, bestD = Infinity;
        Array.from(track.children).forEach((c, i) => {
          const d = Math.abs((c as HTMLElement).offsetLeft - pad - track.scrollLeft);
          if (d < bestD) { bestD = d; best = i; }
        });
        setActive(best);
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => { track.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Play only the active card while on screen; paint its progress into the active dot.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active && playing && inView) v.play().catch(() => {});
      else {
        v.pause();
        if (i !== active) { try { v.currentTime = 0; } catch { /* not loaded yet */ } }
      }
    });
    dotRefs.current.forEach((d, i) => { if (d && i !== active) d.style.setProperty('--prog', '0'); });
    let raf = 0;
    const paint = () => {
      const v = videoRefs.current[active];
      const dot = dotRefs.current[active];
      if (v && dot && v.duration) dot.style.setProperty('--prog', String(v.currentTime / v.duration));
      raf = requestAnimationFrame(paint);
    };
    if (inView) raf = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(raf);
  }, [active, playing, inView]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(Math.min(ITEMS.length - 1, active + 1)); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(Math.max(0, active - 1)); }
  };

  return (
    <section ref={sectionRef} id="highlights" className="hl section is-alt" data-nav="light" aria-labelledby="hl-title">
      <div className="wrap hl-head" data-reveal>
        <h2 id="hl-title" className="headline">Get the highlights.</h2>
        <button type="button" className="tlink is-lg" onClick={onFilm}>Watch the film <PlayGlyph /></button>
      </div>

      <div
        ref={trackRef}
        className="hl-track"
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-roledescription="carousel"
        aria-label="KitaKo highlights. Use the left and right arrow keys to move between highlights."
        data-reveal
      >
        {ITEMS.map((it, i) => (
          <article
            key={it.name}
            className={`hl-card ${it.tint}`}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${ITEMS.length}`}
          >
            <p className="hl-caption"><strong>{it.lead}</strong> {it.rest}</p>
            <PhoneFrame
              ref={(v) => { videoRefs.current[i] = v; }}
              src={Math.abs(i - active) <= 1 ? `/media/${it.name}.mp4` : undefined}
              poster={`/media/posters/${it.name}.webp`}
              preload={i === active ? 'auto' : 'metadata'}
              className="hl-phone"
              onEnded={() => { if (i === active) goTo((active + 1) % ITEMS.length); }}
            />
          </article>
        ))}
      </div>

      <div className="hl-controls">
        <div className="dots" role="group" aria-label="Choose a highlight">
          {ITEMS.map((it, i) => (
            <button
              key={it.name}
              ref={(d) => { dotRefs.current[i] = d; }}
              type="button"
              className={i === active ? 'is-active' : ''}
              aria-label={`Show highlight ${i + 1}: ${it.lead}`}
              aria-current={i === active ? 'true' : undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className="glass-btn"
          aria-label={playing ? 'Pause highlights' : 'Play highlights'}
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
    </section>
  );
}
