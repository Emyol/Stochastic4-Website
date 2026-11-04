import { useEffect, useRef, useState } from 'react';
import { ArrowIcon, PauseIcon, PlayIcon } from '@/components/site/Glyphs';
import { prefersReducedMotion } from '@/lib/motion';

const SCREENS = [
  { num: '00', title: 'EULA', sub: 'First-launch gate', name: 'eula' },
  { num: '01', title: 'Loading', sub: 'Index and model bootstrap', name: 'loading' },
  { num: '02', title: 'Embedding', sub: 'Image cache progress', name: 'embedding' },
  { num: '03', title: 'Gallery', sub: 'Home grid', name: 'gallery' },
  { num: '04', title: 'Image details', sub: 'Full-image viewer', name: 'detail' },
  { num: '05', title: 'Text search', sub: 'Taglish query results', name: 'text' },
  { num: '06', title: 'Image search', sub: 'Find similar by photo', name: 'image' },
  { num: '07', title: 'Metadata filter', sub: 'Date, relevance, display count', name: 'filter' },
  { num: '08', title: 'Settings', sub: 'Models and indexing', name: 'settings' },
  { num: '09', title: 'Dark mode', sub: 'Easy on the eyes at night', name: 'darkmode' },
] as const;

const EMBEDDING_IDX = 2; // that recording is very short; hold it 2.7s instead of waiting for `ended`

/**
 * "Take the tour" coverflow. The 3D transform engine writes styles directly (no React renders
 * per frame); slides are JSX. Programmatic scrolling is cancelled the instant the user touches,
 * drags, wheels or presses a key, and auto-advance can be paused.
 */
