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
        Some debts are only settled in blood.
      </p>

      <!-- Action panels — manga-style grid -->
      <div ref="panelsRef" class="night-panels mt-16">
        <div class="night-panel panel-1 opacity-0">
          <div class="panel-inner">
            <div class="panel-placeholder">
              <div class="panel-atmosphere panel-atmo--red" />
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
              <div class="panel-atmosphere panel-atmo--slash" />
            </div>
            <!-- Slash effect across panel -->
            <div class="panel-slash" />
            <div class="panel-flash" />
          </div>
        </div>

        <div class="night-panel panel-3 opacity-0">
          <div class="panel-inner">
            <div class="panel-placeholder">
              <div class="panel-atmosphere panel-atmo--mist" />
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
  background: radial-gradient(ellipse at center, #1a0a2a 0%, #120520 40%, var(--void) 80%);
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
    transparent 20%,
    rgba(255, 23, 68, 0.08) 50%,
    rgba(255, 23, 68, 0.18) 75%,
    rgba(255, 23, 68, 0.12) 100%
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
  background: linear-gradient(to bottom, transparent 20%, var(--neon-red) 50%, transparent 80%);
  transform-origin: center;
  opacity: 0.3;
  filter: blur(1px);
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
  border: 2px solid rgba(255, 23, 68, 0.15);
  transition: border-color 0.4s ease, box-shadow 0.4s ease;
  box-shadow: 0 0 20px rgba(255, 23, 68, 0.03);
}

.panel-inner:hover {
  border-color: var(--neon-red);
}

.panel-placeholder {
  aspect-ratio: 3/4;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(15, 5, 25, 0.9) 0%, rgba(25, 8, 18, 0.95) 100%);
}

.panel-2 .panel-placeholder {
  aspect-ratio: 1/1;
}

/* Atmospheric fills for each panel */
.panel-atmosphere {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.panel-atmo--red {
  background: radial-gradient(
    ellipse at 70% 30%,
    rgba(255, 23, 68, 0.12) 0%,
    rgba(255, 23, 68, 0.04) 40%,
    transparent 70%
  );
}

.panel-atmo--slash {
  background:
    linear-gradient(150deg, transparent 35%, rgba(255, 23, 68, 0.08) 48%, rgba(255, 255, 255, 0.03) 50%, rgba(255, 23, 68, 0.08) 52%, transparent 65%),
    radial-gradient(ellipse at 50% 50%, rgba(255, 23, 68, 0.06) 0%, transparent 60%);
}

.panel-atmo--mist {
  background:
    linear-gradient(to top, rgba(0, 229, 255, 0.03) 0%, transparent 40%),
    radial-gradient(ellipse at 50% 80%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
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


/* Manga panel hover zoom — contained by overflow:hidden on panel-inner */
.panel-placeholder {
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.panel-inner:hover .panel-placeholder {
  transform: scale(1.05);
}

.panel-inner:hover .panel-atmosphere {
  opacity: 1.5;
  filter: brightness(1.3);
  transition: filter 0.5s ease;
}

.panel-inner:hover .panel-caption span,
.panel-inner:hover .panel-caption--bottom span {
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.6), 0 0 40px rgba(255, 255, 255, 0.3);
}

/* Red accent glow on panel border hover */
.panel-inner::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 1px solid transparent;
  transition: border-color 0.4s ease, box-shadow 0.4s ease;
  pointer-events: none;
  z-index: 6;
}

.panel-inner:hover::after {
  border-color: rgba(255, 23, 68, 0.3);
  box-shadow: inset 0 0 30px rgba(255, 23, 68, 0.05);
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
