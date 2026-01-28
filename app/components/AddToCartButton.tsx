import {useState} from 'react';
import {useCart} from '~/lib/cart-context';

interface AddToCartButtonProps {
  productId: string;
  variantId: string;
  quantity?: number;
  className?: string;
}

export default function AddToCartButton({
  productId,
  variantId,
  quantity = 1,
  className = '',
}: AddToCartButtonProps) {
  const {addItem, isLoading: cartLoading} = useCart();
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async () => {
    try {
      setError(null);
      await addItem(variantId, quantity);

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add to cart';
      setError(errorMessage);
      console.error('Error adding to cart:', err);
    }
  };

  const isDisabled = cartLoading || added;

  return (
    <div className={className}>
      <button
        onClick={handleAddToCart}
        disabled={isDisabled}
        className="w-full bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={added ? 'Added to cart' : 'Add to cart'}
      >
        {cartLoading ? 'Adding...' : added ? 'Added!' : 'Add to Cart'}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

