import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('Route crashed:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '60vh',
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
            padding: '40px 20px',
          }}
        >
          <div>
            <h1 style={{ fontSize: 28, marginBottom: 10 }}>Something went wrong</h1>
            <p style={{ color: 'var(--text-2)', marginBottom: 22, fontSize: 14.5 }}>
              Is page ko load karne mein masla aaya. Dobara koshish karein.
            </p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
