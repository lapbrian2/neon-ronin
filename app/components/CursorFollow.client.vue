<template>
  <div class="cursor-wrapper" :class="{ 'cursor-hidden': !visible }">
    <div ref="dotRef" class="cursor-dot" :class="cursorClass" />
    <div ref="ringRef" class="cursor-ring" :class="cursorClass" />
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'

const dotRef = ref<HTMLElement | null>(null)
const ringRef = ref<HTMLElement | null>(null)
const visible = ref(false)
const cursorClass = ref('')

let mouseX = 0
let mouseY = 0

onMounted(() => {
  // Hide on mobile/touch
  if ('ontouchstart' in window || window.innerWidth < 768) return

  document.body.style.cursor = 'none'

  const onMouseMove = (e: MouseEvent) => {
    mouseX = e.clientX
    mouseY = e.clientY
    visible.value = true

    // Dot follows instantly
    gsap.set(dotRef.value, { x: mouseX, y: mouseY })
  }

  // Ring follows with smooth lerp via ticker
  gsap.ticker.add(() => {
    gsap.to(ringRef.value, {
      x: mouseX,
      y: mouseY,
      duration: 0.15,
      ease: 'power2.out',
      overwrite: true,
    })
  })

  // Detect interactive elements
  const onMouseOver = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('a, button, [data-cursor]')) {
      cursorClass.value = 'cursor-active'
    }
  }

  const onMouseOut = () => {
    cursorClass.value = ''
  }

  const onMouseDown = () => {
    cursorClass.value = 'cursor-click'
  }

  const onMouseUp = () => {
    cursorClass.value = ''
  }

  window.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseover', onMouseOver)
  document.addEventListener('mouseout', onMouseOut)
  document.addEventListener('mousedown', onMouseDown)
  document.addEventListener('mouseup', onMouseUp)

  onUnmounted(() => {
    document.body.style.cursor = ''
    window.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseover', onMouseOver)
    document.removeEventListener('mouseout', onMouseOut)
    document.removeEventListener('mousedown', onMouseDown)
    document.removeEventListener('mouseup', onMouseUp)
  })
})
</script>

<style>
/* Hide default cursor on all elements when custom cursor is active */
.cursor-wrapper:not(.cursor-hidden) ~ * {
  cursor: none !important;
}
</style>

<style scoped>
.cursor-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  pointer-events: none;
  mix-blend-mode: difference;
}

.cursor-hidden {
  opacity: 0;
}

.cursor-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.2s, height 0.2s, background 0.2s;
}

.cursor-ring {
  position: absolute;
  width: 36px;
  height: 36px;
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease, opacity 0.3s ease;
}

/* Interactive state — ring expands */
.cursor-active.cursor-dot {
  width: 8px;
  height: 8px;
  background: var(--neon-red);
}

.cursor-active.cursor-ring {
  width: 50px;
  height: 50px;
  border-color: var(--neon-red);
  opacity: 0.6;
}

/* Click state */
.cursor-click.cursor-dot {
  width: 4px;
  height: 4px;
}

.cursor-click.cursor-ring {
  width: 28px;
  height: 28px;
  border-color: white;
}

@media (max-width: 768px) {
  .cursor-wrapper {
    display: none;
  }
}
</style>
