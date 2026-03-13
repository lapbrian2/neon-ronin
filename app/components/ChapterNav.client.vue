<template>
  <nav class="chapter-nav" :class="{ 'chapter-nav--light': isLightSection }">
    <div
      v-for="chapter in chapters"
      :key="chapter.id"
      class="chapter-dot-group"
      :class="{ active: activeChapter === chapter.id }"
      role="button"
      tabindex="0"
      :aria-label="'Navigate to chapter ' + chapter.label"
      data-cursor
      @click="scrollToChapter(chapter.id)"
      @keydown.enter="scrollToChapter(chapter.id)"
    >
      <div class="chapter-dot" />
      <span class="chapter-label">{{ chapter.label }}</span>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const chapters = [
  { id: 'hero', label: 'I', selector: '.hero' },
  { id: 'origin', label: 'II', selector: '#origin' },
  { id: 'code', label: 'III', selector: '#code' },
  { id: 'blade', label: 'IV', selector: '#blade' },
  { id: 'battles', label: 'V', selector: '#battles' },
  { id: 'road', label: 'VI', selector: '#road' },
]

const activeChapter = ref('hero')
const isLightSection = ref(false)

const lightSections = new Set(['origin', 'code', 'blade'])

const triggers: ScrollTrigger[] = []

function scrollToChapter(id: string) {
  const chapter = chapters.find(c => c.id === id)
  if (!chapter) return
  const el = document.querySelector(chapter.selector)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  chapters.forEach((chapter) => {
    const trigger = ScrollTrigger.create({
      trigger: chapter.selector,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (self.isActive) {
          activeChapter.value = chapter.id
          isLightSection.value = lightSections.has(chapter.id)
        }
      },
    })
    triggers.push(trigger)
  })
})

onUnmounted(() => {
  triggers.forEach(t => t.kill())
  triggers.length = 0
})
</script>

<style scoped>
.chapter-nav {
  position: fixed;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  align-items: flex-end;
}

.chapter-dot-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: none;
  padding: 0.25rem 0;
  outline: none;
}

.chapter-dot-group:focus-visible .chapter-dot {
  box-shadow: 0 0 0 3px var(--blood-red);
}

.chapter-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid rgba(242, 235, 224, 0.4);
  background: transparent;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
}

.chapter-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: rgba(242, 235, 224, 0.5);
  opacity: 0;
  transform: translateX(5px);
  transition: all 0.3s ease;
  pointer-events: none;
  white-space: nowrap;
}

/* Hover: show label */
.chapter-dot-group:hover .chapter-label {
  opacity: 1;
  transform: translateX(0);
}

/* Active state */
.active .chapter-dot {
  background: var(--blood-red);
  border-color: var(--blood-red);
  box-shadow: 0 0 8px rgba(140, 26, 26, 0.5);
  transform: scale(1.3);
}

.active .chapter-label {
  opacity: 0.6;
  transform: translateX(0);
}

/* Light section — invert dot colors */
.chapter-nav--light .chapter-dot {
  border-color: rgba(10, 10, 15, 0.15);
}

.chapter-nav--light .chapter-label {
  color: rgba(10, 10, 15, 0.4);
}

.chapter-nav--light .active .chapter-dot {
  background: var(--blood-red);
  border-color: var(--blood-red);
}

@media (max-width: 768px) {
  .chapter-nav {
    right: 0.75rem;
    gap: 1rem;
  }

  .chapter-label {
    display: none;
  }

  .chapter-dot {
    width: 6px;
    height: 6px;
  }
}
</style>
