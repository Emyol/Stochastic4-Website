# KitaKo Website — Apple-Style Redesign (Design)

Date: 2026-11-05 · Status: approved direction · Owner: Stochastic·4

> **Decision (2026-11-05, after prototype review):** the hero is prototype **Variant A
> "Cinema"** (dark stage, phone rises and scales to center on scroll) with **Variant C's live
> glass search bar** typing Taglish queries under the headline. Everything after the dark
> problem statement uses the light grey/white system. The visual rules live in
> [`docs/design-language.md`](../../design-language.md). The prototype is kept on branch
> `prototype/apple-redesign`.

## 1. Intent

The KitaKo site is the public face of the Stochastic·4 thesis. Two groups read it: the thesis panel, which wants rigor and a clear argument, and people who might install the APK, who want to understand the app in a few seconds. The goal is a **"wow" first impression in the style of an Apple product page**: huge confident type, calm neutral surfaces, real product footage, and motion that responds to scrolling. Under that, the site should tell the thesis story better than it does now (the problem, the idea, how it works, proof, the people).

"Apple style" here means Apple's **design grammar**, not Apple's identity. That covers the type scale, spacing, section rhythm, highlight galleries, sticky storytelling, translucent chrome and restrained motion. It does not mean Apple's logo, fonts, copy or imagery.

## 2. Where the site is today (audit, 2026-11-05)

Taken from screenshots at 1440×900 and 390×844 plus a read of the code.

What works and should be kept:
- The 3D coverflow walkthrough of 10 app screens with real screen recordings. Its bones are the best on the site.
- The real assets: hero phone video (`kitako_app_hero.webm`), 11 screen recordings, posters, team portraits, logo.
- Sensible structure: React 19 + Vite + Tailwind 4, sections split into `features/home/sections/*`.

What holds it back:
1. **Too many voices.** There are three type families (Fraunces serif, Inter, JetBrains Mono), and every section adds ornaments (line + swash + diamond + mono label), a dotted grid and drifting blur blobs. Apple pages use one family and almost no ornaments. Today the site reads as a template, not a product.
2. **The Features/Stack section spends 285vh of scrolling on 10 gradient cards with outline icons.** The descriptions only appear on hover, so touch users and a panel watching a projector never see them. Its claims ("Taglish search", "Image search") are never *shown*, even though we have the videos that show them.
3. **The hero's centerpiece is a YouTube embed** with YouTube's title bar, logo and "Watch on YouTube" chrome. It is the least polished thing on the page, and it sits in the hero.
4. **The thesis argument is missing.** `About.tsx` (the linguistic-bias problem) and `Research.tsx` (abstract, concepts, manuscript link) exist but aren't rendered. There are no results, no "how it works", and the manuscript link is `#`.
5. **Weight and polish.** Portraits are 2–5 MB PNGs, videos are up to 12 MB, `favicon.ico` returns 404, and there are no Open Graph tags. `pinkmode.mp4` has no poster.
6. **Accessibility gaps.** Auto-playing carousel video has no pause control. `#2c8fd5` text on white is 3.5:1 (fails AA for body text). The mobile menu uses `setTimeout(300)` before scrolling.

## 3. Reference: what Apple actually does (measured from apple.com, 2026-11-05)

Measured live with computed styles on `apple.com/airpods-pro/` and `apple.com/os/ios/`:

| Role | Size / line-height | Weight | Tracking | Color |
|---|---|---|---|---|
| Big statement (centered) | 96 / 100px | 600 | −1.44px (−0.015em) | #1d1d1f |
| Hero headline | 64 / 68px | 600 | −0.576px (−0.009em) | #1d1d1f |
| Section headline ("Get the highlights.") | 56 / 60px | 600 | −0.28px (−0.005em) | #1d1d1f |
| Eyebrow / product name | 28 / 32px | 600 | +0.196px | #1d1d1f |
| Intro copy (bold lead + grey rest) | 24 / 32px | 600 | +0.216px | #6e6e73 |
| Gallery caption | 28 / 32px | 600 | +0.196px | rgba(0,0,0,.88) |
| Body | 17 / 25px | 400 | −0.374px (−0.022em) | #1d1d1f |
| Fine print | 12 / 16px | 400 | −0.12px | #6e6e73 |

