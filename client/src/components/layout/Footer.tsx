import { LINKS } from '@/lib/motion';

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      ['Highlights', '#highlights'],
      ['Take the tour', '#tour'],
      ['How it works', '#how-it-works'],
      ['Research', '#research'],
      ['Team', '#team'],
    ],
  },
  {
    title: 'Project',
    links: [
      ['Download the APK', LINKS.download],
      ['Source code', LINKS.github],
      ['Dataset', LINKS.dataset],
    ],
  },
  {
    title: 'Contact',
    links: [['stochasticfour@gmail.com', LINKS.email]],
  },
] as const;

export default function Footer() {
  return (
    <footer className="footer" data-nav="light">
      <div className="wrap">
        <p className="fine footer-lead">
          KitaKo is a multimodal visual-search app for Taglish-speaking users on mobile devices, built by
          Stochastic·4 as a thesis project. Photos and searches never leave the device.
        </p>
        <nav className="footer-cols" aria-label="Footer">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="footer-title">{col.title}</h2>
              <ul>
                {col.links.map(([label, href]) => {
                  const external = href.startsWith('http');
                  return (
                    <li key={label}>
                      <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{label}</a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <p className="fine footer-legal">© 2026 Stochastic·4. A thesis project.</p>
      </div>
    </footer>
  );
}
