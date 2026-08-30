import { useRef, useEffect, useCallback } from 'react'

const LERP = 0.08

export default function BrandStatement() {
  const containerRef = useRef(null)
  const spotlightRef = useRef({ x: -1000, y: -1000 })
  const targetRef = useRef({ x: -1000, y: -1000 })
  const rafRef = useRef(null)

  const lerp = (a, b, t) => a + (b - a) * t

  const animate = useCallback(() => {
    const s = spotlightRef.current
    const t = targetRef.current
    s.x = lerp(s.x, t.x, LERP)
    s.y = lerp(s.y, t.y, LERP)

    const el = containerRef.current
    if (el) {
      el.style.setProperty('--sx', `${s.x}px`)
      el.style.setProperty('--sy', `${s.y}px`)
    }
    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [animate])

  const handleMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    targetRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }

  const handleLeave = () => {
    targetRef.current = { x: -1000, y: -1000 }
  }

  return (
    <section
      className="brand-hero"
      ref={containerRef}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onMouseLeave={handleLeave}
      onTouchEnd={handleLeave}
    >
      <div className="brand-hero-wrap">
        <span className="brand-hero-text brand-hero-base">welcome optical</span>
        <span className="brand-hero-text brand-hero-reveal" aria-hidden="true">welcome optical</span>
      </div>
    </section>
  )
}
