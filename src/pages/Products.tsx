/**
 * Products Listing Page
 * Displays all products with 3D interactive grid
 */

import { Layout } from '@/components/layout/Layout';

export default function Products() {
  return (
    <Layout>
      <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-display text-forest mb-4">
            Our Products
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Premium Unani herbal remedies and organic millet products, crafted with care and backed by tradition.
          </p>
        </div>

        {/* Product Grid will be implemented with 3D hover effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-soft p-6 h-96 flex items-center justify-center">
            <p className="text-muted-foreground">Product Grid Component - Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}
