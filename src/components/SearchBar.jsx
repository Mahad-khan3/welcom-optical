import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

export default function SearchBar({ initial = '', size = 'md' }) {
  const [query, setQuery] = useState(initial)
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <form className="search-box" onSubmit={submit} style={{ width: size === 'lg' ? '100%' : '260px' }}>
      <Search size={17} />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search frames, brands, styles…"
        aria-label="Search"
      />
    </form>
  )
}
