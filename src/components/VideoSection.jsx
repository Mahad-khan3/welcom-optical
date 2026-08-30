import { useEffect, useState } from 'react'
import { videoService } from '../services/videoService'
import { Play } from 'lucide-react'

function VideoCard({ item }) {
  const inner = (
    <>
      <video
        src={item.video}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <span className="vd-overlay">
        <span className="vd-play">
          <Play size={18} fill="currentColor" />
        </span>
        <span className="vd-cta">Watch Now</span>
      </span>
    </>
  )

  if (!item.link) {
    return <div className="vd-card">{inner}</div>
  }

  return (
    <a
      className="vd-card"
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={item.label || 'Watch video'}
    >
      {inner}
    </a>
  )
}

export default function VideoSection() {
  const [videos, setVideos] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let alive = true
    videoService
      .getActive()
      .then((res) => {
        if (alive) setVideos((res.data.videos?.videos || []).filter((v) => v.video))
      })
      .catch(() => {})
      .finally(() => alive && setLoaded(true))
    return () => {
      alive = false
    }
  }, [])

  if (!loaded || !videos.length) return null

  return (
    <section className="vd-section">
      <span className="lux-bg-text" aria-hidden="true">Videos</span>
      <div className="lux-inner">
        <div className="home-heading lux-heading vd-heading">
          <span
            className="lux-eyebrow"
            style={{
              color: 'var(--text)',
              background: 'var(--bg)',
              display: 'inline-block',
              padding: '5px 12px',
              letterSpacing: 3,
              width: 'fit-content',
            }}
          >
            Our Gallery
          </span>
          <h2>Watch In Motion</h2>
          <span className="line" />
        </div>

        <div className={`vd-row ${videos.length <= 5 ? 'vd-fit' : ''}`}>
          {videos.map((item) => (
            <VideoCard key={item._id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
