<template>
  <section ref="sectionRef" class="the-past section section--fullscreen ink-wash">
    <!-- Ink wash background texture -->
    <div class="ink-texture" />

    <div class="past-content">
      <!-- Chapter marker -->
      <span ref="chapterRef" class="font-body uppercase tracking-[0.3em] text-sm text-ink-gray opacity-0">
        Chapter III
      </span>

      <!-- Main text — traditional feel -->
      <h2 ref="titleRef" class="font-serif text-chapter text-ink-black mt-6 leading-tight">
        The Past
      </h2>

      <!-- Vertical Japanese-style text accent -->
      <div class="past-vertical-text">
        <span class="font-serif text-ink-gray text-sm">&#27494;&#22763;&#36947;</span>
      </div>

      <!-- Poem/memory block -->
      <div ref="poemRef" class="past-poem mt-12">
        <p class="font-serif text-[1.25rem] text-ink-black leading-loose opacity-0 poem-line">
          Before the neon —
        </p>
        <p class="font-serif text-[1.25rem] text-ink-black leading-loose opacity-0 poem-line">
          there was silence, and a sword,
        </p>
        <p class="font-serif text-[1.25rem] text-ink-black leading-loose opacity-0 poem-line">
          and someone worth protecting.
        </p>
      </div>

      <!-- Ink wash image placeholder -->
      <div ref="imageRef" class="past-image-frame mt-12 opacity-0">
        <div class="past-image-placeholder">
          <span class="text-ink-gray text-sm font-body">[ artwork: ink wash memory ]</span>
        </div>
        <!-- Hanko stamp -->
        <div class="hanko">
          <span class="font-serif text-ink-red text-xs">&#21360;</span>
        </div>
      </div>
    </div>

    <!-- Ink drip decoration -->
    <div class="ink-drip ink-drip--left" />
    <div class="ink-drip ink-drip--right" />
  </section>
</template>

<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
const chapterRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const poemRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)

const { createTimeline, gsap } = useScrollAnimation()

onMounted(() => {
  if (!sectionRef.value) return

  // Chapter reveal
  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 70%',
      end: 'top 30%',
      toggleActions: 'play none none none',
    },
  })
    .to(chapterRef.value, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
    })
    .from(
      titleRef.value,
      {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power2.out',
      },
      '-=0.4'
    )

  // Poem lines stagger
  const poemLines = poemRef.value?.querySelectorAll('.poem-line')
  if (poemLines) {
    createTimeline({
      scrollTrigger: {
        trigger: poemRef.value,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    }).to(poemLines, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.4,
      ease: 'power2.out',
    })

    // Set initial state
    gsap.set(poemLines, { y: 20 })
  }

  // Image frame reveal with clip-path
  createTimeline({
    scrollTrigger: {
      trigger: imageRef.value,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  }).to(imageRef.value, {
    opacity: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    duration: 1.2,
    ease: 'power4.inOut',
  })

  gsap.set(imageRef.value, {
    clipPath: 'inset(100% 0% 0% 0%)',
  })
})
</script>

<style scoped>
.the-past {
  position: relative;
  min-height: 100vh;
  background-color: var(--ink-paper);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.ink-texture {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(ellipse at 20% 50%, rgba(26, 24, 20, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 30%, rgba(26, 24, 20, 0.08) 0%, transparent 40%);
  pointer-events: none;
}

.past-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 4rem 2rem;
  max-width: 700px;
}

.past-vertical-text {
  position: absolute;
  right: -3rem;
  top: 50%;
  transform: translateY(-50%);
  writing-mode: vertical-rl;
  letter-spacing: 0.5em;
  opacity: 0.15;
}

.past-poem {
  position: relative;
}

.past-image-frame {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.past-image-placeholder {
  aspect-ratio: 4/3;
  border: 1px solid var(--ink-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(26, 24, 20, 0.03);
}

/* Hanko stamp */
.hanko {
  position: absolute;
  bottom: -0.5rem;
  right: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  border: 2px solid var(--ink-red);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  transform: rotate(-5deg);
}

/* Ink drips */
.ink-drip {
  position: absolute;
  width: 3px;
  background: linear-gradient(to bottom, var(--ink-gray), transparent);
  opacity: 0.1;
}

.ink-drip--left {
  left: 15%;
  top: 5%;
  height: 40%;
}

.ink-drip--right {
  right: 20%;
  top: 10%;
  height: 30%;
}

@media (max-width: 768px) {
  .past-vertical-text {
    display: none;
  }
}
</style>
