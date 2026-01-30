import type {LoaderFunctionArgs, ActionFunctionArgs} from 'react-router';
import Layout from '~/components/Layout';

export async function loader({request}: LoaderFunctionArgs) {
  // Check if already logged in and redirect
  return {};
}

export async function action({request}: ActionFunctionArgs) {
  // Handle login form submission
  // This would integrate with Shopify Customer Account API
  return {};
}

export default function LoginPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-8 text-center">Sign In</h1>

          <div className="bg-white rounded-lg shadow p-8">
            <p className="text-neutral-600 mb-6 text-center">
              Customer accounts are not yet configured for this store.
            </p>

            <form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  disabled
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  disabled
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-neutral-400 disabled:cursor-not-allowed"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-neutral-600">
                Don't have an account?{' '}
                <span className="text-neutral-400">Registration coming soon</span>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a href="/" className="text-primary-600 hover:text-primary-700">
              ← Back to Store
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
