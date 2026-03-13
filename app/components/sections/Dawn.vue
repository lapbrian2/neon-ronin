<template>
  <section id="road" ref="sectionRef" class="road-section">
    <!-- Atmospheric image backdrop -->
    <div ref="dawnImageRef" class="dawn-image-wrap">
      <img
        src="/images/ronin-departure.webp"
        alt=""
        class="dawn-image"
        loading="lazy"
      />
      <div class="dawn-image-overlay" />
    </div>

    <div class="section-inner">
      <div class="chapter-num dark-chapter">六</div>

      <div ref="headerRef" class="road-header">
        <div class="section-subtitle dark-subtitle">CHAPTER VI — THE ROAD CONTINUES</div>
        <h2 class="section-title dark-title">
          The path is wide<br />
          <em>enough for two.</em>
        </h2>
      </div>

      <div ref="bodyRef" class="road-body">
        <p class="body-text dark-body">
          Every alliance begins with a single step in the same direction.
          The ronin does not recruit — but the road ahead forks, and
          some destinations demand more than one blade.
        </p>

        <a href="mailto:hello@ronin.art" class="road-cta" data-cursor>
          <span class="cta-bg" />
          Walk together
          <span class="cta-arrow">→</span>
        </a>
      </div>
    </div>

    <!-- Footer -->
    <footer ref="footerRef" class="site-footer">
      <div class="footer-left">
        <div class="footer-kanji">浪人</div>
        <p class="footer-copy">浪人 — 2026</p>
      </div>
      <p class="footer-quote">
        "The masterless blade walks on<br />
        because the road does not end."
      </p>
    </footer>
  </section>
</template>

<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const bodyRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const dawnImageRef = ref<HTMLElement | null>(null)

const { createTimeline, gsap } = useScrollAnimation()

onMounted(() => {
  if (!sectionRef.value) return

  gsap.set(dawnImageRef.value, { opacity: 0, scale: 1.1 })
  gsap.set(headerRef.value, { opacity: 0, y: 60, scale: 0.97 })
  gsap.set(bodyRef.value, { opacity: 0, x: -50 })

  const footerLeft = footerRef.value?.querySelector('.footer-left')
  const footerQuote = footerRef.value?.querySelector('.footer-quote')
  if (footerLeft) gsap.set(footerLeft, { opacity: 0, y: 20 })
  if (footerQuote) gsap.set(footerQuote, { opacity: 0, x: 30 })

  // Image fade in on scroll
  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  }).to(dawnImageRef.value, { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' })

  // Parallax on the image
  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top bottom', end: 'bottom top', scrub: 1,
    },
  }).to(dawnImageRef.value?.querySelector('.dawn-image') || {}, { y: 80, ease: 'none' })

  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 70%',
      toggleActions: 'play none none none',
    },
  })
    .to(headerRef.value, { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' })
    .to(bodyRef.value, { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' }, '-=0.6')

  createTimeline({
    scrollTrigger: {
      trigger: footerRef.value,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  })
    .to(footerLeft, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
    .to(footerQuote, { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4')
})
</script>

<style scoped>
.road-section {
  padding: 120px 0 0;
  position: relative;
  background: var(--ink);
  color: var(--cream);
  overflow: hidden;
}

.dawn-image-wrap {
  position: absolute; inset: 0; z-index: 0;
  will-change: opacity, transform;
}
.dawn-image {
  width: 100%; height: 100%; object-fit: cover;
  will-change: transform;
}
.dawn-image-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(
    180deg,
    rgba(10, 10, 15, 0.7) 0%,
    rgba(10, 10, 15, 0.5) 50%,
    rgba(10, 10, 15, 0.8) 100%
  );
}

.section-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 48px;
  position: relative;
  z-index: 1;
}

.dark-chapter {
  -webkit-text-stroke-color: rgba(242, 235, 224, 0.04) !important;
}
.dark-subtitle {
  color: var(--gold) !important;
}
.dark-title {
  color: var(--cream) !important;
}
.dark-body {
  color: var(--mist) !important;
}

.road-body {
  margin-top: 40px;
}

.road-cta {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  color: var(--cream);
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  padding: 18px 40px;
  border: 1px solid rgba(242, 235, 224, 0.3);
  position: relative;
  overflow: hidden;
  transition: color 0.4s, border-color 0.4s;
  margin-top: 48px;
}

.road-cta:hover {
  color: var(--cream);
  border-color: var(--blood-red);
}

.cta-bg {
  position: absolute;
  inset: 0;
  background: var(--blood-red);
  transform: translateX(-101%);
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: -1;
}

.road-cta:hover .cta-bg {
  transform: translateX(0);
}

.road-cta:hover .cta-arrow { animation: arrowSlide 0.6s ease infinite; }
@keyframes arrowSlide {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(5px); }
}
.cta-arrow {
  font-size: 14px;
}

/* Footer */
.site-footer {
  padding: 80px 48px 48px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-top: 1px solid rgba(242, 235, 224, 0.06);
  margin-top: 120px;
  position: relative;
  z-index: 1;
}

.footer-kanji {
  font-family: 'Noto Serif JP', serif;
  font-weight: 900;
  font-size: 20px;
  margin-bottom: 8px;
  color: var(--cream);
}

.footer-copy {
  font-size: 11px;
  color: var(--mist);
  letter-spacing: 2px;
}

.footer-quote {
  font-size: 12px;
  font-style: italic;
  font-weight: 300;
  color: var(--mist);
  max-width: 300px;
  text-align: right;
  line-height: 1.7;
}

@media (max-width: 768px) {
  .section-inner {
    padding: 0 24px;
  }
  .site-footer {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 32px;
    padding: 60px 24px 32px;
  }
  .footer-quote {
    text-align: center;
    max-width: 100%;
  }
}
</style>
