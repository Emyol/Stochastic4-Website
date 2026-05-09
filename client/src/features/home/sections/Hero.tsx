import { ArrowUpRight } from 'lucide-react';

const HERO_TITLE = 'KitaKo';

const STATS: Array<[string, string]> = [
  ['SigLIP2', 'Vision-language backbone'],
  ['LoRA', 'Parameter-efficient fine-tune'],
  ['Taglish', 'Localised query understanding'],
  ['On-device', 'Private mobile inference'],
];

const MARQUEE_WORDS = [
  'image retrieval',
  'sigmoid pairwise loss',
  'taglish normalisation',
  'mobile-first',
  'privacy by default',
  'siglip2 + lora',
  'on-device inference',
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#16224a] text-white">
      <div className="grid-paper absolute inset-0 opacity-60" aria-hidden />
      <div
        aria-hidden
        className="floaty absolute -top-24 -right-16 h-[26rem] w-[26rem] rounded-full bg-[#2c8fd5]/30 blur-3xl"
      />
      <div
        aria-hidden
        className="floaty absolute bottom-0 -left-24 h-[18rem] w-[18rem] rounded-full bg-[#4ea7e0]/20 blur-3xl"
        style={{ animationDelay: '-3s' }}
      />

      <div className="container relative pt-40 md:pt-48 pb-24 md:pb-32">
        <div className="flex items-center gap-3 mb-10 text-[#9fb6e0] text-xs uppercase tracking-[0.28em]">
          <span className="h-px w-8 bg-[#4ea7e0]" />
          Thesis Project · Stochastic·4 · 2026
        </div>

        <h1 className="font-display font-semibold leading-[0.88] text-[18vw] md:text-[15vw] lg:text-[13rem]">
          {HERO_TITLE.split('').map((ch, i) => (
            <span key={i} className="mask-reveal">
              <span style={{ ['--delay' as string]: `${120 + i * 70}ms` }}>{ch}</span>
            </span>
          ))}
        </h1>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-10">
          <p className="reveal md:col-span-6 md:col-start-1 text-2xl md:text-3xl font-display font-light leading-[1.15] text-white">
            Bridging linguistic gaps in{' '}
            <em className="not-italic text-[#4ea7e0]">multimodal visual search.</em>
          </p>

          <div className="reveal md:col-span-5 md:col-start-8 space-y-6 text-white/70 leading-relaxed">
            <p>
              An image-retrieval framework for mobile devices that understands{' '}
              <span className="text-white">Taglish</span> — the code-switched everyday
              language of Filipino users. Built on SigLIP2 with LoRA, it runs on-device,
              preserving privacy and reducing latency.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#research"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#16224a] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Explore the research
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#team"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90 transition-colors hover:border-white/60 hover:text-white"
              >
                Meet the team
              </a>
            </div>
          </div>
        </div>

        <div className="reveal mt-24 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
          {STATS.map(([k, v]) => (
            <div key={k} className="bg-[#16224a] p-6 md:p-8">
              <p className="font-display text-2xl md:text-3xl text-white">{k}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/50">{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 py-5 overflow-hidden">
        <div className="marquee-track text-[#4ea7e0]/80">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {MARQUEE_WORDS.map((w, i) => (
                <span key={`${dup}-${i}`} className="flex items-center">
                  <span className="px-8 font-display text-2xl md:text-3xl tracking-tight">{w}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4ea7e0]/60" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
