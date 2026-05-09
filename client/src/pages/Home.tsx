import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useReveal } from '@/hooks/useReveal';

import Hero from '@/features/home/sections/Hero';
import About from '@/features/home/sections/About';
import Research from '@/features/home/sections/Research';
import Team from '@/features/home/sections/Team';
import Resources from '@/features/home/sections/Resources';

export default function Home() {
  useReveal();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Research />
        <Team />
        <Resources />
      </main>
      <Footer />
    </div>
  );
}
