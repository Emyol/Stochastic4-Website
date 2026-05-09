import { Cpu, Languages, ShieldCheck, Sparkles } from 'lucide-react';
import Stat from '@/features/home/components/Stat';

const FEATURES = [
  { icon: Languages, label: 'Code-switched query support' },
  { icon: Cpu, label: 'Edge-friendly LoRA adapters' },
  { icon: Sparkles, label: 'Sigmoid pairwise loss' },
  { icon: ShieldCheck, label: 'On-device privacy' },
];

export default function About() {
  return (
    <section id="about" className="relative py-28 md:py-40">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-14">
          <div className="reveal md:col-span-5 md:sticky md:top-32 self-start">
            <span className="eyebrow">About KitaKo</span>
            <h2 className="mt-5 font-display text-5xl md:text-6xl font-medium leading-[0.98]">
              Addressing linguistic <em className="not-italic text-[#2c8fd5]">bias</em> in AI.
            </h2>

            <div className="mt-10 grid grid-cols-2 gap-4 max-w-md">
              <Stat value="04" label="Researchers" />
              <Stat value="01" label="Mentor" />
              <Stat value="2026" label="Cohort year" />
              <Stat value="∞" label="Taglish phrases" />
            </div>
          </div>

          <div className="md:col-span-7 md:col-start-7 space-y-8 text-lg leading-[1.65] text-foreground/80">
            <p className="reveal first-letter:font-display first-letter:text-7xl first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:leading-[0.9] first-letter:text-[#16224a]">
              Computer-vision research has a bias problem. Models trained almost entirely
              on Western datasets perform poorly for languages and cultures outside the
              training distribution — and Filipinos, who code-switch fluently between
              Tagalog and English, sit squarely in that blind spot.
            </p>

            <p className="reveal">
              KitaKo introduces a vision-language model that understands Taglish queries
              natively. Built on SigLIP2 and adapted with LoRA, it is small enough to live
              on a phone — bridging the technological and linguistic divide while keeping
              user data on-device.
            </p>

            <ul className="reveal mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEATURES.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 transition-colors hover:border-[#2c8fd5]/60"
                >
                  <Icon className="h-4 w-4 text-[#2c8fd5] transition-transform duration-300 group-hover:rotate-12" />
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
