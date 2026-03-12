<template>
  <section ref="sectionRef" class="dawn section section--fullscreen">
    <!-- Warm gradient overlay that builds on scroll -->
    <div ref="warmGlow" class="dawn-glow" />

    <div class="dawn-content">
      <!-- Chapter marker -->
      <span ref="chapterRef" class="font-body uppercase tracking-[0.3em] text-sm text-ash opacity-0">
        Chapter VI
      </span>

      <h2 ref="titleRef" class="font-display text-chapter tracking-display uppercase mt-4 leading-none opacity-0">
        <span class="neon-amber">DAWN</span>
      </h2>

      <!-- Image placeholder — the morning scene -->
      <div ref="imageRef" class="dawn-image mt-12 opacity-0">
        <div class="dawn-image-placeholder">
          <span class="text-smoke text-sm font-body">[ artwork: dawn — the ronin walks into morning light ]</span>
        </div>
      </div>

      <!-- Closing text -->
      <div ref="closingRef" class="dawn-closing mt-12 opacity-0">
        <p class="font-serif text-[1.25rem] text-light leading-relaxed max-w-[45ch] mx-auto">
          The city exhales. Steam curls from a bowl set on a counter.
          The sword rests. For now.
        </p>
      </div>

      <!-- Credits / Footer -->
      <div ref="creditsRef" class="dawn-credits mt-20 opacity-0">
        <div class="credits-line" />
        <p class="font-display text-[2rem] tracking-display uppercase text-light mt-6">
          NEON RONIN
        </p>
        <p class="font-body text-ash text-sm mt-2">
          A scroll-driven anime experience
        </p>
        <p class="font-body text-smoke text-xs mt-6">
          Built by Brian Lapinski
        </p>
        <p class="font-body text-smoke text-xs mt-1">
          Nuxt 4 &middot; Three.js &middot; GSAP &middot; Lenis
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
const chapterRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)
const closingRef = ref<HTMLElement | null>(null)
const creditsRef = ref<HTMLElement | null>(null)
const warmGlow = ref<HTMLElement | null>(null)

const { createTimeline, gsap } = useScrollAnimation()

onMounted(() => {
  if (!sectionRef.value) return

  // Warm glow builds on scroll — transition from dark to warm
  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1,
    },
  }).to(warmGlow.value, {
    opacity: 1,
    duration: 1,
  })

  // Content entrance
  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 50%',
      toggleActions: 'play none none none',
    },
  })
    .to(chapterRef.value, {
      opacity: 1,
      duration: 0.8,
    })
    .to(
      titleRef.value,
      {
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
      },
      '-=0.4'
    )
    .to(
      imageRef.value,
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
      },
      '-=0.4'
    )
    .to(
      closingRef.value,
      {
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
      },
      '-=0.4'
    )
    .to(
      creditsRef.value,
      {
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
      },
      '-=0.2'
    )

  gsap.set(imageRef.value, { y: 30 })
})
</script>

<style scoped>
.dawn {
  position: relative;
  min-height: 100vh;
  background-color: var(--void);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
}

.dawn-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 30%,
    rgba(255, 215, 64, 0.08) 0%,
    rgba(255, 215, 64, 0.03) 40%,
    transparent 70%
  );
  opacity: 0;
  pointer-events: none;
}

.dawn-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  width: 100%;
}

.dawn-image {
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.dawn-image-placeholder {
  aspect-ratio: 16/9;
  border: 1px dashed var(--smoke);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: rgba(26, 27, 58, 0.2);
}

.dawn-closing {
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.dawn-credits {
  padding-top: 2rem;
}

.credits-line {
  width: 60px;
  height: 1px;
  background: var(--smoke);
  margin: 0 auto;
}

@media (max-width: 768px) {
  .dawn {
    padding: 4rem 1.5rem;
  }
}
</style>
