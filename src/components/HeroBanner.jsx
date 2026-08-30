import bannerDesktop from '../assets/images/sun glasses.jpg'
import bannerMobile from '../assets/images/sun glasses mobile.jpg'

export default function HeroBanner() {
  return (
    <section className="hero-banner">
      <picture>
        <source media="(max-width: 767px)" srcSet={bannerMobile} />
        <img src={bannerDesktop} alt="Welcom Optical" loading="lazy" />
      </picture>
    </section>
  )
}
