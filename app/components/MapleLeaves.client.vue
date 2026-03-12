<template>
  <div class="maple-leaves">
    <svg v-for="leaf in leaves" :key="leaf.id" class="maple-leaf"
      :width="leaf.size" :height="leaf.size" viewBox="0 0 24 24"
      :fill="leaf.color"
      :style="{
        left: leaf.left,
        top: '-30px',
        animationDelay: leaf.delay + 's',
        animationDuration: leaf.duration + 's',
        '--drift': leaf.drift + 'px',
      }">
      <path d="M12 2 L14 7 L19 5 L16 10 L22 12 L16 14 L19 19 L14 17 L12 22 L10 17 L5 19 L8 14 L2 12 L8 10 L5 5 L10 7 Z" />
    </svg>
  </div>
</template>

<script setup lang="ts">
const leaves = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${(7 + i * 8.3) % 95}%`,
  size: 12 + (i % 5) * 3,
  delay: i * 1.7,
  duration: 15 + (i % 4) * 5,
  drift: ((i * 37) % 200) - 100,
  color: i % 3 === 0 ? '#8c1a1a' : i % 3 === 1 ? '#a04828' : '#c87040',
}))
</script>

<style scoped>
.maple-leaves {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  overflow: hidden;
}

.maple-leaf {
  position: absolute;
  opacity: 0.7;
  animation: leafFall linear infinite;
}
</style>
