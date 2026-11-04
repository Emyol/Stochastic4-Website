import { ChevronGlyph } from '@/components/site/Glyphs';
import { LINKS } from '@/lib/motion';

const CONCEPTS = [
  { n: '01', title: 'Sigmoid pairwise loss', body: 'A loss function that improves text–image retrieval over traditional softmax baselines.' },
  { n: '02', title: 'Taglish normalisation', body: 'Processing the mixed-language queries native to Philippine digital communication.' },
  { n: '03', title: 'LoRA fine-tuning', body: 'Parameter-efficient adaptation that keeps deployment small and fast on phones.' },
  { n: '04', title: 'On-device processing', body: 'Privacy-preserving inference, lower latency, and no cloud dependency.' },
];

/** The research. Results tiles are intentionally absent until the team supplies real numbers. */
export default function Research() {
  return (
    <section id="research" className="research section" data-nav="light" aria-labelledby="research-title">
      <div className="wrap">
        <div className="research-head" data-reveal>
          <p className="eyebrow">The research</p>
          <h2 id="research-title" className="headline">The KitaKo thesis.</h2>
          <p className="intro is-left research-abstract">
            <strong>An image-retrieval and multimodal visual-search framework for mobile devices.</strong> KitaKo
            closes the gap in handling code-switched languages like Taglish while staying efficient and private
            through on-device processing. It uses SigLIP-2 with LoRA fine-tuning to achieve strong zero-shot
            retrieval in multilingual settings.
          </p>
        </div>

        <ul className="concepts">
          {CONCEPTS.map((c, i) => (
            <li key={c.n} className="tile" data-reveal style={{ ['--d' as string]: i }}>
              <p className="fine">{c.n}</p>
              <h3 className="title">{c.title}</h3>
              <p className="tile-body">{c.body}</p>
            </li>
          ))}
        </ul>

        <div className="research-links" data-reveal>
          <a className="tlink" href={LINKS.dataset} target="_blank" rel="noopener noreferrer">Browse the dataset on Kaggle <ChevronGlyph /></a>
          <a className="tlink" href={LINKS.github} target="_blank" rel="noopener noreferrer">Read the source on GitHub <ChevronGlyph /></a>
        </div>
      </div>
    </section>
  );
}
