import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin(() => {
  const lenis = new Lenis({
    lerp: 0.07,
    duration: 1.2,
    smoothWheel: true,
  })

  // Connect Lenis → GSAP ScrollTrigger (the golden chain)
  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  return {
    provide: {
      lenis,
    },
  }
})
