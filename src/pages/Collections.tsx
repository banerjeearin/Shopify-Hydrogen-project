/**
 * Collections Page
 * Browse products by category/collection
 */

import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

export default function Collections() {
  const { handle } = useParams<{ handle: string }>();

  return (
    <Layout>
      <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-display text-forest mb-4">
            {handle ? handle.charAt(0).toUpperCase() + handle.slice(1) : 'All Collections'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collections of wellness products
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {['Herbal Remedies', 'Millet Products', 'Wellness Essentials'].map((collection, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-medium transition-shadow duration-300 cursor-pointer"
            >
              <div className="h-64 bg-gradient-to-br from-sage-light to-cream-dark flex items-center justify-center">
                <p className="text-forest text-xl font-display">Image Coming Soon</p>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-display text-forest mb-2">{collection}</h3>
                <p className="text-muted-foreground">Explore products →</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </Layout>
  );
}
