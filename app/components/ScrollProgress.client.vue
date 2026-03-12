<template>
  <div ref="barRef" class="scroll-progress" />
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const barRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!barRef.value) return

  gsap.to(barRef.value, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
    },
  })
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(t => {
    if (t.trigger === document.body) t.kill()
  })
})
</script>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(to right, var(--neon-red), var(--neon-violet), var(--neon-cyan));
  transform: scaleX(0);
  transform-origin: left;
  z-index: 10000;
  pointer-events: none;
  mix-blend-mode: screen;
}
</style>