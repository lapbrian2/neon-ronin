<template>
  <section id="code" ref="sectionRef" class="code-section">
    <div class="section-inner">
      <div class="chapter-num">三</div>

      <div ref="headerRef" class="code-header">
        <div class="section-subtitle">CHAPTER III — THE CODE</div>
        <h2 class="section-title">
          Principles carved into<br />
          <em>muscle memory.</em>
        </h2>
      </div>

      <div ref="principlesRef" class="principles-grid">
        <div v-for="(item, i) in principles" :key="i" class="principle-item">
          <div class="principle-kanji">{{ item.kanji }}</div>
          <h3 class="principle-title">{{ item.title }}</h3>
          <p class="principle-text">{{ item.text }}</p>
        </div>
      </div>
    </div>

    <!-- Ink divider -->
    <div class="ink-divider-wrap">
      <svg width="300" height="12" viewBox="0 0 300 12">
        <path d="M0,6 Q30,2 60,6 Q90,10 120,5 Q150,1 180,7 Q210,11 240,5 Q270,2 300,6"
          stroke="var(--ink)" stroke-width="1.5" fill="none" opacity="0.25" stroke-linecap="round" />
        <circle cx="150" cy="6" r="3" fill="var(--blood-red)" opacity="0.6" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const principlesRef = ref<HTMLElement | null>(null)

const { createTimeline, gsap } = useScrollAnimation()

const principles = [
  {
    kanji: '一',
    title: 'ICHI — Precision',
    text: 'One cut, one outcome. No wasted motion, no extraneous element. Every decision serves the whole.',
  },
  {
    kanji: '残',
    title: 'ZAN — Residue',
    text: 'What remains after the strike defines mastery. The follow-through matters more than the initial contact.',
  },
  {
    kanji: '間',
    title: 'MA — Negative Space',
    text: 'The space between elements carries meaning. Restraint is not absence — it is the silence that makes the note resonate.',
  },
]

onMounted(() => {
  if (!sectionRef.value) return

  gsap.set(headerRef.value, { opacity: 0, y: 60 })
  const items = principlesRef.value?.querySelectorAll('.principle-item')
  if (items) gsap.set(items, { opacity: 0, y: 40 })

  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 70%',
      toggleActions: 'play none none none',
    },
  })
    .to(headerRef.value, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
    .to(items, {
      opacity: 1, y: 0,
      duration: 0.8, stagger: 0.2,
      ease: 'power2.out',
    }, '-=0.4')
})
</script>

<style scoped>
.code-section {
  padding: 120px 0;
  position: relative;
  background: var(--cream);
}

.section-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 48px;
  position: relative;
}

.principles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-top: 60px;
}

.principle-kanji {
  font-family: 'Noto Serif JP', serif;
  font-weight: 900;
  font-size: 80px;
  color: transparent;
  -webkit-text-stroke: 1px rgba(10, 10, 15, 0.05);
  line-height: 1;
  margin-bottom: 16px;
}

.principle-title {
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 16px;
  color: var(--ink);
}

.principle-text {
  font-size: 14px;
  line-height: 1.8;
  color: var(--warm-gray);
  font-weight: 300;
}

.ink-divider-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

@media (max-width: 768px) {
  .principles-grid {
    grid-template-columns: 1fr;
    gap: 48px;
  }
  .section-inner {
    padding: 0 24px;
  }
}
</style>
