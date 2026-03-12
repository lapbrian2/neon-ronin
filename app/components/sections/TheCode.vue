<template>
  <section ref="sectionRef" class="the-code section">
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
            NO MASTER
          </h2>
        </div>

        <div ref="line2" class="code-line opacity-0">
          <h2 class="font-display text-[clamp(3rem,8vw,8rem)] tracking-display uppercase leading-none">
            <span class="neon-red">NO CHAINS</span>
          </h2>
        </div>

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

const { createTimeline, gsap } = useScrollAnimation()

onMounted(() => {
  if (!sectionRef.value || !pinRef.value) return

  // Set initial states
  gsap.set([line1.value, line2.value], { y: 60, scale: 0.9 })
  gsap.set([line3.value, line4.value], { y: 40, scale: 0.95 })
  gsap.set(line5.value, { y: 30 })
  gsap.set(accentLine.value, { scaleX: 0 })

  // Pinned scroll-driven timeline
  const tl = createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top',
      end: '+=150%',
      pin: pinRef.value,
      scrub: 1,
      anticipatePin: 1,
    },
  })

  // Sequence — each line appears and settles
  tl.to(chapterRef.value, {
    opacity: 1,
    duration: 0.5,
  })
    .to(
      line1.value,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
      },
      0.3
    )
    .to(
      line2.value,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
      },
      0.8
    )
    .to(
      line3.value,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
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
        duration: 0.8,
        ease: 'power2.out',
      },
      1.8
    )
    .to(
      accentLine.value,
      {
        scaleX: 1,
        duration: 0.6,
        ease: 'power2.inOut',
      },
      2.2
    )
    .to(
      line5.value,
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
      },
      2.5
    )
})
</script>

<style scoped>
.the-code {
  background-color: var(--void);
  position: relative;
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

.code-accent-line {
  width: 200px;
  height: 2px;
  background: linear-gradient(to right, transparent, var(--neon-red), transparent);
  margin: 1rem auto;
  transform-origin: center;
}

@media (max-width: 768px) {
  .code-text-container {
    padding: 0 1rem;
  }
}
</style>
