import { useEffect, useRef, type RefObject } from 'react';

/**
 * Calls `fn(el, viewportHeight)` at most once per animation frame while the page scrolls or
 * resizes. Meant for writing CSS custom properties / classes directly, so nothing re-renders.
 */
export function useScrollFrame<T extends HTMLElement>(
  ref: RefObject<T | null>,
  fn: (el: T, vh: number) => void,
) {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const tick = () => { raf = 0; fnRef.current(el, window.innerHeight); };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
}
