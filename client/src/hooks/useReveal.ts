import { useEffect } from 'react';

/** Adds `.is-in` to every `[data-reveal]` element the first time it enters the viewport. */
export function useReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll('[data-reveal]');
    if (typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
