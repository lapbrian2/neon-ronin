<template>
  <section id="origin" ref="sectionRef" class="origin-section">
    <div class="section-inner">
      <div class="chapter-num">二</div>

      <div ref="headerRef" class="origin-header">
        <div class="section-subtitle">CHAPTER II — BEFORE THE ROAD</div>
        <h2 class="section-title">
          Every wanderer was once<br />
          <em>rooted somewhere.</em>
        </h2>
      </div>

      <div ref="gridRef" class="origin-grid">
        <div class="origin-text">
          <p class="body-text">
            The blade was not always masterless. Before the open road,
            there was discipline — the dojo floor worn smooth by ten
            thousand repetitions, the master's eye catching every
            imperfection invisible to others.
          </p>
          <p class="body-text" style="margin-top: 24px;">
            What remains is not allegiance but methodology. The forms
            persist after the school dissolves. The cut remembers even
            when the hand forgets its origin.
          </p>
        </div>

        <div class="origin-cards">
          <div class="ink-card">
            <div class="card-kanji">道</div>
            <p class="card-text">
              <em>Dō</em> — The Way. Not a destination but a practice.
              Each project begins with the same discipline: understand
              the terrain, read the opponent, move only when the moment
              demands it.
            </p>
          </div>
          <div class="ink-card">
            <div class="card-kanji">型</div>
            <p class="card-text">
              <em>Kata</em> — The Form. Process forged through repetition
              until it becomes instinct. Systems thinking applied with
              the precision of a thousand practice draws.
            </p>
          </div>
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
const gridRef = ref<HTMLElement | null>(null)

const { createTimeline, gsap } = useScrollAnimation()

onMounted(() => {
  if (!sectionRef.value) return

  gsap.set(headerRef.value, { opacity: 0, y: 60 })
  gsap.set(gridRef.value, { opacity: 0, y: 40 })

  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 70%',
      toggleActions: 'play none none none',
    },
  })
    .to(headerRef.value, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
    .to(gridRef.value, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.5')
})
</script>

<style scoped>
.origin-section {
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

.origin-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-top: 60px;
}

.card-kanji {
  font-family: 'Noto Serif JP', serif;
  font-size: 28px;
  margin-bottom: 12px;
  font-weight: 200;
}

.card-text {
  font-size: 13px;
  line-height: 1.8;
  color: var(--warm-gray);
}

.ink-divider-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

@media (max-width: 768px) {
  .origin-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .section-inner {
    padding: 0 24px;
  }
}
</style>
