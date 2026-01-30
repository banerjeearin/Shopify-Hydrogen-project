import {useParams} from 'react-router';
import type {LoaderFunctionArgs} from 'react-router';
import Layout from '~/components/Layout';

export async function loader({params}: LoaderFunctionArgs) {
  const {orderId} = params;
  // In a real implementation, fetch order details
  // This requires customer authentication
  return {orderId};
}

export default function OrderPage() {
  const {orderId} = useParams();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8 text-center">Order Details</h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-xl text-neutral-600 mb-4">
              Order #{orderId}
            </p>
            <p className="text-neutral-500 mb-8">
              Customer accounts are not yet configured. Please contact the store administrator to view your order details.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="/account"
                className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                My Account
              </a>
              <a
                href="/"
                className="inline-block border border-primary-600 text-primary-600 px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors"
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
