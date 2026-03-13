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
          <div class="principle-line" />
          <div class="principle-kanji">{{ item.kanji }}</div>
          <h3 class="principle-title">{{ item.title }}</h3>
          <p class="principle-text">{{ item.text }}</p>
        </div>
      </div>
    </div>

    <!-- Tech marquee -->
    <div class="tech-marquee-wrap">
      <div class="tech-marquee">
        <div class="tech-marquee-track">
          <span v-for="(tech, i) in marqueeItems" :key="i" class="marquee-item">
            {{ tech }} <span class="marquee-dot">·</span>
          </span>
        </div>
        <div class="tech-marquee-track" aria-hidden="true">
          <span v-for="(tech, i) in marqueeItems" :key="'d'+i" class="marquee-item">
            {{ tech }} <span class="marquee-dot">·</span>
          </span>
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

const marqueeItems = [
  'Three.js', 'GSAP', 'Nuxt', 'Vue', 'Lenis', 'WebGL',
  'Node.js', 'Canvas 2D', 'CSS Architecture', 'ScrollTrigger',
  'Tailwind', 'TypeScript', 'Vercel', 'Python',
]

onMounted(() => {
  if (!sectionRef.value) return

  gsap.set(headerRef.value, { opacity: 0, y: 60 })

  const lineEls = principlesRef.value?.querySelectorAll('.principle-line')
  const kanjiEls = principlesRef.value?.querySelectorAll('.principle-kanji')
  const titleEls = principlesRef.value?.querySelectorAll('.principle-title')
  const textEls = principlesRef.value?.querySelectorAll('.principle-text')

  if (lineEls) gsap.set(lineEls, { scaleX: 0, transformOrigin: 'left center' })
  if (kanjiEls) gsap.set(kanjiEls, { opacity: 0, scale: 0.3 })
  if (titleEls) gsap.set(titleEls, { opacity: 0, x: -20 })
  if (textEls) gsap.set(textEls, { opacity: 0, y: 15 })

  const tl = createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 70%',
      toggleActions: 'play none none none',
    },
  })

  tl.to(headerRef.value, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })

  if (lineEls && kanjiEls && titleEls && textEls) {
    for (let i = 0; i < lineEls.length; i++) {
      const offset = i === 0 ? '-=0.3' : '-=0.5'
      tl.to(lineEls[i], { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, offset)
      tl.to(kanjiEls[i], { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, '-=0.3')
      tl.to(titleEls[i], { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2')
      tl.to(textEls[i], { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2')
    }
  }
})
</script>

<style scoped>
.code-section {
  padding: 120px 0 0;
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

.principle-line {
  width: 40px; height: 2px; background: var(--blood-red);
  margin-bottom: 20px;
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

/* Tech Marquee */
.tech-marquee-wrap {
  margin-top: 80px;
  padding: 24px 0;
  border-top: 1px solid rgba(10, 10, 15, 0.06);
  border-bottom: 1px solid rgba(10, 10, 15, 0.06);
  overflow: hidden;
}

.tech-marquee {
  display: flex;
  width: max-content;
  animation: marqueeScroll 30s linear infinite;
}

.tech-marquee:hover {
  animation-play-state: paused;
}

.tech-marquee-track {
  display: flex;
  gap: 0;
  flex-shrink: 0;
}

.marquee-item {
  font-size: 10px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--warm-gray);
  white-space: nowrap;
  padding: 0 16px;
  opacity: 0.6;
  transition: opacity 0.3s, color 0.3s;
}

.marquee-item:hover {
  opacity: 1;
  color: var(--blood-red);
}

.marquee-dot {
  color: var(--blood-red);
  opacity: 0.4;
  margin-left: 16px;
}

@keyframes marqueeScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
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
