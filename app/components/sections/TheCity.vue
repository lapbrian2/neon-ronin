<template>
  <section ref="sectionRef" class="the-city section">
    <!-- Pin wrapper for horizontal scroll -->
    <div ref="pinRef" class="city-pin">
      <!-- Ambient neon pulse -->
      <div class="city-neon-pulse" />

      <!-- Atmospheric fog layers -->
      <div class="city-fog city-fog--top" />
      <div class="city-fog city-fog--bottom" />

      <div ref="trackRef" class="city-track">
        <!-- Panel 1: Establishing shot -->
        <div class="city-panel panel-establishing">
          <div class="panel-depth-layer panel-depth--far" />
          <div class="panel-depth-layer panel-depth--mid" />
          <div class="panel-content">
            <span class="font-body text-ash uppercase tracking-[0.3em] text-sm">Chapter II</span>
            <h2 ref="cityTitle" class="font-display text-chapter tracking-display uppercase mt-4 text-light">
              THE CITY
            </h2>
            <p class="font-body text-ash mt-4 max-w-[35ch]">
              Every light hides a lie. Every shadow keeps a secret.
            </p>
          </div>
          <div class="panel-gradient-right" />
        </div>

        <!-- Panel 2: Neon alley -->
        <div class="city-panel panel-alley">
          <div class="panel-depth-layer panel-depth--far panel-depth--purple" />
          <div class="panel-overlay">
            <!-- Neon signs with glow effect -->
            <div class="neon-sign neon-flicker">
              <span class="font-display text-[5rem] neon-red tracking-display neon-sign-glow neon-sign-glow--red">BAR</span>
            </div>
            <div class="neon-sign-2">
              <span class="font-display text-[3.5rem] neon-cyan tracking-display neon-sign-glow neon-sign-glow--cyan">RAMEN</span>
            </div>
            <div class="neon-sign-3 neon-flicker-slow">
              <span class="font-display text-[2.5rem] neon-amber tracking-display neon-sign-glow neon-sign-glow--amber">24H</span>
            </div>
            <!-- Rain streaks on panel -->
            <div class="panel-rain-streaks">
              <div v-for="i in 8" :key="i" class="rain-streak" :style="{ left: `${10 + i * 10}%`, animationDelay: `${i * 0.3}s`, height: `${20 + Math.random() * 30}%` }" />
            </div>
          </div>
          <!-- Atmospheric neon wash -->
          <div class="alley-neon-wash" />
          <div class="alley-light-bars">
            <div v-for="i in 5" :key="'lb-'+i" class="light-bar" :style="{ left: `${15 + i * 16}%`, opacity: 0.03 + (i % 3) * 0.02, animationDelay: `${i * 1.2}s` }" />
          </div>
        </div>

        <!-- Panel 3: Street life -->
        <div class="city-panel panel-street">
          <div class="panel-depth-layer panel-depth--far panel-depth--blue" />
          <div class="panel-overlay">
            <p class="font-serif text-[1.5rem] text-light italic leading-relaxed max-w-[30ch]">
              The city watches.<br />
              It never blinks.
            </p>
          </div>
          <!-- Puddle reflection effect -->
          <div class="panel-puddle" />
          <div class="street-atmosphere" />
        </div>

        <!-- Panel 4: The figure -->
        <div class="city-panel panel-figure">
          <div class="panel-depth-layer panel-depth--far" />
          <div class="panel-overlay panel-overlay--centered">
            <div class="figure-silhouette" />
            <p class="font-body text-ash mt-8 text-sm uppercase tracking-[0.2em]">
              He walks like someone who used to matter.
            </p>
          </div>
          <div class="figure-backlight" />
          <div class="panel-gradient-left" />
        </div>
      </div>

      <!-- Progress bar at bottom -->
      <div class="city-progress">
        <div ref="progressBar" class="city-progress-bar" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const sectionRef = ref<HTMLElement | null>(null)
const pinRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const cityTitle = ref<HTMLElement | null>(null)
const progressBar = ref<HTMLElement | null>(null)

const { createTimeline, splitTextReveal } = useScrollAnimation()

