const MEMBERS = [
  { name: 'Amiel Josiah C. Acuña', role: 'Researcher', photo: 'Amiel_Acuna' },
  { name: 'Marcus Ceasar Q. Austria', role: 'Researcher', photo: 'Marcus_Austria' },
  { name: 'Ric Ian I. Barrios', role: 'Researcher', photo: 'Ric_barrios' },
  { name: 'Jhezra A. Tolentino', role: 'Researcher', photo: 'Jhezra_Tolentino' },
  { name: 'Justine Jude C. Pura, MBA', role: 'Thesis Adviser', photo: 'justine_pura' },
];

export default function Team() {
  return (
    <section id="team" className="team section is-alt" data-nav="light" aria-labelledby="team-title">
      <div className="wrap">
        <div className="team-head" data-reveal>
          <p className="eyebrow team-eyebrow">
            <img src="/team_logo.png" alt="" width="28" height="28" />
            Stochastic·4
          </p>
          <h2 id="team-title" className="headline">The people behind KitaKo.</h2>
        </div>

        <ul className="team-grid">
          {MEMBERS.map((m, i) => (
            <li key={m.name} className={`person${m.role === 'Thesis Adviser' ? ' is-adviser' : ''}`} data-reveal style={{ ['--d' as string]: i }}>
              <div className="person-photo">
                <img src={`/media/team/${m.photo}.webp`} alt={`Portrait of ${m.name}`} loading="lazy" width="320" height="400" />
              </div>
              <h3 className="person-name">{m.name}</h3>
              <p className="person-role">{m.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
