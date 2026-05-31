export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#16224a] text-white">
      <div className="grid-paper absolute inset-0 opacity-50" aria-hidden />
      <div
        aria-hidden
        className="floaty absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-[#2c8fd5]/22 blur-3xl"
        style={{ animationDuration: '20s', animationDelay: '-5s' }}
      />
      <div
        aria-hidden
        className="floaty absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-[#4ea7e0]/18 blur-3xl"
        style={{ animationDuration: '16s', animationDelay: '-13s' }}
      />
      <div
        aria-hidden
        className="floaty absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-[#2c8fd5]/15 blur-3xl"
        style={{ animationDuration: '23s', animationDelay: '-9s' }}
      />

      <div className="container relative py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-7 space-y-6">
            <p className="text-xs uppercase tracking-[0.22em] text-[#4ea7e0] font-semibold">Stochastic·4</p>
            <h2 className="font-display text-5xl md:text-7xl font-medium leading-[0.95]">
              Bridging language,<br />
              <em className="text-[#4ea7e0] not-italic font-light">image,</em> and place.
            </h2>
            <p className="max-w-md text-white/70 leading-relaxed">
              KitaKo is a multimodal visual-search app for Taglish-speaking users on mobile devices.
            </p>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.22em] text-white/40">Sections</p>
              <ul className="space-y-2.5">
                {[
                  ['Walkthrough', '#walkthrough'],
                  ['Features',    '#features'],
                  ['Team',        '#team'],
                ].map(([label, href]) => (
                  <li key={href}>
                    <a href={href} className="link-underline text-white/85 hover:text-white">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.22em] text-white/40">Elsewhere</p>
              <ul className="space-y-2.5">
                {[
                  ['GitHub', 'https://github.com/Emyol/KitaKo_Codebase'],
                  ['Kaggle', 'https://www.kaggle.com/datasets/marcusaustria/kitako-multimodal-dataset'],
                  ['Email',  'mailto:stochasticfour@gmail.com'],
                ].map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1 text-white/85 hover:text-[#4ea7e0]"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
