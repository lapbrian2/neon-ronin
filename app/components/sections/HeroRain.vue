<template>
  <section ref="sectionRef" class="hero section section--fullscreen">
    <!-- Background mist gradient -->
    <div class="hero-mist" />

    <!-- Giant kanji background -->
    <div ref="kanjiRef" class="hero-kanji">侍</div>

    <!-- Ronin silhouette SVG -->
    <svg ref="roninRef" class="ronin-silhouette" viewBox="0 0 200 400">
      <path d="M100,20 Q95,60 90,100 Q85,140 80,180 L60,350 M100,20 Q105,60 110,100 Q115,140 120,180 L140,350 M80,100 L40,160 M120,100 L160,160 M90,80 L120,70 L180,60"
        stroke="var(--ink)" stroke-width="1.5" fill="none" stroke-linecap="round" />
    </svg>

    <div class="hero-content">
      <div ref="entranceRef" class="hero-entrance">
        <div class="hero-chapter">CHAPTER I — THE ARRIVAL</div>

        <h1 class="hero-title">
          NEON<br />
          <em>RONIN</em>
        </h1>

        <div class="hero-subtitle-row">
          <div class="hero-line" />
          <p class="hero-subtitle">
            A masterless blade in a city of electric ghosts.
          </p>
        </div>
      </div>

      <div ref="ctaRef" class="hero-cta">
        <a href="#origin" class="cta-link" data-cursor>
          Begin the journey
          <span class="cta-arrow">↓</span>
        </a>
      </div>
    </div>

    <!-- Bottom fade -->
    <div class="hero-bottom-fade" />
  </section>
</template>

<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
const kanjiRef = ref<HTMLElement | null>(null)
const roninRef = ref<HTMLElement | null>(null)
const entranceRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)

const { createTimeline, gsap } = useScrollAnimation()

onMounted(() => {
  if (!sectionRef.value) return

  // Entrance animation
  gsap.set(entranceRef.value, { opacity: 0, y: 40 })
  gsap.set(ctaRef.value, { opacity: 0, y: 20 })

  const entrance = createTimeline({ delay: 0.5 })
  entrance
    .to(entranceRef.value, {
      opacity: 1, y: 0,
      duration: 1.2,
      ease: 'power2.out',
    })
    .to(ctaRef.value, {
      opacity: 1, y: 0,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.4')

  // Kanji parallax on scroll
  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  }).to(kanjiRef.value, { y: 80, ease: 'none' })

  // Ronin parallax
  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  }).to(roninRef.value, { y: -50, ease: 'none' })

  // Content fade out on scroll
  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  }).to('.hero-content', { y: -100, opacity: 0, ease: 'none' })
})
</script>

<style scoped>
.hero {
  height: 100vh;
  background: var(--cream);
  position: relative;
  overflow: hidden;
}

.hero-mist {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 70% 40%, rgba(196, 160, 85, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse 60% 80% at 30% 60%, rgba(140, 26, 26, 0.04) 0%, transparent 60%),
    linear-gradient(180deg, var(--cream) 0%, var(--parchment) 100%);
  pointer-events: none;
}

.hero-kanji {
  position: absolute;
  right: -5%;
  top: 50%;
  transform: translateY(-50%);
  font-family: 'Noto Serif JP', serif;
  font-weight: 900;
  font-size: clamp(200px, 40vw, 500px);
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(10, 10, 15, 0.04);
  line-height: 1;
  pointer-events: none;
  user-select: none;
  will-change: transform;
}

.ronin-silhouette {
  position: absolute;
  right: 10%;
  bottom: 10%;
  width: clamp(200px, 25vw, 350px);
  height: auto;
  opacity: 0.06;
  will-change: transform;
}

.hero-content {
  position: relative;
  z-index: 10;
  padding: 0 48px;
  max-width: 800px;
}

.hero-chapter {
  font-size: 10px;
  letter-spacing: 8px;
  text-transform: uppercase;
  color: var(--warm-gray);
  margin-bottom: 24px;
}

.hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-size: clamp(48px, 8vw, 96px);
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
  color: var(--ink);
}

.hero-title em {
  font-weight: 700;
}

.hero-subtitle-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
  margin-bottom: 40px;
}

.hero-line {
  width: 60px;
  height: 1px;
  background: var(--blood-red);
  flex-shrink: 0;
}

.hero-subtitle {
  font-style: italic;
  font-weight: 300;
  font-size: clamp(14px, 1.8vw, 18px);
  color: var(--warm-gray);
  letter-spacing: 0.05em;
}

.hero-cta {
  margin-top: 0;
}

.cta-link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--ink);
  text-decoration: none;
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  padding: 14px 0;
  border-bottom: 1px solid var(--ink);
  transition: border-color 0.4s, color 0.4s;
}

.cta-link:hover {
  border-color: var(--blood-red);
  color: var(--blood-red);
}

.cta-arrow {
  font-size: 16px;
}

.hero-bottom-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(transparent, var(--cream));
  pointer-events: none;
}

@media (max-width: 768px) {
  .hero-content {
    padding: 0 24px;
  }
  .ronin-silhouette {
    opacity: 0.03;
    right: -5%;
  }
}
</style>
