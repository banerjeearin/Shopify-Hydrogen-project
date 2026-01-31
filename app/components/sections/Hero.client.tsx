import {Suspense, useRef, useEffect} from 'react';
import {Canvas, useFrame} from '@react-three/fiber';
import {Environment, PerspectiveCamera} from '@react-three/drei';
import type * as THREE from 'three';

function FloatingProduct() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.BoxGeometry>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.3;
    }
  });

  // Cleanup Three.js resources to prevent memory leaks
  useEffect(() => {
    return () => {
      if (geometryRef.current) {
        geometryRef.current.dispose();
      }
      if (materialRef.current) {
        materialRef.current.dispose();
      }
    };
  }, []);

  return (
    <mesh ref={meshRef}>
      <boxGeometry ref={geometryRef} args={[2, 3, 1]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#3a9660"
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

/**
 * Client-only Hero component with Three.js
 * This file is dynamically imported only in the browser
 */
export default function HeroClient() {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, 5]} intensity={0.5} />
        <FloatingProduct />
        <Environment preset="sunset" />
      </Suspense>
    </Canvas>
  );
}

