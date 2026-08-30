import { Link } from 'react-router-dom'

const CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    hook: 'Your data is never sold. Ever.',
    updated: 'Last updated: August 2026',
    body: [
      {
        h: 'What we collect',
        p: 'We only collect the information needed to process your order and improve your experience — your name, email, shipping address, and order details. Payment information is processed securely by our payment partners and is never stored on our servers.',
      },
      {
        h: 'How we use it',
        ul: [
          'To fulfil and deliver your orders, including order updates and tracking.',
          'To provide customer support and resolve issues.',
          'To send you updates you have opted into — like new drops and private sales.',
          'To improve our products, website and service through anonymised analytics.',
        ],
      },
      {
        h: 'What we never do',
        ul: [
          'We never sell, rent or trade your personal information.',
          'We never pass your data to third parties for marketing without consent.',
          'We never store full payment card numbers.',
        ],
      },
      {
        h: 'Your rights',
        p: 'You can request a copy of the data we hold, ask us to correct it, or ask us to delete it at any time by contacting our support team. We respond to all requests within 30 days.',
      },
      {
        h: 'Cookies',
        p: 'We use a small number of cookies to keep your cart and session working. These are functional and analytics cookies only — you can disable them in your browser settings, though some features may not work as smoothly.',
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    hook: 'Clear, fair terms for every order.',
    updated: 'Last updated: August 2026',
    body: [
      {
        h: 'Using our store',
        p: 'By browsing or purchasing from Welcom Optical, you agree to these terms. You must be at least 18 years old to place an order, or purchase with the consent of a parent or guardian.',
      },
      {
        h: 'Orders & pricing',
        p: 'All prices are listed in the display currency and may change at any time without notice. We reserve the right to cancel any order where an error in pricing has occurred, and will refund you in full in that case.',
      },
      {
        h: 'Product information',
        p: 'We work hard to make sure product photos and descriptions are accurate. Because screens vary, slight colour differences may occur. All product details, sizes and specifications are provided to help you choose with confidence.',
      },
      {
        h: 'Intellectual property',
        p: 'All content on this site — including frames, imagery, text and branding — is the property of Welcom Optical and may not be reproduced without our written permission.',
      },
      {
        h: 'Liability',
        p: 'Nothing in these terms limits our liability for things that cannot be limited by law. To the fullest extent permitted, we are not liable for indirect or consequential loss arising from use of the site.',
      },
    ],
  },
  shipping: {
    title: 'Shipping Policy',
    hook: 'Fast, trackable delivery to your door.',
    updated: 'Last updated: August 2026',
    body: [
      {
        h: 'Processing time',
        p: 'Every frame is inspected and quality-checked before dispatch. Orders are typically processed and shipped within 24 hours on business days.',
      },
      {
        h: 'Delivery times',
        ul: [
          'Standard shipping: 3–7 business days.',
          'Express shipping: 1–3 business days.',
          'International shipping: 5–14 business days depending on destination.',
        ],
      },
      {
        h: 'Shipping costs',
        p: 'Standard shipping is complimentary on all orders over the threshold shown at checkout. A flat rate applies to smaller orders and is calculated at checkout before you pay — no surprises.',
      },
      {
        h: 'Tracking',
        p: 'A tracking number is emailed to you as soon as your order ships. You can follow your parcel every step of the way from our warehouse to your door.',
      },
      {
        h: 'Delays',
        p: 'In rare cases customs or courier delays can occur. If your order is delayed, our support team will do everything possible to get it to you, and we will keep you updated throughout.',
      },
    ],
  },
  returns: {
    title: 'Return Policy',
    hook: '30 days to fall in love — or send it back.',
    updated: 'Last updated: August 2026',
    body: [
      {
        h: 'Our promise',
        p: 'If your frames are not the perfect fit, you have 30 days from delivery to return them for a full refund or exchange. No fuss, no hassle.',
      },
      {
        h: 'Condition',
        p: 'Items must be returned in their original condition — unworn and with all included materials. Please use the original packaging to protect your frames on the way back.',
      },
      {
        h: 'How to return',
        ul: [
          'Contact our support team with your order number.',
          'Receive a prepaid return label within one business day.',
          'Pack your frames securely and drop them at any partner courier point.',
        ],
      },
      {
        h: 'Refunds',
        p: 'Once we receive and inspect your return, we process refunds to your original payment method within 3–5 business days. Exchanges are dispatched as soon as your return is verified.',
      },
      {
        h: 'Faulty items',
        p: 'If your order arrives damaged or faulty, we will replace or refund it entirely at no cost to you. Just get in touch and we will sort it right away.',
      },
    ],
  },
}

export default function Legal({ type }) {
  const page = CONTENT[type] || CONTENT.terms

  return (
    <div className="legal-page">
      <div className="legal-head">
        <p className="section-kicker">Welcom Optical</p>
        <h1>{page.title}</h1>
        <p>{page.hook}</p>
        <span className="legal-updated">{page.updated}</span>
      </div>

      <div className="legal-card">
        {page.body.map((b, i) => (
          <div key={i}>
            <h2>{b.h}</h2>
            {b.p && <p>{b.p}</p>}
            {b.ul && (
              <ul>
                {b.ul.map((li, j) => (
                  <li key={j}>{li}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <p style={{ marginTop: 34 }}>
          Still have questions?{' '}
          <Link to="/about">Reach out to our team</Link> — we are happy to help.
        </p>
      </div>
    </div>
  )
}
