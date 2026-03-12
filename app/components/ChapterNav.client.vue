<template>
  <nav class="chapter-nav" :class="{ 'chapter-nav--ink': activeChapter === 'past' }">
    <div
      v-for="chapter in chapters"
      :key="chapter.id"
      class="chapter-dot-group"
      :class="{ active: activeChapter === chapter.id }"
      @click="scrollToChapter(chapter.id)"
      data-cursor
    >
      <div class="chapter-dot" />
      <span class="chapter-label font-body">{{ chapter.label }}</span>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const chapters = [
  { id: 'rain', label: 'I' },
  { id: 'city', label: 'II' },
  { id: 'past', label: 'III' },
  { id: 'code', label: 'IV' },
  { id: 'night', label: 'V' },
  { id: 'dawn', label: 'VI' },
]

const activeChapter = ref('rain')

const sectionMap: Record<string, string> = {
  rain: '.hero-rain',
  city: '.the-city',
  past: '.the-past',
  code: '.the-code',
  night: '.the-night',
  dawn: '.dawn',
}

function scrollToChapter(id: string) {
  const selector = sectionMap[id]
  if (!selector) return
  const el = document.querySelector(selector)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  // Create a ScrollTrigger per section to track active chapter
  Object.entries(sectionMap).forEach(([id, selector]) => {
    ScrollTrigger.create({
      trigger: selector,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (self.isActive) {
          activeChapter.value = id
        }
      },
    })
  })
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

/* Ink wash chapter — invert colors */
.chapter-nav--ink .chapter-dot {
  border-color: var(--ink-gray);
}

.chapter-nav--ink .active .chapter-dot {
  background: var(--ink-red);
  border-color: var(--ink-red);
  box-shadow: 0 0 8px rgba(139, 37, 0, 0.4);
}

.chapter-nav--ink .chapter-label {
  color: var(--ink-gray);
}

.chapter-dot-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: none;
  padding: 0.25rem 0;
}

.chapter-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid var(--smoke);
  background: transparent;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
}

.chapter-label {
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--smoke);
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
  background: var(--neon-red);
  border-color: var(--neon-red);
  box-shadow: 0 0 8px rgba(255, 23, 68, 0.5);
  transform: scale(1.3);
}

.active .chapter-label {
  color: var(--ash);
  opacity: 0.6;
  transform: translateX(0);
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
