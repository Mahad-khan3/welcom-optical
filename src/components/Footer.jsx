import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const COLS = 46
const ROWS = 13

function PulseCanvas() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = 0
    let h = 0
    let cellW = 0
    let cellH = 0
    const bases = []
    let baseMin = 210
    let baseMax = 240
    let target = 10

    const build = () => {
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      w = rect.width
      h = rect.height
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cellW = w / COLS
      cellH = h / ROWS

      const isDark =
        typeof document !== 'undefined' &&
        document.documentElement.dataset.theme === 'dark'
      baseMin = isDark ? 30 : 210
      baseMax = isDark ? 60 : 240
      target = isDark ? 245 : 10

      bases.length = 0
      for (let i = 0; i < COLS * ROWS; i++) {
        bases.push(baseMin + Math.random() * (baseMax - baseMin))
      }
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      const time = t / 1000
      const cx = (COLS - 1) / 2
      const cy = (ROWS - 1) / 2
      const radius = Math.min(cellW, cellH) * 0.22
      const toWhite = target > baseMin

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const i = r * COLS + c
          const dx = c - cx
          const dy = r - cy
          const dist = Math.abs(dx) + Math.abs(dy)
          let activation = (Math.sin(dist * 0.6 - time * 2.5) + 1) / 2
          activation *= Math.max(0, 1 - dist / 14)
          activation = Math.min(1, Math.max(0, activation))

          const base = bases[i]
          const v = Math.round(
            toWhite
              ? base + (target - base) * activation
              : base - (base - target) * activation
          )
          ctx.fillStyle = `rgb(${v}, ${v}, ${v})`

          const x = c * cellW + cellW / 2
          const y = r * cellH + cellH / 2
          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      raf = requestAnimationFrame(draw)
    }

    build()
    raf = requestAnimationFrame(draw)

    const onResize = () => build()
    window.addEventListener('resize', onResize)

    const observer = new MutationObserver(() => build())
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: 'clamp(150px, 18vw, 240px)' }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  )
}

export default function Footer() {
  return (
    <>
      <footer
        className="footer-root"
        style={{
          backgroundColor: 'var(--fb-bg)',
          color: 'var(--fb-text)',
          transition: 'background-color 0.4s ease, color 0.4s ease',
          borderTop: 'none',
          padding: 0,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '100%',
            padding: '56px clamp(1.25rem, 4vw, 4rem) 0',
            maxWidth: '1600px',
            margin: '0 auto',
          }}
        >
          {/* top row — logo + link columns */}
          <div className="footer-top">
            <Link
              to="/"
              className="footer-brand"
              style={{ fontFamily: '"SF Pro Display", Arial, sans-serif' }}
            >
              <div className="nd-logo-box">
                <span className="nd-logo-dot" />
                <span>W</span>
              </div>
              <span className="footer-brand-text">Welcom Optical</span>
            </Link>

            {/* link columns */}
            <div className="footer-cols">
              <div className="footer-col">
                <Link to="/shop" className="footer-link footer-link-b">
                  Shop
                </Link>
                <Link to="/premium-glasses" className="footer-link footer-link-b">
                  Premium Glasses
                </Link>
                <Link to="/sunglasses" className="footer-link footer-link-b">
                  Sunglasses
                </Link>
                <Link to="/collections" className="footer-link footer-link-b">
                  Collections
                </Link>
                <Link to="/about" className="footer-link footer-link-b">
                  About
                </Link>
              </div>
            </div>
          </div>

          {/* legal — horizontal */}
          <div className="footer-legal">
            <span className="footer-legal-title">Legal</span>
            <div className="footer-legal-links">
              <Link to="/privacy" className="footer-link">
                Privacy Policy
              </Link>
              <Link to="/terms" className="footer-link">
                Terms of Service
              </Link>
              <Link to="/shipping" className="footer-link">
                Shipping Policy
              </Link>
              <Link to="/returns" className="footer-link">
                Return Policy
              </Link>
            </div>
          </div>

          {/* bottom row — copyright + made by */}
          <div className="footer-bottom">
            <p className="footer-copy">
              &copy; 2026, WELCOM OPTICAL. All rights reserved.
            </p>
            <p className="footer-made">Made by Connexus</p>
          </div>
        </div>

        {/* animated dot grid */}
        <PulseCanvas />

        <style>{`
          .footer-root {
            --fb-bg: #f5f5f4;
            --fb-text: #0a0a0a;
            --fb-muted: #9a9a97;
            --fb-dim: #555553;
            --fb-rust: #b4541f;
          }
          [data-theme='dark'] .footer-root {
            --fb-bg: #0a0a0a;
            --fb-text: #f5f5f5;
            --fb-muted: #9a9a97;
            --fb-dim: #a3a3a0;
            --fb-rust: #d98a5b;
          }
          .footer-brand {
            display: flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
            color: var(--fb-text);
            font-weight: 700;
            font-size: 30px;
            line-height: 1;
            transition: color 0.4s ease;
          }
          .footer-brand-size {
            flex-shrink: 0;
          }
          .footer-brand-text {
            font-size: 30px;
            line-height: 1;
          }
          .footer-top {
            display: flex;
            flex-direction: column;
            gap: 40px;
          }
          .footer-cols {
            display: flex;
            gap: 48px;
          }
          .footer-col {
            display: flex;
            flex-direction: column;
            gap: 12px;
            font-family: "SF Pro Display", Arial, sans-serif;
          }
          .footer-link {
            font-weight: 400;
            font-size: 15px;
            color: var(--fb-muted);
            text-decoration: none;
            font-family: "SF Pro Display", Arial, sans-serif;
            transition: color 0.4s ease;
          }
          .footer-link-b {
            font-weight: 600;
            color: var(--fb-text);
          }
          .footer-link:hover,
          .footer-link-b:hover {
            color: var(--fb-rust);
          }
          .footer-bottom {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 32px 0;
            font-family: "SF Pro Display", Arial, sans-serif;
          }
          .footer-legal {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding-top: 24px;
          }
          .footer-legal-title {
            font-weight: 600;
            font-size: 13px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--fb-text);
          }
          .footer-legal-links {
            display: flex;
            flex-wrap: wrap;
            gap: 12px 28px;
          }
          .footer-copy {
            margin: 0;
            font-size: 13px;
            color: var(--fb-dim);
          }
          .footer-made {
            margin: 0;
            font-size: 13px;
            color: var(--fb-muted);
          }
          @media (min-width: 768px) {
            .footer-top {
              flex-direction: row;
              align-items: flex-start;
              justify-content: space-between;
            }
            .footer-cols {
              gap: 96px;
            }
            .footer-bottom {
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
            }
          }
        `}</style>
      </footer>

      {/* Floating BUY NOW */}
      <Link to="/shop" className="sf-buy-now" aria-label="Buy Now">
        <span>BUY NOW</span>
      </Link>
    </>
  )
}