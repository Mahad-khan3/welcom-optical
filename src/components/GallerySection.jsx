import { useEffect, useState } from 'react'
import { galleryService } from '../services/galleryService'

// Two opposing marquee rows. Top row bottoms are flush (flex-end), bottom
// row tops are flush (flex-start) -> the centre line stays clean at any
// scroll position, so images never collide. All items share one portrait size.
const ITEM_W = 260
const ITEM_H = 380
const MIN_PER_ROW = 8

function MarqueeRow({ images, direction, align }) {
  const doubled = [...images, ...images]

  return (
    <div className={`gl-row gl-row-${align}`}>
      <div className={`gl-track gl-${direction}`}>
        {doubled.map((img, i) => {
          return (
            <figure
              key={`${img._id}-${i}`}
              className="gl-item"
              style={{
                '--gl-h': `${ITEM_H}px`,
                '--gl-w': `${ITEM_W}px`,
              }}
            >
              <img src={img.image} alt={img.label || 'Gallery'} loading="lazy" />
              {img.label && <figcaption>{img.label}</figcaption>}
            </figure>
          )
        })}
      </div>
    </div>
  )
}

export default function GallerySection() {
  const [images, setImages] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let alive = true
    galleryService
      .getActive()
      .then((res) => {
        if (alive) setImages((res.data.gallery?.images || []).filter((i) => i.image))
      })
      .catch(() => {})
      .finally(() => alive && setLoaded(true))
    return () => {
      alive = false
    }
  }, [])

  if (!loaded || images.length < 2) return null

  const mid = Math.ceil(images.length / 2)
  const rowTop = images.slice(0, mid)
  const rowBottom = images.slice(mid)

  // repeat until each strip covers wide screens seamlessly
  while (rowTop.length > 0 && rowTop.length < MIN_PER_ROW) rowTop.push(...rowTop)
  while (rowBottom.length > 0 && rowBottom.length < MIN_PER_ROW) rowBottom.push(...rowBottom)

  return (
    <section className="gl-section">
      <span className="lux-bg-text" aria-hidden="true">Gallery</span>
      <div className="lux-inner">
        <div className="home-heading lux-heading">
          <h2>Welcom Optical Gallery</h2>
          <span className="line" />
        </div>
      </div>

      <MarqueeRow images={rowTop} direction="right" align="top" />
      <MarqueeRow images={rowBottom} direction="left" align="bottom" />
    </section>
  )
}
