import ProductCard from "@/components/ProductCard";
import productRagi from "@/assets/product-ragi.jpg";
import productJowar from "@/assets/product-jowar.jpg";
import productBajra from "@/assets/product-bajra.jpg";
import productCombo from "@/assets/product-combo.jpg";

const products = [
  {
    id: 1,
    name: "Ragi Flour",
    description: "High fiber, protein-packed finger millet flour. 100% Chakki fresh ground.",
    price: 149,
    originalPrice: 199,
    image: productRagi,
    badge: "Bestseller",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Jowar Flour",
    description: "Premium sorghum flour, perfect for rotis. Low GI and gluten-free.",
    price: 129,
    originalPrice: 179,
    image: productJowar,
    rating: 4.8,
  },
  {
    id: 3,
    name: "Bajra Flour",
    description: "Nutrient-rich pearl millet flour. High in iron and minerals.",
    price: 139,
    originalPrice: 189,
    image: productBajra,
    rating: 4.7,
  },
  {
    id: 4,
    name: "Millet Basket Combo",
    description: "Complete millet experience - 6 varieties in one premium gift box.",
    price: 649,
    originalPrice: 899,
    image: productCombo,
    badge: "Best Value",
    rating: 5.0,
  },
];

const Products = () => {
  return (
    <section id="products" className="py-20 lg:py-32 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-accent font-medium text-sm uppercase tracking-wider mb-4">
            Our Products
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Premium Millet Collection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stone-ground fresh, packed with nutrients, and delivered to your doorstep. 
            Experience the authentic taste of traditional millets.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <a 
            href="#" 
            className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors group"
          >
            View All Products
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Products;
