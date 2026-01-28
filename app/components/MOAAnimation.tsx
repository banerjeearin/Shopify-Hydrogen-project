import {Suspense, useRef} from 'react';
import {Canvas, useFrame} from '@react-three/fiber';
import {Environment, PerspectiveCamera} from '@react-three/drei';

interface MOAAnimationProps {
  title?: string;
  description?: string;
}

function Particle({angle, radius, delay}: {angle: number; radius: number; delay: number}) {
  const meshRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + delay;
      const scale = 1 + Math.sin(time * 2) * 0.2;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
    >
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color="#5ab47e" />
    </mesh>
  );
}

function CellularInteraction() {
  const groupRef = useRef<any>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Cell representation */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#3a9660" transparent opacity={0.7} />
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

export default function MOAAnimation({
  title = 'Mechanism of Action',
  description = 'How our ingredients interact at a cellular level',
}: MOAAnimationProps) {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold mb-4">{title}</h2>
          <p className="text-xl text-neutral-600">{description}</p>
        </div>
        <div className="max-w-4xl mx-auto aspect-video bg-neutral-100 rounded-lg overflow-hidden">
          <Canvas>
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <CellularInteraction />
              <Environment preset="studio" />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  );
}

