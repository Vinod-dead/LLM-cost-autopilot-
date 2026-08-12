import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const FloatingParticles = ({
  count = 1000,
  radius = 25,
  color = '#fbbf24',
  size = 1.2,
}) => {
  const pointsRef = useRef(null)
  const positionsRef = useRef()
  const velocitiesRef = useRef()
  const sizesRef = useRef()
  const alphasRef = useRef()

  useEffect(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const alphas = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const r = radius * (0.3 + Math.random() * 0.7)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      velocities[i * 3] = (Math.random() - 0.5) * 0.003
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.003
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003

      sizes[i] = Math.random() * size + 0.3
      alphas[i] = Math.random() * 0.6 + 0.2
    }

    positionsRef.current = positions
    velocitiesRef.current = velocities
    sizesRef.current = sizes
    alphasRef.current = alphas

    if (pointsRef.current) {
      pointsRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      pointsRef.current.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
      pointsRef.current.geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1))
    }
  }, [count, radius, size])

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size,
        transparent: true,
        opacity: 0.8,
        vertexColors: true,
        sizeAttenuation: true,
        color: new THREE.Color(color),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [color, size]
  )

  useFrame((state) => {
    if (!pointsRef.current || !positionsRef.current) return

    const time = state.clock.getElapsedTime()
    const positions = positionsRef.current
    const velocities = velocitiesRef.current
    const sizes = sizesRef.current
    const alphas = alphasRef.current

    for (let i = 0; i < count; i++) {
      positions[i * 3] += velocities[i * 3]
      positions[i * 3 + 1] += velocities[i * 3 + 1]
      positions[i * 3 + 2] += velocities[i * 3 + 2]

      const dist = Math.sqrt(
        positions[i * 3] ** 2 +
        positions[i * 3 + 1] ** 2 +
        positions[i * 3 + 2] ** 2
      )

      if (dist > radius * 1.2) {
        positions[i * 3] *= 0.98
        positions[i * 3 + 1] *= 0.98
        positions[i * 3 + 2] *= 0.98
      }

      sizes[i] = (Math.sin(time * 3 + i * 0.1) * 0.5 + 0.5) * size + 0.2
      alphas[i] = (Math.cos(time * 2 + i * 0.05) * 0.3 + 0.5) * 0.6 + 0.2
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.geometry.attributes.size.needsUpdate = true
    pointsRef.current.geometry.attributes.alpha.needsUpdate = true

    pointsRef.current.rotation.y += 0.00008
    pointsRef.current.rotation.x += 0.00004
    pointsRef.current.rotation.z += 0.00002
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positionsRef.current || new Float32Array(count * 3)} itemSize={3} />
        <bufferAttribute attach="attributes-size" array={sizesRef.current || new Float32Array(count)} itemSize={1} />
        <bufferAttribute attach="attributes-alpha" array={alphasRef.current || new Float32Array(count)} itemSize={1} />
      </bufferGeometry>
      <primitive object={material} />
    </points>
  )
}