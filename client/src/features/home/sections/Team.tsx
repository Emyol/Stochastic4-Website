const MEMBERS = [
  { name: 'Acuña, Amiel Josiah C.',    role: 'Researcher',     tag: 'AC',  num: '01', photo: '/Amiel_Acuna.png',      corner: 'tl' },
  { name: 'Austria, Marcus Ceasar Q.', role: 'Researcher',     tag: 'MA',  num: '02', photo: '/Marcus_Austria.png',   corner: 'tr' },
  { name: 'Barrios, Ric Ian I.',        role: 'Researcher',     tag: 'RB',  num: '03', photo: '/Ric_barrios.png',      corner: 'bl' },
  { name: 'Tolentino, Jhezra A.',       role: 'Researcher',     tag: 'JT',  num: '04', photo: '/Jhezra_Tolentino.png', corner: 'br' },
  { name: 'Pura, Justine Jude C., MBA', role: 'Thesis Adviser', tag: 'Adv', num: 'Adv', photo: '/justine_pura.png',   corner: 'br' },
];

export default function Team() {
  return (
    <section
      id="team"
      className="anim-trigger anim-team relative py-24 md:py-32 bg-white"
    >
      <div className="container">
        <div className="mb-14 md:mb-20">
          <div className="flourish">
            <span className="line" />
            <span className="swash" aria-hidden="true">
              <svg viewBox="0 0 60 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <path d="M2 7 C 12 1, 20 13, 30 7 S 48 1, 58 7" />
              </svg>
            </span>
            <span className="diamond" />
            <span className="label">04 · People</span>
          </div>
          <img src="/team_logo.png" alt="Stochastic·4" className="h-10 w-auto mb-4" />
          <h2 className="section-head">
            The team behind <em className="not-italic text-[#2c8fd5]">KitaKo</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {MEMBERS.map((m, i) => (
            <article
              key={m.name}
              className="team-card group relative overflow-hidden rounded-2xl border border-[#e2e5ee] bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(22,34,74,0.3)]"
              style={{ '--d': i } as React.CSSProperties}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#eef0f5]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#16224a] via-[#2c8fd5] to-[#4ea7e0] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-0 grid-paper opacity-0 transition-opacity duration-500 group-hover:opacity-30" />
                <img
                  src={m.photo}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
                <span className="absolute bottom-4 right-4 font-display text-5xl text-white/0 transition-colors duration-500 group-hover:text-white/40">
                  {m.tag}
                </span>
                <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-widest text-white/0 transition-colors duration-500 group-hover:text-white/80">
                  {m.num}
                </span>
              </div>
              <div className="p-4 space-y-1">
                <h4 className="font-display text-base leading-tight">{m.name}</h4>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#2c8fd5] font-semibold">
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
