<template>
  <canvas ref="canvasRef" class="matrix-rain" />
</template>

<script setup lang="ts">
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animId: number | null = null

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Characters — katakana + latin + numbers
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF'

  let cols: number
  let drops: number[]
  const fontSize = 14
  const speed = 0.04 // slow drip

  function resize() {
    const parent = canvas.parentElement
    if (!parent) return
    canvas.width = parent.clientWidth
    canvas.height = parent.clientHeight
    cols = Math.floor(canvas.width / fontSize)
    drops = Array.from({ length: cols }, () => Math.random() * -100)
  }

  resize()
  window.addEventListener('resize', resize)

  function draw() {
    // Translucent black to create fade trail
    ctx!.fillStyle = 'rgba(8, 8, 15, 0.06)'
    ctx!.fillRect(0, 0, canvas.width, canvas.height)

    ctx!.font = `${fontSize}px monospace`

    for (let i = 0; i < cols; i++) {
      // Only some columns active at a time
      if (Math.random() > speed) continue

      const char = chars[Math.floor(Math.random() * chars.length)]
      const x = i * fontSize
      const y = drops[i] * fontSize

      // Head character — brighter
      const brightness = Math.random() * 0.12 + 0.04
      ctx!.fillStyle = `rgba(255, 23, 68, ${brightness})`
      ctx!.fillText(char, x, y)

      // Trail character — dimmer
      if (drops[i] > 1) {
        const trailChar = chars[Math.floor(Math.random() * chars.length)]
        ctx!.fillStyle = `rgba(255, 23, 68, ${brightness * 0.3})`
        ctx!.fillText(trailChar, x, (drops[i] - 1) * fontSize)
      }

      drops[i] += 1

      // Reset with random offset
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
        drops[i] = Math.random() * -20
      }
    }

    animId = requestAnimationFrame(draw)
  }

  draw()

  onUnmounted(() => {
    if (animId) cancelAnimationFrame(animId)
    window.removeEventListener('resize', resize)
  })
})
</script>

<style scoped>
.matrix-rain {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.5;
}
</style>
