import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { horizontalSliderService } from '../services/horizontalSliderService'
import { formatCurrency, discountPercent } from '../utils/format'

gsap.registerPlugin(ScrollTrigger)

export default function HorizontalScrollGallery({ placement = 'primary' }) {
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const trackRef = useRef(null)
  const [slider, setSlider] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let alive = true
    horizontalSliderService
      .get(placement)
      .then((res) => {
        if (alive) setSlider(res.data.slider || null)
      })
      .catch(() => {})
      .finally(() => alive && setLoaded(true))
    return () => {
      alive = false
    }
  }, [placement])

  useLayoutEffect(() => {
    if (!slider?.products?.length || !trackRef.current) return

    let ctx
    let resizeHandler
    let loadHandler
    let timer
    const settleTimers = []

    // Safety: wait one frame + small timeout so DOM widths settle
    // before ScrollTrigger calculates pin distances.
    const raf = requestAnimationFrame(() => {
      timer = setTimeout(() => {
        ctx = gsap.context(() => {
          const track = trackRef.current
          const right = track?.parentElement
          if (!track || !right) return

          const base = Math.max(1, track.scrollWidth - right.clientWidth)

          gsap.to(track, {
            x: -base,
            ease: 'none',
            scrollTrigger: {
              trigger: pinRef.current,
              start: 'top top',
              end: () => '+=' + base,
              scrub: true,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })
        }, sectionRef)

        resizeHandler = () => ScrollTrigger.refresh()
        window.addEventListener('resize', resizeHandler)

        // Async content above (showcase, banners) can change page height
        // after this trigger was created — re-measure once it has settled.
        loadHandler = () => ScrollTrigger.refresh()
        window.addEventListener('load', loadHandler)

        settleTimers.push(
          setTimeout(() => ScrollTrigger.refresh(), 400),
          setTimeout(() => ScrollTrigger.refresh(), 1200)
        )
      }, 50)
    })

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
      settleTimers.forEach(clearTimeout)
      window.removeEventListener('resize', resizeHandler)
      window.removeEventListener('load', loadHandler)
      if (ctx) {
        try { ctx.revert() } catch { ctx.kill() }
      }
    }
  }, [slider])

  // Hide the fixed navbar while this pinned horizontal-slider section is in view
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const body = document.body
    const io = new IntersectionObserver(
      ([entry]) => {
        body.classList.toggle('nav-hidden', entry.isIntersecting)
      },
      { threshold: 0.05 }
    )
    io.observe(section)
    return () => {
      io.disconnect()
      body.classList.remove('nav-hidden')
    }
  }, [slider])

  if (!loaded) return null
  const products = slider?.products || []
  if (!products.length) return null

  const catSlug = slider.category?.slug
  const catName = slider.category?.name

  return (
    <section className="hsg-section" ref={sectionRef}>
      <div className="hsg-pin" ref={pinRef}>
        <div className="hsg-left">
          <span className="lux-eyebrow hsg-eyebrow">
            {slider.eyebrow || 'Curated Moments'}
          </span>
          <h2>{slider.title || 'Experience Welcom'}</h2>
          {catSlug && (
            <Link
              to={placement === 'primary' ? '/premium-glasses' : `/shop?category=${catSlug}`}
              className="hsg-link hsg-link-btn"
            >
              Explore {catName}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>

        <div className="hsg-right">
          <div className="hsg-track" ref={trackRef}>
            {products.length ? (
              products.map((p) => {
                const discount = discountPercent(p.price, p.compareAtPrice)
                return (
                  <div className="hsg-slide hsg-product" key={p._id}>
                    <Link to={`/product/${p._id}`} className="hsg-pcard">
                      <div className="hsg-pimg">
                        {discount > 0 && <span className="badge">-{discount}%</span>}
                        {p.images?.[0] ? (
                          <>
                            <img src={p.images[0]} alt={p.name} loading="lazy" />
                            {p.images?.[1] && (
                              <img className="hsg-alt-img" src={p.images[1]} alt="" loading="lazy" />
                            )}
                          </>
                        ) : (
                          <div className="hsg-pimg-empty">
                            <Box size={42} />
                          </div>
                        )}
                        <span className="hsg-pvideo">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                          View Product
                        </span>
                      </div>
                      <div className="hsg-pbody">
                        <span className="hsg-pname">{p.name}</span>
                        <div className="hsg-pprice-row">
                          <span className="hsg-pprice">{formatCurrency(p.price)}</span>
                          {p.compareAtPrice > p.price && (
                            <span className="hsg-pcompare">{formatCurrency(p.compareAtPrice)}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })
            ) : (
              <div className="hsg-empty">
                {slider?.category?.name
                  ? `"${slider.category.name}" me abhi koi product nahi.`
                  : 'Is section me abhi koi category select nahi ki gayi.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}