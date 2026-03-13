<template>
  <section id="blade" ref="sectionRef" class="blade-section">
    <!-- Subtle ink wash background -->
    <div class="blade-bg-wash" />

    <div class="section-inner">
      <div class="chapter-num">四</div>

      <div ref="headerRef" class="blade-header">
        <div class="section-subtitle">CHAPTER IV — THE BLADE</div>
        <h2 ref="titleRef" class="section-title">
          The instrument and the hand are one.
        </h2>
      </div>

      <div ref="skillsRef" class="skills-list">
        <div v-for="(skill, i) in skills" :key="i" class="skill-row">
          <div class="skill-info">
            <h3 class="skill-name">{{ skill.name }}</h3>
            <p class="skill-desc">{{ skill.desc }}</p>
          </div>
          <div class="skill-right">
            <span class="skill-kanji">{{ skill.kanji }}</span>
            <div class="skill-accent" />
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
const titleRef = ref<HTMLElement | null>(null)
const skillsRef = ref<HTMLElement | null>(null)

const { createTimeline, gsap, splitTextReveal } = useScrollAnimation()

const skills = [
  { name: 'Creative Engineering', desc: 'Art direction with engineering discipline. Every pixel answers to both beauty and function.', kanji: '壱' },
  { name: 'Systems Architecture', desc: 'Lean methodology applied with the precision of iaijutsu. Process discipline forged in manufacturing, wielded in creative systems.', kanji: '弐' },
  { name: 'Immersive Web Worlds', desc: 'Three.js environments that breathe. Scroll-driven narratives where the user moves through space, not past content.', kanji: '参' },
  { name: 'AI-Native Workflow', desc: 'Building with AI as a first-class tool, not a parlor trick. Agentic systems that ship real work.', kanji: '肆' },
]

onMounted(() => {
  if (!sectionRef.value) return

  const subtitleEl = headerRef.value?.querySelector('.section-subtitle')
  if (subtitleEl) gsap.set(subtitleEl, { opacity: 0, y: 30 })
  const rows = skillsRef.value?.querySelectorAll('.skill-row')
  if (rows) {
    rows.forEach((row: Element, i: number) => {
      gsap.set(row, { opacity: 0, y: 40 + i * 15 })
    })
  }

  // Subtitle reveals on enter
  const tl = createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 70%',
      toggleActions: 'play none none none',
    },
  })
  tl.to(subtitleEl, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })

  // Character-level title reveal
  if (titleRef.value) {
    splitTextReveal(titleRef.value, { trigger: sectionRef.value, start: 'top 75%' })
  }

  // Chapter number parallax
  const chapterNum = sectionRef.value.querySelector('.chapter-num')
  if (chapterNum) {
    createTimeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top bottom', end: 'bottom top', scrub: 1,
      },
    }).to(chapterNum, { y: -60, ease: 'none' })
  }

  // Skill rows scrub in progressively as you scroll through
  if (rows) {
    const scrubTl = createTimeline({
      scrollTrigger: {
        trigger: skillsRef.value,
        start: 'top 80%',
        end: 'bottom 40%',
        scrub: 0.5,
      },
    })
    rows.forEach((row: Element, i: number) => {
      scrubTl.to(row, {
        opacity: 1, y: 0,
        duration: 1, ease: 'none',
      }, i * 0.3)
    })
  }

  // Ink divider stroke-draw reveal
  const dividerPath = sectionRef.value!.querySelector('.ink-divider-wrap path') as SVGPathElement | null
  const dividerDot = sectionRef.value!.querySelector('.ink-divider-wrap circle')
  if (dividerPath) {
    const pathLen = dividerPath.getTotalLength()
    gsap.set(dividerPath, { strokeDasharray: pathLen, strokeDashoffset: pathLen })
    if (dividerDot) gsap.set(dividerDot, { attr: { r: 0 } })
    const divTl = createTimeline({
      scrollTrigger: {
        trigger: sectionRef.value!.querySelector('.ink-divider-wrap'),
        start: 'top 85%',
        end: 'top 55%',
        scrub: 0.5,
      },
    })
    divTl.to(dividerPath, { strokeDashoffset: 0, ease: 'none' })
    if (dividerDot) divTl.to(dividerDot, { attr: { r: 3 }, duration: 0.3, ease: 'back.out(3)' }, '-=0.1')
  }
})
</script>

<style scoped>
.blade-section {
  padding: 120px 0;
  position: relative;
  background: #ede4d5;
  overflow: hidden;
}

/* Subtle ink wash background — gives depth without imagery */
.blade-bg-wash {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 50% at 85% 20%, rgba(10, 10, 15, 0.03) 0%, transparent 70%),
    radial-gradient(ellipse 40% 60% at 10% 80%, rgba(140, 26, 26, 0.02) 0%, transparent 60%);
  pointer-events: none;
}

.section-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 48px;
  position: relative;
}

.skills-list {
  margin-top: 60px;
}

.skill-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 0;
  border-bottom: 1px solid rgba(10, 10, 15, 0.06);
  transition: padding-left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 0.4s;
  position: relative;
}

.skill-row::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--blood-red);
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.skill-row:hover {
  padding-left: 20px;
  border-bottom-color: var(--blood-red);
}

.skill-row:hover::before {
  transform: scaleY(1);
}

.skill-name {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: 24px;
  margin-bottom: 6px;
  transition: color 0.4s;
}

.skill-row:hover .skill-name {
  color: var(--blood-red);
}

.skill-desc {
  font-size: 13px;
  color: var(--warm-gray);
  font-weight: 300;
  max-width: 500px;
  line-height: 1.7;
}

.skill-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.skill-kanji {
  font-family: 'Noto Serif JP', serif;
  font-weight: 200;
  font-size: 28px;
  opacity: 0.12;
  transition: opacity 0.4s;
}

.skill-row:hover .skill-kanji {
  opacity: 0.3;
}

.skill-accent {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--blood-red);
  opacity: 0;
  transform: scale(0);
  transition: opacity 0.4s, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.skill-row:hover .skill-accent {
  opacity: 0.6;
  transform: scale(1);
}

.ink-divider-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

@media (max-width: 768px) {
  .section-inner {
    padding: 0 24px;
  }
  .skill-kanji {
    display: none;
  }
  .skill-accent {
    display: none;
  }
}
</style>
