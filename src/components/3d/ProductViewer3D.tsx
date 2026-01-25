/**
 * ProductViewer3D Component
 * Interactive 360° product viewer with drag-to-rotate functionality
 * Uses Three.js via React Three Fiber
 */

import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { Mesh } from 'three';

interface ProductViewer3DProps {
  /** Enable auto-rotation when idle */
  autoRotate?: boolean;
  /** Auto-rotation speed */
  autoRotateSpeed?: number;
  /** Enable zoom controls */
  enableZoom?: boolean;
  /** Model URL (GLTF/GLB format) - optional for now */
  modelUrl?: string;
  /** Product color for the placeholder */
  productColor?: string;
  /** Canvas height */
  height?: string;
}

/**
 * Placeholder Product Model
 * This is a simple box - replace with actual GLTF model later
 */
function ProductModel({ color = '#2d5a3d' }: { color?: string }) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Gentle floating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.05 : 1}
    >
      {/* Bottle/Product shape - rounded box */}
      <cylinderGeometry args={[0.8, 0.8, 2.5, 32]} />
      <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.2}
        envMapIntensity={0.5}
      />

      {/* Label area */}
      <mesh position={[0, 0, 0.81]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.2, 1, 0.02]} />
        <meshStandardMaterial color="#f9f5e7" roughness={0.8} />
      </mesh>
    </mesh>
  );
}

/**
 * Loading fallback component
 */
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#94a3b8" wireframe />
    </mesh>
  );
}

export function ProductViewer3D({
  autoRotate = true,
  autoRotateSpeed = 0.5,
  enableZoom = true,
  productColor = '#2d5a3d',
  height = '500px',
}: ProductViewer3DProps) {
  return (
    <div
      className="relative w-full rounded-xl overflow-hidden bg-gradient-to-br from-cream to-sage-light shadow-soft"
      style={{ height }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <spotLight
          position={[-5, 5, 5]}
          intensity={0.4}
          angle={0.3}
          penumbra={1}
        />

        {/* Environment for realistic reflections */}
        <Environment preset="city" />

        {/* Product Model */}
        <Suspense fallback={<LoadingFallback />}>
          <ProductModel color={productColor} />
        </Suspense>

        {/* Contact shadows for realism */}
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />

        {/* Interactive controls */}
        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={autoRotateSpeed}
          enableZoom={enableZoom}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          minDistance={3}
          maxDistance={8}
        />
      </Canvas>

      {/* User hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-forest font-medium shadow-soft">
        🖱️ Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}
