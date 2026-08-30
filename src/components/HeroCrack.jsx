import { useEffect, useState } from 'react'

function jaggedEdge() {
  const pts = []
  const n = 50
  for (let i = 0; i <= n; i++) {
    const y = (i / n) * 100
    const jitter = Math.sin(i * 3.1) * 1.4 + Math.cos(i * 1.7) * 0.9
    pts.push({ x: 50 + jitter, y })
  }
  return pts
}

const EDGE = jaggedEdge()
const edgeStr = EDGE.map(p => `${p.x.toFixed(1)}% ${p.y.toFixed(1)}%`).join(', ')

const LEFT_CLIP = `polygon(0% 0%, ${edgeStr}, 0% 100%)`
const RIGHT_CLIP = `polygon(${edgeStr}, 100% 100%, 100% 0%)`

export default function HeroCrack() {
  const [p, setP] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const hw = document.querySelector('.hero-wrap')
      if (!hw) return
      const rect = hw.getBoundingClientRect()
      const scrollable = hw.offsetHeight - window.innerHeight
      if (scrollable <= 0) return
      setP(Math.min(Math.max(-rect.top / scrollable, 0), 1))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (p < 0.55) return null

  const tearP = Math.min((p - 0.55) / 0.25, 1)
  const splitP = Math.min((p - 0.7) / 0.3, 1)
  const e = splitP * splitP * (3 - 2 * splitP)

  const moveX = e * 55
  const panelOpacity = Math.min(tearP * 5, 1)
  const glowOpacity = tearP > 0.05 ? Math.min(tearP * 3, 0.75) * (1 - e * 0.4) : 0
  const shadowOpacity = tearP > 0.1 ? Math.min(tearP * 2, 0.45) * (1 - e * 0.3) : 0

  return (
    <div className="hero-tear-wrap">
      <div className="hero-tear-glow" style={{ opacity: glowOpacity }} />

      <div
        className="hero-tear-half"
        style={{
          clipPath: LEFT_CLIP,
          transform: `translate3d(-${moveX}vw, 0, 0)`,
          opacity: panelOpacity,
        }}
      />
      <div
        className="hero-tear-half"
        style={{
          clipPath: RIGHT_CLIP,
          transform: `translate3d(${moveX}vw, 0, 0)`,
          opacity: panelOpacity,
        }}
      />

      <div
        className="hero-tear-shadow-left"
        style={{
          opacity: shadowOpacity,
          transform: `translate3d(calc(-${moveX}vw - 30px), 0, 0)`,
        }}
      />
      <div
        className="hero-tear-shadow-right"
        style={{
          opacity: shadowOpacity,
          transform: `translate3d(calc(${moveX}vw + 30px), 0, 0)`,
        }}
      />
    </div>
  )
}
