<template>
  <section ref="sectionRef" class="the-night section">
    <!-- Speed lines background -->
    <div ref="speedLines" class="speed-lines-container">
      <div v-for="i in 12" :key="i" class="speed-line-ray" :style="{ transform: `rotate(${i * 30}deg)` }" />
    </div>

    <div class="night-content">
      <!-- Chapter marker -->
      <span ref="chapterRef" class="font-body text-ash uppercase tracking-[0.3em] text-sm opacity-0">
        Chapter V
      </span>

      <h2 ref="titleRef" class="font-display text-chapter tracking-display uppercase mt-4 leading-none">
        <span class="neon-red">THE NIGHT</span>
      </h2>

      <p ref="subtextRef" class="font-body text-ash mt-4 max-w-[40ch] mx-auto opacity-0">
        Every scar was earned running toward something, not away.
      </p>

      <!-- Action panels — manga-style grid -->
      <div ref="panelsRef" class="night-panels mt-16">
        <div class="night-panel panel-1 opacity-0">
          <div class="panel-inner">
            <div class="panel-placeholder">
              <span class="text-smoke text-sm font-body">[ artwork: the confrontation ]</span>
            </div>
            <div class="panel-caption">
              <span class="font-display text-[1.5rem] text-light uppercase tracking-display">DRAW</span>
            </div>
          </div>
        </div>

        <div class="night-panel panel-2 opacity-0">
          <div class="panel-inner">
            <div class="panel-placeholder">
              <span class="text-smoke text-sm font-body">[ artwork: the strike ]</span>
            </div>
          </div>
        </div>

        <div class="night-panel panel-3 opacity-0">
          <div class="panel-inner">
            <div class="panel-placeholder">
              <span class="text-smoke text-sm font-body">[ artwork: aftermath ]</span>
            </div>
            <div class="panel-caption panel-caption--bottom">
              <span class="font-body text-ash text-sm italic">One breath. One cut. Done.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
const chapterRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtextRef = ref<HTMLElement | null>(null)
const panelsRef = ref<HTMLElement | null>(null)
const speedLines = ref<HTMLElement | null>(null)

const { createTimeline, gsap, splitTextReveal } = useScrollAnimation()

onMounted(() => {
  if (!sectionRef.value) return

  // Speed lines pulse on scroll
  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1,
    },
  }).fromTo(
    speedLines.value,
    { opacity: 0, scale: 0.5 },
    { opacity: 0.15, scale: 1.5, ease: 'power2.out' }
  )

  // Chapter + title entrance
  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 60%',
      toggleActions: 'play none none none',
    },
  })
    .to(chapterRef.value, {
      opacity: 1,
      duration: 0.6,
    })
    .from(
      titleRef.value,
      {
        scale: 1.3,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.2'
    )
    .to(
      subtextRef.value,
      {
        opacity: 1,
        duration: 0.6,
      },
      '-=0.3'
    )

  // Manga panels — stagger with unique transforms
  const panels = panelsRef.value?.querySelectorAll('.night-panel')
  if (panels) {
    gsap.set(panels[0], { x: -60, rotation: -3 })
    gsap.set(panels[1], { y: 60, scale: 0.9 })
    gsap.set(panels[2], { x: 60, rotation: 3 })

    createTimeline({
      scrollTrigger: {
        trigger: panelsRef.value,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    }).to(panels, {
      opacity: 1,
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
    })
  }
})
</script>

<style scoped>
.the-night {
  position: relative;
  min-height: 100vh;
  background: radial-gradient(ellipse at center, #1a0a2a 0%, var(--void) 70%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 6rem 2rem;
}

.speed-lines-container {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: 0;
}

.speed-line-ray {
  position: absolute;
  width: 2px;
  height: 120vh;
  background: linear-gradient(to bottom, transparent, var(--neon-red), transparent);
  transform-origin: center;
  opacity: 0.3;
}

.night-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 1000px;
  width: 100%;
}

/* Manga panel grid */
.night-panels {
  display: grid;
  grid-template-columns: 1fr 1.2fr 0.8fr;
  gap: 1rem;
  width: 100%;
}

.night-panel {
  will-change: transform, opacity;
}

.panel-inner {
  position: relative;
  overflow: hidden;
  border: 2px solid var(--smoke);
}

.panel-placeholder {
  aspect-ratio: 3/4;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(26, 27, 58, 0.3);
}

.panel-2 .panel-placeholder {
  aspect-ratio: 1/1;
}

.panel-caption {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
}

.panel-caption--bottom {
  top: auto;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  text-align: center;
}

@media (max-width: 768px) {
  .night-panels {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }

  .panel-2 .panel-placeholder {
    aspect-ratio: 3/4;
  }
}
</style>
