import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import CustomerReviews from './CustomerReviews'
import CollectionCta from './CollectionCta'
import SignatureDuo from './SignatureDuo'
import FaqSection from './FaqSection'
import GallerySection from './GallerySection'
import ParallaxStackedSections from './ParallaxStackedSections'
import HowItWorks from './HowItWorks'
import StorageOptions from './StorageOptions'
import VideoSection from './VideoSection'
import ContactSection from './ContactSection'
import { homepageSectionService } from '../services/homepageSectionService'

function DotsButton({ to, children }) {
  return (
    <Link to={to} className="btn-dots">
      <span>{children}</span>
      <span className="dots">
        <i /><i /><i /><i />
      </span>
    </Link>
  )
}

function Section({ section }) {
  const { title, category, buttonLabel, buttonLink, products } = section
  const link = buttonLink || (category?.slug ? `/shop?category=${category.slug}` : '/shop')

  return (
    <section className="lux-frames">
      <span className="lux-bg-text" aria-hidden="true">{title}</span>
      <div className="lux-inner">
        <div className="home-heading lux-heading">
          <h2>{title}</h2>
          <span className="line" />
        </div>

        {products && products.length > 0 ? (
          <div className="product-grid lux-grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} luxury />
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '40px 20px' }}>
            <p style={{ color: 'var(--text-2)' }}>No products in this category yet.</p>
          </div>
        )}

        <div className="lux-actions">
          <DotsButton to={link}>{buttonLabel || 'See More'}</DotsButton>
        </div>
      </div>
    </section>
  )
}

export default function LatestProducts() {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    homepageSectionService
      .getActive()
      .then((res) => {
        const all = res.data.sections || []
        // 'Latest Frames' & 'Latest Goggles' permanently replaced by
        // horizontal sliders — ignore them everywhere
        const removed = new Set(['latest frames', 'latest goggles'])
        setSections(
          all.filter((s) => !removed.has(s.title?.trim().toLowerCase()))
        )
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null

  return (
    <>
      {sections.map((sec) => (
        <Section section={sec} key={sec._id} />
      ))}

      <VideoSection />

      <CustomerReviews />

      <CollectionCta />

      <SignatureDuo />

      <HowItWorks />

      <StorageOptions />

      <ParallaxStackedSections />

      <GallerySection />

      <ContactSection />

      <FaqSection />
    </>
  )
}
