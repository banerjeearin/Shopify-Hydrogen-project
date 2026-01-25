/**
 * Product Detail Page
 * Features 360° 3D viewer, MOA animations, and full product information
 */

import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

export default function ProductDetail() {
  const { handle } = useParams<{ handle: string }>();

  return (
    <Layout>
      <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 3D Product Viewer Section */}
          <div className="bg-white rounded-2xl shadow-soft p-8 h-[600px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">360° Product Viewer</p>
              <p className="text-sm text-muted-foreground">Product: {handle}</p>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-display text-forest">
              Product Name
            </h1>
            <p className="text-xl text-muted-foreground">
              Premium Unani herbal formula
            </p>

            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-semibold text-forest">₹499</span>
                <span className="text-lg text-muted-foreground line-through">₹699</span>
              </div>

              <button className="w-full bg-forest hover:bg-forest-light text-white py-4 px-8 rounded-lg transition-colors duration-300 font-medium">
                Add to Cart
              </button>
            </div>

            {/* MOA Animation Section */}
            <div className="border-t border-border pt-6">
              <h3 className="text-xl font-display text-forest mb-4">How It Works</h3>
              <div className="bg-white rounded-xl shadow-soft p-6 h-64 flex items-center justify-center">
                <p className="text-muted-foreground">MOA 3D Animation - Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}
