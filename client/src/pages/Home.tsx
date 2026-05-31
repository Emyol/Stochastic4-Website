import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useReveal } from '@/hooks/useReveal';

import Hero          from '@/features/home/sections/Hero';
import Walkthrough   from '@/features/home/sections/Walkthrough';
import FeaturesStack from '@/features/home/sections/FeaturesStack';
import Team          from '@/features/home/sections/Team';
import Resources     from '@/features/home/sections/Resources';

export default function Home() {
  useReveal();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main id="top" className="flex-1">
        <Hero />
        <Walkthrough />
        <FeaturesStack />
        <Team />
        <Resources />
      </main>
      <Footer />
    </div>
  );
}
