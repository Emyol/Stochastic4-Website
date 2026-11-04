/** Small inline glyphs used next to text links. All decorative. */

export const PlayGlyph = () => (
  <svg className="glyph" width="17" height="17" viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="8" cy="8" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <path d="M6.5 5.2v5.6L11 8z" fill="currentColor" />
  </svg>
);

export const ChevronGlyph = () => (
  <svg className="glyph" width="9" height="14" viewBox="0 0 9 14" aria-hidden="true">
    <path d="M1.5 1.5 7 7l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PauseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <rect x="2.5" y="1.5" width="3" height="11" rx="1" fill="currentColor" />
    <rect x="8.5" y="1.5" width="3" height="11" rx="1" fill="currentColor" />
  </svg>
);

export const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <path d="M3.5 1.8v10.4L12 7z" fill="currentColor" />
  </svg>
);

export const ArrowIcon = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d={dir === 'left' ? 'M15 18 9 12l6-6' : 'm9 18 6-6-6-6'}
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

export const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
  </svg>
);
