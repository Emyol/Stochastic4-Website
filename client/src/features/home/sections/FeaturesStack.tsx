import { useEffect, useRef } from 'react';

const FEATURES = [
  {
    tone: '',
    title: 'Taglish search',
    desc:  'Text queries in Taglish, English, or Filipino — code-switching natively understood.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 8h6"/><path d="M8 5v3c0 4-1.5 6-4 7"/><path d="M5 14c2 1 4 1.5 5.5 1.5"/>
        <path d="M13 21l3.5-8 3.5 8"/><path d="M14.5 18h4"/>
      </svg>
    ),
  },
  {
    tone: 'tone-2',
    title: 'Image search',
    desc:  'Find similar images using any photo.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="14" height="14" rx="2"/><circle cx="8" cy="8" r="1.6"/>
        <path d="M3 14l4-4 4 4 3-3 3 3"/>
        <circle cx="17" cy="17" r="4"/><path d="m22 22-2.5-2.5"/>
      </svg>
    ),
  },
  {
    tone: 'tone-3',
    title: '100% on-device',
    desc:  'Models, indexing, and search all run locally on your phone.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 19h2"/>
        <rect x="10" y="7" width="4" height="4" rx="0.6"/>
        <path d="M10 9h-1.5M14 9h1.5M12 7v-1.5M12 11v1.5"/>
      </svg>
    ),
  },
  {
    tone: 'tone-4',
    title: 'Privacy focused',
    desc:  'Zero network calls in the runtime path. Photos never leave the device.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/>
        <rect x="9" y="11" width="6" height="5" rx="0.8"/><path d="M10 11V9.5a2 2 0 0 1 4 0V11"/>
      </svg>
    ),
  },
];

const STACK = [
  {
    tone: '',
    title: 'SigLIP-2',
    desc:  'Vision–language backbone — both image and text encoders derive from SigLIP-2, then adapted for Taglish input.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    tone: 'tone-2',
    title: 'LoRA',
    desc:  'Parameter-efficient fine-tune. Teaches the model Taglish without retraining the full backbone.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/><path d="m3 17 9 5 9-5"/>
      </svg>
    ),
  },
  {
    tone: 'tone-3',
    title: 'ONNX Runtime',
    desc:  'On-device inference for both encoders. Image encoder at FP32, text encoder at INT8.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6" rx="0.6"/>
        <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>
      </svg>
    ),
  },
  {
    tone: 'tone-4',
    title: 'Flutter',
    desc:  'Cross-platform mobile UI runtime. Hosts the full app surface and drives indexing + search streams.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 3 5 12l4 4 9-9V3h-4z"/><path d="M5 12 14 21l5-5-5-5"/>
      </svg>
    ),
  },
  {
    tone: '',
    title: 'HNSW',
    desc:  'Hierarchical Navigable Small World graph. Higher-recall ANN index, Accuracy mode.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="12" r="2"/>
        <circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>
        <path d="m7.5 7.5 3 3M16.5 7.5l-3 3M7.5 16.5l3-3M16.5 16.5l-3-3"/>
      </svg>
    ),
  },
  {
    tone: 'tone-2',
    title: 'IVF-PQ',
    desc:  'Inverted-file index with product quantisation. Compressed, low-latency lookup, Performance mode.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="8" ry="2.5"/>
        <path d="M4 5v6c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5V5"/>
        <path d="M4 11v6c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5v-6"/>
      </svg>
    ),
  },
];

