import { useEffect, useRef } from 'react';

const HERO_TITLE = 'KitaKo';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  // Scroll-driven exit: update --exit CSS custom property on the section
  useEffect(() => {
    if (!heroRef.current) return;
    const hero = heroRef.current;
    const heroVid = hero.querySelector<HTMLVideoElement>('.hero-bgvid > video');
    let hasExited = false;
    let raf = 0;

    function update() {
      raf = 0;
      const rect = hero.getBoundingClientRect();
      const h = hero.offsetHeight || window.innerHeight;
      const start = h * 0.30;
      const end = h * 1.00;
      const scrolled = Math.max(0, -rect.top);
      const p = Math.max(0, Math.min(1, (scrolled - start) / Math.max(1, end - start)));
      hero.style.setProperty('--exit', p.toFixed(4));

      if (heroVid) {
        if (p > 0.6) hasExited = true;
        if (hasExited && p < 0.05) {
          hasExited = false;
          try { heroVid.currentTime = 0; } catch (_) {}
          const pr = heroVid.play();
          if (pr && typeof pr.catch === 'function') pr.catch(() => {});
        }
      }
    }

    function schedule() { if (!raf) raf = requestAnimationFrame(update); }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={heroRef} className="hero-exit relative overflow-hidden bg-[#16224a] text-white">
      <div className="grid-paper absolute inset-0 opacity-60" aria-hidden />
      <div
        aria-hidden
        className="floaty absolute -top-24 -right-16 h-[26rem] w-[26rem] rounded-full bg-[#2c8fd5]/35 blur-3xl"
        style={{ animationDuration: '17s' }}
      />
      <div
        aria-hidden
        className="floaty absolute bottom-0 -left-24 h-[18rem] w-[18rem] rounded-full bg-[#4ea7e0]/25 blur-3xl"
        style={{ animationDelay: '-7s', animationDuration: '21s' }}
      />

      <div className="hero-inner container relative pt-40 md:pt-44 pb-20 md:pb-28">

        {/* Decorative background video — sits behind title, hidden mobile */}
        <div className="hero-bgvid" aria-hidden>
          <video src="/kitako_app_hero.webm" autoPlay muted playsInline preload="auto" />
        </div>

        {/* Brand row */}
        <div className="relative z-10 flex items-center gap-3 mb-10 text-[#9fb6e0] text-xs uppercase tracking-[0.28em]">
          <span className="logo-halo">
            <img src="/team_logo.png" alt="Stochastic·4" />
          </span>
          Thesis Project · Stochastic·4 · 2026
        </div>

        {/* Title */}
        <h1 className="relative z-10 font-display font-semibold leading-[0.88] text-[16vw] md:text-[12vw] lg:text-[10.5rem]">
          {HERO_TITLE.split('').map((ch, i) => (
            <span key={i} className="mask-reveal">
              <span style={{ ['--delay' as string]: `${120 + i * 70}ms` }}>{ch}</span>
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <div className="relative z-10 mt-12 grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
          <p className="reveal md:col-span-9 text-2xl md:text-[2rem] font-display font-light leading-[1.12] text-white">
            Search your gallery in <em className="not-italic text-[#4ea7e0]">Taglish</em>, English, or Filipino
            {' '}— on your phone, with nothing leaving the device.
          </p>
        </div>

        {/* Demo video embed */}
        <div className="reveal relative z-10 mt-14 md:mt-20">
          <div className="hero-media" role="img" aria-label="KitaKo demo video">
            <iframe
              src="https://www.youtube-nocookie.com/embed/ykBH9OFCu3A?rel=0&modestbranding=1"
              title="KitaKo demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        {/* CTAs */}
        <div className="reveal relative z-10 mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#walkthrough"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('walkthrough')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#16224a] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            See the app
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
            </svg>
          </a>
          <a
            href="#team"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90 transition-colors hover:border-white/60 hover:text-white"
          >
            Meet the team
          </a>
        </div>
      </div>
    </section>
  );
}
