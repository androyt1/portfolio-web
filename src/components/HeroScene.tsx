import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Float } from '@react-three/drei'
import * as THREE from 'three'

/* ─────────────────────────────────────────────
   OPTIMIZATION: shared geometry — created once,
   reused by every smoke layer (no duplicates in GPU memory)
───────────────────────────────────────────── */
const PLANE_GEO   = new THREE.PlaneGeometry(7, 7, 1, 1)
const DOT_GEO     = new THREE.SphereGeometry(1, 4, 4) // low-poly for instanced particles

/* ─────────────────────────────────────────────
   GLSL — 2D Simplex Noise (Stefan Gustavson)
   Runs entirely on the GPU — zero CPU cost
───────────────────────────────────────────── */
const vertexShader = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */`
  varying vec2 vUv;
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3  uColorA;
  uniform vec3  uColorB;

  /* ── 2D Simplex noise ── */
  vec2 mod289v2(vec2 x){ return x - floor(x*(1./289.))*289.; }
  vec3 mod289v3(vec3 x){ return x - floor(x*(1./289.))*289.; }
  vec3 permute(vec3 x){ return mod289v3(((x*34.)+1.)*x); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.,0.) : vec2(0.,1.);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy  -= i1;
    i = mod289v2(i);
    vec3 p = permute(permute(i.y + vec3(0., i1.y, 1.))
                           + i.x + vec3(0., i1.x, 1.));
    vec3 m = max(0.5 - vec3(dot(x0,x0),
                             dot(x12.xy,x12.xy),
                             dot(x12.zw,x12.zw)), 0.);
    m = m*m; m = m*m;
    vec3 x  = 2.*fract(p * C.www) - 1.;
    vec3 h  = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314*(a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x   + h.x  * x0.y;
    g.yz = a0.yz * x12.xz  + h.yz * x12.yw;
    return 130. * dot(m, g);
  }

  void main() {
    vec2 uv = (vUv - 0.5) * 2.0; // map to -1..1

    /* Multi-octave smoke — each octave adds finer detail */
    float n  = snoise(uv * 1.1 + vec2( uTime * 0.11,  uTime * 0.07));
          n += snoise(uv * 2.3 + vec2(-uTime * 0.08,  uTime * 0.10)) * 0.50;
          n += snoise(uv * 4.7 + vec2( uTime * 0.06, -uTime * 0.06)) * 0.25;
    n = (n / 1.75) * 0.5 + 0.5; // normalise to 0..1

    /* Circular vignette — smoke fades at edges */
    float dist    = length(uv);
    float falloff = 1.0 - smoothstep(0.28, 1.0, dist);

    /* Colour gradient inner→outer */
    vec3 col = mix(uColorA, uColorB, clamp(dist * 1.3, 0.0, 1.0));

    float alpha = clamp(n * falloff * uOpacity, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`

/* ─────────────────────────────────────────────
   SMOKE LAYER
   Each layer is one flat plane tilted in 3D space.
   AdditiveBlending means it ONLY adds light — on a
   dark background it auto-vignettes beautifully.
───────────────────────────────────────────── */
interface SmokeLayerProps {
  rotation   : [number, number, number]
  speed      : number
  opacity    : number
  colorA     : string
  colorB     : string
  scale      : number
}

function SmokeLayer({ rotation, speed, opacity, colorA, colorB, scale }: SmokeLayerProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  // OPTIMIZATION: uniforms created once with useMemo
  const uniforms = useMemo(() => ({
    uTime   : { value: 0 },
    uOpacity: { value: opacity },
    uColorA : { value: new THREE.Color(colorA) },
    uColorB : { value: new THREE.Color(colorB) },
  }), [opacity, colorA, colorB])

  // OPTIMIZATION: only update ONE uniform (uTime) per frame — no re-renders
  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime * speed
  })

  return (
    <mesh geometry={PLANE_GEO} rotation={rotation} scale={[scale, scale, 1]}>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}                   // OPTIMIZATION: skip depth buffer writes
        blending={THREE.AdditiveBlending}    // glows on dark bg, invisible where dark
      />
    </mesh>
  )
}

/* ─────────────────────────────────────────────
   CORE SPHERE
───────────────────────────────────────────── */
function CoreSphere() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.x = clock.elapsedTime * 0.12
    ref.current.rotation.y = clock.elapsedTime * 0.18
  })

  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={ref} castShadow>
        <icosahedronGeometry args={[1.28, 4]} />
        <MeshDistortMaterial
          color="#E84B1A"
          distort={0.36}
          speed={2.1}
          roughness={0.05}
          metalness={0.82}
          transparent
          opacity={0.93}
        />
      </mesh>
    </Float>
  )
}

/* ─────────────────────────────────────────────
   WIREFRAME GHOST (inner shell)
───────────────────────────────────────────── */
function WireframeGhost() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.x = -clock.elapsedTime * 0.07
    ref.current.rotation.y =  clock.elapsedTime * 0.11
  })
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.55, 2]} />
      <meshBasicMaterial color="#EEEBE4" wireframe transparent opacity={0.05} />
    </mesh>
  )
}

