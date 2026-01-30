import type {LoaderFunctionArgs} from 'react-router';
import Layout from '~/components/Layout';

export async function loader({request}: LoaderFunctionArgs) {
  // In a real implementation, check for customer session
  // For now, redirect to login if not authenticated
  return {};
}

export default function AccountPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8 text-center">My Account</h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-xl text-neutral-600 mb-6">
              Customer accounts are not yet configured for this store.
            </p>
            <p className="text-neutral-500 mb-8">
              Please contact the store administrator or check back later.
            </p>
            <a
              href="/"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
