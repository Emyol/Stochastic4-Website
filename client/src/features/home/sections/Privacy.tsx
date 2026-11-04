import type { ReactNode } from 'react';
import CountUp from '@/components/site/CountUp';

const FACTS: { key: string; big: ReactNode; label: string }[] = [
  { key: 'zero', big: '0', label: 'network calls when KitaKo indexes or searches your photos.' },
  { key: 'all', big: <CountUp to={100} suffix="%" />, label: 'of indexing and inference runs on your phone.' },
  { key: 'offline', big: 'Offline', label: 'No account, no cloud, no upload. Search works without a connection.' },
];

/** Privacy: a dark "cinema" moment with one statement and three plain facts. */
export default function Privacy() {
  return (
    <section id="privacy" className="privacy section is-ink" data-nav="dark" aria-labelledby="privacy-title">
      <div className="privacy-glow" aria-hidden="true" />
      <div className="wrap privacy-inner">
        <div className="privacy-lock" aria-hidden="true" data-reveal>
          <svg viewBox="0 0 48 48" width="56" height="56">
            <rect x="9" y="21" width="30" height="21" rx="6" fill="none" stroke="currentColor" strokeWidth="2.4" />
            <path d="M16 21v-5a8 8 0 0 1 16 0v5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="24" cy="31" r="2.6" fill="currentColor" />
          </svg>
        </div>
        <h2 id="privacy-title" className="statement is-solid" data-reveal>
          Your photos never<br className="br-desk" /> leave your phone.
        </h2>
        <ul className="facts">
          {FACTS.map((f, i) => (
            <li key={f.key} data-reveal style={{ ['--d' as string]: i }}>
              <p className="fact-big">{f.big}</p>
              <p className="intro is-dark is-left">{f.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
