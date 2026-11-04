import { useRef, type CSSProperties, type ReactNode } from 'react';
import { useScrollFrame } from '@/hooks/useScrollFrame';
import { clamp01, prefersReducedMotion } from '@/lib/motion';

const STEPS = [
  {
    title: 'Every photo becomes a vector.',
    body: (
      <><strong>SigLIP-2’s image encoder</strong> turns each photo into a list of numbers that captures
        what’s in it. It runs once per photo, on your phone, at full FP32 precision, and the result is cached.</>
    ),
  },
  {
    title: 'So do your words.',
    body: (
      <><strong>A LoRA-tuned text encoder</strong> reads Taglish, English, or Filipino and maps your search
        into the same space. It’s quantized to INT8, so it stays small and fast on a phone.</>
    ),
  },
  {
    title: 'The closest match wins.',
    body: (
      <><strong>An on-device index</strong> finds the photos whose vectors sit nearest your search’s.
        HNSW when you want accuracy, IVF-PQ when you want speed.</>
    ),
  },
];

const STACK = ['SigLIP-2', 'LoRA', 'ONNX Runtime', 'Flutter', 'HNSW', 'IVF-PQ'];

/** Per-element reveal timing inside its step: starts at `a` (0–1) and takes `b`. */
const t = (step: 1 | 2 | 3, a: number, b = 0.2) => ({ '--s': `var(--s${step})`, '--a': a, '--b': b }) as CSSProperties;

function Card({ x, y, w, h, title, sub, step, a, children }: {
  x: number; y: number; w: number; h: number; title?: string; sub?: string; step: 1 | 2 | 3; a: number; children?: ReactNode;
}) {
  return (
    <g className={`how-node n-${step}`} style={t(step, a)}>
      <rect className="how-card" x={x} y={y} width={w} height={h} rx="18" />
      {title && <text className="how-t" x={x + 18} y={y + h / 2 - 3}>{title}</text>}
      {sub && <text className="how-s" x={x + 18} y={y + h / 2 + 17}>{sub}</text>}
      {children}
    </g>
  );
}

const Line = ({ d, step, a, b }: { d: string; step: 1 | 2 | 3; a: number; b: number }) => (
  <path className={`how-line n-${step}`} d={d} pathLength={1} style={t(step, a, b)} />
);

const Thumb = ({ x, href, a }: { x: number; href: string; a: number }) => (
  <g className="how-node n-3" style={t(3, a)}>
    <clipPath id={`clip-${x}`}><rect x={x} y="516" width="96" height="96" rx="14" /></clipPath>
    <image href={href} x={x} y="516" width="96" height="96" clipPath={`url(#clip-${x})`} preserveAspectRatio="xMidYMid slice" />
  </g>
);

/**
 * "How it works" (wow moment 3). A sticky stage: the step copy swaps while an SVG pipeline
 * draws itself from scroll progress (--s1/--s2/--s3 per step, computed once per frame).
 */
export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);

  useScrollFrame(ref, (el, vh) => {
    const reduce = prefersReducedMotion();
    const r = el.getBoundingClientRect();
    const p = reduce ? 1 : clamp01(-r.top / Math.max(1, el.offsetHeight - vh));
    const s = [clamp01(p / 0.3), clamp01((p - 0.33) / 0.3), clamp01((p - 0.66) / 0.3)];
    s.forEach((v, i) => el.style.setProperty(`--s${i + 1}`, v.toFixed(3)));
    const step = reduce ? 'all' : String(p < 0.33 ? 1 : p < 0.66 ? 2 : 3);
    if (el.dataset.step !== step) el.dataset.step = step;
  });

  return (
    <section ref={ref} id="how-it-works" className="how is-alt" data-nav="light" data-step="1" aria-labelledby="how-title">
      <div className="how-stage">
        <div className="wrap how-grid">
          <div className="how-copy">
            <p className="eyebrow">How it works</p>
            <h2 id="how-title" className="headline">From photo to answer, all on your phone.</h2>
            <ol className="how-steps">
              {STEPS.map((s, i) => (
                <li key={s.title} className={`how-step is-${i + 1}`}>
                  <h3 className="title">{s.title}</h3>
                  <p className="intro is-left">{s.body}</p>
                </li>
              ))}
            </ol>
            <p className="fine how-stack">Built with {STACK.join(' · ')}</p>
          </div>

          <svg className="how-diagram" viewBox="0 0 560 630" role="img"
            aria-label="Diagram: your photo goes through the SigLIP-2 image encoder into a vector; your search goes through the LoRA-tuned text encoder into a vector; both meet in an on-device index that returns the closest photos.">
            {/* Lane 1: photo → image encoder → vector */}
            <Card x={30} y={20} w={220} h={90} step={1} a={0}>
              <clipPath id="clip-photo"><rect x="44" y="32" width="66" height="66" rx="12" /></clipPath>
              <image href="/media/how/photo.webp" x="44" y="32" width="66" height="66" clipPath="url(#clip-photo)" />
              <text className="how-t" x="124" y="62">Your photo</text>
              <text className="how-s" x="124" y="82">from your gallery</text>
            </Card>
            <Line d="M140 110 V150" step={1} a={0.2} b={0.2} />
            <Card x={30} y={150} w={220} h={88} title="SigLIP-2 image encoder" sub="ONNX Runtime · FP32" step={1} a={0.4} />
            <Line d="M140 238 V278" step={1} a={0.6} b={0.2} />
            <g className="how-node n-1" style={t(1, 0.8)}>
              <rect className="how-vec" x="50" y="278" width="180" height="44" rx="22" />
              <text className="how-m" x="140" y="305" textAnchor="middle">[0.21, −0.73, …]</text>
            </g>

            {/* Lane 2: words → text encoder → vector */}
            <Card x={310} y={20} w={220} h={90} step={2} a={0}>
              <text className="how-s" x="328" y="52">Your search</text>
              <text className="how-t" x="328" y="76">mga bulaklak sa garden</text>
            </Card>
            <Line d="M420 110 V150" step={2} a={0.2} b={0.2} />
            <Card x={310} y={150} w={220} h={88} title="SigLIP-2 + LoRA text" sub="ONNX Runtime · INT8" step={2} a={0.4} />
            <Line d="M420 238 V278" step={2} a={0.6} b={0.2} />
            <g className="how-node n-2" style={t(2, 0.8)}>
              <rect className="how-vec" x="330" y="278" width="180" height="44" rx="22" />
              <text className="how-m" x="420" y="305" textAnchor="middle">[0.19, −0.70, …]</text>
            </g>

            {/* Meet in the index → results */}
            <Line d="M140 322 C140 364 280 358 280 400" step={3} a={0} b={0.3} />
            <Line d="M420 322 C420 364 280 358 280 400" step={3} a={0} b={0.3} />
            <Card x={150} y={400} w={260} h={80} title="On-device index" sub="HNSW · IVF-PQ" step={3} a={0.3} />
            <Line d="M280 480 V516" step={3} a={0.5} b={0.15} />
            <Thumb x={70} href="/media/how/r1.webp" a={0.62} />
            <Thumb x={178} href="/media/how/r2.webp" a={0.7} />
            <Thumb x={286} href="/media/how/r3.webp" a={0.78} />
            <Thumb x={394} href="/media/how/r4.webp" a={0.86} />
          </svg>
        </div>
      </div>
    </section>
  );
}
