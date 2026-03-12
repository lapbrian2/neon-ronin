<template>
  <canvas ref="canvasRef" class="film-grain" />
</template>

<script setup lang="ts">
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number
let ctx: CanvasRenderingContext2D | null = null

function resize() {
  if (!canvasRef.value) return
  canvasRef.value.width = window.innerWidth / 3
  canvasRef.value.height = window.innerHeight / 3
}

function renderGrain() {
  if (!ctx || !canvasRef.value) return
  const w = canvasRef.value.width
  const h = canvasRef.value.height
  const imageData = ctx.createImageData(w, h)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const v = Math.random() * 255
    data[i] = v
    data[i + 1] = v
    data[i + 2] = v
    data[i + 3] = 12 // very subtle alpha
  }

  ctx.putImageData(imageData, 0, 0)
  animationId = requestAnimationFrame(renderGrain)
}

onMounted(() => {
  if (!canvasRef.value) return
  ctx = canvasRef.value.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
  renderGrain()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resize)
})
</script>

<style scoped>
.film-grain {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 9998;
  pointer-events: none;
  opacity: 0.35;
  mix-blend-mode: overlay;
  image-rendering: pixelated;
}
</style>
