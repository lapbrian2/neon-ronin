# NEON RONIN — Design System (MASTER)

Generated following ui-ux-pro-max 9-section framework.
Project: Anime scroll-driven experience | Stack: Nuxt 4 + Three.js + GSAP + Lenis

---

## 1. Pattern Match

**Industry:** Entertainment / Interactive Storytelling / Portfolio Piece
**Pattern:** Scroll-driven cinematic narrative — linear story progression with environmental transitions
**Reference:** Awwwards SOTD-level immersive experiences (scroll-driven camera, full-bleed sections, atmospheric particles)

---

## 2. Style Selection

**Primary Style:** Cyberpunk Noir — neon-soaked darkness with moments of warmth
**Secondary Style:** Ink Wash (traditional Japanese sumi-e) — used for flashback section only
**Tertiary Style:** Kinetic Typography — bold, animated text for the "Code" section

**Visual Language:**
- Full-bleed sections, no visible grid
- Atmospheric depth via particles, fog, parallax layers
- Anime cel-shaded aesthetic (flat fills + bold outlines)
- Neon glow effects on interactive elements
- Cinematic letterboxing on hero

---

## 3. Color Palette

### Core Palette
| Token | Hex | Role |
|-------|-----|------|
| `--void` | `#08080F` | Deep background — the void between neon |
| `--night` | `#0D0D2B` | Section backgrounds — dark indigo |
| `--steel` | `#1A1B3A` | Elevated surfaces, cards |
| `--smoke` | `#3A3F5C` | Muted text, dividers |
| `--ash` | `#8B8FA3` | Secondary text |
| `--light` | `#E8E6E3` | Primary text — warm off-white |
| `--pure` | `#FFFFFF` | Accent text, highlights |

### Neon Accents
| Token | Hex | Role |
|-------|-----|------|
| `--neon-red` | `#FF1744` | Primary accent — Lupin red, danger, action |
| `--neon-cyan` | `#00E5FF` | Secondary accent — tech, glow, rain |
| `--neon-amber` | `#FFD740` | Warm accent — dawn, ramen steam, hope |
| `--neon-violet` | `#AA00FF` | Tertiary — atmosphere, distant neon |

### Ink Wash (flashback section only)
| Token | Hex | Role |
|-------|-----|------|
| `--ink-black` | `#1A1814` | Warm black with sepia undertone |
| `--ink-gray` | `#4A4540` | Mid-tone ink wash |
| `--ink-paper` | `#E8DFD0` | Aged paper background |
| `--ink-red` | `#8B2500` | Hanko seal red |

### Glow Effects
```css
--glow-red: 0 0 20px rgba(255, 23, 68, 0.6), 0 0 60px rgba(255, 23, 68, 0.2);
--glow-cyan: 0 0 20px rgba(0, 229, 255, 0.6), 0 0 60px rgba(0, 229, 255, 0.2);
--glow-amber: 0 0 20px rgba(255, 215, 64, 0.6), 0 0 60px rgba(255, 215, 64, 0.2);
```

---

## 4. Typography

### Font Stack
| Role | Font | Weight | Fallback |
|------|------|--------|----------|
| Display | **Bebas Neue** | 400 | Impact, sans-serif |
| Heading | **Outfit** | 600, 700 | system-ui, sans-serif |
| Body | **Inter** | 400, 500 | system-ui, sans-serif |
| Accent (ink wash) | **Noto Serif JP** | 400, 700 | serif |

### Scale
| Token | Size | Use |
|-------|------|-----|
| `--text-hero` | clamp(4rem, 10vw, 10rem) | Hero title |
| `--text-chapter` | clamp(2.5rem, 5vw, 5rem) | Section titles |
| `--text-heading` | clamp(1.5rem, 3vw, 2.5rem) | Sub-headings |
| `--text-body` | clamp(1rem, 1.2vw, 1.25rem) | Body text |
| `--text-caption` | 0.875rem | Captions, meta |

### Rules
- Display text: ALL CAPS, letter-spacing 0.08em
- Body text: max-width 60ch for readability
- Neon text glow via text-shadow (not filter: drop-shadow — too expensive)
- Japanese text uses Noto Serif JP at 700 weight

---

## 5. Effects & Micro-interactions

