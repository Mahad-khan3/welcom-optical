import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { videoService } from '../services/videoService'

const GAP = 8

export default function ProductVideoStrip() {
  const [videos, setVideos] = useState([])
  const viewportRef = useRef(null)
  const [vw, setVw] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [index, setIndex] = useState(0)
  const touchRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    let alive = true
    videoService
      .getActive()
      .then((res) => {
        if (alive) setVideos((res.data.videos?.videos || []).filter((v) => v.video).slice(0, 3))
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    const measure = () => {
      if (viewportRef.current) setVw(viewportRef.current.offsetWidth)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const cardW = isMobile ? 96 : 118
  const step = cardW + GAP
  const perView = Math.min(3, vw ? Math.max(1, Math.floor((vw + GAP) / step)) : 3)
  const maxIndex = Math.max(0, videos.length - perView)
  const current = Math.min(index, maxIndex)

  const go = (i) => setIndex(Math.min(Math.max(i, 0), maxIndex))

  const onTouchStart = (e) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchRef.current.x
    const dy = e.changedTouches[0].clientY - touchRef.current.y
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
      go(current + (dx < 0 ? 1 : -1))
    }
  }

  if (!videos.length) return null

  const showNav = videos.length > perView

  return (
    <div className="pd-videos-wrap">
      <div ref={viewportRef} className="pd-videos" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="pd-videos-track" style={{ transform: `translateX(-${current * step}px)` }}>
          {videos.map((item) => (
            <div key={item._id} className="pd-video-card">
              <video src={item.video} autoPlay muted loop playsInline preload="metadata" />
              {item.link && (
                <a
                  className="pd-video-link"
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label || 'Watch video'}
                />
              )}
            </div>
          ))}
        </div>

        {showNav && (
          <>
            <button
              type="button"
              className="pd-videos-arrow prev"
              onClick={() => go(current - 1)}
              disabled={current === 0}
              aria-label="Previous video"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              className="pd-videos-arrow next"
              onClick={() => go(current + 1)}
              disabled={current === maxIndex}
              aria-label="Next video"
            >
              <ChevronRight size={14} />
            </button>
          </>
        )}
      </div>

      {showNav && (
        <div className="pd-videos-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={i === current ? 'on' : ''}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
