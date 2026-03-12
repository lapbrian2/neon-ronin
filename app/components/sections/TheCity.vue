<template>
  <section ref="sectionRef" class="the-city section">
    <!-- Pin wrapper for horizontal scroll -->
    <div ref="pinRef" class="city-pin">
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
              Neon veins pulse through concrete bones. Every corner hums a different frequency.
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
              <span class="font-display text-[3rem] neon-red tracking-display neon-sign-glow neon-sign-glow--red">BAR</span>
            </div>
            <div class="neon-sign-2">
              <span class="font-display text-[2rem] neon-cyan tracking-display neon-sign-glow neon-sign-glow--cyan">RAMEN</span>
            </div>
            <div class="neon-sign-3 neon-flicker-slow">
              <span class="font-display text-[1.5rem] neon-amber tracking-display neon-sign-glow neon-sign-glow--amber">24H</span>
            </div>
            <!-- Rain streaks on panel -->
            <div class="panel-rain-streaks">
              <div v-for="i in 8" :key="i" class="rain-streak" :style="{ left: `${10 + i * 10}%`, animationDelay: `${i * 0.3}s`, height: `${20 + Math.random() * 30}%` }" />
            </div>
          </div>
          <!-- Placeholder for Brian's artwork -->
          <div class="panel-image-placeholder">
            <span class="text-smoke text-sm font-body">[ artwork: neon alley ]</span>
          </div>
        </div>

        <!-- Panel 3: Street life -->
        <div class="city-panel panel-street">
          <div class="panel-depth-layer panel-depth--far panel-depth--blue" />
          <div class="panel-overlay">
            <p class="font-serif text-[1.5rem] text-light italic leading-relaxed max-w-[30ch]">
              Nobody walks alone here.<br />
              The city follows you.
            </p>
          </div>
          <!-- Puddle reflection effect -->
          <div class="panel-puddle" />
          <div class="panel-image-placeholder">
            <span class="text-smoke text-sm font-body">[ artwork: street scene ]</span>
          </div>
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
          <div class="panel-image-placeholder">
            <span class="text-smoke text-sm font-body">[ artwork: ronin silhouette ]</span>
          </div>
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
  background: linear-gradient(180deg, #0a0a1a 0%, #1a0a2a 100%);
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

.panel-image-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  border: 1px dashed var(--smoke);
  margin: 2rem;
  border-radius: 4px;
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
  text-shadow: 0 0 10px var(--neon-red), 0 0 30px var(--neon-red), 0 0 60px var(--neon-red);
}

.neon-sign-glow--cyan {
  text-shadow: 0 0 10px var(--neon-cyan), 0 0 30px var(--neon-cyan), 0 0 60px var(--neon-cyan);
}

.neon-sign-glow--amber {
  text-shadow: 0 0 10px var(--neon-amber), 0 0 30px var(--neon-amber), 0 0 60px var(--neon-amber);
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

/* Puddle reflection */
.panel-puddle {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 15%;
  background: linear-gradient(to top, rgba(0, 229, 255, 0.03), transparent);
  z-index: 3;
  pointer-events: none;
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