Other patterns observed:
- **Section rhythm:** each section is roughly one viewport (900–1200px tall). Backgrounds alternate between `#ffffff` and `#f5f5f7`, with `#000` / `#1d1d1f` for "cinema" moments. One storytelling section runs about 17,800px with a 100vh sticky stage inside.
- **Highlights gallery:** a wide card with large radius (~28px) bleeds off the right edge to show there's more. It auto-advances through videos, with a frosted pill holding progress dots (the active dot stretches into a filling bar) and a separate round play/pause button.
- **Caption style:** "**Bold lead sentence.** grey continuation text", the same paragraph in two colors. This replaces separate title and description elements.
- **Local nav:** 52px sticky bar with the product name on the left, section links and a small blue pill CTA on the right, and a hairline border once the page scrolls.
- **Buttons:** pill (radius 980px), `#0071e3`, padding 8×15px, 17px text. Secondary actions are text links with a chevron or ▷ glyph.
- **Video, not canvas:** 16 `<video>` elements and 0 `<canvas>` on the AirPods page. Motion is mostly video plus scroll-linked transforms and opacity.
- **Copy:** very short, declarative, ends in a period ("Pro further.", "The best thing you've never heard.").

The motion principles come from the `apple-design` skill (WWDC *Designing Fluid Interfaces*): respond on press, keep everything interruptible, use springs critically damped by default, add no bounce unless a gesture threw it, keep entry and exit paths symmetric, and provide a reduced-motion equivalent rather than nothing.

## 4. Goals, non-goals, anti-goals

