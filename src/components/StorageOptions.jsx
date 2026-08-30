import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { storageOptionsService } from '../services/storageOptionsService'

export default function StorageOptions() {
  const [items, setItems] = useState([])

  useEffect(() => {
    storageOptionsService
      .get()
      .then((res) => {
        const opts = res.data.options
        if (opts?.active && opts.collections?.length) {
          const withImages = opts.collections.filter((c) => c.image)
          if (withImages.length) setItems(withImages)
        }
      })
      .catch(() => {})
  }, [])

  if (!items.length) return null

  return (
    <section className="so-section">
      <div className="hw-inner so-grid">
        <div className="so-left">
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
            Curated For You
          </span>
          <h2 className="so-title">Categories</h2>
        </div>

        <div className="so-marquee">
          <div className="so-track">
            {[...items, ...items].map((c, i) => (
              <Link
                key={`${c._id}-${i}`}
                to={`/shop?category=${c.slug}`}
                className="so-card"
              >
                <span className="so-name">{c.name}</span>
                <span className="so-img">
                  <img src={c.image} alt={c.name} loading="lazy" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="hw-inner">
        <span className="hw-bottom-line" />
      </div>
    </section>
  )
}
