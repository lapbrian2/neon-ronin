<template>
  <section ref="sectionRef" class="hero section section--fullscreen">

    <!-- Cinematic image backdrop -->
    <div ref="imageWrapRef" class="hero-image-wrap">
      <img
        ref="imageRef"
        src="/images/ronin-battlefield.webp"
        alt=""
        class="hero-image"
        loading="eager"
      />
      <div class="hero-image-overlay" />
    </div>

    <div class="hero-mist" />
    <div ref="kanjiRef" class="hero-kanji-ghost">侍</div>

    <div class="hero-content">
      <div ref="chapterRef" class="hero-chapter">
        <span v-for="(char, i) in chapterChars" :key="i" class="chapter-char" :style="{ transitionDelay: i * 40 + 'ms' }">{{ char }}</span>
      </div>
      <div class="hero-title-wrap">
        <svg ref="kanjiSvgRef" class="hero-kanji-svg" viewBox="0 0 420 160" aria-label="浪人">
          <g class="kanji-nami">
            <path d="M18,28 Q22,32 20,38" stroke="var(--ink)" stroke-width="4.5" fill="none" stroke-linecap="round" />
            <path d="M22,48 Q26,55 22,62" stroke="var(--ink)" stroke-width="4.5" fill="none" stroke-linecap="round" />
            <path d="M16,75 Q20,82 18,90" stroke="var(--ink)" stroke-width="4" fill="none" stroke-linecap="round" />
            <path d="M45,22 L155,22" stroke="var(--ink)" stroke-width="5" fill="none" stroke-linecap="round" />
            <path d="M100,22 L100,52" stroke="var(--ink)" stroke-width="4.5" fill="none" stroke-linecap="round" />
            <path d="M55,52 L145,52" stroke="var(--ink)" stroke-width="4.5" fill="none" stroke-linecap="round" />
            <path d="M60,52 L50,85 Q45,100 55,110" stroke="var(--ink)" stroke-width="4" fill="none" stroke-linecap="round" />
            <path d="M140,52 L150,85 Q155,100 145,110" stroke="var(--ink)" stroke-width="4" fill="none" stroke-linecap="round" />
            <path d="M70,75 Q100,65 130,75 Q145,100 100,130 Q60,105 70,75" stroke="var(--ink)" stroke-width="3.5" fill="none" stroke-linecap="round" />
          </g>
          <g class="kanji-hito" transform="translate(210, 10)">
            <path d="M95,12 Q85,50 60,85 Q40,115 10,145" stroke="var(--ink)" stroke-width="6" fill="none" stroke-linecap="round" />
            <path d="M95,12 Q110,55 135,90 Q155,115 185,145" stroke="var(--ink)" stroke-width="6" fill="none" stroke-linecap="round" />
          </g>
        </svg>
        <div ref="accentDotRef" class="accent-dot" />
      </div>
      <div ref="subtitleRef" class="hero-subtitle-row">
        <div class="hero-line" />
        <p class="hero-subtitle">A masterless blade in a city of electric ghosts.</p>
      </div>
      <div ref="ctaRef" class="hero-cta">
        <a href="#origin" class="cta-link" data-cursor>
          <span class="cta-text">Begin the journey</span>
          <span class="cta-arrow">&#8595;</span>
        </a>
      </div>
    </div>
    <div class="hero-bottom-fade" />
  </section>
</template>

<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
const kanjiRef = ref<HTMLElement | null>(null)
const imageWrapRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const chapterRef = ref<HTMLElement | null>(null)
const kanjiSvgRef = ref<SVGElement | null>(null)
const accentDotRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)

const chapterText = 'CHAPTER I \u2014 THE ARRIVAL'
const chapterChars = computed(() => chapterText.split(''))

const { createTimeline, gsap } = useScrollAnimation()

onMounted(() => {
  if (!sectionRef.value || !kanjiSvgRef.value) return

  gsap.set(imageWrapRef.value, { clipPath: 'inset(50% 50% 50% 50%)', opacity: 0 })
  gsap.set(imageRef.value, { scale: 1.3 })

  const charEls = chapterRef.value?.querySelectorAll('.chapter-char')
  if (charEls) gsap.set(charEls, { opacity: 0, y: 8 })

  const allPaths = kanjiSvgRef.value.querySelectorAll('path')
  allPaths.forEach((p) => {
    const len = p.getTotalLength()
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 0.9 })
  })

  gsap.set(accentDotRef.value, { scale: 0, opacity: 0 })
  gsap.set(subtitleRef.value, { opacity: 0, x: -40 })
  gsap.set(ctaRef.value, { opacity: 0, y: 20 })

  const entrance = createTimeline({ delay: 0.3 })

  entrance.to(imageWrapRef.value, {
    clipPath: 'inset(0% 0% 0% 0%)', opacity: 1,
    duration: 1.8, ease: 'power3.inOut',
  })
  entrance.to(imageRef.value, {
    scale: 1, duration: 2.5, ease: 'power2.out',
  }, '<')

  if (charEls) {
    entrance.to(charEls, {
      opacity: 1, y: 0, duration: 0.03, stagger: 0.04, ease: 'none',
    }, '-=1.0')
  }

  const namiPaths = kanjiSvgRef.value.querySelectorAll('.kanji-nami path')
  const hitoPaths = kanjiSvgRef.value.querySelectorAll('.kanji-hito path')

  entrance.to(namiPaths, {
    strokeDashoffset: 0, duration: 0.5, stagger: 0.07, ease: 'power2.inOut',
  }, '-=0.5')

  entrance.to(hitoPaths, {
    strokeDashoffset: 0, duration: 0.6, stagger: 0.15, ease: 'power2.inOut',
  }, '-=0.2')

  entrance.to(accentDotRef.value, {
    scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(3)',
  }, '-=0.1')

  entrance.to(subtitleRef.value, {
    opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
  }, '-=0.2')

  entrance.to(ctaRef.value, {
    opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
  }, '-=0.3')

  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top', end: 'bottom top', scrub: 1,
    },
  }).to(imageRef.value, { y: 120, scale: 1.1, ease: 'none' })

  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top', end: 'bottom top', scrub: 1,
    },
  }).to(kanjiRef.value, { y: 80, ease: 'none' })

  createTimeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top', end: 'bottom top', scrub: 1,
    },
  }).to('.hero-content', { y: -100, opacity: 0, ease: 'none' })
})
</script>

