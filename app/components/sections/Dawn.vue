<template>
  <section ref="sectionRef" class="dawn section section--fullscreen">
    <!-- Background color transition — void to warm navy -->
    <div ref="warmBg" class="dawn-warm-bg" />

    <!-- Warm gradient overlay that builds on scroll -->
    <div ref="warmGlow" class="dawn-glow" />

    <!-- Steam/mist particle layer -->
    <div class="dawn-steam">
      <div v-for="i in 6" :key="i" class="steam-wisp"
        :style="{
          left: `${10 + i * 15}%`,
          animationDelay: `${i * 1.5}s`,
          animationDuration: `${6 + i * 2}s`,
          width: `${80 + i * 30}px`,
          opacity: 0.03 + (i % 3) * 0.01,
        }" />
    </div>

    <!-- Horizon line -->
    <div ref="horizonRef" class="dawn-horizon" />

    <!-- God rays -->
    <div class="dawn-rays">
      <div v-for="i in 5" :key="i" class="dawn-ray" :style="{ left: `${15 + i * 15}%`, animationDelay: `${i * 0.8}s`, opacity: 0.02 + (i % 3) * 0.01 }" />
    </div>

    <div class="dawn-content">
      <!-- Chapter marker -->
      <span ref="chapterRef" class="font-body uppercase tracking-[0.3em] text-sm text-ash opacity-0">
        Chapter VI
      </span>

      <h2 ref="titleRef" class="font-display text-chapter tracking-display uppercase mt-4 leading-none opacity-0">
        <span class="dawn-title-text">DAWN</span>
      </h2>

      <!-- Image placeholder — the morning scene -->
      <div ref="imageRef" class="dawn-image mt-12 opacity-0">
        <div class="dawn-image-placeholder">
          <span class="text-smoke text-sm font-body">[ artwork: dawn — the ronin walks into morning light ]</span>
        </div>
        <!-- Light leak overlay on image -->
        <div class="dawn-light-leak" />
      </div>

      <!-- Closing text -->
      <div ref="closingRef" class="dawn-closing mt-12 opacity-0">
        <p class="font-serif text-[1.25rem] text-light leading-relaxed max-w-[45ch] mx-auto">
          The city exhales. Steam curls from a bowl set on a counter.
          The sword rests. For now.
        </p>
      </div>

      <!-- Separator with warm gradient -->
      <div ref="separatorRef" class="dawn-separator mt-12 opacity-0" />

      <!-- Credits / Footer -->
      <div ref="creditsRef" class="dawn-credits mt-12 opacity-0">
        <p class="font-display text-[2rem] tracking-display uppercase text-light">
          NEON RONIN
        </p>
        <p class="font-body text-ash text-sm mt-2">
          A scroll-driven anime experience
        </p>

        <div class="credits-divider mt-8" />

        <p class="font-body text-smoke text-xs mt-6 uppercase tracking-[0.15em]">
          Built by Brian Lapinski
        </p>
        <p class="font-body text-smoke text-xs mt-2">
          Nuxt 4 &middot; Three.js &middot; GSAP &middot; Lenis
        </p>

        <!-- Back to top -->
        <button ref="topBtn" data-cursor class="back-to-top mt-10 opacity-0" @click="scrollToTop">
          <span class="top-arrow" />
          <span class="font-body text-smoke text-xs uppercase tracking-[0.2em] mt-2 block">Back to Top</span>
        </button>
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
const warmBg = ref<HTMLElement | null>(null)
const warmGlow = ref<HTMLElement | null>(null)
const horizonRef = ref<HTMLElement | null>(null)
const separatorRef = ref<HTMLElement | null>(null)
const topBtn = ref<HTMLElement | null>(null)

const { createTimeline, gsap } = useScrollAnimation()

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  if (!sectionRef.value) return

  // Background warms from cold void to navy/warm tint
  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 90%',
      end: 'center center',
      scrub: 1,
    },
  }).to(warmBg.value, {
    opacity: 1,
    duration: 1,
  })

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

  // Horizon line expands
  gsap.set(horizonRef.value, { scaleX: 0, opacity: 0 })
  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 60%',
      end: 'top 20%',
      scrub: 1,
    },
  }).to(horizonRef.value, {
    scaleX: 1,
    opacity: 1,
    duration: 1,
    ease: 'power2.inOut',
  })

  // Content entrance
  gsap.set(imageRef.value, { y: 40, scale: 0.98 })
  gsap.set(separatorRef.value, { scaleX: 0 })

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
        duration: 1.2,
        ease: 'power2.out',
      },
      '-=0.4'
    )
    .to(
      imageRef.value,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out',
      },
      '-=0.6'
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
      separatorRef.value,
      {
        opacity: 1,
        scaleX: 1,
        duration: 0.8,
        ease: 'power2.inOut',
      },
      '-=0.3'
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
    .to(
      topBtn.value,
      {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.4'
    )
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
  overflow: hidden;
}

