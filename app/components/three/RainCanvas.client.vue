<template>
  <div ref="canvasContainer" class="rain-canvas" />
</template>

<script setup lang="ts">
import * as THREE from 'three'

const canvasContainer = ref<HTMLElement | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animationId: number
let onResizeHandler: () => void
let onMouseMoveHandler: (e: MouseEvent) => void

// Mouse tracking for parallax
const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }

// Lightning state
let lightningFlash = 0
let nextLightning = 3000 + Math.random() * 8000

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
const RAIN_COUNT = isMobile ? 1000 : 3000
const STREAK_COUNT = isMobile ? 30 : 80
const RAIN_AREA = 25
const RAIN_HEIGHT = 18

function init() {
  if (!canvasContainer.value) return

  const el = canvasContainer.value
  const w = el.clientWidth
  const h = el.clientHeight

  // Scene
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x08080f, 0.035)

  // Camera
  camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 60)
  camera.position.set(0, 2, 8)

  // Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.8
  el.appendChild(renderer.domElement)

  // === RAIN DROPS (fine particles) ===
  const rainPositions = new Float32Array(RAIN_COUNT * 3)
  const rainVelocities = new Float32Array(RAIN_COUNT)
  const rainOpacities = new Float32Array(RAIN_COUNT)

  for (let i = 0; i < RAIN_COUNT; i++) {
    rainPositions[i * 3] = (Math.random() - 0.5) * RAIN_AREA
    rainPositions[i * 3 + 1] = Math.random() * RAIN_HEIGHT - 2
    rainPositions[i * 3 + 2] = (Math.random() - 0.5) * RAIN_AREA
    rainVelocities[i] = 0.08 + Math.random() * 0.12
    rainOpacities[i] = 0.2 + Math.random() * 0.6
  }

  const rainGeo = new THREE.BufferGeometry()
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3))

  const rainMat = new THREE.PointsMaterial({
    color: 0x6699cc,
    size: 0.015,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  const rain = new THREE.Points(rainGeo, rainMat)
  scene.add(rain)

  // === RAIN STREAKS (longer falling lines) ===
  const streakPositions: number[] = []
  const streakVelocities = new Float32Array(STREAK_COUNT)

  for (let i = 0; i < STREAK_COUNT; i++) {
    const x = (Math.random() - 0.5) * RAIN_AREA
    const y = Math.random() * RAIN_HEIGHT
    const z = (Math.random() - 0.5) * RAIN_AREA * 0.6
    const len = 0.3 + Math.random() * 0.8

    // Each streak is a line segment (top to bottom)
    streakPositions.push(x, y, z)
    streakPositions.push(x + 0.02, y - len, z)

    streakVelocities[i] = 0.15 + Math.random() * 0.2
  }

  const streakGeo = new THREE.BufferGeometry()
  streakGeo.setAttribute('position', new THREE.Float32BufferAttribute(streakPositions, 3))

  const streakMat = new THREE.LineBasicMaterial({
    color: 0x5588aa,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  const streaks = new THREE.LineSegments(streakGeo, streakMat)
  scene.add(streaks)

  // === NEON GLOW PLANES (distant city light reflections) ===
  const glowColors = [0xff1744, 0x00e5ff, 0xaa00ff, 0xffd740]
  const glows: THREE.Mesh[] = []

  for (let i = 0; i < 6; i++) {
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(2 + Math.random() * 4, 8 + Math.random() * 10),
      new THREE.MeshBasicMaterial({
        color: glowColors[i % glowColors.length],
        transparent: true,
        opacity: 0.015 + Math.random() * 0.01,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    )
    glow.position.set(
      (Math.random() - 0.5) * 30,
      Math.random() * 5 - 2,
      -15 - Math.random() * 10
    )
    glow.rotation.y = (Math.random() - 0.5) * 0.5
    scene.add(glow)
    glows.push(glow)
  }

  // === GROUND REFLECTION PLANE ===
  const groundGeo = new THREE.PlaneGeometry(40, 40)
  const groundMat = new THREE.MeshBasicMaterial({
    color: 0x0d0d2b,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
    depthWrite: false,
  })
  const ground = new THREE.Mesh(groundGeo, groundMat)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -2
  scene.add(ground)

  // === LIGHTNING ===
  const lightningLight = new THREE.PointLight(0xccddff, 0, 50)
  lightningLight.position.set(0, 15, -5)
  scene.add(lightningLight)

  // Mouse parallax
  onMouseMoveHandler = (e: MouseEvent) => {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2
    mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2
  }
  if (!isMobile) {
    window.addEventListener('mousemove', onMouseMoveHandler)
  }

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

  // Animation loop
  let time = 0

  function animate() {
    animationId = requestAnimationFrame(animate)
    time += 0.016

    // Smooth mouse follow
    mouse.x += (mouse.targetX - mouse.x) * 0.03
    mouse.y += (mouse.targetY - mouse.y) * 0.03

    // Camera parallax
    camera.position.x = mouse.x * 0.8
    camera.position.y = 2 + mouse.y * -0.4
    camera.lookAt(0, 1, 0)

    // === Update rain particles ===
    const rp = rainGeo.attributes.position.array as Float32Array
    const wind = Math.sin(time * 0.3) * 0.015

    for (let i = 0; i < RAIN_COUNT; i++) {
      rp[i * 3 + 1] -= rainVelocities[i]
      rp[i * 3] += wind + Math.sin(time + i * 0.1) * 0.002

      if (rp[i * 3 + 1] < -3) {
        rp[i * 3 + 1] = RAIN_HEIGHT + Math.random() * 2
        rp[i * 3] = (Math.random() - 0.5) * RAIN_AREA
        rp[i * 3 + 2] = (Math.random() - 0.5) * RAIN_AREA
      }
    }
    rainGeo.attributes.position.needsUpdate = true

    // === Update rain streaks ===
    const sp = streakGeo.attributes.position.array as Float32Array
    for (let i = 0; i < STREAK_COUNT; i++) {
      const idx = i * 6
      sp[idx + 1] -= streakVelocities[i]
      sp[idx + 4] -= streakVelocities[i]
      sp[idx] += wind * 1.5
      sp[idx + 3] += wind * 1.5

      if (sp[idx + 4] < -3) {
        const newY = RAIN_HEIGHT + Math.random() * 3
        const len = sp[idx + 1] - sp[idx + 4]
        sp[idx + 1] = newY
        sp[idx + 4] = newY - len
        const newX = (Math.random() - 0.5) * RAIN_AREA
        sp[idx] = newX
        sp[idx + 3] = newX + 0.02
        const newZ = (Math.random() - 0.5) * RAIN_AREA * 0.6
        sp[idx + 2] = newZ
        sp[idx + 5] = newZ
      }
    }
    streakGeo.attributes.position.needsUpdate = true

    // === Lightning ===
    nextLightning -= 16
    if (nextLightning <= 0) {
      lightningFlash = 1.0
      nextLightning = 5000 + Math.random() * 12000
    }
    if (lightningFlash > 0) {
      lightningFlash *= 0.85
      lightningLight.intensity = lightningFlash * 3
      rainMat.opacity = 0.5 + lightningFlash * 0.4
      streakMat.opacity = 0.25 + lightningFlash * 0.5

      // Flash the fog lighter
      if (scene.fog instanceof THREE.FogExp2) {
        const f = lightningFlash * 0.3
        scene.fog.color.setRGB(0.03 + f, 0.03 + f, 0.06 + f)
      }
    } else {
      lightningLight.intensity = 0
      rainMat.opacity = 0.5
      streakMat.opacity = 0.25
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.setRGB(0.03, 0.03, 0.06)
      }
    }

    // === Glow plane drift ===
    glows.forEach((g, i) => {
      g.position.y += Math.sin(time * 0.5 + i) * 0.002
      const mat = g.material as THREE.MeshBasicMaterial
      mat.opacity = 0.015 + Math.sin(time * 0.8 + i * 2) * 0.008
    })

    renderer.render(scene, camera)
  }

  animate()
}

function dispose() {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResizeHandler)
  window.removeEventListener('mousemove', onMouseMoveHandler)

  scene?.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.Points || child instanceof THREE.LineSegments) {
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
.rain-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
</style>
