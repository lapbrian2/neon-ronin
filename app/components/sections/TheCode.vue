<template>
  <section ref="sectionRef" class="the-code section">
    <!-- Impact flash overlay -->
    <div ref="flashRef" class="code-flash" />

    <!-- Pinned container for kinetic text -->
    <div ref="pinRef" class="code-pin">
      <!-- Chapter marker -->
      <span ref="chapterRef" class="code-chapter font-body text-ash uppercase tracking-[0.3em] text-sm opacity-0">
        Chapter IV
      </span>

      <!-- Kinetic text lines — each appears and transforms on scroll -->
      <div class="code-text-container">
        <div ref="line1" class="code-line opacity-0">
          <h2 class="font-display text-[clamp(3rem,8vw,8rem)] tracking-display uppercase text-light leading-none">
            <span class="char-split" v-for="(char, i) in 'NO MASTER'.split('')" :key="'l1-'+i"
              :style="{ animationDelay: `${i * 0.03}s` }">{{ char === ' ' ? '\u00A0' : char }}</span>
          </h2>
        </div>

        <div ref="line2" class="code-line opacity-0">
          <h2 class="font-display text-[clamp(3rem,8vw,8rem)] tracking-display uppercase leading-none">
            <span class="char-split neon-red" v-for="(char, i) in 'NO CHAINS'.split('')" :key="'l2-'+i"
              :style="{ animationDelay: `${i * 0.03}s` }">{{ char === ' ' ? '\u00A0' : char }}</span>
          </h2>
        </div>

        <!-- Impact divider -->
        <div ref="impactLine" class="code-impact-line" />

        <div ref="line3" class="code-line opacity-0">
          <h2 class="font-display text-[clamp(2rem,5vw,5rem)] tracking-display uppercase text-ash leading-none">
            ONLY THE BLADE
          </h2>
        </div>

        <div ref="line4" class="code-line opacity-0">
          <h2 class="font-display text-[clamp(2rem,5vw,5rem)] tracking-display uppercase text-ash leading-none">
            AND THE PATH
          </h2>
        </div>

        <!-- Accent line -->
        <div ref="accentLine" class="code-accent-line" />

        <div ref="line5" class="code-line opacity-0 mt-8">
          <p class="font-serif text-[1.25rem] text-ash italic max-w-[40ch] mx-auto">
            A ronin does not seek purpose. He walks until purpose finds him.
          </p>
        </div>
      </div>

      <!-- Corner marks -->
      <div class="code-corner code-corner--tl" />
      <div class="code-corner code-corner--tr" />
      <div class="code-corner code-corner--bl" />
      <div class="code-corner code-corner--br" />
    </div>
  </section>
</template>

<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
const pinRef = ref<HTMLElement | null>(null)
const chapterRef = ref<HTMLElement | null>(null)
const line1 = ref<HTMLElement | null>(null)
const line2 = ref<HTMLElement | null>(null)
const line3 = ref<HTMLElement | null>(null)
const line4 = ref<HTMLElement | null>(null)
const line5 = ref<HTMLElement | null>(null)
const accentLine = ref<HTMLElement | null>(null)
const impactLine = ref<HTMLElement | null>(null)
const flashRef = ref<HTMLElement | null>(null)

const { createTimeline, gsap } = useScrollAnimation()

onMounted(() => {
  if (!sectionRef.value || !pinRef.value) return

  // Set initial states
  gsap.set([line1.value, line2.value], { y: 60, scale: 0.9 })
  gsap.set([line3.value, line4.value], { y: 40, scale: 0.95 })
  gsap.set(line5.value, { y: 30 })
  gsap.set(accentLine.value, { scaleX: 0 })
  gsap.set(impactLine.value, { scaleX: 0 })

  // Pinned scroll-driven timeline
  const tl = createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top',
      end: '+=200%',
      pin: pinRef.value,
      scrub: 1,
      anticipatePin: 1,
    },
  })

  // Sequence — each line appears and settles
  tl.to(chapterRef.value, {
    opacity: 1,
    duration: 0.3,
  })
    .to(
      line1.value,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
      },
      0.2
    )
    .to(
      line2.value,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
      },
      0.6
    )
    // Impact flash on "NO CHAINS" landing
    .to(
      flashRef.value,
      {
        opacity: 0.15,
        duration: 0.1,
      },
      0.9
    )
    .to(
      flashRef.value,
      {
        opacity: 0,
        duration: 0.3,
      },
      1.0
    )
    // Screen shake via pin container
    .to(
      pinRef.value,
      {
        x: -4,
        duration: 0.05,
      },
      0.9
    )
    .to(
      pinRef.value,
      {
        x: 4,
        duration: 0.05,
      },
      0.95
    )
    .to(
      pinRef.value,
      {
        x: -2,
        duration: 0.05,
      },
      1.0
    )
    .to(
      pinRef.value,
      {
        x: 0,
        duration: 0.1,
      },
      1.05
    )
    // Impact divider expands
    .to(
      impactLine.value,
      {
        scaleX: 1,
        duration: 0.4,
        ease: 'power2.out',
      },
      1.1
    )
    .to(
      line3.value,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
      },
      1.4
    )
    .to(
      line4.value,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
      },
      1.7
    )
    .to(
      accentLine.value,
      {
        scaleX: 1,
        duration: 0.5,
        ease: 'power2.inOut',
      },
      2.0
    )
    .to(
      line5.value,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
      2.3
    )
})
</script>

<style scoped>
.the-code {
  background-color: var(--void);
  position: relative;
}

/* Impact flash */
.code-flash {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(255, 23, 68, 0.2) 0%, transparent 70%);
  opacity: 0;
  z-index: 0;
  pointer-events: none;
}

.code-pin {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.code-chapter {
  position: absolute;
  top: 3rem;
  left: 50%;
  transform: translateX(-50%);
}

.code-text-container {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.code-line {
  will-change: transform, opacity;
}

/* Per-character styling */
.char-split {
  display: inline-block;
  will-change: transform;
  transition: transform 0.2s ease, color 0.2s ease;
}

.code-line:hover .char-split {
  animation: char-wave 0.4s ease forwards;
}

@keyframes char-wave {
  0% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
  100% { transform: translateY(0); }
}

/* Impact divider */
.code-impact-line {
  width: 80%;
  max-width: 600px;
  height: 3px;
  background: linear-gradient(to right, transparent, var(--neon-red), transparent);
  margin: 0.75rem auto;
  transform-origin: center;
  box-shadow: 0 0 20px var(--neon-red), 0 0 40px rgba(255, 23, 68, 0.3);
}

.code-accent-line {
  width: 200px;
  height: 2px;
  background: linear-gradient(to right, transparent, var(--neon-red), transparent);
  margin: 1rem auto;
  transform-origin: center;
}

/* Corner marks */
.code-corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border-color: var(--smoke);
  opacity: 0.15;
}

.code-corner--tl {
  top: 2rem;
  left: 2rem;
  border-top: 1px solid;
  border-left: 1px solid;
}

.code-corner--tr {
  top: 2rem;
  right: 2rem;
  border-top: 1px solid;
  border-right: 1px solid;
}

.code-corner--bl {
  bottom: 2rem;
  left: 2rem;
  border-bottom: 1px solid;
  border-left: 1px solid;
}

.code-corner--br {
  bottom: 2rem;
  right: 2rem;
  border-bottom: 1px solid;
  border-right: 1px solid;
}

@media (max-width: 768px) {
  .code-text-container {
    padding: 0 1rem;
  }

  .code-corner {
    display: none;
  }
}
</style>
