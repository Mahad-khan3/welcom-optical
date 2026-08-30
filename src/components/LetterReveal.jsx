import { useEffect, useRef, useState } from 'react'

export function LetterReveal({ as: Tag = 'div', lines = [], className = '', style = {}, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  let letterIndex = 0

  return (
    <Tag ref={ref} className={className} style={style}>
      {lines.map((line, li) => {
        const text = typeof line === 'string' ? line : line.text
        const lineClass = typeof line === 'object' && line.className ? line.className : ''
        return (
          <span key={li} className={`block ${lineClass}`}>
            {text.split('').map((ch, ci) => {
              const i = letterIndex++
              return (
                <span
                  key={ci}
                  className="inline-block whitespace-pre opacity-0"
                  style={{
                    transform: visible ? 'translateY(0)' : 'translateY(0.6em)',
                    opacity: visible ? 1 : 0,
                    filter: visible ? 'blur(0)' : 'blur(6px)',
                    transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay + i * 0.02}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay + i * 0.02}s, filter 0.7s cubic-bezier(0.22,1,0.36,1) ${delay + i * 0.02}s`,
                  }}
                >
                  {ch}
                </span>
              )
            })}
          </span>
        )
      })}
    </Tag>
  )
}

export default LetterReveal