onMounted(() => {
  if (!sectionRef.value || !pinRef.value || !trackRef.value) return

  // Measure horizontal scroll distance
  requestAnimationFrame(() => {
    const track = trackRef.value!
    const scrollDistance = track.scrollWidth - window.innerWidth

    // Horizontal scroll via pin + translateX
    const tl = createTimeline({
      scrollTrigger: {
        trigger: sectionRef.value!,
        start: 'top top',
        end: () => `+=${scrollDistance}`,
        pin: pinRef.value!,
        scrub: 1,
        anticipatePin: 1,
      },
    })

    tl.to(track, {
      x: -scrollDistance,
      ease: 'none',
    }, 0)

    // Progress bar follows scroll
    tl.to(progressBar.value, {
      scaleX: 1,
      ease: 'none',
    }, 0)

    // Parallax depth layers — move slower than panels
    const farLayers = track.querySelectorAll('.panel-depth--far')
    farLayers.forEach((layer) => {
      gsap.to(layer, {
        x: scrollDistance * 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value!,
          start: 'top top',
          end: () => `+=${scrollDistance}`,
          scrub: 1,
        },
      })
    })

    // Per-panel content reveals with unique transforms
    const panelOverlays = track.querySelectorAll('.panel-overlay, .panel-content')
    panelOverlays.forEach((overlay, i) => {
      const offsets = [
        { y: 40, opacity: 0, rotation: 0 },
        { y: 0, opacity: 0, x: 60 },
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 0, x: -40 },
      ]
      const initial = offsets[i] || offsets[0]
      gsap.set(overlay, initial)

      gsap.to(overlay, {
        y: 0, x: 0, opacity: 1, scale: 1, rotation: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: () => `top+${i * window.innerWidth * 0.6} top`,
          end: () => `top+${i * window.innerWidth * 0.6 + window.innerWidth * 0.5} top`,
          scrub: 1,
        },
      })
    })

    // Neon signs pulse brighter as you scroll through alley panel
    const neonSigns = track.querySelectorAll('.neon-sign, .neon-sign-2, .neon-sign-3')
    neonSigns.forEach((sign, i) => {
      gsap.fromTo(sign,
        { opacity: 0.4, scale: 0.95 },
        {
          opacity: 1, scale: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.value,
            start: () => `top+${window.innerWidth * 0.5} top`,
            end: () => `top+${window.innerWidth * 1.2} top`,
            scrub: 1,
          },
        }
      )
    })

    // Title reveal
    if (cityTitle.value) {
      splitTextReveal(cityTitle.value, {
        trigger: sectionRef.value!,
        start: 'top 60%',
      })
    }
  })
})
</script>

<style scoped>
.the-city {
  background-color: var(--night);
}

