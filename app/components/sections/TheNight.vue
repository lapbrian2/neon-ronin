<template>
  <section ref="sectionRef" class="the-night section">
    <!-- Red action vignette -->
    <div ref="redVignette" class="night-vignette" />

    <!-- Speed lines background -->
    <div ref="speedLines" class="speed-lines-container">
      <div v-for="i in 16" :key="i" class="speed-line-ray" :style="{ transform: `rotate(${i * 22.5}deg)` }" />
    </div>

    <!-- Ember/spark particles (client-only canvas) -->

    <ClientOnly>
      <ThreeEmberCanvas />
    </ClientOnly>

    <!-- Sword slash trail (scroll-driven canvas) -->
    <ClientOnly>
      <ThreeSlashTrail />
    </ClientOnly>

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
              <span class="font-display text-[1.5rem] text-light uppercase tracking-display panel-text-glow">DRAW</span>
            </div>
            <!-- Panel flash overlay -->
            <div class="panel-flash" />
          </div>
        </div>

        <div class="night-panel panel-2 opacity-0">
          <div class="panel-inner">
            <div class="panel-placeholder">
              <span class="text-smoke text-sm font-body">[ artwork: the strike ]</span>
            </div>
            <!-- Slash effect across panel -->
            <div class="panel-slash" />
            <div class="panel-flash" />
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

      <!-- Closing impact text -->
      <div ref="impactRef" class="night-impact mt-16 opacity-0">
        <p class="font-display text-[clamp(1.5rem,4vw,3rem)] tracking-display uppercase text-light">
          THE BLADE <span class="neon-red">REMEMBERS</span>
        </p>
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
const impactRef = ref<HTMLElement | null>(null)
const redVignette = ref<HTMLElement | null>(null)

const { createTimeline, gsap } = useScrollAnimation()

onMounted(() => {
  if (!sectionRef.value) return

  // Red vignette builds intensity through section
  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: 1,
    },
  }).fromTo(redVignette.value,
    { opacity: 0 },
    { opacity: 1, ease: 'power2.in' }
  )

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
    { opacity: 0.2, scale: 1.8, ease: 'power2.out' }
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
        scale: 1.5,
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
    gsap.set(panels[0], { x: -80, rotation: -5, scale: 0.85 })
    gsap.set(panels[1], { y: 80, scale: 0.8 })
    gsap.set(panels[2], { x: 80, rotation: 5, scale: 0.85 })

    const panelTl = createTimeline({
      scrollTrigger: {
        trigger: panelsRef.value,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    })

    panelTl.to(panels, {
      opacity: 1,
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
    })

    // Flash each panel sequentially after they land
    const flashes = panelsRef.value?.querySelectorAll('.panel-flash')
    if (flashes) {
      panelTl.to(flashes, {
        opacity: 0.3,
        duration: 0.05,
        stagger: 0.15,
      }, '-=0.3')
      panelTl.to(flashes, {
        opacity: 0,
        duration: 0.3,
        stagger: 0.15,
      })
    }

    // Screen shake on panel impact
    panelTl.to(sectionRef.value, {
      x: -6,
      duration: 0.03,
    }, "-=0.25")
    panelTl.to(sectionRef.value, {
      x: 6,
      duration: 0.03,
    })
    panelTl.to(sectionRef.value, {
      x: -3,
      duration: 0.03,
    })
    panelTl.to(sectionRef.value, {
      x: 0,
      duration: 0.1,
      ease: "power2.out",
    })

    // Slash effect on panel 2
    const slash = panelsRef.value?.querySelector('.panel-slash')
    if (slash) {
      gsap.set(slash, { scaleX: 0 })
      panelTl.to(slash, {
        scaleX: 1,
        duration: 0.3,
        ease: 'power4.in',
      }, '-=0.5')
    }
  }

  // Impact text
  gsap.set(impactRef.value, { y: 30, scale: 0.95 })
  createTimeline({
    scrollTrigger: {
      trigger: impactRef.value,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  }).to(impactRef.value, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.8,
    ease: 'power3.out',
  })
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

.night-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 30%,
    rgba(255, 23, 68, 0.06) 60%,
    rgba(255, 23, 68, 0.12) 80%,
    rgba(255, 23, 68, 0.08) 100%
  );
  pointer-events: none;
  z-index: 1;
  opacity: 0;
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
  height: 150vh;
  background: linear-gradient(to bottom, transparent, var(--neon-red), transparent);
  transform-origin: center;
  opacity: 0.2;
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
  transition: border-color 0.3s ease;
}

.panel-inner:hover {
  border-color: var(--neon-red);
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

.panel-text-glow {
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.2);
}

/* Panel flash overlay */
.panel-flash {
  position: absolute;
  inset: 0;
  background: white;
  opacity: 0;
  pointer-events: none;
  z-index: 5;
}

/* Slash effect */
.panel-slash {
  position: absolute;
  top: 30%;
  left: -10%;
  right: -10%;
  height: 3px;
  background: linear-gradient(to right, transparent, white, var(--neon-red), white, transparent);
  transform: rotate(-15deg) scaleX(0);
  transform-origin: left center;
  z-index: 4;
  box-shadow: 0 0 15px rgba(255, 23, 68, 0.5), 0 0 30px rgba(255, 23, 68, 0.3);
}

/* Impact text */
.night-impact {
  will-change: transform, opacity;
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
