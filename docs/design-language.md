# KitaKo Design Language

The visual and motion rules for the KitaKo website (Stochastic·4 thesis). The look is
**Apple-grade product-page design** (calm surfaces, huge confident type, real product footage,
scroll-linked motion) applied to KitaKo's own brand. Read this before adding or changing any
section.

Background and rationale: [`superpowers/specs/2026-11-05-apple-style-redesign-design.md`](superpowers/specs/2026-11-05-apple-style-redesign-design.md).
Chosen direction: prototype **A "Cinema" hero** + **C's live search bar** (branch `prototype/apple-redesign`).

---

## 1. Principles

1. **Show, don't claim.** Every capability is paired with the real screen recording that proves it. No icon-on-gradient cards standing in for a feature.
2. **One idea per screen.** Each section makes one point, usually in one sentence of display type. If a section needs two headlines, it is two sections.
3. **Quiet surfaces, loud content.** Backgrounds are white, `#f5f5f7` grey, or near-black. Color comes from the app footage and one accent blue.
4. **Motion explains.** Animation shows order, cause → effect, or where something came from. Nothing loops for decoration and nothing moves only to look busy.
5. **Native scroll is sacred.** We never take over the wheel or snap the page. Effects are *linked* to scroll, never in control of it.
6. **Apple-quality, never Apple.** No Apple logo, wording, imagery, copy, or hosted SF Pro files. A visitor should think "this feels premium", not "this is Apple's site".

## 2. Voice and copy

- **Short, declarative, ends with a period.** "Search your photos the way you talk." "Your photos never leave your phone."
- **Bold lead, grey continuation.** Intros and captions are a single paragraph where the first sentence is the darker color: "**Taglish search.** Type 'mga bulaklak sa garden' and KitaKo finds every one."
- **Taglish examples must be real.** Use queries that appear in our recordings or were tested in the app ("sunset sa beach", "mga bulaklak sa garden", "jeep na puno ng tao").
- **No invented numbers.** A metric appears only if it comes from the thesis results.
- **Plain words over jargon** in headlines. Model names (SigLIP-2, LoRA, HNSW) belong in "How it works" captions, not hero copy.

## 3. Color

| Token | Value | Role |
|---|---|---|
| `--bg` | `#ffffff` | Default section |
| `--bg-alt` | `#f5f5f7` | Alternating section, card surfaces |
| `--ink` | `#05070d` | "Cinema" sections (hero, problem, privacy): navy-tinted black |
| `--text` | `#1d1d1f` | Headings and body on light |
| `--text-2` | `#6e6e73` | Grey continuation, captions, fine print on light |
| `--on-ink` | `#f5f5f7` | Headings and body on dark |
| `--on-ink-2` | `#a1a1a6` | Secondary text on dark |
| `--accent` | `#2c8fd5` | KitaKo blue for **large** text (≥ 24px), glows, progress fills |
| `--accent-ink` | `#1769b0` | Links and small accent text on light (5.7:1) |
| `--accent-on-dark` | `#4ea7e0` | Links and accents on dark |
| `--cta` / hover | `#1a73d0` / `#1769b0` | Pill buttons, white label (4.8:1 / 5.7:1) |
| `--hairline` | `rgba(0,0,0,.08)` · dark `rgba(255,255,255,.1)` | Nav border, dividers |

**Rules**
- One accent. Never introduce a second brand color. Card tints (sky, mint, sand, lilac) are pale washes that fade from the surface color, never solid fills.
- Dark sections get depth from a **single radial glow** of the accent (25–45% alpha), never drifting blobs or dotted grids.
- Section backgrounds alternate light ↔ alt, with dark used for at most three dramatic moments. Hard cuts between sections are fine; avoid big light↔dark crossfades (brightness flashes).

## 4. Typography

**One family.** Stack: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", system-ui, "Segoe UI", Roboto, sans-serif`. Apple devices render SF Pro natively; Windows and Android render **Inter** (loaded from Google Fonts, weights 400/600/700). Mono is used only for code tokens: `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`.

