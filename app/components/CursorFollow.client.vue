<template>
  <div class="cursor-wrapper" :class="{ 'cursor-hidden': !visible }">
    <div ref="dotRef" class="cursor-dot" :class="[cursorClass, sectionColor]" />
    <div ref="ringRef" class="cursor-ring" :class="[cursorClass, sectionColor]" />
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'

const { normalizedSpeed, direction } = useScrollVelocity()

const dotRef = ref<HTMLElement | null>(null)
const ringRef = ref<HTMLElement | null>(null)
const visible = ref(false)
const cursorClass = ref('')
const sectionColor = ref('')

let mouseX = 0
let mouseY = 0
let tickerCallback: (() => void) | null = null

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

  // Ring follows with smooth lerp + velocity stretch
  tickerCallback = () => {
    const speed = normalizedSpeed.value
    const scaleY = 1 + speed * 0.5
    const scaleX = 1 - speed * 0.12
    const dir = direction.value
    const skewY = dir === 'down' ? speed * 3 : dir === 'up' ? -speed * 3 : 0

    gsap.to(ringRef.value, {
      x: mouseX,
      y: mouseY,
      scaleY,
      scaleX,
      skewY,
      duration: 0.15,
      ease: 'power2.out',
      overwrite: true,
    })
  }
  gsap.ticker.add(tickerCallback)

  // Section-aware cursor color — uses ACTUAL section classes from components
  const sectionColorMap: Record<string, string> = {
    'hero': 'cursor-dark-bg',
    'origin-section': 'cursor-light-bg',
    'code-section': 'cursor-light-bg',
    'blade-section': 'cursor-light-bg',
    'interstitial': 'cursor-dark-bg',
    'interstitial-blade': 'cursor-dark-bg',
    'battles-section': 'cursor-dark-bg',
    'road-section': 'cursor-dark-bg',
  }

  const sections = document.querySelectorAll('section')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
        const el = entry.target as HTMLElement
        for (const [cls, color] of Object.entries(sectionColorMap)) {
          if (el.classList.contains(cls)) {
            sectionColor.value = color
            break
          }
        }
      }
    })
  }, { threshold: [0.3, 0.5] })

  sections.forEach(s => observer.observe(s))

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
    observer.disconnect()
    if (tickerCallback) gsap.ticker.remove(tickerCallback)
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
  transition: width 0.2s, height 0.2s, background 0.3s;
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
  background: var(--blood-red);
}

.cursor-active.cursor-ring {
  width: 50px;
  height: 50px;
  border-color: var(--blood-red);
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

/* Dark background sections — cream/white cursor (default, handled by mix-blend-mode) */
.cursor-dark-bg.cursor-ring {
  border-color: rgba(255, 255, 255, 0.4);
}
.cursor-dark-bg.cursor-dot {
  background: white;
}

/* Light background sections — ink cursor */
.cursor-light-bg.cursor-ring {
  border-color: rgba(10, 10, 15, 0.2);
}
.cursor-light-bg.cursor-dot {
  background: var(--ink);
}

@media (max-width: 768px) {
  .cursor-wrapper {
    display: none;
  }
}
</style>
