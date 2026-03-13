<template>
  <section id="battles" ref="sectionRef" class="battles-section">
    <!-- Pinned header that stays while cards scroll -->
    <div class="battles-header-fixed">
      <div class="chapter-num">五</div>
      <div ref="headerRef" class="battles-header">
        <div class="section-subtitle">CHAPTER V — BATTLES WON</div>
        <h2 ref="titleRef" class="section-title">
          The clearing after the storm.
        </h2>
      </div>
    </div>

    <!-- Horizontal scroll track -->
    <div ref="trackWrapRef" class="battles-track-wrap">
      <div ref="trackRef" class="battles-track">
        <div v-for="(battle, i) in battles" :key="i" class="battle-panel">
          <div class="battle-card">
            <div class="battle-index">{{ String(i + 1).padStart(2, '0') }}</div>
            <div class="battle-divider" />
            <p class="battle-statement">{{ battle.statement }}</p>
            <div class="battle-tech">
              <span v-for="(tag, j) in battle.tech" :key="j" class="tech-tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="battles-progress">
      <div ref="progressRef" class="battles-progress-fill" />
    </div>

    <!-- Ink divider (inverted) -->
    <div class="ink-divider-wrap">
      <svg width="300" height="12" viewBox="0 0 300 12">
        <path d="M0,6 Q30,2 60,6 Q90,10 120,5 Q150,1 180,7 Q210,11 240,5 Q270,2 300,6"
          stroke="var(--cream)" stroke-width="1.5" fill="none" opacity="0.15" stroke-linecap="round" />
        <circle cx="150" cy="6" r="3" fill="var(--blood-red)" opacity="0.6" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const trackWrapRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)

const { createTimeline, gsap, splitTextReveal, ScrollTrigger } = useScrollAnimation()

const battles = [
  {
    statement: 'Built virtual galleries where art breathes and walls dissolve as the viewer scrolls through space.',
    tech: ['Three.js', 'WebGL', 'GSAP ScrollTrigger'],
  },
  {
    statement: 'Engineered particle simulations where thousands of autonomous agents flock, scatter, and self-organize into living digital art.',
    tech: ['Canvas 2D', 'Emergent Algorithms', 'Real-time Rendering'],
  },
  {
    statement: 'Trained autonomous agents to sweep the frontier — discovering breakthrough papers, emerging architectures, and practices that matter.',
    tech: ['Node.js', 'Notion API', 'LLM Pipelines'],
  },
  {
    statement: 'Crafted scroll-driven narratives where environment tells the story. The user moves through atmosphere, not past content.',
    tech: ['Nuxt', 'Lenis', 'GSAP', 'CSS Architecture'],
  },
]

onMounted(() => {
  if (!sectionRef.value || !trackRef.value || !trackWrapRef.value) return

  // Character-level title reveal
  if (titleRef.value) {
    splitTextReveal(titleRef.value, { trigger: sectionRef.value, start: 'top 75%' })
  }

  // Animate subtitle in
  const subtitleEl = headerRef.value?.querySelector('.section-subtitle')
  if (subtitleEl) {
    gsap.set(subtitleEl, { opacity: 0, y: 30 })
    createTimeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    }).to(subtitleEl, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
  }

  // Calculate horizontal scroll distance
  const totalWidth = trackRef.value.scrollWidth
  const viewportWidth = trackWrapRef.value.offsetWidth
  const scrollDistance = totalWidth - viewportWidth

  // Set initial state for battle cards — stagger reveal
  const cards = trackRef.value.querySelectorAll('.battle-card')
  cards.forEach((card) => {
    gsap.set(card, { opacity: 0, y: 40 })
  })

  // Horizontal scroll: pin + scrub
  const horizontalTl = createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top',
      end: () => '+=' + scrollDistance,
      pin: true,
      scrub: 0.8,
      invalidateOnRefresh: true,
    },
  })

  horizontalTl.to(trackRef.value, {
    x: -scrollDistance,
    ease: 'none',
  })

  // Progress bar matches scroll
  horizontalTl.to(progressRef.value, {
    scaleX: 1,
    ease: 'none',
  }, 0)

  // Reveal cards based on scroll progress
  const revealedCards = new Set<number>()
  ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top top',
    end: () => '+=' + scrollDistance,
    onUpdate: (self) => {
      const progress = self.progress
      cards.forEach((card, i) => {
        // Each card reveals when its portion of the scroll begins
        const threshold = (i * 0.8) / cards.length
        if (progress >= threshold && !revealedCards.has(i)) {
          revealedCards.add(i)
          gsap.to(card, {
            opacity: 1, y: 0,
            duration: 0.8, ease: 'power3.out',
          })
        }
      })
    },
  })
})
</script>

