export const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const LINKS = {
  download: 'https://sourceforge.net/projects/kitako/',
  github: 'https://github.com/Emyol/KitaKo_Codebase',
  dataset: 'https://www.kaggle.com/datasets/marcusaustria/kitako-multimodal-dataset',
  email: 'mailto:stochasticfour@gmail.com',
  film: 'https://www.youtube-nocookie.com/embed/ykBH9OFCu3A',
} as const;
