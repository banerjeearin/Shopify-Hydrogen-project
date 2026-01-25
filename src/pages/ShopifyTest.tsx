/**
 * Shopify Connection Test Page
 * Tests Storefront API connection and displays products
 */

import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';

interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
}

export default function ShopifyTest() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/api/${import.meta.env.VITE_SHOPIFY_API_VERSION}/graphql.json`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
            },
            body: JSON.stringify({
              query: `
                {
                  products(first: 10) {
                    edges {
                      node {
                        id
                        title
                        description
                        handle
                      }
                    }
                  }
                }
              `,
            }),
          }
        );

        const data = await response.json();

        if (data.errors) {
          setError(JSON.stringify(data.errors, null, 2));
        } else {
          const productData = data.data.products.edges.map((edge: any) => edge.node);
          setProducts(productData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-cream py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-display text-forest mb-8 text-center">
            Shopify Connection Test
          </h1>

          <div className="max-w-4xl mx-auto">
            {/* Connection Status */}
            <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
              <h2 className="text-2xl font-display text-forest mb-4">Connection Status</h2>
              <div className="space-y-2 font-mono text-sm">
                <p><strong>Store:</strong> {import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}</p>
                <p><strong>API Version:</strong> {import.meta.env.VITE_SHOPIFY_API_VERSION}</p>
                <p><strong>Token:</strong> {import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN ? '✅ Configured' : '❌ Missing'}</p>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-xl shadow-soft p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-display text-red-800 mb-2">❌ Error</h3>
                <pre className="text-sm text-red-600 overflow-auto">{error}</pre>
              </div>
            )}

            {/* Success State */}
            {!loading && !error && products.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-display text-green-800 mb-2">
                  ✅ Connection Successful!
                </h3>
                <p className="text-green-600">Found {products.length} products in your store.</p>
              </div>
            )}

            {/* Products List */}
            {!loading && products.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-display text-forest mb-4">Your Products</h2>
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-soft p-6">
                    <h3 className="text-xl font-display text-forest mb-2">{product.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">Handle: {product.handle}</p>
                    <p className="text-muted-foreground line-clamp-2">
                      {product.description || 'No description'}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* No Products */}
            {!loading && !error && products.length === 0 && (
              <div className="bg-white rounded-xl shadow-soft p-8 text-center">
                <p className="text-muted-foreground">
                  No products found. Add some products to your Shopify store first.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
