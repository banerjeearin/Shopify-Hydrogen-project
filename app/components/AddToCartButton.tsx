import {useState} from 'react';

interface AddToCartButtonProps {
  productId: string;
  variantId: string;
  className?: string;
}

export default function AddToCartButton({
  productId,
  variantId,
  className = '',
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Shopify cart API call
      // const response = await fetch('/api/cart/add', {
      //   method: 'POST',
      //   body: JSON.stringify({variantId, quantity: 1}),
      // });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading || added}
      className={`bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label={added ? 'Added to cart' : 'Add to cart'}
    >
      {isLoading ? 'Adding...' : added ? 'Added!' : 'Add to Cart'}
    </button>
  );
}

