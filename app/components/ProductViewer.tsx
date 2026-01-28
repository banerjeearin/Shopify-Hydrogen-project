import {Suspense, useState, useEffect} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls, Environment, PerspectiveCamera} from '@react-three/drei';
import AddToCartButton from './AddToCartButton';

interface ProductViewerProps {
  product: {
    handle: string;
    title: string;
    description: string;
    model3dUrl?: string;
  };
}

function ProductModel({modelUrl}: {modelUrl?: string}) {
  // Placeholder 3D model - will be replaced with actual product model from Shopify
  // In production, load GLTF/GLB from modelUrl
  return (
    <mesh>
      <boxGeometry args={[2, 3, 1]} />
      <meshStandardMaterial color="#3a9660" />
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
        <AddToCartButton
          productId={product.handle}
          variantId={product.handle}
        />
      </div>
    </div>
  );
}
