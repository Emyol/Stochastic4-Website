import { useEffect, useRef } from 'react';
import { LINKS } from '@/lib/motion';

/** The KitaKo film (YouTube) in a modal. The iframe only exists while open. */
export default function FilmModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') { e.preventDefault(); closeRef.current?.focus(); } // only one focusable control outside the iframe
    };
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      opener?.focus?.();
    };
  }, [open, onClose]);

  return (
    <div className={`modal${open ? ' is-open' : ''}`} aria-hidden={!open} onClick={onClose}>
      <div className="modal-sheet" role="dialog" aria-modal="true" aria-label="KitaKo film" onClick={(e) => e.stopPropagation()}>
        {open && (
          <iframe
            src={`${LINKS.film}?autoplay=1&rel=0&modestbranding=1`}
            title="KitaKo film"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        )}
      </div>
      <button ref={closeRef} type="button" className="modal-close" aria-label="Close film" onClick={onClose} tabIndex={open ? 0 : -1}>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
