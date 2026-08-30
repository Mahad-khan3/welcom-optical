import { useState } from 'react'
import { Plus } from 'lucide-react'

const FAQS = [
  {
    q: 'How do I place an order?',
    a: 'Browse the collection, pick your frame, choose lens options and add it to cart. Checkout takes less than two minutes — cash on delivery and online payment both available.',
  },
  {
    q: 'Do you provide prescription lenses?',
    a: 'Yes. Share your latest prescription at checkout or visit our store for a free eye test, and we will craft lenses perfectly matched to your power.',
  },
  {
    q: 'What is the delivery time?',
    a: 'Orders are delivered within 2–4 working days across Pakistan. You will receive tracking details by SMS as soon as your order ships.',
  },
  {
    q: 'Can I return or exchange my glasses?',
    a: 'Absolutely. We offer a 7-day easy return and exchange policy — the product just needs to be unused and in its original packaging.',
  },
  {
    q: 'Do the sunglasses have UV protection?',
    a: 'All our sunglasses come with certified UV400 protection, blocking 100% of UVA and UVB rays while keeping your vision crisp.',
  },
  {
    q: 'Is there any warranty on frames?',
    a: 'Every frame includes a 6-month manufacturing warranty covering hinges, coating and structural defects — free repairs or replacement.',
  },
]

export default function FaqSection() {
  const [open, setOpen] = useState(null)

  return (
    <section className="faq-section">
      <div className="faq-inner">
        <span className="faq-label">FAQs</span>

        <div className="faq-main">
          <h2 className="faq-title">Everything You Need To Know</h2>

          <div className="faq-list">
            {FAQS.map((item, i) => (
              <div key={i} className={`faq-item ${open === i ? 'open' : ''}`}>
                <button
                  type="button"
                  className="faq-q"
                  aria-expanded={open === i}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span>{item.q}</span>
                  <Plus size={20} strokeWidth={1.75} />
                </button>
                <div className="faq-a">
                  <div className="faq-a-in">
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
