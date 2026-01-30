import {useLoaderData, useRouteError, isRouteErrorResponse} from 'react-router';
import type {LoaderFunctionArgs} from 'react-router';
import Layout from '~/components/Layout';
import {getStorefrontApiUrl, getPublicTokenHeaders, isShopifyConfigured} from '~/lib/shopify.server';
import {POLICIES_QUERY} from '~/lib/shopify-queries';

interface Policy {
  id: string;
  title: string;
  handle: string;
  body: string;
}

interface LoaderData {
  policy: Policy;
}

export async function loader({params}: LoaderFunctionArgs): Promise<LoaderData> {
  const {policyHandle} = params;

  if (!policyHandle) {
    throw new Response('Policy not found', {status: 404});
  }

  if (!isShopifyConfigured()) {
    throw new Response('Store not configured', {status: 500});
  }

  try {
    const response = await fetch(getStorefrontApiUrl(), {
      method: 'POST',
      headers: {
        ...getPublicTokenHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query: POLICIES_QUERY}),
    });

    const json = await response.json();

    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      throw new Response('Failed to load policy', {status: 500});
    }

    const shop = json.data.shop;

    // Map handle to policy field
    const policyMap: Record<string, Policy | null> = {
      'privacy-policy': shop.privacyPolicy,
      'refund-policy': shop.refundPolicy,
      'shipping-policy': shop.shippingPolicy,
      'terms-of-service': shop.termsOfService,
    };

    const policy = policyMap[policyHandle];

    if (!policy) {
      throw new Response('Policy not found', {status: 404});
    }

    return {policy};
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Error fetching policy:', error);
    throw new Response('Failed to load policy', {status: 500});
  }
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-serif font-bold mb-4 text-red-600">
          {isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : 'Error'}
        </h1>
        <p className="text-xl text-neutral-600 mb-8">
          {isRouteErrorResponse(error) ? error.data : 'Something went wrong'}
        </p>
        <a
          href="/"
          className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Go Home
        </a>
      </div>
    </Layout>
  );
}

export default function PolicyPage() {
  const {policy} = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-8 text-center">{policy.title}</h1>
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{__html: policy.body}}
          />
        </article>
      </div>
    </Layout>
  );
}
