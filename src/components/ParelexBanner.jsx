import { useEffect, useRef } from 'react'
import desktopBanner from '../assets/images/parelex4.jpg'
import mobileBanner from '../assets/images/mobilparelex4.jpg'

export default function ParelexBanner() {
  const sectionRef = useRef(null)

  // Hide the fixed navbar while this parallax banner section is in view
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const body = document.body
    const io = new IntersectionObserver(
      ([entry]) => {
        body.classList.toggle('parelex-nav', entry.isIntersecting)
      },
      { threshold: 0.05 }
    )
    io.observe(section)
    return () => {
      io.disconnect()
      body.classList.remove('parelex-nav')
    }
  }, [])

  return (
    <section className="home-banner" ref={sectionRef}>
      <picture>
        <source media="(max-width: 767px)" srcSet={mobileBanner} />
        <img src={desktopBanner} alt="Welcom Optical banner" loading="lazy" />
      </picture>
    </section>
  )
}