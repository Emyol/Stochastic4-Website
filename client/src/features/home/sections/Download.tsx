import { ChevronGlyph } from '@/components/site/Glyphs';
import { LINKS } from '@/lib/motion';

/** Closing call to action. */
export default function Download() {
  return (
    <section id="download" className="get section" data-nav="light" aria-labelledby="get-title">
      <div className="wrap get-inner" data-reveal>
        <img className="get-icon" src="/media/logo-192.webp" alt="" width="96" height="96" />
        <h2 id="get-title" className="display">Get KitaKo.</h2>
        <p className="intro">Free for Android. Your photos stay yours.</p>
        <div className="ctas">
          <a className="pill" href={LINKS.download} target="_blank" rel="noopener noreferrer">Download the APK</a>
        </div>
        <div className="get-links">
          <a className="tlink" href={LINKS.github} target="_blank" rel="noopener noreferrer">View the source <ChevronGlyph /></a>
          <a className="tlink" href={LINKS.dataset} target="_blank" rel="noopener noreferrer">Browse the dataset <ChevronGlyph /></a>
        </div>
      </div>
    </section>
  );
}
