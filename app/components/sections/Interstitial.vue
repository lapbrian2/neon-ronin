<template>
  <section ref="sectionRef" class="interstitial">
    <div ref="imageRef" class="interstitial-image">
      <img
        src="/images/ronin-battlefield.webp"
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

  gsap.set(contentRef.value, { opacity: 0, y: 30 })

  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 70%',
      toggleActions: 'play none none none',
    },
  }).to(contentRef.value, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' })

  // Parallax on the image
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
}
.interstitial-img {
  width: 100%; height: 120%; object-fit: cover;
  object-position: center 70%;
  will-change: transform;
}
.interstitial-overlay {
  position: absolute; inset: 0;
  background: rgba(10, 10, 15, 0.65);
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

@media (max-width: 768px) {
  .interstitial { height: 40vh; min-height: 280px; }
}
</style>
