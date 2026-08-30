import ProductCard from './ProductCard'

export default function ProductGrid({ products = [], cols }) {
  if (!products.length) {
    return (
      <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
        <h3>No products found</h3>
        <p>Try adjusting your filters or check back soon.</p>
      </div>
    )
  }
  return (
    <div
      className="product-grid"
      style={cols ? { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` } : undefined}
    >
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  )
}
