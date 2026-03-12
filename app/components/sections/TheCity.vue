<template>
  <section ref="sectionRef" class="the-city section">
    <!-- Pin wrapper for horizontal scroll -->
    <div ref="pinRef" class="city-pin">
      <div ref="trackRef" class="city-track">
        <!-- Panel 1: Establishing shot -->
        <div class="city-panel panel-establishing">
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
          <div class="panel-overlay">
            <div class="neon-sign neon-flicker">
              <span class="font-display text-[3rem] neon-red tracking-display">BAR</span>
            </div>
            <div class="neon-sign-2">
              <span class="font-display text-[2rem] neon-cyan tracking-display">RAMEN</span>
            </div>
          </div>
          <!-- Placeholder for Brian's artwork -->
          <div class="panel-image-placeholder">
            <span class="text-smoke text-sm font-body">[ artwork: neon alley ]</span>
          </div>
        </div>

        <!-- Panel 3: Street life -->
        <div class="city-panel panel-street">
          <div class="panel-overlay">
            <p class="font-serif text-[1.5rem] text-light italic leading-relaxed max-w-[30ch]">
              Nobody walks alone here.<br />
              The city follows you.
            </p>
          </div>
          <div class="panel-image-placeholder">
            <span class="text-smoke text-sm font-body">[ artwork: street scene ]</span>
          </div>
        </div>

        <!-- Panel 4: The figure -->
        <div class="city-panel panel-figure">
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

const { createTimeline, splitTextReveal } = useScrollAnimation()

onMounted(() => {
  if (!sectionRef.value || !pinRef.value || !trackRef.value) return

  // Measure horizontal scroll distance
  requestAnimationFrame(() => {
    const track = trackRef.value!
    const scrollDistance = track.scrollWidth - window.innerWidth

    // Horizontal scroll via pin + translateX
    createTimeline({
      scrollTrigger: {
        trigger: sectionRef.value!,
        start: 'top top',
        end: () => `+=${scrollDistance}`,
        pin: pinRef.value!,
        scrub: 1,
        anticipatePin: 1,
      },
    }).to(track, {
      x: -scrollDistance,
      ease: 'none',
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

/* Neon signs */
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

/* Silhouette placeholder */
.figure-silhouette {
  width: 120px;
  height: 300px;
  background: linear-gradient(to bottom, var(--smoke), transparent);
  clip-path: polygon(40% 0%, 60% 0%, 65% 30%, 80% 100%, 20% 100%, 35% 30%);
  opacity: 0.3;
}

/* Panel edge gradients for smooth transitions */
.panel-gradient-right {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 15vw;
  background: linear-gradient(to right, transparent, var(--night));
  pointer-events: none;
  z-index: 3;
}

.panel-gradient-left {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 15vw;
  background: linear-gradient(to left, transparent, var(--void));
  pointer-events: none;
  z-index: 3;
}

/* Mobile: stack vertically instead of horizontal scroll */
@media (max-width: 768px) {
  .city-track {
    flex-direction: column;
    height: auto;
  }

  .city-panel {
    width: 100%;
    height: 80vh;
  }
}
</style>
