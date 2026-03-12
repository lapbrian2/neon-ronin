/**
 * Web Audio API ambient soundscape — no external audio files.
 * Generates rain, low city hum, and subtle wind using noise + oscillators.
 */
export function useAmbientAudio() {
  const isPlaying = ref(false)
  const isMuted = ref(true)

  let audioCtx: AudioContext | null = null
  let masterGain: GainNode | null = null
  let rainNode: AudioBufferSourceNode | null = null
  let humOsc: OscillatorNode | null = null
  let humOsc2: OscillatorNode | null = null

  function createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
    const sampleRate = ctx.sampleRate
    const length = sampleRate * duration
    const buffer = ctx.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3
    }
    return buffer
  }

  function init() {
    if (audioCtx) return

    audioCtx = new AudioContext()
    masterGain = audioCtx.createGain()
    masterGain.gain.value = 0
    masterGain.connect(audioCtx.destination)

    // === RAIN (filtered white noise) ===
    const rainGain = audioCtx.createGain()
    rainGain.gain.value = 0.15

    const rainFilter = audioCtx.createBiquadFilter()
    rainFilter.type = 'bandpass'
    rainFilter.frequency.value = 2000
    rainFilter.Q.value = 0.5

    // Secondary filter for rain texture
    const rainLP = audioCtx.createBiquadFilter()
    rainLP.type = 'lowpass'
    rainLP.frequency.value = 5000

    const rainBuffer = createNoiseBuffer(audioCtx, 4)
    rainNode = audioCtx.createBufferSource()
    rainNode.buffer = rainBuffer
    rainNode.loop = true
    rainNode.connect(rainFilter)
    rainFilter.connect(rainLP)
    rainLP.connect(rainGain)
    rainGain.connect(masterGain)
    rainNode.start()

    // === CITY HUM (low frequency drone) ===
    const humGain = audioCtx.createGain()
    humGain.gain.value = 0.04

    humOsc = audioCtx.createOscillator()
    humOsc.type = 'sine'
    humOsc.frequency.value = 55 // low A

    const humFilter = audioCtx.createBiquadFilter()
    humFilter.type = 'lowpass'
    humFilter.frequency.value = 100

    humOsc.connect(humFilter)
    humFilter.connect(humGain)
    humGain.connect(masterGain)
    humOsc.start()

    // Second harmonic
    const hum2Gain = audioCtx.createGain()
    hum2Gain.gain.value = 0.02

    humOsc2 = audioCtx.createOscillator()
    humOsc2.type = 'sine'
    humOsc2.frequency.value = 82 // low E

    humOsc2.connect(hum2Gain)
    hum2Gain.connect(masterGain)
    humOsc2.start()

    isPlaying.value = true
  }

  function fadeIn(duration = 2) {
    if (!audioCtx || !masterGain) return
    if (audioCtx.state === 'suspended') audioCtx.resume()

    isMuted.value = false
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime)
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime)
    masterGain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + duration)
  }

  function fadeOut(duration = 1) {
    if (!audioCtx || !masterGain) return

    isMuted.value = true
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime)
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime)
    masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration)
  }

  function toggle() {
    if (!audioCtx) {
      init()
      fadeIn()
      return
    }

    if (isMuted.value) {
      fadeIn()
    } else {
      fadeOut()
    }
  }

  function dispose() {
    if (rainNode) { try { rainNode.stop() } catch {} }
    if (humOsc) { try { humOsc.stop() } catch {} }
    if (humOsc2) { try { humOsc2.stop() } catch {} }
    if (audioCtx) audioCtx.close()
    audioCtx = null
    masterGain = null
    isPlaying.value = false
    isMuted.value = true
  }

  onUnmounted(() => dispose())

  return {
    isPlaying: readonly(isPlaying),
    isMuted: readonly(isMuted),
    toggle,
    init,
    fadeIn,
    fadeOut,
    dispose,
  }
}