export default function FeaturesStack() {
  const stageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!stageRef.current) return;
    const stage = stageRef.current;

    const featGrid  = stage.querySelector<HTMLElement>('[data-pane="features"]');
    const stackGrid = stage.querySelector<HTMLElement>('[data-pane="stack"]');
    const headSwap  = stage.querySelector<HTMLElement>('#fs-head-swap');
    const fsLabel   = stage.querySelector<HTMLElement>('#fs-label');
    const progress  = Array.from(stage.querySelectorAll<HTMLElement>('.fs-progress > span'));

    if (!featGrid || !stackGrid) return;

    // Rebind after guard so closures see non-null types
    const fg = featGrid;
    const sg = stackGrid;

    const featCards  = Array.from(fg.querySelectorAll<HTMLElement>('.feat-poster'));
    const stackCards = Array.from(sg.querySelectorAll<HTMLElement>('.feat-poster'));

    let currentPane = 'features';

    function setPane(pane: string) {
      if (pane === currentPane) return;
      currentPane = pane;
      if (pane === 'stack') {
        fg.style.opacity       = '0';
        fg.style.pointerEvents = 'none';
        fg.style.transform     = 'translateY(-24px)';
        sg.style.opacity       = '1';
        sg.style.pointerEvents = '';
        sg.style.transform     = 'translateY(0)';
        headSwap?.querySelector('[data-key="features"]')?.classList.add('is-out');
        headSwap?.querySelector('[data-key="stack"]')?.classList.remove('is-out');
        if (fsLabel) fsLabel.textContent = '03 · Tech stack';
      } else {
        fg.style.opacity       = '1';
        fg.style.pointerEvents = '';
        fg.style.transform     = 'translateY(0)';
        sg.style.opacity       = '0';
        sg.style.pointerEvents = 'none';
        sg.style.transform     = 'translateY(24px)';
        headSwap?.querySelector('[data-key="features"]')?.classList.remove('is-out');
        headSwap?.querySelector('[data-key="stack"]')?.classList.add('is-out');
        if (fsLabel) fsLabel.textContent = '02 · Capabilities';
      }
      progress.forEach((p) => p.classList.toggle('is-active', p.dataset.pane === pane));
    }

    let raf = 0;
    function update() {
      raf = 0;
      const rect  = stage.getBoundingClientRect();
      const total = stage.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const p = Math.max(0, Math.min(1, -rect.top / total));

      const featProgress  = Math.max(0, Math.min(1, p / 0.40));
      const stackProgress = Math.max(0, Math.min(1, (p - 0.55) / 0.45));
      // Hysteresis: need to scroll a bit further before the pane actually flips
      const nextPane = currentPane === 'features'
        ? (p < 0.55 ? 'features' : 'stack')
        : (p < 0.45 ? 'features' : 'stack');
      setPane(nextPane);

      const target    = nextPane === 'features' ? featCards : stackCards;
      const prog      = nextPane === 'features' ? featProgress : stackProgress;
      const visibleN  = Math.ceil(prog * target.length);
      target.forEach((c, i) => c.classList.toggle('is-in', i < visibleN));

      const other = nextPane === 'features' ? stackCards : featCards;
      other.forEach((c) => c.classList.add('is-in'));
    }

    function schedule() { if (!raf) raf = requestAnimationFrame(update); }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={stageRef} id="features" className="fs-stage relative bg-white" aria-label="Features and stack">
      <div className="fs-sticky">
        <div className="container">
          <div className="mb-8 md:mb-10">
            <div className="flourish">
              <span className="line" />
              <span className="swash" aria-hidden="true">
                <svg viewBox="0 0 60 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                  <path d="M2 7 C 12 1, 20 13, 30 7 S 48 1, 58 7" />
                </svg>
              </span>
              <span className="diamond" />
              <span className="label" id="fs-label">02 · Capabilities</span>
            </div>
            <h2 className="section-head">
              <span className="fs-head-swap" id="fs-head-swap">
                <span data-key="features">Features</span>
                <span data-key="stack" className="is-out">Stack</span>
              </span>
            </h2>
          </div>

          <div className="fs-deck">
            {/* Features grid */}
            <div className="fs-grid" data-pane="features">
              {FEATURES.map((f, i) => (
                <article key={i} className={`feat-poster${f.tone ? ' ' + f.tone : ''}`} data-i={i}>
                  <span className="feat-icon">{f.icon}</span>
                  <span className="feat-num">0{i + 1}</span>
                  <span className="feat-divider" />
                  <h3 className="feat-title">{f.title}</h3>
                  <p className="feat-desc">{f.desc}</p>
                </article>
              ))}
            </div>

            {/* Stack grid */}
            <div
              className="fs-grid stack-grid"
              data-pane="stack"
              style={{ opacity: 0, pointerEvents: 'none', transform: 'translateY(24px)' }}
            >
              {STACK.map((s, i) => (
                <article key={i} className={`feat-poster${s.tone ? ' ' + s.tone : ''}`} data-i={i}>
                  <span className="feat-icon">{s.icon}</span>
                  <span className="feat-num">0{i + 1}</span>
                  <span className="feat-divider" />
                  <h3 className="feat-title">{s.title}</h3>
                  <p className="feat-desc">{s.desc}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="fs-progress" aria-hidden="true">
            <span className="is-active" data-pane="features" />
            <span data-pane="stack" />
          </div>
        </div>
      </div>
      <div className="fs-scroll-spacer" aria-hidden style={{ height: '285vh' }} />
    </section>
  );
}
