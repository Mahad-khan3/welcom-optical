import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { categoryService } from '../services/categoryService'
import Loading from '../components/Loading'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    categoryService
      .getAll()
      .then((res) => setCategories(res.data.categories))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container" style={{ paddingBottom: 90 }}>
      <div className="page-hero">
        <p className="section-kicker">Curated by our opticians</p>
        <h1>Collections</h1>
        <p>Explore each collection and find the frame that fits your style.</p>
      </div>

      {loading ? (
        <Loading />
      ) : categories.length === 0 ? (
        <div className="empty-state" style={{ padding: '60px 20px' }}>
          <h3>No collections yet</h3>
          <p>Collections will appear here as soon as they’re published.</p>
        </div>
      ) : (
        <div className="cat-grid">
          {categories.map((cat) => (
            <Link to={`/shop?category=${cat.slug}`} className="cat-tile" key={cat._id}>
              {cat.image ? (
                <img src={cat.image} alt={cat.name} loading="lazy" />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'var(--card)' }} />
              )}
              <div className="overlay">
                <h3>{cat.name}</h3>
                {cat.description && <p>{cat.description}</p>}
                <span className="count">
                  {cat.productCount} pieces · Browse <ArrowRight size={13} style={{ display: 'inline', verticalAlign: '-2px' }} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
