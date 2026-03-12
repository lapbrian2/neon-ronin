<template>
  <section ref="sectionRef" class="hero-rain section section--fullscreen letterbox">
    <!-- Three.js rain canvas (client-only) -->
    <ClientOnly>
      <ThreeRainCanvas />
    </ClientOnly>

    <!-- Content overlay -->
    <div class="hero-content">
      <!-- Chapter marker -->
      <span ref="chapterRef" class="hero-chapter font-body text-ash uppercase tracking-[0.3em] text-sm opacity-0">
        Chapter I
      </span>

      <!-- Title -->
      <h1 ref="titleRef" class="hero-title font-display text-hero tracking-display uppercase leading-none">
        <span class="text-light">NEON</span>
        <br />
        <span class="neon-red neon-flicker">RONIN</span>
      </h1>

      <!-- Subtitle -->
      <p ref="subtitleRef" class="hero-subtitle font-body text-ash text-lg mt-6 opacity-0 max-w-[40ch]">
        A masterless blade in a city of electric ghosts.
      </p>

      <!-- Scroll indicator -->
      <div ref="scrollRef" class="hero-scroll opacity-0 mt-16">
        <div class="scroll-line" />
        <span class="font-body text-smoke text-xs uppercase tracking-[0.2em] mt-2 block">Scroll</span>
      </div>
    </div>

    <!-- Rain overlay gradient -->
    <div class="hero-gradient" />
  </section>
</template>

<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
const chapterRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)

const { createTimeline, gsap } = useScrollAnimation()

onMounted(() => {
  if (!sectionRef.value) return

  // Entrance timeline
  const entrance = createTimeline({
    delay: 0.5,
  })

  entrance
    .to(chapterRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    })
    .from(
      titleRef.value,
      {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      },
      '-=0.4'
    )
    .to(
      subtitleRef.value,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.6'
    )
    .to(
      scrollRef.value,
      {
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
      },
      '-=0.3'
    )

  // Scroll-driven fade out
  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  }).to('.hero-content', {
    y: -100,
    opacity: 0,
    ease: 'none',
  })
})
</script>

<style scoped>
.hero-rain {
  position: relative;
  height: 100vh;
  background-color: var(--void);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  position: relative;
  z-index: 5;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-chapter {
  transform: translateY(20px);
}

.hero-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30vh;
  background: linear-gradient(to top, var(--void), transparent);
  pointer-events: none;
  z-index: 4;
}

/* Scroll indicator */
.scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, var(--smoke), transparent);
  margin: 0 auto;
  animation: scroll-pulse 2s ease-in-out infinite;
}

@keyframes scroll-pulse {
  0%, 100% { opacity: 0.3; transform: scaleY(1); }
  50% { opacity: 1; transform: scaleY(1.3); }
}

/* Mobile */
@media (max-width: 768px) {
  .hero-title {
    font-size: clamp(3rem, 15vw, 5rem);
  }

  .letterbox::before,
  .letterbox::after {
    height: 4vh;
  }
}
</style>
