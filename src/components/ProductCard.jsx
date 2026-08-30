import { Link } from 'react-router-dom'
import { Box } from 'lucide-react'
import { formatCurrency, discountPercent } from '../utils/format'

export default function ProductCard({ product }) {
  const discount = discountPercent(product.price, product.compareAtPrice)
  const secondImage = product.images?.[1]

  return (
    <div className="product-card fade-up">
      <Link to={`/product/${product._id}`} className="media">
        {discount > 0 && <span className="badge">-{discount}%</span>}
        {product.featured && !discount && <span className="badge badge-dark">Featured</span>}
        {product.images?.[0] ? (
          <>
            <img src={product.images[0]} alt={product.name} loading="lazy" />
            {secondImage && (
              <img className="alt-img" src={secondImage} alt="" loading="lazy" />
            )}
          </>
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--text-2)',
            }}
          >
            <Box size={42} />
          </div>
        )}
        {product.model && (
          <span className="badge" style={{ top: 14, right: 14, left: 'auto' }} title="Viewable in 3D">
            3D
          </span>
        )}
        <span className="view-strip">View Product</span>
      </Link>

      <div className="body">
        <Link to={`/product/${product._id}`} className="name">
          {product.name}
        </Link>
        <div className="price-row">
          <span className="price">{formatCurrency(product.price)}</span>
          {product.compareAtPrice > product.price && (
            <span className="compare">{formatCurrency(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
