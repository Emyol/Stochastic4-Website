import { ArrowUpRight } from 'lucide-react';

const CONCEPTS = [
  {
    n: '01',
    title: 'Sigmoid pairwise loss',
    body: 'A loss function that improves text–image retrieval over traditional softmax baselines.',
  },
  {
    n: '02',
    title: 'Taglish normalisation',
    body: 'Processing the mixed-language queries native to Philippine digital communication.',
  },
  {
    n: '03',
    title: 'LoRA fine-tuning',
    body: 'Parameter-efficient adaptation that keeps deployment small and fast on phones.',
  },
  {
    n: '04',
    title: 'On-device processing',
    body: 'Privacy-preserving inference, lower latency, no cloud dependency required.',
  },
];

export default function Research() {
  return (
    <section
      id="research"
      className="relative bg-[#16224a] text-white py-28 md:py-36 overflow-hidden"
    >
      <div className="grid-paper absolute inset-0 opacity-50" aria-hidden />

      <div className="container relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="reveal md:col-span-12 flex items-end justify-between gap-6 mb-14">
            <div>
              <span className="eyebrow text-[#4ea7e0]">Our Research</span>
              <h2 className="mt-4 font-display text-5xl md:text-7xl font-medium leading-[0.95]">
                The <em className="not-italic text-[#4ea7e0]">KitaKo</em> thesis.
              </h2>
            </div>
            <p className="hidden md:block max-w-sm text-sm text-white/60 leading-relaxed">
              Four chapters, one shared question: how do we make visual search speak
              the way our users actually speak?
            </p>
          </div>

          <div className="reveal md:col-span-7 space-y-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/40">Abstract</p>
            <p className="font-display text-xl md:text-2xl leading-[1.4] font-light">
              KitaKo is an image-retrieval and multimodal visual-search framework
              designed for mobile devices, addressing the technological gap in handling
              code-switched languages like Taglish while maintaining efficiency and
              privacy through on-device processing. The system uses SigLIP2 with LoRA
              fine-tuning to achieve strong zero-shot retrieval in multilingual settings.
            </p>
          </div>

          <div className="reveal md:col-span-4 md:col-start-9 self-end">
            <a
              href="#"
              className="group block rounded-2xl border border-white/15 bg-white/5 p-6 transition-colors hover:border-[#4ea7e0]/60 hover:bg-white/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/50">Manuscript</p>
                  <p className="mt-2 font-display text-lg">Read the full thesis</p>
                  <p className="mt-1 text-sm text-white/60">PDF · ~62 pages</p>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#2c8fd5] text-white transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </a>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 border-t border-white/10">
          {CONCEPTS.map((c, i) => (
            <div
              key={c.n}
              className="reveal group relative p-8 md:p-10 border-b md:border-b-0 md:border-r border-white/10 last:border-r-0 transition-colors duration-500 hover:bg-white/[0.04]"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <p className="font-mono text-xs text-[#4ea7e0]">{c.n}</p>
              <p className="mt-6 font-display text-xl leading-tight">{c.title}</p>
              <p className="mt-3 text-sm text-white/60 leading-relaxed">{c.body}</p>
              <span
                className="absolute bottom-0 left-0 h-px w-0 bg-[#4ea7e0] transition-all duration-700 group-hover:w-full"
                aria-hidden
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
