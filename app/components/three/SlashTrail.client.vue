<template>
  <canvas ref="canvasRef" class="slash-trail" />
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationId: number
let onResizeHandler: () => void

const proxy = reactive({ progress: 0 })

function resize() {
  if (!canvasRef.value) return
  const dpr = Math.min(window.devicePixelRatio, 2)
  canvasRef.value.width = canvasRef.value.clientWidth * dpr
  canvasRef.value.height = canvasRef.value.clientHeight * dpr
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function drawSlash() {
  if (!ctx || !canvasRef.value) return
  const w = canvasRef.value.clientWidth
  const h = canvasRef.value.clientHeight

  ctx.clearRect(0, 0, w, h)

  const p = proxy.progress
  if (p <= 0) {
    animationId = requestAnimationFrame(drawSlash)
    return
  }

  const startX = w * 0.1
  const startY = h * 0.85
  const endX = w * 0.9
  const endY = h * 0.15
  const cpX = w * 0.5
  const cpY = h * 0.3

  const steps = Math.floor(p * 60)
  if (steps < 2) {
    animationId = requestAnimationFrame(drawSlash)
    return
  }

  for (let i = 1; i < steps; i++) {
    const t0 = (i - 1) / 60
    const t1 = i / 60

    const x0 = (1 - t0) * (1 - t0) * startX + 2 * (1 - t0) * t0 * cpX + t0 * t0 * endX
    const y0 = (1 - t0) * (1 - t0) * startY + 2 * (1 - t0) * t0 * cpY + t0 * t0 * endY
    const x1 = (1 - t1) * (1 - t1) * startX + 2 * (1 - t1) * t1 * cpX + t1 * t1 * endX
    const y1 = (1 - t1) * (1 - t1) * startY + 2 * (1 - t1) * t1 * cpY + t1 * t1 * endY

    const age = 1 - (i / steps)
    const alpha = Math.pow(1 - age, 0.5) * 0.8

    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
    ctx.lineWidth = 2 + (1 - age) * 2
    ctx.lineCap = 'round'
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.strokeStyle = `rgba(255, 23, 68, ${alpha * 0.6})`
    ctx.lineWidth = 6 + (1 - age) * 8
    ctx.lineCap = 'round'
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.strokeStyle = `rgba(255, 23, 68, ${alpha * 0.15})`
    ctx.lineWidth = 20 + (1 - age) * 20
    ctx.lineCap = 'round'
    ctx.stroke()
  }

  if (steps > 2) {
    const tipT = steps / 60
    const tipX = (1 - tipT) * (1 - tipT) * startX + 2 * (1 - tipT) * tipT * cpX + tipT * tipT * endX
    const tipY = (1 - tipT) * (1 - tipT) * startY + 2 * (1 - tipT) * tipT * cpY + tipT * tipT * endY

    const gradient = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 30)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
    gradient.addColorStop(0.3, 'rgba(255, 23, 68, 0.4)')
    gradient.addColorStop(1, 'rgba(255, 23, 68, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(tipX - 30, tipY - 30, 60, 60)
  }

  animationId = requestAnimationFrame(drawSlash)
}

onMounted(() => {
  if (!canvasRef.value) return
  ctx = canvasRef.value.getContext('2d')
  resize()

  onResizeHandler = resize
  window.addEventListener('resize', onResizeHandler)

  const nightSection = document.querySelector('.the-night')
  if (nightSection) {
    gsap.to(proxy, {
      progress: 1,
      ease: 'power2.in',
      scrollTrigger: {
        trigger: nightSection,
        start: 'top 30%',
        end: 'center center',
        scrub: 1,
      },
    })
  }

  drawSlash()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResizeHandler)
})
</script>

<style scoped>
.slash-trail {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
}
</style>
