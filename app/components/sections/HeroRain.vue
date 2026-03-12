<template>
  <section ref="sectionRef" class="hero-rain section section--fullscreen">
    <!-- Three.js rain canvas (client-only) -->
    <ClientOnly>
      <ThreeRainCanvas />
    </ClientOnly>

    <!-- Scanlines overlay -->
    <div class="hero-scanlines" />

    <!-- Vignette overlay -->
    <div class="hero-vignette" />

    <!-- Ambient atmospheric glow -->
    <div ref="ambientGlow" class="hero-ambient-glow" />

    <!-- Content overlay -->
    <div class="hero-content">
      <!-- Chapter marker -->
      <span ref="chapterRef" class="hero-chapter font-body text-ash uppercase tracking-[0.3em] text-sm opacity-0">
        Chapter I
      </span>

      <!-- Title with glitch hover effect -->
      <h1 ref="titleRef" class="hero-title font-display text-hero tracking-display uppercase leading-none opacity-0">
        <span class="glitch-wrapper" data-cursor>
          <span class="glitch-text text-light" data-text="NEON">NEON</span>
        </span>
        <br />
        <span class="glitch-wrapper" data-cursor>
          <span class="glitch-text neon-red neon-flicker" data-text="RONIN">RONIN</span>
        </span>
      </h1>

      <!-- Subtitle -->
      <p ref="subtitleRef" class="hero-subtitle font-body text-ash text-lg mt-6 opacity-0 max-w-[40ch]">
        A masterless blade in a city of electric ghosts.
      </p>

      <!-- Decorative line -->
      <div ref="decoLineRef" class="hero-deco-line mt-8 opacity-0" />

      <!-- Scroll indicator (chevron style) -->
      <div ref="scrollRef" class="hero-scroll opacity-0 mt-10">
        <div class="scroll-chevrons">
          <span class="chevron" />
          <span class="chevron" />
          <span class="chevron" />
        </div>
        <span class="font-body text-smoke text-xs uppercase tracking-[0.2em] mt-3 block">Scroll</span>
      </div>
    </div>

    <!-- Animated letterbox bars -->
    <div ref="letterboxTop" class="letterbox-bar letterbox-bar--top" />
    <div ref="letterboxBottom" class="letterbox-bar letterbox-bar--bottom" />

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
const decoLineRef = ref<HTMLElement | null>(null)
const ambientGlow = ref<HTMLElement | null>(null)
const letterboxTop = ref<HTMLElement | null>(null)
const letterboxBottom = ref<HTMLElement | null>(null)

const { createTimeline, gsap } = useScrollAnimation()

onMounted(() => {
  if (!sectionRef.value) return

  // Set initial states
  gsap.set(titleRef.value, { y: 60, skewY: 3 })
  gsap.set(subtitleRef.value, { y: 20 })
  gsap.set(decoLineRef.value, { scaleX: 0 })

  // Ambient glow shifts on scroll — subtle color temperature change
  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  }).fromTo(ambientGlow.value, 
    { opacity: 0 },
    { opacity: 0.4, ease: 'none' }
  )

  // Entrance timeline — cinematic reveal
  const entrance = createTimeline({
    delay: 2.8, // wait for preloader
  })

  entrance
    .to(chapterRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    })
    .to(
      titleRef.value,
      {
        opacity: 1,
        y: 0,
        skewY: 0,
        duration: 1.4,
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
      decoLineRef.value,
      {
        opacity: 1,
        scaleX: 1,
        duration: 0.8,
        ease: 'power2.inOut',
      },
      '-=0.4'
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

  // Multi-layer parallax — each element moves at different speed
  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  }).to(chapterRef.value, {
    y: -80,
    ease: 'none',
  })

  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  }).to(subtitleRef.value, {
    y: -200,
    ease: 'none',
  })

  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  }).to(scrollRef.value, {
    y: -250,
    opacity: 0,
    ease: 'none',
  })

  // Letterbox bars shrink on scroll — cinematic opening
  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top',
      end: '60% top',
      scrub: 1,
    },
  }).to([letterboxTop.value, letterboxBottom.value], {
    height: 0,
    duration: 1,
    ease: 'power2.inOut',
  })

  // Scroll-driven fade out + parallax
  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  }).to('.hero-content', {
    y: -150,
    opacity: 0,
    scale: 0.95,
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

/* Scanlines overlay */
.hero-scanlines {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 2px,
    rgba(0, 0, 0, 0.15) 2px,
    rgba(0, 0, 0, 0.15) 4px
  );
  opacity: 0.4;
}

/* Vignette overlay */
.hero-vignette {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center,
    transparent 40%,
    rgba(0, 0, 0, 0.5) 80%,
    rgba(0, 0, 0, 0.8) 100%
  );
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

/* Glitch effect on hover */
.glitch-wrapper {
  position: relative;
  display: inline-block;
  cursor: none;
}

.glitch-text {
  position: relative;
}

.glitch-wrapper:hover .glitch-text::before,
.glitch-wrapper:hover .glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.glitch-wrapper:hover .glitch-text::before {
  color: var(--neon-cyan);
  clip-path: inset(0 0 60% 0);
  transform: translate(-3px, -2px);
  animation: glitch-shift 0.3s ease-in-out;
}

.glitch-wrapper:hover .glitch-text::after {
  color: var(--neon-violet);
  clip-path: inset(40% 0 0 0);
  transform: translate(3px, 2px);
  animation: glitch-shift-reverse 0.3s ease-in-out;
}

@keyframes glitch-shift {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-5px, -3px); }
  50% { transform: translate(3px, 1px); }
  75% { transform: translate(-2px, 2px); }
  100% { transform: translate(-3px, -2px); }
}

