import { useEffect, useRef } from 'react';

const SCREENS = [
  { num: '00', title: 'EULA',            sub: 'First-launch gate',                video: '/eula.mp4',       poster: '/posters/eula.png' },
  { num: '01', title: 'Loading',         sub: 'Index & model bootstrap',          video: '/loading.mp4',    poster: '/posters/loading.png' },
  { num: '02', title: 'Embedding',       sub: 'Image cache progress',             video: '/embedding.mp4',  poster: '/posters/embedding.png' },
  { num: '03', title: 'Gallery',         sub: 'Home grid',                        video: '/gallery.mp4',    poster: '/posters/gallery.png' },
  { num: '04', title: 'Image details',   sub: 'Full-image viewer',                video: '/detail.mp4',     poster: '/posters/detail.png' },
  { num: '05', title: 'Text search',     sub: 'Taglish query results',            video: '/text.mp4',       poster: '/posters/text.png' },
  { num: '06', title: 'Image search',    sub: 'Find similar by photo',            video: '/image.mp4',      poster: '/posters/image.png' },
  { num: '07', title: 'Metadata filter', sub: 'Date · Relevance · Display count', video: '/filter.mp4',     poster: '/posters/filter.png' },
  { num: '08', title: 'Settings',        sub: 'Models · Indexing',                video: '/settings.mp4',   poster: '/posters/settings.png' },
  { num: '09', title: 'Dark mode',       sub: 'In-the-dark-friendly palette',     video: '/darkmode.mp4',   poster: '/posters/darkmode.png' },
];

