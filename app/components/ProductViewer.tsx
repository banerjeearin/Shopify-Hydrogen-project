import {useEffect, useState} from 'react';
import type {ComponentType} from 'react';
import AddToCartButton from './AddToCartButton';
import type {Product} from '~/lib/shopify.types';

interface ProductViewerProps {
  product: Product & {
    model3dUrl?: string;
  };
}

/**
 * SSR-safe wrapper for ProductViewer
 * Dynamically imports the client-only Three.js component after mount
 * This prevents Three.js from being imported during SSR
 */
export default function ProductViewer({product}: ProductViewerProps) {
  const [ClientComponent, setClientComponent] = useState<ComponentType<ProductViewerProps> | null>(null);

  useEffect(() => {
    // Dynamically import the client-only component
    import('./ProductViewer.client').then((module) => {
      setClientComponent(() => module.default);
    });
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden" role="img" aria-label={`3D view of ${product.title}`}>
        {ClientComponent ? (
          <ClientComponent product={product} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            Loading 3D viewer...
          </div>
        )}
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
