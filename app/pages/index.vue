<template>
  <div>
    <!-- Preloader -->
    <Preloader @done="onPreloaderDone" />

    <div class="ronin-app" :class="{ 'app-ready': appReady }">
    <!-- Paper grain overlay -->
    <div class="grain-overlay" />

    <!-- Fog layer -->
    <div class="fog-layer" />

    <!-- Maple leaf particles -->
    <ClientOnly>
      <MapleLeaves />
    </ClientOnly>

    <!-- Calligraphy stroke background decorations -->
    <div class="ink-strokes" aria-hidden="true">
      <svg v-for="stroke in inkStrokes" :key="stroke.id"
        viewBox="0 0 40 100"
        class="ink-stroke"
        :style="stroke.style">
        <path :d="stroke.path" stroke="#0a0a0f" stroke-width="3.5" fill="none"
          stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>

    <!-- Custom cursor -->
    <ClientOnly>
      <CursorFollow />
    </ClientOnly>

    <!-- Film grain overlay -->
    <ClientOnly>
      <FilmGrain />
    </ClientOnly>

    <!-- Chapter navigation dots -->
    <ClientOnly>
      <ChapterNav />
    </ClientOnly>

    <!-- Scroll progress bar -->
    <ClientOnly>
      <ScrollProgress />
    </ClientOnly>

    <!-- Ambient audio toggle -->
    <ClientOnly>
      <AudioToggle />
    </ClientOnly>

    <!-- Fixed nav -->
    <nav class="site-nav" :class="{ scrolled: isScrolled }">
      <div class="nav-left">
        <span class="nav-kanji">浪人</span>
        
      </div>
      <div class="nav-right">
        <a v-for="link in navLinks" :key="link.id" :href="'#' + link.id" class="nav-link">
          {{ link.label }}
        </a>
      </div>
    </nav>

    <main>
      <SectionsHeroRain />
      <SectionsTheCity />
      <SectionsThePast />
      <SectionsInterstitial />
      <SectionsTheCode />
      <SectionsInterstitialBlade />
      <SectionsTheNight />
      <SectionsDawn />
    </main>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '浪人 — Brian Lapinski | Creative Engineer',
  meta: [
    { property: 'og:title', content: 'Brian Lapinski — Creative Engineer' },
    { property: 'og:description', content: 'Scroll-driven portfolio built with Nuxt, GSAP, Three.js, and Lenis. The site is the portfolio piece.' },
    { property: 'og:image', content: 'https://neon-ronin.vercel.app/images/ronin-battlefield.webp' },
    { property: 'og:url', content: 'https://neon-ronin.vercel.app' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Brian Lapinski — Creative Engineer' },
    { name: 'twitter:description', content: 'Scroll-driven portfolio. The site IS the portfolio piece.' },
    { name: 'twitter:image', content: 'https://neon-ronin.vercel.app/images/ronin-battlefield.webp' },
  ],
  link: [
    { rel: 'canonical', href: 'https://neon-ronin.vercel.app' },
  ],
})

const appReady = ref(false)

const onPreloaderDone = () => {
  appReady.value = true
}

const isScrolled = ref(false)

const navLinks = [
  { id: 'origin', label: 'Origin' },
  { id: 'code', label: 'Code' },
  { id: 'blade', label: 'Blade' },
  { id: 'battles', label: 'Battles' },
  { id: 'road', label: 'Road' },
]

const inkStrokes = [
  { id: 0, path: 'M10,5 Q30,8 25,40 Q20,70 35,95', style: { left: '8%', top: '10%' } },
  { id: 1, path: 'M5,10 Q15,30 10,50 Q8,70 20,90', style: { left: '4%', top: '30%' } },
  { id: 2, path: 'M30,5 Q10,25 15,45 Q20,65 8,90', style: { right: '6%', top: '45%' } },
  { id: 3, path: 'M8,5 L12,35 Q18,55 10,80 L15,95', style: { left: '12%', top: '65%' } },
  { id: 4, path: 'M10,5 Q30,8 25,40 Q20,70 35,95', style: { right: '10%', top: '80%' } },
]

onMounted(() => {
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 100
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))
})
</script>

<style scoped>
.ronin-app {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

/* Paper grain texture */
.grain-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 45;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 256px 256px;
}

/* Fog layer */
.fog-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 40;
  background: linear-gradient(
    180deg,
    rgba(242, 235, 224, 0) 0%,
    rgba(242, 235, 224, 0) 60%,
    rgba(242, 235, 224, 0.4) 100%
  );
}

/* Calligraphy strokes */
.ink-strokes {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.ink-stroke {
  position: absolute;
  width: 40px;
  height: 120px;
  opacity: 0.15;
}

/* Fixed nav */
.site-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 48px;
  color: var(--cream);
  transition: background 0.6s, backdrop-filter 0.6s, color 0.6s;
}

.site-nav.scrolled {
  background: rgba(242, 235, 224, 0.9);
  backdrop-filter: blur(12px);
  color: var(--ink);
}

.nav-left {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.nav-kanji {
  font-family: 'Noto Serif JP', serif;
  font-weight: 900;
  font-size: 14px;
  letter-spacing: 2px;
}


.nav-right {
  display: flex;
  gap: 32px;
}

.ronin-app {
  opacity: 0;
  transition: opacity 0.8s ease;
}

.ronin-app.app-ready {
  opacity: 1;
}

@media (max-width: 768px) {
  .site-nav {
    padding: 16px 24px;
  }
  .nav-right {
    display: none;
  }
  .ink-strokes {
    display: none;
  }
}
</style>
