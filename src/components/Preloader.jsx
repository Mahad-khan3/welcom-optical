import { useEffect, useRef, useState } from 'react'
import { safeGet, safeSet } from '../utils/storage'

import photoSun from '../assets/images/sun glasses.jpg'
import photoHero from '../assets/images/1hero.jpg'
import photoOutlook from '../assets/images/the new outlok.png'
import photoParelex from '../assets/images/parelex4.jpg'

const PHOTO_SOURCES = [photoSun, photoHero, photoOutlook, photoParelex]

const LINE_AT = 700
const ROTATE_AT = 1500
const SHIFT_AT = 2300
const PHOTO_SWAP_MS = 250
const PHOTO_KEEP_LAST_MS = 500
const FADE_MS = 600
const MAX_MS = 7000
const KEY = 'welcom_preloader_seen'

function Preloader({ onDone }) {
  const [visible, setVisible] = useState(true)
  const [phase, setPhase] = useState('idle')
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)
  const [gone, setGone] = useState(false)
  const intervalRef = useRef(null)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    const path = window.location.pathname
    const seen = safeGet(KEY)
    const shouldPlay = !seen || path === '/'
    if (!shouldPlay) {
      onDoneRef.current?.()
      setGone(true)
      return
    }
    setVisible(true)
  }, [])

  const finish = () => {
    clearInterval(intervalRef.current)
    safeSet(KEY, '1')
    document.body.style.overflow = ''
    setGone(true)
    onDoneRef.current?.()
  }

  useEffect(() => {
    if (visible !== true) return

    document.body.style.overflow = 'hidden'

    const lineT = setTimeout(() => setPhase('line'), LINE_AT)
    const rotT = setTimeout(() => setPhase('rotate'), ROTATE_AT)
    const shiftT = setTimeout(() => {
      setPhase('shift')
      intervalRef.current = setInterval(() => {
        setActive((i) => {
          if (i >= PHOTO_SOURCES.length - 1) {
            clearInterval(intervalRef.current)
            setTimeout(() => setFading(true), PHOTO_KEEP_LAST_MS)
            return i
          }
          return i + 1
        })
      }, PHOTO_SWAP_MS)
    }, SHIFT_AT)
    const safetyT = setTimeout(finish, MAX_MS)

    return () => {
      clearTimeout(lineT)
      clearTimeout(rotT)
      clearTimeout(shiftT)
      clearTimeout(safetyT)
      clearInterval(intervalRef.current)
      document.body.style.overflow = ''
    }
  }, [visible])

  useEffect(() => {
    if (!fading) return
    const t = setTimeout(finish, FADE_MS)
    return () => clearTimeout(t)
  }, [fading])

  if (visible !== true || gone) return null

  const lastIdx = PHOTO_SOURCES.length - 1

  return (
    <div className={`pl-overlay ${fading ? 'pl-fade' : ''}`}>
      <div className={`pl-flex ${phase === 'shift' ? 'pl-shift' : ''}`}>
        <div className="pl-brand">
          <div className="pl-logo-box">
            <span className="pl-logo-dot" />
            <span>W</span>
          </div>
          <span className="pl-brand-text">Welcom Optical</span>
        </div>
        <div
          className={[
            'pl-line',
            phase === 'idle' ? '' : 'pl-line-grow',
            phase === 'rotate' || phase === 'shift' ? 'pl-line-vt' : '',
          ].join(' ')}
        />
      </div>

      <div className={`pl-photostack ${phase === 'shift' ? 'pl-photostack-in' : ''}`}>
        {PHOTO_SOURCES.map((src, i) => {
          let cls = 'pl-photo'
          if (i === active) cls += ' active'
          else if (i === active - 1 || (active === 0 && i === lastIdx)) cls += ' displaced'
          else cls += ' idling'
          return <img key={i} src={src} alt="" className={cls} draggable={false} />
        })}
      </div>
    </div>
  )
}

export default Preloader
