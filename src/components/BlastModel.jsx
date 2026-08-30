import { useRef, useEffect, useState } from 'react'

export default function BlastModel() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [blastDone, setBlastDone] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          setTimeout(() => setBlastDone(true), 900)
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const progress = 1 - rect.top / window.innerHeight
      const clamped = Math.min(Math.max(progress, 0), 1.5)
      el.style.setProperty('--scroll', clamped)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="bm-section" ref={sectionRef}>
      {/* Blast */}
      <div className={`bm-blast ${visible ? 'bm-blast-active' : ''}`}>
        <div className="bm-ring bm-ring-1" />
        <div className="bm-ring bm-ring-2" />
        <div className="bm-ring bm-ring-3" />
        <div className="bm-flash" />
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="bm-particle"
            style={{
              '--angle': `${(360 / 20) * i}deg`,
              '--dist': `${80 + Math.random() * 60}px`,
              '--delay': `${Math.random() * 0.3}s`,
              '--size': `${3 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>

      {/* Model */}
      <div className={`bm-content ${blastDone ? 'bm-show' : ''}`}>
        <div className="bm-glow" />
        <img src="/models/ai_3d_model-removebg-preview.png" alt="AI Model" className="bm-model-img" />
      </div>
    </section>
  )
}
