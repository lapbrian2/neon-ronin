<template>
  <section ref="sectionRef" class="interstitial">
    <div ref="imageRef" class="interstitial-image">
      <img
        src="/images/ronin-bridge.webp"
        alt=""
        class="interstitial-img"
        loading="lazy"
      />
      <div class="interstitial-overlay" />
    </div>
    <div ref="contentRef" class="interstitial-content">
      <div class="interstitial-line" />
      <p class="interstitial-quote">
        The blade remembers<br />
        what the hand forgets.
      </p>
      <div class="interstitial-kanji">剣</div>
    </div>
  </section>
</template>

<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

const { createTimeline, gsap } = useScrollAnimation()

onMounted(() => {
  if (!sectionRef.value) return

  // Clip-path reveal: image expands from center
  gsap.set(imageRef.value, { clipPath: 'inset(12% 20% 12% 20%)' })
  gsap.set(contentRef.value, { opacity: 0, y: 30 })

  // Image clip-path expands on scroll
  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 85%',
      end: 'top 30%',
      scrub: 0.5,
    },
  }).to(imageRef.value, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' })

  // Content reveals after image opens
  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 50%',
      toggleActions: 'play none none none',
    },
  }).to(contentRef.value, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' })

  // Parallax on image
  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top bottom', end: 'bottom top', scrub: 1,
    },
  }).to(imageRef.value?.querySelector('.interstitial-img') || {}, { y: 60, ease: 'none' })
})
</script>

<style scoped>
.interstitial {
  position: relative;
  height: 50vh;
  min-height: 360px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.interstitial-image {
  position: absolute; inset: 0;
  will-change: clip-path;
}
.interstitial-img {
  width: 100%; height: 120%; object-fit: cover;
  object-position: center 40%;
  will-change: transform;
}
.interstitial-overlay {
  position: absolute; inset: 0;
  background: rgba(10, 10, 15, 0.55);
}

.interstitial-content {
  position: relative; z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.interstitial-line {
  width: 40px; height: 2px;
  background: var(--blood-red);
}

.interstitial-quote {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-style: italic;
  font-size: clamp(22px, 3vw, 36px);
  color: var(--cream);
  line-height: 1.6;
  letter-spacing: 0.03em;
}

.interstitial-kanji {
  font-family: 'Noto Serif JP', serif;
  font-weight: 200;
  font-size: 48px;
  color: transparent;
  -webkit-text-stroke: 1px rgba(242, 235, 224, 0.1);
  margin-top: 8px;
}

/* Seamless cream-to-dark bleed */
.interstitial::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 80px;
  background: linear-gradient(to bottom, var(--cream), transparent);
  z-index: 2;
  pointer-events: none;
}

.interstitial::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 80px;
  background: linear-gradient(to top, var(--cream), transparent);
  z-index: 2;
  pointer-events: none;
}

@media (max-width: 768px) {
  .interstitial { height: 40vh; min-height: 280px; }
  .interstitial::before, .interstitial::after { height: 50px; }
}
</style>