.dawn-warm-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(30, 20, 40, 0.8) 0%,
    rgba(40, 25, 20, 0.6) 40%,
    rgba(50, 30, 15, 0.4) 70%,
    rgba(60, 35, 10, 0.3) 100%
  );
  opacity: 0;
  pointer-events: none;
}

.dawn-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 20%,
    rgba(255, 215, 64, 0.1) 0%,
    rgba(255, 180, 50, 0.05) 30%,
    rgba(255, 140, 40, 0.02) 50%,
    transparent 70%
  );
  opacity: 0;
  pointer-events: none;
}

/* Steam wisps */
.dawn-steam {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.steam-wisp {
  position: absolute;
  bottom: 20%;
  height: 200px;
  background: radial-gradient(ellipse at center, rgba(255, 215, 64, 0.06) 0%, transparent 70%);
  border-radius: 50%;
  animation: steam-rise linear infinite;
  filter: blur(30px);
}

@keyframes steam-rise {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  20% { opacity: 0.04; }
  80% { opacity: 0.02; }
  100% { transform: translateY(-40vh) scale(1.5); opacity: 0; }
}

/* Horizon line */
.dawn-horizon {
  position: absolute;
  top: 35%;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(255, 215, 64, 0.15), rgba(255, 180, 50, 0.1), transparent);
  transform-origin: center;
  z-index: 1;
}

/* God rays */
.dawn-rays {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.dawn-ray {
  position: absolute;
  top: -20%;
  width: 2px;
  height: 140%;
  background: linear-gradient(to bottom, rgba(255, 215, 64, 0.08), rgba(255, 180, 50, 0.02), transparent);
  transform: rotate(5deg);
  animation: ray-sway 8s ease-in-out infinite alternate;
  filter: blur(8px);
}

.dawn-ray:nth-child(2n) {
  transform: rotate(-3deg);
  width: 3px;
  filter: blur(12px);
}

.dawn-ray:nth-child(3n) {
  transform: rotate(8deg);
  filter: blur(6px);
}

@keyframes ray-sway {
  0% { transform: rotate(3deg) translateX(0); }
  100% { transform: rotate(-3deg) translateX(20px); }
}

.dawn-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  width: 100%;
}

/* Title with warm glow */
@keyframes dawn-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.dawn-title-text {
  color: var(--neon-amber);
  text-shadow: 0 0 40px rgba(255, 215, 64, 0.3), 0 0 80px rgba(255, 215, 64, 0.1);
  animation: dawn-float 5s ease-in-out infinite;
  display: inline-block;
}

.dawn-image {
  position: relative;
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

/* Light leak on image */
.dawn-light-leak {
  position: absolute;
  top: 0;
  right: -10%;
  width: 40%;
  height: 100%;
  background: linear-gradient(to left, rgba(255, 215, 64, 0.08), transparent);
  pointer-events: none;
  border-radius: 4px;
}

.dawn-closing {
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Separator */
.dawn-separator {
  width: 200px;
  height: 1px;
  margin: 0 auto;
  background: linear-gradient(to right, transparent, var(--neon-amber), transparent);
  transform-origin: center;
}

.dawn-credits {
  padding-top: 1rem;
}

.credits-divider {
  width: 40px;
  height: 1px;
  background: var(--smoke);
  margin: 0 auto;
  opacity: 0.3;
}

/* Back to top button */
.back-to-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  cursor: none;
  padding: 1rem;
  transition: opacity 0.3s ease;
}

.back-to-top:hover {
  opacity: 1 !important;
}

.back-to-top:hover .top-arrow {
  border-color: var(--neon-amber);
  transform: translateY(-4px) rotate(-135deg);
}

.top-arrow {
  display: block;
  width: 12px;
  height: 12px;
  border-top: 1px solid var(--smoke);
  border-left: 1px solid var(--smoke);
  transform: rotate(-135deg);
  transition: transform 0.3s ease, border-color 0.3s ease;
}

@media (max-width: 768px) {
  .dawn {
    padding: 4rem 1.5rem;
  }

  .dawn-steam {
    display: none;
  }
}
</style>
