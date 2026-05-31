import { useEffect } from 'react';

export function useReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    // Reveal: fade-up elements on scroll
    const revealIO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealIO.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
    );

    // Anim-trigger: section entrance animations (walkthrough, team, resources)
    const triggerIO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in-view');
            triggerIO.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0.01 }
    );

    const scan = () => {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => revealIO.observe(el));
      document.querySelectorAll('.anim-trigger:not(.is-in-view)').forEach((el) => triggerIO.observe(el));
    };
    scan();

    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    // Pause floaty blob animations when their section is off-screen (perf)
    const floatyParents = new Set<Element>();
    document.querySelectorAll('.floaty').forEach((b) => {
      let p: Element | null = b.parentElement;
      while (p && p.tagName !== 'SECTION' && p.tagName !== 'FOOTER') p = p.parentElement;
      if (p) floatyParents.add(p);
    });
    floatyParents.forEach((p) => p.classList.add('anim-floaty-off'));
    const floatyIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          e.target.classList.toggle('anim-floaty-off', !e.isIntersecting);
        }
      },
      { rootMargin: '100px 0px 100px 0px', threshold: 0 }
    );
    floatyParents.forEach((p) => floatyIO.observe(p));

    return () => {
      revealIO.disconnect();
      triggerIO.disconnect();
      mo.disconnect();
      floatyIO.disconnect();
    };
  }, []);
}
