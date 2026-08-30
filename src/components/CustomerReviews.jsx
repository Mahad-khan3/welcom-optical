import { useEffect, useState } from 'react'

const REVIEWS = [
  {
    name: 'Ahmed Raza',
    text: 'Best optical shop in the city. Frame quality is premium and the staff helped me pick the perfect fit for my face shape.',
  },
  {
    name: 'Fatima Khan',
    text: 'Ordered my blue-light glasses online and they arrived in two days. Packaging was beautiful, feels very luxury.',
  },
  {
    name: 'Bilal Hussain',
    text: 'Lens power bilkul perfect tha, zero distortion. Welcome Optical ne meri poori family ke frames bana diye hain.',
  },
  {
    name: 'Ayesha Siddiqui',
    text: 'The virtual try-on feature is amazing. I could see exactly how the frames looked before buying. Highly recommended!',
  },
  {
    name: 'Usman Tariq',
    text: 'Genuine branded frames at honest prices. Service bohat achi hai aur delivery time par mili. 5 stars well earned.',
  },
  {
    name: 'Zainab Ali',
    text: 'Elegant designs and super comfortable glasses. Wore them all day with zero pressure on the nose. Love them.',
  },
  {
    name: 'Hamza Sheikh',
    text: 'Customer service is top notch — they adjusted my frame for free even months after purchase. Truly professional.',
  },
]

const PAGES = Math.ceil(REVIEWS.length / 2)

function ReviewUnit({ review, offset }) {
  return (
    <div className={`rv-unit ${offset ? 'rv-offset' : ''}`}>
      <div className="rv-name">{review.name}</div>
      <div className="rv-box">
        <div className="rv-stars">★★★★★</div>
        <p className="rv-text">{review.text}</p>
      </div>
    </div>
  )
}

export default function CustomerReviews() {
  const [page, setPage] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setPage((p) => (p + 1) % PAGES), 3000)
    return () => clearInterval(timer)
  }, [])

  const left = REVIEWS[(page * 2) % REVIEWS.length]
  const right = REVIEWS[(page * 2 + 1) % REVIEWS.length]

  return (
    <section className="rv-section">
      <span className="lux-bg-text" aria-hidden="true">Reviews</span>
      <div className="rv-inner">
        <div className="home-heading lux-heading rv-heading">
          <h2>Satisfied Customers Reviews</h2>
          <span className="line" />
        </div>

        <div className="rv-pair" key={page}>
          <ReviewUnit review={left} />
          <ReviewUnit review={right} offset />
        </div>
      </div>
    </section>
  )
}
