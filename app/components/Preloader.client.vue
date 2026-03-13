<template>
  <Transition name="preloader">
    <div v-if="loading" class="preloader">
      <div class="preloader-content">
        <div class="preloader-kanji">浪人</div>
        <div class="preloader-bar-track">
          <div ref="barRef" class="preloader-bar-fill" />
        </div>
        <p class="preloader-status">{{ statusText }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import gsap from 'gsap'

const emit = defineEmits<{ done: [] }>()

const loading = ref(true)
const barRef = ref<HTMLElement | null>(null)
const statusText = ref('PREPARING')

const statuses = [
  'PREPARING',
  'LOADING ASSETS',
  'BUILDING SCENE',
  'SHARPENING BLADE',
  'READY',
]

onMounted(() => {
  let progress = 0

  const interval = setInterval(() => {
    progress += 5 + Math.random() * 12
    if (progress > 100) progress = 100

    const statusIdx = Math.min(
      Math.floor((progress / 100) * statuses.length),
      statuses.length - 1
    )
    statusText.value = statuses[statusIdx]

    if (barRef.value) {
      gsap.to(barRef.value, {
        width: progress + '%',
        duration: 0.4,
        ease: 'power2.out',
      })
    }

    if (progress >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        loading.value = false
        emit('done')
      }, 600)
    }
  }, 200)
})
</script>

<style scoped>
.preloader {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
}

.preloader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.preloader-kanji {
  font-family: 'Noto Serif JP', serif;
  font-weight: 900;
  font-size: clamp(48px, 10vw, 80px);
  color: var(--cream);
  letter-spacing: 0.1em;
}

.preloader-bar-track {
  width: 120px;
  height: 1px;
  background: rgba(242, 235, 224, 0.1);
  position: relative;
  overflow: hidden;
}

.preloader-bar-fill {
  height: 100%;
  width: 0%;
  background: var(--blood-red);
}

.preloader-status {
  font-size: 9px;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: var(--mist);
  opacity: 0.5;
}

/* Exit transition */
.preloader-leave-active {
  transition: clip-path 1s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.5s ease 0.5s;
}
.preloader-leave-to {
  clip-path: inset(50% 0 50% 0);
  opacity: 0;
}
</style>
