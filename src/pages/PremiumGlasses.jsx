import { useEffect, useState } from 'react'
import { productService } from '../services/productService'
import { categoryService } from '../services/categoryService'
import ProductGrid from '../components/ProductGrid'
import Loading from '../components/Loading'
import CollectionBanner from '../components/CollectionBanner'
import heroImage from '../assets/images/Clearlyvision.png'
import heroImageMobile from '../assets/images/Clearlyvision mobile.png'

const PREMIUM_SLUG = 'premium-glasses'

export default function PremiumGlasses() {
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    categoryService
      .get(PREMIUM_SLUG)
      .then((res) => setCategory(res.data.category))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    productService
      .getAll({ category: PREMIUM_SLUG, sort: 'newest', limit: 100 })
      .then((res) => setProducts(res.data.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <CollectionBanner
        category={category || { name: 'Premium Glasses', slug: PREMIUM_SLUG }}
        image={heroImage}
        mobileImage={heroImageMobile}
        plain
      />

      <div className="container" style={{ paddingBottom: 80 }}>
        <div className="breadcrumb">
          <a href="/">Home</a>
          <span className="sep">/</span>
          <span>Premium Glasses</span>
        </div>

        <div
          className="section-head"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '40px 0 24px' }}
        >
          <h2 style={{ margin: 0 }}>The Premium Collection</h2>
          <span className="result">
            {products.length} {products.length === 1 ? 'piece' : 'pieces'}
          </span>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  )
}
