import { useEffect, useState, type CSSProperties } from 'react';
import { prefersReducedMotion } from '@/lib/motion';
import { SearchIcon } from './Glyphs';

/** Real queries that appear in our app recordings. */
const QUERIES = ['sunset sa beach', 'mga bulaklak sa garden', 'swimming sa pool'];

function useTypewriter(words: string[]) {
  const [text, setText] = useState(() => (prefersReducedMotion() ? words[0] : ''));
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let w = 0, i = 0, deleting = false, t = 0;
    const step = () => {
      const word = words[w];
      if (!deleting) {
        i += 1; setText(word.slice(0, i));
        if (i === word.length) { deleting = true; t = window.setTimeout(step, 1700); return; }
        t = window.setTimeout(step, 55 + Math.random() * 45);
      } else {
        i -= 1; setText(word.slice(0, i));
        if (i === 0) { deleting = false; w = (w + 1) % words.length; t = window.setTimeout(step, 380); return; }
        t = window.setTimeout(step, 26);
      }
    };
    t = window.setTimeout(step, 1100);
    return () => clearTimeout(t);
  }, [words]);
  return text;
}

/** Decorative glass search bar that types Taglish queries (design-language §8). */
export default function SearchBar({ tone = 'dark', className = '', style }: { tone?: 'dark' | 'light'; className?: string; style?: CSSProperties }) {
  const query = useTypewriter(QUERIES);
  return (
    <div className={`search is-${tone} ${className}`} style={style} role="img" aria-label={`Example searches: ${QUERIES.join(', ')}`}>
      <SearchIcon />
      <span className="search-text" aria-hidden="true">{query}<span className="search-caret" /></span>
      <span className="search-chip" aria-hidden="true">On-device</span>
    </div>
  );
}
