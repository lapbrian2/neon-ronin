import * as THREE from 'three'

/**
 * Composable for Three.js scene management.
 * Follows immersive-3d-web pattern: proxy objects for GSAP → Three.js bridge.
 * Handles cleanup on unmount.
 */
export function useThreeScene(container: Ref<HTMLElement | null>) {
  let scene: THREE.Scene | null = null
  let camera: THREE.PerspectiveCamera | null = null
  let renderer: THREE.WebGLRenderer | null = null
  let animationId: number | null = null
  let isDisposed = false

  // Proxy object for GSAP to animate — Three.js reads from this
  const proxy = reactive({
    cameraX: 0,
    cameraY: 0,
    cameraZ: 5,
    fogDensity: 0.02,
    rotationY: 0,
  })

  const disposables: { dispose: () => void }[] = []

  function init() {
    if (!container.value || isDisposed) return

    const el = container.value
    const w = el.clientWidth
    const h = el.clientHeight

    // Scene
    scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x08080f, proxy.fogDensity)

    // Camera
    camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100)
    camera.position.set(proxy.cameraX, proxy.cameraY, proxy.cameraZ)

    // Renderer
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x08080f, 1)
    el.appendChild(renderer.domElement)

    // Resize handler
    const onResize = () => {
      if (!camera || !renderer || !container.value) return
      const w = container.value.clientWidth
      const h = container.value.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)
    disposables.push({ dispose: () => window.removeEventListener('resize', onResize) })

    // Start render loop
    render()
  }

  function render() {
    if (isDisposed || !renderer || !scene || !camera) return

    // Read proxy values into Three.js — the bridge
    camera.position.set(proxy.cameraX, proxy.cameraY, proxy.cameraZ)
    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.density = proxy.fogDensity
    }

    renderer.render(scene, camera)
    animationId = requestAnimationFrame(render)
  }


  function trackDisposable(obj: { dispose: () => void }) {
    disposables.push(obj)
  }

  function dispose() {
    isDisposed = true

    if (animationId !== null) {
      cancelAnimationFrame(animationId)
      animationId = null
    }

    // Dispose all tracked resources
    disposables.forEach((d) => d.dispose())
    disposables.length = 0

    // Dispose scene children
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose()
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose())
          } else {
            child.material?.dispose()
          }
        }
      })
      scene.clear()
    }

    // Dispose renderer
    if (renderer) {
      renderer.dispose()
      renderer.domElement.remove()
    }

    scene = null
    camera = null
    renderer = null
  }

  onMounted(() => {
    init()
  })

  onUnmounted(() => {
    dispose()
  })

  return {
    scene: computed(() => scene),
    camera: computed(() => camera),
    renderer: computed(() => renderer),
    proxy,
    trackDisposable,
    dispose,
  }
}
