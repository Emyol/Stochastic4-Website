import { useCallback, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FilmModal from '@/components/site/FilmModal';
import { useReveal } from '@/hooks/useReveal';

import Hero from '@/features/home/sections/Hero';
import Problem from '@/features/home/sections/Problem';
import Highlights from '@/features/home/sections/Highlights';
import Walkthrough from '@/features/home/sections/Walkthrough';
import HowItWorks from '@/features/home/sections/HowItWorks';
import Privacy from '@/features/home/sections/Privacy';
import Research from '@/features/home/sections/Research';
import Team from '@/features/home/sections/Team';
import Download from '@/features/home/sections/Download';

/** Page order follows the thesis story: problem → app → how it works → proof → privacy → people → get it. */
export default function Home() {
  const [film, setFilm] = useState(false);
  const openFilm = useCallback(() => setFilm(true), []);
  const closeFilm = useCallback(() => setFilm(false), []);
  useReveal();

  return (
    <>
      <a className="skip" href="#highlights">Skip to content</a>
      <Header />
      <main>
        <Hero onFilm={openFilm} />
        <Problem />
        <Highlights onFilm={openFilm} />
        <Walkthrough />
        <HowItWorks />
        <Privacy />
        <Research />
        <Team />
        <Download />
      </main>
      <Footer />
      <FilmModal open={film} onClose={closeFilm} />
    </>
  );
}
