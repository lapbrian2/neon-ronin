<template>
  <Transition name="preloader">
    <div v-if="loading" class="preloader">
      <!-- Scanlines -->
      <div class="preloader-scanlines" />

      <div class="preloader-content">
        <!-- Glitch title -->
        <div class="preloader-title">
          <span class="preloader-text font-display tracking-display" data-text="浪人">浪人</span>
        </div>

        <!-- Numeric counter -->
        <div class="preloader-counter font-body">
          <span class="counter-value">{{ displayPercent }}</span>
          <span class="counter-symbol">%</span>
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

      <!-- Bottom tagline -->
      <div class="preloader-tagline">
        <span class="font-body text-smoke text-xs tracking-[0.15em]">A SCROLL-DRIVEN ANIME EXPERIENCE</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import gsap from 'gsap'

const loading = ref(true)
const barRef = ref<HTMLElement | null>(null)
const statusText = ref('INITIALIZING')
const displayPercent = ref(0)

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

  const interval = setInterval(() => {
    progress += 5 + Math.random() * 12
    if (progress > 100) progress = 100

    const statusIdx = Math.min(
      Math.floor((progress / 100) * statuses.length),
      statuses.length - 1
    )
    statusText.value = statuses[statusIdx]

    // Animate counter
    gsap.to({ val: displayPercent.value }, {
      val: Math.round(progress),
      duration: 0.4,
      ease: 'power1.out',
      onUpdate: function () {
        displayPercent.value = Math.round(this.targets()[0].val)
      },
    })

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
      }, 800)
    }
  }, 250)
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

.preloader-scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 2px,
    rgba(0, 0, 0, 0.12) 2px,
    rgba(0, 0, 0, 0.12) 4px
  );
  pointer-events: none;
  opacity: 0.3;
  z-index: 1;
}

.preloader-content {
  text-align: center;
  position: relative;
  z-index: 2;
}

.preloader-title {
  margin-bottom: 1.5rem;
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

/* Numeric counter */
.preloader-counter {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
}

.counter-value {
  font-size: clamp(1.5rem, 4vw, 3rem);
  color: var(--ash);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
}

.counter-symbol {
  font-size: 0.875rem;
  color: var(--smoke);
}

/* Loading bar */
.preloader-bar-track {
  width: 240px;
  height: 2px;
  background: var(--steel);
  margin: 0 auto;
  overflow: hidden;
  border-radius: 1px;
}

.preloader-bar-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(to right, var(--neon-red), var(--neon-cyan));
  border-radius: 1px;
}

/* Corner marks */
.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: var(--smoke);
  border-style: solid;
  border-width: 0;
  opacity: 0.3;
}

.corner-tl { top: 2rem; left: 2rem; border-top-width: 1px; border-left-width: 1px; }
.corner-tr { top: 2rem; right: 2rem; border-top-width: 1px; border-right-width: 1px; }
.corner-bl { bottom: 2rem; left: 2rem; border-bottom-width: 1px; border-left-width: 1px; }
.corner-br { bottom: 2rem; right: 2rem; border-bottom-width: 1px; border-right-width: 1px; }

/* Bottom tagline */
.preloader-tagline {
  position: absolute;
  bottom: 3rem;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 2;
}

/* Exit transition — cinematic wipe */
.preloader-leave-active {
  transition: clip-path 1s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.6s ease 0.4s;
}

.preloader-leave-to {
  clip-path: inset(50% 0 50% 0);
  opacity: 0;
}
</style>