<style scoped>
.battles-section {
  position: relative;
  background: var(--ink);
  color: var(--cream);
  overflow: hidden;
}

.battles-header-fixed {
  padding: 100px 48px 0;
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
}

/* Override global chapter-num for dark bg */
.chapter-num {
  -webkit-text-stroke-color: rgba(242, 235, 224, 0.04) !important;
}

.section-subtitle {
  color: var(--gold) !important;
}

.section-title {
  color: var(--cream) !important;
}

/* Horizontal track */
.battles-track-wrap {
  overflow: visible;
  padding-top: 60px;
  padding-bottom: 100px;
}

.battles-track {
  display: flex;
  gap: 0;
  will-change: transform;
}

.battle-panel {
  flex-shrink: 0;
  width: 60vw;
  max-width: 580px;
  min-width: 300px;
  padding: 0 24px;
  display: flex;
  align-items: flex-start;
}

.battle-panel:first-child {
  margin-left: 48px;
}

.battle-panel:last-child {
  padding-right: 15vw;
}

.battle-card {
  position: relative;
  padding: 48px;
  border: 1px solid rgba(242, 235, 224, 0.06);
  border-radius: 2px;
  width: 100%;
  transition: border-color 0.5s;
  will-change: opacity, transform;
}

.battle-card:hover {
  border-color: rgba(140, 26, 26, 0.3);
}

.battle-index {
  font-size: 11px;
  letter-spacing: 4px;
  color: var(--blood-red);
  font-weight: 600;
  margin-bottom: 20px;
}

.battle-divider {
  width: 32px;
  height: 1px;
  background: var(--blood-red);
  opacity: 0.5;
  margin-bottom: 28px;
}

.battle-statement {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-size: clamp(18px, 2.2vw, 26px);
  line-height: 1.6;
  color: var(--cream);
  letter-spacing: 0.02em;
  margin-bottom: 32px;
}

.battle-tech {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tech-tag {
  font-size: 9px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--mist);
  opacity: 0.5;
  padding: 4px 0;
  border-bottom: 1px solid rgba(242, 235, 224, 0.08);
  transition: opacity 0.3s, color 0.3s;
}

.battle-card:hover .tech-tag {
  opacity: 0.8;
}

/* Progress bar */
.battles-progress {
  position: absolute;
  bottom: 60px;
  left: 48px;
  right: 48px;
  height: 1px;
  background: rgba(242, 235, 224, 0.06);
}

.battles-progress-fill {
  height: 100%;
  background: var(--blood-red);
  transform-origin: left;
  transform: scaleX(0);
  will-change: transform;
}

.ink-divider-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

@media (max-width: 768px) {
  .battles-header-fixed {
    padding: 80px 24px 0;
  }
  .battle-panel {
    width: 80vw;
    min-width: 280px;
    padding: 0 12px;
  }
  .battle-panel:first-child {
    margin-left: 24px;
  }
  .battle-panel:last-child {
    padding-right: 10vw;
  }
  .battle-card {
    padding: 28px;
  }
  .battles-progress {
    left: 24px;
    right: 24px;
    bottom: 50px;
  }
  .battles-track-wrap {
    padding-bottom: 80px;
  }
}
</style>
