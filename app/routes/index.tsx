import {lazy, Suspense} from 'react';
import {useLoaderData} from 'react-router';
import type {LoaderFunctionArgs} from 'react-router';
import Layout from '~/components/Layout';
import ProductGrid from '~/components/ProductGrid';
import ScrollReveal from '~/components/ScrollReveal';
import type {SimpleProduct} from '~/lib/shopify.types';

// Lazy load heavy 3D components to improve initial page load
const Hero = lazy(() => import('~/components/sections/Hero'));
const MOAAnimation = lazy(() => import('~/components/MOAAnimation'));

interface LoaderData {
  products: SimpleProduct[];
}

export async function loader({}: LoaderFunctionArgs): Promise<LoaderData> {
  // For now, return empty data - components should handle missing data gracefully
  // In the future, you can fetch featured products here
  return {
    products: [],
  };
}

/**
 * Loading fallback for 3D components
 */
function Loading3D({height = 'h-screen'}: {height?: string}) {
  return (
    <div
      className={`${height} bg-gradient-to-b from-neutral-50 to-white flex items-center justify-center`}
    >
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-neutral-600">Loading 3D Experience...</p>
      </div>
    </div>
  );
}

export default function Index() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <Layout>
      {/* Lazy load Hero section with 3D animation */}
      <Suspense fallback={<Loading3D height="h-screen" />}>
        <Hero />
      </Suspense>

      {/* Product grid - not lazy loaded as it's critical content */}
      <ScrollReveal>
        <ProductGrid products={products} />
      </ScrollReveal>

      {/* Lazy load MOA Animation section */}
      <Suspense fallback={<Loading3D height="h-96" />}>
        <MOAAnimation
          title="How Our Ingredients Work"
          description="Experience the mechanism of action at a cellular level"
        />
      </Suspense>
    </Layout>
  );
}
