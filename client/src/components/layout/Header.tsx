import { useEffect, useState } from 'react';
import { LINKS } from '@/lib/motion';

const NAV_ITEMS = [
  { label: 'Highlights', id: 'highlights' },
  { label: 'How it works', id: 'how-it-works' },
  { label: 'Research', id: 'research' },
  { label: 'Team', id: 'team' },
] as const;

/**
 * Local nav (design-language §8): 52px glass bar. Its tone follows the section underneath
 * (`data-nav="dark|light"`), and the link for the section in view is underlined.
 */
export default function Header() {
  const [tone, setTone] = useState<'dark' | 'light'>('dark');
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      setScrolled(window.scrollY > 8);
      const probe = 26; // vertical middle of the bar
      for (const s of Array.from(document.querySelectorAll<HTMLElement>('[data-nav]'))) {
        const r = s.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) { setTone(s.dataset.nav === 'light' ? 'light' : 'dark'); break; }
      }
      const line = window.innerHeight * 0.35;
      let current: string | null = null;
      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const shownTone = open ? 'light' : tone;

  return (
    <header className={`nav is-${shownTone}${scrolled || open ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="nav-bar">
        <a href="#top" className="nav-brand" onClick={() => setOpen(false)}>
          <img src="/media/logo-192.webp" alt="" width="24" height="24" />
          KitaKo
        </a>

        <nav className="nav-links" aria-label="Sections">
          {NAV_ITEMS.map((item) => (
            <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? 'true' : undefined}>
              {item.label}
            </a>
          ))}
        </nav>

        <a className="pill is-sm nav-cta" href={LINKS.download} target="_blank" rel="noopener noreferrer">Download</a>

        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="nav-sheet"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d={open ? 'M3 3l10 10M13 3 3 13' : 'M3 6l5 5 5-5'} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div id="nav-sheet" className="nav-sheet" hidden={!open}>
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} onClick={() => setOpen(false)}>{item.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
