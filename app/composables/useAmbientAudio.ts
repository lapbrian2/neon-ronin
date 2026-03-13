/**
 * Web Audio API ambient soundscape — no external audio files.
 * Generates layered rain (brown noise), tonal drones, wind,
 * shakuhachi breath, and random koto chimes.
 */
export function useAmbientAudio() {
  const isPlaying = ref(false)
  const isMuted = ref(true)

  let audioCtx: AudioContext | null = null
  let masterGain: GainNode | null = null
  const nodes: (AudioBufferSourceNode | OscillatorNode)[] = []
  let chimeTimer: ReturnType<typeof setTimeout> | null = null

  function createBrownNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
    const sr = ctx.sampleRate
    const len = sr * duration
    const buf = ctx.createBuffer(2, len, sr)
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch)
      let last = 0
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1
        last = (last + 0.02 * w) / 1.02
        d[i] = last * 3.5
      }
    }
    return buf
  }

  function startNoise(ctx: AudioContext, dest: AudioNode, buffer: AudioBuffer) {
    const src = ctx.createBufferSource()
    src.buffer = buffer
    src.loop = true
    src.connect(dest)
    src.start()
    nodes.push(src)
    return src
  }

  function startLFO(ctx: AudioContext, param: AudioParam, freq: number, depth: number) {
    const lfo = ctx.createOscillator()
    lfo.frequency.value = freq
    const gain = ctx.createGain()
    gain.gain.value = depth
    lfo.connect(gain)
    gain.connect(param)
    lfo.start()
    nodes.push(lfo)
    return lfo
  }

  function init() {
    if (audioCtx) return

    audioCtx = new AudioContext()
    masterGain = audioCtx.createGain()
    masterGain.gain.value = 0
    masterGain.connect(audioCtx.destination)

    const ctx = audioCtx
    const mg = masterGain
    const brown = createBrownNoiseBuffer(ctx, 4)

    // === RAIN LAYER 1: Distant low rumble ===
    const r1g = ctx.createGain()
    r1g.gain.value = 0.12
    const r1f = ctx.createBiquadFilter()
    r1f.type = 'lowpass'
    r1f.frequency.value = 800
    r1f.Q.value = 0.7
    startNoise(ctx, r1f, brown)
    r1f.connect(r1g)
    startLFO(ctx, r1g.gain, 0.15, 0.04)
    r1g.connect(mg)

    // === RAIN LAYER 2: Mid patter ===
    const r2g = ctx.createGain()
    r2g.gain.value = 0.07
    const r2f = ctx.createBiquadFilter()
    r2f.type = 'bandpass'
    r2f.frequency.value = 2500
    r2f.Q.value = 0.4
    startNoise(ctx, r2f, brown)
    r2f.connect(r2g)
    startLFO(ctx, r2g.gain, 0.22, 0.025)
    r2g.connect(mg)

    // === RAIN LAYER 3: High shimmer — rain on tile ===
    const r3g = ctx.createGain()
    r3g.gain.value = 0.035
    const r3f = ctx.createBiquadFilter()
    r3f.type = 'highpass'
    r3f.frequency.value = 6000
    r3f.Q.value = 0.3
    startNoise(ctx, r3f, brown)
    r3f.connect(r3g)
    r3g.connect(mg)

    // === WIND: resonant bandpass with slow frequency sweep ===
    const wg = ctx.createGain()
    wg.gain.value = 0.05
    const wf = ctx.createBiquadFilter()
    wf.type = 'bandpass'
    wf.frequency.value = 400
    wf.Q.value = 2
    startNoise(ctx, wf, brown)
    wf.connect(wg)
    startLFO(ctx, wf.frequency, 0.08, 200)
    wg.connect(mg)

    // === DRONES: detuned pairs for natural beating ===
    const dg = ctx.createGain()
    dg.gain.value = 0.02
    const dLP = ctx.createBiquadFilter()
    dLP.type = 'lowpass'
    dLP.frequency.value = 200
    dg.connect(dLP)
    dLP.connect(mg)

    const d1 = ctx.createOscillator()
    d1.type = 'sine'
    d1.frequency.value = 110
    d1.connect(dg)
    d1.start()
    nodes.push(d1)
    startLFO(ctx, d1.frequency, 0.3, 1.5)

    const d1b = ctx.createOscillator()
    d1b.type = 'sine'
    d1b.frequency.value = 110.5
    d1b.connect(dg)
    d1b.start()
    nodes.push(d1b)

    const d2 = ctx.createOscillator()
    d2.type = 'sine'
    d2.frequency.value = 165
    d2.connect(dg)
    d2.start()
    nodes.push(d2)

    const d2b = ctx.createOscillator()
    d2b.type = 'sine'
    d2b.frequency.value = 164.5
    d2b.connect(dg)
    d2b.start()
    nodes.push(d2b)

    // === SHAKUHACHI BREATH: narrow bandpass noise ===
    const sg = ctx.createGain()
    sg.gain.value = 0.012
    const sf = ctx.createBiquadFilter()
    sf.type = 'bandpass'
    sf.frequency.value = 800
    sf.Q.value = 12
    startNoise(ctx, sf, brown)
    sf.connect(sg)
    startLFO(ctx, sf.frequency, 0.05, 60)
    sg.connect(mg)

    // === KOTO CHIMES: random pentatonic sine bursts ===
    scheduleChimes(ctx, mg)

    isPlaying.value = true
  }

  const pentatonic = [440, 495, 550, 660, 733, 880, 990]

  function playChime(ctx: AudioContext, dest: GainNode) {
    if (ctx.state === 'closed') return
    const freq = pentatonic[Math.floor(Math.random() * pentatonic.length)]
    const pan = ctx.createStereoPanner()
    pan.pan.value = Math.random() * 2 - 1
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.012 + Math.random() * 0.008, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5)
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    osc.connect(g)
    g.connect(pan)
    pan.connect(dest)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 2.5)
  }

  function scheduleChimes(ctx: AudioContext, dest: GainNode) {
    function next() {
      if (!audioCtx || audioCtx.state === 'closed') return
      playChime(ctx, dest)
      chimeTimer = setTimeout(next, 3000 + Math.random() * 6000)
    }
    chimeTimer = setTimeout(next, 2000 + Math.random() * 3000)
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
    if (chimeTimer) { clearTimeout(chimeTimer); chimeTimer = null }
    nodes.forEach((n) => { try { n.stop() } catch {} })
    nodes.length = 0
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
