import { Component, Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment, Lightformer, useGLTF } from '@react-three/drei'
import { Rotate3d } from 'lucide-react'

export const FRAME_COLORS = [
  { name: 'Obsidian', hex: '#1a1a1a' },
  { name: 'Gold', hex: '#c9a227' },
  { name: 'Silver', hex: '#c9ccd1' },
  { name: 'Tortoise', hex: '#6b4226' },
]

function webglSupported() {
  try {
    const c = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl'))
    )
  } catch {
    return false
  }
}

// ---------------------------------------------------------------
// Procedural glasses built from Three.js primitives (fallback + default)
// ---------------------------------------------------------------
function ProceduralGlasses({ frameColor }) {
  return (
    <group>
      {/* Rims */}
      <mesh position={[-1.05, 0, 0]}>
        <torusGeometry args={[0.62, 0.078, 24, 72]} />
        <meshStandardMaterial color={frameColor} metalness={0.75} roughness={0.3} />
      </mesh>
      <mesh position={[1.05, 0, 0]}>
        <torusGeometry args={[0.62, 0.078, 24, 72]} />
        <meshStandardMaterial color={frameColor} metalness={0.75} roughness={0.3} />
      </mesh>
      {/* Lenses */}
      <mesh position={[-1.05, 0, 0.02]}>
        <circleGeometry args={[0.565, 72]} />
        <meshPhysicalMaterial
          color="#8fa8c4"
          transparent
          opacity={0.55}
          metalness={0.05}
          roughness={0.08}
          side={2}
        />
      </mesh>
      <mesh position={[1.05, 0, 0.02]}>
        <circleGeometry args={[0.565, 72]} />
        <meshPhysicalMaterial
          color="#8fa8c4"
          transparent
          opacity={0.55}
          metalness={0.05}
          roughness={0.08}
          side={2}
        />
      </mesh>
      {/* Brow bridge */}
      <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.5, 0.078, 20, 48, Math.PI]} />
        <meshStandardMaterial color={frameColor} metalness={0.75} roughness={0.3} />
      </mesh>
      {/* Temple arms */}
      <mesh position={[1.62, 0, -0.78]}>
        <boxGeometry args={[0.065, 0.05, 1.55]} />
        <meshStandardMaterial color={frameColor} metalness={0.75} roughness={0.3} />
      </mesh>
      <mesh position={[-1.62, 0, -0.78]}>
        <boxGeometry args={[0.065, 0.05, 1.55]} />
        <meshStandardMaterial color={frameColor} metalness={0.75} roughness={0.3} />
      </mesh>
      {/* Nose pads */}
      <mesh position={[-0.4, -0.42, 0.12]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color={frameColor} metalness={0.75} roughness={0.3} />
      </mesh>
      <mesh position={[0.4, -0.42, 0.12]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color={frameColor} metalness={0.75} roughness={0.3} />
      </mesh>
    </group>
  )
}

// ---------------------------------------------------------------
// GLB model loader — applies frame color to materials named "frame"
// ---------------------------------------------------------------
function GLBGlasses({ modelUrl, frameColor }) {
  const { scene } = useGLTF(modelUrl)

  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => {
          if (m.name === 'frame' && m.color) m.color.set(frameColor)
        })
      } else if (child.material.name === 'frame' && child.material.color) {
        child.material.color.set(frameColor)
      }
    }
  })

  return <primitive object={scene} />
}

useGLTF.preload('/models/glasses.glb')

// ---------------------------------------------------------------
// Error boundary: if GLB fails to load, silently show the procedural model
// ---------------------------------------------------------------
class ModelErrorBoundary extends Component {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return <ProceduralGlasses frameColor={this.props.frameColor} />
    }
    return this.props.children
  }
}

function Model({ modelUrl, frameColor }) {
  const url = modelUrl || '/models/glasses.glb'

  return (
    <ModelErrorBoundary frameColor={frameColor}>
      <Suspense fallback={<ProceduralGlasses frameColor={frameColor} />}>
        <GLBGlasses modelUrl={url} frameColor={frameColor} />
      </Suspense>
    </ModelErrorBoundary>
  )
}

// ---------------------------------------------------------------
// Main 3D product viewer
// ---------------------------------------------------------------
export default function ProductViewer({
  modelUrl = '',
  frameColor = FRAME_COLORS[0].hex,
  onFrameColor,
  autoRotate = true,
  showToolbar = true,
  showSwatches = true,
  height = '100%',
  className = '',
}) {
  const [spin, setSpin] = useState(autoRotate)
  const [glOk] = useState(() => webglSupported())

  if (!glOk) {
    return (
      <div
        className={`product-viewer ${className}`}
        style={{
          height,
          position: 'relative',
          display: 'grid',
          placeItems: 'center',
          minHeight: 220,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            color: 'var(--text)',
            opacity: 0.55,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <Rotate3d size={18} />
          <span>3D viewer requires WebGL</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`product-viewer ${className}`} style={{ height, position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0.35, 4.8], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 4]} intensity={1.1} />
        <directionalLight position={[-5, -2, 3]} intensity={0.35} />
        <spotLight position={[0, 6, 2]} angle={0.45} penumbra={1} intensity={0.6} />

        <Suspense fallback={null}>
          <Model modelUrl={modelUrl} frameColor={frameColor} />
          <ContactShadows position={[0, -2.15, 0]} opacity={0.45} scale={7} blur={2.6} far={3} />
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

        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          autoRotate={spin}
          autoRotateSpeed={1.8}
          minDistance={2.6}
          maxDistance={9}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 1.7}
        />
      </Canvas>

      {showToolbar && (
        <>
          <div className="viewer-hint">
            <Rotate3d size={14} />
            Drag to rotate · Scroll to zoom
          </div>
          <div className="viewer-toolbar">
            {showSwatches && (
              <div className="glass-chip">
                <label>Frame</label>
                {FRAME_COLORS.map((c) => (
                  <button
                    key={c.name}
                    className={`swatch ${frameColor === c.hex ? 'active' : ''}`}
                    style={{ background: c.hex, width: 24, height: 24 }}
                    onClick={() => onFrameColor?.(c.hex)}
                    title={c.name}
                    aria-label={c.name}
                  />
                ))}
              </div>
            )}
            <div className="glass-chip">
              <label>{spin ? 'Auto-rotate' : 'Rotation off'}</label>
              <button
                className="swatch"
                style={{ width: 24, height: 24 }}
                onClick={() => setSpin((s) => !s)}
                title="Toggle auto-rotate"
                aria-label="Toggle auto-rotate"
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
