<template>
  <Transition name="preloader">
    <div v-if="loading" class="preloader">
      <div class="preloader-content">
        <!-- Glitch title -->
        <div class="preloader-title">
          <span class="preloader-text font-display tracking-display" data-text="NEON RONIN">NEON RONIN</span>
        </div>

        <!-- Loading bar -->
        <div class="preloader-bar-track">
          <div ref="barRef" class="preloader-bar-fill" />
        </div>

        <!-- Loading text -->
        <p class="preloader-status font-body text-smoke text-xs uppercase tracking-[0.2em] mt-4">
          {{ statusText }}
        </p>
      </div>

      <!-- Corner marks -->
      <div class="corner corner-tl" />
      <div class="corner corner-tr" />
      <div class="corner corner-bl" />
      <div class="corner corner-br" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import gsap from 'gsap'

const loading = ref(true)
const barRef = ref<HTMLElement | null>(null)
const statusText = ref('INITIALIZING')

const statuses = [
  'INITIALIZING',
  'LOADING ASSETS',
  'BUILDING SCENE',
  'CALIBRATING RAIN',
  'ENTERING CITY',
  'READY',
]

onMounted(() => {
  let progress = 0
  let statusIdx = 0

  const interval = setInterval(() => {
    progress += 8 + Math.random() * 15
    if (progress > 100) progress = 100

    statusIdx = Math.min(
      Math.floor((progress / 100) * statuses.length),
      statuses.length - 1
    )
    statusText.value = statuses[statusIdx]

    if (barRef.value) {
      gsap.to(barRef.value, {
        width: `${progress}%`,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    if (progress >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        loading.value = false
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
  background: var(--void);
  display: flex;
  align-items: center;
  justify-content: center;
}

.preloader-content {
  text-align: center;
}

.preloader-title {
  margin-bottom: 2rem;
}

.preloader-text {
  font-size: clamp(2rem, 6vw, 4rem);
  color: var(--light);
  position: relative;
  display: inline-block;
}

/* Glitch effect */
.preloader-text::before,
.preloader-text::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.preloader-text::before {
  color: var(--neon-cyan);
  animation: glitch-1 2s infinite linear;
  clip-path: inset(0 0 65% 0);
}

.preloader-text::after {
  color: var(--neon-red);
  animation: glitch-2 2s infinite linear;
  clip-path: inset(65% 0 0 0);
}

@keyframes glitch-1 {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 1px); }
  40% { transform: translate(2px, -1px); }
  60% { transform: translate(-1px, 2px); }
  80% { transform: translate(1px, -2px); }
}

@keyframes glitch-2 {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(2px, -1px); }
  40% { transform: translate(-2px, 1px); }
  60% { transform: translate(1px, -2px); }
  80% { transform: translate(-1px, 2px); }
}

/* Loading bar */
.preloader-bar-track {
  width: 200px;
  height: 2px;
  background: var(--steel);
  margin: 0 auto;
  overflow: hidden;
}

.preloader-bar-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(to right, var(--neon-red), var(--neon-cyan));
}

/* Corner marks */
.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: var(--smoke);
  border-style: solid;
  border-width: 0;
}

.corner-tl {
  top: 2rem;
  left: 2rem;
  border-top-width: 1px;
  border-left-width: 1px;
}

.corner-tr {
  top: 2rem;
  right: 2rem;
  border-top-width: 1px;
  border-right-width: 1px;
}

.corner-bl {
  bottom: 2rem;
  left: 2rem;
  border-bottom-width: 1px;
  border-left-width: 1px;
}

.corner-br {
  bottom: 2rem;
  right: 2rem;
  border-bottom-width: 1px;
  border-right-width: 1px;
}

/* Exit transition */
.preloader-leave-active {
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.preloader-leave-to {
  opacity: 0;
  transform: scale(1.05);
}
</style>
