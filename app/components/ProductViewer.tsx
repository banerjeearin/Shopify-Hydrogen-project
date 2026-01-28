import {Suspense, useRef, useEffect} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls, Environment, PerspectiveCamera, useGLTF} from '@react-three/drei';
import AddToCartButton from './AddToCartButton';
import type * as THREE from 'three';
import type {Product} from '~/lib/shopify.types';

interface ProductViewerProps {
  product: Product & {
    model3dUrl?: string;
  };
}

/**
 * 3D Product Model Component
 * Loads GLTF/GLB models if modelUrl is provided, otherwise shows placeholder
 */
function ProductModel({modelUrl}: {modelUrl?: string}) {
  const geometryRef = useRef<THREE.BoxGeometry>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Cleanup Three.js resources
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

  // If 3D model URL is provided, attempt to load GLTF
  // For now using placeholder - full GLTF implementation would use useGLTF
  if (modelUrl) {
    try {
      // TODO: Implement GLTF loading
      // const gltf = useGLTF(modelUrl);
      // return <primitive object={gltf.scene} />;
      console.log('3D model URL provided:', modelUrl);
    } catch (error) {
      console.error('Failed to load 3D model:', error);
    }
  }

  // Fallback to placeholder box
  return (
    <mesh>
      <boxGeometry ref={geometryRef} args={[2, 3, 1]} />
      <meshStandardMaterial ref={materialRef} color="#3a9660" />
    </mesh>
  );
}

export default function ProductViewer({product}: ProductViewerProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden" role="img" aria-label={`3D view of ${product.title}`}>
        <Canvas>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <ProductModel modelUrl={product.model3dUrl} />
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={3}
              maxDistance={10}
              enableDamping
              dampingFactor={0.05}
            />
            <Environment preset="studio" />
          </Suspense>
        </Canvas>
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="text-4xl font-serif font-bold mb-4">{product.title}</h1>
        <p className="text-neutral-600 mb-8">{product.description}</p>
        {product.variants.edges.length > 0 ? (
          <AddToCartButton
            productId={product.id}
            variantId={product.variants.edges[0].node.id}
          />
        ) : (
          <p className="text-red-600">Product not available</p>
        )}
      </div>
    </div>
  );
}
