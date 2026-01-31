import {Suspense, useRef, useEffect} from 'react';
import {Canvas, useFrame} from '@react-three/fiber';
import {Environment, PerspectiveCamera} from '@react-three/drei';
import type * as THREE from 'three';

function Particle({angle, radius, delay}: {angle: number; radius: number; delay: number}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.SphereGeometry>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + delay;
      const scale = 1 + Math.sin(time * 2) * 0.2;
      meshRef.current.scale.set(scale, scale, scale);
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
    <mesh
      ref={meshRef}
      position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
    >
      <sphereGeometry ref={geometryRef} args={[0.2, 16, 16]} />
      <meshStandardMaterial ref={materialRef} color="#5ab47e" />
    </mesh>
  );
}

function CellularInteraction() {
  const groupRef = useRef<THREE.Group>(null);
  const cellGeometryRef = useRef<THREE.SphereGeometry>(null);
  const cellMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  // Cleanup Three.js resources
  useEffect(() => {
    return () => {
      if (cellGeometryRef.current) {
        cellGeometryRef.current.dispose();
      }
      if (cellMaterialRef.current) {
        cellMaterialRef.current.dispose();
      }
    };
  }, []);

  return (
    <group ref={groupRef}>
      {/* Cell representation */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry ref={cellGeometryRef} args={[1, 32, 32]} />
        <meshStandardMaterial
          ref={cellMaterialRef}
          color="#3a9660"
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Ingredient particles */}
      {Array.from({length: 8}).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 2;
        return (
          <Particle key={i} angle={angle} radius={radius} delay={i * 0.2} />
        );
      })}
    </group>
  );
}

/**
 * Client-only MOAAnimation component with Three.js
 * This file is dynamically imported only in the browser
 */
export default function MOAAnimationClient() {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <CellularInteraction />
        <Environment preset="studio" />
      </Suspense>
    </Canvas>
  );
}

