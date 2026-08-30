import { useEffect, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { showcaseService } from '../services/showcaseService'

gsap.registerPlugin(ScrollTrigger)

const PLACEHOLDER = '/images/product-placeholder.svg'

function SideItem({ item, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        aspectRatio: '1',
        overflow: 'hidden',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: isActive ? 'scale(1.06)' : 'scale(1)',
        transition: 'transform 0.3s var(--ease)',
      }}
      aria-label={item.label || 'Select item'}
    >
      <img
        src={item.image || PLACEHOLDER}
        alt={item.label || 'option'}
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none',
          userSelect: 'none',
          filter: isActive ? 'none' : 'grayscale(0.2)',
          transition: 'filter 0.3s',
        }}
      />
    </button>
  )
}

function ColumnHeading({ children }) {
  return (
    <div
      className="ps-col-head"
      style={{
        width: '100%',
        textAlign: 'center',
        marginBottom: 4,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: 'var(--text)',
        }}
      >
        {children}
      </span>
      <div
        style={{
          width: '50%',
          height: 2,
          background: 'var(--line)',
          margin: '7px auto 0',
          borderRadius: 2,
        }}
      />
    </div>
  )
}

export default function ProductShowcase() {
  const [showcase, setShowcase] = useState(null)
  const [activeFrame, setActiveFrame] = useState(-1)
  const [activeLens, setActiveLens] = useState(-1)
  const [zoom, setZoom] = useState(1)
  const [displayed, setDisplayed] = useState('')
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    showcaseService
      .getActive()
      .then((res) => {
        const s = res.data.showcase
        if (s) {
          setShowcase(s)
          setDisplayed(s.centerDefault || PLACEHOLDER)
        }
        // This section's height changes once its data loads, which shifts
        // everything below (banners + pinned sliders). Re-measure GSAP pins.
        requestAnimationFrame(() => ScrollTrigger.refresh())
      })
      .catch(() => {})
  }, [])

  const handleFrameClick = (i) => {
    const next = activeFrame === i ? -1 : i
    setActiveFrame(next)
    setCompact(false)
    const frame = showcase.frames?.[next]
    if (frame?.centerImage) {
      setDisplayed(frame.centerImage)
    } else {
      setDisplayed(showcase.centerDefault || PLACEHOLDER)
    }
  }

  const handleLensClick = (i) => {
    const next = activeLens === i ? -1 : i
    setActiveLens(next)
    const lens = showcase.lenses?.[next]
    if (lens?.centerImage) {
      setCompact(true)
      setDisplayed(lens.centerImage)
    } else {
      setCompact(false)
      setDisplayed(showcase.centerDefault || PLACEHOLDER)
    }
  }

  // root stays mounted (even while loading/empty) so the hero page-slide
  // transition can always target it
  if (!showcase) {
    return <div className="ps-root" style={{ marginBottom: 40 }} />
  }

  const frames = showcase.frames || []
  const lenses = showcase.lenses || []

  const rootStyle = {
    borderTop: '1px solid var(--line)',
    borderBottom: '1px solid var(--line)',
    padding: '28px 32px',
    marginBottom: 40,
  }

  if (!frames.length && !lenses.length) {
    return <div className="ps-root" style={rootStyle} />
  }

  return (
    <div className="ps-root" style={rootStyle}>
      <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 26px' }}>
        <p
          className="section-kicker"
          style={{
            color: 'var(--bg)',
            background: 'var(--text)',
            display: 'inline-block',
            padding: '6px 16px',
            letterSpacing: 3,
          }}
        >
          Virtual mirror
        </p>
        <h2 className="section-title">Try Your Frame</h2>
      </div>
      <div
        className="ps-main"
        style={{
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          gap: 24,
          minHeight: 420,
        }}
      >
        {/* Left - Frames */}
        {frames.length > 0 && (
          <div
            className="ps-side ps-frames"
            style={{
              width: 110,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              flexShrink: 0,
              border: '1px solid var(--line)',
              borderRadius: '18px 18px 0 0',
              padding: '14px 10px',
            }}
          >
            <ColumnHeading>Frames</ColumnHeading>
            <div className="ps-items">
              {frames.map((f, i) => (
                <div
                  key={f._id || i}
                  style={{
                    width: '100%',
                    padding: '10px 0',
                    borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                  }}
                >
                  <SideItem
                    item={f}
                  isActive={activeFrame === i}
                  onClick={() => handleFrameClick(i)}
                />
              </div>
            ))}
            </div>
          </div>
        )}

        {/* Center - Main image */}
        <div
          className="ps-center"
          style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 380,
          }}
        >
          <img
            src={displayed || PLACEHOLDER}
            alt="Product preview"
            draggable={false}
            style={{
              maxWidth: compact ? '52%' : '100%',
              maxHeight: compact ? 320 : '100%',
              objectFit: 'contain',
              pointerEvents: 'none',
              userSelect: 'none',
              transform: `scale(${zoom})`,
            }}
          />

          {/* Zoom controls */}
          <div
            style={{
              position: 'absolute',
              bottom: 14,
              right: 14,
              display: 'flex',
              gap: 6,
              background: 'var(--glass)',
              backdropFilter: 'blur(12px)',
              borderRadius: 10,
              padding: 4,
              border: '1px solid var(--border)',
            }}
          >
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.1, 1.4))}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: 'none',
                background: zoom >= 1.4 ? 'var(--border)' : 'transparent',
                color: 'var(--text)',
                display: 'grid',
                placeItems: 'center',
                cursor: zoom >= 1.4 ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
              title="Zoom in"
            >
              <span style={{ fontSize: 19, lineHeight: 1, fontWeight: 600 }}>+</span>
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.1, 0.8))}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: 'none',
                background: zoom <= 0.8 ? 'var(--border)' : 'transparent',
                color: 'var(--text)',
                display: 'grid',
                placeItems: 'center',
                cursor: zoom <= 0.8 ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
              title="Zoom out"
            >
              <span style={{ fontSize: 21, lineHeight: 1, fontWeight: 600, marginTop: -3 }}>−</span>
            </button>
            {zoom !== 1 && (
              <button
                onClick={() => setZoom(1)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text)',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
                title="Reset zoom"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>

          {zoom !== 1 && (
            <div
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                background: 'var(--glass)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '4px 10px',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text)',
              }}
            >
              {Math.round(zoom * 100)}%
            </div>
          )}
        </div>

        {/* Right - Lenses */}
        {lenses.length > 0 && (
          <div
            className="ps-side ps-lenses"
            style={{
              width: 110,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              flexShrink: 0,
              border: '1px solid var(--line)',
              borderRadius: '18px 18px 0 0',
              padding: '14px 10px',
            }}
          >
            <ColumnHeading>Lenses</ColumnHeading>
            <div className="ps-items">
              {lenses.map((l, i) => (
                <div
                  key={l._id || i}
                  style={{
                    width: '100%',
                    padding: '10px 0',
                    borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                  }}
                >
                  <SideItem
                    item={l}
                    isActive={activeLens === i}
                    onClick={() => handleLensClick(i)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
