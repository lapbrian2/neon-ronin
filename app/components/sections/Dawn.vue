<template>
  <section id="road" ref="sectionRef" class="road-section">
    <div class="section-inner">
      <div class="chapter-num">六</div>

      <div ref="headerRef" class="road-header">
        <div class="section-subtitle">CHAPTER VI — THE ROAD CONTINUES</div>
        <h2 class="section-title">
          The path is wide<br />
          <em>enough for two.</em>
        </h2>
      </div>

      <div ref="bodyRef" class="road-body">
        <p class="body-text">
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

const { createTimeline, gsap } = useScrollAnimation()

onMounted(() => {
  if (!sectionRef.value) return

  gsap.set(headerRef.value, { opacity: 0, y: 60 })
  gsap.set(bodyRef.value, { opacity: 0, y: 30 })
  gsap.set(footerRef.value, { opacity: 0 })

  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 70%',
      toggleActions: 'play none none none',
    },
  })
    .to(headerRef.value, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
    .to(bodyRef.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4')
    .to(footerRef.value, { opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.2')
})
</script>

<style scoped>
.road-section {
  padding: 120px 0 0;
  position: relative;
  background: var(--cream);
}

.section-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 48px;
  position: relative;
}

.road-body {
  margin-top: 40px;
}

.road-cta {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  color: var(--ink);
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  padding: 18px 40px;
  border: 1px solid var(--ink);
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

.cta-arrow {
  font-size: 14px;
}

/* Footer */
.site-footer {
  padding: 80px 48px 48px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-top: 1px solid rgba(10, 10, 15, 0.06);
  margin-top: 120px;
}

.footer-kanji {
  font-family: 'Noto Serif JP', serif;
  font-weight: 900;
  font-size: 20px;
  margin-bottom: 8px;
}

.footer-copy {
  font-size: 11px;
  color: var(--warm-gray);
  letter-spacing: 2px;
}

.footer-quote {
  font-size: 12px;
  font-style: italic;
  font-weight: 300;
  color: var(--warm-gray);
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
