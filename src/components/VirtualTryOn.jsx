import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Sun, Moon, Camera, ChevronDown, ChevronUp } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import modelImg from '../assets/images/closemustafa.png'
import frameYellow from '../assets/images/yellow.png'
import frameGolden from '../assets/images/goldern.png'
import frameBrown from '../assets/images/browwn.png'
import lensGreen from '../assets/images/green lence.png'
import lensBrown from '../assets/images/brone lence.png'

const FRAMES = [
  { id: 'yellow', name: 'Yellow', src: frameYellow, scale: 1.45, yOff: -1.2 },
  { id: 'golden', name: 'Golden', src: frameGolden, scale: 1.50, yOff: -1.0 },
  { id: 'brown', name: 'Brown', src: frameBrown, scale: 1.48, yOff: -1.1 },
]

const LENSES = [
  { id: 'clear', name: 'Clear', color: null },
  { id: 'green', name: 'Green', color: 'rgba(34,139,34,0.30)', overlay: lensGreen },
  { id: 'brown', name: 'Brown', color: 'rgba(139,90,43,0.30)', overlay: lensBrown },
]

const ZOOM_LEVELS = [1, 1.2, 1.45, 1.75, 2.2]
const CAPTURE_ZOOM = 2.2

const FALLBACK = { cx: 50, cy: 38, ew: 22, angle: 0, fh: 32, lx: 44, ly: 36, rx: 56, ry: 36 }

function getLandmarksPercent(landmarks) {
  const leftOuter = landmarks[33]
  const rightOuter = landmarks[263]
  const leftInner = landmarks[133]
  const rightInner = landmarks[362]
  const noseBridge = landmarks[6]
  const forehead = landmarks[10]
  const chin = landmarks[152]

  const lx = ((leftOuter.x + leftInner.x) / 2) * 100
  const ly = ((leftOuter.y + leftInner.y) / 2) * 100
  const rx = ((rightOuter.x + rightInner.x) / 2) * 100
  const ry = ((rightOuter.y + rightInner.y) / 2) * 100

  const cx = ((leftOuter.x + rightOuter.x) / 2) * 100
  const cy = ((leftOuter.y + rightOuter.y) / 2) * 100

  const ew = Math.sqrt(
    Math.pow(rightOuter.x - leftOuter.x, 2) +
    Math.pow(rightOuter.y - leftOuter.y, 2)
  ) * 100

  const angle = Math.atan2(
    rightOuter.y - leftOuter.y,
    rightOuter.x - leftOuter.x
  ) * (180 / Math.PI)

  const fh = (chin.y - forehead.y) * 100

  const bridgeW = Math.sqrt(
    Math.pow(rightInner.x - leftInner.x, 2) +
    Math.pow(rightInner.y - leftInner.y, 2)
  ) * 100

  return { cx, cy, ew, angle, fh, lx, ly, rx, ry, bridgeW }
}