/* ─────────────────────────────────────────────
   INSTANCED PARTICLES
   OPTIMIZATION: 180 particles = 1 draw call
   instead of 180 separate draw calls
───────────────────────────────────────────── */
function Particles({ count }: { count: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy   = useMemo(() => new THREE.Object3D(), [])

  // OPTIMIZATION: all random data computed once at mount
  const data = useMemo(() => Array.from({ length: count }, () => ({
    x     : (Math.random() - 0.5) * 9,
    y     : (Math.random() - 0.5) * 9,
    z     : (Math.random() - 0.5) * 3.5,
    speed : Math.random() * 0.18 + 0.06,
    phase : Math.random() * Math.PI * 2,
    size  : Math.random() * 0.013 + 0.005,
  })), [count])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime
    data.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.phase) * 0.3,
        p.y + Math.cos(t * p.speed * 0.8 + p.phase) * 0.22,
        p.z,
      )
      dummy.scale.setScalar(p.size)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[DOT_GEO, undefined, count]}>
      <meshBasicMaterial color="#E84B1A" transparent opacity={0.50} />
    </instancedMesh>
  )
}

/* ─────────────────────────────────────────────
   MOUSE PARALLAX RIG
───────────────────────────────────────────── */
function CameraRig() {
  useFrame(({ camera, pointer }) => {
    camera.position.x += (pointer.x * 0.55 - camera.position.x) * 0.04
    camera.position.y += (pointer.y * 0.32 - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)
  })
  return null
}

/* ─────────────────────────────────────────────
   EXPORTED CANVAS
───────────────────────────────────────────── */
export default function HeroScene() {
  // OPTIMIZATION: detect mobile once at mount — fewer layers + lower DPR
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  // Smoke layer configs — fewer on mobile to save GPU budget
  const smokeLayers: SmokeLayerProps[] = isMobile
    ? [
        { rotation: [0,   0,   0  ], speed: 0.50, opacity: 0.28, colorA: '#E84B1A', colorB: '#2e0a03', scale: 1.1 },
        { rotation: [0.5, 0.8, 0.3], speed: 0.34, opacity: 0.18, colorA: '#cc3e13', colorB: '#190600', scale: 1.35 },
      ]
    : [
        { rotation: [0,   0,   0  ], speed: 0.55, opacity: 0.30, colorA: '#E84B1A', colorB: '#2e0a03', scale: 1.00 },
        { rotation: [0.4, 0.6, 0.2], speed: 0.40, opacity: 0.22, colorA: '#d04215', colorB: '#1d0600', scale: 1.26 },
        { rotation: [0.8, 0.3, 0.6], speed: 0.30, opacity: 0.17, colorA: '#ff6030', colorB: '#250700', scale: 1.46 },
        { rotation: [1.2, 0.9, 0.1], speed: 0.22, opacity: 0.13, colorA: '#b03010', colorB: '#130400', scale: 1.65 },
        { rotation: [0.2, 1.4, 0.8], speed: 0.17, opacity: 0.09, colorA: '#E84B1A', colorB: '#0a0200', scale: 1.85 },
      ]

  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, isMobile ? 1 : 1.5]}   // OPTIMIZATION: cap DPR — huge GPU saving on retina
    >
      <ambientLight intensity={0.18} />
      <directionalLight position={[4, 4, 4]} intensity={1.2} color="#EEEBE4" />
      <pointLight position={[-2, -2, -2]} intensity={1.1} color="#E84B1A" />
      <pointLight position={[3,   3,  2]} intensity={0.4} color="#4FACF7" />

      <CameraRig />

      {/* Smoke layers rendered first (behind everything) */}
      {smokeLayers.map((props, i) => <SmokeLayer key={i} {...props} />)}

      {/* Sphere on top of smoke */}
      <CoreSphere />
      <WireframeGhost />

      {/* Particles floating over everything */}
      <Particles count={isMobile ? 70 : 180} />
    </Canvas>
  )
}

/* ═══════════════════════════════════════════════════════════════
   WANT TO SWAP THE SPHERE FOR A REAL GLTF MODEL?
   ───────────────────────────────────────────────────────────────
   1.  Drop your .glb file into:   public/model.glb

   2.  Replace <CoreSphere /> with:

       import { useGLTF } from '@react-three/drei'

       function MyModel() {
         const { scene } = useGLTF('/model.glb')
         const ref = useRef<THREE.Group>(null)
         useFrame(({ clock }) => {
           if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.3
         })
         return (
           <Float speed={1.4} floatIntensity={0.6}>
             <primitive ref={ref} object={scene} scale={1.5} />
           </Float>
         )
       }

   Good free sources:
     https://sketchfab.com  (filter → Free → download GLB)
     https://poly.pizza     (CC0 licence, no attribution needed)
     https://quaternius.com (game-ready packs)
═══════════════════════════════════════════════════════════════ */
