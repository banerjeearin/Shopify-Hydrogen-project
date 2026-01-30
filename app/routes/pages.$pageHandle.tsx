import {useLoaderData, useRouteError, isRouteErrorResponse} from 'react-router';
import type {LoaderFunctionArgs} from 'react-router';
import Layout from '~/components/Layout';
import {getStorefrontApiUrl, getPublicTokenHeaders, isShopifyConfigured} from '~/lib/shopify.server';
import {PAGE_QUERY} from '~/lib/shopify-queries';

interface LoaderData {
  page: {
    id: string;
    title: string;
    handle: string;
    body: string;
    bodySummary: string;
    seo: {
      title: string | null;
      description: string | null;
    };
  };
}

export async function loader({params}: LoaderFunctionArgs): Promise<LoaderData> {
  const {pageHandle} = params;

  if (!pageHandle) {
    throw new Response('Page not found', {status: 404});
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
      body: JSON.stringify({
        query: PAGE_QUERY,
        variables: {handle: pageHandle},
      }),
    });

    const json = await response.json();

    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      throw new Response('Failed to load page', {status: 500});
    }

    const page = json.data.page;

    if (!page) {
      throw new Response('Page not found', {status: 404});
    }

    return {page};
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Error fetching page:', error);
    throw new Response('Failed to load page', {status: 500});
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

export default function PageRoute() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-8 text-center">{page.title}</h1>
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{__html: page.body}}
          />
        </article>
      </div>
    </Layout>
  );
}
