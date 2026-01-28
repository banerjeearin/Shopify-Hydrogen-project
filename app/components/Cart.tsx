import {useState} from 'react';
import {useCart} from '~/lib/cart-context';

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const {cart, isLoading, error, updateItem, removeItem, clearError} = useCart();

  const cartLines = cart?.lines.edges || [];
  const totalQuantity = cart?.totalQuantity || 0;

  const handleUpdateQuantity = async (lineId: string, currentQuantity: number, increment: boolean) => {
    const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;
    if (newQuantity < 1) {
      await removeItem(lineId);
    } else {
      await updateItem(lineId, newQuantity);
    }
  };

  const handleRemove = async (lineId: string) => {
    await removeItem(lineId);
  };

  const handleCheckout = () => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-neutral-700 hover:text-primary-600 transition-colors"
        aria-label="Open cart"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {totalQuantity > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {totalQuantity}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-serif font-bold">Cart</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-500 hover:text-neutral-700"
                  aria-label="Close cart"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {error && (
                <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start justify-between">
                  <p className="text-sm text-red-800">{error}</p>
                  <button
                    onClick={clearError}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Dismiss error"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-6">
                {isLoading && !cart ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : cartLines.length > 0 ? (
                  <div className="space-y-4">
                    {cartLines.map((edge) => {
                      const line = edge.node;
                      const merchandise = line.merchandise;
                      const product = merchandise.product;
                      const image = merchandise.image;

                      return (
                        <div key={line.id} className="flex gap-4">
                          <div className="w-20 h-20 bg-neutral-200 rounded overflow-hidden flex-shrink-0">
                            {image ? (
                              <img
                                src={image.url}
                                alt={image.altText || product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm truncate">{product.title}</h3>
                            <p className="text-sm text-neutral-600 truncate">{merchandise.title}</p>
                            <p className="text-sm font-medium mt-1">
                              {line.cost.totalAmount.amount} {line.cost.totalAmount.currencyCode}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => handleUpdateQuantity(line.id, line.quantity, false)}
                                disabled={isLoading}
                                className="w-8 h-8 border rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span className="min-w-[2rem] text-center">{line.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(line.id, line.quantity, true)}
                                disabled={isLoading}
                                className="w-8 h-8 border rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemove(line.id)}
                            disabled={isLoading}
                            className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed self-start"
                            aria-label="Remove item"
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-neutral-500 py-12">Your cart is empty</p>
                )}
              </div>

              {cart && cartLines.length > 0 && (
                <div className="border-t p-6">
                  <div className="flex justify-between text-xl font-bold mb-4">
                    <span>Total</span>
                    <span>
                      {cart.cost.totalAmount.amount} {cart.cost.totalAmount.currencyCode}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Loading...' : 'Checkout'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

