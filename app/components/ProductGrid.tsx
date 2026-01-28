import {Link} from 'react-router';
import HoverParallax from './HoverParallax';
import ScrollReveal from './ScrollReveal';

interface Product {
  id: string;
  handle: string;
  title: string;
  price: string;
  image?: string;
}

interface ProductGridProps {
  products?: Product[];
}

export default function ProductGrid({products = []}: ProductGridProps) {
  // Placeholder products for demo
  const defaultProducts: Product[] = [
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
              <Link to={`/products/${product.handle}`}>
                <HoverParallax className="bg-white rounded-lg overflow-hidden shadow-soft hover:shadow-soft-lg transition-shadow">
                  <div className="aspect-square bg-neutral-200 flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-neutral-400">3D Preview</div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                    <p className="text-primary-600 font-medium">{product.price}</p>
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

