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

    // Split by words to preserve natural line breaks
    const words = text.split(/( )/)
    const allChars: HTMLElement[] = []

    words.forEach((word) => {
      if (word === ' ') {
        // Space between words — allow line break here
        const space = document.createElement('span')
        space.textContent = '\u00A0'
        space.style.display = 'inline-block'
        space.style.opacity = '0'
        space.style.transform = 'translateY(40px)'
        space.setAttribute('aria-hidden', 'true')
        el.appendChild(space)
        allChars.push(space)
        return
      }

      // Wrap each word in a nowrap container so characters don't split across lines
      const wordWrap = document.createElement('span')
      wordWrap.style.display = 'inline-block'
      wordWrap.style.whiteSpace = 'nowrap'
      wordWrap.setAttribute('aria-hidden', 'true')

      word.split('').forEach((char) => {
        const span = document.createElement('span')
        span.textContent = char
        span.style.display = 'inline-block'
        span.style.opacity = '0'
        span.style.transform = 'translateY(40px)'
        wordWrap.appendChild(span)
        allChars.push(span)
      })

      el.appendChild(wordWrap)
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

    tl.to(allChars, {
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
    splitTextReveal,
    gsap,
    ScrollTrigger,
  }
}
