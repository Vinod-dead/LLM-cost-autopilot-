import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, ContactShadows, OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { GlossyObject } from './GlossyObject'
import { FloatingParticles } from './FloatingParticles'

const HeroScene = () => {
  const { scene } = useThree()

  useFrame((state) => {
    scene.fog.near = 5
    scene.fog.far = 40
  })

  return (
    <>
      <color attach="background" args={['#050508']} />
      <fog attach="fog" args={['#050508', 5, 40]} />

      <Environment
        preset="studio"
        background={false}
        files={['/studio.hdr']}
      />

      <Stars
        radius={80}
        depth={100}
        count={5000}
        saturation={0}
        factor={4}
        color="#fbbf24"
      />

      <FloatingParticles count={1200} radius={30} color="#fbbf24" size={1.5} />

      <FloatingParticles count={400} radius={15} color="#ffffff" size={0.8} />

      <GlossyObject position={[0, 0.8, 0]} scale={1.5} />

      <ContactShadows
        opacity={0.4}
        scale={15}
        blur={3}
        far={15}
        position={[0, -2.5, 0]}
        color="#fbbf24"
      />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        maxZoom={5}
        minZoom={1.5}
        autoRotate={true}
        autoRotateSpeed={0.2}
        enableDamping={true}
        dampingFactor={0.05}
        target={[0, 0.5, 0]}
      />
    </>
  )
}

export const HeroCanvas = () => {
  return (
    <Canvas
      camera={{ position: [0, 1, 10], fov: 40 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      gl={{
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      shadows={false}
    >
      <HeroScene />
    </Canvas>
  )
}