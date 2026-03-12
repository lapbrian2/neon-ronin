<template>
  <section ref="sectionRef" class="the-past section section--fullscreen ink-wash">
    <!-- Aged paper overlay that intensifies on scroll -->
    <div ref="agedOverlay" class="aged-paper-overlay" />

    <!-- Paper texture with grain -->
    <div class="ink-texture" />
    <div class="paper-grain" />

    <!-- Floating dust motes -->
    <div class="dust-motes">
      <div v-for="i in 12" :key="i" class="dust-mote"
        :style="{
          left: (5 + (i * 8) % 90) + '%',
          top: (10 + (i * 13) % 80) + '%',
          animationDelay: (i * 1.2) + 's',
          animationDuration: (8 + (i % 4) * 3) + 's',
          width: (2 + (i % 3)) + 'px',
          height: (2 + (i % 3)) + 'px',
          opacity: 0.08 + (i % 4) * 0.03,
        }" />
    </div>

    <!-- Brush stroke decorations -->
    <div class="brush-stroke brush-stroke--top" />
    <div class="brush-stroke brush-stroke--bottom" />

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

      <!-- Ink splatter accent -->
      <div ref="splatRef" class="ink-splatter opacity-0" />

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

      <!-- Horizontal divider with ink bleed -->
      <div ref="inkDivider" class="ink-divider mt-8 opacity-0" />

      <!-- Second memory verse -->
      <div ref="verse2Ref" class="past-verse2 mt-8">
        <p class="font-serif text-[1.1rem] text-ink-gray leading-loose opacity-0 poem-line-2">
          That life ended.
        </p>
        <p class="font-serif text-[1.1rem] text-ink-gray leading-loose opacity-0 poem-line-2">
          Not with a battle — but with a letter,
        </p>
        <p class="font-serif text-[1.1rem] text-ink-gray leading-loose opacity-0 poem-line-2">
          left unread on a wooden floor.
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
    <div class="ink-drip ink-drip--center" />
  </section>
</template>

<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
const chapterRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const poemRef = ref<HTMLElement | null>(null)
const verse2Ref = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)
const splatRef = ref<HTMLElement | null>(null)
const inkDivider = ref<HTMLElement | null>(null)
const agedOverlay = ref<HTMLElement | null>(null)

const { createTimeline, gsap } = useScrollAnimation()

onMounted(() => {
  if (!sectionRef.value) return

  // Aged paper darkens as you scroll deeper
  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 50%',
      end: 'bottom 50%',
      scrub: 1,
    },
  }).fromTo(agedOverlay.value,
    { opacity: 0 },
    { opacity: 0.3, ease: 'none' }
  )

  // Chapter + title reveal
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
    .to(
      splatRef.value,
      {
        opacity: 0.15,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
      },
      '-=0.3'
    )

  gsap.set(splatRef.value, { scale: 0.5 })

  // Poem lines stagger — first verse (brush-stroke clip-path reveal)
  const poemLines = poemRef.value?.querySelectorAll('.poem-line')
  if (poemLines) {
    gsap.set(poemLines, { clipPath: 'inset(0 100% 0 0)' })
    createTimeline({
      scrollTrigger: {
        trigger: poemRef.value,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    }).to(poemLines, {
      opacity: 1,
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.2,
      stagger: 0.5,
      ease: 'power2.out',
    })
  }

  // Ink divider wipe
  gsap.set(inkDivider.value, { scaleX: 0 })
  createTimeline({
    scrollTrigger: {
      trigger: inkDivider.value,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  }).to(inkDivider.value, {
    opacity: 1,
    scaleX: 1,
    duration: 1,
    ease: 'power2.inOut',
  })

  // Second verse stagger (brush-stroke clip-path reveal)
  const verse2Lines = verse2Ref.value?.querySelectorAll('.poem-line-2')
  if (verse2Lines) {
    gsap.set(verse2Lines, { clipPath: 'inset(0 100% 0 0)' })
    createTimeline({
      scrollTrigger: {
        trigger: verse2Ref.value,
        start: 'top 78%',
        toggleActions: 'play none none none',
      },
    }).to(verse2Lines, {
      opacity: 1,
      clipPath: 'inset(0 0% 0 0)',
      duration: 1,
      stagger: 0.4,
      ease: 'power2.out',
    })
  }

  // Image frame reveal with ink-bleed clip-path
  gsap.set(imageRef.value, {
    clipPath: 'inset(50% 50% 50% 50%)',
  })
  createTimeline({
    scrollTrigger: {
      trigger: imageRef.value,
      start: 'top 80%',
      end: 'top 40%',
      scrub: 1,
    },
  }).to(imageRef.value, {
    opacity: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    duration: 1.2,
    ease: 'power4.inOut',
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
  padding: 6rem 2rem;
}

.aged-paper-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 30%,
    rgba(139, 100, 50, 0.08) 0%,
    rgba(100, 70, 30, 0.05) 40%,
    rgba(60, 40, 20, 0.03) 70%,
    transparent 100%
  );
  pointer-events: none;
  opacity: 0;
  z-index: 1;
}

.ink-texture {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(ellipse at 20% 50%, rgba(26, 24, 20, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 30%, rgba(26, 24, 20, 0.08) 0%, transparent 40%),
    radial-gradient(ellipse at 50% 80%, rgba(26, 24, 20, 0.03) 0%, transparent 60%);
  pointer-events: none;
}

/* Paper grain texture */
.paper-grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  opacity: 0.5;
}

/* Brush stroke decorations */
.brush-stroke {
  position: absolute;
  width: 300px;
  height: 8px;
  background: linear-gradient(to right,
    transparent,
    rgba(26, 24, 20, 0.06) 15%,
    rgba(26, 24, 20, 0.12) 40%,
    rgba(26, 24, 20, 0.08) 70%,
    transparent
  );
  pointer-events: none;
  border-radius: 50%;
}

.brush-stroke--top {
  top: 12%;
  left: 5%;
  transform: rotate(-3deg);
}

.brush-stroke--bottom {
  bottom: 15%;
  right: 8%;
  transform: rotate(2deg);
  width: 200px;
}

.past-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 2rem;
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

/* Ink splatter accent */
.ink-splatter {
  position: absolute;
  top: -1rem;
  right: -2rem;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(ellipse at 40% 40%,
    rgba(26, 24, 20, 0.2) 0%,
    rgba(26, 24, 20, 0.1) 30%,
    transparent 70%
  );
  pointer-events: none;
}

.past-poem,
.past-verse2 {
  position: relative;
}

/* Ink divider */
.ink-divider {
  width: 180px;
  height: 2px;
  margin: 0 auto;
  background: linear-gradient(to right,
    transparent,
    var(--ink-gray) 20%,
    var(--ink-black) 50%,
    var(--ink-gray) 80%,
    transparent
  );
  transform-origin: center;
  opacity: 0.3;
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

.ink-drip--center {
  left: 55%;
  top: 3%;
  height: 25%;
  opacity: 0.06;
  width: 2px;
}

/* Floating dust motes */
.dust-motes {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.dust-mote {
  position: absolute;
  background: var(--ink-gray);
  border-radius: 50%;
  animation: dust-float linear infinite;
}

@keyframes dust-float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(15px, -20px) scale(1.2); }
  50% { transform: translate(-10px, -10px) scale(0.8); }
  75% { transform: translate(20px, 15px) scale(1.1); }
}

@media (max-width: 768px) {
  .past-vertical-text {
    display: none;
  }

  .brush-stroke {
    display: none;
  }
}
</style>
