import {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import type {Cart, CartLineInput} from './shopify.types';
import {createCart, addToCart, updateCartLines, removeFromCart, getCart} from './shopify-fetcher';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  addItem: (merchandiseId: string, quantity: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_ID_KEY = 'shopify_cart_id';

/**
 * Cart Provider Component
 * Manages cart state and provides cart operations to the app
 */
export function CartProvider({children}: {children: ReactNode}) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize cart on mount
  useEffect(() => {
    initializeCart();
  }, []);

  /**
   * Initialize cart from localStorage or create new one
   */
  async function initializeCart() {
    try {
      setIsLoading(true);

      // Check if we have a cart ID in localStorage
      const savedCartId = localStorage.getItem(CART_ID_KEY);

      if (savedCartId) {
        // Try to fetch existing cart
        const existingCart = await getCart(savedCartId);

        if (existingCart) {
          setCart(existingCart);
        } else {
          // Cart not found, create new one
          await createNewCart();
        }
      } else {
        // No saved cart, create new one
        await createNewCart();
      }
    } catch (err) {
      console.error('Error initializing cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize cart');
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Create a new cart
   */
  async function createNewCart() {
    try {
      const newCart = await createCart();
      setCart(newCart);
      localStorage.setItem(CART_ID_KEY, newCart.id);
    } catch (err) {
      console.error('Error creating cart:', err);
      throw err;
    }
  }

  /**
   * Add item to cart
   */
  async function addItem(merchandiseId: string, quantity: number = 1) {
    try {
      setIsLoading(true);
      setError(null);

      let currentCartId = cart?.id;

      // Create cart if it doesn't exist
      if (!currentCartId) {
        await createNewCart();
        currentCartId = cart?.id;
      }

      if (!currentCartId) {
        throw new Error('Failed to get or create cart');
      }

      const lines: CartLineInput[] = [{merchandiseId, quantity}];
      const updatedCart = await addToCart(currentCartId, lines);
      setCart(updatedCart);
    } catch (err) {
      console.error('Error adding item:', err);
      setError(err instanceof Error ? err.message : 'Failed to add item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Update cart line quantity
   */
  async function updateItem(lineId: string, quantity: number) {
    if (!cart?.id) {
      setError('Cart not found');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const lines = [{id: lineId, quantity}];
      const updatedCart = await updateCartLines(cart.id, lines);
      setCart(updatedCart);
    } catch (err) {
      console.error('Error updating item:', err);
      setError(err instanceof Error ? err.message : 'Failed to update item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Remove item from cart
   */
  async function removeItem(lineId: string) {
    if (!cart?.id) {
      setError('Cart not found');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const updatedCart = await removeFromCart(cart.id, [lineId]);
      setCart(updatedCart);
    } catch (err) {
      console.error('Error removing item:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Clear error state
   */
  function clearError() {
    setError(null);
  }

  const value: CartContextType = {
    cart,
    isLoading,
    error,
    addItem,
    updateItem,
    removeItem,
    clearError,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Hook to use cart context
 */
export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
