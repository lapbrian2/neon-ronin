<template>
  <section id="battles" ref="sectionRef" class="battles-section">
    <div class="section-inner">
      <div class="chapter-num">五</div>

      <div ref="headerRef" class="battles-header">
        <div class="section-subtitle">CHAPTER V — BATTLES WON</div>
        <h2 class="section-title">
          The clearing after<br />
          <em>the storm.</em>
        </h2>
      </div>

      <div ref="projectsRef" class="projects-grid">
        <div v-for="(project, i) in projects" :key="i" class="ink-card project-card"
          :style="{ borderLeftColor: i === 0 ? 'var(--blood-red)' : 'rgba(10,10,15,0.08)' }">
          <div class="project-type">{{ project.type }}</div>
          <h3 class="project-name">{{ project.title }}</h3>
          <p class="project-desc">{{ project.desc }}</p>
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
const projectsRef = ref<HTMLElement | null>(null)

const { createTimeline, gsap } = useScrollAnimation()

const projects = [
  {
    title: 'The Vernissage',
    type: 'Immersive 3D Gallery',
    desc: 'A virtual exhibition space built in Three.js where art breathes and walls dissolve as you scroll through the collection.',
  },
  {
    title: 'Style DNA System',
    type: 'Methodology & Tool',
    desc: '30+ artist extractions. A shader-based framework that treats every image as frozen computation and reverse-engineers the algorithm beneath.',
  },
  {
    title: 'Workflow X-Ray',
    type: 'Consulting Diagnostic',
    desc: 'Lean methodology applied to AI adoption pipelines. Tollgate frameworks, FMEA analysis, and remediation plans for creative organizations.',
  },
  {
    title: 'Lonely Hollow',
    type: 'Immersive Web World',
    desc: 'An atmospheric 3D web experience where environment tells the story. Scroll-driven narrative through a haunted landscape.',
  },
]

onMounted(() => {
  if (!sectionRef.value) return

  gsap.set(headerRef.value, { opacity: 0, y: 60 })
  const cards = projectsRef.value?.querySelectorAll('.project-card')
  if (cards) gsap.set(cards, { opacity: 0, y: 40 })

  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 70%',
      toggleActions: 'play none none none',
    },
  })
    .to(headerRef.value, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
    .to(cards, {
      opacity: 1, y: 0,
      duration: 0.8, stagger: 0.15,
      ease: 'power2.out',
    }, '-=0.4')
})
</script>

<style scoped>
.battles-section {
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

.projects-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 60px;
}

.project-card {
  cursor: default;
  transition: border-left-color 0.4s, background 0.4s;
}

.project-card:hover {
  border-left-color: var(--blood-red) !important;
}

.project-type {
  font-size: 10px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--blood-red);
  margin-bottom: 12px;
}

.project-name {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: 22px;
  margin-bottom: 10px;
}

.project-desc {
  font-size: 13px;
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
  .projects-grid {
    grid-template-columns: 1fr;
  }
  .section-inner {
    padding: 0 24px;
  }
}
</style>
