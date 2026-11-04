import { useRef } from 'react';
import { useScrollFrame } from '@/hooks/useScrollFrame';
import { clamp01 } from '@/lib/motion';

const STATEMENT = 'Most AI learned to see in English. Filipinos search in Taglish.';
const ACCENT_WORD = 'Taglish.';

/** The problem, as one statement whose words light up as they scroll past (wow moment 2). */
export default function Problem() {
  const ref = useRef<HTMLElement>(null);
  const words = STATEMENT.split(' ');

  useScrollFrame(ref, (el, vh) => {
    const statement = el.querySelector('.statement');
    if (!statement) return;
    const r = statement.getBoundingClientRect();
    // first word lights when the statement's top reaches 85% of the viewport, last by ~30%
    const lit = Math.floor(clamp01((vh * 0.85 - r.top) / (vh * 0.55)) * words.length * 1.15);
    el.querySelectorAll<HTMLElement>('.word').forEach((w, i) => w.classList.toggle('is-lit', i < lit));
  });

  return (
    <section ref={ref} className="problem section is-ink" data-nav="dark" aria-label="The problem">
      <div className="wrap">
        <h2 className="statement">
          {/* Screen readers get the sentence once, not word by word. */}
          <span className="sr-only">{STATEMENT}</span>
          <span aria-hidden="true">
            {words.map((w, i) => (
              <span key={i} className={`word${w === ACCENT_WORD ? ' is-accent' : ''}`}>{w} </span>
            ))}
          </span>
        </h2>
        <div className="problem-cols">
          <p className="intro is-dark is-left" data-reveal>
            <strong>Vision-language models are trained mostly on Western, English data.</strong> When
            Filipinos code-switch between Tagalog and English, the way we actually talk, they perform poorly.
          </p>
          <p className="intro is-dark is-left" data-reveal style={{ ['--d' as string]: 1 }}>
            <strong>KitaKo fixes that on your phone.</strong> A SigLIP-2 model, fine-tuned with LoRA to
            understand Taglish, indexes and searches your gallery without sending a single photo anywhere.
          </p>
        </div>
      </div>
    </section>
  );
}
