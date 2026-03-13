<template>
  <section ref="sectionRef" class="interstitial-blade">
    <div ref="imageRef" class="ib-image">
      <img
        src="/images/ronin-departure.webp"
        alt=""
        class="ib-img"
        loading="lazy"
      />
      <div class="ib-overlay" />
    </div>
    <div ref="contentRef" class="ib-content">
      <div class="ib-line" />
      <p class="ib-quote">
        Steel is patient.<br />
        The edge comes from repetition.
      </p>
      <div class="ib-kanji">鍛</div>
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
  }).to(imageRef.value?.querySelector('.ib-img') || {}, { y: 60, ease: 'none' })
})
</script>

<style scoped>
.interstitial-blade {
  position: relative;
  height: 50vh;
  min-height: 360px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ib-image {
  position: absolute; inset: 0;
  will-change: clip-path;
}
.ib-img {
  width: 100%; height: 120%; object-fit: cover;
  object-position: center 30%;
  will-change: transform;
}
.ib-overlay {
  position: absolute; inset: 0;
  background: rgba(10, 10, 15, 0.7);
}

.ib-content {
  position: relative; z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.ib-line {
  width: 40px; height: 2px;
  background: var(--gold);
}

.ib-quote {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-style: italic;
  font-size: clamp(22px, 3vw, 36px);
  color: var(--cream);
  line-height: 1.6;
  letter-spacing: 0.03em;
}

.ib-kanji {
  font-family: 'Noto Serif JP', serif;
  font-weight: 200;
  font-size: 48px;
  color: transparent;
  -webkit-text-stroke: 1px rgba(242, 235, 224, 0.1);
  margin-top: 8px;
}

/* Seamless transition bleeds */
.interstitial-blade::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 80px;
  background: linear-gradient(to bottom, var(--cream), transparent);
  z-index: 2;
  pointer-events: none;
}

.interstitial-blade::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 80px;
  background: linear-gradient(to top, var(--ink), transparent);
  z-index: 2;
  pointer-events: none;
}

@media (max-width: 768px) {
  .interstitial-blade { height: 40vh; min-height: 280px; }
  .interstitial-blade::before, .interstitial-blade::after { height: 50px; }
}
</style>