.city-pin {
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.city-track {
  display: flex;
  height: 100vh;
  will-change: transform;
}

.city-panel {
  position: relative;
  flex-shrink: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Parallax depth layers */
.panel-depth-layer {
  position: absolute;
  inset: -20%;
  pointer-events: none;
  will-change: transform;
}

.panel-depth--far {
  background: radial-gradient(ellipse at 50% 80%, rgba(255, 23, 68, 0.04) 0%, transparent 60%);
}

.panel-depth--purple {
  background: radial-gradient(ellipse at 30% 50%, rgba(170, 0, 255, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 70%, rgba(255, 23, 68, 0.04) 0%, transparent 40%);
}

.panel-depth--blue {
  background: radial-gradient(ellipse at 60% 40%, rgba(0, 229, 255, 0.05) 0%, transparent 50%);
}

/* Atmospheric fog */
.city-fog {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 10;
  pointer-events: none;
}

.city-fog--top {
  top: 0;
  height: 15vh;
  background: linear-gradient(to bottom, var(--night), transparent);
}

.city-fog--bottom {
  bottom: 0;
  height: 20vh;
  background: linear-gradient(to top, var(--night), transparent);
}

.panel-establishing {
  background: linear-gradient(135deg, var(--night) 0%, var(--steel) 100%);
}

.panel-alley {
  background: linear-gradient(180deg, #0a0a1a 0%, #1a0825 50%, #250a30 100%);
}

.panel-street {
  background: linear-gradient(180deg, var(--night) 0%, #0d1a2b 100%);
}

.panel-figure {
  background: linear-gradient(180deg, #0d0d1a 0%, var(--void) 100%);
}

.panel-content {
  position: relative;
  z-index: 2;
  padding: 2rem;
}

.panel-overlay {
  position: relative;
  z-index: 2;
  padding: 2rem;
}

.panel-overlay--centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}



/* Neon signs with glow */
.neon-sign {
  position: absolute;
  top: 20%;
  right: 15%;
}

.neon-sign-2 {
  position: absolute;
  bottom: 30%;
  left: 10%;
}

.neon-sign-3 {
  position: absolute;
  top: 40%;
  left: 30%;
}

.neon-sign-glow {
  text-shadow: 0 0 10px currentColor, 0 0 30px currentColor, 0 0 60px currentColor;
}

.neon-sign-glow--red {
  text-shadow: 0 0 10px var(--neon-red), 0 0 40px var(--neon-red), 0 0 80px var(--neon-red), 0 0 120px rgba(255, 23, 68, 0.3);
}

.neon-sign-glow--cyan {
  text-shadow: 0 0 10px var(--neon-cyan), 0 0 40px var(--neon-cyan), 0 0 80px var(--neon-cyan), 0 0 120px rgba(0, 229, 255, 0.3);
}

.neon-sign-glow--amber {
  text-shadow: 0 0 10px var(--neon-amber), 0 0 40px var(--neon-amber), 0 0 80px var(--neon-amber), 0 0 120px rgba(255, 215, 64, 0.3);
}

/* Neon flicker variant (slow) */
.neon-flicker-slow {
  animation: neon-flicker 4s ease-in-out infinite alternate;
}

/* Rain streaks on panels */
.panel-rain-streaks {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  overflow: hidden;
}

.rain-streak {
  position: absolute;
  top: -10%;
  width: 1px;
  background: linear-gradient(to bottom, transparent, rgba(100, 150, 200, 0.3), transparent);
  animation: rain-fall 1.2s linear infinite;
}

@keyframes rain-fall {
  0% { transform: translateY(-100%); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(120vh); opacity: 0; }
}

/* Puddle reflection with shimmer */
@keyframes puddle-shimmer {
  0%, 100% { opacity: 0.03; transform: scaleY(1); }
  50% { opacity: 0.06; transform: scaleY(1.1); }
}

.panel-puddle {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 15%;
  background: linear-gradient(to top, rgba(0, 229, 255, 0.03), transparent);
  z-index: 3;
  pointer-events: none;
  animation: puddle-shimmer 4s ease-in-out infinite;
  transform-origin: bottom;
}

/* Silhouette placeholder */
.figure-silhouette {
  width: 120px;
  height: 300px;
  background: linear-gradient(to bottom, var(--smoke), transparent);
  clip-path: polygon(40% 0%, 60% 0%, 65% 30%, 80% 100%, 20% 100%, 35% 30%);
  opacity: 0.3;
}

/* Panel edge gradients */
.panel-gradient-right {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 15vw;
  background: linear-gradient(to right, transparent, var(--night));
  pointer-events: none;
  z-index: 5;
}

.panel-gradient-left {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 15vw;
  background: linear-gradient(to left, transparent, var(--void));
  pointer-events: none;
  z-index: 5;
}

/* Progress bar */
.city-progress {
  position: absolute;
  bottom: 2rem;
  left: 10%;
  right: 10%;
  height: 2px;
  background: rgba(255, 255, 255, 0.08);
  z-index: 20;
  border-radius: 1px;
}

.city-progress-bar {
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, var(--neon-red), var(--neon-cyan));
  transform: scaleX(0);
  transform-origin: left;
  border-radius: 1px;
}

/* Alley neon wash — vertical color bleeds suggesting city lights */
.alley-neon-wash {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    linear-gradient(90deg, transparent 18%, rgba(170, 0, 255, 0.06) 22%, transparent 28%),
    linear-gradient(90deg, transparent 50%, rgba(255, 23, 68, 0.05) 55%, transparent 62%),
    linear-gradient(90deg, transparent 72%, rgba(0, 229, 255, 0.04) 78%, transparent 84%);
  pointer-events: none;
}

/* Vertical light bars from windows/signs */
.alley-light-bars {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.light-bar {
  position: absolute;
  top: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(to bottom,
    transparent 10%,
    rgba(170, 0, 255, 0.08) 30%,
    rgba(255, 23, 68, 0.06) 50%,
    rgba(0, 229, 255, 0.04) 70%,
    transparent 90%
  );
  filter: blur(8px);
  animation: light-bar-flicker 6s ease-in-out infinite alternate;
}

@keyframes light-bar-flicker {
  0%, 100% { opacity: 0.5; }
  30% { opacity: 0.8; }
  60% { opacity: 0.3; }
}

/* Street wet-ground atmosphere */
.street-atmosphere {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    linear-gradient(to top, rgba(0, 229, 255, 0.04) 0%, transparent 30%),
    linear-gradient(to bottom, transparent 60%, rgba(0, 20, 40, 0.3) 100%);
}

/* Figure backlight glow */
.figure-backlight {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse at 50% 40%,
    rgba(255, 23, 68, 0.06) 0%,
    rgba(170, 0, 255, 0.03) 30%,
    transparent 60%
  );
}


/* Ambient neon pulse — city breathing with light */
.city-neon-pulse {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse at 30% 60%,
    rgba(170, 0, 255, 0.04) 0%,
    transparent 40%
  ),
  radial-gradient(
    ellipse at 70% 40%,
    rgba(255, 23, 68, 0.03) 0%,
    transparent 35%
  ),
  radial-gradient(
    ellipse at 50% 80%,
    rgba(0, 229, 255, 0.03) 0%,
    transparent 30%
  );
  animation: city-pulse 8s ease-in-out infinite alternate;
}

@keyframes city-pulse {
  0% {
    opacity: 0.5;
    filter: blur(40px);
  }
  50% {
    opacity: 0.8;
    filter: blur(50px);
  }
  100% {
    opacity: 0.6;
    filter: blur(45px);
  }
}

/* Mobile: stack vertically */
@media (max-width: 768px) {
  .city-track {
    flex-direction: column;
    height: auto;
  }

  .city-panel {
    width: 100%;
    height: 80vh;
  }

  .city-progress {
    display: none;
  }
}
</style>
