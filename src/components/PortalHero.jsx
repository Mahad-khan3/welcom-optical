import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import heroImg from '../assets/images/heronew.jpg'
import heroImgMobile from '../assets/images/heronew-mobile.jpg'

gsap.registerPlugin(ScrollTrigger)

export default function PortalHero() {
  const heroRef = useRef(null)
  const stageRef = useRef(null)

  // layer refs
  const imageRef = useRef(null)
  const duotoneRef = useRef(null)
  const veilRef = useRef(null)
  const panelLRef = useRef(null)
  const panelRRef = useRef(null)
  const dotLRef = useRef(null)
  const dotRRef = useRef(null)
  const wmRef = useRef(null)
  const wmLeftRef = useRef(null)
  const wmRightRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReduced) return

    const hero = heroRef.current
    const image = imageRef.current
    const duotone = duotoneRef.current
    const veil = veilRef.current
    const panelL = panelLRef.current
    const panelR = panelRRef.current
    const dotL = dotLRef.current
    const dotR = dotRRef.current
    const wm = wmRef.current
    const wmL = wmLeftRef.current
    const wmR = wmRightRef.current

    if (!hero) return

    // set initial states via GSAP so revert restores them
    gsap.set(image, { scale: 1 })
    gsap.set(duotone, { opacity: 0 })
    gsap.set(veil, { opacity: 0 })
    gsap.set(wm, { scale: 1, letterSpacing: '-0.02em' })
    gsap.set(wmL, { x: 0 })
    gsap.set(wmR, { x: 0 })
    gsap.set(dotL, { x: 0, y: 0 })
    gsap.set(dotR, { x: 0, y: 0 })

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.15,
        },
      })

      // Animation is split into 3 phases across the timeline:
      // Phase 1 (0 → 0.5): panels fully clear, image settles, wordmark opens
      // Phase 2 (0.5 → 1.0): hold the open state, duotone & veil rise

      // Phase 1 — panels slam outward (complete by 50% of scroll)
      tl.to(panelL, { x: '-105vw', ease: 'none', duration: 0.5 }, 0)
      tl.to(panelR, { x: '105vw', ease: 'none', duration: 0.5 }, 0)

      // wordmark halves fly off-screen with their panels + fade out
      tl.to(wmL, { x: '-110vw', opacity: 0, ease: 'none', duration: 0.5 }, 0)
      tl.to(wmR, { x: '110vw', opacity: 0, ease: 'none', duration: 0.5 }, 0)

      // accent dots fly off-screen with panels
      tl.to(dotL, { x: '-110vw', ease: 'none', duration: 0.5 }, 0)
      tl.to(dotR, { x: '110vw', ease: 'none', duration: 0.5 }, 0)

      // Phase 2 — duotone & veil settle in (phase 2)
      tl.to(duotone, { opacity: 0.35, ease: 'none', duration: 0.5 }, 0.5)
      tl.to(veil, { opacity: 1, ease: 'none', duration: 0.5 }, 0.5)
    })

    return () => {
      try { ctx.revert() } catch { ctx.kill() }
    }
  }, [])

  return (
    <section className="portal-hero" ref={heroRef}>
      <div className="portal-stage" ref={stageRef}>

        {/* 1. Full-bleed photograph */}
        <picture>
          <source media="(max-width: 768px)" srcSet={heroImgMobile} />
          <img
            ref={imageRef}
            className="portal-image"
            src={heroImg}
            alt="Welcom Optical editorial"
          />
        </picture>

        {/* 2. Duotone wash */}
        <div ref={duotoneRef} className="portal-duotone" />

        {/* 3. Radial veil */}
        <div ref={veilRef} className="portal-veil" />

        {/* 4. Two portal panels */}
        <div ref={panelLRef} className="portal-panel portal-panel-l" />
        <div ref={panelRRef} className="portal-panel portal-panel-r" />

        {/* 5. Center accent dots */}
        <span ref={dotLRef} className="portal-dot portal-dot-amber" />
        <span ref={dotRRef} className="portal-dot portal-dot-teal" />

        {/* 6. Wordmark */}
        <div ref={wmRef} className="portal-wordmark">
          <span ref={wmLeftRef} className="portal-wm-half">OPTIC</span>
          <span ref={wmRightRef} className="portal-wm-half">ALS</span>
        </div>

        {/* 7. Corner metadata */}
        <div className="portal-corner portal-tl">
          <span>EST. 2024</span>
        </div>
        <div className="portal-corner portal-tr">
          <span>EYEWEAR</span>
        </div>
        <div className="portal-corner portal-bl">
          <span>KARACHI</span>
        </div>
        <div className="portal-corner portal-br">
          <span>COLLECTION 01</span>
        </div>

      </div>
    </section>
  )
}
