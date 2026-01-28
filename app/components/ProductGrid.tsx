import {Link} from 'react-router';
import HoverParallax from './HoverParallax';
import ScrollReveal from './ScrollReveal';
import type {SimpleProduct} from '~/lib/shopify.types';

interface ProductGridProps {
  products?: SimpleProduct[];
}

/**
 * Optimize Shopify image URL with transformations
 * @param url - Original Shopify CDN image URL
 * @param width - Desired width in pixels
 * @returns Optimized image URL
 */
function optimizeShopifyImage(url: string, width: number = 600): string {
  if (!url) return url;

  // Shopify CDN supports URL transformations
  // Format: image_url?width=600&height=600&crop=center
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('shopify.com') || urlObj.hostname.includes('shopifycdn.com')) {
      urlObj.searchParams.set('width', width.toString());
      urlObj.searchParams.set('height', width.toString());
      urlObj.searchParams.set('crop', 'center');
      return urlObj.toString();
    }
  } catch (error) {
    console.error('Error optimizing image URL:', error);
  }

  return url;
}

export default function ProductGrid({products = []}: ProductGridProps) {
  // Placeholder products for demo when no products are provided
  const defaultProducts: SimpleProduct[] = [
    {id: '1', handle: 'product-1', title: 'Product 1', price: '$49.99'},
    {id: '2', handle: 'product-2', title: 'Product 2', price: '$59.99'},
    {id: '3', handle: 'product-3', title: 'Product 3', price: '$69.99'},
    {id: '4', handle: 'product-4', title: 'Product 4', price: '$79.99'},
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;

  return (
    <section className="py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2 className="text-4xl font-serif font-bold text-center mb-12">
            Our Products
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayProducts.map((product, index) => (
            <ScrollReveal key={product.id} delay={index * 0.1} direction="up">
              <Link
                to={`/products/${product.handle}`}
                className="block focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 rounded-lg"
              >
                <HoverParallax className="bg-white rounded-lg overflow-hidden shadow-soft hover:shadow-soft-lg transition-shadow">
                  <div className="aspect-square bg-neutral-200 flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img
                        src={optimizeShopifyImage(product.image, 600)}
                        alt={product.imageAlt || `Image of ${product.title}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        width={600}
                        height={600}
                        onError={(e) => {
                          // Fallback if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className="text-neutral-400 text-center p-4"
                      style={{display: product.image ? 'none' : 'flex'}}
                    >
                      <span>3D Preview</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-primary-600 font-medium text-lg">
                      {product.price}
                    </p>
                  </div>
                </HoverParallax>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

