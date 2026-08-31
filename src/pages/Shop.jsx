import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { productService } from '../services/productService'
import { categoryService } from '../services/categoryService'
import ProductGrid from '../components/ProductGrid'
import Loading from '../components/Loading'
import SearchBar from '../components/SearchBar'
import CollectionBanner from '../components/CollectionBanner'
import bannerDesktop from '../assets/images/Clearlyvision.png'
import bannerMobile from '../assets/images/Clearlyvision mobile.png'
import newOutlook from '../assets/images/the new outlok.png'

const CATEGORY_BANNER_FALLBACKS = {
  sunglasses: newOutlook,
  'sun-glasses': newOutlook,
  'sun glasses': newOutlook,
}

const categoryBannerImage = (category) => {
  if (!category) return undefined
  if (category.image) return category.image
  return (
    CATEGORY_BANNER_FALLBACKS[category.slug] ||
    CATEGORY_BANNER_FALLBACKS[category.name?.toLowerCase().trim()]
  )
}

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'name_asc', label: 'Name A–Z' },
]

const PRICE_RANGES = [
  { label: 'All prices', min: 0, max: 100000 },
  { label: 'Under $150', min: 0, max: 150 },
  { label: '$150 – $300', min: 150, max: 300 },
  { label: '$300 – $500', min: 300, max: 500 },
  { label: 'Over $500', min: 500, max: 100000 },
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { category: categoryRoute } = useParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)

  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || categoryRoute || ''
  const featured = searchParams.get('featured') || ''
  const sort = searchParams.get('sort') || 'newest'
  const rangeIdx = searchParams.get('price') || '0'

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (!value) next.delete(key)
    else next.set(key, value)
    next.set('page', '1')
    setSearchParams(next)
  }

  useEffect(() => {
    setLoading(true)
    const range = PRICE_RANGES[Number(rangeIdx)] || PRICE_RANGES[0]
    productService
      .getAll({
        q: q || undefined,
        category: category || undefined,
        featured: featured ? 'true' : undefined,
        min: range.min || undefined,
        max: range.max === 100000 ? undefined : range.max,
        sort,
        page,
        limit: 12,
      })
      .then((res) => {
        setProducts(res.data.products)
        setTotal(res.data.total)
        setPages(res.data.pages)
      })
      .catch(() => {
        setProducts([])
        setTotal(0)
        setPages(1)
      })
      .finally(() => setLoading(false))
  }, [q, category, featured, sort, rangeIdx, page])

  useEffect(() => {
    categoryService
      .getAll()
      .then((res) => setCategories(res.data.categories))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setPage(1)
  }, [q, category, featured, sort, rangeIdx])

  const activeCategory = categories.find((c) => c.slug === category)

  return (
    <div style={{ paddingBottom: 80 }}>
      <section className="shop-banner">
        <picture>
          <source media="(max-width: 767px)" srcSet={bannerMobile} />
          <img src={bannerDesktop} alt="Welcom Optical banner" loading="lazy" />
        </picture>
      </section>

      {activeCategory ? (
        <CollectionBanner category={activeCategory} image={categoryBannerImage(activeCategory)} plain />
      ) : (
        <div className="page-hero">
          <p className="section-kicker">The collection</p>
          <h1>Shop</h1>
          <p>Every frame, every angle — browse the full collection in 3D.</p>
        </div>
      )}

      <div className="container">
      <div className="breadcrumb">
        <a href="/">Home</a>
        <span className="sep">/</span>
        <span>Shop</span>
        {activeCategory && (
          <>
            <span className="sep">/</span>
            <span>{activeCategory.name}</span>
          </>
        )}
      </div>

      <div className="shop-layout" style={{ marginTop: 30 }}>
        {/* Filters */}
        <aside>
          <div className="card filter-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Filters</h3>
              <button className="thin-btn" onClick={() => setSearchParams(new URLSearchParams())} title="Clear filters">
                <X size={15} />
              </button>
            </div>

            <h3>Collection</h3>
            <button
              className={`filter-option ${!category ? 'active' : ''}`}
              onClick={() => updateParam('category', '')}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c._id}
                className={`filter-option ${category === c.slug ? 'active' : ''}`}
                onClick={() => updateParam('category', c.slug)}
              >
                {c.name}
                <span className="count">{c.productCount}</span>
              </button>
            ))}

            <h3>Price</h3>
            {PRICE_RANGES.map((r, i) => (
              <button
                key={r.label}
                className={`filter-option ${rangeIdx === String(i) ? 'active' : ''}`}
                onClick={() => updateParam('price', i === 0 ? '' : String(i))}
              >
                {r.label}
              </button>
            ))}

            <h3>Options</h3>
            <button
              className={`filter-option ${featured ? 'active' : ''}`}
              onClick={() => updateParam('featured', featured ? '' : 'true')}
            >
              Featured only
            </button>
          </div>
        </aside>

        {/* Products */}
        <div>
          <div className="shop-toolbar">
            <div className="toolbar-right" style={{ flex: 1 }}>
              <SearchBar initial={q} size="md" />
              <span className="result">
                {total} {total === 1 ? 'piece' : 'pieces'}
              </span>
            </div>
            <div className="toolbar-right">
              <select value={sort} onChange={(e) => updateParam('sort', e.target.value)} aria-label="Sort products">
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <>
              <ProductGrid products={products} />
              {pages > 1 && (
                <div className="pagination">
                  {Array.from({ length: pages }).map((_, i) => (
                    <button
                      key={i}
                      className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