export default function VirtualTryOn() {
  const { theme, toggle } = useTheme()

  const [selectedFrame, setSelectedFrame] = useState(null)
  const [selectedLens, setSelectedLens] = useState(LENSES[0])
  const [zoomIdx, setZoomIdx] = useState(0)
  const [faceData, setFaceData] = useState(null)
  const [detecting, setDetecting] = useState(true)
  const [frameTransition, setFrameTransition] = useState(false)
  const [captured, setCaptured] = useState(false)
  const [transitioning, setTransitioning] = useState(false)

  const modelWrapRef = useRef(null)
  const modelImgRef = useRef(null)
  const containerRef = useRef(null)
  const detectorRef = useRef(null)

  const zoom = ZOOM_LEVELS[zoomIdx]
  const fp = faceData || FALLBACK

  useEffect(() => {
    let cancelled = false
    async function detect() {
      try {
        const { FaceLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision')
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
        )
        const detector = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/face_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'IMAGE',
          numFaces: 1,
        })
        detectorRef.current = detector

        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = modelImg
        await new Promise((r, e) => { img.onload = r; img.onerror = e })

        const result = detector.detect(img)
        if (cancelled) return

        if (result.faceLandmarks && result.faceLandmarks.length > 0) {
          const lm = result.faceLandmarks[0]
          setFaceData(getLandmarksPercent(lm))
        } else {
          setFaceData(FALLBACK)
        }
      } catch (err) {
        console.warn('Face detection failed, using fallback:', err)
        setFaceData(FALLBACK)
      } finally {
        if (!cancelled) setDetecting(false)
      }
    }
    detect()
    return () => { cancelled = true }
  }, [])

  const glassesStyle = useMemo(() => {
    if (!selectedFrame) return null
    const frame = FRAMES.find(f => f.id === selectedFrame.id) || FRAMES[0]
    const w = fp.ew * frame.scale
    const h = w * 0.38
    return {
      position: 'absolute',
      top: `${fp.cy + frame.yOff}%`,
      left: `${fp.cx}%`,
      width: `${w}%`,
      height: `${h}%`,
      transform: `translate(-50%, -50%) rotate(${fp.angle}deg)`,
      transformOrigin: 'center center',
      pointerEvents: 'none',
      userSelect: 'none',
      filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.35))',
      zIndex: 15,
    }
  }, [selectedFrame, fp])

  const leftLensStyle = useMemo(() => {
    if (!selectedLens.color) return null
    const lensW = fp.ew * 0.68
    const lensH = lensW * 0.55
    return {
      position: 'absolute',
      top: `${fp.cy}%`,
      left: `${fp.lx}%`,
      width: `${lensW}%`,
      height: `${lensH}%`,
      transform: `translate(-50%, -50%) rotate(${fp.angle}deg)`,
      borderRadius: '50%',
      background: selectedLens.color,
      mixBlendMode: 'multiply',
      pointerEvents: 'none',
      userSelect: 'none',
      zIndex: 16,
      opacity: 1,
    }
  }, [selectedLens, fp])

  const rightLensStyle = useMemo(() => {
    if (!selectedLens.color) return null
    const lensW = fp.ew * 0.68
    const lensH = lensW * 0.55
    return {
      position: 'absolute',
      top: `${fp.cy}%`,
      left: `${fp.rx}%`,
      width: `${lensW}%`,
      height: `${lensH}%`,
      transform: `translate(-50%, -50%) rotate(${fp.angle}deg)`,
      borderRadius: '50%',
      background: selectedLens.color,
      mixBlendMode: 'multiply',
      pointerEvents: 'none',
      userSelect: 'none',
      zIndex: 16,
      opacity: 1,
    }
  }, [selectedLens, fp])

  const handleFrameSelect = useCallback((f) => {
    if (selectedFrame?.id === f.id) {
      setFrameTransition(true)
      setTimeout(() => { setSelectedFrame(null); setFrameTransition(false) }, 250)
      return
    }
    setFrameTransition(true)
    setTimeout(() => { setSelectedFrame(f); setFrameTransition(false) }, 250)
  }, [selectedFrame])

  const handleLensSelect = useCallback((l) => {
    setSelectedLens(l)
  }, [])

  const zoomIn = () => setZoomIdx(i => Math.min(i + 1, ZOOM_LEVELS.length - 1))
  const zoomOut = () => {
    if (captured) {
      setCaptured(false)
      setTransitioning(true)
      setTimeout(() => setTransitioning(false), 600)
    }
    setZoomIdx(i => Math.max(i - 1, 0))
  }
  const resetZoom = () => {
    if (captured) {
      setCaptured(false)
      setTransitioning(true)
      setTimeout(() => setTransitioning(false), 600)
    }
    setZoomIdx(0)
  }

  const handleCapture = useCallback(() => {
    if (captured) {
      setCaptured(false)
      setTransitioning(true)
      setZoomIdx(0)
      setTimeout(() => setTransitioning(false), 600)
      return
    }
    setTransitioning(true)
    setCaptured(true)
    setZoomIdx(ZOOM_LEVELS.length - 1)
    setTimeout(() => setTransitioning(false), 600)
  }, [captured])

  const containerTransform = useMemo(() => {
    const originX = fp.cx
    const originY = fp.cy
    return `scale(${zoom})`
  }, [zoom])

  const containerOrigin = `${fp.cx}% ${fp.cy}%`

  return (
    <section className="vto-full" ref={containerRef}>
      {/* FRAMES — far left */}
      <div className="vto-panel vto-panel-left">
        <span className="vto-panel-label">FRAMES</span>
        <div className="vto-panel-list">
          {FRAMES.map(f => (
            <button
              key={f.id}
              className={`vto-card ${selectedFrame?.id === f.id ? 'vto-active' : ''}`}
              onClick={() => handleFrameSelect(f)}
            >
              <div className="vto-card-img">
                <img src={f.src} alt={f.name} draggable={false} />
              </div>
              <span className="vto-card-name">{f.name}</span>
              {selectedFrame?.id === f.id && <span className="vto-card-check">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* CENTER — Model + overlays */}
      <div className={`vto-center ${captured ? 'vto-captured-mode' : ''}`}>
        <div
          className={`vto-model-area ${transitioning ? 'vto-transitioning' : ''}`}
          style={{
            transform: containerTransform,
            transformOrigin: containerOrigin,
          }}
        >
          <img
            ref={modelImgRef}
            src={modelImg}
            alt="Model"
            className="vto-model-img"
            draggable={false}
          />

          {selectedFrame && glassesStyle && (
            <img
              key={`glasses-${selectedFrame.id}`}
              src={selectedFrame.src}
              alt={selectedFrame.name}
              className={`vto-glasses ${frameTransition ? 'vto-t-fade' : 'vto-t-show'}`}
              style={glassesStyle}
              draggable={false}
            />
          )}

          {selectedFrame && selectedLens.color && leftLensStyle && (
            <div
              key={`llens-${selectedLens.id}`}
              className={`vto-lens ${frameTransition ? 'vto-t-fade' : 'vto-t-show'}`}
              style={leftLensStyle}
            />
          )}

          {selectedFrame && selectedLens.color && rightLensStyle && (
            <div
              key={`rlens-${selectedLens.id}`}
              className={`vto-lens ${frameTransition ? 'vto-t-fade' : 'vto-t-show'}`}
              style={rightLensStyle}
            />
          )}

          {captured && selectedFrame && (
            <div className="vto-capture-border" />
          )}
        </div>

        {/* Controls below model */}
        <div className="vto-controls-row">
          <div className="vto-zoom-bar">
            <button className="vto-zbtn" onClick={zoomOut} disabled={zoomIdx === 0 && !captured} title="Zoom out">
              <ChevronDown size={16} />
            </button>
            <span className="vto-zlabel" onClick={resetZoom} title="Reset zoom">
              🔍 {Math.round(zoom * 100)}%
            </span>
            <button className="vto-zbtn" onClick={zoomIn} disabled={zoomIdx >= ZOOM_LEVELS.length - 1} title="Zoom in">
              <ChevronUp size={16} />
            </button>
          </div>

          <button className="vto-capture-btn" onClick={handleCapture}>
            <Camera size={14} style={{ marginRight: 6 }} />
            {captured ? 'Exit Close-Up' : 'Zoom & Capture'}
          </button>
        </div>
      </div>

      {/* LENSES — far right */}
      <div className="vto-panel vto-panel-right">
        <span className="vto-panel-label">LENSES</span>
        <div className="vto-panel-list">
          {LENSES.map(l => (
            <button
              key={l.id}
              className={`vto-card ${selectedLens.id === l.id ? 'vto-active' : ''}`}
              onClick={() => handleLensSelect(l)}
            >
              <div className="vto-card-img">
                {l.color ? (
                  <div
                    className="vto-lens-swatch"
                    style={{ background: l.color.replace(/[\d.]+\)$/, '0.85)') }}
                  />
                ) : (
                  <div className="vto-lens-clear" />
                )}
              </div>
              <span className="vto-card-name">{l.name}</span>
              {selectedLens.id === l.id && <span className="vto-card-check">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* BUY NOW */}
      <Link to="/shop" className="vto-buy-now" aria-label="Buy Now">
        <span>BUY NOW</span>
      </Link>

      {/* Theme toggle */}
      <button className="vto-theme-btn" onClick={toggle} aria-label="Toggle theme">
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Detecting overlay */}
      {detecting && (
        <div className="vto-detecting">
          <div className="vto-spinner" />
          <span>Detecting face landmarks…</span>
        </div>
      )}
    </section>
  )
}
