import {Suspense, useRef, useEffect} from 'react';
import {Canvas, useFrame} from '@react-three/fiber';
import {Environment, PerspectiveCamera} from '@react-three/drei';
import {motion} from 'framer-motion';
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

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-neutral-50 to-white">
      <div className="absolute inset-0 z-0">
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
      </div>
      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8}}
          className="text-6xl md:text-8xl font-serif font-bold text-neutral-900 mb-6"
        >
          Liimra
        </motion.h1>
        <motion.p
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8, delay: 0.2}}
          className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-2xl mx-auto"
        >
          Premium healthcare products with innovative 3D experiences
        </motion.p>
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8, delay: 0.4}}
        >
          <button className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-primary-700 transition-colors shadow-soft-lg">
            Explore Products
          </button>
        </motion.div>
      </div>
    </section>
  );
}

