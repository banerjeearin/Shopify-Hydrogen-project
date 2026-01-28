import {useState} from 'react';

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  // TODO: Integrate with Shopify cart API
  const cart = {totalQuantity: 0, lines: [], cost: {totalAmount: {amount: '0.00', currencyCode: 'USD'}}};

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
        {cart && cart.totalQuantity > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cart.totalQuantity}
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
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {cart && cart.lines.length > 0 ? (
                  <div className="space-y-4">
                    {cart.lines.map((line: any) => (
                      <div key={line.id} className="flex gap-4">
                        <div className="w-20 h-20 bg-neutral-200 rounded"></div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{line.merchandise.product.title}</h3>
                          <p className="text-sm text-neutral-600">{line.merchandise.title}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => {/* TODO: Update cart */}}
                              className="w-8 h-8 border rounded"
                            >
                              -
                            </button>
                            <span>{line.quantity}</span>
                            <button
                              onClick={() => {/* TODO: Update cart */}}
                              className="w-8 h-8 border rounded"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => {/* TODO: Remove from cart */}}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-neutral-500 py-12">Your cart is empty</p>
                )}
              </div>
              {cart && cart.lines.length > 0 && (
                <div className="border-t p-6">
                  <div className="flex justify-between text-xl font-bold mb-4">
                    <span>Total</span>
                    <span>{cart.cost.totalAmount.amount} {cart.cost.totalAmount.currencyCode}</span>
                  </div>
                  <button className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors">
                    Checkout
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

