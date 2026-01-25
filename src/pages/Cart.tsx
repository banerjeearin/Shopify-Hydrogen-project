/**
 * Shopping Cart Page
 * Displays cart items and checkout flow
 */

import { Layout } from '@/components/layout/Layout';

export default function Cart() {
  return (
    <Layout>
      <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-display text-forest mb-12 text-center">
          Your Cart
        </h1>

        <div className="max-w-4xl mx-auto">
          {/* Empty cart state */}
          <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-sage-light flex items-center justify-center">
              <svg
                className="w-12 h-12 text-forest"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-display text-forest mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Discover our premium collection of natural products
            </p>
            <a
              href="/products"
              className="inline-block bg-forest hover:bg-forest-light text-white py-3 px-8 rounded-lg transition-colors duration-300 font-medium"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}
