<template>
  <section id="origin" ref="sectionRef" class="origin-section">
    <!-- Subtle atmospheric wash -->
    <div class="origin-wash" />

    <div class="section-inner">
      <div class="chapter-num">二</div>

      <div ref="headerRef" class="origin-header">
        <div class="section-subtitle">CHAPTER II — BEFORE THE ROAD</div>
        <h2 ref="titleRef" class="section-title">
          Every wanderer was once rooted somewhere.
        </h2>
      </div>

      <div class="origin-grid">
        <div ref="textRef" class="origin-text">
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
          <div ref="cardDoRef" class="ink-card card-do">
            <div class="card-accent" />
            <div class="card-kanji">道</div>
            <p class="card-text">
              <em>Dō</em> — The Way. Not a destination but a practice.
              Each project begins with the same discipline: understand
              the terrain, read the opponent, move only when the moment
              demands it.
            </p>
          </div>
          <div ref="cardKataRef" class="ink-card card-kata">
            <div class="card-accent" />
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
const titleRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)
const cardDoRef = ref<HTMLElement | null>(null)
const cardKataRef = ref<HTMLElement | null>(null)

const { createTimeline, gsap, splitTextReveal } = useScrollAnimation()

onMounted(() => {
  if (!sectionRef.value) return

  // Header slides up
  // Subtitle gets fade-up, title gets character reveal
  const subtitleEl = headerRef.value?.querySelector('.section-subtitle')
  if (subtitleEl) gsap.set(subtitleEl, { opacity: 0, y: 30 })
  // Text fades in
  gsap.set(textRef.value, { opacity: 0, y: 30 })
  // Cards slide from opposite sides with rotation
  gsap.set(cardDoRef.value, { opacity: 0, x: -80, rotation: -3 })
  gsap.set(cardKataRef.value, { opacity: 0, x: 80, rotation: 3 })

  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 70%',
      toggleActions: 'play none none none',
    },
  })
    .to(subtitleEl, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
    .to(textRef.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
    .to(cardDoRef.value, { opacity: 1, x: 0, rotation: 0, duration: 0.9, ease: 'power3.out' }, '-=0.4')
    .to(cardKataRef.value, { opacity: 1, x: 0, rotation: 0, duration: 0.9, ease: 'power3.out' }, '-=0.6')

  // Character-level title reveal
  if (titleRef.value) {
    splitTextReveal(titleRef.value, { trigger: sectionRef.value, start: 'top 75%' })
  }
})
</script>

<style scoped>
.origin-section {
  padding: 120px 0;
  position: relative;
  background: var(--cream);
  overflow: hidden;
}

/* Atmospheric wash for depth */
.origin-wash {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 40% at 15% 30%, rgba(10, 10, 15, 0.025) 0%, transparent 70%),
    radial-gradient(ellipse 70% 50% at 90% 70%, rgba(196, 160, 85, 0.03) 0%, transparent 60%);
  pointer-events: none;
}

.section-inner { max-width: 1100px; margin: 0 auto; padding: 0 48px; position: relative; }
.origin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; margin-top: 60px; }

.ink-card {
  background: rgba(10, 10, 15, 0.03);
  border-left: 2px solid var(--blood-red);
  padding: 32px 40px;
  position: relative;
  overflow: hidden;
  transition: background 0.4s, transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s;
}

.ink-card:hover {
  background: rgba(10, 10, 15, 0.06);
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(10, 10, 15, 0.06);
}

.card-accent {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 3px;
  background: linear-gradient(90deg, var(--blood-red), transparent);
  opacity: 0;
  transition: opacity 0.4s;
}

.ink-card:hover .card-accent {
  opacity: 0.6;
}

.card-kanji {
  font-family: 'Noto Serif JP', serif;
  font-size: 32px;
  margin-bottom: 12px;
  font-weight: 200;
  transition: color 0.4s;
}

.ink-card:hover .card-kanji {
  color: var(--blood-red);
}

.card-text { font-size: 13px; line-height: 1.8; color: var(--warm-gray); }
.origin-cards { display: flex; flex-direction: column; gap: 20px; }
.ink-divider-wrap { width: 100%; display: flex; justify-content: center; padding: 60px 0; }

@media (max-width: 768px) {
  .origin-grid { grid-template-columns: 1fr; gap: 40px; }
  .section-inner { padding: 0 24px; }
  .ink-card { padding: 24px 28px; }
}
</style>