| Token | Desktop → mobile (px) | Weight | Tracking | Use |
|---|---|---|---|---|
| `display-xl` | 96/100 → 40/44 | 600 | −0.025em | Section statements ("Most AI learned to see in English.") |
| `display` | 84/88 → 44/46 | 600 | −0.022em | Hero headline |
| `headline` | 56/60 → 36/40 | 600 | −0.015em | Section titles ("Get the highlights.") |
| `title` | 28/32 → 21/25 | 600 | +0.004em | Eyebrows, gallery captions, card titles |
| `intro` | 24/32 → 19/25 | 600 | +0.002em | Bold-lead paragraphs |
| `body` | 17/25 | 400 | −0.022em | Running text, buttons, links |
| `fine` | 12/16 | 400 | −0.01em | Footnotes, legal, nav links |

**Rules**
- Tracking tightens as size grows. Never put one `letter-spacing` on everything.
- Hierarchy comes from **size + weight + color** together. Don't use ALL CAPS eyebrows or letter-spaced labels; they read as template.
- Use `text-wrap: balance` on headlines and `pretty` on paragraphs. Use `clamp()` between sizes, with spacing in `rem`.
- Large type wants short lines: display ≤ 18ch, intro ≤ 40ch.

## 5. Layout and spacing

- **Content width:** 1260px, with gutters `max(22px, (100% − 1260px) / 2)`. Full-bleed media is allowed; text never goes full-bleed.
- **Section rhythm:** each section is about one viewport tall at desktop. Vertical padding is `clamp(80px, 12vh, 160px)`. Space between a section title and its content is `clamp(32px, 5vh, 56px)`.
- **Spacing scale (px):** 4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 64 · 96 · 128. Don't invent in-between values.
- **Galleries bleed right.** Horizontal card rows start on the content edge and run off the right of the viewport so the next card peeks (≈ 36px on mobile).
- **Centered for statements, left-aligned for reading.** Display statements are centered; multi-sentence copy is left-aligned in columns.

## 6. Shape, depth, material

| Element | Radius |
|---|---|
| Gallery cards, large tiles | 28px |
| Small tiles, portraits | 18px |
| Pills, dots, search bar | 980px (full) |
| Phone frame | 17% of its width (screen 13.5%) |

- **No drop shadows on light surfaces.** Separation comes from background tone. The exceptions are phone frames (one soft, long shadow) and floating glass.
- **Glass is for floating chrome only:** the nav, gallery controls, the hero search bar and modal controls. Recipe: `rgba(255,255,255,.72)` (dark: `rgba(5,7,13,.7)`) + `backdrop-filter: saturate(180%) blur(20px)` + a hairline. **Never glass on glass.** Text on glass gets full-contrast color.
- `prefers-reduced-transparency`: glass becomes solid. `prefers-contrast: more`: solid backgrounds plus a visible 1px border.

## 7. Motion

**Curves and timing**

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entrances, reveals, things arriving |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | State swaps, things moving between places |
| press | 100ms, `scale(.97)` | Every button and link on `:active` |
| hover / UI state | 200–400ms | Color, opacity, small width changes |
| reveal | 800ms, translate 24px → 0, opacity 0 → 1, stagger 90ms | Content entering the viewport (once) |

**Patterns**
- **Scroll-linked stage.** A tall section with a `position: sticky` 100vh stage. A single `--p` (0→1) custom property is written once per animation frame and CSS derives every transform and opacity from it. Only `transform`, `opacity` and `filter` animate. The hero's phone rise, the "How it works" diagram draw and the problem-statement word lighting all use this.
- **Entrance vs. scroll transforms never fight.** Entrances animate the individual `translate` property; scroll effects own `transform`.
- **Interruptible always.** Any programmatic scroll (carousel, gallery) is cancelled the instant the user touches, wheels or drags. Never lock input during a transition.
- **Video is the motion.** Recordings play only when on screen, only one at a time per gallery, and every auto-playing sequence has a visible pause control.
- **No idle loops.** No floating blobs, no infinite marquees. The one allowed loop is the blinking text caret in the hero search bar.
- **The wow moments explain the thesis.** The photos flowing into the phone show indexing. The meaning map shows retrieval. The self-drawing pipeline shows the architecture. A new spectacle has to explain something too, or it doesn't ship.
- **Native scroll-driven CSS where it's enough** (`animation-timeline: view()` inside `@supports`, e.g. the highlights gallery growing in). JS per-frame writes only when values depend on layout or input.

**Reduced motion** (`prefers-reduced-motion: reduce`)
- Sticky stages unstick into normal stacked content. Scroll transforms are removed.
- Reveals render visible immediately. The typewriter shows a static query with no caret blink.
- Galleries don't auto-advance and videos wait for play.

