<template>
  <div ref="barRef" class="scroll-progress" />
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const barRef = ref<HTMLElement | null>(null)
let trigger: ScrollTrigger | null = null

onMounted(() => {
  if (!barRef.value) return

  const tween = gsap.to(barRef.value, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
    },
  })

  trigger = tween.scrollTrigger || null
})

onUnmounted(() => {
  if (trigger) trigger.kill()
})
</script>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--blood-red);
  transform: scaleX(0);
  transform-origin: left;
  z-index: 10000;
  pointer-events: none;
  mix-blend-mode: difference;
}
</style>
