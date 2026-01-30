import {useLoaderData} from 'react-router';
import type {LoaderFunctionArgs} from 'react-router';
import Layout from '~/components/Layout';
import {useCart} from '~/lib/cart-context';

export async function loader({request}: LoaderFunctionArgs) {
  return {title: 'Shopping Cart'};
}

export default function CartPage() {
  const {cart, isLoading, removeFromCart, updateQuantity} = useCart();

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-48 mx-auto mb-8"></div>
            <div className="h-64 bg-neutral-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!cart || cart.lines.edges.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-xl text-neutral-600 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <a
            href="/products"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Continue Shopping
          </a>
        </div>
      </Layout>
    );
  }

  const subtotal = cart.cost?.subtotalAmount;
  const total = cart.cost?.totalAmount;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.lines.edges.map(({node: line}) => {
              const merchandise = line.merchandise;
              const product = merchandise.product;

              return (
                <div key={line.id} className="flex gap-4 p-4 bg-white rounded-lg shadow">
                  {product.featuredImage && (
                    <img
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText || product.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">
                      <a href={`/products/${product.handle}`} className="hover:text-primary-600">
                        {product.title}
                      </a>
                    </h3>
                    {merchandise.title !== 'Default Title' && (
                      <p className="text-sm text-neutral-600">{merchandise.title}</p>
                    )}
                    <p className="text-primary-600 font-medium">
                      {merchandise.priceV2.currencyCode} {merchandise.priceV2.amount}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() => updateQuantity(line.id, Math.max(0, line.quantity - 1))}
                          className="px-3 py-1 hover:bg-neutral-100"
                        >
                          -
                        </button>
                        <span className="px-3 py-1">{line.quantity}</span>
                        <button
                          onClick={() => updateQuantity(line.id, line.quantity + 1)}
                          className="px-3 py-1 hover:bg-neutral-100"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(line.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {line.cost.totalAmount.currencyCode} {line.cost.totalAmount.amount}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{subtotal?.currencyCode} {subtotal?.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-neutral-600">Calculated at checkout</span>
                </div>
              </div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{total?.currencyCode} {total?.amount}</span>
                </div>
              </div>
              <a
                href={cart.checkoutUrl}
                className="block w-full bg-primary-600 text-white text-center px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Proceed to Checkout
              </a>
              <a
                href="/products"
                className="block w-full text-center mt-4 text-primary-600 hover:text-primary-700"
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
