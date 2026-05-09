import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Menu, X, ArrowUpRight } from 'lucide-react';

/**
 * Floating pill-style top navigation. Centered, never spans full width.
 * Becomes more compact and slightly tinted after scroll.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Research', href: '#research' },
    { label: 'Team', href: '#team' },
    { label: 'Resources', href: '#resources' },
  ];

  return (
    <>
      <div
        className={[
          'fixed inset-x-0 top-0 z-50 flex justify-center',
          'pointer-events-none',
          'transition-[padding] duration-500 ease-out',
          scrolled ? 'pt-3 md:pt-4' : 'pt-5 md:pt-7',
        ].join(' ')}
      >
        <nav
          className={[
            'pointer-events-auto',
            'flex items-center gap-1 md:gap-2',
            'rounded-full border border-white/10',
            'bg-[#16224a]/85 backdrop-blur-xl',
            'shadow-[0_10px_40px_-12px_rgba(22,34,74,0.45)]',
            'transition-all duration-500 ease-out',
            scrolled
              ? 'px-2 py-2 md:px-2.5 md:py-2 scale-[0.98]'
              : 'px-3 py-2.5 md:px-3 md:py-3',
          ].join(' ')}
        >
          {/* Brand */}
          <Link
            href="/"
            className="group flex items-center gap-2 pl-2 pr-3 md:pr-4 py-1.5 text-white"
          >
            <span
              className="grid h-7 w-7 place-items-center rounded-full bg-[#2c8fd5] text-[10px] font-bold tracking-tight text-white transition-transform duration-500 group-hover:rotate-[18deg]"
              aria-hidden
            >
              K
            </span>
            <span className="font-display text-base md:text-[17px] font-semibold tracking-tight">
              KitaKo
            </span>
          </Link>

          <span className="hidden md:block h-5 w-px bg-white/15 mx-1" />

          {/* Desktop nav — plain anchors for in-page hash navigation */}
          <ul className="hidden md:flex items-center">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex items-center px-3.5 py-1.5 text-[13px] font-medium text-white/80 transition-colors duration-300 hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href="#resources"
            className="hidden md:inline-flex items-center gap-1.5 ml-1 rounded-full bg-[#2c8fd5] px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-all duration-300 hover:bg-white hover:text-[#16224a] hover:shadow-md"
          >
            Read thesis
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </nav>
      </div>

      {/* Mobile menu sheet */}
      <div
        className={[
          'fixed inset-x-0 top-0 z-40 md:hidden',
          'transition-all duration-500 ease-out',
          open ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-4',
        ].join(' ')}
        aria-hidden={!open}
      >
        <div className="mx-4 mt-20 rounded-3xl border border-white/10 bg-[#16224a] p-6 shadow-2xl">
          <ul className="flex flex-col divide-y divide-white/10">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-4 text-white/90"
                >
                  <span className="font-display text-2xl">{item.label}</span>
                  <ArrowUpRight className="h-4 w-4 text-white/50" />
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#resources"
            onClick={() => setOpen(false)}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2c8fd5] px-5 py-3 text-sm font-semibold text-white"
          >
            Read thesis
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </>
  );
}
