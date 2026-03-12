<template>
  <section id="blade" ref="sectionRef" class="blade-section">
    <div class="section-inner">
      <div class="chapter-num">四</div>

      <div ref="headerRef" class="blade-header">
        <div class="section-subtitle">CHAPTER IV — THE BLADE</div>
        <h2 class="section-title">
          The instrument and<br />
          <em>the hand are one.</em>
        </h2>
      </div>

      <div ref="skillsRef" class="skills-list">
        <div v-for="(skill, i) in skills" :key="i" class="skill-row">
          <div class="skill-info">
            <h3 class="skill-name">{{ skill.name }}</h3>
            <p class="skill-desc">{{ skill.desc }}</p>
          </div>
          <span class="skill-kanji">{{ skill.kanji }}</span>
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
const skillsRef = ref<HTMLElement | null>(null)

const { createTimeline, gsap } = useScrollAnimation()

const skills = [
  { name: 'Creative Engineering', desc: 'Where aesthetic instinct meets systematic execution. Building at the intersection of art direction and architecture.', kanji: '壱' },
  { name: 'Systems Architecture', desc: 'Lean methodology applied with the precision of iaijutsu. Process discipline forged in manufacturing, wielded in creative systems.', kanji: '弐' },
  { name: 'Immersive Web Worlds', desc: 'Three.js environments that breathe. Scroll-driven narratives where the user moves through space, not past content.', kanji: '参' },
  { name: 'AI-Native Education', desc: 'Frameworks for teaching humans to think alongside machines. Not replacement — augmentation of creative instinct.', kanji: '肆' },
]

onMounted(() => {
  if (!sectionRef.value) return

  gsap.set(headerRef.value, { opacity: 0, y: 60 })
  const rows = skillsRef.value?.querySelectorAll('.skill-row')
  if (rows) {
    rows.forEach((row: Element, i: number) => {
      gsap.set(row, { opacity: 0, x: 60 + i * 20, rotateY: 5 })
    })
  }

  const tl = createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 70%',
      toggleActions: 'play none none none',
    },
  })

  tl.to(headerRef.value, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })

  if (rows) {
    tl.to(rows, {
      opacity: 1, x: 0, rotateY: 0,
      duration: 0.8, stagger: 0.15,
      ease: 'power3.out',
    }, '-=0.4')
  }
})
</script>

<style scoped>
.blade-section {
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

.skills-list {
  perspective: 800px;
  margin-top: 60px;
}

.skill-row {
  display: flex;
  transform-style: preserve-3d;
  align-items: baseline;
  justify-content: space-between;
  padding: 28px 0;
  border-bottom: 1px solid rgba(10, 10, 15, 0.06);
  transition: padding-left 0.4s, border-color 0.4s;
}


.skill-row:hover {
  padding-left: 16px;
  border-bottom-color: var(--blood-red);
}

.skill-name {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: 22px;
  margin-bottom: 6px;
}

.skill-desc {
  font-size: 13px;
  color: var(--warm-gray);
  font-weight: 300;
  max-width: 500px;
}

.skill-kanji {
  font-family: 'Noto Serif JP', serif;
  font-weight: 200;
  font-size: 24px;
  opacity: 0.15;
  flex-shrink: 0;
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
}
</style>
