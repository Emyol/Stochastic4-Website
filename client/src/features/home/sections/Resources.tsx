const RESOURCES = [
  {
    title: 'Application build',
    sub:   'SourceForge · APK',
    href:  'https://sourceforge.net/projects/kitako/',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 13V3"/><path d="m8 9 4 4 4-4"/><rect x="4" y="13" width="16" height="8" rx="2"/>
      </svg>
    ),
  },
  {
    title: 'Source repository',
    sub:   'GitHub',
    href:  'https://github.com/Emyol/KitaKo_Codebase',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
        <path d="M9 18c-4.51 2-5-2-7-2"/>
      </svg>
    ),
  },
  {
    title: 'Dataset',
    sub:   'Kaggle',
    href:  'https://www.kaggle.com/datasets/marcusaustria/kitako-multimodal-dataset',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/>
        <path d="M3 12A9 3 0 0 0 21 12"/>
      </svg>
    ),
  },
];

const ArrowIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
  </svg>
);

export default function Resources() {
  return (
    <section
      id="resources"
      className="anim-trigger anim-res relative pb-24 md:pb-32 pt-4 bg-white"
    >
      <div className="container">
        <div className="res-card relative overflow-hidden rounded-[2rem] bg-[#16224a] text-white p-10 md:p-16">
          <div className="grid-paper absolute inset-0 opacity-60" aria-hidden />
          <div
            aria-hidden
            className="floaty absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#2c8fd5]/40 blur-3xl"
            style={{ animationDuration: '19s', animationDelay: '-11s' }}
          />
          <div
            aria-hidden
            className="floaty absolute -top-20 -left-16 h-80 w-80 rounded-full bg-[#4ea7e0]/22 blur-3xl"
            style={{ animationDuration: '24s', animationDelay: '-4s' }}
          />

          <div className="relative">
            <div className="flourish on-dark">
              <span className="line" />
              <span className="swash" aria-hidden="true">
                <svg viewBox="0 0 60 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                  <path d="M2 7 C 12 1, 20 13, 30 7 S 48 1, 58 7" />
                </svg>
              </span>
              <span className="diamond" />
              <span className="label">05 · Resources</span>
            </div>
            <h2 className="section-head on-dark is-sm mb-10 md:mb-12">Explore the project</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {RESOURCES.map((r, i) => (
                <a
                  key={r.title}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="res-btn"
                  style={{ '--d': i } as React.CSSProperties}
                >
                  <span className="res-btn-icon">{r.icon}</span>
                  <div>
                    <p className="res-btn-title">{r.title}</p>
                    <p className="res-btn-sub">{r.sub}</p>
                  </div>
                  <span className="res-btn-arrow"><ArrowIcon /></span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