## 8. Components

| Component | Spec |
|---|---|
| **Local nav** | 52px, fixed. Wordmark (21px, 600) left; links (12px) + small pill **Download** right. Transparent at the very top; glass + hairline once scrolled. Tone follows the section underneath (`data-nav="dark|light"`). The active link gets a 2px underline. On mobile, links move into a sheet that drops from the bar. |
| **Pill button** | 44px tall (`sm`: 28px), padding 0 22px, `--cta`, white 17px label, full radius. One primary pill per view. |
| **Text link** | `--accent-ink` (on dark `--accent-on-dark`) 17px, with a trailing glyph: › for navigation, ▷ in a circle for "watch". Underline on hover. |
| **Phone frame** | `--w` width, aspect 1280:2800 (our recordings), `#111114` bezel 3.5% of width. Video `object-fit: cover`. Shadow `0 30px 60px -28px rgba(0,0,0,.45)`. |
| **Search bar** | 64px glass pill, max 560px, magnifier + typing query + "On-device" chip. Queries cycle with a typewriter (55–100ms per char, 1.6s hold). Decorative, so `role="img"` with an aria-label. |
| **Statement** | `display-xl`, centered, ≤ 1100px. Words start at 16% opacity color and light to full as they scroll past the reading line; the key word lights in accent. |
| **Highlights gallery** | Cards are full content width (−36px peek on mobile), 28px radius, `clamp(500px, 72vh, 680px)` tall, with a bold-lead caption on top and a phone below that bleeds off the bottom edge. A glass dot pill turns the active dot into a progress bar, with a separate glass play/pause button. Native scroll-snap. Only the active card and its ±1 neighbors hold a video `src`. |
| **Big-number tile** | Number in `display` weight 600 in accent (on dark) or `--text`, with a label in `intro` grey beneath. No borders; the surface tone separates tiles. |
| **Hero constellation** | 14 real gallery photos (WebP, 160px) at the stage edges, size and blur set by depth `z`. Scroll-linked: each glides on an ease-in-out path into the phone's landing point and shrinks to 18% as the phone rises. Mouse-only parallax (±18px × depth). Transforms are written per element, never via a parent variable. |
| **Meaning map** ("Every photo has a place") | ~55 real photos in hand-placed clusters (two layouts: wide 1000×580, tall 600×1000). They assemble from scattered positions as the section scrolls in. A query chip drops a glass probe; its top 5 fly out of the cluster into a ranked ring (#1 on top, clockwise) with lines drawn from the probe, while other photos dim to 28%. Auto-plays every 4.2s until the visitor picks or pauses. Flower and bus rankings are the app's real results, and the footnote says so. |
| **Count-up** | Big-number tiles count once on first view (1.4s, ease-out quart). Screen readers get the final value. |
| **Film modal** | `rgba(0,0,0,.82)` scrim + blur, 16:9 sheet at 18px radius scaling .94 → 1 on open, Esc and backdrop close, focus moves to the close button. The YouTube iframe mounts only while open. |

## 9. Imagery and media

- **Real footage only:** app recordings, the transparent hero render, and team portraits. No stock photos, no AI-generated illustrations of the app.
- **Encode for the web:** recordings H.264 MP4, 720px wide, `+faststart`, no audio track. Portraits WebP at 2× display size. Every video has a poster.
- **Loading:** `preload="none"` unless it's the hero. Nothing heavy loads before it's near the viewport.

## 10. Accessibility checklist (every section)

- [ ] Text contrast ≥ 4.5:1 (large ≥ 3:1), checked on both light and dark surfaces
- [ ] Every interactive element is reachable by keyboard and has a visible focus ring (2px `--accent-ink`, offset 3px)
- [ ] Auto-playing media has a pause control and stops off-screen
- [ ] Nothing important is shown only on hover
- [ ] Works with reduced motion and reduced transparency
- [ ] Zoom is not blocked (no `maximum-scale`) and the layout holds at 200% text
- [ ] Decorative media is `aria-hidden`; the meaning lives in real text

## 11. Don'ts

- Ornaments: swashes, diamonds, mono "01 · LABEL" eyebrows, dotted grids, floating blobs
- More than one type family, or a serif display face
- Gradient cards with an outline icon standing in for content
- Hover-only descriptions
- Carousels or scroll animations that can't be interrupted
- Fake metrics, placeholder lorem, Apple trademarks