<style scoped>
.hero { height: 100vh; background: var(--ink); position: relative; overflow: hidden; }

.hero-image-wrap {
  position: absolute; inset: 0; z-index: 1;
  will-change: clip-path;
}
.hero-image {
  width: 100%; height: 100%; object-fit: cover;
  will-change: transform;
}
.hero-image-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(
    180deg,
    rgba(10, 10, 15, 0.2) 0%,
    rgba(10, 10, 15, 0.1) 40%,
    rgba(10, 10, 15, 0.6) 100%
  );
}

.hero-mist {
  position: absolute; inset: 0; z-index: 2;
  background:
    radial-gradient(ellipse 80% 60% at 70% 40%, rgba(196, 160, 85, 0.06) 0%, transparent 70%),
    radial-gradient(ellipse 60% 80% at 30% 60%, rgba(140, 26, 26, 0.03) 0%, transparent 60%);
  pointer-events: none;
}

.hero-kanji-ghost {
  position: absolute; right: -5%; top: 50%; transform: translateY(-50%);
  font-family: 'Noto Serif JP', serif; font-weight: 900; z-index: 3;
  font-size: clamp(200px, 40vw, 500px);
  color: transparent; -webkit-text-stroke: 1.5px rgba(242, 235, 224, 0.08);
  line-height: 1; pointer-events: none; user-select: none; will-change: transform;
}

.hero-content { position: relative; z-index: 10; padding: 0 48px; max-width: 800px; }
.hero-chapter {
  font-size: 10px; letter-spacing: 8px; text-transform: uppercase;
  color: var(--mist); margin-bottom: 32px; min-height: 1.5em;
}
.chapter-char { display: inline-block; will-change: opacity, transform; }
.hero-title-wrap { position: relative; margin-bottom: 8px; display: inline-block; }
.hero-kanji-svg { width: clamp(280px, 50vw, 420px); height: auto; display: block; }
.hero-kanji-svg path { stroke: var(--cream) !important; will-change: stroke-dashoffset; }
.accent-dot {
  position: absolute; right: -8px; bottom: 8px;
  width: 14px; height: 14px; border-radius: 50%;
  background: var(--blood-red); will-change: transform, opacity;
}
.hero-subtitle-row {
  display: flex; align-items: center; gap: 16px;
  margin-top: 24px; margin-bottom: 40px; will-change: opacity, transform;
}
.hero-line { width: 60px; height: 1px; background: var(--blood-red); flex-shrink: 0; }
.hero-subtitle {
  font-style: italic; font-weight: 300; font-size: clamp(14px, 1.8vw, 18px);
  color: var(--mist); letter-spacing: 0.05em;
}
.hero-cta { margin-top: 0; }
.cta-link {
  display: inline-flex; align-items: center; gap: 12px;
  color: var(--cream); text-decoration: none;
  font-size: 11px; letter-spacing: 4px; text-transform: uppercase;
  padding: 14px 0; border-bottom: 1px solid rgba(242, 235, 224, 0.4);
  transition: border-color 0.4s, color 0.4s, letter-spacing 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.cta-link:hover { border-color: var(--blood-red); color: var(--blood-red); letter-spacing: 5px; }
.cta-link:hover .cta-arrow { animation: arrowBounce 0.6s ease infinite; }
.cta-arrow { font-size: 16px; display: inline-block; }
@keyframes arrowBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}
.hero-bottom-fade {
  position: absolute; bottom: 0; left: 0; right: 0; height: 200px; z-index: 5;
  background: linear-gradient(transparent, var(--cream)); pointer-events: none;
}
@media (max-width: 768px) {
  .hero-content { padding: 0 24px; }
  .hero-kanji-svg { width: 260px; }
  .hero-kanji-ghost { -webkit-text-stroke: 1px rgba(242, 235, 224, 0.05); }
  .accent-dot { width: 10px; height: 10px; right: -4px; bottom: 4px; }
}
</style>