### Scroll-Driven
- **Lenis smooth scroll** — lerp 0.07, duration 1.2
- **GSAP ScrollTrigger** — pin sections, scrub animations
- **Parallax depth** — 3 layers per section (bg: 0.3x, mid: 0.6x, fg: 1x)
- **Section transitions** — opacity crossfade with color shift

### Three.js (client-only)
- **Rain particles** — 2000 desktop / 800 mobile, falling with wind offset
- **Neon glow post-processing** — UnrealBloomPass, subtle
- **Fog** — exponential fog matching section bg color
- **Cel-shaded materials** — MeshToonMaterial with 3-step gradient DataTexture

### CSS Animations
- **Neon flicker** — keyframe opacity pulse on accent elements
- **Speed lines** — radial gradient + scale animation for action section
- **Ink bleed** — clip-path reveal with feathered edges for flashback
- **Text reveal** — per-character translateY + opacity stagger

### Hover / Interactive
- Cursor: custom dot + ring (kill on mobile)
- Hover glow: box-shadow transition 0.3s ease
- Magnetic CTA buttons: subtle pull toward cursor

---

## 6. Anti-patterns

- NO particle backgrounds as decoration — particles must serve the story (rain, embers, dust)
- NO generic hero with centered text over stock image
- NO scroll-jacking that removes user control — Lenis preserves native feel
- NO autoplay audio — user must opt in
- NO template-feeling layouts — each section has unique composition
- NO uniform animation timing — stagger and vary eases per element
- NO photorealistic 3D — stay cel-shaded / anime aesthetic
- NO over-engineering responsive — mobile gets simplified 3D, not broken 3D

---

## 7. Stack Guidelines (Nuxt 4 + Vue 3)

### Architecture
- All Three.js components use `.client.vue` suffix (SSR safety)
- GSAP + Lenis plugins registered as `.client.ts` plugins
- Composables for shared scroll/animation logic
- Single `pages/index.vue` — scroll-driven SPA, not multi-page

### Immersive 3D Web Pattern (CRITICAL)
```
Lenis → GSAP ScrollTrigger → proxy objects → Three.js render()
```
- NEVER let GSAP animate Three.js objects directly
- GSAP animates plain JS proxy objects
- Three.js reads proxy values in its own render loop
- One RAF loop, one source of truth

### Plugin Registration
```ts
// plugins/gsap.client.ts
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
```

### Cleanup
- Every `onMounted` has a matching `onUnmounted`
- Kill ScrollTrigger instances, dispose Three.js geometries/materials/textures
- Remove Lenis RAF from gsap.ticker

---

## 8. Implementation Notes

### Section Breakdown
| Section | Scroll Length | Key Effect | Three.js |
|---------|-------------|------------|----------|
| Rain (Hero) | 100vh pinned | Title reveal, rain | Yes — rain particles |
| The City | 300vw horizontal | Parallax urban scroll | Optional — neon signs |
| The Past | 100vh | Ink wash reveal | No — CSS only |
| The Code | 150vh pinned | Kinetic typography | No — GSAP text |
| The Night | 200vh | Speed lines, action | Optional — particles |
| Dawn | 100vh | Slow fade, warmth | Optional — steam |

### Image Strategy
- Brian provides anime artwork for each section
- Images served from `/public/images/` initially
- Lazy load below fold with `loading="lazy"`
- WebP format preferred, fallback PNG

### Performance Budget
- First paint < 2s
- Three.js scene init deferred until after hydration
- Mobile: reduce particle count, disable post-processing
- Target 60fps on mid-range devices

---

## 9. Pre-delivery Checklist

- [ ] All sections scroll smoothly with Lenis
- [ ] Three.js rain renders on hero, disposes on unmount
- [ ] GSAP ScrollTrigger triggers are pinned correctly
- [ ] Text animations stagger per-character
- [ ] Neon glow effects render without layout shift
- [ ] Mobile responsive (simplified 3D, adjusted typography)
- [ ] Dark theme throughout, no flash of white
- [ ] Image placeholders until Brian provides artwork
- [ ] Git pushed to lapbrian2/neon-ronin
- [ ] Vercel deployment working
- [ ] Lighthouse performance > 80
- [ ] No console errors
