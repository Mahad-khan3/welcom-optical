export default function Loading({ full = false, label = 'Loading…' }) {
  return (
    <div className={`loading-screen ${full ? 'full' : ''}`}>
      <div className="inner">
        <div className="loader" />
        <span>{label}</span>
      </div>
    </div>
  )
}
