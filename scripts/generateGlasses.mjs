// Generates public/models/glasses.glb procedurally using Three.js.
// Run from the frontend folder:  node scripts/generateGlasses.mjs
import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Node has no DOM FileReader — polyfill the bits GLTFExporter needs.
class FileReaderPolyfill {
  result = null
  onloadend = null
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf
      this.onloadend?.()
    })
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = `data:application/octet-stream;base64,${Buffer.from(buf).toString('base64')}`
      this.onloadend?.()
    })
  }
}
globalThis.FileReader = FileReaderPolyfill

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'models')

const FRAME_COLOR = 0x141414
const LENS_COLOR = 0x8fa8c4

function createGlasses() {
  const group = new THREE.Group()

  const frameMat = new THREE.MeshStandardMaterial({
    name: 'frame',
    color: FRAME_COLOR,
    metalness: 0.7,
    roughness: 0.35,
    envMapIntensity: 1,
  })

  const lensMat = new THREE.MeshPhysicalMaterial({
    name: 'lens',
    color: LENS_COLOR,
    transparent: true,
    opacity: 0.55,
    metalness: 0.05,
    roughness: 0.08,
    side: THREE.DoubleSide,
    envMapIntensity: 0.8,
  })

  const rimGeo = new THREE.TorusGeometry(0.62, 0.078, 24, 72)
  const lensGeo = new THREE.CircleGeometry(0.565, 72)

  const leftRim = new THREE.Mesh(rimGeo, frameMat)
  leftRim.name = 'leftRim'
  leftRim.position.set(-1.05, 0, 0)

  const rightRim = new THREE.Mesh(rimGeo, frameMat)
  rightRim.name = 'rightRim'
  rightRim.position.set(1.05, 0, 0)

  const leftLens = new THREE.Mesh(lensGeo, lensMat)
  leftLens.name = 'leftLens'
  leftLens.position.set(-1.05, 0, 0.02)

  const rightLens = new THREE.Mesh(lensGeo, lensMat)
  rightLens.name = 'rightLens'
  rightLens.position.set(1.05, 0, 0.02)

  // Brow bridge (half torus connecting the two rims at the top)
  const bridge = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.078, 20, 48, Math.PI), frameMat)
  bridge.name = 'bridge'
  bridge.position.set(0, 0.5, 0)

  // Temple arms
  const templeGeo = new THREE.BoxGeometry(0.065, 0.05, 1.55)
  const leftTemple = new THREE.Mesh(templeGeo, frameMat)
  leftTemple.name = 'leftTemple'
  leftTemple.position.set(1.62, 0, -0.78)

  const rightTemple = new THREE.Mesh(templeGeo, frameMat)
  rightTemple.name = 'rightTemple'
  rightTemple.position.set(-1.62, 0, -0.78)

  // Nose pads
  const padGeo = new THREE.SphereGeometry(0.055, 16, 16)
  const leftPad = new THREE.Mesh(padGeo, frameMat)
  leftPad.name = 'leftPad'
  leftPad.position.set(-0.4, -0.42, 0.12)

  const rightPad = new THREE.Mesh(padGeo, frameMat)
  rightPad.name = 'rightPad'
  rightPad.position.set(0.4, -0.42, 0.12)

  group.add(
    leftRim,
    rightRim,
    leftLens,
    rightLens,
    bridge,
    leftTemple,
    rightTemple,
    leftPad,
    rightPad
  )

  return group
}

const glasses = createGlasses()
const exporter = new GLTFExporter()

exporter.parse(
  glasses,
  (result) => {
    fs.mkdirSync(outDir, { recursive: true })
    if (result instanceof ArrayBuffer) {
      fs.writeFileSync(path.join(outDir, 'glasses.glb'), Buffer.from(result))
    } else {
      fs.writeFileSync(path.join(outDir, 'glasses.gltf'), JSON.stringify(result, null, 2))
    }
    console.log('OK - glasses model written to', outDir)
  },
  (err) => {
    console.error('Export failed:', err)
    process.exit(1)
  },
  { binary: true }
)
