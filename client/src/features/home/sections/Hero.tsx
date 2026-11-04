import { useRef } from 'react';
import { useScrollFrame } from '@/hooks/useScrollFrame';
import { clamp01, LINKS } from '@/lib/motion';
import SearchBar from '@/components/site/SearchBar';
import { PlayGlyph } from '@/components/site/Glyphs';

/**
 * Hero (prototype A "Cinema" + C's search bar). A dark sticky stage: as you scroll, the copy
 * lifts away while the real KitaKo phone render (alpha webm) rises and scales to center.
 * One custom property, --p (0→1), drives every transform in CSS.
 */
export default function Hero({ onFilm }: { onFilm: () => void }) {
  const ref = useRef<HTMLElement>(null);

  useScrollFrame(ref, (el, vh) => {
    const r = el.getBoundingClientRect();
    const total = Math.max(1, el.offsetHeight - vh);
    el.style.setProperty('--p', clamp01(-r.top / total).toFixed(4));

    // Start the phone just below the copy, whatever the viewport height.
    const copy = el.querySelector<HTMLElement>('.cinema-copy');
    const phone = el.querySelector<HTMLElement>('.cinema-phone');
    if (copy && phone) {
      const H = phone.offsetHeight;
      const copyBottom = copy.offsetTop + copy.offsetHeight;
      // phone box is centered (top = vh/2 - H/2); the device starts ~14% down the clip
      const off = Math.max(0, copyBottom + 36 - (vh / 2 - H / 2) - 0.14 * H);
      el.style.setProperty('--off', `${Math.round(off)}px`);
    }
  });

  return (
    <section ref={ref} id="top" className="cinema" data-nav="dark" aria-labelledby="hero-title">
      <div className="cinema-stage">
        <div className="cinema-glow" aria-hidden="true" />

        <div className="cinema-copy">
          <p className="eyebrow rise" style={{ ['--d' as string]: 0 }}>KitaKo</p>
          <h1 id="hero-title" className="display rise" style={{ ['--d' as string]: 1 }}>
            Search your photos<br className="br-desk" /> the way you talk.
          </h1>
          <p className="intro is-dark rise" style={{ ['--d' as string]: 2 }}>
            Taglish, English, or Filipino. On your phone, with nothing leaving it.
          </p>
          <SearchBar tone="dark" className="rise" style={{ ['--d' as string]: 3 }} />
          <div className="ctas rise" style={{ ['--d' as string]: 4 }}>
            <a className="pill" href={LINKS.download} target="_blank" rel="noopener noreferrer">Download for Android</a>
            <button type="button" className="tlink is-dark" onClick={onFilm}>Watch the film <PlayGlyph /></button>
          </div>
        </div>

        <p className="cinema-side is-left" aria-hidden="true">Type in Taglish.</p>
        <p className="cinema-side is-right" aria-hidden="true">Get your photos.</p>

        <div className="cinema-phone" aria-hidden="true">
          {/* The device is drawn at x≈75% of this 16:9 clip; CSS offsets it to the center. */}
          <video src="/media/hero.webm" autoPlay muted playsInline preload="auto" disablePictureInPicture />
        </div>
      </div>
    </section>
  );
}
