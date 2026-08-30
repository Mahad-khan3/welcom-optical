import { useEffect, useRef, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { LetterReveal } from './LetterReveal'
import { horizontalSliderService } from '../services/horizontalSliderService'
import visionImg from '../images/Vision Redefined.png'
import visionImgMobile from '../assets/images/Vision Redefined mobile .png'
import newOutlook from '../assets/images/the new outlok.png'
import newOutlookMobile from '../assets/images/The New Outlook mobile.png'
import ownYourLook from '../assets/images/own your look (1).png'
import ownYourLookMobile from '../assets/images/Own Your Look mobile.png'
import parelex4 from '../assets/images/parelex4.jpg'
import mobilParelex from '../assets/images/mobilparelex4.jpg'

const FONT = '"SF Pro Display", Arial, sans-serif'

const SECTIONS = [
  { id: 'pb', label: 'PB', number: '01', gradient: 'linear-gradient(135deg, #0c0c13, #16161f 55%, #1e1b12)', img: visionImg, imgMobile: visionImgMobile },
  { id: 'go', label: 'GO', number: '02', gradient: 'linear-gradient(135deg, #17171f, #22222c 55%, #28282d)', img: newOutlook, imgMobile: newOutlookMobile },
  { id: 'cb', label: 'CB', number: '03', gradient: 'linear-gradient(135deg, #8f6ba8, #6260dc)', img: ownYourLook, imgMobile: ownYourLookMobile },
  { id: 'ax', label: 'AX', number: '04', gradient: 'linear-gradient(135deg, #16161d, #24242c)', img: parelex4, imgMobile: mobilParelex },
]

function IntroHeader() {
  const [cta, setCta] = useState(null)

  useEffect(() => {
    let alive = true
    horizontalSliderService
      .get('cta')
      .then((res) => {
        if (alive) setCta(res.data.slider || null)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  const ctaSlug = cta?.active && cta?.category?.slug ? cta.category.slug : ''
  const ctaLink = ctaSlug ? `/shop/category/${ctaSlug}` : cta?.category?.slug ? `/shop?category=${cta.category.slug}` : '/shop'

  return (
    <section
      className="relative z-0 flex w-full flex-col items-start justify-center bg-white px-6 py-16 dark:bg-[#0a0a0a] md:px-12 md:py-20 lg:px-16 xl:px-20"
      style={{ height: '100vh', minHeight: '100vh' }}
    >
      <div className="mb-6 w-full border-t border-black/10 dark:border-white/15 md:mb-8" />
      <div className="flex w-full flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-12">
        <div className="flex w-full items-start gap-5 md:w-auto md:min-w-0">
          <div className="max-w-2xl pl-12 md:min-w-0 md:pl-16">
            <LetterReveal
              as="h1"
              className="font-display tracking-tight text-[rgb(2,1,8)] dark:text-white"
              style={{
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: 'clamp(32px, 4.2vw, 52px)',
                lineHeight: 'clamp(30px, 4vw, 49px)',
                fontStyle: 'normal',
                margin: 0,
              }}
              lines={[
                'From full storage',
                { text: 'to free space in four steps.', className: 'text-black/40 dark:text-white/40' },
              ]}
            />
          </div>
        </div>
        <Link to={ctaLink} className="cta-btn cta-btn--sm" style={{ marginTop: 6, marginRight: 32, flexShrink: 0 }} aria-label={`Explore the ${cta?.category?.name || ''} collection`}>
            <span className="cta-dots">
              <i /><i /><i />
              <i /><i /><i />
              <i /><i /><i />
            </span>
          </Link>
      </div>
    </section>
  )
}

export function ParallaxStackedSections() {
  const innerRefs = useRef([])
  const outerRefs = useRef([])

  const setInnerRef = useCallback((i) => (el) => {
    innerRefs.current[i] = el
  }, [])

  const setOuterRef = useCallback((i) => (el) => {
    outerRefs.current[i] = el
  }, [])

  useEffect(() => {
    const SCALE_MIN = 0.78
    const TILT_MAX = 4
    const OPACITY_MIN = 0.4
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          for (let i = 0; i < SECTIONS.length - 1; i++) {
            const outer = outerRefs.current[i]
            const nextSection = outerRefs.current[i + 1]
            if (!outer || !nextSection) continue

            const nextRect = nextSection.getBoundingClientRect()
            const vh = window.innerHeight
            const progress = Math.max(0, Math.min(1, 1 - nextRect.top / vh))

            const scale = 1 - (1 - SCALE_MIN) * progress
            const rotateX = TILT_MAX * progress
            const opacity = 1 - (1 - OPACITY_MIN) * progress

            outer.style.transform = `perspective(1200px) rotateX(${rotateX}deg) scale(${scale})`
            outer.style.opacity = String(opacity)
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('touchmove', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchmove', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <>
      <IntroHeader />
      <div className="relative w-full" style={{ height: SECTIONS.length * 100 + 'vh' }}>
        {SECTIONS.map((data, i) => (
          <section
            key={data.id}
            ref={setOuterRef(i)}
            className="relative w-full overflow-hidden"
            style={{
              position: 'sticky',
              top: 0,
              zIndex: i + 1,
              height: '100vh',
              minHeight: '100vh',
              background: data.gradient,
              transformOrigin: 'top center',
              willChange: 'transform, opacity',
            }}
          >
            {/* Full-width banner image — mobile apni image, desktop apni */}
            <picture>
              <source media="(max-width: 767px)" srcSet={data.imgMobile} />
              <img
                src={data.img}
                alt=""
                draggable={false}
                className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
              />
            </picture>

            <div
              ref={setInnerRef(i)}
              className="relative z-10 flex h-full flex-col px-6 py-8 transition-transform duration-100 ease-out md:px-12 md:py-10 lg:px-16 xl:px-20"
              style={{ willChange: 'transform', transformOrigin: 'center top' }}
            >
              {/* Top row: label center, number right */}
              <div className="relative flex items-start justify-between">
                <div className="flex-1" />
                <span className="absolute left-1/2 -translate-x-1/2 text-xs font-medium uppercase tracking-widest text-white/60 md:text-sm">
                  ({data.label})
                </span>
                <span
                  className="text-3xl font-light leading-none text-white/40 md:text-5xl lg:text-6xl"
                  style={{ fontFamily: FONT }}
                >
                  {data.number}
                </span>
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  )
}

export default ParallaxStackedSections