export default function Walkthrough() {
  const trackRef = useRef<HTMLDivElement>(null);
  const prevRef  = useRef<HTMLButtonElement>(null);
  const nextRef  = useRef<HTMLButtonElement>(null);
  const dotsRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current || !prevRef.current || !nextRef.current || !dotsRef.current) return;
    const track    = trackRef.current;
    const prevBtn  = prevRef.current;
    const nextBtn  = nextRef.current;
    const dotsHost = dotsRef.current;

    // Build slides dynamically (same approach as v5)
    SCREENS.forEach((scr, idx) => {
      const fig = document.createElement('figure');
      fig.dataset.idx = String(idx);
      fig.innerHTML =
        '<div class="phone"><div class="phone-screen">' +
          '<video poster="' + scr.poster + '" preload="none" muted playsinline data-src="' + scr.video + '"></video>' +
          '<div class="phone-tint"></div>' +
        '</div></div>' +
        '<figcaption class="mt-5 text-center">' +
          '<p class="font-mono text-[11px] text-[#2c8fd5] tracking-[0.18em]">' + scr.num + '</p>' +
          '<p class="font-display text-lg mt-1">' + scr.title + '</p>' +
          '<p class="text-xs text-[#5b6884]">' + scr.sub + '</p>' +
        '</figcaption>';
      track.appendChild(fig);
    });

    const slides = Array.from(track.children).filter(
      (c) => (c as HTMLElement).tagName === 'FIGURE'
    ) as HTMLElement[];
    const N = slides.length;

    // Video src pool — only ±1 neighbours load; rest show poster screenshot
    const POOL_RADIUS = 1;
    function attachSrc(slide: HTMLElement) {
      const v = slide.querySelector<HTMLVideoElement>('video');
      if (!v) return;
      if (!v.src && v.dataset.src) { v.src = v.dataset.src; v.load(); }
    }
    function detachSrc(slide: HTMLElement) {
      const v = slide.querySelector<HTMLVideoElement>('video');
      if (!v || !v.src) return;
      try { v.pause(); } catch (_) {}
      v.removeAttribute('src');
      v.load();
    }
    function syncPool(focused: number) {
      for (let i = 0; i < N; i++) {
        Math.abs(i - focused) <= POOL_RADIUS ? attachSrc(slides[i]) : detachSrc(slides[i]);
      }
    }

    let focusedIdx  = -1;
    let pendingFocus = -1;
    let focusTimer  = 0;
    let embeddingTimer = 0;

    function commitFocus() {
      focusTimer = 0;
      if (pendingFocus === focusedIdx || pendingFocus < 0) return;
      focusedIdx = pendingFocus;
      syncPool(focusedIdx);
      if (embeddingTimer) { clearTimeout(embeddingTimer); embeddingTimer = 0; }
      slides.forEach((s, si) => {
        const isFoc = si === focusedIdx;
        s.classList.toggle('is-focused', isFoc);
        const v = s.querySelector<HTMLVideoElement>('video');
        if (!v) return;
        if (isFoc) {
          try { v.currentTime = 0; } catch (_) {}
          const p = v.play();
          if (p) p.catch(() => {});
        } else {
          try { v.pause(); v.currentTime = 0; } catch (_) {}
        }
      });
      // Embedding slide: always hold 2.7 s then advance regardless of video state
      if (focusedIdx === 2) {
        embeddingTimer = window.setTimeout(() => {
          embeddingTimer = 0;
          if (focusedIdx !== 2) return;
          goTo((focusedIdx + 1) % N, true);
        }, 2700);
      }
    }

    function setFocused(i: number) {
      if (i === pendingFocus) return;
      pendingFocus = i;
      slides.forEach((s, si) => s.classList.toggle('is-focused', si === i));
      if (focusTimer) clearTimeout(focusTimer);
      focusTimer = window.setTimeout(commitFocus, 140);
    }

    // Dots
    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', 'Go to screen ' + (i + 1));
      b.addEventListener('click', () => { noteInteract(); goTo(i, true); });
      dotsHost.appendChild(b);
      return b;
    });

    let userInteract = 0;
    function noteInteract() { userInteract = Date.now(); }

    // Smooth scroll tween
    let scrollAnim = 0;
    function easeOutCubic(t: number) { return 1 - (1 - t) ** 3; }
    function smoothScrollTo(target: number, duration: number) {
      const start = track.scrollLeft;
      const delta = target - start;
      if (Math.abs(delta) < 1) return;
      const t0 = performance.now();
      if (scrollAnim) cancelAnimationFrame(scrollAnim);
      const prevSnap = track.style.scrollSnapType;
      track.style.scrollSnapType = 'none';
      function step(now: number) {
        const t = Math.min((now - t0) / duration, 1);
        track.scrollLeft = start + delta * easeOutCubic(t);
        if (t < 1) scrollAnim = requestAnimationFrame(step);
        else { scrollAnim = 0; track.style.scrollSnapType = prevSnap || ''; }
      }
      scrollAnim = requestAnimationFrame(step);
    }

    function goTo(i: number, smooth: boolean) {
      const idx = Math.max(0, Math.min(N - 1, i));
      const s = slides[idx];
      if (!s) return;
      const left = s.offsetLeft + s.offsetWidth / 2 - track.clientWidth / 2;
      const max  = Math.max(0, track.scrollWidth - track.clientWidth);
      const clamped = Math.max(0, Math.min(max, left));
      if (smooth) {
        const dist = Math.abs(clamped - track.scrollLeft);
        smoothScrollTo(clamped, Math.max(420, Math.min(900, dist * 1.6 + 320)));
      } else {
        if (scrollAnim) { cancelAnimationFrame(scrollAnim); scrollAnim = 0; }
        track.scrollLeft = clamped;
      }
    }

    function currentIndex() {
      const center = track.scrollLeft + track.clientWidth / 2;
      let bestI = 0, bestD = Infinity;
      slides.forEach((s, i) => {
        const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - center);
        if (d < bestD) { bestD = d; bestI = i; }
      });
      return bestI;
    }

    // Cached geometry
    const geom = { cw: 0, centers: [] as number[] };
    function measure() {
      geom.cw = track.clientWidth;
      geom.centers = slides.map((s) => s.offsetLeft + s.offsetWidth / 2);
    }

    // 3-D perspective transform engine
    const lastApplied = new Array(N).fill(null as string | null);
    function updateTransforms() {
      const cw = geom.cw || track.clientWidth;
      const center = track.scrollLeft + cw / 2;
      const half = cw / 2;
      for (let i = 0; i < N; i++) {
        const sc   = geom.centers[i] ?? (slides[i].offsetLeft + slides[i].offsetWidth / 2);
        const dist = sc - center;
        let ratio  = Math.abs(dist) / half;
        if (ratio > 1) ratio = 1;
        const sign    = dist < 0 ? -1 : 1;
        const scale   = 1 - ratio * 0.18;
        const opacity = Math.max(0.42, 1 - ratio * 0.55);
        const tx = -sign * ratio * 95;
        const tz = -ratio * ratio * 180;
        const ry = -sign * ratio * 22;
        const key = `${tx.toFixed(1)}|${tz.toFixed(1)}|${ry.toFixed(2)}|${scale.toFixed(3)}|${opacity.toFixed(2)}`;
        if (lastApplied[i] === key) continue;
        lastApplied[i] = key;
        slides[i].style.transform = `translate3d(${tx}px,0,${tz}px) rotateY(${ry}deg) scale(${scale})`;
        slides[i].style.opacity   = String(opacity);
        slides[i].style.zIndex    = String(100 - Math.round(ratio * 100));
      }
    }

    function updateDots() {
      const i = currentIndex();
      dots.forEach((d, di) => d.setAttribute('aria-current', di === i ? 'true' : 'false'));
      setFocused(i);
    }

    let raf = 0;
    function onTrackScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; updateTransforms(); updateDots(); });
    }

    (['mousedown', 'touchstart', 'wheel', 'keydown'] as const).forEach((ev) =>
      track.addEventListener(ev, noteInteract, { passive: true })
    );
    prevBtn.addEventListener('click', () => { noteInteract(); goTo(currentIndex() - 1, true); });
    nextBtn.addEventListener('click', () => { noteInteract(); goTo(currentIndex() + 1, true); });
    track.addEventListener('scroll', onTrackScroll, { passive: true });

    const ro = new ResizeObserver(() => { measure(); goTo(currentIndex(), false); updateTransforms(); });
    ro.observe(track);

    // Auto-advance on video end
    slides.forEach((s, i) => {
      const v = s.querySelector<HTMLVideoElement>('video');
      if (!v) return;
      v.addEventListener('ended', () => {
        if (i !== focusedIdx || i === 2) return;
        goTo((i + 1) % N, true);
      });
    });

    // Release all srcs when off-screen to free decoder slots
    const visIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) {
            slides.forEach((s) => detachSrc(s));
          } else if (focusedIdx >= 0) {
            syncPool(focusedIdx);
            const v = slides[focusedIdx]?.querySelector<HTMLVideoElement>('video');
            if (v) { try { v.currentTime = 0; } catch (_) {} v.play()?.catch(() => {}); }
          }
        }
      },
      { threshold: 0.05 }
    );
    visIO.observe(track.closest('.anim-walk') ?? track);

    // Stall safety: nudge after 12 s if video never emits "ended"
    const stallTimer = setInterval(() => {
      if (document.hidden || Date.now() - userInteract < 4000) return;
      const v = focusedIdx >= 0 ? slides[focusedIdx]?.querySelector<HTMLVideoElement>('video') : null;
      if (!v) return;
      if (v.paused || (v.duration && v.currentTime > v.duration - 0.2 && v.readyState >= 2)) {
        const next = (focusedIdx + 1) % N;
        if (next !== focusedIdx) goTo(next, true);
      }
    }, 12000);

    requestAnimationFrame(() => {
      measure(); goTo(0, false); updateTransforms(); updateDots();
      pendingFocus = 0;
      if (focusTimer) clearTimeout(focusTimer);
      commitFocus();
    });

    return () => {
      clearInterval(stallTimer);
      ro.disconnect();
      visIO.disconnect();
      if (scrollAnim) cancelAnimationFrame(scrollAnim);
      if (focusTimer)    clearTimeout(focusTimer);
      if (embeddingTimer) clearTimeout(embeddingTimer);
    };
  }, []);

  return (
    <section
      id="walkthrough"
      className="anim-trigger anim-walk relative pt-24 md:pt-32 pb-20 md:pb-24 bg-[#eaf2fc]"
    >
      <div className="grid-paper-blue absolute inset-0 opacity-60" aria-hidden />
      <div className="container relative">
        <div className="walk-head mb-12 md:mb-16">
          <div className="flourish">
            <span className="line" />
            <span className="swash" aria-hidden="true">
              <svg viewBox="0 0 60 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <path d="M2 7 C 12 1, 20 13, 30 7 S 48 1, 58 7" />
              </svg>
            </span>
            <span className="diamond" />
            <span className="label">01 · App tour</span>
          </div>
          <h2 className="section-head">Walkthrough</h2>
        </div>

        <div className="carousel-wrap">
          <button className="carousel-btn prev" ref={prevRef} aria-label="Previous screen">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className="carousel-btn next" ref={nextRef} aria-label="Next screen">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <div className="carousel" ref={trackRef} />
          <div className="carousel-dots" ref={dotsRef} />
        </div>
      </div>
    </section>
  );
}
