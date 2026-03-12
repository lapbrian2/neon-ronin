<template>
  <button
    class="audio-toggle"
    :class="{ 'audio-toggle--active': !isMuted }"
    data-cursor
    @click="toggle"
    :aria-label="isMuted ? 'Enable ambient audio' : 'Mute ambient audio'"
  >
    <div class="audio-bars">
      <span class="audio-bar" />
      <span class="audio-bar" />
      <span class="audio-bar" />
      <span class="audio-bar" />
    </div>
    <span class="audio-label font-body">{{ isMuted ? 'SOUND' : 'ON' }}</span>
  </button>
</template>

<script setup lang="ts">
const { isMuted, toggle } = useAmbientAudio()
</script>

<style scoped>
.audio-toggle {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 0.4rem 0.75rem;
  cursor: none;
  transition: border-color 0.3s ease, background 0.3s ease;
  backdrop-filter: blur(4px);
}

.audio-toggle:hover {
  border-color: rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.03);
}

.audio-toggle--active {
  border-color: var(--neon-red);
}

.audio-toggle--active:hover {
  border-color: var(--neon-red);
  background: rgba(255, 23, 68, 0.05);
}

.audio-bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 12px;
}

.audio-bar {
  display: block;
  width: 2px;
  background: var(--smoke);
  border-radius: 1px;
  transition: background 0.3s ease;
}

/* Muted state — static bars */
.audio-bar:nth-child(1) { height: 4px; }
.audio-bar:nth-child(2) { height: 8px; }
.audio-bar:nth-child(3) { height: 6px; }
.audio-bar:nth-child(4) { height: 3px; }

/* Active state — animated bars */
.audio-toggle--active .audio-bar {
  background: var(--neon-red);
  animation: audio-bounce 1s ease-in-out infinite;
}

.audio-toggle--active .audio-bar:nth-child(1) { animation-delay: 0s; }
.audio-toggle--active .audio-bar:nth-child(2) { animation-delay: 0.15s; }
.audio-toggle--active .audio-bar:nth-child(3) { animation-delay: 0.3s; }
.audio-toggle--active .audio-bar:nth-child(4) { animation-delay: 0.45s; }

@keyframes audio-bounce {
  0%, 100% { height: 3px; }
  50% { height: 12px; }
}

.audio-label {
  font-size: 0.5625rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--smoke);
  transition: color 0.3s ease;
}

.audio-toggle--active .audio-label {
  color: var(--neon-red);
}

@media (max-width: 768px) {
  .audio-toggle {
    bottom: 1rem;
    left: 1rem;
    padding: 0.35rem 0.6rem;
  }

  .audio-label {
    display: none;
  }
}
</style>