**Goals**
- A first 5 seconds that makes a panelist lean in: an oversized headline, the real app glowing on a dark stage, and motion that follows the scroll.
- Show every claim instead of asserting it. Each feature is paired with its screen recording.
- Tell the thesis story in order: **problem → idea → app → how it works → proof → privacy → people → get it.**
- Feel native on a mid-range Android phone (KitaKo's own users) and look great on a projector.
- One coherent design system (tokens, type scale, motion values) that the team can extend after the defense.

**Non-goals**
- No CMS, backend, i18n, analytics, or multi-page routing. It stays a single-page static site on Vercel.
- No rewrite of the app itself and no new screen recordings (we reuse what exists, re-encoded).
- No 3D/WebGL scenes.

**Anti-goals (failure even if it "works")**
- **Impersonating Apple.** No Apple logo, no "Apple" wording, no SF Pro font files hosted by us (licensing), no Apple copy or imagery. People should think "Apple-quality", never "Apple's site".
- **Scroll-jacking.** No smooth-scroll libraries that take over the wheel (Lenis etc.) and no snapping the page. Native scrolling with scroll-*linked* effects only, which is also what Apple does.
- **Content behind hover.** Nothing important may be visible only on hover.
- **Motion for its own sake.** Every animation must explain something (reveal order, cause → effect, where something came from).
- **Jank.** Animate only `transform`, `opacity` and `filter`. No layout-thrashing scroll handlers.
- **Pretend numbers.** No placeholder metrics on the live site. If real results aren't supplied, the results block is left out.

## 5. Design system

### 5.1 Color
Neutral Apple-style surfaces, with KitaKo blue kept as the single accent so the brand survives.

| Token | Light | Use |
|---|---|---|
| `--bg` | `#ffffff` | default section |
| `--bg-alt` | `#f5f5f7` | alternating section, gallery cards |
| `--bg-ink` | `#05070d` (navy-tinted black) | cinema sections (hero, privacy) |
| `--text` | `#1d1d1f` | headings, body |
| `--text-2` | `#6e6e73` | intro grey, captions, fine print |
| `--accent` | `#2c8fd5` | large display accents, glows, progress fill (≥24px text only) |
| `--accent-ink` | `#1769b0` (5.7:1 on white) | links, small accent text |
| `--cta` | `#1a73d0` (4.8:1 with white) → hover `#1769b0` (5.7:1) | pill buttons, white text |
| `--hairline` | `rgba(0,0,0,.08)` / on dark `rgba(255,255,255,.12)` | nav border, dividers |

On dark sections: text `#f5f5f7`, secondary text `#a1a1a6`, accent glow is a radial gradient of `--accent` at 25–35% alpha (replaces the drifting blobs). The navy `#16224a` becomes a tint in the glow and the app-icon background, not a flat fill.

### 5.2 Typography
- **One family.** Stack: `system-ui, -apple-system, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif`. Apple devices render SF Pro natively, which is legal and free. Everyone else gets **Inter** (variable, self-hosted via `@fontsource-variable/inter` or Google Fonts with `opsz`). Fraunces and JetBrains Mono are dropped. Mono is kept only for code-like tokens in the "How it works" diagram, using the system mono stack.
- Scale, desktop → mobile, with tracking per size (never one value):

| Token | Desktop | Mobile | Weight | Tracking |
|---|---|---|---|---|
| `display-xl` (statement) | 96/100 | 48/52 | 600 | −0.015em |
| `display` (hero) | 80/84 | 44/48 | 600 | −0.012em |
| `headline` (section) | 56/60 | 36/40 | 600 | −0.005em |
| `title` (eyebrow, card caption) | 28/32 | 21/25 | 600 | +0.007em |
| `intro` | 24/32 | 19/27 | 600 | +0.009em |
| `body` | 17/25 | 17/25 | 400 | −0.022em |
| `fine` | 12/16 | 12/16 | 400 | −0.01em |

Use `clamp()` between breakpoints; spacing in `rem` so text zoom doesn't break the layout.

### 5.3 Shape, depth, material
- Card radius 28px (gallery and tiles), 18px (small tiles), 980px (pills).
- Shadows: none on light surfaces (Apple separates by background tone, not shadow). There is one soft glow under the hero phone.
- **Glass** is used for floating chrome only: the local nav (`rgba(255,255,255,.72)` plus `backdrop-filter: saturate(180%) blur(20px)`, dark variant over cinema sections) and the gallery's dot pill and play/pause button. Never glass on glass. Honor `prefers-reduced-transparency` (go solid) and `prefers-contrast: more`.

### 5.4 Motion
- **Easing:** `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` for entrances and `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)` for state swaps. Durations: 200ms (press and hover), 400ms (UI state), 700–900ms (section reveals).
- **Springs** (via `motion`, see §7) only where something is touched or interruptible: gallery drag and swipe, film modal open and close. Critically damped (`bounce: 0`, `duration: 0.4`). A little bounce (`0.15`) only after a flick.
- **Scroll-linked** effects use native CSS `animation-timeline: view()/scroll()` inside `@supports`, with a small shared rAF + IntersectionObserver fallback for Firefox.
- **Reveal default:** opacity 0→1, translateY 24px→0, scale .98→1, over 800ms with `--ease-out`, staggered 80ms. No per-letter mask reveals.
- **Press feedback:** on `:active`, scale .97 in 100ms. Hover is never the only feedback.
- **Reduced motion:** scroll-linked transforms become plain opacity cross-fades, auto-advance stops, videos show posters with a play button, and sticky stages unstick into stacked content.

## 6. Information architecture and sections

The new page order follows the thesis story. The new names below are working names. Copy is a first draft for the team to tune; keep it short and declarative, ending in periods.

### 0. Local nav (`Header`)
A 52px sticky bar, full width, Apple-style (replaces the floating navy capsule).
- Left: KitaKo app icon (20px) and the "KitaKo" wordmark.
- Right: Overview · How it works · Research · Team, plus a small blue pill **Download**.
- It's transparent over the dark hero and becomes light glass with a hairline after scrolling past the hero. It flips to dark glass over cinema sections, driven by an IntersectionObserver on `[data-theme="dark"]` sections.
- The active-section indicator is a 2px underline under the current link (Apple local-nav style), animated with transform.
- Mobile: links collapse into a chevron that opens a sheet dropping down *from the bar* (spatially anchored). Tapping a link closes the sheet and scrolls in the same frame (no `setTimeout`).

### 1. Hero (`Hero`), dark cinema, 100vh + about 100vh of scroll
- Eyebrow `title`: "KitaKo". Headline `display`: **"Search your photos the way you talk."** Intro: "Taglish, English, or Filipino. On your phone, with nothing leaving it."
- CTAs: pill **Download for Android** and text link **Watch the film ▷**.
- Centerpiece: `kitako_app_hero.webm` inside a clean CSS phone frame (no YouTube), floating on a soft blue radial glow.
- **Wow moment 1, scroll-linked:** as you scroll the first viewport, the headline drifts up and fades while the phone scales from about 0.8 to 1 and rises to center, and the glow brightens. The phone then hands off into section 2 (the phone exits upward; the background shifts from dark to `#f5f5f7` over about 30vh).
- **Watch the film** opens a full-screen modal (dimmed scrim, spring scale from the link's position, Esc and backdrop close, focus trap) containing the YouTube embed. YouTube is never visible on the page itself.

### 2. The problem (`Problem`, built from today's `About.tsx`), white
- A big statement in `display-xl`, centered: **"AI doesn't speak Taglish."**
- **Wow moment 2:** scroll-linked word highlighting. The statement starts at `--text-2` grey and each word turns `--text` black as it passes the reading line (Apple "words light up" effect, CSS view-timeline per word).
- Below it, a two-column intro: "**Most vision-language models learned from Western data.** Filipinos code-switch between Tagalog and English every day, and today's search tools miss them." Tune the copy from the thesis abstract.

### 3. Highlights (`Highlights`, new; replaces the Features pane of `FeaturesStack`), `#f5f5f7`
- Headline: **"Get the highlights."** with a right-aligned link "Watch the film ▷" (same modal).
- An Apple-style gallery of 5 wide cards (about 1240×680 on desktop, full-bleed with 16px gutters on mobile, aspect 4:5). Each card has a 28px caption at top center and a screen recording in a phone frame:
  1. **Taglish search.** "Type 'sunset sa beach' and find it." → `text.mp4`
  2. **Search by photo.** "Show it a picture, get similar ones." → `image.mp4`
  3. **Filter what matters.** "Date, relevance, and how many to show." → `filter.mp4`
  4. **Built for every light.** "Light, dark, and pink themes." → `darkmode.mp4` / `pinkmode.mp4`
  5. **Your whole gallery, indexed.** "Embeddings cached on first run." → `embedding.mp4` / `gallery.mp4`
- Behavior: the active card's video plays and advances on `ended`. The frosted dot pill turns the active dot into a progress bar that fills with the video's `currentTime`. Play/pause button (WCAG 2.2.2). The next card peeks at the right edge. Drag or swipe with velocity projection and a spring, using arrow keys or dot clicks. Only the active card and its ±1 neighbors hold a video `src` (reuse the pooling idea from `Walkthrough`).

### 4. Take the tour (`Walkthrough`, restyled), white
- Keep the 3D coverflow and its engine. Restyle it to the new system: drop the flourish, set the headline to **"Every screen. End to end."**, replace serif captions with `title` and `fine`, and make the prev/next buttons glass circles.
- Fix the scroll tween so it can be interrupted: user input cancels it immediately (it currently runs to completion with snap disabled).
- Pause button for auto-advance.

### 5. How it works (`HowItWorks`, new; replaces the Stack pane of `FeaturesStack`), `#f5f5f7`, sticky storytelling
- **Wow moment 3**, the thesis core made visible. A sticky 100vh stage with about 300vh of scroll in three steps. Left: the step copy scrolls past. Right: a pinned SVG pipeline diagram that **draws itself** (stroke-dashoffset tied to scroll) and highlights the active stage.
  1. **Every photo becomes a vector.** Photo → SigLIP-2 image encoder (FP32, ONNX Runtime) → embedding → index (HNSW for accuracy, IVF-PQ for speed).
  2. **Your words do too.** "jeep na puno ng tao" → LoRA-adapted text encoder (INT8) → embedding. Animate the query typing itself.
  3. **Nearest wins.** The two embeddings meet in the index and the top matches fan out as thumbnails (taken from poster frames).
- The stack (SigLIP-2, LoRA, ONNX Runtime, Flutter, HNSW, IVF-PQ) appears as labeled nodes with "**Bold lead.** grey detail" captions, replacing the 6 gradient cards.
- On mobile and with reduced motion, the diagram stacks above each step and draws once when it comes into view.

### 6. Privacy (`Privacy`, new), dark cinema
- Statement `display-xl`: **"Your photos never leave your phone."**
- Three big-number tiles: **0** network calls at search time · **100%** on-device inference · **[n] MB** total model size *(needs a real number, see §10)*.
- A visual of the phone in airplane mode with search still returning results (a still from `text.mp4` plus an airplane glyph). The glow pulses once when it comes into view, not on a loop.

### 7. Research and results (`Research`, revived from `Research.tsx`), white
- Headline: **"The research."** Abstract in `intro` style, using the bold-lead pattern.
- **Results tiles**, only if real numbers are supplied: for example Recall@1/5/10 against the base SigLIP-2, Taglish versus English queries, and on-device latency. Large numbers count up once on view, with a fine-print footnote on method.
- Cards: **Read the paper** (PDF), **Dataset** (Kaggle), **Code** (GitHub).

### 8. Team (`Team`, restyled), `#f5f5f7`
- Headline: **"The people behind KitaKo."**
- Apple-leadership-style grid: square portraits with 18px radius on white tiles, name in `body` semibold as "First Last" (the thesis credit format can live in fine print), role in `--text-2`. The adviser is visually distinct (own row or "Adviser" label).
- Portraits re-encoded to WebP/AVIF at 2× display size (target under 120 KB each).
- Hover: a very small scale (1.02) only. No overlays hiding faces.

### 9. Get KitaKo (`Download`, from `Resources`), white
- Centered: a large app icon, **"Get KitaKo."**, the pill **Download APK** (SourceForge) and the text links "View source ›" and "Browse the dataset ›".

### 10. Footer (`Footer`, restyled), `#f5f5f7`
- Apple-style fine print at 12/16 grey: link columns (Sections · Project · Contact), a hairline, then "© 2026 Stochastic·4 · [University / program] · Thesis project." Drop the blobs and dotted grid.

## 7. Technical approach (decisions)

- **Stack stays:** React 19, Vite 7, Tailwind 4, wouter, Vercel static.
- **Add `motion`** (the Motion/Framer Motion library, React entry `motion/react`) for springs in the gallery drag and film modal only. Everything scroll-linked uses native CSS scroll-driven animations plus a single shared `useScrollProgress(ref)` hook (rAF-throttled, reads `getBoundingClientRect` once per frame) as the fallback. **No GSAP, no Lenis.**
- **Tokens:** rewrite `client/src/index.css` around the §5 tokens in Tailwind 4 `@theme`. Delete the unused shadcn sidebar and chart tokens and the v5 ornament classes (`.flourish`, `.grid-paper*`, `.floaty`, `.mask-reveal`).
- **Shared primitives** in `client/src/components/`: `Section` (bg variant plus `data-theme`), `Headline`, `Eyebrow`, `Pill`/`TextLink`, `PhoneFrame` (CSS frame with a pooled `<video>` slot), `Reveal`, `VideoGallery`, `FilmModal`.
- **Imperative DOM to React:** `Walkthrough` currently builds slides with `innerHTML`. Port the slide markup to JSX while keeping its transform engine in a ref-driven effect (no per-frame React renders).
- **Media pipeline** (one-off script, not runtime): re-encode every screen recording to H.264 MP4 (+ optional WebM/AV1) at 720p, about 1–2.5 Mbps, `+faststart`, muted, with posters. The hero webm gets a target of 4 MB or less. Portraits become WebP/AVIF. Everything uses `preload="none"` except the hero, and `fetchpriority="high"` goes on the hero poster.
- **Meta:** favicon set (from `kitako_logo.png`), `theme-color`, Open Graph and Twitter card with a designed share image, `<meta name="description">`. Remove `maximum-scale=1` from the viewport (it blocks zoom, an accessibility failure).
- **Budgets:** LCP ≤ 2.5s on throttled 4G mid-tier Android, CLS < 0.05, no long tasks over 50ms during scroll, under 2 MB transferred before the first interaction.

## 8. Accessibility and quality bar
- WCAG 2.2 AA contrast for all text; verify `--accent-ink` and `--cta`.
- Visible focus rings (2px `--accent-ink`, offset 2px) on every interactive element. Gallery, coverflow and modal are fully keyboard-operable.
- Every auto-playing video has a pause control. Nothing auto-advances under `prefers-reduced-motion`.
- Videos are decorative (`aria-hidden`) with the caption text carrying the meaning; the film modal has a labelled dialog and a focus trap.
- Test matrix: Chrome desktop at 1440 and 1920 (projector), Safari macOS and iOS, Chrome on a real mid-range Android, Firefox (fallback path), 390px and 768px widths, 200% zoom.

## 9. Delivery shape (for the implementation plan)
Build in vertical slices so the site is shippable after each one:
1. Foundations: tokens, type, primitives, media re-encode, meta and favicon.
2. Nav + Hero + film modal (wow moment 1).
3. Problem statement (wow moment 2) + Highlights gallery.
4. Walkthrough restyle + How it works (wow moment 3).
5. Privacy + Research/results + Team + Download + Footer.
6. Polish pass: motion review frame by frame, reduced-motion and contrast audits, performance budgets, real-device test.

The skills to apply during the build: `apple-design` (motion and material rules), `emil-design-eng` and `impeccable` (polish and critique passes), `design-taste-frontend` (anti-template check), `animate` / `review-animations` (each wow moment), `mobile-native` (Android feel), `break-ui` (worst-case content), `design:accessibility-review`, and `superpowers:verification-before-completion` before calling any slice done.

## 10. Open items (need the team)
1. **Real results** for §7 (Recall@K, baseline comparison, latency, model size). Without them the results tiles and the "[n] MB" privacy tile are left out.
2. **Thesis PDF** link (or say it stays private) for "Read the paper".
3. **University / program name** and preferred credit format for names (e.g. "Amiel Josiah C. Acuña" vs "Acuña, Amiel Josiah C.").
4. **Identity change sign-off:** dropping the Fraunces serif and the navy-heavy look for neutral Apple-style surfaces plus KitaKo blue.
5. **Deadline** (defense date) to decide whether all six slices land or we stop after slice 3.

## 11. Calls made by the designer (please check)
- Dark cinema hero and privacy sections, light everything else.
- System font (SF on Apple devices) with Inter fallback instead of a custom display face.
- Keep and restyle the coverflow instead of replacing it.
- `motion` for springs; native CSS for scroll-linked effects; no GSAP/Lenis.
- YouTube film moves out of the hero into a modal.
- Copy drafts in §6 are placeholders for the team's voice.
