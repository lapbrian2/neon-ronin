<template>
  <div>
    <!-- Preloader -->
    <ClientOnly>
      <PreloaderClient />
    </ClientOnly>

    <!-- Film grain overlay -->
    <ClientOnly>
      <FilmGrainClient />
    </ClientOnly>

    <!-- Custom cursor -->
    <ClientOnly>
      <CursorFollowClient />
    </ClientOnly>

    <!-- Chapter navigation dots -->
    <ClientOnly>
      <ChapterNavClient />
    </ClientOnly>

    <!-- Audio toggle -->
    <ClientOnly>
      <AudioToggleClient />
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
