import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'About', id: 'about' },
  { label: 'Research', id: 'research' },
  { label: 'Team', id: 'team' },
  { label: 'Resources', id: 'resources' },
] as const;

const NAV_HEIGHT = 88; // px — approximate fixed header clearance
const SCROLL_OFFSET = 24; // extra gap below nav

function scrollToSection(id: string) {
  const section = document.getElementById(id);
  if (!section) return;
  const eyebrow = section.querySelector<HTMLElement>('.eyebrow');
  const target = eyebrow ?? section;
  const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - SCROLL_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const navListRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  // Scroll state for nav shrink
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section via scroll position
  useEffect(() => {
    function update() {
      const scrollY = window.scrollY + NAV_HEIGHT + SCROLL_OFFSET + 8;
      let current: string | null = null;
      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      }
      setActiveSection(current);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  // Slide the pill to the active nav item
  useEffect(() => {
    const list = navListRef.current;
    if (!activeSection || !list) {
      setPillStyle((p) => ({ ...p, opacity: 0 }));
      return;
    }
    const anchor = itemRefs.current.get(activeSection);
    if (!anchor) return;
    const listRect = list.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    setPillStyle({
      left: anchorRect.left - listRect.left,
      width: anchorRect.width,
      opacity: 1,
    });
  }, [activeSection, scrolled]);

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

          {/* Desktop nav */}
          <ul ref={navListRef} className="hidden md:flex items-center relative">
            {/* Sliding active pill */}
            <span
              aria-hidden
              className="absolute inset-y-1 rounded-full bg-white/15 pointer-events-none"
              style={{
                left: pillStyle.left,
                width: pillStyle.width,
                opacity: pillStyle.opacity,
                transition: 'left 300ms cubic-bezier(0.4,0,0.2,1), width 300ms cubic-bezier(0.4,0,0.2,1), opacity 200ms ease',
              }}
            />

            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  ref={(el) => {
                    if (el) itemRefs.current.set(item.id, el);
                    else itemRefs.current.delete(item.id);
                  }}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className={[
                    'relative inline-flex items-center px-3.5 py-1.5 text-[13px] font-medium',
                    'transition-colors duration-300',
                    activeSection === item.id
                      ? 'text-white'
                      : 'text-white/70 hover:text-white',
                  ].join(' ')}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href="#resources"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('resources');
            }}
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
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    setTimeout(() => scrollToSection(item.id), 300);
                  }}
                  className={[
                    'flex items-center justify-between py-4',
                    activeSection === item.id ? 'text-white' : 'text-white/90',
                  ].join(' ')}
                >
                  <span className="font-display text-2xl">{item.label}</span>
                  <span className="flex items-center gap-2">
                    {activeSection === item.id && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#2c8fd5]" />
                    )}
                    <ArrowUpRight className="h-4 w-4 text-white/50" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#resources"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              setTimeout(() => scrollToSection('resources'), 300);
            }}
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
