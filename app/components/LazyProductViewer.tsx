import {Suspense, lazy} from 'react';

const ProductViewer = lazy(() => import('./ProductViewer'));

interface LazyProductViewerProps {
  product: {
    handle: string;
    title: string;
    description: string;
  };
}

export default function LazyProductViewer({product}: LazyProductViewerProps) {
  return (
    <Suspense
      fallback={
        <div className="aspect-square bg-neutral-100 rounded-lg flex items-center justify-center">
          <div className="text-neutral-400">Loading 3D model...</div>
        </div>
      }
    >
      <ProductViewer product={product} />
    </Suspense>
  );
}

