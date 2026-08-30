import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function GlassesTransition() {
  const sectionRef = useRef(null)
  const modelRef = useRef(null)
  const glassesRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 1.2,
          pin: true,
        },
      })

      // Model slides in from left
      tl.fromTo(
        modelRef.current,
        { x: -120, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3 },
        0
      )

      // Glasses float from right side, rotate and move toward model's face
      tl.fromTo(
        glassesRef.current,
        { x: 300, y: -40, rotation: 25, scale: 0.6, opacity: 0 },
        { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.5 },
        0.1
      )

      // Glasses land on model's face
      tl.to(
        glassesRef.current,
        { x: -180, y: 20, scale: 0.55, rotation: -2, duration: 0.4 },
        0.55
      )

      // Text fades in
      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.3 },
        0.7
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="gt-section" ref={sectionRef}>
      <div className="gt-stage">
        {/* AI Model */}
        <div className="gt-model" ref={modelRef}>
          <img src="/models/ai 3d model.png" alt="AI Model" />
        </div>

        {/* Floating glasses */}
        <div className="gt-glasses" ref={glassesRef}>
          <img src="/images/product-anatomy.svg" alt="Glasses" />
        </div>

        {/* Text */}
        <div className="gt-text" ref={textRef}>
          <span className="gt-kicker">Try It On</span>
          <h2 className="gt-heading">See how it looks on you</h2>
          <p className="gt-desc">
            Experience our premium eyewear — designed for style, built for comfort.
          </p>
        </div>
      </div>
    </section>
  )
}
