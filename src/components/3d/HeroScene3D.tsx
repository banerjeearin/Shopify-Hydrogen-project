/**
 * HeroScene3D Component
 * Cinematic 3D hero section with floating product and particle effects
 */

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, Sparkles } from '@react-three/drei';
import { Mesh, Points } from 'three';
import * as THREE from 'three';

/**
 * Floating Product Bottle
 */
function HeroProduct() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.8}
    >
      <mesh ref={meshRef} castShadow>
        {/* Bottle shape */}
        <cylinderGeometry args={[0.6, 0.6, 2, 32]} />
        <meshStandardMaterial
          color="#2d5a3d"
          roughness={0.2}
          metalness={0.3}
          envMapIntensity={1}
        />

        {/* Cap */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.4, 0.6, 0.4, 32]} />
          <meshStandardMaterial color="#1a4d2e" roughness={0.3} metalness={0.5} />
        </mesh>

        {/* Label */}
        <mesh position={[0, 0, 0.61]}>
          <boxGeometry args={[1, 1.2, 0.02]} />
          <meshStandardMaterial
            color="#f9f5e7"
            roughness={0.9}
            emissive="#f9f5e7"
            emissiveIntensity={0.1}
          />
        </mesh>
      </mesh>
    </Float>
  );
}

/**
 * Floating Natural Particles
 * Represents herbs, grains, natural ingredients
 */
function NaturalParticles() {
  const particlesRef = useRef<Points>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const count = 100;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    // Spread particles in a sphere around the product
    const radius = 3 + Math.random() * 2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = (Math.random() - 0.5) * 4;
    positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#75a47f"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface HeroScene3DProps {
  /** Enable interactive controls */
  interactive?: boolean;
  /** Canvas height */
  height?: string;
}

export function HeroScene3D({
  interactive = false,
  height = '600px'
}: HeroScene3DProps) {
  return (
    <div
      className="relative w-full"
      style={{ height }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={60} />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-5, 3, -5]} intensity={0.5} color="#75a47f" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.5}
          penumbra={1}
          intensity={0.5}
          castShadow
        />

        {/* Environment for realistic lighting */}
        <Environment preset="sunset" />

        {/* Fog for depth */}
        <fog attach="fog" args={['#f9f5e7', 5, 15]} />

        {/* Hero Product */}
        <Suspense fallback={null}>
          <HeroProduct />
        </Suspense>

        {/* Natural Particles */}
        <NaturalParticles />

        {/* Sparkles for magical effect */}
        <Sparkles
          count={50}
          scale={8}
          size={2}
          speed={0.3}
          opacity={0.4}
          color="#d4af37"
        />

        {/* Optional interactive controls */}
        {interactive && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.8}
          />
        )}
      </Canvas>

      {/* Overlay gradient for blending */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-cream/80" />
    </div>
  );
}
