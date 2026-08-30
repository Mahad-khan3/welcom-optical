import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ProductGrid from './ProductGrid'

export default function HomepageProductSection({ section }) {
  if (!section?.products?.length) return null

  const btnLink = section.buttonLink || `/shop?category=${section.category?.slug || ''}`

  return (
    <section className="hs-section">
      <div className="container">
        <div className="hs-header">
          <div>
            <p className="section-kicker">{section.category?.name || 'Collection'}</p>
            <h2 className="section-title">{section.title}</h2>
            {section.subtitle && <p className="section-sub">{section.subtitle}</p>}
          </div>
          <Link to={btnLink} className="btn btn-outline">
            {section.buttonLabel || 'See More'} <ArrowRight size={16} />
          </Link>
        </div>
        <ProductGrid products={section.products} />
      </div>
    </section>
  )
}
