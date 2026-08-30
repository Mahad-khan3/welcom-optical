import productImg from '../assets/images/image-removebg-preview (2).png'

const FEATURES = [
  {
    id: 'frame',
    title: 'Premium Frame',
    desc: 'Lightweight and durable construction designed for everyday comfort and long-lasting style.',
    box: { top: '5%', side: 'left' },
  },
  {
    id: 'lens',
    title: 'Precision Lens',
    desc: 'Crystal-clear lenses designed for visual comfort, clarity and everyday performance.',
    box: { top: '48%', side: 'left' },
  },

  {
    id: 'temple',
    title: 'Flex-Fold Temple',
    desc: 'Precision folding temple designed for smooth movement and compact storage.',
    box: { top: '12%', side: 'right' },
  },
  {
    id: 'bridge',
    title: 'Ergonomic Bridge',
    desc: 'Balanced nose bridge engineered for a secure and comfortable fit all day.',
    box: { top: '58%', side: 'right' },
  },
]

export default function ProductAnatomy() {
  const leftFeatures = FEATURES.filter((f) => f.box.side === 'left')
  const rightFeatures = FEATURES.filter((f) => f.box.side === 'right')

  return (
    <section className="pa-section">
      <div className="pa-wrapper">
        <div className="pa-col pa-col-left">
          {leftFeatures.map((f) => (
            <div key={f.id} className="pa-box">
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="pa-center">
          <div className="pa-glow" />
          <img src={productImg} alt="Welcom Optical" className="pa-img" />
        </div>

        <div className="pa-col pa-col-right">
          {rightFeatures.map((f) => (
            <div key={f.id} className="pa-box">
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
