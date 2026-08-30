import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment, Lightformer } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

useGLTF.preload('/models/glasses_web.glb')

function ZoomGlasses({ zoomRef }) {
  const group = useRef(null)
  const { scene: glasses } = useGLTF('/models/glasses_web.glb')
  const { camera, size } = useThree()
  const baseZ = useRef(camera.position.z)

  useEffect(() => {
    glasses.traverse((o) => {
      if (o.isMesh && o.material) {
        o.material.color.set('#060606')
        o.material.metalness = 0.9
        o.material.roughness = 0.4
        o.material.envMapIntensity = 1.2
      }
    })
  }, [glasses])

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return

    const p = zoomRef.current
    const isMobile = size.width < 768
    const startScale = isMobile ? 0.3 : 0.42
    const zoomGrow = isMobile ? 0.35 : 0.8
    const dolly = isMobile ? 0.12 : 0.35

    g.rotation.y += delta * 0.6
    g.scale.setScalar(startScale * (1 + p * zoomGrow))
    g.position.y = 0.15 - p * 0.05
    camera.position.z = baseZ.current - p * dolly
  })

  return (
    <group ref={group} position={[0, 0.15, 0]}>
      <primitive object={glasses} />
    </group>
  )
}

export default function PinnedHero() {
  const sectionRef = useRef(null)
  const wrapRef = useRef(null)
  const tlTextRef = useRef(null)
  const brTextRef = useRef(null)
  const zoomRef = useRef(0)

  useEffect(() => {
    // elements OUTSIDE the pinned section must be looked up on document —
    // gsap.context scoping would never find them via selector strings
    const headerEl = document.querySelector('.nd-header')

    const ctx = gsap.context(() => {
      const proxy = { v: 0 }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%',
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      tl.to(
        tlTextRef.current,
        {
          scale: 0.6,
          opacity: 0,
          letterSpacing: '0.34em',
          ease: 'none',
          duration: 0.85,
        },
        0
      )

      tl.to(
        brTextRef.current,
        {
          scale: 0.6,
          opacity: 0,
          letterSpacing: '0.34em',
          ease: 'none',
          duration: 0.85,
        },
        0
      )

      tl.to(
        proxy,
        {
          v: 1,
          ease: 'none',
          duration: 1,
          onUpdate: () => {
            zoomRef.current = proxy.v
          },
        },
        0
      )

      // full-page slide: the whole hero page
      // exits upward while the overlapping next section rises from below
      tl.to(
        wrapRef.current,
        { y: () => -window.innerHeight, ease: 'none', duration: 0.55 },
        '>'
      )

      if (headerEl) {
        tl.to(
          headerEl,
          { y: () => -window.innerHeight, ease: 'none', duration: 0.55 },
          '<'
        )

        // header glides back onto the next "page" — same controller,
        // so it can never fight another tween or vanish at load
        tl.to(
          headerEl,
          { y: 0, ease: 'none', duration: 0.45 },
          '>'
        )
      }
    }, sectionRef)

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      try {
        ctx.revert()
      } catch {
        ctx.kill()
      }
    }
  }, [])

  return (
    <section className="pinned-hero" ref={sectionRef}>
      <div className="ph-wrap" ref={wrapRef}>
        <div className="ph-bg" aria-hidden="true">
          <span className="ph-orb ph-orb-a" />
          <span className="ph-orb ph-orb-b" />
        </div>

        <div className="ph-canvas">
        <Canvas
          camera={{ position: [0, 0.3, 5], fov: 40 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[4, 6, 4]} intensity={1.1} />
          <directionalLight position={[-5, -2, 3]} intensity={0.35} />
          <spotLight position={[0, 6, 2]} angle={0.45} penumbra={1} intensity={0.6} />
          <Suspense fallback={null}>
            <ZoomGlasses zoomRef={zoomRef} />
            <Environment resolution={256}>
              <Lightformer intensity={2} position={[0, 5, -9]} scale={[10, 10, 1]} color="#ffffff" />
              <Lightformer
                intensity={1.4}
                position={[-5, 1, -1]}
                rotation-y={Math.PI / 2}
                scale={[10, 2, 1]}
                color="#e6c45a"
              />
              <Lightformer
                intensity={1.2}
                position={[5, -1, -1]}
                rotation-y={-Math.PI / 2}
                scale={[10, 2, 1]}
                color="#ffffff"
              />
            </Environment>
          </Suspense>
        </Canvas>
        </div>

        <div className="ph-text ph-tl" ref={tlTextRef}>
          <h1>WELCOM</h1>
        </div>

        <div className="ph-text ph-br" ref={brTextRef}>
          <h2>OPTICALS</h2>
        </div>

        <div className="ph-hint">Scroll</div>
      </div>
    </section>
  )
}
