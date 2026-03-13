/**
 * Reactive scroll velocity detection.
 * Provides normalizedSpeed (0–1) for velocity-coupled effects.
 */
export function useScrollVelocity() {
  const velocity = ref(0)
  const normalizedSpeed = ref(0)
  const direction = ref<'up' | 'down' | 'idle'>('idle')

  let lastY = 0
  let lastTime = 0
  let decayId: number

  function handleScroll() {
    const now = performance.now()
    const dt = now - lastTime
    if (dt < 10) return

    const y = window.scrollY
    const delta = y - lastY
    const speed = (Math.abs(delta) / dt) * 1000

    velocity.value = speed
    normalizedSpeed.value = Math.min(speed / 2500, 1)
    direction.value = delta > 0 ? 'down' : delta < 0 ? 'up' : 'idle'

    lastY = y
    lastTime = now
  }

  function decay() {
    velocity.value *= 0.92
    normalizedSpeed.value *= 0.92
    if (velocity.value < 1) {
      velocity.value = 0
      normalizedSpeed.value = 0
      direction.value = 'idle'
    }
    decayId = requestAnimationFrame(decay)
  }

  onMounted(() => {
    lastY = window.scrollY
    lastTime = performance.now()
    window.addEventListener('scroll', handleScroll, { passive: true })
    decayId = requestAnimationFrame(decay)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    cancelAnimationFrame(decayId)
  })

  return {
    velocity: readonly(velocity),
    normalizedSpeed: readonly(normalizedSpeed),
    direction: readonly(direction),
  }
}