@keyframes glitch-shift-reverse {
  0% { transform: translate(0, 0); }
  25% { transform: translate(5px, 2px); }
  50% { transform: translate(-3px, -1px); }
  75% { transform: translate(2px, -2px); }
  100% { transform: translate(3px, 2px); }
}

/* Ambient atmospheric glow */
.hero-ambient-glow {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: radial-gradient(
    ellipse at 50% 100%,
    rgba(255, 23, 68, 0.08) 0%,
    rgba(170, 0, 255, 0.04) 30%,
    transparent 60%
  );
  opacity: 0;
}

/* Decorative line */
.hero-deco-line {
  width: 120px;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--neon-red), var(--neon-cyan), transparent);
  transform-origin: center;
}

/* Gradient bottom fade */
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

/* Scroll chevrons */
.scroll-chevrons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.chevron {
  display: block;
  width: 16px;
  height: 16px;
  border-right: 1px solid var(--smoke);
  border-bottom: 1px solid var(--smoke);
  transform: rotate(45deg);
  animation: chevron-pulse 2s ease-in-out infinite;
}

.chevron:nth-child(1) {
  animation-delay: 0s;
  opacity: 0.3;
}

.chevron:nth-child(2) {
  animation-delay: 0.15s;
  opacity: 0.6;
}

.chevron:nth-child(3) {
  animation-delay: 0.3s;
  opacity: 1;
}

@keyframes chevron-pulse {
  0%, 100% { opacity: 0.3; transform: rotate(45deg) translateY(0); }
  50% { opacity: 1; transform: rotate(45deg) translateY(4px); }
}

/* Breathing title glow */
@keyframes title-breathe {
  0%, 100% { text-shadow: 0 0 20px rgba(255,23,68,0.6), 0 0 60px rgba(255,23,68,0.2); }
  50% { text-shadow: 0 0 30px rgba(255,23,68,0.8), 0 0 80px rgba(255,23,68,0.4), 0 0 120px rgba(255,23,68,0.1); }
}

.glitch-text.neon-red.neon-flicker {
  animation: neon-flicker 4s ease-in-out infinite, title-breathe 6s ease-in-out infinite;
}

/* Mobile */

/* Animated letterbox bars */
.letterbox-bar {
  position: absolute;
  left: 0;
  right: 0;
  height: 8vh;
  background: black;
  z-index: 10;
  pointer-events: none;
  will-change: height;
}

.letterbox-bar--top { top: 0; }
.letterbox-bar--bottom { bottom: 0; }

@media (max-width: 768px) {
  .hero-title {
    font-size: clamp(3rem, 15vw, 5rem);
  }

  .hero-scanlines {
    opacity: 0.2;
  }
}
</style>
