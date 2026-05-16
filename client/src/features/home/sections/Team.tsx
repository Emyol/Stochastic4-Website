const MENTOR = {
  name: 'Justine Jude C. Pura, MBA',
  role: 'Thesis Adviser',
  photo: '/justine_pura.png',
  bio: 'Placeholder bio for the thesis mentor. This section will contain information about their background, expertise, and role in guiding the KitaKo project.',
};

const MEMBERS = [
  { name: 'Acuña, Amiel Josiah C.', role: 'Researcher', tag: 'AC', photo: '/Amiel_Acuna.png' },
  { name: 'Austria, Marcus Ceasar Q.', role: 'Researcher', tag: 'MA', photo: '/Marcus_Austria.png' },
  { name: 'Barrios, Ric Ian I.', role: 'Researcher', tag: 'RB', photo: '/Ric_barrios.png' },
  { name: 'Tolentino, Jhezra A.', role: 'Researcher', tag: 'JT', photo: '/Jhezra_Tolentino.png' },
];

export default function Team() {
  return (
    <section id="team" className="py-28 md:py-40">
      <div className="container">
        <div className="reveal mb-16 max-w-3xl">
          <img src="/team_logo.png" alt="Stochastic·4" className="h-10 w-auto mb-2" />
          <h2 className="mt-4 font-display text-5xl md:text-6xl font-medium leading-[0.98]">
            The team behind <em className="not-italic text-[#2c8fd5]">KitaKo</em>.
          </h2>
        </div>

        <div className="reveal mb-20 grid grid-cols-1 md:grid-cols-12 gap-8 items-center rounded-3xl border border-border bg-white p-8 md:p-12 hover:shadow-[0_30px_60px_-30px_rgba(22,34,74,0.25)] transition-shadow duration-500">
          <div className="md:col-span-4">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#16224a] to-[#2c8fd5]">
              <img
                src={MENTOR.photo}
                alt={MENTOR.name}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 grid-paper opacity-30" />
              <p className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-widest text-white/70">
                Adviser · 01
              </p>
            </div>
          </div>
          <div className="md:col-span-8 space-y-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[#2c8fd5] font-semibold">
              {MENTOR.role}
            </p>
            <h3 className="font-display text-3xl md:text-4xl font-medium leading-tight">
              {MENTOR.name}
            </h3>
            <p className="text-foreground/70 leading-relaxed max-w-xl">{MENTOR.bio}</p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="link-underline text-sm font-medium">Profile</a>
              <span className="text-border">·</span>
              <a href="#" className="link-underline text-sm font-medium">Publications</a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MEMBERS.map((m, i) => (
            <article
              key={m.name}
              className="reveal group relative overflow-hidden rounded-2xl border border-border bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(22,34,74,0.3)]"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#eef0f5]">
                <div className="absolute inset-0 bg-linear-to-br from-[#16224a] via-[#2c8fd5] to-[#4ea7e0] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-0 grid-paper opacity-0 transition-opacity duration-500 group-hover:opacity-30" />
                <img
                  src={m.photo}
                  alt={m.name}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
                <span className="absolute bottom-4 right-4 font-display text-6xl text-white/0 transition-colors duration-500 group-hover:text-white/40">
                  {m.tag}
                </span>
                <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-widest text-white/0 transition-colors duration-500 group-hover:text-white/80">
                  0{i + 1}
                </span>
              </div>
              <div className="p-5 space-y-1">
                <h4 className="font-display text-lg leading-tight">{m.name}</h4>
                <p className="text-xs uppercase tracking-[0.18em] text-[#2c8fd5] font-semibold">
                  {m.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
