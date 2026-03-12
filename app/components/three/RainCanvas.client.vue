<template>
  <div ref="canvasContainer" class="rain-canvas" />
</template>

<script setup lang="ts">
import * as THREE from 'three'

const canvasContainer = ref<HTMLElement | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let rainGeometry: THREE.BufferGeometry
let rainMaterial: THREE.PointsMaterial
let rainPoints: THREE.Points
let animationId: number

const PARTICLE_COUNT = window.innerWidth < 768 ? 800 : 2000
const RAIN_AREA = 20
const RAIN_HEIGHT = 15

function init() {
  if (!canvasContainer.value) return

  const el = canvasContainer.value
  const w = el.clientWidth
  const h = el.clientHeight

  // Scene
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x08080f, 0.05)

  // Camera
  camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 50)
  camera.position.set(0, 0, 5)

  // Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: true,
  })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)
  el.appendChild(renderer.domElement)

  // Rain particles
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const velocities = new Float32Array(PARTICLE_COUNT)

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * RAIN_AREA
    positions[i * 3 + 1] = Math.random() * RAIN_HEIGHT
    positions[i * 3 + 2] = (Math.random() - 0.5) * RAIN_AREA
    velocities[i] = 0.1 + Math.random() * 0.15
  }

  rainGeometry = new THREE.BufferGeometry()
  rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  rainMaterial = new THREE.PointsMaterial({
    color: 0x4488cc,
    size: 0.02,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  rainPoints = new THREE.Points(rainGeometry, rainMaterial)
  scene.add(rainPoints)

  // Subtle ambient light glow — neon reflection
  const ambientGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshBasicMaterial({
      color: 0xff1744,
      transparent: true,
      opacity: 0.02,
      side: THREE.DoubleSide,
    })
  )
  ambientGlow.position.z = -10
  scene.add(ambientGlow)

  // Store velocities for animation
  rainGeometry.userData.velocities = velocities

  // Resize
  const onResize = () => {
    if (!canvasContainer.value) return
    const w = canvasContainer.value.clientWidth
    const h = canvasContainer.value.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', onResize)

  animate()
}

function animate() {
  animationId = requestAnimationFrame(animate)

  const positions = rainGeometry.attributes.position.array as Float32Array
  const velocities = rainGeometry.userData.velocities as Float32Array

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Fall down
    positions[i * 3 + 1] -= velocities[i]

    // Slight wind drift
    positions[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.001

    // Reset when below view
    if (positions[i * 3 + 1] < -2) {
      positions[i * 3 + 1] = RAIN_HEIGHT
      positions[i * 3] = (Math.random() - 0.5) * RAIN_AREA
      positions[i * 3 + 2] = (Math.random() - 0.5) * RAIN_AREA
    }
  }

  rainGeometry.attributes.position.needsUpdate = true
  renderer.render(scene, camera)
}

function dispose() {
  cancelAnimationFrame(animationId)
  rainGeometry?.dispose()
  rainMaterial?.dispose()
  renderer?.dispose()
  renderer?.domElement.remove()
  scene?.clear()
}

onMounted(() => {
  init()
})

onUnmounted(() => {
  dispose()
})
</script>

<style scoped>
.rain-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
</style>
