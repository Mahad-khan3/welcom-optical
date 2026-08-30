import desktopBanner from '../assets/images/Clearlyvision.png'
import mobileBanner from '../assets/images/Clearlyvision mobile.png'

export default function BannerSection() {
  return (
    <section className="home-banner">
      <picture>
        <source media="(max-width: 767px)" srcSet={mobileBanner} />
        <img src={desktopBanner} alt="Welcom Optical banner" loading="lazy" />
      </picture>
    </section>
  )
}
