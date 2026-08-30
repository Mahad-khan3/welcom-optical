import PortalHero from '../components/PortalHero'
import PinnedHero from '../components/PinnedHero'
import ProductShowcase from '../components/ProductShowcase'
import BannerSection from '../components/BannerSection'
import HorizontalScrollGallery from '../components/HorizontalScrollGallery'
import FeaturedProduct from '../components/FeaturedProduct'
import ParelexBanner from '../components/ParelexBanner'
import LatestProducts from '../components/LatestProducts'

export default function Home() {
  return (
    <>
      {/* ---------- PORTAL HERO ---------- */}
      <PortalHero />

      {/* ---------- PINNED ZOOM HERO (GSAP + Three.js) ---------- */}
      <PinnedHero />

      {/* ---------- TRY YOUR FRAME ---------- */}
      <ProductShowcase />

      {/* ---------- BANNER (sun glasses) ---------- */}
      <BannerSection />

      {/* ---------- HORIZONTAL SLIDER (primary) ---------- */}
      <HorizontalScrollGallery />

      {/* ---------- DETAIL CARDS ---------- */}
      <FeaturedProduct />

      {/* ---------- BANNER (parelex4) ---------- */}
      <ParelexBanner />

      {/* ---------- HORIZONTAL SLIDER (secondary, responsive) ---------- */}
      <HorizontalScrollGallery placement="secondary" />

      <LatestProducts />
    </>
  )
}