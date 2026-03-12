<template>
  <div ref="canvasContainer" class="ember-canvas" />
</template>

<script setup lang="ts">
import * as THREE from 'three'

const canvasContainer = ref<HTMLElement | null>(null)

let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let animationId: number
let onResizeHandler: () => void

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
const EMBER_COUNT = isMobile ? 40 : 120

function init() {
  if (!canvasContainer.value) return

  const el = canvasContainer.value
  const w = el.clientWidth
  const h = el.clientHeight

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 50)
  camera.position.set(0, 0, 10)

  renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)
  el.appendChild(renderer.domElement)

  // === EMBER PARTICLES ===
  const positions = new Float32Array(EMBER_COUNT * 3)
  const velocities = new Float32Array(EMBER_COUNT * 3)
  const sizes = new Float32Array(EMBER_COUNT)
  const colors = new Float32Array(EMBER_COUNT * 3)

  const emberColors = [
    new THREE.Color(0xff4422), // deep orange
    new THREE.Color(0xff6644), // orange
    new THREE.Color(0xffaa22), // amber
    new THREE.Color(0xff1744), // neon red
  ]

  for (let i = 0; i < EMBER_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = Math.random() * -5 - 2
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10

    velocities[i * 3] = (Math.random() - 0.5) * 0.01
    velocities[i * 3 + 1] = 0.01 + Math.random() * 0.03
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005

    sizes[i] = 0.03 + Math.random() * 0.06

    const c = emberColors[Math.floor(Math.random() * emberColors.length)]
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const mat = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  })

  const embers = new THREE.Points(geo, mat)
  scene.add(embers)

  // Resize
  onResizeHandler = () => {
    if (!canvasContainer.value) return
    const w = canvasContainer.value.clientWidth
    const h = canvasContainer.value.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', onResizeHandler)

  // Animation
  let time = 0

  function animate() {
    animationId = requestAnimationFrame(animate)
    time += 0.016

    const pos = geo.attributes.position.array as Float32Array

    for (let i = 0; i < EMBER_COUNT; i++) {
      // Rise upward with drift
      pos[i * 3] += velocities[i * 3] + Math.sin(time * 2 + i) * 0.003
      pos[i * 3 + 1] += velocities[i * 3 + 1]
      pos[i * 3 + 2] += velocities[i * 3 + 2]

      // Reset when risen too high
      if (pos[i * 3 + 1] > 12) {
        pos[i * 3] = (Math.random() - 0.5) * 20
        pos[i * 3 + 1] = Math.random() * -5 - 2
        pos[i * 3 + 2] = (Math.random() - 0.5) * 10
      }
    }
    geo.attributes.position.needsUpdate = true

    // Subtle pulsing opacity
    mat.opacity = 0.6 + Math.sin(time * 1.5) * 0.2

    renderer.render(scene, camera)
  }

  animate()
}

function dispose() {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResizeHandler)

  scene?.traverse((child) => {
    if (child instanceof THREE.Points) {
      child.geometry?.dispose()
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => m.dispose())
      } else {
        (child.material as THREE.Material)?.dispose()
      }
    }
  })

  renderer?.dispose()
  renderer?.domElement.remove()
  scene?.clear()
}

onMounted(() => init())
onUnmounted(() => dispose())
</script>

<style scoped>
.ember-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
</style>
