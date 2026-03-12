<template>
  <div>
    <!-- Preloader -->
    <ClientOnly>
      <Preloader />
    </ClientOnly>

    <!-- Film grain overlay -->
    <ClientOnly>
      <FilmGrain />
    </ClientOnly>

    <!-- Custom cursor -->
    <ClientOnly>
      <CursorFollow />
    </ClientOnly>

    <!-- Chapter navigation dots -->
    <ClientOnly>
      <ChapterNav />
    </ClientOnly>

    <!-- Audio toggle -->
    <ClientOnly>
      <AudioToggle />
    </ClientOnly>

    <!-- Scroll progress bar -->
    <ClientOnly>
      <ScrollProgress />
    </ClientOnly>

    <main class="neon-ronin">
      <!-- Section 1: Rain — Hero -->
      <SectionsHeroRain />

      <!-- Section 2: The City — Horizontal Scroll -->
      <SectionsTheCity />

      <!-- Section 3: The Past — Ink Wash Flashback -->
      <SectionsThePast />

      <!-- Section 4: The Code — Kinetic Typography -->
      <SectionsTheCode />

      <!-- Section 5: The Night — Action -->
      <SectionsTheNight />

      <!-- Section 6: Dawn — Resolution -->
      <SectionsDawn />
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'NEON RONIN — A Scroll-Driven Anime Experience',
})
</script>

<style scoped>
.neon-ronin {
  position: relative;
  width: 100%;
}
</style>
