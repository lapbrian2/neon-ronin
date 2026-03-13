<template>
  <section id="battles" ref="sectionRef" class="battles-section">
    <div class="section-inner">
      <div class="chapter-num">五</div>

      <div ref="headerRef" class="battles-header">
        <div class="section-subtitle">CHAPTER V — BATTLES WON</div>
        <h2 ref="titleRef" class="section-title">
          The clearing after the storm.
        </h2>
      </div>

      <div ref="battlesRef" class="battles-list">
        <div v-for="(battle, i) in battles" :key="i" class="battle-block"
          :class="{ 'battle-right': i % 2 !== 0 }">
          <div class="battle-index">{{ String(i + 1).padStart(2, '0') }}</div>
          <p class="battle-statement">{{ battle.statement }}</p>
          <div class="battle-tech">
            <span v-for="(tag, j) in battle.tech" :key="j" class="tech-tag">{{ tag }}</span>
          </div>
        </div>
      </div>
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
const battlesRef = ref<HTMLElement | null>(null)

const { createTimeline, gsap, splitTextReveal } = useScrollAnimation()

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
  if (!sectionRef.value) return

  const subtitleEl = headerRef.value?.querySelector('.section-subtitle')
  if (subtitleEl) gsap.set(subtitleEl, { opacity: 0, y: 30 })

  const blocks = battlesRef.value?.querySelectorAll('.battle-block')
  // Character-level title reveal
  if (titleRef.value) {
    splitTextReveal(titleRef.value, { trigger: sectionRef.value, start: 'top 75%' })
  }

  if (blocks) {
    blocks.forEach((block, i) => {
      const xDir = i % 2 === 0 ? -60 : 60
      gsap.set(block, { opacity: 0, x: xDir, y: 30 })
    })
  }

  const tl = createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 70%',
      toggleActions: 'play none none none',
    },
  })

  tl.to(subtitleEl, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })

  if (blocks) {
    blocks.forEach((block, i) => {
      tl.to(block, {
        opacity: 1, x: 0, y: 0,
        duration: 1, ease: 'power3.out',
      }, i === 0 ? '-=0.3' : '-=0.5')
    })
  }
})
</script>

<style scoped>
.battles-section {
  padding: 120px 0;
  position: relative;
  background: var(--ink);
  color: var(--cream);
}

.section-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 48px;
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

.battles-list {
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  gap: 64px;
}

.battle-block {
  max-width: 680px;
  position: relative;
  padding-left: 48px;
}

.battle-block.battle-right {
  align-self: flex-end;
  text-align: right;
  padding-left: 0;
  padding-right: 48px;
}

.battle-index {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 11px;
  letter-spacing: 4px;
  color: var(--blood-red);
  font-weight: 600;
}

.battle-right .battle-index {
  left: auto;
  right: 0;
}

.battle-statement {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-size: clamp(20px, 2.5vw, 28px);
  line-height: 1.6;
  color: var(--cream);
  letter-spacing: 0.02em;
}

.battle-tech {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.battle-right .battle-tech {
  justify-content: flex-end;
}

.tech-tag {
  font-size: 9px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--mist);
  opacity: 0.5;
  padding: 4px 0;
  border-bottom: 1px solid rgba(242, 235, 224, 0.08);
}

.ink-divider-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

@media (max-width: 768px) {
  .battles-list { gap: 48px; }
  .battle-block,
  .battle-block.battle-right {
    max-width: 100%;
    padding-left: 36px;
    padding-right: 0;
    text-align: left;
    align-self: flex-start;
  }
  .battle-right .battle-index {
    left: 0;
    right: auto;
  }
  .battle-right .battle-tech {
    justify-content: flex-start;
  }
  .section-inner {
    padding: 0 24px;
  }
}
</style>
