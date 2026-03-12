<template>
  <div class="layout">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Default layout — minimal wrapper, Lenis handles scroll globally via plugin
</script>

<style scoped>
.layout {
  position: relative;
  width: 100%;
  overflow-x: hidden;
}
</style>
