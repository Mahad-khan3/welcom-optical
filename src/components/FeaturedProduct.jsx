import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Plus, Minus } from 'lucide-react'
import { productSpotlightService } from '../services/productSpotlightService'
import { useCart } from '../context/CartContext'
import { formatCurrency, discountPercent } from '../utils/format'

export default function FeaturedProduct() {
  const [spotlight, setSpotlight] = useState(null)
  const [activeImg, setActiveImg] = useState(0)
  const [descOpen, setDescOpen] = useState(true)
  const { addItem } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    productSpotlightService
      .get()
      .then((res) => {
        const spot = res.data.spotlight
        if (spot?.active && spot.product) setSpotlight(spot)
      })
      .catch(() => {})
  }, [])

  if (!spotlight) return null

  const product = spotlight.product
  const images = (product.images || []).filter(Boolean).slice(0, 4)
  const discount = discountPercent(product.price, product.compareAtPrice)
  const shortDesc =
    product.description && product.description.length > 160
      ? `${product.description.slice(0, 157)}…`
      : product.description

  const buyNow = () => {
    addItem(product)
    navigate('/checkout')
  }

  return (
    <section className="pd-section">
      <span className="pd-bg-text" aria-hidden="true">{product.name}</span>
      <div className="pd-inner">
        <div className="home-heading pd-heading">
          <h2>Spotlight</h2>
          <span className="line" />
        </div>

        <div className="pd-layout">
          {/* Left: vertical oval thumbnails */}
          <div className="pd-thumbs">
            {images.map((img, i) => (
              <button
                key={`${img}-${i}`}
                type="button"
                className={`pd-thumb ${i === activeImg ? 'active' : ''}`}
                onClick={() => setActiveImg(i)}
                aria-label={`View image ${i + 1}`}
              >
                <img src={img} alt="" loading="lazy" />
              </button>
            ))}
          </div>

          {/* Center: big main image */}
          <div className="pd-media">
            {discount > 0 && <span className="badge">-{discount}%</span>}
            {images[activeImg] ? (
              <img src={images[activeImg]} alt={product.name} />
            ) : (
              <div className="pd-empty">
                <Box size={64} />
              </div>
            )}
          </div>

          {/* Right: name / description / buy now */}
          <div className="pd-info">
            <h3 className="pd-name">{product.name}</h3>
            {shortDesc ? (
              <div className="pd-desc-wrap">
                <button
                  type="button"
                  className="pd-desc-toggle"
                  onClick={() => setDescOpen((v) => !v)}
                  aria-expanded={descOpen}
                >
                  <span>Description</span>
                  <i className="pd-desc-icon">{descOpen ? <Minus size={14} /> : <Plus size={14} />}</i>
                </button>
                {descOpen && <p className="pd-desc">{shortDesc}</p>}
              </div>
            ) : null}
            <div className="pd-price-row">
              <span className="price">{formatCurrency(product.price)}</span>
              {product.compareAtPrice > product.price && (
                <span className="compare">{formatCurrency(product.compareAtPrice)}</span>
              )}
            </div>
            <button
              type="button"
              className="btn btn-primary btn-lg pd-buy spot-buy"
              onClick={buyNow}
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? 'Buy Now' : 'Out of stock'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
