import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { group } from '@react-three/fiber'
import * as THREE from 'three'

export const GlossyObject = ({
  position = [0, 0, 0],
  scale = 1,
  rotationSpeed = 0.15,
  distortIntensity = 0.3,
}) => {
  const meshRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uDistort: { value: 0 },
          uColor1: { value: new THREE.Color(0x0a0a1a) },
          uColor2: { value: new THREE.Color(0x1a1a3e) },
          uColor3: { value: new THREE.Color(0x0f2a4a) },
          uFresnelColor: { value: new THREE.Color(0xfbbf24) },
          uFresnelPower: { value: 3.0 },
          uRoughness: { value: 0.05 },
          uMetalness: { value: 0.95 },
          uEnvMapIntensity: { value: 1.5 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vWorldPosition;
          varying vec3 vViewPosition;
          varying vec2 vUv;
          uniform float uTime;
          uniform float uDistort;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vUv = uv;
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            vec4 viewPosition = viewMatrix * worldPosition;
            vViewPosition = viewPosition.xyz;
            
            float distortFactor = sin(vWorldPosition.y * 4.0 + uTime * 2.5) * uDistort;
            vec3 newPosition = position + normal * distortFactor;
            newPosition.x += sin(vWorldPosition.z * 3.0 + uTime * 1.5) * uDistort * 0.4;
            newPosition.z += cos(vWorldPosition.x * 3.0 + uTime * 1.5) * uDistort * 0.4;
            
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vWorldPosition;
          varying vec3 vViewPosition;
          varying vec2 vUv;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform vec3 uColor3;
          uniform vec3 uFresnelColor;
          uniform float uFresnelPower;
          uniform float uRoughness;
          uniform float uMetalness;
          uniform float uEnvMapIntensity;
          uniform float uTime;
          
          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }
          
          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                       mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
          }
          
          float D_GGX(float NoH, float roughness) {
            float a = roughness * roughness;
            float a2 = a * a;
            float NoH2 = NoH * NoH;
            float denom = (NoH2 * (a2 - 1.0) + 1.0);
            return a2 / (PI * denom * denom);
          }
          
          vec3 F_Schlick(vec3 F0, float VoH) {
            return F0 + (1.0 - F0) * pow(1.0 - VoH, 5.0);
          }
          
          void main() {
            vec3 viewDir = normalize(-vViewPosition);
            float NoV = max(dot(vNormal, viewDir), 0.0);
            
            float fresnel = pow(1.0 - NoV, uFresnelPower);
            
            float gradient = vWorldPosition.y * 0.5 + 0.5;
            vec3 baseColor = mix(uColor1, uColor2, gradient);
            baseColor = mix(baseColor, uColor3, smoothstep(0.2, 0.8, gradient));
            
            float surfaceNoise = noise(vUv * 20.0 + uTime * 0.1) * 0.03;
            baseColor += vec3(surfaceNoise);
            
            vec3 F0 = mix(vec3(0.04), baseColor, uMetalness);
            vec3 halfDir = normalize(viewDir + vec3(0.0, 1.0, 0.0));
            float NoH = max(dot(vNormal, halfDir), 0.0);
            float D = D_GGX(NoH, uRoughness);
            vec3 F = F_Schlick(F0, max(dot(viewDir, halfDir), 0.0));
            
            vec3 metallicReflection = D * F * uEnvMapIntensity * vec3(0.15);
            
            vec3 finalColor = baseColor;
            finalColor = mix(finalColor, uFresnelColor, fresnel * 0.7);
            finalColor += metallicReflection;
            finalColor += uFresnelColor * fresnel * 0.4;
            
            float ss = pow(1.0 - NoV, 2.0) * 0.1;
            finalColor += uColor3 * ss;
            
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `,
        side: THREE.DoubleSide,
      }),
    []
  )

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime()
      
      meshRef.current.rotation.y = time * rotationSpeed
      meshRef.current.rotation.x = Math.sin(time * 0.4) * 0.12
      meshRef.current.rotation.z = Math.cos(time * 0.3) * 0.08
      
      const distortAmount = hovered 
        ? distortIntensity 
        : Math.sin(time * 0.7) * 0.1 + Math.cos(time * 1.1) * 0.05
      
      material.uniforms.uTime.value = time
      material.uniforms.uDistort.value = distortAmount
    }
  })

  return (
    <group
      ref={meshRef}
      position={position}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <icosahedronGeometry args={[1.8, 12]} />
      <primitive object={material} />
    </group>
  )
}