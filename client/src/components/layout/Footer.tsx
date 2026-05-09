import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-[#16224a] text-white">
      <div className="grid-paper absolute inset-0 opacity-50" aria-hidden />
      <div className="container relative py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-7 space-y-6">
            <span className="eyebrow text-[#4ea7e0]">Stochastic·4</span>
            <h2 className="font-display text-5xl md:text-7xl font-medium leading-[0.95]">
              Bridging language,<br />
              <em className="text-[#4ea7e0] not-italic font-light">image,</em> and place.
            </h2>
            <p className="max-w-md text-white/70 leading-relaxed">
              KitaKo is an undergraduate thesis project exploring multimodal visual search
              for Taglish-speaking users on mobile devices.
            </p>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.22em] text-white/40">Sections</p>
              <ul className="space-y-2.5">
                {[
                  ['About', '#about'],
                  ['Research', '#research'],
                  ['Team', '#team'],
                  ['Resources', '#resources'],
                ].map(([l, h]) => (
                  <li key={h}>
                    <a href={h} className="link-underline text-white/85 hover:text-white">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.22em] text-white/40">Elsewhere</p>
              <ul className="space-y-2.5">
                {[
                  ['GitHub', '#'],
                  ['Kaggle', '#'],
                  ['Email', 'mailto:stochasticfour@gmail.com'],
                ].map(([l, h]) => (
                  <li key={l}>
                    <a
                      href={h}
                      className="inline-flex items-center gap-1 text-white/85 hover:text-[#4ea7e0]"
                    >
                      {l} <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50">
          <p>© {year} Stochastic·4 — KitaKo Thesis Project.</p>
          <p className="font-mono">
            v0.1 · last updated {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>
    </footer>
  );
}
