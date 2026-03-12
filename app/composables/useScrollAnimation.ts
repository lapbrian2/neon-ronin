import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Composable for scroll-driven GSAP animations.
 * Handles cleanup on unmount to prevent memory leaks.
 */
export function useScrollAnimation() {
  const triggers: ScrollTrigger[] = []
  const tweens: gsap.core.Tween[] = []
  const timelines: gsap.core.Timeline[] = []

  function createTimeline(config?: gsap.TimelineVars) {
    const tl = gsap.timeline(config)
    timelines.push(tl)
    return tl
  }

  function createTrigger(vars: ScrollTrigger.Vars) {
    const trigger = ScrollTrigger.create(vars)
    triggers.push(trigger)
    return trigger
  }

  function createTween(targets: gsap.TweenTarget, vars: gsap.TweenVars) {
    const tween = gsap.to(targets, vars)
    tweens.push(tween)
    return tween
  }

  function createFromTween(targets: gsap.TweenTarget, vars: gsap.TweenVars) {
    const tween = gsap.from(targets, vars)
    tweens.push(tween)
    return tween
  }

  /**
   * Per-character text reveal animation.
   * Wraps each character in a span and staggers translateY + opacity.
   */
  function splitTextReveal(
    el: HTMLElement,
    scrollTriggerVars?: ScrollTrigger.Vars
  ) {
    const text = el.textContent || ''
    el.innerHTML = ''
    el.setAttribute('aria-label', text)

    const chars = text.split('').map((char) => {
      const span = document.createElement('span')
      span.textContent = char === ' ' ? '\u00A0' : char
      span.style.display = 'inline-block'
      span.style.opacity = '0'
      span.style.transform = 'translateY(40px)'
      span.setAttribute('aria-hidden', 'true')
      el.appendChild(span)
      return span
    })

    const tl = createTimeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        end: 'top 40%',
        toggleActions: 'play none none none',
        ...scrollTriggerVars,
      },
    })

    tl.to(chars, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.03,
      ease: 'power3.out',
    })

    return tl
  }

  // Cleanup on unmount — CRITICAL
  onUnmounted(() => {
    tweens.forEach((t) => t.kill())
    timelines.forEach((tl) => tl.kill())
    triggers.forEach((t) => t.kill())
    tweens.length = 0
    timelines.length = 0
    triggers.length = 0
  })

  return {
    createTimeline,
    createTrigger,
    createTween,
    createFromTween,
    splitTextReveal,
    gsap,
    ScrollTrigger,
  }
}