export default function Walkthrough() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{ goTo: (i: number) => void; current: () => number } | null>(null);
  const autoRef = useRef(!prefersReducedMotion());
  const [auto, setAuto] = useState(autoRef.current);
  const [focused, setFocused] = useState(0);

  useEffect(() => {
    autoRef.current = auto;
    const track = trackRef.current;
    if (!track) return;
    const v = track.querySelector<HTMLElement>('figure.is-focused video') as HTMLVideoElement | null;
    if (!v) return;
    if (auto) v.play().catch(() => {}); else v.pause();
  }, [auto]);

  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;
    const slides = Array.from(track.querySelectorAll<HTMLElement>('figure'));
    const N = slides.length;
    const videoOf = (s: HTMLElement) => s.querySelector('video') as HTMLVideoElement | null;

    // Only the focused slide and its neighbours hold a video src.
    const attach = (s: HTMLElement) => { const v = videoOf(s); if (v && !v.getAttribute('src') && v.dataset.src) { v.src = v.dataset.src; v.load(); } };
    const detach = (s: HTMLElement) => { const v = videoOf(s); if (!v || !v.getAttribute('src')) return; v.pause(); v.removeAttribute('src'); v.load(); };
    const syncPool = (f: number) => slides.forEach((s, i) => (Math.abs(i - f) <= 1 ? attach(s) : detach(s)));

    let focusedIdx = -1;
    let pending = -1;
    let focusTimer = 0;
    let holdTimer = 0;
    let inView = false;

    function commitFocus() {
      focusTimer = 0;
      if (pending === focusedIdx || pending < 0) return;
      focusedIdx = pending;
      setFocused(focusedIdx);
      syncPool(focusedIdx);
      if (holdTimer) { clearTimeout(holdTimer); holdTimer = 0; }
      slides.forEach((s, i) => {
        const v = videoOf(s);
        if (!v) return;
        if (i === focusedIdx && inView && autoRef.current) {
          try { v.currentTime = 0; } catch { /* not ready */ }
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
      if (focusedIdx === EMBEDDING_IDX) {
        holdTimer = window.setTimeout(() => {
          holdTimer = 0;
          if (focusedIdx === EMBEDDING_IDX && autoRef.current && inView) goTo(focusedIdx + 1, true);
        }, 2700);
      }
    }
    function setFocusTo(i: number) {
      if (i === pending) return;
      pending = i;
      slides.forEach((s, si) => s.classList.toggle('is-focused', si === i));
      if (focusTimer) clearTimeout(focusTimer);
      focusTimer = window.setTimeout(commitFocus, 140);
    }

    // Interruptible eased scroll.
    let anim = 0;
    let savedSnap = '';
    function stopAnim() {
      if (!anim) return;
      cancelAnimationFrame(anim);
      anim = 0;
      track!.style.scrollSnapType = savedSnap;
    }
    const easeOut = (t: number) => 1 - (1 - t) ** 3;
    function smoothScrollTo(target: number, duration: number) {
      stopAnim();
      const start = track!.scrollLeft;
      const delta = target - start;
      if (Math.abs(delta) < 1) return;
      if (prefersReducedMotion()) { track!.scrollLeft = target; return; }
      const t0 = performance.now();
      savedSnap = track!.style.scrollSnapType;
      track!.style.scrollSnapType = 'none';
      const step = (now: number) => {
        const t = Math.min((now - t0) / duration, 1);
        track!.scrollLeft = start + delta * easeOut(t);
        if (t < 1) anim = requestAnimationFrame(step);
        else { anim = 0; track!.style.scrollSnapType = savedSnap; }
      };
      anim = requestAnimationFrame(step);
    }
    function goTo(i: number, smooth: boolean) {
      const idx = ((i % N) + N) % N;
      const s = slides[idx];
      const left = s.offsetLeft + s.offsetWidth / 2 - track!.clientWidth / 2;
      const clamped = Math.max(0, Math.min(track!.scrollWidth - track!.clientWidth, left));
      if (smooth) smoothScrollTo(clamped, Math.max(420, Math.min(900, Math.abs(clamped - track!.scrollLeft) * 1.6 + 320)));
      else { stopAnim(); track!.scrollLeft = clamped; }
    }
    const geom = { cw: 0, centers: [] as number[] };
    const measure = () => { geom.cw = track.clientWidth; geom.centers = slides.map((s) => s.offsetLeft + s.offsetWidth / 2); };
    function currentIndex() {
      const center = track!.scrollLeft + track!.clientWidth / 2;
      let best = 0, bestD = Infinity;
      geom.centers.forEach((c, i) => { const d = Math.abs(c - center); if (d < bestD) { bestD = d; best = i; } });
      return best;
    }
    apiRef.current = { goTo: (i) => goTo(i, true), current: currentIndex };

    // 3D coverflow transforms.
    const last: (string | null)[] = new Array(N).fill(null);
    function updateTransforms() {
      const cw = geom.cw || track!.clientWidth;
      const center = track!.scrollLeft + cw / 2;
      for (let i = 0; i < N; i++) {
        const dist = (geom.centers[i] ?? 0) - center;
        const ratio = Math.min(1, Math.abs(dist) / (cw / 2));
        const sign = dist < 0 ? -1 : 1;
        const key = `${(-sign * ratio * 95).toFixed(1)}|${(-ratio * ratio * 180).toFixed(1)}|${(-sign * ratio * 22).toFixed(2)}|${(1 - ratio * 0.18).toFixed(3)}`;
        if (last[i] === key) continue;
        last[i] = key;
        const [tx, tz, ry, sc] = key.split('|');
        slides[i].style.transform = `translate3d(${tx}px,0,${tz}px) rotateY(${ry}deg) scale(${sc})`;
        slides[i].style.opacity = String(Math.max(0.42, 1 - ratio * 0.55));
        slides[i].style.zIndex = String(100 - Math.round(ratio * 100));
      }
    }

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; updateTransforms(); setFocusTo(currentIndex()); });
    };
    const interrupt = () => stopAnim();
    track.addEventListener('scroll', onScroll, { passive: true });
    (['pointerdown', 'touchstart', 'wheel'] as const).forEach((ev) => track.addEventListener(ev, interrupt, { passive: true }));

    const ro = new ResizeObserver(() => { measure(); goTo(currentIndex(), false); updateTransforms(); });
    ro.observe(track);

    const onEnded = (i: number) => () => { if (i === focusedIdx && i !== EMBEDDING_IDX && autoRef.current) goTo(i + 1, true); };
    const enders = slides.map((s, i) => { const v = videoOf(s); const h = onEnded(i); v?.addEventListener('ended', h); return [v, h] as const; });

    // Free decoders when the section is off screen.
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (!inView) slides.forEach(detach);
      else if (focusedIdx >= 0) {
        syncPool(focusedIdx);
        const v = videoOf(slides[focusedIdx]);
        if (v && autoRef.current) { try { v.currentTime = 0; } catch { /* not ready */ } v.play().catch(() => {}); }
      }
    }, { threshold: 0.15 });
    io.observe(section);

    requestAnimationFrame(() => {
      measure(); goTo(0, false); updateTransforms();
      pending = 0; commitFocus();
    });

    return () => {
      stopAnim();
      ro.disconnect(); io.disconnect();
      track.removeEventListener('scroll', onScroll);
      (['pointerdown', 'touchstart', 'wheel'] as const).forEach((ev) => track.removeEventListener(ev, interrupt));
      enders.forEach(([v, h]) => v?.removeEventListener('ended', h));
      if (focusTimer) clearTimeout(focusTimer);
      if (holdTimer) clearTimeout(holdTimer);
      if (raf) cancelAnimationFrame(raf);
      apiRef.current = null;
    };
  }, []);

  const step = (d: number) => { const api = apiRef.current; if (api) api.goTo(api.current() + d); };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  };

  return (
    <section ref={sectionRef} id="tour" className="tour section" data-nav="light" aria-labelledby="tour-title">
      <div className="wrap" data-reveal>
        <p className="eyebrow">Take the tour</p>
        <h2 id="tour-title" className="headline">Every screen, end to end.</h2>
      </div>

      <div className="tour-wrap">
        <button type="button" className="glass-btn tour-arrow is-prev" aria-label="Previous screen" onClick={() => step(-1)}>
          <ArrowIcon dir="left" />
        </button>
        <button type="button" className="glass-btn tour-arrow is-next" aria-label="Next screen" onClick={() => step(1)}>
          <ArrowIcon dir="right" />
        </button>

        <div
          ref={trackRef}
          className="tour-track"
          tabIndex={0}
          onKeyDown={onKeyDown}
          aria-roledescription="carousel"
          aria-label="KitaKo app screens. Use the left and right arrow keys to move between screens."
        >
          {SCREENS.map((s) => (
            <figure key={s.name}>
              <div className="phone tour-phone" aria-hidden="true">
                <div className="phone-screen">
                  <video data-src={`/media/${s.name}.mp4`} poster={`/media/posters/${s.name}.webp`} muted playsInline preload="none" disablePictureInPicture />
                </div>
              </div>
              <figcaption>
                <span className="fine">{s.num}</span>
                <span className="tour-title">{s.title}</span>
                <span className="fine">{s.sub}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="tour-controls">
        <p className="fine" aria-live="polite">{SCREENS[focused].num} · {SCREENS[focused].title}</p>
        <button
          type="button"
          className="glass-btn is-sm"
          aria-label={auto ? 'Pause the tour' : 'Play the tour'}
          onClick={() => setAuto((a) => !a)}
        >
          {auto ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
    </section>
  );
}
